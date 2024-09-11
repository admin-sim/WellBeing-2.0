import { Button, Col, Form, Input, Layout, Row, Select } from "antd";
import React, { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import { ColWithSixSpan } from "../../../components/customGridColumns";
import CustomTable from "../../../components/customTable";
import { v4 as uuidv4 } from "uuid";

function CancelBill() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [form] = Form.useForm();

  const columns = [
    {
      title: "Cancel Date",
      dataIndex: "cancelDate",
      key: uuidv4(),
    },
    {
      title: "Document Date",
      dataIndex: "documentDate",
      key: uuidv4(),
    },
    {
      title: "Document Ref. ID",
      dataIndex: "documentRefID",
      key: uuidv4(),
    },
    {
      title: "Patient/Payer",
      dataIndex: "patientPayer",
      key: uuidv4(),
    },
    {
      title: "Provider",
      dataIndex: "Provider",
      key: uuidv4(),
    },
    {
      title: "Document Amount",
      dataIndex: "DocumentAmount",
      key: uuidv4(),
    },
    {
      title: "Outstanding Amount",
      dataIndex: "OutstandingAmount",
      key: uuidv4(),
    },
    {
      title: "Cancellation Reason",
      dataIndex: "CancellationReason",
      key: uuidv4(),
    },
    {
      title: "Cancellation Action",
      dataIndex: "CancellationAction",
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
      <PageHeader title={"Cancel Billing Management"} button={false} />
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
            <Form.Item name="source" label="Source Doc Reference">
              <Select />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Row gutter={16}>
              <Col>
                <Form.Item label=" ">
                  <Button type="primary">Save</Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label=" ">
                  <Button>Select</Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label=" ">
                  <Button danger>Reset</Button>
                </Form.Item>
              </Col>
            </Row>
          </ColWithSixSpan>
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

export default CancelBill;
