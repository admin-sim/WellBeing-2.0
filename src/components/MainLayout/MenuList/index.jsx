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

        title: "Account Management",
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
          {
            key: "PriceTariff",
            icon: "GoDotFill",
            title: "PriceTariff",
            link: "/PriceTariff",
          },
          {
            key: "BillAggrement",
            icon: "GoDotFill",
            title: "BillAggrement",
            link: "/BillAggrement",
          },
          {
            key: "AutoCharge",
            icon: "GoDotFill",
            title: "AutoCharge",
            link: "/AutoCharge",
          },
          {
            key: "ChargeException",
            icon: "GoDotFill",
            title: "ChargeException",
            link: "/ChargeException",
          },
          {
            key: "AdditionalCharge",
            icon: "GoDotFill",
            title: "AdditionalCharge",
            link: "/AdditionalCharge",
          },
          {
            key: "AccomodationCharge",
            icon: "GoDotFill",
            title: "AccomodationCharge",
            link: "/AccomodationCharge",
          },
          {
            key: "ReccuringCharge",
            icon: "GoDotFill",
            title: "ReccuringCharge",
            link: "/ReccuringCharge",
          },
        ],
      },
      {
        key: "MastersResourceScheduling",
        icon: "CiSettings",
        title: "Resource Scheduling",
        children: [
          {
            key: "ScheduleTemplate",
            icon: "GoDotFill",
            title: "Schedule Template",
            link: "/ScheduleTemplate",
          },
          {
            key: "ProviderSchedule",
            icon: "GoDotFill",
            title: "Provider Schedule",
            link: "/ProviderSchedule",
          },
          {
            key: "PublishCalender",
            icon: "GoDotFill",
            title: "Publish Calender",
            link: "/PublishCalender",
          },
          {
            key: "ProviderAbsence",
            icon: "GoDotFill",
            title: "Provider Absence",
            link: "/ProviderAbsence",
          },
          {
            key: "SpecialEvent",
            icon: "GoDotFill",
            title: "Special Event",
            link: "/SpecialEvent",
          },
          {
            key: "Holiday",
            icon: "GoDotFill",
            title: "Holiday",
            link: "/Holiday",
          },
        ],
      },
      {
        key: "Inventorymanagement",
        icon: "CiSettings",
        title: "Inventory Management",
        children: [
          {
            key: "Vendor",
            icon: "GoDotFill",
            title: "Vendor",
            link: "/Vendor",
          },
          {
            key: "ProductClassification",
            icon: "GoDotFill",
            title: "Product Classification",
            link: "/ProductClassification",
          },
          {
            key: "ProductDefinition",
            icon: "GoDotFill",
            title: "Product Definition",
            link: "/ProductDefinition",
          },
          {
            key: "Store",
            icon: "GoDotFill",
            title: "Store",
            link: "/Store",
          },
          {
            key: "FacilityProductPriceDefinition",
            icon: "GoDotFill",
            title: "FacilityProduct PriceDefinition",
            link: "/FacilityProductPriceDefinition",
          },
        ],
      },
      {
        key: "LaboratoryManagement",
        icon: "MdInventory",
        title: "Laboratory Management",
        children: [
          {
            key: "SubTestMapping",
            icon: "GoDotFill",
            title: "SubTest Mapping",
            link: "/SubTestMapping",
          },
          {
            key: "TestMethods",
            icon: "GoDotFill",
            title: "Test Methods",
            link: "/TestMethods",
          },
          {
            key: "TestReferences",
            icon: "GoDotFill",
            title: "Test References",
            link: "/TestReferences",
          },
          {
            key: "ContainerDefinitions",
            icon: "GoDotFill",
            title: "Container Definitions",
            link: "/ContainerDefinitions",
          },
          {
            key: "LabReportDefinitions",
            icon: "GoDotFill",
            title: "LabReport Definitions",
            link: "/LabReportDefinitions",
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
    key: "Account",
    icon: "ExperimentOutlined",
    title: "AccountManagement",
    children: [
      {
        key: "Billing",
        icons: "FaUserFriends",
        title: "Billing",
        link: "Billing",
      },
    ],
  },
  {
    key: "ResourceScheduling",
    icon: "GrSchedule",
    title: "Resource Scheduling",
    children: [
      {
        key: "ManageAppointment",
        icons: "FaUserFriends",
        title: "Manage Appointment",
        link: "ManageAppointment",
      },
      {
        key: "ProviderAppointment",
        icons: "FaUserFriends",
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
        key: "InPatient",
        icons: "FaUserFriends",
        title: "InPatient Management",
        link: "WardManagement",
      },
      {
        key: "Bed",
        icons: "FaUserFriends",
        title: "Bed Manager",
        link: "BedManager",
      },
      {
        key: "Discharge",
        icons: "FaUserFriends",
        title: "Discharge Clearance",
        link: "DischargeClearance",
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
