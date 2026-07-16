"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { SiteHeader } from "~/components/site/site-header";
import { QuoteForm } from "~/components/quote/quote-form";
import { Container, Section } from "~/components/ui/container";

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b3b6a] via-[#082e55] to-[#071c33] text-white">
      <SiteHeader />

      <section className="relative pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-55">
          <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-sky-500/25 blur-3xl" />
          <div className="absolute -right-24 top-28 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute left-1/3 top-8 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <Container className="relative">
          <div className="grid items-start gap-10 py-10 lg:grid-cols-2 lg:py-14">
            <div className="max-w-xl">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl"
              >
                Let’s Build Your Custom System
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
                className="mt-5 text-pretty text-base leading-relaxed text-white/80 sm:text-lg"
              >
                Tell us about your project and we’ll provide a tailored quotation
                for your business needs.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
                className="mt-8"
              >
                <a
                  href="#quote-form"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-sky-500 px-5 text-sm font-semibold text-white shadow-sm shadow-black/10 transition-colors hover:bg-sky-400 active:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  Request a Free Quote
                </a>
              </motion.div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {[
                  "Custom Software Systems",
                  "Web Applications",
                  "Mobile Apps",
                  "POS & Inventory Systems",
                  "Payroll Systems",
                  "Business Automation",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-white/5 px-4 py-3 ring-1 ring-inset ring-white/10"
                  >
                    <div className="text-sm font-semibold text-white/90">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:justify-self-end">
              <QuoteForm />
            </div>
          </div>
        </Container>
      </section>

      <Section className="bg-white/5 text-white">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {[
              {
                title: "Custom-built Solutions",
                text: "Systems tailored to your process—no unnecessary complexity.",
              },
              {
                title: "Affordable Pricing",
                text: "Clear options to fit startups, SMBs, and growing teams.",
              },
              {
                title: "Fast Development",
                text: "Lean, iterative delivery to ship value early and often.",
              },
              {
                title: "Scalable Architecture",
                text: "Modern foundation that grows with your business.",
              },
              {
                title: "Local Support in the Philippines",
                text: "Responsive communication and hands-on assistance.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-white/5 p-6 ring-1 ring-inset ring-white/10 backdrop-blur-sm"
              >
                <div className="text-base font-semibold">{card.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-white/75">
                  {card.text}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-transparent text-white">
        <Container>
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-widest uppercase text-white/60">
              FAQ
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Questions, answered
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/75">
              Quick answers to common questions about timelines, support, and
              upgrades.
            </p>
          </div>

          <div className="mt-10 grid gap-3">
            {[
              {
                q: "How long does development take?",
                a: "Timelines depend on scope. Small projects can take weeks, while larger systems may take 1–3+ months. We’ll propose a clear plan after reviewing your requirements.",
              },
              {
                q: "Do you offer maintenance?",
                a: "Yes. We offer maintenance and support plans including bug fixes, monitoring, and iterative improvements.",
              },
              {
                q: "Can you upgrade existing systems?",
                a: "Yes. We can modernize, integrate, or rebuild parts of an existing system while keeping your operations running.",
              },
              {
                q: "Do you provide source code?",
                a: "Yes. Source code delivery can be included based on the agreement and project setup.",
              },
            ].map((item) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-inset ring-white/10">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="text-sm font-semibold text-white/90">{question}</div>
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 ring-1 ring-inset ring-white/10 text-white/70">
          <span className="text-lg leading-none">{open ? "−" : "+"}</span>
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 text-sm leading-relaxed text-white/75">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}
