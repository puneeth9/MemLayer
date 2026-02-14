interface SpinnerProps {
  label?: string;
}

export default function Spinner({ label }: SpinnerProps) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}
