"use client";

import { useRef, useState, useEffect } from "react";
import { formatDuration } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => setCurrentTime(Math.floor(video.currentTime));
    const onDuration = () => setDuration(Math.floor(video.duration));
    const onEnded = () => setPlaying(false);

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onDuration);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onDuration);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Number(e.target.value);
  }

  function changeVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video) return;
    const val = Number(e.target.value);
    video.volume = val;
    setVolume(val);
    setMuted(val === 0);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function toggleFullscreen() {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="video-player-video"
        onClick={togglePlay}
        playsInline
      />
      {!playing && (
        <button className="video-player-big-play" onClick={togglePlay} aria-label="Play">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" fill="rgba(0,0,0,0.6)" stroke="white" strokeWidth="2" />
            <polygon points="26,20 46,32 26,44" fill="white" />
          </svg>
        </button>
      )}
      <div className="video-player-controls">
        <button className="video-player-btn" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
          {playing ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="4" y="3" width="4" height="14" rx="1" />
              <rect x="12" y="3" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <polygon points="5,3 17,10 5,17" />
            </svg>
          )}
        </button>
        <span className="video-player-time">{formatDuration(currentTime)}</span>
        <div className="video-player-progress">
          <div className="video-player-progress-bar" style={{ width: `${progress}%` }} />
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={seek}
            className="video-player-seek"
            aria-label="Seek"
          />
        </div>
        <span className="video-player-time">{formatDuration(duration)}</span>
        <button className="video-player-btn" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 7h3l4-4v14l-4-4H3V7z" />
              <line x1="14" y1="7" x2="18" y2="13" stroke="currentColor" strokeWidth="2" />
              <line x1="18" y1="7" x2="14" y2="13" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 7h3l4-4v14l-4-4H3V7z" />
              <path d="M14 6a5 5 0 010 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          onChange={changeVolume}
          className="video-player-volume"
          aria-label="Volume"
        />
        <button className="video-player-btn" onClick={toggleFullscreen} aria-label="Fullscreen">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            {fullscreen ? (
              <>
                <polyline points="6,2 6,6 2,6" />
                <polyline points="14,2 14,6 18,6" />
                <polyline points="6,18 6,14 2,14" />
                <polyline points="14,18 14,14 18,14" />
              </>
            ) : (
              <>
                <polyline points="2,6 2,2 6,2" />
                <polyline points="18,6 18,2 14,2" />
                <polyline points="2,14 2,18 6,18" />
                <polyline points="18,14 18,18 14,18" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
