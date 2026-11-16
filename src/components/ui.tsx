"use client";

import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  home: <path d="M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.500 15.400 12 20 12 20Z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.500 4.500" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.500 5 6v5.500c0 4.500 3 7.600 7 9 4-1.400 7-4.500 7-9V6l-7-2.500Z" />
      <path d="m9 12 2.200 2.200L15.200 10" />
    </>
  ),
  tooth: (
    <path d="M8 4c-2.500 0-4 1.800-4 4.200 0 2.300 1 3.300 1.500 5.800.500 2.600.700 6 2.300 6 1.700 0 1.200-5 4.200-5s2.500 5 4.200 5c1.600 0 1.800-3.400 2.300-6 .500-2.500 1.500-3.500 1.500-5.800C20 5.800 18.500 4 16 4c-1.700 0-2.500 1-4 1s-2.300-1-4-1Z" />
  ),
  child: (
    <>
      <circle cx="12" cy="7" r="3.200" />
      <path d="M6 20c0-3.600 2.700-6.500 6-6.500s6 2.900 6 6.500" />
    </>
  ),
  cycle: (
    <>
      <path d="M12 3.500c3.500 4 5.500 6.800 5.500 10a5.500 5.500 0 0 1-11 0c0-3.200 2-6 5.500-10Z" />
    </>
  ),
  spark: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.500 2.500M15.500 15.500 18 18M18 6l-2.500 2.500M8.500 15.500 6 18" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.800" />
      <path d="M4.500 20c.800-3.800 3.800-6 7.500-6s6.700 2.200 7.500 6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12.500 4.500 4.500L19 7.500" />,
  left: <path d="m14.500 5-7 7 7 7" />,
  right: <path d="m9.500 5 7 7-7 7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  run: (
    <>
      <circle cx="15" cy="5" r="2" />
      <path d="m7 21 3-5 3 2v-5l-3-3 3-2 3 3h3M6 12l2-3" />
    </>
  ),
  leaf: (
    <path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19l8-8" />
  ),
  moon: <path d="M19.500 14.500A8 8 0 0 1 9.500 4.500a8 8 0 1 0 10 10Z" />,
  mind: (
    <>
      <circle cx="12" cy="12" r="8.500" />
      <path d="M8.500 14.500c1 1.200 2.200 1.800 3.500 1.800s2.500-.600 3.500-1.800M9 10h.010M15 10h.010" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.600 5.600 7 7M17 17l1.400 1.400M18.400 5.600 17 7M7 17l-1.400 1.400" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.500" width="14" height="10" rx="2.500" />
      <path d="M8 10.500V8a4 4 0 0 1 8 0v2.500" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-line bg-card p-5 ${className}`}
    >
      {children}
    </section>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-forest bg-forest text-white"
          : "border-line bg-card text-ink hover:border-forest/40"
      }`}
    >
      {children}
    </button>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary: "bg-forest text-white hover:bg-forest-deep",
    ghost: "border border-line bg-card text-ink hover:border-forest/40",
    danger: "border border-coral/30 bg-coral-soft text-coral",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors disabled:opacity-40 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="sheet-in max-h-[90dvh] w-full overflow-y-auto rounded-t-[28px] bg-paper p-6 pb-8 sm:max-w-md sm:rounded-[28px]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl leading-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="-mr-1 -mt-1 grid size-10 shrink-0 place-items-center rounded-full hover:bg-line/60"
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

export function SectionTitle({
  children,
  aside,
}: {
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-3 mt-8 flex items-baseline justify-between gap-3">
      <h2 className="font-display text-xl">{children}</h2>
      {aside && <span className="text-sm text-muted">{aside}</span>}
    </div>
  );
}
