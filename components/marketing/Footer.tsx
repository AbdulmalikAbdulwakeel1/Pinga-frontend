import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/routes";
import { Instagram, Facebook, Twitter, Linkedin } from "@/components/icons/brand-icons";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: ROUTES.FEATURES },
    { label: "Pricing", href: ROUTES.PRICING },
    { label: "Integrations", href: ROUTES.FEATURES },
    { label: "Changelog", href: ROUTES.FEATURES },
  ],
  Company: [
    { label: "About", href: ROUTES.ABOUT },
    { label: "Contact", href: ROUTES.CONTACT },
    { label: "Careers", href: ROUTES.ABOUT },
    { label: "Blog", href: ROUTES.ABOUT },
  ],
  Legal: [
    { label: "Privacy Policy", href: ROUTES.PRIVACY },
    { label: "Terms of Service", href: ROUTES.TERMS },
    { label: "Cookie Policy", href: ROUTES.PRIVACY },
    { label: "NDPR Compliance", href: ROUTES.PRIVACY },
  ],
  Connect: [
    { label: "Instagram", href: "https://instagram.com/pingahq", external: true },
    { label: "Twitter / X", href: "https://twitter.com/pingahq", external: true },
    { label: "LinkedIn", href: "https://linkedin.com/company/pinga", external: true },
    { label: "Facebook", href: "https://facebook.com/pingahq", external: true },
  ],
};

const SOCIAL_ICONS = [
  { Icon: Instagram, href: "https://instagram.com/pingahq", label: "Instagram" },
  { Icon: Facebook, href: "https://facebook.com/pingahq", label: "Facebook" },
  { Icon: Twitter, href: "https://twitter.com/pingahq", label: "Twitter" },
  { Icon: Linkedin, href: "https://linkedin.com/company/pinga", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#1A2B3E] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href={ROUTES.HOME} className="inline-block">
              <Image
                src="/images/Logo.png"
                alt="Pinga"
                width={100}
                height={32}
                className="brightness-0 invert"
                style={{ width: "auto", height: "auto", maxHeight: "2rem" }}
              />
            </Link>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              AI-powered social sales agent for Nigerian small businesses. Sell more, reply faster.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_ICONS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-[#FF6B2C] hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
                {heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/60 transition-colors hover:text-[#FF6B2C]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 transition-colors hover:text-[#FF6B2C]"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Pinga. All rights reserved.
          </p>
          <p className="text-sm text-white/40">
            Made with purpose in Lagos, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
