import type { StyledComponentProps } from "./types";

type SiteFooterProps = {
  text: string;
} & StyledComponentProps;

export function SiteFooter({ text, cx }: SiteFooterProps) {
  return (
    <footer className={cx("footer")}>
      <div className={cx("container")}>
        <div>{text}</div>
      </div>
    </footer>
  );
}
