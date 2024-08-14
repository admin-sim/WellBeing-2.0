import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
} from "antd";
import { useForm } from "antd/es/form/Form";
import moment from "moment/moment";
import React, { useState } from "react";
import CustomTable from "../../../components/customTable/index";
import { render } from "react-dom";

function Investigation() {
  const items = [
    {
      key: "1",
      label: "Order Details",
      children: <OrderDetails />,
    },
    {
      key: "2",
      label: "Previous Order Details",
      children: <PreviousOrderDetails />,
    },
    {
      key: "3",
      label: "Lab Reports",
      children: <LabReports />,
    },
  ];

  return (
    <>
      <div style={{ margin: "1rem 0" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>
          Investigation
        </span>
      </div>
      <Tabs defaultActiveKey="1" items={items} />
    </>
  );
}

const OrderDetails = () => {
  const [form1] = useForm();

  const [dataSource, setDataSource] = useState([
    {
      key: 1,
      ServiceName: "Abdomen",
      Date: "27-09-2024",
      Provider: "Ochuwa Kanoba",
      ChargeAmount: "45000.00",
      LabNumber: "COH/LAB/248",
    },
    {
      key: 2,
      ServiceName: "Abdomen2",
      Date: "27-09-2024",
      Provider: "Ochuwa Kanoba 2 ",
      ChargeAmount: "45001.00",
      LabNumber: "COH/LAB/245",
    },
  ]);

  const handleDeleteRow = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const columns = [
    {
      title: "Service Name",
      dataIndex: "ServiceName",
      width: 300,
    },
    {
      title: "Date",
      dataIndex: "Date",
      width: 100,
    },
    {
      title: "Provider",
      dataIndex: "Provider",
      width: 180,
    },
    {
      title: "Charge Amount",
      dataIndex: "ChargeAmount",
      width: 150,
    },
    {
      title: "Action",
      width: 70,
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDeleteRow(record.key)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
    {
      title: "Lab Number",
      dataIndex: "LabNumber",
      width: 120,
    },
    {
      title: "Status",
      width: 120,
      render: () => (
        <Space>
          <Badge status="success" />
          <Badge status="error" />
          <Badge status="default" />
          <Badge status="processing" />
          <Badge status="warning" />
        </Space>
      ),
    },
  ];

  return (
    <>
      <span style={{ fontSize: "1rem", fontWeight: 600 }}>Order Entry</span>
      <Form
        layout="vertical"
        form={form1}
        onFinish={(values) => {
          console.log(values);
        }}
      >
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item name="Service" label="Service">
              <Select style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="Date" label="Date">
              <DatePicker
                style={{ width: "100%" }}
                disabled
                defaultValue={moment()}
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="provider" label="Provider">
              <Select style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="amount" label="Amount">
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={3} style={{ display: "flex", alignItems: "center" }}>
            <Button size="large" type="link" icon={<PlusCircleOutlined />} />
          </Col>
        </Row>
        <Row gutter={32}>
          <Col>
            <Button type="primary" size="middle">
              Send To Lab
            </Button>
          </Col>
          <Col>
            <Form.Item name="stat" valuePropName="checked">
              <Checkbox>STAT</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        columns={columns}
        dataSource={dataSource}
        title={() => <strong>Charge Details</strong>}
      />
    </>
  );
};
const PreviousOrderDetails = () => {
  const [form1] = useForm();

  const [dataSource, setDataSource] = useState([
    {
      Encounter: "COH/IP107",
      ServiceName: "ANKLE JOINT[BOTH] X-RAY",
      ServiceDate: "6/7/2023 10:36:22 AM",
      OrderBy: "OCHUWA KANOBA",
    },
    {
      Encounter: "COH/IP107",
      ServiceName: "FULL BLOOD COUNT/[FBC]",
      ServiceDate: "6/7/2023 4:38:36 PM",
      OrderBy: "OCHUWA KANOBA",
    },
  ]);

  const columns = [
    {
      title: "Encounter",
      dataIndex: "Encounter",
    },
    {
      title: "Service Name",
      dataIndex: "ServiceName",
    },
    {
      title: "Service Date",
      dataIndex: "ServiceDate",
    },
    {
      title: "Order By",
      dataIndex: "OrderBy",
    },
  ];

  return (
    <>
      <Form
        layout="vertical"
        form={form1}
        onFinish={(values) => {
          console.log(values);
        }}
        style={{ marginBottom: "-2rem" }}
      >
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item name="FromDate" label="From Date">
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="ToDate" label="To Date">
              <DatePicker
                style={{ width: "100%" }}
                defaultValue={moment()}
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
          <Form.Item label=" ">
            <Col>
              <Button type="primary" style={{ width: "100%" }}>
                Select
              </Button>
            </Col>
          </Form.Item>
        </Row>
      </Form>
      <CustomTable
        columns={columns}
        dataSource={dataSource}
        actionColumn={false}
        isFilter={true}
      />
    </>
  );
};
const LabReports = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      TestName: "ANKLE JOINT[BOTH] X-RAY",
      LabNumber: "COH/LAB/240",
    },
    { key: "2", TestName: "FULL BLOOD COUNT/[FBC]", LabNumber: "COH/LAB/245" },
    { key: "3", TestName: "UREA", LabNumber: "COH/LAB/248" },
  ]);

  const columns = [
    {
      title: "Test Name",
      dataIndex: "TestName",
    },
    {
      title: "Lab Number",
      dataIndex: "LabNumber",
    },
  ];

  return (
    <>
      <span style={{ fontSize: "1rem", fontWeight: 600 }}>Lab Reports</span>
      <CustomTable
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(
              `selectedRowKeys: ${selectedRowKeys}`,
              "selectedRows: ",
              selectedRows
            );
          },
          getCheckboxProps: (record) => ({
            // Column configuration not to be checked
            name: record.name,
          }),
        }}
        columns={columns}
        dataSource={dataSource}
        actionColumn={false}
      />
      <Row justify={"end"} style={{ margin: "-0.5rem 1rem" }}>
        <Col>
          <Button type="primary" size="middle">
            View Report
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Investigation;
