import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";

function CreateWardModal({ open, handleClose, handleSubmit, record }) {
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
    <div>
      <Modal
        title={record ? "Edit Ward" : "Create Ward"}
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
        width="40%"
      >
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                name="WardCode"
                label="Ward Code"
                rules={[{ required: true, message: "Please enter Ward Code " }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="WardName"
                label="Ward Name"
                rules={[{ required: true, message: "Please enter Ward Name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="WardCategory"
                label="Ward Category"
                rules={[
                  { required: true, message: "Please Select WardCategory" },
                ]}
              >
                <Select />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ServiceLocation"
                label="Service Location"
                rules={[
                  { required: true, message: "Please select Service Location" },
                ]}
              >
                <Select />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Gender"
                label="Gender"
                rules={[{ required: true, message: "Please select Gender" }]}
              >
                <Select />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Status"
                label="Status"
                rules={[{ required: true, message: "Please select Status" }]}
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
                  Submit
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
    </div>
  );
}

export default CreateWardModal;
