import { useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Send, Mail, Phone } from 'lucide-react';
import Modal from './Modal.jsx';
import { Button, cx } from './ui.jsx';
import { submitEnquiry } from '../services/api.js';
import { useModal } from '../hooks/useModal.js';
import { site } from '../data/site.js';

const LIMITS = { name: 80, company: 120, designation: 80, email: 120, phone: 20, message: 1000 };
const EMPTY = { name: '', company: '', designation: '', email: '', phone: '', message: '', website: '' };

export function validate(v) {
  const e = {};
  const name = v.name.trim();
  if (!name) e.name = 'Please enter your full name.';
  else if (name.length < 2 || name.length > LIMITS.name || !/^[\p{L}][\p{L}\s.'-]*$/u.test(name)) e.name = 'Please enter a valid name (letters only).';
  const company = v.company.trim();
  if (!company) e.company = 'Please enter your pharma company.';
  else if (company.length < 2 || company.length > LIMITS.company) e.company = 'Company name should be 2–120 characters.';
  if (v.designation.trim().length > LIMITS.designation) e.designation = 'Designation should be under 80 characters.';
  const email = v.email.trim();
  if (!email) e.email = 'Please enter your work email.';
  else if (email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = 'Please enter a valid email address.';
  const digits = v.phone.replace(/[\s()-]/g, '');
  if (!digits) e.phone = 'Please enter your mobile number.';
  else if (!/^\+?\d{10,15}$/.test(digits)) e.phone = 'Please enter a valid mobile number (10–15 digits, optional country code).';
  if (v.message.length > LIMITS.message) e.message = 'Message should be under 1,000 characters.';
  return e;
}

function Field({ id, label, optional, error, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-semibold text-navy">
        {label} {optional ? <span className="font-normal text-muted">(optional)</span> : <span className="text-[#c2410c]" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-[12.5px] text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 flex items-center gap-1 text-[13px] font-medium text-[#b42318]"><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{error}</p>}
    </div>
  );
}

const inputCls = (err) => cx(
  'block w-full rounded-xl border bg-white px-3.5 py-3 text-[15px] text-ink placeholder:text-slate-400 transition focus:outline-none focus:ring-4',
  err ? 'border-[#f04438] focus:ring-red-100' : 'border-[#d9d2ec] focus:border-brand-500 focus:ring-brand-100',
);

export default function EnquiryModal({ onClose, mode = 'demo', isTop }) {
  const { open } = useModal();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverMsg, setServerMsg] = useState('');
  const startedAt = useRef(Date.now());
  const formRef = useRef(null);

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };
  const a11y = (k, hint) => ({
    id: `enq-${k}`, name: k, 'aria-invalid': errors[k] ? 'true' : undefined,
    'aria-describedby': errors[k] ? `enq-${k}-error` : hint ? `enq-${k}-hint` : undefined,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      formRef.current?.querySelector(`#enq-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus('submitting');
    setServerMsg('');
    try {
      await submitEnquiry({ ...values, elapsedMs: Date.now() - startedAt.current });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setServerMsg(err.message);
      if (err.fieldErrors && Object.keys(err.fieldErrors).length) setErrors(err.fieldErrors);
    }
  };

  const title = mode === 'contact' ? 'Contact digiLATERAL' : 'Request a Demo';

  if (status === 'success') {
    return (
      <Modal isTop={isTop} size="sm" title={title} onClose={onClose}>
        <div className="py-4 text-center" role="status">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" aria-hidden="true" />
          <h3 className="mt-3 text-[22px] font-bold">Thank you, {values.name.trim().split(' ')[0]}!</h3>
          <p className="mx-auto mt-2 max-w-sm text-[15px] text-ink/80">Your request has been received. The digiLATERAL team will get in touch with you shortly to schedule a DocVise demo.</p>
          <Button className="mt-6" onClick={onClose} trailing={null} data-autofocus>Close</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isTop={isTop} size="md" title={title} description="Tell us a little about you and we'll arrange a walkthrough of DocVise." onClose={onClose}>
      {(site.contactEmail || site.contactPhone) && (
        <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2 rounded-xl bg-brand-50 px-4 py-3 text-[14px]">
          {site.contactEmail && <a className="flex items-center gap-2 font-semibold text-brand-700 hover:underline" href={`mailto:${site.contactEmail}`}><Mail className="h-4 w-4" />{site.contactEmail}</a>}
          {site.contactPhone && <a className="flex items-center gap-2 font-semibold text-brand-700 hover:underline" href={`tel:${site.contactPhone.replace(/\s/g, '')}`}><Phone className="h-4 w-4" />{site.contactPhone}</a>}
        </div>
      )}
      <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="enq-name" label="Full Name" error={errors.name}>
            <input {...a11y('name')} type="text" autoComplete="name" maxLength={LIMITS.name} value={values.name} onChange={set('name')} className={inputCls(errors.name)} data-autofocus />
          </Field>
          <Field id="enq-company" label="Pharma Company" error={errors.company}>
            <input {...a11y('company')} type="text" autoComplete="organization" maxLength={LIMITS.company} value={values.company} onChange={set('company')} className={inputCls(errors.company)} />
          </Field>
          <Field id="enq-designation" label="Designation" optional error={errors.designation}>
            <input {...a11y('designation')} type="text" autoComplete="organization-title" maxLength={LIMITS.designation} value={values.designation} onChange={set('designation')} className={inputCls(errors.designation)} />
          </Field>
          <Field id="enq-email" label="Work Email" error={errors.email}>
            <input {...a11y('email')} type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={values.email} onChange={set('email')} className={inputCls(errors.email)} />
          </Field>
        </div>
        <Field id="enq-phone" label="Mobile Number" error={errors.phone} hint="Include the country code if outside India.">
          <input {...a11y('phone', true)} type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} placeholder="+91 98765 43210" value={values.phone} onChange={set('phone')} className={inputCls(errors.phone)} />
        </Field>
        <Field id="enq-message" label="Message" optional error={errors.message} hint="Please don't include any patient information.">
          <textarea {...a11y('message', true)} rows={3} maxLength={LIMITS.message} value={values.message} onChange={set('message')} className={inputCls(errors.message)} />
        </Field>

        {/* Honeypot – hidden from people, filled in by bots */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="enq-website">Website</label>
          <input id="enq-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
        </div>

        {status === 'error' && serverMsg && (
          <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-[#b42318]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{serverMsg}
          </p>
        )}

        <p className="text-[13px] leading-relaxed text-muted">
          By submitting, you agree that digiLATERAL may contact you about DocVise, as described in our{' '}
          <button type="button" className="font-semibold text-brand-700 underline underline-offset-2" onClick={() => open('privacy')}>Privacy Policy</button>.
        </p>

        <Button type="submit" size="lg" className="w-full" disabled={status === 'submitting'} icon={status === 'submitting' ? Loader2 : Send} trailing={null}
          aria-live="polite">
          {status === 'submitting' ? 'Sending…' : 'Request a Demo'}
        </Button>
      </form>
    </Modal>
  );
}
