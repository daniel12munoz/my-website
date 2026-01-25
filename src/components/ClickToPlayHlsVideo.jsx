import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { cloudflareThumbnail } from '../utils/cloudflareThumb';

// Global singleton to track currently playing non-hero video
let currentlyPlayingVideo = null;

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

export default function ClickToPlayHlsVideo({
  src,
  poster: posterProp,
  videoId,
  className = '',
  wrapperClassName = '',
  loop = true,
  muted = false,
  onRequestPlay,
  forcePause = false,
  startQuality = 'high', // 'high' for high quality startup, 'auto' for default ABR
  debugTag = '', // Optional debug tag for logging (e.g., 'VONIX PTV')
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const hasFirstFrameRef = useRef(false);
  const hasEverRenderedFrameRef = useRef(false); // Persists across pause/resume, only resets on src change
  const frameCallbackRef = useRef(null);
  const frameTimeoutRef = useRef(null);
  const clickTimeRef = useRef(null); // Track click time for performance measurement
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [hasFirstFrame, setHasFirstFrame] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  // Use 1280px width for click-to-play videos (non-hero)
  const poster = posterProp || (src && src.endsWith('.m3u8') ? cloudflareThumbnail(src, { time: "0s", width: 1280 }) : null);

  // Reset first frame tracking when src changes (new media source)
  useEffect(() => {
    hasFirstFrameRef.current = false;
    hasEverRenderedFrameRef.current = false; // Reset when src changes
    setHasFirstFrame(false);
    setIsStarting(false);
    if (frameCallbackRef.current) {
      try {
        const video = videoRef.current;
        if (video && video.cancelVideoFrameCallback) {
          video.cancelVideoFrameCallback(frameCallbackRef.current);
        }
      } catch {}
      frameCallbackRef.current = null;
    }
    if (frameTimeoutRef.current) {
      clearTimeout(frameTimeoutRef.current);
      frameTimeoutRef.current = null;
    }
  }, [src]);

  // Initialize HLS or native HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Log mount for Vonix cards
    if (debugTag) {
      console.log(`[${debugTag}] mount`, { videoId, src: src?.substring(0, 50) });
    }

    // Detect if this is an HLS stream
    const isHLS = src.includes('.m3u8') || (src.includes('cloudflarestream.com') && src.includes('/manifest/'));

    if (isHLS) {
      const isiOS = isIOSorIPadOS();
      const safari = isSafari();
      // Allow native HLS for any Safari (iOS/iPadOS/Mac), but NOT Mac Chrome/Firefox/Edge
      const allowNativeHls = safari;

      if (!allowNativeHls && Hls.isSupported()) {
        // DESKTOP PATH: Use hls.js (Windows, Mac Chrome/Firefox/Edge)
        const useHighQuality = startQuality === 'high';
        
        const hlsConfig = {
          enableWorker: true,
          lowLatencyMode: false,
          startFragPrefetch: true,
          maxStarvationDelay: 2,
          maxBufferLength: useHighQuality ? 20 : 12,
          backBufferLength: 3,
          // CRITICAL: When startQuality="high", do NOT cap to player size (allows HD even on small cards)
          capLevelToPlayerSize: !useHighQuality,
          startLevel: -1, // Will be set after manifest parsed
        };

        if (useHighQuality) {
          // High quality startup config
          hlsConfig.abrEwmaDefaultEstimate = 20000000; // 20 Mbps
          hlsConfig.abrBandWidthFactor = 1.3;
          hlsConfig.abrBandWidthUpFactor = 1.4;
        } else {
          // Default ABR config
          hlsConfig.abrEwmaDefaultEstimate = 10000000; // 10 Mbps
          hlsConfig.abrBandWidthFactor = 1.2;
          hlsConfig.abrBandWidthUpFactor = 1.3;
        }

        const hls = new Hls(hlsConfig);
        hlsRef.current = hls;

        hls.attachMedia(video);
        hls.loadSource(src);

        // Log manifest parsed for Vonix cards
        if (debugTag) {
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log(`[${debugTag}] MANIFEST_PARSED`, { videoId, levels: hls.levels?.length });
          });
        }

        // Handle high quality startup after manifest is parsed
        if (useHighQuality) {
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            const levels = hls.levels;
            if (levels && levels.length > 0) {
              // Find highest quality level, cap at 1080p to avoid excessive bitrates
              let chosenLevel = -1;
              
              // Prefer highest level <= 1080p, or highest available if all are > 1080p
              for (let i = levels.length - 1; i >= 0; i--) {
                const height = levels[i].height;
                if (height <= 1080) {
                  chosenLevel = i;
                  break;
                }
              }
              
              // If no level <= 1080p, use highest available
              if (chosenLevel === -1) {
                chosenLevel = levels.length - 1;
              }

              // Set high starting level
              try {
                hls.startLevel = chosenLevel;
                hls.currentLevel = chosenLevel;
                hls.autoLevelEnabled = true; // Keep ABR enabled for adaptation
                
                if (process.env.NODE_ENV === 'development') {
                  const levelInfo = levels[chosenLevel];
                  const ua = navigator.userAgent;
                  console.log('[CTPHV] start high', {
                    videoId,
                    ua: ua.substring(0, 50),
                    desired: chosenLevel,
                    levels: levels.map((l, idx) => ({ idx, height: l.height, bitrate: l.bitrate })),
                    chosenHeight: levelInfo?.height,
                    chosenBitrate: levelInfo?.bitrate,
                  });
                }
              } catch (e) {
                if (process.env.NODE_ENV === 'development') {
                  console.warn('[ClickToPlayHlsVideo] Failed to set high quality level:', e);
                }
              }
            }
          });
        }

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('[ClickToPlayHlsVideo] HLS fatal error:', data);
            setHasError(true);
          }
        });

        return () => {
          if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
          }
          if (debugTag) {
            console.log(`[${debugTag}] cleanup/destroy`, { videoId });
          }
        };
      } else if (allowNativeHls || (isSafari() && !Hls.isSupported())) {
        // NATIVE HLS PATH: Safari on Mac/iOS (cannot force quality, but optimize setup)
        // Ensure proper setup before setting src to improve quality selection odds
        video.preload = 'metadata';
        video.playsInline = true;
        video.disablePictureInPicture = true;
        
        // Set src and load immediately to reduce startup timing issues
        video.src = src;
        video.load(); // Force load to improve quality selection timing
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[CTPHV] Using native HLS path', {
            videoId,
            ua: navigator.userAgent.substring(0, 50),
            isiOS,
            safari,
          });
        }
        
        return () => {
          video.src = '';
          if (debugTag) {
            console.log(`[${debugTag}] cleanup/destroy`, { videoId });
          }
        };
      } else {
        // FALLBACK: Direct src assignment
        video.src = src;
        return () => {
          video.src = '';
          if (debugTag) {
            console.log(`[${debugTag}] cleanup/destroy`, { videoId });
          }
        };
      }
    } else {
      // Non-HLS video: direct src assignment
      video.src = src;
      return () => {
        video.src = '';
        if (debugTag) {
          console.log(`[${debugTag}] cleanup/destroy`, { videoId });
        }
      };
    }
  }, [src, startQuality, debugTag, videoId]);

  // Handle force pause from parent
  useEffect(() => {
    if (forcePause) {
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
        setIsPlaying(false);
        if (currentlyPlayingVideo === video) {
          currentlyPlayingVideo = null;
        }
      }
    }
  }, [forcePause]);

  // Handle play/pause/ended events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setHasStartedPlaying(true);
      currentlyPlayingVideo = video;
      
      // Log playing event for Vonix cards (to measure click -> playing time)
      if (debugTag && clickTimeRef.current) {
        const playingTime = performance.now();
        const delta = playingTime - clickTimeRef.current;
        console.log(`[${debugTag}] playing event`, {
          videoId,
          currentTime: video.currentTime,
          clickToPlayingMs: delta.toFixed(2),
        });
        clickTimeRef.current = null; // Reset after logging
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (currentlyPlayingVideo === video) {
        currentlyPlayingVideo = null;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (currentlyPlayingVideo === video) {
        currentlyPlayingVideo = null;
      }
    };

    const handleError = () => {
      console.error('[ClickToPlayHlsVideo] Video error:', {
        videoId,
        src: src?.substring(0, 50),
        error: video.error,
        networkState: video.networkState,
        readyState: video.readyState,
      });
      setHasError(true);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [src, videoId]);

  // First frame detection - separate effect that runs when isStarting changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isStarting) return;

    // Detect first frame to hide poster smoothly - use requestVideoFrameCallback if available (best method)
    const markFirstFrameReady = (method) => {
      if (!hasFirstFrameRef.current) {
        hasFirstFrameRef.current = true;
        hasEverRenderedFrameRef.current = true; // Mark that we've ever rendered a frame for this src
        setHasFirstFrame(true);
        setIsStarting(false);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[CTPHV] first frame ready', {
            videoId,
            method,
            readyState: video.readyState,
            currentTime: video.currentTime,
          });
        }
        
        // Clean up
        if (frameCallbackRef.current) {
          try {
            if (video.cancelVideoFrameCallback) {
              video.cancelVideoFrameCallback(frameCallbackRef.current);
            }
          } catch {}
          frameCallbackRef.current = null;
        }
        if (frameTimeoutRef.current) {
          clearTimeout(frameTimeoutRef.current);
          frameTimeoutRef.current = null;
        }
      }
    };

    // Use requestVideoFrameCallback if available (most reliable)
    if (video.requestVideoFrameCallback) {
      const callback = (now, metadata) => {
        if (metadata.mediaTime > 0 && !hasFirstFrameRef.current) {
          markFirstFrameReady('rvfc');
        } else if (isStarting && !hasFirstFrameRef.current) {
          // Continue waiting
          frameCallbackRef.current = video.requestVideoFrameCallback(callback);
        }
      };
      frameCallbackRef.current = video.requestVideoFrameCallback(callback);
    }

    // Fallback: use events
    const handleLoadedData = () => {
      if (!hasFirstFrameRef.current && video.readyState >= 2) {
        markFirstFrameReady('loadeddata');
      }
    };

    const handlePlaying = () => {
      if (!hasFirstFrameRef.current) {
        markFirstFrameReady('playing');
      }
    };

    const handleTimeUpdate = () => {
      if (!hasFirstFrameRef.current && video.currentTime > 0) {
        markFirstFrameReady('timeupdate');
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('timeupdate', handleTimeUpdate);

    // Fallback timeout: if frame isn't ready after 1500ms, show video anyway (prevents infinite poster)
    frameTimeoutRef.current = setTimeout(() => {
      if (!hasFirstFrameRef.current) {
        markFirstFrameReady('timeout');
      }
    }, 1500);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      
      if (frameCallbackRef.current) {
        try {
          if (video.cancelVideoFrameCallback) {
            video.cancelVideoFrameCallback(frameCallbackRef.current);
          }
        } catch {}
        frameCallbackRef.current = null;
      }
      if (frameTimeoutRef.current) {
        clearTimeout(frameTimeoutRef.current);
        frameTimeoutRef.current = null;
      }
    };
  }, [isStarting, videoId]);

  // Click handler
  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;

    // Pause any currently playing video
    if (currentlyPlayingVideo && currentlyPlayingVideo !== video) {
      try {
        currentlyPlayingVideo.pause();
      } catch {}
    }

    // Inform parent
    if (onRequestPlay) {
      onRequestPlay();
    }

    // Play this video
    if (video.paused || video.ended) {
      // Track click time for performance measurement
      clickTimeRef.current = performance.now();
      
      // Log click for Vonix cards
      if (debugTag) {
        console.log(`[${debugTag}] CLICK`, {
          videoId,
          readyState: video.readyState,
          src: src?.substring(0, 50),
        });
      }
      
      // If we've already rendered a frame for this src, just play without resetting poster states
      if (hasEverRenderedFrameRef.current) {
        // Resume: just play, don't touch poster overlay states
        const playPromise = video.play();
        if (playPromise) {
          playPromise
            .then(() => {
              if (debugTag) {
                console.log(`[${debugTag}] Resume play started`, { videoId });
              }
            })
            .catch((err) => {
              console.error(`[${debugTag}] Resume play failed:`, {
                videoId,
                src: src?.substring(0, 50),
                error: err.message,
              });
            });
        }
        return; // Early return - don't reset poster states
      }
      
      // First play: mark as starting to trigger first frame detection
      setIsStarting(true);
      hasFirstFrameRef.current = false;
      setHasFirstFrame(false);
      
      const playPromise = video.play();
      if (playPromise) {
        playPromise
          .then(() => {
            if (debugTag) {
              console.log(`[${debugTag}] First play started`, { videoId });
            }
          })
          .catch((err) => {
            console.error(`[${debugTag}] Play failed:`, {
              videoId,
              src: src?.substring(0, 50),
              error: err.message,
              readyState: video.readyState,
            });
            setIsStarting(false);
          });
      }
    } else {
      // Pause: don't reset poster states
      video.pause();
    }
  };

  const finalClassName = `vp-videoEl ctphv-video ${className}`.trim();
  const finalWrapperClassName = wrapperClassName || 'media media--video';

  return (
    <div
      className={`${finalWrapperClassName} is-playable ctphv-wrapper`.trim()}
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        pointerEvents: 'auto',
        position: 'relative',
        backgroundColor: poster ? 'transparent' : '#000',
        backgroundImage: poster && !hasEverRenderedFrameRef.current && !hasFirstFrame ? `url(${poster})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Poster overlay - stays visible until first frame is painted, but only on first play */}
      {poster && (
        <div
          className="ctphv-poster-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#fff', // White background prevents black flash
            opacity: (!hasEverRenderedFrameRef.current && !hasFirstFrame) ? 1 : 0,
            zIndex: 2,
            pointerEvents: 'none',
            transition: 'opacity 0.12s linear',
          }}
        />
      )}
      <video
        ref={videoRef}
        className={finalClassName}
        loop={loop}
        muted={muted}
        playsInline
        controls={false}
        disableRemotePlayback
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        poster={poster}
        preload="metadata"
        style={{
          backgroundColor: 'transparent', // Transparent, not black
          opacity: hasEverRenderedFrameRef.current ? 1 : (hasFirstFrame ? 1 : 0), // Once rendered, always visible
          transition: hasFirstFrame ? 'opacity 0.12s linear' : 'none',
          position: 'relative',
          zIndex: 1,
        }}
      />
      {/* Play icon overlay - show when paused */}
      {!isPlaying && (
        <div className="playOverlay" style={{ zIndex: 3 }}>
          <span className="playOverlay__icon" />
        </div>
      )}
      {/* Error indicator */}
      {hasError && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'red', fontSize: '12px', zIndex: 4 }}>
          Error loading video
        </div>
      )}
    </div>
  );
}
