import React, { useState } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface JarvisMapProps {
  origin?: { lat: number; lng: number; name?: string };
  destination?: { lat: number; lng: number; name?: string };
  waypoints?: Array<[number, number]>;
  distanceKm?: number;
  durationMinutes?: number;
}

export const JarvisMap: React.FC<JarvisMapProps> = ({
  origin = { lat: 11.0168, lng: 76.9558, name: 'Current Location' },
  destination,
  waypoints = [],
  distanceKm,
  durationMinutes,
}) => {
  const [zoom, setZoom] = useState(13);

  return (
    <div className="my-3 border border-[#00f0ff]/30 bg-[#060b14]/95 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.15)] font-sans">
      {/* Map Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0c1629] border-b border-[#00f0ff]/20 text-xs">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#00f0ff]" />
          <span className="font-hud font-bold text-[#00f0ff] tracking-wider uppercase">
            JARVIS HUD MAP
          </span>
        </div>
        {distanceKm && durationMinutes && (
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-[#00ffaa] font-bold">{distanceKm} km</span>
            <span className="text-gray-500">•</span>
            <span className="text-[#ffaa00] font-bold">{durationMinutes} min</span>
          </div>
        )}
      </div>

      {/* Visual Canvas Representation */}
      <div className="relative w-full h-56 bg-[#040811] overflow-hidden flex items-center justify-center border-b border-gray-800">
        {/* Dark Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Outer Ring / Compass Radar Grid */}
        <div className="absolute w-44 h-44 rounded-full border border-[#00f0ff]/10 animate-pulse pointer-events-none" />

        {/* Origin Marker */}
        <div className="absolute flex flex-col items-center z-10">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-6 h-6 rounded-full bg-[#00f0ff]/30 animate-ping" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#00f0ff] shadow-[0_0_12px_#00f0ff] border-2 border-white" />
          </div>
          <span className="mt-1 font-mono text-[9px] text-[#00f0ff] bg-black/80 px-1.5 py-0.5 rounded border border-[#00f0ff]/40">
            {origin.name || 'YOU'}
          </span>
        </div>

        {/* Destination Marker (if provided) */}
        {destination && (
          <div className="absolute translate-x-20 -translate-y-12 flex flex-col items-center z-10">
            <MapPin className="w-5 h-5 text-[#ff5555] shadow-[0_0_10px_#ff5555] animate-bounce" />
            <span className="font-mono text-[9px] text-[#ff5555] bg-black/80 px-1.5 py-0.5 rounded border border-[#ff5555]/40 truncate max-w-[120px]">
              {destination.name || 'DESTINATION'}
            </span>
          </div>
        )}

        {/* Simulated Route Polyline */}
        {destination && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 50% 50% Q 65% 30% 70% 30%"
              fill="none"
              stroke="#00ffaa"
              strokeWidth="3"
              strokeDasharray="6 4"
              className="animate-[dash_2s_linear_infinite]"
            />
          </svg>
        )}

        {/* Map Controls */}
        <div className="absolute bottom-2.5 right-2.5 flex flex-col gap-1 z-20">
          <button
            onClick={() => setZoom((z) => Math.min(z + 1, 18))}
            className="p-1.5 bg-black/70 hover:bg-[#00f0ff] text-gray-300 hover:text-black rounded border border-gray-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 1, 1))}
            className="p-1.5 bg-black/70 hover:bg-[#00f0ff] text-gray-300 hover:text-black rounded border border-gray-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(13)}
            className="p-1.5 bg-black/70 hover:bg-[#00f0ff] text-gray-300 hover:text-black rounded border border-gray-700 transition-colors"
            title="Recenter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Scale Badge */}
        <span className="absolute bottom-2.5 left-2.5 font-mono text-[9px] text-gray-400 bg-black/60 px-2 py-0.5 rounded border border-gray-800">
          ZOOM: {zoom}x | OPENSTREETMAP
        </span>
      </div>
    </div>
  );
};
