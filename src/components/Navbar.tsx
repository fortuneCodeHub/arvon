import { useState, useEffect } from 'react';

// Height of the navbar — the switch fires when the hero's bottom passes this line
// const NAV_OFFSET = 80;

// Footer grey (#f0efed) taken down to a dark shade — same hue, same warmth
const NAV_DARK = 'rgba(43, 42, 39, 0.93)';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // any part of the hero visible → keep the light gradient
        setScrolled(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50">

        {/* Background layer 1 — hero gradient */}
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none"
          style={{
            opacity: scrolled ? 0 : 1,
            backgroundImage:
              'linear-gradient(101.31deg, rgba(233, 224, 212, 0.2) 0.61%, rgba(115, 114, 113, 0.2) 26.38%)',
          }}
        />

        {/* Background layer 2 — dark grey, past the hero */}
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none"
          style={{
            opacity: scrolled ? 1 : 0,
            backgroundColor: NAV_DARK,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 1px 20px rgba(0,0,0,0.18)',
          }}
        />

        <div className="relative z-10 flex items-center justify-between px-[2.89vw] py-[1.74vw]">
          {/* Logo */}
          <span
            className="text-white whitespace-nowrap"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(14px, 1.16vw, 20px)',
            }}
          >
            ARVON
          </span>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-[1.74vw]">
            {['Shop', 'Collections', 'Lookbook', 'About'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white whitespace-nowrap no-underline hover:opacity-70 transition-opacity"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(12px, 1.04vw, 18px)',
                  textShadow: scrolled ? 'none' : '0px 4px 4px rgba(0,0,0,0.1)',
                }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right side: icons + hamburger */}
          <div className="flex items-center gap-[1.16vw]">
            {/* Search icon -- desktop only */}
            <button className="hidden md:flex items-center justify-center bg-transparent border-none cursor-pointer p-0 w-[2.37vw] h-[2.43vw]">
              <img src="/assets/icon-search.svg" alt="Search" className="w-[1.39vw] h-[1.45vw]" />
            </button>

            {/* User icon -- desktop only */}
            <button className="hidden md:flex items-center justify-center bg-transparent border-none cursor-pointer p-0 w-[2.37vw] h-[2.43vw]">
              <img src="/assets/icon-user.svg" alt="Account" className="w-[1.39vw] h-[1.56vw]" />
            </button>

            {/* Hamburger -- mobile only */}
            <button
              className="md:hidden flex flex-col justify-center items-center gap-[5px] bg-transparent border-none cursor-pointer p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-[1.5px] bg-white transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''
                }`}
              />
              <span
                className={`block w-6 h-[1.5px] bg-white transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-[1.5px] bg-white transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`relative z-10 md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(30, 30, 30, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
          }}
        >
          <div className="flex flex-col px-8 py-6 gap-6">
            {['Shop', 'Collections', 'Lookbook', 'About'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white no-underline text-lg tracking-widest uppercase hover:opacity-70 transition-opacity"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex items-center gap-6 pt-2 border-t border-white/20">
              <button className="flex items-center justify-center bg-transparent border-none cursor-pointer p-0">
                <img src="/assets/icon-search.svg" alt="Search" className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center bg-transparent border-none cursor-pointer p-0">
                <img src="/assets/icon-user.svg" alt="Account" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;