import customAxios from "../../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { Col, ConfigProvider, Row, Select } from "antd";
import Input from "antd/es/input";
import Form from "antd/es/form";
import { Card, Modal, Table, message } from "antd";
import { AutoComplete } from "antd";
import { DatePicker, Spin } from "antd";
import Button from "antd/es/button";
import {
  urlGetPatientDetail,
  urlSearchPatientRecord,
  urlSearchUHID,
  urlAddNewVisit1,
  urlGetEncounterDetails,
  urlGetPatientHeaderDetails,
  urlGetProviderBasedOnDept,
  urlGetScheduledProviderAppointments,
  urlSearchAppoinmtmentRecord,
} from "../../../../endpoints.js";

import debounce from "lodash/debounce";

import "../style.css";

import PageHeader from "../../../components/PageHeader/index.jsx";

import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";
import CustomTable from "../../../components/customTable/index.jsx";
import dayjs from "dayjs";
import VisitModal from "../NewVisit/visitModal.jsx";

const AppointmentSearch = () => {
  const [patientDropdown, setPatientDropdown] = useState({
    Genders: [],
    Title: [],
    CardType: [],
  });
  const [visitsDropdown, setVisitDropdown] = useState({});

  const [loading, setLoading] = useState(false);
  const [AutoCompleteLoader, setAutomaticLoader] = useState(false);
  const [ModalLoader, setModalLoader] = useState(false);

  const [options, setOptions] = useState([]);

  const [patientsearchDetails, setPatientSearchDetails] = useState([]);
  const [patientHeaderDetails, setPatientHeaderDetails] = useState({});
  const [encounterId, setEncounterId] = useState();
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [serviceLocations, setServiceLocations] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [selecteddob, setdob] = useState(undefined);
  const [selectedRegFrom, setRegFrom] = useState(undefined);
  const [selectedRegTo, setRegTo] = useState(undefined);

  const [isVisitModalVisible, setIsVisitModalVisible] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [IsVisitCreated, setIsVisitCreated] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showWard, setShowWard] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null); 
  const [departmentLoading, setDepartmentLoading] = useState(true);
  const [providerLoading, setProviderLoading] = useState(false);
  const [providersData, setProvidersData] = useState([]);
  const [submitLoader, setIsSubmitLoader] = useState(false);
  const [departmentsData, setDepartmentsData] = useState([]);



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetScheduledProviderAppointments}`
      );

      if (response.data != null) {
        setProvidersData(response.data.data.Provider);
        setDepartmentsData(response.data.data.Department);
      } else {
        setProvidersData(null);
      }
      setDepartmentLoading(false);
    } catch (error) {
      setDepartmentLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    // Call the method on page load
    const initialSearchValues = {
      Uhid: "",
      AppointmentRefeNum: "",
      Departmentname: "",
      ProviderName: "",
      MobileNumber: "",
      AppointmentDate: dayjs(), // Set to today's date in the desired format
    };
    handleOnSearch(initialSearchValues);
  }, []);

  const handleAutoCompleteChange = debounce(async (value) => {
    try {
      setAutomaticLoader(true); // Set loading state to true

      if (!value.trim()) {
        setOptions([]); // Set options to an empty array
        setAutomaticLoader(false); // Set loading state to false
        return;
      }

      const response = await customAxios.get(`${urlSearchUHID}?Uhid=${value}`);
      const responseData = response.data.data || [];

      // Ensure responseData is an array and has the expected structure
      if (
        Array.isArray(responseData) &&
        responseData.length > 0 &&
        responseData[0].UhId !== undefined
      ) {
        setAutomaticLoader(false);
        const newOptions = responseData.map((option) => ({
          value: option.UhId,
          label: option.UhId,
          key: option.PatientId,
        }));
        setOptions(newOptions);
      } else {
        setOptions([]); // Set options to an empty array if the structure is not as expected
      }
    } catch (error) {
      setAutomaticLoader(false);
      console.error("Error fetching suggestions:", error);
      setOptions([]); // Set options to an empty array in case of an error
    }
  }, 300); // Debounce time in milliseconds (adjust as needed)

  const handleSelect = (value, option) => {
    setSelectedUhId(option.value);
  };

  const handleDepartmentChange = async (value) => {
    setProviderLoading(true);
    form.resetFields(["Provider"]);

    try {
      const response = await customAxios.get(
        `${urlGetProviderBasedOnDept}?Id=${value}`
      );

      setProvidersData(response.data.data);

      console.log("Deaprtment", response?.data.data);
      if (response.data != null) {
        console.log("check the value for response", response.data);
      } else {
        console.log("check the value for response", response.data);
      }
      setProviderLoading(false);
    } catch (error) {
      console.error(error);
      setProviderLoading(false);
    }
  };

  const handleProviderChange = () => {};

  const handleUhidClick = (record) => {
    if (record.PatientStatus == true) {

      handlevisitmodal(record);
    } else {
      alert("make edit");
      handleEditRegistrationsDetails(record);
    }
  };

  const handlevisitmodal = async (record) => {
    debugger;
    try {
      setSelectedRecord(record);
      setIsVisitCreated(false);
      setModalLoader(true);

      // Fetch encounter details
      const [response, response1] = await Promise.all([
        customAxios.get(
          `${urlGetEncounterDetails}?PatientId=${record.PatientId}&PatientType=0&AppointmentId=0`
        ),
        customAxios.get(
          `${urlGetPatientHeaderDetails}?PatientId=${record.PatientId}`
        ),
      ]);

      // Check if responses are valid before setting data
      if (response.data && response1.data) {
        setPatientHeaderDetails(response1.data.data.EncounterModel);
        setVisitDropdown(response.data.data);
        //  setEncounterTypeId(response.data.data.EncounterTypeId);

        // Set the form field values
        form.setFieldsValue({
          EncounterType: response.data.data.EncounterTypeId,
        });

        setIsVisitModalVisible(true); // Open modal only after data is set
      } else {
        message.error("Failed to fetch visit details. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching visit modal data:", error);
      message.error(
        "An error occurred while loading visit details. Please try again."
      );
    } finally {
      setModalLoader(false); // Hide loader in both success and error cases
    }
  };

 const handleOk = async () => {
    debugger;

    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      setIsVisitCreated(true);
      setIsSubmitLoader(true);
      const postData = {
        PatientId: selectedRecord.PatientId,
        PatientType: values.PatientType,
        FacilityDepartmentId: values.Department,
        FacilityDepartmentServiceLocationId: values.ServiceLocation,
        ProviderId: values.Provider,
        EncounterTypeId: values.EncounterType,
        EncounterReasonId: values.EncounterReason,
        KinTitle: values.KinTitle,
        KinName: values.KinName,
        KinAddress: values.KinAddress,
        KinContactNo: values.KinContactNo,
        ReferredBy: values.referredBy,
        AttendingProviderId: values.admittedUnder,
        WardCategoryId: values.WardCategory,
        WardId: values.Ward,
        BedId: values.Bed,
      };

      // Send a POST request to the server
      const response = await customAxios.post(urlAddNewVisit1, postData, {
        headers: {
          "Content-Type": "application/json",
          // Add any other required headers here
        },
      });

      if (response.data != null) {
        setIsSubmitLoader(false);
        if (response.data.EncounterResult != null) {
          messageApi.warning({
            type: "warning",
            content: response.data.EncounterResult
          });
        } else {
          const genVisitId = response.data.GeneratedEncounterId;
          setEncounterId(genVisitId);
          messageApi.open({
            type: "success",
            content: `Successfully  visit created for patient.`,
          });
          navigateToAddPatient();
        }
      } else {
        setIsSubmitLoader(false);
        messageApi.open({
          type: "error",
          content: `Visit Creation Unsuccessful`,
        });
        form.resetFields();
      }

      // setIsModalVisible(false);
   
     // setServiceLocations([]);
      // form1.resetFields();

      // Additional logic after the asynchronous operation
    } catch (error) {
      setIsSubmitLoader(false);
      if (error.errorFields) {
        // Highlight the fields with errors
        form.scrollToField(error.errorFields[0].name, {
          behavior: "smooth",
        });
        message.error("Please fill all required fields.");
      } else {
        console.error("Failed to send data to server: ", error);
        message.error(`Error creating visit for patient: ${error.message}.`);
        form.resetFields();
      }
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleBackToList = () => {
    const url = `/patient`;
    // Navigate to the new URL
    navigate(url);
  };

  const navigateToAddPatient = () => {
    const url = `/patient`;
    // Navigate to the new URL
    navigate(url);
  };

  const handleEditRegistrationsDetails = (record) => {
    debugger;

    const url = `/patient/PatientEdit`;

    // Navigate to the new URL
    navigate(url, {
      state: {
        selectedRow: record,
      },
    });
  };

  const handleVisitModalCancel = () => {
    debugger;
    setIsVisitModalVisible(false);
    setIsVisitCreated(false);
    setServiceLocations([]);
    setPatientHeaderDetails([]);
    setEncounterId(null);
    setShowWard(false);
    form.resetFields();
  };

  const handleOnSearch = (values) => {
    debugger;

    // Handle form submission logic here
    console.log("Form submitted with values:", values);

    try {
      setLoading(true);

      // Assuming postData1 is an object with your input values
      const postData1 = {
        Uhid: values.Uhid ? values.Uhid : "", // Set to empty string when left blank
        AppointmentRefeNum: values.AppointmentRefeNum
          ? values.AppointmentRefeNum
          : "",
        Departmentname: values.Departmentname ? values.Departmentname : "",
        ProviderName: values.ProviderName ? values.ProviderName : "",
        MobileNumber: values.MobileNumber ? values.MobileNumber : "",
        AppointmentDate: values.AppointmentDate
          ? values.AppointmentDate.format("DD-MM-YYYY")
          : "",
      };
      customAxios
        .get(
          `${urlSearchAppoinmtmentRecord}?Uhid=${postData1.Uhid}&AppointmentRefeNum=${postData1.AppointmentRefeNum}&Departmentname=${postData1.Departmentname}&ProviderName=${postData1.ProviderName}&AppointmentDate=${postData1.AppointmentDate}&MobileNumber=${postData1.MobileNumber}`,
          null,
          {
            params: postData1,
          }
        )
        .then((response) => {
          setLoading(false);
          console.log("Response:", response.data);
          //resetForm();
          setPatientSearchDetails(
            response.data.data.ScheduleProviderAppointments
          );
          setOptions([]);
        });
    } catch (error) {
      setLoading(false);
      // Handle any errors here
      console.error("Error:", error);
    }
    // Reset the form fields
  };

  const AdvancedPatientSearchColumns = [
    {
      title: "Appointment Reference No",
      dataIndex: "AppointmentReferenceNo",
    },
    {
      title: "UHID",
      dataIndex: "PatientUHID",

      sorter: (a, b) => {
        const numA = parseInt(a.PatientUHID.split("/")[1], 10);
        const numB = parseInt(b.PatientUHID.split("/")[1], 10);
        return numA - numB;
      },
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleUhidClick(record);
          }}
        >
          {record.PatientUHID}
        </a>
      ),
    },

    {
      title: "Name",
      dataIndex: "PatientName",
    },
    {
      title: "Provider",
      dataIndex: "ProviderName",
    },
    {
      title: "Department",
      dataIndex: "FacilityDepartmentName",
    },
    {
      title: "AppointmentDate",
      dataIndex: "AppointmentDatestring",
    },
  ];

  return (
    <div>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          // minHeight: "min-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader
          title="Appointment Search"
          buttonLabel="Back to list"
          buttonIcon={<LeftOutlined />}
          onButtonClick={handleBackToList}
        />
        <Form
          layout="vertical"
          onFinish={handleOnSearch}
          variant="outlined"
          style={{ margin: "1rem" }}
          initialValues={{ AppointmentDate: dayjs() }}
          form={form}
        >
          <Row gutter={16}>
            <ColWithSixSpan>
              <Form.Item label="UHID" name="Uhid">
                <AutoComplete
                  id="uhid-autocomplete"
                  options={options}
                  //loading={AutoCompleteLoader}
                  onSearch={handleAutoCompleteChange}
                  onSelect={handleSelect}
                  value={selectedUhId}
                  filterOption={(inputValue, option) =>
                    option.value
                      .toUpperCase()
                      .includes(inputValue.toUpperCase())
                  }
                  allowClear
                />
              </Form.Item>
              {AutoCompleteLoader && (
                <Spin
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                  }}
                />
              )}
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Departmentname" label="Department">
                <Select
                  loading={departmentLoading}
                  onChange={handleDepartmentChange}
                  showSearch
                  placeholder="Select the department"
                  style={{ width: "100%" }}
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
                  {departmentsData?.map((response) => (
                    <Select.Option
                      key={response.DepartmentId}
                      value={response.DepartmentId}
                    >
                      {response.DepartmentName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="ProviderName" label="Provider">
                <Select
                  loading={providerLoading}
                  allowClear
                  showSearch
                  placeholder="Select the provider"
                  style={{ width: "100%" }}
                  onChange={handleProviderChange}
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
                label="Appointment Reference No"
                name="AppointmentRefeNum"
              >
                <Input allowClear />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item label="AppointmentDate" name="AppointmentDate">
                <DatePicker
                  style={{ width: "100%" }}
                  format={"DD-MM-YYYY"}
                  placeholder="DD-MM-YYYY"
                  allowClear
                />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                label="Mobile Number"
                name="MobileNumber"
                rules={[
                  {
                    pattern: new RegExp(/^\d{10}$/),
                    message: "Invalid mobile number!",
                  },
                ]}
              >
                <Input allowClear />
              </Form.Item>
            </ColWithSixSpan>
          </Row>
          <Row justify="end">
            <Col style={{ marginRight: "10px" }}>
              <Form.Item disabled={loading}>
                <Button type="primary" htmlType="submit" disabled={loading}>
                  {/* Search */}
                  {loading ? "Searching..." : "Search"}
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button danger onClick={handleReset}>
                  Clear
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <ConfigProvider
            theme={{
              token: {
                zIndexPopupBase: 3000,
              },
            }}
          >
            {contextHolder}

            {isVisitModalVisible &&
              visitsDropdown.PatientType !== undefined && (
                <VisitModal
                  open={isVisitModalVisible}
                  handleOk={handleOk}
                  ModalLoader={ModalLoader}
                  close={handleVisitModalCancel}
                  IsVisitCreated={IsVisitCreated}
                  patientHeaderDetails={patientHeaderDetails}
                  encounterId={encounterId}
                  form1={form}
                  dropdown={visitsDropdown}
                  showWard={showWard}
                  isCancelOrEditVisit={false}
                  isCancelEncounter={false}
                />
              )}
          </ConfigProvider>
          <Spin spinning={loading}>
            <Row gutter={16}>
              <Col span={24} style={{ padding: "0" }}>
                <CustomTable
                  dataSource={patientsearchDetails}
                  columns={AdvancedPatientSearchColumns}
                  actionColumn={false}
                  isFilter={true}
                />
              </Col>
            </Row>
          </Spin>
        </Form>
      </div>
    </div>
  );
};
export default AppointmentSearch;
