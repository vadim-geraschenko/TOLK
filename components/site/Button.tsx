import type { StyledComponentProps } from "./types";
import { withBasePath } from "../../lib/base-path";

type ButtonProps = {
  href: string;
  label: string;
  className?: string;
} & StyledComponentProps;

export function Button({ href, label, className = "", cx }: ButtonProps) {
  const classes = cx("button", className);

  return (
    <a className={classes} href={withBasePath(href)}>
      <span className={cx("button-label")}>{label}</span>
      <span className={cx("stars")}>
        <span className={cx("star", "star-lg", "star-1")} />
        <span className={cx("star", "star-sm", "star-2")} />
        <span className={cx("star", "star-lg", "star-3")} />
        <span className={cx("star", "star-sm", "star-4")} />
        <span className={cx("star", "star-lg", "star-5")} />
        <span className={cx("star", "star-sm", "star-6")} />
        <span className={cx("star", "star-sm", "star-7")} />
      </span>
    </a>
  );
}
