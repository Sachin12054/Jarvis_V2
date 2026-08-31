import React, { useState, useEffect } from 'react';
import { MapPin, Shield, Check, RefreshCw, X } from 'lucide-react';
import { locationService, DeviceLocation, LocationPermissionState } from '../../services/locationService';

interface LocationPermissionCardProps {
  purpose?: string;
  onGranted: (location: DeviceLocation) => void;
  onCancelled?: () => void;
}

export const LocationPermissionCard: React.FC<LocationPermissionCardProps> = ({
  purpose = 'Directions / Map / Current Location',
  onGranted,
  onCancelled,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permState, setPermState] = useState<LocationPermissionState>('LOCATION_PERMISSION_UNKNOWN');

  useEffect(() => {
    setPermState(locationService.getPermissionState());
  }, []);

  const handleAllowOrRefresh = async () => {
    console.log('[LOCATION DEBUG] Permission/Refresh button clicked');
    setLoading(true);
    setError(null);
    try {
      console.log('[LOCATION DEBUG] Browser geolocation request started');
      const loc = await locationService.requestCurrentLocation();
      setPermState(locationService.getPermissionState());
      console.log(`[LOCATION DEBUG] Position received\nlatitude=${loc.latitude}\nlongitude=${loc.longitude}\naccuracy=${loc.accuracy}`);
      onGranted(loc);
    } catch (err: any) {
      console.warn('[LOCATION DEBUG] Location request error:', err.message);
      setError(err.message || 'Failed to access location.');
    } finally {
      setLoading(false);
    }
  };

  const isGranted = permState === 'LOCATION_PERMISSION_GRANTED' || permState === 'LOCATION_TRACKING_ACTIVE';

  return (
    <div className="my-3 border border-[#00f0ff]/40 bg-[#0c1629]/95 rounded-xl p-3.5 shadow-[0_0_15px_rgba(0,240,255,0.15)] text-xs font-sans">
      <div className="flex items-center gap-2 border-b border-[#00f0ff]/20 pb-2 mb-2.5">
        <MapPin className="w-4 h-4 text-[#00f0ff]" />
        <span className="font-hud font-bold text-[#00f0ff] tracking-wider uppercase">
          {isGranted ? 'LOCATION ACTIVE' : 'LOCATION ACCESS REQUIRED'}
        </span>
      </div>

      <p className="text-gray-200 text-[11px] mb-2 leading-relaxed">
        {isGranted
          ? 'JARVIS has location access. Click refresh to update your current GPS coordinates.'
          : 'JARVIS needs your current device location to answer this request.'}
      </p>

      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-black/40 p-2 rounded mb-3 border border-gray-800">
        <Shield className="w-3.5 h-3.5 text-[#00ffaa] shrink-0" />
        <span>Purpose: <strong className="text-gray-200">{purpose}</strong></span>
      </div>

      {error && (
        <div className="p-2 mb-2.5 bg-[#ff5555]/10 border border-[#ff5555]/30 text-[#ff5555] rounded text-[11px]">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1 border-t border-gray-800">
        <button
          onClick={handleAllowOrRefresh}
          disabled={loading}
          className="flex-1 bg-[#00f0ff]/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black font-semibold text-xs py-1.5 px-3 rounded border border-[#00f0ff]/40 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.2)] disabled:opacity-50 cursor-pointer"
        >
          {isGranted ? <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> : <Check className="w-3.5 h-3.5" />}
          <span>{loading ? 'ACQUIRING GPS...' : (isGranted ? 'REFRESH LOCATION' : 'ALLOW LOCATION')}</span>
        </button>
        {onCancelled && (
          <button
            onClick={onCancelled}
            disabled={loading}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold text-xs py-1.5 px-3 rounded border border-gray-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>CANCEL</span>
          </button>
        )}
      </div>
    </div>
  );
};
