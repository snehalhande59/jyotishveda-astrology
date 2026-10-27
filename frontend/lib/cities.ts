export interface CityLocation {
  name: string;
  stateCountry: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
}

export const POPULAR_CITIES: CityLocation[] = [
  { name: 'New Delhi', stateCountry: 'Delhi, India', latitude: 28.6139, longitude: 77.2090, timezoneOffset: 5.5 },
  { name: 'Mumbai', stateCountry: 'Maharashtra, India', latitude: 19.0760, longitude: 72.8777, timezoneOffset: 5.5 },
  { name: 'Bengaluru', stateCountry: 'Karnataka, India', latitude: 12.9716, longitude: 77.5946, timezoneOffset: 5.5 },
  { name: 'Kolkata', stateCountry: 'West Bengal, India', latitude: 22.5726, longitude: 88.3639, timezoneOffset: 5.5 },
  { name: 'Chennai', stateCountry: 'Tamil Nadu, India', latitude: 13.0827, longitude: 80.2707, timezoneOffset: 5.5 },
  { name: 'Hyderabad', stateCountry: 'Telangana, India', latitude: 17.3850, longitude: 78.4867, timezoneOffset: 5.5 },
  { name: 'Ahmedabad', stateCountry: 'Gujarat, India', latitude: 23.0225, longitude: 72.5714, timezoneOffset: 5.5 },
  { name: 'Pune', stateCountry: 'Maharashtra, India', latitude: 18.5204, longitude: 73.8567, timezoneOffset: 5.5 },
  { name: 'Jaipur', stateCountry: 'Rajasthan, India', latitude: 26.9124, longitude: 75.7873, timezoneOffset: 5.5 },
  { name: 'Varanasi', stateCountry: 'Uttar Pradesh, India', latitude: 25.3176, longitude: 82.9739, timezoneOffset: 5.5 },
  { name: 'Lucknow', stateCountry: 'Uttar Pradesh, India', latitude: 26.8467, longitude: 80.9462, timezoneOffset: 5.5 },
  { name: 'Indore', stateCountry: 'Madhya Pradesh, India', latitude: 22.7196, longitude: 75.8577, timezoneOffset: 5.5 },
  { name: 'Chandigarh', stateCountry: 'Punjab/Haryana, India', latitude: 30.7333, longitude: 76.7794, timezoneOffset: 5.5 },
  { name: 'Bhopal', stateCountry: 'Madhya Pradesh, India', latitude: 23.2599, longitude: 77.4126, timezoneOffset: 5.5 },
  { name: 'Patna', stateCountry: 'Bihar, India', latitude: 25.5941, longitude: 85.1376, timezoneOffset: 5.5 },
  { name: 'Surat', stateCountry: 'Gujarat, India', latitude: 21.1702, longitude: 72.8311, timezoneOffset: 5.5 },
  { name: 'London', stateCountry: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezoneOffset: 0.0 },
  { name: 'New York', stateCountry: 'USA', latitude: 40.7128, longitude: -74.0060, timezoneOffset: -5.0 },
  { name: 'San Francisco', stateCountry: 'USA', latitude: 37.7749, longitude: -122.4194, timezoneOffset: -8.0 },
  { name: 'Dubai', stateCountry: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezoneOffset: 4.0 },
  { name: 'Singapore', stateCountry: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezoneOffset: 8.0 },
  { name: 'Sydney', stateCountry: 'Australia', latitude: -33.8688, longitude: 151.2093, timezoneOffset: 10.0 },
  { name: 'Toronto', stateCountry: 'Canada', latitude: 43.6532, longitude: -79.3832, timezoneOffset: -5.0 },
];

export const CITIES = POPULAR_CITIES;
