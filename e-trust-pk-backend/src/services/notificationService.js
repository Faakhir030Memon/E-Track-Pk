/**
 * Notification Service for E-Trust PK
 * Simulates sending OTP via SMS and WhatsApp
 */

class NotificationService {
  static async sendOTP(phone, otp) {
    console.log(`
      ╔══════════════════════════════════════════════════╗
      ║             OUTGOING NOTIFICATIONS               ║
      ╠══════════════════════════════════════════════════╣
      ║ 📱 SMS to ${phone}: Your E-Trust OTP is ${otp}      ║
      ║ 💬 WhatsApp to ${phone}: Your E-Trust OTP is ${otp} ║
      ╚══════════════════════════════════════════════════╝
    `);

    // In production, you would integrate Twilio or Meta API here
    return true;
  }
}

module.exports = NotificationService;
