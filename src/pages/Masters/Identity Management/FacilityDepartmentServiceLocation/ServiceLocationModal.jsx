import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";

function ServiceLocationModal({ open, handleClose, handleSubmit, record, serviceLocations }) {
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

  const onFormSubmit = async (values) => {
    // Call handleSubmit passed as prop to process the form data
    await handleSubmit(values);

    // After submitting the form, reset the form and close the modal
    form.resetFields();
    handleClose(); // Close the modal
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
          onFinish={onFormSubmit}
          initialValues={{
            ActiveFlag: "Active", // Default value for the "ActiveFlag" field
          }}
        >
          <Row gutter={32}>
            {!record && (
              <Col span={24}>
                <Form.Item
                  name="ServiceLocationId"
                  label="Service Location"
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
                    {serviceLocations?.map((option) => (
                      <Select.Option
                        key={option.ServiceLocationId}
                        value={option.ServiceLocationId}
                      >
                        {option.ServiceLocationName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item
                name="ActiveFlag"
                label="Status"
                rules={[{ required: true, message: "Please select Status" }]}
              >
               <Select>
                  <Select.Option key="Active" value="Active"></Select.Option>
                  <Select.Option key="Hidden" value="Hidden"></Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="FacilityDepartmentServiceLocationId" hidden></Form.Item>
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
