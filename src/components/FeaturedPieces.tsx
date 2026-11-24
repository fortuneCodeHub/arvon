import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import featuredWomen1 from '../assets/featured-women-1.png';
import featuredWomen2 from '../assets/featured-women-2.png';
import featuredWomen3 from '../assets/featured-women-3.png';
import featuredMen1 from '../assets/featured-men-1.png';
import featuredMen2 from '../assets/featured-men-2.png';
import featuredMen3 from '../assets/featured-men-3.png';

gsap.registerPlugin(ScrollTrigger);

const row1 = [
  { image: featuredWomen1, name: 'Linen Shirt Dress', price: '$85' },
  { image: featuredWomen2, name: 'Wrap Midi Dress', price: '$95' },
  { image: featuredWomen3, name: 'Sculpt Gown', price: '$120' },
];

const row2 = [
  { image: featuredMen1, name: 'Relaxed Linen Set', price: '$110' },
  { image: featuredMen2, name: 'Utility Jacket', price: '$130' },
  { image: featuredMen3, name: 'Essential Cardigan', price: '$75' },
];

const allItems = [...row1, ...row2];

const FeaturedPieces = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const grid1Ref = useRef<HTMLDivElement>(null);
  const grid2Ref = useRef<HTMLDivElement>(null);

  // IntersectionObserver: whichever slide is most visible sets the active dot
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActiveIndex(i);
          }
        },
        { root: trackRef.current, threshold: 0.6 }
      );
      obs.observe(slide);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // ── DESKTOP: uncover on scroll + hover zoom/lift ──
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const canHover = window.matchMedia('(hover: hover)').matches;

      const headerItems = headerRef.current ? Array.from(headerRef.current.children) : [];
      const cards = [
        ...(grid1Ref.current ? Array.from(grid1Ref.current.children) : []),
        ...(grid2Ref.current ? Array.from(grid2Ref.current.children) : []),
      ] as HTMLElement[];

      const frames = cards
        .map((card) => card.firstElementChild as HTMLElement | null)
        .filter(Boolean) as HTMLElement[];

      if (reduced) {
        gsap.set(headerItems, { y: 0, opacity: 1 });
        gsap.set(frames, { clipPath: 'inset(0% 0 0 0)' });
        return;
      }

      gsap.set(headerItems, { y: 20, opacity: 0 });
      gsap.set(frames, { clipPath: 'inset(100% 0 0 0)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });

      tl.to(headerItems, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0)
        .to(
          frames,
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.1,
            stagger: 0.11,
            ease: 'power3.inOut',
          },
          0.25
        );

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

  // ── MOBILE: centre slide at full size, neighbours scaled back and dimmed ──
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!slides.length) return;

    const setters = slides.map((s) => {
      gsap.set(s, { transformOrigin: 'center center' });
      return {
        scale: gsap.quickSetter(s, 'scale'),
        opacity: gsap.quickSetter(s, 'opacity'),
      };
    });

    let frame = 0;

    const update = () => {
      frame = 0;
      const trackRect = track.getBoundingClientRect();
      if (!trackRect.width) return;
      const trackCentre = trackRect.left + trackRect.width / 2;
      const falloff = trackRect.width * 0.8;

      slides.forEach((slide, i) => {
        const r = slide.getBoundingClientRect();
        const slideCentre = r.left + r.width / 2;
        const t = Math.min(Math.abs(slideCentre - trackCentre) / falloff, 1);

        setters[i].scale(1 - t * 0.13);
        setters[i].opacity(1 - t * 0.55);
      });
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      track.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      gsap.set(slides, { clearProps: 'scale,opacity,transformOrigin' });
    };
  }, []);

  const scrollTo = (i: number) => {
    slideRefs.current[i]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  return (
    <section ref={sectionRef} style={{ width: '100%', padding: '0 3.47vw' }}>
      {/* Header */}
      <div ref={headerRef} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <h2 style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 600,
          fontSize: 'clamp(16px, 1.6vw, 28px)',
          color: '#000',
          margin: 0,
          letterSpacing: '-0.01em',
        }}>
          Featured Pieces
        </h2>
        <a href="#" style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(11px, 0.85vw, 14px)',
          color: '#000',
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}>
          Explore More Pieces →
        </a>
      </div>

      {/* ── DESKTOP: two grid rows ── */}
      <div ref={grid1Ref} className="hidden md:grid" style={{
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '30px',
      }}>
        {row1.map((item, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' }}>
            <div style={{ width: '100%', backgroundColor: '#f5f5f5', overflow: 'hidden', aspectRatio: '3 / 4' }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div ref={grid2Ref} className="hidden md:grid" style={{
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
      }}>
        {row2.map((item, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' }}>
            <div style={{ width: '100%', backgroundColor: '#f5f5f5', overflow: 'hidden', aspectRatio: '3 / 4' }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── MOBILE: horizontal snap carousel ── */}
      <div className="md:hidden">
        {/* Track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            overflowX: 'scroll',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            gap: '12px',
            paddingBottom: '4px',
            /* hide scrollbar */
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {allItems.map((item, i) => (
            <div
              key={i}
              ref={(el) => { slideRefs.current[i] = el; }}
              style={{
                flex: '0 0 78vw',
                scrollSnapAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {/* Card */}
              <div style={{
                width: '100%',
                backgroundColor: '#f0f0f0',
                overflow: 'hidden',
                aspectRatio: '3 / 4',
                borderRadius: '2px',
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    display: 'block',
                    transition: 'opacity 0.4s ease',
                  }}
                />
              </div>
              {/* Label */}
              {/* <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 300,
                fontSize: '12px',
                color: '#000',
                letterSpacing: '0.02em',
              }}>
                <span>{item.name}</span>
                <span>{item.price}</span>
              </div> */}
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
        }}>
          {allItems.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: activeIndex === i ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: activeIndex === i ? '#000' : '#ccc',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'width 0.3s ease, background-color 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPieces;