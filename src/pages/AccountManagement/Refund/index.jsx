import { Button, Col, Form, Input, Layout, Row, Select } from "antd";
import React, { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import { ColWithSixSpan } from "../../../components/customGridColumns";
import CustomTable from "../../../components/customTable";
import { v4 as uuidv4 } from "uuid";

function Refund() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [form] = Form.useForm();

  const columns = [
    {
      title: "Receipt Number",
      dataIndex: "ReceiptNumber",
      key: uuidv4(),
    },
    {
      title: "Refund Amount",
      dataIndex: "RefundAmount",
      key: uuidv4(),
    },
  ];

  const dataSource = [{}];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title={"Patient Refund"} button={false} />
      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => console.log(values)}
      >
        <Row gutter={16} style={{ margin: "1rem" }}>
          <ColWithSixSpan>
            <Form.Item name="uhid" label="UHID">
              <Input />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Encounter" label="Encounter">
              <Select />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Source" label="Source Document">
              <Select />
            </Form.Item>
          </ColWithSixSpan>
        </Row>
        <Row gutter={16} justify={"end"} style={{ marginRight: "1rem" }}>
          <Col>
            <Form.Item>
              <Button type="primary">Save</Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button>Select</Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button danger>Reset</Button>
            </Form.Item>
          </Col>
        </Row>

        <CustomTable
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          actionColumn={false}
          isFilter={true}
        />
      </Form>
    </Layout>
  );
}

export default Refund;
