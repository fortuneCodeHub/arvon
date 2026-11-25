import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import footerModelAvatar from '../assets-webp/footer-model.webp';

gsap.registerPlugin(ScrollTrigger);

const footerModel = footerModelAvatar;

// Hero grey — change this one value if the hero uses a different shade
const FOOTER_BG = '#f0efed';

// Halos only exist from md up — no shadow on small screens
const LIGHT_HALO_CLS =
  'md:[text-shadow:0_0_8px_rgba(255,255,255,0.95),0_0_16px_rgba(255,255,255,0.7)]';
const DARK_HALO_CLS =
  'md:[text-shadow:0_1px_10px_rgba(0,0,0,0.6),0_0_22px_rgba(0,0,0,0.35)]';

const navColumns = [
  {
    heading: 'Shop',
    links: ['New Arrivals', 'Essentials', 'Outerwear', 'Special Collections'],
    color: '',
  },
  {
    heading: 'About',
    links: ['Our Story', 'Sustainability', 'Vision'],
    color: 'white',
  },
  {
    heading: 'Support',
    links: ['Shipping', 'Returns', 'Contact'],
    color: 'white',
  },
  {
    heading: 'Social',
    links: ['INSTAGRAM', 'X (TWITTER)', 'TIKTOK'],
    color: '',
  },
];

const legalLinks = ['TERMS OF SERVICE', 'PRIVACY POLICY', 'COOKIE POLICY'];

const letters = ['A', 'R', 'V', 'O', 'N'];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const modelWrapRef = useRef<HTMLDivElement>(null);
  const modelImgRef = useRef<HTMLImageElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const letterWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const modelWrap = modelWrapRef.current;
      const modelImg = modelImgRef.current;
      const blur = blurRef.current;
      const columns = navRef.current ? (Array.from(navRef.current.children) as HTMLElement[]) : [];
      const letterWraps = letterWrapRefs.current.filter(Boolean) as HTMLDivElement[];
      const letterSpans = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
      const barItems = barRef.current ? Array.from(barRef.current.children) : [];

      if (!modelWrap || !modelImg || !blur) return;

      const allNavItems = columns.flatMap((col) => Array.from(col.children));

      if (reduced) {
        gsap.set(modelWrap, { clipPath: 'inset(0% 0 0 0)' });
        gsap.set([...allNavItems, ...barItems], { y: 0, opacity: 1 });
        gsap.set(letterSpans, { yPercent: 0, opacity: 1 });
        gsap.set(blur, { yPercent: 0, opacity: 1 });
        return;
      }

      // ── Starting state ──
      gsap.set(modelWrap, { clipPath: 'inset(100% 0 0 0)' });
      gsap.set(modelImg, { scale: 1.09, transformOrigin: 'center top' });
      gsap.set(blur, { yPercent: 55, opacity: 0 });
      gsap.set(allNavItems, { y: 18, opacity: 0 });
      gsap.set(letterSpans, { yPercent: 120, opacity: 0 });
      gsap.set(barItems, { y: 14, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
          once: true,
        },
      });

      // Model uncovers from the bottom edge
      tl.to(modelWrap, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'power3.inOut' }, 0);

      // Nav columns cascade — each column offset from the last,
      // items inside each column staggered against each other
      columns.forEach((col, i) => {
        tl.to(
          Array.from(col.children),
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out' },
          0.45 + i * 0.1
        );
      });

      // Frost sweeps up from the bottom to meet the wordmark
      tl.to(blur, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 0.8);

      // ARVON rises letter by letter from behind the bottom bar
      tl.to(
        letterSpans,
        { yPercent: 0, opacity: 1, duration: 1.0, stagger: 0.075, ease: 'power3.out' },
        1.05
      );

      // Bottom bar last
      tl.to(barItems, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 1.5);

      // ── Scrub: model settles as the footer comes up ──
      gsap.fromTo(
        modelImg,
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );

      // ── Scrub: each letter drifts at its own speed — desktop only.
      // On small screens the shorter scroll range compresses the staggered
      // offsets into a visible diagonal.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        letterWraps.forEach((wrap, i) => {
          gsap.fromTo(
            wrap,
            { y: 0 },
            {
              y: -(9 + i * 5),
              ease: 'none',
              scrollTrigger: {
                trigger: footerRef.current,
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      });

      // Large PNG — recalculate once it has actually loaded
      if (!modelImg.complete) {
        modelImg.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="px-0" style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        backgroundColor: FOOTER_BG,
        overflow: 'hidden',
        boxSizing: 'border-box',
        minHeight: 'max(520px, min(70vw, 840px))',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* ── Model image — fills the footer on small screens,
             fixed 1.43 crop from md up ── */}
        <div
          ref={modelWrapRef}
          className="top-0 bottom-0 md:bottom-auto md:aspect-[1.43] md:min-h-[520px]"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(100%, 1200px)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <img
            ref={modelImgRef}
            src={footerModel}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 34%',
              display: 'block',
            }}
          />
        </div>

        {/* ── Blur — starts at the midpoint, fades in, runs to the bottom ── */}
        <div
          ref={blurRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            pointerEvents: 'none',
            backdropFilter: 'blur(9px)',
            WebkitBackdropFilter: 'blur(9px)',
            backgroundColor: 'rgba(255,255,255,0.08)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, #000 22%, #000 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 22%, #000 100%)',
          }}
        />

        {/* ── Nav columns ── */}
        <div
          ref={navRef}
          className="grid grid-cols-2 sm:grid-cols-4"
          style={{
            position: 'relative',
            zIndex: 2,
            gap: 'clamp(22px, 2vw, 34px) clamp(16px, 2vw, 32px)',
            padding: 'clamp(26px, 2.6vw, 46px) clamp(20px, 3.47vw, 60px) 0',
          }}
        >
          {navColumns.map((col, i) => {
            const isWhite = col.color === 'white';
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 0.95vw, 15px)' }}>
                <span
                  className={
                    isWhite
                      ? `text-[#555] md:text-white ${DARK_HALO_CLS}`
                      : `text-[#555] md:text-[#777] ${LIGHT_HALO_CLS}`
                  }
                  style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(11px, 0.72vw, 12px)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {col.heading}
                </span>
                {col.links.map((link, j) => (
                  <a
                    key={j}
                    href="#"
                    className={
                      'mb-4 lg:mb-[13px] ' +
                      (isWhite
                        ? `text-[#111] md:text-white ${DARK_HALO_CLS}`
                        : `text-[#111] ${LIGHT_HALO_CLS}`)
                    }
                    style={{
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 'clamp(13px, 0.85vw, 14px)',
                      textDecoration: 'none',
                      letterSpacing: '0.02em',
                      lineHeight: 1.2,
                    }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            );
          })}
        </div>

        {/* ── Spacer pushes wordmark + bar to the bottom ── */}
        <div style={{ flex: 1, minHeight: 'clamp(40px, 5vw, 90px)' }} />

        {/* ── ARVON wordmark — centered, letters tightened ── */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 'clamp(6px, 1.6vw, 28px)',
          padding: '0 clamp(20px, 3.47vw, 60px)',
          marginBottom: 'clamp(10px, 1.2vw, 20px)',
          pointerEvents: 'none',
        }}>
          {letters.map((letter, i) => (
            /* Mask wrapper — the letter rises out from behind this edge */
            <div
              key={i}
              ref={(el) => { letterWrapRefs.current[i] = el; }}
              style={{
                overflow: 'hidden',
                display: 'block',
                fontSize: 'clamp(38px, 7vw, 120px)',
                paddingTop: '0.22em',
                marginTop: '-0.22em',
              }}
            >
              <span
                ref={(el) => { letterRefs.current[i] = el; }}
                style={{
                  display: 'block',
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(38px, 7vw, 120px)',
                  color: '#0a0a0a',
                  lineHeight: 0.82,
                  letterSpacing: 'clamp(8px, 6vw, 100px)',
                }}
              >
                {letter}
              </span>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div
          ref={barRef}
          className="flex-col sm:flex-row sm:items-center sm:justify-between"
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            gap: 'clamp(8px, 1vw, 16px)',
            padding: 'clamp(13px, 1.1vw, 18px) clamp(20px, 3.47vw, 60px)',
          }}
        >
          <span
            className={LIGHT_HALO_CLS}
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(10px, 0.66vw, 11px)',
              color: '#222',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
            }}
          >
            © 2026 LX ARVON, ALL RIGHTS RESERVED.
          </span>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(12px, 1.4vw, 24px)',
          }}>
            {legalLinks.map((link, i) => (
              <a
                key={i}
                href="#"
                className={LIGHT_HALO_CLS}
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(10px, 0.66vw, 11px)',
                  color: '#222',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;