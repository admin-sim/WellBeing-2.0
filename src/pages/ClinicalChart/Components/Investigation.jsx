import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Table,
  Tabs,
} from "antd";
import { useForm } from "antd/es/form/Form";
import moment from "moment/moment";
import React, { useState } from "react";

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
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Lab Reports",
      children: "Content of Tab Pane 3",
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
      LabNumber: " ",
    },
    {
      key: 2,
      ServiceName: "Abdomen2",
      Date: "27-09-2024",
      Provider: "Ochuwa Kanoba 2 ",
      ChargeAmount: "45001.00",
      LabNumber: " ",
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

export default Investigation;
