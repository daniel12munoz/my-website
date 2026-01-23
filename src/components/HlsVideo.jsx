import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import Hls from 'hls.js';

// Helper to get Cloudflare Stream poster thumbnail from manifest URL
function getCloudflarePoster(src) {
  if (!src) return null;
  // Match: https://customer-XXXX.cloudflarestream.com/<VIDEO_ID>/manifest/video.m3u8
  const match = src.match(/cloudflarestream\.com\/([^/]+)\//);
  if (!match) return null;
  const id = match[1];
  // Extract customer ID from src
  const customerMatch = src.match(/customer-([^/]+)\.cloudflarestream\.com/);
  const customerId = customerMatch ? customerMatch[1] : 'j47qk7l1wwcd8bxv'; // fallback
  return `https://customer-${customerId}.cloudflarestream.com/${id}/thumbnails/thumbnail.jpg?time=0s`;
}

const HlsVideo = forwardRef(function HlsVideo({ 
  src, 
  autoPlay, 
  priority, 
  poster: posterProp,
  lazy = true,
  preferHd = true,
  ...props 
}, ref) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const abrReenableTimeoutRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(!lazy);

  // Expose the video element ref to parent components
  useImperativeHandle(ref, () => videoRef.current, []);

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    if (!lazy) return;
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
  }, [lazy]);

  // Initialize HLS/native video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !shouldLoad) return;

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
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false, // Disable for VOD (not live streams)
        startFragPrefetch: true,
        capLevelToPlayerSize: true,
        maxBufferLength: 12,
        backBufferLength: 3,
        maxStarvationDelay: 2, // Small delay before switching down
        // Much higher initial bandwidth estimate to avoid starting at 180p
        abrEwmaDefaultEstimate: 10000000, // 10 Mbps default estimate
        abrBandWidthFactor: 1.2, // Slightly > 1 for faster ramp
        abrBandWidthUpFactor: 1.3, // > 1 for aggressive up-ramp
        startLevel: -1 // Let us set it after manifest
      });
      hlsRef.current = hls;
      
      hls.attachMedia(video);
      hls.loadSource(src);
      
      // Select optimal level after manifest is parsed based on player size
      let fragBufferedCount = 0;
      let fragBufferedHandler = null;
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (preferHd) {
          const levels = hls.levels;
          if (levels && levels.length > 0) {
            // Capture props values before rAF
            const currentPreload = props.preload || 'metadata';
            const isPriority = priority === true;
            
            // Wait one animation frame so clientHeight is correct (layout is final)
            requestAnimationFrame(() => {
              // Get actual player height (use multiple methods for accuracy)
              const rect = video.getBoundingClientRect();
              const playerHeight = Math.round(rect.height || video.clientHeight || video.offsetHeight || 0);
              
              // Hero-only minimum 720p logic (not all videos)
              // Hero videos: priority === true OR preload === 'auto' AND large player height
              const isHeroLike = isPriority || (currentPreload === 'auto' && playerHeight >= 420);
              const targetHeight = isHeroLike 
                ? Math.max(playerHeight, 720)  // Hero: minimum 720p
                : Math.max(playerHeight, 360);  // Small cards: minimum 360p
              
              // Find the highest level whose height is >= targetHeight (or closest above)
              let preferredStartLevel = -1;
              let bestMatch = levels.length - 1; // Default to highest quality
              
              for (let i = levels.length - 1; i >= 0; i--) {
                const level = levels[i];
                if (level.height >= targetHeight) {
                  preferredStartLevel = i;
                  break;
                }
                // Track best match (highest quality available)
                if (level.height > (levels[bestMatch]?.height || 0) || bestMatch === levels.length - 1) {
                  bestMatch = i;
                }
              }
              
              // Use preferred level if found, otherwise use best match
              const chosenLevel = preferredStartLevel !== -1 ? preferredStartLevel : bestMatch;
              
              // FORCE startup at chosen level by temporarily disabling ABR
              hls.autoLevelEnabled = false;
              hls.nextLoadLevel = chosenLevel; // Force next load
              hls.loadLevel = chosenLevel;
              hls.startLevel = chosenLevel;
              hls.currentLevel = chosenLevel;
              
              // Explicitly restart loading at the chosen level
              hls.startLoad(0);
              
              // Track fragments to re-enable ABR after startup
              fragBufferedCount = 0;
              fragBufferedHandler = () => {
                fragBufferedCount++;
                // Re-enable ABR after 2 fragments are buffered AND we're at/near chosen level
                if (fragBufferedCount >= 2 && hls.autoLevelEnabled === false) {
                  const currentLevel = hls.currentLevel !== -1 ? hls.currentLevel : hls.loadLevel;
                  // Only re-enable if we're actually at the chosen level (or close)
                  if (currentLevel >= chosenLevel - 1) {
                    hls.autoLevelEnabled = true;
                    if (fragBufferedHandler) {
                      hls.off(Hls.Events.FRAG_BUFFERED, fragBufferedHandler);
                      fragBufferedHandler = null;
                    }
                  }
                }
              };
              hls.on(Hls.Events.FRAG_BUFFERED, fragBufferedHandler);
              
              // Fallback: re-enable ABR after 2.5 seconds even if fragments aren't counted
              abrReenableTimeoutRef.current = setTimeout(() => {
                if (hls && hls.autoLevelEnabled === false) {
                  hls.autoLevelEnabled = true;
                  if (fragBufferedHandler) {
                    hls.off(Hls.Events.FRAG_BUFFERED, fragBufferedHandler);
                    fragBufferedHandler = null;
                  }
                }
              }, 2500);
            });
          }
        }
        
        // Try to autoplay if requested
        if (autoPlay && video.muted) {
          video.play().catch(() => {
            // Autoplay failed, ignore
          });
        }
      });
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
      // Clean up ABR re-enable timeout
      if (abrReenableTimeoutRef.current) {
        clearTimeout(abrReenableTimeoutRef.current);
        abrReenableTimeoutRef.current = null;
      }
      if (hlsRef.current) {
        // Clean up any pending ABR re-enable timeout
        const hls = hlsRef.current;
        if (hls.autoLevelEnabled === false) {
          hls.autoLevelEnabled = true; // Re-enable before destroy
        }
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, shouldLoad, preferHd]); // Removed autoPlay from deps to prevent recreation on play/pause

  // Auto-generate poster if not provided and src is HLS
  const poster = posterProp || (src && src.endsWith('.m3u8') ? getCloudflarePoster(src) : null);

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

  return (
    <video
      ref={videoRef}
      autoPlay={autoPlay}
      controls={false}
      disableRemotePlayback
      disablePictureInPicture
      controlsList="nodownload noplaybackrate noremoteplayback"
      poster={poster}
      playsInline={true}
      preload={shouldLoad ? (props.preload || 'metadata') : 'none'}
      className={finalClassName}
      style={{ backgroundColor: "#000", ...restProps.style }}
      {...restProps}
    />
  );
});

export default HlsVideo;