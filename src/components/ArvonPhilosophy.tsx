import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import philosophyBg from '../assets-webp/philosophy-bg.webp';
import philosophyModel from '../assets-webp/philosophy-model.webp';

gsap.registerPlugin(ScrollTrigger);

const ArvonPhilosophy = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const modelRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const bg = bgRef.current;
      const model = modelRef.current;
      const headline = headlineRef.current;
      const para = paraRef.current;
      if (!bg || !model || !headline || !para) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduced) {
        gsap.set([bg, model], { clipPath: 'inset(0% 0 0 0)' });
        gsap.set(headline, { yPercent: 0 });
        gsap.set(para, { y: 0, opacity: 1 });
        return;
      }

      // ── Entry: uncover from the bottom edge upward ──
      gsap.set([bg, model], { clipPath: 'inset(100% 0 0 0)' });
      gsap.set(headline, { yPercent: 115 });
      gsap.set(para, { y: 24, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.to(bg, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power3.inOut' }, 0)
        .to(model, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power3.inOut' }, 0.25)
        .to(headline, { yPercent: 0, duration: 1.0, ease: 'power3.out' }, 0.7)
        .to(para, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 1.0);

      // ── Parallax: background drifts slower than the page ──
      // Scale gives the vertical headroom so no edge is ever exposed.
      
       gsap.set(bg, { scale: 1.32, transformOrigin: 'center center' });

        gsap.fromTo(
            bg,
            { yPercent: -13 },
            {
                yPercent: 13,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                },
            }
        );

        // Images are large PNGs — recalculate once they've actually loaded,
        // otherwise the scrub range is measured against a stale layout.
        const imgs = sectionRef.current?.querySelectorAll('img') ?? [];
        imgs.forEach((img) => {
            if (!img.complete) {
            img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
            }
        });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      height: 'clamp(400px, 41.49vw, 717px)',
    }}>
      {/* Background image */}
      <img
        ref={bgRef}
        src={philosophyBg}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          pointerEvents: 'none',
        }}
      />

      {/* Model overlay -- centered, taller than section (bleeds top/bottom) */}
      <img
        ref={modelRef}
        src={philosophyModel}
        alt=""
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          height: '110%',
          width: 'auto',
          objectFit: 'cover',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Text overlay -- centered over everything */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(12px, 1.39vw, 24px)',
        width: '90%',
        maxWidth: '1499px',
        textAlign: 'center',
        filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.1))',
      }}>
        {/* Mask wrapper -- lets the headline rise from behind an edge.
            padding + matching negative margin keep the text-shadow visible
            without changing the layout height. */}
        <div style={{ width: '100%', overflow: 'hidden', paddingBottom: '10px', marginBottom: '-10px' }}>
          <h2
            ref={headlineRef}
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(28px, 4.05vw, 70px)',
              color: '#fff',
              margin: 0,
              lineHeight: 1.1,
              textShadow: '0px 4px 2px rgba(0,0,0,0.2)',
            }}
          >
            The Arvon Philosophy
          </h2>
        </div>
        <p
          ref={paraRef}
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(14px, 2.31vw, 40px)',
            color: '#fff',
            margin: 0,
            lineHeight: 1.4,
            textShadow: '0px 4px 2px rgba(0,0,0,0.1)',
          }}
        >
          Timeless silhouettes, thoughtful design, and refined essentials built for everyday life.
        </p>
      </div>
    </section>
  );
};

export default ArvonPhilosophy;