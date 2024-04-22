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
        ]
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
        key: "purchaseOrder",
        icon: "GoDotFill",
        title: "Purchase Order",
        link: "/PurchaseOrder",
      },
    ],
  },
];
