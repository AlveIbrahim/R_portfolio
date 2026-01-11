"use client";

import Preloader from "@/components/sections/preloader";
import NavigationOverlay from "@/components/sections/NavigationOverlay";
import ArtboardCanvas from "@/components/sections/ArtboardCanvas";
import InfoTab from "@/components/sections/InfoTab";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] selection:bg-white selection:text-black">
      {/* Immersive Preloader */}
      <Preloader />

      {/* Persistent Navigation & Status */}
      <NavigationOverlay />

      {/* Main Interactive Canvas */}
      <ArtboardCanvas />

      {/* Floating Info Section */}
      <InfoTab />
    </main>
  );
}
