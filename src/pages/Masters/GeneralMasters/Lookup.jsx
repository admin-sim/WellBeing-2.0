import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  Layout,
  ConfigProvider,
  notification,
  message,
} from "antd";
import Title from "antd/es/typography/Title";

import Input from "antd/es/input/Input";
import customAxios from "../../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";
import {
  urlGetAllGeneralLookUp,
  urlGetLookupDetails,
  urlAddandUpdateLookup,
} from "../../../../endpoints";
import CustomTable from "../../../components/customTable";

function Lookup() {
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [lookUpData, setLookUpData] = useState();
  const [isLookUpModalVisible, setIsLookUpModalVisible] = useState(false);
  const [lookUpTypeDropdown, setLookUpTypeDropdown] = useState({
    lookuptypes: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [IsSubmitClicked, setIsSubmitClicked] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;

    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllGeneralLookUp}`);
      const newColumnData = response.data.data.masters.map((obj, index) => {
        return { ...obj, key: index + 1 };
      });
      setColumnData(newColumnData);
      setLookUpTypeDropdown(response.data.data);
      console.log("data", newColumnData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Type",
      dataIndex: "LookupType",
      key: "LookupType",
    },
    {
      title: "Description",
      dataIndex: "LookupDescription",
      key: "LookupDescription",
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleAddLookupShowModal = () => {
    setIsLookUpModalVisible(true);
    setIsEditing(false);
    form.resetFields();
  };

  const handleLookUpEditModal = (record) => {
    // edit the item in your data here
    debugger;
    setLookUpData(record);
    setLoading(true);
    setIsEditing(true);
    customAxios
      .get(`${urlGetLookupDetails}?LookupId=${record.LookupID}`)
      .then((response) => {
        if (response.data !== null) {
          const lookUpData = response.data.data.master;
          setLookUpData(lookUpData);
          setIsLookUpModalVisible(true);
          form.setFieldsValue({
            Type: lookUpData.LookupType,
            Description: lookUpData.LookupDescription,
          });
          setLoading(false);
        }
      });
  };

  const handleLookUpModalCancel = () => {
    setIsLookUpModalVisible(false);
    setIsEditing(false);
    setIsSubmitClicked(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    debugger;
    form.validateFields();
    const values = form.getFieldsValue();
    setIsSubmitClicked(true);
    // console.log("Look up  Edit Modal Submit", values);
    if (values.Type !== undefined && values.Description !== undefined) {
      const master = isEditing
        ? {
            LookupID: lookUpData.LookupID,
            LookupType: lookUpData.LookupType,
            LookupDescription: values.Description,
          }
        : {
            LookupID: 0,
            LookupType: values.Type,
            LookupDescription: values.Description,
          };

      try {
        // Send a POST request to the server
        const response = await customAxios.post(urlAddandUpdateLookup, master, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data !== null) {
          if (response.data === "Already Exists") {
            // setIsModalOpen(false);
            setIsSubmitClicked(false);
            messageApi.warning({
              // type: "warning",
              content: `Lookup already exists`,
            });
          } else if (response.data.data !== null) {
            setIsSubmitClicked(false);
            setIsLookUpModalVisible(false);
            const lookUpDetails = response.data.data.masters.map(
              (obj, index) => {
                return { ...obj, key: index + 1 };
              }
            );
            setColumnData(lookUpDetails);
            {
              isEditing
                ? notification.success({
                    message: "Lookup details updated Successfully",
                  })
                : notification.success({
                    message: "Lookup details added Successfully",
                  });
            }
          } else {
            {
              isEditing
                ? notification.error({
                    message: "Lookup edit details UnSuccessful",
                  })
                : notification.error({
                    message: "Adding Lookup details UnSuccessful",
                  });
            }
          }
        }
      } catch (error) {
        console.error("Failed to send data to server: ", error);
      }
    } else {
      setIsSubmitClicked(false);
    }
  };

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
                General Lookup Master
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                icon={<PlusCircleOutlined />}
                onClick={handleAddLookupShowModal}
              >
                Add New Lookup
              </Button>
            </Col>
          </Row>
          <Spin spinning={loading}>
            <CustomTable
              columns={columns}
              dataSource={columnData}
              actionColumn={true}
              isFilter={true}
              onEdit={handleLookUpEditModal}
              // onView={true}
            />
          </Spin>
        </div>
      </Layout>
      {contextHolder}
      <Modal
        width={500}
        title={isEditing ? "EDIT LOOKUP " : "ADD NEW LOOKUP"}
        open={isLookUpModalVisible}
        onCancel={handleLookUpModalCancel}
        maskClosable={false}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={IsSubmitClicked}
            onClick={handleSubmit}
          >
            {/* {IsSubmitClicked ? "Submitting" : "Submit"} */}
            {isEditing ? "Update" : "Submit"}
          </Button>,
          <Button key="back" onClick={handleLookUpModalCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={12}>
              <Form.Item
                name="Type"
                label="Lookup Type"
                rules={[
                  {
                    required: true,
                    message: "Please select title",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    const description = option.children || "";
                    return description
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  filterSort={(optionA, optionB) => {
                    const descriptionA = optionA.children || "";
                    const descriptionB = optionB.children || "";
                    return descriptionA
                      .toLowerCase()
                      .localeCompare(descriptionB.toLowerCase());
                  }}
                  disabled={isEditing}
                  allowClear
                  placeholder="Select a type"
                >
                  {lookUpTypeDropdown.lookuptypes.map((option) => (
                    <Select.Option
                      key={option.LookupID}
                      value={option.LookupType}
                    >
                      {option.LookupType }
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Description"
                label="Lookup Description"
                rules={[
                  {
                    required: true,
                    message: "Please select title",
                  },
                ]}
              >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default Lookup;
