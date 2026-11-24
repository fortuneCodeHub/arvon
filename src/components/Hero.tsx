import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import heroBg from '../assets/hero-bg.jpg';
import heroModels from '../assets/hero-models.png';

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const modelsRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const bg = bgRef.current;
      const models = modelsRef.current;
      const headline = headlineRef.current;
      const para = paraRef.current;
      const buttons = buttonsRef.current ? Array.from(buttonsRef.current.children) : [];

      if (!bg || !models || !headline || !para) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduced) {
        gsap.set([bg, models], { clipPath: 'inset(0% 0 0 0)' });
        gsap.set(headline, { yPercent: 0 });
        gsap.set([para, ...buttons], { y: 0, opacity: 1 });
        return;
      }

      // Starting state — set before first paint so nothing flashes
      gsap.set([bg, models], { clipPath: 'inset(100% 0 0 0)' });
      gsap.set(headline, { yPercent: 115 });
      gsap.set(para, { y: 20, opacity: 0 });
      gsap.set(buttons, { y: 16, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

      tl.to(bg, { clipPath: 'inset(0% 0 0 0)', duration: 1.2 }, 0)
        .to(models, { clipPath: 'inset(0% 0 0 0)', duration: 1.2 }, 0.3)
        .to(headline, { yPercent: 0, duration: 1.0, ease: 'power3.out' }, 0.8)
        .to(para, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 1.1)
        .to(buttons, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 1.3);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative w-full overflow-hidden h-[105vw] md:h-[80vw] lg:h-[75.81vw]">

      {/* Layer 1: full bleed background */}
      <img
        ref={bgRef}
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
      />

      {/* Layer 2: models photo, centered, cropped at waist from top */}
      <div
        ref={modelsRef}
        className="absolute left-1/2 -translate-x-1/2 top-[8vw] md:top-[5vw] lg:top-[3.70vw] w-[90vw] md:w-[82vw] lg:w-[75.69vw] h-[105vw] md:h-[88vw] lg:h-[72.11vw] overflow-hidden"
      >
        <img
          src={heroModels}
          alt=""
          className="w-full h-full object-cover object-top pointer-events-none"
        />
      </div>

      {/* Layer 3: text + buttons */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[50vw] md:top-[38vw] lg:top-[36.11vw] w-[90vw] md:w-[84vw] lg:w-[78.47vw] flex flex-col items-center gap-[6vw] md:gap-[5.79vw]">

        {/* Text block */}
        <div className="flex flex-col items-center text-center text-white w-full gap-[3vw] md:gap-[2.03vw]">

          {/* Mask wrapper — clips the headline so it can rise from behind an edge.
              paddingBottom + matching negative marginBottom give the text-shadow
              room to render without changing the layout height. */}
          <div
            className="w-full overflow-hidden"
            style={{ paddingBottom: '12px', marginBottom: '-12px' }}
          >
            <h1
              ref={headlineRef}
              className="text-white text-center w-full"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(28px, 8vw, 120px)',
                lineHeight: 1.1,
                textShadow: '0px 4px 4px rgba(0,0,0,0.25)',
                margin: 0,
              }}
            >
              Modern Essentials
            </h1>
          </div>

          <p
            ref={paraRef}
            className="text-white text-center w-full"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(13px, 2.8vw, 40px)',
              lineHeight: 1.5,
              textShadow: '0px 4px 4px rgba(0,0,0,0.1)',
              margin: 0,
            }}
          >
            Designed for everyday expression. Minimal silhouettes
            <br />
            and timeless fashion.
          </p>
        </div>

        {/* Buttons */}
        <div ref={buttonsRef} className="flex items-center gap-[3vw] md:gap-[3.47vw] w-full justify-center">
          <button
            className="flex items-center justify-center bg-black text-white border-none cursor-pointer"
            style={{
              width: 'clamp(120px, 28vw, 382px)',
              height: 'clamp(40px, 6.5vw, 95px)',
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(12px, 2.31vw, 40px)',
            }}
          >
            Shop Collection
          </button>

          <button
            className="flex items-center justify-center bg-white text-black border-none cursor-pointer"
            style={{
              width: 'clamp(120px, 28vw, 382px)',
              height: 'clamp(40px, 6.5vw, 95px)',
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(12px, 2.31vw, 40px)',
            }}
          >
            Explore Looks
          </button>
        </div>

      </div>

      {/* Sentinel — Navbar watches this to know when the hero has scrolled past */}
      {/* <div
        id="hero-sentinel"
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full h-px pointer-events-none"
      /> */}
    </section>
  );
};

export default Hero;