import {
  Button,
  Checkbox,
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
import React, { useCallback, useState } from "react";
const { Text } = Typography;
//import { urlUpdateDiscount } from "../../../endpoints";
import { useEffect } from "react";
import {
  urlPackageDescriptionServiceClassification,
  urlPackageDescriptionServiceForInsurance,
  urlPackageDescriptionServiceGroup,
} from "../../../../../endpoints";
import { debounce } from "lodash";
import customAxios from "../../../../components/customAxios/customAxios";
function PackageIndicationModal({ options, open, handleClose, handleSubmit }) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  const onFinishForPackage = async (values) => {
    const indicator = options.Indicators.find(
      (opt) => opt.LookupID === values.Indicator
    );

    const description = data.find(
      (item) => item.Id === values.IndicatorDescriptionId
    );

    const uom = options.Uoms.find((opt) => opt.UomId === values.UOM);

    const transformedValues = {
      ...values,
      Indicator: {
        id: indicator?.LookupID,
        text: indicator?.LookupDescription,
      },
      IndicatorId: indicator?.LookupID || null,
      DescriptionId: description?.Id || null,
      DescriptionName: description?.Name || "",
      IsExcluded: values.IsExcluded ? "Yes" : "No",
      IsReplaceable: values.IsReplaceable ? "Yes" : "No",
      ReplaceableDescriptionName: values.ReplaceableDescriptionName || "",
      ReplaceableDescriptionId: values.ReplaceableDescriptionId || null,
      MaxQty: values.MaxQty ? parseInt(values.MaxQty) : 0,
      UomName: uom?.ShortName || "",
      ServiceUom: uom?.UomId || 0,
      MaxAmount: values.MaxAmount ? parseFloat(values.MaxAmount) : 0,
      Preference: values.Preference === "Quantity" ? "Q" : "A",
      PkgPrice: values.PkgPrice ? parseInt(values.PkgPrice) : 0,
      AllowFund: values.AllowFund ? "Yes" : "No",
      MaximunRefundAmount: values.MaximunRefundAmount
        ? parseInt(values.MaximunRefundAmount)
        : 0,
      ServicePackageId: values.ServicePackageId || null,
      ServiceId: values.ServiceId || null,
    };
    

    handleSubmit(transformedValues);
    handleCancel();
  };

  const handleCheckboxChange = (e) => {};

  const [url, setUrl] = useState();
  const [data, setData] = useState([]);
  const [value, setValue] = useState(undefined);
  const [fetching, setFetching] = useState(false);
  const [descriptionDisabled, setDescriptionDisabled] = useState(true);
  const IndicatorOnchange = (value, option) => {
    console.log("Selected value:", value);
    console.log("Selected option:", option);
    form.setFieldsValue({ IndicatorDescriptionId: undefined });
    setData([]);

    form.resetFields(["IndicatorDescriptionId"]); // Corrected to use an array
    // Update the URL based on the selected option
    if (option.children !== "All") {
      setDescriptionDisabled(false);
      switch (option.children) {
        case "Service Group":
          setUrl(urlPackageDescriptionServiceGroup);
          break;
        case "Service Classification":
          setUrl(urlPackageDescriptionServiceClassification);
          break;
        default:
          setUrl(urlPackageDescriptionServiceForInsurance);
          break;
      }
    } else {
      setDescriptionDisabled(true);
    }
  };
  const fetchOptions = async (value) => {
    debugger;
    if (!url || !value) {
      setData([]);
      //message.warning('Please Select Indicator First..')
      return;
    }
    setFetching(true);
    if (value) {
      try {
        const response = await customAxios.get(`${url}?Description=${value}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setData([]);
    }
    setFetching(false);
  };

  const debounceFetchOptions = useCallback(debounce(fetchOptions, 800), [url]);
  return (
    <div>
      <Spin spinning={loading}>
        <Modal
          title={<div style={{ color: "#1677ff" }}>Package</div>}
          open={open}
          maskClosable={false}
          footer={null}
          onCancel={handleCancel}
          width={700}
        >
          <Form
            //style={{ margin: "0.5rem 0" }}
            layout="vertical"
            form={form}
            onFinish={onFinishForPackage}
            initialValues={{
              Preference: "Quantity",
              Excluded: false,
              Replaceable: false,
              RefundAmount: 0,
            }}
            onCancel={handleCancel}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="Indicator"
                  label="Indicator"
                  rules={[
                    { required: true, message: "Please select Indicator" },
                  ]}
                >
                  <Select onChange={IndicatorOnchange}>
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
              <Col span={8}>
                <Form.Item name="IndicatorDescriptionId" label="Description">
                  {/* <Input style={{ width: "100%" }} /> */}
                  <Select
                    showSearch
                    value={value}
                    allowClear
                    placeholder="Select an option"
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={debounceFetchOptions}
                    onChange={(newValue) => setValue(newValue)}
                    disabled={descriptionDisabled}
                    style={{ width: "100%" }}
                  >
                    {data.map((item) => (
                      <Option key={item.Id} value={item.Id}>
                        {item.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Excluded?"
                  name="IsExcluded"
                  valuePropName="checked"
                >
                  <Checkbox onChange={handleCheckboxChange} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Replaceable?"
                  name="IsReplaceable"
                  valuePropName="checked"
                >
                  <Checkbox onChange={handleCheckboxChange} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="ReplaceableDescriptionName"
                  label="Replaceable Description"
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Qty" name="MaxQty">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="UOM" label="UOM" rules={[{ required: true }]}>
                  <Select>
                    {options?.Uoms.map((option) => (
                      <Select.Option key={option.UomId} value={option.UomId}>
                        {option.ShortName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Amount"
                  name="MaxAmount"
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Form.Item name="ServiceId" hidden>
                <Input />
              </Form.Item>

              <Form.Item name="ServicePackageId" hidden>
                <Input />
              </Form.Item>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="Preference" label="Preference">
                  <Select>
                    <Select.Option
                      key="Quantity"
                      value="Quantity"
                    ></Select.Option>
                    <Select.Option key="Amount" value="Amount"></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Package Price" name="PkgPrice">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Refundable ?"
                  name="AllowFund"
                  valuePropName="checked"
                >
                  <Checkbox onChange={handleCheckboxChange} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Refund Amount" name="MaximunRefundAmount">
                  <Input style={{ width: "100%" }} />
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
                    AddToList
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

export default PackageIndicationModal;
