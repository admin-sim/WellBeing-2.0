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
  Spin,
} from "antd";
import { MinusCircleOutlined, PlusOutlined,LeftOutlined } from "@ant-design/icons";
import { urlCreateAccomodationChargeAtribute, urlSaveNewChargeAttribute, urlGetAllAccomodationChargeAtribute } from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";
import { useNavigate, useLocation } from "react-router";
import Title from "antd/es/typography/Title";
const { Option } = Select;
import PageHeader from "../../../../components/PageHeader";
import { v4 as uuidv4 } from 'uuid';


const CreateAccomodationCharge = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [facilities, setFacilities] = useState([]);
  const [accommodationType, setAccommodationType] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const AccommodationAttributeId = location.state?.AccommodationAttributeId;
const [loading, setLoading] = useState(false);



  useEffect(() => {
    fetchData();
    if (AccommodationAttributeId) {
      fetchExistingById(AccommodationAttributeId);
    }
  }, [AccommodationAttributeId]);

  const fetchData = async () => {
    //setLoading(true);
    try {
      const response = await customAxios.get(
        `${urlCreateAccomodationChargeAtribute}`
      );
      if (response.status == 200 && response.data.data != null) {
        setFacilities(response.data.data.FacilityType);
        setAccommodationType(response.data.data.AccommodationType);
      }
    } catch (error) {
      console.error(error);
    }
    //setLoading(false);
  };

const fetchExistingById = async (id) => {
  debugger;
setLoading(true);
  try {
  const response = await customAxios.get(`${urlGetAllAccomodationChargeAtribute}`);
  if ( response.status === 200 && response.data?.data?.AccommodationTypeAttributeList) {
    const list = response.data.data.AccommodationTypeAttributeList;
     const found = list.find((x) => String(x.AccommodationAttributeId) === String(id));
            if (found) {
              const row = {
                key: uuidv4(),
                facilityName: found.FacilityId,
                accommodationType: found.AccommodationType,
                levelOfService: found.LevelOfService,
                minChargeHours: found.MinimumChargeHour,
                dischargeGraceHour:found.DischargeGraceHour,
                dischargeBedBlockHour:found.DischargeBedBlockHour,
                status: found.ActiveFlag,
                AccommodationAttributeId: found.AccommodationAttributeId,
              };
              setData([row]);
            }
 }
} catch (error) {
  console.error('Error fetching existing data by ID:', error);
}
setLoading(false);
};


  // Add a new row to the table
  const addRow = () => {
    const newData = {
      key: uuidv4(),
      facilityName: "", // Default value for the select
      accommodationType: "", // Default value for the select
      levelOfService: "",
      minChargeHours: "",
      dischargeGraceHour: "",
      dischargeBedBlockHour: "",
      status: "",
    };
    setData([...data, newData]);
    setCount(count + 1);
  };
  // Define the columns with Select for "Facility Name" and "Accommodation Type"

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
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Select Facility"
            allowClear
            style={{ width: 120 }}
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
            style={{ width: 120 }}
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
      title: "Level of Service",
      dataIndex: "levelOfService",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={`levelOfService-${record.key}`}
          initialValue={record.levelOfService}
          rules={[{ required: true, message: "Level of Service is required!" }]}
          style={{ margin: 0 }}
        >
          <Input
            value={record.levelOfService}
            onChange={(e) =>
              handleFieldChange(e.target.value, record.key, "levelOfService")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Minimum Charge Hours",
      dataIndex: "minChargeHours",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={`minChargeHours-${record.key}`}
          initialValue={record.minChargeHours}
          rules={[
            { required: true, message: "Minimum Charge Hours are required!" },
          ]}
          style={{ margin: 0 }}
        >
          <Input
            type="number"
            value={record.minChargeHours}
            onChange={(e) =>
              handleFieldChange(e.target.value, record.key, "minChargeHours")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Discharge Grace Hour",
      dataIndex: "dischargeGraceHour",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={`dischargeGraceHour-${record.key}`}
          initialValue={record.dischargeGraceHour}
          rules={[
            { required: true, message: "Discharge Grace Hour is required!" },
          ]}
          style={{ margin: 0 }}
        >
          <Input
            type="number"
            value={record.dischargeGraceHour}
            onChange={(e) =>
              handleFieldChange(
                e.target.value,
                record.key,
                "dischargeGraceHour"
              )
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Discharge Bed Block Hour",
      dataIndex: "dischargeBedBlockHour",
      editable: true,
      render: (_, record) => (
        <Form.Item
          name={`dischargeBedBlockHour-${record.key}`}
          initialValue={record.dischargeBedBlockHour}
          rules={[
            {
              required: true,
              message: "Discharge Bed Block Hour is required!",
            },
          ]}
          style={{ margin: 0 }}
        >
          <Input
            type="number"
            value={record.dischargeBedBlockHour}
            onChange={(e) =>
              handleFieldChange(
                e.target.value,
                record.key,
                "dischargeBedBlockHour"
              )
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
        >
          Add Row
        </Button>
      ),
      dataIndex: "action",
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
            LevelOfService: item.levelOfService,
            MinimumChargeHour: item.minChargeHours,
            DischargeGraceHour: item.dischargeGraceHour,
            DischargeBedBlockHour: item.dischargeBedBlockHour,
            ActiveFlag: item.status || true,
            AccommodationAttributeId: item.AccommodationAttributeId || 0, // Use existing ID or 0 for new entries
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
        const response = await customAxios.post(urlSaveNewChargeAttribute, data, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.data.data === true) {
            // Show success message if data is true
            message.success('Data submitted successfully!');
            navigate("/AccomodationCharge");
          
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


  const handleCancel = () => {
    navigate("/AccomodationCharge");
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
                <PageHeader
            title={"Accommodation Charge Attribute"}
            buttonLabel={"Back"}
            onButtonClick={()=> navigate("/AccomodationCharge")}
            buttonIcon={<LeftOutlined />}></PageHeader>

        <Form form={form} name="accommodation-form">
          <Spin spinning={loading}>
          <Table
            bordered
            dataSource={data}
            columns={columns}
            rowClassName="editable-row"
            pagination={false}
            rowKey="key"
          />
          </Spin>
        </Form>

        <Row justify="end" style={{margin:"1rem"}}>
              <Col style={{ marginRight: "10px" }}>
                <Button type="primary"  onClick={handleSubmit} >
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
export default CreateAccomodationCharge;
