import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVehicleInfo,
  getVehicleOwner,
  getVehicleRegistration,
  getVehicleInsurance,
  deleteVehicle,
} from "../Services/api";
import toast from "react-hot-toast";

const TABS = ["Info", "Owner", "Registration", "Insurance"];

function DetailRow({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{String(value)}</span>
    </div>
  );
}

function TabPanel({ id, tab }) {
  const infoQuery = useQuery({
    queryKey: ["vehicle-info", id],
    queryFn: () => getVehicleInfo(id),
    enabled: tab === "Info",
  });
  const ownerQuery = useQuery({
    queryKey: ["vehicle-owner", id],
    queryFn: () => getVehicleOwner(id),
    enabled: tab === "Owner",
  });
  const regQuery = useQuery({
    queryKey: ["vehicle-registration", id],
    queryFn: () => getVehicleRegistration(id),
    enabled: tab === "Registration",
  });
  const insQuery = useQuery({
    queryKey: ["vehicle-insurance", id],
    queryFn: () => getVehicleInsurance(id),
    enabled: tab === "Insurance",
  });

  const queryMap = { Info: infoQuery, Owner: ownerQuery, Registration: regQuery, Insurance: insQuery };
  const { data, isLoading, isError } = queryMap[tab];
  const record = data?.data ?? data ?? {};

  if (isLoading) return <div className="loading">Loading {tab}...</div>;
  if (isError) return <div className="error-box">Failed to load {tab} data.</div>;

  return (
    <div className="detail-grid">
      {Object.entries(record)
        .filter(([k]) => !["id", "_id", "__v", "createdAt", "updatedAt"].includes(k))
        .map(([k, v]) => (
          <DetailRow key={k} label={k.replace(/([A-Z])/g, " $1").trim()} value={v} />
        ))}
    </div>
  );
}

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("Info");
  const [showDelete, setShowDelete] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle deleted");
      navigate("/dashboard");
    },
    onError: () => toast.error("Failed to delete vehicle"),
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <Link to="/dashboard" className="back-link">← Dashboard</Link>
          <h1>Vehicle Details</h1>
        </div>
        <div className="header-actions">
          <Link to={`/vehicle/${id}/edit`} className="btn-warning">Edit</Link>
          <button className="btn-danger" onClick={() => setShowDelete(true)}>Delete</button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <TabPanel id={id} tab={activeTab} />
      </div>

      {showDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to permanently delete this vehicle record?</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
              <button
                className="btn-danger"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
