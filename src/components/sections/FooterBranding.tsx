import React, { useEffect, useState } from 'react';

const FooterBranding = () => {
  const brandText = "the canvas™";
  const [delays, setDelays] = useState<string[]>([]);

  useEffect(() => {
    setDelays(brandText.split('').map(() => `${Math.random() * 2}s`));
  }, []);

  return (
    <footer className="relative w-full overflow-hidden bg-transparent pointer-events-none select-none">
      {/* 
        The footer branding section usually sits at the very bottom of the page,
        often overlaid or at the end of the main section interaction.
        Based on instructions, it features the large blink-animated heading.
      */}
      <div className="flex flex-col items-center justify-end w-full min-h-[40vh] px-5 pb-10 sm:pb-20">
        <div className="w-full max-w-[100vw] overflow-hidden">
          <div className="flex justify-center items-end text-center">
            <h1 
              data-blink-text="" 
              className="font-display text-[12vw] sm:text-[10vw] font-extrabold uppercase leading-[0.85] tracking-tighter text-white"
            >
                {brandText.split('').map((char, index) => (
                  <span 
                    key={index} 
                    className="blink-char inline-block"
                    style={{ 
                      animation: `blink 1.5s step-end infinite`,
                      animationDelay: delays[index] || '0s'
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
            </h1>
          </div>
        </div>
      </div>

      {/* 
        Utility navigation used as buttons for Archive/Profile 
        Note: These are usually positioned in the top nav or fixed, 
        but instructions mention primary navigation buttons here as well.
      */}
      <div className="absolute bottom-10 right-5 flex flex-col gap-2 pointer-events-auto sm:hidden">
        <a 
          href="/the-archive" 
          className="group relative flex items-center justify-center border border-white bg-black px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
        >
          <span className="relative z-10">The Archive</span>
        </a>
        <a 
          href="/the-profile" 
          className="group relative flex items-center justify-center border border-white bg-black px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
        >
          <span className="relative z-10">The Profile</span>
        </a>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        .blink-char {
          will-change: opacity;
        }
      `}} />
    </footer>
  );
};

export default FooterBranding;