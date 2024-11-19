import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";

function CreateEditFacilityDepartmentModal({
  open,
  handleClose,
  handleSubmit,
  record,
  options
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
        title={record ? "Edit Facility Department" : "Select Department"}
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
            {!record && (
              <Col span={24}>
                <Form.Item
                  name="DepartmentId"
                  label="Department"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Department Name ",
                    },
                  ]}
                >
                     <Select
                  placeholder="Select ServiceLocationType "
                  allowClear
                 // loading={isloading}
                >
                  {options?.map((option) => (
                    <Select.Option
                      key={option.DepartmentId}
                      value={option.DepartmentId}
                    >
                      {option.DepartmentName}
                    </Select.Option>
                  ))}
                </Select>
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
            <Form.Item name="ActiveFlag" label="Status">
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

export default CreateEditFacilityDepartmentModal;
