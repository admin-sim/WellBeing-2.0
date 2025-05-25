import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Spin,
  Popconfirm,
  Row,
  Select,
  Table, Divider,
  Tabs,
  Tooltip,
  AutoComplete,
  DatePicker, message,
  InputNumber
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { FaHistory, FaPrescription } from "react-icons/fa";
import {
  urlGetAllDrugs,
  urlGetNewRequest,
  urlGetProductDetails,
  urlUpdateIndent,
  urlUpdateRequest,
  urlAddNewPatientIndent,
  urlAddNewNewRequest, urlSearchExistingPrescription, urlGetPrescriptionByPrescriptionHedderId
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import CustomTable from "../../../components/customTable/index.jsx";
import moment from "moment";

function Prescription(Patient) {
  const [form] = useForm();
  const [form1] = useForm();
  const [form2] = useForm();
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
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState(initial);
  const [productOptions, setProductOptions] = useState([]);
  const [tabName, setTabName] = useState("New");
  const [tableData2, setTableData2] = useState([]);
  const [defaultActiveKey, setDefaultActiveKey] = useState("1");
  const [dropDown, setDropDown] = useState({
    StoreModel: [],
    Route: [],
    Frequency: []
  })
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, 'day'));
  const [toDate, setToDate] = useState(dayjs());

  const handleReset = () => {
    form2.resetFields();
  };

  function handleClear() {
    setButtonTitle('Save')
    setTabName('New')
    form1.resetFields()
    setDataSource(initial)
  }

  const onTabChange = (key) => {
    if (key == '2') {
      handleClear()
    }
    setDefaultActiveKey(key)
    form2.submit()
  };

  const handleAddRow = async () => {
    setProductOptions([])
    await form1.validateFields()
    setDataSource([
      ...dataSource,
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
    // const newData = {
    //   key: dataSource.length + 1,
    //   name: `Drug${dataSource.length + 1}`,
    // };
    // setDataSource([...dataSource, newData]);
  };

  const handleDeleteRow = (record) => {
    const newData = dataSource.map((item) => {
      if (item.key === record.key) {
        return { ...item, PrescriptionStatus: false };
      }
      return item;
    });
    setDataSource(newData);
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await customAxios.get(
        `${urlGetNewRequest}?EncounterId=${Patient.Patient.Encounter}&Patientid=${Patient.Patient.PatientId}`
      );
      if (response.status === 200 && response.data.data !== null) {
        setDropDown(response.data.data)
        form.setFieldsValue({ Store: response.data.data.StoreId })
        // const newdata =
        //   response.data.data.ExistingPrescriptionModel.map(
        //     (item, index) => {
        //       return {
        //         ...item,
        //         key: uuidv4(),
        //         index: index + 1
        //       };
        //     }
        //   );
        // setTableData2(newdata);
      } else {
        console.error("Failed to fetch Record EDD");
      }
      // } catch (error) {
      //   console.error("Error:", error);}
      // } finally {
      //   setLoading(false)
      // }
      // urlGetNewRequest}
    }
    fetch()
  }, [])

  const handleSearch = async (searchText) => {
    if (searchText) {
      const response = await customAxios.get(
        `${urlGetAllDrugs}?Type=${searchText}`
      );
      const apiData = response.data.data;
      const newdata = apiData.map((item) => {
        return {
          label: item.ProductName + " (Stock)" + item.CurrentStock,
          value: item.ProductName,
          id: item.ProductId,
        };
      });
      setProductOptions(newdata);
    }
  };

  const handleInputChange = async (value, record, option) => {
    const response = await customAxios.get(
      `${urlGetProductDetails}?ProductId=${option.id}`
    );
    const apiData = response.data.data;
    if (response.status === 200 && apiData != null) {
      form1.setFieldsValue({ [record.key]: { DrugId: apiData.ProductDefinitionId } });
      form1.setFieldsValue({ [record.key]: { UomId: apiData.UOMPrimaryUOM } });
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
    const interval = form1.getFieldValue([record.key, "IntervalInDays"]);
    if (value) {
      form1.setFieldsValue({ [record.key]: { Instruction: getInstruction(value).text } });
      if (interval) {
        form1.setFieldsValue({ [record.key]: { TotalQty: getInstruction(value).round * parseInt(interval) } });
      } else {
        form1.setFieldsValue({ [record.key]: { TotalQty: total } });
      }
    } else {
      form1.setFieldsValue({ [record.key]: { Instruction: "" } });
      form1.setFieldsValue({ [record.key]: { TotalQty: 0 } });
    }
  };

  const Interval = (value, record) => {
    const form3data = form1.getFieldsValue();
    const specific = form3data[record.key].Frequency;
    form1.setFieldsValue({ [record.key]: { TotalQty: getInstruction(specific).round * (value ? parseInt(value) : 1) } });
  };

  const columns = [
    {
      title: "Drug",
      dataIndex: "Drug",
      width: 300,
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
          <Select style={{ width: '100%' }}>
            {(dropDown.Route || []).map((option) => (
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
            {(dropDown.Frequency || []).map((option) => (
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
      title: "Interval In Days",
      dataIndex: "IntervalInDays",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "IntervalInDays"]}
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: "Please input IntervalInDays!" }]}
          initialValue={record.Interval}
        >
          <InputNumber min={0} style={{ width: '100%' }}
            value={text}
            onChange={(value) => Interval(value, record)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Total Quantity",
      dataIndex: "Total Qty",
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
      PatientId: Patient.Patient.PatientId,
      EncounterId: Patient.Patient.Encounter
    };
    const response = await customAxios.get(
      `${urlGetPrescriptionByPrescriptionHedderId}?EncounterId=${input.EncounterId}&PatientId=${input.PatientId}&PriscptionHedderId=${record.PriscptionHedderId}`
    );
    const apiData = response.data.data;
    if (response.status === 200 && apiData !== null) {
      const newData = apiData.PrescriptionModel.map((item, index) => {
        form.setFieldsValue({ PriscptionHedderId: item.PriscptionHedderId })
        form.setFieldsValue({ IndentId: item.IndentId });
        return {
          ...item,
          key: uuidv4(),
          Route: parseInt(item.Route),
          index: index + 1,
        };
      });
      setDataSource(newData);
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
        if (record.IndentStatus === "Pending" || !record.IndentStatus) {
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
    <>
      <Row>
        <Col span={18} style={{ margin: "1rem" }}>
          <span style={{ fontSize: "1rem", fontWeight: 600 }}>
            Prescription
          </span>
        </Col>
      </Row>
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
          <p>
            <FaPrescription style={{ color: "green", fontSize: "1.2rem" }} /> Advice
            medication for this visit
          </p>
          <Form
            layout="vertical"
            form={form}
            onFinish={async (values) => {
              const Drugss = [];
              await form1.validateFields();
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
              const form2data = form1.getFieldsValue();
              for (let i = 0; i < dataSource.length; i++) {
                const item = form2data[dataSource[i].key]
                const Products = dataSource.filter(item => item.PrescriptionStatus == true)
                if (Products.length == 0) {
                  message.warning('Please Add Drug');
                  return false;
                }
                if (item && dataSource[i].PrescriptionLineId == (form2data[dataSource[i].key] || {}).PrescriptionLineId) {
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
                    DrugId: dataSource[i].DrugId,
                    UomId: dataSource[i].UomId,
                    Dose: dataSource[i].Dose ? dataSource[i].Dose : 0,
                    Route: dataSource[i].Route.toString(),
                    FrequencyId: dataSource[i].FrequencyId,
                    Interval: parseInt(dataSource[i].Interval),
                    Instruction: dataSource[i].Instruction,
                    EncounterID: values.EncounterId,
                    PatientId: values.PatientId,
                    // Stock: dataSource[i].Stock,
                    TotalQty: dataSource[i].TotalQty,
                    FoodRelation: dataSource[i].FoodRelation ? dataSource[i].FoodRelation : 0,
                    ProductId: dataSource[i].DrugId,
                    RequestQty: dataSource[i].TotalQty,
                    PrescriptionLineId: dataSource[i].PrescriptionLineId,
                    IndentLineId: dataSource[i].IndentLineId,
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
              if (dropDown.LastEncounter != null && dropDown.LastEncounter.PatientType == 22) {
                const PrescriptionViewModel = {
                  PrescriptionModel: obj,
                  PrescriptionDetails: Drugss
                }
                const response1 = await customAxios.post(urlPres, urlPres == urlUpdateRequest ? PrescriptionViewModel : Drugss, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                if (response1.status === 200 && response1.data === 'Success') {
                  message.success('Success')
                  form1.resetFields()
                  setDataSource(initial);
                  setTabName("New");
                  setButtonTitle('Save')
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
                      form1.resetFields()
                      setDataSource(initial);
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
                      form1.resetFields()
                      setDataSource(initial);
                      setButtonTitle('Save')
                      setTabName('New')
                    }
                  }
                }
              }
            }}
            initialValues={{
              IndentDate: dayjs(),
              PatientId: Patient.Patient.PatientId,
              EncounterId: Patient.Patient.Encounter,
            }}
          >
            <Row gutter={16}>
              <Col span={4}>
                <Form.Item name='IndentDate' label='Indent Date'
                  rules={[
                    {
                      required: true,
                      message: "Please select Indent Date",
                    },
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY'
                    disabledDate={(current) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return current && current < today;
                    }} />
                </Form.Item>
                <Form.Item hidden name='PatientId'>
                  <Input />
                </Form.Item>
                <Form.Item hidden name='EncounterId'>
                  <Input />
                </Form.Item>
                <Form.Item hidden name='IndentId'>
                  <Input />
                </Form.Item>
                <Form.Item hidden name='PriscptionHedderId'>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name='Store' label='Store'
                  rules={[
                    {
                      required: true,
                      message: "Please select Store",
                    },
                  ]}
                >
                  <Select disabled={dropDown.StoreId === 0 ? false : true}>
                    {dropDown.StoreModel.map((option) => (
                      <Select.Option key={option.StoreId} value={option.StoreId}>{option.LongName}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} justify={"end"} style={{ margin: "1rem" }}>
              <Col>
                {" "}
                <Button type="primary" size="middle" htmlType="submit">
                  {/* {form.getFieldValue('PriscptionHedderId') ? 'Update' : 'Save'} */}
                  {buttonTitle}
                </Button>
              </Col>
              <Col>
                <Button danger size="middle" onClick={handleClear}>
                  Reset
                </Button>
              </Col>
            </Row>
            {/* <Table columns={columns} dataSource={dataSource.filter(item => item.PrescriptionStatus == true)} /> */}
          </Form>
          <Form form={form1} component={false}>
            <Row>
              <Col span={24} style={{ marginTop: "1rem" }}>
                <Table
                  columns={columns}
                  dataSource={dataSource.filter(
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
              setLoading(true)
              const Pre = {
                FromDateString: fromDate
                  ? fromDate.format("DD-MM-YYYY")
                  : "",
                ToDateString: toDate
                  ? toDate.format("DD-MM-YYYY")
                  : "",
                Provider: 0,
                Patientid: values.PatientId,
              };
              try {
                const response = await customAxios.get(
                  `${urlSearchExistingPrescription}?Provider=${0}&Patientid=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}&FromDateString=${Pre.FromDateString}&ToDateString=${Pre.ToDateString}`
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
              FromDate: dayjs().subtract(1, "day"),
              ToDate: dayjs(),
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
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY"
                    value={toDate}
                    onChange={(date) => setToDate(date)}
                    disabledDate={(current) => current < fromDate}
                  />
                </Form.Item>
                <Form.Item name="Provider" hidden>
                  <Input />
                </Form.Item>
                <Form.Item
                  name="PatientId"
                  hidden
                  initialValue={Patient.Patient.PatientId}
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
                  <Button type="default" danger onClick={handleReset}>
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Divider style={{ marginBottom: "0rem" }} />
          </Form>
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
        </Tabs.TabPane>
      </Tabs >
    </>
  );
}

export default Prescription;
