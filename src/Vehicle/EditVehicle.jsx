import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVehicleById, updateVehicle } from "../Services/api";
import StepVehicleInfo from "./StepVehicleInfo";
import StepOwnerInfo from "./StepownerInfo";
import StepRegInsurance from "./StepRegInsurance";
import toast from "react-hot-toast";

const STEPS = ["Vehicle Info", "Owner Info", "Registration & Insurance"];

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => getVehicleById(id),
  });

  const vehicle = data?.data ?? data ?? {};

  useEffect(() => {
    if (vehicle && Object.keys(vehicle).length > 0) {
      setFormData(vehicle);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload) => updateVehicle(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", id] });
      toast.success("Vehicle updated successfully!");
      navigate(`/vehicle/${id}`);
    },
    onError: (err) => {
      const issues = err?.response?.data?.errors ?? err?.response?.data?.message;
      if (Array.isArray(issues)) {
        issues.forEach((msg) => toast.error(msg));
      } else {
        toast.error(issues ?? "Failed to update vehicle");
      }
    },
  });

  const handleNext = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleFinalSubmit = (stepData) => {
    mutation.mutate({ ...formData, ...stepData });
  };

  if (isLoading) return <div className="page"><div className="loading">Loading vehicle data...</div></div>;
  if (isError) return <div className="page"><div className="error-box">Failed to load vehicle.</div></div>;

  const initialData = { ...vehicle, ...formData };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Edit Vehicle</h1>
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
        {step === 0 && <StepVehicleInfo data={initialData} onNext={handleNext} />}
        {step === 1 && <StepOwnerInfo data={initialData} onNext={handleNext} onBack={handleBack} />}
        {step === 2 && (
          <StepRegInsurance
            data={initialData}
            onSubmit={handleFinalSubmit}
            onBack={handleBack}
            isSubmitting={mutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
