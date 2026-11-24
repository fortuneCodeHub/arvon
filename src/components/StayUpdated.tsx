import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StayUpdated = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const items = innerRef.current ? Array.from(innerRef.current.children) : [];
      if (!items.length) return;

      if (reduced) {
        gsap.set(items, { y: 0, opacity: 1 });
        return;
      }

      gsap.set(items, { y: 20, opacity: 0 });

      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      width: '100%',
      boxSizing: 'border-box',
      padding: 'clamp(40px, 5vw, 90px) 3.47vw',
    }}>
      <div ref={innerRef} style={{
        maxWidth: '620px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(12px, 1.2vw, 20px)',
        textAlign: 'center',
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
          Stay Updated
        </h2>

        <p style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(12px, 0.95vw, 15px)',
          color: '#555',
          margin: 0,
          lineHeight: 1.7,
        }}>
          Be the first to know about new drops and collections.
        </p>

        {/* Email form — stacks on mobile */}
        <form
          className="flex-col sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: 'flex',
            width: '100%',
            maxWidth: '460px',
            gap: '0',
            marginTop: '6px',
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:flex-1"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(12px, 0.92vw, 14px)',
              color: '#000',
              padding: '13px 16px',
              border: '1px solid #ddd',
              outline: 'none',
              backgroundColor: '#fff',
              boxSizing: 'border-box',
              minWidth: 0,
            }}
          />
          <button
            type="submit"
            className="w-full sm:w-auto"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(12px, 0.92vw, 14px)',
              color: '#fff',
              backgroundColor: '#000',
              border: 'none',
              padding: '13px 30px',
              cursor: 'pointer',
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Subscribe
          </button>
        </form>

        <p style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(10px, 0.75vw, 12px)',
          color: '#777',
          margin: 0,
          marginTop: '2px',
        }}>
          By subscribing, you agree to our{' '}
          <a href="#" style={{ color: '#000', fontWeight: 500, textDecoration: 'none' }}>
            Privacy Policy
          </a>
        </p>

      </div>
    </section>
  );
};

export default StayUpdated;