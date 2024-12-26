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
  urlGetAllDepartments,
  urlGetAllFacilities,
  urlGetAllPatientTypeAsync,
  urlGetAllPaymentTypesAsync,
  urlGetAllProviders,
  urlGetAllUsers,
  urlGetProviderBasedOnDept,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { useNavigate } from "react-router";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
const EncounterRegistrationReport = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Ant Design Form hook
  const [providers, setProviders] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [patientttypes, setPatientTypes] = useState([]);
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
           // Set default value for FacilityId
           if (userdetail.length > 0) {
            form.setFieldsValue({ FacilityId: userdetail[0].FacilityId });
          }
      } else {
      }
    } catch (error) {}
  
    try {
      const response = await customAxios.get(`${urlGetAllDepartments}`);
      if (response.status === 200 && response.data != null) {
        const paymentdetail = response.data.data.DepartmentModel;
        setDepartments(paymentdetail);
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
      FacilityId: values.FacilityId ?  values.FacilityId : "",
      FromDate: values.fromDate.format("YYYY-MM-DD"),
      ToDate: values.toDate.format("YYYY-MM-DD"),
      PatientType: values.PatientType,
      DeptId: values.department,
      ProviderId: values.Provider,
      VisitType: values.VisitType,
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
      "https://192.168.29.254:808/api/ReportsApi/GetEncounterReport",
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

  const handleDepartmentChange = async (value) => {
   // setProviderLoading(true);
    //setCalendarData(null);
    form.resetFields(["Provider"]);


    try {
      const response = await customAxios.get(
        `${urlGetProviderBasedOnDept}?Id=${value}`
      );

      setProviders(response.data.data);

      console.log("Deaprtment", response?.data.data);
      if (response.data != null) {
        console.log("check the value for response", response.data);
      } else {
        console.log("check the value for response", response.data);
      }
     // setProviderLoading(false);
    } catch (error) {
      console.error(error);
     // setProviderLoading(false);
    }
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
        <PageHeader title={"Encounter Report"} button={false} />
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
              PatientType: "",
              FacilityId: facilities?.length > 0 ? facilities[0].FacilityId : "",
              department: "",
              Provider: "",
              VisitType:"3"
            }}
            layout="vertical"
            onFinish={onFinish}
            form={form}
          >
            <Row gutter={16} style={{ marginBottom: "12px" }}>
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
              <ColWithSixSpan>
                <Form.Item name="FacilityId" label="Facility">
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
                    <Select.Option key="all" value={""}>
                      All
                    </Select.Option>

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
                <Form.Item name="department" label="Department">
                  <Select

                    onChange={handleDepartmentChange}
                    showSearch
                    placeholder="Select the provider"
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                       <Select.Option key="all" value={""}>
                      All
                    </Select.Option>
                    {departments?.map((response) => (
                      <Select.Option
                        key={response.DepartmentId}
                        value={response.DepartmentId}
                      >
                        {response.DepartmentName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="Provider" label="Provider">
                  <Select
        
                    showSearch
                    placeholder="Select the provider"
                    style={{ width: "100%" }}
                    //onChange={handleProviderChange}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                       <Select.Option key="all" value={""}>
                      All
                    </Select.Option>
                    {providers?.map((response) => (
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
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Source Document Required.",
                    },
                  ]}
                  name="VisitType"
                  label="Visit Type"
                >
                  <Select>
                    <Select.Option key="New" value="1">
                      New
                    </Select.Option>
                    <Select.Option key="Revisit" value="2">
                      Revisit
                    </Select.Option>
                    <Select.Option key="Both" value="3">
                      Both
                    </Select.Option>
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

export default EncounterRegistrationReport;
