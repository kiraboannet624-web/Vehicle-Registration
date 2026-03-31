import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllVehicles } from "../Services/api";
import { useAuth } from "../Context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getAllVehicles,
  });

  const vehicles = data?.data ?? data ?? [];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Vehicle Registry</h1>
        <p className="subtitle">Public read-only list of all registered vehicles</p>
        {isAuthenticated && (
          <Link to="/vehicle/new" className="btn-primary">+ Register Vehicle</Link>
        )}
      </div>

      {isLoading && <div className="loading">Loading vehicles...</div>}
      {isError && <div className="error-box">Failed to load vehicles. Please try again.</div>}

      {!isLoading && !isError && (
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
                {isAuthenticated && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr><td colSpan={isAuthenticated ? 8 : 7} className="empty-row">No vehicles found.</td></tr>
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
                    {isAuthenticated && (
                      <td>
                        <Link to={`/vehicle/${v.id ?? v._id}`} className="btn-sm">View</Link>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
