import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";

function CreateEditServiceLocationModal({
  open,
  handleClose,
  handleSubmit,
  record,
}) {
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
        title={record ? "Edit Service Location" : "Create Service Location"}
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
        width={500}
      >
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                style={{ marginBottom: "0.5rem" }}
                name="ServiceLocationType"
                label="Service Location Type"
                rules={[
                  { required: true, message: "Please enter Department Code " },
                ]}
              >
                <Select />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                style={{ marginBottom: "0.5rem" }}
                name="ServiceLocationCode"
                label="Service Location Code"
                rules={[
                  { required: true, message: "Please enter Department Code " },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                style={{ marginBottom: "0.5rem" }}
                name="ServiceLocationName"
                label="Service Location Name"
                rules={[{ required: true, message: "Please select Status" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
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
    </div>
  );
}

export default CreateEditServiceLocationModal;
