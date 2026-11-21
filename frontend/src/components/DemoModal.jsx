import { useState } from 'react';
import { Download, ExternalLink, Info } from 'lucide-react';
import Modal from './Modal.jsx';
import { PdfGrid } from './Mockups.jsx';
import { cx, Button } from './ui.jsx';
import demo from '../data/demo-languages.json';

/**
 * Marketing demonstration only. Shows pre-built sample PDFs for preconfigured languages –
 * no AI generation, no WhatsApp session, no data leaves the browser.
 */
export default function DemoModal({ onClose, isTop }) {
  const [code, setCode] = useState('mr');
  const lang = demo.languages.find((l) => l.code === code);

  return (
    <Modal isTop={isTop} size="lg" onClose={onClose} title="Interactive Demo" description="See how one set of English instructions becomes illustrated patient guidance in the selected language.">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div className="space-y-3">
          <div>
            <h3 className="font-sans text-[13px] font-bold uppercase tracking-wider text-brand-500">Doctor's instructions (English)</h3>
            <ul className="mt-1.5 space-y-1 rounded-xl bg-wa-chat p-2.5">
              {demo.instructions.map((t) => (
                <li key={t} className="rounded-lg rounded-tr-none bg-wa-bubble px-3 py-1.5 text-[14px] text-ink shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]">{t}</li>
              ))}
            </ul>
          </div>

          <fieldset>
            <legend className="font-sans text-[13px] font-bold uppercase tracking-wider text-brand-500">Patient language</legend>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {demo.languages.map((l, i) => (
                <label key={l.code} className={cx('flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border-2 px-2.5 py-1.5 text-[13px] transition',
                  code === l.code ? 'border-brand-500 bg-brand-50' : 'border-line bg-white hover:border-brand-200')}>
                  <input type="radio" name="demo-language" value={l.code} checked={code === l.code} onChange={() => setCode(l.code)} className="h-4 w-4 accent-[#7a2bc6]" data-autofocus={i === 0 ? true : undefined} />
                  <span className="leading-tight">
                    <span lang={l.code} className="block font-bold text-navy">{l.native}</span>
                    {l.native !== l.label && <span className="block text-[12px] text-muted">{l.label}</span>}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
{/* 
          <div className="flex flex-col gap-1.5 sm:flex-row lg:flex-col">
            <Button href={lang.pdf} download className="w-full" icon={Download} trailing={null}>Download sample PDF</Button>
            <Button href={lang.pdf} variant="outline" target="_blank" rel="noopener" className="w-full" icon={ExternalLink} trailing={null}>Open PDF in new tab</Button>
          </div> */}
        </div>

        <div>
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-[#eef5ff] p-2.5 sm:p-3" aria-live="polite">
            <PdfGrid lang={lang} large className="mx-auto max-w-[560px]" />
          </div>
          <p className="mt-2 flex items-start gap-1.5 text-[12px] leading-relaxed text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
            Pre-built sample for demonstration. No AI generation or WhatsApp session is triggered, and no data is collected.
            Other Indian languages are supported in the full service.
          </p>
        </div>
      </div>
    </Modal>
  );
}
