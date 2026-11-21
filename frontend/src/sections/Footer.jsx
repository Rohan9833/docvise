import { useModal } from "../hooks/useModal.js";

const FOOTER_LINKS = [
  // { label: 'How It Works', href: '#how-it-works' },
  // { label: 'See It in Action', href: '#in-action' },
  // { label: 'Why DocVise', href: '#why-docvise' },
  // { label: 'Analytics', href: '#analytics' },
  // { label: 'Multilingual', href: '#multilingual' },
];

export default function Footer() {
  const { open } = useModal();

  return (
    <footer className="bg-[#0d1d3b] text-white">
      <div className="container-site flex flex-col items-center gap-3 px-5 py-8 text-center sm:gap-6 sm:py-10 lg:py-6">
        <p className="text-[12px] text-white/75 sm:text-sm">
          DocVise · Multilingual Patient Guidance · Illustrated PDFs
        </p>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-nowrap items-center justify-center gap-x-3 whitespace-nowrap text-[11px] font-semibold sm:gap-x-8 sm:text-base">
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-brand-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => open("enquiry")}
                className="transition-colors hover:text-brand-300"
              >
                Request Demo
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => open("terms")}
                className="transition-colors hover:text-brand-300"
              >
                Terms &amp; Conditions
              </button>
            </li>
            <li>
              <a
                href="https://digilateral.com/privacy"
                className="transition-colors hover:text-brand-300"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </nav>

        <p className="border-t border-white/15 pt-4 text-sm text-white/60 sm:pt-5 sm:text-base">
          © {new Date().getFullYear()} DocVise. A digiLATERAL offering.
        </p>
      </div>
    </footer>
  );
}
