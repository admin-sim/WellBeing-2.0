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
//import { urlUpdateDiscount } from "../../../endpoints";
import { useEffect } from "react";
function MedicalCodeModal({ options, open, handleClose, handleSubmit }) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  const onFinishForAddChargeParameters = async (values) => {
    debugger;

    //   const genderOption = options?.Genders.find(
    //     (option) => option.LookupID === values.Gender
    //   );
    //   const startAgeUnitOption = options?.Uoms.find(
    //     (option) => option.UomId === values.StartAgeUnits
    //   );
    //   const endAgeUnitOption = options?.Uoms.find(
    //     (option) => option.UomId === values.EndAgeUnits
    //   );

    //   const finalValues = {
    //     ...values,
    //     GenderType: genderOption?.LookupDescription,
    //     StartAgeUnitShortName: startAgeUnitOption?.ShortName,
    //     EndAgeUnitShortName: endAgeUnitOption?.ShortName,
    //   };

    handleSubmit(values);
    handleCancel();
  };

  return (
    <div>
      <Spin spinning={loading}>
        <Modal
          title="Create Medical Code"
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
            onFinish={onFinishForAddChargeParameters}
            onCancel={handleCancel}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="MedicalCodeTypeName"
                  label="MedicalCodeTypes"
                  rules={[{ required: true, message: "Please select Gender " }]}
                >
                  <Select>
                    {options?.MedicalCodeTypes.map((option) => (
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
              <Col  span={12}>
                <Form.Item
                  name="Version"
                  label="Version"
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="MedicalCodeTypeDescription"
                  label="MedicalRef."
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="Status" label="Status">
                  <Select>
                    <Select.Option key="Active" value="Active"></Select.Option>
                    <Select.Option key="Hidden" value="Hidden"></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} justify="end">
            <Col>
              <Form.Item>
                <Button type="default" onClick={handleCancel} style={{ marginRight: '8px' }}>
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

export default MedicalCodeModal;
