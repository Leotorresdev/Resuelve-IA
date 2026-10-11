"use client";

import { useState, useEffect } from "react";
import Header from "@/components/shell/Header";
import BottomNav, { NavTab } from "@/components/shell/BottomNav";
import LevelMap from "@/components/home/LevelMap";
import PathSelector from "@/components/home/PathSelector";
import LessonModal from "@/components/lesson/LessonModal";
import ArenaTab from "@/components/tabs/ArenaTab";
import LabTab from "@/components/tabs/LabTab";
import ProfileTab from "@/components/tabs/ProfileTab";
import StoreTab from "@/components/tabs/StoreTab";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import SeoContent from "@/components/seo/SeoContent";
import ProblemRadarModal from "@/components/radar/ProblemRadarModal";
import { Lesson } from "@/lib/data/lessonsData";
import { useUserStore } from "@/lib/store";

export default function Home() {
  const store = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavTab>("learn");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isPathSelectorOpen, setIsPathSelectorOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fbf9f8] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#58cc02] border-t-transparent animate-spin" />
      </div>
    );
  }

  // If user hasn't completed the Duolingo onboarding steps, show onboarding flow!
  if (!store.isOnboarded) {
    return <OnboardingFlow onComplete={() => setCurrentTab("learn")} />;
  }

  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col justify-between selection:bg-[#58cc02]/20">
      {/* Top Header */}
      <Header
        onOpenStore={() => setCurrentTab("store")}
        onOpenPathSelector={() => setIsPathSelectorOpen(true)}
      />

      {/* Main Tab Router */}
      <main className="flex-1 w-full">
        {currentTab === "learn" && (
          <LevelMap
            onStartLesson={(lesson) => setActiveLesson(lesson)}
            onOpenRadar={() => setIsRadarOpen(true)}
          />
        )}

        {currentTab === "arena" && (
          <ArenaTab onStartLesson={(lesson) => setActiveLesson(lesson)} />
        )}

        {currentTab === "lab" && <LabTab />}

        {currentTab === "profile" && <ProfileTab />}

        {currentTab === "store" && <StoreTab />}

        {/* Semantic Crawlable SEO Footer & FAQs */}
        <SeoContent />
      </main>

      {/* Bottom Fixed Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Fullscreen Interactive Lesson Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
        />
      )}

      {/* Path Selector Modal */}
      <PathSelector
        isOpen={isPathSelectorOpen}
        onClose={() => setIsPathSelectorOpen(false)}
      />

      {/* Problem Radar Modal */}
      <ProblemRadarModal
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
      />
    </div>
  );
}
