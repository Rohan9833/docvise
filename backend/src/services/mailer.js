import { env } from '../config/env.js';
import { escapeHtml } from '../utils/sanitize.js';

let transporterPromise = null;

async function getTransporter() {
  if (!env.smtp.host || !env.smtp.to || !env.smtp.from) return null;
  if (!transporterPromise) {
    transporterPromise = import('nodemailer').then(({ default: nodemailer }) => nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
    }));
  }
  return transporterPromise;
}

/**
 * Emails digiLATERAL about a new demo request. Never throws: returns { sent, reason }.
 * Failures are logged without personal data so the enquiry itself is never lost.
 */
export async function notifyNewEnquiry(enquiry) {
  try {
    const transporter = await getTransporter();
    if (!transporter) return { sent: false, reason: 'smtp-not-configured' };
    const rows = [['Name', enquiry.name], ['Company', enquiry.company], ['Designation', enquiry.designation || '–'],
      ['Email', enquiry.email], ['Mobile', enquiry.phone], ['Message', enquiry.message || '–'], ['Received', new Date(enquiry.createdAt).toISOString()]];
    await transporter.sendMail({
      from: env.smtp.from,
      to: env.smtp.to,
      replyTo: enquiry.email,
      subject: `New DocVise demo request – ${enquiry.company}`.slice(0, 150),
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: `<h2>New DocVise demo request</h2><table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${escapeHtml(k)}</b></td><td>${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`,
    });
    return { sent: true };
  } catch (err) {
    console.warn('[mail] notification failed:', err.code || err.name || 'error');
    return { sent: false, reason: 'send-failed' };
  }
}
