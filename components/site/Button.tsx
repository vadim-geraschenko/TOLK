type ButtonProps = {
  href: string;
  label: string;
  className?: string;
};

export function Button({ href, label, className = "" }: ButtonProps) {
  const classes = className ? `button ${className}` : "button";

  return (
    <a className={classes} href={href}>
      <span className="button-label">{label}</span>
      <span className="stars">
        <span className="star star-lg star-1" />
        <span className="star star-sm star-2" />
        <span className="star star-lg star-3" />
        <span className="star star-sm star-4" />
        <span className="star star-lg star-5" />
        <span className="star star-sm star-6" />
        <span className="star star-sm star-7" />
      </span>
    </a>
  );
}
