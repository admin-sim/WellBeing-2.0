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
} from "../../../../../endpoints.js";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import { useLocation } from "react-router-dom";
import PatientHeader from "../../../../components/PatientHeader/index.jsx";
import CkEditor from "../../../../components/CKEditor/index.jsx";
import { useNavigate } from "react-router";
import PageHeader from "../../../../components/PageHeader/index.jsx";
const Verification = () => {
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

  const LoadSampleCollectionGrid = async () => {
    try {
      const response = await customAxios.get(
        `${urlLoadSampleCollectionGrid}?PatientId=${record.PatientId}&EncounterId=${record.EncounterId}&SelclabId=${record.PatientLabStatusID}`
      );
      if (response.status === 200) {
        const services = response.data.data;
        setServices(
          services.map((item) => ({ ...item, key: item.SmpColHeaderId }))
        );
      } else {
        console.error("Failed to fetch patient details");
      }
      setTableLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableLoading(false);
    }
  };

  const handleSaveVerificationStatus = async (VerifyStatus) => {
    if (selectedRow?.length === 0) {
      notification.warning({
        message: "Warning",
        description: "Please select at least one test.",
      });
      return;
    }
    var intverifystatus = parseInt(VerifyStatus);
    var boolverifyStatus;

    if (intverifystatus === 0) {
      boolverifyStatus = false;
    } else if (intverifystatus === 1) {
      boolverifyStatus = true;
    } else {
      var message1 = "There Is A Problem Verifying A Test.";
      message.error(message1);
      return; // Exit function if status is invalid
    }

    // Check if resultEntry is defined and has one record

    if (selectedRow.IsVerificationDone === true && intverifystatus === 1) {
      var message2 = "This Test Is Already Verified.";
      message.warning(message2);
      return false;
    } else if (
      selectedRow.IsVerificationDone === false &&
      intverifystatus === 0
    ) {
      var message3 = "Please Verify the Test To Unverify.";
      message.warning(message3);
      return false;
    } else {
      // Create a new array with updated values
      const SmplColList = [
        {
          PatientId: selectedRow.PatientId, // Update PatientId
          EncounterId: selectedRow.EncounterId, // Update EncounterId
          LabStatusId: selectedRow.LabStatusId, // Update LabStatusId
          SmpColHeaderId: selectedRow.SmpColHeaderId,
          SmpColLineId: selectedRow.SmpColLineId,
          IsVerificationDone: boolverifyStatus,
        },
      ];

      try {
        const response = await customAxios.post(
          urlSaveVerification,
          SmplColList,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.data.Status !== "") {
          const message1 = "Saved Successfully";
          notification.success({
            message: "Success",
            description: message1,
          });
          setResultEntry([]);
          LoadSampleCollectionGrid();
          setSelectedRow([]);
          setSelectedRowKeys([]);

          form.resetFields();
        } else {
          notification.error({
            message: "Error",
            description: "Something Went Wrong.....",
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: "An error occurred while adding the user.",
        });
      }
    }
  };

  const handleReset = async (values) => {};

  const columns = [
    { title: "Test Name", dataIndex: "TestName", key: "TestName" },
    { title: "Amount", dataIndex: "PatientNetAmount", key: "PatientNetAmount" },
    { title: "Lab Number", dataIndex: "LabNumber", key: "LabNumber" },
  ];

  const LoadAndSetReferences = async (entry, methodid) => {
    // If entry is from test values, return the existing values without modification
    if (entry.IsFromTestValues) {
      return {
        TestRefRangeValue: entry.NormalValForTestVal,
        TestRefDescription: entry.NormalValForTestVal,
      };
    }

    // For non-test values, proceed with the original logic
    const TestReflist = await LoadTestReferenceValues(
      entry.TestId,
      methodid,
      patientData.Gender
    );

    const matchingRef = GetMatchingTestReference(TestReflist);
    let ReferenceRange = "No Reference";
    let refrangedesc = "";

    if (matchingRef && matchingRef.length > 0) {
      if (matchingRef[0].OperatorType === "<>") {
        ReferenceRange = `${matchingRef[0].Low}-${matchingRef[0].High}`;
      } else {
        ReferenceRange = `${matchingRef[0].OperatorType} ${matchingRef[0].Low}`;
      }
      refrangedesc = matchingRef[0].Description;
    }

    return {
      TestRefRangeValue: ReferenceRange,
      TestRefDescription: refrangedesc,
    };
  };

  async function LoadTestReferenceValues(TestId, TestMethodId, GenderId) {
    const PTestID = parseInt(TestId);
    const PGenderID = parseInt(GenderId);
    const mthid = TestMethodId ? TestMethodId : "";

    if (PTestID > 0 && PGenderID > 0) {
      try {
        const response = await customAxios.get(
          `${urlLoadTestReferenceForResEntry}?TestId=${PTestID}&TestMethodId=${mthid}&GenderId=${PGenderID}`
        );
        return response.data.data.ListTestReferenceModel; // Ensure this returns the reference values you need
      } catch (error) {
        console.error("Error loading test reference values:", error);
        return []; // Return an empty array or handle error as needed
      }
    }
    return [];
  }

  function GetMatchingTestReference(TestReflist) {
    if (TestReflist && TestReflist.length > 0) {
      let Year, Month, days;
      if (patientData?.Age) {
        const ageArray = patientData?.Age.split(" ");
        if (ageArray.length > 0) {
          Year = ageArray[0].slice(0, -1);
          Month = ageArray[1]?.slice(0, -1);
          days = ageArray[2]?.slice(0, -1);

          if (parseInt(Year) > 0) {
            const YearsList = TestReflist.filter(
              (f) => f.PeriodName === "Years"
            );
            const yearsRes = YearsList.filter(
              (f) => parseInt(f.FromAge) <= Year && parseInt(f.ToAge) >= Year
            );
            return yearsRes;
          } else if (Month && parseInt(Month) > 0) {
            const monthsList = TestReflist.filter(
              (f) => f.PeriodName === "Months"
            );
            const monthsRes = monthsList.filter(
              (f) => parseInt(f.FromAge) <= Month && parseInt(f.ToAge) >= Month
            );
            return monthsRes;
          } else {
            const daysList = TestReflist.filter((f) => f.PeriodName === "Days");
            const daysRes = daysList.filter(
              (f) => parseInt(f.FromAge) <= days && parseInt(f.ToAge) >= days
            );
            return daysRes;
          }
        }
      }
    }
    return [];
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

  const handleCancel = () => {
    setCustomKey(customKey + 1);
    setTemplateEditorData("");
    setCkModalOpen(false);
  };
  const handleTemplateSave = () => {
    if (currentRecord) {
      const updatedRecord = {
        ...currentRecord,
        ObservedValues: templateEditorData,
      };
      updateRecords(updatedRecord);
      setCkModalOpen(false);
    }
  };

  const updateRecords = (updatedRecord) => {
    setResultEntry((prevRecords) =>
      prevRecords.map((record) =>
        record.key === updatedRecord.key ? updatedRecord : record
      )
    );
  };
  const resultEntrycolumns = [
    {
      title: "Test Name",
      dataIndex: "TestName",
      width: 150,
    },
    {
      title: "Observed Value",
      render: (text, record) => {
        if (!record.IsProfileTest) {
          const isInvalid = invalidInputs[record.key];

          const commonStyle = {
            width: "100%",
          };

          const commonProps = {
            name: `ObservedValue_${record.key}`,
            initialValue: record.ObservedValues,
            style: { margin: 0 },
            rules: [
              {
                required: true,
                message: "Observed Value is required",
              },
            ],
          };

          // Check for IsTemplateTest
          if (record.IsTemplateTest) {
            return (
              <span
                style={{ color: "#1890ff", cursor: "pointer" }} // Optional styling
                onClick={() => handleTemplateClick(record)} // Call your click handler
              >
                Template
              </span>
            );
          }

          if (record.IsFromTestValues) {
            const testValuesOptions = record.TestValues.split("|").map(
              (value) => ({
                value,
                label: value,
              })
            );
            return (
              <Form.Item {...commonProps}>
                <AutoComplete
                  disabled
                  onChange={(value) => handleObservedValueChange(value, record)}
                  options={testValuesOptions}
                  style={commonStyle}
                  className={isInvalid ? "invalid-input" : ""}
                />
              </Form.Item>
            );
          } else {
            return (
              <Form.Item {...commonProps}>
                <Input
                  onChange={(e) =>
                    handleObservedValueChange(e.target.value, record)
                  }
                  disabled
                  type="number"
                  style={{
                    ...commonStyle,
                    backgroundColor: isInvalid ? "#ffccc7" : "transparent",
                  }}
                />
              </Form.Item>
            );
          }
        }
        return null;
      },
      width: 120,
    },

    {
      title: "Unit",
      dataIndex: "Units",
      width: 60,
      render: (text, record) => !record.IsProfileTest && text,
    },
    {
      title: "Methods",
      dataIndex: "Methods",
      render: (text, record) => {
        if (record.IsTemplateTest) {
          return <div></div>; // return an empty div
        }
        if (record.IsProfileTest) return null;
        const filteredMethods = methods?.filter(
          (method) => method.TestID === record.TestId
        );
        return (
          <Select
            disabled
            defaultValue={record.MethodsID || "NoMethod"}
            style={{ width: 180 }}
            onChange={(value) => handleMethodChange(value, record)}
          >
            <Select.Option key="NoMethod" value="NoMethod">
              No Method
            </Select.Option>
            {filteredMethods?.map((method) => (
              <Select.Option
                key={method.TestMethodID}
                value={method.TestMethodID}
              >
                {method.MethodName}
              </Select.Option>
            ))}
          </Select>
        );
      },
      width: 180,
    },
    {
      title: "Test Reference",
      dataIndex: "TestReference",
      render: (text, record) => {
        if (record.IsTemplateTest) {
          return <div></div>; // return an empty div
        }

        if (!record.IsProfileTest) {
          if (record.IsFromTestValues) {
            return <div>{record.NormalValForTestVal}</div>;
          } else {
            return <div>{record.TestRefRangeValue}</div>;
          }
        }
        return null; // or some other default value
      },
      width: 150,
    },
  ];

  // Separate function for handling method change
  const handleMethodChange = async (methodId, record) => {
    if (methodId === "NoMethod") {
      methodId = null;
    }
    // Call your LoadAndSetReferences function
    const references = await LoadAndSetReferences(record, methodId);

    // Update the record with the new reference values
    updateRecordWithReferences(record.key, references, methodId);
    // After updating, call validateResult
    validateResult(
      record.key,
      record.ObservedValues,
      references.TestRefRangeValue,
      record
    );
  };

  // Update record function
  const updateRecordWithReferences = (key, references, methodId) => {
    setResultEntry((prevEntries) =>
      prevEntries.map((entry) =>
        entry.key === key
          ? { ...entry, ...references, MethodsID: methodId }
          : entry
      )
    );
  };
  const handleObservedValueChange = (value, record) => {
    // The 'value' parameter will always be the new value, regardless of the input type
    const newValue = value;

    // Update the result entry with the new observed value
    setResultEntry((prevEntries) =>
      prevEntries.map((entry) =>
        entry.key === record.key
          ? { ...entry, ObservedValues: newValue }
          : entry
      )
    );

    // Determine which reference value to use based on record.IsFromTestValues
    const referenceValue = record.IsFromTestValues
      ? record.NormalValForTestVal
      : record.TestRefRangeValue;

    // Validate the new value
    validateResult(record.key, newValue, referenceValue, record);
  };

  function validateResult(id, observedValue, refRange, record) {
    const isValid = IsResultWithinRefRange(observedValue, refRange, record);

    setInvalidInputs((prev) => ({
      ...prev,
      [id]: !isValid,
    }));

    // Update IsResultNormal in the record
    setResultEntry((prevEntries) =>
      prevEntries.map((entry) =>
        entry.key === id ? { ...entry, IsResultNormal: isValid } : entry
      )
    );
  }

  // Update IsResultWithinRefRange to accept the observed value and reference range
  function IsResultWithinRefRange(observedValue, refRange, record) {
    if (record.IsFromTestValues) {
      return observedValue === refRange;
    } else {
      if (refRange) {
        if (refRange.includes("-")) {
          const [Low, High] = refRange.split("-").map(parseFloat);
          return observedValue >= Low && observedValue <= High;
        } else {
          const [operator, compareVal] = refRange.split(" ");
          const compareValue = parseFloat(compareVal);

          switch (operator) {
            case "<":
              return observedValue < compareValue;
            case ">":
              return observedValue > compareValue;
            case "<=":
              return observedValue <= compareValue;
            case ">=":
              return observedValue >= compareValue;
            case "==":
              return observedValue === compareValue;
            case "!=":
              return observedValue !== compareValue;
            default:
              return true;
          }
        }
      }
      return true; // Default valid if no reference range
    }
  }

  const rowSelection = {
    type: "radio", // Change to radio for single selection
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRow(selectedRows[0]);

      if (selectedRows[0].IsResultEntryDone === true) {
        LoadAlreadyResEnteredTests(
          selectedRows[0].TestId,
          selectedRows[0].ChargeId
        );
      }
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.IsVerificationDone || !record.IsResultEntryDone,
    // }),
    renderCell: (checked, record, index, originNode) => {
      //   if (record.IsVerificationDone) {
      //     return <span>Done</span>;
      //   }
      if (!record.IsResultEntryDone) {
        return <span></span>;
      }
      if (record.IsVerificationDone) {
        setGreenRow("green-row");
      }

      return originNode;
    },
  };

  const LoadAlreadyResEnteredTests = async (testid, chargeid) => {
    try {
      const response = await customAxios.get(
        `${urlGetSelectedTestDataForResEntered}?TestId=${testid}&ChargeId=${chargeid}&PatientId=${record.PatientId}&EncounterId=${record.EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const resultEntries = response.data.data.ResultEntryList;

        // Add UUID v4 key to each result entry
        const resultEntriesWithUUID = resultEntries.map((entry) => ({
          ...entry,
          key: uuidv4(), // Generate a new UUID for each entry
        }));

        setResultEntry(resultEntriesWithUUID);
        setKey(response.data.data.ResultEntryList.length);

        // Call validateResult for each entry
        resultEntriesWithUUID.forEach((entry) => {
          // Determine which reference value to use based on entry.IsFromTestValues
          const referenceValue = entry.IsFromTestValues
            ? entry.NormalValForTestVal
            : entry.TestRefRangeValue;

          validateResult(
            entry.key,
            entry.ObservedValues,
            referenceValue,
            entry
          );
        });
      } else {
      }
    } catch (error) {}
  };

  const handleSampleCollection = () => {
    // Navigate to the desired page and pass the record object as a parameter
    navigate("/SampleCollection", { state: { record } });
  };
  const handleResultEntry = () => {
    // Navigate to the desired page and pass the record object as a parameter
    navigate("/ResultEntry", { state: { record } });
  };
  const handleReport = async () => {
    const request = {
      //  EncounterId: 1,

      ChargeId: selectedRow.ChargeId,
      PatientId: selectedRow.PatientId, // or 'excel'
      EncounterId: selectedRow.EncounterId,
    };
    const { url, blob } = await fetchReport(request);
    setReportUrl(url);
    setBlobData(blob);
    setIsModalVisible(true);
  };
  async function fetchReport(request) {
    const response = await fetch(
      "http://localhost:901/api/ReportsApi/GetLabReport",
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
            <Button type="primary">Verification</Button>
            <Button onClick={() => handleReport()}>Report</Button>
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
                  rowSelection={{
                    ...rowSelection,
                    selections: false,
                    hideSelectAll: true,
                  }}
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

            <Row justify="end" gutter={16} style={{ marginTop: "1rem" }}>
              <Col>
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={() => handleSaveVerificationStatus(1)}
                  >
                    Verify
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button
                    danger
                    onClick={() => handleSaveVerificationStatus(0)}
                  >
                    Unverify
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button onClick={() => handleReport()}>Report</Button>
                </Form.Item>
              </Col>
            </Row>
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
            <Col>
              <Button type="primary" onClick={handleTemplateSave}>
                Save
              </Button>
            </Col>
            <Col style={{ marginRight: "1rem" }}>
              <Button danger onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Modal>

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

export default Verification;
