import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';

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
  const hlsRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Set up HLS if src is an HLS URL (.m3u8)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const isHLS = src.endsWith('.m3u8');
    
    if (!isHLS) {
      // For non-HLS sources, the existing source tag will handle it
      return;
    }

    // Clean up previous HLS instance if it exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Check if native HLS is supported (Safari)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const canPlayHLS = video.canPlayType('application/vnd.apple.mpegurl');

    if (canPlayHLS || isSafari) {
      // Safari and other browsers with native HLS support
      video.src = src;
    } else if (Hls.isSupported()) {
      // Use hls.js for browsers that don't support native HLS
      const hls = new Hls({ enableWorker: true });
      hlsRef.current = hls;
      
      hls.attachMedia(video);
      hls.loadSource(src);
    } else {
      // Fallback: try setting src directly (might work in some cases)
      video.src = src;
    }

    // Cleanup function
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

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
  }, []);

  useEffect(() => {
    if (!forcePause) return;

    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
    }
    setIsPlaying(false);
  }, [forcePause]);

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

  return (
    <div
      className={`${wrapperClassName} is-playable`.trim()}
      onClick={handleToggle}
    >
      <video
        ref={videoRef}
        loop={loop}
        muted={muted}
        playsInline
        preload={preload}
        controls={false}
        className={videoClassName}
        onError={handleError}
        onLoadedData={handleLoadedData}
        {...rest}
      >
        {!isHLS && <source src={src} type={getVideoType(src)} />}
      </video>
      {!isPlaying && (
        <div className="playOverlay">
          <span className="playOverlay__icon" />
        </div>
      )}
    </div>
  );
}

