import {
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Spin,
  Layout,
  notification,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Input from "antd/es/input/Input";
import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import customAxios from "../../../components/customAxios/customAxios";

import {
  urlGetAllStates,
  urlGetSelectedStateDetails,
  urlAddAndUpdateState,
  urlDeleteSelectedState,
} from "../../../../endpoints";
import CustomTable from "../../../components/customTable";

function States() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState();
  const [Dropdown, setDropdown] = useState({
    Countries: [],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllStates}`);
      const newColumnData = response.data.data.StateModel.map((obj, index) => {
        return { ...obj, key: index + 1 };
      });
      setColumnData(newColumnData);
      setDropdown(response.data.data);
      console.log("data", newColumnData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleAddStateShowModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    form.resetFields();
  };

  const handleStateEditModal = (record) => {
    // edit the item in your data here
    debugger;
    setStateData(record);
    setLoading(true);
    setIsEditing(true);
    customAxios
      .get(`${urlGetSelectedStateDetails}?stateId=${record.StateID}`)
      .then((response) => {
        if (response.data !== null) {
          const stateData = response.data.data.NewState;
          setStateData(stateData);
          setIsModalOpen(true);
          form.setFieldsValue({
            Country: stateData.CountryId,
            StateCode: stateData.StateCode,
            StateName: stateData.StateName,
          });
          setLoading(false);
        }
      });
  };

  const handleStateModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (record) => {
    debugger;
    //Deleting an State from the Table
    setStateData(record);
    try {
      customAxios
        .post(`${urlDeleteSelectedState}?StateId=${record.StateID}`)
        .then((response) => {
          if (response.data.data !== null) {
            const States = response.data.data.StateModel.map((obj, index) => {
              return { ...obj, key: index + 1 };
            });
            setColumnData(States);
            notification.success({
              message: "Deleted Successfully",
            });
          }
        });
    } catch (error) {
      notification.error({
        message: "Deleting UnSuccessful",
      });
    }
  };

  const handleSubmit = async () => {
    debugger;
    form.validateFields();
    const values = form.getFieldsValue();
    console.log("state Edit Modal Submit", values);
    // UpdateState(int StateId, string Name, string StateCode, int CountryId)
    // SaveNewState(int CountryId, string StateCode, string StateName)

    const state = isEditing
      ? {
          StateId: stateData.StateID,
          StateName: values.StateName,
          StateCode: values.StateCode,
          CountryId: stateData.CountryId,
        }
      : {
          StateId: 0,
          StateName: values.StateName,
          StateCode: values.StateCode,
          CountryId: values.Country,
        };

    try {
      // Send a POST request to the server
      const response = await customAxios.post(urlAddAndUpdateState, state, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.data !== null) {
        setIsModalOpen(false);
        const stateDetails = response.data.data.StateModel.map((obj, index) => {
          return { ...obj, key: index + 1 };
        });
        setColumnData(stateDetails);
        {
          isEditing
            ? notification.success({
                message: "State details updated Successfully",
              })
            : notification.success({
                message: "State details added Successfully",
              });
        }
      }
    } catch (error) {
      console.error("Failed to send data to server: ", error);

      {
        isEditing
          ? notification.error({
              message: "Edited State  details UnSuccessful",
            })
          : notification.error({
              message: "Adding State details UnSuccessful",
            });
      }
    }
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "State Name",
      dataIndex: "StateName",
      key: "StateName",
    },
    {
      title: "State Code",
      dataIndex: "StateCode",
      key: "StateCode",
    },
    {
      title: "Country",
      dataIndex: "CountryName",
      key: "CountryName",
    },
  ];

  return (
    <>
      <Layout>
        <div
          style={{
            width: "100%",
            backgroundColor: "white",
            minHeight: "max-content",
            borderRadius: "10px",
          }}
        >
          <Row
            style={{
              padding: "0.5rem 2rem 0.5rem 2rem",
              backgroundColor: "#40A2E3",
              borderRadius: "10px 10px 0px 0px ",
            }}
          >
            <Col span={16}>
              <Title
                level={4}
                style={{
                  color: "white",
                  fontWeight: 500,
                  margin: 0,
                  paddingTop: 0,
                }}
              >
                State Manager
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                icon={<PlusCircleOutlined />}
                onClick={handleAddStateShowModal}
              >
                Add New State
              </Button>
            </Col>
          </Row>

          <Spin spinning={loading}>
            <CustomTable
              columns={columns}
              dataSource={columnData}
              actionColumn={true}
              isFilter={true}
              onEdit={handleStateEditModal}
              onDelete={handleDelete}
            />
          </Spin>
          <Modal
            title="Add New State"
            open={isModalOpen}
            maskClosable={false}
            footer={null}
            onCancel={handleStateModalCancel}
          >
            <Form
              style={{ margin: "1rem 0" }}
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
            >
              <Form.Item
                name="Country"
                label="Country"
                rules={[
                  {
                    required: true,
                    message: "Please select Country",
                  },
                ]}
              >
                <Select
                  disabled={isEditing}
                  allowClear
                  placeholder="Select a type"
                >
                  {Dropdown.Countries.map((option) => (
                    <Select.Option
                      key={option.LookupID}
                      value={option.LookupID}
                    >
                      {option.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="StateCode"
                label="State Code"
                rules={[
                  {
                    required: true,

                    message: "Please enter state code",
                  },
                  {
                    pattern: new RegExp(/^[a-zA-Z]{1,5}$/),
                    message: "Enter valid state code",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="StateName"
                label="State Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter state name",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              <Row gutter={32} style={{ height: "1.8rem" }}>
                <Col offset={12} span={6}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item>
                    <Button type="default" onClick={handleStateModalCancel}>
                      Cancel
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
      </Layout>
    </>
  );
}

export default States;
