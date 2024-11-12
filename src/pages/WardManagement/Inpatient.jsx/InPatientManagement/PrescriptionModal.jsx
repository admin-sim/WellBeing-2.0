import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
  AutoComplete,
  message,
  Popconfirm,
} from "antd";
import React, { useState } from "react";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import {
  urlSearchExistingPrescription,
  urlGetAllDrugs,
  urlGetProductDetails,
  urlAddNewNewRequest,
  urlUpdateIndent,
  urlAddNewPatientIndent,
  urlGetPrescriptionByPrescriptionHedderId,
  urlUpdateRequest,
} from "../../../../../endpoints.js";
import PatientHeader from "../../../../components/PatientHeader";
import CustomTable from "../../../../components/customTable";
import dayjs from "dayjs";
import { validate } from "uuid";
import { render } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

function Prescription({ bed, patient, Dropdown, open, handleClose }) {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [defaultActiveKey, setDefaultActiveKey] = useState("1");
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [tabName, setTabName] = useState("New");
  const [loading, setLoading] = useState(false)

  const initial = [
    {
      key: uuidv4(),
      DrugId: "",
      Route: "",
      Frequency: "",
      IntervalInDays: "",
      TotalQty: "",
      Instruction: "",
      ActiveFlag: true,
      PrescriptionStatus: true
    },
  ];

  const [tableData1, setTableData1] = useState(initial);
  const [tableData2, setTableData2] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, 'day'));
  const [toDate, setToDate] = useState(dayjs());

  const handleCancel = () => {
    form1.resetFields();
    form2.resetFields();
    form3.resetFields();
    setTableData1(initial);
    setTableData2[[]];
    setProductOptions([]);
    setDefaultActiveKey("1");
    setButtonTitle("Save");
    setTabName("New");
    handleClose();
  };

  const onTabChange = async (key) => {
    debugger
    setLoading(true)
    setDefaultActiveKey(key)
    if (key == '2') {
      try {
        const response = await customAxios.get(
          `${urlSearchExistingPrescription}?Provider=${0}&Patientid=${patient.PatientId}&EncounterId=${patient.EncounterId}&FromDateString=${null}&ToDateString=${null}`
        );
        if (response.status === 200 && response.data.data !== null) {
          const newdata =
            response.data.data.ExistingPrescriptionModel.map(
              (item, index) => {
                return {
                  ...item,
                  key: uuidv4(),
                  index: index + 1
                };
              }
            );
          setTableData2(newdata);
          // setRecordExpectedDischargeModalOpen(false)
        } else {
          console.error("Failed to fetch Record EDD");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false)
        handleReset()
      }
    }
  };

  const handleAddRow = async () => {
    setProductOptions([])
    await form3.validateFields()
    setTableData1([
      ...tableData1,
      {
        key: uuidv4(),
        DrugId: "",
        Route: "",
        Frequency: "",
        IntervalInDays: "",
        TotalQty: "",
        Instruction: "",
        ActiveFlag: true,
        PrescriptionStatus: true
      },
    ]);
  };

  const handleDeleteRow = (record) => {
    debugger;
    const newData = tableData1.map((item) => {
      if (item.key === record.key) {
        return { ...item, PrescriptionStatus: false };
      }
      return item;
    });
    setTableData1(newData);
  };

  const handleSearch = async (searchText) => {
    debugger
    if (searchText) {
      const response = await customAxios.get(
        `${urlGetAllDrugs}?Type=${searchText}`
      );
      const apiData = response.data.data;
      const newdata = apiData
        .filter((item) =>
          tableData1.every((item1) => item1.DrugId !== item.ProductId && item1.PrescriptionStatus == true)
        )
        .map((item) => ({
          label: `${item.ProductName} (Stock: ${item.CurrentStock})`,
          value: item.ProductName,
          id: item.ProductId,
        }));

      setProductOptions(newdata);
    }
  };

  function handleReset() {
    debugger
    form1.resetFields();
    // form2.resetFields();
    form3.resetFields();
    setTableData1(initial);
    setTableData2[[]];
    setProductOptions([]);
    // setDefaultActiveKey("1");
    setButtonTitle("Save");
    setTabName("New");
  };

  const handleInputChange = async (value, record, option) => {
    debugger
    const response = await customAxios.get(`${urlGetProductDetails}?ProductId=${option.id}`);
    const apiData = response.data.data;
    if (response.status === 200 && apiData != null) {
      form3.setFieldsValue({ [record.key]: { DrugId: apiData.ProductDefinitionId } })
      form3.setFieldsValue({ [record.key]: { UomId: apiData.UOMPrimaryUOM } })
    }
  };

  const getInstruction = (value) => {
    switch (value) {
      case 5:
        return { text: "Afternoon", round: 1 };
      case 4:
        return { text: "Night", round: 1 };
      case 3:
        return { text: "Morning, Afternoon and Night", round: 3 };
      case 2:
        return { text: "Morning", round: 1 };
      default:
        return { text: "Morning and Night", round: 2 };
    }
  };

  const SelectFrequency = (value, option, record) => {
    const total = 0;
    const interval = form3.getFieldValue([record.key, "IntervalInDays"]);
    if (value) {
      form3.setFieldsValue({ [record.key]: { Instruction: getInstruction(value).text } });
      if (interval) {
        form3.setFieldsValue({ [record.key]: { TotalQty: getInstruction(value).round * parseInt(interval) } });
      } else {
        form3.setFieldsValue({ [record.key]: { TotalQty: total } });
      }
    } else {
      form3.setFieldsValue({ [record.key]: { Instruction: "" } });
      form3.setFieldsValue({ [record.key]: { TotalQty: 0 } });
    }
  };

  const Interval = (value, record) => {
    const form3data = form3.getFieldsValue();
    const specific = form3data[record.key].Frequency;
    form3.setFieldsValue({ [record.key]: { TotalQty: getInstruction(specific).round * (value ? parseInt(value) : 1) } });
  };

  const columns = [
    {
      title: "Drug",
      dataIndex: "Drug",
      render: (text, record) => (
        <>
          <Form.Item
            name={[record.key, "Drug"]}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please input drug!" }]}
            initialValue={record.DrugName}
          >
            <AutoComplete
              disabled={!!record.PrescriptionLineId}
              options={productOptions}
              onSearch={handleSearch}
              onSelect={(value, option) =>
                handleInputChange(value, record, option)
              }
            />
          </Form.Item>
          <Form.Item
            hidden
            name={[record.key, "DrugId"]}
            initialValue={record.DrugId}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hidden
            name={[record.key, "UomId"]}
            initialValue={record.UomId}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hidden
            name={[record.key, "PrescriptionLineId"]}
            initialValue={record.PrescriptionLineId}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hidden
            name={[record.key, "IndentLineId"]}
            initialValue={record.IndentLineId}
          >
            <Input />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Route",
      dataIndex: "Route",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "Route"]}
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: "Please select route!" }]}
          initialValue={record.Route}
        >
          <Select style={{ width: "100%" }}>
            {(Dropdown.Route || []).map((option) => (
              <Select.Option key={option.LookupID} value={option.LookupID}>
                {option.LookupDescription}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Frequency",
      dataIndex: "Frequency",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "Frequency"]}
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: "Please input frequency!" }]}
          initialValue={record.FrequencyId}
        >
          <Select
            style={{ width: "100%" }}
            onChange={(value, option) => SelectFrequency(value, option, record)}
            allowClear
          >
            {(Dropdown.Frequency || []).map((option) => (
              <Select.Option
                key={option.FrequencyId}
                value={option.FrequencyId}
              >
                {option.FrequencyName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "IntervalInDays",
      dataIndex: "IntervalInDays",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "IntervalInDays"]}
          style={{ marginBottom: 0 }}
          initialValue={record.Interval}
        >
          <Input
            value={text}
            onChange={(e) => Interval(e.target.value, record)}
          />
        </Form.Item>
      ),
    },
    {
      title: "TotalQty",
      dataIndex: "TotalQty",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "TotalQty"]}
          style={{ marginBottom: 0 }}
          initialValue={record.TotalQty}
        >
          <Input
            value={text}
          // onChange={(e) =>
          //   handleInputChange(e.target.value, record.key, "TotalQty")
          // }
          />
        </Form.Item>
      ),
    },
    {
      title: "Instruction",
      dataIndex: "Instruction",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "Instruction"]}
          style={{ marginBottom: 0 }}
          initialValue={record.Instruction}
        >
          <Input value={text} />
        </Form.Item>
      ),
    },
    {
      title: (
        <Button type="link" onClick={handleAddRow}>
          <PlusCircleOutlined />
        </Button>
      ),
      // render: (_, record) => (
      //   <Button type="link" danger onClick={() => handleDeleteRow(record.key)}>
      //     <DeleteOutlined />
      //   </Button>
      // ),
      render: (_, record) => (
        <Popconfirm
          danger
          title="Sure to delete?"
          onConfirm={() => handleDeleteRow(record)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
    },
  ];

  const EditTab = () => {
    onTabChange('1')
    // setDefaultActiveKey("1");
    setButtonTitle("Update");
    setTabName("Edit");
  };

  const EditPrescription = async (record) => {
    debugger;
    const input = {
      EncounterId: form1.getFieldValue("EncounterId"),
      PatientId: form1.getFieldValue("PatientId"),
    };
    const response = await customAxios.get(
      `${urlGetPrescriptionByPrescriptionHedderId}?EncounterId=${input.EncounterId}&PatientId=${input.PatientId}&PriscptionHedderId=${record.PriscptionHedderId}`
    );
    const apiData = response.data.data;
    if (response.status === 200 && apiData !== null) {
      const newData = apiData.PrescriptionModel.map((item, index) => {
        form1.setFieldsValue({ PriscptionHedderId: item.PriscptionHedderId })
        form1.setFieldsValue({ IndentId: item.IndentId });
        return {
          ...item,
          key: uuidv4(),
          Route: parseInt(item.Route),
          index: index + 1,
        };
      });
      setTableData1(newData);
      EditTab();
    }
  };

  const columns2 = [
    {
      title: "Sl. No.",
      dataIndex: "index",
    },
    {
      title: "Order Id",
      dataIndex: "PrescriptionId",
      render: (text, record, index) => {
        if (record.IndentStatus === "Pending") {
          return (
            <Button type="link" onClick={() => EditPrescription(record)}>
              {record.PrescriptionId}
            </Button>
          );
        } else {
          return record.PrescriptionId;
        }
      },
    },
    {
      title: "Indent Number",
      dataIndex: "IndentNumber",
    },
    {
      title: "Indent Status",
      dataIndex: "IndentStatus",
    },
    {
      title: "Order Date",
      dataIndex: "PresDateString",
    },
    {
      title: "Encounter",
      dataIndex: "Encounter",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
    },
    {
      title: "Department",
      dataIndex: "DeptName",
    },
    {
      title: "Ordering Physician",
      dataIndex: "ProviderName",
    },
  ];

  return (
    <div>
      <Modal
        width={"80%"}
        height={"auto"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Prescription
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <PatientHeader patient={patient} />
        <Tabs
          defaultActiveKey="1"
          size="small"
          onChange={onTabChange}
          tabBarGutter={0}
          activeKey={defaultActiveKey}
          type="card"
          style={{ marginTop: "1rem" }}
          tabBarStyle={{ display: "flex" }}
        >
          <Tabs.TabPane
            tab={
              <div
                style={{
                  width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                {tabName} Request
              </div>
            }
            key="1"
          >
            <Form
              layout="vertical"
              form={form1}
              onFinish={async (values) => {
                debugger
                const Drugss = [];
                await form3.validateFields();
                const obj = {
                  IssueingStoreId: values.Store,
                  IndentDatestring: values.IndentDate ? values.IndentDate.format("DD-MM-YYYY") : "",
                  FacilityId: 1,
                  IndentTemplateId: 0,
                  PatientId: values.PatientId,
                  EncounterId: values.EncounterId,
                  IndentCategory: "PatientIndent",
                  IndentStatus: "Pending",
                  PriscptionHedderId: values.PriscptionHedderId,
                  IndentId: values.IndentId
                };
                const form2data = form3.getFieldsValue();
                for (let i = 0; i < tableData1.length; i++) {
                  const item = form2data[tableData1[i].key]
                  const Products = tableData1.filter(item => item.PrescriptionStatus == true)
                  if (Products.length == 0) {
                    message.warning('Please Add Drug');
                    return false;
                  }
                  if (item && tableData1[i].PrescriptionLineId == (form2data[tableData1[i].key] || {}).PrescriptionLineId) {
                    const Drug = {
                      DrugId: item.DrugId,
                      UomId: item.UomId,
                      Dose: item.Dose ? item.Dose : 0,
                      Route: item.Route.toString(),
                      FrequencyId: item.Frequency,
                      Interval: parseInt(item.IntervalInDays),
                      Instruction: item.Instruction,
                      EncounterID: values.EncounterId,
                      PatientId: values.PatientId,
                      Stock: item.Stock,
                      TotalQty: item.TotalQty,
                      FoodRelation: item.FoodRelation ? item.FoodRelation : 0,
                      ProductId: item.DrugId,
                      RequestQty: item.TotalQty,
                      PrescriptionLineId: item.PrescriptionLineId,
                      IndentLineId: item.IndentLineId,
                      PrescriptionStatus: true,
                      ActiveFlag: true,
                      // Favourite: 'N'
                    };
                    Drugss.push(Drug);
                  } else {
                    const Drug = {
                      DrugId: tableData1[i].DrugId,
                      UomId: tableData1[i].UomId,
                      Dose: tableData1[i].Dose ? tableData1[i].Dose : 0,
                      Route: tableData1[i].Route.toString(),
                      FrequencyId: tableData1[i].FrequencyId,
                      Interval: parseInt(tableData1[i].Interval),
                      Instruction: tableData1[i].Instruction,
                      EncounterID: values.EncounterId,
                      PatientId: values.PatientId,
                      // Stock: tableData1[i].Stock,
                      TotalQty: tableData1[i].TotalQty,
                      FoodRelation: tableData1[i].FoodRelation ? tableData1[i].FoodRelation : 0,
                      ProductId: tableData1[i].DrugId,
                      RequestQty: tableData1[i].TotalQty,
                      PrescriptionLineId: tableData1[i].PrescriptionLineId,
                      IndentLineId: tableData1[i].IndentLineId,
                      PrescriptionStatus: false,
                      ActiveFlag: false,
                    }
                    Drugss.push(Drug);
                  }
                }
                const IndentViewModel = {
                  newIndentModel: obj,
                  IndentDetails: Drugss
                }
                const urlIndent = !!obj.PriscptionHedderId ? urlUpdateIndent : urlAddNewPatientIndent
                const urlPres = !!obj.PriscptionHedderId ? urlUpdateRequest : urlAddNewNewRequest
                if (Dropdown.LastEncounter != null && Dropdown.LastEncounter.PatientType == 22) {
                  const PrescriptionViewModel = {
                    PrescriptionModel: obj,
                    PrescriptionDetails: Prescription
                  }
                  const response1 = await customAxios.post(urlPres, PrescriptionViewModel, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  if (response1.status === 200 && response1.data === 'Success') {
                    message.success('Success')
                    form3.resetFields()
                    setTableData1(initial);
                    setTabName("New");
                    setButtonTitle('Save')
                    // handleCancel()
                  }
                } else {
                  const response = await customAxios.post(urlIndent, IndentViewModel, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  if (response.status === 200) {
                    let Prescription = {}
                    if (urlIndent == urlUpdateIndent) {
                      Prescription = Drugss.map((item) => {
                        return {
                          ...item,
                          IndentNumber: '',
                          Stock: item.Stock ? item.Stock : 0,
                          PrescriptionLineId: item.PrescriptionLineId,
                        }
                      })
                      const PrescriptionViewModel = {
                        PrescriptionModel: obj,
                        PrescriptionDetails: Prescription
                      }
                      const response1 = await customAxios.post(urlPres, PrescriptionViewModel, {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      });
                      if (response1.status === 200 && response1.data === 'Success') {
                        message.success('Updated Success')
                        form3.resetFields()
                        setTableData1(initial);
                        setTabName("New");
                        setButtonTitle('Save')
                        // handleCancel()
                      }
                    } else {
                      Prescription = Drugss.map((item) => {
                        return {
                          ...item,
                          IndentId: response.data.data.IndentId,
                          IndentNumber: response.data.data.IndentNumber,
                          Stock: item.Stock ? item.Stock : 0
                        }
                      })
                      const response1 = await customAxios.post(urlPres, Prescription, {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      });
                      if (response1.status === 200 && response1.data === 'Success') {
                        message.success('Success')
                        form3.resetFields()
                        setTableData1(initial);
                        setButtonTitle('Save')
                        setTabName('New')
                        // handleCancel()
                      }
                    }
                  }
                }
              }}
              initialValues={{
                IndentDate: dayjs(),
              }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="IndentDate"
                    label="Indent Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select Indent Date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                  </Form.Item>
                  <Form.Item
                    name="EncounterId"
                    hidden
                    initialValue={(Dropdown.LastEncounter || {}).EncounterId}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="PatientId"
                    hidden
                    initialValue={Dropdown.PatientId}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item name="IndentId" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name="PriscptionHedderId" hidden>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="Store"
                    label="Store"
                    rules={[
                      {
                        required: true,
                        message: "Please select Store",
                      },
                    ]}
                    initialValue={Dropdown.StoreId}
                  >
                    <Select
                      style={{ width: "100%" }}
                      disabled={Dropdown.StoreId === 0 ? false : true}
                    >
                      {(Dropdown.StoreModel || []).map((option) => (
                        <Select.Option
                          key={option.StoreId}
                          value={option.StoreId}
                        >
                          {option.LongName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={0} style={{ height: "2rem" }}>
                <Col offset={20} span={2}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      {buttonTitle}
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item>
                    <Button type="default" danger onClick={buttonTitle == 'Update' ? handleReset : handleCancel}>
                      {buttonTitle == 'Update' ? 'Reset' : 'Cancel'}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Form form={form3} component={false}>
              <Row>
                <Col span={24} style={{ marginTop: "1rem" }}>
                  <Table
                    columns={columns}
                    dataSource={tableData1.filter(
                      (item) => item.PrescriptionStatus !== false
                    )}
                    pagination={false}
                    bordered
                    scroll={{
                      y: 200,
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <div
                style={{
                  width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Existing
              </div>
            }
            key="2"
          >
            <Form
              layout="vertical"
              form={form2}
              onFinish={async (values) => {
                debugger;
                setLoading(true)
                const Pre = {
                  FromDateString: values.FromDate
                    ? values.FromDate.format("DD-MM-YYYY")
                    : "",
                  ToDateString: values.ToDate
                    ? values.ToDate.format("DD-MM-YYYY")
                    : "",
                  Provider: 0,
                  Patientid: values.PatientId,
                };
                try {
                  const response = await customAxios.get(
                    `${urlSearchExistingPrescription}?Provider=${Pre.Provider}&Patientid=${Pre.Patientid}&FromDateString=${Pre.FromDateString}&ToDateString=${Pre.ToDateString}`
                  );
                  if (response.status === 200 && response.data.data !== null) {
                    const newdata =
                      response.data.data.ExistingPrescriptionModel.map(
                        (item, index) => {
                          return {
                            ...item,
                            key: uuidv4(),
                            index: index + 1
                          };
                        }
                      );
                    setTableData2(newdata);
                    // setRecordExpectedDischargeModalOpen(false)
                  } else {
                    console.error("Failed to fetch Record EDD");
                  }
                } catch (error) {
                  console.error("Error:", error);
                } finally {
                  setLoading(false)
                }
                // handleCancel();
              }}
              initialValues={{
                FromDate: fromDate,
                ToDate: toDate,
              }}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    name="FromDate"
                    label="From Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select From Date",
                      },
                    ]}
                  >
                    {/* <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" /> */}
                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY"
                      value={fromDate}
                      onChange={(date) => setFromDate(date)}
                      disabledDate={(current) => current > moment()}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="ToDate"
                    label="To Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select To Date",
                      },
                    ]}
                  >
                    {/* <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" /> */}
                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY"
                      value={toDate}
                      onChange={(date) => setToDate(date)}
                      disabledDate={(current) => current > moment()}
                    />
                  </Form.Item>
                  <Form.Item name="Provider" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="PatientId"
                    hidden
                    initialValue={Dropdown.PatientId}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="OrderingPhysician"
                    label="Ordering Physician"
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={0} style={{ height: "2rem" }}>
                <Col offset={20} span={2}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Search
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item>
                    <Button type="default" danger onClick={() => form2.resetFields()}>
                      Reset
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Divider style={{ marginBottom: "0rem" }} />
            </Form>
            {/* <Spin spinning={loading}> */}
            <CustomTable loading={loading}
              columns={columns2}
              dataSource={tableData2}
              actionColumn={false}
              isFilter={true}
              scroll={{
                //   x: 1500,
                y: 110,
              }}
            />
            {/* </Spin> */}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div >
  );
}

export default Prescription;
