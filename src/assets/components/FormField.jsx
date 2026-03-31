export default function FormField({ label, error, children, required }) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
