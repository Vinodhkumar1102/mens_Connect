const client = require('../config/twilio');

// Pick up any common env names for the Verify Service SID
const VERIFY_SID = process.env.TWILIO_VERIFY_SID || process.env.TWILIO_SERVICE_SID || process.env.TWILIO_VERIFY_SERVICE_SID;

function normalizePhone(input) {
  if (!input) return null
  let s = String(input).trim()
  // if already starts with + use as-is
  if (s.startsWith('+')) return s
  // keep only digits
  const digits = s.replace(/\D/g, '')
  if (digits.length === 10) return `+91${digits}` // assume India mobile if 10 digits
  if (digits.length > 0) return `+${digits}`
  return null
}

// In-memory OTP store for messages fallback: { '<phone>': { code, expiresAt } }
const otpStore = new Map()
const OTP_TTL_MS = 5 * 60 * 1000 // 5 minutes

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body
    const to = normalizePhone(phone)
    if (!to) return res.status(400).json({ success: false, message: 'Invalid phone number' })

    // If Verify service configured, use it
    if (VERIFY_SID) {
      const verifyClient = (client.verify && client.verify.services) ? client.verify : (client.verify && client.verify.v2 ? client.verify.v2 : null)
      if (verifyClient && verifyClient.services) {
        await verifyClient.services(VERIFY_SID).verifications.create({ to, channel: 'sms' })
        return res.json({ success: true, message: 'OTP sent via Verify service' })
      }
      // try direct shapes
      if (client.verify && client.verify.services) {
        await client.verify.services(VERIFY_SID).verifications.create({ to, channel: 'sms' })
        return res.json({ success: true, message: 'OTP sent via Verify service' })
      }
      if (client.verify && client.verify.v2 && client.verify.v2.services) {
        await client.verify.v2.services(VERIFY_SID).verifications.create({ to, channel: 'sms' })
        return res.json({ success: true, message: 'OTP sent via Verify service' })
      }
      // If VERIFY_SID set but client shape unexpected, fall through to messages fallback
    }

    // Messages fallback: generate code and send via Messaging API
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = Date.now() + OTP_TTL_MS
    otpStore.set(to, { code, expiresAt })

    const from = process.env.TWILIO_PHONE_NUMBER
    if (!from) return res.status(500).json({ success: false, message: 'TWILIO_PHONE_NUMBER not configured for messages fallback' })

    await client.messages.create({ body: `Your verification code is ${code}`, from, to })
    return res.json({ success: true, message: 'OTP sent via SMS (messages API)' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}


/**
 * POST /api/otp/verify
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body

    if (!VERIFY_SID) {
      return res.status(500).json({ success: false, message: 'TWILIO_VERIFY_SID not configured in environment' })
    }
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP required' })
    }

    const to = normalizePhone(phone)
    if (!to) return res.status(400).json({ success: false, message: 'Invalid phone number' })

    // If Verify Service available, use it
    if (VERIFY_SID) {
      const verifyClient = (client.verify && client.verify.services) ? client.verify : (client.verify && client.verify.v2 ? client.verify.v2 : null)
      let verification
      if (verifyClient && verifyClient.services) {
        verification = await verifyClient.services(VERIFY_SID).verificationChecks.create({ to, code: otp })
      } else if (client.verify && client.verify.services) {
        verification = await client.verify.services(VERIFY_SID).verificationChecks.create({ to, code: otp })
      } else if (client.verify && client.verify.v2 && client.verify.v2.services) {
        verification = await client.verify.v2.services(VERIFY_SID).verificationChecks.create({ to, code: otp })
      }
      if (verification && verification.status === 'approved') {
        return res.json({ success: true, message: 'OTP verified successfully' })
      }
      // fall through to messages fallback check if Verify returned not approved
    }

    // Messages fallback: check in-memory store
    const record = otpStore.get(to)
    if (record && record.code === String(otp) && record.expiresAt > Date.now()) {
      otpStore.delete(to)
      return res.json({ success: true, message: 'OTP verified successfully (messages fallback)' })
    }

    res.status(400).json({ success: false, message: 'Invalid or expired OTP' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
};
