import React, { useRef, useState, useEffect } from 'react';
import HlsVideo from './HlsVideo';

// Helper to detect Safari (not Chrome on iOS/macOS)
const isSafari = () => {
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome|Chromium|Android/.test(ua);
};

export default function PlayToggleVideo({
  src,
  wrapperClassName = 'media media--video',
  videoClassName = '',
  loop = true,
  muted = true,
  onRequestPlay,
  forcePause = false,
  preload = 'metadata', // Allow override, defaults to 'metadata' for backward compatibility
  onError,
  onLoadedData,
  ...rest
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const warmedUpSrcRef = useRef(null);
  const warmingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src]); // Re-attach listeners when src changes

  useEffect(() => {
    if (!forcePause) return;

    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
    }
    setIsPlaying(false);
  }, [forcePause]);

  // Safari-only warmup: show preview frame without autoplaying
  // Runs only once per src, before user plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    if (!isSafari()) return;

    // Only warm up once per src
    if (warmedUpSrcRef.current === src) return;
    warmedUpSrcRef.current = src;

    // Prevent double warmups
    if (warmingRef.current) return;
    warmingRef.current = true;

    const originalMuted = video.muted;
    const originalVolume = video.volume;

    // Safari preview-frame trick:
    // play very briefly while muted so Safari decodes & paints a frame
    const cleanupWarmup = () => {
      warmingRef.current = false;
      // restore original settings (muted prop might be false for normal playback)
      video.muted = originalMuted;
      video.volume = originalVolume;
    };

    const onCanPlay = async () => {
      try {
        // Ensure autoplay is allowed for warmup
        video.muted = true;
        video.volume = 0;

        // Seek slightly forward so we don't sit at a black 0-frame for HLS
        try { video.currentTime = 0.05; } catch {}

        // Start playback briefly to force a decoded frame
        await video.play();

        // Pause ASAP after a tick so at least one frame is painted
        setTimeout(() => {
          try { video.pause(); } catch {}
          cleanupWarmup();
        }, 120);
      } catch {
        cleanupWarmup();
      }
    };

    // We need canplay (or loadeddata) so Safari has enough buffered to render
    video.addEventListener('canplay', onCanPlay, { once: true });

    // Force load/metadata
    try {
      video.preload = 'auto';
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.load();
    } catch {}

    return () => {
      try { video.removeEventListener('canplay', onCanPlay); } catch {}
      cleanupWarmup();
    };
  }, [src]);

  const handleToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      // Inform parent that THIS instance is about to play
      if (onRequestPlay) {
        onRequestPlay();
      }

      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If play fails (e.g. browser restriction), keep paused
          setIsPlaying(false);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleError = (e) => {
    if (onError) {
      onError(e);
    } else if (src && src.includes('vo-video')) {
      // Optional dev logging for Vonix videos
      console.error('Vonix video failed to load', src, e);
    }
  };

  const handleLoadedData = () => {
    if (onLoadedData) {
      onLoadedData();
    } else if (src && src.includes('vo-video')) {
      // Optional dev logging for Vonix videos
      console.log('Vonix video loaded', src);
    }
  };

  // Determine video type from extension
  const getVideoType = (videoSrc) => {
    if (videoSrc.endsWith('.mp4')) return 'video/mp4';
    if (videoSrc.endsWith('.webm')) return 'video/webm';
    return 'video/mp4'; // default
  };

  const isHLS = src && src.endsWith('.m3u8');

  const videoProps = {
    ref: videoRef,
    loop,
    muted,
    playsInline: true,
    preload,
    controls: false,
    disableRemotePlayback: true,
    disablePictureInPicture: true,
    controlsList: "nodownload noplaybackrate noremoteplayback",
    className: videoClassName,
    onError: handleError,
    onLoadedData: handleLoadedData,
    ...rest,
  };

  return (
    <div
      className={`${wrapperClassName} is-playable`.trim()}
      onClick={handleToggle}
    >
      {isHLS ? (
        <HlsVideo
          src={src}
          {...videoProps}
        />
      ) : (
        <video {...videoProps}>
          <source src={src} type={getVideoType(src)} />
        </video>
      )}
      {!isPlaying && (
        <div className="playOverlay">
          <span className="playOverlay__icon" />
        </div>
      )}
    </div>
  );
}

