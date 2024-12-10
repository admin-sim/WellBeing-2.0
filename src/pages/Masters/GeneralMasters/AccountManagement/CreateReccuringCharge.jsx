import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Form,
  notification,
  Layout,
  message,
  Row,
  Col,
  Checkbox,
  DatePicker,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  urlCreateAccomodationChargeAtribute,
  urlCreateRecuringCharge,
  urlGetAllAutocompleteRecurringServicesAsync,
  urlSaveNewChargeAttribute,
  urlSaveRecurringChargesModel,
} from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";
import { useNavigate } from "react-router";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import moment from "moment";
const { Option } = Select;

const CreateReccuringCharge = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [facilities, setFacilities] = useState([]);
  const [accommodationType, setAccommodationType] = useState([]);
  const [patientType, setpatientType] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    //setLoading(true);
    try {
      const response = await customAxios.get(`${urlCreateRecuringCharge}`);
      if (response.status == 200 && response.data.data != null) {
        setFacilities(response.data.data.FacilityType);
        setAccommodationType(response.data.data.AccommodationType);
        setpatientType(response.data.data.PatientType);
      }
    } catch (error) {
      console.error(error);
    }
    //setLoading(false);
  };

  // Add a new row to the table
  const addRow = () => {
    const newData = {
      key: count,
      facilityName: "", // Default value for the select
      accommodationType: "", // Default value for the select
      patientType: "",
      service: "",
      isProviderMandatory: false,
      isRuleApplicable: false,
      effectiveFrom: dayjs(),
      effectiveTo: dayjs(),
      quantity: "",
      rate: "",
      chargefrequency: "day",
      value: 1,
    };
    setData([...data, newData]);
    setCount(count + 1);
  };
  // Define the columns with Select for "Facility Name" and "Accommodation Type"
  const fetchRemoteServices = async (searchTerm) => {
    debugger;
    setLoadingServices(true);
    try {
      const response = await customAxios.get(
        `${urlGetAllAutocompleteRecurringServicesAsync}`,
        {
          params: { Description: searchTerm }, // Pass search term to API
        }
      );
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoadingServices(false);
    }
  };

  const columns = [
    {
      title: "Facility Name",
      dataIndex: "facilityName",
      editable: true,
      render: (_, record, index) => (
        <Form.Item
          name={`facilityName-${index}`} // Ensure dynamic naming with index
          initialValue={record.facilityName}
          rules={[{ required: true, message: "Facility Name is required!" }]}
          className="form-item-no-padding"
        >
          <Select
            placeholder="Select Facility"
            allowClear
            style={{ width: 100 }}
            onChange={(value) =>
              handleFieldChange(value, record.key, "facilityName")
            }
          >
            {facilities?.map((option) => (
              <Select.Option key={option.FacilityId} value={option.FacilityId}>
                {option.FacilityName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Accommodation Type",
      dataIndex: "accommodationType",
      editable: true,
      render: (_, record, index) => (
        <Form.Item
          name={`accommodationType-${index}`} // Ensure dynamic naming with index
          initialValue={record.accommodationType}
          rules={[
            { required: true, message: "Accommodation Type is required!" },
          ]}
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Select Accommodation Type"
            allowClear
            style={{ width: 100 }}
            onChange={(value) =>
              handleFieldChange(value, record.key, "accommodationType")
            }
          >
            {accommodationType?.map((option) => (
              <Select.Option key={option.LookupID} value={option.LookupID}>
                {option.LookupDescription}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Patient Type",
      dataIndex: "patientType",
      editable: true,
      render: (_, record, index) => (
        <Form.Item
          name={`patientType-${index}`} // Ensure dynamic naming with index
          initialValue={record.patientType}
          rules={[
            { required: true, message: "Accommodation Type is required!" },
          ]}
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Select patientType"
            allowClear
            style={{ width: 100 }}
            onChange={(value) =>
              handleFieldChange(value, record.key, "patientType")
            }
          >
            {patientType?.map((option) => (
              <Select.Option key={option.LookupID} value={option.LookupID}>
                {option.LookupDescription}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Service",
      dataIndex: "service",
      editable: true,

      render: (_, record) => (
        <Form.Item
          name={`service-${record.key}`}
          rules={[{ required: true, message: "Level of Service is required!" }]}
          style={{ margin: 0 }}
        >
          <Select
            showSearch
            placeholder="Select Service"
            allowClear
            style={{ width: 120 }}
            filterOption={false} // Disable client-side filtering
            onSearch={(value) => fetchRemoteServices(value)} // Trigger API call on search
            onChange={(value) =>
              handleFieldChange(value, record.key, "service")
            }
            loading={loadingServices} // Show loading indicator while fetching
          >
            {services?.map((service) => (
              <Select.Option key={service.Id} value={service.Id}>
                {service.Name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },

    {
      title: "IsProvider",
      dataIndex: "isProviderMandatory",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={`isProviderMandatory-${record.key}`}
          valuePropName="checked" // Required for Checkbox
          initialValue={record.isProviderMandatory}
          style={{ margin: 0 }}
        >
          <Checkbox
            onChange={(e) =>
              handleFieldChange(
                e.target.checked,
                record.key,
                "isProviderMandatory"
              )
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "IsRule",
      dataIndex: "isRuleApplicable",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={`isRuleApplicable-${record.key}`}
          valuePropName="checked" // Required for Checkbox
          initialValue={record.isRuleApplicable}
          style={{ margin: 0 }}
        >
          <Checkbox
            onChange={(e) =>
              handleFieldChange(
                e.target.checked,
                record.key,
                "isRuleApplicable"
              )
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Effective From",
      dataIndex: "effectiveFrom",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={`effectiveFrom-${record.key}`}
          initialValue={record.effectiveFrom}
          rules={[{ required: true, message: "Effective From is required!" }]}
          style={{ margin: 0 }}
        >
          <DatePicker
            style={{ width: 100 }}
            format="DD-MM-YYYY"
            onChange={(date, dateString) =>
              handleFieldChange(dateString, record.key, "effectiveFrom")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Effective To",
      dataIndex: "effectiveTo",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={`effectiveTo-${record.key}`}
          initialValue={record.effectiveTo}
          rules={[{ required: true, message: "Effective To is required!" }]}
          style={{ margin: 0 }}
        >
          <DatePicker
            style={{ width: 100 }}
            format="DD-MM-YYYY"
            onChange={(date, dateString) =>
              handleFieldChange(dateString, record.key, "effectiveTo")
            }
          />
        </Form.Item>
      ),
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={`quantity-${record.key}`}
          initialValue={record.quantity}
          rules={[
            {
              required: true,
              message: "quantity required!",
            },
          ]}
          style={{ margin: 0 }}
        >
          <Input
            type="number"
            value={record.quantity}
            onChange={(e) =>
              handleFieldChange(e.target.value, record.key, "quantity")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={`rate-${record.key}`}
          initialValue={record.rate}
          rules={[
            {
              required: true,
              message: "rate required!",
            },
          ]}
          style={{ margin: 0 }}
        >
          <Input
            style={{ width: 80 }}
            type="number"
            value={record.rate}
            onChange={(e) =>
              handleFieldChange(e.target.value, record.key, "rate")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Charge Frequency",
      dataIndex: "chargefrequency",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={`chargefrequency-${record.key}`}
          initialValue={record.chargefrequency}
          rules={[
            {
              required: true,
              message: "Charge Frequency is required!",
            },
          ]}
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Select Charge Frequency"
            allowClear
            style={{ width: 80 }}
            onChange={(value) =>
              handleFieldChange(value, record.key, "chargefrequency")
            }
          >
            <Select.Option value="day">Day</Select.Option>
            <Select.Option value="encounter">Encounter</Select.Option>
            <Select.Option value="hour">Hour</Select.Option>
            <Select.Option value="week">Week</Select.Option>
          </Select>
        </Form.Item>
      ),
    },

    {
      title: "Value",
      dataIndex: "value",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={`dischargeBedBlockHour-${record.key}`}
          initialValue={record.value}
          rules={[
            {
              required: true,
              message: "value is required!",
            },
          ]}
          style={{ margin: 0 }}
        >
          <Input
            style={{ width: 60 }}
            type="number"
            value={record.value}
            onChange={(e) =>
              handleFieldChange(e.target.value, record.key, "value")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={addRow} // Add a new row at the end of the table
          style={{ marginBottom: 16 }}
        ></Button>
      ),
      dataIndex: "action",
      width: 40,
      render: (_, record) => (
        <>
          {data.length > 1 && (
            <Button
              icon={<MinusCircleOutlined />}
              onClick={() => removeRow(record.key)}
            />
          )}
        </>
      ),
    },
  ];

  // Function to handle changes in field values
  const handleFieldChange = (value, key, column) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index][column] = value;
      setData(newData);
    }
  };

  // Remove a row from the table
  const removeRow = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const handleSubmit = async () => {
    debugger;
    try {
      // Trigger form validation
      const isValid = await form.validateFields();

      if (isValid) {
        // Prepare the data to be submitted (flatten the data array)
        const formData = data.map((item) => ({
          FacilityId: item.facilityName,
          AccommodationType: item.accommodationType,
          PatientType: item.patientType,
          ServiceId: item.service,
          IsProviderMandatory: item.isProviderMandatory,
          IsRuleApplicable: item.isRuleApplicable,
          SEffectiveFrom: item.effectiveFrom
            ? item.effectiveFrom.format("DD-MM-YYYY")
            : "", // Ensure you're sending the correct date format
          SEffectiveTo: item.effectiveTo
            ? item.effectiveTo.format("DD-MM-YYYY")
            : "", // Ensure you're sending the correct date format
          Quantity: item.quantity,
          Rate: item.rate,
          ChargeFrequency: item.chargefrequency, // Add the correct value for ChargeFrequency
          Value: item.value,
        }));

        // Call the API with the prepared data
        submitData(formData);
      }
    } catch (error) {
      console.error("Validation Failed:", error);
      message.error("Please fill all the required fields.");
    }
  };

  const submitData = async (data) => {
    try {
      const response = await customAxios.post(urlSaveRecurringChargesModel, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.data === true) {
        // Show success message if data is true
        message.success("Data submitted successfully!");
        navigate("/ReccuringCharge");
      } else {
        // Show error message if data is false (data already exists)
        message.error("This data already exists!");
      }
      console.log("API Response:", response);
    } catch (error) {
      message.error("Submission failed. Please try again!");
      console.error("API Error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/ReccuringCharge");
  };

  return (
    <Layout>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
          padding: "20px",
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
              ReccuringCharge
            </Title>
          </Col>
        </Row>
        <Form form={form} name="accommodation-form">
          <Table
            bordered
            dataSource={data}
            columns={columns}
            rowClassName="editable-row"
            pagination={false}
            style={{ margin: 0, padding: 0 }}
            rowKey="key"
            size="small"
          />
        </Form>

        <Row justify="end" style={{ margin: "1rem" }}>
          <Col style={{ marginRight: "10px" }}>
            <Button type="primary" onClick={handleSubmit}>
              Save
            </Button>
          </Col>
          <Col>
            <Button danger onClick={handleCancel}>
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};
export default CreateReccuringCharge;
