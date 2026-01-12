import React, { useRef, useState, useEffect } from 'react';

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
        <source src={src} type={getVideoType(src)} />
      </video>
      {!isPlaying && (
        <div className="playOverlay">
          <span className="playOverlay__icon" />
        </div>
      )}
    </div>
  );
}

