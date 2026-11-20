import { env } from '../config/env.js';
import { escapeHtml } from '../utils/sanitize.js';

let transporterPromise = null;

async function getTransporter() {
  if (!env.smtp.host || !env.smtp.to || !env.smtp.from || !env.smtp.user || !env.smtp.pass) {\n    console.error('[mail] SMTP configuration incomplete. Check EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_FROM, and NOTIFY_TO in backend/.env');\n    return null;\n  }
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
 * Emails digiLATERAL about a new demo request. Returns { sent, reason }; failures are handled by the API.
 * Failures are logged without personal data.
 */
export async function notifyNewEnquiry(enquiry) {
  try {
    const transporter = await getTransporter();
    if (!transporter) return { sent: false, reason: 'smtp-not-configured' };
    const rows = [['Name', enquiry.name], ['Company', enquiry.company], ['Designation', enquiry.designation || '–'],
      ['Email', enquiry.email], ['Mobile', enquiry.phone], ['Message', enquiry.message || '–'], ['Received', new Date(enquiry.createdAt).toISOString()]];
    console.log('[mail] Sending demo enquiry notification...');\n    await transporter.sendMail({
      from: env.smtp.from,
      to: env.smtp.to,
      replyTo: enquiry.email,
      subject: `New DocVise demo request – ${enquiry.company}`.slice(0, 150),
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: `<h2>New DocVise demo request</h2><table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${escapeHtml(k)}</b></td><td>${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`,
    });
    console.log('[mail] Demo enquiry notification sent successfully.');\n    return { sent: true };
  } catch (err) {
    console.error('[mail] Notification failed:', err.code || err.name || 'error', err.message);
    return { sent: false, reason: 'send-failed' };
  }
}
