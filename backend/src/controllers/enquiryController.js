import { validateEnquiry } from '../utils/validateEnquiry.js';
import { notifyNewEnquiry } from '../services/mailer.js';

const OK = { message: 'Thank you. Your demo request has been received.' };

/** POST /api/enquiries (public): validate and email; no database or persistence. */
export async function createEnquiry(req, res, next) {
  try {
    console.log('[enquiry] Request received');\n    const { value, errors, spam } = validateEnquiry(req.body);
    if (spam) return res.status(200).json(OK); // silently discard bots

    if (Object.keys(errors).length) {\n      console.warn('[enquiry] Validation failed');
      return res.status(422).json({ message: 'Please check the highlighted fields.', errors });
    }

    const result = await notifyNewEnquiry({ ...value, createdAt: new Date() });
    if (!result.sent) {\n      console.error('[enquiry] Email delivery failed:', result.reason);
      return res.status(503).json({
        message: 'We could not send your demo request right now. Please try again shortly.',
      });
    }

    console.log('[enquiry] Completed successfully');\n    return res.status(201).json(OK);
  } catch (err) {
    return next(err);
  }
}
