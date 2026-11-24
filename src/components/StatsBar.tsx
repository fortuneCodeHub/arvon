import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '50K+', label: 'COMMUNITY MEMBERS' },
  { value: '120K+', label: 'LOOKS SAVED' },
  { value: '4.9/5', label: 'APP RATING' },
  { value: '24h', label: 'ORDER UPDATES' },
];

// Splits "50K+" into { num: 50, suffix: "K+", decimals: 0 }
// and "4.9/5" into { num: 4.9, suffix: "/5", decimals: 1 }
const parseStat = (value: string) => {
  const match = value.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: value, decimals: 0 };
  const numStr = match[1];
  const decimals = numStr.includes('.') ? (numStr.split('.')[1]?.length ?? 0) : 0;
  return { num: parseFloat(numStr), suffix: match[2], decimals };
};

const format = (v: number, decimals: number, suffix: string) =>
  (decimals ? v.toFixed(decimals) : String(Math.round(v))) + suffix;

const StatsBar = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const labelRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const numbers = numberRefs.current.filter(Boolean) as HTMLParagraphElement[];
      const labels = labelRefs.current.filter(Boolean) as HTMLParagraphElement[];
      if (!numbers.length) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduced) {
        numbers.forEach((el, i) => { el.textContent = stats[i].value; });
        gsap.set(labels, { opacity: 1, y: 0 });
        return;
      }

      // Lock each number's final width so the columns don't shift while digits land
      numbers.forEach((el, i) => {
        el.textContent = stats[i].value;
        el.style.minWidth = `${el.getBoundingClientRect().width}px`;
      });

      // Starting state
      numbers.forEach((el, i) => {
        const { suffix, decimals } = parseStat(stats[i].value);
        el.textContent = format(0, decimals, suffix);
      });
      gsap.set(labels, { opacity: 0, y: 10 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        onComplete: () => {
          // Release the width lock so it stays correct on resize
          numbers.forEach((el) => { el.style.minWidth = ''; });
        },
      });

      numbers.forEach((el, i) => {
        const { num, suffix, decimals } = parseStat(stats[i].value);
        const counter = { v: 0 };
        tl.to(
          counter,
          {
            v: num,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = format(counter.v, decimals, suffix);
            },
          },
          0
        );
      });

      tl.to(
        labels,
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
        1.2
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#f7f7f7] border-t-[1.5px] border-b-[1.5px] border-[#ececec] px-[5.79vw] py-[2.89vw]">
        <div className="lg:mx-10 flex flex-wrap justify-between items-start gap-y-[6vw] md:gap-y-0">
            {stats.map((stat, i) => (
                <div key={stat.label} className="flex flex-col gap-[1.74vw] md:items-start items-center w-[45%] md:w-auto md:py-0 py-4">
                <p
                    ref={(el) => { numberRefs.current[i] = el; }}
                    className="text-black m-0"
                    style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 'clamp(32px, 4.63vw, 80px)',
                    letterSpacing: '2px',
                    lineHeight: 'normal',
                    fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {stat.value}
                </p>
                <p
                    ref={(el) => { labelRefs.current[i] = el; }}
                    className="m-0"
                    style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: 'clamp(11px, 1.39vw, 24px)',
                    color: 'rgba(0,0,0,0.5)',
                    lineHeight: 'normal',
                    }}
                >
                    {stat.label}
                </p>
                </div>
            ))}
        </div>
    </section>
  );
};

export default StatsBar;