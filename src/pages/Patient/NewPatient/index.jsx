import React, { useState, useEffect } from "react";
import {
  Spin,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  DatePicker,
  Divider,
  notification,
  Table,
  Modal,
  Space,
  Popconfirm,
} from "antd";
import Layout from "antd/es/layout/layout";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
const { Option } = Select;

import {
  urlGetPatientDetail,
  urlAddNewPatient,
  urlGetDepartmentBasedOnPatitentType,
  urlGetProviderBasedOnDepartment,
  urlGetServiceLocationBasedonId,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import WebcamImage from "../../../components/WebCam/index.jsx";
import dayjs from "dayjs";
import { truncate } from "lodash";

const NewPatient = () => {
  const [patientDropdown, setPatientDropdown] = useState({
    Title: [],
    Genders: [],
    BloodGroup: [],
    MaritalStatus: [],
    Countries: [],
    Statesnew: [],
    PatientType: [],
    KinTitle: [],
    VisitType: [],
    Religion: [],
    Ethnicity: [],
    Language: [],
    CardType: [],
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [age, setAge] = useState({ years: 0, months: 0, days: 0 });

  const [selecteddob, setselecteddob] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [selectedPatientType, setSelectedPatientType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedServiceLocation, setSelectedServiceLocation] = useState("");
  const [loadings, setLoadings] = useState(false);
  const [isloading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  /*  const location = useLocation();
  const patientData = location.state ? location.state.patient : null; */
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const navigate = useNavigate();
  const [identifierDetails, setIdentifierDetails] = useState([]);
  const [IsEditingIdentifiersModal, setIsEditingIdentifiersModal] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [identificationData, setIdentificationData] = useState();

  const handleImageUpload = (base64data) => {
    debugger;
    setUploadedImage(base64data);
  };
  //Default Patient data

  const disabledDate = (current) => {
    // Disable dates that are in the future
    return current && current > new Date();
  };

  function formatDate(inputDate) {
    const dateParts = inputDate.split("-");
    if (dateParts.length === 3) {
      const [year, month, day] = dateParts;
      return `${day}-${month}-${year}`;
    }
    return inputDate; // Return as is if not in the expected format
  }

  const handleDateChange = (date, dateString) => {
    debugger;
    setSelectedDate(date);
    // Calculate age based on the selected date and update the age state

    setselecteddob(dateString);

    const today = dayjs();
    const dob = dayjs(date, { format: "DD-MM-YYYY" }); // Assuming the date format is DD-MM-YYYY
    // const diff = today.diff(dob);

    const years = today.diff(dob, "year");
    const remainingMonths = today.diff(dob.add(years, "year"), "month");
    const months = remainingMonths % 12;
    let days = today.diff(dob.add(years, "year").add(months, "month"), "day");

    if (date == null) {
      days = 0;
    }

    console.log("print values: ", years, months, days);
    setAge({
      years,
      months,
      days,
    });
  };

  const handleYearsChange = (e) => {
    debugger;
    const newYears = parseInt(e.target.value, 10);

    // Check if newYears is a valid number
    if (!isNaN(newYears) && newYears >= 1 && newYears <= 100) {
      // Calculate the new date of birth based on the entered years
      const newYears = parseInt(e.target.value, 10);
      console.log("new year value", newYears);

      // Calculate the new date of birth based on the entered years
      const newDob = dayjs().subtract(newYears, "year").startOf("year");

      console.log("new dob value", newDob);
      setSelectedDate(newDob);
      setselecteddob(newDob.format("DD-MM-YYYY"));

      setAge({
        years: newYears,
        months: 0,
        days: 0,
      });
    } else {
      // Handle the case where the entered value is not a valid number
      setAge({
        years: 0,
        months: 0,
        days: 0,
      });

      setSelectedDate(null);
      setselecteddob("");
    }
  };

  const handleCountryChange = (newCountry) => {
    form.setFieldsValue({
      country: newCountry,
      state: undefined,
      city: undefined,
      area: undefined,
    });

    setSelectedCountry(newCountry);

    if (!newCountry) {
      // If newCountry is undefined, clear states and selected state
      setFilteredStates([]);
      setSelectedState(null);
      // Also clear cities
      setFilteredCities([]);
      setSelectedCity(null);

      setFilteredAreas([]);
      setSelectedArea(null);
    } else {
      // Filter states based on the selected country
      const statesForCountry = patientDropdown.States.filter(
        (state) => state.CountryId === newCountry
      );
      setFilteredStates(statesForCountry);

      // Check if the selected state is not in the filtered states, and if so, clear selected state
      if (
        selectedState &&
        !statesForCountry.some((state) => state.StateID === selectedState)
      ) {
        setSelectedState(null);
      }
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  // Handle state change
  const handleStateChange = (newState) => {
    form.setFieldsValue({
      state: newState,
      city: undefined,
      area: undefined,
    });
    setSelectedState(newState);
    if (!newState) {
      setFilteredCities([]);
      setSelectedCity(null);

      setFilteredAreas([]);
      setSelectedArea(null);
    } else {
      // Filter cities based on the selected state
      const citiesForState = patientDropdown.Places.filter(
        (city) => city.StateId === newState
      );
      setFilteredCities(citiesForState);
    }
  };

  const handleCityChange = (newCity) => {
    form.setFieldsValue({
      city: newCity,
      area: undefined,
    });
    setSelectedCity(newCity);
    if (!newCity) {
      setFilteredAreas([]);
      setSelectedArea(null);
    } else {
      // Filter cities based on the selected state
      const areasForCities = patientDropdown.Areas.filter(
        (area) => area.PlaceId === newCity
      );
      setFilteredAreas(areasForCities);
    }
  };

  useEffect(() => {
    debugger;
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
            setDepartments(dept);
          } else {
            console.error("Failed to fetch departments");
          }
        } catch (error) {
          console.error("Error fetching departments:", error);
        }
      } else {
        // Reset the department dropdown if no patient type is selected
        setDepartments([]);
        setSelectedDepartment("");
      }
    };

    fetchData();
  }, [selectedPatientType, setSelectedDepartment, setDepartments]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data for the "provider" and "servicelocation" dropdowns when "selectedDepartment" changes
      if (selectedDepartment) {
        try {
          const providerResponse = await customAxios.get(
            `${urlGetProviderBasedOnDepartment}?DepartmentId=${selectedDepartment}`
          );
          const serviceLocationResponse = await customAxios.get(
            `${urlGetServiceLocationBasedonId}?DepartmentId=${selectedDepartment}&patienttype=${selectedPatientType}`
          );

          if (providerResponse.status === 200) {
            const provider = providerResponse.data.data.Provider;
            setProviders(provider);
          } else {
            console.error("Failed to fetch providers");
          }

          if (serviceLocationResponse.status === 200) {
            const serviceloc =
              serviceLocationResponse.data.data.ServiceLocation;
            setServiceLocations(serviceloc);
          } else {
            console.error("Failed to fetch service locations");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        // Reset the provider and servicelocation dropdowns if no department is selected
        setProviders([]);
        setServiceLocations([]);
        setSelectedProvider("");
        setSelectedServiceLocation("");
      }
    };

    fetchData();
  }, [selectedDepartment, selectedPatientType]);

  const handleBackToList = () => {
    debugger;
    const url = `/patient`;
    // Navigate to the new URL
    navigate(url);
  };

  const handleSearchToVisit = () => {
    const url = `/patient/NewVisit`;
    // Navigate to the new URL
    navigate(url);
  };

  if (loadings) {
    // Render a loading spinner while data is being fetched
    return <Spin size="large" />;
  }

  const handleOnFinish = async (values) => {
    debugger;
    setLoadings(true);
    console.log("Received values from form: ", values);

    values.dob = selecteddob;
    const patientDetails = {
      PatientId: 0,
      PatientTitle: values.title,
      PatientFirstName: values.PatientFirstName,
      PatientMiddleName:
        values.PatientMiddleName === undefined
          ? null
          : values.PatientMiddleName,
      PatientLastName: values.PatientLastName,
      Gender: values.PatientGender,
      FacilityId: 1,
      BloodGroup: values.BloodGroup === undefined ? null : values.BloodGroup,
      DateOfBirthstring: values.dob,
      FatherHusbandTitle:
        values.titleFatherHusband === undefined
          ? null
          : values.titleFatherHusband,
      FatherHusbandName:
        values.FatherHusbandName === undefined
          ? null
          : values.FatherHusbandName,
      MaritalStatus:
        values.MaritalStatus === undefined ? null : values.MaritalStatus,
      Height: values.Height === undefined ? null : values.Height,
      Weight: values.Weight === undefined ? null : values.Weight,
      MobileNumber: values.MobileNumber,
      LandlineNumber:
        values.LandlineNumber === undefined ? null : values.LandlineNumber,
      EmailId: values.EmailId === undefined ? null : values.EmailId,
      PresentAddress1:
        values.PermanentAddress1 === undefined
          ? null
          : values.PermanentAddress1,
      ReligionId: values.Religion === undefined ? null : values.Religion,
      PermanentAddress1:
        values.PermanentAddress1 === undefined
          ? null
          : values.PermanentAddress1,
      PermanentCountryId: values.country,
      PermanentStateId: values.state,
      PermanentPlaceId: values.city,
      PermanentAreaId: values.area === undefined ? null : values.area,
      PermanentPinCode:
        values.PresentPinCode === undefined ? null : values.PresentPinCode,
      PresentCountryId: values.country,
      PresentStateId: values.state,
      PresentPlaceId: values.city,
      PresentAreaId: values.area === undefined ? null : values.area,
      PresentPinCode:
        values.PresentPinCode === undefined ? null : values.PresentPinCode,
      Occupation: values.Occupation === undefined ? null : values.Occupation,
      EthnicityId: values.Ethnicity === undefined ? null : values.Ethnicity,
      PrimaryLanguageId:
        values.PrimaryLanguageId === undefined
          ? null
          : values.PrimaryLanguageId,
      CanSpeakEnglish:
        values.CanSpeakEnglish === undefined ? null : values.CanSpeakEnglish,
      BirthPlace: values.BirthPlace === undefined ? null : values.BirthPlace,
      BirthIdentification1:
        values.BirthIdentification === undefined
          ? null
          : values.BirthIdentification,
    };

    const postData = {
      Patient: patientDetails,
      Identifiers: identifierDetails,
    };

    try {
      // Send a POST request to the server
      const response = await customAxios.post(urlAddNewPatient, postData);

      // Check if the request was successful
      if (response.status !== 200) {
        throw new Error(`Server responded with status code ${response.status}`);
      }

      // Process the response data (this assumes the server responds with JSON)
      const data = response.data.data.PatientDetail.UhId;

      console.log("Response data: ", data);

      // Display success notification
      notification.success({
        message: "Patient Registration Successful",
        description: `The patient details have been successfully registered. The UHID is${data}.`,
      });
      handleSearchToVisit();
      setLoadings(false);
    } catch (error) {
      console.error("Failed to send data to server: ", error);

      // Display error notification
      notification.error({
        message: "Error",
        description: "Failed to register patient. Please try again later.",
      });
      setLoadings(false);
    }
  };

  const onEdit = (record) => {
    debugger;
    console.log("identifier record", record);
    setIsModalOpen(true);
    setIdentificationData(record);
    setIsEditingIdentifiersModal(true);
    form2.setFieldsValue({
      CardType: record.CardTypeID,
      IdNumber: record.IdNumber,
      Key: record.key,
    });
  };
  const onDelete = (record) => {
    console.log("identifier record", record);
    // Filter out the entry to be deleted
    let identifiersArray = identifierDetails.filter(
      (obj) => obj.key !== record.key
    );

    // Reorder the key values of the remaining entries
    identifiersArray = identifiersArray.map((obj, index) => ({
      ...obj,
      key: index + 1,
    }));

    setIdentifierDetails(identifiersArray);
  };

  const handleAddIdentification = () => {
    setIsModalOpen(true);
  };

  const handleIdentificationModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleSaveIdentification = () => {
    debugger;
    const values = form2.getFieldsValue();
    console.log("To save Identification", values);

    // Get a copy of the current identifierDetails
    let identifiersArray = [...identifierDetails];
    if (IsEditingIdentifiersModal) {
      const existingIndex = identifiersArray.findIndex(
        (obj) => obj.key === values.Key
      );

      // If the record exists, update it
      if (existingIndex !== -1) {
        identifiersArray[existingIndex] = {
          key: identificationData.key,
          CardType: patientDropdown.CardType.find(
            (option) => option.LookupID === values.CardType
          ).LookupDescription,
          IdentificationId: values.CardType,
          IdNumber: values.IdNumber,
        };
        form2.resetFields();
      }
    } else {
      Object.entries(values).forEach(([key, value]) => {
        const existingIndex = identifiersArray.findIndex(
          (obj) =>
            obj.IdentificationId === values.CardType &&
            obj.IdNumber === values.IdNumber
        );
        if (existingIndex === -1) {
          identifiersArray.push({
            key: identifiersArray.length + 1, // incrementing the key value for each new entry
            IdentificationId: values.CardType,
            CardType: patientDropdown.CardType.find(
              (option) => option.LookupID === values.CardType
            ).LookupDescription,
            IdNumber: values.IdNumber,
          });
        }
      });
      form2.resetFields();
    }

    setIdentifierDetails(identifiersArray);
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Card Type",
      dataIndex: "CardType",
      key: "CardType",
    },
    {
      title: "Value",
      dataIndex: "IdNumber",
      key: "IdNumber",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: "4rem",
      render: (text, record) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => onEdit(record)}
            icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
          ></Button>

          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => onDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
            ></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {isloading ? (
        // Skeleton Loading for Header
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" style={{ textAlign: "center" }}>
            <div className="content" />
          </Spin>
        </div>
      ) : (
        <Layout style={{ zIndex: "999999999" }}>
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
                padding: "0.5rem 2rem 0.5rem 2rem",
                backgroundColor: "#40A2E3",
                borderRadius: "10px 10px 0px 0px ",
              }}
            >
              <Col span={16}>
                <Title
                  level={4}
                  style={{
                    color: "white",
                    fontWeight: 500,
                    margin: 0,
                    paddingTop: 0,
                  }}
                >
                  Register New Patient
                </Title>
              </Col>
              <Col offset={5} span={3}>
                <Button icon={<SearchOutlined />} onClick={handleSearchToVisit}>
                  Search Patient
                </Button>
              </Col>
            </Row>

            <Divider orientation="left">Patient Details</Divider>

            <Form
              layout="vertical"
              form={form}
              name="register"
              onFinish={handleOnFinish}
              scrollToFirstError={true}
              style={{ padding: "0rem 2rem" }}
            >
              <Row gutter={20}>
                <Col span={18}>
                  <Row gutter={16}>
                    <Col span={3}>
                      <Form.Item
                        name="title"
                        label="Title"
                        // hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "Please select title",
                          },
                        ]}
                      >
                        <Select placeholder="Select Title" allowClear>
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
                    <Col span={7}>
                      <Form.Item
                        name="PatientFirstName"
                        label="First Name"
                        rules={[
                          {
                            required: true,
                            message: "Please add First Name",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item name="PatientMiddleName" label="Middle Name">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        name="PatientLastName"
                        label="Last Name"
                        rules={[
                          {
                            required: true,
                            message: "Please add Last Name",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={3}>
                      <Form.Item
                        name="PatientGender"
                        label="Gender"
                        // hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "Please select gender",
                          },
                        ]}
                      >
                        <Select placeholder="select" allowClear>
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
                    </Col>
                    <Col span={7}>
                      <Form.Item name="BloodGroup" label="Blood Group">
                        <Select allowClear>
                          {patientDropdown.BloodGroup.map((option) => (
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
                    <Col span={7}>
                      <Form.Item
                        name="dob"
                        label="Date of Birth"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date Of Birth",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          value={selectedDate}
                          onChange={handleDateChange}
                          disabledDate={disabledDate}
                          format={"DD-MM-YYYY"}
                          placeholder="DD-MM-YYYY"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Row gutter={14}>
                        <Col span={8}>
                          <Form.Item label="Years">
                            <Input
                              style={{ width: "100%" }}
                              // placeholder="Years"
                              min={1}
                              max={100}
                              value={age.years.toString()}
                              onChange={handleYearsChange}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="Months">
                            <Input
                              style={{ width: "100%" }}
                              // placeholder="Years"
                              min={1}
                              max={100}
                              value={age.months}
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item label="Days">
                            <Input
                              style={{ width: "100%" }}
                              // placeholder=""
                              min={1}
                              max={100}
                              value={age.days}
                              disabled
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={3}>
                      <Form.Item name="titleFatherHusband" label="Title">
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
                    <Col span={7}>
                      <Form.Item
                        name="FatherHusbandName"
                        label="Father / Spouse Name"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        name="MaritalStatus"
                        label="Patient Marital Status"
                      >
                        <Select allowClear>
                          {patientDropdown.MaritalStatus.map((option) => (
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
                    <Col span={7}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="Height"
                            label="Height"
                            rules={[
                              {
                                pattern: /^\d{2,3}$/,
                                message: "Please enter valid input for height",
                              },
                            ]}
                          >
                            <Input suffix="Cms" type="number" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="Weight"
                            label="Weight"
                            rules={[
                              {
                                pattern: /^\d{2,3}$/,
                                message: "Please enter valid input for height",
                              },
                            ]}
                          >
                            <Input suffix="Kgs" type="number" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col
                  span={6}
                  style={{ overflow: "hidden", paddingRight: "10px" }}
                >
                  <WebcamImage onImageUpload={handleImageUpload} />
                </Col>
              </Row>

              <Divider orientation="left">Contact Details</Divider>
              <Row gutter={14}>
                <Col span={6}>
                  <Form.Item
                    name="MobileNumber"
                    label="Mobile Number"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your mobile number.",
                      },
                      {
                        pattern: new RegExp(/^(\+\d{1,3})?\d{10,12}$/),
                        message: "Invalid mobile number!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="LandlineNumber"
                    label="Landline Number"
                    rules={[
                      {
                        pattern: new RegExp(/^\d{6,10}$/),
                        message: "Invalid Landline Number",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="EmailId"
                    label="Email Id"
                    rules={[
                      {
                        type: "email",
                        message: "Please input valid E-mail",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="Occupation" label="Occupation">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="left">Address</Divider>
              <Row gutter={14}>
                <Col span={6}>
                  <Form.Item name="PermanentAddress1" label="Address">
                    <TextArea placeholder="Add Address" autoSize />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="country" label="Country">
                    <Select
                      value={selectedCountry || ""}
                      onChange={handleCountryChange}
                      allowClear
                    >
                      {patientDropdown.Countries.map((option) => (
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
                  <Form.Item name="state" label="State">
                    <Select
                      value={selectedState || ""}
                      onChange={handleStateChange}
                      allowClear
                    >
                      {filteredStates.map((option) => (
                        <Select.Option
                          key={option.StateID}
                          value={option.StateID}
                        >
                          {option.StateName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="city" label="City">
                    <Select
                      value={selectedCity || ""}
                      onChange={handleCityChange}
                      allowClear
                    >
                      {filteredCities.map((option) => (
                        <Select.Option
                          key={option.PlaceId}
                          value={option.PlaceId}
                        >
                          {option.PlaceName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="area" label="Area">
                    <Select
                      value={selectedArea || ""}
                      onChange={(value) => setSelectedArea(value)}
                      allowClear
                    >
                      {filteredAreas.map((option) => (
                        <Select.Option
                          key={option.AreaId}
                          value={option.AreaId}
                        >
                          {option.AreaName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item
                    name="PresentPinCode"
                    label="Pin Code"
                    rules={[
                      {
                        pattern: new RegExp(/^\d{6}$/),
                        message: "Invalid Pin Code",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="left">Other Details</Divider>
              <Row gutter={14}>
                <Col span={6}>
                  <Form.Item name="Religion" label="Religion">
                    <Select placeholder="Select Religion" allowClear>
                      {patientDropdown.Religion.map((option) => (
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
                  <Form.Item name="Ethnicity" label="Ethnicity">
                    <Select allowClear>
                      {patientDropdown.Ethnicity.map((option) => (
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
                  <Form.Item name="PrimaryLanguageId" label="Primary Language">
                    <Select allowClear>
                      {patientDropdown.Language.map((option) => (
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
                  <Form.Item name="CanSpeakEnglish" label="Can speak English?">
                    <Select>
                      <Select.Option key="Y">Yes</Select.Option>
                      <Select.Option key="N">No</Select.Option>
                      <Select.Option key="M">Maybe</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="BirthPlace" label="Birth Place">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="BirthIdentification"
                    label="Birth Identification"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Layout>
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
                      padding: "0.5rem 2rem 0.5rem 2rem",
                      backgroundColor: "#40A2E3",
                      borderRadius: "10px 10px 10px 10px ",
                    }}
                  >
                    <Col span={16}>
                      <Title
                        level={4}
                        style={{
                          color: "white",
                          fontWeight: 500,
                          margin: 0,
                          paddingTop: 0,
                        }}
                      >
                        Identification Details
                      </Title>
                    </Col>
                    <Col offset={7} span={1} style={{ alignItems: "right" }}>
                      <Button
                        icon={<PlusCircleOutlined />}
                        onClick={handleAddIdentification}
                      ></Button>
                    </Col>
                  </Row>
                </div>
              </Layout>
              <Space size="large">{""}</Space>
              <Table
                dataSource={identifierDetails}
                columns={columns}
                // rowKey={(row) => row.EncounterId}
                size="small"
                className="vitals-table"
                scroll={{ x: 1000 }}
                // onChange={(pagination) => {
                //   setCurrentPage(pagination.current);
                //   setItemsPerPage(pagination.pageSize);
                // }}
                bordered
              ></Table>
              <Space size="large">{""}</Space>
              <Row justify="end">
                <Col style={{ marginRight: "10px" }}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loadings}>
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button type="primary" danger onClick={handleReset}>
                      Reset
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Layout>
      )}
      <Modal
        title="Add New Place"
        open={isModalOpen}
        maskClosable={false}
        footer={null}
        onCancel={handleIdentificationModalCancel}
      >
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={form2}
          onFinish={handleSaveIdentification}
        >
          <Form.Item
            name="CardType"
            label="Card Type"
            rules={[
              {
                required: true,
                message: "Please select place name",
              },
            ]}
          >
            <Select allowClear>
              {patientDropdown.CardType.map((option) => (
                <Select.Option key={option.LookupID} value={option.LookupID}>
                  {option.LookupDescription}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="IdNumber"
            label="Card Number"
            rules={[
              {
                required: true,
                message: "Please enter area name",
              },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="Key"></Form.Item>
          <Row gutter={32} style={{ height: "1.8rem" }}>
            <Col offset={12} span={6}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                <Button
                  type="default"
                  onClick={handleIdentificationModalCancel}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default NewPatient;
