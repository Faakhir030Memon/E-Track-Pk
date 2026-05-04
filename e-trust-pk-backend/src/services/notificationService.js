/**
 * Notification Service for E-Trust PK
 * Handles OTP delivery via SMS and WhatsApp
 */
const twilio = require('twilio');

class NotificationService {
  /**
   * Send OTP to a phone number
   * @param {string} phone - Target phone number
   * @param {string} otp - 6-digit code
   */
  static async sendOTP(phone, otp) {
    // 1. Console Logging (Always for development)
    console.log(`
      ╔══════════════════════════════════════════════════╗
      ║             OUTGOING NOTIFICATIONS               ║
      ╠══════════════════════════════════════════════════╣
      ║ 📱 SMS to ${phone}: Your E-Trust OTP is ${otp}      ║
      ║ 💬 WhatsApp to ${phone}: Your E-Trust OTP is ${otp} ║
      ╚══════════════════════════════════════════════════╝
    `);

    // 2. Development Helper: Write to local file
    try {
      const fs = require('fs');
      const path = require('path');
      const otpPath = path.join(process.cwd(), 'LATEST_OTP.txt');
      fs.writeFileSync(otpPath, `Latest OTP for ${phone}: ${otp}\nSent at: ${new Date().toLocaleString()}`);
    } catch (err) { /* Ignore fs errors */ }

    // 3. Real Twilio Integration (Commented out for now)
    /*
    if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        
        // Send SMS
        await client.messages.create({
          body: `Your E-Trust PK verification code is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone
        });

        // Send WhatsApp (requires sandbox setup or approved template)
        if (process.env.TWILIO_WHATSAPP_NUMBER) {
          await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            body: `Your E-Trust PK verification code is: ${otp}`,
            to: `whatsapp:${phone}`
          });
        }
        
        console.log('✅ OTP sent via Twilio');
      } catch (error) {
        console.error('❌ Twilio Integration Error:', error.message);
      }
    }
    */

    return true;
  }
}

module.exports = NotificationService;
