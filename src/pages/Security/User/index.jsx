import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Layout,
  Modal,
  Row,
  Form,
  Input,
  DatePicker,
  Spin,
  Table,
  notification,
  Popconfirm,
  Drawer
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { isBrowser } from "react-device-detect";

import { urlGetAllUsers, urlDeleteAppUser,urlChangePassword } from "../../../../endpoints";
import { useNavigate } from "react-router";
import customAxios from "../../../components/customAxios/customAxios";
import CustomTable from "../../../components/customTable";
import { useSelector } from "react-redux";
const User = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});

  const navigate = useNavigate();

  const [data, setData] = useState(null);


  useEffect(() => {
    if (record && visible) {
      form.setFieldsValue({
        UserId: record.UserId,
      });
    }
  }, [record, visible]);
  

  
  // Define the fetchData function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(urlGetAllUsers);

      setData(
        response.data.data.map((obj, index) => {
          return { ...obj, key: index + 1 };
        })
      );
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Call fetchData in useEffect
  useEffect(() => {
    fetchData();
  }, []);

  // const formatDatefortable = (dateString) => {
  //   if (!dateString) return '""';
  //   const date = new Date(dateString);
  //   return `${date.getDate().toString().padStart(2, "0")}-${(
  //     date.getMonth() + 1
  //   )
  //     .toString()
  //     .padStart(2, "0")}-${date.getFullYear()}`;
  // };

  const columns = [
    {
      title: "Sl No",
      key: "key",
      width: 70,
      dataIndex: "key",
    },
    {
      title: "User Id",
      dataIndex: "UserId",
      key: "UserId",
      width: 120,
    },
    {
      title: "User Name",
      dataIndex: "FirstName",
      key: "FirstName",
      width: 120,
    },
    {
      title: "Email Id",
      dataIndex: "EmailId",
      key: "EmailId",
      width: 120,
    },
    {
      title: "Phone Number",
      dataIndex: "MobileNumber",
      key: "MobileNumber",
      width: 120,
    },
    // {
    //   title: "Registered Date",
    //   dataIndex: "RegisterDate",
    //   key: "RegisterDate",
    //   width: 110,
    //   render: (text, record) => (
    //     <span>{formatDatefortable(record.RegisterDate)}</span>
    //   ),
    // },
  ];

  const handleDelete = async (record) => {
    try {
      // Make API call

      if (!record) {
        // If record is null or undefined, return without making the API call
        return;
      }
      const response = await customAxios.delete(
        `${urlDeleteAppUser}?AppuserId=${record.AppUserId}`
      );

      if (response.data.data.Status === true) {
        var message1 = "User Deleted Successfully..";
        notification.success({
          message: "Success",
          description: message1,
        });
        fetchData();
      } else {
        notification.error({
          message: "Error",
          description: "Something Went Wrong.....",
        });
      }

      // Handle successful delete
    } catch (error) {}
  };

  const handleEditClick = (record) => {
    // setSelectedRecord(record);
    const UserId = record.AppUserId;
    navigate("employeecreateoredit", { state: { UserId } });
  };

  const handleReset = (record) => {


    setVisible(true);
    setRecord(record);
  };
  const onClose = () => {
    setVisible(false);
    setRecord([]);
    form.resetFields();
  };

  const onFinish =async (values) => {
    // Handle form submission
  
    try {
      const response = await customAxios.post(
        `${urlChangePassword}?oldpw=&newpw=${values.NewPassword}&AppUserId=${record.AppUserId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status===200 &&  response.data.data!=null){
        if(response.data.data===true){
          notification.success({
            message: "Password Changed Successfully..",
            duration:5,
            placement: "top",
          });
          onClose();
        }else{
          notification.warning({
            message: "Something Went Wrong",
            duration:5,
            placement: "top",
          });
          onClose();
        }
      }

    } catch (error) {
  
    }

    onClose(); // Close the drawer after form submission
  };

  const handleUser = () => {
    const UserId = 0;
    navigate("employeecreateoredit", { state: { UserId } });
  };

  const TabAccessData = useSelector((state) => state.TabAccessData.value);
  const UserGroup = TabAccessData?.filter((item) => {
    if (item.Group == "USER") {
      return item;
    }
  });
  let addUserAccess;
  let editUserAccess;
  let deleteUserAccess;

  UserGroup?.filter((item) => {
    if (item.Tab_Object_Name == "AddUser") {
      addUserAccess = item;
    } else if (item.Tab_Object_Name == "EditUser") {
      editUserAccess = item;
    } else if (item.Tab_Object_Name == "DeleteUser") {
      deleteUserAccess = item;
    }
  });

  return (
    <Layout style={{ backgroundColor: "#fff" }}>
      <Layout.Content>
        <Row style={{ padding: "0 3rem", backgroundColor: "lavender" }}>
          <Col>
            <h2>Employee List</h2>
          </Col>
        </Row>
        {addUserAccess?.AccessStatus && (
          <Row style={{ marginLeft: "2rem", marginTop: "1rem" }}>
            <Col span={3}>
              <Button
                onClick={handleUser}
                type="default"
                style={{
                  marginBottom: "1rem",
                }}
                icon={<UserAddOutlined style={{ fontSize: "1.2rem" }} />}
                size="large"
              >
                {addUserAccess?.Tab_Name}
              </Button>
            </Col>
          </Row>
        )}
        <Spin spinning={loading}>
          <CustomTable
            columns={columns}
            printTitle={"Employee Report"}
            dataSource={data}
            actionColumn={
              deleteUserAccess?.AccessStatus || editUserAccess?.AccessStatus
                ? true
                : false
            }
            onEdit={editUserAccess?.AccessStatus && handleEditClick}
            onDelete={deleteUserAccess?.AccessStatus && handleDelete}
            onReset={handleReset}
            isFilter={true}
            scroll={{
              x: 1000,
            }}
            rowKey={(record) => record.AppUserId} // use the id property as the key prop
          />
        </Spin>

        <Drawer
          title="Reset Password"
          placement="right"
          closable={false}
          onClose={onClose}
          open={visible}
          width={400}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please input the User ID!",
                },
              ]}
              label="User ID"
              name="UserId"
            >
              <Input disabled  />
            </Form.Item>
            <Form.Item
                name="NewPassword"
                label="NewPassword"
                rules={[
                  {
                    required: true,
                   
                    min: 6,
                  },
                ]}
                hasFeedback
              >
               <Input.Password placeholder="New Password" />
              </Form.Item>
            <Form.Item
                name="ConfirmPassword"
                label="ConfirmPassword"
                dependencies={['NewPassword']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    min: 6,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('NewPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The new password that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Reset Password
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </Form.Item>
          </Form>
        </Drawer>
      </Layout.Content>
    </Layout>
  );
};

export default User;
