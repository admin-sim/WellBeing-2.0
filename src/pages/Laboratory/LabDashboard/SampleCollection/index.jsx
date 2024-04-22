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
} from "antd";

import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./style.css";

import {
  urlSampleCollectionIndex,
  urlGetPatientHeaderWithPatientIAndEncounterId,
  urlSaveSampleColResult,
} from "../../../../../endpoints.js";

const SampleCollection = () => {
  const [form] = Form.useForm(); // Ant Design Form hook
  const [selectedRecord, setSelectedRecord] = useState([]);
  const [services, setServices] = useState([]);
  const { patientId, encounterId, labnumber } = useParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [greenRow, setGreenRow] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [patientHeaderLoading, setPatientHeaderLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setPatientHeaderLoading(true);
      try {
        const response = await customAxios.get(
          `${urlGetPatientHeaderWithPatientIAndEncounterId}?PatientId=${patientId}&EncounterId=${encounterId}`
        );
        if (response.status === 200) {
          const patientdetail = response.data.data.EncounterModel;
          setSelectedRecord(patientdetail);
        } else {
          console.error("Failed to fetch patient details");
        }
        setPatientHeaderLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPatientHeaderLoading(false);
      }
    };

    fetchData();
  }, [patientId, encounterId]);

  useEffect(() => {
    fetchChargeDetails();
  }, [patientId, encounterId, labnumber]);

  const fetchChargeDetails = async () => {
    setTableLoading(true);
    try {
      const response = await customAxios.get(
        `${urlSampleCollectionIndex}?PatientId=${patientId}&EncounterId=${encounterId}&SelclabId=${labnumber}`
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
    debugger;
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
        fetchChargeDetails();
        form.resetFields();
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
  const formatDatefortable = (dateString) => {
    if (!dateString) return '""';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const columns = [
    { title: "TestName", dataIndex: "TestName", key: "TestName" },
    { title: "Amount", dataIndex: "PatientNetAmount", key: "PatientNetAmount" },
    { title: "LabNumber", dataIndex: "LabNumber", key: "LabNumber" },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      debugger;
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
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
          title="SampleCollectionIndex"
          style={{
            margin: "1rem",
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
          }}
        >
          <Space style={{ marginTop: "16px" }}>
            <Button type="primary">Sample Collection</Button>
            <Button>Result Entry</Button>
            <Button>Verification</Button>
            <Button>Report</Button>
          </Space>
          <Spin spinning={patientHeaderLoading}>
            <div
              style={{
                border: "1px solid #d9d9d9",
                padding: "16px",
                borderRadius: "4px",
                margin: "4px",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    UHID:
                  </span>
                  <span>{selectedRecord && selectedRecord.UhId}</span>
                </Col>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    Name:
                  </span>
                  <span>{selectedRecord && selectedRecord.PatientName}</span>
                </Col>
                <Col span={8}>
                  <span style={{ fontWeight: "bold" }}>PatientGender:</span>
                  <span>{selectedRecord && selectedRecord.PatientGender}</span>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    VIsitId:
                  </span>
                  <span>{selectedRecord && selectedRecord.UhId}</span>
                </Col>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    Age:
                  </span>
                  <span>{selectedRecord && selectedRecord.UhId}</span>
                </Col>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    Dob:
                  </span>
                  <span>
                    {selectedRecord &&
                      formatDatefortable(selectedRecord.DateOfBirth)}
                  </span>
                </Col>
              </Row>
            </div>
          </Spin>
          <Form layout="vertical" onFinish={onFinish} form={form}>
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

            <Row gutter={24} style={{ marginBottom: "12px" }}>
              <Col span={6}>
                <Form.Item name="Container1" label="Container1">
                  <Input placeholder="" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="Container2" label="Container2">
                  <Input placeholder="Enter Name" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="Container3" label="Container3">
                  <Input placeholder="Enter Mobile Number" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="Container4" label="Container4">
                  <Input placeholder="Enter Lab Number" />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col style={{ marginRight: "10px" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" onClick={handleReset}>
                    Clear
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default SampleCollection;
