import { Container, Section } from "~/components/ui/container";
import { cn } from "~/lib/cn";

export type FeatureItem = {
  title: string;
  description: string;
};

export function FeatureGrid({
  id,
  eyebrow,
  title,
  description,
  items,
  tone = "light",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  items: FeatureItem[];
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";

  return (
    <Section
      id={id}
      className={cn(
        isDark ? "bg-[#071c33] text-white" : "bg-slate-50 text-slate-900",
      )}
    >
      <Container>
        <div className="max-w-2xl">
          {eyebrow ? (
            <div
              className={cn(
                "text-xs font-semibold tracking-widest uppercase",
                isDark ? "text-white/60" : "text-slate-500",
              )}
            >
              {eyebrow}
            </div>
          ) : null}
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p
              className={cn(
                "mt-4 text-base leading-relaxed",
                isDark ? "text-white/75" : "text-slate-600",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className={cn(
                "rounded-2xl p-6 ring-1 ring-inset",
                isDark
                  ? "bg-white/5 ring-white/10"
                  : "bg-white ring-slate-200",
              )}
            >
              <div
                className={cn(
                  "text-lg font-semibold",
                  isDark ? "text-white" : "text-slate-900",
                )}
              >
                {item.title}
              </div>
              <div
                className={cn(
                  "mt-2 text-sm leading-relaxed",
                  isDark ? "text-white/70" : "text-slate-600",
                )}
              >
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
