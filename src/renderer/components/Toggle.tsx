type Props = {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
};

export function Toggle({ label, hint, value, onChange }: Props) {
  return (
    <div className="toggle-row">
      <div>
        <div className="label">{label}</div>
        {hint && <div className="hint">{hint}</div>}
      </div>
      <div
        className={`switch ${value ? "on" : ""}`}
        role="switch"
        aria-checked={value}
        aria-label={label}
        tabIndex={0}
        onClick={() => onChange(!value)}
        onKeyDown={(e) => e.key === "Enter" && onChange(!value)}
      />
    </div>
  );
}
