import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Layout from "antd/es/layout/layout";
import {
  Spin,
  Tag,
  Typography,
  Select,
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Modal,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";
import {
  urlSearchUHID,
  urlGetAllVisitsForPatientId,
  urlSearchPatientRecord,
  urlGetPatientDetail,
  urlGetAllQueueProviders,
  urlGetDepartmentBasedOnPatitentType,
  urlIndexDischageSummarySearch,
  urlDischageSummary,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { SearchOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import CustomTable from "../../../components/customTable/index.jsx";
import moment from "moment";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";
import UhidSelectComponent from "../../../components/UhidSelectComponent/index.jsx";

const DischargeSummary = (details) => {
  const [Dropdown, setDropdown] = useState(details.dropdown);

  useEffect(() => {
    setDropdown(details.dropdown);
  }, [details]);

  const [purchaseOrderDropdown, setPurchaseOrderDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
  });

  const [selectedPatientType, setSelectedPatientType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [providersData, setProvidersData] = useState(null);
  const [providerLoading, setProviderLoading] = useState(false);
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [dropDownLoad, setDropDownLoading] = useState(true);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { Title } = Typography;
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [dept, setDept] = useState([]);
  const [ptype, setPtype] = useState([]);
  const [error, setError] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // const [form1] = Form.useForm();
  const [departmentLoader, setDepartmentLoader] = useState(false);
  const navigate = useNavigate();
  const SelectPatient = (record) => {
    debugger
    navigate("/CreateDischargeSummary", { state: { record } });
  }
  async function handleSelectPatient(params) {
    debugger
    SelectPatient(params)
  }
  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Pending: "#F5004F",
    "Partially Pending": "#8E3E63",
    Finalize: "#52c41a",
    Completed: "#FF9100",
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setProviderLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllQueueProviders}`);
      if (response.data != null) {
        console.log(response.data);
        setProvidersData(response.data.data.Providers);
      } else {
        setProvidersData(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProviderLoading(false);
    }
  };
  const [patientTypeValue, setpatientTypeSelectValue] = useState(null);

  const handlePatientTypeChange = async (value) => {
    setpatientTypeSelectValue(value);
    try {
      // Update the options for the second select based on the value of the first select
      if (value === 23 || value === 24 || value === 25) {
        setShowWard(true);
      } else {
        setShowWard(false);
      }
      if (value !== undefined) {
        details.form.resetFields([
          "Provider",
          "Department",
          "ServiceLocation",
          "WardCategory",
          "Ward",
          "Bed",
        ]);
        setDepartmentLoader(true);
        const response = await customAxios.get(
          `${urlGetDepartmentBasedOnPatitentType}?PatientType=${value}`
        );

        if (response.status === 200) {
          setDepartmentLoader(false);
          const dept = response.data.data.Departments;
          setDepartments(dept);
          setProviders([]);
          setServiceLocations([]);
        } else {
          // Handle other response statuses if needed
        }
      } else {
        setDepartmentLoader(false);
        setDepartments([]);
        setProviders([]);
        setServiceLocations([]);
        details.form1.resetFields();
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handleDepartmentChange = async (value) => {

    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        details.form.resetFields([
          "Provider",
          "ServiceLocation",
          "WardCategory",
          "Ward",
          "Bed",
        ]);
        setProviderLoader(true);
        const providerResponse = await customAxios.get(
          `${urlGetProviderBasedOnDepartment}?DepartmentId=${value}`
        );
        const serviceLocationResponse = await customAxios.get(
          `${urlGetServiceLocationBasedonId}?DepartmentId=${value}&patienttype=${patientTypeValue}`
        );
        if (providerResponse.status === 200) {
          setProviderLoader(false);
          const provider = providerResponse.data.data.Providers;
          setProviders(provider);
          setBeds([]);
          setWards([]);
        } else {
          console.error("Failed to fetch providers");
        }

        if (serviceLocationResponse.status === 200) {
          setProviderLoader(false);
          const serviceLoc = serviceLocationResponse.data.data.ServiceLocations;
          setServiceLocations(serviceLoc);
          setBeds([]);
          setWards([]);
        } else {
          console.error("Failed to fetch service locations");
        }
      } else {
        setProviderLoader(false);
        setProviders([]);
        setServiceLocations([]);
        setBeds([]);
        setWards([]);
        details.form.resetFields([
          "Provider",
          "ServiceLocation",
          "WardCategory",
          "Ward",
          "Bed",
        ]);
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };
  const [patientDropdown, setPatientDropdown] = useState({
    Genders: [],
    Title: [],
    CardType: [],
  });
  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "UH ID",
      dataIndex: "UhId",
      key: "UhId",
      // sorter: (a, b) => a.UhId - b.UhId,
      // sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <Tag
          color="blue"
          style={{ fontWeight: "bold", borderWidth: "5px", fontSize: "15px" }}
        >
          {record.UhId}
        </Tag>
      ),
    },
    {
      title: "Name",
      dataIndex: "PatientName",
      key: "PatientName",
    },
    {
      title: "Encounter ID",
      dataIndex: "GeneratedEncounterId",
      key: "Encounter",
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <a
          // style={{ fontWeight: "bold" }}
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Button type="link" onClick={() => handleSelectPatient(record)}>
            {record.GeneratedEncounterId}
          </Button>
        </a>
      ),
    },
    {
      title: "Patient Type",
      dataIndex: "PatientTypeName",
      key: "Patient Type",
      sorter: (a, b) => a.SupplierName.localeCompare(b.SupplierName),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        let backgroundColor = "";
        let borderColor = "";

        // Define named colors for each patient type
        switch (text) {
          case "Day Care":
            backgroundColor = "lightcyan"; // Background color
            borderColor = "darkcyan"; // Border color
            break;
          case "Emergency":
            backgroundColor = "lightcoral"; // Background color
            borderColor = "darkred"; // Border color
            break;
          case "InPatient":
            backgroundColor = "lavender"; // Background color
            borderColor = "purple"; // Border color
            break;
          default:
            backgroundColor = "lightgrey"; // Default background
            borderColor = "grey"; // Default border
            break;
        }

        return (
          <Tag
            style={{
              backgroundColor: backgroundColor,
              color: borderColor,
              border: `1px solid ${borderColor}`,
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Admitted  Date",
      dataIndex: "FromDateString",
      key: "PoDateString",
      sorter: (a, b) => new Date(a.PoDateString) - new Date(b.PoDateString),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Discharge Date",
      dataIndex: "ToDateString",
      key: "PoDateString",
      sorter: (a, b) => new Date(a.PoDateString) - new Date(b.PoDateString),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Admtted Under",
      dataIndex: "ProviderName",
      key: "ProviderId",
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",
      key: "Department",
      sorter: (a, b) => a.Department.localeCompare(b.Department),
      sortDirections: ["descend", "ascend"],
    },

    {
      title: "Admission Status",
      dataIndex: "PatientStatus",
      key: "Admission Status",
      // sorter: (a, b) => a.PurchaseOrderId.localeCompare(b.PurchaseOrderId),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Report Status",
      dataIndex: "KinName",
      key: "Report Status",
      // sorter: (a, b) => a.PurchaseOrderId.localeCompare(b.PurchaseOrderId),
      sortDirections: ["descend", "ascend"],
    },
    // {
    //   render: (_, row) => {
    //     // Check if KinName is 'done' and only then display the Report button
    //     return row.KinName === "Done" ? (
    //       <Button type="link">Report</Button>
    //     ) : null; // Return null if KinName is not 'done', so no button is shown
    //   },
    // },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      // render: (text, record, index) => <Button type="link" onClick={(value) => handleReport(value, record)}>Report</Button>,
      render: (_, row) => {
        return row.KinName === 'Done' ? (
          <Button type="link" onClick={(value) => handleReport(value, row)}>Report</Button>
        ) : null;
      }
    },
  ];

  const handleReport = async (value, record) => {
    debugger
    setLoading(true)
    try {
      const request = {
        PatientId: record.PatientId,
        EncounterId: record.EncounterId,
        FileType: "pdf", // or 'excel'
      };
      const { url, blob } = await fetchReport(request);
      setReportUrl(url);
      // setBlobData(blob);
      setIsModalVisible(true);
    } catch (error) {
      setLoading(false)
      setError(error.message);
    }
  };

  async function fetchReport(request) {
    const response = await fetch(
      "https://192.168.29.254:808/api/ReportsApi/GetDischargeSummaryRpt",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );
    console.log("respo", response);

    if (!response.ok) {
      setLoading(false)
      throw new Error("Failed to fetch report");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setLoading(false)
    return { url, blob };
  }

  useEffect(() => {

    const fetchDataHeader = async () => {
      try {
        const response = await customAxios.get(urlDischageSummary)
        if (response.status === 200 && response.data.data != null) {
          const Dept = response.data.data.fDepartment;
          setPtype(response.data.data.PatientIdentificationType);
          setDept(Dept);
        }
      } catch (error) { }
    };
    fetchDataHeader();
  }, []);


  useEffect(() => {
    setLoading(true);
    customAxios.get(urlGetPatientDetail).then((response) => {
      const apiData = response.data.data;
      setPatientDropdown(apiData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedPatientType) {
        try {
          const response = await customAxios.get(
            `${urlGetDepartmentBasedOnPatitentType}?PatientType=${selectedPatientType}`
          );
          if (response.status === 200) {
            const dept = response.data.data.Department;
            setDept(dept);
          } else {
            console.error("Failed to fetch departments");
          }
        } catch (error) {
          console.error("Error fetching departments:", error);
        }
      } else {
        // Reset the department dropdown if no patient type is selected
        setDept([]);
        // setSelectedDepartment("");
      }
    };

    fetchData();
  }, [selectedPatientType, setSelectedDepartment, setDept]);
  // const getDischargeSummary = () => {
  //   try {
  //     setLoading(true);
  //     // Prepare the parameters based on the inputs you provided for GetDischargeSummaryAsync
  //     const { UHID, Name, ProviderId, DepartmentId, FromDate, ToDate, PatientType, Reportstatus, Admissionstatus, DischargeDate, patientId, userContext } = postData1;

  //     customAxios
  //       .get(
  //         `${urlIndexDischargeSummarySearch}?UHID=${UHID}&Name=${Name}&ProviderId=${ProviderId}&DepartmentId=${DepartmentId}&FromDate=${FromDate}&ToDate=${ToDate}&PatientType=${PatientType}&Reportstatus=${Reportstatus}&Admissionstatus=${Admissionstatus}&DischargeDate=${DischargeDate}&patientId=${PatientId}&userContext=${JSON.stringify(userContext)}`,
  //         {
  //           params: postData1, // pass any necessary params as the request payload
  //         }
  //       )
  //       .then((response) => {
  //         setLoading(false);
  //         // Update the state with the discharge summary details
  //         setDischargeSummaryDetails(response.data.data.DischargeSummary);
  //         console.log(response.data.data.DischargeSummary);
  //       });
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Error:", error);
  //   }
  // };

  const handleUhidClick = async (record) => {
    setSelectedUhId(record?.UhId);
    debugger
    form.setFieldsValue({
      Uhid: record?.UhId,
      PatientName: record?.PatientName,
      patientId: record?.PatientId,
    });

    setIsEncounterDisabled(false);
    getencounters(record?.PatientId);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setSearchContainer(false);
  };
  const handleSearchAutoCompleteChange = debounce(async (value) => {
    try {
      setAutoCompleteLoader(true); // Set loading state to true

      if (!value.trim()) {
        setAutoCompleteLoader(false); // Set loading state to false
        return;
      }

      const response = await customAxios.get(`${urlSearchUHID}?Uhid=${value}`);
      const responseData = response.data.data || [];
      setOptions(responseData);

      // Ensure responseData is an array and has the expected structure
      if (
        Array.isArray(responseData) &&
        responseData.length > 0 &&
        responseData[0].UhId !== undefined
      ) {
        setAutoCompleteLoader(false);
      }
    } catch (error) {
      setAutoCompleteLoader(false);
      console.error("Error fetching suggestions:", error);
      // Set options to an empty array in case of an error
    }
  }, 300);

  const handleSearchSelect = (value, option) => {
    setSelectedSearchUhId(option.value);
  };

  const disabledDate = (current) => {
    // Disable dates that are in the future
    return current && current > new Date();
  };

  const handleSelectUHID = (value, option) => {
    setSelectedUhId(value);
    debugger
    if (option) {
      const selectedPatientData = option;
      console.log("Selected Patient Data:", selectedPatientData);
    }
    form.setFieldsValue({
      Uhid: option?.data?.UhId,
      PatientName: option?.data?.PatientFirstName + " " + option?.data?.PatientLastName,
      patientId: option?.data?.PatientId,
    });

    // setIsEncounterDisabled(false);
    getencounters(option?.data?.PatientId);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setSearchContainer(false);
  };

  const handleOnSubmit = (values) => {
    const url = `/ReprintApiCall`; //reporting api call
    navigate(url, {
      state: {
        patientId: values.patientId,
        encounterId: values.Encounter,
      },
    });
  };

  const onFinish = async (values) => {
    debugger
    setLoading(true);
    debugger
    try {
      const postData1 = {
        UHID: values.Uhid ? values.Uhid : null,
        Name: values.Name ? values.Name : null,
        ProviderId: values.ProviderId ? values.ProviderId : 0,
        DepartmentId: values.Department ? values.Department : 0,
        FromDate: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : null,
        ToDate: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : null,
        PatientType: values.PatientType ? values.PatientType : 0,
        Reportstatus: values.ReportStatus ? values.ReportStatus : "",
        Admissionstatus: values.AdmissionStatus ? values.AdmissionStatus : "",
        patientId: form.getFieldValue("patientId") ? form.getFieldValue("patientId") : 0,
        DischargeToDate: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
      };
      debugger

      // Construct the query string with only the parameters that have values
      const queryParams = {};

      if (postData1.UHID) queryParams.UHID = postData1.UHID;
      if (postData1.Name) queryParams.Name = postData1.Name;
      if (postData1.ProviderId) queryParams.ProviderId = postData1.ProviderId;
      if (postData1.DepartmentId) queryParams.DepartmentId = postData1.DepartmentId;
      if (postData1.FromDate) queryParams.FromDate = postData1.FromDate;
      if (postData1.ToDate) queryParams.ToDate = postData1.ToDate;
      if (postData1.PatientType) queryParams.PatientType = postData1.PatientType;
      if (postData1.Reportstatus) queryParams.Reportstatus = postData1.Reportstatus;
      if (postData1.Admissionstatus) queryParams.Admissionstatus = postData1.Admissionstatus;
      if (postData1.patientId) queryParams.patientId = postData1.patientId;
      if (postData1.DischargeToDate) queryParams.DischargeToDate = postData1.DischargeToDate;

      // Make API request with the constructed queryParams
      customAxios
        .get(
          `${urlIndexDischageSummarySearch}`, {
          params: queryParams,
          headers: {
            "Content-Type": "application/json", // Replace with the appropriate content type if needed
          },
        }
        )
        .then((response) => {
          debugger
          const newColumnData = response.data.data.map(
            (obj, index) => {
              return { ...obj, key: index + 1 };
            }
          );
          setFilteredData(newColumnData);
          // setCurrentPage1(1);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      // Handle any errors here
      console.error("Error:", error);
    }
  };



  const onReset = () => {
    form.resetFields();
  };

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title={"Discharge Summary"} button={false} />
      <Form
        form={form}
        name="control-hooks"
        layout="vertical"
        variant="outlined"
        style={{
          margin: "1rem",
        }}
        initialValues={{
          FromDate: dayjs().subtract(1, "day"),
          ToDate: dayjs(),
          DocumentType: 0,
          Supplier: 0,
          ProcurementStore: 0,
          DocumentStatus: "",
        }}
        onFinish={onFinish}
      >
        {/*   <Form
                    form={form}
                    onFinish={handleUhidClick}
                    layout="vertical"
                  ></Form> */}
        <Row gutter={16}>
          <ColWithSixSpan>
            <Form.Item label="UHID" name="Uhid">
              <UhidSelectComponent
                selectedUhId={selectedUhId}
                handleSelectUHID={handleSelectUHID}
              />
            </Form.Item>
          </ColWithSixSpan>
          {/* <Form.Item label="Patient Name" name="patientname" hidden>
            <Input />
          </Form.Item> */}

          <ColWithSixSpan>
            <Form.Item label="Name" name="PatientName">
              <Input />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              name="ProviderId"
              label="Admitting Dr"
              rules={[
                {
                  required: false,
                  message: "DR is Required.",
                },
              ]}
            >
              <Select
                loading={providerLoading}
                showSearch
                placeholder="Select the provider"
                style={{ width: "100%" }}
                onChange={(value) => console.log(value)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {providersData?.map((response) => (
                  <Select.Option
                    key={response.ProviderId}
                    value={response.ProviderId}
                  >
                    {response.ProviderName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              name="Department"
              label="Department"
              rules={[
                {
                  required: false,
                  message: "Please select Department",
                },
              ]}
            >
              {details.isCancelOrEditVisit ? (
                <Select disabled={details.isCancelOrEditVisit} allowClear>
                  {(dept || []).map((option) => (
                    <Select.Option
                      key={option.DepartmentId}
                      value={option.DepartmentId}
                    >
                      {option.DepartmentName}
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <Select
                  onChange={handleDepartmentChange}
                  loading={departmentLoader}
                  allowClear
                >
                  {dept.map((option) => (
                    <Select.Option
                      key={option.DepartmentId}
                      value={option.DepartmentId}
                    >
                      {option.DepartmentName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </ColWithSixSpan>

          <ColWithSixSpan>
            <Form.Item
              name="FromDate"
              label="Discharge From Date"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <DatePicker
                value={fromDate}
                onChange={(date) => setFromDate(date)}
                disabledDate={(current) => current > moment()}
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
                placeholder="DD-MM-YYYY"
                allowClear
              />
              {/* <DatePicker
                style={{ width: "100%" }}
                format={"DD-MM-YYYY"}
                disabledDate={disabledDate}
                placeholder="DD-MM-YYYY"
                allowClear
              /> */}
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              name="ToDate"
              label="Discharge To Date"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <DatePicker
                value={toDate}
                onChange={(date) => setToDate(date)}
                disabledDate={(current) => current < fromDate} // disable dates before fromDate
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
                placeholder="DD-MM-YYYY"
                allowClear
              />
              {/* <DatePicker
                style={{ width: "100%" }}
                format={"DD-MM-YYYY"}
                disabledDate={disabledDate}
                placeholder="DD-MM-YYYY"
                allowClear
              /> */}
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              name="PatientType"
              label="Patient Type"
              rules={[
                {
                  required: false,
                  message: "Please select Patient Type",
                },
              ]}
            >
              {details.isCancelOrEditVisit ? (
                <Select
                  onChange={handlePatientTypeChange}
                  disabled={details.isCancelOrEditVisit}
                  allowClear
                >
                  {Dropdown
                    ? ptype.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))
                    : null}
                </Select>
              ) : (
                <Select onChange={handlePatientTypeChange} allowClear>
                  {ptype.map((option) => (
                    <Select.Option
                      key={option.LookupID}
                      value={option.LookupID}
                    >
                      {option.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              name="ReportStatus"
              label="Report Status"
              rules={[{ required: false }]}
            >
              <Select loading={dropDownLoad}>
                <Select.Option key={0} value={"2"}>
                  All
                </Select.Option>
                <Select.Option key={1} value={"0"}>
                  Done
                </Select.Option>
                <Select.Option key={1} value={"1"}>
                  Not Done
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          {/* <ColWithSixSpan>
            <Form.Item label="PO Number" name="ProviderId">
              <Input allowClear style={{ width: "100%" }} />
            </Form.Item>
          </ColWithSixSpan> */}
          <ColWithSixSpan>
            <Form.Item label="Admission Status" name="AdmissionStatus">
              <Select>
                {/* <Select.Option key="" value="">
                  All
                </Select.Option> */}
                <Select.Option key="2" value="All">
                  All
                </Select.Option>
                <Select.Option key="0" value="Discharged">
                  Discharged
                </Select.Option>
                <Select.Option key="1" value="Discharge Initiated">
                  Discharge Initiated
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
        </Row>
        <Row justify="end" gutter={16}>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button danger onClick={onReset}>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Spin spinning={loading}>
        <CustomTable
          dataSource={filteredData}
          columns={columns}
          actionColumn={false}
          isFilter={true}
          scroll={{ x: 1000 }}
        />
      </Spin>
      <div>
        {error && <div>Error: {error}</div>}

        <Modal
          title="Report"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={"60rem"} // You can adjust the width as needed
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
    </Layout>
  );
};

export default DischargeSummary;
