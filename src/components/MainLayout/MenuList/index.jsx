import React from "react";
import MenuList from "./MenuListMap";

// import { useSelector } from "react-redux";

export default function MenuList1(onClose) {
  // const menuItems = useSelector((state) => state.LeftMenuItems.value);
  return <MenuList menuData={menuData} onClose={onClose} />;
}

const menuData = [
  {
    key: "masters",
    icon: "SettingOutlined",
    title: "Masters",
    children: [
      {
        key: "GeneralMasters",
        icon: "CiSettings",
        title: "General Masters",
        children: [
          {
            key: "Lookup",
            icon: "GoDotFill",
            title: "Lookup",
            link: "/Lookup",
          },
          {
            key: "States",
            icon: "GoDotFill",
            title: "States",
            link: "/States",
          },
          {
            key: "Places",
            icon: "GoDotFill",
            title: "Places",
            link: "/Places",
          },
          {
            key: "Areas",
            icon: "GoDotFill",
            title: "Areas",
            link: "/Areas",
          },
          {
            key: "UOM",
            icon: "GoDotFill",
            title: "UOM",
            link: "/UOM",
          },
          {
            key: "ProviderRegistration",
            icon: "GoDotFill",
            title: "Provider",
            link: "/ProviderRegistration",
          },
          {
            key: "Referral",
            icon: "GoDotFill",
            title: "Referral",
            link: "/Referral",
          },
          {
            key: "Payer",
            icon: "GoDotFill",
            title: "Payer",
            link: "/PayerRegistration",
          },
        ],
      },

      {
        key: "Accountmanagement",
        icon: "CiSettings",
        title: "Accountmanagement",
        children: [
          {
            key: "ServiceClassification",
            icon: "GoDotFill",
            title: "ServiceClassification",
            link: "/ServiceClassification",
          },
          {
            key: "Service",
            icon: "GoDotFill",
            title: "Service",
            link: "/Service",
          },
          {
            key: "FacilityPriceDefinition",
            icon: "GoDotFill",
            title: "FacilityPriceDefinition",
            link: "/FacilityPriceDefinition",
          },
        ],
      },
    ],
  },
  {
    key: "idManagement",
    icon: "FaUserFriends",
    title: "Identity Management",
    children: [
      {
        key: "patreg",
        icon: "FaUserPlus",
        title: "Patient Registration",
        link: "/Patient",
      },
      {
        key: "Queue-Mgmt",
        title: "Queue Management",
        icon: "FaPersonWalkingArrowRight",
        link: "/Queue",
      },

      // {
      //   key: "sub-subtask",
      //   title: "SubTask",
      //   children: [
      //     { key: "ta1", title: "Task11", link: "/task-11" },
      //     { key: "ta2", title: "Task12", link: "/task-12" },
      //   ],
      // },
    ],
  },

  {
    key: "ResourceScheduling",
    icon: "GrSchedule",
    title: "Resource Scheduling",
    children: [
      {
        key: "manageAppointment",
        icons: "GoDotFill",
        title: "Manage Appointment",
        link: "/ScheduleProviderAppointment/ManageAppointment",
      },
      {
        key: "providerAppointment",
        icons: "GoDotFill",
        title: "Provider Appointment",
        link: "ScheduleProviderAppointment",
      },
    ],
  },
  {
    key: "WardManagement",
    icon: "bed",
    title: "Ward Management",
    children: [
      {
        key: "InPatientManagement",
        icons: "GoDotFill",
        title: "InPatient Management",
        link: "/WardManagement/InPatientManagement",
      },
      {
        key: "BedManager",
        icons: "GoDotFill",
        title: "BedManager",
        link: "/WardManagement/BedManager",
      },
      {
        key: "DischargeClearance",
        icons: "GoDotFill",
        title: "Discharge Clearance",
        link: "/WardManagement/DischargeClearance",
      },
    ],
  },
  {
    key: "Lab",
    icon: "ExperimentOutlined",
    title: "Laboratory",
    children: [
      {
        key: "labDashboard",
        icons: "FaUserFriends",
        title: "Lab Dashboard",
        link: "/Laboratory/LabDashboard",
      },
    ],
  },
  {
    key: "clinicalDocuments",
    icon: "FaClipboardUser",
    title: "Clinical Documents",
    children: [
      {
        key: "clinicalChart",
        icon: "GoDotFill",
        title: "Clinical Chart",
        link: "/ClinicalChart",
      },
    ],
  },
  {
    key: "inventoryManagement",
    icon: "MdInventory",
    title: "Inventory Management",
    children: [
      {
        key: "PurchaseOrder",
        icon: "GoDotFill",
        title: "Purchase Order",
        link: "/PurchaseOrder",
      },
      {
        key: "DirectGRN",
        icon: "GoDotFill",
        title: "Direct GRN",
        link: "/DirectGRN",
      },
      {
        key: "GRNAgainstPO",
        icon: "GoDotFill",
        title: "GRN Against PO",
        link: "/GRNAgainstPO",
      },
      {
        key: "Indent",
        icon: "GoDotFill",
        title: "Indent",
        link: "/Indent",
      },
      {
        key: "PatientIndent",
        icon: "GoDotFill",
        title: "Patient Indent",
        link: "/PatientIndent",
      },
      {
        key: "IndentIssue",
        icon: "GoDotFill",
        title: "Indent Issue",
        link: "/IndentIssue",
      },
      {
        key: "UrgentIssue",
        icon: "GoDotFill",
        title: "Urgent Issue",
        link: "/UrgentIssue",
      },
      {
        key: "PatientIssue",
        icon: "GoDotFill",
        title: "Patient Issue",
        link: "/PatientIssue",
      },
      {
        key: "PatientConsumption",
        icon: "GoDotFill",
        title: "PatientConsumption",
        link: "/PatientConsumption",
      },
      {
        key: "ItemReceipt",
        icon: "GoDotFill",
        title: "Item Receipt",
        link: "/ItemReceipt",
      },
      {
        key: "StoreConsumption",
        icon: "GoDotFill",
        title: "Store Consumption",
        link: "/StoreConsumption",
      },
      {
        key: "OpeningStock",
        icon: "GoDotFill",
        title: "Opening Stock",
        link: "/OpeningStock",
      },
      {
        key: "VendorReturn",
        icon: "GoDotFill",
        title: "Vendor Return",
        link: "/VendorReturn",
      },
      {
        key: "StoreReturn",
        icon: "GoDotFill",
        title: "Store Return",
        link: "/StoreReturn",
      },
      {
        key: "AcknowledgeReturn",
        icon: "GoDotFill",
        title: "Acknowledge Return",
        link: "/AcknowledgeReturn",
      },
      {
        key: "MedicalReturn",
        icon: "GoDotFill",
        title: "Medical Return",
        link: "/MedicalReturn",
      },
      {
        key: "StockExpiry",
        icon: "GoDotFill",
        title: "Stock Expiry",
        link: "/StockExpiry",
      },
    ],
  },
];
