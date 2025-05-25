import { Form, Input, Button, Row, Col, Layout, Spin, Select } from "antd";

import {
  urlGetAllFacilities,
  urlGetLastEncounter,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { useNavigate } from "react-router";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import UhidSelectComponent from "../../../components/UhidSelectComponent/index.jsx";

function PatientAccountAdvance() {
  const [form] = Form.useForm();
  const [reportUrl, setReportUrl] = useState(null);
  const [error, setError] = useState(null);
  const userContext = useSelector((state) => state.userContext.value);
  const [loading, setLoading] = useState(false);
  const [encounter, setEncounter] = useState([]);
  const [facilities, setFacilities] = useState([]);

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
    debugger;
    setLoading(true);
    setError(null);

    const request = {
      FacilityId: 1,
      PatientId: values.PatientId,
      EncounterId: values.EncounterId,
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
      "https://192.168.29.254:808/api/ReportsApi/GetPatientLedgerRpt",
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
              form.setFieldsValue({ Encounter: apiData[0].EncounterId });
              form.setFieldsValue({ EncounterId: apiData[0].EncounterId });
              form.setFieldsValue({ PatientId: option.data.PatientId });
            } else {
              setEncounter([]);
              form.setFieldsValue({ Encounter: "" });
              form.setFieldsValue({ EncounterId: "" });
              form.setFieldsValue({ PatientId: "" });
            }
          });
      } catch (error) {}
    } else {
      setEncounter([]);
      form.setFieldsValue({ EncounterId: "" });
      form.setFieldsValue({ Encounter: "" });
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
        <PageHeader title={"Patient Account Advance"} button={false} />
        <div
          style={{
            padding: "1rem",
            borderRadius: "0.5rem",
            margin: "1rem",
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
          }}
        >
          <Form layout="vertical" onFinish={onFinish} form={form}>
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
                <Form.Item name="UHID" label="UHID">
                  <UhidSelectComponent handleSelectUHID={handleSelect2} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="PatientName" label="Name">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="PatientId" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="EncounterId" hidden>
                  <Input />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Encounter Required.",
                    },
                  ]}
                  name="Encounter"
                  label="Encounter"
                >
                  <Select disabled={encounter.length > 1 ? false : true}>
                    {encounter.map((option) => (
                      <Select.Option
                        key={option.EncounterId}
                        value={option.EncounterId}
                      >
                        {option.GeneratedEncounterId}
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

export default PatientAccountAdvance;
