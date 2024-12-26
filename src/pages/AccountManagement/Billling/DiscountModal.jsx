import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Typography,
  message,
} from "antd";
import React, { useState } from "react";
const { Text } = Typography;
import { useEffect } from "react";
function DiscountModal({
  options,
  open,
  handleClose,
  discountDetails,
  handleSubmit,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields(); // Clear previous values
      if (discountDetails) {
        form.setFieldsValue({
          ServiceCatalogue: discountDetails.ServiceName,
          PatientChargeAmount: discountDetails.PatientChargeAmount,
        });
      }
    }
  }, [open, discountDetails]);
  

  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };



  const onFormSubmit = async (values) => {
    try {
      // Start loader
      setLoading(true);
  
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
      setLoading(false);
    }
  };
  



  const handleDiscountRateChange = (disc) => {
    debugger;
    // Check if disc is not null, undefined, or NaN
    if (disc == null || isNaN(disc)) {
      // Handle the case when disc is null
      // For example, you might want to reset the fields
      form.setFieldsValue({
        PatientNetAmount: null,
        PatientDiscountAmount: null,
      });
      return; // Exit the function early
    }

    // Ensure discountrate does not exceed 100
    if (disc > 100) {
      disc = 100; // Convert to 100 if above 100
    }
    const main = form.getFieldValue("PatientChargeAmount");
    if (main) {
      const dec = (disc / 100).toFixed(2); // convert rate into decimal
      const mult = main * dec; // value to subtract from main value
      const discont = main - mult;
      form.setFieldsValue({
        PatientNetAmount: discont,
        PatientDiscountAmount: mult,
        PatientDiscountRate: disc, // Set the discountrate to the capped value
      });
    }
  };

  return (
    <div>
       {loading && (
        <div className="full-page-loader">
          <Spin size="large" />
        </div>
      )}
        <Modal
          title="Discount Modal"
          open={open}
          maskClosable={false}
          footer={null}
          onCancel={handleCancel}
          width={600}
        >
          <Form
            style={{ margin: "1rem 0" }}
            layout="vertical"
            form={form}
            onFinish={onFormSubmit}
            onCancel={handleCancel}
            // initialValues={{
            //   ServiceCatalogue: discountDetails?.ServiceName,
            //   PatientChargeAmount:
            //     discountDetails?.ServiceChargeAmountIncludingPriceTariff,
            // }}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={12}>
                <Form.Item
                  name="ServiceCatalogue"
                  label="Service/Catalogue"
                  rules={[{ required: true }]}
                >
                  <Input disabled style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="PatientChargeAmount"
                  label="ChargeAmount"
                  rules={[
                    { required: true, message: "Please select PatientType " },
                  ]}
                >
                  <Input disabled style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={12}>
                <Form.Item
                  name="PatientDiscountRate"
                  label="DiscountRate"
                  rules={[
                    {
                      pattern: /^[0-9]*$/,
                      message: "Discount Rate must be a number",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    onChange={handleDiscountRateChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="PatientDiscountAmount"
                  label="DiscountAmount"
                  rules={[
                    { required: true, message: "Please select PatientType " },
                  ]}
                >
                  <Input disabled style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={12}>
                <Form.Item
                  name="PatientNetAmount"
                  label="NetAmount"
                  rules={[
                    { required: true, message: "Please select PatientType " },
                  ]}
                >
                  <Input disabled style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="DiscountReasonId"
                  label="DiscountReason"
                  rules={[
                    { required: true, message: "Please select PatientType " },
                  ]}
                >
                  <Select>
                    {options.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} justify="end" style={{ marginTop: "1rem" }}>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="default" onClick={handleCancel}>
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

export default DiscountModal;
