import { useState } from "react";
import { ownerInfoSchema } from "../Services/VehicleSchema";
import FormField from "../assets/components/FormField";

const OWNER_TYPES = ["INDIVIDUAL", "COMPANY", "NGO", "GOVERNMENT"];

export default function StepOwnerInfo({ data, onNext, onBack }) {
  const [form, setForm] = useState({
    ownerName: "", ownerType: "", nationalId: "", mobileNumber: "",
    email: "", address: "", companyRegNumber: "", passportNumber: "", ...data,
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validateField = (field, value) => {
    const partial = ownerInfoSchema.partial();
    const result = partial.safeParse({ [field]: value });
    if (!result.success) {
      const msg = result.error.issues.find((i) => i.path[0] === field)?.message;
      if (msg) setErrors((er) => ({ ...er, [field]: msg }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = ownerInfoSchema.safeParse(form);
    if (!result.success) {
      const errs = {};
      result.error.issues.forEach((i) => { errs[i.path[0]] = i.message; });
      setErrors(errs);
      return;
    }
    onNext(result.data);
  };

  const inp = (field, type = "text") => (
    <input
      type={type}
      className={`input ${errors[field] ? "input-error" : ""}`}
      value={form[field]}
      onChange={set(field)}
      onBlur={() => validateField(field, form[field])}
    />
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <FormField label="Owner Name" error={errors.ownerName} required>{inp("ownerName")}</FormField>
        <FormField label="Owner Type" error={errors.ownerType} required>
          <select
            className={`input ${errors.ownerType ? "input-error" : ""}`}
            value={form.ownerType}
            onChange={set("ownerType")}
          >
            <option value="">Select...</option>
            {OWNER_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </FormField>
        <FormField label="National ID (16 digits)" error={errors.nationalId} required>{inp("nationalId")}</FormField>
        <FormField label="Mobile Number (10 digits)" error={errors.mobileNumber} required>{inp("mobileNumber", "tel")}</FormField>
        <FormField label="Email" error={errors.email} required>{inp("email", "email")}</FormField>
        <FormField label="Address" error={errors.address} required>{inp("address")}</FormField>
        {form.ownerType === "COMPANY" && (
          <FormField label="Company Registration Number" error={errors.companyRegNumber} required>
            {inp("companyRegNumber")}
          </FormField>
        )}
        <FormField label="Passport Number (optional)" error={errors.passportNumber}>
          {inp("passportNumber")}
        </FormField>
      </div>
      <div className="step-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>← Back</button>
        <button type="submit" className="btn-primary">Next: Registration →</button>
      </div>
    </form>
  );
}
