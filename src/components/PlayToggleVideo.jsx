import React, { useRef, useState, useEffect } from 'react';
import HlsVideo from './HlsVideo';

// Helper to detect Safari (not Chrome on iOS/macOS)
const isSafari = () => {
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome|Chromium|Android/.test(ua);
};

export default function PlayToggleVideo({
  src,
  allowAutoplay = false,
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
  const userInitiatedRef = useRef(false);

  // Initialize video: always start paused unless allowAutoplay is true
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Always disable autoplay and pause first
    video.autoplay = false;
    video.pause();

    // If allowAutoplay is true, set up for autoplay after src is attached
    if (allowAutoplay) {
      // Ensure muted and loop for autoplay compatibility (default to true if not explicitly false)
      if (muted !== false) {
        video.muted = true;
      }
      if (loop !== false) {
        video.loop = true;
      }
      
      // Set playsInline for mobile
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      
      // Attempt autoplay only when muted (browser requirement)
      const attemptAutoplay = () => {
        if (video.muted) {
          video.play().catch(() => {
            // Autoplay blocked - that's ok, user can click to play
          });
        }
      };
      
      // Try autoplay after metadata loads
      const onCanPlayAutoplay = () => {
        attemptAutoplay();
      };
      
      video.addEventListener('canplay', onCanPlayAutoplay, { once: true });
      
      return () => {
        video.removeEventListener('canplay', onCanPlayAutoplay);
      };
    }
  }, [src, allowAutoplay, muted, loop]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      // Safety net: prevent unintended playback when allowAutoplay is false
      if (!allowAutoplay && !userInitiatedRef.current) {
        video.pause();
        return;
      }
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay, true); // Use capture phase for safety net
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay, true);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src, allowAutoplay]); // Re-attach listeners when src changes

  useEffect(() => {
    // Never force-pause autoplay videos
    if (!forcePause || allowAutoplay) return;

    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
    }
    setIsPlaying(false);
    userInitiatedRef.current = false;
  }, [forcePause, allowAutoplay]);

  // Safari-only warmup: show preview frame without autoplaying
  // Runs only once per src, before user plays
  // Skip if allowAutoplay is true (those videos will autoplay anyway)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    if (!isSafari()) return;
    // Don't warmup autoplay videos - they'll play on their own
    if (allowAutoplay) return;

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
      // Only warmup if user hasn't initiated play yet
      if (userInitiatedRef.current) {
        cleanupWarmup();
        return;
      }

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
      video.preload = 'metadata'; // Use metadata, not auto, to prevent aggressive loading
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.load();
    } catch {}

    return () => {
      try { video.removeEventListener('canplay', onCanPlay); } catch {}
      cleanupWarmup();
    };
  }, [src, allowAutoplay]);

  const handleToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      // Mark as user-initiated before playing
      if (!allowAutoplay) {
        userInitiatedRef.current = true;
      }
      
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
          if (!allowAutoplay) {
            userInitiatedRef.current = false;
          }
        });
    } else {
      // Only allow pause if not autoplay (autoplay videos should keep looping)
      if (!allowAutoplay) {
        video.pause();
        setIsPlaying(false);
        userInitiatedRef.current = false;
      }
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

  // Extract autoplay from rest if present, but we control it via allowAutoplay
  const { autoplay: restAutoplay, ...restWithoutAutoplay } = rest;

  const videoProps = {
    ref: videoRef,
    autoplay: allowAutoplay, // Explicitly set based on allowAutoplay prop
    loop: allowAutoplay ? (loop !== false ? true : loop) : loop,
    muted: allowAutoplay ? (muted !== false ? true : muted) : muted,
    playsInline: true,
    preload: allowAutoplay ? (preload || 'metadata') : preload,
    controls: false,
    disableRemotePlayback: true,
    disablePictureInPicture: true,
    controlsList: "nodownload noplaybackrate noremoteplayback",
    className: videoClassName,
    onError: handleError,
    onLoadedData: handleLoadedData,
    ...restWithoutAutoplay,
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

