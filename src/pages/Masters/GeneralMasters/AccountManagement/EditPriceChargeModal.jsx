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
import React, { useState, useEffect, useCallback } from "react";
const { Text } = Typography;
import customAxios from "../../../../components/customAxios/customAxios";
import { urlUpdatePriceTariffChargeParameter, urlPackageDescriptionServiceForInsurance,
  urlPackageDescriptionServiceGroup,
  urlPackageDescriptionServiceClassification, } from "../../../../../endpoints";
import dayjs from "dayjs";
import { debounce } from "lodash";

function EditPriceChargeModal({
  options,
  open,
  handleClose,
  editedpriceTarifflineId,
  setColumnData,
  linedata,
}) {
  const [form] = Form.useForm();
  // const [effectiveFromDatemodal, setEffectiveFromDateModal] = useState(null);
  // const [effectiveToDatemodal, setEffectiveToDateModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [value, setValue] = useState(undefined);
  const [fetching, setFetching] = useState(false);
  const [descriptionDisabled, setDescriptionDisabled] = useState(false);

  //setValue(linedata?.IndicatorDescriptionId);
  const [url, setUrl] = useState();
  useEffect(() => {
    if (linedata) {
      form.setFieldsValue({
        PatientTypeId: linedata.PatientTypeId,
        Indicator: linedata.Indicator,
        IndicatorDescriptionId: linedata.IndicatorDescriptionName,
        TariffLineIndicator: linedata.TariffLineIndicator,
        FactorAmount: linedata.FactorAmount,
        TariffLineValue: linedata.TariffLineValue,
        Status: linedata.Status,
        Nationality: linedata.Nationality,
        Gender: linedata.Gender,
        Payer: linedata.Payer,
        WardType: linedata.WardType,
        Provider: linedata.Provider,
        IncomeLimit: linedata.IncomeLimit,
        EffectiveFrom: linedata.EffectiveFromDate
          ? dayjs(linedata.EffectiveFromDate, "DD-MM-YYYY")
          : null,
        EffectiveTo: linedata.EffectiveToDate
          ? dayjs(linedata.EffectiveToDate, "DD-MM-YYYY")
          : null,
      });
      setValue(linedata.IndicatorDescriptionId);
      //setDescriptionName(linedata.IndicatorDescriptionName);
    }
  }, [linedata]);

  const handleCancel = () => {
    form.resetFields();
    setData([]);
    setValue(undefined);
    setUrl(undefined);
    handleClose();
  };

  const onFinishForUpdateChargeParameters = async (values) => {
    debugger;
    console.log('value',value);
    setLoading(true);
    // values.EffectiveFromDate = effectiveFromDatemodal;
    // values.EffectiveToDate = effectiveToDatemodal;
    values.EffectiveFromDate = values.EffectiveFrom
      ? values.EffectiveFrom.format("DD-MM-YYYY")
      : "";
    values.EffectiveToDate = values.EffectiveTo
      ? values.EffectiveTo.format("DD-MM-YYYY")
      : "";
    values.PriceTariffId = linedata.PriceTariffId;
    values.PriceTariffLineId = editedpriceTarifflineId;
    values.RevisionNo = 0;
    values.IndicatorDescriptionId=value;
    values.TariffLineValue=values.TariffLineValue ? values.TariffLineValue :0;
    console.log(linedata, "linedata");
    try {
      const response = await customAxios.post(
        urlUpdatePriceTariffChargeParameter,
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
          message.success("PriceTariffChargeParameter Updated  Successfully");
        } else {
          message.error("Something Went Wrong");
        }
      }
    } catch (error) {
      message.error("Something went wrong");
      console.error(error);
    }
    setLoading(false);
  };





  const IndicatorOnchange = (value, option) => {
    console.log("Selected value:", value);
    console.log("Selected option:", option);
    form.setFieldsValue({ IndicatorDescriptionId: undefined });
    setValue(undefined);
    setData([]);
  
    form.resetFields(['IndicatorDescriptionId']); // Corrected to use an array
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
    }
    else{
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
    if(value){
      try {
        const response = await customAxios.get(`${url}?Description=${value}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    else{
      setData([]);
    }
    setFetching(false);
  };

  const debounceFetchOptions = useCallback(debounce(fetchOptions, 800), [url]);

  const handleDescription = (newValue, option) => {
    setValue(newValue);
    //setDescriptionName(option.children);
    form.setFieldsValue({
      IndicatorDescriptionId: newValue,
    });
  };

  return (
    <div>
      <Spin spinning={loading}>
        <Modal
          title="Update Price Tariff"
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
            onFinish={onFinishForUpdateChargeParameters}
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
              {options.PayerFlag && (
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="Payer"
                    label="Payer"
                    ///initialValue={options.Payer[0]?.PayerId}
                    rules={[
                      { required: true, message: "Please select Payer " },
                    ]}
                  >
                    <Select disabled>
                      {options.Payers?.map((option) => (
                        <Select.Option
                          key={option.PayerId}
                          value={option.PayerId}
                        >
                          {option.PayerName}
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
                  <Select  onChange={IndicatorOnchange}>
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
                    onChange={handleDescription}
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
                    //onChange={handleEfeectiveFromModal}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item label="EffectiveTo" name="EffectiveTo">
                  <DatePicker
                    style={{ width: "100%" }}
                  //  onChange={handleEfeectiveToModal}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} justify="end">
            <Col>
              <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                  Submit
                </Button>
                <Button type="default" onClick={handleCancel} >
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

export default EditPriceChargeModal;
