import React from 'react';

/**
 * FooterBranding Component
 * 
 * Clones the fixed bottom branding section featuring "the artboard™" 
 * with a character-by-character blinking animation effect and CRT-style scanline overlays.
 * 
 * Theme: Light
 */
const FooterBranding = () => {
  const brandText = "the artboard™";

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] pointer-events-none">
      {/* Container for the bottom status bar branding */}
      <div className="relative w-full flex flex-col items-center justify-end pb-8">
        
        {/* Animated Text Row */}
        <div className="flex justify-center items-center w-full px-8">
          <h1 
            className="font-display text-[0.75rem] font-bold uppercase tracking-[0.1em] text-primary pointer-events-auto select-none"
            style={{ 
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '1.6px',
            }}
          >
            {brandText.split('').map((char, index) => (
              <span 
                key={index} 
                className="inline-block"
                style={{
                  // Blinking animation with staggered delays
                  animation: 'blink 1.5s step-end infinite',
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        </div>
      </div>

      {/* Internal Styles for the special blinking effect */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}} />

      {/* 
        CRT Overlay (Note: Normally global, but following instructions to include
        CRT-style scanline overlays as part of this branding context)
      */}
      <div className="crt-overlay pointer-events-none fixed inset-0 z-[9999]">
        {/* 
          The .crt-overlay classes and animations are defined in globals.css.
          They provide the scanlines and flicker effect.
        */}
      </div>
      
      {/* Progressive Blur Edge - Bottom */}
      <div 
        className="blur-edge-bottom fixed bottom-0 left-0 right-0 h-[120px] pointer-events-none z-[-1]"
        style={{
          background: 'linear-gradient(to top, rgba(232, 232, 232, 0.9) 0%, rgba(232, 232, 232, 0) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
          maskImage: 'linear-gradient(to top, black, transparent)',
        }}
      />
    </div>
  );
};

export default FooterBranding;