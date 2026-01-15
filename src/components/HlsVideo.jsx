import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Hls from 'hls.js';

const HlsVideo = forwardRef(function HlsVideo({ src, autoPlay, ...props }, ref) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // Expose the video element ref to parent components
  useImperativeHandle(ref, () => videoRef.current, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Clean up previous HLS instance if it exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Check if native HLS is supported
    const canPlayHLS = video.canPlayType('application/vnd.apple.mpegurl') === 'maybe' || 
                       video.canPlayType('application/vnd.apple.mpegurl') === 'probably';

    if (canPlayHLS) {
      // Native HLS support (Safari, iOS Safari)
      video.src = src;
      // Try to autoplay if requested
      if (autoPlay && video.muted) {
        video.play().catch(() => {
          // Autoplay failed, ignore
        });
      }
    } else if (Hls.isSupported()) {
      // Use hls.js for browsers that don't support native HLS (Chrome, Firefox, etc.)
      const hls = new Hls({ enableWorker: true });
      hlsRef.current = hls;
      
      hls.attachMedia(video);
      hls.loadSource(src);
      
      // Try to autoplay if requested
      if (autoPlay && video.muted) {
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {
            // Autoplay failed, ignore
          });
        });
      }
    } else {
      // Fallback: try setting src directly (might work in some cases)
      video.src = src;
      if (autoPlay && video.muted) {
        video.play().catch(() => {
          // Autoplay failed, ignore
        });
      }
    }

    // Cleanup function
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay]);

  return <video ref={videoRef} autoPlay={autoPlay} {...props} />;
});

export default HlsVideo;