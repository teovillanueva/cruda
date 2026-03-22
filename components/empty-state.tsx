import { Logo } from "@/components/logo";

export function EmptyState({
  message,
  className = "min-h-[60vh]",
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <Logo size={28} color="currentColor" />
      <p className="text-sm text-foreground/40 italic">{message}</p>
    </div>
  );
}
