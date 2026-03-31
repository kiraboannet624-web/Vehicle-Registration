import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createVehicle } from "../Services/api";
import StepVehicleInfo from "./StepVehicleInfo";
import StepOwnerInfo from "./StepownerInfo";
import StepRegInsurance from "./StepRegInsurance";
import toast from "react-hot-toast";

const STEPS = ["Vehicle Info", "Owner Info", "Registration & Insurance"];

export default function RegisterVehicle() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle registered successfully!");
      navigate("/dashboard");
    },
    onError: (err) => {
      const issues = err?.response?.data?.errors ?? err?.response?.data?.message;
      if (Array.isArray(issues)) {
        issues.forEach((msg) => toast.error(msg));
      } else {
        toast.error(issues ?? "Failed to register vehicle");
      }
    },
  });

  const handleNext = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleFinalSubmit = (stepData) => {
    const payload = { ...formData, ...stepData };
    mutation.mutate(payload);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Register New Vehicle</h1>
      </div>

      <div className="stepper">
        {STEPS.map((label, i) => (
          <div key={label} className={`step-item ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
            <div className="step-circle">{i < step ? "✓" : i + 1}</div>
            <span className="step-label">{label}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="form-card">
        {step === 0 && <StepVehicleInfo data={formData} onNext={handleNext} />}
        {step === 1 && <StepOwnerInfo data={formData} onNext={handleNext} onBack={handleBack} />}
        {step === 2 && (
          <StepRegInsurance
            data={formData}
            onSubmit={handleFinalSubmit}
            onBack={handleBack}
            isSubmitting={mutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
