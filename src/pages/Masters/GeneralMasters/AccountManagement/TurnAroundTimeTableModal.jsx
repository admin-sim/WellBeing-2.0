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
function TurnAroundTimeTableModal({
  options,
  open,
  handleClose,
  handleSubmit,
}) {
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
                <Form.Item name="OrderPriorityId" label="Ordering Priority">
                  <Select>
                    <Select.Option key="Asap" value="Asap"></Select.Option>
                    <Select.Option key="Routine" value="Routine"></Select.Option>
                    <Select.Option key="Stat" value="Stat"></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="TatValue"
                  label="TAT"
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col  span={8}>
                  <Form.Item
                    name="UOM"
                    label="UOM"
                   
                  >
                    <Select>
                      {options?.Uoms.map((option) => (
                        <Select.Option
                          key={option.UomId}
                          value={option.UomId}
                        >
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

export default TurnAroundTimeTableModal;
