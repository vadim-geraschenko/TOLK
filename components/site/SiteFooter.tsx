type SiteFooterProps = {
  text: string;
};

export function SiteFooter({ text }: SiteFooterProps) {
  return (
    <footer className="footer">
      <div className="container">
        <div>{text}</div>
      </div>
    </footer>
  );
}
