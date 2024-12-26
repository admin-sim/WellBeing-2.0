import { Button, Checkbox, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";

function AddNewConfiguration({
  open,
  handleClose,
  handleSubmit,
  record,
  facilities,
}) {
  const [form] = Form.useForm();

  const [isSimpleNumberChecked, setIsSimpleNumberChecked] = useState(false);

  const handleSimpleNumberChange = (e) => {
    setIsSimpleNumberChecked(e.target.checked);
  };
  useEffect(() => {
    if (open && record) {
      // Map IsSimpleNumber value to boolean for the Checkbox
      const updatedRecord = {
        ...record,
        IsSimpleNumber: record.IsSimpleNumber === "Y", // Convert "Y" to true and other values to false
      };
      form.setFieldsValue(updatedRecord);
    } else if (!open) {
      form.resetFields();
    }
  }, [record, open, form]);
  
  



  const onFormSubmit = async (values) => {
    try {
      // Start loader
    
  
      // Call handleSubmit passed as prop to process the form data
      await handleSubmit(values);
  
      // After successfully submitting, reset the form and close the modal
      form.resetFields();
      handleClose();
    } catch (error) {
      // Handle error, optionally show a message
      message.error("Submission failed, please try again.");
    } finally {
      // Stop loader
    
    }
  };
  


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
        onFinish={onFormSubmit}
      >
        <Row gutter={32}>
          <Col span={24} style={{ marginBottom: "-1rem" }}>
            <Form.Item
              name="FacilityId"
              label="Facility"
              rules={[{ required: true, message: "Please enter Facility" }]}
            >
              <Select>
                {facilities?.map((option) => (
                  <Select.Option
                    key={option.FacilityId}
                    value={option.FacilityId}
                  >
                    {option.FacilityName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: "-1rem" }}>
            <Form.Item
              name="GenerateIdFor"
              label="Generate Id For"
              rules={[{ required: true, message: "Please select a value" }]}
            >
              <Select placeholder="Select value">
                <Select.Option value="OP">OP</Select.Option>
                <Select.Option value="IP">IP</Select.Option>
                <Select.Option value="DC">DC</Select.Option>
                <Select.Option value="EM">EM</Select.Option>
                <Select.Option value="UHID">UHID</Select.Option>
                <Select.Option value="APPOINTMENT">Appointment</Select.Option>
                <Select.Option value="AGREEMENTREF">
                  Agreement Reference
                </Select.Option>
                <Select.Option value="ORDER">Order</Select.Option>
                <Select.Option value="BILL">Bill</Select.Option>
                <Select.Option value="RECEIPT">Receipt</Select.Option>
                <Select.Option value="PO">PO</Select.Option>
                <Select.Option value="GRN">GRN</Select.Option>
                <Select.Option value="Indent">Indent</Select.Option>
                <Select.Option value="IndentIssue">Indent Issue</Select.Option>
                <Select.Option value="StoreConsump">
                  Store Consumption
                </Select.Option>
                <Select.Option value="OpeningStock">
                  Opening Stock
                </Select.Option>
                <Select.Option value="VendorReturn">
                  Vendor Return
                </Select.Option>
                <Select.Option value="StoreReturn">Store Return</Select.Option>
                <Select.Option value="Acknowledge">
                  Acknowledge Return
                </Select.Option>
                <Select.Option value="PHARMACY">Pharmacy</Select.Option>
                <Select.Option value="Prescription">Prescription</Select.Option>
                <Select.Option value="Laboratory">Laboratory</Select.Option>
                <Select.Option value="External">External</Select.Option>
                <Select.Option value="UHIDEX">UHIDEX</Select.Option>
                <Select.Option value="Dummy">Dummy</Select.Option>
              </Select>
            </Form.Item>
              <Form.Item name="ConfigurationId" hidden></Form.Item>
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
            <Form.Item valuePropName="checked" name="IsSimpleNumber">
            <Checkbox onChange={handleSimpleNumberChange}>Simple Number</Checkbox>
            </Form.Item>
          </Col>
          <Col span={12} style={{ marginBottom: "-1rem" }}>
            <Form.Item name="IdPrefix" label="Id Prefix">
            <Input disabled={isSimpleNumberChecked} />
            </Form.Item>
          </Col>
          <Col span={12} style={{ marginBottom: "-1rem" }}>
            <Form.Item name="IdSuffix" label="Id Suffix">
            <Input disabled={isSimpleNumberChecked} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="IdLastNumber"
              label="Initial Value"
              rules={[
                { required: true, message: "Please enter Initial Value" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="IdIncrement"
              label="Increment Value"
              rules={[
                { required: true, message: "Please enter Increment Value" },
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
