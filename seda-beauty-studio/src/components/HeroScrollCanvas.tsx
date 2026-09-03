import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, ArrowDown, Play, Pause, Calendar, Instagram, MapPin, Star } from 'lucide-react';
import { STUDIO_INFO } from '../data/mockData';

// High-resolution beauty atelier frames for the scroll sequence
const HERO_FRAMES = [
  {
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop',
    title: 'Seda Beauty Studio',
    subtitle: 'Atelier of Refined Femininity',
    description: 'Yerevan’s premier destination for bespoke lashes, sculptural brows, and luminous skin rituals.',
    highlight: 'Sayat-Nova Ave · Kentron, Yerevan',
  },
  {
    src: 'https://images.unsplash.com/photo-1587754256282-a11d04e3472d?q=80&w=1600&auto=format&fit=crop',
    title: 'Weightless Lash Artistry',
    subtitle: 'From Natural 1:1 to Featherlight Russian Volume',
    description: 'Every fan handcrafted with medical-grade hypoallergenic Korean silk to protect your natural lashes.',
    highlight: 'Lasting 4–5 Weeks Retention',
  },
  {
    src: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1600&auto=format&fit=crop',
    title: 'Architectural Brows',
    subtitle: 'Facial Symmetry & Keratin Lamination',
    description: 'Precision caliper mapping calibrated to your unique bone structure for effortlessly full, feathered arches.',
    highlight: 'Bronsun Hybrid & Botox Infusion',
  },
  {
    src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1600&auto=format&fit=crop',
    title: 'Radiance Skin & Nails',
    subtitle: 'European Facials & Russian Hardware Manicure',
    description: 'Complete beauty care under one roof. Clean lines, sterile autoclave instruments, and deep rejuvenation.',
    highlight: '100% Sterile & Certified Salon',
  },
];

interface HeroScrollCanvasProps {
  onBookClick: () => void;
  onExploreServices: () => void;
}

export const HeroScrollCanvas: React.FC<HeroScrollCanvasProps> = ({
  onBookClick,
  onExploreServices,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const autoPlayAnimRef = useRef<number | null>(null);

  // Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    HERO_FRAMES.forEach((frame, idx) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = frame.src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === HERO_FRAMES.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        // Even if error, keep going
        loadedCount++;
        if (loadedCount === HERO_FRAMES.length) {
          setImagesLoaded(true);
        }
      };
      loadedImages[idx] = img;
    });

    imagesRef.current = loadedImages;
  }, []);

  // Draw frame on canvas with Ken Burns zoom, smooth crossfade & luxury warmth
  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    const totalFrames = HERO_FRAMES.length;
    const frameIndexFloat = progress * (totalFrames - 1);
    const baseIndex = Math.min(Math.floor(frameIndexFloat), totalFrames - 2);
    const blend = frameIndexFloat - baseIndex;
    const nextIndex = Math.min(baseIndex + 1, totalFrames - 1);

    const imgA = imagesRef.current[baseIndex];
    const imgB = imagesRef.current[nextIndex];

    const renderImg = (img: HTMLImageElement | undefined, alpha: number, zoomOffset: number) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Calculate cover aspect ratio
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = width / height;

      let drawW = width;
      let drawH = height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawH = width / imgRatio;
        offsetY = (height - drawH) / 2;
      } else {
        drawW = height * imgRatio;
        offsetX = (width - drawW) / 2;
      }

      // Apply subtle Ken Burns cinematic zoom
      const zoom = 1.0 + zoomOffset * 0.08;
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      ctx.restore();
    };

    if (imgA) {
      renderImg(imgA, 1.0, blend * 0.5);
    }
    if (imgB && blend > 0.001) {
      renderImg(imgB, blend, (1 - blend) * 0.5);
    }

    // Warm organic / cultural luxury color grade overlay (warm coffee and terracotta veil)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(40, 23, 14, 0.42)');
    gradient.addColorStop(0.4, 'rgba(45, 27, 17, 0.32)');
    gradient.addColorStop(0.8, 'rgba(32, 18, 11, 0.72)');
    gradient.addColorStop(1, 'rgba(23, 13, 8, 0.90)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle golden / terracotta dust particles floating based on progress
    ctx.save();
    ctx.fillStyle = 'rgba(212, 163, 115, 0.35)';
    for (let i = 0; i < 28; i++) {
      const seedX = (i * 137.5) % width;
      const seedY = ((i * 219.3 + progress * 400) % height);
      const size = (i % 3) + 1.2;
      ctx.beginPath();
      ctx.arc(seedX, seedY, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }, []);

  // Update canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      drawFrame(scrollProgress);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, scrollProgress]);

  // Scroll listener that drives the canvas
  useEffect(() => {
    const handleScroll = () => {
      if (isPlaying) return; // Don't override if auto-playing
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(1, Math.max(0, currentScroll / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPlaying]);

  // Render on progress change
  useEffect(() => {
    drawFrame(scrollProgress);
  }, [scrollProgress, drawFrame, imagesLoaded]);

  // Autoplay feature for easy demo preview
  useEffect(() => {
    if (!isPlaying) {
      if (autoPlayAnimRef.current) cancelAnimationFrame(autoPlayAnimRef.current);
      return;
    }

    let start: number | null = null;
    const duration = 12000; // 12 seconds full loop

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const newProgress = (elapsed % duration) / duration;
      setScrollProgress(newProgress);
      autoPlayAnimRef.current = requestAnimationFrame(step);
    };

    autoPlayAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (autoPlayAnimRef.current) cancelAnimationFrame(autoPlayAnimRef.current);
    };
  }, [isPlaying]);

  // Determine which text overlay is active based on progress
  const activeFrameIndex = Math.min(
    Math.floor(scrollProgress * HERO_FRAMES.length),
    HERO_FRAMES.length - 1
  );
  const activeFrame = HERO_FRAMES[activeFrameIndex];

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    const val = parseFloat(e.target.value);
    setScrollProgress(val);
  };

  const jumpToFrame = (index: number) => {
    setIsPlaying(false);
    const targetProgress = index / (HERO_FRAMES.length - 1);
    setScrollProgress(targetProgress);

    // Also scroll window slightly into container if user is at the very top
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      const targetScrollY = window.scrollY + rect.top + targetProgress * totalScrollable;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-[240vh] md:h-[280vh] bg-[#23140C]"
    >
      {/* Sticky viewport stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Canvas background that responds to scroll position */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#1A1A1A]/80 to-transparent pointer-events-none z-1" />

        {/* Top Floating Mini-Bar: Location & Rating */}
        <div className="relative z-10 pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[#2D1B10]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#EAE0D5]/20 text-xs md:text-sm text-[#FDFBF7]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-[#FDFBF7]">Open Today in Kentron, Yerevan</span>
            <span className="text-[#D4A373]">•</span>
            <span className="flex items-center gap-1 text-[#D4A373]">
              <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
              4.96 (380+ reviews)
            </span>
          </div>

          <a
            href={STUDIO_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs md:text-sm text-[#FDFBF7] hover:text-white bg-[#2D1B10]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#EAE0D5]/20 hover:border-[#D4A373]/60 transition-colors"
          >
            <Instagram className="w-4 h-4 text-[#D4A373]" />
            <span>@{STUDIO_INFO.instagramHandle}</span>
          </a>
        </div>

        {/* Dynamic Center Hero Content */}
        <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center my-auto">
          <div className="max-w-2xl text-left transition-all duration-500 ease-out">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#432818]/80 border border-[#D4A373]/40 text-[#EAE0D5] text-xs uppercase tracking-widest font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{activeFrame.subtitle}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-[#FDFBF7] leading-[1.08] tracking-tight mb-4 drop-shadow-md">
              {activeFrame.title}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#EAE0D5] font-light leading-relaxed mb-6 max-w-xl">
              {activeFrame.description}
            </p>

            {/* Quick highlight badge */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-[#EAE0D5] mb-8 font-medium">
              <MapPin className="w-4 h-4 text-[#D4A373] flex-shrink-0" />
              <span>{activeFrame.highlight}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                id="hero-book-now-btn"
                onClick={onBookClick}
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#D4A373] hover:bg-[#c79462] text-[#432818] font-bold text-sm tracking-wide uppercase transition-all duration-300 shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4 text-[#432818] group-hover:scale-110 transition-transform" />
                <span>Book Your Experience</span>
              </button>

              <button
                id="hero-explore-services-btn"
                onClick={onExploreServices}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#432818]/70 hover:bg-[#432818]/95 text-[#FDFBF7] border border-[#D4A373] font-medium text-sm transition-all duration-200"
              >
                <span>Explore Services</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Scroll-Scrubber Bar */}
        <div className="relative z-10 px-6 md:px-12 pb-8 max-w-7xl mx-auto w-full">
          <div className="bg-[#2D1B10]/90 backdrop-blur-lg border border-[#EAE0D5]/20 rounded-[24px] p-3 md:p-4 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Play/pause and frame indicators */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full bg-[#432818] hover:bg-[#321c0f] border border-[#D4A373]/30 text-[#FDFBF7] transition-colors"
                title={isPlaying ? 'Pause sequence' : 'Play sequence preview'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>Auto-Tour</span>
                  </>
                )}
              </button>

              {/* Step pills */}
              <div className="flex items-center gap-1.5">
                {HERO_FRAMES.map((f, i) => (
                  <button
                    key={f.title}
                    onClick={() => jumpToFrame(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeFrameIndex === i
                        ? 'w-8 bg-[#D4A373]'
                        : 'w-2 bg-[#5C3A24] hover:bg-[#855636]'
                    }`}
                    title={`Go to ${f.title}`}
                  />
                ))}
              </div>

              <span className="text-xs text-[#EAE0D5] font-mono">
                0{activeFrameIndex + 1} / 0{HERO_FRAMES.length}
              </span>
            </div>

            {/* Interactive scrub slider */}
            <div className="flex items-center gap-3 w-full md:w-80">
              <span className="text-[11px] text-[#EAE0D5] uppercase tracking-wider font-medium hidden sm:inline">
                Scroll Scrub
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.005"
                value={scrollProgress}
                onChange={handleScrubChange}
                className="w-full h-1.5 bg-[#432818] rounded-lg appearance-none cursor-pointer accent-[#D4A373]"
                aria-label="Hero sequence scrub position"
              />
              <span className="text-xs font-mono text-[#EAE0D5] w-9 text-right">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>

            {/* Scroll down prompt */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-[#EAE0D5]">
              <span>Scroll down to explore</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#D4A373]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
