import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Row,
  notification,
  Spin,
  Table,
  AutoComplete,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CloseSquareFilled,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
// import "../../css/antdtable.css";
// import { useLocation } from "react-router-dom";
import {
  urlGetAllRoles,
  urlGetAllUsers,
  urlMapNewRole,
  urlGetAllAppUserRoles,
  urlDeleteAppUserRole,
} from "../../../../endpoints";
 import { useNavigate } from "react-router";
import customAxios from "../../../components/customAxios/customAxios";
import CustomTable from "../../../components/customTable";


const ColWithSixSpan = ({ children, ...props }) => (
  <Col xl={6} lg={6} md={12} span={24} {...props}>
    {children}
  </Col>
);
const ColWithThreeSpan = ({ children, ...props }) => (
  <Col xl={3} lg={3} md={6} span={12} {...props}>
    {children}
  </Col>
);
const ColWithNineSpan = ({ children, ...props }) => (
  <Col xl={9} lg={9} md={9} span={24} {...props}>
    {children}
  </Col>
);
const ColWithThreeSpanButton = ({ children, ...props }) => (
  <Col xl={2} lg={3} md={3} span={7} {...props}>
    {children}
  </Col>
);

export default function RoleMapping() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [roleoptions, setRoleOptions] = useState([]);
  const [data, setData] = useState(null);
  const [AppUserRoleID, setAppUserRoleID] = useState(null);
  const [editedRowIndex, setEditedRowIndex] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for users
        const usersResponse = await customAxios.get(urlGetAllUsers);
        setOptions(
          usersResponse.data.data.map((user, index) => ({
            value: user.ProviderFirstName,
            id: user.ProviderId,
            key: `${user.ProviderId}-${index}`,
          }))
        );

        // Fetch data for roles
        const rolesResponse = await customAxios.get(urlGetAllRoles);
        setRoleOptions(
          rolesResponse.data.data.map((role, index) => ({
            value: role.RoleName,
            id: role.Role_Id,
            key: `${role.Role_Id}-${index}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Initial data fetch
    fetchAllAppUserRoles();
  }, []);

  const fetchAllAppUserRoles = async () => {
    //

    try {
      const alluserroles = await customAxios.get(urlGetAllAppUserRoles);
      setData(
        alluserroles.data.data.map((obj, index) => {
          return { ...obj, key: index + 1 };
        })
      );
    } catch (error) {
      // Handle the error
      console.error(error);
    }
  };

  const handleSelect = (value, option) => {
    //
    // Find the user with the selected FirstName and set selectedUserId
    const selectedUser = options.find((user) => user.value === value);
    if (selectedUser) {
      setSelectedUser(selectedUser.id);
    }
  };
  const handleRoleSelect = (value, option) => {
    //
    // Find the user with the selected FirstName and set selectedUserId
    const selectedUser = roleoptions.find((role) => role.value === value);
    if (selectedUser) {
      setSelectedRole(selectedUser.id);
    }
  };

  const onFinish = async (values) => {
    //
debugger;
    values.Role_Id = selectedRole;
    values.AppUserID = selectedUser;
    values.AppUserRole_Id = AppUserRoleID;

    try {
      const response = await customAxios.post(urlMapNewRole, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.data.Status == true) {
        const message1 =
          AppUserRoleID > 0
            ? "AppUserRoleMapUpdated Successfully"
            : "AppUserRoleMapped Successfully";
        notification.success({
          message: "Success",
          description: message1,
        });
        fetchAllAppUserRoles();
        form.resetFields();
        setAppUserRoleID(null);
      } else {
        notification.error({
          message: "Error",
          description: "Something Went Wrong.....",
        });
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    setAppUserRoleID(null);
    form.resetFields();
  };
  const handleReset = () => {
    form.resetFields(); // Reset the form fields to their initial values
    setAppUserRoleID(null);
  };

  const handleEditClick = async (record) => {
    //
    setAppUserRoleID(record.AppUserRole_Id);
    setSelectedUser(record.AppUserID);
    setSelectedRole(record.AppUserRole_Id);
    form.setFieldsValue({
      AppUserName: record.AppUserName,
      AppRoleName: record.AppRoleName,
    });
  };

  const columns = [
    {
      title: "Sl No",
      key: "index",
      // width: 70,
      dataIndex: "key",
    },
    {
      title: "User Name",
      dataIndex: "AppUserName",
      key: "AppUserName",
      // width: 120,
    },
    {
      title: "Role Name",
      dataIndex: "AppRoleName",
      key: "AppRoleName",
      // width: 150,
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
        `${urlDeleteAppUserRole}?AppUsrRoleId=${record.AppUserRole_Id}`
      );
      if (response.data.data.Status === true) {
        var message1 = "AppUserRoleMap Deleted Successfully..";
        notification.success({
          message: "Success",
          description: message1,
        });
        fetchAllAppUserRoles();
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
            <h2>Role Mapping</h2>
          </Col>
          <Col
            offset={8}
            span={4}
            style={{ display: "flex", alignItems: "center" }}
          ></Col>
        </Row>
        <Form
          form={form}
          name="RoleMapping"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{}}
          scrollToFirstError
        >
          <Row gutter={32} style={{ margin: "1rem" }}>
            <ColWithSixSpan>
              <Form.Item
                name="AppUserName"
                label="User Name"
                rules={[
                  {
                    required: true,
                    message: "Please select UserName.",
                  },
                ]}
              >
                <AutoComplete
                  style={{ width: "100%" }}
                  options={options}
                  placeholder="Type to search for a user"
                  // filterOption={(inputValue, option) =>
                  //   option.value
                  //     .toUpperCase()
                  //     .indexOf(inputValue.toUpperCase()) !== -1
                  // }
                  onSelect={handleSelect}
                  allowClear={{
                    clearIcon: <CloseSquareFilled />,
                  }}
                />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                name="AppRoleName"
                label="Role Name"
                rules={[
                  {
                    required: true,
                    message: "Please select RoleName.",
                  },
                ]}
              >
                <AutoComplete
                  style={{ width: "100%" }}
                  options={roleoptions}
                  placeholder="Type to search for a Role"
                  filterOption={(inputValue, option) =>
                    option.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSelect={handleRoleSelect}
                  allowClear={{
                    clearIcon: <CloseSquareFilled />,
                  }}
                />
              </Form.Item>
            </ColWithSixSpan>
          </Row>
          <Row gutter={10} justify={"end"} style={{ marginRight: "1rem" }}>
            <ColWithThreeSpanButton>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  {AppUserRoleID > 0 ? "Update" : "Save"}
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
            <CustomTable
              printTitle={"RoleMapping Report"}
              columns={columns}
              dataSource={data}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              isFilter={true}
              rowKey={(record) => record.AppUserRole_Id} // use the id property as the key prop
            />
          </Spin>
        </Form>
      </Layout.Content>
    </Layout>
  );
}
