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
import SoftAuthModal from "@/components/auth/SoftAuthModal";
import BountiesTab from "@/components/tabs/BountiesTab";
import WalletModal from "@/components/wallet/WalletModal";
import { Lesson } from "@/lib/data/lessonsData";
import { useUserStore } from "@/lib/store";

export default function Home() {
  const store = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavTab>("learn");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isPathSelectorOpen, setIsPathSelectorOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isSoftAuthOpen, setIsSoftAuthOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCloseLesson = () => {
    setActiveLesson(null);
    // Soft registration wall after lesson 1 if user hasn't registered yet
    if (
      store.completedLessons.length >= 1 &&
      !store.isAuthRegistered &&
      !store.hasShownPostLesson1Modal
    ) {
      setTimeout(() => {
        setIsSoftAuthOpen(true);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col justify-between selection:bg-[#58cc02]/20">
      {/* Top Header */}
      <Header
        onOpenStore={() => setCurrentTab("store")}
        onOpenPathSelector={() => setIsPathSelectorOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
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

        {currentTab === "bounties" && (
          <BountiesTab onOpenWallet={() => setIsWalletOpen(true)} />
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
          onClose={handleCloseLesson}
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

      {/* Soft Auth Modal (Post Lesson 1) */}
      <SoftAuthModal
        isOpen={isSoftAuthOpen}
        onClose={() => setIsSoftAuthOpen(false)}
      />

      {/* Wallet & Checkout Modal (Dual Balances, Visa/Mastercard, Earnings) */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />

      {/* First-time Onboarding Flow Overlay (Value Before Signup) */}
      {mounted && !store.isOnboarded && (
        <OnboardingFlow onComplete={() => setCurrentTab("learn")} />
      )}
    </div>
  );
}
