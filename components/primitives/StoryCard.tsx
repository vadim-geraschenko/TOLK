export function StoryCard({
  as: Tag = "article",
  className,
  children,
}: {
  as?: "article" | "div";
  className?: string;
  children: React.ReactNode;
}) {
  return <Tag className={className}>{children}</Tag>;
}
