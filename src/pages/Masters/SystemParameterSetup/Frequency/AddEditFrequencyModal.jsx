import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import {urlAddNewFrequency} from "../../../../../endpoints";
import { message } from "antd";
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
                name="FrequencyName"
                label="Frequency Name"
                rules={[{ required: true, message: "Please enter Frequency" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24} style={{ marginBottom: "-1rem" }}>
              <Form.Item
                name="CountId"
                label="Count"
                rules={[{ required: true, message: "Please enter Count" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="LocalLang"
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
