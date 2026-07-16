import { cn } from "~/lib/cn";

export function DashboardMock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[#071c33] ring-1 ring-white/10 shadow-2xl shadow-black/40",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-sky-400" />
          <div className="text-xs font-semibold text-white/80">
            Operations Dashboard
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-rose-400/70" />
          <div className="h-2 w-2 rounded-full bg-amber-300/70" />
          <div className="h-2 w-2 rounded-full bg-emerald-300/70" />
        </div>
      </div>

      <div className="grid gap-3 p-4">
        <div className="grid grid-cols-3 gap-3">
          <MetricCard title="Total Orders" value="2,847" delta="+2.5%" />
          <MetricCard title="Revenue" value="$184K" delta="+8.2%" />
          <MetricCard title="Active Users" value="1,205" delta="+3.1%" />
        </div>

        <div className="rounded-xl bg-white/5 ring-1 ring-inset ring-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="text-xs font-semibold text-white/70">
              Monthly Revenue
            </div>
            <div className="text-xs font-semibold text-white/40">Last 12 mo</div>
          </div>
          <div className="px-4 pb-4">
            <div className="grid h-28 grid-cols-12 items-end gap-1">
              {[
                28, 22, 18, 26, 32, 40, 44, 52, 58, 60, 72, 80,
              ].map((h, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-sm",
                    idx > 9 ? "bg-sky-400" : "bg-white/15",
                  )}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/5 ring-1 ring-inset ring-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="text-xs font-semibold text-white/70">
              Recent Orders
            </div>
            <div className="text-xs font-semibold text-white/40">Today</div>
          </div>
          <div className="divide-y divide-white/10">
            <OrderRow id="#A021" status="Delivered" amount="$1,240" />
            <OrderRow id="#A020" status="In Transit" amount="$890" />
            <OrderRow id="#A019" status="Processing" amount="$2,100" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-sky-500/0 via-sky-500/0 to-sky-500/10" />
    </div>
  );
}

function MetricCard({
  title,
  value,
  delta,
}: {
  title: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-inset ring-white/10">
      <div className="text-[11px] font-semibold text-white/60">{title}</div>
      <div className="mt-2 text-lg font-bold text-white">{value}</div>
      <div className="mt-1 text-[11px] font-semibold text-emerald-300/80">
        {delta}
      </div>
    </div>
  );
}

function OrderRow({
  id,
  status,
  amount,
}: {
  id: string;
  status: "Delivered" | "In Transit" | "Processing";
  amount: string;
}) {
  const statusClass =
    status === "Delivered"
      ? "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20"
      : status === "In Transit"
        ? "bg-sky-400/15 text-sky-200 ring-sky-300/20"
        : "bg-amber-300/15 text-amber-200 ring-amber-200/20";

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-xs font-semibold text-white/60">{id}</div>
      <div
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
          statusClass,
        )}
      >
        {status}
      </div>
      <div className="text-xs font-semibold text-white/70">{amount}</div>
    </div>
  );
}
