import { useEffect, useRef, useState } from "react";
import nebulaBg from "@/assets/nebula-bg.jpg";
import planet from "@/assets/planet.png";
import astronaut from "@/assets/astronaut.png";
import galaxy from "@/assets/galaxy.png";
import moonSurface from "@/assets/moon-surface.png";

/* helpers */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const range = (v: number, inMin: number, inMax: number, outMin = 0, outMax = 1) =>
  clamp((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return progress;
}

/* Twinkling starfield */
function StarField({ count = 140 }: { count?: number }) {
  const stars = useRef(
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 4,
      depth: Math.random(),
    }))
  ).current;
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
            opacity: 0.3 + s.depth * 0.7,
            boxShadow: `0 0 ${s.size * 3}px rgba(255,255,255,0.8)`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function CosmicJourney() {
  const p = useScrollProgress();

  // section progresses (5 acts)
  const a0 = range(p, 0.0, 0.18);   // intro
  const a1 = range(p, 0.15, 0.38);  // approach planet
  const a2 = range(p, 0.36, 0.58);  // moon surface
  const a3 = range(p, 0.56, 0.78);  // astronaut
  const a4 = range(p, 0.76, 1.0);   // galaxy finale

  // Background nebula: slow parallax + zoom
  const bgScale = 1 + p * 0.6;
  const bgY = p * -200;
  const bgBlur = lerp(0, 14, Math.abs(0.5 - p) * 1.4);

  // Title
  const titleOpacity = 1 - a0;
  const titleY = -a0 * 200;
  const titleScale = 1 + a0 * 0.4;

  // Planet (Act 1)
  const planetScale = lerp(0.4, 2.6, a1);
  const planetX = lerp(-30, 0, a1);
  const planetY = lerp(40, -10, a1) - a2 * 80;
  const planetOpacity = clamp(a1 * 1.4) * (1 - a2 * 1.2);
  const planetBlur = lerp(20, 0, clamp(a1 * 2)) + a2 * 18;

  // Moon foreground (Act 2)
  const moonY = lerp(60, -10, a2);
  const moonScale = lerp(1.1, 1.6, a2) - a3 * 0.3;
  const moonOpacity = clamp(a2 * 1.5) * (1 - a3 * 1.2);

  // Astronaut (Act 3)
  const astroScale = lerp(0.5, 1.4, a3);
  const astroY = lerp(60, -20, a3) - a4 * 60;
  const astroOpacity = clamp(a3 * 1.5) * (1 - a4 * 1.2);
  const astroRot = lerp(-8, 6, a3);

  // Galaxy finale (Act 4)
  const galaxyScale = lerp(0.2, 2.2, a4);
  const galaxyOpacity = clamp(a4 * 1.4);
  const galaxyRot = a4 * 90 + p * 40;

  // Vignette intensity rises in finale
  const vignette = 0.4 + a4 * 0.4;

  return (
    <main className="relative bg-background text-foreground">
      {/* FIXED CINEMATIC STAGE */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Background nebula */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate3d(0, ${bgY}px, 0) scale(${bgScale})`,
            filter: `blur(${bgBlur}px) brightness(${0.6 + a4 * 0.3})`,
            transition: "filter 0.1s linear",
          }}
        >
          <img
            src={nebulaBg}
            alt=""
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-aurora)" }} />
        </div>

        {/* Far stars */}
        <div
          className="absolute inset-0"
          style={{ transform: `translate3d(0, ${p * -150}px, 0)` }}
        >
          <StarField count={120} />
        </div>

        {/* Mid stars (move faster) */}
        <div
          className="absolute inset-0"
          style={{ transform: `translate3d(0, ${p * -380}px, 0)` }}
        >
          <StarField count={60} />
        </div>

        {/* Galaxy (very far, finale) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: galaxyOpacity,
            transform: `translate3d(0, ${(1 - a4) * 60}px, 0) scale(${galaxyScale}) rotate(${galaxyRot}deg)`,
            filter: `blur(${(1 - a4) * 12}px)`,
          }}
        >
          <img
            src={galaxy}
            alt=""
            className="w-[80vmin] h-[80vmin] object-contain mix-blend-screen"
            width={1024}
            height={1024}
            loading="lazy"
            style={{ filter: "drop-shadow(0 0 120px oklch(0.85 0.15 85 / 0.6))" }}
          />
        </div>

        {/* Planet midground */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: planetOpacity,
            transform: `translate3d(${planetX}vw, ${planetY}vh, 0) scale(${planetScale})`,
            filter: `blur(${planetBlur}px) drop-shadow(0 60px 120px oklch(0 0 0 / 0.8))`,
          }}
        >
          <img
            src={planet}
            alt=""
            className="w-[70vmin] h-[70vmin] object-contain"
            width={1024}
            height={1024}
            loading="lazy"
          />
        </div>

        {/* Astronaut */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: astroOpacity,
            transform: `translate3d(0, ${astroY}vh, 0) scale(${astroScale}) rotate(${astroRot}deg)`,
            filter: "drop-shadow(0 30px 80px oklch(0 0 0 / 0.9))",
          }}
        >
          <img
            src={astronaut}
            alt=""
            className="w-[55vmin] h-[55vmin] object-contain"
            width={1024}
            height={1024}
            loading="lazy"
            style={{ animation: "drift 8s ease-in-out infinite" }}
          />
        </div>

        {/* Moon foreground */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            opacity: moonOpacity,
            transform: `translate3d(0, ${moonY}vh, 0) scale(${moonScale})`,
            transformOrigin: "bottom center",
            filter: `blur(${a3 * 8}px)`,
          }}
        >
          <img
            src={moonSurface}
            alt=""
            className="w-full object-cover"
            width={1920}
            height={800}
            loading="lazy"
            style={{
              maskImage: "linear-gradient(to top, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 60%, transparent 100%)",
              filter: "brightness(0.4) contrast(1.3)",
            }}
          />
        </div>

        {/* Cinematic vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, oklch(0 0 0 / ${vignette}) 100%)`,
          }}
        />

        {/* Light leak / lens flare */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${20 + p * 30}%`,
            left: `${60 - p * 40}%`,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, oklch(0.85 0.15 85 / 0.4), transparent 60%)",
            filter: "blur(40px)",
            opacity: 0.6,
          }}
        />
      </div>

      {/* SCROLL CONTENT — text overlays anchored to virtual scroll height */}
      <div className="relative z-10">
        {/* Act 0: Title */}
        <section className="h-screen flex items-center justify-center px-6">
          <div
            className="text-center max-w-4xl"
            style={{
              opacity: titleOpacity,
              transform: `translate3d(0, ${titleY}px, 0) scale(${titleScale})`,
            }}
          >
            <p className="font-display text-sm tracking-[0.5em] uppercase text-cosmic mb-6">
              An Interstellar Voyage
            </p>
            <h1 className="font-display font-light text-7xl md:text-9xl leading-[0.9] text-glow mb-8">
              ODYSSEY
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-xl mx-auto font-light">
              Scroll to drift beyond the silence — through nebulae, ringed giants, and the breathing edge of the galaxy.
            </p>
            <div className="mt-16 flex flex-col items-center gap-3">
              <span className="text-xs tracking-[0.4em] uppercase text-foreground/50">Scroll</span>
              <span className="block w-px h-16 bg-gradient-to-b from-foreground/60 to-transparent" />
            </div>
          </div>
        </section>

        {/* Act 1 caption */}
        <section className="h-screen flex items-center px-8 md:px-20">
          <div
            className="max-w-md"
            style={{ opacity: a1 < 0.4 ? a1 * 2.5 : 1 - (a1 - 0.4) * 1.6 }}
          >
            <p className="font-display text-xs tracking-[0.4em] uppercase text-[oklch(0.85_0.15_85)] mb-4">
              Chapter I
            </p>
            <h2 className="font-display font-light text-5xl md:text-6xl leading-tight text-glow mb-6">
              The Ringed Giant
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              A quiet behemoth, suspended in violet dust. Its rings hum with the gravity of a thousand worlds.
            </p>
          </div>
        </section>

        {/* Act 2 caption */}
        <section className="h-screen flex items-end justify-end px-8 md:px-20 pb-32">
          <div
            className="max-w-md text-right"
            style={{ opacity: a2 < 0.4 ? a2 * 2.5 : 1 - (a2 - 0.4) * 1.6 }}
          >
            <p className="font-display text-xs tracking-[0.4em] uppercase text-[oklch(0.78_0.18_220)] mb-4">
              Chapter II
            </p>
            <h2 className="font-display font-light text-5xl md:text-6xl leading-tight text-glow mb-6">
              Cratered Silence
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              Ancient regolith glows under starlight. Footprints that will outlast civilizations.
            </p>
          </div>
        </section>

        {/* Act 3 caption */}
        <section className="h-screen flex items-center px-8 md:px-20">
          <div
            className="max-w-md"
            style={{ opacity: a3 < 0.4 ? a3 * 2.5 : 1 - (a3 - 0.4) * 1.6 }}
          >
            <p className="font-display text-xs tracking-[0.4em] uppercase text-[oklch(0.7_0.28_340)] mb-4">
              Chapter III
            </p>
            <h2 className="font-display font-light text-5xl md:text-6xl leading-tight text-glow mb-6">
              Suspended in Awe
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              One traveler. Infinite quiet. The visor reflects galaxies older than memory.
            </p>
          </div>
        </section>

        {/* Act 4 finale */}
        <section className="h-screen flex items-center justify-center px-6">
          <div
            className="text-center max-w-3xl"
            style={{ opacity: a4 }}
          >
            <p className="font-display text-xs tracking-[0.4em] uppercase text-cosmic mb-6">
              Finale
            </p>
            <h2 className="font-display font-light text-6xl md:text-8xl leading-[0.9] text-glow mb-6">
              We are <span className="text-cosmic">stardust</span>
            </h2>
            <p className="text-foreground/70 max-w-xl mx-auto leading-relaxed">
              dreaming itself awake — drifting back home through the spiral arm.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative h-32 flex items-center justify-center text-xs tracking-[0.4em] uppercase text-foreground/40 font-display">
          Odyssey · A Cinematic Parallax
        </footer>
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none">
        <div
          className="h-full bg-cosmic"
          style={{ width: `${p * 100}%`, boxShadow: "var(--shadow-glow)" }}
        />
      </div>
    </main>
  );
}