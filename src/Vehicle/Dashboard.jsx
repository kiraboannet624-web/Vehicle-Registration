import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllVehicles, deleteVehicle } from "../Services/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getAllVehicles,
  });

  const vehicles = data?.data ?? data ?? [];

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle deleted successfully");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete vehicle"),
  });

  const stats = [
    { label: "Total Vehicles", value: vehicles.length, icon: "🚗" },
    { label: "Electric", value: vehicles.filter((v) => v.vehicleType === "ELECTRIC").length, icon: "⚡" },
    { label: "Active", value: vehicles.filter((v) => v.status === "NEW" || v.status === "USED").length, icon: "✅" },
    { label: "Trucks", value: vehicles.filter((v) => v.vehicleType === "TRUCK").length, icon: "🚛" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/vehicle/new" className="btn-primary">+ Register Vehicle</Link>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <span className="stat-icon">{s.icon}</span>
            <div>
              <p className="stat-value">{isLoading ? "—" : s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">All Vehicles</h2>
      {isLoading && <div className="loading">Loading...</div>}
      {!isLoading && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Manufacture</th>
                <th>Model</th>
                <th>Year</th>
                <th>Type</th>
                <th>Plate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr><td colSpan={8} className="empty-row">No vehicles registered yet.</td></tr>
              ) : (
                vehicles.map((v, i) => (
                  <tr key={v.id ?? v._id ?? i}>
                    <td>{i + 1}</td>
                    <td>{v.manufacture}</td>
                    <td>{v.model}</td>
                    <td>{v.year}</td>
                    <td><span className="badge">{v.vehicleType}</span></td>
                    <td>{v.plateNumber ?? "—"}</td>
                    <td><span className={`badge badge-${(v.status ?? "").toLowerCase()}`}>{v.status}</span></td>
                    <td className="action-cell">
                      <Link to={`/vehicle/${v.id ?? v._id}`} className="btn-sm">View</Link>
                      <Link to={`/vehicle/${v.id ?? v._id}/edit`} className="btn-sm btn-warning">Edit</Link>
                      <button
                        className="btn-sm btn-danger"
                        onClick={() => setDeleteId(v.id ?? v._id)}
                      >Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this vehicle? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button
                className="btn-danger"
                onClick={() => deleteMutation.mutate(deleteId)}
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
