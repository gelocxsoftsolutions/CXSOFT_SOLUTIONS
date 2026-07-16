import { Resend } from "resend";
import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

type QuoteData = {
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

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 0;color:#64748b;font-size:13px;width:40%;vertical-align:top">${label}</td>
    <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:500">${value}</td>
  </tr>`;
}

function buildHtml(data: QuoteData): string {
  const contactRows = [
    row("Full Name", data.full_name),
    row("Company", data.company_name),
    row("Email", data.email),
    row("Phone", data.phone),
    row("Location", data.location),
    row("Preferred Contact", data.preferred_contact_method),
  ].filter(Boolean).join("");

  const projectRows = [
    row("Type", data.project_type),
    `<tr>
      <td style="padding:6px 0;color:#64748b;font-size:13px;width:40%;vertical-align:top">Description</td>
      <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:500;white-space:pre-wrap">${data.description}</td>
    </tr>`,
    row("Features", data.features.length ? data.features.join(", ") : null),
    row("Budget", data.budget),
    row("Timeline", data.timeline),
  ].filter(Boolean).join("");

  const businessRows = [
    row("Industry", data.industry),
    row("Employees", data.employees),
    row("Daily Users", data.daily_users),
    row("Existing System", data.existing_system),
    row("Existing Problems", data.existing_system_problems),
  ].filter(Boolean).join("");

  const techRows = [
    row("Has Branding", data.has_branding),
    row("Design Style", data.design_style),
    row("Technical Needs", data.technical_needs.length ? data.technical_needs.join(", ") : null),
  ].filter(Boolean).join("");

  const attachmentsSection = data.file_urls.length
    ? `<tr><td style="padding:24px 32px 0"><h2 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Attachments</h2></td></tr>
       <tr><td style="padding:0 32px"><table width="100%">
         <tr>
           <td style="padding:6px 0;color:#64748b;font-size:13px;width:40%;vertical-align:top">Files</td>
           <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:500">
             ${data.file_urls.map((url) => `<a href="${url}" style="color:#0ea5e9;text-decoration:underline;display:block">${url.split("/").pop()}</a>`).join("")}
           </td>
         </tr>
       </table></td></tr>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">

          <tr>
            <td style="background:linear-gradient(135deg,#0ea5e9,#6366f1);padding:32px;text-align:center">
              <h1 style="margin:0;font-size:22px;color:#fff;font-weight:700">New Quote Request</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,.75);font-size:14px">CXSOFT SOLUTIONS</p>
            </td>
          </tr>

          <tr><td style="padding:24px 32px 0"><h2 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Contact</h2></td></tr>
          <tr><td style="padding:0 32px"><table width="100%">${contactRows}</table></td></tr>

          <tr><td style="padding:24px 32px 0"><h2 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Project</h2></td></tr>
          <tr><td style="padding:0 32px"><table width="100%">${projectRows}</table></td></tr>

          <tr><td style="padding:24px 32px 0"><h2 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Business Context</h2></td></tr>
          <tr><td style="padding:0 32px"><table width="100%">${businessRows}</table></td></tr>

          <tr><td style="padding:24px 32px 0"><h2 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Design &amp; Technical</h2></td></tr>
          <tr><td style="padding:0 32px"><table width="100%">${techRows}</table></td></tr>

          ${attachmentsSection}

          <tr>
            <td style="padding:24px 32px;text-align:center;border-top:1px solid #e2e8f0">
              <p style="margin:0;font-size:12px;color:#94a3b8">Sent from cxsoft-web quote form</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendQuoteNotification(data: QuoteData) {
  const html = buildHtml(data);

  const { error } = await resend.emails.send({
    from: "CXSOFT Quotes <onboarding@resend.dev>",
    to: "cxsoftsolutions@gmail.com",
    subject: `New Quote Request — ${data.full_name}`,
    html,
  });

  if (error) {
    console.error("Failed to send email notification:", error);
  }
}
