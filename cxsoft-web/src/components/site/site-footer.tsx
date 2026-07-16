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
            <Image
              src="/cxsoftlogo.png"
              alt="CXSOFT SOLUTIONS"
              width={120}
              height={36}
              className="h-8 w-auto object-contain brightness-[10] contrast-75"
            />
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to build something great?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
              Tell us what you’re trying to improve and we’ll propose the
              fastest path to a reliable, scalable solution.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:justify-end">
            <ButtonLink href="mailto:hello@cxsoftsolutions.com" variant="primary">
              Email Us
            </ButtonLink>
            <ButtonLink href="#solutions" variant="secondary">
              Explore Solutions
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-3 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
            <div>
              © {new Date().getFullYear()} CXSOFT SOLUTIONS. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
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
