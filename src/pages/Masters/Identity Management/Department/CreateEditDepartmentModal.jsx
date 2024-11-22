import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";

function CreateEditDepartmentModal({
  open,
  handleClose,
  handleSubmit,
  record,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        ActiveFlag: record.ActiveFlag ? "Active" : "Hidden", // Set "Active" or "Hidden" based on ActiveFlag boolean
      });
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
        title={record ? "Edit Department" : "Create Department"}
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
          initialValues={{
            ActiveFlag: "Active", // Default value for the "ActiveFlag" field
          }}
        >
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                name="DepartmentCode"
                label="Department Code"
                rules={[
                  { required: true, message: "Please enter Department Code " },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="DepartmentName"
                label="Department Name"
                rules={[
                  { required: true, message: "Please enter Department Name " },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="DepartmentId" hidden></Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="ActiveFlag" label="Status" >
                <Select >
                  <Select.Option key="Active" value="Active"></Select.Option>
                  <Select.Option key="Hidden" value="Hidden"></Select.Option>
                </Select>
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

export default CreateEditDepartmentModal;
