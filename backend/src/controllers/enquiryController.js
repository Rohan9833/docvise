import mongoose from 'mongoose';
import { Enquiry, STATUSES } from '../models/Enquiry.js';
import { validateEnquiry } from '../utils/validateEnquiry.js';
import { cleanMultiline, escapeRegex } from '../utils/sanitize.js';
import { notifyNewEnquiry } from '../services/mailer.js';

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const OK = { message: 'Thank you. Your demo request has been received.' };

/** POST /api/enquiries (public) */
export async function createEnquiry(req, res, next) {
  try {
    const { value, errors, spam } = validateEnquiry(req.body);
    if (spam) return res.status(201).json(OK); // silently drop bots without revealing detection
    if (Object.keys(errors).length) return res.status(422).json({ message: 'Please check the highlighted fields.', errors });

    const recent = await Enquiry.exists({ email: value.email, createdAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) } });
    if (recent) return res.status(200).json({ message: 'We already have your request and will be in touch shortly.' });

    const enquiry = await Enquiry.create({ ...value, status: 'new', source: 'DocVise Microsite' });
    notifyNewEnquiry(enquiry).catch(() => {}); // never blocks or fails the request
    return res.status(201).json(OK);
  } catch (err) {
    return next(err);
  }
}

/** GET /api/enquiries (admin) ?page&limit&status&q */
export async function listEnquiries(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const filter = {};
    if (typeof req.query.status === 'string' && STATUSES.includes(req.query.status)) filter.status = req.query.status;
    if (typeof req.query.q === 'string' && req.query.q.trim()) {
      const rx = new RegExp(escapeRegex(req.query.q.trim().slice(0, 80)), 'i');
      filter.$or = [{ name: rx }, { company: rx }, { email: rx }];
    }
    const [total, items] = await Promise.all([
      Enquiry.countDocuments(filter),
      Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ]);
    return res.json({ total, page, limit, pages: Math.max(1, Math.ceil(total / limit)), items });
  } catch (err) {
    return next(err);
  }
}

/** GET /api/enquiries/:id (admin) */
export async function getEnquiry(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid identifier.' });
    const item = await Enquiry.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: 'Enquiry not found.' });
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

/** PATCH /api/enquiries/:id (admin) – body: { status?, adminNotes? } */
export async function updateEnquiry(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid identifier.' });
    const update = {};
    if (req.body?.status !== undefined) {
      if (!STATUSES.includes(req.body.status)) return res.status(422).json({ message: 'Invalid status.', errors: { status: `Use one of: ${STATUSES.join(', ')}` } });
      update.status = req.body.status;
    }
    if (req.body?.adminNotes !== undefined) update.adminNotes = cleanMultiline(String(req.body.adminNotes), 2000);
    if (!Object.keys(update).length) return res.status(400).json({ message: 'Nothing to update.' });
    const item = await Enquiry.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).lean();
    if (!item) return res.status(404).json({ message: 'Enquiry not found.' });
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}
