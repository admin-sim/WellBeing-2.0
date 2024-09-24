import {
  Button,
  Checkbox,
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
import {
  urlUpdatePriceTariffChargeParameter,
  urlPackageDescriptionServiceForInsurance,
  urlPackageDescriptionServiceGroup,
  urlPackageDescriptionServiceClassification,
  urlUpdateBillAgreementChargeParameter,
} from "../../../../../endpoints";
import dayjs from "dayjs";
import { debounce } from "lodash";

function EditBillAgrementModal({
  options,
  open,
  handleClose,
  editedAgrementlineId,
  setColumnData,
  linedata,
}) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [value, setValue] = useState(undefined);
  const [fetching, setFetching] = useState(false);
  const [descriptionDisabled, setDescriptionDisabled] = useState(false);
  const [amtIndDisable, setAmtIndDisable] = useState(false);
  const [priorityDisable, setpriorityDisable] = useState(false);
  const [isMaxCoverageRequired, setIsMaxCoverageRequired] = useState(false);
  const  [IsExcludeDisable, setIsExcludeDisable] = useState(false);
  //setValue(linedata?.IndicatorDescriptionId);
  const [url, setUrl] = useState();
  useEffect(() => {
    if (linedata) {
      form.setFieldsValue({
        Indicator: linedata.Indicator,
        IndicatorDescriptionId: linedata.IndicatorDescriptionName,
        IsExcluded: linedata.IsExcluded,
        FactorAmount: linedata.FactorAmount,
        TariffLineValue: linedata.TariffLineValue,
        Status: linedata.Status,
        MaxQty: linedata.MaxQty,
        AmountIndicator: linedata.AmountIndicator,
        Value: linedata.Value,
        Priority: linedata.Priority,
        Deductible: linedata.Deductible,
        CoverageType: linedata.CoverageType,
        CoverageBy: linedata.CoverageBy,
        MaxCoverage: linedata.MaxCoverage,
        ApplicableTo: linedata.ApplicableTo,
        IsPreauthRequired: linedata.IsPreauthRequired,
        IsShared: linedata.IsShared,
        Nationality: linedata.Nationality,
        PatientTypeId: linedata.PatientTypeId,
        Payer: linedata.Payer,
        Gender: linedata.Gender,
        WardType: linedata.WardTypeId,
        Provider: linedata.Provider,
        IncomeLimit: linedata.IncomeLimit,
      });
      setValue(linedata.IndicatorDescriptionId);
      //setDescriptionName(linedata.IndicatorDescriptionName);
    }
    if (linedata?.MaxQty > 0) {
      setAmtIndDisable(true);
      setpriorityDisable(true);
      setIsMaxCoverageRequired(true);
    }
    if (linedata?.IsExcluded) {
      setIsMaxCoverageRequired(false);
      setAmtIndDisable(true);
      setpriorityDisable(true);
     setIsExcludeDisable(true);
    }

  }, [linedata]);

  const handleCancel = () => {
    form.resetFields();
    setData([]);
    setValue(undefined);
    setUrl(undefined);
    setAmtIndDisable(false);
    setpriorityDisable(false);
    setIsExcludeDisable(false);
    handleClose();
  };

  const onFinishForUpdateChargeParameters = async (values) => {
    debugger;
    console.log("value", value);
    setLoading(true);

    values.AgreementId = linedata.AgreementId;
    values.AgreementLineId = editedAgrementlineId;
    values.RevisionNo = 0;
    values.IndicatorDescriptionId = value;
    values.MaxQty = values.MaxQty ? values.MaxQty : null;
    values.MaxCoverage = values.MaxCoverage ? values.MaxCoverage : null;
    values.Value = values.Value ? values.Value :null;
    values.Deductible = values.Deductible ? values.Deductible :0;
    console.log(linedata, "linedata");
    try {
      const response = await customAxios.post(
        urlUpdateBillAgreementChargeParameter,
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
          setColumnData(resdata.BillAgreementLineModels);
          handleCancel();
          message.success("BillAgrementChargeParameter Updated  Successfully...");
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

  const handleDescription = (newValue, option) => {
    setValue(newValue);
    //setDescriptionName(option.children);
    form.setFieldsValue({
      IndicatorDescriptionId: newValue,
    });
  };

  const handleQtyChange = (e) => {
    // If qty is changed, set both AmountIndicator to 'P' and Priority to 'A'
    const qty = e.target.value;
    if (qty) {
      form.setFieldsValue({
        AmountIndicator: "P", // Set AmountIndicator to Percentage
        Priority: "Q", // Set Priority to Amount
      });

      setAmtIndDisable(true);
      setpriorityDisable(true);
      setIsMaxCoverageRequired(true);
      // Check if Value is greater than 100 when Qty is present
      const currentValue = form.getFieldValue("Value");
      if (currentValue > 100) {
        form.setFieldsValue({ Value: 100 }); // Set Value to 100 if greater than 100
      }
    } else {
      setAmtIndDisable(false);
      form.setFieldsValue({
        AmountIndicator: "A", // Set AmountIndicator to Percentage
        Priority: "A", // Set Priority to Amount
      });
      setIsMaxCoverageRequired(false);
      //setpriorityDisable(false);
    }
  };

  // Handle changes to the Value input field
  const handleValueChange = (e) => {
    const currentValue = e.target.value;
    const amountIndicator = form.getFieldValue("AmountIndicator");

    // Check if AmountIndicator is 'P' and Value is greater than 100
    if (amountIndicator === "P" && currentValue > 100) {
      form.setFieldsValue({ Value: 100 }); // Set Value to 100 if it's greater than 100
    }
  };

  // Handle changes to the AmountIndicator Select
  const handleAmountIndicatorChange = (value) => {
    const currentValue = form.getFieldValue("Value");

    // If AmountIndicator is changed to 'P' and Value is greater than 100, set it to 100
    if (value === "P") {
      setIsMaxCoverageRequired(true); // Make MaxCoverage required
      if (currentValue > 100) {
        form.setFieldsValue({ Value: 100 }); // Set Value to 100 if it's greater than 100
      }
    } else {
      setIsMaxCoverageRequired(false); // Make MaxCoverage not required
    }
  };

  const handleIsExcludedd = (e) => {
    if (e.target.checked) {
      form.setFieldsValue({
        MaxQty: null,
        Priority: null,
        Value: null,
        AmountIndicator:null,
        Deductible:0,
        CoverageType:null,
        CoverageBy:null,
        MaxCoverage:null,
        ApplicableTo:null,
        IsPreauthRequired:false,
        IsShared:false,
      });
      setIsMaxCoverageRequired(false);
      setAmtIndDisable(true);
      setpriorityDisable(true);
     setIsExcludeDisable(true);
    }else{
      setAmtIndDisable(false);
      setpriorityDisable(false);
     setIsExcludeDisable(false);
    }
  };

  return (
    <div>
      <Spin spinning={loading}>
        <Modal
          title="Edit Bill AgreementLine Details"
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
            onFinish={onFinishForUpdateChargeParameters}
            onCancel={handleCancel}
            initialValues={{
              IsPreauthRequired: false, // Set default value to false
              IsShared: false,
              IsExcluded: false, // Set default value to false
              //AmountIndicator: "P",
              Priority: "A",
              CoverageType: "PD",
              CoverageBy: "Payer",
              ApplicableTo: "L",
            }}
          >
            <Row gutter={16}>
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
                    initialValue={options.Payer[0]?.PayerId}
                    rules={[
                      { required: true, message: "Please select Payer " },
                    ]}
                  >
                    <Select disabled>
                      {options.Payer?.map((option) => (
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
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
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
              <Col span={8}>
                <Form.Item
                  valuePropName="checked"
                  name="IsExcluded"
                  label="&nbsp;"
                >
                  <Checkbox onChange={handleIsExcludedd} >Is Excluded</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="MaxQty" label="Qty">
                  <Input  disabled={IsExcludeDisable} onChange={handleQtyChange}></Input>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="AmountIndicator"
                  label="Amount Indicator"
                  //rules={[{ required: true }]}
                >
                  <Select
                    onChange={handleAmountIndicatorChange}
                    disabled={amtIndDisable}
                    allowClear
                  >
                    <Select.Option key="A" value="A">
                      Amount
                    </Select.Option>
                    <Select.Option key="P" value="P">
                      Percentage
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item initialValue={0} name="Value" label="Value">
                  <Input  disabled={IsExcludeDisable} onChange={handleValueChange}></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="Priority"
                  label="Priority"
                  //rules={[{ required: true }]}
                >
                  <Select disabled={priorityDisable}>
                    <Select.Option key="A" value="A">
                      Amount
                    </Select.Option>
                    <Select.Option key="Q" value="Q">
                      Quantity
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  initialValue={0}
                  name="Deductible"
                  label="Deductible"
                >
                  <Input  disabled={IsExcludeDisable}></Input>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="CoverageType"
                  label="CoverageType"
                  // rules={[{ required: true }]}
                >
                  <Select  disabled={IsExcludeDisable}>
                    <Select.Option key="PD" value="PD">
                      Per day
                    </Select.Option>
                    <Select.Option key="PE" value="PE">
                      Per encounter
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="CoverageBy"
                  label="Coverage"
                  //rules={[{ required: true }]}
                >
                  <Select  disabled={IsExcludeDisable}>
                    <Select.Option key="Payer" value="Payer"></Select.Option>
                    <Select.Option
                      key="Patient"
                      value="Patient"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  initialValue={0}
                  name="MaxCoverage"
                  label="MaxCoverage"
                  rules={[
                    ...(isMaxCoverageRequired
                      ? [
                          {
                            required: true,
                            message:
                              "MaxCoverage is required when Amount Indicator is Percentage",
                          },
                        ]
                      : []),
                    {
                      validator(_, value) {
                        if (!value || /^[0-9]{1,10}$/.test(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "MaxCoverage must be an integer and at most 10 digits"
                          )
                        );
                      },
                    },
                  ]}
                >
                  <Input
                   disabled={IsExcludeDisable}
                    type="number"
                    maxLength={10}
                    onInput={(e) => {
                      e.target.value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10);
                    }}
                    inputMode="numeric"
                  />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="ApplicableTo"
                  label="Applicable To"
                  //  rules={[{ required: true }]}
                >
                  <Select  disabled={IsExcludeDisable}>
                    <Select.Option key="L" value="L">
                      LifeTime
                    </Select.Option>
                    <Select.Option key="E" value="E">
                      Encounter
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  valuePropName="checked"
                  name="IsPreauthRequired"
                  label="&nbsp;"
                >
                  <Checkbox  disabled={IsExcludeDisable}> Pre Auth?</Checkbox>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  valuePropName="checked"
                  name="IsShared"
                  label="&nbsp;"
                >
                  <Checkbox  disabled={IsExcludeDisable}>Shared?</Checkbox>
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
                    Update
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

export default EditBillAgrementModal;
