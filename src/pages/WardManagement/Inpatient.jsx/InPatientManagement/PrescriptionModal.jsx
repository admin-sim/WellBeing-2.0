import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Tabs,
} from "antd";
import React, { useState } from "react";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";

import PatientHeader from "../../../../components/PatientHeader";
import CustomTable from "../../../../components/customTable";

function Prescription({ bed, open, handleClose }) {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm(); // Initialize form3
  const [tableData, setTableData] = useState([]);

  const handleCancel = () => {
    form1.resetFields();
    form2.resetFields();
    form3.resetFields();
    handleClose();
  };

  const onChange = (key) => {
    console.log(key);
  };

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      {
        key: tableData.length + 1,
        Drug: "",
        Route: "",
        Frequency: "",
        IntervalInDays: "",
        TotalQty: "",
        Instruction: "",
      },
    ]);
  };

  const handleDeleteRow = (key) => {
    const newData = tableData.filter((row) => row.key !== key);
    setTableData(newData);
  };

  const handleInputChange = (value, key, column) => {
    const newData = tableData.map((row) => {
      if (row.key === key) {
        return { ...row, [column]: value };
      }
      return row;
    });
    setTableData(newData);
  };

  const columns = [
    {
      title: "Drug",
      dataIndex: "Drug",
      key: "Drug",
      render: (text, record) => (
        <Form.Item
          name={["tableData", record.key, "Drug"]}
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: "Please input drug!" }]}
        >
          <Input
            value={text}
            onChange={(e) =>
              handleInputChange(e.target.value, record.key, "Drug")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Route",
      dataIndex: "Route",
      key: "Route",
      render: (text, record) => (
        <Form.Item
          name={["tableData", record.key, "Route"]}
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: "Please select route!" }]}
        >
          <Select
            width={100}
            style={{ width: "100%" }}
            value={text}
            onChange={(value) => handleInputChange(value, record.key, "Route")}
          />
        </Form.Item>
      ),
    },
    {
      title: "Frequency",
      dataIndex: "Frequency",
      key: "Frequency",
      render: (text, record) => (
        <Form.Item
          name={["tableData", record.key, "Frequency"]}
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: "Please input frequency!" }]}
        >
          <Input
            value={text}
            onChange={(e) =>
              handleInputChange(e.target.value, record.key, "Frequency")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "IntervalInDays",
      dataIndex: "IntervalInDays",
      key: "IntervalInDays",
      render: (text, record) => (
        <Form.Item
          name={["tableData", record.key, "IntervalInDays"]}
          style={{ marginBottom: 0 }}
          rules={[
            { required: true, message: "Please input interval in days!" },
          ]}
        >
          <Input
            value={text}
            onChange={(e) =>
              handleInputChange(e.target.value, record.key, "IntervalInDays")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "TotalQty",
      dataIndex: "TotalQty",
      key: "TotalQty",
      render: (text, record) => (
        <Form.Item
          name={["tableData", record.key, "TotalQty"]}
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: "Please input total quantity!" }]}
        >
          <Input
            value={text}
            onChange={(e) =>
              handleInputChange(e.target.value, record.key, "TotalQty")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Instruction",
      dataIndex: "Instruction",
      key: "Instruction",
      render: (text, record) => (
        <Form.Item
          name={["tableData", record.key, "Instruction"]}
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: "Please input instruction!" }]}
        >
          <Input
            value={text}
            onChange={(e) =>
              handleInputChange(e.target.value, record.key, "Instruction")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <Button type="link" onClick={handleAddRow}>
          <PlusCircleOutlined />
        </Button>
      ),
      key: "action",
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDeleteRow(record.key)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ];
  const columns2 = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Order Id",
      dataIndex: "OrderId",
      key: "key",
    },
    {
      title: "Indent Number",
      dataIndex: "IndentNumber",
      key: "key",
    },
    {
      title: "Indent Status",
      dataIndex: "IndentStatus",
      key: "key",
    },
    {
      title: "Order Date",
      dataIndex: "OrderDate",
      key: "key",
    },
    {
      title: "Encounter",
      dataIndex: "Encounter",
      key: "key",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "key",
    },
    {
      title: "Department",
      dataIndex: "Department",
      key: "key",
    },
    {
      title: "Ordering Physician",
      dataIndex: "OrderingPhysician",
      key: "key",
    },
  ];

  const dataSource2 = [
    {
      key: "1",
      slno: "1",
      OrderId: "COH/P42",
      IndentNumber: "COH/IND86",
      IndentStatus: "Pending",
      OrderingPhysician: "Nagaraj",
      OrderDate: "20/05/2023",
      Encounter: "COH/IP117",
      PatientType: "InPatient",
      Department: "General Medicine",
    },
    {
      key: "2",
      slno: "2",
      OrderId: "COH/P43",
      IndentNumber: "COH/IND87",
      IndentStatus: "Pending",
      OrderingPhysician: "Nagaraj",
      OrderDate: "20/05/2023",
      Encounter: "COH/IP117",
      PatientType: "InPatient",
      Department: "General Medicine",
    },
    {
      key: "2",
      slno: "2",
      OrderId: "COH/P43",
      IndentNumber: "COH/IND87",
      IndentStatus: "Pending",
      OrderingPhysician: "Nagaraj",
      OrderDate: "20/05/2023",
      Encounter: "COH/IP117",
      PatientType: "InPatient",
      Department: "General Medicine",
    },
    {
      key: "2",
      slno: "2",
      OrderId: "COH/P43",
      IndentNumber: "COH/IND87",
      IndentStatus: "Pending",
      OrderingPhysician: "Nagaraj",
      OrderDate: "20/05/2023",
      Encounter: "COH/IP117",
      PatientType: "InPatient",
      Department: "General Medicine",
    },
    {
      key: "2",
      slno: "2",
      OrderId: "COH/P43",
      IndentNumber: "COH/IND87",
      IndentStatus: "Pending",
      OrderingPhysician: "Nagaraj",
      OrderDate: "20/05/2023",
      Encounter: "COH/IP117",
      PatientType: "InPatient",
      Department: "General Medicine",
    },
    {
      key: "2",
      slno: "2",
      OrderId: "COH/P43",
      IndentNumber: "COH/IND87",
      IndentStatus: "Pending",
      OrderingPhysician: "Nagaraj",
      OrderDate: "20/05/2023",
      Encounter: "COH/IP117",
      PatientType: "InPatient",
      Department: "General Medicine",
    },
    {
      key: "2",
      slno: "2",
      OrderId: "COH/P43",
      IndentNumber: "COH/IND87",
      IndentStatus: "Pending",
      OrderingPhysician: "Nagaraj",
      OrderDate: "20/05/2023",
      Encounter: "COH/IP117",
      PatientType: "InPatient",
      Department: "General Medicine",
    },
  ];

  return (
    <div>
      <Modal
        width={"80%"}
        height={"auto"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Prescription
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <PatientHeader patient={bed} />
        <Tabs
          size="small"
          onChange={onChange}
          tabBarGutter={0}
          type="card"
          style={{ marginTop: "1rem" }}
          tabBarStyle={{ display: "flex" }}
        >
          <Tabs.TabPane
            tab={
              <div
                style={{
                  width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                New Request
              </div>
            }
            key="1"
          >
            <Form
              layout="vertical"
              form={form1}
              onFinish={(values) => {
                console.log(values);
                handleCancel();
              }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="IndentDate"
                    label="Indent Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select Indent Date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="Store"
                    label="Store"
                    rules={[
                      {
                        required: true,
                        message: "Please select Store",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={0} style={{ height: "2rem" }}>
                <Col offset={20} span={2}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item>
                    <Button type="default" danger onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Form form={form3} component={false}>
              <Row>
                <Col span={24} style={{ marginTop: "1rem" }}>
                  <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    bordered
                    scroll={{
                      y: 200,
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <div
                style={{
                  width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Existing
              </div>
            }
            key="2"
          >
            <Form
              layout="vertical"
              form={form1}
              onFinish={(values) => {
                console.log(values);
                handleCancel();
              }}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    name="FromDate"
                    label="From Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select From Date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="ToDate"
                    label="To Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select To Date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    name="OrderingPhysician"
                    label="Ordering Physician"
                    rules={[
                      {
                        required: true,
                        message: "Please enter Ordering Physician",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={0} style={{ height: "2rem" }}>
                <Col offset={20} span={2}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Search
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item>
                    <Button type="default" danger onClick={handleCancel}>
                      Reset
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Divider style={{ marginBottom: "0rem" }} />
            </Form>
            <CustomTable
              columns={columns2}
              dataSource={dataSource2}
              actionColumn={false}
              isFilter={true}
              scroll={{
                //   x: 1500,
                y: 110,
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

export default Prescription;
