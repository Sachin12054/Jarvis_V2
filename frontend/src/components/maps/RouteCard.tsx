import React from 'react';
import { Route as RouteIcon, Clock, Navigation, MapPin } from 'lucide-react';

interface RouteCardProps {
  originName?: string;
  destinationName: string;
  distanceKm: number;
  durationMinutes: number;
  mode?: string;
  steps?: Array<{ instruction: string; distance_km: number }>;
  onOpenMap?: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  originName = 'Current Location',
  destinationName,
  distanceKm,
  durationMinutes,
  mode = 'driving',
  steps = [],
  onOpenMap,
}) => {
  return (
    <div className="my-3 border border-[#00f0ff]/40 bg-[#081222]/95 rounded-xl p-3.5 shadow-[0_0_15px_rgba(0,240,255,0.15)] text-xs font-sans">
      <div className="flex items-center justify-between border-b border-[#00f0ff]/20 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <RouteIcon className="w-4 h-4 text-[#00f0ff]" />
          <span className="font-hud font-bold text-[#00f0ff] tracking-wider uppercase">
            ROUTE GUIDANCE
          </span>
        </div>
        <span className="font-mono text-[10px] text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-gray-800 uppercase">
          {mode}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-gray-300 font-mono text-[11px] bg-black/50 p-2 rounded border border-gray-800">
          <MapPin className="w-3.5 h-3.5 text-[#00ffaa] shrink-0" />
          <span className="truncate">{originName}</span>
          <span className="text-gray-500 mx-1">➔</span>
          <MapPin className="w-3.5 h-3.5 text-[#ff5555] shrink-0" />
          <span className="truncate font-bold text-white">{destinationName}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded border border-gray-800">
            <Navigation className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="text-gray-400">Distance:</span>
            <span className="text-white font-bold">{distanceKm} km</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded border border-gray-800">
            <Clock className="w-3.5 h-3.5 text-[#ffaa00]" />
            <span className="text-gray-400">ETA:</span>
            <span className="text-white font-bold">{durationMinutes} min</span>
          </div>
        </div>
      </div>

      {steps.length > 0 && (
        <div className="mb-3">
          <span className="text-[10px] uppercase font-hud tracking-wider text-gray-400 block mb-1">
            KEY STEPS:
          </span>
          <div className="space-y-1 bg-black/60 p-2 rounded border border-gray-800 max-h-28 overflow-y-auto font-mono text-[10px]">
            {steps.map((st, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-gray-300">
                <span className="text-[#00f0ff] font-bold">{idx + 1}.</span>
                <span className="flex-1">{st.instruction}</span>
                <span className="text-gray-500 shrink-0">{st.distance_km} km</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {onOpenMap && (
        <button
          onClick={onOpenMap}
          className="w-full bg-[#00f0ff]/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black font-semibold text-xs py-1.5 px-3 rounded border border-[#00f0ff]/40 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
        >
          <RouteIcon className="w-3.5 h-3.5" />
          <span>VIEW INTERACTIVE MAP</span>
        </button>
      )}
    </div>
  );
};
