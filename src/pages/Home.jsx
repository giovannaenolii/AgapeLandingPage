import { useEffect, useRef, useState } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Form from '../components/Form';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ManifestoSection from '../components/ManifestoSection';
import ProductsInUse from '../components/ProductsInUse';
import { useTheme } from '../context/ThemeContext';
import { isLowPowerDevice, prefersReducedMotion } from '../utils/devicePerformance';

function DeferredGrainient({ className, ...grainientProps }) {
  const containerRef = useRef(null);
  const [GrainientComponent, setGrainientComponent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadGrainient = () => {
      import('../components/Grainient').then(({ default: Component }) => {
        if (!cancelled) setGrainientComponent(() => Component);
      }).catch(() => {});
    };

    const container = containerRef.current;
    if (!container || !('IntersectionObserver' in window)) {
      loadGrainient();
      return () => { cancelled = true; };
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.01) {
        observer.disconnect();
        loadGrainient();
      }
    }, { threshold: 0.01 });

    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{ background: `linear-gradient(135deg, ${grainientProps.color1}, ${grainientProps.color2}, ${grainientProps.color3})` }}
    >
      {GrainientComponent && <GrainientComponent {...grainientProps} />}
    </div>
  );
}

function Home() {
  const { isDark } = useTheme();

  useEffect(() => {
    if (isLowPowerDevice() || prefersReducedMotion()) return undefined;

    let lenis = null;
    let animationFrame = null;
    let cancelled = false;

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      const raf = (time) => {
        lenis.raf(time);
        animationFrame = requestAnimationFrame(raf);
      };
      animationFrame = requestAnimationFrame(raf);
    }).catch(() => {
      // Native scrolling remains available if the optional smooth-scroll chunk fails.
    });

    return () => {
      cancelled = true;
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      lenis?.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-primary selection:text-white bg-[var(--bg-color)]">
      <Navbar />
      
      {/* Hero Section - Fixed/Sticky for Stacking Effect */}
      <section className="sticky top-0 h-screen w-full z-0 overflow-hidden">
        <Hero />
      </section>
      
      {/* Main Content - Slides over Hero */}
      <main className={`site-main site-main--${isDark ? 'dark' : 'light'} relative z-10 transition-all duration-700`}>
        <DeferredGrainient
          className="site-main__grainient"
            color1={isDark ? '#000043' : '#d0d0d1'}
            color2={isDark ? '#003f76' : '#468bc9'}
            color3={isDark ? '#c1dffa' : '#afd8ff'}
            timeSpeed={0.25}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2.1}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0}
            grainScale={2.1}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
        />
        <div className="site-main__content">
          <Features />
          <ProductsInUse />
          <ManifestoSection />
          <Form />
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default Home;
