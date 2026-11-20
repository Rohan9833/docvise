// Input sanitisation for free-text fields. Values are stored as plain text and must still be
// escaped wherever they are rendered as HTML (see escapeHtml, used by the mailer).

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g;

/** Coerces to a trimmed single-line string with tags/control characters removed, capped at max. */
export function cleanLine(value, max = 200) {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFKC')
    .replace(CONTROL, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** Like cleanLine but keeps line breaks (max 2 consecutive) for message fields. */
export function cleanMultiline(value, max = 1000) {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFKC')
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);
}

export const escapeHtml = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const escapeRegex = (s = '') => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
