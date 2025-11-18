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
import { v4 as uuidv4 } from "uuid";
function TurnAroundTimeTableModal({
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
    const TatUomOption = options?.Uoms.find(
      (option) => option.UomId === values.TatUom
    );

    const finalValues = {
      ...values,
      key: record ? record.key : "0",
      TatUomShortName: TatUomOption?.ShortName,
      ActiveFlag: true,
    };

    handleSubmit(finalValues);
    handleCancel();
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        TatId: record?.TatId,
        OrderPriorityId: record?.OrderPriorityId,
        TatValue: record?.TatValue,
        TatUom: record?.TatUom,
      });
    } else {
      form.resetFields();
    }
  }, [record, form]);

  return (
    <div>
      <Spin spinning={loading}>
        <Modal
          title="Create Turn Around Time"
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
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="OrderPriorityId"
                  label="Ordering Priority"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option key="Asap" value="Asap"></Select.Option>
                    <Select.Option
                      key="Routine"
                      value="Routine"
                    ></Select.Option>
                    <Select.Option key="Stat" value="Stat"></Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="TatId" hidden>
                  <Input />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="TatValue"
                  label="TAT"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="TatUom"
                  label="UOM"
                  rules={[{ required: true }]}
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

export default TurnAroundTimeTableModal;
