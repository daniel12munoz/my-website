import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

function HlsVideo({ src, ...props }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

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

  return <video ref={videoRef} {...props} />;
}

export default HlsVideo;