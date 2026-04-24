export function VoiceCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <article className={className}>{children}</article>;
}
