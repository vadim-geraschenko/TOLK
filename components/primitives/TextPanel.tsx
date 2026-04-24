export function TextPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <article className={className}>{children}</article>;
}
