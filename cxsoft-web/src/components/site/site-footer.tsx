import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "~/components/ui/button";
import { Container } from "~/components/ui/container";

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-[#061529] text-white">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/cxsoftlogo.png"
                alt="CXSOFT SOLUTIONS"
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <div className="leading-tight">
                <div className="text-sm font-bold tracking-wide text-white">
                  CXSOFT
                </div>
                <div className="text-xs font-semibold tracking-widest text-white/60">
                  SOLUTIONS
                </div>
              </div>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to build something great?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
              Tell us what you’re trying to improve and we’ll propose the
              fastest path to a reliable, scalable solution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <a
              href="tel:+639087510290"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/15"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
              </svg>
              0908 751 0290
            </a>
            <ButtonLink href="mailto:cxsoftsolutions@gmail.com" variant="primary">
              Email Us
            </ButtonLink>
            <ButtonLink href="/quote" variant="secondary">
              Get a Quote
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
            <div>
              © {new Date().getFullYear()} CXSOFT SOLUTIONS. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61578647731608"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                aria-label="Facebook"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://m.me/61578647731608"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                aria-label="Messenger"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.732 8.2l3.131 3.259L19.752 8.2l-6.559 6.763z" />
                </svg>
              </a>
              <span className="h-4 w-px bg-white/10" />
              <Link className="hover:text-white" href="#services">
                Services
              </Link>
              <Link className="hover:text-white" href="#portfolio">
                Portfolio
              </Link>
              <Link className="hover:text-white" href="#blog">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
