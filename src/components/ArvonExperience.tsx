import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ellipseOneAvatar from "../assets/ellipse-1.jpg"
import ellipseTwoAvatar from "../assets/ellipse-2.jpg"
import ellipseThreeAvatar from "../assets/ellipse-3.jpg"

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    avatar: ellipseOneAvatar,
    quote: 'Arvon brings together minimal fashion and thoughtful product experience in a way that feels modern and effortless.',
    name: 'Levi Turman',
    role: 'Fashion Buyer',
  },
  {
    avatar: ellipseTwoAvatar,
    quote: 'The blend of styling, personalization, and clean commerce flow makes the platform feel genuinely elevated.',
    name: 'Sophie Naimah',
    role: 'Editorial Stylist',
  },
  {
    avatar: ellipseThreeAvatar,
    quote: 'A refined digital experience for shoppers who want more than a standard online store.',
    name: 'Giselle Arnold',
    role: 'Creative Consultant',
  },
];

const ArvonExperience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const headerItems = headerRef.current ? Array.from(headerRef.current.children) : [];
      const cards = gridRef.current ? (Array.from(gridRef.current.children) as HTMLElement[]) : [];
      const avatars = cards
        .map((card) => card.querySelector('img'))
        .filter(Boolean) as HTMLImageElement[];

      if (reduced) {
        gsap.set([...headerItems, ...cards], { y: 0, opacity: 1 });
        gsap.set(avatars, { scale: 1 });
        return;
      }

      gsap.set(headerItems, { y: 18, opacity: 0 });
      gsap.set(cards, { y: 34, opacity: 0 });
      gsap.set(avatars, { scale: 0.88, transformOrigin: 'center center' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      tl.to(headerItems, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 0)
        .to(cards, { y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: 'power3.out' }, 0.3)
        .to(avatars, { scale: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 0.42);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      width: '100%',
      boxSizing: 'border-box',
      padding: 'clamp(36px, 4.5vw, 80px) 3.47vw',
    }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>

        {/* Header */}
        <div ref={headerRef} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
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
            The Arvon Experience
          </h2>
          <p style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(12px, 0.95vw, 15px)',
            color: '#555',
            margin: 0,
            lineHeight: 1.7,
          }}>
            A curated selection of voices reflecting the Arvon experience.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 'clamp(16px, 1.7vw, 28px)', alignItems: 'stretch' }}
        >
          {testimonials.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'clamp(16px, 1.6vw, 26px)',
                padding: 'clamp(24px, 2.3vw, 40px) clamp(18px, 1.9vw, 32px)',
                border: '1px solid #e8e8e8',
                backgroundColor: '#fff',
                textAlign: 'center',
              }}
            >
              {/* Avatar — circular */}
              <div style={{
                width: 'clamp(58px, 5.2vw, 90px)',
                height: 'clamp(58px, 5.2vw, 90px)',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                backgroundColor: '#eee',
              }}>
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
              </div>

              {/* Quote */}
              <p style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(12px, 0.95vw, 15px)',
                color: '#333',
                margin: 0,
                lineHeight: 1.75,
                flex: 1,
              }}>
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Name + role */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}>
                <span style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 'clamp(12px, 0.98vw, 16px)',
                  color: '#000',
                  letterSpacing: '-0.01em',
                }}>
                  {item.name}
                </span>
                <span style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 'clamp(12px, 0.98vw, 16px)',
                  color: '#000',
                  letterSpacing: '-0.01em',
                }}>
                  {item.role}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ArvonExperience;