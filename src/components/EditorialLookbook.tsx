import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import lookbookBg from '../assets-webp/lookbook-bg.webp';
import lookbookOverlay from '../assets-webp/lookbook-overlay.webp';

gsap.registerPlugin(ScrollTrigger);

const EditorialLookbook = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const textureRef = useRef<HTMLImageElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const bg = bgRef.current;
      const texture = textureRef.current;
      const scrim = scrimRef.current;
      const headline = headlineRef.current;
      const link = linkRef.current;
      if (!bg || !texture || !scrim || !headline || !link) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduced) {
        gsap.set([bg, texture, scrim], { clipPath: 'inset(0% 0 0 0)' });
        gsap.set(headline, { yPercent: 0 });
        gsap.set(link, { y: 0, opacity: 1 });
        return;
      }

      // ── Entry: uncover from the bottom edge upward ──
      gsap.set([bg, texture, scrim], { clipPath: 'inset(100% 0 0 0)' });
      gsap.set(headline, { yPercent: 115 });
      gsap.set(link, { y: 24, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.to([bg, texture, scrim], { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'power3.inOut' }, 0)
        .to(headline, { yPercent: 0, duration: 1.0, ease: 'power3.out' }, 0.75)
        .to(link, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 1.05);

      // ── Parallax: the background is already 225% tall at -74.8%,
      // so there is plenty of headroom to drift without exposing an edge.
      
      gsap.fromTo(
        bg,
        { y: -200 },
        {
          y: 200,
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
      height: 'clamp(500px, 66.61vw, 1151px)',
    }}>
      {/* Background image -- parallax-style, oversized vertically */}
      <img
        ref={bgRef}
        src={lookbookBg}
        alt=""
        style={{
          position: 'absolute',
          left: 0,
          top: '-74.8%',
          width: '100%',
          height: '225%',
          objectFit: 'cover',
          objectPosition: 'center',
          pointerEvents: 'none',
        }}
      />

      {/* Dark texture overlay image */}
      <img
        ref={textureRef}
        src={lookbookOverlay}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Dark color overlay */}
      <div
        ref={scrimRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 2,
        }}
      />

      {/* Centered text */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(16px, 2.31vw, 40px)',
        width: '90%',
        maxWidth: '879px',
        textAlign: 'center',
      }}>
        {/* Mask wrapper -- lets the headline rise from behind an edge. */}
        <div style={{ width: '100%', overflow: 'hidden', paddingBottom: '14px', marginBottom: '-14px' }}>
          <h2
            ref={headlineRef}
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(32px, 5.79vw, 100px)',
              color: '#fff',
              margin: 0,
              lineHeight: 1.1,
              textShadow: '0px 4px 10px rgba(0,0,0,0.5)',
            }}
          >
            Editorial Lookbook
          </h2>
        </div>
        <div
          ref={linkRef}
          style={{
            borderBottom: '2px solid #fff',
            paddingBottom: '10px',
          }}
        >
          <a
            href="#"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(14px, 2.31vw, 40px)',
              color: '#fff',
              textDecoration: 'none',
              textShadow: '0px 4px 10px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
            }}
          >
            Explore Lookbook →
          </a>
        </div>
      </div>
    </section>
  );
};

export default EditorialLookbook;