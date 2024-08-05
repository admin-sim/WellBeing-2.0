import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";

function ServiceLocationModal({ open, handleClose, handleSubmit, record }) {
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
        title={record ? "Edit Service Location" : "Select Service Location"}
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
            {!record && (
              <Col span={24}>
                <Form.Item
                  name="ServiceLocation"
                  label="Service Location"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Department Name ",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item
                name="Status"
                label="Status"
                rules={[{ required: true, message: "Please select Status" }]}
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

export default ServiceLocationModal;
