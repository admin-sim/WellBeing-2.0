import {
  Form,
  Input,
  Card,
  Row,
  Col,
  Layout,
  Table,
  Button,
  notification,
  Space,
  ConfigProvider,
  Spin,
  Divider,
} from "antd";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { useState, useEffect } from "react";
import {
  urlSampleCollectionIndex,
  urlSaveSampleColResult,
  urlGetPatientHeaderDetails,
  urlLoadSampleCollectionGrid,
} from "../../../../../endpoints.js";
import { useLocation } from "react-router-dom";
import PatientHeader from "../../../../components/PatientHeader/index.jsx";
import { useNavigate } from "react-router";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../../components/customGridColumns/index.jsx";
const SampleCollection = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Ant Design Form hook
  const [services, setServices] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [greenRow, setGreenRow] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const location = useLocation();
  const record = location.state.record;

  useEffect(() => {
    fetchDataHeader();
  }, []);

  const fetchDataHeader = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${record.PatientId}&EncounterId=${record.EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const detailsheader = response.data.data.EncounterModel;

        setPatientData(detailsheader);
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchChargeDetails();
  }, []);

  const LoadSampleCollectionGrid = async () => {
    try {
      const response = await customAxios.get(
        `${urlLoadSampleCollectionGrid}?PatientId=${record.PatientId}&EncounterId=${record.EncounterId}&SelclabId=${record.PatientLabStatusID}`
      );
      if (response.status === 200) {
        const services = response.data.data;
        setServices(
          services.map((item) => ({ ...item, key: item.SmpColHeaderId }))
        );
      } else {
        console.error("Failed to fetch patient details");
      }
      setTableLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableLoading(false);
    }
  };

  const fetchChargeDetails = async () => {
    setTableLoading(true);
    try {
      const response = await customAxios.get(
        `${urlSampleCollectionIndex}?PatientId=${record.PatientId}&EncounterId=${record.EncounterId}&SelclabId=${record.PatientLabStatusID}`
      );
      if (response.status === 200) {
        const patientdetail = response.data.data.ListOfSamplColTests;
        setServices(
          patientdetail.map((item) => ({ ...item, key: item.SmpColHeaderId }))
        );
      } else {
        console.error("Failed to fetch patient details");
      }
      setTableLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableLoading(false);
    }
  };

  const onFinish = async (values) => {
    if (selectedRow.length === 0) {
      notification.warning({
        message: "Warning",
        description: "Please select at least one test.",
      });
      return;
    }

    const updatedSelectedRowsData = selectedRow.map((row) => ({
      ...row,
      ...values,
    }));

    try {
      const response = await customAxios.post(
        urlSaveSampleColResult,
        updatedSelectedRowsData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data.Status !== "") {
        const message1 = "Sample Collected Successfully";
        notification.success({
          message: "Success",
          description: message1,
        });
        LoadSampleCollectionGrid();
        form.resetFields();
   setSelectedRow([]);
   setSelectedRowKeys([]);
      } else {
        notification.error({
          message: "Error",
          description: "Something Went Wrong.....",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error occurred while adding the user.",
      });
    }
  };

  const handleReset = async (values) => {};

  const columns = [
    { title: "Test Name", dataIndex: "TestName", key: "TestName" },
    { title: "Amount", dataIndex: "PatientNetAmount", key: "PatientNetAmount" },
    { title: "Lab Number", dataIndex: "LabNumber", key: "LabNumber" },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      const filteredSelectedRows = selectedRows.filter(
        (row) => !row.IsSampleCollected
      );
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRow(filteredSelectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.IsSampleCollected, // disable checkbox for rows where IsSampleCollected is true
    }),
    renderCell: (checked, record, index, originNode) => {
      if (record.IsSampleCollected) {
        // document.getElementById("custom-table-id").classList.add("green-row");
        setGreenRow("green-row");

        return <span>Done</span>;
      }
      return originNode;
    },
  };

  const handleResultEntry = () => {
    navigate("/ResultEntry", { state: { record } });
  };
  const handleVerification = () => {
    navigate("/Verification", { state: { record } });
  };
  const handleReport = () => {
    navigate("/Report", { state: { record } });
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
        <PageHeader title={"Sample Collection Index"} button={false} />
        <div style={{ padding: "0.5 1rem" }}>
          <Space style={{ margin: "1rem 1rem 0 1rem" }}>
            <Button type="primary">Sample Collection</Button>
            <Button onClick={() => handleResultEntry()}>Result Entry</Button>
            <Button onClick={() => handleVerification()}>Verification</Button>
            <Button onClick={() => handleReport()}>Report</Button>
          </Space>

          <Divider />
          <div style={{ margin: "0 1rem 1rem 1rem" }}>
            <PatientHeader patient={patientData} />
          </div>
          <Form
            layout="vertical"
            onFinish={onFinish}
            form={form}
            style={{ padding: " 0 0.5rem" }}
          >
            <ConfigProvider
              theme={{
                components: {
                  Table: {
                    rowSelectedBg: () => {
                      greenRow && "#a1f7a1";
                    },
                  },
                },
              }}
            >
              <Spin spinning={tableLoading}>
                <Table
                  className="custom-table"
                  id="custom-table-id"
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={services}
                  rowClassName={(record) =>
                    record.IsSampleCollected && greenRow
                  }
                  scroll={{ x: true }}
                  size="small"
                  bordered
                />
              </Spin>
            </ConfigProvider>

            <Row gutter={16} style={{ marginBottom: "12px" }}>
              <ColWithSixSpan>
                <Form.Item name="Container1" label="Container1">
                  <Input placeholder="" />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="Container2" label="Container2">
                  <Input placeholder="Enter Name" />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="Container3" label="Container3">
                  <Input placeholder="Enter Mobile Number" />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="Container4" label="Container4">
                  <Input placeholder="Enter Lab Number" />
                </Form.Item>
              </ColWithSixSpan>
            </Row>
            <Row justify="end" gutter={16}>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button danger onClick={handleReset}>
                    Clear
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default SampleCollection;
