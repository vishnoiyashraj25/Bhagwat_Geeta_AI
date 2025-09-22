const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);
const OTP_EXP = Number(process.env.OTP_EXPIRY_SECONDS || 300);

async function sendOtp(phone) {
  const otp = Math.floor(100000 + Math.random()*900000).toString();
  await redis.set(`otp:${phone}`, otp, 'EX', OTP_EXP);
  // PLACEHOLDER: integrate Twilio/SMSSender here
  console.log(`DEBUG: OTP for ${phone} is ${otp}`);
  return true;
}

async function verifyOtp(phone, code) {
  const stored = await redis.get(`otp:${phone}`);
  if (stored === code) {
    await redis.del(`otp:${phone}`);
    return true;
  }
  return false;
}

module.exports = { sendOtp, verifyOtp };
