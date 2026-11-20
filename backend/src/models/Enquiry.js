import mongoose from 'mongoose';
import { LIMITS } from '../utils/validateEnquiry.js';

export const STATUSES = ['new', 'contacted', 'qualified', 'closed', 'spam'];

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: LIMITS.name },
    company: { type: String, required: true, trim: true, minlength: 2, maxlength: LIMITS.company },
    designation: { type: String, trim: true, maxlength: LIMITS.designation, default: '' },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: LIMITS.email, match: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ },
    phone: { type: String, required: true, trim: true, maxlength: LIMITS.phone, match: /^\+?\d{10,15}$/ },
    message: { type: String, trim: true, maxlength: LIMITS.message, default: '' },
    status: { type: String, enum: STATUSES, default: 'new', index: true },
    source: { type: String, default: 'DocVise Microsite', immutable: true },
    adminNotes: { type: String, trim: true, maxlength: 2000, default: '' },
  },
  { timestamps: true, collection: 'enquiries', versionKey: false },
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ email: 1, createdAt: -1 });

export const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
