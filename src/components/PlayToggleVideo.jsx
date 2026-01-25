import React, { useRef, useState, useEffect, useCallback } from 'react';
import HlsVideo from './HlsVideo';
import { cloudflareThumbnail } from '../utils/cloudflareThumb';

// Module-level variable to track currently playing user-initiated video
let currentlyPlayingUserVideo = null;

// Helper to detect Safari (not Chrome on iOS/macOS)
const isSafari = () => {
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome|Chromium|Android/.test(ua);
};

// Helper to detect mobile (coarse pointer device)
const isMobile = () => {
  return window.matchMedia('(pointer: coarse)').matches || 
         /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export default function PlayToggleVideo({
  src,
  allowAutoplay = false,
  clickToToggle = true, // New prop - allow disabling clicks for autoplay headers
  wrapperClassName = 'media media--video',
  videoClassName = '',
  loop = true,
  muted = true,
  onRequestPlay,
  forcePause = false,
  preload = 'metadata', // Allow override, defaults to 'metadata' for backward compatibility
  onError,
  onLoadedData,
  lazy = true, // Lazy load by default
  poster: posterProp,
  preferHd = true,
  hero = false, // Hero mode: force high quality immediately
  ...rest
}) {
  // Hero mode overrides: force immediate load and high quality
  const effectiveLazy = hero ? false : lazy;
  const effectivePreload = hero ? 'auto' : preload;
  const effectivePreferHd = hero ? true : preferHd;
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!effectiveLazy); // Load immediately if not lazy
  const [hasPaintedFrame, setHasPaintedFrame] = useState(false); // Track first frame painted
  const [isStarting, setIsStarting] = useState(false); // Track when play is initiated
  const hasEverPlayedRef = useRef(false); // Track if video has ever played (prevents poster flash on resume)
  const warmedUpSrcRef = useRef(null);
  const warmingRef = useRef(false);
  const isWarmingRef = useRef(false); // Track if warmup is active (prevents UI state changes during warmup)
  const userInitiatedRef = useRef(false);
  const frameCallbackRef = useRef(null);
  const didPrimeRef = useRef(false); // Track if we've primed loading on pointerdown

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    if (!effectiveLazy) return;
    const el = wrapperRef.current || videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [effectiveLazy]);

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

  // Track first frame painted to hide poster overlay (ONLY on first play, NOT warmup)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isStarting || hasEverPlayedRef.current) return; // Skip if already played
    if (isWarmingRef.current) return; // Skip during warmup
    if (!userInitiatedRef.current) return; // Only track real user-initiated playback

    // Use requestVideoFrameCallback when available (modern browsers)
    if (video.requestVideoFrameCallback) {
      const callback = (now, metadata) => {
        // Only mark as ever played if this was a real user click, not warmup
        if (metadata.mediaTime > 0 && userInitiatedRef.current && !isWarmingRef.current) {
          setHasPaintedFrame(true);
          setIsStarting(false);
          hasEverPlayedRef.current = true; // Mark as ever played
          if (frameCallbackRef.current) {
            frameCallbackRef.current = null;
          }
        } else if (isStarting && !hasEverPlayedRef.current && userInitiatedRef.current) {
          // Continue waiting for first frame
          frameCallbackRef.current = video.requestVideoFrameCallback(callback);
        }
      };
      frameCallbackRef.current = video.requestVideoFrameCallback(callback);
      
      return () => {
        if (frameCallbackRef.current) {
          try {
            video.cancelVideoFrameCallback(frameCallbackRef.current);
          } catch {}
          frameCallbackRef.current = null;
        }
      };
    } else {
      // Fallback: use timeupdate or playing event
      const onTimeUpdate = () => {
        if (video.currentTime > 0 && !hasEverPlayedRef.current && userInitiatedRef.current && !isWarmingRef.current) {
          setHasPaintedFrame(true);
          setIsStarting(false);
          hasEverPlayedRef.current = true; // Mark as ever played
        }
      };
      const onPlaying = () => {
        if (video.currentTime > 0 && !hasEverPlayedRef.current && userInitiatedRef.current && !isWarmingRef.current) {
          setHasPaintedFrame(true);
          setIsStarting(false);
          hasEverPlayedRef.current = true; // Mark as ever played
        }
      };
      
      video.addEventListener('timeupdate', onTimeUpdate, { once: true });
      video.addEventListener('playing', onPlaying, { once: true });
      
      return () => {
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('playing', onPlaying);
      };
    }
  }, [isStarting]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      // Skip UI state changes during warmup (warmup controls its own pause timing)
      if (isWarmingRef.current) {
        return;
      }
      
      // Safety net: prevent unintended playback when allowAutoplay is false
      if (!allowAutoplay && !userInitiatedRef.current) {
        video.pause();
        return;
      }
      
      // One-at-a-time: pause other user-initiated videos
      if (!allowAutoplay) {
        if (currentlyPlayingUserVideo && currentlyPlayingUserVideo !== video) {
          try {
            currentlyPlayingUserVideo.pause();
          } catch {}
        }
        currentlyPlayingUserVideo = video;
      }
      
      setIsPlaying(true);
      // Only track starting/frame painted on FIRST play
      if (!hasEverPlayedRef.current) {
        setIsStarting(true);
        setHasPaintedFrame(false);
      }
    };
    const handlePause = () => {
      // Clear currently playing tracker
      if (!allowAutoplay && currentlyPlayingUserVideo === video) {
        currentlyPlayingUserVideo = null;
      }
      
      setIsPlaying(false);
      // Don't reset starting state on pause - we've already played
      if (!hasEverPlayedRef.current) {
        setIsStarting(false);
      }
    };
    const handleEnded = () => {
      // Clear currently playing tracker
      if (!allowAutoplay && currentlyPlayingUserVideo === video) {
        currentlyPlayingUserVideo = null;
      }
      
      setIsPlaying(false);
      setIsStarting(false);
    };

    video.addEventListener('play', handlePlay, true); // Use capture phase for safety net
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay, true);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src, allowAutoplay]); // Re-attach listeners when src changes

  // Autoplay reliability: ensure autoplay videos start immediately
  useEffect(() => {
    if (!allowAutoplay || !shouldLoad) return;
    
    const video = videoRef.current;
    if (!video) return;
    
    // Ensure lazy loading is disabled for autoplay
    ensureLoaded();
    
    // Force attributes for autoplay reliability
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    
    // Try to play on canplay
    const handleCanPlay = () => {
      if (video.paused) {
        video.play().catch(() => {
          // Autoplay failed, ignore
        });
      }
    };
    
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadedmetadata', handleCanPlay);
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadedmetadata', handleCanPlay);
    };
  }, [allowAutoplay, shouldLoad, src]);

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

  // Warm-frame: show preview frame without autoplaying (prevents black flash on mobile tap)
  // Runs on mobile (Safari + Chrome) and desktop Safari
  // Only runs after shouldLoad becomes true (lazy loading gate)
  // Skip if allowAutoplay is true (those videos will autoplay anyway)
  // Skip if user has already played (no need to warmup again)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    if (!shouldLoad) return; // Wait for lazy loading to trigger
    if (hasEverPlayedRef.current) return; // Don't warmup after first play
    // Don't warmup autoplay videos - they'll play on their own
    if (allowAutoplay) return;
    // Only warm on mobile or Safari (where black flash is common)
    if (!isMobile() && !isSafari()) return;

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
        // Mark warmup as active to prevent UI state changes
        isWarmingRef.current = true;
        
        // Ensure autoplay is allowed for warmup
        video.muted = true;
        video.volume = 0;

        // Seek slightly forward so we don't sit at a black 0-frame for HLS
        try { video.currentTime = 0.05; } catch {}

        // Start playback briefly to force a decoded frame
        await video.play();

        // Pause ASAP after a tick so at least one frame is painted (<=150ms as requested)
        setTimeout(() => {
          try { video.pause(); } catch {}
          isWarmingRef.current = false; // Clear warmup flag before cleanup
          cleanupWarmup();
        }, 120);
      } catch {
        isWarmingRef.current = false; // Clear warmup flag on error
        cleanupWarmup();
      }
    };

    // Use loadeddata or canplay - loadeddata is more reliable for first frame
    const onLoadedDataWarmup = () => {
      onCanPlay();
    };
    
    video.addEventListener('loadeddata', onLoadedDataWarmup, { once: true });
    video.addEventListener('canplay', onCanPlay, { once: true });

    // Force load/metadata
    try {
      video.preload = 'metadata'; // Use metadata, not auto, to prevent aggressive loading
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.load();
    } catch {}

    return () => {
      try { 
        video.removeEventListener('loadeddata', onLoadedDataWarmup); 
        video.removeEventListener('canplay', onCanPlay); 
      } catch {}
      cleanupWarmup();
    };
  }, [src, allowAutoplay, shouldLoad]);

  // Prime loading on pointerdown/touchstart for faster mobile response (NO playback)
  const handlePrime = () => {
    ensureLoaded(); // Force load if lazy
    
    const video = videoRef.current;
    if (!video || didPrimeRef.current) return;
    
    // For HLS/hls.js, preload metadata often isn't enough. Prime with auto for THIS one.
    try {
      if (video.preload !== 'auto') {
        video.preload = 'auto';
        video.load();
      }
    } catch {}

    didPrimeRef.current = true;
  };

  const handleToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    
    // Debug log for click-to-play videos
    if (!allowAutoplay) {
      console.log('[PlayToggleVideo] toggle', { 
        src: src?.substring(0, 60) + '...', 
        paused: video.paused, 
        readyState: video.readyState,
        shouldLoad 
      });
    }
    
    // If not loaded yet, force load and queue play for click-to-play videos
    if (!shouldLoad) {
      setShouldLoad(true);
      
      // Only queue play for user-initiated (non-autoplay) videos
      if (!allowAutoplay) {
        userInitiatedRef.current = true;
        
        // Inform parent that THIS instance is about to play
        if (onRequestPlay) {
          onRequestPlay();
        }
        
        // Queue play after video mounts
        requestAnimationFrame(() => {
          setTimeout(() => {
            const v = videoRef.current;
            if (v) {
              v.play().catch(() => {
                // Play failed, reset state
                userInitiatedRef.current = false;
              });
            }
          }, 100);
        });
      }
      return;
    }

    if (video.paused || video.ended) {
      // Mark as user-initiated before playing
      if (!allowAutoplay) {
        userInitiatedRef.current = true;
      }
      
      // Only reset frame painted state on FIRST play (never after hasEverPlayedRef is true)
      if (!hasEverPlayedRef.current) {
        setHasPaintedFrame(false);
        setIsStarting(true);
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
          if (!hasEverPlayedRef.current) {
            setIsStarting(false);
          }
          if (!allowAutoplay) {
            userInitiatedRef.current = false;
          }
        });
    } else {
      // Only allow pause if not autoplay (autoplay videos should keep looping)
      if (!allowAutoplay) {
        video.pause();
        setIsPlaying(false);
        // Don't reset starting state or hasPaintedFrame - video has already played
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

  const handleLoadedData = (e) => {
    if (onLoadedData) {
      onLoadedData(e);
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

  // Get Cloudflare poster for placeholder (if not provided)
  // Use 1280px width for non-hero videos (card videos)
  const poster = posterProp || (src && src.endsWith('.m3u8') ? cloudflareThumbnail(src, { time: "0s", width: 1280 }) : null);

  // Ensure playsinline attributes are set for mobile inline playback
  // Must be declared before any conditional returns (Rules of Hooks)
  useEffect(() => {
    if (!shouldLoad) return; // Only set attributes when video should load
    const video = videoRef.current;
    if (!video) return;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
  }, [shouldLoad]);

  // Helper to force-load lazy videos
  const ensureLoaded = useCallback(() => {
    if (!shouldLoad) {
      setShouldLoad(true);
    }
  }, [shouldLoad]);

  // Combine videoClassName with shared stable class
  const finalVideoClassName = `vp-videoEl ${videoClassName || ''}`.trim();

  const videoProps = {
    // DO NOT include ref here - it doesn't reliably attach to components via spread
    autoPlay: allowAutoplay, // Use camelCase autoPlay (React standard)
    loop: allowAutoplay ? (loop !== false ? true : loop) : loop,
    muted: allowAutoplay ? (muted !== false ? true : muted) : muted,
    playsInline: true,
    preload: shouldLoad ? (allowAutoplay ? (effectivePreload || 'metadata') : effectivePreload) : 'none',
    controls: false,
    disableRemotePlayback: true,
    disablePictureInPicture: true,
    controlsList: "nodownload noplaybackrate noremoteplayback",
    className: finalVideoClassName,
    onError: handleError,
    onLoadedData: handleLoadedData,
    poster: poster,
    ...restWithoutAutoplay,
  };

  // Show poster overlay ONLY on first play startup, never on resume
  const showPosterOverlay = poster && !hasEverPlayedRef.current && (!hasPaintedFrame || isStarting);

  return (
    <div
      ref={wrapperRef}
      className={`${wrapperClassName} is-playable`.trim()}
      onClick={clickToToggle && !allowAutoplay ? handleToggle : undefined}
      onPointerDown={clickToToggle && !allowAutoplay ? handlePrime : undefined}
      onTouchStart={clickToToggle && !allowAutoplay ? handlePrime : undefined}
      style={allowAutoplay || !clickToToggle ? { pointerEvents: 'none' } : undefined}
    >
      {isHLS ? (
        <HlsVideo
          ref={videoRef}
          src={shouldLoad ? src : undefined}
          lazy={effectiveLazy}
          preferHd={effectivePreferHd}
          hero={hero}
          debug={hero}
          priority={hero ? true : rest.priority}
          poster={poster}
          {...videoProps}
        />
      ) : (
        <video ref={videoRef} {...videoProps}>
          {shouldLoad && <source src={src} type={getVideoType(src)} />}
        </video>
      )}
      {/* Poster overlay - hides after first frame is painted */}
      {showPosterOverlay && (
        <div
          className={`vp-posterOverlay ${hasPaintedFrame ? 'vp-posterOverlay--hidden' : ''}`}
          style={{
            backgroundImage: poster ? `url(${poster})` : 'none',
          }}
        />
      )}
      {/* Play icon - show when paused, hide when playing (but only after first frame on first play) */}
      {(!isPlaying || (!hasEverPlayedRef.current && !hasPaintedFrame)) && (
        <div className="playOverlay">
          <span className="playOverlay__icon" />
        </div>
      )}
    </div>
  );
}

