import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Popconfirm,
  Input,
  InputNumber,
  ConfigProvider,
  Row,
  Select,
  message,
  DatePicker,
  Table,
  Tooltip,
  AutoComplete,
  Typography,
  Empty,
  Spin,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  LeftOutlined,
  PlusOutlined,
  CloseSquareFilled,
} from "@ant-design/icons";
import Layout from "antd/es/layout/layout";
const { Text } = Typography;
import { Tabs } from "antd";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";
import CustomTable from "../../../components/customTable/index.jsx";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { urlPharmacyPrescription } from "../../../../endpoints.js";
import { Link, useNavigate } from "react-router-dom";

const PharamcyPrescriptionIndex = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [prescriptionDetails, setPrescriptionDetails] = useState([]);
  const [PatientAccountCharges, setPatientAccountCharges] = useState([]);

  const handleOnFinish = () => {};
  const handlePatientTrackingSearch = () => {};
  const { TabPane } = Tabs;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;
    try {
      const response = await customAxios.get(`${urlPharmacyPrescription}`);

      if (response.data != null) {
        const newColumnData = response.data.data.PatientAccountCharges.map(
          (obj, index) => {
            return { ...obj, key: index + 1 };
          }
        );
        setPatientAccountCharges(newColumnData);

        const existingprescription =
          response.data.data.ExistingPrescriptionModel.map((obj, index) => {
            return { ...obj, key: index + 1 };
          });
        setPrescriptionDetails(existingprescription);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const handleNavigate = (values) => {
    debugger;
    const url = `/OtcDispense`;
    navigate(url, {
      state: {
        PatientId: values.PatientId,
        EncounterId: values.EncounterId,
        flag : 1
      },
    });
  };
  const handleNavigateTopharmacy = (values) => {
    debugger;
    const url = `/OtcDispense`;
    navigate(url, {
      state: {
        PatientId: values.PatientId,
        EncounterId: values.EncounterId,
        flag : 2
      },
    });
  };

  const columns = [
      {
        title: "Order ID",
        dataIndex: "PrescriptionId",
        render: (text, record) => (
            <a onClick={() => handleNavigate(record)}  style={{ color: 'blue' }}>
                {text}
            </a>
        ),
    },
 
    {
      title: "Order Date",
      dataIndex: "OrderDateString",
    },
    {
      title: "UHID",
      dataIndex: "Uhid",
    },
    {
      title: "Encounter ID",
      dataIndex: "Encounter",
    },
    {
      title: "Patient Name",
      dataIndex: "Patientname",
    },
    {
      title: "Department",
      dataIndex: "DeptName",
    },
    {
      title: "Ordering Physician",
      dataIndex: "ProviderName",
    },
  ];

  const Chargescolumns = [
    {
      title: "Order ID",
      dataIndex: "key",
      render: (text, record) => (
        <a onClick={() => handleNavigateTopharmacy(record)}  style={{ color: 'blue' }}>
            {text}
        </a>
    ),
    },
    {
      title: "Order Date",
      dataIndex: "StrServiceDate",
    },
    {
      title: "UHID",
      dataIndex: "Uhid",
    },
    {
      title: "Encounter ID",
      dataIndex: "Encounter",
    },
    {
      title: "Patient Name",
      dataIndex: "PatientName",
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",
    },
    {
      title: "Ordering Physician",
      dataIndex: "ProviderName",
    },
  ];

  return (
    <Layout style={{ zIndex: "999999999" }}>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <Row
          style={{
            padding: "0.2rem 2rem 0rem 2rem",
            backgroundColor: "#40A2E3",
            borderRadius: "5px 5px 0px 0px ",
          }}
        ></Row>
        <Form
          layout="vertical"
          onFinish={handleOnFinish}
          variant="outlined"
          style={{ padding: "0rem 1rem" }}
          form={form}
          initialValues={{}}
        >
          <div style={{ margin: "20px" }}>
            <Tabs type="card" defaultActiveKey="1">
              <TabPane tab="Prescription" key="1">
                {/* Your prescription content goes here */}
                <p>This is the Prescription tab content.</p>
                <Form
                  form={form}
                  onFinish={handlePatientTrackingSearch}
                  layout="vertical"
                >
                  <Spin spinning={loading}>
                    <Row gutter={16}>
                      <Col span={24} style={{ padding: "0" }}>
                        <CustomTable
                          dataSource={prescriptionDetails}
                          columns={columns}
                          actionColumn={false}
                          isFilter={true}
                        />
                      </Col>
                    </Row>
                  </Spin>
                </Form>
              </TabPane>
              <TabPane tab="Billing" key="2">
                {/* Your billing content goes here */}
                <p>This is the Billing tab content.</p>
                <Spin spinning={loading}>
                  <Row gutter={16}>
                    <Col span={24} style={{ padding: "0" }}>
                      <CustomTable
                        dataSource={PatientAccountCharges}
                        columns={Chargescolumns}
                        actionColumn={false}
                        isFilter={true}
                      />
                    </Col>
                  </Row>
                </Spin>
              </TabPane>
            </Tabs>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default PharamcyPrescriptionIndex;
