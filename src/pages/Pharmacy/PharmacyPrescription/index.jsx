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

const PharamcyPrescriptionIndex = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [prescriptionDetails, setPrescriptionDetails] = [];

  const handleOnFinish = () => {};
  const handlePatientTrackingSearch = () => {};
  const { TabPane } = Tabs;


  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   try {
  //     const response = await customAxios.get(
  //       `${urlGetAllFacilityDepartmentServiceLocation}`
  //     );

  //     if (response.data != null) {
  
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };


  const columns = [
    {
      title: "Order ID",
      dataIndex: "PrescriptionId",
    
    },
    {
      title: "Order Date",
      dataIndex: "Createddate",
   
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
  ]

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
                    <Row gutter={16}>
                      <ColWithSixSpan>
                        <Form.Item name="UHID" label="UHID">
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </ColWithSixSpan>
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
                    </Row>
                  </Form>
                </TabPane>
                <TabPane tab="Billing" key="2">
                  {/* Your billing content goes here */}
                  <p>This is the Billing tab content.</p>
                </TabPane>
              </Tabs>
            </div>
    
        </Form>
      </div>
    </Layout>
  );
};

export default PharamcyPrescriptionIndex;
