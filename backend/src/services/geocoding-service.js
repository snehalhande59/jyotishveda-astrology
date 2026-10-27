'use strict';

const https = require('https');
const http = require('http');

// Curated high-accuracy reference locations for instant fallback & fast resolution
const PRESET_LOCATIONS = [
  { placeName: 'New Delhi, Delhi, India', city: 'New Delhi', state: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, timezoneOffset: 5.5 },
  { placeName: 'Mumbai, Maharashtra, India', city: 'Mumbai', state: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777, timezoneOffset: 5.5 },
  { placeName: 'Bengaluru, Karnataka, India', city: 'Bengaluru', state: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946, timezoneOffset: 5.5 },
  { placeName: 'Kolkata, West Bengal, India', city: 'Kolkata', state: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639, timezoneOffset: 5.5 },
  { placeName: 'Chennai, Tamil Nadu, India', city: 'Chennai', state: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707, timezoneOffset: 5.5 },
  { placeName: 'Hyderabad, Telangana, India', city: 'Hyderabad', state: 'Telangana', country: 'India', latitude: 17.3850, longitude: 78.4867, timezoneOffset: 5.5 },
  { placeName: 'Varanasi, Uttar Pradesh, India', city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', latitude: 25.3176, longitude: 82.9739, timezoneOffset: 5.5 },
  { placeName: 'Haridwar, Uttarakhand, India', city: 'Haridwar', state: 'Uttarakhand', country: 'India', latitude: 29.9457, longitude: 78.1642, timezoneOffset: 5.5 },
  { placeName: 'Ayodhya, Uttar Pradesh, India', city: 'Ayodhya', state: 'Uttar Pradesh', country: 'India', latitude: 26.7922, longitude: 82.1998, timezoneOffset: 5.5 },
  { placeName: 'Ujjain, Madhya Pradesh, India', city: 'Ujjain', state: 'Madhya Pradesh', country: 'India', latitude: 23.1765, longitude: 75.7885, timezoneOffset: 5.5 },
  { placeName: 'Jaipur, Rajasthan, India', city: 'Jaipur', state: 'Rajasthan', country: 'India', latitude: 26.9124, longitude: 75.7873, timezoneOffset: 5.5 },
  { placeName: 'Ahmedabad, Gujarat, India', city: 'Ahmedabad', state: 'Gujarat', country: 'India', latitude: 23.0225, longitude: 72.5714, timezoneOffset: 5.5 },
  { placeName: 'Pune, Maharashtra, India', city: 'Pune', state: 'Maharashtra', country: 'India', latitude: 18.5204, longitude: 73.8567, timezoneOffset: 5.5 },
  { placeName: 'Lucknow, Uttar Pradesh, India', city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462, timezoneOffset: 5.5 },
  { placeName: 'Patna, Bihar, India', city: 'Patna', state: 'Bihar', country: 'India', latitude: 25.5941, longitude: 85.1376, timezoneOffset: 5.5 },
  { placeName: 'London, Greater London, United Kingdom', city: 'London', state: 'England', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezoneOffset: 0.0 },
  { placeName: 'New York, New York, United States', city: 'New York', state: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, timezoneOffset: -5.0 },
  { placeName: 'San Francisco, California, United States', city: 'San Francisco', state: 'California', country: 'United States', latitude: 37.7749, longitude: -122.4194, timezoneOffset: -8.0 },
  { placeName: 'Dubai, Dubai, United Arab Emirates', city: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezoneOffset: 4.0 },
  { placeName: 'Singapore, Singapore', city: 'Singapore', state: 'Central', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezoneOffset: 8.0 },
  { placeName: 'Sydney, New South Wales, Australia', city: 'Sydney', state: 'New South Wales', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezoneOffset: 10.0 },
  { placeName: 'Toronto, Ontario, Canada', city: 'Toronto', state: 'Ontario', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezoneOffset: -5.0 },
  { placeName: 'Kathmandu, Bagmati, Nepal', city: 'Kathmandu', state: 'Bagmati', country: 'Nepal', latitude: 27.7172, longitude: 85.3240, timezoneOffset: 5.75 },
  { placeName: 'Colombo, Western, Sri Lanka', city: 'Colombo', state: 'Western', country: 'Sri Lanka', latitude: 6.9271, longitude: 79.8612, timezoneOffset: 5.5 },
];

/**
 * Derives approximate timezone offset in hours from longitude and country
 */
function deriveTimezoneOffset(lat, lon, country = '') {
  const c = (country || '').toLowerCase();
  if (c.includes('india') || c.includes('bharat') || c.includes('sri lanka')) return 5.5;
  if (c.includes('nepal')) return 5.75;
  if (c.includes('bangladesh')) return 6.0;
  if (c.includes('pakistan')) return 5.0;
  if (c.includes('united arab emirates') || c.includes('dubai')) return 4.0;
  if (c.includes('singapore') || c.includes('malaysia') || c.includes('hong kong')) return 8.0;
  if (c.includes('united kingdom') || c.includes('britain')) return 0.0;
  if (c.includes('japan')) return 9.0;
  if (c.includes('australia')) {
    if (lon > 140) return 10.0;
    if (lon > 125) return 9.5;
    return 8.0;
  }
  // Standard solar time zone approximation rounded to half-hour
  const rawOffset = lon / 15.0;
  return Math.round(rawOffset * 2) / 2;
}

function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          'User-Agent': 'JyotishVeda-Astrology-Platform/1.0 (contact@jyotishveda.com)',
          ...headers,
        },
        timeout: 4000,
      },
      (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`Geocoding HTTP error ${res.statusCode}`));
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Geocoding request timed out'));
    });
  });
}

class GeocodingService {
  constructor() {
    this.apiKey = process.env.GEOCODING_API_KEY || '';
  }

  async searchPlaces(query) {
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return PRESET_LOCATIONS.slice(0, 10);
    }

    const cleanQuery = query.trim().toLowerCase();

    // 1. Check exact/partial preset matches first for instant response
    const matchedPresets = PRESET_LOCATIONS.filter(
      (p) =>
        p.city.toLowerCase().includes(cleanQuery) ||
        p.placeName.toLowerCase().includes(cleanQuery) ||
        p.state.toLowerCase().includes(cleanQuery)
    );

    // 2. Query external real geocoding provider
    try {
      // Use Nominatim OpenStreetMap (reliable, zero API key needed)
      const encoded = encodeURIComponent(query.trim());
      const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&addressdetails=1&limit=8`;
      const data = await fetchJson(url);

      if (Array.isArray(data) && data.length > 0) {
        const liveResults = data.map((item) => {
          const addr = item.address || {};
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.county ||
            item.name ||
            'City';
          const state = addr.state || addr.region || '';
          const country = addr.country || 'India';
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          const tz = deriveTimezoneOffset(lat, lon, country);

          return {
            placeName: item.display_name,
            city,
            state,
            country,
            latitude: Number(lat.toFixed(4)),
            longitude: Number(lon.toFixed(4)),
            timezoneOffset: tz,
          };
        });

        // Combine live results with presets (avoiding duplicate city names)
        const combined = [...liveResults];
        for (const p of matchedPresets) {
          if (!combined.some((c) => c.city.toLowerCase() === p.city.toLowerCase())) {
            combined.push(p);
          }
        }
        return combined.slice(0, 10);
      }
    } catch (err) {
      console.warn('Live geocoding network notice, using curated fallback:', err.message);
    }

    // Fallback to presets if external network is unavailable
    if (matchedPresets.length > 0) {
      return matchedPresets;
    }

    // If query didn't match presets, return closest city from presets or popular defaults
    return PRESET_LOCATIONS.slice(0, 8);
  }
}

module.exports = new GeocodingService();
