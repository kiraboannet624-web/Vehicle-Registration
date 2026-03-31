import { useState } from "react";
import { vehicleInfoSchema } from "../Services/VehicleSchema";
import FormField from "../assets/components/FormField";

const VEHICLE_TYPES = ["ELECTRIC", "SUV", "TRUCK", "MOTORCYCLE", "BUS", "VAN", "PICKUP", "OTHER"];
const FUEL_TYPES = ["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "GAS", "OTHER"];
const PURPOSES = ["PERSONAL", "COMMERCIAL", "TAXI", "GOVERNMENT"];
const STATUSES = ["NEW", "USED", "REBUILT"];

export default function StepVehicleInfo({ data, onNext }) {
  const [form, setForm] = useState({
    manufacture: "", model: "", year: "", vehicleType: "", fuelType: "",
    bodyType: "", color: "", engineCapacity: "", seatingCapacity: "",
    odometerReading: "", purpose: "", status: "", ...data,
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validateField = (field, value) => {
    const numFields = ["year", "engineCapacity", "seatingCapacity", "odometerReading"];
    const parsed = numFields.includes(field) ? Number(value) : value;
    const partial = vehicleInfoSchema.partial();
    const result = partial.safeParse({ [field]: parsed });
    if (!result.success) {
      const msg = result.error.issues.find((i) => i.path[0] === field)?.message;
      if (msg) setErrors((er) => ({ ...er, [field]: msg }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numFields = ["year", "engineCapacity", "seatingCapacity", "odometerReading"];
    const parsed = { ...form };
    numFields.forEach((f) => { parsed[f] = Number(form[f]); });
    const result = vehicleInfoSchema.safeParse(parsed);
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
      onBlur={() => {
        const numFields = ["year", "engineCapacity", "seatingCapacity", "odometerReading"];
        validateField(field, numFields.includes(field) ? Number(form[field]) : form[field]);
      }}
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
      <div className="form-grid">
        <FormField label="Manufacture" error={errors.manufacture} required>{inp("manufacture")}</FormField>
        <FormField label="Model" error={errors.model} required>{inp("model")}</FormField>
        <FormField label="Year" error={errors.year} required>{inp("year", "number")}</FormField>
        <FormField label="Vehicle Type" error={errors.vehicleType} required>{sel("vehicleType", VEHICLE_TYPES)}</FormField>
        <FormField label="Fuel Type" error={errors.fuelType} required>{sel("fuelType", FUEL_TYPES)}</FormField>
        <FormField label="Body Type" error={errors.bodyType} required>{inp("bodyType")}</FormField>
        <FormField label="Color" error={errors.color} required>{inp("color")}</FormField>
        <FormField label="Engine Capacity (cc)" error={errors.engineCapacity} required>{inp("engineCapacity", "number")}</FormField>
        <FormField label="Seating Capacity" error={errors.seatingCapacity} required>{inp("seatingCapacity", "number")}</FormField>
        <FormField label="Odometer Reading (km)" error={errors.odometerReading} required>{inp("odometerReading", "number")}</FormField>
        <FormField label="Purpose" error={errors.purpose} required>{sel("purpose", PURPOSES)}</FormField>
        <FormField label="Vehicle Status" error={errors.status} required>{sel("status", STATUSES)}</FormField>
      </div>
      <div className="step-actions">
        <button type="submit" className="btn-primary">Next: Owner Info →</button>
      </div>
    </form>
  );
}
