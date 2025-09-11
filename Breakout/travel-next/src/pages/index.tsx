import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Dynamically import the ripple effect to avoid SSR issues
    const initRipple = async () => {
      try {
        const { initFaviconRippleEffect } = await import('../effects/RippleEffect.js');
        initFaviconRippleEffect();
      } catch (error) {
        console.warn('Failed to load ripple effect:', error);
      }
    };

    initRipple();

    // Video optimization and error handling
    const video = videoRef.current;
    if (video) {
      // Add error handling for video
      video.addEventListener('error', () => {
        console.warn('Video failed to load, falling back to background image');
        document.body.classList.add('video-fallback');
      });

      // Ensure video plays (some browsers require user interaction)
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.warn('Video autoplay failed:', error);
          // Fallback to background image if video can't autoplay
          document.body.classList.add('video-fallback');
        }
      };

      playVideo();
    }
  }, []);

  return (
    <>
      <div className="hero-section">
        {/* Background Video */}
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/assets/BG-Video.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>

        <div className="favicon-container">
          <Image 
            src="/assets/favicon-w.png" 
            alt="Flag" 
            className="favicon-image"
            width={975}
            height={975}
            priority
          />
        </div>
        
        <div className="dancer-container">
          <Image 
            src="/assets/dancer.PNG" 
            alt="Dancer" 
            className="dancer-image"
            width={100}
            height={75}
            priority
          />
        </div>

        {/* <div className="radio-container">
          <Image 
            src="/assets/radio.png"
            alt="Radio"
            className="radio-image"
            width={100}
            height={75}
            priority
          />
        </div> */}
      </div>
      <div className="intro-section">
        <h1>Get obsessed with Ceylon!</h1>
        <p>The unmatched beauty in the tropics</p>
      </div>
      {/* <div className="intro-image-section">
        <Image 
          src="/assets/elephant.png" 
          alt="Elephant" 
          className="intro-image"
          width={500}
          height={500}
          priority
        />
      </div> */}
    </>
    
    
  );
}