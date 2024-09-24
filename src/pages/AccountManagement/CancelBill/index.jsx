import { Button, Col, Form, Input, Layout, Row, Select } from "antd";
import React, { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import { ColWithSixSpan } from "../../../components/customGridColumns";
import CustomTable from "../../../components/customTable";
import { v4 as uuidv4 } from "uuid";
import UhidSelectComponent from "../../../components/UhidSelectComponent";

function CancelBill() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedUhId, setSelectedUhId] = useState(null);

  const [form] = Form.useForm();

  const columns = [
    {
      title: "Cancel Date",
      dataIndex: "cancelDate",
    },
    {
      title: "Document Date",
      dataIndex: "documentDate",
    },
    {
      title: "Document Ref. ID",
      dataIndex: "documentRefID",
    },
    {
      title: "Patient/Payer",
      dataIndex: "patientPayer",
    },
    {
      title: "Provider",
      dataIndex: "Provider",
    },
    {
      title: "Document Amount",
      dataIndex: "DocumentAmount",
    },
    {
      title: "Outstanding Amount",
      dataIndex: "OutstandingAmount",
    },
    {
      title: "Cancellation Reason",
      dataIndex: "CancellationReason",
    },
    {
      title: "Cancellation Action",
      dataIndex: "CancellationAction",
    },
  ];

  const dataSource = [{ key: uuidv4() }];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const handleSelectUHID = (value, option) => {
    setSelectedUhId(value);
    console.log("op", option);
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
              <UhidSelectComponent
                selectedUhId={selectedUhId}
                handleSelectUHID={handleSelectUHID}
              />
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
