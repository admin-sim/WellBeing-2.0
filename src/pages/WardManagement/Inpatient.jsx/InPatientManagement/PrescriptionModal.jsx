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
  Table,
  Tabs,
  AutoComplete,
  message,
  Popconfirm
} from "antd";
import React, { useState } from "react";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { urlSearchExistingPrescription, urlGetAllDrugs, urlGetProductDetails, urlAddNewNewRequest, urlUpdateIndent, urlAddNewPatientIndent, urlGetPrescriptionByPrescriptionHedderId, urlUpdateRequest } from "../../../../../endpoints.js";
import PatientHeader from "../../../../components/PatientHeader";
import CustomTable from "../../../../components/customTable";
import dayjs from "dayjs";
import { validate } from "uuid";
import { render } from "react-dom";

function Prescription({ bed, patient, Dropdown, open, handleClose }) {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [defaultActiveKey, setDefaultActiveKey] = useState("1");
  const [buttonTitle, setButtonTitle] = useState('Save')
  const [tabName, setTabName] = useState('New')

  const initial = [
    {
      key: 0,
      Drug: "",
      Route: "",
      Frequency: "",
      IntervalInDays: "",
      TotalQty: "",
      Instruction: "",
      ActiveFlag: true
    }
  ]

  const [tableData1, setTableData1] = useState(initial);
  const [tableData2, setTableData2] = useState([]);
  const [productOptions, setProductOptions] = useState([])

  const handleCancel = () => {
    form1.resetFields();
    form2.resetFields();
    form3.resetFields();
    setTableData1(initial)
    setTableData2[[]]
    setProductOptions([])
    setDefaultActiveKey("1")
    setButtonTitle('Save')
    setTabName('New')
    handleClose();
  };

  const onChange = (key) => {
    console.log(key);
  };

  const handleAddRow = () => {
    setTableData1([
      ...tableData1,
      {
        key: tableData1.length + 1,
        Drug: "",
        Route: "",
        Frequency: "",
        IntervalInDays: "",
        TotalQty: "",
        Instruction: "",
        ActiveFlag: true
      },
    ]);
  };

  const handleDeleteRow = (record) => {
    debugger;
    const newData = tableData1.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setTableData1(newData);
  };

  const handleSearch = async (searchText) => {
    debugger
    if (searchText) {
      const response = await customAxios.get(`${urlGetAllDrugs}?Type=${searchText}`);
      const apiData = response.data.data;
      const newdata = apiData.map((item) => {
        return { label: item.ProductName + " (Stock)" + item.CurrentStock, value: item.ProductName, id: item.ProductId };
      });
      setProductOptions(newdata)
    }
  };

  const handleReset = () => {
    form2.resetFields()
  }

  const handleInputChange = async (value, record, option) => {
    debugger
    const response = await customAxios.get(`${urlGetProductDetails}?ProductId=${option.id}`);
    const apiData = response.data.data;
    if (response.status === 200 && apiData != null) {
      form3.setFieldsValue({
        tableData: {
          [record.key]: {
            ProductId: apiData.ProductDefinitionId,
          },
        },
      });
      form3.setFieldsValue({
        tableData: {
          [record.key]: {
            UomId: apiData.UOMPrimaryUOM,
          },
        },
      });
    }
  }

  const getInstruction = (value) => {
    debugger
    switch (value) {
      case 5: return { text: 'Afternoon', round: 1 }
      case 4: return { text: 'Night', round: 1 }
      case 3: return { text: 'Morning, Afternoon and Night', round: 3 }
      case 2: return { text: 'Morning', round: 1 }
      default: return { text: 'Morning and Night', round: 2 }
    }
  }

  const SelectFrequency = (value, option, record) => {
    debugger
    const total = 0
    const interval = form3.getFieldValue(["tableData", record.key, "IntervalInDays"])
    if (value) {
      form3.setFieldsValue({
        tableData: {
          [record.key]: {
            Instruction: getInstruction(value).text,
          },
        },
      });
      if (interval) {
        form3.setFieldsValue({
          tableData: {
            [record.key]: {
              TotalQty: getInstruction(value).round * parseInt(interval),
            },
          },
        })
      } else {
        form3.setFieldsValue({
          tableData: {
            [record.key]: {
              TotalQty: total,
            },
          },
        })
      }
    } else {
      form3.setFieldsValue({
        tableData: {
          [record.key]: {
            Instruction: '',
          },
        },
      });
      form3.setFieldsValue({
        tableData: {
          [record.key]: {
            TotalQty: 1,
          },
        },
      })
    }
  }

  const Interval = (value, record) => {
    debugger
    const form3data = form3.getFieldsValue();
    const specific = form3data.tableData?.[record.key];
    form3.setFieldsValue({
      tableData: {
        [record.key]: {
          TotalQty: getInstruction(specific.Frequency).round * parseInt(value),
        },
      },
    })
  }

  const columns = [
    {
      title: "Drug",
      dataIndex: "Drug",
      key: "Drug",
      render: (text, record) => (
        <>
          <Form.Item
            name={["tableData", record.key, "Drug"]}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please input drug!" }]}
            initialValue={record.DrugName}
          >
            {/* <Input
            value={text}
            onChange={(e) =>
              handleInputChange(e.target.value, record.key, "Drug")
            }
          /> */}
            <AutoComplete disabled={!!record.PrescriptionLineId}
              options={productOptions}
              onSearch={handleSearch}
              onSelect={(value, option) =>
                handleInputChange(value, record, option)
              }
            />
          </Form.Item>
          <Form.Item hidden name={["tableData", record.key, "ProductId"]} initialValue={record.ProductId}><Input /></Form.Item >
          <Form.Item hidden name={["tableData", record.key, "UomId"]} initialValue={record.UomId}><Input /></Form.Item>
          <Form.Item hidden name={["tableData", record.key, "PrescriptionLineId"]} initialValue={record.PrescriptionLineId}><Input /></Form.Item >
          <Form.Item hidden name={["tableData", record.key, "IndentLineId"]} initialValue={record.IndentLineId}><Input /></Form.Item >
        </>
      ),
    },
    {
      title: "Route",
      dataIndex: "Route",
      key: "Route",
      render: (text, record) => (
        <Form.Item
          name={["tableData", record.key, "Route"]}
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
      key: "Frequency",
      render: (text, record) => (
        <Form.Item
          name={["tableData", record.key, "Frequency"]}
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: "Please input frequency!" }]}
          initialValue={record.FrequencyId}
        >
          <Select style={{ width: "100%" }} onChange={(value, option) => SelectFrequency(value, option, record)} allowClear>
            {(Dropdown.Frequency || []).map((option) => (
              <Select.Option key={option.FrequencyId} value={option.FrequencyId}>
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
      key: "IntervalInDays",
      render: (text, record) => (
        <Form.Item
          name={["tableData", record.key, "IntervalInDays"]}
          style={{ marginBottom: 0 }}
          initialValue={record.Interval}
        // rules={[
        //   { required: true, message: "Please input interval in days!" },
        // ]}
        >
          <Input value={text} onChange={(e) => Interval(e.target.value, record)} />
        </Form.Item>
      ),
    },
    {
      title: "TotalQty",
      dataIndex: "TotalQty",
      key: "TotalQty",
      render: (text, record) => (
        <Form.Item
          name={["tableData", record.key, "TotalQty"]}
          style={{ marginBottom: 0 }}
          initialValue={record.TotalQty}
        // rules={[{ required: true, message: "Please input total quantity!" }]}
        >
          <Input
            value={text}
            onChange={(e) =>
              handleInputChange(e.target.value, record.key, "TotalQty")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Instruction",
      dataIndex: "Instruction",
      key: "Instruction",
      render: (text, record) => (
        <Form.Item
          name={["tableData", record.key, "Instruction"]}
          style={{ marginBottom: 0 }}
          initialValue={record.Instruction}
        // rules={[{ required: true, message: "Please input instruction!" }]}
        >
          <Input
            value={text}
          // onChange={(e) =>
          //   handleInputChange(e.target.value, record.key, "Instruction")
          // }
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <Button type="link" onClick={handleAddRow}>
          <PlusCircleOutlined />
        </Button>
      ),
      key: "action",
      // render: (_, record) => (
      //   <Button type="link" danger onClick={() => handleDeleteRow(record.key)}>
      //     <DeleteOutlined />
      //   </Button>
      // ),
      render: (_, record) => (
        <Popconfirm danger
          title="Sure to delete?"
          onConfirm={() => handleDeleteRow(record)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
    },
  ];

  const EditTab = () => {
    debugger
    setDefaultActiveKey("1")
    setButtonTitle('Update')
    setTabName('Edit')
  }

  const EditPrescription = async (record) => {
    debugger
    const input = {
      EncounterId: form1.getFieldValue('EncounterId'),
      PatientId: form1.getFieldValue('PatientId'),
    }
    const response = await customAxios.get(`${urlGetPrescriptionByPrescriptionHedderId}?EncounterId=${input.EncounterId}&PatientId=${input.PatientId}&PriscptionHedderId=${record.PriscptionHedderId}`);
    const apiData = response.data.data;
    if (response.status === 200 && apiData !== null) {
      const newData = apiData.PrescriptionModel.map((item, index) => {
        form3.setFieldsValue({
          tableData: {
            [0]: {
              IndentId: item.IndentId,
            },
          },
        });
        return {
          ...item,
          key: index,
          Route: parseInt(item.Route),
          index: index + 1,
        }
      })
      setTableData1(newData)
      EditTab()
    }
  }

  const columns2 = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Order Id",
      dataIndex: "PrescriptionId",
      key: "key",
      render: (text, record, index) => {
        if (record.IndentStatus === 'Pending') {
          return <Button type="link" onClick={() => EditPrescription(record)}>{record.PrescriptionId}</Button>
        }
        else {
          return record.PrescriptionId
        }
      }
    },
    {
      title: "Indent Number",
      dataIndex: "IndentNumber",
      key: "key",
    },
    {
      title: "Indent Status",
      dataIndex: "IndentStatus",
      key: "key",
    },
    {
      title: "Order Date",
      dataIndex: "PresDate",
      key: "key",
    },
    {
      title: "Encounter",
      dataIndex: "Encounter",
      key: "key",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "key",
    },
    {
      title: "Department",
      dataIndex: "DeptName",
      key: "key",
    },
    {
      title: "Ordering Physician",
      dataIndex: "ProviderName",
      key: "key",
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
        <Tabs defaultActiveKey={defaultActiveKey}
          size="small"
          onChange={onChange}
          tabBarGutter={0}
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
              // onFinish={handlePreFinish}
              onFinish={async (values) => {
                debugger
                const Drugss = []
                await form3.validateFields()
                const obj = {
                  IssueingStoreId: values.Store,
                  IndentDatestring: values.IndentDate ? values.IndentDate.format('DD-MM-YYYY') : '',
                  // Remarks: $("#Remarks").val(),
                  FacilityId: 1,
                  IndentTemplateId: 0,
                  // IndentType: $("#IndentType").val(),
                  PatientId: values.PatientId,
                  EncounterId: values.EncounterId,
                  IndentCategory: "PatientIndent",
                  IndentStatus: "Pending"
                }
                const form2data = form3.getFieldsValue().tableData
                for (let i = 0; i < form2data.length; i++) {
                  const Drug = {
                    DrugId: form2data[i].ProductId,
                    UomId: form2data[i].UomId,
                    Dose: form2data[i].Dose ? form2data[i].Dose : 0,
                    Route: form2data[i].Route.toString(),
                    FrequencyId: form2data[i].Frequency,
                    Interval: parseInt(form2data[i].IntervalInDays),
                    Instruction: form2data[i].Instruction,
                    EncounterID: values.EncounterId,
                    PatientId: values.PatientId,
                    Stock: form2data[i].Stock,
                    TotalQty: form2data[i].TotalQty,
                    FoodRelation: form2data[i].FoodRelation ? form2data[i].FoodRelation : 0,
                    ProductId: form2data[i].ProductId,
                    RequestQty: form2data[i].TotalQty,
                    PrescriptionLineId: form2data[i].PrescriptionLineId
                  }
                  Drugss.push(Drug)
                }
                const IndentViewModel = {
                  newIndentModel: obj,
                  IndentDetails: Drugss
                }
                const urlIndent = !!form2data[0].PrescriptionLineId ? urlUpdateIndent : urlAddNewPatientIndent
                const urlPres = !!form2data[0].PrescriptionLineId ? urlUpdateRequest : urlAddNewNewRequest
                const response = await customAxios.post(urlIndent, IndentViewModel, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                if (response.status === 200 && response.data.data != null) {
                  const Prescription = Drugss.map((item) => {
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
                    // handleCancel()
                  }
                }
              }}
              initialValues={{
                IndentDate: dayjs()
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
                    <DatePicker style={{ width: "100%" }} format='DD-MM-YYYY' />
                  </Form.Item>
                  <Form.Item name="EncounterId" hidden initialValue={(Dropdown.LastEncounter || {}).EncounterId}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="PatientId" hidden initialValue={Dropdown.PatientId}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="IndentId" hidden>
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
                    <Select style={{ width: "100%" }} disabled={Dropdown.StoreId === 0 ? false : true}>
                      {(Dropdown.StoreModel || []).map((option) => (
                        <Select.Option key={option.StoreId} value={option.StoreId}>
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
                    <Button type="default" danger onClick={handleCancel}>
                      Cancel
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
                    dataSource={tableData1.filter((item) => item.ActiveFlag !== false)}
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
              // onFinish={handlePreFinish}
              onFinish={async (values) => {
                debugger
                const Pre = {
                  FromDateString: values.FromDate ? values.FromDate.format('DD-MM-YYYY') : '',
                  ToDateString: values.ToDate ? values.ToDate.format('DD-MM-YYYY') : '',
                  Provider: 0,
                  Patientid: values.PatientId,
                }
                try {
                  const response = await customAxios.get(
                    `${urlSearchExistingPrescription}?Provider=${Pre.Provider}&Patientid=${Pre.Patientid}&FromDateString=${Pre.FromDateString}&ToDateString=${Pre.ToDateString}`
                  );
                  if (response.status === 200 && response.data.data !== null) {
                    const newdata = response.data.data.ExistingPrescriptionModel.map((item, index) => {
                      return {
                        ...item,
                        key: index + 1
                      }
                    })
                    setTableData2(newdata)
                    // setRecordExpectedDischargeModalOpen(false)
                  } else {
                    console.error("Failed to fetch Record EDD");
                  }
                } catch (error) {
                  console.error("Error:", error);
                }
                // handleCancel();
              }}
              initialValues={{
                FromDate: dayjs().subtract(1, 'day'),
                ToDate: dayjs()
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
                    <DatePicker style={{ width: "100%" }} format='DD-MM-YYYY' />
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
                    <DatePicker style={{ width: "100%" }} format='DD-MM-YYYY' />
                  </Form.Item>
                  <Form.Item name="Provider" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name="PatientId" hidden initialValue={Dropdown.PatientId}>
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
            <CustomTable
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
        </Tabs>
      </Modal>
    </div >
  );
}

export default Prescription;
