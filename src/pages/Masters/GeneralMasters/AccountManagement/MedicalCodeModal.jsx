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
import { v4 as uuidv4 } from "uuid";
const { Text } = Typography;
//import { urlUpdateDiscount } from "../../../endpoints";
import { useEffect } from "react";
function MedicalCodeModal({
  options,
  open,
  handleClose,
  handleSubmit,
  record,
}) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  const onFinishForAddChargeParameters = async (values) => {
    const genderOption = options?.MedicalCodeTypes.find(
      (option) => option.LookupID === values.MedicalCodeTypeId
    );

    const finalValues = {
      ...values,
      key: record ? record.key : "0",
      MedicalCodeTypeName: genderOption?.LookupDescription,
    };

    handleSubmit(finalValues);
    handleCancel();
  };

  useEffect(() => {
    fetchMedicalCodeTypes(record);
  }, [record]);

  async function fetchMedicalCodeTypes(record) {
    if (record) {
      try {
        form.setFieldsValue({
          MedicalCodeId: record?.MedicalCodeId,
          MedicalCodeTypeId: record?.MedicalCodeTypeId,
          Version: record?.Version,
          MedicalCodeTypeDescription: record?.MedicalCodeTypeDescription,
          ActiveFlag: record?.ActiveFlag,
        });
      } catch (err) {
        // form.resetFields();
      }
    }
  }

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
                  name="MedicalCodeTypeId"
                  label="MedicalCodeTypes"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select Medical Code">
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
                <Form.Item name="MedicalCodeId" hidden>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
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
                <Form.Item
                  name="ActiveFlag"
                  label="Status"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select Status">
                    <Select.Option value={true}>Active</Select.Option>
                    <Select.Option value={false}>Hidden</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} justify="end">
              <Col>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: "8px" }}
                  >
                    Submit
                  </Button>
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

export default MedicalCodeModal;
