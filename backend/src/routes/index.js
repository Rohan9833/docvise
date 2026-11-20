import { Router } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { requireAdmin } from '../middleware/auth.js';
import { createEnquiry, listEnquiries, getEnquiry, updateEnquiry } from '../controllers/enquiryController.js';
import { adminLogin } from '../controllers/authController.js';

const router = Router();

const enquiryLimiter = rateLimit({ ...env.enquiryRate, keyPrefix: 'enquiry', message: 'Too many requests from this network. Please try again in a few minutes.' });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, keyPrefix: 'login', message: 'Too many login attempts. Please try again later.' });

router.get('/health', (req, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'up' : 'down' }));

// Public
router.post('/enquiries', enquiryLimiter, createEnquiry);

// Admin (authenticated)
router.post('/admin/login', loginLimiter, adminLogin);
router.get('/enquiries', requireAdmin, listEnquiries);
router.get('/enquiries/:id', requireAdmin, getEnquiry);
router.patch('/enquiries/:id', requireAdmin, updateEnquiry);

export default router;
