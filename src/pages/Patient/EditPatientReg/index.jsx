import React, { useState, useEffect } from "react";
import {
  Spin,
  Skeleton,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  DatePicker,
  Divider,
  notification,
  Space,
  Table,
  Modal,
  Popconfirm,
} from "antd";
import Layout from "antd/es/layout/layout";
import {
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
const { Option } = Select;
import { IoIosPerson } from "react-icons/io";

import {
  urlGetPatientDetail,
  urlAddNewPatient,
  urlAddNewAndUpdatePatientIdentity,
  urlGetPatientIdentificationDetails,
  urlDeletePatientIdentification,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import WebcamImage from "../../../components/WebCam/index.jsx";
import dayjs from "dayjs";

const PatientEdit = () => {
  debugger;
  const location = useLocation();
  const selectedRow = location.state.selectedRow;

  console.log("check the value of selected Row ", selectedRow);

  const [patientDropdown, setPatientDropdown] = useState({
    Title: [],
    Genders: [],
    BloodGroup: [],
    MaritalStatus: [],
    Countries: [],
    States: [],
    Places: [],
    PatientType: [],
    KinTitle: [],
    VisitType: [],
    Religion: [],
    Ethnicity: [],
    Language: [],
    CardType: [],
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [age, setAge] = useState({ years: 0, months: 0, days: 0 });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [selecteddob, setselecteddob] = useState(null);
  const [loadings, setLoadings] = useState(false);
  const [isloading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const navigate = useNavigate();
  const [patientDetails, setPatientDetails] = useState([]);
  const [dob, setDob] = useState(null);
  const [patientIdentificationDetails, setPatientIdentificationDetails] =
    useState([]);
  const [IsEditingIdentifiersModal, setIsEditingIdentifiersModal] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [identificationData, setIdentificationData] = useState();
  useEffect(() => {
    debugger;
    customAxios
      .get(`${urlGetPatientDetail}?PatientId=${selectedRow.PatientId}`)
      .then((response) => {
        const apiData = response.data.data;
        const patientData = response.data.data.AddNewPatient;
        const patientIdentificationData = response.data.data.Identifiers.map(
          (obj, index) => {
            return { ...obj, key: index + 1 };
          }
        );
        setPatientDropdown(apiData);
        setPatientDetails(patientData);
        setPatientIdentificationDetails(patientIdentificationData);
        setFilteredStates(response.data.data.States);
        setFilteredCities(response.data.data.Places);
        setFilteredAreas(response.data.data.Areas);
        setDob(patientData.DateOfBirthstring);
        handleDateChange(patientData.DateOfBirthstring);
        setLoading(false);
      });
  }, []);

  const handleImageUpload = (base64data) => {
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

  const handleDateChange = (dateString) => {
    debugger;
    // setSelectedDate(date);
    setDob(dateString);

    const today = dayjs();
    // const dob = dateString;
    const dob = dayjs(dateString, { format: "DD-MM-YYYY" }); // Assuming the date format is DD-MM-YYYY
    // const diff = today.diff(dob);

    const years = today.diff(dob, "year");
    const remainingMonths = today.diff(dob.add(years, "year"), "month");
    const months = remainingMonths % 12;
    let days = today.diff(dob.add(years, "year").add(months, "month"), "day");

    if (dateString == null) {
      days = 0;
    }

    console.log("print values: ", years, months, days);
    setAge({
      years,
      months,
      days,
    });
  };

  const handleCountryChange = (newCountry) => {
    form.setFieldsValue({
      country: newCountry,
      state: undefined,
      city: undefined,
      area: undefined,
    });

    setSelectedCountry(newCountry);
    setFilteredCities([]);

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

  // const handleReset = () => {
  //   form.resetFields();
  // };

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

  const handleSearchPatientToVisit = () => {
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

    values.DateOfBirthstring = dob;
    const patient = {
      FacilityId: 1,
      PatientId: selectedRow.PatientId,
      PatientTitle: values.PatientTitle,
      PatientFirstName: values.PatientFirstName,
      PatientMiddleName: values.PatientMiddleName,
      PatientLastName: values.PatientLastName,
      Gender: values.PatientGender,
      BloodGroup: values.BloodGroup,
      DateOfBirthstring: values.DateOfBirthstring,
      FatherHusbandTitle: values.FatherHusbandTitle,
      FatherHusbandName: values.FatherHusbandName,
      MaritalStatus: values.MaritalStatus,
      Height: values.Height,
      Weight: values.Weight,
      MobileNumber: values.MobileNumber,
      LandlineNumber: values.LandlineNumber,
      EmailId: values.EmailId,
      Occupation: values.Occupation,
      PermanentAddress1: values.PermanentAddress1,
      PermanentCountryId: values?.country,
      PermanentStateId: values.state,
      PermanentPlaceId: values.city,
      PermanentAreaId: values.area,
      PermanentPinCode: values.PermanentPinCode,
      PresentAddress1: values.PermanentAddress1,
      PresentCountryId: values.country,
      PresentStateId: values.state,
      PresentPlaceId: values.city,
      PresentAreaId: values.area,
      PresentPinCode: values.PermanentPinCode,
      ReligionId: values.Religion,
      EthnicityId: values.Ethnicity,
      PrimaryLanguageId: values.PrimaryLanguageId,
      CanSpeakEnglish: values.CanSpeakEnglish,
      BirthPlace: values.BirthPlace,
      BirthIdentification1: values.BirthIdentification,
      IdentificationId: values.idCardType,
      IdNo: values.IdCardNumber,
    };

    const postData = {
      Patient: patient,
    };

    try {
      // Send a POST request to the server
      const response = await customAxios.post(urlAddNewPatient, postData, {
        headers: {
          "Content-Type": "application/json", // Replace with the appropriate content type if needed
          // Add any other required headers here
        },
      });

      // Check if the request was successful
      if (response.status !== 200) {
        throw new Error(`Server responded with status code ${response.status}`);
      }

      if (response.data == true) {
        // Display success notification
        notification.success({
          message: "Patient Details Updated",
          description: `The patient details have been successfully updated.`,
        });
        setLoadings(false);
        const url = `/patient`;
        navigate(url);
      } else {
        // Display error notification
        notification.error({
          message: "Error",
          description:
            "Failed to update patient details. Please try again later.",
        });
        setLoadings(false);
      }
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

  const onEdit = async (record) => {
    debugger;
    console.log("identifier record", record);

    setIdentificationData(record);
    setIsEditingIdentifiersModal(true);
    const response = await customAxios.get(
      `${urlGetPatientIdentificationDetails}?PatientIdentificationId=${record.PatientIdentificationId}`
    );
    if (response !== null && response !== false) {
      const identificationData = response.data.data.IdentifierModel;
      setIdentificationData(identificationData);
      setIsModalOpen(true);
      form2.setFieldsValue({
        CardType: identificationData.IdentificationId,
        IdNumber: identificationData.IdNumber,
      });
    }
  };

  const onDelete = (record) => {
    debugger;
    //Deleting an State from the Table
    setIdentificationData(record);
    try {
      customAxios
        .delete(
          `${urlDeletePatientIdentification}?PatientIdentificationId=${record.PatientIdentificationId}&PatientId=${record.PatientId}`
        )
        .then((response) => {
          if (response.data.data !== null) {
            const identifiers = response.data.data.Identifiers.map(
              (obj, index) => {
                return { ...obj, key: index + 1 };
              }
            );
            setPatientIdentificationDetails(identifiers);
            // setDropdown(response.data.data);
            notification.success({
              message: "Deleted Successfully",
            });
          }
        });
    } catch (error) {
      notification.error({
        message: "Deleting UnSuccessful",
      });
    }
  };

  const handleAddIdentification = () => {
    setIsModalOpen(true);
    setIsEditingIdentifiersModal(false);
  };

  const handleIdentificationModalCancel = () => {
    setIsModalOpen(false);
    form2.resetFields();
    setIsEditingIdentifiersModal(false);
  };

  const handleSaveIdentification = async () => {
    debugger;
    form2.validateFields();
    const values = form2.getFieldsValue();
    console.log("Look up  Edit Modal Submit", values);

    const identification = IsEditingIdentifiersModal
      ? {
          PatientIdentificationId: identificationData.PatientIdentificationId,
          PatientId: patientDetails.PatientId,
          IdentificationId: values.CardType,
          IdNumber: values.IdNumber,
        }
      : {
          PatientIdentificationId: 0,
          PatientId: patientDetails.PatientId,
          IdentificationId: values.CardType,
          IdNumber: values.IdNumber,
        };

    try {
      // Send a POST request to the server
      const response = await customAxios.post(
        urlAddNewAndUpdatePatientIdentity,
        identification,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data !== null) {
        if (response.data === "AlreadyExists") {
          notification.warning({
            message: "Patient identifier already exists",
          });
        } else {
          setIsModalOpen(false);
          const identificationDetails = response.data.data.Identifiers.map(
            (obj, index) => {
              return { ...obj, key: index + 1 };
            }
          );
          setPatientIdentificationDetails(identificationDetails);
          {
            IsEditingIdentifiersModal
              ? notification.success({
                  message:
                    "Patient Identification details updated Successfully",
                })
              : notification.success({
                  message: "Patient Identification details added Successfully",
                });
          }
        }
      }
    } catch (error) {
      console.error("Failed to send data to server: ", error);

      {
        IsEditingIdentifiersModal
          ? notification.error({
              message: "Editing Patient Identification details UnSuccessful",
            })
          : notification.error({
              message: "Adding Patient Identification details UnSuccessful",
            });
      }
    }
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Card Type",
      dataIndex: "IdentificationName",
      key: "IdentificationName",
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
                  Edit Patient Details
                </Title>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={10}>
                <div
                  style={{
                    backgroundColor: "#d6e4ff",
                    padding: "10px",
                    borderRadius: "10px",
                    margin: "10px 10px",
                  }}
                >
                  <span
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    You are editing details for the patient&nbsp;
                    <IoIosPerson style={{ marginLeft: "5px" }} />
                    &nbsp;{selectedRow.UhId}
                  </span>
                </div>
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
              initialValues={{
                DateOfBirthstring: dayjs(
                  patientDetails.DateOfBirthstring,
                  "DD-MM-YYYY"
                ),
                PatientTitle: patientDetails.PatientTitle
                  ? patientDetails.PatientTitle
                  : undefined,
                PatientFirstName: patientDetails.PatientFirstName,
                PatientMiddleName: patientDetails.PatientMiddleName,
                PatientLastName: patientDetails.PatientLastName,

                PatientGender: patientDetails.Gender
                  ? patientDetails.Gender
                  : undefined,
                BloodGroup: patientDetails.BloodGroup
                  ? patientDetails.BloodGroup
                  : undefined,
                FatherHusbandTitle: patientDetails.FatherHusbandTitle,
                FatherHusbandName: patientDetails.FatherHusbandName,
                MaritalStatus: patientDetails.MaritalStatus
                  ? patientDetails.MaritalStatus
                  : undefined,
                Height: patientDetails.Height,
                Weight: patientDetails.Weight,
                PermanentAddress1: patientDetails.PermanentAddress1,
                PermanentPinCode: patientDetails.PermanentPinCode
                  ? patientDetails.PermanentPinCode
                  : undefined,
                country: patientDetails.PermanentCountryId
                  ? patientDetails.PermanentCountryId
                  : undefined,
                state: patientDetails.PermanentStateId
                  ? patientDetails.PermanentStateId
                  : undefined,
                city: patientDetails.PermanentPlaceId
                  ? patientDetails.PermanentPlaceId
                  : undefined,
                area: patientDetails.PermanentAreaId
                  ? patientDetails.PermanentAreaId
                  : undefined,
                MobileNumber: patientDetails.MobileNumber,
                EmailId: patientDetails.EmailId,
                LandlineNumber: patientDetails.LandlineNumber,
                Occupation: patientDetails.Occupation,
                Religion: patientDetails.ReligionId
                  ? patientDetails.ReligionId
                  : undefined,
                Ethnicity: patientDetails.EthnicityId
                  ? patientDetails.EthnicityId
                  : undefined,
                PrimaryLanguageId: patientDetails.PrimaryLanguageId
                  ? patientDetails.PrimaryLanguageId
                  : undefined,
                CanSpeakEnglish: patientDetails.CanSpeakEnglish
                  ? patientDetails.CanSpeakEnglish
                  : undefined,
                BirthPlace: patientDetails.BirthPlace,
                BirthIdentification: patientDetails.BirthIdentification1,
                idCardType: patientDetails.IdentificationId
                  ? patientDetails.IdentificationId
                  : undefined,
                IdCardNumber: patientDetails.IdNo,
              }}
            >
              <Row gutter={20}>
                <Col span={18}>
                  <Row gutter={16}>
                    <Col span={3}>
                      <Form.Item
                        name="PatientTitle"
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
                        name="DateOfBirthstring"
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
                          placeholder="DD-MM-YYYY"
                          onChange={handleDateChange}
                          disabledDate={disabledDate}
                          format={"DD-MM-YYYY"}
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
                              value={age.years}
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
                              // placeholder="Years"
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
                      <Form.Item name="FatherHusbandTitle" label="Title">
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
                          <Form.Item name="Height" label="Height">
                            <Input suffix="Cms" type="number" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="Weight" label="Weight">
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
                  <Form.Item name="LandlineNumber" label="Landline Number">
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
                    name="PermanentPinCode"
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
                dataSource={patientIdentificationDetails}
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

              <Row justify="end">
                <Col style={{ marginRight: "10px" }}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loadings}>
                      Update
                    </Button>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button type="primary" onClick={handleSearchPatientToVisit}>
                      Back
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Layout>
      )}
      <Modal
        title="Add New Identifier"
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
export default PatientEdit;
