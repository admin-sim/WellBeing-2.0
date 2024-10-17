import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  DatePicker,
  Divider,
  notification,
  Table,
  Modal,
  Tooltip,
  Skeleton,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import Layout from "antd/es/layout/layout";
import { useNavigate } from "react-router";
import {
  urlGetAllServiceGroups,
  urlGetServiceClassificationsForServiceGroup,
  urlGetServicesForSelectedServiceClassification,
} from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";
import Title from "antd/es/typography/Title";
import { v4 as uuidv4 } from "uuid";
import CustomTable from "../../../../components/customTable";
const Service = () => {
  const [serviceGroups, setServiceGroups] = useState([]);
  const [serviceClassifications, setServiceClassifications] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceclassificationid, setServiceClassificationId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      debugger;
      try {
        const response = await customAxios.get(`${urlGetAllServiceGroups}`);
        if (response.status === 200) {
          const servicegroups = response.data.data.ServiceGroups; // Assuming your API response structure matches the provided data
          setServiceGroups(servicegroups);
        } else {
          console.error("Failed to fetch patient details");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleServiceGroupChange = async (value) => {
    debugger;
    if (value != null) {
      // Call your API here using the selected LookupID
      setServiceClassifications([]);
      form.setFieldsValue({ ServiceClassifications: null });
      const response = await customAxios.get(
        `${urlGetServiceClassificationsForServiceGroup}?ServiceGroupId=${value}`
      );
      //const data = await response.json();
      if (
        response.status === 200 &&
        response.data.data.ServiceClassifications != null
      ) {
        const classification = response.data.data.ServiceClassifications;
        setServiceClassifications(classification);
      }
    } else {
      // Clear the service classifications if the service group is cleared
      setServiceClassifications([]);
      form.setFieldsValue({ ServiceClassifications: null });
      setServices([]);
      setServiceClassificationId(null);
    }
  };

  const handleServiceClassificationChange = async (value) => {
    debugger;
    if (value) {
      setServiceClassificationId(value);
      try {
        // Call your API here using the selected ServiceClassificationId
        const response = await customAxios.get(
          `${urlGetServicesForSelectedServiceClassification}?ServiceClassificationId=${value}`
        );
        // const data = await response.json();
        if (response.status === 200) {
          const services = response.data.data.Services.map((item, index) => ({
            ...item,
            key: uuidv4(),
            slNo: index + 1,
          }));
          setServices(services);
        }
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error("Error fetching services:", error);
      }
    } else {
      // Clear the services if the service classification is cleared
      setServices([]);
      setServiceClassificationId(null);
    }
  };

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleCreateService = async () => {
    try {
      // Trigger form validation
      await form.validateFields();
      const serviceid =0;
      navigate("/CreateService", { state: { serviceclassificationid, serviceid } });
    } catch (error) {
      // If validation fails, errors will be thrown and can be caught here
      console.log("Validation failed:", error);
    }
  };
  const handleEdit =async (value) => {
    debugger;

    try {
      // Trigger form validation
      await form.validateFields();
      const serviceid =value.ServiceId;
      navigate("/CreateService", { state: { serviceclassificationid, serviceid } });
    } catch (error) {
      // If validation fails, errors will be thrown and can be caught here
      console.log("Validation failed:", error);
    }
    // try {
    //   // Call your API here using the selected ServiceClassificationId
    //   const response = await customAxios.get(
    //     `${urlEditService}?Id=${value.ServiceId}`
    //   );
    //   // const data = await response.json();
    //   if (response.status === 200) {
    //     const services = response.data.data.Services.map((item, index) => ({
    //       ...item,
    //       key: uuidv4(),
    //       slNo: index + 1,
    //     }));
    //     setServices(services);
    //   }
    // } catch (error) {
    //   // Handle any errors that occur during the API call
    //   console.error("Error fetching services:", error);
    // }


  };

  const columns = [
    {
      title: "Sl No",
      dataIndex: "slNo",
      width: 70,
    },
    {
      title: "ShortName",
      dataIndex: "ShortName",
    },
    {
      title: "LongName",
      dataIndex: "LongName",
    },
    {
      title: "UomName",
      dataIndex: "UomName",
    },
  ];

  return (
    <Layout style={{ zIndex: "999999999" }}>
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
            padding: "0.5rem 2rem 0rem 2rem",
            backgroundColor: "#40A2E3",
            borderRadius: "10px 10px 0px 0px ",
          }}
        >
          <Col span={16}>
            <Title level={4} style={{ color: "white", fontWeight: 500 }}>
              Service Definition Manager
            </Title>
          </Col>
          <Col offset={5} span={3}>
            <Button icon={<PlusCircleOutlined />} onClick={handleCreateService}>
              Create Service
            </Button>
          </Col>
        </Row>

        <Form
          layout="vertical"
          //onFinish={handleOnFinish}
          variant="outlined"
          size="default"
          style={{ padding: "0rem 2rem" }}
          form={form}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  label="ServiceGroups"
                  name="ServiceGroups"
                  rules={[
                    {
                      required: true,
                      message: "ServiceGroup Is Required",
                    },
                  ]}
                >
                  <Select allowClear onChange={handleServiceGroupChange}>
                    {serviceGroups.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  style={{ width: "100%" }}
                  label="Service Classifications"
                  name="ServiceClassifications"
                  rules={[
                    {
                      required: true,
                      message: "ServiceClassification Is Required",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    onChange={handleServiceClassificationChange}
                  >
                    {serviceClassifications.map((option) => (
                      <Select.Option
                        key={option.ServiceClassificationId}
                        value={option.ServiceClassificationId}
                      >
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
        <Divider orientation="left"></Divider>
        <CustomTable
          style={{ padding: "0rem 2rem" }}
          dataSource={services}
          columns={columns}
          onEdit={handleEdit}
          isFilter={true}
        />
      </div>
    </Layout>
  );
};
export default Service;
