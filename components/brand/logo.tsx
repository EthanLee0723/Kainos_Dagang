import {
  LOCKUP_MARK_PATHS,
  LOCKUP_VIEWBOX,
  LOCKUP_WORD_PATHS,
  MARK_PATHS,
  MARK_VIEWBOX,
} from "./logo-paths";

type LogoProps = {
  className?: string;
  /** Accessible name. Pass `null` when the logo sits next to visible brand text. */
  label?: string | null;
};

function a11y(label: string | null | undefined) {
  return label === null
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": label ?? "Kainos Dagang" } as const);
}

/**
 * Shield + KAINOS DAGANG lockup. The wordmark takes `currentColor` (white on the
 * signboard, black on paper); the shield stays brand orange via `--logo-mark`.
 */
export function LogoLockup({ className, label }: LogoProps) {
  return (
    <svg viewBox={LOCKUP_VIEWBOX} className={className} {...a11y(label)}>
      <g fill="var(--logo-mark, var(--color-orange))">
        {LOCKUP_MARK_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="currentColor">
        {LOCKUP_WORD_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

/** The shield mark alone. Fills with `currentColor`. */
export function LogoMark({ className, label }: LogoProps) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} {...a11y(label)}>
      <g fill="currentColor">
        {MARK_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
