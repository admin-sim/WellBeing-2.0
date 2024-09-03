import { Button, Checkbox, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";

function AddNewConfiguration({ open, handleClose, handleSubmit, record }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };
  return (
    <Modal
      title={record ? "Edit Configuration" : "Add new Configuration"}
      open={open}
      maskClosable={false}
      footer={null}
      onCancel={handleCancel}
    >
      <Form
        style={{ margin: "1rem 0" }}
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
      >
        <Row gutter={32}>
          <Col span={24} style={{ marginBottom: "-1rem" }}>
            <Form.Item
              name="FacilityName"
              label="Facility"
              rules={[{ required: true, message: "Please enter Facility" }]}
            >
              <Select />
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: "-1rem" }}>
            <Form.Item
              name="GenerateIdFor"
              label="Generate Id For"
              rules={[{ required: true, message: "Please enter" }]}
            >
              <Select />
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: "-1rem" }}>
            <Form.Item
              name="Description"
              label="Description"
              rules={[{ required: true, message: "Please enter Description" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: "-1rem" }}>
            <Form.Item name="ServiceLocation">
              <Checkbox>Is Simple Number</Checkbox>
            </Form.Item>
          </Col>
          <Col span={12} style={{ marginBottom: "-1rem" }}>
            <Form.Item name="Prefix" label="Id Prefix">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12} style={{ marginBottom: "-1rem" }}>
            <Form.Item name="Suffix" label="Id Suffix">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="InitialValue"
              label="Initial Value"
              rules={[
                { required: true, message: "Please enter Initial Value" },
              ]}
            >
              <Select />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="IncrementValue"
              label="Increment Value"
              rules={[
                { required: true, message: "Please enter Increment Value" },
              ]}
            >
              <Select />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32} justify="end" style={{ marginBottom: "-2rem" }}>
          <Col>
            <Form.Item>
              <Button
                size="middle"
                type="primary"
                htmlType="submit"
                style={{ marginRight: "1rem" }}
              >
                {record ? "Update" : "Save"}
              </Button>
              <Button
                size="middle"
                type="default"
                danger
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddNewConfiguration;
