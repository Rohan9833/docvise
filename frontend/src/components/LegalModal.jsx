import Modal from './Modal.jsx';
import { privacy, terms, LEGAL_UPDATED } from '../data/legal.js';
import { site } from '../data/site.js';
import { useModal } from '../hooks/useModal.js';

export default function LegalModal({ kind, onClose, isTop }) {
  const { open } = useModal();
  const doc = kind === 'terms' ? terms : privacy;
  return (
    <Modal isTop={isTop} title={doc.title} description={`Last updated ${LEGAL_UPDATED}`} onClose={onClose}>
      <div className="space-y-5 text-[15px] leading-relaxed text-ink/85">
        {doc.sections.map(([h, p]) => (
          <section key={h}>
            <h3 className="font-sans text-[16px] font-bold text-navy">{h}</h3>
            <p className="mt-1">{p}</p>
          </section>
        ))}
        <p className="rounded-xl bg-brand-50 px-4 py-3 text-[14px]">
          {site.contactEmail
            ? <>Write to us at <a className="font-semibold text-brand-700 underline" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.</>
            : <>To reach us, please use the <button type="button" data-autofocus className="font-semibold text-brand-700 underline" onClick={() => open('enquiry', { mode: 'contact' })}>contact form</button>.</>}
        </p>
      </div>
    </Modal>
  );
}
