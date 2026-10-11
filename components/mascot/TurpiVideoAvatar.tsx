"use client";

import { useRef, useState, useEffect } from "react";
import { Sparkles, Play, RotateCcw } from "lucide-react";

interface TurpiVideoAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  autoPlay?: boolean;
  showAudioControls?: boolean;
  loop?: boolean;
}

export default function TurpiVideoAvatar({
  className = "",
  size = "md",
  autoPlay = true,
  showAudioControls = false,
  loop = false,
}: TurpiVideoAvatarProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;

    // Set video to play with sound by default
    video.muted = false;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If browser policy blocks autoplay with sound before user gesture,
          // play with sound as soon as user clicks anywhere on the page
          const playWithSoundOnGesture = () => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(() => {});
              setIsPlaying(true);
              setHasEnded(false);
            }
            window.removeEventListener("click", playWithSoundOnGesture);
            window.removeEventListener("touchstart", playWithSoundOnGesture);
          };

          window.addEventListener("click", playWithSoundOnGesture, { once: true });
          window.addEventListener("touchstart", playWithSoundOnGesture, { once: true });

          // Start muted so it doesn't stay frozen on first render
          video.muted = true;
          video.play().catch(() => {});
        });
    }
  }, [autoPlay]);

  const handleEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
  };

  const handleCardClick = () => {
    if (!videoRef.current) return;
    // Always play with sound on click
    videoRef.current.muted = false;

    if (hasEnded || !isPlaying) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setHasEnded(false);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const sizeClasses = {
    sm: "w-16 h-16 rounded-2xl",
    md: "w-28 h-28 rounded-3xl",
    lg: "w-44 h-44 rounded-3xl",
    hero: "w-full max-w-sm aspect-video rounded-3xl",
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative overflow-hidden cursor-pointer shadow-lg border-3 border-amber-300/90 bg-neutral-900 group select-none ${sizeClasses[size]} ${className}`}
      title={hasEnded ? "Toca para repetir animación con sonido" : "Toca para pausar o repetir"}
    >
      <video
        ref={videoRef}
        src="/video.mp4"
        autoPlay={autoPlay}
        loop={loop}
        playsInline
        onEnded={handleEnded}
        className="w-full h-full object-cover"
      />

      {/* Ambient Cyber Light Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Subtle Turpi Badge in Corner */}
      <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-xs text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-black uppercase tracking-wider pointer-events-none">
        <Sparkles className="w-2.5 h-2.5 fill-current" />
        <span>Turpi 3D</span>
      </div>

      {/* Replay indicator when animation has finished once */}
      {hasEnded && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white/90 p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform">
            <RotateCcw className="w-4 h-4 text-neutral-900" />
          </div>
        </div>
      )}

      {/* Play indicator when manually paused */}
      {!isPlaying && !hasEnded && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white/90 p-2.5 rounded-full shadow-lg">
            <Play className="w-4 h-4 text-neutral-900 fill-current ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
}
