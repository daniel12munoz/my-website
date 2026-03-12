import React, { useRef, useState, useEffect, useCallback } from 'react';
import Hls from 'hls.js';

let currentlyPlayingVideo = null;

export default function ClickToPlayHlsVideo({
  src,
  poster,
  videoId,
  className = '',
  wrapperClassName = '',
  loop = true,
  muted = false,
  onRequestPlay,
  forcePause = false,
  startQuality = 'high',
  debugTag = '',
}) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const hlsRef = useRef(null);
  const srcAttachedRef = useRef(false);
  const hasStartedRef = useRef(false);
  const wantPlayRef = useRef(false);
  const rvfcIdRef = useRef(null);
  const posterTimeoutRef = useRef(null);
  const posterRef = useRef(poster);
  posterRef.current = poster;

  const [isPlaying, setIsPlaying] = useState(false);
  const [posterVisible, setPosterVisible] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isHLS = src && (src.endsWith('.m3u8') || (src.includes('cloudflarestream.com') && src.includes('/manifest/')));

  // Reset when src changes
  useEffect(() => {
    srcAttachedRef.current = false;
    hasStartedRef.current = false;
    wantPlayRef.current = false;
    setPosterVisible(true);
    setIsPlaying(false);
    setHasError(false);
    const video = videoRef.current;
    if (video && rvfcIdRef.current != null && video.cancelVideoFrameCallback) {
      try { video.cancelVideoFrameCallback(rvfcIdRef.current); } catch {}
      rvfcIdRef.current = null;
    }
    if (posterTimeoutRef.current) {
      clearTimeout(posterTimeoutRef.current);
      posterTimeoutRef.current = null;
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, [src]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    const video = videoRef.current;
    if (video && rvfcIdRef.current != null && video.cancelVideoFrameCallback) {
      try { video.cancelVideoFrameCallback(rvfcIdRef.current); } catch {}
    }
    if (posterTimeoutRef.current) {
      clearTimeout(posterTimeoutRef.current);
    }
    if (video && currentlyPlayingVideo === video) {
      currentlyPlayingVideo = null;
    }
  }, []);

  // Force pause from parent
  useEffect(() => {
    if (!forcePause) return;
    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
      setIsPlaying(false);
      wantPlayRef.current = false;
      if (currentlyPlayingVideo === video) currentlyPlayingVideo = null;
    }
  }, [forcePause]);

  // Video event listeners — stable across renders
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const commitPosterHide = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      if (posterTimeoutRef.current) {
        clearTimeout(posterTimeoutRef.current);
        posterTimeoutRef.current = null;
      }
      setPosterVisible(false);
    };

    const onPlay = () => {
      setIsPlaying(true);
      currentlyPlayingVideo = video;
    };

    const onPause = () => {
      setIsPlaying(false);
      wantPlayRef.current = false;
      if (currentlyPlayingVideo === video) currentlyPlayingVideo = null;
    };

    const onEnded = () => {
      setIsPlaying(false);
      wantPlayRef.current = false;
      if (currentlyPlayingVideo === video) currentlyPlayingVideo = null;
    };

    const onPlaying = () => {
      if (hasStartedRef.current) return;
      if (posterRef.current && typeof video.requestVideoFrameCallback === 'function') {
        rvfcIdRef.current = video.requestVideoFrameCallback(() => {
          rvfcIdRef.current = null;
          commitPosterHide();
        });
      } else if (posterRef.current) {
        requestAnimationFrame(() => requestAnimationFrame(() => commitPosterHide()));
      } else {
        commitPosterHide();
      }
    };

    const onTimeUpdate = () => {
      if (!hasStartedRef.current && video.currentTime > 0) {
        if (posterRef.current && typeof video.requestVideoFrameCallback === 'function') {
          rvfcIdRef.current = video.requestVideoFrameCallback(() => {
            rvfcIdRef.current = null;
            commitPosterHide();
          });
        } else if (posterRef.current) {
          requestAnimationFrame(() => requestAnimationFrame(() => commitPosterHide()));
        } else {
          commitPosterHide();
        }
      }
    };

    const onLoadedData = () => {
      if (wantPlayRef.current && video.paused) {
        video.play().catch(() => {});
      }
    };

    const onCanPlay = () => {
      if (wantPlayRef.current && video.paused) {
        video.play().catch(() => {});
      }
    };

    const onError = () => {
      if (srcAttachedRef.current) setHasError(true);
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('canplaythrough', onCanPlay);
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('canplaythrough', onCanPlay);
      video.removeEventListener('error', onError);
      if (rvfcIdRef.current != null && video.cancelVideoFrameCallback) {
        try { video.cancelVideoFrameCallback(rvfcIdRef.current); } catch {}
        rvfcIdRef.current = null;
      }
    };
  }, []);

  // Viewport-based metadata preload for direct files (mp4/webm).
  // Downloads the moov atom (~50-200KB) when visible so click-to-play is near-instant.
  useEffect(() => {
    if (!src || isHLS) return;
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        if (srcAttachedRef.current) return;
        const video = videoRef.current;
        if (!video) return;
        srcAttachedRef.current = true;
        video.preload = 'metadata';
        video.src = src;
        video.load();
      }
    }, { rootMargin: '200px' });

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, isHLS]);

  // Desktop hover: escalate to preload="auto" so the browser starts buffering
  // actual video data before the user clicks (200-500ms+ head start).
  const handleHover = useCallback(() => {
    if (!srcAttachedRef.current || isHLS) return;
    const video = videoRef.current;
    if (!video || video.preload === 'auto') return;
    video.preload = 'auto';
  }, [isHLS]);

  // Pointer/touch down: escalate preload for fastest possible play on click.
  // If viewport observer hasn't fired yet, attach src now as a fallback.
  const handlePrime = useCallback(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (srcAttachedRef.current) {
      if (!isHLS && video.preload !== 'auto') {
        video.preload = 'auto';
      }
      return;
    }

    if (isHLS) return;

    srcAttachedRef.current = true;
    video.preload = 'auto';
    video.src = src;
    video.load();
  }, [src, isHLS]);

  const handleClick = useCallback(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (currentlyPlayingVideo && currentlyPlayingVideo !== video) {
      try { currentlyPlayingVideo.pause(); } catch {}
    }

    if (onRequestPlay) onRequestPlay();

    if (srcAttachedRef.current) {
      if (video.paused || video.ended) {
        video.preload = 'auto';

        // If metadata preload was interrupted/aborted (bandwidth pressure, etc.),
        // force a reload in user gesture context. load() may fire a synchronous
        // pause event that clears wantPlayRef, so we set wantPlayRef AFTER it.
        if (video.readyState === 0) {
          video.load();
        }

        wantPlayRef.current = true;

        if (posterRef.current && !hasStartedRef.current && !posterTimeoutRef.current) {
          posterTimeoutRef.current = setTimeout(() => {
            posterTimeoutRef.current = null;
            if (!hasStartedRef.current) {
              hasStartedRef.current = true;
              setPosterVisible(false);
            }
          }, 15000);
        }
        video.play().catch(() => {});
      } else {
        video.pause();
      }
      return;
    }

    // First interaction: attach source and play in the same user gesture
    srcAttachedRef.current = true;
    wantPlayRef.current = true;

    if (posterRef.current && !posterTimeoutRef.current) {
      posterTimeoutRef.current = setTimeout(() => {
        posterTimeoutRef.current = null;
        if (!hasStartedRef.current) {
          hasStartedRef.current = true;
          setPosterVisible(false);
        }
      }, 15000);
    }

    if (isHLS) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          startFragPrefetch: true,
          maxBufferLength: 12,
          backBufferLength: 3,
          capLevelToPlayerSize: startQuality !== 'high',
          abrEwmaDefaultEstimate: startQuality === 'high' ? 20_000_000 : 10_000_000,
        });
        hlsRef.current = hls;
        hls.attachMedia(video);
        hls.loadSource(src);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) setHasError(true);
        });
      } else {
        video.src = src;
        video.play().catch(() => {});
      }
    } else {
      video.preload = 'auto';
      video.src = src;
      video.load();
      video.play().catch(() => {});
    }
  }, [src, isHLS, onRequestPlay, startQuality]);

  return (
    <div
      ref={wrapperRef}
      className={`${wrapperClassName || 'media media--video'} is-playable ctphv-wrapper`.trim()}
      onClick={handleClick}
      onPointerDown={handlePrime}
      onTouchStart={handlePrime}
      onPointerEnter={handleHover}
      style={{
        cursor: 'pointer',
        pointerEvents: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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
            zIndex: 2,
            pointerEvents: 'none',
            opacity: posterVisible ? 1 : 0,
            transition: 'opacity 0.18s ease-out',
          }}
        />
      )}
      {!poster && posterVisible && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1a1a',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}
      <video
        ref={videoRef}
        className={`vp-videoEl ctphv-video ${className}`.trim()}
        loop={loop}
        muted={muted}
        playsInline
        controls={false}
        disableRemotePlayback
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        preload="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      {!isPlaying && (
        <div className="playOverlay" style={{ zIndex: 3 }}>
          <span className="playOverlay__icon" />
        </div>
      )}
      {hasError && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'red', fontSize: '12px', zIndex: 4 }}>
          Error loading video
        </div>
      )}
    </div>
  );
}
