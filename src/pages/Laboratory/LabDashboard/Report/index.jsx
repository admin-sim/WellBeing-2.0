import {
  Form,
  Input,
  Card,
  Row,
  Col,
  Layout,
  Table,
  Button,
  notification,
  Space,
  ConfigProvider,
  Spin,
  Select,
  AutoComplete,
  Modal,
  message,
  Divider,
} from "antd";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { useState, useEffect } from "react";
//import ".//style.css";

import {
  urlGetPatientHeaderDetails,
  urlResultEntryIndex,
  urlLoadTestReferenceForResEntry,
  urlGetSelectedTestDataForResEntered,
  urlGetTemplateDataByTemplateId,
  urlLoadSampleCollectionGrid,
  urlSaveVerification,
  urlGetAllTemplateTestForPatient,
} from "../../../../../endpoints.js";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import { useLocation } from "react-router-dom";
import PatientHeader from "../../../../components/PatientHeader/index.jsx";
import CkEditor from "../../../../components/CKEditor/index.jsx";
import { useNavigate } from "react-router";
import PageHeader from "../../../../components/PageHeader/index.jsx";
const Report = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Ant Design Form hook
  const [services, setServices] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [resultEntry, setResultEntry] = useState([]);
  const [methods, setMethods] = useState([]);
  const [greenRow, setGreenRow] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const location = useLocation();
  const record = location.state.record;
  const [invalidInputs, setInvalidInputs] = useState({});
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
    if (!ckModalOpen) handleCancel();
  }, [ckModalOpen]);

  useEffect(() => {
    fetchDataHeader();
  }, []);

  const fetchDataHeader = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${record.PatientId}&EncounterId=${record.EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setPatientData(detailsheader);
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchChargeDetails();
  }, []);

  const fetchChargeDetails = async () => {
    setTableLoading(true);
    try {
      const response = await customAxios.get(
        `${urlResultEntryIndex}?PatientId=${record.PatientId}&EncounterId=${record.EncounterId}&SelclabId=${record.PatientLabStatusID}`
      );
      if (response.status === 200) {
        const patientdetail = response.data.data.ListOfSamplColTests;
        setServices(
          patientdetail.map((item) => ({ ...item, key: item.SmpColHeaderId }))
        );

        const methodsWithKeys = response.data.data.ListTestMethodModel.map(
          (method) => ({
            ...method,
            key: uuidv4(), // Assign a unique key using uuidv4
          })
        );
        setMethods(methodsWithKeys);
      } else {
        console.error("Failed to fetch patient details");
      }
      setTableLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableLoading(false);
    }
  };


  

  const columns = [
    { title: "Test Name", dataIndex: "TestName", key: "TestName" },
    { title: "Amount", dataIndex: "PatientNetAmount", key: "PatientNetAmount" },
    { title: "Lab Number", dataIndex: "LabNumber", key: "LabNumber" },
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
        console.log('IsTemplateTest:', record.IsTemplateTest); // Debugging step to see value
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
    }
    
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
            record.PatientId,
            record.EncounterId,
            ListOfResultEntryData
          );
          setResultEntry(AllTemplateTest);
          // Handle the API response (AllTemplateTest) here
        } catch (error) {
          console.error("Error fetching template tests:", error);
        }
      }else{
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

  // const LoadAlreadyResEnteredTests = async (testid, chargeid) => {
  //   try {
  //     const response = await customAxios.get(
  //       `${urlGetSelectedTestDataForResEntered}?TestId=${testid}&ChargeId=${chargeid}&PatientId=${record.PatientId}&EncounterId=${record.EncounterId}`
  //     );
  //     if (response.status === 200 && response.data != null) {
  //       const resultEntries = response.data.data.ResultEntryList;

  //       // Add UUID v4 key to each result entry
  //       const resultEntriesWithUUID = resultEntries.map((entry) => ({
  //         ...entry,
  //         key: uuidv4(), // Generate a new UUID for each entry
  //       }));

  //       setResultEntry(resultEntriesWithUUID);
  //       setKey(response.data.data.ResultEntryList.length);

  //       // Call validateResult for each entry
  //       resultEntriesWithUUID.forEach((entry) => {
  //         // Determine which reference value to use based on entry.IsFromTestValues
  //         const referenceValue = entry.IsFromTestValues
  //           ? entry.NormalValForTestVal
  //           : entry.TestRefRangeValue;

  //         validateResult(
  //           entry.key,
  //           entry.ObservedValues,
  //           referenceValue,
  //           entry
  //         );
  //       });
  //     } else {
  //     }
  //   } catch (error) {}
  // };

  const handleSampleCollection = () => {
    // Navigate to the desired page and pass the record object as a parameter
    navigate("/SampleCollection", { state: { record } });
  };
  const handleResultEntry = () => {
    // Navigate to the desired page and pass the record object as a parameter
    navigate("/ResultEntry", { state: { record } });
  };
  const handleVerification = () => {
    navigate("/Verification", { state: { record } });
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
      }
      finally {
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
    <Layout style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader title={"Verification"} button={false} />
        <div style={{ padding: "0.5 1rem" }}>
          <Space style={{ margin: "1rem 1rem 0 1rem" }}>
            <Button onClick={() => handleSampleCollection()}>
              Sample Collection
            </Button>
            <Button onClick={() => handleResultEntry()}>Result Entry</Button>
            <Button onClick={() => handleVerification()}>Verification</Button>
            <Button type="primary">Report</Button>
          </Space>
          <Divider />
          <div style={{ margin: "0 1rem 1rem 1rem" }}>
            <PatientHeader patient={patientData} />
          </div>
          <Form layout="vertical" form={form} style={{ padding: " 0 0.5rem" }}>
            <ConfigProvider
              theme={{
                components: {
                  Table: {
                    rowSelectedBg: () => {
                      greenRow && "#a1f7a1";
                    },
                    rowHoverBg: () => {
                      greenRow && "#a1f7a1";
                    },
                  },
                },
              }}
            >
              <Spin spinning={tableLoading}>
                <Table
                  className="custom-table"
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={services}
                  rowClassName={(record) =>
                    record.IsVerificationDone ? "green-row" : ""
                  }
                  scroll={{ x: true }}
                  size="small"
                  bordered
                />
              </Spin>
            </ConfigProvider>
            <Row justify="end" gutter={16} style={{ marginTop: "1rem" }}>
              <Col>
                <Form.Item>
                  <Button type="primary" onClick={() => handleReport()}>View Report</Button>
                </Form.Item>
              </Col>
            </Row>
            <Table
              className="custom-table"
              columns={resultEntrycolumns}
              dataSource={resultEntry}
              rowClassName={(record) =>
                record.IsProfileTest ? "ant-table-row-profile-test" : ""
              }
              scroll={{ x: true }}
              size="small"
              bordered
            />

           
          </Form>
        </div>
      </div>
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
    </Layout>
  );
};

export default Report;
