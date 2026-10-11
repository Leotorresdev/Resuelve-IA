"use client";

import { useState } from "react";
import { X, CheckCircle, AlertCircle, Heart } from "lucide-react";
import { Lesson } from "@/lib/data/lessonsData";
import { useUserStore } from "@/lib/store";
import PromptBattle from "./PromptBattle";
import PromptPuzzle from "./PromptPuzzle";
import HallucinationDetector from "./HallucinationDetector";
import LiveGeminiLab from "./LiveGeminiLab";
import LessonCelebration from "./LessonCelebration";
import TurpiVoiceButton from "@/components/mascot/TurpiVoiceButton";
import { sounds } from "@/lib/soundEffects";

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
}

export default function LessonModal({ lesson, onClose }: LessonModalProps) {
  const store = useUserStore();

  const [step, setStep] = useState<"exercise" | "celebration">("exercise");
  const [answerState, setAnswerState] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  const handleAnswer = (isCorrect: boolean, explanation: string) => {
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
      store.loseHeart();
    }
    setAnswerState({
      submitted: true,
      isCorrect,
      explanation,
    });
  };

  const handleContinueAfterFeedback = () => {
    if (!answerState) return;

    if (answerState.isCorrect) {
      sounds.playCelebration();
      store.completeLesson(lesson.id, lesson.xpReward, lesson.gemsReward);
      setStep("celebration");
    } else {
      // Allow user to retry
      setAnswerState(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#fbf9f8] flex flex-col justify-between overflow-y-auto">
      {/* Top Header & Progress Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-[#e5e5e5] px-4 py-3 z-20">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-[#777777] hover:text-[#1b1c1c] p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5px]" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 bg-[#efeded] h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-[#58cc02] h-full rounded-full transition-all duration-500"
              style={{
                width: step === "celebration" ? "100%" : answerState?.submitted ? "85%" : "40%",
              }}
            />
          </div>

          {/* Hearts counter in lesson */}
          <div className="flex items-center gap-1 font-black text-xs text-[#ff4b4b] bg-rose-50 px-2 py-1 rounded-full border border-rose-200">
            <Heart className="w-3.5 h-3.5 fill-[#ff4b4b]" />
            <span>{store.isPro ? "∞" : store.hearts}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-xl w-full mx-auto p-4 pb-36">
        {step === "celebration" ? (
          <LessonCelebration
            xpEarned={lesson.xpReward}
            gemsEarned={lesson.gemsReward}
            streak={store.streak}
            onFinish={onClose}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#58cc02] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {lesson.title.split(":")[0]}
                </span>
                {lesson.turpiAdvice && (
                  <TurpiVoiceButton textToSpeak={lesson.turpiAdvice} size="sm" />
                )}
              </div>
              <h1 className="text-xl font-black text-[#1b1c1c] mt-1.5">
                {lesson.title.includes(":") ? lesson.title.split(":")[1].trim() : lesson.title}
              </h1>
              <p className="text-xs text-[#777777] font-semibold mt-0.5">
                {lesson.subtitle}
              </p>
            </div>

            {/* Render Specific Exercise by Type */}
            {lesson.type === "battle" && lesson.battleData && (
              <PromptBattle
                scenario={lesson.battleData.scenario}
                targetAi={lesson.battleData.targetAi}
                optionA={lesson.battleData.optionA}
                optionB={lesson.battleData.optionB}
                turpiTip={lesson.battleData.turpiTip}
                onAnswerSelected={handleAnswer}
                disabled={answerState?.submitted}
              />
            )}

            {lesson.type === "puzzle" && lesson.puzzleData && (
              <PromptPuzzle
                goal={lesson.puzzleData.goal}
                formula={lesson.puzzleData.formula}
                availableBlocks={lesson.puzzleData.availableBlocks}
                correctOrderIds={lesson.puzzleData.correctOrderIds}
                turpiTip={lesson.puzzleData.turpiTip}
                onAnswerChecked={handleAnswer}
                disabled={answerState?.submitted}
              />
            )}

            {lesson.type === "hallucination" && lesson.hallucinationData && (
              <HallucinationDetector
                topic={lesson.hallucinationData.topic}
                aiResponseSnippet={lesson.hallucinationData.aiResponseSnippet}
                sentences={lesson.hallucinationData.sentences}
                turpiTip={lesson.hallucinationData.turpiTip}
                onSentenceSelected={handleAnswer}
                disabled={answerState?.submitted}
              />
            )}

            {lesson.type === "lab" && lesson.labData && (
              <LiveGeminiLab
                mission={lesson.labData.mission}
                starterPrompt={lesson.labData.starterPrompt}
                requiredElements={lesson.labData.requiredElements}
                successCriteria={lesson.labData.successCriteria}
                onEvaluationCompleted={handleAnswer}
                disabled={answerState?.submitted}
              />
            )}
          </div>
        )}
      </div>

      {/* Bottom Sheet Feedback Drawer */}
      {answerState?.submitted && step === "exercise" && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-40 p-4 border-t-2 shadow-2xl animate-in slide-in-from-bottom duration-200 ${
            answerState.isCorrect
              ? "bg-[#d7ffb8] border-[#58cc02] text-[#1f5100]"
              : "bg-[#ffdfe0] border-[#ff4b4b] text-[#991b1b]"
          }`}
        >
          <div className="max-w-xl mx-auto space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {answerState.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-[#58cc02] fill-[#58cc02] text-white" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-[#ff4b4b] fill-[#ff4b4b] text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-base font-black">
                    {answerState.isCorrect ? "¡Excelente respuesta!" : "Casi lo logras"}
                  </h4>
                  <TurpiVoiceButton textToSpeak={answerState.explanation} size="sm" />
                </div>
                <p className="text-xs font-bold leading-relaxed mt-0.5">
                  {answerState.explanation}
                </p>
              </div>
            </div>

            <button
              onClick={handleContinueAfterFeedback}
              className={`w-full py-3.5 rounded-2xl text-base font-black uppercase tracking-wider shadow-md transition-all ${
                answerState.isCorrect ? "btn-3d-green" : "btn-3d-red"
              }`}
            >
              {answerState.isCorrect ? "CONTINUAR" : "REINTENTAR"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
