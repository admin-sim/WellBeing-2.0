import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Row,
  DatePicker,
  notification,
} from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { urlAddUser, urlGetAppUserbyId } from "../../../../endpoints";
import { useNavigate } from "react-router";
import customAxios from "../../../../components/customAxios/customAxios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";


dayjs.extend(customParseFormat);

const ColWithNoSpan = ({ children, ...props }) => (
  <Col xl={10} lg={8} md={6} span={0} {...props}>
    {children}
  </Col>
);
const ColWithSixSpan = ({ children, ...props }) => (
  <Col xl={6} lg={6} md={12} span={24} {...props}>
    {children}
  </Col>
);
const ColForBackToListSpan = ({ children, ...props }) => (
  <Col
    xl={3}
    lg={3}
    md={6}
    span={10}
    {...props}
    style={{ display: "flex", alignItems: "center" }}
  >
    {children}
  </Col>
);
const ColWithThreeSpan = ({ children, ...props }) => (
  <Col xl={2} lg={3} md={4} span={8} {...props}>
    {children}
  </Col>
);
const ColWithNineSpan = ({ children, ...props }) => (
  <Col xl={9} lg={9} md={9} span={10} {...props}>
    {children}
  </Col>
);

export default function EmployeeCreateEdit() {
  const [form] = Form.useForm();
  const location = useLocation();
  const [selecteddob, setDob] = useState(undefined);
  const [doj, setDoj] = useState(null);
  const UserId = location.state.UserId;
  const navigate = useNavigate();

  useEffect(() => {
    //  
    const fetchData = async () => {
      if (UserId > 0) {
        try {
          const response = await customAxios.get(
            `${urlGetAppUserbyId}?AppuserId=${UserId}`
          );
          if (response.status === 200) {
            const data = response.data.data;
       
            setDoj(data.DateofJoiningString);
        
            // Set the data to the form fields here and update selectedId if needed
            // For example:
            // Update state and set form values
            form.setFieldsValue({
              FirstName: data.FirstName,
              LastName: data.LastName,
              UserId: data.UserId,
              EmailId: data.EmailId,
              MobileNumber: data.MobileNumber,
              Department: data.Department,
              DateofJoining:
                data.DateofJoiningString &&
                dayjs(data.DateofJoiningString, "DD-MM-YYYY"),
            });
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchData();
  }, [UserId]); // Make sure to include AppId in the dependency array

  const onFinish = async (values) => {
    //  
    values.AppUserId = UserId;
    values.DateofJoiningString = doj;
    try {
      const response = await customAxios.post(urlAddUser, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.data.Status == true) {
        const message1 =
          UserId > 0
            ? "UserResistration Updated Successfully"
            : "UserResistration Successfully Added";
        notification.success({
          message: "Success",
          description: message1,
        });
        form.resetFields();
        const url = "/employee";
        navigate(url);
      } else {
        notification.error({
          message: "Error",
          description: "Something Went Wrong.....",
        });
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    const url = "/employee";
    navigate(url);
  };
  const handleReset = () => {
    form.resetFields(); // Reset the form fields to their initial values
  };

  const disabledDate = (current) => {
    // Disable dates that are in the future
    return current && current > new Date();
  };

  const handleDateChange = (date, dateString) => {
    //  
    setDoj(dateString);
  };

  function formatDate(inputDate) {
    if (!inputDate) return '""';
    const dateParts = inputDate.split("-");
    if (dateParts.length === 3) {
      const [day, month, year] = dateParts;
      return `${day}-${month}-${year}`;
    }
    return inputDate; // Return as is if not in the expected format
  }

  return (
    <Layout style={{ backgroundColor: "#fff" }}>
      <Layout.Content>
        <Row style={{ padding: "0 3rem", backgroundColor: "lavender" }}>
          <ColWithNineSpan>
          <h2>{UserId > 0 ? "Update Employee" : "Add New Employee"}</h2>
          </ColWithNineSpan>
          <ColWithNoSpan></ColWithNoSpan>
          <ColForBackToListSpan>
            <Button size="large" onClick={() => navigate("/employee")}>
              <LeftCircleOutlined />
              Back to Employee List
            </Button>
          </ColForBackToListSpan>
        </Row>
        <Form
          form={form}
          name="Implementation"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{}}
          scrollToFirstError
          style={{ padding: "2rem" }}
        >
          <Row gutter={24}>
            <ColWithSixSpan>
              <Form.Item
                name="FirstName"
                label="First Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your FirstName!",
                  },
                ]}
              >
                <Input placeholder="FirstName" size="medium" />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="LastName" label="Last Name">
                <Input placeholder="LastName" size="medium" />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                name="UserId"
                label="User Id"
                rules={[
                  {
                    required: true,
                    min:4
                  },
                ]}
              >
                <Input placeholder="UserName" size="medium" />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                name="EmailId"
                label="E-mail"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
              >
                <Input placeholder="EmailId" size="medium" />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                name="Password"
                label="Password"
                rules={
                  UserId > 0
                    ? []
                    : [
                        {
                          required: true,
                          min:6,
                        },
                      ]
                }
                hasFeedback
              >
                <Input.Password
                  placeholder="Enter Password"
                  size="medium"
                  disabled={UserId > 0}
                />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={["Password"]}
                hasFeedback
                rules={
                  UserId > 0
                    ? []
                    : [
                        {
                          required: true,
                         min:6,
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("Password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                "The new password that you entered do not match!"
                              )
                            );
                          },
                        }),
                      ]
                }
              >
                <Input.Password
                  placeholder="Enter Confirm Password"
                  size="medium"
                  disabled={UserId > 0}
                />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                name="MobileNumber"
                label="Phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your number!",
                  },
                  {
                    pattern: /^\d{10}$/,
                    message: "Please enter a valid 10 digit number!",
                  },
                ]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="DateofJoining" label="Date&nbsp;of&nbsp;Joining">
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={handleDateChange}
                  disabledDate={disabledDate}
                  format={"DD-MM-YYYY"}
                />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Department" label="Department">
                <Input placeholder="Department" size="medium" />
              </Form.Item>
            </ColWithSixSpan>
          </Row>
          <Row gutter={10} justify={"end"}>
            <ColWithThreeSpan>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {UserId > 0 ? "Update" : "Submit"}
                </Button>
              </Form.Item>
            </ColWithThreeSpan>
            <ColWithThreeSpan>
              <Form.Item>
                <Button type="default" onClick={handleReset}>
                  Reset
                </Button>
              </Form.Item>
            </ColWithThreeSpan>
            <ColWithThreeSpan>
              <Form.Item>
                <Button type="default" onClick={handleCancel}>
                  Cancel
                </Button>
              </Form.Item>
            </ColWithThreeSpan>
          </Row>
        </Form>
      </Layout.Content>
    </Layout>
  );
}
