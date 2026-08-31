import React, { useState, useEffect } from 'react';
import { Navigation, Square } from 'lucide-react';
import { locationService, DeviceLocation } from '../../services/locationService';

interface LocationStatusCardProps {
  initialArea?: string;
  onStop?: () => void;
}

export const LocationStatusCard: React.FC<LocationStatusCardProps> = ({
  initialArea = 'Current Position',
  onStop,
}) => {
  const [isTracking, setIsTracking] = useState(true);
  const [location, setLocation] = useState<DeviceLocation | null>(locationService.getCurrentLocation());

  useEffect(() => {
    locationService.startLocationTracking((loc) => {
      setLocation(loc);
    });

    return () => {
      // Keep tracking active until explicitly stopped by user action
    };
  }, []);

  const handleStop = () => {
    locationService.stopLocationTracking();
    setIsTracking(false);
    if (onStop) onStop();
  };

  return (
    <div className="my-3 border border-[#00ffaa]/40 bg-[#0a1a1b]/95 rounded-xl p-3.5 shadow-[0_0_15px_rgba(0,255,170,0.15)] text-xs font-sans">
      <div className="flex items-center justify-between border-b border-[#00ffaa]/20 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Navigation className={`w-4 h-4 text-[#00ffaa] ${isTracking ? 'animate-pulse' : ''}`} />
          <span className="font-hud font-bold text-[#00ffaa] tracking-wider uppercase">
            LOCATION TRACKING
          </span>
        </div>
        <span className={`font-mono text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${
          isTracking ? 'bg-[#00ffaa]/20 border-[#00ffaa]/50 text-[#00ffaa]' : 'bg-gray-800 border-gray-700 text-gray-400'
        }`}>
          {isTracking ? 'ACTIVE' : 'STOPPED'}
        </span>
      </div>

      <div className="space-y-1.5 text-[11px] mb-3 font-mono">
        <div className="flex items-center justify-between bg-black/40 p-1.5 rounded border border-gray-800">
          <span className="text-gray-400">Current Area:</span>
          <span className="text-[#00f0ff] font-bold">{initialArea}</span>
        </div>

        <div className="flex items-center justify-between bg-black/40 p-1.5 rounded border border-gray-800">
          <span className="text-gray-400">Accuracy:</span>
          <span className="text-gray-200">
            {location?.accuracy ? `${Math.round(location.accuracy)} m` : 'Standard GPS'}
          </span>
        </div>
      </div>

      {isTracking && (
        <button
          onClick={handleStop}
          className="w-full bg-[#ff5555]/20 hover:bg-[#ff5555] text-[#ff5555] hover:text-black font-semibold text-xs py-1.5 px-3 rounded border border-[#ff5555]/40 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(255,85,85,0.2)]"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>STOP TRACKING</span>
        </button>
      )}
    </div>
  );
};
