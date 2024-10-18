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
    debugger;

    fetchDataHeader();
  }, []);

  const fetchDataHeader = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${record.PatientId}&EncounterId=${record.EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        console.log("header", detailsheader);

        setPatientData(detailsheader);
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchChargeDetails();
  }, []);

  const LoadSampleCollectionGrid=async()=>{
    debugger;
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
  }

  const fetchChargeDetails = async () => {
    debugger;
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


  const handleResultEntry =()=>{
    navigate("/ResultEntry", { state: { record } });
  }
  const handleVerification = () => {
    debugger;
    navigate("/Verification", { state: { record } });
  };
  const handleReport =()=>{
    
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
        <Card
          title="SampleCollectionIndex"
          style={{
            margin: "1rem",
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
          }}
        >
          <Space style={{ marginTop: "16px" }}>
            <Button type="primary">Sample Collection</Button>
            <Button onClick={() => handleResultEntry()} >Result Entry</Button>
            <Button onClick={() => handleVerification()} >Verification</Button>
            <Button onClick={() => handleReport()} >Report</Button>
          </Space>
          <div style={{ margin: "0 2rem 1rem 2rem" }}>
            <PatientHeader patient={patientData} />
          </div>
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
