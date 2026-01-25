import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { cloudflareThumbnail } from '../utils/cloudflareThumb';

// Platform detection: iOS/iPadOS only
function isIOSorIPadOS() {
  return (
    /iP(hone|od|ad)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

// Safari detection (not Chrome/Chromium/Edge/etc)
function isSafari() {
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Brave|Android/.test(ua);
}

// Helper to detect mobile (coarse pointer device)
function isMobile() {
  return window.matchMedia('(pointer: coarse)').matches || 
         /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

const HlsVideoInner = forwardRef(function HlsVideoInner({ 
  src, 
  autoPlay, 
  priority, 
  poster: posterProp,
  lazy = true,
  preferHd = true,
  hero = false,
  debug = false,
  preload,
  loop = false,
  muted = false,
  posterWidth,
  ...props 
}, ref) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const hasFirstFrameRef = useRef(false); // For mobile hero poster overlay - persists across pause/resume
  
  // Compute heroLike once at mount for shouldLoad init
  const heroLikeInitial = hero || priority === true || preload === 'auto';
  const [shouldLoad, setShouldLoad] = useState(!lazy || heroLikeInitial);
  const [hasFirstFrame, setHasFirstFrame] = useState(false); // For mobile hero poster overlay
  
  // Use refs to capture latest values for async callbacks without triggering effect re-runs
  const autoPlayRef = useRef(autoPlay);
  const priorityRef = useRef(priority);
  const preloadRef = useRef(preload);
  const loopRef = useRef(loop);
  const mutedRef = useRef(muted);
  const preferHdRef = useRef(preferHd);
  const heroRef = useRef(hero);
  const debugRef = useRef(debug);
  const lazyRef = useRef(lazy);
  
  // Keep refs in sync with latest prop values
  useEffect(() => {
    autoPlayRef.current = autoPlay;
    priorityRef.current = priority;
    preloadRef.current = preload;
    loopRef.current = loop;
    mutedRef.current = muted;
    preferHdRef.current = preferHd;
    heroRef.current = hero;
    debugRef.current = debug;
    lazyRef.current = lazy;
  }, [autoPlay, priority, preload, loop, muted, preferHd, hero, debug, lazy]);

  // Expose the video element ref to parent components
  useImperativeHandle(ref, () => videoRef.current, []);

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    // Hero videos skip lazy loading entirely
    if (heroLikeInitial || !lazy) return;
    
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [lazy, heroLikeInitial]);

  // Initialize HLS/native video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !shouldLoad) return;

    const isHero = !!heroRef.current;
    const shouldDebug = !!debugRef.current || isHero;
    
    // Compute heroLike from refs
    const heroLike = isHero || !!priorityRef.current || preloadRef.current === 'auto';

    // HERO: Always log initial state (only once per mount)
    if (shouldDebug) {
      console.log('[HERO HLS] Init:', {
        src,
        hero: isHero,
        heroLike,
        preload: preloadRef.current || 'metadata',
        priority: priorityRef.current,
        preferHd: preferHdRef.current,
        lazy: lazyRef.current
      });
    }

    // ---- FORCE LOOPING (desktop-safe) ----
    video.loop = !!loopRef.current;
    video.muted = !!mutedRef.current;
    
    // HERO: Force preload='auto' and fetchPriority='high' for immediate loading
    if (heroLike) {
      video.preload = 'auto';
      if ('fetchPriority' in video) {
        video.fetchPriority = 'high';
      }
    }

    // Restart function used by both ended + failsafe
    const restart = () => {
      if (!loopRef.current) return;

      try { video.pause(); } catch {}
      try { video.currentTime = 0; } catch {}

      // If hls.js is being used, restart loading from the beginning too
      if (hlsRef.current) {
        try { hlsRef.current.startLoad(0); } catch {}
      }

      // Kick play again
      video.play().catch(() => {});
    };

    // 1) Normal loop path: ended event
    const onEnded = () => restart();

    // 2) Failsafe: some desktop HLS paths don't fire ended reliably
    const onTimeUpdate = () => {
      if (!loopRef.current) return;
      const d = video.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      if (video.currentTime >= d - 0.25) {
        restart();
      }
    };

    if (loopRef.current) {
      video.addEventListener('ended', onEnded);
      video.addEventListener('timeupdate', onTimeUpdate);
    }

    // Clean up previous HLS instance if it exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Platform detection for path selection
    const isiOS = isIOSorIPadOS();
    const safari = isSafari();
    const allowNativeHls = isiOS && safari; // ONLY iOS/iPadOS Safari
    
    // Check if native HLS is supported
    const canPlayHLS = video.canPlayType('application/vnd.apple.mpegurl') === 'maybe' || 
                       video.canPlayType('application/vnd.apple.mpegurl') === 'probably';

    if (shouldDebug) {
      console.log('[HERO HLS] Path:', { 
        allowNativeHls, 
        isiOS, 
        safari, 
        hlsJsSupported: Hls.isSupported(), 
        canPlayHLS 
      });
    }

    // PATH SELECTION: Force hls.js on desktop, only allow native HLS on iOS Safari
    if (!allowNativeHls && Hls.isSupported()) {
      // DESKTOP PATH: Always use hls.js
      if (shouldDebug) {
        console.log('[HERO HLS] Using HLS.JS path (desktop)');
      }
      
      // Hero mode: aggressive config for high startup quality
      const hlsConfig = {
        enableWorker: true,
        lowLatencyMode: false,
        startFragPrefetch: true,
        maxStarvationDelay: 2,
        startLevel: -1 // We'll set this after manifest
      };
      
      if (heroLike) {
        // HERO: Aggressive buffering and bandwidth config
        hlsConfig.abrEwmaDefaultEstimate = 20000000; // 20 Mbps
        hlsConfig.abrBandWidthFactor = 1.3;
        hlsConfig.abrBandWidthUpFactor = 1.4;
        hlsConfig.maxBufferLength = 20;
        hlsConfig.backBufferLength = 5;
        hlsConfig.capLevelToPlayerSize = false; // Don't cap based on element size
      } else {
        // Non-hero: conservative config
        hlsConfig.abrEwmaDefaultEstimate = 10000000; // 10 Mbps
        hlsConfig.abrBandWidthFactor = 1.2;
        hlsConfig.abrBandWidthUpFactor = 1.3;
        hlsConfig.maxBufferLength = 12;
        hlsConfig.backBufferLength = 3;
        hlsConfig.capLevelToPlayerSize = true;
      }
      
      const hls = new Hls(hlsConfig);
      hlsRef.current = hls;
      
      hls.attachMedia(video);
      hls.loadSource(src);
      
      // Helper: calculate buffer ahead of current time
      const bufferAhead = (vid) => {
        if (!vid.buffered || vid.buffered.length === 0) return 0;
        const end = vid.buffered.end(vid.buffered.length - 1);
        return Math.max(0, end - vid.currentTime);
      };
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels;
        
        if (shouldDebug) {
          console.log('[HERO HLS] MANIFEST_PARSED - Available levels:', 
            levels.map((level, i) => ({
              index: i,
              height: level.height,
              bitrate: level.bitrate,
              width: level.width
            }))
          );
        }
        
        if (preferHdRef.current && levels && levels.length > 0) {
          // Wait one frame for layout
          requestAnimationFrame(() => {
            const rect = video.getBoundingClientRect();
            const playerHeight = Math.round(rect.height || video.clientHeight || video.offsetHeight || 0);
            
            let chosenLevel = -1;
            
            if (heroLike) {
              // HERO: Find highest level >= 720p, else use highest available
              for (let i = levels.length - 1; i >= 0; i--) {
                const h = levels[i].height;
                if (h >= 720) {
                  chosenLevel = i;
                  break;
                }
              }
              
              // If no level >= 720p, use highest available
              if (chosenLevel === -1) {
                chosenLevel = levels.length - 1;
              }
            } else {
              // Non-hero: match player height or 360p minimum
              const targetHeight = Math.max(playerHeight, 360);
              
              for (let i = levels.length - 1; i >= 0; i--) {
                if (levels[i].height >= targetHeight) {
                  chosenLevel = i;
                  break;
                }
              }
              
              if (chosenLevel === -1) {
                chosenLevel = levels.length - 1;
              }
            }
            
            if (shouldDebug) {
              console.log('[HERO HLS] Chosen startupLevel:', {
                index: chosenLevel,
                height: levels[chosenLevel]?.height,
                bitrate: levels[chosenLevel]?.bitrate,
                playerHeight,
                heroLike
              });
            }
            
            // Set startup level (do NOT set currentLevel to avoid mid-play switches)
            try {
              hls.startLevel = chosenLevel;
              hls.nextLoadLevel = chosenLevel;
              hls.loadLevel = chosenLevel;
            } catch (e) {
              if (shouldDebug) {
                console.warn('[HERO HLS] Failed to set levels:', e);
              }
            }
            
            // Start loading at chosen level (only once)
            hls.startLoad(0);
            
            // HERO: Safe ABR release after buffering
            if (heroLike) {
              let released = false;
              let fragCount = 0;
              let fragBufferedHandler = null;
              let releaseTimeoutId = null;
              
              const releaseAbrSafely = () => {
                if (released) return;
                released = true;
                
                // Safe release: set autoLevelEnabled and nextAutoLevel (no currentLevel change)
                try {
                  if ('autoLevelEnabled' in hls) {
                    hls.autoLevelEnabled = true;
                  }
                  if ('nextAutoLevel' in hls) {
                    hls.nextAutoLevel = chosenLevel;
                  }
                } catch (e) {
                  // Ignore
                }
                
                // Clean up
                if (fragBufferedHandler) {
                  hls.off(Hls.Events.FRAG_BUFFERED, fragBufferedHandler);
                  fragBufferedHandler = null;
                }
                if (releaseTimeoutId) {
                  clearTimeout(releaseTimeoutId);
                  releaseTimeoutId = null;
                }
              };
              
              // Wait for buffer safety: 2 fragments + 1.5s buffered
              fragBufferedHandler = () => {
                fragCount++;
                
                const buffered = bufferAhead(video);
                
                if (!released && fragCount >= 2 && buffered >= 1.5) {
                  releaseAbrSafely();
                }
              };
              
              hls.on(Hls.Events.FRAG_BUFFERED, fragBufferedHandler);
              
              // Fallback: release after 6s if buffer conditions not met
              releaseTimeoutId = setTimeout(() => {
                releaseAbrSafely();
              }, 6000);
            }
          });
        }
        
        // Try to autoplay if requested
        if (autoPlayRef.current && video.muted) {
          video.play().catch(() => {
            // Autoplay failed, ignore
          });
        }
      });
      
      // HERO: Log level switches
      if (shouldDebug) {
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          const newLevel = data.level;
          const levelInfo = hls.levels[newLevel];
          console.log('[HERO HLS] LEVEL_SWITCHED:', {
            newLevelIndex: newLevel,
            height: levelInfo?.height,
            bitrate: levelInfo?.bitrate
          });
        });
      }
      
      // HERO: Log errors
      if (shouldDebug) {
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('[HERO HLS] ERROR:', {
            type: data.type,
            details: data.details,
            fatal: data.fatal
          });
        });
      }
    } else if (allowNativeHls && canPlayHLS) {
      // IOS SAFARI PATH: Use native HLS
      if (shouldDebug) {
        console.log('[HERO HLS] Using NATIVE HLS path (iOS Safari - cannot force rendition)');
      }
      
      video.src = src;
      if (autoPlayRef.current && video.muted) {
        video.play().catch(() => {
          // Autoplay failed, ignore
        });
      }
    } else if (Hls.isSupported()) {
      // FALLBACK: hls.js if native not allowed but hls.js is available
      if (shouldDebug) {
        console.log('[HERO HLS] Using HLS.JS path (fallback)');
      }
      
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        startFragPrefetch: true,
        maxStarvationDelay: 2,
        abrEwmaDefaultEstimate: 10000000,
        abrBandWidthFactor: 1.2,
        abrBandWidthUpFactor: 1.3,
        maxBufferLength: 12,
        backBufferLength: 3,
        capLevelToPlayerSize: true,
        startLevel: -1
      });
      hlsRef.current = hls;
      
      hls.attachMedia(video);
      hls.loadSource(src);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlayRef.current && video.muted) {
          video.play().catch(() => {});
        }
      });
    } else {
      // FINAL FALLBACK: Direct src assignment
      if (shouldDebug) {
        console.log('[HERO HLS] Using direct src (no HLS support)');
      }
      
      video.src = src;
      if (autoPlayRef.current && video.muted) {
        video.play().catch(() => {
          // Autoplay failed, ignore
        });
      }
    }

    // Cleanup function
    return () => {
      // Clean up ended event listeners
      try { video.removeEventListener('ended', onEnded); } catch {}
      try { video.removeEventListener('timeupdate', onTimeUpdate); } catch {}
      
      if (hlsRef.current) {
        // Clean up HLS instance
        const hls = hlsRef.current;
        try {
          // Re-enable auto quality before destroy (safe fallback)
          if (typeof hls.currentLevel === "number" || "currentLevel" in hls) {
            hls.currentLevel = -1;
          }
        } catch (e) {
          // Swallow to prevent runtime crash
        }
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, shouldLoad]); // Only depend on stable values: src and shouldLoad

  // Compute poster width: hero/priority/auto -> 1920px, else 1280px
  const computedPosterWidth =
    typeof posterWidth === "number"
      ? posterWidth
      : (hero || priority || preload === "auto")
        ? 1920
        : 1280;

  // Auto-generate poster if not provided and src is HLS
  const poster =
    posterProp ||
    (src && src.endsWith(".m3u8")
      ? (cloudflareThumbnail(src, { time: "0s", width: computedPosterWidth }) || null)
      : null);

  // Reset first frame tracking when src changes (for mobile hero poster)
  useEffect(() => {
    if (hero && isMobile()) {
      hasFirstFrameRef.current = false;
      setHasFirstFrame(false);
    }
  }, [src, hero]);

  // Detect first frame for mobile hero videos (to hide poster overlay)
  useEffect(() => {
    if (!hero || !isMobile() || !poster) return;
    
    const video = videoRef.current;
    if (!video) return;

    const markFirstFrameReady = () => {
      if (!hasFirstFrameRef.current) {
        hasFirstFrameRef.current = true;
        setHasFirstFrame(true);
      }
    };

    const handleLoadedData = () => {
      if (video.readyState >= 2) {
        markFirstFrameReady();
      }
    };

    const handleCanPlay = () => {
      if (video.readyState >= 2) {
        markFirstFrameReady();
      }
    };

    const handlePlaying = () => {
      markFirstFrameReady();
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [hero, poster, src]);

  // Set playsinline attributes for mobile inline playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
  }, []);

  // Extract className from props and combine with shared stable class
  const { className: propsClassName, ...restProps } = props;
  const finalClassName = `vp-videoEl ${propsClassName || ''}`.trim();

  // Mobile hero: show poster overlay until first frame
  const isMobileHero = hero && isMobile() && poster;
  const showMobileHeroPoster = isMobileHero && !hasFirstFrame;

  // If mobile hero, wrap in container for overlay positioning
  if (isMobileHero) {
    return (
      <div style={{ position: 'relative', display: 'block', width: '100%', height: '100%' }}>
        <video
          ref={videoRef}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={false}
          disableRemotePlayback
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
          poster={poster}
          playsInline={true}
          preload={shouldLoad ? (preload || 'metadata') : 'none'}
          className={finalClassName}
          style={{ backgroundColor: "#000", ...restProps.style }}
          {...restProps}
        />
        {/* Mobile hero poster overlay - shows until first frame, then never again */}
        {showMobileHeroPoster && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${poster})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#fff',
              pointerEvents: 'none',
              zIndex: 1,
              opacity: 1,
              transition: 'opacity 0.15s ease-out',
            }}
          />
        )}
      </div>
    );
  }

  // Non-mobile hero: render video directly (no wrapper)
  return (
    <video
      ref={videoRef}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={false}
      disableRemotePlayback
      disablePictureInPicture
      controlsList="nodownload noplaybackrate noremoteplayback"
      poster={poster}
      playsInline={true}
      preload={shouldLoad ? (preload || 'metadata') : 'none'}
      className={finalClassName}
      style={{ backgroundColor: "#000", ...restProps.style }}
      {...restProps}
    />
  );
});

// Wrapper component that optionally remounts HlsVideoInner for guaranteed looping
function HlsVideo(props, ref) {
  const { remountLoop = false, remountLoopThreshold = 0.35, ...rest } = props;

  // ALWAYS call hooks (never conditional)
  const [loopKey, setLoopKey] = useState(0);
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const triggeredRef = useRef(false);

  // Expose the actual <video> element
  useImperativeHandle(ref, () => videoRef.current, []);

  const startWatch = useCallback(() => {
    // Only actually watch if remountLoop is enabled
    if (!remountLoop) return;

    // Clear any existing loop
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = () => {
      const v = videoRef.current;

      if (v) {
        const d = v.duration;
        const t = v.currentTime;

        // Only operate when duration is known and we've actually played a bit
        if (Number.isFinite(d) && d > 0 && t > 0) {
          // When near end, remount the entire HLS pipeline
          if (!triggeredRef.current && t >= d - remountLoopThreshold) {
            triggeredRef.current = true;
            console.log("[HLS remountLoop] REMOUNT LOOP", { t, d });

            setLoopKey(k => k + 1);
            return; // stop this tick; effect below will restart watcher
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [remountLoop, remountLoopThreshold]);

  // Restart watcher every time we remount
  useEffect(() => {
    triggeredRef.current = false;
    startWatch();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [loopKey, startWatch]);

  // Use loopKey only if remountLoop is enabled, otherwise always use 0 (no remounting)
  const effectiveKey = remountLoop ? loopKey : 0;

  return (
    <HlsVideoInner
      key={effectiveKey}
      ref={videoRef}
      {...rest}
    />
  );
}

export default forwardRef(HlsVideo);