import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Ensure jwtDecode is correctly imported
import "./App.css";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Patient from "./pages/Patient";
import NewPatient from "./pages/Patient/NewPatient";
import NewVisit from "./pages/Patient/NewVisit";
import PatientEdit from "./pages/Patient/EditPatientReg";
import LabDashboard from "./pages/Laboratory/LabDashboard";
import SampleCollection from "./pages/Laboratory/LabDashboard/SampleCollection";
import Queue from "./pages/Patient/QueueManagement/Queue";

function ProtectedRoute({ children }) {
  const token = Cookies.get("authToken");

  if (!token) {
    // If the JWT token is not there, redirect to the login page
    return <Navigate to="/login" />;
  }

  try {
    // Decode the token and check its expiration time
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      // If the token has expired, redirect to the login page
      return <Navigate to="/login" />;
    }
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return <Navigate to="/login" />;
  }

  // If the token is valid, render the requested component
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Outlet />
            </MainLayout>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="patient"
            element={
              <ProtectedRoute>
                <Patient />
              </ProtectedRoute>
            }
          />
          <Route
            path="patient/NewPatient"
            element={
              <ProtectedRoute>
                <NewPatient />
              </ProtectedRoute>
            }
          />
          <Route
            path="patient/NewVisit"
            element={
              <ProtectedRoute>
                <NewVisit />
              </ProtectedRoute>
            }
          />
          <Route
            path="patient/PatientEdit"
            element={
              <ProtectedRoute>
                <PatientEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="Laboratory/LabDashboard"
            element={
              <ProtectedRoute>
                <LabDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="SampleCollection/:patientId/:encounterId/:labnumber"
            element={
              <ProtectedRoute>
                <SampleCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="Queue"
            element={
              <ProtectedRoute>
                <Queue />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Error />} />
        </Route>
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
