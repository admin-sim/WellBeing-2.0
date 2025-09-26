import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../../../../components/PageHeader";
import {
  DeleteOutlined,
  LeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
//import CustomTable from "../../../../../components/customTable";
import {
  Spin,
  Layout,
  Form,
  Select,
  Button,
  Table,
  Row,
  Col,
  message,
  InputNumber,
} from "antd";
import customAxios from "../../../../../components/customAxios/customAxios";

import { urlCreateAdmissionDeposit, urlSaveNewAdmissionDeposit } from "../../../../../../endpoints";
import { v4 as uuidv4 } from 'uuid';

const CreateAdmissionDeposit = () => {
 
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  const [facilities, setFacilities] = useState([]);
  const [accommodationType, setAccommodationType] = useState([]);
  const [patientType, setPatientType] = useState([]);



  const addRow = async () => {
    try {
      await form.validateFields();
      const newData = {
        key: uuidv4(),
        facilityName: "",
        accommodationType: "",
        patientType: "",
        admissionDeposit: "",
        status: "",
      };
     setData([...data, newData]);
     
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

   // Remove a row from the table
  const removeRow = (key) => {
    debugger;
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };
 


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    
    try {
      const response = await customAxios.get(`${urlCreateAdmissionDeposit}`);
      if (response.status == 200 && response.data.data != null) {
        setFacilities(response.data.data.FacilityType);
        setAccommodationType(response.data.data.AccommodationType);
        setPatientType(response.data.data.PatientType);
      }
    } catch (error) {
      console.error(error);
    }
   
  };

  const handleFieldChange = (e, column, index, record) => {
      const value = e.target.value;
    let newData = [...data];
   newData = newData.map((item) => {
    if (item.key === record.key) {
        return { ...item, [column]: value };
      }
      return item;
    });
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
            DepositAmount: item.admissionDeposit,
            ActiveFlag: item.status,

        }));

        // Call the API with the prepared data
        submitData(formData);
      }
    } catch (error) {
      console.error("Validation Failed:", error);
      
    }
  };

  const submitData = async (data) => {
    debugger;
    try {
        const response = await customAxios.post(urlSaveNewAdmissionDeposit, data, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.data.data === true) {
            // Show success message if data is true
            message.success('Data submitted successfully!');
            navigate("/AdmissionDeposit");
          
          } else {
            // Show error message if data is false (data already exists)
            message.error('This data already exists!');
          }
      console.log('API Response:', response);
    } catch (error) {
      message.error('Submission failed. Please try again!');
      console.error('API Error:', error);
    }
  };

  const columns = [
    {
      title: "Facility Name",
      dataIndex: "facilityName",
      editable: true,
      render: (_, record, index) => (
        <Form.Item
          name={[record.key,"facilityName"]} // Ensure dynamic naming with index
          initialValue={record.facilityName}
          rules={[{ required: true, message: "Facility Name is required!" }]}
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Select Facility"
            allowClear
	    onChange={(value) =>
              handleFieldChange({target:{value}}, "facilityName", index, record)
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
          name={[record.key,"accommodationType"]} // Ensure dynamic naming with index
          initialValue={record.accommodationType}
          rules={[
            { required: true, message: "Accommodation Type is required!" },
          ]}
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Select Accommodation Type"
            allowClear
             onChange={(value) =>
              handleFieldChange({target:{value}}, "accommodationType", index, record)
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
          name={[record.key, "patientType"]} // Ensure dynamic naming with index
          initialValue={record.patientType}
          rules={[{ required: true, message: "Patient Type is required!" }]}
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Select patientType"
            allowClear
              onChange={(value) =>
              handleFieldChange({target:{value}}, "patientType", index, record)
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
      title: "Admission Deposit",
      dataIndex: "admissionDeposit",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={[record.key,"admissionDeposit"]}
          initialValue={record.admissionDeposit}
          rules={[
            { required: true, message: "Admission Deposit is required!" },
          ]}
          style={{ margin: 0 }}
        >
          <InputNumber min={0}
          style={{ width: '100%' }}
            value={record.admissionDeposit}
            onChange={(value) =>
              handleFieldChange({target:{value}}, "admissionDeposit", null, record)
            }
          />
        </Form.Item>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      editable: true,
      render: (_, record, index) => (
        <Form.Item
          name={[record.key,"status"]}
          initialValue={record.status}
          rules={[{ required: true, message: "Status is required!" }]}
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Select Status"
            allowClear
            style={{ width: 100 }}
            // onChange={(value) => handleFieldChange(value, record.key, "status")}
            onChange={(value) =>
              handleFieldChange({target:{value}}, "status", index, record)
            }
          >
            <Select.Option key={true} value={true}>
              Active
            </Select.Option>
            <Select.Option key={false} value={false}>
              Hidden
            </Select.Option>
          </Select>
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
        >
          Add Row
        </Button>
      ),
      dataIndex: "action",
      width: 40,
      render: (_, record) => (
        <>
          {data.length > 1 && (
            <Button
              danger
              icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
              onClick={() => removeRow(record.key)}
            />
          )}
        </>
      ),
    },
  ];

  const handleCancel = () => {
    navigate("/AdmissionDeposit");
  };

  return (
    <>
      <Layout style={{ zIndex: "999999999" }}>
        <div
          style={{
            width: "100%",
            backgroundColor: "white",
            minHeight: "max-content",
            borderRadius: "10px",
          }}
        >
          <PageHeader
            title={"Admission Deposit"}
            buttonLabel={"Back"}
            buttonIcon={
              <LeftOutlined style={{ fontSize: "20px" }} />
            }
            onButtonClick={() => navigate("/AdmissionDeposit")}
          />

          <Form form={form} name="accommodation-form">
            <Table
              bordered
              dataSource={data}
              columns={columns}
              rowClassName="editable-row"
              pagination={false}
              style={{ margin: 10, padding: 10 }}
              rowKey="key"
              size="small"
            />
          </Form>

          <Row justify="end" style={{ margin: "1rem" }}>
            <Col style={{ marginRight: "10px" }}>
              <Button type="primary" onClick={handleSubmit}>Save</Button>
            </Col>
            <Col>
              <Button danger onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </div>
      </Layout>
    </>
  );
};

export default CreateAdmissionDeposit;
