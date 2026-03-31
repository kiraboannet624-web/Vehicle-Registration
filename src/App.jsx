import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import Navbar from "./assets/components/Navbar";
import Home from "./Vehicle/home";
import Login from "./Vehicle/Login";
import Dashboard from "./Vehicle/Dashboard";
import RegisterVehicle from "./Vehicle/RegisterVehicle";
import VehicleDetails from "./Vehicle/VehicleDetails";
import EditVehicle from "./Vehicle/EditVehicle";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/vehicle/new" element={<ProtectedRoute><RegisterVehicle /></ProtectedRoute>} />
              <Route path="/vehicle/:id" element={<ProtectedRoute><VehicleDetails /></ProtectedRoute>} />
              <Route path="/vehicle/:id/edit" element={<ProtectedRoute><EditVehicle /></ProtectedRoute>} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
