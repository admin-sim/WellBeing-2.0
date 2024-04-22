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
import {
  MinusCircleOutlined,
  CheckCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  urlSearchPatientsForLab,
  urlSearchUHID,
} from "../../../../endpoints.js";
import { Link } from "react-router-dom";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { useNavigate } from "react-router";

import { useState, useEffect } from "react";
const LabDashboard = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm(); // Ant Design Form hook
  const [loaddata, setLoadedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRegFrom, setRegFrom] = useState(undefined);
  const [selectedRegTo, setRegTo] = useState(undefined);
  const [options, setOptions] = useState([]);
  const [selectedUhId, setSelectedUhId] = useState(null);

  const handleAutoCompleteChange = async (value) => {
    debugger;
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
    debugger;
    console.log("UhId", value);
    setSelectedUhId(option.value);
  };

  function formatDate(inputDate) {
    debugger;
    const dateParts = inputDate.split("-");
    if (dateParts.length === 3) {
      const [year, month, day] = dateParts;
      return `${day}-${month}-${year}`;
    }
    return inputDate; // Return as is if not in the expected format
  }

  const disabledDate = (current) => {
    // Disable dates that are in the future
    return current && current > new Date();
  };
  const handleSampleCollectionClick = (record) => {
    debugger;

    const url = `/SampleCollection/${record.PatientId}/${record.EncounterId}/${record.PatientLabStatusID}`;

    // Navigate to the new URL
    navigate(url);
  };
  const handleResultEntryClick = (record) => {
    // Handle the click event as needed
    const url = `/ResultEntryIndex/${record.PatientId}/${record.EncounterId}/${record.PatientLabStatusID}`;
    console.log("Navigating to:", url);
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
  const handleFromDateChange = (date, dateString) => {
    debugger;
    const dateinput1 = formatDate(dateString);
    setRegFrom(dateinput1);
  };
  const handleToDateChange = (date, dateString) => {
    const dateinput2 = formatDate(dateString);
    setRegTo(dateinput2);
  };
  const onFinish = async (values) => {
    debugger;
    console.log("Received values of form: ", values);
    values.fromDate = selectedRegFrom;
    values.todate = selectedRegTo;
    try {
      setLoading(true);
      const data = {
        Uhid: values.Uhid === undefined ? '""' : values.Uhid,
        PName: values.name === undefined ? '""' : values.name,
        PMobNum: values.mobileNumber === undefined ? '""' : values.mobilenumber,
        LabNumber: values.labNumber === undefined ? '""' : values.labNumber,
        Fromdate: values.fromDate === undefined ? '""' : values.fromDate,
        Todate: values.todate === undefined ? '""' : values.todate,
      };

      const response = await customAxios.get(urlSearchPatientsForLab, {
        params: data, // Pass form values as query parameters
      });

      console.log("API Response:", response.data.data.LabPatientsList);

      // Update the state with the API response or handle it as needed
      setLoadedData(response.data.data.LabPatientsList);
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
      title: "Sl No",
      key: "index",

      render: (text, record, index) => index + 1,
    },
    {
      title: "Uhid",
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
      title: "PatientDetails",
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
      title: "BillDetails",
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
      title: "LabNumber",
      dataIndex: "LabNumber",
      key: "LabNumber",
      sorter: (a, b) => a.LabNumber.localeCompare(b.LabNumber),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "OrderDate",
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
          {record.IsSmpPartiallyCollected === true &&
            !record.IsAllSampleCollected && (
              <Space align="start">
                <Link
                  to={`/SampleCollection/${record.PatientId}/${record.EncounterId}/${record.PatientLabStatusID}`}
                >
                  Sample Collection
                </Link>
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
              <Link
                to={`/SampleCollection/${record.PatientId}/${record.EncounterId}/${record.PatientLabStatusID}`}
              >
                <a onClick={() => handleSampleCollectionClick(record)}>
                  Sample Collection
                </a>
              </Link>
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
                <Link
                  to={`/ResultEntryIndex/${record.PatientId}/${record.EncounterId}/${record.PatientLabStatusID}`}
                >
                  Result Entry
                </Link>
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
              <Link
                to={`/ResultEntryIndex/${record.PatientId}/${record.EncounterId}/${record.PatientLabStatusID}`}
              >
                <a onClick={() => handleResultEntryClick(record)}>
                  Result Entry
                </a>
              </Link>
              <Tooltip
                title="Result Entry Not Done"
                placement="right"
                overlayStyle={{ fontSize: "10px" }}
              >
                <MinusCircleOutlined style={{ color: "#b98c54" }} />
              </Tooltip>
            </Space>
          )}
        </Space>
      ),
    },
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
        <Card
          title="Laboratory Dashboard"
          style={{
            margin: "1rem",
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
          }}
        >
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <Row gutter={24} style={{ marginBottom: "12px" }}>
              <Col span={6}>
                {/* <Form.Item name="uhid" label="UHID">
                  <Input placeholder="Enter UHID" />
                </Form.Item> */}
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
              </Col>
              <Col span={6}>
                <Form.Item name="name" label="Name">
                  <Input placeholder="Enter Name" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="mobile" label="Mobile Number">
                  <Input placeholder="Enter Mobile Number" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="labNumber" label="Lab Number">
                  <Input placeholder="Enter Lab Number" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={handleFromDateChange}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={handleToDateChange}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>
              <Col span={6} style={{ display: "flex", alignItems: "end" }}>
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
                      <Button htmlType="button" onClick={handleReset}>
                        Reset
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col
                span={6}
                style={
                  {
                    // marginTop: '20px',
                    // justifyContent: 'center',
                    // display: 'flex',
                    // flexDirection: 'column',
                    // alignItems: 'start',
                  }
                }
              >
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
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          title="Patients VisitFor Laboratory"
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
            ></Table>
          </Spin>
        </Card>
      </div>
    </Layout>
  );
};

export default LabDashboard;
