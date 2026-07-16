type TicketDateInput = Date | string;

export function ticketDateKey(date: TicketDateInput) {
  if (date instanceof Date) return toYYYYMMDD(date);

  const trimmed = date.trim();
  if (/^\d{8}$/.test(trimmed)) return trimmed;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed.replaceAll("-", "");

  throw new Error(
    "Invalid date. Use a Date, YYYYMMDD, or YYYY-MM-DD for ticket IDs.",
  );
}

export function formatTicketId({
  departmentCode,
  date,
  ticketNumber,
  minTicketDigits = 4,
}: {
  departmentCode: string;
  date: TicketDateInput;
  ticketNumber: number;
  minTicketDigits?: number;
}) {
  const dept = normalizeDepartmentCode(departmentCode);
  const dateKey = ticketDateKey(date);

  if (!Number.isInteger(ticketNumber) || ticketNumber < 1) {
    throw new Error("ticketNumber must be a positive integer starting at 1.");
  }

  const padded = String(ticketNumber).padStart(minTicketDigits, "0");
  return `${dept}-${dateKey}-${padded}`;
}

function normalizeDepartmentCode(input: string) {
  const dept = input.trim().toUpperCase();
  if (!/^[A-Z0-9]+$/.test(dept)) {
    throw new Error("departmentCode must be A-Z / 0-9 only (no spaces/hyphens).");
  }
  return dept;
}

function toYYYYMMDD(date: Date) {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}
