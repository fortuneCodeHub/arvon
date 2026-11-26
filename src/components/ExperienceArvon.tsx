import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import tryOnIcon from '../assets-webp/virtual-try-on.webp';
import savedLooksIcon from '../assets-webp/saved-looks.webp';
import styleProfileIcon from '../assets-webp/style-profile.webp';
import orderTrackingIcon from '../assets-webp/order-tracking.webp';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    image: tryOnIcon,
    subtitle: 'Try It On Instantly',
    title: 'Virtual Try-On',
  },
  {
    image: savedLooksIcon,
    subtitle: 'Your Curated Looks',
    title: 'Saved Looks',
  },
  {
    image: styleProfileIcon,
    subtitle: 'Your Style Identity',
    title: 'Style Profile',
  },
  {
    image: orderTrackingIcon,
    subtitle: 'Delivery Tracking',
    title: 'Order Tracking',
  },
];

const ExperienceArvon = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const headerItems = headerRef.current ? Array.from(headerRef.current.children) : [];
      const cards = gridRef.current ? (Array.from(gridRef.current.children) as HTMLElement[]) : [];
      const icons = cards
        .map((card) => card.querySelector('img'))
        .filter(Boolean) as HTMLImageElement[];

      if (reduced) {
        gsap.set([...headerItems, ...cards], { y: 0, opacity: 1 });
        gsap.set(icons, { scale: 1 });
        return;
      }

      gsap.set(headerItems, { y: 18, opacity: 0 });
      gsap.set(cards, { y: 32, opacity: 0 });
      gsap.set(icons, { scale: 0.9, transformOrigin: 'center center' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      tl.to(headerItems, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 0)
        .to(cards, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 0.3)
        .to(icons, { scale: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 0.4);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      width: '100%',
      padding: '0 3.47vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'clamp(32px, 3.47vw, 60px)',
    }}>
      {/* Header */}
      <div ref={headerRef} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 600,
          fontSize: 'clamp(20px, 2.08vw, 36px)',
          color: '#000',
          margin: 0,
          letterSpacing: '-0.01em',
        }}>
          Experience Arvon
        </h2>
        <p style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(12px, 1.04vw, 18px)',
          color: '#555',
          margin: 0,
          maxWidth: '480px',
          lineHeight: 1.6,
        }}>
          Discover features designed to make shopping effortless and personal.
        </p>
      </div>

        {/* Cards grid -- desktop 4 col, mobile 2 col */}
        {/* Cards grid -- wraps to 2 per row below md, 4 across from md up */}
        <div ref={gridRef} style={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 0,
            rowGap: '14px',
            width: '100%',
            maxWidth: '1200px',
        }}>
            {features.map((feature, i) => (
            <div
                key={i}
                className={
                'basis-1/2 grow md:basis-0 ' +
                (i < features.length - 1 ? 'md:border-r md:border-[#e8e8e8]' : '')
                }
                style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'clamp(10px, 1.39vw, 20px)',
                padding: 'clamp(20px, 2.89vw, 50px) clamp(10px, 1.39vw, 24px)',
                }}
            >
            {/* Icon -- scales with viewport, never tiny on mobile */}
                <div style={{
                width: 'clamp(100px, 13.89vw, 240px)',
                height: 'clamp(100px, 13.89vw, 240px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                }}>
                    <img
                        src={feature.image}
                        alt={feature.title}
                        style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                        }}
                    />
                </div>

                {/* Text */}
                <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                textAlign: 'center',
                }}>
                    <span style={{
                        fontFamily: "'Josefin Sans', sans-serif",
                        fontWeight: 300,
                        fontSize: 'clamp(9px, 0.87vw, 13px)',
                        color: '#888',
                        letterSpacing: '0.03em',
                    }}>
                        {feature.subtitle}
                    </span>
                    <span style={{
                        fontFamily: "'Josefin Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: 'clamp(11px, 1.04vw, 17px)',
                        color: '#000',
                        letterSpacing: '-0.01em',
                    }}>
                        {feature.title}
                    </span>
                </div>
            </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceArvon;