import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Select,
  Table,
  Tabs,
} from "antd";
import React, { useState } from "react";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";

import PatientHeader from "../../../../components/PatientHeader";
import CustomTable from "../../../../components/customTable";
import Title from "antd/es/typography/Title";
import { TfiReload } from "react-icons/tfi";
import ColumnGroup from "antd/es/table/ColumnGroup";
import { render } from "react-dom";

function OrderEntry({ bed, open, handleClose }) {
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
      title: "Service Name",
      dataIndex: "ServiceName",
      key: "key",
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "key",
    },
    {
      title: "Provider",
      dataIndex: "Provider",
      key: "key",
    },
    {
      title: "Charge Amount",
      dataIndex: "ChargeAmount",
      key: "key",
    },
  ];
  const columns3 = [
    {
      title: "Service Name",
      dataIndex: "ServiceName",
      key: "key",
    },
    {
      title: "Service Date",
      dataIndex: "ServiceDate",
      key: "key",
    },
    {
      title: "OrderBy",
      dataIndex: "OrderBy",
      key: "key",
    },
  ];
  const dataSource3 = [
    {
      key: "1",
      ServiceName: "ORS",
      OrderBy: "Nagaraj",
      ServiceDate: "20/05/2023",
    },
    {
      key: "2",
      ServiceName: "ORS",
      OrderBy: "Nagaraj",
      ServiceDate: "20/05/2023",
    },
    {
      key: "3",
      ServiceName: "ORS",
      OrderBy: "Nagaraj",
      ServiceDate: "20/05/2023",
    },
  ];

  const dataSource2 = [
    {
      key: "1",
      ServiceName: "ORS",
      ChargeAmount: "500.00",
      Provider: "Nagaraj",
      Date: "20/05/2023",
    },
    {
      key: "2",
      ServiceName: "ORS",
      ChargeAmount: "500.00",
      Provider: "Nagaraj",
      Date: "20/05/2023",
    },
    {
      key: "3",
      ServiceName: "ORS",
      ChargeAmount: "500.00",
      Provider: "Nagaraj",
      Date: "20/05/2023",
    },
    {
      key: "4",
      ServiceName: "ORS",
      ChargeAmount: "500.00",
      Provider: "Nagaraj",
      Date: "20/05/2023",
    },
    {
      key: "4",
      ServiceName: "ORS",
      ChargeAmount: "500.00",
      Provider: "Nagaraj",
      Date: "20/05/2023",
    },
    {
      key: "4",
      ServiceName: "ORS",
      ChargeAmount: "500.00",
      Provider: "Nagaraj",
      Date: "20/05/2023",
    },
    {
      key: "4",
      ServiceName: "ORS",
      ChargeAmount: "500.00",
      Provider: "Nagaraj",
      Date: "20/05/2023",
    },
    {
      key: "4",
      ServiceName: "ORS",
      ChargeAmount: "500.00",
      Provider: "Nagaraj",
      Date: "20/05/2023",
    },
    {
      key: "4",
      ServiceName: "ORS",
      ChargeAmount: "500.00",
      Provider: "Nagaraj",
      Date: "20/05/2023",
    },
    {
      key: "4",
      ServiceName: "ORS",
      ChargeAmount: "500.00",
      Provider: "Nagaraj",
      Date: "20/05/2023",
    },
  ];
  const columns5 = [
    {
      title: "Test Name",
      dataIndex: "testName",
    },
    {
      title: "Template Name",
      dataIndex: "TemplateName",
      render: (text) => <a>{text}</a>,
    },
  ];
  const dataSource5 = [
    {
      key: "1",
      testName: "Urin Analysis",
      TemplateName: "Template",
    },
  ];
  const columns4 = [
    {
      title: "Test Name",
      dataIndex: "testName",
    },
    {
      title: "Lab Number",
      dataIndex: "LabNumber",
    },
  ];

  const dataSource4 = [
    {
      key: "1",
      testName: "John Brown",
      LabNumber: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      testName: "John Brown",
      LabNumber: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "3",
      testName: "John Brown",
      LabNumber: 32,
      address: "New York No. 1 Lake Park",
    },
  ];

  const rowSelection = {
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
  };

  return (
    <div>
      <Modal
        width={"80%"}
        height={"100vh"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Nurse Order
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
                  // width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Order Details
              </div>
            }
            key="1"
          >
            <Layout style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
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
                    padding: "0.5rem 1rem 0.5rem 1rem",
                    backgroundColor: "#40A2E3",
                    borderRadius: "10px 10px 0px 0px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Col>
                    <Title
                      level={4}
                      style={{
                        color: "white",
                        fontWeight: 500,
                        margin: 0,
                        paddingTop: 0,
                      }}
                    >
                      Patient Bill
                    </Title>
                  </Col>
                  <Col>
                    <Button type="link">
                      <TfiReload
                        style={{
                          color: "white",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>
                <Form
                  layout="vertical"
                  form={form1}
                  onFinish={(values) => {
                    console.log(values);
                    handleCancel();
                  }}
                  style={{ margin: "1rem" }}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="Service"
                        label="Service"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Service",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name="Date"
                        label="Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date",
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="Provider"
                        label="Provider"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Provider",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col offset={1} span={4}>
                      <Form.Item label="&nbsp;">
                        <Button type="primary" htmlType="submit">
                          Add Service
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Layout>

            <Row>
              <Col span={24} style={{ marginTop: "0rem" }}>
                <CustomTable
                  title={() => (
                    <span
                      style={{
                        color: "indigo",
                        fontWeight: "700",
                        fontSize: "1rem",
                      }}
                    >
                      Charge Details
                    </span>
                  )}
                  columns={columns2}
                  dataSource={dataSource2}
                  pagination={false}
                  onDelete={(record) => {
                    alert("Deleting Sl No. : " + record.slno);
                  }}
                  isFilter={true}
                  bordered
                  scroll={{
                    y: 120,
                  }}
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <div
                style={{
                  // width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Order Diagnostic Services
              </div>
            }
            key="2"
          >
            <Layout style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
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
                    padding: "0.5rem 1rem 0.5rem 1rem",
                    backgroundColor: "#40A2E3",
                    borderRadius: "10px 10px 0px 0px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Col>
                    <Title
                      level={4}
                      style={{
                        color: "white",
                        fontWeight: 500,
                        margin: 0,
                        paddingTop: 0,
                      }}
                    >
                      Diagnostic Order Entry
                    </Title>
                  </Col>
                  <Col>
                    <Button type="link">
                      <TfiReload
                        style={{
                          color: "white",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>
                <Form
                  layout="vertical"
                  form={form2}
                  onFinish={(values) => {
                    console.log(values);
                    handleCancel();
                  }}
                  style={{ margin: "1rem" }}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="Service"
                        label="Service"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Service",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name="Date"
                        label="Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date",
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="Provider"
                        label="Provider"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Provider",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col offset={1} span={4}>
                      <Form.Item label="&nbsp;">
                        <Button type="primary" htmlType="submit">
                          Add Service
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={3}>
                      <Form.Item>
                        <Button type="primary">Send To Lab</Button>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item>
                        <Checkbox>STAT</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Layout>

            <Row>
              <Col span={24} style={{ marginTop: "0rem" }}>
                <CustomTable
                  title={() => (
                    <span
                      style={{
                        color: "indigo",
                        fontWeight: "700",
                        fontSize: "1rem",
                      }}
                    >
                      Charge Details
                    </span>
                  )}
                  columns={columns2}
                  dataSource={dataSource2}
                  pagination={false}
                  onDelete={(record) => {
                    alert("Deleting Sl No. : " + record.slno);
                  }}
                  isFilter={true}
                  bordered
                  scroll={{
                    y: 120,
                  }}
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <div
                style={{
                  // width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Previous Order Details
              </div>
            }
            key="3"
          >
            <Layout style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
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
                    padding: "0.5rem 1rem 0.5rem 1rem",
                    backgroundColor: "#40A2E3",
                    borderRadius: "10px 10px 0px 0px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Col>
                    <Title
                      level={4}
                      style={{
                        color: "white",
                        fontWeight: 500,
                        margin: 0,
                        paddingTop: 0,
                      }}
                    >
                      Previous Order Details
                    </Title>
                  </Col>
                  <Col>
                    <Button type="link">
                      <TfiReload
                        style={{
                          color: "white",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>
                <Form
                  layout="vertical"
                  form={form3}
                  onFinish={(values) => {
                    console.log(values);
                    handleCancel();
                  }}
                  style={{ margin: "1rem" }}
                >
                  <Row gutter={16}>
                    <Col span={4}>
                      <Form.Item
                        name="FromDate"
                        label="From Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date",
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name="ToDate"
                        label="To Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date",
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="Indicator"
                        label="Indicator"
                        rules={[
                          {
                            required: true,
                            message: "Please select Indicator",
                          },
                        ]}
                      >
                        <Select style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="Description"
                        label="Description"
                        rules={[
                          {
                            required: true,
                            message: "Please select Description",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label="&nbsp;">
                        <Button type="primary" htmlType="submit">
                          Search
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Layout>
            <Row>
              <Col span={24} style={{ marginTop: "0rem" }}>
                <CustomTable
                  title={() => (
                    <span
                      style={{
                        color: "indigo",
                        fontWeight: "700",
                        fontSize: "1rem",
                      }}
                    >
                      Charge Details
                    </span>
                  )}
                  columns={columns3}
                  dataSource={dataSource3}
                  pagination={false}
                  onDelete={(record) => {
                    alert("Deleting Sl No. : " + record.slno);
                  }}
                  actionColumn={false}
                  isFilter={true}
                  bordered
                  scroll={{
                    y: 120,
                  }}
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <div
                style={{
                  // width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Lab Reports
              </div>
            }
            key="4"
          >
            <Layout style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
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
                    padding: "0.5rem 1rem 0.5rem 1rem",
                    backgroundColor: "#40A2E3",
                    borderRadius: "10px 10px 0px 0px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Col>
                    <Title
                      level={4}
                      style={{
                        color: "white",
                        fontWeight: 500,
                        margin: 0,
                        paddingTop: 0,
                      }}
                    >
                      Lab Reports
                    </Title>
                  </Col>
                  <Col>
                    <Button type="link">
                      <TfiReload
                        style={{
                          color: "white",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>

                <Table
                  size="small"
                  rowSelection={{
                    type: Checkbox,
                    ...rowSelection,
                  }}
                  columns={columns4}
                  dataSource={dataSource4}
                  pagination={{
                    pageSize: 10,
                  }}
                />
                <Row>
                  <Col
                    span={23}
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      margin: "0.5rem 0 1rem 0",
                    }}
                  >
                    <Button type="primary">View Report</Button>
                  </Col>
                </Row>
                <Table columns={columns5} dataSource={dataSource5} size="small" />
              </div>
            </Layout>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

export default OrderEntry;
