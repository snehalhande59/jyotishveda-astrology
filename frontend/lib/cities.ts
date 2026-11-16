export interface CityLocation {
  name: string;
  stateCountry: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  aliases?: string[];
}

export const POPULAR_CITIES: CityLocation[] = [
  // --- Maharashtra (Special focus with exact astronomical coordinates) ---
  { name: 'Sangamner', stateCountry: 'Maharashtra, India', latitude: 19.5678, longitude: 74.2115, timezoneOffset: 5.5, aliases: ['Sangamner', 'संगमनेर', 'Ahmednagar'] },
  { name: 'Mumbai', stateCountry: 'Maharashtra, India', latitude: 19.0760, longitude: 72.8777, timezoneOffset: 5.5, aliases: ['Bombay', 'मुंबई'] },
  { name: 'Pune', stateCountry: 'Maharashtra, India', latitude: 18.5204, longitude: 73.8567, timezoneOffset: 5.5, aliases: ['Poona', 'पुणे'] },
  { name: 'Nashik', stateCountry: 'Maharashtra, India', latitude: 19.9975, longitude: 73.7898, timezoneOffset: 5.5, aliases: ['Nasik', 'नाशिक'] },
  { name: 'Ahmednagar', stateCountry: 'Maharashtra, India', latitude: 19.0952, longitude: 74.7496, timezoneOffset: 5.5, aliases: ['Ahilyanagar', 'अहमदनगर', 'अहिल्यानगर'] },
  { name: 'Shirdi', stateCountry: 'Maharashtra, India', latitude: 19.7667, longitude: 74.4767, timezoneOffset: 5.5, aliases: ['शिर्डी', 'Rahata'] },
  { name: 'Chhatrapati Sambhajinagar', stateCountry: 'Maharashtra, India', latitude: 19.8762, longitude: 75.3433, timezoneOffset: 5.5, aliases: ['Aurangabad', 'औरंगाबाद', 'संभाजीनगर'] },
  { name: 'Nagpur', stateCountry: 'Maharashtra, India', latitude: 21.1458, longitude: 79.0882, timezoneOffset: 5.5, aliases: ['नागपूर'] },
  { name: 'Thane', stateCountry: 'Maharashtra, India', latitude: 19.2183, longitude: 72.9781, timezoneOffset: 5.5, aliases: ['ठाणे'] },
  { name: 'Navi Mumbai', stateCountry: 'Maharashtra, India', latitude: 19.0330, longitude: 73.0297, timezoneOffset: 5.5, aliases: ['नवी मुंबई', 'Vashi', 'Nerul', 'Belapur'] },
  { name: 'Kalyan', stateCountry: 'Maharashtra, India', latitude: 19.2403, longitude: 73.1305, timezoneOffset: 5.5, aliases: ['कल्याण', 'Dombivli'] },
  { name: 'Kolhapur', stateCountry: 'Maharashtra, India', latitude: 16.7050, longitude: 74.2433, timezoneOffset: 5.5, aliases: ['कोल्हापूर'] },
  { name: 'Solapur', stateCountry: 'Maharashtra, India', latitude: 17.6599, longitude: 75.9064, timezoneOffset: 5.5, aliases: ['सोलापूर'] },
  { name: 'Satara', stateCountry: 'Maharashtra, India', latitude: 17.6805, longitude: 73.9997, timezoneOffset: 5.5, aliases: ['सातारा', 'Karad', 'Wai'] },
  { name: 'Sangli', stateCountry: 'Maharashtra, India', latitude: 16.8524, longitude: 74.5815, timezoneOffset: 5.5, aliases: ['सांगली', 'Miraj'] },
  { name: 'Jalgaon', stateCountry: 'Maharashtra, India', latitude: 21.0077, longitude: 75.5626, timezoneOffset: 5.5, aliases: ['जळगाव', 'Bhusawal'] },
  { name: 'Dhule', stateCountry: 'Maharashtra, India', latitude: 20.9042, longitude: 74.7749, timezoneOffset: 5.5, aliases: ['धुळे'] },
  { name: 'Nanded', stateCountry: 'Maharashtra, India', latitude: 19.1383, longitude: 77.3210, timezoneOffset: 5.5, aliases: ['नांदेड'] },
  { name: 'Amravati', stateCountry: 'Maharashtra, India', latitude: 20.9320, longitude: 77.7523, timezoneOffset: 5.5, aliases: ['अमरावती'] },
  { name: 'Akola', stateCountry: 'Maharashtra, India', latitude: 20.7002, longitude: 77.0082, timezoneOffset: 5.5, aliases: ['अकोला'] },
  { name: 'Latur', stateCountry: 'Maharashtra, India', latitude: 18.4088, longitude: 76.5604, timezoneOffset: 5.5, aliases: ['लातूर'] },
  { name: 'Dharashiv', stateCountry: 'Maharashtra, India', latitude: 18.1861, longitude: 76.0419, timezoneOffset: 5.5, aliases: ['Osmanabad', 'उस्मानाबाद', 'धाराशिव'] },
  { name: 'Parbhani', stateCountry: 'Maharashtra, India', latitude: 19.2644, longitude: 76.7749, timezoneOffset: 5.5, aliases: ['परभणी'] },
  { name: 'Jalna', stateCountry: 'Maharashtra, India', latitude: 19.8410, longitude: 75.8864, timezoneOffset: 5.5, aliases: ['जालना'] },
  { name: 'Beed', stateCountry: 'Maharashtra, India', latitude: 18.9891, longitude: 75.7601, timezoneOffset: 5.5, aliases: ['बीड'] },
  { name: 'Ratnagiri', stateCountry: 'Maharashtra, India', latitude: 16.9902, longitude: 73.3120, timezoneOffset: 5.5, aliases: ['रत्नागिरी', 'Chiplun'] },
  { name: 'Sindhudurg', stateCountry: 'Maharashtra, India', latitude: 16.1115, longitude: 73.7126, timezoneOffset: 5.5, aliases: ['सिंधुदुर्ग', 'Kudal', 'Sawantwadi', 'Malvan'] },
  { name: 'Raigad', stateCountry: 'Maharashtra, India', latitude: 18.5158, longitude: 73.1822, timezoneOffset: 5.5, aliases: ['रायगड', 'Alibag', 'Panvel'] },
  { name: 'Palghar', stateCountry: 'Maharashtra, India', latitude: 19.6967, longitude: 72.7699, timezoneOffset: 5.5, aliases: ['पालघर', 'Vasai', 'Virar'] },
  { name: 'Wardha', stateCountry: 'Maharashtra, India', latitude: 20.7453, longitude: 78.6022, timezoneOffset: 5.5, aliases: ['वर्धा', 'Sevagram'] },
  { name: 'Chandrapur', stateCountry: 'Maharashtra, India', latitude: 19.9615, longitude: 79.2961, timezoneOffset: 5.5, aliases: ['चंद्रपूर'] },
  { name: 'Yavatmal', stateCountry: 'Maharashtra, India', latitude: 20.3888, longitude: 78.1204, timezoneOffset: 5.5, aliases: ['यवतमाळ'] },
  { name: 'Gondia', stateCountry: 'Maharashtra, India', latitude: 21.4624, longitude: 80.1961, timezoneOffset: 5.5, aliases: ['गोंदिया'] },
  { name: 'Bhandara', stateCountry: 'Maharashtra, India', latitude: 21.1713, longitude: 79.6547, timezoneOffset: 5.5, aliases: ['भंडारा'] },
  { name: 'Nandurbar', stateCountry: 'Maharashtra, India', latitude: 21.3687, longitude: 74.2415, timezoneOffset: 5.5, aliases: ['नंदुरबार'] },
  { name: 'Buldhana', stateCountry: 'Maharashtra, India', latitude: 20.5292, longitude: 76.1843, timezoneOffset: 5.5, aliases: ['बुलढाणा', 'Shegaon'] },
  { name: 'Washim', stateCountry: 'Maharashtra, India', latitude: 20.1085, longitude: 77.1350, timezoneOffset: 5.5, aliases: ['वाशीम'] },
  { name: 'Hingoli', stateCountry: 'Maharashtra, India', latitude: 19.7198, longitude: 77.1485, timezoneOffset: 5.5, aliases: ['हिंगोली'] },
  { name: 'Gadchiroli', stateCountry: 'Maharashtra, India', latitude: 20.1804, longitude: 79.9984, timezoneOffset: 5.5, aliases: ['गडचिरोली'] },
  { name: 'Kopargaon', stateCountry: 'Maharashtra, India', latitude: 19.8911, longitude: 74.4828, timezoneOffset: 5.5, aliases: ['कोपरगाव'] },
  { name: 'Sinnar', stateCountry: 'Maharashtra, India', latitude: 19.8453, longitude: 73.9983, timezoneOffset: 5.5, aliases: ['सिन्नर'] },
  { name: 'Malegaon', stateCountry: 'Maharashtra, India', latitude: 20.5539, longitude: 74.5288, timezoneOffset: 5.5, aliases: ['मालेगाव'] },

  // --- Major National Metro & Holy / Cultural Hubs ---
  { name: 'New Delhi', stateCountry: 'Delhi, India', latitude: 28.6139, longitude: 77.2090, timezoneOffset: 5.5, aliases: ['Delhi', 'दिल्ली', 'NCR'] },
  { name: 'Bengaluru', stateCountry: 'Karnataka, India', latitude: 12.9716, longitude: 77.5946, timezoneOffset: 5.5, aliases: ['Bangalore', 'बेंगळुरू'] },
  { name: 'Kolkata', stateCountry: 'West Bengal, India', latitude: 22.5726, longitude: 88.3639, timezoneOffset: 5.5, aliases: ['Calcutta', 'कोलकाता'] },
  { name: 'Chennai', stateCountry: 'Tamil Nadu, India', latitude: 13.0827, longitude: 80.2707, timezoneOffset: 5.5, aliases: ['Madras', 'चेन्नई'] },
  { name: 'Hyderabad', stateCountry: 'Telangana, India', latitude: 17.3850, longitude: 78.4867, timezoneOffset: 5.5, aliases: ['Secunderabad', 'हैदराबाद'] },
  { name: 'Ahmedabad', stateCountry: 'Gujarat, India', latitude: 23.0225, longitude: 72.5714, timezoneOffset: 5.5, aliases: ['अहमदाबाद'] },
  { name: 'Surat', stateCountry: 'Gujarat, India', latitude: 21.1702, longitude: 72.8311, timezoneOffset: 5.5, aliases: ['सुरत'] },
  { name: 'Vadodara', stateCountry: 'Gujarat, India', latitude: 22.3072, longitude: 73.1812, timezoneOffset: 5.5, aliases: ['Baroda', 'वडोदरा'] },
  { name: 'Rajkot', stateCountry: 'Gujarat, India', latitude: 22.3039, longitude: 70.8022, timezoneOffset: 5.5, aliases: ['राजकोट'] },
  { name: 'Jaipur', stateCountry: 'Rajasthan, India', latitude: 26.9124, longitude: 75.7873, timezoneOffset: 5.5, aliases: ['जयपूर'] },
  { name: 'Jodhpur', stateCountry: 'Rajasthan, India', latitude: 26.2389, longitude: 73.0243, timezoneOffset: 5.5, aliases: ['जोधपूर'] },
  { name: 'Udaipur', stateCountry: 'Rajasthan, India', latitude: 24.5854, longitude: 73.7125, timezoneOffset: 5.5, aliases: ['उदयपूर'] },
  { name: 'Varanasi', stateCountry: 'Uttar Pradesh, India', latitude: 25.3176, longitude: 82.9739, timezoneOffset: 5.5, aliases: ['Kashi', 'Benares', 'वाराणसी', 'काशी'] },
  { name: 'Ayodhya', stateCountry: 'Uttar Pradesh, India', latitude: 26.7922, longitude: 82.1998, timezoneOffset: 5.5, aliases: ['अयोध्या'] },
  { name: 'Mathura', stateCountry: 'Uttar Pradesh, India', latitude: 27.4924, longitude: 77.6737, timezoneOffset: 5.5, aliases: ['मथुरा', 'Vrindavan'] },
  { name: 'Haridwar', stateCountry: 'Uttarakhand, India', latitude: 29.9457, longitude: 78.1642, timezoneOffset: 5.5, aliases: ['हरिद्वार', 'Rishikesh'] },
  { name: 'Ujjain', stateCountry: 'Madhya Pradesh, India', latitude: 23.1765, longitude: 75.7885, timezoneOffset: 5.5, aliases: ['उज्जैन', 'Avantika'] },
  { name: 'Indore', stateCountry: 'Madhya Pradesh, India', latitude: 22.7196, longitude: 75.8577, timezoneOffset: 5.5, aliases: ['इंदूर'] },
  { name: 'Bhopal', stateCountry: 'Madhya Pradesh, India', latitude: 23.2599, longitude: 77.4126, timezoneOffset: 5.5, aliases: ['भोपाळ'] },
  { name: 'Lucknow', stateCountry: 'Uttar Pradesh, India', latitude: 26.8467, longitude: 80.9462, timezoneOffset: 5.5, aliases: ['लखनौ'] },
  { name: 'Prayagraj', stateCountry: 'Uttar Pradesh, India', latitude: 25.4358, longitude: 81.8463, timezoneOffset: 5.5, aliases: ['Allahabad', 'प्रयागराज'] },
  { name: 'Patna', stateCountry: 'Bihar, India', latitude: 25.5941, longitude: 85.1376, timezoneOffset: 5.5, aliases: ['पाटणा', 'Pataliputra'] },
  { name: 'Gaya', stateCountry: 'Bihar, India', latitude: 24.7914, longitude: 85.0002, timezoneOffset: 5.5, aliases: ['गया', 'Bodh Gaya'] },
  { name: 'Chandigarh', stateCountry: 'Punjab/Haryana, India', latitude: 30.7333, longitude: 76.7794, timezoneOffset: 5.5, aliases: ['चंदीगड'] },
  { name: 'Amritsar', stateCountry: 'Punjab, India', latitude: 31.6340, longitude: 74.8723, timezoneOffset: 5.5, aliases: ['अमृतसर'] },
  { name: 'Ludhiana', stateCountry: 'Punjab, India', latitude: 30.9010, longitude: 75.8573, timezoneOffset: 5.5, aliases: ['लुधियाना'] },
  { name: 'Dehradun', stateCountry: 'Uttarakhand, India', latitude: 30.3165, longitude: 78.0322, timezoneOffset: 5.5, aliases: ['डेहराडून'] },
  { name: 'Shimla', stateCountry: 'Himachal Pradesh, India', latitude: 31.1048, longitude: 77.1734, timezoneOffset: 5.5, aliases: ['शिमला'] },
  { name: 'Srinagar', stateCountry: 'Jammu & Kashmir, India', latitude: 34.0837, longitude: 74.7973, timezoneOffset: 5.5, aliases: ['श्रीनगर'] },
  { name: 'Jammu', stateCountry: 'Jammu & Kashmir, India', latitude: 32.7266, longitude: 74.8570, timezoneOffset: 5.5, aliases: ['जम्मू'] },
  { name: 'Ranchi', stateCountry: 'Jharkhand, India', latitude: 23.3441, longitude: 85.3096, timezoneOffset: 5.5, aliases: ['रांची'] },
  { name: 'Raipur', stateCountry: 'Chhattisgarh, India', latitude: 21.2514, longitude: 81.6296, timezoneOffset: 5.5, aliases: ['रायपूर'] },
  { name: 'Bhubaneswar', stateCountry: 'Odisha, India', latitude: 20.2961, longitude: 85.8245, timezoneOffset: 5.5, aliases: ['भुवनेश्वर', 'Puri'] },
  { name: 'Guwahati', stateCountry: 'Assam, India', latitude: 26.1445, longitude: 91.7362, timezoneOffset: 5.5, aliases: ['गुवाहाटी'] },
  { name: 'Goa', stateCountry: 'Goa, India', latitude: 15.2993, longitude: 74.1240, timezoneOffset: 5.5, aliases: ['Panaji', 'गोव़ा', 'Margao'] },
  { name: 'Kochi', stateCountry: 'Kerala, India', latitude: 9.9312, longitude: 76.2673, timezoneOffset: 5.5, aliases: ['Cochin', 'कोची'] },
  { name: 'Thiruvananthapuram', stateCountry: 'Kerala, India', latitude: 8.5241, longitude: 76.9366, timezoneOffset: 5.5, aliases: ['Trivandrum', 'तिरुवनंतपुरम'] },
  { name: 'Coimbatore', stateCountry: 'Tamil Nadu, India', latitude: 11.0168, longitude: 76.9558, timezoneOffset: 5.5, aliases: ['कोइम्बतूर'] },
  { name: 'Madurai', stateCountry: 'Tamil Nadu, India', latitude: 9.9252, longitude: 78.1198, timezoneOffset: 5.5, aliases: ['मदुराई'] },
  { name: 'Mysuru', stateCountry: 'Karnataka, India', latitude: 12.2958, longitude: 76.6394, timezoneOffset: 5.5, aliases: ['Mysore', 'म्हैसूर'] },
  { name: 'Hubballi', stateCountry: 'Karnataka, India', latitude: 15.3647, longitude: 75.1240, timezoneOffset: 5.5, aliases: ['Hubli', 'हुबळी'] },

  // --- International Hubs ---
  { name: 'London', stateCountry: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezoneOffset: 0.0, aliases: ['लंडन'] },
  { name: 'New York', stateCountry: 'USA', latitude: 40.7128, longitude: -74.0060, timezoneOffset: -5.0, aliases: ['NYC', 'न्यू यॉर्क'] },
  { name: 'San Francisco', stateCountry: 'USA', latitude: 37.7749, longitude: -122.4194, timezoneOffset: -8.0, aliases: ['SF', 'California'] },
  { name: 'Dubai', stateCountry: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezoneOffset: 4.0, aliases: ['दुबई', 'UAE'] },
  { name: 'Singapore', stateCountry: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezoneOffset: 8.0, aliases: ['सिंगापूर'] },
  { name: 'Sydney', stateCountry: 'Australia', latitude: -33.8688, longitude: 151.2093, timezoneOffset: 10.0, aliases: ['सिडनी'] },
  { name: 'Toronto', stateCountry: 'Canada', latitude: 43.6532, longitude: -79.3832, timezoneOffset: -5.0, aliases: ['टोरोंटो'] },
  { name: 'Kathmandu', stateCountry: 'Nepal', latitude: 27.7172, longitude: 85.3240, timezoneOffset: 5.75, aliases: ['काठमांडू'] },
  { name: 'Colombo', stateCountry: 'Sri Lanka', latitude: 6.9271, longitude: 79.8612, timezoneOffset: 5.5, aliases: ['कोलंबो'] },
];

export const CITIES = POPULAR_CITIES;

/**
 * Searches the curated offline city database with fuzzy match
 */
export function searchLocalCities(query: string): CityLocation[] {
  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return POPULAR_CITIES.slice(0, 8);
  }

  const q = query.trim().toLowerCase();
  return POPULAR_CITIES.filter((c) => {
    return (
      c.name.toLowerCase().includes(q) ||
      c.stateCountry.toLowerCase().includes(q) ||
      (c.aliases && c.aliases.some((a) => a.toLowerCase().includes(q)))
    );
  }).slice(0, 10);
}
