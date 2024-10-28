import { Menu } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";
import {
  SettingOutlined,
  TeamOutlined,
  CodepenOutlined,
  DollarOutlined,
  RedEnvelopeOutlined,
  ScheduleOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { RiSettingsFill } from "react-icons/ri";
import { FaClipboardUser, FaFlaskVial } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { FaUserFriends, FaUserPlus } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import {
  MdInventory,
  MdManageHistory,
  MdOutlineInventory2,
} from "react-icons/md";
import { GrSchedule } from "react-icons/gr";
import Bed from "../../../assets/bed.png";
import { GiBed } from "react-icons/gi";
import { FaHospitalUser } from "react-icons/fa";
import { TbCalendarCog, TbReportMoney, TbSettingsPlus } from "react-icons/tb";
const { SubMenu } = Menu;

export default function MenuList({ menuData, onClose }) {
  const getAntIcon = (iconName) => {
    switch (iconName) {
      case "FaUserPlus":
        return <FaUserPlus />;
      case "SettingOutlined":
        return <SettingOutlined />;
      case "FaUserFriends":
        return <FaUserFriends style={{ fontSize: "1.2rem" }} />;
      case "CodepenOutlined":
        return <CodepenOutlined />;
      case "FaHospitalUser":
        return <FaHospitalUser style={{ fontSize: "1.1rem" }} />;
      case "GrSchedule":
        return <GrSchedule />;
      case "bed":
        return <img src={Bed} alt="Ward Management" height="20rem" />;
      case "DollarOutlined":
        return <DollarOutlined />;
      case "RedEnvelopeOutlined":
        return <RedEnvelopeOutlined />;
      case "ScheduleOutlined":
        return <ScheduleOutlined />;
      case "ExperimentOutlined":
        return <ExperimentOutlined />;
      case "CiSettings":
        return <CiSettings />;
      case "MdInventory":
        return <MdInventory />;
      case "TbCalendarCog":
        return <TbCalendarCog style={{ fontSize: "1.2rem" }} />;
      case "TbSettingsPlus":
        return <TbSettingsPlus style={{ fontSize: "1.2rem" }} />;
      case "GiBed":
        return <GiBed style={{ fontSize: "1.3rem" }} />;
      case "RiSettingsFill":
        return <RiSettingsFill style={{ fontSize: "1.1rem" }} />;
      case "TbReportMoney":
        return <TbReportMoney style={{ fontSize: "1.2rem" }} />;
      case "MdManageHistory":
        return <MdManageHistory style={{ fontSize: "1.2rem" }} />;
      case "MdOutlineInventory2":
        return <MdOutlineInventory2 style={{ fontSize: "1.2rem" }} />;
      case "FaFlaskVial":
        return <FaFlaskVial style={{ fontSize: "1.1rem" }} />;
      case "FaClipboardUser":
        return <FaClipboardUser style={{ fontSize: "1.1rem" }} />;
      default:
        return <GoDotFill style={{ fontSize: "0.7rem" }} />;
    }
  };

  // Function to check if an item or any of its descendants have AccessStatus set to true
  const hasAccess = (item) => {
    if (item.AccessStatus) {
      return true;
    }
    if (item.children?.length > 0) {
      return item.children.some(hasAccess);
    }
    return false;
  };

  const renderMenuItems = (items) => {
    return items
      ?.map((item) => {
        // Render the item only if it or any of its descendants have AccessStatus set to true
        // if (!hasAccess(item)) {
        //   return null;
        // }

        if (item.children?.length > 0) {
          return (
            <SubMenu
              style={{ paddingLeft: "0px" }}
              key={item.key}
              icon={getAntIcon(item.icon)}
              title={item?.title}
            >
              {renderMenuItems(item.children)}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item
              key={item.key}
              title={item.title}
              icon={getAntIcon(item.icon)}
              onClick={() => {
                // onClose.onClick();
              }}
            >
              <NavLink to={item.link}>{item.title}</NavLink>
            </Menu.Item>
          );
        }
      })
      .filter(Boolean); // Remove null items
  };

  return (
    <Menu
      theme="light"
      mode="inline"
      className="menu-bar"
      style={{ fontSize: "14px", padding: "0px" }}
    >
      {Object.keys(menuData).length !== 0 && renderMenuItems(menuData)}
    </Menu>
  );
}
