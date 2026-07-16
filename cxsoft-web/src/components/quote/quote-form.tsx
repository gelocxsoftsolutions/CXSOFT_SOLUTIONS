"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, type UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "~/components/ui/button";
import { DropdownSelect } from "~/components/ui/dropdown-select";
import { cn } from "~/lib/cn";
import { supabaseClient } from "~/lib/supabase-client";
import {
  budgetSchema,
  designStyleSchema,
  featureSchema,
  preferredContactMethodSchema,
  projectTypeSchema,
  quoteSchema,
  technicalNeedSchema,
  timelineSchema,
  toSupabaseQuote,
  type QuoteFormValues,
} from "~/components/quote/quote-schema";

const steps = [
  { key: "client", label: "Client Info" },
  { key: "projectType", label: "Project Type" },
  { key: "projectDescription", label: "Project Description" },
  { key: "projectFeatures", label: "Features Needed" },
  { key: "business", label: "Business & Budget" },
  { key: "design", label: "Design & Technical" },
  { key: "review", label: "Review" },
] as const;

const stepFields: Record<(typeof steps)[number]["key"], (keyof QuoteFormValues)[]> =
  {
    client: [
      "fullName",
      "companyName",
      "email",
      "phone",
      "location",
      "preferredContactMethod",
    ],
    projectType: ["projectType"],
    projectDescription: ["description"],
    projectFeatures: ["features"],
    business: [
      "industry",
      "employees",
      "dailyUsers",
      "existingSystem",
      "existingSystemProblems",
      "budget",
      "timeline",
    ],
    design: ["hasBranding", "designStyle", "technicalNeeds", "files"],
    review: ["agreement"],
  };

export function QuoteForm() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      location: "",
      preferredContactMethod: "Email",

      projectType: "Web Applications",
      description: "",
      features: [],

      industry: "",
      employees: "",
      dailyUsers: "",
      existingSystem: "No",
      existingSystemProblems: "",
      budget: "₱20,000 – ₱50,000",
      timeline: "Flexible",

      hasBranding: "Yes",
      designStyle: "Modern",
      technicalNeeds: [],
      files: undefined,

      agreement: false,
    },
    mode: "onBlur",
  });

  const activeStep = steps[stepIndex] ?? steps[0];
  const values = form.watch();
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  async function goNext() {
    const fields = stepFields[activeStep.key];
    const ok = await form.trigger(fields as any, { shouldFocus: true });
    if (!ok) return;
    setStepIndex((v) => Math.min(v + 1, steps.length - 1));
  }

  function goBack() {
    setStepIndex((v) => Math.max(v - 1, 0));
  }

  async function onSubmit(v: QuoteFormValues) {
    setSubmitError(null);
    try {
      let fileUrls: string[] = [];

      if (v.files && v.files.length > 0) {
        const uploaded = await Promise.all(
          v.files.map(async (file) => {
            const path = `${crypto.randomUUID()}-${file.name}`;
            const { error } = await supabaseClient.storage
              .from("quote-files")
              .upload(path, file);
            if (error) throw error;
            const { data: urlData } = supabaseClient.storage
              .from("quote-files")
              .getPublicUrl(path);
            return urlData.publicUrl;
          }),
        );
        fileUrls = uploaded;
      }

      const payload = toSupabaseQuote(v, fileUrls);
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to submit");
      }

      setSubmitted(true);
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <div id="quote-form" className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] ring-1 ring-inset ring-white/15 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.12),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.08),transparent_60%)]" />

        <div className="relative flex min-h-[600px] flex-col px-5 pb-5 pt-5">
          {submitted ? (
            <SuccessCard />
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-1 flex-col gap-4"
            >
              <StepIndicator
                current={stepIndex}
                total={steps.length}
                label={activeStep.label}
              />

              <div className="scrollbar-cx scrollbar-gutter-stable flex-1 overflow-y-auto rounded-2xl">
                <div className="min-h-[360px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep.key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {activeStep.key === "client" && <StepClient form={form} />}
                      {activeStep.key === "projectType" && (
                        <StepProjectType form={form} />
                      )}
                      {activeStep.key === "projectDescription" && (
                        <StepProjectDescription form={form} />
                      )}
                      {activeStep.key === "projectFeatures" && (
                        <StepProjectFeatures form={form} />
                      )}
                      {activeStep.key === "business" && (
                        <StepBusiness form={form} />
                      )}
                      {activeStep.key === "design" && <StepDesign form={form} />}
                      {activeStep.key === "review" && (
                        <StepReview form={form} values={values} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {submitError ? (
                <div className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-inset ring-rose-300/20">
                  {submitError}
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-3 pt-1">
                <Button
                  variant="ghost"
                  size="md"
                  type="button"
                  onClick={goBack}
                  disabled={stepIndex === 0 || form.formState.isSubmitting}
                >
                  ← Back
                </Button>

                {stepIndex < steps.length - 1 ? (
                  <Button
                    variant="primary"
                    size="md"
                    type="button"
                    onClick={goNext}
                    disabled={form.formState.isSubmitting}
                    className="group"
                  >
                    <span>Next</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="group"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <svg
                          aria-hidden="true"
                          className="mr-1.5 h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Request Quote
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="ml-1.5 h-4 w-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 5.29a.75.75 0 0 1 .006 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L3.29 8.99a.75.75 0 1 1 1.06-1.06l4.01 4.01 6.72-6.65a.75.75 0 0 1 1.06 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.04] px-5 py-4 ring-1 ring-inset ring-white/[0.06]">
      <div className="flex items-center justify-between">
        {Array.from({ length: total }, (_, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={false}
              animate={
                i < current
                  ? { scale: 1, backgroundColor: "rgba(56,189,248,1)" }
                  : i === current
                    ? { scale: 1.1, backgroundColor: "rgba(56,189,248,0.15)" }
                    : { scale: 1, backgroundColor: "rgba(255,255,255,0.06)" }
              }
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-shadow duration-300",
                i < current && "bg-sky-500 text-white shadow-lg shadow-sky-500/30",
                i === current &&
                  "bg-sky-500/15 text-sky-200 ring-2 ring-sky-400/50 shadow-lg shadow-sky-500/20",
                i > current && "bg-white/[0.06] text-white/40",
              )}
            >
              {i < current ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a.75.75 0 0 1 .006 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L3.29 8.99a.75.75 0 1 1 1.06-1.06l4.01 4.01 6.72-6.65a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </motion.div>
            {i < total - 1 ? (
              <div
                className={cn(
                  "mx-1 h-0.5 flex-1 rounded-full transition-colors duration-300",
                  i < current ? "bg-sky-500" : "bg-white/[0.06]",
                )}
              />
            ) : null}
          </React.Fragment>
        ))}
      </div>
      <motion.div
        key={label}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="mt-3 text-center text-sm font-semibold text-white/80"
      >
        {label}
      </motion.div>
    </div>
  );
}

function StepClient({ form }: { form: UseFormReturn<QuoteFormValues> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <StepPanel>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full Name"
          required
          error={errors.fullName?.message}
          input={<input {...register("fullName")} className={inputClass} />}
        />
        <Field
          label="Company Name"
          error={errors.companyName?.message}
          input={<input {...register("companyName")} className={inputClass} />}
        />
        <Field
          label="Email Address"
          required
          error={errors.email?.message}
          input={
            <input
              {...register("email")}
              type="email"
              className={inputClass}
            />
          }
        />
        <Field
          label="Phone Number"
          error={errors.phone?.message}
          input={<input {...register("phone")} className={inputClass} />}
        />
        <Field
          label="Business Location"
          error={errors.location?.message}
          input={<input {...register("location")} className={inputClass} />}
        />
        <Field
          label="Preferred Contact Method"
          error={errors.preferredContactMethod?.message}
          input={
            <Controller
              name="preferredContactMethod"
              control={control}
              render={({ field }) => (
                <DropdownSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={preferredContactMethodSchema.options}
                />
              )}
            />
          }
        />
      </div>
    </StepPanel>
  );
}

function StepProjectType({ form }: { form: UseFormReturn<QuoteFormValues> }) {
  return (
    <StepPanel>
      <ProjectTypePicker form={form} />
    </StepPanel>
  );
}

function StepProjectDescription({
  form,
}: {
  form: UseFormReturn<QuoteFormValues>;
}) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <StepPanel>
      <Field
        label="Project Description"
        required
        error={errors.description?.message}
        input={
          <textarea
            {...register("description")}
            rows={9}
            className={cn(
              inputClass,
              "min-h-[300px] resize-none break-words scrollbar-cx",
            )}
            placeholder="Tell us what you want to build, who will use it, and the key goals."
          />
        }
      />
    </StepPanel>
  );
}

function StepProjectFeatures({ form }: { form: UseFormReturn<QuoteFormValues> }) {
  const { setValue, watch } = form;

  const features = watch("features");

  return (
    <StepPanel>
      <div className="grid gap-1.5 sm:grid-cols-3">
        {featureSchema.options.map((f) => {
          const checked = features.includes(f);
          return (
            <button
              key={f}
              type="button"
              onClick={() => {
                const next = checked
                  ? features.filter((x) => x !== f)
                  : [...features, f];
                setValue("features", next, { shouldValidate: true });
              }}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg bg-white/[0.04] px-3 py-2 text-left ring-1 ring-inset ring-white/[0.08] transition-all duration-200 hover:bg-white/[0.08] hover:ring-white/[0.15] active:scale-[0.98]",
                checked && "bg-sky-500/10 ring-sky-400/25",
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/[0.04] ring-1 ring-inset ring-white/[0.08] transition-colors group-hover:bg-white/[0.08]",
                  checked && "bg-sky-500/20 ring-sky-300/20",
                )}
              >
                {checked ? (
                  <MiniCheck className="h-3 w-3 text-sky-200" />
                ) : (
                  <span className="h-3 w-3 rounded bg-white/[0.06] ring-1 ring-inset ring-white/[0.10]" />
                )}
              </span>
              <span className="truncate text-xs font-medium leading-tight text-white/80 group-hover:text-white/95">
                {f}
              </span>
            </button>
          );
        })}
      </div>
    </StepPanel>
  );
}

function ProjectTypePicker({ form }: { form: UseFormReturn<QuoteFormValues> }) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const projectType = watch("projectType");

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        {projectTypeSchema.options.map((type) => {
          const checked = projectType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setValue("projectType", type, { shouldValidate: true })}
              className={cn(
                "group flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-4 py-4 text-left ring-1 ring-inset ring-white/[0.08] transition-all duration-200 hover:bg-white/[0.08] hover:ring-white/[0.15] active:scale-[0.98]",
                checked && "bg-sky-500/10 ring-sky-400/25",
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] ring-1 ring-inset ring-white/[0.08] transition-colors group-hover:bg-white/[0.08]",
                    checked && "bg-sky-500/20 ring-sky-300/20",
                  )}
                >
                  {checked ? (
                    <MiniCheck className="h-4 w-4 text-sky-200" />
                  ) : (
                    <span className="h-4 w-4 rounded bg-white/[0.06] ring-1 ring-inset ring-white/[0.10]" />
                  )}
                </span>
                <span className="truncate text-sm font-semibold text-white/85 group-hover:text-white">
                  {type}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {errors.projectType?.message ? (
        <div className="mt-2 text-xs font-medium text-rose-200">
          {errors.projectType.message}
        </div>
      ) : null}
    </div>
  );
}

function StepBusiness({ form }: { form: UseFormReturn<QuoteFormValues> }) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const existing = watch("existingSystem");

  return (
    <div className="space-y-4">
      <StepPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Industry"
            error={errors.industry?.message}
            input={<input {...register("industry")} className={inputClass} />}
          />
          <Field
            label="Number of Employees"
            error={errors.employees?.message}
            input={<input {...register("employees")} className={inputClass} />}
          />
          <Field
            label="Daily Users Estimate"
            error={errors.dailyUsers?.message}
            input={<input {...register("dailyUsers")} className={inputClass} />}
          />
          <Field
            label="Existing System?"
            error={errors.existingSystem?.message}
            input={
              <Controller
                name="existingSystem"
                control={control}
                render={({ field }) => (
                  <DropdownSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={["Yes", "No"] as const}
                  />
                )}
              />
            }
          />
        </div>

        {existing === "Yes" ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-4 overflow-hidden"
          >
            <Field
              label="Existing System Problems"
              error={errors.existingSystemProblems?.message}
              input={
                <textarea
                  {...register("existingSystemProblems")}
                  rows={3}
                  className={cn(inputClass, "resize-none scrollbar-cx")}
                  placeholder="What problems are you experiencing?"
                />
              }
            />
          </motion.div>
        ) : null}
      </StepPanel>

      <StepPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Budget"
            error={errors.budget?.message}
            input={
              <Controller
                name="budget"
                control={control}
                render={({ field }) => (
                  <DropdownSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={budgetSchema.options}
                  />
                )}
              />
            }
          />
          <Field
            label="Timeline"
            error={errors.timeline?.message}
            input={
              <Controller
                name="timeline"
                control={control}
                render={({ field }) => (
                  <DropdownSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={timelineSchema.options}
                  />
                )}
              />
            }
          />
        </div>
      </StepPanel>
    </div>
  );
}

function StepDesign({ form }: { form: UseFormReturn<QuoteFormValues> }) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const tech = watch("technicalNeeds");
  const files = watch("files");

  return (
    <div className="space-y-4">
      <StepPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Has Logo/Branding?"
            error={errors.hasBranding?.message}
            input={
              <Controller
                name="hasBranding"
                control={control}
                render={({ field }) => (
                  <DropdownSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={["Yes", "No"] as const}
                  />
                )}
              />
            }
          />
          <Field
            label="Preferred Design Style"
            error={errors.designStyle?.message}
            input={
              <Controller
                name="designStyle"
                control={control}
                render={({ field }) => (
                  <DropdownSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={designStyleSchema.options}
                  />
                )}
              />
            }
          />
        </div>
      </StepPanel>

      <StepPanel>
        <div className="grid gap-1.5 sm:grid-cols-3">
          {technicalNeedSchema.options.map((n) => {
            const checked = tech.includes(n);
            return (
              <label
                key={n}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 ring-1 ring-inset ring-white/[0.08] transition-all duration-200 hover:bg-white/[0.08] hover:ring-white/[0.15] active:scale-[0.98]",
                  checked && "bg-sky-500/10 ring-sky-400/25",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked ? tech.filter((x) => x !== n) : [...tech, n];
                    setValue("technicalNeeds", next, { shouldValidate: true });
                  }}
                  className="h-3.5 w-3.5 accent-sky-400"
                />
                <span className="truncate text-xs font-medium leading-tight text-white/80">{n}</span>
              </label>
            );
          })}
        </div>
      </StepPanel>

      <StepPanel>
        <div className="rounded-xl bg-white/[0.03] p-4 ring-1 ring-inset ring-white/[0.06]">
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={(e) => {
              const list = e.currentTarget.files
                ? Array.from(e.currentTarget.files)
                : undefined;
              setValue("files", list, { shouldValidate: true });
            }}
            className="block w-full text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-500/15 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sky-200 file:ring-1 file:ring-inset file:ring-sky-300/20 hover:file:bg-sky-500/25"
          />
          {errors.files?.message ? (
            <div className="mt-2 text-xs font-medium text-rose-200">
              {errors.files.message as string}
            </div>
          ) : null}
          <div className="mt-2 text-xs text-white/50">
            {files?.length
              ? `${files.length} file(s) selected`
              : "Upload images, PDFs, mockups, or screenshots."}
          </div>
        </div>
      </StepPanel>
    </div>
  );
}

function StepReview({
  form,
  values,
}: {
  form: UseFormReturn<QuoteFormValues>;
  values: QuoteFormValues;
}) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <StepPanel>
        <div className="grid gap-3 text-sm text-white/80 sm:grid-cols-2">
          <Summary label="Full Name" value={values.fullName} />
          <Summary label="Company" value={values.companyName || "—"} />
          <Summary label="Email" value={values.email} />
          <Summary label="Phone" value={values.phone || "—"} />
          <Summary label="Location" value={values.location || "—"} />
          <Summary label="Contact Method" value={values.preferredContactMethod} />
          <Summary label="Project Type" value={values.projectType} />
          <Summary label="Industry" value={values.industry || "—"} />
          <Summary label="Employees" value={values.employees || "—"} />
          <Summary label="Daily Users" value={values.dailyUsers || "—"} />
          <Summary label="Existing System" value={values.existingSystem} />
          <Summary label="Budget" value={values.budget} />
          <Summary label="Timeline" value={values.timeline} />
          <Summary label="Has Branding" value={values.hasBranding} />
          <Summary label="Design Style" value={values.designStyle} />
        </div>
      </StepPanel>

      <StepPanel>
        <div className="space-y-4">
          {values.existingSystem === "Yes" && values.existingSystemProblems ? (
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-white/50">
                Existing System Problems
              </div>
              <div className="mt-1.5 text-sm leading-relaxed text-white/80">
                {values.existingSystemProblems}
              </div>
            </div>
          ) : null}

          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-white/50">
              Description
            </div>
            <div className="mt-1.5 text-sm leading-relaxed text-white/80">
              {values.description || "—"}
            </div>
          </div>
        </div>
      </StepPanel>

      <StepPanel>
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-white/50">
              Features
            </div>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {(values.features?.length ? values.features : ["—"]).map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-inset ring-white/[0.08]"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-white/50">
              Technical Needs
            </div>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {(values.technicalNeeds?.length ? values.technicalNeeds : ["—"]).map(
                (n) => (
                  <span
                    key={n}
                    className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-inset ring-white/[0.08]"
                  >
                    {n}
                  </span>
                ),
              )}
            </div>
          </div>

          {values.files && values.files.length > 0 ? (
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-white/50">
                Files
              </div>
              <div className="mt-1.5 text-sm text-white/70">
                {values.files.length} file(s) attached
              </div>
            </div>
          ) : null}
        </div>
      </StepPanel>

      <StepPanel>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            {...register("agreement")}
            className="mt-0.5 h-4 w-4 accent-sky-400"
          />
          <div className="min-w-0">
            <div className="text-sm font-medium text-white/80">
              I understand that quotations may vary depending on project scope and
              requirements.
            </div>
            {errors.agreement?.message ? (
              <div className="mt-1.5 text-xs font-medium text-rose-200">
                {errors.agreement.message}
              </div>
            ) : null}
          </div>
        </label>
      </StepPanel>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold tracking-widest uppercase text-white/50">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-white/85">{value}</div>
    </div>
  );
}

function SuccessCard() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 ring-1 ring-inset ring-emerald-300/20">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-8 w-8 text-emerald-200"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>
      <div className="mt-5 text-lg font-bold text-emerald-100">
        Quote request received
      </div>
      <div className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
        Thanks for the details. We'll review your requirements and reach out
        with a tailored quotation.
      </div>
      <div className="mt-8 w-full rounded-2xl bg-white/[0.03] px-5 py-4 ring-1 ring-inset ring-white/[0.06]">
        <div className="text-sm font-semibold text-white/80">What's next?</div>
        <div className="mt-1 text-sm leading-relaxed text-white/60">
          We may contact you for clarifications to ensure the quote matches your
          scope, timeline, and feature needs.
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  input,
}: {
  label: string;
  required?: boolean;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold tracking-widest uppercase text-white/50">
          {label}
        </label>
        {required ? (
          <span className="text-[11px] font-semibold text-white/35">Required</span>
        ) : null}
      </div>
      {input}
      {error ? (
        <div className="text-xs font-medium text-rose-200">{error}</div>
      ) : null}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl bg-white/[0.05] px-4 py-3 text-sm leading-relaxed text-white/90 ring-1 ring-inset ring-white/[0.10] outline-none transition-all duration-200 placeholder:text-white/30 hover:bg-white/[0.07] focus:bg-white/[0.07] focus:ring-2 focus:ring-sky-400/40 focus:scale-[1.01]";

function MiniCheck({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a.75.75 0 0 1 .006 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L3.29 8.99a.75.75 0 1 1 1.06-1.06l4.01 4.01 6.72-6.65a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StepPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] px-4 py-5 ring-1 ring-inset ring-white/[0.06] transition-all duration-200 hover:bg-white/[0.05]">
      {children}
    </div>
  );
}
