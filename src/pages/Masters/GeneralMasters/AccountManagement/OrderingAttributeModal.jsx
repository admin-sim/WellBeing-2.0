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
import customAxios from "../../../../components/customAxios/customAxios";
//import { urlUpdateDiscount } from "../../../endpoints";
import { useEffect } from "react";
function OrderingAttributeModal({ options, open, handleClose, handleSubmit }) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  const onFinishForAddChargeParameters = async (values) => {
    debugger;

    const genderOption = options?.Genders.find(
      (option) => option.LookupID === values.Gender
    );
    const startAgeUnitOption = options?.Uoms.find(
      (option) => option.UomId === values.StartAgeUnits
    );
    const endAgeUnitOption = options?.Uoms.find(
      (option) => option.UomId === values.EndAgeUnits
    );

    const finalValues = {
      ...values,
      GenderType: genderOption?.LookupDescription,
      StartAgeUnitShortName: startAgeUnitOption?.ShortName,
      EndAgeUnitShortName: endAgeUnitOption?.ShortName,
    };

    handleSubmit(finalValues);
    handleCancel();
  };

  return (
    <div>
      <Spin spinning={loading}>
        <Modal
          title="Create Age Gender Restriction"
          open={open}
          maskClosable={false}
          footer={null}
          onCancel={handleCancel}
          width={700}
        >
          <Form
            style={{ margin: "1rem 0" }}
            layout="vertical"
            form={form}
            onFinish={onFinishForAddChargeParameters}
            onCancel={handleCancel}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col  span={8}>
                <Form.Item
                  name="Gender"
                  label="Gender"
                  rules={[{ required: true, message: "Please select Gender " }]}
                >
                  <Select>
                    {options?.Genders.map((option) => (
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
              <Col span={8}>
                <Form.Item
                  name="StartAge"
                  label="StartAge"
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col  span={8}>
                <Form.Item
                  name="StartAgeUnits"
                  label="Start Age Units"
                  rules={[
                    {
                      required: true,
                      message: "Please select Start Age Units ",
                    },
                  ]}
                >
                  <Select>
                    {options?.Uoms.map((option) => (
                      <Select.Option key={option.UomId} value={option.UomId}>
                        {option.ShortName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col  span={10}>
                <Form.Item
                  name="EndAge"
                  label="EndAge"
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col  span={10}>
                <Form.Item
                  name="EndAgeUnits"
                  label="End Age Units"
                  rules={[
                    { required: true, message: "Please select EndAge Units " },
                  ]}
                >
                  <Select>
                    {options?.Uoms.map((option) => (
                      <Select.Option key={option.UomId} value={option.UomId}>
                        {option.ShortName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} justify="end">
              <Col>
                <Form.Item>
                  <Button
                    type="default"
                    onClick={handleCancel}
                    style={{ marginRight: "8px" }}
                  >
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Submit
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

export default OrderingAttributeModal;
