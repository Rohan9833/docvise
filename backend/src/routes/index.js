import { Router } from 'express';
import { env } from '../config/env.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { createEnquiry } from '../controllers/enquiryController.js';

const router = Router();

const enquiryLimiter = rateLimit({
  ...env.enquiryRate,
  keyPrefix: 'enquiry',
  message: 'Too many requests from this network. Please try again in a few minutes.',
});

router.get('/health', (_req, res) => res.json({ ok: true }));
router.post('/enquiries', enquiryLimiter, createEnquiry);

export default router;
