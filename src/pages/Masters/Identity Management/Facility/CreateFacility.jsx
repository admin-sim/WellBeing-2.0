import React from "react";
import PageHeader from "../../../../components/PageHeader";
import { Button, Col, Divider, Form, Input, Row, Select, Upload } from "antd";
import { useForm } from "antd/es/form/Form";
import {
  ColWithSixSpan,
  ColWithTwelveSpan,
} from "../../../../components/customGridColumns";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

function CreateFacility() {
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
      <PageHeader title={"Facility Manager"} button={false} />
      <Form
        style={{ padding: "0.5rem 1rem" }}
        layout="vertical"
        form={form}
        onFinish={(values) => {
          console.log("Form Values", values);
        }}
      >
        <Row gutter={32}>
          <ColWithSixSpan>
            <Form.Item name="FacilityCode" label="Facility Code">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="FacilityName" label="Facility Name">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="DateFormat" label="Date Format">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="TimeFormat" label="Time Format">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
        </Row>
        <Divider style={{ marginTop: 0 }} />
        <Row gutter={32}>
          <Col span={12}>
            <strong>Address Details</strong>
            <Row gutter={32} style={{ marginTop: "0.5rem" }}>
              <ColWithTwelveSpan>
                <Form.Item name="AddressLine1" label="Address Line 1">
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item name="AddressLine2" label="Address Line 2">
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item name="Country" label="Country">
                  <Select allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item name="State" label="State">
                  <Select allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item name="City" label="City">
                  <Select allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item name="Area" label="Area">
                  <Select allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
            </Row>
          </Col>
          <Col span={12}>
            <strong>Contact Details</strong>
            <Row gutter={32} style={{ marginTop: "0.5rem" }}>
              <ColWithTwelveSpan>
                <Form.Item name="ContactName" label="Contact Name">
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item name="Email" label="Email">
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item name="Mobile" label="Mobile">
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item name="Phone" label="Landline">
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item name="Pin" label="Pin">
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item name="Fax" label="Fax">
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
            </Row>
          </Col>
        </Row>
        <Row gutter={32}>
          <Divider style={{ margin: "0 0 1rem 0" }} />
          <Col span={24} style={{ marginBottom: "0.5rem" }}>
            <strong>Status Details</strong>
          </Col>
          <ColWithSixSpan>
            <Form.Item name="Status" label="Status">
              <Select allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="UploadLogo" label="Upload Logo">
              <Upload accept="image/*" listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </ColWithSixSpan>
        </Row>
        <Row justify="end">
          <Col style={{ marginRight: "10px" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="middle">
                Save
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
                  navigate("/Facility");
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

export default CreateFacility;
