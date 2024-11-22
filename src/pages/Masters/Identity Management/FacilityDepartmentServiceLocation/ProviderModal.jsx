import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";

function ProviderModal({ open, handleClose, handleSubmit, record ,providers}) {
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
        title={record ? "Edit Provider" : "Select Provider Name"}
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
                  name="ProviderId"
                  label="Provider"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Provider",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Provider"
                    allowClear
                    // loading={isloading}
                  >
                    {providers?.map((option) => (
                      <Select.Option
                        key={option.ProviderId}
                        value={option.ProviderId}
                      >
                        {option.ProviderFirstName + "" + option.ProviderLastName}
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
              <Form.Item name="FacilityDepartmentProviderId" hidden></Form.Item>
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

export default ProviderModal;
