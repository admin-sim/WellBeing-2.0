import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
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
import { urlSaveNewPriceTariffChargeParameter } from "../../../../../endpoints";

function PriceChargeModal({
  options,
  open,
  handleClose,
  priceTariffId,
  setColumnData,
}) {
  const [form] = Form.useForm();
  const [effectiveFromDatemodal, setEffectiveFromDateModal] = useState(null);
  const [effectiveToDatemodal, setEffectiveToDateModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  const onFinishForAddChargeParameters = async (values) => {
    setLoading(true);
    values.EffectiveFromDate = effectiveFromDatemodal;
    values.EffectiveToDate = effectiveToDatemodal;
    values.PriceTariffId = priceTariffId;
    try {
      const response = await customAxios.post(
        urlSaveNewPriceTariffChargeParameter,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200 && response.data) {
        if (response.status === 200 && response.data.data != null) {
          const resdata = response.data.data;
          setColumnData(resdata.BillTariffLineModels);
          handleCancel();
          message.success("PriceTariffCreated Successfully");
        } else {
          message.error("PriceTariff With Same Name Already Exists");
        }
      }
    } catch (error) {
      message.error("Something went wrong");
      console.error(error);
    }
    setLoading(false);
  };

  const handleEfeectiveFromModal = (date, dateString) => {
    setEffectiveFromDateModal(dateString);
  };
  const handleEfeectiveToModal = (date, dateString) => {
    setEffectiveToDateModal(dateString);
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
          width={800}
        >
          <Form
            style={{ margin: "1rem 0" }}
            layout="vertical"
            form={form}
            onFinish={onFinishForAddChargeParameters}
            onCancel={handleCancel}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {options.NationalityFlag && (
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="Nationality"
                    label="Nationality"
                    rules={[
                      { required: true, message: "Please select PatientType " },
                    ]}
                  >
                    <Select>
                      {options.Nationality?.map((option) => (
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
              )}
               {options.PatientTypeFlag && (
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="PatientTypeId"
                    label="PatientType"
                    rules={[
                      { required: true, message: "Please select PatientType " },
                    ]}
                  >
                    <Select>
                      {options.PatientType?.map((option) => (
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
              )}
               {options.GenderFlag && (
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="Gender"
                    label="Gender"
                    rules={[
                      { required: true, message: "Please select PatientType " },
                    ]}
                  >
                    <Select>
                      {options.Gender?.map((option) => (
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
              )}
                 {options.WardTypeFlag && (
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="WardType"
                    label="WardType"
                    rules={[
                      { required: true, message: "Please select PatientType " },
                    ]}
                  >
                    <Select>
                      {options.WardType?.map((option) => (
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
              )}
               {options.ProviderFlag && (
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="Provider"
                    label="Provider"
                    rules={[
                      { required: true, message: "Please select PatientType " },
                    ]}
                  >
                    <Select>
                      {options.WardType?.map((option) => (
                        <Select.Option
                          key={option.ProviderId}
                          value={option.ProviderId}
                        >
                          {option.ProviderFirstName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
                 {options.FamilyIncomeFlag && (
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="IncomeLimit"
                    label="FamilyIncomeLimit"
                    rules={[
                      { required: true, message: "Please select PatientType " },
                    ]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              )}
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="Indicator"
                  label="Indicator"
                  rules={[
                    { required: true, message: "Please select Indicator" },
                  ]}
                >
                  <Select>
                    {options.Indicators?.map((option) => (
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
              <Col className="gutter-row" span={8}>
                <Form.Item name="Description" label="Description">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={8}>
                <Form.Item name="TariffLineIndicator" label="TariffIndicator">
                  <Select>
                    <Select.Option
                      key="Mark Up"
                      value="Mark Up"
                    ></Select.Option>
                    <Select.Option
                      key="Mark Down"
                      value="Mark Down"
                    ></Select.Option>
                    <Select.Option
                      key="Tariff Price"
                      value="Tariff Price"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="FactorAmount"
                  label="Factor/Amount"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option key="Amount" value="Amount"></Select.Option>
                    <Select.Option key="Factor" value="Factor"></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item name="TariffLineValue" label="Value">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="Status"
                  label="Status"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option key="Active" value="Active"></Select.Option>
                    <Select.Option key="Hidden" value="Hidden"></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item label="EffectiveFrom" name="EffectiveFrom">
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={handleEfeectiveFromModal}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item label="EffectiveTo" name="EffectiveTo">
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={handleEfeectiveToModal}
                    format="DD-MM-YYYY"
                  />
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

export default PriceChargeModal;
