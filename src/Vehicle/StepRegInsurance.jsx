import { useState } from "react";
import { regInsuranceSchema } from "../Services/VehicleSchema";
import FormField from "../assets/components/FormField";

const PLATE_TYPES = ["PRIVATE", "COMMERCIAL", "GOVERNMENT", "DIPLOMATIC", "PERSONALIZED"];
const REG_STATUSES = ["ACTIVE", "SUSPENDED", "EXPIRED", "PENDING"];
const INS_STATUSES = ["ACTIVE", "SUSPENDED", "EXPIRED"];

export default function StepRegInsurance({ data, onSubmit, onBack, isSubmitting }) {
  const [form, setForm] = useState({
    plateNumber: "", plateType: "", registrationDate: "", expiryDate: "",
    registrationStatus: "", roadworthyCert: "", customsRef: "", proofOfOwnership: "",
    policyNumber: "", companyName: "", insuranceType: "", insuranceExpiryDate: "",
    insuranceStatus: "", state: "", ...data,
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validateField = (field, value) => {
    const partial = regInsuranceSchema.partial();
    const result = partial.safeParse({ [field]: value });
    if (!result.success) {
      const msg = result.error.issues.find((i) => i.path[0] === field)?.message;
      if (msg) setErrors((er) => ({ ...er, [field]: msg }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = regInsuranceSchema.safeParse(form);
    if (!result.success) {
      const errs = {};
      result.error.issues.forEach((i) => { errs[i.path[0]] = i.message; });
      setErrors(errs);
      return;
    }
    onSubmit(result.data);
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

  const sel = (field, options) => (
    <select
      className={`input ${errors[field] ? "input-error" : ""}`}
      value={form[field]}
      onChange={set(field)}
    >
      <option value="">Select...</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3 className="sub-section">Registration Details</h3>
      <div className="form-grid">
        <FormField label="Plate Number" error={errors.plateNumber} required>{inp("plateNumber")}</FormField>
        <FormField label="Plate Type" error={errors.plateType} required>{sel("plateType", PLATE_TYPES)}</FormField>
        <FormField label="Registration Date" error={errors.registrationDate} required>{inp("registrationDate", "datetime-local")}</FormField>
        <FormField label="Expiry Date" error={errors.expiryDate} required>{inp("expiryDate", "datetime-local")}</FormField>
        <FormField label="Registration Status" error={errors.registrationStatus} required>{sel("registrationStatus", REG_STATUSES)}</FormField>
        <FormField label="Roadworthy Certificate" error={errors.roadworthyCert} required>{inp("roadworthyCert")}</FormField>
        <FormField label="Customs Reference" error={errors.customsRef} required>{inp("customsRef")}</FormField>
        <FormField label="Proof of Ownership" error={errors.proofOfOwnership} required>{inp("proofOfOwnership")}</FormField>
        <FormField label="State" error={errors.state} required>{inp("state")}</FormField>
      </div>

      <h3 className="sub-section">Insurance Details</h3>
      <div className="form-grid">
        <FormField label="Policy Number" error={errors.policyNumber} required>{inp("policyNumber")}</FormField>
        <FormField label="Insurance Company" error={errors.companyName} required>{inp("companyName")}</FormField>
        <FormField label="Insurance Type" error={errors.insuranceType} required>{inp("insuranceType")}</FormField>
        <FormField label="Insurance Expiry Date" error={errors.insuranceExpiryDate} required>{inp("insuranceExpiryDate", "datetime-local")}</FormField>
        <FormField label="Insurance Status" error={errors.insuranceStatus} required>{sel("insuranceStatus", INS_STATUSES)}</FormField>
      </div>

      <div className="step-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>← Back</button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </button>
      </div>
    </form>
  );
}
