import { cn } from "~/lib/cn";

export function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export function Section({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  return <section className={cn("py-16 sm:py-20", className)} {...props} />;
}
