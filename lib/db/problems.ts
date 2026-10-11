import fs from "fs/promises";
import path from "path";
import os from "os";

export interface ProblemSubmission {
  id: string;
  createdAt: string;
  persona: "liceo" | "comercio" | "oficio" | "ciudadano" | "otro";
  rubroTitle: string;
  problemDescription: string;
  timeOrMoneyLost?: string;
  desiredSolution?: string;
  contact?: string;
  aiGeneratedPrompt?: string;
  status: "nuevo" | "en_estudio" | "oportunidad_saas" | "contactado";
  tags: string[];
}

const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL ? path.join(os.tmpdir(), "resuelveia-data") : path.join(process.cwd(), "data");
const PROBLEMS_FILE = path.join(DATA_DIR, "problems.json");
const SEED_FILE = path.join(process.cwd(), "data", "problems.json");

// In-memory fallback
let inMemoryFallback: ProblemSubmission[] = [];

// Ensure data directory and file exist
async function ensureDbExists(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(PROBLEMS_FILE);
    } catch {
      let initialData: ProblemSubmission[] = [];
      try {
        const seedContent = await fs.readFile(SEED_FILE, "utf-8");
        initialData = JSON.parse(seedContent);
      } catch {
        initialData = [];
      }
      await fs.writeFile(PROBLEMS_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Storage notice: Using memory/tmp storage fallback on Vercel:", err);
  }
}

export async function getAllProblems(): Promise<ProblemSubmission[]> {
  await ensureDbExists();
  try {
    const content = await fs.readFile(PROBLEMS_FILE, "utf-8");
    const parsed = JSON.parse(content) as ProblemSubmission[];
    // Merge any memory-fallback submissions
    const ids = new Set(parsed.map((p) => p.id));
    const extra = inMemoryFallback.filter((p) => !ids.has(p.id));
    return [...extra, ...parsed];
  } catch {
    return inMemoryFallback;
  }
}

export async function saveProblem(
  data: Omit<ProblemSubmission, "id" | "createdAt" | "status">
): Promise<ProblemSubmission> {
  await ensureDbExists();
  const existing = await getAllProblems();

  const newEntry: ProblemSubmission = {
    id: `prob_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "nuevo",
    ...data,
  };

  const updated = [newEntry, ...existing];
  inMemoryFallback = updated;

  try {
    await fs.writeFile(PROBLEMS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist to disk on Vercel lambda, kept in memory store:", err);
  }

  return newEntry;
}

export async function updateProblemStatus(
  id: string,
  status: ProblemSubmission["status"]
): Promise<boolean> {
  await ensureDbExists();
  const existing = await getAllProblems();
  const index = existing.findIndex((p) => p.id === id);

  if (index === -1) return false;

  existing[index].status = status;
  inMemoryFallback = existing;

  try {
    await fs.writeFile(PROBLEMS_FILE, JSON.stringify(existing, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist update to disk, updated in memory store:", err);
  }
  return true;
}
