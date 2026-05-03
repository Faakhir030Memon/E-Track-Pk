/**
 * Address Validation Utility
 * Checks address completeness and flags suspicious patterns
 */

const PAKISTAN_CITIES = [
  'karachi', 'lahore', 'islamabad', 'rawalpindi', 'faisalabad',
  'multan', 'peshawar', 'quetta', 'sialkot', 'gujranwala',
  'hyderabad', 'bahawalpur', 'sargodha', 'sukkur', 'larkana',
  'sheikhupura', 'rahim yar khan', 'jhang', 'dera ghazi khan',
  'gujrat', 'sahiwal', 'wah cantonment', 'mardan', 'kasur',
  'okara', 'mingora', 'nawabshah', 'chiniot', 'kotri',
  'kamoke', 'hafizabad', 'sadiqabad', 'mirpur khas', 'burewala',
  'kohat', 'khanewal', 'dera ismail khan', 'turbat', 'muzaffargarh',
  'abbottabad', 'mansehra', 'swabi', 'chakwal', 'jhelum',
  'muzaffarabad', 'attock', 'tando adam', 'dadu', 'khairpur',
];

// Common abbreviations that flag incomplete addresses
const SUSPICIOUS_PATTERNS = [
  /^[\w\s]{1,10}$/,           // Too short (e.g., just "Karachi")
  /test/i,                     // Test addresses
  /abc/i,                      // Placeholder
  /xxx/i,                      // Placeholder
  /asdf/i,                     // Keyboard smash
  /1234/,                      // Sequential numbers
];

// Common abbreviation corrections
const ABBREVIATION_MAP = {
  'khi': 'karachi',
  'lhr': 'lahore',
  'isb': 'islamabad',
  'rwp': 'rawalpindi',
  'fsd': 'faisalabad',
  'mlt': 'multan',
  'pew': 'peshawar',
  'pwr': 'peshawar',
  'pindi': 'rawalpindi',
  'pnd': 'rawalpindi',
  'hyd': 'hyderabad',
  'qta': 'quetta',
  'skt': 'sialkot',
  'grw': 'gujranwala',
};

/**
 * Validate and analyze an address
 * Returns: { isComplete, city, flags[], score }
 */
const validateAddress = (addressString) => {
  if (!addressString || typeof addressString !== 'string') {
    return {
      isComplete: false,
      city: null,
      flags: ['missing_address'],
      addressScore: 0,
    };
  }

  const address = addressString.toLowerCase().trim();
  const flags = [];
  let addressScore = 100;

  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(address)) {
      flags.push('suspicious_pattern');
      addressScore -= 30;
      break;
    }
  }

  // Check address length (minimum reasonable address)
  if (address.length < 15) {
    flags.push('too_short');
    addressScore -= 20;
  }

  // Check for city name
  let detectedCity = null;
  for (const city of PAKISTAN_CITIES) {
    if (address.includes(city)) {
      detectedCity = city;
      break;
    }
  }

  // Check abbreviations if no city found
  if (!detectedCity) {
    for (const [abbr, fullCity] of Object.entries(ABBREVIATION_MAP)) {
      const words = address.split(/[\s,]+/);
      if (words.includes(abbr)) {
        detectedCity = fullCity;
        flags.push('abbreviated_city');
        addressScore -= 10;
        break;
      }
    }
  }

  if (!detectedCity) {
    flags.push('no_city_detected');
    addressScore -= 15;
  }

  // Check for house/street number
  const hasNumber = /\d/.test(address);
  if (!hasNumber) {
    flags.push('no_house_number');
    addressScore -= 10;
  }

  // Check for street/road/sector mention
  const hasStreet = /street|st\.|road|rd\.|sector|block|phase|gulshan|dha|bahria|nazimabad|north|south|saddar|clifton|defence|johar/i.test(address);
  if (!hasStreet) {
    flags.push('no_street_info');
    addressScore -= 10;
  }

  return {
    isComplete: addressScore >= 60,
    city: detectedCity,
    flags,
    addressScore: Math.max(0, Math.min(100, addressScore)),
  };
};

module.exports = { validateAddress, ABBREVIATION_MAP };
