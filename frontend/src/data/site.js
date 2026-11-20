const env = import.meta.env || {};

export const site = {
  apiUrl: (env.VITE_API_URL || '').replace(/\/$/, ''),
  url: env.VITE_SITE_URL || '',
  contactEmail: env.VITE_CONTACT_EMAIL || '',
  contactPhone: env.VITE_CONTACT_PHONE || '',
};

export const NAV = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'in-action', label: 'See It in Action' },
  { id: 'why-docvise', label: 'Why DocVise' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'multilingual', label: 'Multilingual' },
  { id: 'contact', label: 'Contact' },
];
