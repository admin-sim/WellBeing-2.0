import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  Layout,
  Card,
  DatePicker,
  message,
  AutoComplete,
  notification,
  Checkbox,
  InputNumber,
  TimePicker,
} from "antd";
import Input from "antd/es/input/Input";
import customAxios from "../../../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";
import {
  urlCreateAutoCharge,
  urlUpdateAutoCharge,
  urlChargeExceptionCreate,
  urlPackageDescriptionService,
  urlPackageDescriptionServiceGroup,
  urlPackageDescriptionServiceClassification,
} from "../../../../../endpoints";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader";
import { FaAnglesLeft } from "react-icons/fa6";
import dayjs from "dayjs";
import CustomTable from "../../../../components/customTable";
import { CloseSquareFilled, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

function CreateChargeException() {
  const location = useLocation();
  const AutoChargeId = location.state?.AutoChargeId;
  const navigate = useNavigate();
  const [chargeProviderId, setChargeProviderId] = useState(null);
  const [serviceId, setSelectedServiceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [autoChargeDropDown, setAutoChargeDropDown] = useState({
    PatientType: [],
    Facility: [],
    EncounterType: [],
  });
  const [isIndicator, setIsIndicator] = useState(true);
  const [dropDown, setDropDown] = useState([]);
  const [checkFirst, setCheckFirst] = useState(false);
  const [checkSecond, setCheckSecond] = useState(false);
  const [checkThird, setCheckThird] = useState(false);
  const [checkFour, setCheckFour] = useState(false);
  const [checkFive, setCheckFive] = useState(false);
  const [checkSix, setCheckSix] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataModel, setDataModel] = useState([]);
  const ExceptionHeaderId = location.state.ExceptionHeaderId;
  const [productOptions, setProductOptions] = useState([]);
  const [url, setUrl] = useState();
  const [isDescription, setIsDescription] = useState(false);

  useEffect(() => {
    customAxios.get(urlChargeExceptionCreate).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    //setLoading(true);
    try {
      const response = await customAxios.get(`${urlChargeExceptionEdit}`);
      if (response.status == 200 && response.data.data != null) {
        setAutoChargeDropDown(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
    //setLoading(false);
  };

  const handleSelect = (value, option) => {
    debugger;
    form1.setFieldsValue({ DescriptionId: option.key });
    form1.setFieldsValue({ IndicatorDescriptionName: option.value });
  };

  const handleSearch = async (searchText) => {
    debugger;
    if (searchText) {
      const response = await customAxios.get(
        `${url}?Description=${searchText}`
      );
      const apiData =
        url == urlPackageDescriptionService
          ? response.data.data
          : response.data;
      const newOptions = apiData.map((item) => ({
        value: item.Name,
        key: item.Id,
      }));
      setProductOptions(newOptions);
    }
  };

  const onFinish = async (values) => {
    debugger;
    const AddNewChargeFactors = [];
    checkFirst;
    if (checkFirst) {
      const first = {
        ChargeIndicator: values.ChargeIndicatorFirst,
        Value1: values.Value1First,
        Value2: values.Value2First,
        Interval: values.IntervalFirst,
        ChargeFactor: "Days after last IP Encounter",
      };
      AddNewChargeFactors.push(first);
    }
    if (checkSecond) {
      const second = {
        HolidayId: values.HolidayId,
        ChargeFactor: "Holiday",
      };
      AddNewChargeFactors.push(second);
    }
    if (checkThird) {
      const Third = {
        ServiceLocationId: values.ServiceLocations,
        ChargeFactor: "Service Location",
      };
      AddNewChargeFactors.push(Third);
    }
    if (checkFour) {
      const four = {
        TimeFrom: values.TimeFrom,
        TimeTo: values.TimeTo,
        ChargeFactor: "Time of Service",
      };
      AddNewChargeFactors.push(four);
    }
    if (checkFive) {
      const five = {
        ChargeIndicator: values.ChargeIndicatorFifth,
        Value1: values.Value1Fifth,
        Value2: values.Value2Fifth,
        Interval: values.IntervalFifth,
        ChargeFactor: "Days after last original service",
      };
      AddNewChargeFactors.push(five);
    }
    if (checkSix) {
      const six = {
        ChargeIndicator: values.ChargeIndicatorSixth,
        Value1: values.Value1Sixth,
        Value2: values.Value2Sixth,
        Interval: values.IntervalSixth,
        ChargeFactor: "Days after last OP encounter",
      };
      AddNewChargeFactors.push(six);
    }
    console.log("values", values);
    const header = {
      ShortName: values.ShortName,
      LongName: values.LongName,
      EffectiveFromDate: values.EffectiveFromDate.format("YYYY-MM-DD"),
      FacilityId: values.FacilityId,
      Priority: values.Priority,
      Status: values.Status,
    };

    const ChargeFactor = {
      ChargeIndicator: "FirstChargeIndicator",
    };

    if (AutoChargeId) {
      values.AutoChargeId = AutoChargeId;
      try {
        const response = await customAxios.post(urlUpdateAutoCharge, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status == 200 && response.data.data === true) {
          console.log("response.data.data", response.data.data);
          notification.success({
            message: "Success",
            description: "AutoCharge Updated Succeessfully.....",
          });
          form.resetFields();
          const url = "/AutoCharge";
          navigate(url);
        } else {
          notification.error({
            message: "Error",
            description: "Something Went Wrong.....",
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Something Went Wrong.....",
        });
      }
    }
  };

  const columns = [
    {
      title: "Indicator",
      dataIndex: "ChargeIndicator",
      key: "ChargeIndicator",
    },
    {
      title: "Description",
      dataIndex: "IndicatorDescriptionName",
      key: "IndicatorDescriptionName",
    },
    {
      title: "Provider Name",
      dataIndex: "ProviderName",
      key: "ProviderName",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientTypeName",
      key: "PatientTypeName",
    },
    {
      title: "Applicability",
      dataIndex: "Applicability",
      key: "Applicability",
    },
    {
      title: "Charge Exception",
      dataIndex: "ChargeException",
      key: "ChargeException",
    },
    {
      title: "Factor/Amount",
      dataIndex: "FactorAmount",
      key: "FactorAmount",
    },
  ];

  const handleChargeProviderSelect = async (value, option) => {
    setChargeProviderId(option.key);
  };

  function handleChargeException() {
    navigate("/ChargeException");
  }

  const [firstVisible, setFirstVisible] = useState(false);
  const [secondVisible, setSecondVisible] = useState(false);
  const [thirdVisible, setThirdVisible] = useState(false);
  const [fourVisible, setFourVisible] = useState(false);
  const [fiveVisible, setFiveVisible] = useState(false);
  const [sixVisible, setSixVisible] = useState(false);

  const [firstIndicatorVisible, setFirstIndicatorVisible] = useState(false);
  const [fifthIndicatorVisible, setFifthIndicatorVisible] = useState(false);
  const [sixthIndicatorVisible, setSixthIndicatorVisible] = useState(false);

  function handleFirst(e) {
    setCheckFirst(e.target.checked);
    if (e.target.checked) {
      setFirstVisible(true);
    } else {
      setFirstVisible(false);
    }
  }

  function handleSecond(e) {
    setCheckSecond(e.target.checked);
    if (e.target.checked) {
      setSecondVisible(true);
    } else {
      setSecondVisible(false);
    }
  }

  function handleThird(e) {
    setCheckThird(e.target.checked);
    if (e.target.checked) {
      setThirdVisible(true);
    } else {
      setThirdVisible(false);
    }
  }

  function handleFour(e) {
    setCheckFour(e.target.checked);
    if (e.target.checked) {
      setFourVisible(true);
    } else {
      setFourVisible(false);
    }
  }

  function handleFive(e) {
    setCheckFive(e.target.checked);
    if (e.target.checked) {
      setFiveVisible(true);
    } else {
      setFiveVisible(false);
    }
  }

  function handleSix(e) {
    setCheckSix(e.target.checked);
    if (e.target.checked) {
      setSixVisible(true);
    } else {
      setSixVisible(false);
    }
  }

  function handleFirstIndicator(e) {
    debugger;
    if (e === "B") {
      setFirstIndicatorVisible(true);
    } else {
      setFirstIndicatorVisible(false);
    }
  }

  function handleFifthIndicator(e) {
    if (e === "B") {
      setFifthIndicatorVisible(true);
    } else {
      setFifthIndicatorVisible(false);
    }
  }

  function handleSixthIndicator(e) {
    if (e === "B") {
      setSixthIndicatorVisible(true);
    } else {
      setSixthIndicatorVisible(false);
    }
  }

  function handleAdd() {
    setSelectedRecord();
    setModalVisible(true);
  }

  function onFinishFailed() {}

  async function onOkModal() {
    await form1.validateFields();
    const values = form1.getFieldsValue();
    onFinishModel(values);
  }

  const [selectedRecord, setSelectedRecord] = useState(null);

  function GetProviderName(id) {
    return dropDown.Provider.filter((item) => item.ProviderId === id)[0]
      ?.ProviderName;
  }

  function GetPatientTypeName(id) {
    return dropDown.PatientType.filter((item) => item.LookupID === id)[0]
      ?.LookupDescription;
  }

  function GetIndicatorName(id) {
    return dropDown.Indicators.filter((item) => item.LookupID === id)[0]
      ?.LookupDescription;
  }

  function onFinishModel(values) {
    debugger;
    setDataModel((prevData) => {
      const exists = prevData.filter(
        (item) => item.key === selectedRecord?.key
      );
      values.ChargeIndicator = GetIndicatorName(values.Indicator);
      values.ProviderName = GetProviderName(values.ProviderId);
      values.PatientTypeName = GetPatientTypeName(values.PatientTypeId);
      values.ActiveFlag = true;
      if (exists.length > 0) {
        values.key = selectedRecord?.key;
        return prevData.map((item) =>
          item.key === selectedRecord?.key ? values : item
        );
      } else {
        values.key = uuidv4();
        return [...prevData, values];
      }
    });
    setModalVisible(false);
    form1.resetFields();
  }

  function onCancelModel() {
    setModalVisible(false);
  }

  function handleDelete(record) {
    setDataModel((prevData) =>
      prevData.map((item) =>
        item.key === record.key ? { ...item, ActiveFlag: false } : item
      )
    );
    message.success("Deleted Successfully");
  }

  function handleEdit(record) {
    setSelectedRecord(record);
    form1.setFieldsValue({
      Indicator: record.Indicator,
      ProviderId: record.ProviderId,
      PatientTypeId: record.PatientTypeId,
      Applicability: record.Applicability,
      ChargeException: record.ChargeException,
      FactorAmount: record.FactorAmount,
      IndicatorDescriptionName: record.IndicatorDescriptionName,
    });
    setModalVisible(true);
  }

  function handleIndicatorChange(value) {
    setIsIndicator(value == 2060 ? true : false);
    setIsDescription(value == 2060 ? false : true);
    switch (value) {
      case 2063:
        setUrl(urlPackageDescriptionService);
        break;
      case 2062:
        setUrl(urlPackageDescriptionServiceGroup);
        break;
      default:
        setUrl(urlPackageDescriptionServiceClassification);
        break;
    }
    setProductOptions([]);
    form1.setFieldsValue({ IndicatorDescriptionName: "" });
    form1.setFieldsValue({ DescriptionId: 0 });
  }

  return (
    <>
      <Layout>
        <div
          style={{
            width: "100%",
            backgroundColor: "white",
            minHeight: "max-content",
            borderRadius: "10px",
          }}
        >
          <PageHeader
            title={"Create Charge Exception"}
            buttonIcon={<FaAnglesLeft style={{ fontSize: "1rem" }} />}
            buttonLabel={"Back"}
            onButtonClick={handleChargeException}
          />
          <Card>
            <Form
              form={form}
              name="control-hooks"
              layout="vertical"
              variant="outlined"
              initialValues={{
                Status: "Active",
                EffectiveFrom: dayjs(),
              }}
              style={{
                maxWidth: 1500,
              }}
              onFinish={onFinish}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="ShortName"
                    label="Short Name"
                    rules={[
                      {
                        required: true,
                        message: "Short Name is  Required.",
                      },
                    ]}
                  >
                    <Input placeholder="Short Name" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="LongName"
                    label="Long Name"
                    rules={[
                      {
                        required: true,
                        message: "Long Name is Required.",
                      },
                    ]}
                  >
                    <Input placeholder="Long Name" />
                  </Form.Item>
                  <Form.Item hidden name="ExceptionHeaderId">
                    <Input />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="EffectiveFromDate"
                    label="Effective From"
                    rules={[
                      {
                        required: true,
                        message: "Effective Date Required.",
                      },
                    ]}
                  >
                    <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="FacilityId"
                    label="Facility"
                    rules={[
                      {
                        required: true,
                        message: "Facility Required.",
                      },
                    ]}
                  >
                    <Select>
                      {(dropDown.Facility || []).map((option) => (
                        <Select.Option
                          key={option.FacilityId}
                          value={option.FacilityId}
                        >
                          {option.FacilityName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="Status"
                    label="Status"
                    rules={[
                      {
                        required: true,
                        message: "Status Required.",
                      },
                    ]}
                  >
                    <Select>
                      <Select.Option key={true} value={true}>
                        Active
                      </Select.Option>
                      <Select.Option key={false} value={false}>
                        Hidden
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Priority" name="Priority">
                    <InputNumber
                      placeholder="Priority"
                      min={0}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <hr />
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={4}>
                  <label>Select</label>
                </Col>
                <Col className="gutter-row" span={4}>
                  <label>Charge Factor</label>
                </Col>
                <Col className="gutter-row" span={4}>
                  <label>Charge Indicator</label>
                </Col>
                <Col className="gutter-row" span={4}>
                  <label>Value 1</label>
                </Col>
                <Col className="gutter-row" span={4}>
                  <label>Value 2</label>
                </Col>
                <Col className="gutter-row" span={4}>
                  <label>Interval</label>
                </Col>
              </Row>
              <hr />
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="First" valuePropName="checked">
                    <Checkbox onChange={handleFirst}></Checkbox>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <label>Days after last IP Encounter</label>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="ChargeIndicatorFirst">
                    <Select
                      placeholder="Select Indicator"
                      defaultValue={"E"}
                      disabled={!checkFirst}
                      onChange={handleFirstIndicator}
                    >
                      <Select.Option value="E">Equals</Select.Option>
                      <Select.Option value="B">Between</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="Value1First">
                    <InputNumber
                      disabled={!checkFirst}
                      min={0}
                      placeholder="Value1"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="Value2First">
                    <InputNumber
                      min={0}
                      placeholder="Value2"
                      style={{ width: "100%" }}
                      disabled={!firstIndicatorVisible}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="IntervalFirst">
                    <InputNumber
                      min={0}
                      placeholder="Interval"
                      style={{ width: "100%" }}
                      disabled={!firstIndicatorVisible}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="Second" valuePropName="checked">
                    <Checkbox onChange={handleSecond}></Checkbox>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <label>Holiday</label>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="HolidayId">
                    <Select
                      placeholder="Select Holiday"
                      disabled={!checkSecond}
                    >
                      {(dropDown.Holiday || []).map((option) => (
                        <Select.Option
                          key={option.HolidayId}
                          value={option.HolidayId}
                        >
                          {option.HolidayName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}></Col>
                <Col className="gutter-row" span={4}></Col>
                <Col className="gutter-row" span={4}></Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="Third" valuePropName="checked">
                    <Checkbox onChange={handleThird}></Checkbox>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <label>Service Location</label>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="ServiceLocationId">
                    <Select
                      placeholder="Select Indicator"
                      disabled={!checkThird}
                    >
                      {(dropDown.ServiceLocation || []).map((option) => (
                        <Select.Option
                          key={option.ServiceLocationId}
                          value={option.ServiceLocationId}
                        >
                          {option.ServiceLocationName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}></Col>
                <Col className="gutter-row" span={4}></Col>
                <Col className="gutter-row" span={4}></Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="Forth" valuePropName="checked">
                    <Checkbox onChange={handleFour}></Checkbox>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <label>Time of Service</label>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="FromTime" label="TimeFrom">
                    <TimePicker
                      format="hh:mm:ss"
                      style={{ width: "100%" }}
                      disabled={!fourVisible}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="ToTime" label="TimeTo">
                    <TimePicker
                      format="hh:mm:ss"
                      style={{ width: "100%" }}
                      disabled={!fourVisible}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}></Col>
                <Col className="gutter-row" span={4}></Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="Fifth" valuePropName="checked">
                    <Checkbox onChange={handleFive}></Checkbox>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <label>Days after last original service</label>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="ChargeIndicatorFifth">
                    <Select
                      placeholder="Select Indicator"
                      defaultValue={"E"}
                      disabled={!checkFive}
                      onChange={handleFifthIndicator}
                    >
                      <Select.Option value="E">Equals</Select.Option>
                      <Select.Option value="B">Between</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="Value1Fifth">
                    <InputNumber
                      disabled={!checkFive}
                      min={0}
                      placeholder="Value1"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="Value2Fifth">
                    <InputNumber
                      min={0}
                      placeholder="Value2"
                      style={{ width: "100%" }}
                      disabled={!fifthIndicatorVisible}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="IntervalFifth">
                    <InputNumber
                      min={0}
                      placeholder="Interval"
                      style={{ width: "100%" }}
                      disabled={!fifthIndicatorVisible}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="Sixth" valuePropName="checked">
                    <Checkbox onChange={handleSix}></Checkbox>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <label>Days after last OP encounter</label>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="ChargeIndicatorSixth">
                    <Select
                      placeholder="Select Indicator"
                      defaultValue={"E"}
                      disabled={!checkSix}
                      onChange={handleSixthIndicator}
                    >
                      <Select.Option value="E">Equals</Select.Option>
                      <Select.Option value="B">Between</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="Value1Sixth">
                    <InputNumber
                      disabled={!checkSix}
                      min={0}
                      placeholder="Value1"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="Value2Sixth">
                    <InputNumber
                      min={0}
                      placeholder="Value2"
                      style={{ width: "100%" }}
                      disabled={!sixthIndicatorVisible}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={4}>
                  <Form.Item name="IntervalSixth">
                    <InputNumber
                      min={0}
                      placeholder="Interval"
                      style={{ width: "100%" }}
                      disabled={!sixthIndicatorVisible}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <hr />
              <CustomTable
                loading={loading}
                dataSource={dataModel.filter(
                  (item) => item.ActiveFlag === true
                )}
                columns={columns}
                isFilter={false}
                actionColumnName={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                  />
                }
                scroll={{
                  x: 1000,
                }}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
              <Row justify="end">
                <Col style={{ marginRight: "10px" }}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button type="default" onClick={handleChargeException}>
                      Cancel
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Modal
            title="Charge Exception Details"
            onOk={onOkModal}
            onCancel={onCancelModel}
            open={modalVisible}
            maskClosable={false}
            cancelButtonProps={{ danger: "true" }}
          >
            <Form
              onFinishFailed={onFinishFailed}
              onFinish={onFinishModel}
              autoComplete="off"
              layout="vertical"
              form={form1}
              initialValues={{
                ChargeException: "Amount",
                Applicability: "All patients",
                ProviderId: "All",
                Indicator: 2060,
              }}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    label="Indicator"
                    name="Indicator"
                    rules={[
                      {
                        required: true,
                        message: "Indicator is Required.",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select Value"
                      onChange={handleIndicatorChange}
                    >
                      {(dropDown.Indicators || [])
                        .filter((option) => option.LookupID !== 12152)
                        .map((option) => (
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
                  <Form.Item
                    label="Description"
                    name="IndicatorDescriptionName"
                    rules={[
                      {
                        required: isDescription,
                        message: "Required.",
                      },
                    ]}
                  >
                    <AutoComplete
                      options={productOptions}
                      onSearch={handleSearch}
                      onSelect={(value, option) => handleSelect(value, option)}
                      onChange={(value) => {
                        if (!value) {
                          setProductOptions([]);
                        }
                      }}
                      allowClear={{
                        clearIcon: <CloseSquareFilled />,
                      }}
                      disabled={isIndicator}
                    />
                  </Form.Item>
                  <Form.Item name="DescriptionId" hidden>
                    <Input />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    label="Patient Type"
                    name="PatientTypeId"
                    rules={[
                      {
                        required: true,
                        message: "Patient Type is Required.",
                      },
                    ]}
                  >
                    <Select placeholder="Select Value">
                      {(dropDown.PatientType || []).map((option) => (
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
                  <Form.Item
                    label="Provider"
                    name="ProviderId"
                    rules={[
                      {
                        required: true,
                        message: "Provider is Required.",
                      },
                    ]}
                    initialValue="All"
                  >
                    <Select defaultValue={"All"}>
                      <Select.Option value="All">All</Select.Option>
                      {(dropDown.Provider || []).map((option) => (
                        <Select.Option
                          key={option.ProviderId}
                          value={option.ProviderId}
                        >
                          {option.ProviderName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    label="Applicability"
                    name="Applicability"
                    rules={[
                      {
                        required: true,
                        message: "Applicability is Required.",
                      },
                    ]}
                    initialValue="All patients"
                  >
                    <Select defaultValue="All patients">
                      <Select.Option value="All patients" key="All patients">
                        All patients
                      </Select.Option>
                      <Select.Option value="Cash patients" key="Cash patients">
                        Cash patients
                      </Select.Option>
                      <Select.Option
                        value="Credit patients"
                        key="Credit patients"
                      >
                        Credit patients
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    label="Charge Exception"
                    name="ChargeException"
                    rules={[
                      {
                        required: true,
                        message: "Charge Exception is Required.",
                      },
                    ]}
                    initialValue="Amount"
                  >
                    <Select defaultValue="Amount">
                      <Select.Option value="Amount" key="Amount">
                        Amount
                      </Select.Option>
                      <Select.Option value="Factor" key="Factor">
                        Factor
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item label="Factor/Amount" name="FactorAmount">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
      </Layout>
    </>
  );
}

export default CreateChargeException;
