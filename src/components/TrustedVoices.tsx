import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import trustOneAvatar from "../assets/trust-1.jpg"
import trustTwoAvatar from "../assets/trust-2.jpg"
import trustThreeAvatar from "../assets/trust-3.jpg"

gsap.registerPlugin(ScrollTrigger);

const voices = [
  {
    image: trustOneAvatar,
    name: 'Sydney Irulan',
    role: 'Creative Director',
  },
  {
    image: trustTwoAvatar,
    name: 'Malik Hampton',
    role: 'Editorial Consultant',
  },
  {
    image: trustThreeAvatar,
    name: 'Juliet Noor',
    role: 'Fashion Stylist',
  },
];

const TrustedVoices = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const headerItems = headerRef.current ? Array.from(headerRef.current.children) : [];
      const cards = gridRef.current ? (Array.from(gridRef.current.children) as HTMLElement[]) : [];

      if (reduced) {
        gsap.set(headerItems, { y: 0, opacity: 1 });
        gsap.set(cards, { clipPath: 'inset(0% 0 0 0)' });
        return;
      }

      gsap.set(headerItems, { y: 18, opacity: 0 });
      gsap.set(cards, { clipPath: 'inset(100% 0 0 0)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      tl.to(headerItems, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 0)
        .to(
          cards,
          { clipPath: 'inset(0% 0 0 0)', duration: 1.1, stagger: 0.13, ease: 'power3.inOut' },
          0.3
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      width: '100%',
      backgroundColor: '#f7f7f5',
      boxSizing: 'border-box',
      padding: 'clamp(36px, 4.5vw, 80px) 3.47vw',
    }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>

        {/* Header */}
        <div ref={headerRef} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: 'clamp(24px, 2.8vw, 48px)',
        }}>
          <h2 style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 600,
            fontSize: 'clamp(22px, 2.3vw, 38px)',
            color: '#000',
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}>
            Trusted by Creative Voices
          </h2>
          <p style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(12px, 0.95vw, 15px)',
            color: '#555',
            margin: 0,
            lineHeight: 1.7,
            maxWidth: '520px',
          }}>
            A section for featuring designers, stylist, or creatives partners who
            align with the Arvon vision.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 'clamp(16px, 1.7vw, 28px)' }}
        >
          {voices.map((voice, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3 / 2',
                overflow: 'hidden',
                backgroundColor: '#2f2f2f',
              }}
            >
              {/* Background photo */}
              <img
                src={voice.image}
                alt={voice.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                }}
              />

              {/* Dark overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.45)',
              }} />

              {/* Text */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textAlign: 'center',
                padding: '0 12px',
              }}>
                <span style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: 'clamp(14px, 1.16vw, 20px)',
                  color: '#fff',
                  letterSpacing: '0.01em',
                }}>
                  {voice.name}
                </span>
                <span style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: 'clamp(11px, 0.92vw, 15px)',
                  color: '#ddd',
                  letterSpacing: '0.02em',
                }}>
                  {voice.role}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrustedVoices;