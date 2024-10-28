import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Row,
  notification,
  Spin,
  ConfigProvider,
} from "antd";
import React, { useState, useEffect } from "react";
//import "../../css/antdtable.css";
// import { useLocation } from "react-router-dom";
import {
  urlGetAllRoles,
  urlAddNewRole,
  urlGetRolebyId,
  urlDeleteRole,
} from "../../../../endpoints";

import customAxios from "../../../components/customAxios/customAxios";
import CustomTable from "../../../components/customTable";

const ColWithSixSpan = ({ children, ...props }) => (
  <Col xl={6} lg={6} md={12} span={24} {...props}>
    {children}
  </Col>
);

const ColWithThreeSpanButton = ({ children, ...props }) => (
  <Col xl={2} lg={3} md={3} span={6} {...props}>
    {children}
  </Col>
);

export default function Roles() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [RoleID, setSelectedRoleId] = useState(null);

  useEffect(() => {
    // Initial data fetch
    fetchAllRoles();
  }, []);

  const fetchAllRoles = async () => {
    //
    debugger;
    setLoading(true);
    try {
      const response = await customAxios.get(urlGetAllRoles);
      // Set the data state with the response data
      setData(
        response.data.data.map((obj, index) => {
          return { ...obj, key: index + 1 };
        })
      );
    } catch (error) {
      // Handle the error
      console.error(error);
    }
    setLoading(false);
  };

  const onFinish = async (values) => {
    values.Role_Id = RoleID;
    try {
      const response = await customAxios.post(urlAddNewRole, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.data.Status == true) {
        const message1 =
          RoleID > 0 ? "RoleUpdated Successfully" : "RoleCreated Successfully";
        notification.success({
          message: "Success",
          description: message1,
        });
        form.resetFields();
        fetchAllRoles();
        setSelectedRoleId(null);
      } else {
        notification.warning({
          message: "Warning",
          description: "Role With Same Name Is Already There.....",
        });
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    setSelectedRoleId(null);
    form.resetFields();
  };
  const handleReset = () => {
    form.resetFields(); // Reset the form fields to their initial values
    setSelectedRoleId(null);
  };

  const handleEditClick = async (record) => {
    //
    const Role_Id = record.Role_Id;
    setSelectedRoleId(record.Role_Id);

    try {
      const response = await customAxios.get(
        `${urlGetRolebyId}?RoleId=${Role_Id}`
      );
      if (response.status === 200) {
        const data = response.data.data.userrolemodal;
       
        form.setFieldsValue({
          RoleName: data.RoleName,
          RoleDescription: data.RoleDescription,
        });
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const columns = [
    {
      title: "Sl No",
      key: "index",
      // width: 30,
      dataIndex: "key",
    },
    {
      title: "Role Name",
      dataIndex: "RoleName",
      key: "RoleName",
      // width: 50,
    },
    {
      title: "Role Description",
      dataIndex: "RoleDescription",
      key: "RoleDescription",
      // width: 100,
    },
  ];

  const handleDelete = async (record) => {
    try {
      //
      // Make API call

      if (!record) {
        // If record is null or undefined, return without making the API call
        return;
      }
      const response = await customAxios.delete(
        `${urlDeleteRole}?RoleId=${record.Role_Id}`
      );
      if (response.data.data.Status === true) {
        var message1 = "Role Deleted Successfully..";
        notification.success({
          message: "Success",
          description: message1,
        });
        fetchAllRoles();
      } else {
        notification.error({
          message: "Error",
          description: "Something Went Wrong.....",
        });
      }

      // Handle successful delete
    } catch (error) {}
  };

  return (
    <Layout style={{ backgroundColor: "#fff" }}>
      <Layout.Content>
        <Row style={{ padding: "0 3rem", backgroundColor: "lavender" }}>
          <Col span={24}>
            <h2>Add New Role</h2>
          </Col>
          <Col
            offset={8}
            span={4}
            style={{ display: "flex", alignItems: "center" }}
          ></Col>
        </Row>
        <Form
          form={form}
          name="Role"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{}}
          scrollToFirstError
        >
          <Row gutter={6} style={{ margin: "1rem" }}>
            <ColWithSixSpan>
              <Form.Item
                name="RoleName"
                label="Role Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your FirstName!",
                  },
                ]}
              >
                <Input placeholder="RoleName" size="medium" />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                name="RoleDescription"
                label="Role Description"
                rules={[
                  {
                    required: true,
                    message: "Please input your UserName!",
                  },
                ]}
              >
                <Input placeholder="RoleDescription" size="medium" />
              </Form.Item>
            </ColWithSixSpan>
          </Row>
          <Row gutter={12} justify={"end"} style={{ marginRight: "1rem" }}>
            <ColWithThreeSpanButton>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  {RoleID > 0 ? "Update" : "Save"}
                </Button>
              </Form.Item>
            </ColWithThreeSpanButton>
            <ColWithThreeSpanButton>
              <Form.Item>
                <Button
                  type="default"
                  onClick={handleReset}
                  style={{ width: "100%" }}
                >
                  Reset
                </Button>
              </Form.Item>
            </ColWithThreeSpanButton>
            <ColWithThreeSpanButton>
              <Form.Item>
                <Button
                  type="default"
                  onClick={handleCancel}
                  style={{ width: "100%" }}
                >
                  Cancel
                </Button>
              </Form.Item>
            </ColWithThreeSpanButton>
          </Row>
          <Spin spinning={loading}>
            <ConfigProvider
              theme={{
                components: {
                  Table: {
                    row: {
                      hover: {
                        backgroundColor: "blue",
                      },
                    },
                  },
                },
              }}
            >
              <CustomTable
              printTitle={"Roles Report"}
                //rowClassName={(record) => (record.Role_Id === RoleID ? 'selected-row' : '')}
                columns={columns}
                dataSource={data}
                isFilter={true}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                rowKey={(record) => record.Role_Id} // use the id property as the key prop
              />
            </ConfigProvider>
          </Spin>
        </Form>
      </Layout.Content>
    </Layout>
  );
}
