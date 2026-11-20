import { site } from '../data/site.js';

export class ApiError extends Error {
  constructor(message, { status, fieldErrors } = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors || {};
  }
}

/** POST /api/enquiries – resolves with the server response or throws ApiError. */
export async function submitEnquiry(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${site.apiUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    let data = {};
    try { data = await res.json(); } catch { /* non-JSON response */ }
    if (!res.ok) {
      throw new ApiError(data.message || 'We could not send your request. Please try again.', { status: res.status, fieldErrors: data.errors });
    }
    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') throw new ApiError('The request timed out. Please check your connection and try again.');
    throw new ApiError('We could not reach the server. Please check your connection and try again.');
  } finally {
    clearTimeout(timer);
  }
}
