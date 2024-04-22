import React from "react";
import MenuList from "./MenuListMap";

// import { useSelector } from "react-redux";

export default function MenuList1(onClose) {
  // const menuItems = useSelector((state) => state.LeftMenuItems.value);
  return <MenuList menuData={menuData} onClose={onClose} />;
}

const menuData = [
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
    ],
  },
  {
    key: "Lab",
    icon: "FaUserFriends",
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
  // {
  //   key: "client",
  //   icon: <TeamOutlined style={{ fontSize: "1.5rem" }} />,
  //   title: "Client",
  //   link: "/client",
  // },
  // {
  //   key: "employee",
  //   icon: <UserOutlined style={{ fontSize: "1.5rem" }} />,
  //   title: "Employee",
  //   link: "/employee",
  // },
  // {
  //   key: "implementation",
  //   icon: <CodepenOutlined style={{ fontSize: "1.5rem" }} />,
  //   title: "Implementation",
  //   link: "/implementation",
  // },
  // {
  //   key: "collection",
  //   icon: <UserOutlined style={{ fontSize: "1.5rem" }} />,
  //   title: "Collection",
  //   link: "/collection",
  // },
  // {
  //   key: "amc",
  //   icon: <UserOutlined style={{ fontSize: "1.5rem" }} />,
  //   title: "AMC",
  //   link: "/amc",
  // },
];
