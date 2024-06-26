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
// import customAxios from "../../components/customAxios/customAxios";
import { urlUpdateInvoiceDiscount } from "../../../endpoints";
import { useEffect } from "react";
import customAxios from "../../components/customAxios/customAxios";
function InvoiceDiscountModal({
  options,
  open,
  handleClose,
  discountDetails,
  setCharges,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (discountDetails) {
      form.setFieldsValue({
        ServiceCatalogue: "All",
        PatientChargeAmount: discountDetails.TotalChargeAmount,
      });
    }
  }, [discountDetails]);

  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  const onFinishForAddChargeParameters = async (values) => {
    debugger;
    values.ChargeID = discountDetails.ChargeID;
    values.ServiceId = discountDetails.ServiceId;
    values.Flag = "";
    values.PatientId = discountDetails.PatientId;
    values.EncounterId = discountDetails.EncounterId;

    try {
      const response = await customAxios.post(
        urlUpdateInvoiceDiscount,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200 && response.data.data!=null) {
        setCharges(response.data.data.PatientAccountCharges);
        message.success("Discount Applied");
        handleCancel();
      } else {
        message.error("Something Went Wrong");
      }
    } catch (error) {
      message.error("Something went wrong");
      console.error(error);
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
      <Spin spinning={loading}>
        <Modal
          title="Add New General Lookup"
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
            onFinish={onFinishForAddChargeParameters}
            onCancel={handleCancel}
            // initialValues={{
            //   ServiceCatalogue: discountDetails?.ServiceName,
            //   PatientChargeAmount:
            //     discountDetails?.ServiceChargeAmountIncludingPriceTariff,
            // }}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={10}>
                <Form.Item
                  name="ServiceCatalogue"
                  label="Service/Catalogue"
                  rules={[{ required: true }]}
                >
                  <Input disabled style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={10}>
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
              <Col className="gutter-row" span={10}>
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
              <Col className="gutter-row" span={10}>
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
              <Col className="gutter-row" span={10}>
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
              <Col className="gutter-row" span={10}>
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
            <Row gutter={32} style={{ height: "1.8rem" }}>
              <Col offset={12} span={6}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <Button type="default" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
}

export default InvoiceDiscountModal;
