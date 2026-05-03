const crypto = require('crypto');

/**
 * Normalize Pakistani phone numbers to a consistent format
 * Handles: +923001234567, 923001234567, 03001234567, 3001234567
 * Output: 923001234567 (always without +)
 */
const normalizePhone = (phone) => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // Handle different formats
  if (cleaned.startsWith('92') && cleaned.length === 12) {
    return cleaned; // Already in 92XXXXXXXXXX format
  }
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return '92' + cleaned.substring(1); // 0300... → 92300...
  }
  if (cleaned.length === 10 && !cleaned.startsWith('0')) {
    return '92' + cleaned; // 300... → 92300...
  }

  // Fallback: return cleaned number
  return cleaned;
};

/**
 * Create SHA-256 hash of a phone number
 * Steps: Normalize → Salt → Hash
 * This ensures +92300, 0300, and 92300 all produce the SAME hash
 */
const hashPhone = (phone) => {
  const salt = process.env.HASH_SALT || 'e-trust-pk-default-salt';
  const normalized = normalizePhone(phone);
  return crypto.createHash('sha256').update(salt + normalized).digest('hex');
};

/**
 * Generate a unique API key for stores
 */
const generateApiKey = () => {
  return 'etpk_' + crypto.randomBytes(32).toString('hex');
};

/**
 * Generate a unique store ID
 */
const generateStoreId = () => {
  return 'store_' + crypto.randomBytes(8).toString('hex');
};

module.exports = {
  normalizePhone,
  hashPhone,
  generateApiKey,
  generateStoreId,
};
