import { useModal } from "../hooks/useModal.js";

const FOOTER_LINKS = [];

export default function Footer() {
  const { open } = useModal();

  return (
    <footer className="bg-[#0d1d3b] text-white">
      <div className="container-site flex flex-col items-center gap-4 px-5 py-8 text-center sm:gap-6 sm:py-10 sm:px-7 lg:grid lg:grid-cols-[1fr_auto] lg:items-stretch lg:gap-6 lg:py-10 lg:text-left">
        {/* Left side */}
        <div className="flex flex-col items-center gap-5 lg:items-start">
          <p className="text-[12px] text-white/75 sm:text-sm">
            DocVise · Multilingual Patient Guidance · Illustrated PDFs
          </p>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 whitespace-nowrap text-[11px] font-semibold sm:gap-x-8 sm:text-base lg:justify-start">
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
        </div>

        {/* Right side */}
        <p className="border-t border-white/15 pt-4 text-sm text-white/60 sm:pt-5 sm:text-base lg:flex lg:items-end lg:justify-end lg:border-t-0 lg:pt-0 lg:text-right">
          © {new Date().getFullYear()} DocVise. A digiLATERAL offering.
        </p>
      </div>
    </footer>
  );
}
