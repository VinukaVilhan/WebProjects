import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const locationsRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Disable smooth scroll behavior for ScrollTrigger to work properly
    document.documentElement.style.scrollBehavior = 'auto';
    
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
      video.addEventListener('error', () => {
        console.warn('Video failed to load, falling back to background image');
        document.body.classList.add('video-fallback');
      });

      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.warn('Video autoplay failed:', error);
          document.body.classList.add('video-fallback');
        }
      };

      playVideo();
    }

    // Horizontal ScrollTrigger Animation with wrapper
    const wrapper = wrapperRef.current;
    const locationsSection = locationsRef.current;
    
    if (wrapper && locationsSection) {
      const cards = Array.from(locationsSection.children) as HTMLElement[];
      
      // Calculate the total scroll distance needed
      // For 4 cards, we need to scroll 3 card widths (to show cards 2, 3, and 4)
      const totalScrollDistance = window.innerWidth * (cards.length - 1);

      // Create the animation - exactly like the working example
      gsap.to(locationsSection, {
        x: () => -(window.innerWidth * (cards.length - 1)),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1,
          start: "top top",
          // Fixed pixel value like the working example
          end: `+=${totalScrollDistance}`,
          markers: false, // set to true for debugging
        }
      });

      // Refresh on resize with debounce
      let resizeTimer: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 250);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup function
      return () => {
        ScrollTrigger.getAll().forEach(st => st.kill());
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimer);
      };
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
      </div>

      <div className="intro-section">
        <h1>Get obsessed with Ceylon!</h1>
        <p>The unmatched beauty in the tropics</p>
      </div>

      <div ref={wrapperRef} className="horizontal-scroll-wrapper">
        <div ref={locationsRef} className="Locations-Section">
          <div className="location-card">
            <h2>Negombo</h2>
          </div>
          <div className="location-card">
            <h2>Kandy</h2>
          </div>
          <div className="location-card">
            <h2>Galle</h2>
          </div>
          <div className="location-card">
              <Image 
                src="/assets/Jaffna.jpg" 
                alt="Jaffna" 
                width={1000}
                height={900}
                style={{ objectFit: 'contain' }}
                priority
                className="jaffna-image"
              />
            <h2>Jaffna</h2>
          </div>
        </div>
      </div>

      <div className="Image-Section">
        <Image 
          src="/assets/image-1.jpg" 
          alt="Image 1" 
          width={1000}
          height={1000}
          priority
        />
        <Image 
          src="/assets/Man.svg" 
          alt="Image 2" 
          width={1000}
          height={1000}
          priority
        />
      </div>
    </>
  );
}