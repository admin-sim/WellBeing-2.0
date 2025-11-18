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
import { v4 as uuidv4 } from "uuid";
function OrderingAttributeModal({
  options,
  record,
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
    const genderOption = options?.Genders.find(
      (option) => option.LookupID === values.Gender
    );
    const startAgeUnitOption = options?.Uoms.find(
      (option) => option.UomId === values.StartAgeUom
    );
    const endAgeUnitOption = options?.Uoms.find(
      (option) => option.UomId === values.EndAgeUom
    );

    const finalValues = {
      ...values,
      key: record ? record.key : "0",
      GenderType: genderOption?.LookupDescription,
      StartAgeUomName:
        startAgeUnitOption?.ShortName +
        " (" +
        startAgeUnitOption?.LongName +
        ")",
      EndAgeUomName:
        endAgeUnitOption?.ShortName + " (" + endAgeUnitOption?.LongName + ")",
      ActiveFlag: true,
    };

    handleSubmit(finalValues);
    handleCancel();
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        Gender: record?.Gender,
        StartAge: record?.StartAge,
        StartAgeUom: record?.StartAgeUom,
        EndAge: record?.EndAge,
        EndAgeUom: record?.EndAgeUom,
        ServiceOrderAttributeId: record?.ServiceOrderAttributeId,
      });
    } else {
      form.resetFields();
    }
  }, [record, form]);

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
              <Col span={8}>
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
                <Form.Item hidden name="ServiceOrderAttributeId">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="StartAge"
                  label="Start Age"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="StartAgeUom"
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
                        {option.ShortName + " (" + option?.LongName + ")"}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="EndAge"
                  label="End Age"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="EndAgeUom"
                  label="End Age Units"
                  rules={[
                    { required: true, message: "Please select EndAge Units " },
                  ]}
                >
                  <Select>
                    {options?.Uoms.map((option) => (
                      <Select.Option key={option.UomId} value={option.UomId}>
                        {option.ShortName + " (" + option?.LongName + ")"}
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
