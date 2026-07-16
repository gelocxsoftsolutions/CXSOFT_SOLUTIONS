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
    <div id="quote-form" className="w-full max-w-[560px]">
      <div className="h-[640px] overflow-hidden rounded-3xl bg-white/4 ring-1 ring-inset ring-white/12 shadow-2xl shadow-black/30 backdrop-blur-xl sm:h-[720px]">
        <div className="flex h-full flex-col px-6 pb-6 pt-6">
          {submitted ? (
            <SuccessCard />
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-1 flex-col gap-4 min-h-0"
            >
              <div className="scrollbar-cx scrollbar-gutter-stable flex-1 min-h-0 overflow-y-scroll rounded-2xl">
                <FormProgressHeader
                  title={activeStep.label}
                  stepIndex={stepIndex}
                  totalSteps={steps.length}
                  progress={progress}
                />

                <div className="mt-4 pb-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="space-y-4"
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

              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  type="button"
                  onClick={goBack}
                  disabled={stepIndex === 0 || form.formState.isSubmitting}
                >
                  Back
                </Button>

                {stepIndex < steps.length - 1 ? (
                  <Button
                    variant="primary"
                    size="md"
                    type="button"
                    onClick={goNext}
                    disabled={form.formState.isSubmitting}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Requesting..." : "Request Quote"}
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

function StepClient({ form }: { form: UseFormReturn<QuoteFormValues> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <StepPanel size="tall">
      <div className="grid gap-3 sm:grid-cols-2">
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
    <StepPanel size="tall">
      <Field
        label="Project Description"
        required
        error={errors.description?.message}
        input={
          <textarea
            {...register("description")}
            rows={10}
            className={cn(
              inputClass,
              "min-h-[300px] resize-none break-words scrollbar-cx sm:min-h-[380px]",
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
      <div className="text-xs font-semibold tracking-widest uppercase text-white/60">
        Features Needed
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
                "group flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 text-left ring-1 ring-inset ring-white/10 transition-all duration-200 hover:bg-white/10",
                checked && "bg-white/10 ring-white/25",
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-inset ring-white/10 transition-colors group-hover:bg-white/10",
                    checked && "bg-sky-500/15 ring-sky-300/20",
                  )}
                >
                  {checked ? (
                    <MiniCheck className="h-4 w-4 text-sky-200" />
                  ) : (
                    <span className="h-4 w-4 rounded-md bg-white/5 ring-1 ring-inset ring-white/10" />
                  )}
                </span>
                <span className="truncate text-sm font-semibold text-white/85 group-hover:text-white">
                  {f}
                </span>
              </div>
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
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {projectTypeSchema.options.map((type) => {
          const checked = projectType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setValue("projectType", type, { shouldValidate: true })}
              className={cn(
                "group flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-4 text-left ring-1 ring-inset ring-white/10 transition-all duration-200 hover:bg-white/10",
                checked && "bg-white/10 ring-white/25",
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-inset ring-white/10 transition-colors group-hover:bg-white/10",
                    checked && "bg-sky-500/15 ring-sky-300/20",
                  )}
                >
                  {checked ? (
                    <MiniCheck className="h-4 w-4 text-sky-200" />
                  ) : (
                    <span className="h-4 w-4 rounded-md bg-white/5 ring-1 ring-inset ring-white/10" />
                  )}
                </span>
                <span className="truncate text-sm font-semibold text-white/90">
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
        <div className="grid gap-3 sm:grid-cols-2">
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
          <div className="mt-4">
            <Field
              label="Existing System Problems"
              error={errors.existingSystemProblems?.message}
              input={
                <textarea
                  {...register("existingSystemProblems")}
                  rows={4}
                  className={cn(inputClass, "resize-none scrollbar-cx")}
                  placeholder="What problems are you experiencing?"
                />
              }
            />
          </div>
        ) : null}
      </StepPanel>

      <StepPanel>
        <div className="grid gap-3 sm:grid-cols-2">
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
        <div className="grid gap-3 sm:grid-cols-2">
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
        <div className="text-xs font-semibold tracking-widest uppercase text-white/60">
          Technical Needs
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {technicalNeedSchema.options.map((n) => {
            const checked = tech.includes(n);
            return (
              <label
                key={n}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/10",
                  checked && "bg-white/10 ring-white/20",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked ? tech.filter((x) => x !== n) : [...tech, n];
                    setValue("technicalNeeds", next, { shouldValidate: true });
                  }}
                  className="h-4 w-4 accent-sky-400"
                />
                <span className="text-sm font-medium text-white/85">{n}</span>
              </label>
            );
          })}
        </div>
      </StepPanel>

      <StepPanel>
        <div className="text-xs font-semibold tracking-widest uppercase text-white/60">
          File Upload
        </div>
        <div className="mt-3 rounded-2xl bg-white/5 p-4 ring-1 ring-inset ring-white/10">
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
            className="block w-full text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/15"
          />
          {errors.files?.message ? (
            <div className="mt-2 text-xs font-medium text-rose-200">
              {errors.files.message as string}
            </div>
          ) : null}
          <div className="mt-2 text-xs text-white/60">
            {files?.length ? `${files.length} file(s) selected` : "Upload images, PDFs, mockups, or screenshots."}
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
              <div className="text-xs font-semibold tracking-widest uppercase text-white/60">
                Existing System Problems
              </div>
              <div className="mt-2 text-sm leading-relaxed text-white/80">
                {values.existingSystemProblems}
              </div>
            </div>
          ) : null}

          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-white/60">
              Description
            </div>
            <div className="mt-2 text-sm leading-relaxed text-white/80">
              {values.description || "—"}
            </div>
          </div>
        </div>
      </StepPanel>

      <StepPanel>
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-white/60">
              Features
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(values.features?.length ? values.features : ["—"]).map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-inset ring-white/10"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-white/60">
              Technical Needs
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(values.technicalNeeds?.length ? values.technicalNeeds : ["—"]).map(
                (n) => (
                  <span
                    key={n}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-inset ring-white/10"
                  >
                    {n}
                  </span>
                ),
              )}
            </div>
          </div>

          {values.files && values.files.length > 0 ? (
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-white/60">
                Files
              </div>
              <div className="mt-2 text-sm text-white/80">
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
            className="mt-1 h-4 w-4 accent-sky-400"
          />
          <div className="min-w-0">
            <div className="text-sm font-medium text-white/85">
              I understand that quotations may vary depending on project scope and
              requirements.
            </div>
            {errors.agreement?.message ? (
              <div className="mt-2 text-xs font-medium text-rose-200">
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
      <div className="text-xs font-semibold tracking-widest uppercase text-white/60">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-white/90">{value}</div>
    </div>
  );
}

function SuccessCard() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-emerald-500/10 p-5 ring-1 ring-inset ring-emerald-300/20">
        <div className="text-base font-semibold text-emerald-100">
          Quote request received
        </div>
        <div className="mt-2 text-sm leading-relaxed text-emerald-100/80">
          Thanks for the details. We’ll review your requirements and reach out
          with a tailored quotation.
        </div>
      </div>
      <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-inset ring-white/10">
        <div className="text-sm font-semibold text-white/90">What’s next?</div>
        <div className="mt-2 text-sm leading-relaxed text-white/75">
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
        <label className="text-xs font-semibold tracking-widest uppercase text-white/60">
          {label}
        </label>
        {required ? (
          <span className="text-[11px] font-semibold text-white/40">
            Required
          </span>
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
  "w-full rounded-xl bg-white/6 px-4 py-3 text-sm leading-relaxed text-white/90 ring-1 ring-inset ring-white/12 outline-none transition-colors placeholder:text-white/35 focus:bg-white/8 focus:ring-sky-300/25";

function FormProgressHeader({
  title,
  stepIndex,
  totalSteps,
  progress,
}: {
  title: string;
  stepIndex: number;
  totalSteps: number;
  progress: number;
}) {
  return (
    <div className="sticky top-0 z-20 rounded-2xl bg-white/6 px-5 py-4 ring-1 ring-inset ring-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-white/90">{title}</div>
        <div className="text-xs font-semibold text-white/60">
          {stepIndex + 1} / {totalSteps}
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

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

function StepPanel({
  children,
  size = "default",
}: {
  children: React.ReactNode;
  size?: "default" | "tall";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/5 p-5 ring-1 ring-inset ring-white/8",
        size === "tall" && "min-h-[420px]",
      )}
    >
      {children}
    </div>
  );
}
