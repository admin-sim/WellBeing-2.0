import React, { useState, useEffect,useRef  } from "react";
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
   Tag,
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
import PageHeader from "../../../components/PageHeader/index.jsx";
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
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`Requesting: ${urlPharmacyPrescription}`);
        const response = await customAxios.get(`${urlPharmacyPrescription}`);
    
        if (response?.data?.data) {
          setLoading(false);
          const newColumnData =
            response.data.data.PatientAccountCharges?.map((obj, index) => ({
              ...obj,
              key: index + 1,
            })) || [];
    
          const existingprescription =
            response.data.data.ExistingPrescriptionModel?.map((obj, index) => ({
              ...obj,
              key: index + 1,
            })) || [];
    
          if (newColumnData.length > 0) {
            setPatientAccountCharges(newColumnData);
          }
    
          if (existingprescription.length > 0) {
            setPrescriptionDetails(existingprescription);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };
    fetchData(); 
  }, []); 
  
  const navigate = useNavigate();
  const handleNavigate = (values) => {
    const url = `/OtcDispense`;
    navigate(url, {
      state: {
        PatientId: values.PatientId,
        EncounterId: values.EncounterId,
        flag: 1,
        openPrescription: true, 
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
      render: (text, record) => ( <Tag
        style={{
          backgroundColor: "white",
          color: "green",
          border: "1px solid green",
          borderRadius: "8px",
          fontWeight: "bold",
        }}
      >
        {text}
      </Tag>
      ),
    },
    {
      title: "UHID",
      dataIndex: "Uhid",
      render: (text, record) => (
        <Tag
          color="blue"
          style={{ fontWeight: "bold", borderWidth: "5px", fontSize: "15px" }}
        >
          {record.Uhid}
        </Tag>
      ),
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
      dataIndex: "ChargeID",
      render: (text, record) => (
        <a onClick={() => handleNavigateTopharmacy(record)}  style={{ color: 'blue' }}>
            {text}
        </a>
    ),
    },
    {
      title: "Order Date",
      dataIndex: "StrServiceDate",
      render: (text, record) => ( <Tag
        style={{
          backgroundColor: "white",
          color: "green",
          border: "1px solid green",
          borderRadius: "8px",
          fontWeight: "bold",
        }}
      >
        {text}
      </Tag>
    ),
    },
    {
      title: "UHID",
      dataIndex: "Uhid",
      render: (text, record) => (
        <Tag
          color="blue"
          style={{ fontWeight: "bold", borderWidth: "5px", fontSize: "15px" }}
        >
          {record.Uhid}
        </Tag>
      ),
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
                <PageHeader title={"Pharmacy Prescription Details"} button={false} />
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
                <PageHeader title={"Pharmacy Bill Details"} button={false} />
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
