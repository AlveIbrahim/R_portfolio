"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * NavigationOverlay component
 * Clones the minimalist navigation overlay which includes location/time data,
 * expertise list, social links, and the primary intro text with split-line animations.
 */
export default function NavigationOverlay() {
  const [time, setTime] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    timezone: "GMT+1",
  });

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Using Italy time (GMT+1/GMT+2 depending on DST)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/Rome",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat("en-GB", options).format(now);
      const [hours, minutes, seconds] = timeString.split(":");
      
      setTime({
        hours,
        minutes,
        seconds,
        timezone: "GMT+1", // Standardized display per original
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="fixed inset-x-0 top-0 z-[100] pointer-events-none select-none">
      {/* 4-Column Grid Navigation */}
      <nav className="grid grid-cols-1 md:grid-cols-4 gap-0 p-8 w-full pointer-events-auto">
        
        {/* Column 1: Location & Time */}
        <div className="flex flex-col gap-1">
          <p className="text-[0.75rem] leading-[1.4] font-normal font-body uppercase tracking-wider text-primary">
            Based in Italy,<br />working globally.
          </p>
          <div className="mt-1">
            <p className="text-[0.75rem] font-normal font-mono text-primary">
              <span className="tabular-nums">{time.hours}</span>:
              <span className="tabular-nums">{time.minutes}</span>:
              <span className="tabular-nums">{time.seconds}</span>{" "}
              <span>{time.timezone}</span>
            </p>
          </div>
        </div>

        {/* Column 2: Expertise */}
        <div className="flex flex-col gap-1 mt-6 md:mt-0">
          <p className="text-[0.65rem] tracking-[0.08em] text-muted-foreground uppercase font-body">
            (my.expertise)
          </p>
          <div className="flex flex-col">
            <p className="text-[0.75rem] leading-[1.6] uppercase font-body text-primary">Art Direction</p>
            <p className="text-[0.75rem] leading-[1.6] uppercase font-body text-primary">Web Design + Dev</p>
            <p className="text-[0.75rem] leading-[1.6] uppercase font-body text-primary">Webflow Development</p>
          </div>
        </div>

        {/* Column 3: Social & Contacts */}
        <div className="flex flex-col gap-1 mt-6 md:mt-0">
          <p className="text-[0.65rem] tracking-[0.08em] text-muted-foreground uppercase font-body">
            (social.contacts)
          </p>
          <div className="flex flex-col gap-1">
            <a 
              href="https://www.awwwards.com/nicolaromei/" 
              className="text-[0.75rem] uppercase font-body text-primary hover:opacity-50 transition-opacity w-fit"
            >
              Awwwards
            </a>
            <a 
              href="https://www.linkedin.com/in/nicolaromei/" 
              className="text-[0.75rem] uppercase font-body text-primary hover:opacity-50 transition-opacity w-fit"
            >
              Linkedin
            </a>
            <a 
              href="mailto:info@nicolaromei.com?subject=New project together" 
              className="text-[0.75rem] uppercase font-body text-primary hover:opacity-50 transition-opacity w-fit"
            >
              contacts
            </a>
          </div>
        </div>

        {/* Column 4: Intro Bio */}
        <div className="flex flex-col mt-6 md:mt-0 max-w-[400px]">
          <div className="overflow-hidden">
            <p className="text-[1.125rem] leading-[1.3] font-bold font-body tracking-tight text-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Digital Experience Designer and Awwwards Judge. I create immersive websites defined by strong visual direction, refined motion, and a distinct design signature.
            </p>
          </div>
          
          {/* Action Buttons (Archive / Profile) */}
          <div className="mt-8 flex flex-col gap-2">
            <a 
              href="/the-archive" 
              className="group relative flex items-center justify-center border border-border py-3 px-6 overflow-hidden transition-colors hover:bg-primary"
            >
              <span className="relative z-10 text-[0.875rem] font-bold tracking-[0.12em] uppercase font-body group-hover:text-background transition-colors duration-300">
                THE ARCHIVE
              </span>
            </a>
            <a 
              href="/the-profile" 
              className="group relative flex items-center justify-center border border-border py-3 px-6 overflow-hidden transition-colors hover:bg-primary"
            >
              <span className="relative z-10 text-[0.875rem] font-bold tracking-[0.12em] uppercase font-body group-hover:text-background transition-colors duration-300">
                THE PROFILE
              </span>
            </a>
          </div>
        </div>
      </nav>

      {/* Screen Effects (Handled globally in globals.css, but visually acknowledged here) */}
      <div className="fixed inset-0 pointer-events-none crt-overlay opacity-10" />
      
      {/* Bottom Status Bar Label */}
      <div className="fixed bottom-8 inset-x-0 px-8 flex justify-center pointer-events-none">
        <h1 className="text-[0.75rem] font-bold font-display tracking-[0.1em] text-primary uppercase">
          <span className="animate-pulse">t</span>
          <span className="animate-pulse delay-75">h</span>
          <span className="animate-pulse delay-100">e</span>
          <span>&nbsp;</span>
          <span className="animate-pulse delay-150">a</span>
          <span className="animate-pulse delay-200">r</span>
          <span className="animate-pulse delay-300">t</span>
          <span className="animate-pulse delay-75">b</span>
          <span className="animate-pulse delay-100">o</span>
          <span className="animate-pulse delay-150">a</span>
          <span className="animate-pulse delay-200">r</span>
          <span className="animate-pulse delay-300">d</span>
          <span className="animate-pulse">™</span>
        </h1>
      </div>
    </section>
  );
}