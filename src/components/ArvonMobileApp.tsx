import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import appMockup1 from '../assets/app-1.png';
import appMockup2 from '../assets/app-2.png';
import appMockup3 from '../assets/app-3.png';
import appStoreIcon from '../assets/app-store.svg';
import googlePlayIcon from '../assets/play-store.svg';

gsap.registerPlugin(ScrollTrigger);

const ArvonMobileApp = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const phonesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const leftItems = leftRef.current ? Array.from(leftRef.current.children) : [];
      const phones = phonesRef.current ? Array.from(phonesRef.current.children) : [];

      if (reduced) {
        gsap.set([...leftItems, ...phones], { y: 0, opacity: 1 });
        return;
      }

      gsap.set(leftItems, { y: 22, opacity: 0 });
      gsap.set(phones, { y: 44, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      tl.to(leftItems, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out' }, 0)
        .to(phones, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 0.25);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="lg:px-[50px]" style={{
      width: '100%',
      boxSizing: 'border-box',
      // White gutter lives here — this is the outside margin
    //   padding: '0 50px',
    }}>
      <div style={{
        // no width: '100%' — a block div already fills the available space
        backgroundColor: '#f0efed',
        boxSizing: 'border-box',
        padding: 'clamp(32px, 4vw, 70px) 3.47vw',
      }}>
        
            {/* Inner container — stacks on mobile, row from sm up */}
            <div
                className="flex-col items-start lg:flex-row lg:items-center lg:justify-between"
                style={{
                maxWidth: '1150px',
                margin: '0 auto',
                display: 'flex',
                gap: 'clamp(28px, 2.5vw, 44px)',
                
                }}
            >

                {/* Left: text + buttons */}
                <div
                ref={leftRef}
                className="max-w-full lg:max-w-[390px]"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    flex: '1 1 auto',
                    width: '100%',
                }}
                >
                <h2 style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 'clamp(26px, 3.0vw, 50px)',
                    color: '#000',
                    margin: 0,
                    marginBottom: '2px',
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                }}>
                    Arvon Mobile App
                </h2>

                <p style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: 'clamp(12px, 0.95vw, 15px)',
                    color: '#444',
                    margin: 0,
                    lineHeight: 1.7,
                }}>
                    Experience Arvon on the go. Discover new drops, try looks virtually,
                    save outfits, and manage your orders directly from your phone.
                </p>

                <button style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0,
                    backgroundColor: '#000',
                    color: '#fff',
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: 'clamp(12px, 0.98vw, 16px)',
                    letterSpacing: '0.04em',
                    padding: '11px 18px',
                    border: 'none',
                    cursor: 'pointer',
                    width: 'fit-content',
                    marginTop: '2px',
                    lineHeight: 1,
                }}>
                    Download App
                    <img
                    src={appStoreIcon}
                    alt="App Store"
                    style={{
                        height: '22px',
                        width: 'auto',
                        display: 'block',
                        padding: 0,
                        marginLeft: '2px',
                        marginRight: '-6px',
                    }}
                    />
                    <img
                    src={googlePlayIcon}
                    alt="Google Play"
                    style={{
                        height: '22px',
                        width: 'auto',
                        display: 'block',
                        padding: 0,
                        margin: 0,
                        marginLeft: '-6px',
                    }}
                    />
                </button>

                <a href="#" style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: 'clamp(12px, 0.95vw, 15px)',
                    color: '#000',
                    textDecoration: 'none',
                    border: '1px solid #000',
                    padding: '10px 22px',
                    width: 'fit-content',
                    letterSpacing: '0.02em',
                    backgroundColor: '#fff',
                    marginTop: '2px',
                }}>
                    Learn More
                </a>
                </div>

                {/* Right: 3 phones — full width on mobile, capped from sm up */}
                <div
                ref={phonesRef}
                className="w-full lg:w-auto"
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: 'clamp(6px, 0.8vw, 14px)',
                    flex: '0 0 auto',
                    maxWidth: '585px',
                }}
                >
                <img
                    src={appMockup1}
                    alt="Arvon app screen 1"
                    style={{
                    flex: '1 1 0',
                    minWidth: 0,
                    maxWidth: '185px',
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    }}
                />
                <img
                    src={appMockup2}
                    alt="Arvon app screen 2"
                    style={{
                    flex: '1 1 0',
                    minWidth: 0,
                    maxWidth: '185px',
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    }}
                />
                <img
                    src={appMockup3}
                    alt="Arvon app screen 3"
                    style={{
                    flex: '1 1 0',
                    minWidth: 0,
                    maxWidth: '185px',
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    }}
                />
                </div>

            </div>
        </div>

    </section>
  );
};

export default ArvonMobileApp;