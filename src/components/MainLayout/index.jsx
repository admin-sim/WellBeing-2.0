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
  Switch,
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
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";
import Logo from "./logo.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import Logo1 from "../../assets/smileslogo.png";
import { isBrowser } from "react-device-detect";
import LogoMobile from "./LogoMobile.jsx";
import LogoDrawer from "./LogoDrawer.jsx";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { persistStore } from "redux-persist";
import { store } from "../../ReduxStore/store.js";
import { updateTabAccessData } from "../../ReduxStore/features/TabAccessData.js";
import { updateUserContext } from "../../ReduxStore/features/userContext.js";
import { update } from "../../ReduxStore/features/LeftMenuItemSlice.js";
const { Header, Sider, Content } = Layout;

function MainLayout() {
  const navigate = useNavigate();
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(
    getSessionTimeRemaining()
  );
  const persistor = persistStore(store);
  const dispatch = useDispatch();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const userContext = useSelector((state) => state.userContext.value);

  // Theme state: 'light', 'dark', or 'default'
  const [themeMode, setThemeMode] = useState('light');

  // Cycle theme function
  const toggleTheme = () => {
    let nextTheme;
    if (themeMode === 'light') nextTheme = 'dark';
    else if (themeMode === 'dark') nextTheme = 'default';
    else nextTheme = 'light';

    setThemeMode(nextTheme);

    // Remove all theme classes
    document.body.classList.remove('light-theme', 'dark-theme', 'default-theme');
    // Add the new theme class
    document.body.classList.add(`${nextTheme}-theme`);

    // Store preference
    localStorage.setItem('theme', nextTheme);
  };

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setThemeMode(savedTheme);
    document.body.classList.remove('light-theme', 'dark-theme', 'default-theme');
    document.body.classList.add(`${savedTheme}-theme`);
  }, []);

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

    if (!token) {
      navigate("/login");
      return "Session expired";
    }

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

  const handleUserOpenChange = (newOpen) => {
    setUserOpen(newOpen);
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
    dispatch(updateTabAccessData({}));
    dispatch(updateUserContext({}));
    dispatch(update({}));
    persistor.purge();
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
    {
      key: 4,
      label: (
        <Popover
          content={
            <>
              <Space.Compact direction="vertical" style={{ width: "200px" }}>
                <Button
                  type="text"
                  onClick={toggleTheme}
                  icon={
                    themeMode === 'dark'
                      ? <BulbFilled style={{ color: '#faad14' }} />
                      : themeMode === 'default'
                        ? <SettingOutlined />
                        : <BulbOutlined />
                  }
                  style={{
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  {themeMode === 'light'
                    ? "Dark Mode"
                    : themeMode === 'dark'
                      ? "Default Theme"
                      : "Light Mode"}
                </Button>
                <Button
                  type="text"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  App Settings
                </Button>
                <Button
                  type="text"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  TIME SETTING
                </Button>
              </Space.Compact>
            </>
          }
          trigger="click"
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<SettingOutlined style={{ fontSize: '20px' }} />}
            style={{
              marginRight: '10px',
              border: 'none',
              background: 'transparent',
              boxShadow: 'none',
              padding: 0
            }}
          />
        </Popover>
      ),
    },
    {
      key: 3,
      label: (
        <div
          style={{
            paddingTop: "0px",
            borderRadius: "15px",
            width: "auto",
            boxShadow: "0 1px 2px 0 rgba(1, 1, 1, 0.4)",
            textAlign: "center",
            background: "transparent", // Changed to transparent
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
                backgroundColor: "#df0d0d",
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
      key: 2,
      label: (
        <Popover
          content={
            <>
              <Space.Compact direction="vertical">
                <Button
                  type="text"
                  style={{
                    width: "100%",
                    justifyContent: "start",
                    backgroundColor: "#1890ff",
                    color: "white",
                  }}
                  icon={<UserOutlined />}
                >
                  My Profile
                </Button>
                <Button
                   type="text"
                   style={{ width: "100%", justifyContent: "start",backgroundColor: "#1890ff" ,color: "white"  }}
                   icon={<UserOutlined />}
                >
                  Change Password
                </Button>
                <Divider style={{ margin: "0" }} />
                <Button
                  type="text"
                  onClick={logout}
                  style={{ width: "100%", justifyContent: "start",backgroundColor: "red" , color: "white" }}
                  icon={<LogoutOutlined />}
                >
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
              {/* Hi,{" "} */}
              {userContext === null || userContext.AppUserName === undefined
                ? ""
                : userContext.AppUserName}
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
      key: 2,
      label: (
        <Popover
          content={
            <>
              <Space.Compact
                size="small"
                direction="vertical"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="text"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#1890ff",
                    justifyContent: "start",
                  }}
                >
                  <UserOutlined />
                  My Profile
                </Button>
                <Button
                  type="text"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#1890ff",
                    justifyContent: "start",
                  }}
                >
                  <SettingOutlined />
                  Change Password
                </Button>
                <Divider style={{ margin: "0" }} />
                <Button
                  type="text"
                  onClick={logout}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#1890ff",
                    justifyContent: "start",
                  
                  }}
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
              {/* Hi,{" "} */}
              {userContext === null || userContext.AppUserName === undefined
                ? ""
                : userContext.AppUserName}
            </span>
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
            border: "2px solid #4a90e2",  // Adding blue border
            borderRadius: "16px",         // Rounded corners
            overflow: "hidden"            // Ensures content doesn't overflow the border
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
              className="dfja"
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
              alignItems: "center",
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


//--- old code snippet for MainLayout.jsx ---
// import {
//   Button,
//   Layout,
//   Menu,
//   theme,
//   Drawer,
//   Space,
//   Badge,
//   Popover,
//   Avatar,
//   Divider,
//   List,
//   notification,
// } from "antd";
// import { jwtDecode } from "jwt-decode";
// import { IoCheckmarkDoneSharp } from "react-icons/io5";
// import MenuList from "./MenuList/index.jsx";
// import { useEffect, useRef, useState } from "react";
// import {
//   MenuUnfoldOutlined,
//   MenuFoldOutlined,
//   UserOutlined,
//   BellOutlined,
//   RightOutlined,
//   LeftOutlined,
//   DownOutlined,
//   LogoutOutlined,
//   SettingOutlined,
// } from "@ant-design/icons";
// import Logo from "./logo.jsx";
// import { Outlet, useNavigate } from "react-router-dom";
// import Logo1 from "../../assets/smileslogo.png";
// import { isBrowser } from "react-device-detect";
// import LogoMobile from "./LogoMobile.jsx";
// import LogoDrawer from "./LogoDrawer.jsx";
// import Cookies from "js-cookie";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import { persistStore } from "redux-persist";
// import { store } from "../../ReduxStore/store.js";
// import { updateTabAccessData } from "../../ReduxStore/features/TabAccessData.js";
// import { updateUserContext } from "../../ReduxStore/features/userContext.js";
// import { update } from "../../ReduxStore/features/LeftMenuItemSlice.js";
// const { Header, Sider, Content } = Layout;

// function MainLayout() {
//   const navigate = useNavigate();
//   // const userContext = JSON.parse(localStorage.getItem("userContext"));
//   //useSelector((state) => state.userContext.value);
//   const [sessionTimeRemaining, setSessionTimeRemaining] = useState(
//     getSessionTimeRemaining()
//   );
//   const persistor = persistStore(store);
//   const dispatch = useDispatch();

//   const userContext = useSelector((state) => state.userContext.value);

//   useEffect(() => {
//     // Update session time remaining every second
//     const interval = setInterval(() => {
//       setSessionTimeRemaining(getSessionTimeRemaining());
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   function getSessionTimeRemaining() {
//     const token = Cookies.get("authToken");

//     if (!token) {
//       navigate("/login");
//       return "Session expired";
//     }

//     const decodedToken = jwtDecode(token);
//     const currentTime = Date.now() / 1000;

//     if (decodedToken.exp > currentTime) {
//       const timeRemaining = decodedToken.exp - currentTime;

//       const hours = Math.floor(timeRemaining / 3600);
//       const minutes = Math.floor((timeRemaining % 3600) / 60);
//       const seconds = Math.round(timeRemaining % 60);

//       return `${hours.toString().padStart(2, "0")}:${minutes
//         .toString()
//         .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
//     } else {
//       notification.warning({
//         message: "Session Expired, Please LogIn",
//         duration: 10,
//         placement: "topRight",
//       });
//       navigate("/login");
//     }
//   }

//   const [collapsed, setCollapsed] = useState(false);
//   const [visible, setVisible] = useState(false);

//   const [userOpen, setUserOpen] = useState(false);

//   const handleUserOpenChange = (newOpen) => {
//     setUserOpen(newOpen);
//   };

//   const showDrawer = () => {
//     setVisible(true);
//   };

//   const onClose = () => {
//     setVisible(false);
//   };

//   const {
//     token: { colorBgContainer },
//   } = theme.useToken();

//   function logout() {
//     Cookies.remove("authToken");
//     dispatch(updateTabAccessData({}));
//     dispatch(updateUserContext({}));
//     dispatch(update({}));
//     persistor.purge();
//     navigate("/login");
//   }
//   const FullScreenRef = useRef(null);

//   // const enterFullscreen = () => {
//   //   const elem = FullScreenRef.current;

//   //   if (elem.requestFullscreen) {
//   //     elem.requestFullscreen();
//   //   } else if (elem.mozRequestFullScreen) {
//   //     // Firefox
//   //     elem.mozRequestFullScreen();
//   //   } else if (elem.webkitRequestFullscreen) {
//   //     // Chrome, Safari, and Opera
//   //     elem.webkitRequestFullscreen();
//   //   }
//   // };

//   // const exitFullscreen = () => {
//   //   if (document.exitFullscreen) {
//   //     document.exitFullscreen();
//   //   } else if (document.mozCancelFullScreen) {
//   //     // Firefox
//   //     document.mozCancelFullScreen();
//   //   } else if (document.webkitExitFullscreen) {
//   //     // Chrome, Safari, and Opera
//   //     document.webkitExitFullscreen();
//   //   }
//   // };

//   // const handleFullscreen = () => {
//   //   if (!document.fullscreenElement) {
//   //     setIsFullScreen(true);
//   //     enterFullscreen();
//   //   } else {
//   //     setIsFullScreen(false);
//   //     exitFullscreen();
//   //   }
//   // };

//   const headerItems = [
//     // {
//     //   key: 4,
//     //   label: (
//     //     <Button onClick={handleFullscreen}>
//     //       {isFullScreen ? (
//     //         <AiOutlineFullscreenExit style={{ fontSize: "1.5rem" }} />
//     //       ) : (
//     //         <AiOutlineFullscreen style={{ fontSize: "1.5rem" }} />
//     //       )}
//     //     </Button>
//     //   ),
//     //   selectable: "false",
//     // },
//     {
//       key: 3, // Ensure this key is different from other keys
//       label: (
//         <div
//           style={{
//             paddingTop: "0px",
//             borderRadius: "15px",
//             width: "auto",
//             boxShadow: "0 1px 2px 0 rgba(1, 1, 1, 0.4)",
//             // height: "50px",
//             textAlign: "center",
//             background: "#f1f1f1",
//             marginTop: "-3.12rem",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               flexDirection: "column",
//             }}
//           >
//             <span
//               style={{
//                 textAlign: "center",
//                 textTransform: "uppercase",
//                 letterSpacing: "1.5px",
//                 backgroundColor: "#368CF9",
//                 color: "white",
//                 fontWeight: 600,
//                 fontSize: "20px",
//                 borderRadius: "10px",
//                 padding: "0 10px",
//               }}
//             >
//               {sessionTimeRemaining}
//             </span>
//           </div>
//         </div>
//       ),
//     },

//     {
//       key: 2,
//       label: (
//         <Popover
//           content={
//             <>
//               <Space.Compact direction="vertical">
//                 <Button
//                   type="text"
//                   style={{
//                     width: "100%",
//                     justifyContent: "start",
//                   }}
//                   icon={<UserOutlined />}
//                 >
//                   My Profile
//                 </Button>
//                 <Button
//                   type="text"
//                   style={{ width: "100%", justifyContent: "start" }}
//                   icon={<SettingOutlined />}
//                 >
//                   Change Password
//                 </Button>
//                 <Divider style={{ margin: "0" }} />
//                 <Button
//                   type="text"
//                   onClick={logout}
//                   style={{ width: "100%", justifyContent: "start" }}
//                   icon={<LogoutOutlined />}
//                 >
//                   Logout
//                 </Button>
//               </Space.Compact>
//             </>
//           }
//           // title="Title"
//           trigger="click"
//           open={userOpen}
//           onOpenChange={handleUserOpenChange}
//         >
//           <Space>
//             <Avatar
//               style={{
//                 backgroundColor: "#87d068",
//               }}
//               icon={<UserOutlined />}
//             />
//             <span style={{ fontSize: "1rem" }}>
//               {/* Hi,{" "} */}
//               {userContext === null || userContext.AppUserName === undefined
//                 ? ""
//                 : userContext.AppUserName}
//             </span>
//             <DownOutlined />
//           </Space>
//         </Popover>
//       ),
//       // onClick: logout,
//     },
//   ];
//   const headerItemsMobile = [
//     {
//       key: 2,
//       label: (
//         <Popover
//           content={
//             <>
//               <Space.Compact
//                 size="small"
//                 direction="vertical"
//                 style={{
//                   width: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Button
//                   type="text"
//                   style={{
//                     width: "100%",
//                     textAlign: "left",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "start",
//                   }}
//                 >
//                   <UserOutlined />
//                   My Profile
//                 </Button>
//                 <Button
//                   type="text"
//                   style={{
//                     width: "100%",
//                     textAlign: "left",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "start",
//                   }}
//                 >
//                   <SettingOutlined />
//                   Change Password
//                 </Button>
//                 <Divider style={{ margin: "0" }} />
//                 <Button
//                   type="text"
//                   onClick={logout}
//                   style={{
//                     width: "100%",
//                     textAlign: "left",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "start",
//                   }}
//                 >
//                   <LogoutOutlined />
//                   Logout
//                 </Button>
//               </Space.Compact>
//             </>
//           }
//           // title="Title"
//           trigger="click"
//           open={userOpen}
//           onOpenChange={handleUserOpenChange}
//         >
//           <Space>
//             <Avatar
//               style={{
//                 backgroundColor: "#87d068",
//               }}
//               icon={<UserOutlined />}
//             />
//             <span style={{ fontSize: "1rem" }}>
//               {/* Hi,{" "} */}
//               {userContext === null || userContext.AppUserName === undefined
//                 ? ""
//                 : userContext.AppUserName}
//             </span>
//             <DownOutlined />
//           </Space>
//         </Popover>
//       ),
//     },
//   ];

//   return isBrowser ? (
//     <Layout style={{ minHeight: "100vh" }} ref={FullScreenRef}>
//       <Sider
//         collapsed={collapsed}
//         collapsible
//         trigger={null}
//         className="sidebar"
//         theme="light"
//         width={230}
//         style={{
//           overflow: "auto",
//           height: "100vh",
//           position: "fixed",
//           zIndex: 2,
//         }}
//       >
//         {collapsed ? (
//           <img
//             src={Logo1}
//             height={30}
//             width={"auto"}
//             style={{ marginTop: "1rem", marginLeft: "1rem" }}
//           />
//         ) : (
//           <Logo />
//         )}
//         <MenuList theme="light" />
//       </Sider>
//       <Layout
//         className="site-layout"
//         style={{ marginLeft: collapsed ? 80 : 230 }}
//       >
//         <Header
//           style={{
//             padding: 0,
//             background: colorBgContainer,
//             display: "flex",
//             alignItems: "center", // Ensures content is centered vertically
//             height: "3rem", // Adjust height as needed
//           }}
//         >
//           <Button
//             className="toggle"
//             onClick={() => setCollapsed(!collapsed)}
//             type="text"
//             icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//             style={{ height: "3rem", lineHeight: "3rem", width: "3rem" }} // Match button height to header
//           />
//           <Menu
//             theme="light"
//             mode="horizontal"
//             items={headerItems}
//             style={{
//               flex: 1,
//               minWidth: 0,
//               display: "flex",
//               justifyContent: "flex-end",
//               padding: "0 3rem",
//               fontSize: "1rem",
//               height: "3rem", // Match menu height to header
//               lineHeight: "3rem", // Center menu items vertically
//             }}
//           />
//         </Header>

//         <Content
//           style={{
//             margin: "0.5rem 0.5rem",
//             padding: "0rem",
//             // minHeight: 280,
//           }}
//         >
//           <Outlet />
//         </Content>
//       </Layout>
//     </Layout>
//   ) : (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Drawer
//         placement="left"
//         title={<LogoDrawer />}
//         onClose={onClose}
//         open={visible}
//         width={"min-content"}
//         // mask={true}
//         // Add a close button to the drawer
//         closeIcon={
//           <Button
//             onClick={onClose}
//             size="large"
//             style={{
//               position: "absolute",
//               right: "-1rem",
//               borderRadius: "50%",
//             }}
//             icon={visible ? <LeftOutlined /> : <RightOutlined />}
//           />
//         }
//       >
//         <div style={{ marginTop: "-3rem" }}>
//           <MenuList theme="light" onClick={onClose} />
//         </div>
//       </Drawer>
//       <Layout className="site-layout">
//         <Header
//           style={{
//             padding: 0,
//             background: colorBgContainer,
//             display: "flex",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Button
//               type="default"
//               onClick={showDrawer}
//               className="dfja"
//               style={{
//                 fontSize: "1rem",
//                 height: "2rem",
//               }}
//             >
//               <MenuUnfoldOutlined />
//             </Button>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <LogoMobile />
//           </div>
//           <Menu
//             theme="light"
//             mode="horizontal"
//             defaultSelectedKeys={["0"]}
//             items={headerItemsMobile}
//             style={{
//               flex: 1,
//               minWidth: 0,
//               display: "flex",
//               justifyContent: "flex-end",
//               padding: "0 0.5rem",
//               fontSize: "1rem",
//               alignItems: "center",
//             }}
//           />
//         </Header>
//         <Content
//           style={{
//             margin: "1rem 1rem",
//             padding: "0rem",
//           }}
//         >
//           <Outlet />
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }

// export default MainLayout;
