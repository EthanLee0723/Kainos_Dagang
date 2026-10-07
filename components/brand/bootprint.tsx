/**
 * A safety-boot sole print with chevron tread (the guideline's footprint
 * motif). Right foot, toe up; pass `left` to mirror it. Grooves are holes
 * (even-odd), so the print sits on any ground.
 */
export function Bootprint({ className, left = false }: { className?: string; left?: boolean }) {
  return (
    <svg viewBox="0 0 100 236" className={className} aria-hidden>
      <path
        fill="currentColor"
        fillRule="evenodd"
        transform={left ? "translate(100 0) scale(-1 1)" : undefined}
        d="M52 3c28 0 44 25 44 59 0 32-10 54-16 74-4 14-3 30 0 48 5 30-8 49-30 49s-34-19-29-49c3-18 2-34-3-50C10 110 5 92 5 64 5 28 24 3 52 3zM26 30c14-10 38-10 52 0l-4 7c-12-8-32-8-44 0zM16 66l34-18 36 18-3 8-33-17-31 17zM15 90l35-18 37 18-3 8-34-17-32 17zM17 114l33-18 35 18-3 7-32-16-30 16zM30 146h42l-1 7H31zM28 176h46v8H28zM27 196h48v8H27zM33 216h36v6H33z"
      />
    </svg>
  );
}
