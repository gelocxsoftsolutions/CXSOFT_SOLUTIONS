import { ButtonLink } from "~/components/ui/button";
import { Container } from "~/components/ui/container";
import { DashboardMock } from "~/components/site/dashboard-mock";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0b3b6a] via-[#082e55] to-[#071c33] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-10 pt-28 pb-16 md:grid-cols-2 md:pt-32 md:pb-20">
          <div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Software That Powers
              <br />
              Your Business
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
              Custom management systems, ecommerce platforms, and automation
              tools designed to streamline your operations.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="#contact" variant="primary" size="md">
                Book a Demo
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href="#solutions" variant="secondary" size="md">
                View Solutions
              </ButtonLink>
            </div>
          </div>

          <div className="md:justify-self-end">
            <DashboardMock className="w-full max-w-xl" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.69l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
