export function Toggle({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label || "toggle"}
      className={`h-6 w-11 rounded-full p-0.5 transition ${checked ? "bg-brand" : "bg-slate-300"}`}
      onClick={() => onChange(!checked)}
    >
      <span className={`block h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}
