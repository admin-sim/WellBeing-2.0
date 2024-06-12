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
  urlGetDepartmentBasedOnPatitentType,
  urlGetProviderBasedOnDepartment,
  urlGetServiceLocationBasedonId,
  urlSearchUHID,
  urlAddNewVisit,
} from "../../../../endpoints.js";

import { EnvironmentOutlined } from "@ant-design/icons";
import "../style.css";
import Title from "antd/es/typography/Title.js";

const containsDropdown = [
  { id: "1", name: "Starts With" },
  { id: "2", name: "Ends With" },
  { id: "3", name: "Sounds Like" },
  { id: "4", name: "Anywhere" },
];

const NewVisit = () => {
  const [patientDropdown, setPatientDropdown] = useState({
    Genders: [],
    PatientType: [],
    Title: [],
    EncounterType: [],
    EncounterReason: [],
    ReferredBy: [],
    CardType: [],
  });
  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState([]);

  const [patientsearchDetails, setPatientSearchDetails] = useState([]);
  const [encounterId, setEncounterId] = useState(null);
  const [selectedUhId, setSelectedUhId] = useState(null);

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [selecteddob, setdob] = useState(undefined);
  const [selectedRegFrom, setRegFrom] = useState(undefined);
  const [selectedRegTo, setRegTo] = useState(undefined);

  const [isVisitModalVisible, setIsVisitModalVisible] = useState(false);
  const [patientTypeValue, setpatientTypeSelectValue] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceLocations, setServiceLocations] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const [IsVisitCreated, setIsVisitCreated] = useState(false);

  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    debugger;
    setLoading(true);
    customAxios.get(urlGetPatientDetail).then((response) => {
      const apiData = response.data.data;
      setPatientDropdown(apiData);
      setLoading(false);
    });
  }, []);

  const disabledDate = (current) => {
    // Disable dates that are in the future
    return current && current > new Date();
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleSelect = (value, option) => {
    debugger;
    console.log("UhId", value);
    setSelectedUhId(option.value);
  };

  const handleAutoCompleteChange = async (value) => {
    debugger;
    try {
      if (!value.trim()) {
        setOptions([]); // Set options to an empty array
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
        const newOptions = responseData.map((option) => ({
          value: option.UhId,
          label: option.UhId,
          key: option.PatientId,
        }));
        setOptions(newOptions);
        // setOptions(responseData);
      } else {
        setOptions([]); // Set options to an empty array if the structure is not as expected
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setOptions([]); // Set options to an empty array in case of an error
    }
  };

  function formatDate(inputDate) {
    if (!inputDate) return '""';
    const dateParts = inputDate.split("-");
    if (dateParts.length === 3) {
      const [year, month, day] = dateParts;
      return `${day}-${month}-${year}`;
    }
    return inputDate; // Return as is if not in the expected format
  }

  const formatDatefortable = (dateString) => {
    if (!dateString) return '""';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const handleDateChange = (date, dateString) => {
    const dateinput = formatDate(dateString);
    setdob(dateinput);
  };

  const handleRegFromDateChange = (date, dateString) => {
    debugger;
    const dateinput1 = formatDate(dateString);
    setRegFrom(dateinput1);
  };

  const handleRegToDateChange = (date, dateString) => {
    const dateinput2 = formatDate(dateString);
    setRegTo(dateinput2);
  };

  const handleBackToList = () => {
    const url = `/patient`;
    // Navigate to the new URL
    navigate(url);
  };

  const navigateToAddPatient = () => {
    const url = `/patient/NewPatient`;
    // Navigate to the new URL
    navigate(url);
  };

  const handleOnSearch = (values) => {
    // debugger;

    // Handle form submission logic here
    console.log("Form submitted with values:", values);

    console.log("Form Values:", values);

    // ... Repeat for other parameters
    try {
      setLoading(true);

      values.dob = selecteddob;
      values.RegFrom = selectedRegFrom;
      values.RegTo = selectedRegTo;
      // Assuming postData1 is an object with your input values
      const postData1 = {
        Uhid: values.Uhid === undefined ? '""' : values.Uhid, // Set to empty string when left blank
        NameFilter: values.NameFilter === undefined ? "" : values.NameFilter,
        PatientName:
          values.PatientName === undefined ? '""' : values.PatientName,
        DateOfBirth: values.dob === undefined ? '""' : values.dob,
        RegistrationFrom: values.RegFrom === undefined ? '""' : values.RegFrom,
        RegistrationTo: values.RegTo === undefined ? '""' : values.RegTo,
        Age: values.Age === undefined ? "" : values.Age,
        Gender: values.PatientGender === undefined ? "" : values.PatientGender,
        MobileNumber:
          values.MobileNumber === undefined ? '""' : values.MobileNumber,
        City: values.City === undefined ? '""' : values.City,
        identifierType:
          values.IdentifierType === undefined ? "" : values.IdentifierType,
        IdentifierTypeValue:
          values.IdentifierValue === undefined ? '""' : values.IdentifierValue,
      };
      customAxios
        .get(
          `${urlSearchPatientRecord}?Uhid=${postData1.Uhid}&NameFilter=${postData1.NameFilter}&PatientName=${postData1.PatientName}&DateOfBirth=${postData1.DateOfBirth}&RegistrationFrom=${postData1.RegistrationFrom}&RegistrationTo=${postData1.RegistrationTo}&Age=${postData1.Age}&Gender=${postData1.Gender}&MobileNumber=${postData1.MobileNumber}&City=${postData1.City}&IdentifierType=${postData1.identifierType}&IdentifierTypeValue=${postData1.IdentifierTypeValue}`,
          null,
          {
            params: postData1,
          }
        )
        .then((response) => {
          console.log("Response:", response.data);
          //resetForm();
          setPatientSearchDetails(response.data.data.Patients);
          setOptions([]);
          setLoading(false);
        });
    } catch (error) {
      // Handle any errors here
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading state to false when the operation is complete
    }
    // Reset the form fields
  };

  const [selectedRecord, setSelectedRecord] = useState(null); // New state variable to store selected record

  const handlevisitmodal = (record) => {
    debugger;
    setSelectedRecord(record); // Set the selected record when the modal is opened
    setIsVisitModalVisible(true);
    // form1.resetFields();
  };

  const handleEditRegistrationsDetails = (record) => {
    // debugger;

    const url = `/patient/PatientEdit`;

    // Navigate to the new URL
    navigate(url, {
      state: {
        selectedRow: record,
      },
    });
  };

  const handlemoredetailsmodal = (record) => {
    debugger;
    setSelectedRecord(record); // Set the selected record when the modal is opened
    setIsMoreModalVisible(true);
    // form1.resetFields();
  };

  const handleOk = async () => {
    // debugger;
    try {
      await form1.validateFields(); // Trigger form validation
      const values = form1.getFieldsValue();
      console.log("Selected Record:", selectedRecord);
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
      };

      try {
        // Send a POST request to the server
        const response = await customAxios.post(urlAddNewVisit, postData, {
          headers: {
            "Content-Type": "application/json", // Replace with the appropriate content type if needed
            // Add any other required headers here
          },
        });

        if (response.data != null) {
          const genVisitId =
            response.data.data.EncounterModel.GeneratedEncounterId;
          setEncounterId(genVisitId);
          setIsVisitCreated(true);
        } else {
          alert("Invalid Login");
        }
        // Check if the request was successful
        if (response.status !== 200) {
          throw new Error(
            `Server responded with status code ${response.status}`
          );
        } else {
          messageApi.open({
            type: "success",
            content: `Successfully  visit created for patient.`,
          });
        }
      } catch (error) {
        console.error("Failed to send data to server: ", error);
        messageApi.open({
          type: "error",
          content: `Error creating visit for patient: ${error}.`,
        });
      }

      // setIsModalVisible(false);
      setDepartments([]);
      setProviders([]);
      setServiceLocations([]);
      // form1.resetFields();

      // Additional logic after the asynchronous operation
    } catch (error) {
      // Handle errors if needed
    }
  };

  const handleVisitModalCancel = () => {
    setIsVisitModalVisible(false);
    setIsVisitCreated(false);
    setDepartments([]);
    setProviders([]);
    setServiceLocations([]);
    setEncounterId(null);
    form1.resetFields();
  };

  const handleMoreModalCancel = () => {
    setIsMoreModalVisible(false);
  };

  const handlePatientTypeChange = async (value) => {
    setpatientTypeSelectValue(value);
    debugger;
    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        const response = await customAxios.get(
          `${urlGetDepartmentBasedOnPatitentType}?PatientType=${value}`
        );

        if (response.status === 200) {
          const dept = response.data.data.Department;
          setDepartments(dept);
        } else {
          // Handle other response statuses if needed
        }
      } else {
        setDepartments([]);
        setProviders([]);
        setServiceLocations([]);
        form1.resetFields();
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handleDepartmentChange = async (value) => {
    debugger;
    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        const providerResponse = await customAxios.get(
          `${urlGetProviderBasedOnDepartment}?DepartmentId=${value}`
        );
        const serviceLocationResponse = await customAxios.get(
          `${urlGetServiceLocationBasedonId}?DepartmentId=${value}&patienttype=${patientTypeValue}`
        );
        if (providerResponse.status === 200) {
          const provider = providerResponse.data.data.Provider;
          setProviders(provider);
        } else {
          console.error("Failed to fetch providers");
        }

        if (serviceLocationResponse.status === 200) {
          const serviceLoc = serviceLocationResponse.data.data.ServiceLocation;
          setServiceLocations(serviceLoc);
        } else {
          console.error("Failed to fetch service locations");
        }
      } else {
        setProviders([]);
        setServiceLocations([]);
        // form1.setFieldsValue({ ProviderId: null });
        // form1.setFieldsValue({ ServiceLocationName: null });
        form1.resetFields(["Provider", "ServiceLocation"]);
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const columns = [
    {
      title: "Sl No",
      key: "index",

      render: (text, record, index) => {
        const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
        return serialNumber;
      },
    },
    {
      title: "UHID",
      dataIndex: "UhId",
      key: "UhId",
      sorter: (a, b) => a.UhId - b.UhId,
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <span style={{ fontWeight: "bold" }}>{record.UhId}</span>
      ),
    },
    {
      title: "PatientDetails",
      dataIndex: "PatientName",
      key: "PatientName",
      sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <div>
          <p>
            <strong>Name:</strong> {record.PatientName}
            <br />
            <strong>Gender:</strong> {record.PatientGender}
            <br />
            <strong>Mob No:</strong> {record.MobileNumber}
            <br />
            <strong>Dob:</strong> {formatDatefortable(record.DateOfBirth)}{" "}
          </p>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (text, record) => (
        <>
          <div>
            <p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlevisitmodal(record);
                }}
              >
                Create Visit
              </a>
            </p>
          </div>
          <div>
            <p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditRegistrationsDetails(record);
                }}
              >
                Edit Registration Details
              </a>
            </p>
          </div>
          <div>
            <p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlemoredetailsmodal(record);
                }}
              >
                More Details
              </a>
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <Title
            level={3}
            style={{
              color: "white",
              fontWeight: 500,
              margin: 0,
              paddingTop: 0,
            }}
          >
            Patient Search
          </Title>
        }
        className="custom-card"
        extra={
          <Button
            type="default"
            onClick={handleBackToList}
            style={{
              color: "blue",
            }}
          >
            <LeftOutlined style={{ color: "blue" }} />
            Back to list
          </Button>
        }
      >
        <Form
          layout="vertical"
          onFinish={handleOnSearch}
          variant="outlined"
          size="default"
          /* style={{
            maxWidth: 1500
          }} */
          form={form}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="UHID" name="Uhid">
                  <AutoComplete
                    id="uhid-autocomplete"
                    options={options}
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
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Name Filter" name="NameFilter">
                  <Select allowClear>
                    {containsDropdown.map((option) => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label=" Patient Name" name="PatientName">
                  <Input allowClear />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Date of Birth" name="dob">
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={handleDateChange}
                    disabledDate={disabledDate}
                    placeholder="DD-MM-YYYY"
                    allowClear
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Identifier Type" name="IdentifierType">
                  <Select allowClear>
                    {patientDropdown.CardType.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Identifier Value" name="IdentifierValue">
                  <Input allowClear />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Registration From" name="RegFrom">
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={handleRegFromDateChange}
                    disabledDate={disabledDate}
                    placeholder="DD-MM-YYYY"
                    allowClear
                  />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Registration To" name="RegTo">
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={handleRegToDateChange}
                    disabledDate={disabledDate}
                    placeholder="DD-MM-YYYY"
                    allowClear
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  label="Mobile Number :"
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
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="City" name="City">
                  <Input allowClear />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  label="Age"
                  name="Age"
                  rules={[
                    {
                      pattern: new RegExp(/^\d{1,3}$/),
                      message: "Invalid Age",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  style={{ width: "100%" }}
                  label="Gender"
                  name="PatientGender"
                >
                  <Select allowClear>
                    {patientDropdown.Genders.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row justify="end">
            <Col style={{ marginRight: "10px" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Search
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
      </Card>
      <Card>
        <Spin spinning={loading}>
          <Table
            dataSource={patientsearchDetails}
            columns={columns}
            className="custom-table"
            rowKey={(row) => row.PatientId}
            size="small"
            onChange={(pagination) => {
              setCurrentPage(pagination.current);
              setItemsPerPage(pagination.pageSize);
            }}
            bordered
          />
        </Spin>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12} offset={6}>
            <div
              style={{
                padding: "10px 10px",
                borderRadius: "4px",
                margin: "10px",
                backgroundColor: "#d9f7be",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                If you are sure, patient is not registered, then
                <Button
                  type="primary"
                  onClick={navigateToAddPatient}
                  style={{ margin: "5px" }}
                >
                  Register New Patient
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Card>

      <ConfigProvider
        theme={{
          token: {
            zIndexPopupBase: 3000,
          },
        }}
      >
        {contextHolder}
        <Modal
          width={1000}
          title="Create Visit"
          open={isVisitModalVisible}
          onOk={handleOk}
          // okButtonProps={{ disabled: IsVisitCreated }}
          onCancel={handleVisitModalCancel}
          okText="Submit"
          maskClosable={false}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleOk}
              disabled={IsVisitCreated}
            >
              Submit
            </Button>,
            <Button key="back" onClick={handleVisitModalCancel}>
              Cancel
            </Button>,
          ]}
        >
          <div
            style={{
              padding: "16px",
              borderRadius: "4px",
              margin: "10px",
              backgroundColor: "#f9f0ff",
              boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  UHID :
                </span>
                <span>{selectedRecord && selectedRecord.UhId}</span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Name :
                </span>
                <span>{selectedRecord && selectedRecord.PatientName}</span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold" }}>Patient Gender : </span>
                <span>{selectedRecord && selectedRecord.PatientGender}</span>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Encounter :
                </span>
                <span
                  style={
                    encounterId
                      ? {
                          backgroundColor: "green",
                          color: "white",
                          padding: "2px 4px",
                        }
                      : {}
                  }
                >
                  {encounterId}
                </span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Age :
                </span>
                <span>{selectedRecord && selectedRecord.Age}</span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Dob :
                </span>
                <span>
                  {selectedRecord &&
                    formatDatefortable(selectedRecord.DateOfBirth)}
                </span>
              </Col>
            </Row>
          </div>
          <div>
            <Form form={form1} layout="vertical">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <Form.Item
                    name="PatientType"
                    label="Patient Type"
                    rules={[
                      { required: true, message: "Please select PatientType" },
                    ]}
                  >
                    <Select onChange={handlePatientTypeChange} allowClear>
                      {patientDropdown.PatientType.map((option) => (
                        <Select.Option
                          key={option.LookupID}
                          value={option.LookupID}
                        >
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="EncounterType" label="Encounter Type">
                    <Select allowClear>
                      {patientDropdown.EncounterType.map((option) => (
                        <Select.Option
                          key={option.LookupID}
                          value={option.LookupID}
                        >
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="KinTitle" label="Title">
                    <Select allowClear>
                      {patientDropdown.Title.map((option) => (
                        <Select.Option
                          key={option.LookupID}
                          value={option.LookupID}
                        >
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="KinName" label="Next of Kin Name">
                    <Input allowClear />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <Form.Item
                    name="Department"
                    label="Department"
                    rules={[
                      { required: true, message: "Please select Department" },
                    ]}
                  >
                    <Select onChange={handleDepartmentChange} allowClear>
                      {departments.map((option) => (
                        <Select.Option
                          key={option.DepartmentId}
                          value={option.DepartmentId}
                        >
                          {option.DepartmentName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="EncounterReason" label="Encounter Reason">
                    <Select allowClear>
                      {patientDropdown.EncounterReason.map((option) => (
                        <Select.Option
                          key={option.LookupID}
                          value={option.LookupID}
                        >
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="KinAddress" label="Next of Kin Address">
                    <Input allowClear />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <Form.Item
                    name="Provider"
                    label="Provider"
                    rules={[
                      {
                        required: true,
                        message: "Please select Provider",
                      },
                    ]}
                  >
                    <Select allowClear>
                      {providers.map((option) => (
                        <Select.Option
                          key={option.ProviderId}
                          value={option.ProviderId}
                        >
                          {option.ProviderName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="admittedUnder" label="Admitted Under">
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="KinContactNo"
                    label="Next of Kin Contact No"
                    rules={[
                      {
                        pattern: new RegExp(/^\d{6,10}$/),
                        message: "Invalid Contact Number",
                      },
                    ]}
                  >
                    <Input allowClear />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <Form.Item
                    name="ServiceLocation"
                    label="Service Location"
                    rules={[
                      {
                        required: true,
                        message: "Please select Service Location",
                      },
                    ]}
                  >
                    <Select allowClear>
                      {serviceLocations.map((option) => (
                        <Select.Option
                          key={option.FacilityDepartmentServiceLocationId}
                          value={option.FacilityDepartmentServiceLocationId}
                        >
                          {option.ServiceLocationName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="referredBy" label="Referred By">
                    <Select allowClear>
                      {patientDropdown.ReferredBy.map((option) => (
                        <Select.Option
                          key={option.ReferrerId}
                          value={option.ReferrerId}
                        >
                          {option.ReferrerType}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
      </ConfigProvider>
      <ConfigProvider
        theme={{
          token: {
            zIndexPopupBase: 3000,
          },
        }}
      >
        {contextHolder}
        <Modal
          width={700}
          title="More Details"
          open={isMoreModalVisible}
          // onOk={handleOk}
          // okButtonProps={{ disabled: IsVisitCreated }}
          onCancel={handleMoreModalCancel}
          maskClosable={false}
          footer={null}
        >
          <div
            style={{
              padding: "16px",
              borderRadius: "4px",
              margin: "10px",
              backgroundColor: "#f9f0ff",
              // display: "flex",
              // border: "1px solid #d9d9d9",
              // justifyContent: "space-between",
              boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
            }}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  UHID :
                </span>
                <span>{selectedRecord && selectedRecord.UhId}</span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Name :
                </span>
                <span>{selectedRecord && selectedRecord.PatientName}</span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold" }}>Patient Gender : </span>
                <span>{selectedRecord && selectedRecord.PatientGender}</span>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Age :
                </span>
                <span>{selectedRecord && selectedRecord.Age}</span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Dob :
                </span>
                <span>
                  {selectedRecord &&
                    formatDatefortable(selectedRecord.DateOfBirth)}
                </span>
              </Col>
            </Row>
          </div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={12}>
              <div
                style={{
                  padding: "5px 5px",
                  margin: "10px 10px",
                }}
              >
                <strong style={{ fontSize: "15px" }}>
                  <EnvironmentOutlined /> Present address
                </strong>
                <br></br>
                <span>
                  {selectedRecord && selectedRecord.PermanentAddress1
                    ? selectedRecord.PermanentAddress1
                    : "N/A"}
                </span>
                <br></br>
                <span>{selectedRecord && selectedRecord.AreaName}</span>
                <br></br>
                <span>{selectedRecord && selectedRecord.PlaceName}</span>
                <br></br>
                <span>{selectedRecord && selectedRecord.StateName}</span>
                <br></br>
                <span>{selectedRecord && selectedRecord.CountryName}</span>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ padding: "5px 5px", margin: "10px 10px" }}>
                <strong>Marital Status : </strong>
                <span>
                  {selectedRecord && selectedRecord.MaritalStatusString
                    ? selectedRecord.MaritalStatusString
                    : "N/A"}
                </span>
                <br></br>
                <strong>Father / Spouse name : </strong>
                <span>
                  {selectedRecord && selectedRecord.FatherHusbandName
                    ? selectedRecord.FatherHusbandName
                    : "N/A"}
                </span>
                <br></br>
              </div>
            </Col>
          </Row>
        </Modal>
      </ConfigProvider>
    </div>
  );
};
export default NewVisit;
