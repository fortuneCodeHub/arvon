import { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import flameTopBlack from '../assets/mens-flame-top-black.png';
import arvonEssentialsWhite from '../assets/mens-arvon-essentials-white.png';
import arvonEssentialsBlack from '../assets/mens-arvon-essentials-black.png';
import flameTopWhite from '../assets/mens-flame-top-white.png';

gsap.registerPlugin(ScrollTrigger);

const products = [
  { name: 'Flame Top', price: '$50', image: flameTopBlack },
  { name: 'Arvon Essentials', price: '$30', image: arvonEssentialsWhite },
  { name: 'Arvon Essentials', price: '$30', image: arvonEssentialsBlack },
  { name: 'Flame Top White', price: '$50', image: flameTopWhite },
];

const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MensNewArrivals = () => {
  const [index, setIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const arrowsRef = useRef<HTMLDivElement>(null);
  const mobileCardRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef(1);
  const firstRender = useRef(true);

  const prev = () => {
    dirRef.current = -1;
    setIndex((i) => (i === 0 ? products.length - 1 : i - 1));
  };
  const next = () => {
    dirRef.current = 1;
    setIndex((i) => (i === products.length - 1 ? 0 : i + 1));
  };

  // Scroll-in stagger + persistent hover
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const canHover = window.matchMedia('(hover: hover)').matches;

      const headerItems = headerRef.current ? Array.from(headerRef.current.children) : [];
      const cards = gridRef.current ? (Array.from(gridRef.current.children) as HTMLElement[]) : [];
      const arrows = arrowsRef.current;

      if (reduced) {
        gsap.set([...headerItems, ...cards, arrows], { y: 0, opacity: 1 });
        return;
      }

      gsap.set(headerItems, { y: 20, opacity: 0 });
      gsap.set(cards, { y: 40, opacity: 0 });
      gsap.set(arrows, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });

      tl.to(headerItems, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0)
        .to(cards, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, 0.25)
        .to(arrows, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.9);

      // Hover: image zoom + card lift. Desktop pointers only.
      if (!canHover) return;

      const cleanups: Array<() => void> = [];

      cards.forEach((card) => {
        const img = card.querySelector('img');
        if (!img) return;

        const lift = gsap.quickTo(card, 'y', { duration: 0.4, ease: 'power3.out' });
        const zoom = gsap.quickTo(img, 'scale', { duration: 0.6, ease: 'power3.out' });

        const onEnter = () => { lift(-7); zoom(1.07); };
        const onLeave = () => { lift(0); zoom(1); };

        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          card.removeEventListener('mouseenter', onEnter);
          card.removeEventListener('mouseleave', onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mobile carousel: slide in from the tapped direction
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = mobileCardRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(
      el,
      { x: dirRef.current * 55, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
    );
  }, [index]);

  return (
    <section ref={sectionRef} style={{ width: '100%', padding: '0 3.47vw' }}>
      {/* Header */}
      <div ref={headerRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 600,
            fontSize: 'clamp(20px, 2.0vw, 32px)',
            color: '#000',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Men's New Arrivals
        </h2>
        <a
          href="#"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(11px, 0.85vw, 14px)',
            color: '#000',
            textDecoration: 'none',
            letterSpacing: '0.02em',
          }}
        >
          Explore Men's Collection →
        </a>
      </div>

      {/* Desktop grid -- 4 cards, hidden on mobile */}
      <div
        ref={gridRef}
        className="hidden md:grid"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}
      >
        {products.map((product, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' }}>
            <div
              style={{
                width: '100%',
                backgroundColor: '#f5f5f5',
                overflow: 'hidden',
                aspectRatio: '3 / 4',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(11px, 0.85vw, 14px)',
                color: '#000',
              }}
            >
              <span>{product.name}</span>
              <span>{product.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile carousel -- visible only below md, 1 card at a time */}
      <div ref={mobileCardRef} className="md:hidden" style={{ flexDirection: 'column', gap: '12px' }}>
        <div
          style={{
            width: '100%',
            backgroundColor: '#f5f5f5',
            overflow: 'hidden',
            aspectRatio: '4 / 3',
          }}
        >
          <img
            src={products[index].image}
            alt={products[index].name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 300,
            fontSize: '13px',
            color: '#000',
            marginTop: '8px',
          }}
        >
          <span>{products[index].name}</span>
          <span>{products[index].price}</span>
        </div>
      </div>

      {/* Arrows */}
      <div ref={arrowsRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
        <button
          onClick={prev}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#fff',
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
            padding: 0,
          }}
          aria-label="Previous"
        >
          <ArrowLeft />
        </button>
        <button
          onClick={next}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#000',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            padding: 0,
          }}
          aria-label="Next"
        >
          <ArrowRight />
        </button>
      </div>
    </section>
  );
};

export default MensNewArrivals;