import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";

function AddEditFrequencyModal({ open, handleClose, handleSubmit, record }) {
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
        title={record ? "Edit Frequency" : "Add New Frequency"}
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
            <Col span={24} style={{ marginBottom: "-1rem" }}>
              <Form.Item
                name="Frequency"
                label="Frequency Name"
                rules={[{ required: true, message: "Please enter Frequency" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24} style={{ marginBottom: "-1rem" }}>
              <Form.Item
                name="Count"
                label="Count"
                rules={[{ required: true, message: "Please enter Count" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="LocalLanguage"
                label="Local Language"
                rules={[
                  { required: true, message: "Please enter Local Language" },
                ]}
              >
                <Input />
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
                  Save
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

export default AddEditFrequencyModal;
