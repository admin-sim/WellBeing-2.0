import {
  Form,
  Input,
  Button,
  DatePicker,
  Card,
  Row,
  Col,
  Layout,
  Table,
  Tooltip,
  Spin,
  Space,
  AutoComplete,
} from "antd";
import moment from "moment";
import {
  MinusCircleOutlined,
  CheckCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  urlSearchPatientsForLab,
  urlSearchUHID,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { useNavigate } from "react-router";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
const LabDashboard = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Ant Design Form hook
  const [loaddata, setLoadedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const handleAutoCompleteChange = async (value) => {
    try {
      if (!value.trim()) {
        setOptions([]); // Set options to an empty array
        return;
      }

      const response = await customAxios.get(`${urlSearchUHID}?Uhid=${value}`);
      const responseData = response.data.data || [];

      // Ensure responseData is an array and has the expected structure
      if (
        Array.isArray(responseData) &&
        responseData.length > 0 &&
        responseData[0].UhId !== undefined
      ) {
        const newOptions = responseData.map((option) => ({
          value: option.UhId,
          label: option.UhId,
          key: option.PatientId,
        }));
        setOptions(newOptions);
        // setOptions(responseData);
      } else {
        setOptions([]); // Set options to an empty array if the structure is not as expected
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setOptions([]); // Set options to an empty array in case of an error
    }
  };

  const handleSelect = (value, option) => {
    setSelectedUhId(option.value);
  };

  const handleSampleCollection = (record) => {
    // Navigate to the desired page and pass the record object as a parameter
    navigate("/SampleCollection", { state: { record } });
  };
  const handleResultEntry = (record) => {
    // Navigate to the desired page and pass the record object as a parameter
    navigate("/ResultEntry", { state: { record } });
  };

  const handleVerification = (record) => {
    // Navigate to the desired page and pass the record object as a parameter
    navigate("/Verification", { state: { record } });
  };

  const formatDatefortable = (dateString) => {
    if (!dateString) return '""';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const data = {
        Uhid: values.Uhid === undefined ? '""' : values.Uhid,
        PName: values.name === undefined ? '""' : values.name,
        PMobNum: values.mobileNumber === undefined ? '""' : values.mobilenumber,
        LabNumber: values.labNumber === undefined ? '""' : values.labNumber,
        Fromdate: values.fromDate ? values.fromDate.format("DD-MM-YYYY") : "",
        Todate: values.toDate ? values.toDate.format("DD-MM-YYYY") : "",
      };

      const response = await customAxios.get(urlSearchPatientsForLab, {
        params: data, // Pass form values as query parameters
      });
      const newColumnData = response.data.data.LabPatientsList.map(
        (obj, index) => {
          return { ...obj, key: index + 1 };
        }
      );
      // Update the state with the API response or handle it as needed
      setLoadedData(newColumnData);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false); // Set loading state to false when the operation is complete
    }

    // Reset the form fields
    form.resetFields();
  };

  const handleReset = () => {
    form.resetFields(); // Reset the form fields to their initial values
  };

  useEffect(() => {
    // Submit the form when the component mounts
    form.submit();
  }, []); // Empty dependency array ensures this useEffect runs once on component mount

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "UhId",
      dataIndex: "UhId",
      key: "UhId",
      sorter: (a, b) => a.UhId - b.UhId,
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <span style={{ fontWeight: "bold" }}>{record.UhId}</span>
      ),
      style: { background: "lightblue" },
    },
    {
      title: "Encounter",
      dataIndex: "Encounter",
      key: "Encounter",
      sorter: (a, b) => a.Encounter.localeCompare(b.Encounter),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Patient Details",
      dataIndex: "PatientFullName",
      key: "PatientFullName",
      sorter: (a, b) => a.PatientFullName.localeCompare(b.PatientFullName),
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <div>
          <p>
            <strong>Name:</strong> {record.PatientFullName}
            <br />
            <strong>Gender:</strong> {record.PatientGender}
            <br />
            <strong>Mob No:</strong> {record.MobileNumber}
            <br />
            <strong>Dob:</strong> {formatDatefortable(record.DateOfBirth)}{" "}
          </p>
        </div>
      ),
    },
    {
      title: "Bill Details",
      dataIndex: "BillStatus",
      key: "BillStatus",
      sorter: (a, b) => a.BillStatus.localeCompare(b.BillStatus),
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <div>
          <p>
            <strong>Patient Type:</strong> {record.PatientType}
            <br />
            <strong>Bill Status:</strong> {record.BillStatus}
          </p>
        </div>
      ),
    },
    {
      title: "Lab Number",
      dataIndex: "LabNumber",
      key: "LabNumber",
      sorter: (a, b) => a.LabNumber.localeCompare(b.LabNumber),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Order Date",
      dataIndex: "CreatedDateTime",
      key: "CreatedDateTime",
      sorter: (a, b) => a.CreatedDateTime.localeCompare(b.CreatedDateTime),
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <span style={{ fontWeight: "bold" }}>
          {formatDatefortable(record.CreatedDateTime)}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200, // Adjust the width as needed
      render: (text, record) => (
        <Space direction="vertical">
          {record.IsbillCancelled ? (
          <Space direction="vertical" align="start">
          <label style={{ color: "red" }}>Bill Cancelled</label>
          <span style={{  color: "gray" }}>
            {record.ModifiedDateTimestring}
          </span>
        </Space>
        
          ) : (
            <>
              {record.IsSmpPartiallyCollected === true &&
                !record.IsAllSampleCollected && (
                  <Space align="start">
                    <Button
                      type="link"
                      onClick={() => handleSampleCollection(record)}
                    >
                      Sample Collection
                    </Button>
                    <Tooltip
                      title="Sample Partially Collected"
                      placement="right"
                      overlayStyle={{ fontSize: "10px" }}
                    >
                      <PlusCircleOutlined style={{ color: "#f39c12" }} />
                    </Tooltip>
                  </Space>
                )}
              {record.IsAllSampleCollected && (
                <Space align="start">
                  <label>Sample Collection</label>
                  <Tooltip
                    title="All Samples Collected"
                    placement="right"
                    overlayStyle={{ fontSize: "10px" }}
                  >
                    <CheckCircleOutlined style={{ color: "green" }} />
                  </Tooltip>
                </Space>
              )}
              {!record.IsSmpPartiallyCollected && !record.IsAllSampleCollected && (
                <Space align="start">
                  <Button
                    type="link"
                    onClick={() => handleSampleCollection(record)}
                  >
                    Sample Collection
                  </Button>
                  <Tooltip
                    title="Sample Not Collected"
                    placement="right"
                    overlayStyle={{ fontSize: "10px" }}
                  >
                    <MinusCircleOutlined style={{ color: "#b98c54" }} />
                  </Tooltip>
                </Space>
              )}
    
              {record.IsResEntryPartiallyDone === true &&
                !record.IsAllResEntryDone && (
                  <Space align="start">
                    <Button type="link" onClick={() => handleResultEntry(record)}>
                      Result Entry
                    </Button>
                    <Tooltip
                      title="Result Entry Partially Done"
                      placement="right"
                      overlayStyle={{ fontSize: "10px" }}
                    >
                      <PlusCircleOutlined style={{ color: "#f39c12" }} />
                    </Tooltip>
                  </Space>
                )}
              {record.IsAllResEntryDone && (
                <Space align="start">
                  <label>Result Entry</label>
                  <Tooltip
                    title="All Result Entry Done"
                    placement="right"
                    overlayStyle={{ fontSize: "10px" }}
                  >
                    <CheckCircleOutlined style={{ color: "green" }} />
                  </Tooltip>
                </Space>
              )}
              {!record.IsResEntryPartiallyDone && !record.IsAllResEntryDone && (
                <Space align="start">
                  <Button type="link" onClick={() => handleResultEntry(record)}>
                    Result Entry
                  </Button>
                  <Tooltip
                    title="Result Entry Not Done"
                    placement="right"
                    overlayStyle={{ fontSize: "10px" }}
                  >
                    <MinusCircleOutlined style={{ color: "#b98c54" }} />
                  </Tooltip>
                </Space>
              )}
    
              {record.IsVerificationPartiallyDone === true &&
                !record.IsAllVerificationDone && (
                  <Space align="start">
                    <Button type="link" onClick={() => handleVerification(record)}>
                      Verification
                    </Button>
                    <Tooltip
                      title="Verification Partially Done"
                      placement="right"
                      overlayStyle={{ fontSize: "10px" }}
                    >
                      <PlusCircleOutlined style={{ color: "#f39c12" }} />
                    </Tooltip>
                  </Space>
                )}
              {record.IsAllVerificationDone && (
                <Space align="start">
                  <label>Verification</label>
                  <Tooltip
                    title="All Verification Done"
                    placement="right"
                    overlayStyle={{ fontSize: "10px" }}
                  >
                    <CheckCircleOutlined style={{ color: "green" }} />
                  </Tooltip>
                </Space>
              )}
              {!record.IsVerificationPartiallyDone &&
                !record.IsAllVerificationDone && (
                  <Space align="start">
                    <Button type="link" onClick={() => handleVerification(record)}>
                      Verification
                    </Button>
                    <Tooltip
                      title="Verification Not Done"
                      placement="right"
                      overlayStyle={{ fontSize: "10px" }}
                    >
                      <MinusCircleOutlined style={{ color: "#b98c54" }} />
                    </Tooltip>
                  </Space>
                )}
            </>
          )}
        </Space>
      ),
    }
    
  ];

  return (
    <Layout style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader title={"Laboratory Dashboard"} button={false} />
        <div
          style={{
            padding: "1rem",
            borderRadius: "0.5rem",
            margin: "1rem",
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
          }}
        >
          <Form
            initialValues={{
              toDate: dayjs(),
              fromDate: dayjs().subtract(1, "day").startOf("day"),
            }}
            layout="vertical"
            onFinish={onFinish}
            form={form}
          >
            <Row gutter={16} style={{ marginBottom: "12px" }}>
              <ColWithSixSpan>
                <Form.Item label="UHID" name="Uhid">
                  <AutoComplete
                    options={options}
                    onSearch={handleAutoCompleteChange}
                    onSelect={handleSelect}
                    value={selectedUhId}
                    filterOption={(inputValue, option) =>
                      option.value
                        .toUpperCase()
                        .includes(inputValue.toUpperCase())
                    }
                  />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="name" label="Name">
                  <Input placeholder="Enter Name" />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="mobile" label="Mobile Number">
                  <Input placeholder="Enter Mobile Number" />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="labNumber" label="Lab Number">
                  <Input placeholder="Enter Lab Number" />
                </Form.Item>
              </ColWithSixSpan>

              <ColWithSixSpan>
                <Form.Item
                  name="fromDate"
                  label="From Date"
                  rules={[{ required: true, message: "Please select a date!" }]}
                >
                  <DatePicker
                    value={fromDate}
                    onChange={(date) => setFromDate(date)}
                    disabledDate={(current) => current > moment()}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    placeholder="DD-MM-YYYY"
                    allowClear
                  />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="toDate"
                  label="To Date"
                  rules={[{ required: true, message: "Please select a date!" }]}
                >
                  <DatePicker
                    value={toDate}
                    onChange={(date) => setToDate(date)}
                    disabledDate={(current) => current < fromDate} // disable dates before fromDate
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    placeholder="DD-MM-YYYY"
                    allowClear
                  />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan style={{ display: "flex", alignItems: "end" }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item>
                      <Button htmlType="button" danger onClick={handleReset}>
                        Reset
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <div>
                  <span style={{ margin: "0 8px" }}>Partially Done </span>
                  <PlusCircleOutlined style={{ color: "#f39c12" }} />
                </div>

                <div>
                  <span style={{ margin: "0 8px" }}>Not Done</span>
                  <MinusCircleOutlined style={{ color: "#b98c54" }} />
                </div>

                <div>
                  <span style={{ margin: "0 8px" }}>All Done</span>
                  <CheckCircleOutlined style={{ color: "green" }} />
                </div>
              </ColWithSixSpan>
            </Row>
          </Form>
        </div>
        <Card
          title={
            <div style={{ textAlign: "center" }}>
             Patients Visit For Laboratory
            </div>
          }
          bordered={false}
          style={{
            margin: "1rem",
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
          }}
        >
          <Spin spinning={loading}>
            <Table
              dataSource={loaddata}
              columns={columns}
              rowKey={(row) => row.AppUserId} // Specify the custom id property here
              size="small"
              bordered
              scroll={{ x: 1200 }}
            />
          </Spin>
        </Card>
      </div>
    </Layout>
  );
};

export default LabDashboard;
