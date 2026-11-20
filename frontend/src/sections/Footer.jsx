import { Logo } from '../components/ui.jsx';
import { useModal } from '../hooks/useModal.js';

export default function Footer() {
  const { open } = useModal();
  const link = 'min-h-11 px-1 text-[14px] text-ink/80 underline-offset-4 hover:text-brand-600 hover:underline';
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-site flex flex-col items-center gap-5 py-8 text-center lg:flex-row lg:justify-between lg:text-left">
        <Logo className="h-12 w-auto" />
        <p className="text-[14px] text-ink/80">A digiLATERAL offering</p>
        <nav aria-label="Legal and contact">
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <li><button type="button" className={link} onClick={() => open('privacy')}>Privacy Policy</button></li>
            <li aria-hidden="true" className="hidden text-line sm:block">|</li>
            <li><button type="button" className={link} onClick={() => open('terms')}>Terms &amp; Conditions</button></li>
            <li aria-hidden="true" className="hidden text-line sm:block">|</li>
            <li><button type="button" className={link} onClick={() => open('enquiry', { mode: 'contact' })}>Contact</button></li>
          </ul>
        </nav>
      </div>
      <p className="border-t border-line py-4 text-center text-[12.5px] text-muted">© {new Date().getFullYear()} digiLATERAL. DocVise is a product of digiLATERAL.</p>
    </footer>
  );
}
