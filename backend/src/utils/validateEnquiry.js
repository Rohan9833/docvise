import { cleanLine, cleanMultiline } from './sanitize.js';

export const LIMITS = { name: 80, company: 120, designation: 80, email: 120, phone: 16, message: 1000 };
export const MIN_FILL_MS = 2500; // humans take longer than this to complete the form

const NAME_RE = /^[\p{L}][\p{L}\s.'-]*$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?\d{10,15}$/;
// Patient information must not be submitted through this form.
const HEALTH_HINTS = /\b(diagnos(is|ed)|my patient|patient name|aadhaar|blood report|prescription for)\b/i;

/**
 * Validates and sanitises a public enquiry payload.
 * Returns { value, errors, spam } – value holds only the allow-listed, cleaned fields.
 */
export function validateEnquiry(body) {
  const b = body && typeof body === 'object' && !Array.isArray(body) ? body : {};
  const raw = (k) => (typeof b[k] === 'string' ? b[k] : '');
  const errors = {};

  const value = {
    name: cleanLine(raw('name'), LIMITS.name + 1),
    company: cleanLine(raw('company'), LIMITS.company + 1),
    designation: cleanLine(raw('designation'), LIMITS.designation + 1),
    email: cleanLine(raw('email'), LIMITS.email + 1).toLowerCase(),
    phone: cleanLine(raw('phone'), 30).replace(/[\s()-]/g, ''),
    message: cleanMultiline(raw('message'), LIMITS.message + 1),
  };

  if (!value.name) errors.name = 'Please enter your full name.';
  else if (value.name.length < 2 || value.name.length > LIMITS.name || !NAME_RE.test(value.name)) errors.name = 'Please enter a valid name (letters only).';

  if (!value.company) errors.company = 'Please enter your pharma company.';
  else if (value.company.length < 2 || value.company.length > LIMITS.company) errors.company = 'Company name should be 2–120 characters.';

  if (value.designation.length > LIMITS.designation) errors.designation = 'Designation should be under 80 characters.';

  if (!value.email) errors.email = 'Please enter your work email.';
  else if (value.email.length > LIMITS.email || !EMAIL_RE.test(value.email)) errors.email = 'Please enter a valid email address.';

  if (!value.phone) errors.phone = 'Please enter your mobile number.';
  else if (!PHONE_RE.test(value.phone)) errors.phone = 'Please enter a valid mobile number (10–15 digits, optional country code).';

  if (value.message.length > LIMITS.message) errors.message = 'Message should be under 1,000 characters.';
  else if (HEALTH_HINTS.test(value.message)) errors.message = 'Please remove any patient or health information from your message.';

  // Anti-spam: honeypot field and implausibly fast submissions
  const honeypot = typeof b.website === 'string' && b.website.trim() !== '';
  const elapsed = Number(b.elapsedMs);
  const tooFast = Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS;

  return { value, errors, spam: honeypot || tooFast };
}
