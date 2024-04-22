import { React, useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  Form,
  Input,
  Row,
  Spin,
  message,
  notification,
} from "antd";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { urlLogin } from "../../../endpoints";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/smileslogo.png";
// import { useDispatch, useSelector } from "react-redux";
// import { update } from "../../store/features/LeftMenuItemSlice.jsx";

// import { updateUserContext } from "../../store/features/userContext.jsx";

// const mongoUrl = "http://localhost:5000/api/auth/login";

const Login = () => {
  const navigate = useNavigate();
  //   const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    debugger;
    console.log( values);
    setLoading(true);
    // debugger;
    try {
      const response = await axios.post(urlLogin, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.status === 200) {
        if (response) {
          let decodedJwt = jwtDecode(response.data.data);
          console.log("decodedJwt", decodedJwt);
          let expirationDate = new Date(decodedJwt.exp * 1000);
          console.log("expiration", expirationDate);
          Cookies.set("authToken", response.data.data, {
            expires: 60 / (24 * 60),
          });
          navigate("/");
        } else {
          notification.error({
            message: "Invalid UserId Or Password",
          });
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false); // Set loading to false when login process finishes
    }
  };
  return (
    <Card
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EEF1FF",
      }}
    >
      <Spin spinning={loading} size="large">
        <Form
          layout="vertical"
          style={{
            //   border: "1px solid black",
            padding: "2rem 3rem",
            borderRadius: "1rem",
            backgroundColor: "#fff",
            // border: "1px solid purple",
            boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
          }}
          name="loginForm"
          initialValues={{
            UserId: "admin",
            Password: "123456",
          }}
          onFinish={onFinish}
        >
          <h1
            style={{
              textAlign: "center",
              color: "#673AB7",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src={logo} width={40} height={30} />
            <span
              style={{
                padding: "0 0.5rem",
              }}
            >
              WellBeing Lite
            </span>
          </h1>
          <p
            style={{
              textAlign: "center",
              fontSize: "1.5rem",
              marginBottom: "0",
              fontWeight: "600",
            }}
          >
            Hi, Welcome Back
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: "1rem",
              margin: "0 0 2rem 0",
            }}
          >
            Enter your credentials to continue
          </p>
          <Form.Item
            name="UserId"
            label="User Id"
            rules={[
              {
                required: true,
                message: "Please input your User Id!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="User Id"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="Password"
            label="Enter Password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Row>
            <Col span={24}>
              <Form.Item>
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        defaultBg: "linear-gradient(90deg, #0062ff, #da61ff)",
                        defaultColor: "#fff",
                        fontWeight: "bold",
                        defaultHoverBg: "#EEF1FF",
                        defaultHoverColor: "#803AB7",
                      },
                    },
                  }}
                >
                  <Button
                    htmlType="submit"
                    size="large"
                    style={{
                      width: "100%",
                    }}
                  >
                    Log In
                  </Button>
                </ConfigProvider>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Card>
  );
};
export default Login;

// const menuData = [
//   {
//     key: "role",
//     icon: <TeamOutlined style={{ fontSize: "1.5rem" }} />,
//     title: "Role",
//     link: "/role",
//   },
//   {
//     key: "client",
//     icon: <TeamOutlined style={{ fontSize: "1.5rem" }} />,
//     title: "Client",
//     link: "/client",
//   },
//   {
//     key: "employee",
//     icon: <UserOutlined style={{ fontSize: "1.5rem" }} />,
//     title: "Employee",
//     link: "/employee",
//   },
//   {
//     key: "implementation",
//     icon: <CodepenOutlined style={{ fontSize: "1.5rem" }} />,
//     title: "Implementation",
//     link: "/implementation",
//   },
//   {
//     key: "collection",
//     icon: <UserOutlined style={{ fontSize: "1.5rem" }} />,
//     title: "Collection",
//     link: "/collection",
//   },
//   {
//     key: "amc",
//     icon: <UserOutlined style={{ fontSize: "1.5rem" }} />,
//     title: "AMC",
//     link: "/amc",
//   },
//   {
//     key: "subtasks",
//     icon: <HomeOutlined style={{ fontSize: "1.5rem" }} />,
//     title: "Tasks",
//     children: [
//       {
//         key: "task-1",
//         icon: <HomeOutlined />,
//         title: "Sub Task 1",
//         link: "/sub-task-1",
//       },
//       {
//         key: "task-2",
//         icon: <HomeOutlined />,
//         title: "Sub Task 2",
//         link: "/sub-task-2",
//       },
//       {
//         key: "sub-subtask",
//         title: "SubTask",
//         children: [
//           { key: "ta1", title: "Task11", link: "/task-11" },
//           { key: "ta2", title: "Task12", link: "/task-12" },
//         ],
//       },
//     ],
//   },
// ];
