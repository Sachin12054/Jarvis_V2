export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export type LocationPermissionState =
  | 'LOCATION_PERMISSION_UNKNOWN'
  | 'LOCATION_PERMISSION_GRANTED'
  | 'LOCATION_PERMISSION_DENIED'
  | 'LOCATION_UNAVAILABLE'
  | 'LOCATION_TRACKING_ACTIVE'
  | 'LOCATION_TRACKING_STOPPED';

class LocationService {
  private currentLocation: DeviceLocation | null = null;
  private permissionState: LocationPermissionState = 'LOCATION_PERMISSION_UNKNOWN';
  private watchId: number | null = null;
  private trackingListeners: Set<(loc: DeviceLocation) => void> = new Set();

  getPermissionState(): LocationPermissionState {
    return this.permissionState;
  }

  getCurrentLocation(): DeviceLocation | null {
    return this.currentLocation;
  }

  async requestCurrentLocation(): Promise<DeviceLocation> {
    if (!('geolocation' in navigator)) {
      this.permissionState = 'LOCATION_UNAVAILABLE';
      throw new Error('Geolocation is not supported by your browser or device.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.permissionState = 'LOCATION_PERMISSION_GRANTED';
          const loc: DeviceLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy ?? null,
            altitude: position.coords.altitude ?? null,
            heading: position.coords.heading ?? null,
            speed: position.coords.speed ?? null,
            timestamp: position.timestamp,
          };
          this.currentLocation = loc;
          resolve(loc);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            this.permissionState = 'LOCATION_PERMISSION_DENIED';
          } else {
            this.permissionState = 'LOCATION_UNAVAILABLE';
          }
          reject(new Error(this.getErrorMessage(error)));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  startLocationTracking(onUpdate: (loc: DeviceLocation) => void): void {
    if (!('geolocation' in navigator)) {
      this.permissionState = 'LOCATION_UNAVAILABLE';
      return;
    }

    this.trackingListeners.add(onUpdate);
    if (this.watchId !== null) return;

    this.permissionState = 'LOCATION_TRACKING_ACTIVE';
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const loc: DeviceLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy ?? null,
          altitude: position.coords.altitude ?? null,
          heading: position.coords.heading ?? null,
          speed: position.coords.speed ?? null,
          timestamp: position.timestamp,
        };
        this.currentLocation = loc;
        this.trackingListeners.forEach((listener) => listener(loc));
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          this.permissionState = 'LOCATION_PERMISSION_DENIED';
          this.stopLocationTracking();
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  }

  stopLocationTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.trackingListeners.clear();
    this.permissionState = 'LOCATION_TRACKING_STOPPED';
  }

  clearLocation(): void {
    this.stopLocationTracking();
    this.currentLocation = null;
    this.permissionState = 'LOCATION_PERMISSION_UNKNOWN';
  }

  private getErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location permission was denied. Enable location access in your browser settings and try again.';
      case error.POSITION_UNAVAILABLE:
        return 'Your device could not determine your current location.';
      case error.TIMEOUT:
        return 'Location request timed out. Please try again.';
      default:
        return 'An unknown location error occurred.';
    }
  }
}

export const locationService = new LocationService();
