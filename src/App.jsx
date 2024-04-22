import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
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
import ClinicalChart from "./pages/ClinicalChart";
import PurchaseOrder from "./pages/Inventory/PurchaseOrder";
import Lookup from "./pages/Masters/GeneralMasters/Lookup";
import States from "./pages/Masters/GeneralMasters/States";
import Places from "./pages/Masters/GeneralMasters/Places";
import Areas from "./pages/Masters/GeneralMasters/Areas";
import UOM from "./pages/Masters/GeneralMasters/UOM";
import ProviderRegistration from "./pages/Masters/GeneralMasters/Provider/ProviderRegistration";
import ProviderSearch from "./pages/Masters/GeneralMasters/Provider/ProviderSearch";
import ProviderEdit from "./pages/Masters/GeneralMasters/Provider/ProviderEdit";
import Referal from "./pages/Masters/GeneralMasters/Referral/Referal";
import ReferralCreateEdit from "./pages/Masters/GeneralMasters/Referral/ReferralCreateEdit";
import PayerRegistration from "./pages/Masters/GeneralMasters/Payer/PayerRegistration";
import PayerSearch from "./pages/Masters/GeneralMasters/Payer/PayerSearch";
import PayerEdit from "./pages/Masters/GeneralMasters/Payer/PayerEdit";

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
            path="/ClinicalChart"
            element={
              <ProtectedRoute>
                <ClinicalChart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PurchaseOrder"
            element={
              <ProtectedRoute>
                <PurchaseOrder />
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
            path="Lookup"
            element={
              <ProtectedRoute>
                <Lookup />
              </ProtectedRoute>
            }
          />
          <Route
            path="States"
            element={
              <ProtectedRoute>
                <States />
              </ProtectedRoute>
            }
          />
          <Route
            path="Places"
            element={
              <ProtectedRoute>
                <Places />
              </ProtectedRoute>
            }
          />
          <Route
            path="Areas"
            element={
              <ProtectedRoute>
                <Areas />
              </ProtectedRoute>
            }
          />
          <Route
            path="UOM"
            element={
              <ProtectedRoute>
                <UOM />
              </ProtectedRoute>
            }
          />
          <Route
            path="ProviderRegistration"
            element={
              <ProtectedRoute>
                <ProviderRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="Provider/Search"
            element={
              <ProtectedRoute>
                <ProviderSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="Provider/Edit"
            element={
              <ProtectedRoute>
                <ProviderEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="Referral"
            element={
              <ProtectedRoute>
                <Referal />
              </ProtectedRoute>
            }
          />
          <Route
            path="Referral/CreateEdit"
            element={
              <ProtectedRoute>
                <ReferralCreateEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="PayerRegistration"
            element={
              <ProtectedRoute>
                <PayerRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="PayerSearch"
            element={
              <ProtectedRoute>
                <PayerSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="Payer/Edit"
            element={
              <ProtectedRoute>
                <PayerEdit />
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
