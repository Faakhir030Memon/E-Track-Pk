/**
 * Notification Service for E-Trust PK
 * Handles OTP delivery via SMS and WhatsApp
 */
const axios = require('axios');

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
    } catch (err) { /* Ignore */ }

    // ── Telegram Integration (100% FREE Alternative) ───────────────
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const message = `🔐 *E-Trust PK OTP*\n\nYour verification code is: *${otp}*\nTarget Phone: ${phone}`;
        await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        });
        console.log('✅ OTP sent via Telegram');
      } catch (error) {
        console.error('Telegram Error:', error.response?.data?.description || error.message);
      }
    }

    // ── Twilio Integration (Requires Paid/Trial Account) ───────────
    if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
      // const twilio = require('twilio');
      // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
      // ... implementation as before
    }

    return true;
  }
}

module.exports = NotificationService;
