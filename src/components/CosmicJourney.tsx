import { useEffect, useMemo, useRef, useState } from "react";
import nebulaBg from "@/assets/nebula-bg.jpg";
import planet from "@/assets/planet.png";
import astronaut from "@/assets/astronaut.png";
import galaxy from "@/assets/galaxy.png";
import moonSurface from "@/assets/moon-surface.png";
import blackhole from "@/assets/blackhole.jpg";
import earth from "@/assets/earth.png";
import spaceship from "@/assets/spaceship.png";
import comet from "@/assets/comet.png";
import asteroids from "@/assets/asteroids.jpg";
import wormhole from "@/assets/wormhole.jpg";
import aurora from "@/assets/aurora.jpg";
import supernova from "@/assets/supernova.jpg";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

/* Smooth-tweened scroll progress (eased toward target for buttery feel) */
function useSmoothScroll() {
  const [progress, setProgress] = useState(0);
  const target = useRef(0);
  const current = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target.current = max > 0 ? window.scrollY / max : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const tick = () => {
      current.current = lerp(current.current, target.current, 0.12);
      setProgress(current.current);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return progress;
}

function StarField({ count = 120, seed = 1 }: { count?: number; seed?: number }) {
  const stars = useMemo(() => {
    let s = seed * 9301;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    return Array.from({ length: count }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * 2 + 0.4,
      delay: rand() * 5,
      duration: 2 + rand() * 5,
    }));
  }, [count, seed]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            boxShadow: `0 0 ${s.size * 4}px rgba(255,255,255,0.9)`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* Intro logo animation NA B IN */
function IntroOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1.2s cubic-bezier(0.65, 0, 0.35, 1)",
      }}
    >
      <div className="absolute inset-0 opacity-60">
        <StarField count={200} seed={42} />
      </div>
      <div className="relative flex items-end gap-3 md:gap-6 font-display">
        {["N", "A", "B", "I", "N"].map((ch, i) => (
          <span
            key={i}
            className={i === 2 ? "text-cosmic" : "text-foreground"}
            style={{
              fontSize: "clamp(4rem, 14vw, 12rem)",
              fontWeight: 300,
              letterSpacing: "-0.04em",
              opacity: 0,
              transform: "translateY(40px) scale(0.9)",
              animation: `letterIn 1s cubic-bezier(0.22, 1, 0.36, 1) ${0.15 + i * 0.12}s forwards`,
              textShadow: "0 0 60px oklch(0.72 0.25 320 / 0.6)",
              marginRight: i === 1 ? "1.5rem" : i === 2 ? "1.5rem" : "0",
            }}
          >
            {ch}
          </span>
        ))}
      </div>
      <p
        className="absolute bottom-[18%] text-xs md:text-sm tracking-[0.6em] uppercase text-foreground/60"
        style={{
          opacity: 0,
          animation: "letterIn 1s ease-out 1.1s forwards",
        }}
      >
        A Cinematic Odyssey
      </p>
    </div>
  );
}

/* Slide config — 18 acts */
type Slide = {
  title: string;
  subtitle: string;
  body: string;
  chapter: string;
  align: "left" | "center" | "right";
  accent: string;
};

const slides: Slide[] = [
  { chapter: "Prelude", title: "NABIN", subtitle: "An Interstellar Odyssey", body: "Scroll into the silence between stars.", align: "center", accent: "oklch(0.85 0.15 85)" },
  { chapter: "I", title: "The Drift", subtitle: "Beyond the Veil", body: "Our atmosphere fades. Only frequency remains.", align: "left", accent: "oklch(0.78 0.18 220)" },
  { chapter: "II", title: "Pale Blue", subtitle: "Home, Receding", body: "A fragile sphere — every story we know.", align: "right", accent: "oklch(0.75 0.16 230)" },
  { chapter: "III", title: "Comet Trail", subtitle: "Frozen Light", body: "Ancient ice, hurled across millennia.", align: "left", accent: "oklch(0.85 0.12 200)" },
  { chapter: "IV", title: "Belt of Stones", subtitle: "Silent Debris", body: "Fragments of worlds that never were.", align: "right", accent: "oklch(0.7 0.08 60)" },
  { chapter: "V", title: "The Ringed Giant", subtitle: "Hum of Gravity", body: "A behemoth in violet dust.", align: "left", accent: "oklch(0.85 0.15 85)" },
  { chapter: "VI", title: "Cratered Silence", subtitle: "Ancient Regolith", body: "Footprints that outlast civilizations.", align: "right", accent: "oklch(0.75 0.04 260)" },
  { chapter: "VII", title: "Vessel", subtitle: "Quiet Engines", body: "We sail on photons and patience.", align: "left", accent: "oklch(0.7 0.18 250)" },
  { chapter: "VIII", title: "Suspended", subtitle: "One Traveler", body: "Infinite quiet, a galaxy in glass.", align: "center", accent: "oklch(0.7 0.28 340)" },
  { chapter: "IX", title: "Aurora", subtitle: "Ribbons of Plasma", body: "Magnetism made visible.", align: "right", accent: "oklch(0.75 0.22 145)" },
  { chapter: "X", title: "Supernova", subtitle: "A Star Confesses", body: "In dying, it births the elements of you.", align: "left", accent: "oklch(0.7 0.25 30)" },
  { chapter: "XI", title: "Wormhole", subtitle: "Folded Distance", body: "Geometry surrenders. Time pleats.", align: "center", accent: "oklch(0.7 0.24 290)" },
  { chapter: "XII", title: "Event Horizon", subtitle: "The Great Devourer", body: "Where light forgets the way back.", align: "right", accent: "oklch(0.7 0.2 40)" },
  { chapter: "XIII", title: "Spiral Arm", subtitle: "Breathing Edge", body: "Two hundred billion suns, slowly turning.", align: "left", accent: "oklch(0.85 0.15 85)" },
  { chapter: "XIV", title: "Stardust", subtitle: "We Are Echoes", body: "Of the supernovae that came before us.", align: "center", accent: "oklch(0.7 0.28 340)" },
  { chapter: "XV", title: "Return", subtitle: "Folding Home", body: "The traveler turns. The horizon hums.", align: "right", accent: "oklch(0.78 0.18 220)" },
  { chapter: "XVI", title: "Resonance", subtitle: "All At Once", body: "Every chapter, a single chord.", align: "left", accent: "oklch(0.85 0.15 85)" },
  { chapter: "Coda", title: "NABIN", subtitle: "Until the next drift", body: "The cosmos, still listening.", align: "center", accent: "oklch(0.7 0.28 340)" },
];

const TOTAL = slides.length; // 18

function CaptionPanel({ slide, t }: { slide: Slide; t: number }) {
  // t goes 0 → 1 over the slide range. Fade in 0-0.3, hold to 0.7, fade out 0.7-1
  const fade = t < 0.3 ? t / 0.3 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
  const y = lerp(40, -40, t);
  const align =
    slide.align === "left"
      ? "items-start text-left"
      : slide.align === "right"
        ? "items-end text-right"
        : "items-center text-center";
  return (
    <div className={`h-screen flex flex-col justify-center px-8 md:px-24 ${align}`}>
      <div
        className="max-w-xl"
        style={{
          opacity: clamp(fade),
          transform: `translate3d(0, ${y}px, 0)`,
          transition: "transform 0.05s linear",
        }}
      >
        <p
          className="font-display text-[0.7rem] md:text-xs tracking-[0.5em] uppercase mb-4"
          style={{ color: slide.accent }}
        >
          Chapter {slide.chapter}
        </p>
        <h2 className="font-display font-light text-5xl md:text-7xl leading-[0.95] text-glow mb-4">
          {slide.title}
        </h2>
        <p className="font-display text-base md:text-lg uppercase tracking-[0.3em] text-foreground/70 mb-6">
          {slide.subtitle}
        </p>
        <p className="text-foreground/60 text-sm md:text-base leading-relaxed max-w-md">
          {slide.body}
        </p>
      </div>
    </div>
  );
}

export function CosmicJourney() {
  const p = useSmoothScroll();
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIntroVisible(false), 2400);
    return () => clearTimeout(t);
  }, []);

  // Active slide and local progress within it
  const slidePos = p * TOTAL;
  const idx = clamp(Math.floor(slidePos), 0, TOTAL - 1);

  // Layer transforms — each layer is keyed to a slide range
  const range = (start: number, end: number) =>
    clamp((slidePos - start) / (end - start));

  // helper to get fade for visible window
  const win = (centerIdx: number, width = 1.4) => {
    const d = Math.abs(slidePos - centerIdx);
    return clamp(1 - d / width);
  };

  // Background master — cross-fade backgrounds across journey
  const bgScale = 1 + (slidePos / TOTAL) * 0.6;
  const bgY = -slidePos * 12;

  // Background layers visibility
  const bgNebula = clamp(1 - slidePos / 4);             // slides 0-3
  const bgAsteroids = win(4, 1.5);                       // slide 4
  const bgWormhole = win(11, 1.5);                       // slide 11
  const bgBlackhole = win(12, 1.5);                      // slide 12
  const bgAurora = win(9, 1.5);                          // slide 9
  const bgSupernova = win(10, 1.5);                      // slide 10
  const bgNebulaLate = clamp((slidePos - 13) / 2);       // slides 13+

  // Foreground actors
  const earthOpacity = win(2, 1.4);
  const earthScale = lerp(0.4, 2.2, range(1.5, 2.8));
  const earthY = lerp(50, -30, range(1.5, 2.8));

  const cometOpacity = win(3, 1.2);
  const cometX = lerp(120, -120, range(2.5, 3.8));
  const cometY = lerp(-60, 60, range(2.5, 3.8));

  const planetOpacity = win(5, 1.4);
  const planetScale = lerp(0.4, 2.4, range(4.4, 5.7));
  const planetX = lerp(-30, 0, range(4.4, 5.7));
  const planetY = lerp(40, -10, range(4.4, 5.7));

  const moonOpacity = win(6, 1.4);
  const moonY = lerp(60, -10, range(5.5, 6.7));

  const shipOpacity = win(7, 1.3);
  const shipX = lerp(-110, 110, range(6.4, 7.6));
  const shipY = lerp(20, -10, range(6.4, 7.6));
  const shipScale = lerp(0.5, 1.2, range(6.4, 7.6));

  const astroOpacity = win(8, 1.4);
  const astroScale = lerp(0.5, 1.4, range(7.4, 8.6));
  const astroY = lerp(60, -20, range(7.4, 8.6));
  const astroRot = lerp(-8, 8, range(7.4, 8.6));

  const galaxyOpacity = clamp(win(13, 1.5) + win(16, 1.5) * 0.8 + win(17, 1.5));
  const galaxyScale = lerp(0.3, 2.0, range(12.5, 17));
  const galaxyRot = slidePos * 6;

  const vignette = 0.35 + (slidePos / TOTAL) * 0.3;

  return (
    <main className="relative bg-background text-foreground">
      <IntroOverlay visible={introVisible} />

      {/* CINEMATIC STAGE */}
      <div className="fixed inset-0 overflow-hidden">
        {/* deep base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.12 0.06 285) 0%, oklch(0.05 0.03 285) 70%, oklch(0.02 0.02 285) 100%)",
          }}
        />

        {/* Background image cross-fade stack */}
        <BgImage src={nebulaBg} opacity={Math.max(bgNebula, bgNebulaLate * 0.6)} scale={bgScale} y={bgY} blur={2} />
        <BgImage src={asteroids} opacity={bgAsteroids} scale={bgScale * 1.1} y={bgY} blur={1} />
        <BgImage src={aurora} opacity={bgAurora} scale={bgScale} y={bgY} blur={0} />
        <BgImage src={supernova} opacity={bgSupernova} scale={bgScale * 1.2} y={bgY} blur={0} />
        <BgImage src={wormhole} opacity={bgWormhole} scale={bgScale * 1.3} y={bgY} blur={0} rotate={slidePos * 8} />
        <BgImage src={blackhole} opacity={bgBlackhole} scale={bgScale * 1.1} y={bgY} blur={0} />

        {/* Far stars */}
        <div className="absolute inset-0" style={{ transform: `translate3d(0, ${-slidePos * 30}px, 0)` }}>
          <StarField count={140} seed={3} />
        </div>
        {/* Mid stars */}
        <div className="absolute inset-0" style={{ transform: `translate3d(0, ${-slidePos * 80}px, 0)` }}>
          <StarField count={70} seed={7} />
        </div>
        {/* Near stars */}
        <div className="absolute inset-0" style={{ transform: `translate3d(0, ${-slidePos * 160}px, 0)` }}>
          <StarField count={30} seed={11} />
        </div>

        {/* Galaxy (deep finale) */}
        <Actor
          src={galaxy}
          opacity={galaxyOpacity}
          translate={`translate(0, 0)`}
          scale={galaxyScale}
          rotate={galaxyRot}
          blur={(1 - clamp(range(12, 17))) * 8}
          mix="screen"
          glow="0 0 120px oklch(0.85 0.15 85 / 0.6)"
          sizeClass="w-[80vmin] h-[80vmin]"
        />

        {/* Earth */}
        <Actor
          src={earth}
          opacity={earthOpacity}
          translate={`translate(0, ${earthY}vh)`}
          scale={earthScale}
          glow="0 0 80px oklch(0.7 0.18 230 / 0.5)"
        />

        {/* Comet — diagonal streak */}
        <Actor
          src={comet}
          opacity={cometOpacity}
          translate={`translate(${cometX}vw, ${cometY}vh)`}
          scale={1.1}
          rotate={-25}
          glow="0 0 60px oklch(0.85 0.15 200 / 0.6)"
        />

        {/* Planet (Saturn-like) */}
        <Actor
          src={planet}
          opacity={planetOpacity}
          translate={`translate(${planetX}vw, ${planetY}vh)`}
          scale={planetScale}
          glow="0 60px 120px oklch(0 0 0 / 0.8)"
          sizeClass="w-[70vmin] h-[70vmin]"
        />

        {/* Moon foreground */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            opacity: moonOpacity,
            transform: `translate3d(0, ${moonY}vh, 0) scale(1.3)`,
            transformOrigin: "bottom center",
          }}
        >
          <img
            src={moonSurface}
            alt=""
            className="w-full"
            loading="lazy"
            style={{
              maskImage: "linear-gradient(to top, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 60%, transparent 100%)",
              filter: "brightness(0.4) contrast(1.3)",
            }}
          />
        </div>

        {/* Spaceship */}
        <Actor
          src={spaceship}
          opacity={shipOpacity}
          translate={`translate(${shipX}vw, ${shipY}vh)`}
          scale={shipScale}
          glow="0 0 60px oklch(0.7 0.18 250 / 0.5)"
          sizeClass="w-[55vmin] h-[55vmin]"
        />

        {/* Astronaut */}
        <Actor
          src={astronaut}
          opacity={astroOpacity}
          translate={`translate(0, ${astroY}vh)`}
          scale={astroScale}
          rotate={astroRot}
          glow="0 30px 80px oklch(0 0 0 / 0.9)"
          sizeClass="w-[55vmin] h-[55vmin]"
          drift
        />

        {/* Lens flare */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${20 + p * 30}%`,
            left: `${65 - p * 50}%`,
            width: 500,
            height: 500,
            background: "radial-gradient(circle, oklch(0.85 0.15 85 / 0.35), transparent 60%)",
            filter: "blur(50px)",
            mixBlendMode: "screen",
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, oklch(0 0 0 / ${vignette}) 100%)`,
          }}
        />

        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      {/* TOP NAV */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 py-5 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-cosmic" style={{ boxShadow: "var(--shadow-glow)" }} />
          <span className="font-display tracking-[0.5em] text-sm md:text-base">
            <span className="text-foreground">NA</span>
            <span className="text-cosmic">B</span>
            <span className="text-foreground">IN</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs tracking-[0.4em] uppercase text-foreground/50 font-display pointer-events-auto">
          <span>Odyssey</span>
          <span>{String(idx + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}</span>
          <span>{slides[idx].chapter}</span>
        </div>
      </header>

      {/* SLIDE NAV DOTS */}
      <nav className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5">
        {slides.map((_, i) => {
          const active = i === idx;
          return (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                window.scrollTo({ top: (i / TOTAL) * max + 10, behavior: "smooth" });
              }}
              className="group relative flex items-center justify-end gap-2"
            >
              <span
                className="text-[0.6rem] tracking-[0.3em] uppercase text-foreground/60 opacity-0 group-hover:opacity-100"
                style={{ transition: "opacity 0.3s" }}
              >
                {slides[i].chapter}
              </span>
              <span
                className="block rounded-full"
                style={{
                  width: active ? 24 : 6,
                  height: 6,
                  background: active ? slides[i].accent : "oklch(1 0 0 / 0.3)",
                  boxShadow: active ? `0 0 12px ${slides[i].accent}` : "none",
                  transition: "width 0.4s cubic-bezier(0.22,1,0.36,1), background 0.3s",
                }}
              />
            </button>
          );
        })}
      </nav>

      {/* PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none">
        <div
          className="h-full bg-cosmic"
          style={{ width: `${p * 100}%`, boxShadow: "var(--shadow-glow)", transition: "width 0.05s linear" }}
        />
      </div>

      {/* Bottom hint */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
        style={{ opacity: clamp(1 - slidePos * 1.2) }}
      >
        <span className="text-[0.6rem] tracking-[0.5em] uppercase text-foreground/50 font-display">Scroll</span>
        <span className="block w-px h-10 bg-gradient-to-b from-foreground/60 to-transparent" style={{ animation: "scrollHint 2s ease-in-out infinite" }} />
      </div>

      {/* SCROLL CONTENT — virtual height = TOTAL screens */}
      <div className="relative z-10">
        {slides.map((slide, i) => {
          const t = clamp(slidePos - i);
          return <CaptionPanel key={i} slide={slide} t={t} />;
        })}
      </div>
    </main>
  );
}

function BgImage({
  src,
  opacity,
  scale,
  y,
  blur = 0,
  rotate = 0,
}: {
  src: string;
  opacity: number;
  scale: number;
  y: number;
  blur?: number;
  rotate?: number;
}) {
  if (opacity <= 0.01) return null;
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity,
        transform: `translate3d(0, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`,
        filter: `blur(${blur}px) brightness(0.7)`,
        transition: "opacity 0.4s ease-out",
      }}
    >
      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
}

function Actor({
  src,
  opacity,
  translate,
  scale,
  rotate = 0,
  blur = 0,
  glow,
  mix,
  sizeClass = "w-[60vmin] h-[60vmin]",
  drift,
}: {
  src: string;
  opacity: number;
  translate: string;
  scale: number;
  rotate?: number;
  blur?: number;
  glow?: string;
  mix?: string;
  sizeClass?: string;
  drift?: boolean;
}) {
  if (opacity <= 0.01) return null;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        opacity,
        transform: `${translate} scale(${scale}) rotate(${rotate}deg)`,
        filter: `blur(${blur}px)`,
        transition: "opacity 0.4s ease-out",
      }}
    >
      <img
        src={src}
        alt=""
        className={`${sizeClass} object-contain`}
        loading="lazy"
        style={{
          filter: glow ? `drop-shadow(${glow})` : undefined,
          mixBlendMode: mix as any,
          animation: drift ? "drift 8s ease-in-out infinite" : undefined,
        }}
      />
    </div>
  );
}