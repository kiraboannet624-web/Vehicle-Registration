import { z } from "zod";

const currentYear = new Date().getFullYear();

export const vehicleInfoSchema = z.object({
  manufacture: z.string().min(1, "Manufacture is required").trim(),
  model: z.string().min(1, "Model is required").trim(),
  year: z.number({ invalid_type_error: "Year must be a number" }).int().min(1886, "Year must be 1886 or later").max(currentYear + 1, `Year cannot exceed ${currentYear + 1}`),
  vehicleType: z.enum(["ELECTRIC", "SUV", "TRUCK", "MOTORCYCLE", "BUS", "VAN", "PICKUP", "OTHER"], { required_error: "Vehicle type is required" }),
  fuelType: z.enum(["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "GAS", "OTHER"], { required_error: "Fuel type is required" }),
  bodyType: z.string().min(1, "Body type is required").trim(),
  color: z.string().min(1, "Color is required").trim(),
  engineCapacity: z.number({ invalid_type_error: "Must be a number" }).int().positive("Must be greater than 0"),
  seatingCapacity: z.number({ invalid_type_error: "Must be a number" }).int().min(1, "Minimum 1"),
  odometerReading: z.number({ invalid_type_error: "Must be a number" }).int().min(0, "Cannot be negative"),
  purpose: z.enum(["PERSONAL", "COMMERCIAL", "TAXI", "GOVERNMENT"], { required_error: "Purpose is required" }),
  status: z.enum(["NEW", "USED", "REBUILT"], { required_error: "Status is required" }),
});

export const ownerInfoSchema = z.object({
  ownerName: z.string().min(1, "Owner name is required").trim(),
  ownerType: z.enum(["INDIVIDUAL", "COMPANY", "NGO", "GOVERNMENT"], { required_error: "Owner type is required" }),
  nationalId: z.string().regex(/^\d{16}$/, "National ID must be exactly 16 digits"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  email: z.string().email("Must be a valid email address"),
  address: z.string().min(1, "Address is required").trim(),
  companyRegNumber: z.string().optional(),
  passportNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.ownerType === "COMPANY" && !data.companyRegNumber?.trim()) {
    ctx.addIssue({ path: ["companyRegNumber"], code: z.ZodIssueCode.custom, message: "Required for COMPANY owner type" });
  }
});

export const regInsuranceSchema = z.object({
  plateNumber: z.string().regex(/^(R[A-Z]{2}|GR|CD)\s?\d{3}\s?[A-Z]?$/i, "Invalid Rwandan plate (e.g. RAB 123A)"),
  plateType: z.enum(["PRIVATE", "COMMERCIAL", "GOVERNMENT", "DIPLOMATIC", "PERSONALIZED"], { required_error: "Plate type is required" }),
  registrationDate: z.string().min(1, "Registration date is required"),
  expiryDate: z.string().min(1, "Expiry date is required").refine((v) => new Date(v) > new Date(), "Expiry date cannot be in the past"),
  registrationStatus: z.enum(["ACTIVE", "SUSPENDED", "EXPIRED", "PENDING"], { required_error: "Status is required" }),
  roadworthyCert: z.string().min(1, "Roadworthy certificate is required").trim(),
  customsRef: z.string().min(1, "Customs reference is required").trim(),
  proofOfOwnership: z.string().min(1, "Proof of ownership is required").trim(),
  state: z.string().min(1, "State is required").trim(),
  policyNumber: z.string().min(1, "Policy number is required").trim(),
  companyName: z.string().min(1, "Insurance company is required").trim(),
  insuranceType: z.string().min(1, "Insurance type is required").trim(),
  insuranceExpiryDate: z.string().min(1, "Insurance expiry date is required").refine((v) => new Date(v) > new Date(), "Insurance expiry cannot be in the past"),
  insuranceStatus: z.enum(["ACTIVE", "SUSPENDED", "EXPIRED"], { required_error: "Insurance status is required" }),
});
