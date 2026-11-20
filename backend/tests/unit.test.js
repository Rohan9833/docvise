// Run with: npm test  (uses the built-in node:test runner; no database needed)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanLine, cleanMultiline, escapeHtml, escapeRegex } from '../src/utils/sanitize.js';
import { validateEnquiry } from '../src/utils/validateEnquiry.js';
import { rateLimit } from '../src/middleware/rateLimit.js';

const good = { name: 'Priya Sharma', company: 'Acme Pharma Ltd', designation: 'Brand Manager', email: 'Priya@AcmePharma.com', phone: '+91 98765 43210', message: 'Interested in a demo.', elapsedMs: 9000 };

test('sanitize strips tags, control characters and caps length', () => {
  assert.equal(cleanLine('  <b>Hello</b>\u0000 world  '), 'Hello world');
  assert.equal(cleanLine({ $gt: '' }), '');
  assert.equal(cleanLine('a'.repeat(300), 10).length, 10);
  assert.equal(cleanMultiline('a\r\n\n\n\nb'), 'a\n\nb');
  assert.equal(escapeHtml('<a href="x">'), '&lt;a href=&quot;x&quot;&gt;');
  assert.equal(escapeRegex('a.b*'), 'a\\.b\\*');
});

test('valid enquiry passes and is normalised', () => {
  const { value, errors, spam } = validateEnquiry(good);
  assert.deepEqual(errors, {});
  assert.equal(spam, false);
  assert.equal(value.email, 'priya@acmepharma.com');
  assert.equal(value.phone, '+919876543210');
  assert.equal(Object.keys(value).includes('elapsedMs'), false);
});

test('required fields and formats are enforced', () => {
  const { errors } = validateEnquiry({ name: 'X1', company: '', email: 'bad', phone: '123', message: 'x'.repeat(1200) });
  assert.ok(errors.name && errors.company && errors.email && errors.phone && errors.message);
});

test('non-string / injection payloads are rejected', () => {
  const { errors, value } = validateEnquiry({ ...good, email: { $ne: null }, name: ['a'] });
  assert.equal(value.email, '');
  assert.ok(errors.email && errors.name);
  assert.ok(Object.keys(validateEnquiry(null).errors).length >= 4);
});

test('patient information in the message is refused', () => {
  assert.ok(validateEnquiry({ ...good, message: 'My patient name is Ramesh, diagnosed with diabetes' }).errors.message);
});

test('honeypot and too-fast submissions are flagged as spam', () => {
  assert.equal(validateEnquiry({ ...good, website: 'http://spam' }).spam, true);
  assert.equal(validateEnquiry({ ...good, elapsedMs: 300 }).spam, true);
});

test('JWT signs, verifies, rejects tampering and expiry', () => {
  const secret = 'x'.repeat(40);
  const t = signToken({ sub: 'admin@example.com', role: 'admin' }, secret, 60);
  assert.equal(verifyToken(t, secret).role, 'admin');
  assert.equal(verifyToken(t, 'y'.repeat(40)), null);
  const [h, , s] = t.split('.');
  const forged = `${h}.${Buffer.from(JSON.stringify({ role: 'admin', exp: 9e9 })).toString('base64url')}.${s}`;
  assert.equal(verifyToken(forged, secret), null);
  assert.equal(verifyToken(signToken({ role: 'admin' }, secret, -1), secret), null);
  assert.equal(verifyToken('garbage', secret), null);
});

test('password hashing verifies only the right password', () => {
  const h = hashPassword('correct horse battery');
  assert.ok(h.startsWith('scrypt$'));
  assert.equal(verifyPassword('correct horse battery', h), true);
  assert.equal(verifyPassword('wrong', h), false);
  assert.equal(safeEqual('a@b.com', 'a@b.com'), true);
  assert.equal(safeEqual('a@b.com', 'c@b.com'), false);
});

test('rate limiter allows max requests then returns 429', () => {
  const limiter = rateLimit({ windowMs: 60000, max: 2 });
  const statuses = [];
  for (let i = 0; i < 3; i += 1) {
    const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { statuses.push(c); return this; }, json() { return this; } };
    let passed = false;
    limiter({ ip: '1.2.3.4' }, res, () => { passed = true; });
    if (passed) statuses.push(200);
  }
  assert.deepEqual(statuses, [200, 200, 429]);
});
