/**
 * Notification Service for E-Trust PK
 * Handles OTP delivery via SMS and WhatsApp
 */
// const twilio = require('twilio');

class NotificationService {
  /**
   * Send OTP to a phone number
   * @param {string} phone - Format: +923001234567
   * @param {string} otp - 6-digit code
   */
  static async sendOTP(phone, otp) {
    console.log(`
      ╔══════════════════════════════════════════════════╗
      ║             OUTGOING NOTIFICATIONS               ║
      ╠══════════════════════════════════════════════════╣
      ║ 📱 SMS to ${phone}: Your E-Trust OTP is ${otp}      ║
      ║ 💬 WhatsApp to ${phone}: Your E-Trust OTP is ${otp} ║
      ╚══════════════════════════════════════════════════╝
    `);

    // ── Development Helper: Write to local file ─────────────────────
    try {
      const fs = require('fs');
      const path = require('path');
      const otpPath = path.join(process.cwd(), 'LATEST_OTP.txt');
      fs.writeFileSync(otpPath, `Latest OTP for ${phone}: ${otp}\nSent at: ${new Date().toLocaleString()}`);
    } catch (err) {
      // Ignore fs errors in production
    }

    // ── Twilio Integration (Uncomment to enable real SMS) ───────────
    /*
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    
    try {
      // Send SMS
      await client.messages.create({
        body: `Your E-Trust PK verification code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });

      // Send WhatsApp
      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        body: `Your E-Trust PK verification code is: ${otp}`,
        to: `whatsapp:${phone}`
      });
    } catch (error) {
      console.error('Twilio Error:', error.message);
    }
    */

    return true;
  }
}

module.exports = NotificationService;
