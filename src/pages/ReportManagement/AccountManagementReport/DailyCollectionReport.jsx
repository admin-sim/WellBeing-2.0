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
const DailyCollectionReport = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Ant Design Form hook
  const [users, setUsers] = useState([]);
  const [paymenttypes, setpaymentTypes] = useState([]);
  const [patientttypes, setPatientTypes] = useState([]);
  const [reportUrl, setReportUrl] = useState(null);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false); // State for loader visibility

  useEffect(() => {
    fetchDataHeader();
  }, []);

  const fetchDataHeader = async () => {
    try {
      const response = await customAxios.get(`${urlGetAllUsers}`);
      if (response.status === 200 && response.data != null) {
        const userdetail = response.data.data;
        setUsers(userdetail);
      } else {
      }
    } catch (error) {}

    try {
      const response = await customAxios.get(`${urlGetAllPaymentTypesAsync}`);
      if (response.status === 200 && response.data != null) {
        const paymentdetail = response.data.data.masters;
        setpaymentTypes(paymentdetail);
      } else {
      }
    } catch (error) {}
    try {
      const response = await customAxios.get(`${urlGetAllPatientTypeAsync}`);
      if (response.status === 200 && response.data != null) {
        const paymentdetail = response.data.data.masters;
        setPatientTypes(paymentdetail);
      } else {
      }
    } catch (error) {}
  };
  const onFinish = async (values) => {
    setLoading(true); // Show the loader when fetching the report
    setError(null); // Reset previous errors

    const request = {
      FacilityId: 1,
      FromDate: values.fromDate.format("DD-MM-YYYY"),
      ToDate: values.toDate.format("DD-MM-YYYY"),
      PatientType: values.PatientType,
      Receipttype: values.ReceiptType,
      PaymentType: values.PaymentType,
      ReportOption: values.ReportOptions,
      ReportType: values.ReportType,
      User: values.User,
    };

    try {
      const { url, blob } = await fetchReport(request);
      setReportUrl(url);
    //  setBlobData(blob); // You can use this if you want to download or process the blob.
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Hide the loader when fetching is complete
    }
  };

  async function fetchReport(request) {
    const response = await fetch(
      "https://192.168.29.254:808/api/ReportsApi/GetDailyCollectionReport",
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
        <PageHeader title={"Daily Collection Report"} button={false} />
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
              ReportOptions: "0",
              User: "",
              ReportType: "",
              PaymentType: "",
              ReceiptType: "",
              PatientType: "",
            }}
            layout="vertical"
            onFinish={onFinish}
            form={form}
          >
            <Row gutter={16} style={{ marginBottom: "12px" }}>
              <ColWithSixSpan>
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker
                    style={{ width: "100%" }}
                    format={"DD-MM-YYYY"}

                    // disabledDate={disabledDate}
                  />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format={"DD-MM-YYYY"} style={{ width: "100%" }} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="User" label="User">
                  <Select
                    showSearch
                    placeholder="Select the User"
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
                    <Select.Option key="all" value={""}>
                      All
                    </Select.Option>

                    {/* Mapping the users */}
                    {users?.map((response) => (
                      <Select.Option
                        key={response.ProviderId}
                        value={response.ProviderId}
                      >
                        {response.ProviderName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>

              <ColWithSixSpan>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Source Document Required.",
                    },
                  ]}
                  name="ReportOptions"
                  label="Report Options"
                >
                  <Select>
                    <Select.Option key="All" value="0">
                      All
                    </Select.Option>
                    <Select.Option key="Pharmacy" value="2">
                      Pharmacy
                    </Select.Option>
                    <Select.Option key="Regular" value="3">
                      Regular
                    </Select.Option>
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="ReportType" label="Report Type">
                  <Select>
                    <Select.Option key="Both" value="">
                      Both
                    </Select.Option>
                    <Select.Option key="Payer" value="1">
                      Payer
                    </Select.Option>
                    <Select.Option key="Patient" value="2">
                      Patient
                    </Select.Option>
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="PaymentType" label="Payment Type">
                  <Select
                    showSearch
                    placeholder="Select the PaymentType"
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
                    <Select.Option key="all" value={""}>
                      All
                    </Select.Option>

                    {/* Mapping the users */}
                    {paymenttypes?.map((response) => (
                      <Select.Option
                        key={response.LookupID}
                        value={response.LookupID}
                      >
                        {response.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="ReceiptType" label="Receipt Type">
                  <Select>
                    <Select.Option key="All" value="">
                      All
                    </Select.Option>
                    <Select.Option key="Deposit" value="Deposit">
                      Deposit
                    </Select.Option>
                    <Select.Option key="Receipt" value="Receipt">
                      Receipt
                    </Select.Option>
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="PatientType" label="Patient Type">
                  <Select
                    showSearch
                    placeholder="Select the PaymentType"
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
                    <Select.Option key="all" value={""}>
                      All
                    </Select.Option>

                    {/* Mapping the users */}
                    {patientttypes?.map((response) => (
                      <Select.Option
                        key={response.LookupID}
                        value={response.LookupID}
                      >
                        {response.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
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

export default DailyCollectionReport;
