import React from "react";
import PageHeader from "../../../../components/PageHeader";
import { Button, Col, Divider, Form, Input, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColWithSixSpan } from "../../../../components/customGridColumns";
import { useNavigate } from "react-router-dom";

function EditEnterprise() {
  const [form] = useForm();
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title={"Edit Enterprise"} button={false} />
      <Form
        style={{ margin: "1rem" }}
        layout="vertical"
        form={form}
        onFinish={(values) => {
          console.log("Form Values", values);
        }}
      >
        <Row gutter={16}>
          <ColWithSixSpan>
            <Form.Item name="EnterpriseName" label="Enterprise Name">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="AddressLine1" label="Address Line 1">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="AddressLine2" label="Address Line 2">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Country" label="Country">
              <Select allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="State" label="State">
              <Select allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Place" label="Place">
              <Select allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Area" label="Area">
              <Select allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Pin" label="Pin">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <Divider orientation="left">Contact Details</Divider>

          <ColWithSixSpan>
            <Form.Item name="ContactName" label="Contact Name">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Email" label="Email">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Mobile" label="Mobile">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Phone" label="Landline">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Fax" label="Fax">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
        </Row>
        <Row justify="end">
          <Col style={{ marginRight: "10px" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="middle">
                Update
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button
                type="default"
                danger
                size="middle"
                onClick={() => {
                  navigate("/Enterprise");
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default EditEnterprise;
