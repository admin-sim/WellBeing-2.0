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
  Select,
  Modal,
} from "antd";
import {
  MinusCircleOutlined,
  CheckCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  urlGetAllFacilities,
  urlGetAllPatientTypeAsync,
  urlGetAllPaymentTypesAsync,
  urlGetAllUsers,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { useNavigate } from "react-router";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
const PatientRegistartionReport = () => {
  const [form] = Form.useForm(); // Ant Design Form hook
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [reportUrl, setReportUrl] = useState(null);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false); // State for loader visibility

  useEffect(() => {
    fetchDataHeader();
  }, []);

  const fetchDataHeader = async () => {
    try {
      const response = await customAxios.get(`${urlGetAllFacilities}`);
      if (response.status === 200 && response.data != null) {
        const userdetail = response.data.data.FacilityModel;
        setFacilities(userdetail);
      } else {
      }
    } catch (error) {}
  };
  const onFinish = async (values) => {
    setLoading(true); // Show the loader when fetching the report
    setError(null); // Reset previous errors

    const request = {
      FromDate: values.fromDate.format("YYYY-MM-DD"),
      ToDate: values.toDate.format("YYYY-MM-DD"),
      FacilityId: values.FacilityId,
    };

    try {
      const { url, blob } = await fetchReport(request);
      setReportUrl(url);
      //setBlobData(blob); // You can use this if you want to download or process the blob.
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Hide the loader when fetching is complete
    }
  };

  async function fetchReport(request) {
    const response = await fetch(
      "http://localhost:43705/api/ReportsApi/GetAllPatientRegistrationReport",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );
    console.log("respo", response);

    if (!response.ok) {
      throw new Error("Failed to fetch report");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return { url, blob };
  }

  const handleReset = () => {
    form.resetFields(); // Reset the form fields to their initial values
  };

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
        <PageHeader title={"Patient Registartion Report"} button={false} />
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
              fromDate: dayjs(),
            }}
            layout="vertical"
            onFinish={onFinish}
            form={form}
          >
            <Row gutter={16} style={{ marginBottom: "12px" }}>
              <ColWithSixSpan>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please select a Facility!",
                    },
                  ]}
                  name="FacilityId"
                  label="Facility"
                >
                  <Select
                    showSearch
                    placeholder="Select the Facility"
                    style={{ width: "100%" }}
                    onChange={(value) => console.log(value)}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {/* "All" option as the first item */}
                    {/* <Select.Option key="all" value={"0"}>
                      All
                    </Select.Option> */}

                    {/* Mapping the users */}
                    {facilities?.map((option) => (
                      <Select.Option
                        key={option.FacilityId}
                        value={option.FacilityId}
                      >
                        {option.FacilityName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker
                    style={{ width: "100%" }}
                    format={"DD-MM-YYYY"}
                    allowClear={false}
                  />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker
                    allowClear={false}
                    format={"DD-MM-YYYY"}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </ColWithSixSpan>
            </Row>
            <Row gutter={16} justify="end" style={{ marginTop: "1rem" }}>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button htmlType="button" danger onClick={handleReset}>
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div style={{ position: "relative" }}>
            {loading && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // Light overlay
                  zIndex: 1000,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin size="large" />
              </div>
            )}

            {error && <div>Error: {error}</div>}

            {/* Conditionally render the report below the form */}
            {reportUrl && (
              <div style={{ marginTop: "20px" }}>
                <h3>Report</h3>
                <iframe
                  src={reportUrl}
                  style={{ width: "100%", height: "500px", border: "none" }}
                  title="Report"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientRegistartionReport;
