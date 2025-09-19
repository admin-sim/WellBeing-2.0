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
//   Switch,
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
//   BulbOutlined,
//   BulbFilled,
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
//   const [sessionTimeRemaining, setSessionTimeRemaining] = useState(
//     getSessionTimeRemaining()
//   );
//   const persistor = persistStore(store);
//   const dispatch = useDispatch();
//   const [isDarkTheme, setIsDarkTheme] = useState(false);

//   const userContext = useSelector((state) => state.userContext.value);

//   // Theme state: 'light', 'dark', or 'default'
//   const [themeMode, setThemeMode] = useState('light');

//   // Cycle theme function
//   const toggleTheme = () => {
//     let nextTheme;
//     if (themeMode === 'light') nextTheme = 'dark';
//     else if (themeMode === 'dark') nextTheme = 'default';
//     else nextTheme = 'light';

//     setThemeMode(nextTheme);

//     // Remove all theme classes
//     document.body.classList.remove('light-theme', 'dark-theme', 'default-theme');
//     // Add the new theme class
//     document.body.classList.add(`${nextTheme}-theme`);

//     // Store preference
//     localStorage.setItem('theme', nextTheme);
//   };

//   // Load saved theme on mount
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme') || 'light';
//     setThemeMode(savedTheme);
//     document.body.classList.remove('light-theme', 'dark-theme', 'default-theme');
//     document.body.classList.add(`${savedTheme}-theme`);
//   }, []);

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
//     {
//       key: 4,
//       label: (
//         <Popover
//           content={
//             <>
//               <Space.Compact direction="vertical" style={{ width: "200px" }}>
//                 <Button
//                   type="text"
//                   onClick={toggleTheme}
//                   icon={
//                     themeMode === 'dark'
//                       ? <BulbFilled style={{ color: '#faad14' }} />
//                       : themeMode === 'default'
//                         ? <SettingOutlined />
//                         : <BulbOutlined />
//                   }
//                   style={{
//                     width: "100%",
//                     textAlign: "left",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "start",
//                   }}
//                 >
//                   {themeMode === 'light'
//                     ? "Dark Mode"
//                     : themeMode === 'dark'
//                       ? "Default Theme"
//                       : "Light Mode"}
//                 </Button>
//                 {/* <Button
//                   type="text"
//                   style={{
//                     width: "100%",
//                     textAlign: "left",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "start",
//                   }}
//                 >
//                   App Settings
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
//                   TIME SETTING
//                 </Button> */}
//               </Space.Compact>
//             </>
//           }
//           trigger="click"
//           placement="bottomRight"
//         >
//           <Button
//             type="text"
//             icon={<SettingOutlined style={{ fontSize: '20px' }} />}
//             style={{
//               marginRight: '10px',
//               border: 'none',
//               background: 'transparent',
//               boxShadow: 'none',
//               padding: 0
//             }}
//           />
//         </Popover>
//       ),
//     },
//     {
//       key: 3,
//       label: (
//         <div
//           style={{
//             paddingTop: "0px",
//             borderRadius: "15px",
//             width: "auto",
//             boxShadow: "0 1px 2px 0 rgba(1, 1, 1, 0.4)",
//             textAlign: "center",
//             background: "transparent", // Changed to transparent
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
//                 backgroundColor: "#dd731cff",
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
//                     backgroundColor: "#1890ff",
//                     color: "white",
//                   }}
//                   icon={<UserOutlined />}
//                 >
//                   My Profile
//                 </Button>
//                 <Button
//                    type="text"
//                    style={{ width: "100%", justifyContent: "start",backgroundColor: "#1890ff" ,color: "white"  }}
//                    icon={<UserOutlined />}
//                 >
//                   Change Password
//                 </Button>
//                 <Divider style={{ margin: "0" }} />
//                 <Button
//                   type="text"
//                   onClick={logout}
//                   style={{ width: "100%", justifyContent: "start",backgroundColor: "red" , color: "white" }}
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
//                     backgroundColor: "#1890ff",
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
//                     backgroundColor: "#1890ff",
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
//                     backgroundColor: "#1890ff",
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
//             icon={collapsed ? <MenuUnfoldOutlined  style={{fontSize : "20px"}}/> : <MenuFoldOutlined style={{fontSize : "20px"}} />}
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
//             border: "2px solid #4a90e2",  // Adding blue border
//             borderRadius: "16px",         // Rounded corners
//             overflow: "hidden"            // Ensures content doesn't overflow the border
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


// //--- old code snippet for MainLayout.jsx ---
// // import {
// //   Button,
// //   Layout,
// //   Menu,
// //   theme,
// //   Drawer,
// //   Space,
// //   Badge,
// //   Popover,
// //   Avatar,
// //   Divider,
// //   List,
// //   notification,
// // } from "antd";
// // import { jwtDecode } from "jwt-decode";
// // import { IoCheckmarkDoneSharp } from "react-icons/io5";
// // import MenuList from "./MenuList/index.jsx";
// // import { useEffect, useRef, useState } from "react";
// // import {
// //   MenuUnfoldOutlined,
// //   MenuFoldOutlined,
// //   UserOutlined,
// //   BellOutlined,
// //   RightOutlined,
// //   LeftOutlined,
// //   DownOutlined,
// //   LogoutOutlined,
// //   SettingOutlined,
// // } from "@ant-design/icons";
// // import Logo from "./logo.jsx";
// // import { Outlet, useNavigate } from "react-router-dom";
// // import Logo1 from "../../assets/smileslogo.png";
// // import { isBrowser } from "react-device-detect";
// // import LogoMobile from "./LogoMobile.jsx";
// // import LogoDrawer from "./LogoDrawer.jsx";
// // import Cookies from "js-cookie";
// // import { useDispatch } from "react-redux";
// // import { useSelector } from "react-redux";
// // import { persistStore } from "redux-persist";
// // import { store } from "../../ReduxStore/store.js";
// // import { updateTabAccessData } from "../../ReduxStore/features/TabAccessData.js";
// // import { updateUserContext } from "../../ReduxStore/features/userContext.js";
// // import { update } from "../../ReduxStore/features/LeftMenuItemSlice.js";
// // const { Header, Sider, Content } = Layout;

// // function MainLayout() {
// //   const navigate = useNavigate();
// //   // const userContext = JSON.parse(localStorage.getItem("userContext"));
// //   //useSelector((state) => state.userContext.value);
// //   const [sessionTimeRemaining, setSessionTimeRemaining] = useState(
// //     getSessionTimeRemaining()
// //   );
// //   const persistor = persistStore(store);
// //   const dispatch = useDispatch();

// //   const userContext = useSelector((state) => state.userContext.value);

// //   useEffect(() => {
// //     // Update session time remaining every second
// //     const interval = setInterval(() => {
// //       setSessionTimeRemaining(getSessionTimeRemaining());
// //     }, 1000);

// //     return () => {
// //       clearInterval(interval);
// //     };
// //   }, []);

// //   function getSessionTimeRemaining() {
// //     const token = Cookies.get("authToken");

// //     if (!token) {
// //       navigate("/login");
// //       return "Session expired";
// //     }

// //     const decodedToken = jwtDecode(token);
// //     const currentTime = Date.now() / 1000;

// //     if (decodedToken.exp > currentTime) {
// //       const timeRemaining = decodedToken.exp - currentTime;

// //       const hours = Math.floor(timeRemaining / 3600);
// //       const minutes = Math.floor((timeRemaining % 3600) / 60);
// //       const seconds = Math.round(timeRemaining % 60);

// //       return `${hours.toString().padStart(2, "0")}:${minutes
// //         .toString()
// //         .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
// //     } else {
// //       notification.warning({
// //         message: "Session Expired, Please LogIn",
// //         duration: 10,
// //         placement: "topRight",
// //       });
// //       navigate("/login");
// //     }
// //   }

// //   const [collapsed, setCollapsed] = useState(false);
// //   const [visible, setVisible] = useState(false);

// //   const [userOpen, setUserOpen] = useState(false);

// //   const handleUserOpenChange = (newOpen) => {
// //     setUserOpen(newOpen);
// //   };

// //   const showDrawer = () => {
// //     setVisible(true);
// //   };

// //   const onClose = () => {
// //     setVisible(false);
// //   };

// //   const {
// //     token: { colorBgContainer },
// //   } = theme.useToken();

// //   function logout() {
// //     Cookies.remove("authToken");
// //     dispatch(updateTabAccessData({}));
// //     dispatch(updateUserContext({}));
// //     dispatch(update({}));
// //     persistor.purge();
// //     navigate("/login");
// //   }
// //   const FullScreenRef = useRef(null);

// //   // const enterFullscreen = () => {
// //   //   const elem = FullScreenRef.current;

// //   //   if (elem.requestFullscreen) {
// //   //     elem.requestFullscreen();
// //   //   } else if (elem.mozRequestFullScreen) {
// //   //     // Firefox
// //   //     elem.mozRequestFullScreen();
// //   //   } else if (elem.webkitRequestFullscreen) {
// //   //     // Chrome, Safari, and Opera
// //   //     elem.webkitRequestFullscreen();
// //   //   }
// //   // };

// //   // const exitFullscreen = () => {
// //   //   if (document.exitFullscreen) {
// //   //     document.exitFullscreen();
// //   //   } else if (document.mozCancelFullScreen) {
// //   //     // Firefox
// //   //     document.mozCancelFullScreen();
// //   //   } else if (document.webkitExitFullscreen) {
// //   //     // Chrome, Safari, and Opera
// //   //     document.webkitExitFullscreen();
// //   //   }
// //   // };

// //   // const handleFullscreen = () => {
// //   //   if (!document.fullscreenElement) {
// //   //     setIsFullScreen(true);
// //   //     enterFullscreen();
// //   //   } else {
// //   //     setIsFullScreen(false);
// //   //     exitFullscreen();
// //   //   }
// //   // };

// //   const headerItems = [
// //     // {
// //     //   key: 4,
// //     //   label: (
// //     //     <Button onClick={handleFullscreen}>
// //     //       {isFullScreen ? (
// //     //         <AiOutlineFullscreenExit style={{ fontSize: "1.5rem" }} />
// //     //       ) : (
// //     //         <AiOutlineFullscreen style={{ fontSize: "1.5rem" }} />
// //     //       )}
// //     //     </Button>
// //     //   ),
// //     //   selectable: "false",
// //     // },
// //     {
// //       key: 3, // Ensure this key is different from other keys
// //       label: (
// //         <div
// //           style={{
// //             paddingTop: "0px",
// //             borderRadius: "15px",
// //             width: "auto",
// //             boxShadow: "0 1px 2px 0 rgba(1, 1, 1, 0.4)",
// //             // height: "50px",
// //             textAlign: "center",
// //             background: "#f1f1f1",
// //             marginTop: "-3.12rem",
// //           }}
// //         >
// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "center",
// //               flexDirection: "column",
// //             }}
// //           >
// //             <span
// //               style={{
// //                 textAlign: "center",
// //                 textTransform: "uppercase",
// //                 letterSpacing: "1.5px",
// //                 backgroundColor: "#368CF9",
// //                 color: "white",
// //                 fontWeight: 600,
// //                 fontSize: "20px",
// //                 borderRadius: "10px",
// //                 padding: "0 10px",
// //               }}
// //             >
// //               {sessionTimeRemaining}
// //             </span>
// //           </div>
// //         </div>
// //       ),
// //     },

// //     {
// //       key: 2,
// //       label: (
// //         <Popover
// //           content={
// //             <>
// //               <Space.Compact direction="vertical">
// //                 <Button
// //                   type="text"
// //                   style={{
// //                     width: "100%",
// //                     justifyContent: "start",
// //                   }}
// //                   icon={<UserOutlined />}
// //                 >
// //                   My Profile
// //                 </Button>
// //                 <Button
// //                   type="text"
// //                   style={{ width: "100%", justifyContent: "start" }}
// //                   icon={<SettingOutlined />}
// //                 >
// //                   Change Password
// //                 </Button>
// //                 <Divider style={{ margin: "0" }} />
// //                 <Button
// //                   type="text"
// //                   onClick={logout}
// //                   style={{ width: "100%", justifyContent: "start" }}
// //                   icon={<LogoutOutlined />}
// //                 >
// //                   Logout
// //                 </Button>
// //               </Space.Compact>
// //             </>
// //           }
// //           // title="Title"
// //           trigger="click"
// //           open={userOpen}
// //           onOpenChange={handleUserOpenChange}
// //         >
// //           <Space>
// //             <Avatar
// //               style={{
// //                 backgroundColor: "#87d068",
// //               }}
// //               icon={<UserOutlined />}
// //             />
// //             <span style={{ fontSize: "1rem" }}>
// //               {/* Hi,{" "} */}
// //               {userContext === null || userContext.AppUserName === undefined
// //                 ? ""
// //                 : userContext.AppUserName}
// //             </span>
// //             <DownOutlined />
// //           </Space>
// //         </Popover>
// //       ),
// //       // onClick: logout,
// //     },
// //   ];
// //   const headerItemsMobile = [
// //     {
// //       key: 2,
// //       label: (
// //         <Popover
// //           content={
// //             <>
// //               <Space.Compact
// //                 size="small"
// //                 direction="vertical"
// //                 style={{
// //                   width: "100%",
// //                   display: "flex",
// //                   alignItems: "center",
// //                   justifyContent: "center",
// //                 }}
// //               >
// //                 <Button
// //                   type="text"
// //                   style={{
// //                     width: "100%",
// //                     textAlign: "left",
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "start",
// //                   }}
// //                 >
// //                   <UserOutlined />
// //                   My Profile
// //                 </Button>
// //                 <Button
// //                   type="text"
// //                   style={{
// //                     width: "100%",
// //                     textAlign: "left",
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "start",
// //                   }}
// //                 >
// //                   <SettingOutlined />
// //                   Change Password
// //                 </Button>
// //                 <Divider style={{ margin: "0" }} />
// //                 <Button
// //                   type="text"
// //                   onClick={logout}
// //                   style={{
// //                     width: "100%",
// //                     textAlign: "left",
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "start",
// //                   }}
// //                 >
// //                   <LogoutOutlined />
// //                   Logout
// //                 </Button>
// //               </Space.Compact>
// //             </>
// //           }
// //           // title="Title"
// //           trigger="click"
// //           open={userOpen}
// //           onOpenChange={handleUserOpenChange}
// //         >
// //           <Space>
// //             <Avatar
// //               style={{
// //                 backgroundColor: "#87d068",
// //               }}
// //               icon={<UserOutlined />}
// //             />
// //             <span style={{ fontSize: "1rem" }}>
// //               {/* Hi,{" "} */}
// //               {userContext === null || userContext.AppUserName === undefined
// //                 ? ""
// //                 : userContext.AppUserName}
// //             </span>
// //             <DownOutlined />
// //           </Space>
// //         </Popover>
// //       ),
// //     },
// //   ];

// //   return isBrowser ? (
// //     <Layout style={{ minHeight: "100vh" }} ref={FullScreenRef}>
// //       <Sider
// //         collapsed={collapsed}
// //         collapsible
// //         trigger={null}
// //         className="sidebar"
// //         theme="light"
// //         width={230}
// //         style={{
// //           overflow: "auto",
// //           height: "100vh",
// //           position: "fixed",
// //           zIndex: 2,
// //         }}
// //       >
// //         {collapsed ? (
// //           <img
// //             src={Logo1}
// //             height={30}
// //             width={"auto"}
// //             style={{ marginTop: "1rem", marginLeft: "1rem" }}
// //           />
// //         ) : (
// //           <Logo />
// //         )}
// //         <MenuList theme="light" />
// //       </Sider>
// //       <Layout
// //         className="site-layout"
// //         style={{ marginLeft: collapsed ? 80 : 230 }}
// //       >
// //         <Header
// //           style={{
// //             padding: 0,
// //             background: colorBgContainer,
// //             display: "flex",
// //             alignItems: "center", // Ensures content is centered vertically
// //             height: "3rem", // Adjust height as needed
// //           }}
// //         >
// //           <Button
// //             className="toggle"
// //             onClick={() => setCollapsed(!collapsed)}
// //             type="text"
// //             icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
// //             style={{ height: "3rem", lineHeight: "3rem", width: "3rem" }} // Match button height to header
// //           />
// //           <Menu
// //             theme="light"
// //             mode="horizontal"
// //             items={headerItems}
// //             style={{
// //               flex: 1,
// //               minWidth: 0,
// //               display: "flex",
// //               justifyContent: "flex-end",
// //               padding: "0 3rem",
// //               fontSize: "1rem",
// //               height: "3rem", // Match menu height to header
// //               lineHeight: "3rem", // Center menu items vertically
// //             }}
// //           />
// //         </Header>

// //         <Content
// //           style={{
// //             margin: "0.5rem 0.5rem",
// //             padding: "0rem",
// //             // minHeight: 280,
// //           }}
// //         >
// //           <Outlet />
// //         </Content>
// //       </Layout>
// //     </Layout>
// //   ) : (
// //     <Layout style={{ minHeight: "100vh" }}>
// //       <Drawer
// //         placement="left"
// //         title={<LogoDrawer />}
// //         onClose={onClose}
// //         open={visible}
// //         width={"min-content"}
// //         // mask={true}
// //         // Add a close button to the drawer
// //         closeIcon={
// //           <Button
// //             onClick={onClose}
// //             size="large"
// //             style={{
// //               position: "absolute",
// //               right: "-1rem",
// //               borderRadius: "50%",
// //             }}
// //             icon={visible ? <LeftOutlined /> : <RightOutlined />}
// //           />
// //         }
// //       >
// //         <div style={{ marginTop: "-3rem" }}>
// //           <MenuList theme="light" onClick={onClose} />
// //         </div>
// //       </Drawer>
// //       <Layout className="site-layout">
// //         <Header
// //           style={{
// //             padding: 0,
// //             background: colorBgContainer,
// //             display: "flex",
// //           }}
// //         >
// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "center",
// //               alignItems: "center",
// //             }}
// //           >
// //             <Button
// //               type="default"
// //               onClick={showDrawer}
// //               className="dfja"
// //               style={{
// //                 fontSize: "1rem",
// //                 height: "2rem",
// //               }}
// //             >
// //               <MenuUnfoldOutlined />
// //             </Button>
// //           </div>
// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "center",
// //               alignItems: "center",
// //             }}
// //           >
// //             <LogoMobile />
// //           </div>
// //           <Menu
// //             theme="light"
// //             mode="horizontal"
// //             defaultSelectedKeys={["0"]}
// //             items={headerItemsMobile}
// //             style={{
// //               flex: 1,
// //               minWidth: 0,
// //               display: "flex",
// //               justifyContent: "flex-end",
// //               padding: "0 0.5rem",
// //               fontSize: "1rem",
// //               alignItems: "center",
// //             }}
// //           />
// //         </Header>
// //         <Content
// //           style={{
// //             margin: "1rem 1rem",
// //             padding: "0rem",
// //           }}
// //         >
// //           <Outlet />
// //         </Content>
// //       </Layout>
// //     </Layout>
// //   );
// // }

// // export default MainLayout;

import {
  Button,
  Layout,
  Menu,
  theme,
  Drawer,
  Space,
  Popover,
  Avatar,
  Divider,
  notification,
  Modal,
  Spin
} from "antd";
import { jwtDecode } from "jwt-decode";

import MenuList from "./MenuList/index.jsx";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  UnlockOutlined,
  LeftOutlined,
  RightOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  FileSyncOutlined  ,
  SunOutlined,
  MoonOutlined,

} from "@ant-design/icons";


import Logo from "./logo.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import Logo1 from "../../assets/smileslogo.png";
import { isBrowser } from "react-device-detect";
import LogoMobile from "./LogoMobile.jsx";
import LogoDrawer from "./LogoDrawer.jsx";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { persistStore } from "redux-persist";
import { store } from "../../ReduxStore/store.js";
import { updateTabAccessData } from "../../ReduxStore/features/TabAccessData.js";
import { updateUserContext } from "../../ReduxStore/features/userContext.js";
import { update } from "../../ReduxStore/features/LeftMenuItemSlice.js";
import gsap from "gsap";
import customAxios from "../customAxios/customAxios.jsx";
import { urlGetProviderDetails, urlRefreshToken } from "../../../endpoints.js";
const { Header, Sider, Content } = Layout;

function MainLayout() {
  const navigate = useNavigate();
  const persistor = persistStore(store);
  const dispatch = useDispatch();
  const userContext = useSelector((state) => state.userContext.value);

  // Theme state: 'light', 'dark', or 'default'
  const [themeMode, setThemeMode] = useState('light');
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const headerRef = useRef(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [providerDetails, setProviderDetails] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [showIdleModal, setShowIdleModal] = useState(false);
  const [idleTimer, setIdleTimer] = useState(null);
  const [idleCountdown, setIdleCountdown] = useState(180);
  const [structuralRoles, setStructuralRoles] = useState([]);
  
  const toggleTheme = () => {
    let nextTheme;
    if (themeMode === 'light') nextTheme = 'dark';
    else if (themeMode === 'dark') nextTheme = 'default';
    else nextTheme = 'light';
    setThemeMode(nextTheme);
    document.body.classList.remove('light-theme', 'dark-theme', 'default-theme');
    document.body.classList.add(`${nextTheme}-theme`);
    localStorage.setItem('theme', nextTheme);
  };
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setThemeMode(savedTheme);
    document.body.classList.remove('light-theme', 'dark-theme', 'default-theme');
    document.body.classList.add(`${savedTheme}-theme`);
  }, []);

  // Fetch structural roles dropdown
  useEffect(() => {
    async function fetchStructuralRoles() {
      try {
        const response = await customAxios.get(urlGetProviderDetails);
        setStructuralRoles(response.data?.data?.StructuralRoles || []);
      } catch (error) {
        console.error('Error fetching structural roles:', error);
        setStructuralRoles([]);
      }
    }
    fetchStructuralRoles();
  }, []);

  function getSessionTimeRemaining() {
    const token = Cookies.get("authToken");

    if (!token) {
      return { timeString: "Session expired", timeInSeconds: 0, sessionTimeoutMinutes: 60 };
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const timeRemaining = decodedToken.exp - currentTime;

      if (timeRemaining > 0) {
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = Math.round(timeRemaining % 60);

        return {
          timeString: `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
          timeInSeconds: timeRemaining,
          sessionTimeoutMinutes: decodedToken.SessionTimeoutMinutes || 60
        };
      } else {
        return { timeString: "00:00:00", timeInSeconds: 0, sessionTimeoutMinutes: 60 };
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return { timeString: "Session expired", timeInSeconds: 0, sessionTimeoutMinutes: 60 };
    }
  }

  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(() => {
    const result = getSessionTimeRemaining();
    return result?.timeString || "Session expired";
  });
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(60);
  const [isUserActive, setIsUserActive] = useState(true);
  const lastActivityRef = useRef(Date.now());
  const [autoRefreshAttempted, setAutoRefreshAttempted] = useState(false);

  // Check for idle user every 10 seconds
  useEffect(() => {
    const idleCheckInterval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      const isIdle = timeSinceLastActivity > 420000; // Idle for 7 minutes
      
      if (isIdle && !showIdleModal && !idleTimer) {
        console.log('User idle for 7 minutes, showing modal');
        setShowIdleModal(true);
        setIdleCountdown(180);
        
        // Set timer to auto-logout after 3 minutes if no response
        const timer = setTimeout(() => {
          console.log('No response to idle modal, logging out');
          setShowIdleModal(false);
          logout();
        }, 180000);
        
        setIdleTimer(timer);
      }
    }, 10000); // Check every 10 seconds

    return () => {
      clearInterval(idleCheckInterval);
    };
  }, [showIdleModal, idleTimer]);

  // Activity detection
  useEffect(() => {
    const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimer = () => {
      lastActivityRef.current = Date.now();
      setIsUserActive(true);
      
      // Clear idle modal and timer if user becomes active
      if (showIdleModal) {
        setShowIdleModal(false);
        setIdleCountdown(180);
        if (idleTimer) {
          clearTimeout(idleTimer);
          setIdleTimer(null);
        }
      }
    };

    activities.forEach(activity => {
      document.addEventListener(activity, resetTimer, true);
    });

    return () => {
      activities.forEach(activity => {
        document.removeEventListener(activity, resetTimer, true);
      });
    };
  }, [showIdleModal, idleTimer]);

  // Countdown timer for idle modal
  useEffect(() => {
    let countdownInterval;
    if (showIdleModal && idleCountdown > 0) {
      countdownInterval = setInterval(() => {
        setIdleCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [showIdleModal, idleCountdown]);

  
  // Auto refresh token when user is active and session is about to expire
  const refreshToken = async () => {
    try {
      const currentToken = Cookies.get("authToken");
      if (!currentToken) return false;

      const response = await customAxios.post(urlRefreshToken, {
        token: currentToken
      });

      if (response.data && response.data.data && response.data.data.Accesstoken) {
        Cookies.set("authToken", response.data.data.Accesstoken);
        console.log('Token refreshed successfully');
        setAutoRefreshAttempted(false);
        setShowSessionWarning(false);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = getSessionTimeRemaining();
      if (!result) return;
      
      const { timeString, timeInSeconds, sessionTimeoutMinutes: roleTimeout } = result;
      setSessionTimeRemaining(timeString);
      setSessionTimeoutMinutes(roleTimeout);
      
      // Calculate refresh threshold (5 minutes before expiry)
      const refreshThresholdSeconds = 5 * 60; // 5 minutes in seconds
      
      // Reset refresh attempt flag when session has more than refresh threshold
      if (timeInSeconds > refreshThresholdSeconds && autoRefreshAttempted) {
        setAutoRefreshAttempted(false);
      }
      
      // Auto-refresh logic - refresh 5 minutes before expiry
      if (timeInSeconds <= refreshThresholdSeconds && timeInSeconds > 30 && !autoRefreshAttempted) {
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        const isActive = timeSinceLastActivity < 120000; // Active within last 2 minutes
        
        console.log(`Session expiring in ${Math.floor(timeInSeconds/60)} minutes. User active: ${isActive}`);
        
        if (isActive) {
          // User is active, automatically refresh token
          console.log('Auto-refreshing token for active user');
          setAutoRefreshAttempted(true);
          const refreshed = await refreshToken();
          if (refreshed) {
            console.log('Token auto-refreshed successfully');
            notification.success({
              message: "Session Extended",
              description: "Your session has been automatically extended.",
              duration: 3,
              placement: "topRight", 
            });
          } else {
            console.log('Auto-refresh failed');
            notification.warning({
              message: "Session Expiring Soon",
              description: "Please save your work. Session will expire soon.",
              duration: 10,
              placement: "topRight",
            });
          }
        } else {
          // User is idle, show warning but don't logout yet
          console.log('User idle, showing session warning');
          notification.warning({
            message: "Session Expiring",
            description: "Your session will expire soon due to inactivity.",
            duration: 10,
            placement: "topRight",
          });
          setShowSessionWarning(true);
        }
      }
      
      // Only logout when token is actually expired (less than 30 seconds)
      if (timeInSeconds <= 30 && timeInSeconds > 0) {
        notification.error({
          message: "Session Expired",
          description: "Your session has expired. Please login again.",
          duration: 5,
          placement: "topRight",
        });
        setTimeout(() => {
          logout();
        }, 2000);
      }

    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [autoRefreshAttempted, showSessionWarning]);


  


  // Header auto-hide
  useEffect(() => {
    let hideTimeout;
    const handleMouseMove = (e) => {
      if (e.clientY <= 40) {
        setShowHeader(true);
        if (hideTimeout) clearTimeout(hideTimeout);
        return;
      }
      if (
        headerRef.current &&
        headerRef.current.contains(document.elementFromPoint(e.clientX, e.clientY))
      ) {
        setShowHeader(true);
        if (hideTimeout) clearTimeout(hideTimeout);
      } else if (
        headerRef.current &&
        !headerRef.current.contains(document.elementFromPoint(e.clientX, e.clientY))
      ) {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => setShowHeader(false), 5000);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, []);
  const handleHeaderButtonClick = () => {
    setShowHeader(true);
    setCollapsed(!collapsed);
  };

  // Handle idle modal dismiss on activity
  const handleIdleModalDismiss = () => {
    setShowIdleModal(false);
    setIdleCountdown(180);
    if (idleTimer) {
      clearTimeout(idleTimer);
      setIdleTimer(null);
    }
    lastActivityRef.current = Date.now();
  };

  // Logout
  function logout() {
    Cookies.remove("authToken");
    dispatch(updateTabAccessData({}));
    dispatch(updateUserContext({}));
    dispatch(update({}));
    persistor.purge();
    navigate("/login");
  }



  // Profile modal handlers
  const handleShowProfile = async () => {
    setShowProfileModal(true);
    setUserOpen(false);
    setProfileLoading(true);
    
    try {
      // Fetch provider details using user ID from userContext
      const response = await customAxios.get(`${urlGetProviderDetails}?ProviderId=${userContext?.AppUserId}`);
      if (response.data && response.data.data) {
        setProviderDetails(response.data.data.AddNewProvider);
      }
    } catch (error) {
      console.error('Error fetching provider details:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setProviderDetails(null);
  };

  const handleUserOpenChange = (newOpen) => {
    setUserOpen(newOpen);
  };

  // Header items
  const headerItems = [
    {
      key: 4,
      label: (
        <Popover
          content={
            <Space.Compact direction="vertical" style={{ width: "200px" }}>
              <Button
                type="text"
                onClick={toggleTheme}
                icon={
                  themeMode === 'default'
                    ? <FileSyncOutlined  style={{ color: '#030201ff' }} /> // Default/System
                    : themeMode === 'light'
                      ? <SunOutlined style={{ color: '#faad14' }} /> // Light
                      : <MoonOutlined style={{ color: '#1a237e' }} /> // Dark
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
            </Space.Compact>
          }
          trigger="click"
          placement="bottomRight"
        >      
          <Button
            type="text"
            icon={
              themeMode === 'default'
                ? <FileSyncOutlined  style={{ fontSize: '20px' }} />
                : themeMode === 'light'
                  ? <SunOutlined style={{ fontSize: '20px' }} />
                  : <MoonOutlined style={{ fontSize: '20px' }} />
            }
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
            background: "transparent",
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
            {/* <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
              {sessionTimeoutMinutes}min timeout
            </div> */}
          </div>
        </div>
      ),
    },
    {
      key: 2,
      label: (
        <Popover
          content={
            <Space.Compact direction="vertical">
              <Button
                type="text"
                onClick={handleShowProfile}
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
                style={{
                  width: "100%",
                  justifyContent: "start",
                  backgroundColor: "#1890ff",
                  color: "white"
                }}
                icon={<UnlockOutlined />}
              >
                Change Password
              </Button>
              <Divider style={{ margin: "0" }} />
              <Button
                type="text"
                onClick={logout}
                style={{
                  width: "100%",
                  justifyContent: "start",
                  backgroundColor: "red",
                  color: "white"
                }}
                icon={<LogoutOutlined />}
              >
                Logout
              </Button>
            </Space.Compact>
          }
          trigger="click"
          open={userOpen}
          onOpenChange={setUserOpen}
        >
          <Space>
            <Avatar
              style={{
                backgroundColor: "#87d068",
              }}
              icon={<UserOutlined />}
            />
            <span style={{ fontSize: "1rem" }}>
              {userContext?.AppUserName || ""}
            </span>
            <DownOutlined />
          </Space>
        </Popover>
      ),
    },
  ];

  const headerItemsMobile = [
    {
      key: 2,
      label: (
        <Popover
          content={
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
                onClick={handleShowProfile}
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
          }
          trigger="click"
          open={userOpen}
          onOpenChange={setUserOpen}
        >
          <Space>
            <Avatar
              style={{
                backgroundColor: "#87d068",
              }}
              icon={<UserOutlined />}
            />
            <span style={{ fontSize: "1rem" }}>
              {userContext?.AppUserName || ""}
            </span>
            <DownOutlined />
          </Space>
        </Popover>
      ),
    },
  ];

  
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const FullScreenRef = useRef(null);

  return (
    <>
      {isBrowser ? (
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
            {showHeader && (
              <Header
                ref={headerRef}
                style={{
                  padding: 0,
                  background: colorBgContainer,
                  display: "flex",
                  alignItems: "center",
                  height: "3rem",
                }}
              >
                <Button
                  className="toggle"
                  onClick={handleHeaderButtonClick}
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: "20px" }} /> : <MenuFoldOutlined style={{ fontSize: "20px" }} />}
                  style={{ height: "3rem", lineHeight: "3rem", width: "3rem" }}
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
                    height: "3rem",
                    lineHeight: "3rem",
                  }}
                />
              </Header>
            )}
            <Content
              style={{
                margin: "0.5rem 0.5rem",
                padding: "0rem",
                border: "2px solid #4a90e2",
                borderRadius: "16px",
                overflow: "hidden"
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
            onClose={() => setVisible(false)}
            open={visible}
            width={"min-content"}
            closeIcon={
              <Button
                onClick={() => setVisible(false)}
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
              <MenuList theme="light" onClick={() => setVisible(false)} />
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
                  onClick={() => setVisible(true)}
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
      )}


      {/* Professional Profile Card */}
      <Modal
        open={showProfileModal}
        onCancel={handleCloseProfile}
        footer={null}
        width={450}
        centered
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        {profileLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" tip="Loading profile..." />
          </div>
        ) : (
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
          }}>
            {/* Header Section */}
            <div style={{
              background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
              padding: "30px 25px 20px",
              position: "relative"
            }}>
              <Button
                type="text"
                onClick={handleCloseProfile}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  color: "white",
                  fontSize: "18px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                icon={<span>Ãƒâ€”</span>}
              />
              
              <div style={{ textAlign: "center" }}>
                <Avatar
                  size={80}
                  style={{
                    backgroundColor: "#3498db",
                    marginBottom: "15px",
                    border: "3px solid rgba(255,255,255,0.2)"
                  }}
                  icon={<UserOutlined style={{ fontSize: "32px" }} />}
                />
                <h2 style={{
                  color: "white",
                  margin: "0 0 5px 0",
                  fontSize: "22px",
                  fontWeight: "600"
                }}>
                  {providerDetails ? 
                    `${providerDetails.ProviderFirstName} ${providerDetails.ProviderLastName}`.trim() 
                    : userContext?.AppUserName || "Healthcare Provider"}
                </h2>
                <p style={{ 
                  color: "rgba(255,255,255,0.8)", 
                  margin: "0", 
                  fontSize: "14px" 
                }}>
                  {userContext?.RoleName || "Healthcare Provider"}
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: "25px" }}>
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ 
                  color: "#2c3e50", 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  marginBottom: "15px",
                  borderBottom: "2px solid #ecf0f1",
                  paddingBottom: "8px"
                }}>
                  Personal Information
                </h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#7f8c8d", fontSize: "14px" }}>User ID</span>
                    <span style={{ color: "#2c3e50", fontWeight: "500", fontSize: "14px" }}>
                      {providerDetails?.UserId || userContext?.AppUserId || "N/A"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#7f8c8d", fontSize: "14px" }}>Gender</span>
                    <span style={{ color: "#2c3e50", fontWeight: "500", fontSize: "14px" }}>
                      {providerDetails?.Gender === 7 ? "Male" : providerDetails?.Gender === 8 ? "Female" : "N/A"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ color: "#7f8c8d", fontSize: "14px" }}>Structural Role</span>
    <span style={{ color: "#2c3e50", fontWeight: "500", fontSize: "14px" }}>
        {(() => {
          const selectedRole = structuralRoles.find(
            (role) => role.LookupID === providerDetails?.StructuralRoleId
          );
          return providerDetails?.StructuralRoleId
            ? selectedRole?.LookupDescription || "N/A"
            : userContext?.RoleName || "N/A";
        })()}
    </span>
</div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#7f8c8d", fontSize: "14px" }}>Qualification</span>
                    <span style={{ color: "#2c3e50", fontWeight: "500", fontSize: "14px" }}>
                      {providerDetails?.Qualification || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ 
                  color: "#2c3e50", 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  marginBottom: "15px",
                  borderBottom: "2px solid #ecf0f1",
                  paddingBottom: "8px"
                }}>
                  Contact Information
                </h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#7f8c8d", fontSize: "14px" }}>Mobile</span>
                    <span style={{ color: "#2c3e50", fontWeight: "500", fontSize: "14px" }}>
                      {providerDetails?.MobileNumber || "N/A"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#7f8c8d", fontSize: "14px" }}>Email</span>
                    <span style={{ color: "#2c3e50", fontWeight: "500", fontSize: "13px" }}>
                      {providerDetails?.EmailId || "N/A"}
                    </span>
                  </div>
                  {providerDetails?.LandlineNumber && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#7f8c8d", fontSize: "14px" }}>Landline</span>
                      <span style={{ color: "#2c3e50", fontWeight: "500", fontSize: "14px" }}>
                        {providerDetails.LandlineNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {providerDetails?.PresentAddress1 && (
                <div>
                  <h3 style={{ 
                    color: "#2c3e50", 
                    fontSize: "16px", 
                    fontWeight: "600", 
                    marginBottom: "15px",
                    borderBottom: "2px solid #ecf0f1",
                    paddingBottom: "8px"
                  }}>
                    Address
                  </h3>
                  <p style={{ 
                    color: "#2c3e50", 
                    fontSize: "14px", 
                    lineHeight: "1.5", 
                    margin: "0",
                    background: "#f8f9fa",
                    padding: "12px",
                    borderRadius: "8px"
                  }}>
                    {providerDetails.PresentAddress1}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Creative Idle Session Modal */}
      <Modal
        open={showIdleModal}
        closable={false}
        maskClosable={false}
        footer={null}
        centered
        width={400}
        style={{
          background: 'transparent',
        }}
        modalRender={(modal) => (
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            padding: '0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Animated Background Elements */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              animation: 'float 6s ease-in-out infinite',
              zIndex: 1
            }} />
            
            {/* Countdown Timer at Top Middle */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '50px',
              padding: '8px 20px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              zIndex: 10,
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: idleCountdown <= 10 ? '#ff4757' : '#2f3542',
                textAlign: 'center',
                fontFamily: 'monospace',
                letterSpacing: '2px'
              }}>
                {idleCountdown}s
              </div>
            </div>

            {/* Main Content */}
            <div style={{
              padding: '80px 40px 40px 40px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 5
            }}>
              {/* Warning Icon */}
              <div style={{
                fontSize: '80px',
                marginBottom: '20px',
                animation: 'pulse 2s infinite'
              }}>Ã¢Å¡Â Ã¯Â¸Â</div>
              
              <h2 style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: '600',
                margin: '0 0 15px 0',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>Session Idle Warning</h2>
              
              <p style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '18px',
                margin: '0 0 10px 0',
                lineHeight: '1.5'
              }}>
                YouÃ¢â‚¬â„¢ve been idle for a while. Please interact to continue your session
              </p>
              
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '16px',
                margin: '0 0 30px 0'
              }}>
                  Move your mouse / press any key to keep your session active 
              </p>
              
              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: `${(idleCountdown / 180) * 100}%`,
                  height: '100%',
                  background: idleCountdown <= 10 
                    ? '#ff4757' 
                    : idleCountdown <= 30 
                    ? '#ff6b35' 
                    : idleCountdown <= 60 
                    ? '#f39c12' 
                    : '#27ae60',
                  borderRadius: '4px',
                  transition: 'all 1s ease-out'
                }} />
              </div>
              
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                margin: '0',
                fontStyle: 'italic'
              }}>
                Auto-logout in {idleCountdown} seconds
              </p>
            </div>
          </div>
        )}
      />
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </>
  );
}

export default MainLayout;
