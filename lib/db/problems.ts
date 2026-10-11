import fs from "fs/promises";
import path from "path";

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

const DATA_DIR = path.join(process.cwd(), "data");
const PROBLEMS_FILE = path.join(DATA_DIR, "problems.json");

// Ensure data directory and file exist
async function ensureDbExists(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(PROBLEMS_FILE);
    } catch {
      // Create with initial seed structure
      await fs.writeFile(PROBLEMS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Error initializing problems DB:", err);
  }
}

export async function getAllProblems(): Promise<ProblemSubmission[]> {
  await ensureDbExists();
  try {
    const content = await fs.readFile(PROBLEMS_FILE, "utf-8");
    return JSON.parse(content) as ProblemSubmission[];
  } catch (err) {
    console.error("Error reading problems DB:", err);
    return [];
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
  await fs.writeFile(PROBLEMS_FILE, JSON.stringify(updated, null, 2), "utf-8");

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
  await fs.writeFile(PROBLEMS_FILE, JSON.stringify(existing, null, 2), "utf-8");
  return true;
}
