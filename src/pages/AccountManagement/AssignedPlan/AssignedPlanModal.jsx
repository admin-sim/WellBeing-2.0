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
import React, { useCallback, useEffect, useState } from "react";
const { Text } = Typography;
import customAxios from "../../../components/customAxios/customAxios";
import {
  urlSaveNewBillAgreementChargeParameter,
  urlPackageDescriptionServiceForInsurance,
  urlPackageDescriptionServiceGroup,
  urlPackageDescriptionServiceClassification,
  urlSaveNewAuthorisationLineChargeParameter,
} from "../../../../endpoints";

import { debounce } from "lodash";

function AssignedPlanModal({
  options,
  open,
  handleClose,
  planAuthId,
  setColumnData,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && options.Payer?.length === 1) {
      form.setFieldsValue({
        Payer: options.Payer[0]?.PayerId,
      });
    }
  }, [open, options.Payer, form]);

  const [loading, setLoading] = useState(false);

  const [url, setUrl] = useState();
  const [amtIndDisable, setAmtIndDisable] = useState(false);
  const [priorityDisable, setpriorityDisable] = useState(false);
  const [isMaxCoverageRequired, setIsMaxCoverageRequired] = useState(false);
  const  [IsExcludeDisable, setIsExcludeDisable] = useState(false);
  const handleCancel = () => {
    form.resetFields();
    setData([]);
    setUrl(undefined);
    setAmtIndDisable(false);
    setpriorityDisable(false);
    setIsExcludeDisable(false);
    handleClose();
  };
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

  const onFinishForAddChargeParameters = async (values) => {
    debugger;
    setLoading(true);
    values.PlanAuthId = planAuthId;
    values.AuthLineId = 0;
    values.Value = values.Value ? values.Value :null;
    values.AmtDeductible = values.AmtDeductible ? values.AmtDeductible : null;
    values.Qty = values.Qty ? values.Qty : null;
    values.MaxCoverageAmt = values.MaxCoverageAmt ? values.MaxCoverageAmt : null;
    values.AmtRequested = values.AmtRequested ? values.AmtRequested : null;
    try {
      const response = await customAxios.post(
        urlSaveNewAuthorisationLineChargeParameter,
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
          setColumnData(resdata.AuthorisationLine);
          handleCancel();
          message.success("Parameter Added Successfully");
        } else {
          message.error("Parameter With Same Name Already Exists");
        }
      }
    } catch (error) {
      message.error("Something went wrong");
      console.error(error);
    }
    setLoading(false);
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


  const handleQtyChange = (e) => {
    // If qty is changed, set both AmountIndicator to 'P' and Priority to 'A'
    const qty = e.target.value;
    if (qty) {
      form.setFieldsValue({
        AmtIndicator: "P", // Set AmountIndicator to Percentage
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
        AmtIndicator: "A", // Set AmountIndicator to Percentage
        Priority: "A", // Set Priority to Amount
      });
      setIsMaxCoverageRequired(false);
      //setpriorityDisable(false);
    }
  };

  // Handle changes to the Value input field
  const handleValueChange = (e) => {
    const currentValue = e.target.value;
    const amountIndicator = form.getFieldValue("AmtIndicator");

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
    debugger;
    if (e.target.checked) {
      form.setFieldsValue({
        Qty: null,
        Priority: null,
        Value: null,
        AmtIndicator:null,
        AmtDeductible:0,
        CoverageType:null,
        CoverageBy:null,
        MaxCoverageAmt:null,
        ApprovalCode:null,
        Remarks:null,
        AmtRequested:null,
        DenialCode:null,

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
          title="Authorisation Line Details"
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
            initialValues={{
              IsExcluded: false, // Set default value to false
              //AmtIndicator: "P",
              Priority: "A",
              CoverageType: "PD",
              CoverageBy: "Payer",
              ApprovalCode: "L",
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
                      {options.Provider?.map((option) => (
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
              <Col span={8}>
                <Form.Item
                  valuePropName="checked"
                  name="IsExcluded"
                  label="&nbsp;"
                >
                  <Checkbox onChange={handleIsExcludedd}>Is Excluded</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="DenialCode" label="DenialCode">
                  <Input disabled={IsExcludeDisable}></Input>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="Qty" label="Qty">
                  <Input disabled={IsExcludeDisable} onChange={handleQtyChange}></Input>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="AmtIndicator"
                  label="Amount Indicator"
                  //rules={[{ required: true }]}
                >
                  <Select   onChange={handleAmountIndicatorChange}
                    disabled={amtIndDisable}
                    allowClear>
                    <Select.Option key="A" value="A">
                      Amount
                    </Select.Option>
                    <Select.Option key="P" value="P">
                      Percentage
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item initialValue={0} name="Value" label="Value">
                  <Input disabled={IsExcludeDisable} onChange={handleValueChange}></Input>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="Priority"
                  label="Priority"
                 // rules={[{ required: true }]}
                >
                  <Select disabled={priorityDisable} >
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
                <Form.Item name="AmtRequested" label="RequestedAmount">
                  <Input disabled={IsExcludeDisable} type="number"></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  initialValue={0}
                  name="AmtDeductible"
                  label="Deductible"
                >
                  <Input disabled={IsExcludeDisable}></Input>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="CoverageType"
                  label="Coverage Limit"
                  // rules={[{ required: true }]}
                >
                  <Select disabled={IsExcludeDisable}>
                    <Select.Option key="PD" value="PD">
                      Per day
                    </Select.Option>
                    <Select.Option key="PE" value="PE">
                      Per encounter
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="CoverageBy"
                  label="Coverage"
                  //rules={[{ required: true }]}
                >
                  <Select disabled={IsExcludeDisable}>
                    <Select.Option key="Payer" value="Payer"></Select.Option>
                    <Select.Option
                      key="Patient"
                      value="Patient"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="MaxCoverageAmt" label="Max Coverage Limit"  
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
                ]}>
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
                  name="ApprovalCode"
                  label="ApprovalCode"
                  //  rules={[{ required: true }]}
                >
                  <Select disabled={IsExcludeDisable}>
                    <Select.Option key="L" value="L">
                      LifeTime
                    </Select.Option>
                    <Select.Option key="E" value="E">
                      Encounter
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="Remarks" label="Remarks">
                  <Input disabled={IsExcludeDisable}></Input>
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

export default AssignedPlanModal;
