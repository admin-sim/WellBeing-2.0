import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  AutoComplete,
  Select,
  Table,
  Tabs,
  message,
  Space,
  Tooltip,
  Badge,
  Spin
} from "antd";
import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  RedoOutlined,
  CloseSquareFilled,
} from "@ant-design/icons";
import { debounce } from "lodash";
import PatientHeader from "../../../../components/PatientHeader";
import CustomTable from "../../../../components/customTable";
import Title from "antd/es/typography/Title";
import { TfiReload } from "react-icons/tfi";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlGetAllAutocompleteServicesAsync, urlGetServiceCharge, urlAddNewCharge, urlPackageDescriptionServiceforclincal, urlPackageDescriptionServicewithoutDiagServc, urlLoadSampleCollectionGrid, urlSendTestsFOrLabModule, urlGetAllTemplateTestForPatient } from "../../../../../endpoints.js";
import dayjs from "dayjs";
import ColumnGroup from "antd/es/table/ColumnGroup";
import { render } from "react-dom";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import CkEditor from "../../../../components/CKEditor/index.jsx";

function OrderEntry({
  bed,
  patient,
  Dropdown,
  open,
  handleClose,
  handleOrderEntry,
  handleFinish,
}) {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm(); // Initialize form3
  const [tableData, setTableData] = useState([]);
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceDetails, setServiceDetails] = useState();
  const [sampleCollectionGrid, setSampleCollectionGrid] = useState([]);
  const [defaultActiveKey, setDefaultActiveKey] = useState("1");


  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [resultEntry, setResultEntry] = useState([]);
  const [ckModalOpen, setCkModalOpen] = useState(false);
  const [templateEditorData, setTemplateEditorData] = useState("");
  const [key, setKey] = useState(null);
  const [customKey, setCustomKey] = useState(resultEntry?.length + 1000);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  const [blobData, setBlobData] = useState(null);
  const [reportloading, setReportLoading] = useState(false);

  const handleCancel = () => {
    form1.resetFields();
    form2.resetFields();
    form3.resetFields();
    setSelectedRowKeys([]);
    handleClose();
  };

  const onTabChange = (key) => {
    // if (key == '2') {
    //   handleClear()
    // }
    setDefaultActiveKey(key)
    // form2.submit()
  };

  useEffect(() => {
    setLoading(false);
  }, [Dropdown]);

  const handleAutoCompleteChange = async (value) => {
    debugger;
    setLoading(true);
    try {
      if (!value.trim()) {
        setServices(null);
        setLoading(false);
        return;
      }
      const response = await customAxios.get(
        `${urlPackageDescriptionServicewithoutDiagServc}?Description=${value}`
      );
      const responseData = response.data.data || [];
      if (
        Array.isArray(responseData) &&
        responseData.length > 0 &&
        responseData[0].Id !== undefined
      ) {
        const newOptions = responseData.map((option) => ({
          value: option.Name,
          label: option.Name,
          key: option.Id,
        }));
        setServices(newOptions);
      } else {
        setServices(null);
        form1.setFieldValue("Services", "");
      }
    } catch (error) {
      setServices(null);
    }
    setLoading(false);
  };

  const handleAutoCompleteChangeDia = async (value) => {
    debugger;
    setLoading(true);
    try {
      if (!value.trim()) {
        setServices(null);
        setLoading(false);
        return;
      }
      const response = await customAxios.get(
        `${urlPackageDescriptionServiceforclincal}?Description=${value}`
      );
      const responseData = response.data.data || [];
      if (
        Array.isArray(responseData) &&
        responseData.length > 0 &&
        responseData[0].Id !== undefined
      ) {
        const newOptions = responseData.map((option) => ({
          value: option.Name,
          label: option.Name,
          key: option.Id,
        }));
        setServices(newOptions);
      } else {
        setServices(null);
        form1.setFieldValue("Services", "");
      }
    } catch (error) {
      setServices(null);
    }
    setLoading(false);
  };

  const debouncedHandleAutoCompleteChangeService = debounce(
    handleAutoCompleteChange,
    300
  );

  const debouncedHandleAutoCompleteChangeServiceDia = debounce(
    handleAutoCompleteChangeDia,
    300
  );

  const onChange = async (key) => {
    debugger
    form1.resetFields()
    form2.resetFields()
    form3.resetFields()
    setServices([])
    setDefaultActiveKey(key)
    if (key == '4') {
      try {
        const response = await customAxios.get(
          `${urlLoadSampleCollectionGrid}?PatientId=${
            bed.PatientId
          }&EncounterId=${bed.EncounterId}&SelclabId=${0}`
        );
        if (response.status == 200) {
          const ListOfSamplCol = response.data.data.map((method) => ({
            ...method,
            key: uuidv4(), // Assign a unique key using uuidv4
          }));
          setSampleCollectionGrid(ListOfSamplCol);
        }
      } catch (error) {
        throw error;
      }
    }
  };

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      {
        key: tableData.length + 1,
        Drug: "",
        Route: "",
        Frequency: "",
        IntervalInDays: "",
        TotalQty: "",
        Instruction: "",
      },
    ]);
  };

  const handleDeleteRow = (key) => {
    const newData = tableData.filter((row) => row.key !== key);
    setTableData(newData);
  };

  const handleInputChange = (value, key, column) => {
    const newData = tableData.map((row) => {
      if (row.key === key) {
        return { ...row, [column]: value };
      }
      return row;
    });
    setTableData(newData);
  };

  const columns2 = [
    {
      title: "Service Name",
      dataIndex: "ServiceName",
      key: "key",
    },
    {
      title: "Date",
      dataIndex: "StrServiceDate",
      key: "key",
    },
    {
      title: "Provider",
      dataIndex: "ProviderName",
      key: "key",
    },
    // defaultActiveKey === '1' && {
    //   title: "Charge Amount",
    //   dataIndex: "ChargeAmount",
    //   width: 150,
    // },
    defaultActiveKey == '2' && {
      title: "Lab Number",
      dataIndex: "LabNumber",
      width: 120,
    },
    defaultActiveKey == '2' && {
      title: "Status",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title={record.SamplColHeaderId ? 'Sent' : 'Click on Send to Lab'}>
            <Badge status={record.SamplColHeaderId ? 'success' : 'error'} />
          </Tooltip>
          <Tooltip title={record.IsSamplCollected ? 'Sample Collected' : 'Sample Collection Pending'}>
            <Badge status={record.IsSamplCollected ? "success" : 'error'} />
          </Tooltip>
          <Tooltip title={record.IsResultEntryDone ? 'Result Entry Done' : 'Result Entry Pending'}>
            <Badge status={record.IsResultEntryDone ? "success" : 'error'} />
          </Tooltip>
          <Tooltip title={record.IsVerificationDone ? 'Verification Done' : 'Verification Pending'}>
            <Badge status={record.IsVerificationDone ? "success" : 'error'} />
          </Tooltip>
        </Space>
      ),
    }
  ].filter(Boolean);

  const columns3 = [
    {
      title: "Service Name",
      dataIndex: "ServiceName",
      key: "key",
    },
    {
      title: "Service Date",
      dataIndex: "AdmittedDateString",
      key: "key",
    },
    {
      title: "OrderBy",
      dataIndex: "Provider",
      key: "key",
    },
  ];

  const columns4 = [
    {
      title: "Test Name",
      dataIndex: "TestName",
    },
    {
      title: "Lab Number",
      dataIndex: "LabNumber",
    },
  ];

  // const columns4 = [
  //   {
  //     title: "Test Name",
  //     dataIndex: "TestName",
  //     width: 150,
  //   },
  //   {
  //     title: "Template Name",
  //     render: (text, record) => {
  //       console.log("IsTemplateTest:", record.IsTemplateTest); // Debugging step to see value
  //       if (record.IsTemplateTest === true) {
  //         return (
  //           <span
  //             style={{ color: "#1890ff", cursor: "pointer" }}
  //             onClick={() => handleTemplateClick(record)}
  //           >
  //             Template
  //           </span>
  //         );
  //       } else {
  //         return null; // Handle the case when IsTemplateTest is false, if needed
  //       }
  //     },
  //     width: 120,
  //   },
  // ];

  const fetchDataForSelectedService = async (ServiceId) => {
    debugger;
    try {
      const response = await customAxios.get(
        `${urlGetServiceCharge}?ServiceId=${ServiceId}&PatientId=${bed.PatientId}&EncounterId=${bed.EncounterId}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSelect = async (value, option) => {
    debugger;
    setLoading(true);
    if (option.key) {
      try {
        const newData = await fetchDataForSelectedService(option.key);
        setServiceDetails(newData);
        if (newData.servicePrice) {
          form1.setFieldsValue({
            Provider: newData.servicePrice.ProviderName,
          });
        }
      } catch (error) {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  const handleSelectDia = async (value, option) => {
    debugger;
    setLoading(true);
    if (option.key) {
      try {
        const newData = await fetchDataForSelectedService(option.key);
        setServiceDetails(newData);
        if (newData.servicePrice) {
          form2.setFieldsValue({
            Provider: newData.servicePrice.ProviderName,
          });
        }
      } catch (error) {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  async function handleSendtoLab() {
    debugger
    // await form1.validateFields()
    // Patient.handleLoading(true)
    setLoading(true)
    const investigations = Dropdown.PatientAccountCharges.filter(f => f.ServiceGroupID == 1042)
    const listnotsentToLab = investigations.filter(f => f.SamplColHeaderId == null || f.SamplColHeaderId == 0);
    if (listnotsentToLab.length > 0 && Dropdown.LastEncounter.PatientType != 22) {
      const BillViewModel = {
        PatientId: patient.PatientId,
        EncounterId: patient.EncounterId,
        IsAdvance: form2.getFieldValue('stat'),
        PFlag: 1,
        PatientAccountCharges: listnotsentToLab
      }
      const response = await customAxios.post(urlSendTestsFOrLabModule, BillViewModel, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200) {
        handleOrderEntry(response.data.data.PatientAccountCharges)
        // Patient.UpdateDropDown(response.data.data.PatientAccountCharges)
        // form1.resetFields()
        setLoading(false)
        message.success("Investigations Has Been Sent Successfully.");
        // Patient.handleLoading(false)
      }
      else {
        message.error('Failed To Send Investigations.')
        // Patient.handleLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  const handleTemplateClick = async (record) => {
    // Handle the click event, you can log the record or perform other actions

    // Additional logic to handle the template click
    setCurrentRecord(record);
    if (record.ResId > 0) {
      setTemplateEditorData(record.ObservedValues);
    } else {
      const response = await customAxios.get(
        `${urlGetTemplateDataByTemplateId}?Tid=${record.TemplateId}`
      );
      if (response.status === 200) {
        setTemplateEditorData(response.data.data.TempData);
        //setKey();
      }
    }
    // setReadOnly(true)
    setCkModalOpen(true);
  };
  const resultEntrycolumns = [
    {
      title: "Test Name",
      dataIndex: "TestName",
      width: 150,
    },
    {
      title: "Template Name",
      render: (text, record) => {
        console.log("IsTemplateTest:", record.IsTemplateTest); // Debugging step to see value
        if (record.IsTemplateTest === true) {
          return (
            <span
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={() => handleTemplateClick(record)}
            >
              Template
            </span>
          );
        } else {
          return null; // Handle the case when IsTemplateTest is false, if needed
        }
      },
      width: 120,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: async (selectedRowKeys, selectedRows) => {
      debugger;

      // Filter rows where IsResultEntryDone is true
      const filteredSelectedRows = selectedRows.filter(
        (row) => row.IsResultEntryDone
      );
      setSelectedRowKeys(selectedRowKeys); // Update selected row keys state
      setSelectedRow(filteredSelectedRows); // Update filtered selected rows state

      // Prepare ListOfResultEntryData by filtering and mapping rows with ChargeId > 0
      const ListOfResultEntryData = filteredSelectedRows
        .filter((row) => parseInt(row.ChargeId) > 0)
        .map((row) => ({ ChargeId: row.ChargeId }));

      // If ListOfResultEntryData has valid data, proceed to API call
      if (ListOfResultEntryData.length > 0) {
        try {
          const AllTemplateTest = await GetAllTemplateTestForPatient(
            bed.PatientId,
            bed.EncounterId,
            ListOfResultEntryData
          );
          setResultEntry(AllTemplateTest);
          // Handle the API response (AllTemplateTest) here
        } catch (error) {
          console.error("Error fetching template tests:", error);
        }
      } else {
        setResultEntry([]);
      }
    },
    getCheckboxProps: (record) => ({
      disabled: !record.IsResultEntryDone,
    }),
  };


  const GetAllTemplateTestForPatient = async (
    PatientId,
    EncounterId,
    ListOfResultEntryData
  ) => {
    try {
      const ChargeIdList = ListOfResultEntryData;

      const response = await customAxios.post(
        urlGetAllTemplateTestForPatient, // Adjust the URL to match your API endpoint
        ChargeIdList,
        {
          params: { PatientId: PatientId, EncounterId: EncounterId },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data.data != null) {
        return response.data.data.ResultEntryList;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching template tests:", error);
      return null;
    }
  };
  const handleCkeditorCancel = () => {
    setCustomKey(customKey + 1);
    setTemplateEditorData("");
    setCkModalOpen(false);
  };
  
  const handleReport = async () => {
    // Initialize the array to hold ChargeIds
    debugger;
    setReportLoading(true); 
    let ListOfSmplColResult = [];
  
    // Assuming selectedRow is an array of selected rows
    selectedRow.forEach((row) => {
      // Check if IsResultEntryDone is true and IsTemplate is not true for each selected row
      if (row.IsResultEntryDone === true && row.IsTemplate !== true) {
        // Push the ChargeId of the row into ListOfSmplColResult
        ListOfSmplColResult.push(row.ChargeId);
      }
    });
  
    // If there are ChargeIds in ListOfSmplColResult, proceed
    if (ListOfSmplColResult.length > 0) {
      // Join the ChargeIds into a comma-separated string
      const chargeIdStr = ListOfSmplColResult.join(",");
  
      // Create the request object
      const request = {
        ChargeId: chargeIdStr,  // Use the comma-separated ChargeIds string
        PatientId: selectedRow[0].PatientId, // Assuming PatientId is the same across selected rows
        EncounterId: selectedRow[0].EncounterId, // Assuming EncounterId is the same across selected rows
      };
  
      try {
        // Call the fetchReport function with the request
        const { url, blob } = await fetchReport(request);
  
        // Handle the response (e.g., displaying the report URL or downloading the file)
        setReportUrl(url);
        setBlobData(blob);
        setIsModalVisible(true); // Display the modal with the report
      } catch (error) {
        console.error("Error fetching report:", error);
      }finally {
        setReportLoading(false); // End loading
      }
    } else {
      console.log("No valid ChargeIds selected.");
      message.warning('Please select  Tests ');
      setReportLoading(false); 
    }
  };

  async function fetchReport(request) {
    const response = await fetch(
      "http://localhost:43705/api/ReportsApi/GetLabReport",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch report");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return { url, blob };
  }
  return (
    <div>
      <Modal
        width={"80%"}
        height={"100vh"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Nurse Order
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <PatientHeader patient={patient} />
        <Tabs
          size="small"
          onChange={onChange}
          tabBarGutter={0}
          type="card"
          style={{ marginTop: "1rem" }}
          tabBarStyle={{ display: "flex" }}
          defaultActiveKey={1}
          activeKey={defaultActiveKey}
        >
          <Tabs.TabPane
            tab={
              <div
                style={{
                  // width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Order Details
              </div>
            }
            key="1"
          >
            <Layout style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  minHeight: "max-content",
                  borderRadius: "10px",
                }}
              >
                <Row
                  style={{
                    padding: "0.5rem 1rem 0.5rem 1rem",
                    backgroundColor: "#40A2E3",
                    borderRadius: "10px 10px 0px 0px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Col>
                    <Title
                      level={4}
                      style={{
                        color: "white",
                        fontWeight: 500,
                        margin: 0,
                        paddingTop: 0,
                      }}
                    >
                      Patient Bill
                    </Title>
                  </Col>
                  <Col>
                    <Button type="link">
                      <TfiReload
                        style={{
                          color: "white",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>
                <Form
                  layout="vertical"
                  form={form1}
                  onFinish={async (values) => {
                    debugger;
                    setLoading(true);
                    const service = {
                      StrServiceDate: values.Date
                        ? values.Date.format("DD-MM-YYYY")
                        : "",
                      PatientId: bed.PatientId,
                      ProviderID: serviceDetails.servicePrice.ProviderID,
                      EncounterId: bed.EncounterId,
                      ServiceId: serviceDetails.servicePrice.ServiceId,
                      Rate: serviceDetails.servicePrice.ChargeAmount,
                      ChargeAmount: serviceDetails.servicePrice.ChargeAmount,
                      NetAmount: serviceDetails.servicePrice.ChargeAmount,
                      PatientChargeAmount:
                        serviceDetails.servicePrice.PatientChargeAmount,
                      PatientTypeID: patient.PatientType,
                      OrderEntry: 1,
                    };
                    const response = await customAxios.post(
                      urlAddNewCharge,
                      service,
                      {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    if (response.status == 200 && response.data != null) {
                      handleOrderEntry(response.data.PatientAccountCharges);
                      form1.resetFields();
                      setLoading(false);
                      message.success("Charge Added Successfully");
                    }
                    // handleCancel();
                  }}
                  style={{ margin: "1rem" }}
                  initialValues={{
                    Date: dayjs(),
                  }}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="Service"
                        label="Service"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Service",
                          },
                        ]}
                      >
                        <AutoComplete
                          options={services}
                          //onSearch={handleAutoCompleteChange}
                          onSearch={debouncedHandleAutoCompleteChangeService}
                          onSelect={handleSelect}
                          onChange={(value) => {}}
                          allowClear={{
                            clearIcon: <CloseSquareFilled />,
                          }}
                          loading={loading}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name="Date"
                        label="Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="DD-MM-YYYY"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="Provider"
                        label="Provider"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Provider",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col offset={1} span={4}>
                      <Form.Item label="&nbsp;">
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                        >
                          Add Service
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Layout>
            <Row>
              <Col span={24} style={{ marginTop: "0rem" }}>
                <CustomTable
                  title={() => (
                    <span
                      style={{
                        color: "indigo",
                        fontWeight: "700",
                        fontSize: "1rem",
                      }}
                    >
                      Charge Details
                    </span>
                  )}
                  columns={columns2}
                  dataSource={(Dropdown.PatientAccountCharges || []).filter(
                    (item) => item.ServiceGroupID != 1042
                  )}
                  pagination={false}
                  // onDelete={(record) => {
                  //   alert("Deleting Sl No. : " + record.slno);
                  // }}
                  actionColumn={false}
                  isFilter={true}
                  bordered
                  scroll={{
                    y: 120,
                  }}
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <div
                style={{
                  // width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Order Diagnostic Services
              </div>
            }
            key="2"
          >
            <Layout style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  minHeight: "max-content",
                  borderRadius: "10px",
                }}
              >
                <Row
                  style={{
                    padding: "0.5rem 1rem 0.5rem 1rem",
                    backgroundColor: "#40A2E3",
                    borderRadius: "10px 10px 0px 0px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Col>
                    <Title
                      level={4}
                      style={{
                        color: "white",
                        fontWeight: 500,
                        margin: 0,
                        paddingTop: 0,
                      }}
                    >
                      Diagnostic Order Entry
                    </Title>
                  </Col>
                  <Col>
                    <Button type="link">
                      <TfiReload
                        style={{
                          color: "white",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>
                <Form
                  layout="vertical"
                  form={form2}
                  onFinish={async (values) => {
                    debugger;
                    setLoading(true);
                    const service = {
                      StrServiceDate: values.Date
                        ? values.Date.format("DD-MM-YYYY")
                        : "",
                      PatientId: bed.PatientId,
                      ProviderID: serviceDetails.servicePrice.ProviderID,
                      EncounterId: bed.EncounterId,
                      ServiceId: serviceDetails.servicePrice.ServiceId,
                      Rate: serviceDetails.servicePrice.ChargeAmount,
                      ChargeAmount: serviceDetails.servicePrice.ChargeAmount,
                      NetAmount: serviceDetails.servicePrice.ChargeAmount,
                      PatientChargeAmount:
                        serviceDetails.servicePrice.PatientChargeAmount,
                      PatientTypeID: patient.PatientType,
                      OrderEntry: 1,
                    };
                    const response = await customAxios.post(
                      urlAddNewCharge,
                      service,
                      {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    if (response.status == 200 && response.data != null) {
                      handleOrderEntry(response.data.PatientAccountCharges);
                      form2.resetFields();
                      setLoading(false);
                      message.success("Charge Added Successfully");
                    }
                    // handleCancel();
                  }}
                  style={{ margin: "1rem" }}
                  initialValues={{
                    Date: dayjs(),
                    stat: false
                  }}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="Service"
                        label="Service"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Service",
                          },
                        ]}
                      >
                        <AutoComplete
                          options={services}
                          //onSearch={handleAutoCompleteChange}
                          onSearch={debouncedHandleAutoCompleteChangeServiceDia}
                          onSelect={handleSelectDia}
                          onChange={(value) => {}}
                          allowClear={{
                            clearIcon: <CloseSquareFilled />,
                          }}
                          loading={loading}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name="Date"
                        label="Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="DD-MM-YYYY"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="Provider"
                        label="Provider"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Provider",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col offset={1} span={4}>
                      <Form.Item label="&nbsp;">
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                        >
                          Add Service
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={3}>
                      <Form.Item>
                        <Button type="primary" onClick={handleSendtoLab} loading={loading}>Send To Lab</Button>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item name='stat' valuePropName="checked">
                        <Checkbox>STAT</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Layout>
            <Row>
              <Col span={24} style={{ marginTop: "0rem" }}>
                <CustomTable
                  title={() => (
                    <span
                      style={{
                        color: "indigo",
                        fontWeight: "700",
                        fontSize: "1rem",
                      }}
                    >
                      Charge Details
                    </span>
                  )}
                  columns={columns2}
                  dataSource={(Dropdown.PatientAccountCharges || []).filter(
                    (item) => item.ServiceGroupID == 1042
                  )}
                  pagination={false}
                  actionColumn={false}
                  isFilter={true}
                  bordered
                  scroll={{
                    y: 120,
                  }}
                  loading={loading}
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <div
                style={{
                  // width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Previous Order Details
              </div>
            }
            key="3"
          >
            <Layout style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  minHeight: "max-content",
                  borderRadius: "10px",
                }}
              >
                <Row
                  style={{
                    padding: "0.5rem 1rem 0.5rem 1rem",
                    backgroundColor: "#40A2E3",
                    borderRadius: "10px 10px 0px 0px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Col>
                    <Title
                      level={4}
                      style={{
                        color: "white",
                        fontWeight: 500,
                        margin: 0,
                        paddingTop: 0,
                      }}
                    >
                      Previous Order Details
                    </Title>
                  </Col>
                  <Col>
                    <Button type="link">
                      <TfiReload
                        style={{
                          color: "white",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>
                <Form
                  layout="vertical"
                  form={form3}
                  onFinish={(values) => {
                    setLoading(true), handleFinish(values);
                  }}
                  style={{ margin: "1rem" }}
                  initialValues={{
                    FromDate: dayjs().subtract(1, "day"),
                    ToDate: dayjs(),
                  }}
                >
                  <Row gutter={16}>
                    <Col span={4}>
                      <Form.Item
                        name="FromDate"
                        label="From Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="DD-MM-YYYY"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name="ToDate"
                        label="To Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="DD-MM-YYYY"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="Indicator"
                        label="Indicator"
                        rules={[
                          {
                            required: true,
                            message: "Please select Indicator",
                          },
                        ]}
                        initialValue={2060}
                      >
                        <Select style={{ width: "100%" }} defaultValue={2060}>
                          {(Dropdown ? Dropdown.DocumentType : []).map(
                            (option) => (
                              <Select.Option
                                key={option.LookupID}
                                value={option.LookupID}
                              >
                                {option.LookupDescription}
                              </Select.Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="Description"
                        label="Description"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Please select Description",
                        //   },
                        // ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label="&nbsp;">
                        <Button type="primary" htmlType="submit">
                          Search
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Layout>
            <Row>
              <Col span={24} style={{ marginTop: "0rem" }}>
                <CustomTable
                  title={() => (
                    <span
                      style={{
                        color: "indigo",
                        fontWeight: "700",
                        fontSize: "1rem",
                      }}
                    >
                      Charge Details
                    </span>
                  )}
                  columns={columns3}
                  dataSource={Dropdown.OrderModel || []}
                  pagination={false}
                  // onDelete={(record) => {
                  //   alert("Deleting Sl No. : " + record.slno);
                  // }}
                  actionColumn={false}
                  isFilter={true}
                  bordered
                  scroll={{
                    y: 120,
                  }}
                  loading={loading}
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <div
                style={{
                  // width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Lab Reports
              </div>
            }
            key="4"
          >
            <Layout style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  minHeight: "max-content",
                  borderRadius: "10px",
                }}
              >
                <Row
                  style={{
                    padding: "0.5rem 1rem 0.5rem 1rem",
                    backgroundColor: "#40A2E3",
                    borderRadius: "10px 10px 0px 0px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Col>
                    <Title
                      level={4}
                      style={{
                        color: "white",
                        fontWeight: 500,
                        margin: 0,
                        paddingTop: 0,
                      }}
                    >
                      Lab Reports
                    </Title>
                  </Col>
                  <Col>
                    <Button type="link">
                      <TfiReload
                        style={{
                          color: "white",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>
                <CustomTable
                  rowSelection={rowSelection}
                  columns={columns4}
                  dataSource={sampleCollectionGrid}
                  actionColumn={false}
                />
                <Row justify="end" gutter={16} style={{ marginTop: "1rem" }}>
                  <Col>
                    <Form.Item>
                      <Button type="primary" onClick={() => handleReport()}>
                        View Report
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
                <CustomTable
                  columns={resultEntrycolumns}
                  dataSource={resultEntry}
                  actionColumn={false}
                />
                <div>
                  <Modal
                    width={"65rem"}
                    height={"auto"}
                    centered
                    title={
                      <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                        Template
                      </span>
                    }
                    open={ckModalOpen}
                    maskClosable={false}
                    footer={null}
                    onCancel={handleCkeditorCancel}
                  >
                    <CkEditor
                      key={key ? key : customKey}
                      initialData={templateEditorData}
                      printButton={true}
                      setData={setTemplateEditorData}
                      isDisable={true}
                    />
                    <Row
                      gutter={16}
                      justify={"end"}
                      style={{ marginTop: "1rem" }}
                    >
                      <Col style={{ marginRight: "1rem" }}>
                        <Button danger onClick={handleCkeditorCancel}>
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Modal>
                  {reportloading && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.8)", // Light overlay
                        zIndex: 1000,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Spin size="large" />
                    </div>
                  )}

                  <div>
                    {error && <div>Error: {error}</div>}

                    <Modal
                      centered
                      title="Report"
                      open={isModalVisible}
                      onCancel={() => {
                        setIsModalVisible(false); // Hide the modal
                        setSelectedRowKeys([]);   // Clear the selected row keys
                      }}
                      
                      footer={[
                        <Button
                          key="close"
                          danger
                          onClick={() => setIsModalVisible(false)}
                        >
                          Close
                        </Button>,
                      ]}
                      width={"60rem"} // You can adjust the width as needed
                      height={"auto"}
                    >
                      {reportUrl && (
                        <iframe
                          src={reportUrl}
                          style={{
                            width: "100%",
                            height: "500px",
                            border: "none",
                          }}
                          title="Report"
                        />
                      )}
                    </Modal>
                  </div>
                </div>
              </div>
            </Layout>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

export default OrderEntry;
