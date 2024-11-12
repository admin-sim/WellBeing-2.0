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
  Divider,
} from "antd";

import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { useState, useEffect } from "react";
//import ".//style.css";

import {
  urlGetPatientHeaderDetails,
  urlGetSelectedTestDataForResEntry,
  urlResultEntryIndex,
  urlLoadTestReferenceForResEntry,
  urlSaveTestsResultEntry,
  urlGetSelectedTestDataForResEntered,
  urlGetTemplateDataByTemplateId,
  urlLoadSampleCollectionGrid,
} from "../../../../../endpoints.js";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import { useLocation } from "react-router-dom";
import PatientHeader from "../../../../components/PatientHeader/index.jsx";
import CkEditor from "../../../../components/CKEditor/index.jsx";
import { useNavigate } from "react-router";
import PageHeader from "../../../../components/PageHeader/index.jsx";
const ResultEntry = () => {
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
  const [key, setKey] = useState(1);
  const [editorKey, setEditorKey] = useState(0);
  const [currentRecord, setCurrentRecord] = useState(null);

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

  const onFinish = async (values) => {
    console.log("resultentry", resultEntry);

    if (selectedRow.length === 0) {
      notification.warning({
        message: "Warning",
        description: "Please select at least one test.",
      });
      return;
    }

    // Create a new array with updated values
    const updatedResultEntry = resultEntry.map((item) => ({
      ...item,
      PatientId: selectedRow.PatientId, // Update PatientId
      EncounterId: selectedRow.EncounterId, // Update EncounterId
      LabStatusId: selectedRow.LabStatusId, // Update LabStatusId
    }));

    try {
      const response = await customAxios.post(
        urlSaveTestsResultEntry, // Adjust the URL to match your API endpoint
        updatedResultEntry,
        {
          params: { PatientAge: patientData.Age },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data.Status !== "") {
        const message1 = "ResultEntry Collected Successfully";
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
    setCurrentRecord(record);
    let templateData = "";
    if (record.ResId > 0 || record.ObservedValues) {
      templateData = record.ObservedValues;
    } else {
      try {
        const response = await customAxios.get(
          `${urlGetTemplateDataByTemplateId}?Tid=${record.TemplateId}`
        );
        if (response.status === 200) {
          templateData = response.data.data.TempData;
        }
      } catch (error) {
        console.error("Error fetching template data:", error);
        notification.error({
          message: "Error",
          description: "Failed to load template data. Please try again.",
        });
        return;
      }
    }
    setTemplateEditorData(templateData);
    setEditorKey((prevKey) => prevKey + 1);
    setCkModalOpen(true);
  };

  const handleCancel = () => {
    setTemplateEditorData("");
    setCkModalOpen(false);
    setEditorKey((prevKey) => prevKey + 1);
  };

  const handleTemplateSave = () => {
    if (currentRecord) {
      const updatedRecord = {
        ...currentRecord,
        ObservedValues: templateEditorData,
       // ResId: currentRecord.ResId > 0 ? currentRecord.ResId : 1, // Assign a non-zero value if it's a new entry
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

    // Update the services state to reflect the changes
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.key === updatedRecord.key
          ? {
              ...service,
              ObservedValues: updatedRecord.ObservedValues,
              ResId: updatedRecord.ResId,
            }
          : service
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
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRow: ",
        selectedRows[0]
      );
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRow(selectedRows[0]);

      if (selectedRows[0].IsResultEntryDone === true) {
        LoadAlreadyResEnteredTests(
          selectedRows[0].TestId,
          selectedRows[0].ChargeId
        );
      } else {
        LoadResEntryGridBasedOnTestId(
          selectedRows[0].TestId,
          selectedRows[0].ChargeId,
          selectedRows[0].LabStatusId
        );
      }
    },
    getCheckboxProps: (record) => ({
      disabled: record.IsVerificationDone || !record.IsSampleCollected,
    }),
    renderCell: (checked, record, index, originNode) => {
      if (record.IsVerificationDone) {
        return <span>Done</span>;
      }
      if (!record.IsSampleCollected) {
        return <span></span>;
      }
      if (record.IsResultEntryDone) {
        setGreenRow("green-row");
      }

      return originNode;
    },
  };

  const LoadResEntryGridBasedOnTestId = async (
    
    testid,
    chargeid,
    labstatusid
  ) => {
    debugger;
    try {
      const response = await customAxios.get(
        `${urlGetSelectedTestDataForResEntry}?TestId=${testid}&ChargeId=${chargeid}&ChargeId=${labstatusid}&GenderId=${patientData.Gender}`
      );
      if (response.status === 200 && response.data != null) {
        const resultEntries = response.data.data.ResultEntryList;
        setKey(response.data.data.ResultEntryList.length);
        const methodid = null;
        //setResultEntry(resultEntries);
        const updatedResultEntries = await Promise.all(
          resultEntries.map(async (entry) => {
            const references = await LoadAndSetReferences(entry, methodid);
            return {
              key: uuidv4(), // Assign a unique key using uuidv4
              ...entry,
              ...references,
            };
          })
        );

        setResultEntry(updatedResultEntries);
        // setMethods(response.data.data.ListTestMethodModel);
      } else {
      }
    } catch (error) {}
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
    navigate("/SampleCollection", { state: { record } });
  };

  const handleVerification = () => {
    navigate("/Verification", { state: { record } });
  };

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
        <PageHeader title={"Result Entry"} button={false} />
        <div style={{ padding: "0.5 1rem" }}>
          <Space style={{ margin: "1rem 1rem 0 1rem" }}>
            <Button onClick={() => handleSampleCollection()}>
              Sample Collection
            </Button>
            <Button type="primary">Result Entry</Button>
            <Button onClick={() => handleVerification()}>Verification</Button>
            <Button>Report</Button>
          </Space>
          <Divider />
          <div style={{ margin: "0 1rem 1rem 1rem" }}>
            <PatientHeader patient={patientData} />
          </div>
          <Form
            layout="vertical"
            onFinish={onFinish}
            form={form}
            style={{ padding: " 0 0.5rem" }}
          >
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
                    record.IsResultEntryDone ? "green-row" : ""
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

            <Row justify="end">
              <Col style={{ marginRight: "10px" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {selectedRow && selectedRow.IsResultEntryDone
                      ? "Update"
                      : "Save"}
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" onClick={handleReset}>
                    Clear
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div>
        <Modal
          width={"60rem"}
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
          {ckModalOpen && (
            <CkEditor
              key={editorKey}
              initialData={templateEditorData}
              printButton={true}
              onChange={(event, editor) => {
                const data = editor.getData();
                setTemplateEditorData(data);
              }}
            />
          )}
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
      </div>
    </Layout>
  );
};

export default ResultEntry;
