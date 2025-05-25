import {
  DeleteOutlined,
  PlusCircleOutlined,
  CloseSquareFilled,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  message,
  Space,
  AutoComplete,
  Table,
  Tabs,
  Tooltip,
  Dropdown,
  Modal,
  Spin,
} from "antd";
import { debounce } from "lodash";
import { useForm } from "antd/es/form/Form";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/customTable/index";
import customAxios from "../../../components/customAxios/customAxios";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import {
  urlPackageDescriptionServiceforclincal,
  urlGetServiceCharge,
  urlClinicalAddNewCharge,
  urlShowClinicalModal,
  urlSendTestsFOrLabModule,
  urlGetAllLabReportsForHealthSummary,
  urlGetAllTemplateTestForPatient,
} from "../../../../endpoints";
import dayjs from "dayjs";
import CkEditor from "../../../components/CKEditor";

function Investigation(Patient) {
  const [dropDown, setDropDown] = useState({
    PatientAccountCharges: [],
  });
  const [loading, setLoading] = useState(true);

  const UpdateDropDown = (value) => {
    debugger;
    setDropDown((prevDropdown) => ({
      ...prevDropdown,
      PatientAccountCharges: value,
    }));
    // setLoading(false)
  };

  const handleLoading = (status) => {
    setLoading(status);
  };

  const items = [
    {
      key: "1",
      label: "Order Details",
      children: (
        <OrderDetails
          Patient={Patient}
          dropDown={dropDown}
          loading={loading}
          UpdateDropDown={UpdateDropDown}
          handleLoading={handleLoading}
        />
      ),
    },
    {
      key: "2",
      label: "Previous Order Details",
      children: <PreviousOrderDetails Patient={Patient} loading={loading} />,
    },
    {
      key: "3",
      label: "Lab Reports",
      children: <LabReports Patient={Patient} />,
    },
  ];

  useEffect(() => {
    async function fetch(params) {
      const response = await customAxios(
        `${urlShowClinicalModal}?Id=${0}&PatientID=${
          Patient.Patient.PatientId
        }&EncounterId=${
          Patient.Patient.Encounter
        }&FromDate=${dayjs()}&ToDate=${dayjs()}&flag=${1}&returnType=${0}`
      );
      if (response.status == 200) {
        setDropDown(response.data.data);
        setLoading(false);
      }
    }
    fetch();
  }, [UpdateDropDown]);

  return (
    <>
      <div style={{ margin: "1rem 0" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>
          Investigation
        </span>
      </div>
      <Tabs defaultActiveKey="1" items={items} />
    </>
  );
}

const OrderDetails = (Patient) => {
  const [form1] = useForm();
  const [loading, setLoading] = useState(false);
  const [serviceDetails, setServiceDetails] = useState();
  const [services, setServices] = useState([]);

  const handleAutoCompleteChangeDia = async (value) => {
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

  const debouncedHandleAutoCompleteChangeServiceDia = debounce(
    handleAutoCompleteChangeDia,
    300
  );

  const handleSelectDia = async (value, option) => {
    debugger;
    setLoading(true);
    if (option.key) {
      try {
        const newData = await fetchDataForSelectedService(option.key);
        setServiceDetails(newData);
        if (newData.servicePrice) {
          form1.setFieldsValue({
            Provider: newData.servicePrice.ProviderName,
            Amount: newData.servicePrice.ChargeAmount,
          });
        }
      } catch (error) {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  const handleDeleteRow = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const columns = [
    {
      title: "Service Name",
      dataIndex: "ServiceName",
      width: 300,
    },
    {
      title: "Date",
      dataIndex: "StrServiceDate",
      width: 100,
    },
    {
      title: "Provider",
      dataIndex: "ProviderName",
      width: 180,
    },
    // {
    //   title: "Charge Amount",
    //   dataIndex: "ChargeAmount", //Rate
    //   width: 150,
    // },
    {
      title: "Action",
      width: 70,
      // render: (_, record) => (
      //   <div
      //     style={{
      //       display: "flex",
      //       justifyContent: "center",
      //     }}
      //   >
      //     <Popconfirm
      //       title="Sure to delete?"
      //       onConfirm={() => handleDeleteRow(record.key)}
      //     >
      //       <Button danger icon={<DeleteOutlined />} />
      //     </Popconfirm>
      //   </div>
      // ),
    },
    {
      title: "Lab Number",
      dataIndex: "LabNumber",
      width: 120,
    },
    {
      title: "Status",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip
            title={record.SamplColHeaderId ? "Sent" : "Click on Send to Lab"}
          >
            <Badge status={record.SamplColHeaderId ? "success" : "error"} />
          </Tooltip>
          <Tooltip
            title={
              record.IsSamplCollected
                ? "Sample Collected"
                : "Sample Collection Pending"
            }
          >
            <Badge status={record.IsSamplCollected ? "success" : "error"} />
          </Tooltip>
          <Tooltip
            title={
              record.IsResultEntryDone
                ? "Result Entry Done"
                : "Result Entry Pending"
            }
          >
            <Badge status={record.IsResultEntryDone ? "success" : "error"} />
          </Tooltip>
          <Tooltip
            title={
              record.IsVerificationDone
                ? "Verification Done"
                : "Verification Pending"
            }
          >
            <Badge status={record.IsVerificationDone ? "success" : "error"} />
          </Tooltip>
          {/* <Badge status={record.SamplColHeaderId ? 'success' : 'error'} /> */}
          {/* <Badge status={record.IsSamplCollected ? "success" : 'error'} /> */}
          {/* <Badge status={record.IsResultEntryDone ? "success" : 'error'} /> */}
          {/* <Badge status={record.IsVerificationDone ? "success" : 'error'} /> */}
          {/* <Badge status="error" />
          <Badge status="default" />
          <Badge status="processing" />
          <Badge status="warning" /> */}
        </Space>
      ),
    },
  ];

  const fetchDataForSelectedService = async (ServiceId) => {
    try {
      const response = await customAxios.get(
        `${urlGetServiceCharge}?ServiceId=${ServiceId}&PatientId=${Patient.Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Patient.Encounter}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  async function handleSendtoLab() {
    debugger
    // await form1.validateFields()
    Patient.handleLoading(true)
    const investigations = Patient.dropDown.PatientAccountCharges.filter(f => f.ServiceGroupID == 1042)
    const listnotsentToLab = investigations.filter(f => f.SamplColHeaderId == null || f.SamplColHeaderId == 0);
    if (listnotsentToLab.length > 0 && Patient.dropDown.LastEncounter.PatientType != 22) {
      const BillViewModel = {
        PatientId: Patient.Patient.Patient.PatientId,
        EncounterId: Patient.Patient.Patient.Encounter,
        IsAdvance: form1.getFieldValue("stat"),
        PFlag: 1,
        PatientAccountCharges: listnotsentToLab,
      };
      const response = await customAxios.post(
        urlSendTestsFOrLabModule,
        BillViewModel,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200) {
        Patient.UpdateDropDown(response.data.data.PatientAccountCharges);
        form1.resetFields();
        message.success("Investigations Has Been Sent Successfully.");
        Patient.handleLoading(false)
      } else {
        message.error("Failed To Send Investigations.");
        Patient.handleLoading(false)
      }
    }
    else {
      if (Patient.dropDown.LastEncounter.PatientType == 22) {
        message.success("For Out Patient Investigations Will Be Sent After Billing");
      } else {
        message.error("Please Add Some Investigations To Send.")
      }
      Patient.handleLoading(false)
    }
  }

  return (
    <>
      <span style={{ fontSize: "1rem", fontWeight: 600 }}>Order Entry</span>
      <Form
        layout="vertical"
        form={form1}
        onFinish={async (values) => {
          debugger;
          Patient.handleLoading(true);
          const service = {
            StrServiceDate: values.Date ? values.Date.format("DD-MM-YYYY") : "",
            PatientId: Patient.Patient.Patient.PatientId,
            ProviderID: serviceDetails.servicePrice.ProviderID,
            EncounterId: Patient.Patient.Patient.Encounter,
            ServiceId: serviceDetails.servicePrice.ServiceId,
            Rate: serviceDetails.servicePrice.ChargeAmount,
            ChargeAmount: serviceDetails.servicePrice.ChargeAmount,
            NetAmount: serviceDetails.servicePrice.ChargeAmount,
            PatientChargeAmount:
              serviceDetails.servicePrice.PatientChargeAmount,
            PatientTypeID: Patient.dropDown.LastEncounter.PatientType,
            OrderEntry: 1,
          };
          const response = await customAxios.post(
            urlClinicalAddNewCharge,
            service,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status == 200 && response.data != null) {
            Patient.UpdateDropDown(response.data.data.PatientAccountCharges);
            form1.resetFields();
            message.success("Charge Added Successfully");
            Patient.handleLoading(false);
          }
        }}
        initialValues={{
          stat: false,
          Date: dayjs(),
        }}
      >
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item name="Service" label="Service"
              rules={[{ required: true, message: "Please input" }]}
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
            <Form.Item name="Date" label="Date">
              <DatePicker
                style={{ width: "100%" }}
                disabled
                defaultValue={moment()}
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="Provider" label="Provider" rules={[{ required: true, message: "Please input" }]}>
              <Input disabled />
            </Form.Item>
          </Col>
          {/* <Col span={2}>
            <Form.Item name="stat" valuePropName="checked">
              <Checkbox style={{marginTop:30}}>STAT</Checkbox>
            </Form.Item>
          </Col> */}
          {/* <Col span={4}>
            <Form.Item name="Amount" label="Amount">
              <Input style={{ width: "100%" }} disabled />
            </Form.Item>
          </Col> */}
          <Col span={3} style={{ display: "flex", alignItems: "center" }}>
            <Button
              size="large"
              type="link"
              icon={<PlusCircleOutlined />}
              htmlType="submit"
            />
          </Col>
        </Row>
        <Row
          gutter={32}
          hidden={Patient.Patient.patientData?.PatientType == 22 ? true : false}
        >
          <Col>
            <Button
              type="primary"
              size="middle"
              onClick={handleSendtoLab}
              loading={Patient.loading}
            >
              Send To Lab
            </Button>
          </Col>
          <Col>
            <Form.Item name="stat" valuePropName="checked">
              <Checkbox>STAT</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        loading={Patient.loading}
        columns={columns}
        dataSource={Patient.dropDown.PatientAccountCharges.filter(
          (item) => item.ServiceGroupID == 1042
        )}
        title={() => <strong>Charge Details</strong>}
      />
    </>
  );
};

const PreviousOrderDetails = (Patient) => {
  const [form1] = useForm();
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [dataSource, setDataSource] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleSearch();
  }, []);

  const columns = [
    {
      title: "Encounter",
      dataIndex: "Encounter",
    },
    {
      title: "Service Name",
      dataIndex: "ServiceName",
    },
    {
      title: "Service Date",
      dataIndex: "AdvisedDateTimeString",
    },
    {
      title: "Order By",
      dataIndex: "Provider",
    },
  ];

  async function handleSearch() {
    setLoading(true);
    const response = await customAxios(
      `${urlShowClinicalModal}?Id=${0}&PatientID=${
        Patient.Patient.Patient.PatientId
      }&EncounterId=${
        Patient.Patient.Patient.Encounter
      }&FromDate=${fromDate.format("DD-MM-YYYY")}&ToDate=${toDate.format(
        "DD-MM-YYYY"
      )}&flag=${2}&returnType=${0}`
    );
    if (response.status == 200) {
      setDataSource(response.data.data.OrderModel);
      setLoading(false);
    }
  }

  return (
    <>
      <Form
        layout="vertical"
        form={form1}
        onFinish={(values) => {
          console.log(values);
        }}
        style={{ marginBottom: "-2rem" }}
        initialValues={{
          FromDate: dayjs().subtract(1, "day"),
          ToDate: dayjs(),
        }}
      >
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item name="FromDate" label="From Date">
              {/* <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" /> */}
              <DatePicker
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
                value={fromDate}
                onChange={(date) => setFromDate(date)}
                disabledDate={(current) => current > moment()}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="ToDate" label="To Date">
              {/* <DatePicker
                style={{ width: "100%" }}
                defaultValue={moment()}
                format="DD-MM-YYYY"
              /> */}
              <DatePicker
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
                value={toDate}
                onChange={(date) => setToDate(date)}
                disabledDate={(current) => current < fromDate}
              />
            </Form.Item>
          </Col>
          <Form.Item label=" ">
            <Col>
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Col>
          </Form.Item>
        </Row>
      </Form>
      <CustomTable
        columns={columns}
        dataSource={dataSource}
        actionColumn={false}
        isFilter={true}
        loading={loading}
      />
    </>
  );
};

const LabReports = (Patient) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    debugger;
    const response = await customAxios(
      `${urlGetAllLabReportsForHealthSummary}?PatientId=${
        Patient.Patient.Patient.PatientId
      }&EncounterId=${Patient.Patient.Patient.Encounter}&Flag=${0}`
    );
    if (response.status == 200) {
      const ListOfSamplCol = response.data.data.ListOfSamplColTests.map(
        (method) => ({
          ...method,
          key: uuidv4(), // Assign a unique key using uuidv4
        })
      );
      setTests(ListOfSamplCol);
      setLoading(false);
    }
  }

  const columns = [
    {
      title: "Test Name",
      dataIndex: "TestName",
    },
    {
      title: "Lab Number",
      dataIndex: "LabNumber",
    },
  ];

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

  const handleCancel = () => {
    setCustomKey(customKey + 1);
    setTemplateEditorData("");
    setCkModalOpen(false);
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
            Patient.Patient.Patient.PatientId,
            Patient.Patient.Patient.Encounter,
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
      "https://192.168.29.254:808/api/ReportsApi/GetLabReport",
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
    <>
      <span style={{ fontSize: "1rem", fontWeight: 600 }}>Lab Reports</span>
      <CustomTable
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tests}
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
          onCancel={handleCancel}
        >
          <CkEditor
            key={key ? key : customKey}
            initialData={templateEditorData}
            printButton={true}
            setData={setTemplateEditorData}
            isDisable={true}
          />
          <Row gutter={16} justify={"end"} style={{ marginTop: "1rem" }}>
            {/* <Col>
              <Button type="primary" onClick={handleTemplateSave}>
                Save
              </Button>
            </Col> */}
            <Col style={{ marginRight: "1rem" }}>
              <Button danger onClick={handleCancel}>
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
            onCancel={() => setIsModalVisible(false)}
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
                style={{ width: "100%", height: "500px", border: "none" }}
                title="Report"
              />
            )}
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Investigation;
