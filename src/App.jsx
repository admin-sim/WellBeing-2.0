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
import ServiceClassification from "./pages/Masters/GeneralMasters/AccountManagement/ServiceClassification";
import Service from "./pages/Masters/GeneralMasters/AccountManagement/Service";
import CreateService from "./pages/Masters/GeneralMasters/AccountManagement/CreateService";
import FacilityPriceDefinition from "./pages/Masters/GeneralMasters/AccountManagement/FacilityPriceDefinition";
import EditPriceDefinition from "./pages/Masters/GeneralMasters/AccountManagement/EditPriceDefinition";
import CreatePurchaseOrder from "./pages/Inventory/CreatePurchaseOrder";
import DirectGRN from "./pages/Inventory/DirectGRN";
import CreateDirectGRN from "./pages/Inventory/CreateDirectGRN";
import GRNAgainstPO from "./pages/Inventory/GRNAgainstPO";
import CreateGRNAgainstPO from "./pages/Inventory/CreateGRNAgainstPO";
import Indent from "./pages/Inventory/Indent";
import CreateIndent from "./pages/Inventory/CreateIndent";
import PatientIndent from "./pages/Inventory/PatientIndent";
import CreatePatientIndent from "./pages/Inventory/CreatePatientIndent";
import IndentIssue from "./pages/Inventory/IndentIssue";
import UrgentIssue from "./pages/Inventory/UrgentIssue";
import CreateUrgentIssue from "./pages/Inventory/CreateUrgentIssue";
import PatientIssue from "./pages/Inventory/PatientIssue";
import PatientConsumption from "./pages/Inventory/PatientConsumption";
import CreatePatientConsumption from "./pages/Inventory/CreatePatientConsumption";
import ItemReceipt from "./pages/Inventory/ItemReceipt";
import StoreConsumption from "./pages/Inventory/StoreConsumption";
import CreateStoreConsumption from "./pages/Inventory/CreateStoreConsumption";
import OpeningStock from "./pages/Inventory/OpeningStock";
import CreateOpeningStock from "./pages/Inventory/CreateOpeningStock";
import VendorReturn from "./pages/Inventory/VendorReturn";
import CreateVendorReturn from "./pages/Inventory/CreateVendorReturn";
import StoreReturn from "./pages/Inventory/StoreReturn";
import CreateStoreReturn from "./pages/Inventory/CreateStoreReturn";
import AcknowledgeReturn from "./pages/Inventory/AcknowledgeReturn";
import CreateAcknowledageReturn from "./pages/Inventory/CreateAcknowledageReturn";
import MedicalReturn from "./pages/Inventory/MedicalReturn";
import StockExpiry from "./pages/Inventory/StockExpiry";
import UpdateIndentIssue from "./pages/Inventory/UpdateIndentIssue";
import Queue from "./pages/Patient/QueueManagement/Queue";
import PatientVitalSigns from "./pages/Patient/QueueManagement/PatientVitalSigns";

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
            path="Queue"
            element={
              <ProtectedRoute>
                <Queue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PatientVitalSigns"
            element={
              <ProtectedRoute>
                <PatientVitalSigns />
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
            path="/CreatePurchaseOrder"
            element={
              <ProtectedRoute>
                <CreatePurchaseOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/DirectGRN"
            element={
              <ProtectedRoute>
                <DirectGRN />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateDirectGRN"
            element={
              <ProtectedRoute>
                <CreateDirectGRN />
              </ProtectedRoute>
            }
          />
          <Route
            path="/GRNAgainstPO"
            element={
              <ProtectedRoute>
                <GRNAgainstPO />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateGRNAgainstPO"
            element={
              <ProtectedRoute>
                <CreateGRNAgainstPO />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Indent"
            element={
              <ProtectedRoute>
                <Indent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateIndent"
            element={
              <ProtectedRoute>
                <CreateIndent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PatientIndent"
            element={
              <ProtectedRoute>
                <PatientIndent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreatePatientIndent"
            element={
              <ProtectedRoute>
                <CreatePatientIndent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/IndentIssue"
            element={
              <ProtectedRoute>
                <IndentIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UpdateIndentIssue"
            element={
              <ProtectedRoute>
                <UpdateIndentIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UrgentIssue"
            element={
              <ProtectedRoute>
                <UrgentIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateUrgentIssue"
            element={
              <ProtectedRoute>
                <CreateUrgentIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PatientIssue"
            element={
              <ProtectedRoute>
                <PatientIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PatientConsumption"
            element={
              <ProtectedRoute>
                <PatientConsumption />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreatePatientConsumption"
            element={
              <ProtectedRoute>
                <CreatePatientConsumption />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ItemReceipt"
            element={
              <ProtectedRoute>
                <ItemReceipt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/StoreConsumption"
            element={
              <ProtectedRoute>
                <StoreConsumption />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateStoreConsumption"
            element={
              <ProtectedRoute>
                <CreateStoreConsumption />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OpeningStock"
            element={
              <ProtectedRoute>
                <OpeningStock />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateOpeningStock"
            element={
              <ProtectedRoute>
                <CreateOpeningStock />
              </ProtectedRoute>
            }
          />
          <Route
            path="/VendorReturn"
            element={
              <ProtectedRoute>
                <VendorReturn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateVendorReturn"
            element={
              <ProtectedRoute>
                <CreateVendorReturn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/StoreReturn"
            element={
              <ProtectedRoute>
                <StoreReturn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateStoreReturn"
            element={
              <ProtectedRoute>
                <CreateStoreReturn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AcknowledgeReturn"
            element={
              <ProtectedRoute>
                <AcknowledgeReturn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateAcknowledageReturn"
            element={
              <ProtectedRoute>
                <CreateAcknowledageReturn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MedicalReturn"
            element={
              <ProtectedRoute>
                <MedicalReturn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/StockExpiry"
            element={
              <ProtectedRoute>
                <StockExpiry />
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
            path="ServiceClassification"
            element={
              <ProtectedRoute>
                <ServiceClassification />
              </ProtectedRoute>
            }
          />
          <Route
            path="Service"
            element={
              <ProtectedRoute>
                <Service />
              </ProtectedRoute>
            }
          />
          <Route
            path="CreateService"
            element={
              <ProtectedRoute>
                <CreateService />
              </ProtectedRoute>
            }
          />
          <Route
            path="FacilityPriceDefinition"
            element={
              <ProtectedRoute>
                <FacilityPriceDefinition />
              </ProtectedRoute>
            }
          />
          <Route
            path="EditPriceDefinition"
            element={
              <ProtectedRoute>
                <EditPriceDefinition />
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
