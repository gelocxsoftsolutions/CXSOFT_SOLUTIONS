import { z } from "zod";

export const preferredContactMethodSchema = z.enum([
  "Email",
  "Phone",
  "Messenger",
  "WhatsApp",
]);

export const projectTypeSchema = z.enum([
  "Websites",
  "Web Applications",
  "Mobile Apps",
  "POS & Inventory Systems",
  "Payroll Systems",
  "Custom Software Applications",
]);

export const budgetSchema = z.enum([
  "Under ₱20,000",
  "₱20,000 – ₱50,000",
  "₱50,000 – ₱100,000",
  "₱100,000 – ₱300,000",
  "₱300,000+",
]);

export const timelineSchema = z.enum(["ASAP", "Within 1 Month", "1–3 Months", "Flexible"]);

export const designStyleSchema = z.enum([
  "Modern",
  "Minimalist",
  "Corporate",
  "Dark Theme",
  "Colorful",
]);

export const yesNoSchema = z.enum(["Yes", "No"]);

export const featureSchema = z.enum([
  "User Login & Roles",
  "Dashboard & Analytics",
  "Inventory Management",
  "Sales Tracking",
  "Payroll",
  "Attendance Monitoring",
  "Online Payments",
  "SMS / Email Notifications",
  "Mobile App",
  "Admin Panel",
  "API Integration",
  "QR / Barcode Scanner",
  "Reports & Export",
  "Cloud Database",
  "Offline Support",
]);

export const technicalNeedSchema = z.enum([
  "Web App",
  "Android App",
  "iOS App",
  "Desktop App",
  "Offline Support",
  "Multi-branch Support",
  "Hosting Assistance",
]);

export const quoteSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  location: z.string().optional(),
  preferredContactMethod: preferredContactMethodSchema,

  projectType: projectTypeSchema,
  description: z
    .string()
    .min(10, "Project description is required")
    .max(2000, "Keep it under 2000 characters"),
  features: z.array(featureSchema),

  industry: z.string().optional(),
  employees: z.string().optional(),
  dailyUsers: z.string().optional(),
  existingSystem: yesNoSchema,
  existingSystemProblems: z.string().optional(),
  budget: budgetSchema,
  timeline: timelineSchema,

  hasBranding: yesNoSchema,
  designStyle: designStyleSchema,
  technicalNeeds: z.array(technicalNeedSchema),
  files: z
    .array(z.instanceof(File))
    .max(10, "Max 10 files")
    .optional(),

  agreement: z.boolean().refine((v) => v, {
    message:
      "You must confirm you understand quotations may vary depending on scope.",
  }),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;

export type QuoteInsert = {
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  preferred_contact_method: string;
  project_type: string;
  description: string;
  features: string[];
  industry: string | null;
  employees: string | null;
  daily_users: string | null;
  existing_system: string;
  existing_system_problems: string | null;
  budget: string;
  timeline: string;
  has_branding: string;
  design_style: string;
  technical_needs: string[];
  file_urls: string[];
  agreement: boolean;
};

export function toSupabaseQuote(
  values: QuoteFormValues,
  fileUrls: string[] = [],
): QuoteInsert {
  return {
    full_name: values.fullName,
    company_name: values.companyName?.trim() ? values.companyName.trim() : null,
    email: values.email,
    phone: values.phone?.trim() ? values.phone.trim() : null,
    location: values.location?.trim() ? values.location.trim() : null,
    preferred_contact_method: values.preferredContactMethod,
    project_type: values.projectType,
    description: values.description,
    features: values.features,
    industry: values.industry?.trim() ? values.industry.trim() : null,
    employees: values.employees?.trim() ? values.employees.trim() : null,
    daily_users: values.dailyUsers?.trim() ? values.dailyUsers.trim() : null,
    existing_system: values.existingSystem,
    existing_system_problems: values.existingSystemProblems?.trim()
      ? values.existingSystemProblems.trim()
      : null,
    budget: values.budget,
    timeline: values.timeline,
    has_branding: values.hasBranding,
    design_style: values.designStyle,
    technical_needs: values.technicalNeeds,
    file_urls: fileUrls,
    agreement: values.agreement,
  };
}
