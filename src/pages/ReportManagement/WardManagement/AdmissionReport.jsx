import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Layout,
  Spin,
  Select,
  DatePicker,
} from "antd";

import {
  urlGetAllDepartments,
  urlGetAllFacilities,
  urlGetAllPatientTypeAsync,
  urlGetFacilityDepartmentServiceLocationBasedOnFacilityId,
  urlGetLastEncounter,
  urlGetProviderBasedOnDept,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { useNavigate } from "react-router";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import UhidSelectComponent from "../../../components/UhidSelectComponent/index.jsx";
import dayjs from "dayjs";

function AdmissionReport() {
  const [form] = Form.useForm();
  const [reportUrl, setReportUrl] = useState(null);
  const [error, setError] = useState(null);
  const userContext = useSelector((state) => state.userContext.value);
  const [loading, setLoading] = useState(false);
  const [encounter, setEncounter] = useState([]);
  const [patientttypes, setPatientTypes] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceLocation, setServiceLocation] = useState([]);

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
    GetServiceLocation(0);
  };

  async function GetServiceLocation(id) {
    debugger;
    try {
      const response = await customAxios.get(
        `${urlGetFacilityDepartmentServiceLocationBasedOnFacilityId}?FacilityDepartmentId=${id}`
      );
      if (response.status === 200 && response.data != null) {
        const paymentdetail = response.data.data;
        setServiceLocation(paymentdetail);
      } else {
      }
    } catch (error) {}
  }

  const handleDepartmentChange = async (value) => {
    // setProviderLoading(true);
    //setCalendarData(null);
    GetServiceLocation(value == "" ? 0 : value);
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

  const onFinish = async (values) => {
    debugger;
    setLoading(true);
    setError(null);

    if (values.Provider === "") {
      values.Provider = 0;
    }

    const request = {
      Facility: 1,
      Dept: values.Department,
      FromDate: values.FromDate.format("DD-MM-YYYY"),
      ToDate: values.ToDate.format("DD-MM-YYYY"),
      PatientType: values.PatientType,
      Service: values.ServiceLocation == "" ? 0 : values.ServiceLocation,
      Provider: values.Provider == "" ? 0 : values.Provider,
      Type: "A",
      AppUser: userContext.AppUserName,
    };

    try {
      const { url, blob } = await fetchReport(request);
      setReportUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  async function fetchReport(request) {
    const response = await fetch(
      "https://192.168.29.254:808/api/ReportsApi/GetAddmission_or_InPatientRpt_Discharge",
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
    form.resetFields();
  };

  function handleSelect2(value, option) {
    if (value) {
      form.setFieldsValue({
        PatientName:
          option.data.PatientFirstName + " " + option.data.PatientLastName,
      });
      form.setFieldsValue({ PatientId: option.data.PatientId });
      try {
        customAxios
          .get(`${urlGetLastEncounter}?patientId=${option.data.PatientId}`)
          .then((response) => {
            const apiData = response.data;
            if (apiData.length > 0) {
              setEncounter(apiData);
              //   form.setFieldsValue({ Encounter: apiData[0].EncounterId });
              //   form.setFieldsValue({ EncounterId: apiData[0].EncounterId });
              form.setFieldsValue({ PatientId: option.data.PatientId });
            } else {
              setEncounter([]);
              //   form.setFieldsValue({ Encounter: "" });
              //   form.setFieldsValue({ EncounterId: "" });
              form.setFieldsValue({ PatientId: "" });
            }
          });
      } catch (error) {}
    } else {
      setEncounter([]);
      //   form.setFieldsValue({ EncounterId: "" });
      //   form.setFieldsValue({ Encounter: "" });
      form.setFieldsValue({ PatientId: "" });
      form.setFieldsValue({ PatientName: "" });
    }
  }

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
        <PageHeader title={"Admission Report"} button={false} />
        <div
          style={{
            padding: "1rem",
            borderRadius: "0.5rem",
            margin: "1rem",
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
          }}
        >
          <Form
            layout="vertical"
            onFinish={onFinish}
            form={form}
            initialValues={{
              ToDate: dayjs(),
              FromDate: dayjs(),
              Department: "",
              Provider: "",
              PatientType: 12155,
              ServiceLocation: "",
            }}
          >
            <Row gutter={16} style={{ marginBottom: "12px" }}>
              <ColWithSixSpan>
                <Form.Item
                  name="Facility"
                  label="Facility"
                  rules={[
                    {
                      required: true,
                      message: "Facility Required.",
                    },
                  ]}
                >
                  <Select placeholder="Select Facility" allowClear>
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
                <Form.Item name="Department" label="Department">
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
                <Form.Item name="ServiceLocation" label="Service Location">
                  <Select>
                    <Select.Option key="all" value={""}>
                      All
                    </Select.Option>
                    {serviceLocation?.map((response) => (
                      <Select.Option
                        key={response.FacilityDepartmentServiceLocationId}
                        value={response.FacilityDepartmentServiceLocationId}
                      >
                        {response.ServiceLocationName}
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
                <Form.Item
                  name="FromDate"
                  label="From Date"
                  rules={[
                    {
                      required: true,
                      message: "Date Required.",
                    },
                  ]}
                >
                  <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="ToDate"
                  label="To Date"
                  rules={[
                    {
                      required: true,
                      message: "Date Required.",
                    },
                  ]}
                >
                  <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
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
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
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
}

export default AdmissionReport;
