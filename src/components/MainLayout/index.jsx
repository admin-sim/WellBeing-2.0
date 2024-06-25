import {
  Button,
  Layout,
  Menu,
  theme,
  Drawer,
  Space,
  Badge,
  Popover,
  Avatar,
  Divider,
  List,
  notification,
} from "antd";
import { jwtDecode } from "jwt-decode";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import MenuList from "./MenuList/index.jsx";
import { useEffect, useRef, useState } from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BellOutlined,
  RightOutlined,
  LeftOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Logo from "./logo.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import Logo1 from "../../assets/smileslogo.png";
import { isBrowser } from "react-device-detect";
import LogoMobile from "./LogoMobile.jsx";
import LogoDrawer from "./LogoDrawer.jsx";
import Cookies from "js-cookie";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
// import { useSelector } from "react-redux";
const { Header, Sider, Content } = Layout;
const notificationData = [
  "AMC due on 01/03/2024 for ABC Hospital",
  "Client XYZ successfully onboarded",
  "Visit Scheduled for PQY Hospital on 02/03/2024",
];

function MainLayout() {
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  // const userContext = JSON.parse(localStorage.getItem("userContext"));
  //useSelector((state) => state.userContext.value);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(
    getSessionTimeRemaining()
  );

  useEffect(() => {
    // Update session time remaining every second
    const interval = setInterval(() => {
      setSessionTimeRemaining(getSessionTimeRemaining());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function getSessionTimeRemaining() {
    const token = Cookies.get("authToken");

    if (!token) return "Session expired";

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp > currentTime) {
      const timeRemaining = decodedToken.exp - currentTime;

      const hours = Math.floor(timeRemaining / 3600);
      const minutes = Math.floor((timeRemaining % 3600) / 60);
      const seconds = Math.round(timeRemaining % 60);

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      notification.warning({
        message: "Session Expired, Please LogIn",
        duration: 10,
        placement: "topRight",
      });
      navigate("/login");
    }
  }

  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);

  const [userOpen, setUserOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleUserOpenChange = (newOpen) => {
    setUserOpen(newOpen);
  };
  const handleNotificationOpen = (open) => {
    setNotificationOpen(open);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  function logout() {
    Cookies.remove("authToken");
    navigate("/login");
  }
  const FullScreenRef = useRef(null);

  // const enterFullscreen = () => {
  //   const elem = FullScreenRef.current;

  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen();
  //   } else if (elem.mozRequestFullScreen) {
  //     // Firefox
  //     elem.mozRequestFullScreen();
  //   } else if (elem.webkitRequestFullscreen) {
  //     // Chrome, Safari, and Opera
  //     elem.webkitRequestFullscreen();
  //   }
  // };

  // const exitFullscreen = () => {
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen();
  //   } else if (document.mozCancelFullScreen) {
  //     // Firefox
  //     document.mozCancelFullScreen();
  //   } else if (document.webkitExitFullscreen) {
  //     // Chrome, Safari, and Opera
  //     document.webkitExitFullscreen();
  //   }
  // };

  // const handleFullscreen = () => {
  //   if (!document.fullscreenElement) {
  //     setIsFullScreen(true);
  //     enterFullscreen();
  //   } else {
  //     setIsFullScreen(false);
  //     exitFullscreen();
  //   }
  // };

  const headerItems = [
    // {
    //   key: 4,
    //   label: (
    //     <Button onClick={handleFullscreen}>
    //       {isFullScreen ? (
    //         <AiOutlineFullscreenExit style={{ fontSize: "1.5rem" }} />
    //       ) : (
    //         <AiOutlineFullscreen style={{ fontSize: "1.5rem" }} />
    //       )}
    //     </Button>
    //   ),
    //   selectable: "false",
    // },
    {
      key: 3, // Ensure this key is different from other keys
      label: (
        <div
          style={{
            paddingTop: "0px",
            borderRadius: "15px",
            width: "auto",
            boxShadow: "0 1px 2px 0 rgba(1, 1, 1, 0.4)",
            // height: "50px",
            textAlign: "center",
            background: "#f1f1f1",
            marginTop: "-3.12rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                backgroundColor: "#368CF9",
                color: "white",
                fontWeight: 600,
                fontSize: "20px",
                borderRadius: "10px",
                padding: "0 10px",
              }}
            >
              {sessionTimeRemaining}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 1,
      label: (
        <Popover
          content={
            <>
              <List
                size="small"
                // header={<div>Header</div>}
                footer={
                  <a style={{ display: "flex", justifyContent: "end" }}>
                    <IoCheckmarkDoneSharp
                      style={{
                        fontSize: "1.1rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    />
                    Mark All As Read
                  </a>
                }
                // bordered
                dataSource={notificationData}
                renderItem={(item) => (
                  <ul style={{ padding: "0", listStyleType: "square" }}>
                    <List.Item>
                      <li>{item}</li>
                    </List.Item>
                  </ul>
                )}
              />
            </>
          }
          // title="Title"
          trigger="click"
          open={notificationOpen}
          onOpenChange={handleNotificationOpen}
        >
          <Space>
            <Badge count={notificationData.length}>
              <BellOutlined style={{ fontSize: "1.1rem" }} />
            </Badge>
            <span style={{ fontSize: "1rem" }}>Notifications</span>
            <DownOutlined />
          </Space>
        </Popover>
      ),
    },
    {
      key: 2,
      label: (
        <Popover
          content={
            <>
              <Space.Compact direction="vertical">
                <Button
                  type="text"
                  style={{ width: "100%", textAlign: "left" }}
                >
                  <UserOutlined />
                  My Profile
                </Button>
                <Button type="text" style={{ width: "100%" }}>
                  <SettingOutlined />
                  Change Password
                </Button>
                <Divider style={{ margin: "0" }} />
                <Button
                  type="text"
                  onClick={logout}
                  style={{ width: "100%", textAlign: "left" }}
                >
                  <LogoutOutlined />
                  Logout
                </Button>
              </Space.Compact>
            </>
          }
          // title="Title"
          trigger="click"
          open={userOpen}
          onOpenChange={handleUserOpenChange}
        >
          <Space>
            <Avatar
              style={{
                backgroundColor: "#87d068",
              }}
              icon={<UserOutlined />}
            />
            <span style={{ fontSize: "1rem" }}>
              Hi, Admin
              {/* {userContext === null || userContext.AppUserName === undefined
                ? ""
                : userContext.AppUserName} */}
            </span>
            <DownOutlined />
          </Space>
        </Popover>
      ),
      // onClick: logout,
    },
  ];
  const headerItemsMobile = [
    {
      key: 1,
      label: (
        <Popover
          content={
            <>
              <List
                size="small"
                // header={<div>Header</div>}
                footer={
                  <a style={{ display: "flex", justifyContent: "end" }}>
                    <IoCheckmarkDoneSharp
                      style={{
                        fontSize: "1.1rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    />
                    Mark All As Read
                  </a>
                }
                // bordered
                dataSource={notificationData}
                renderItem={(item) => (
                  <ul style={{ padding: "0", listStyleType: "square" }}>
                    <List.Item>
                      <li>{item}</li>
                    </List.Item>
                  </ul>
                )}
              />
            </>
          }
          title="Notifications"
          trigger="click"
          open={notificationOpen}
          onOpenChange={handleNotificationOpen}
        >
          <Space style={{ marginTop: "0.3em" }}>
            <Badge count={notificationData.length}>
              <BellOutlined style={{ fontSize: "1.5rem" }} />
            </Badge>
          </Space>
        </Popover>
      ),
    },
    {
      key: 2,
      label: (
        <Popover
          content={
            <>
              <Space.Compact
                direction="vertical"
                style={{ display: "flex", alignItems: "flex-start" }}
              >
                <Button
                  type="text"
                  style={{ width: "100%", textAlign: "left" }}
                >
                  <UserOutlined />
                  My Profile
                </Button>
                <Button type="text" style={{ width: "100%" }}>
                  <SettingOutlined />
                  Change Password
                </Button>
                <Divider style={{ margin: "0" }} />
                <Button
                  type="text"
                  onClick={logout}
                  style={{ width: "100%", textAlign: "left" }}
                >
                  <LogoutOutlined />
                  Logout
                </Button>
              </Space.Compact>
            </>
          }
          // title="Title"
          trigger="click"
          open={userOpen}
          onOpenChange={handleUserOpenChange}
        >
          <Space>
            <Avatar
              style={{
                backgroundColor: "#87d068",
              }}
              icon={<UserOutlined />}
            />
            {/* <span style={{ fontSize: "1rem" }}>
                Hi,{" "}
                {userContext === null || userContext.AppUserName === undefined
                  ? ""
                  : userContext.AppUserName}
              </span> */}
            <DownOutlined />
          </Space>
        </Popover>
      ),
    },
  ];

  return isBrowser ? (
    <Layout style={{ minHeight: "100vh" }} ref={FullScreenRef}>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        className="sidebar"
        theme="light"
        width={230}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          zIndex: 2,
        }}
      >
        {collapsed ? (
          <img
            src={Logo1}
            height={30}
            width={"auto"}
            style={{ marginTop: "1rem", marginLeft: "1rem" }}
          />
        ) : (
          <Logo />
        )}
        <MenuList theme="light" />
      </Sider>
      <Layout
        className="site-layout"
        style={{ marginLeft: collapsed ? 80 : 230 }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center", // Ensures content is centered vertically
            height: "3rem", // Adjust height as needed
          }}
        >
          <Button
            className="toggle"
            onClick={() => setCollapsed(!collapsed)}
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{ height: "3rem", lineHeight: "3rem", width: "3rem" }} // Match button height to header
          />
          <Menu
            theme="light"
            mode="horizontal"
            items={headerItems}
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              justifyContent: "flex-end",
              padding: "0 3rem",
              fontSize: "1rem",
              height: "3rem", // Match menu height to header
              lineHeight: "3rem", // Center menu items vertically
            }}
          />
        </Header>

        <Content
          style={{
            margin: "0.5rem 0.5rem",
            padding: "0rem",
            // minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  ) : (
    <Layout style={{ minHeight: "100vh" }}>
      <Drawer
        placement="left"
        title={<LogoDrawer />}
        onClose={onClose}
        open={visible}
        width={"min-content"}
        // mask={true}
        // Add a close button to the drawer
        closeIcon={
          <Button
            onClick={onClose}
            size="large"
            style={{
              position: "absolute",
              right: "-1rem",
              borderRadius: "50%",
            }}
            icon={visible ? <LeftOutlined /> : <RightOutlined />}
          />
        }
      >
        <div style={{ marginTop: "-3rem" }}>
          <MenuList theme="light" onClick={onClose} />
        </div>
      </Drawer>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              type="default"
              onClick={showDrawer}
              style={{
                fontSize: "1rem",
                height: "2rem",
              }}
            >
              <MenuUnfoldOutlined />
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LogoMobile />
          </div>
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={["0"]}
            items={headerItemsMobile}
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              justifyContent: "flex-end",
              padding: "0 0.5rem",
              fontSize: "1rem",
            }}
          />
        </Header>
        <Content
          style={{
            margin: "1rem 1rem",
            padding: "0rem",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
