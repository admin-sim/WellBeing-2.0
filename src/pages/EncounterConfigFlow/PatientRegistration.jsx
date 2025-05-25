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
  Tooltip,
  ConfigProvider,
  message,
} from "antd";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaAnglesRight } from "react-icons/fa6";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { useNavigate, useLocation } from "react-router";
import {
  urlGetPatientDetail,
  urlAddNewPatient,
  urlGetPatientHeaderDetails,
  urlGetEncounterDetails,
  urlAddNewVisit1,
} from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios.jsx";
import TextArea from "antd/es/input/TextArea";
import WebcamImage from "../../components/WebCam/index.jsx";
import dayjs from "dayjs";
import { DateTime } from "luxon";
import PageHeader from "../../components/PageHeader/index.jsx";
import VisitModal from "../Patient/NewVisit/visitModal.jsx";

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
 const [submitLoader, setIsSubmitLoader] = useState(false);
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
  const [loadings, setLoadings] = useState(false);
  const [isloading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const navigate = useNavigate();
  const [identifierDetails, setIdentifierDetails] = useState([]);
  const [IsEditingIdentifiersModal, setIsEditingIdentifiersModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [identificationData, setIdentificationData] = useState();
  const [isVisitModalVisible, setIsVisitModalVisible] = useState(false);
  const [visitsDropdown, setVisitDropdown] = useState({});
  const [patientHeaderDetails, setPatientHeaderDetails] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [IsVisitCreated, setIsVisitCreated] = useState(false);
  const [ModalLoader, setModalLoader] = useState(false);
  const [showWard, setShowWard] = useState(false);
  const [encounterId, setEncounterId] = useState();
  const [messageApi, contextHolder] = message.useMessage();

  const handleImageUpload = (base64data) => {
    console.log("Full Base64 Image Data Length:", base64data.length);
    setUploadedImage(base64data);
  };

  const disabledDate = (current) => {
    return current && current > new Date();
  };

  const handleDateChange = (date, dateString) => {
    setselecteddob(dateString);
    setSelectedDate(date);
    if (date) {
      const now = DateTime.now();
      const birthDate = DateTime.fromJSDate(date.toDate());
      const diff = now.diff(birthDate, ["years", "months", "days"]).toObject();
      setAge({
        years: Math.floor(diff.years),
        months: Math.floor(diff.months),
        days: Math.floor(diff.days),
      });
    } else {
      setAge({ years: 0, months: 0, days: 0 });
    }
  };

  const handleYearsChange = (e) => {
    const years = parseInt(e.target.value, 10) || 0;
    const newAge = { ...age, years };
    setAge(newAge);
    updateDateOfBirth(newAge);
  };

  const handleMonthsChange = (e) => {
    const months = parseInt(e.target.value, 10) || 0;
    const newAge = { ...age, months };
    setAge(newAge);
    updateDateOfBirth(newAge);
  };

  const handleDaysChange = (e) => {
    const days = parseInt(e.target.value, 10) || 0;
    const newAge = { ...age, days };
    setAge(newAge);
    updateDateOfBirth(newAge);
  };

  const updateDateOfBirth = ({ years, months, days }) => {
    const today = new Date();
    let newDate = new Date(today);
    newDate.setFullYear(newDate.getFullYear() - years);
    newDate.setMonth(newDate.getMonth() - months);
    newDate.setDate(newDate.getDate() - days);
    form.setFieldValue("dob", dayjs(newDate));
    setSelectedDate(dayjs(newDate).format("DD-MM-YYYY"));
    setselecteddob(dayjs(newDate).format("DD-MM-YYYY"));
  };

  const handlePresentCountryChange = (newCountry) => {
    form.setFieldsValue({
      presentCountryId: newCountry,
      presentStateId: undefined,
      presentPlaceId: undefined,
      presentAreaId: undefined,
    });
    setSelectedCountry(newCountry);
    if (!newCountry) {
      setFilteredStates([]);
      setSelectedState(null);
      setFilteredCities([]);
      setSelectedCity(null);
      setFilteredAreas([]);
      setSelectedArea(null);
    } else {
      const statesForCountry = patientDropdown.States.filter(
        (state) => state.CountryId === newCountry
      );
      setFilteredStates(statesForCountry);
      if (
        selectedState &&
        !statesForCountry.some((state) => state.StateID === selectedState)
      ) {
        setSelectedState(null);
      }
    }
  };

  const handlePermanentCountryChange = (newCountry) => {
    form.setFieldsValue({
      permanentCountryId: newCountry,
      permanentStateId: undefined,
      permanentPlaceId: undefined,
      permanentAreaId: undefined,
    });
    setSelectedCountry(newCountry);
    if (!newCountry) {
      setFilteredStates([]);
      setSelectedState(null);
      setFilteredCities([]);
      setSelectedCity(null);
      setFilteredAreas([]);
      setSelectedArea(null);
    } else {
      const statesForCountry = patientDropdown.States.filter(
        (state) => state.CountryId === newCountry
      );
      setFilteredStates(statesForCountry);
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

  const handlePresentStateChange = (newState) => {
    form.setFieldsValue({
      presentStateId: newState,
      presentPlaceId: undefined,
      presentAreaId: undefined,
    });
    setSelectedState(newState);
    if (!newState) {
      setFilteredCities([]);
      setSelectedCity(null);
      setFilteredAreas([]);
      setSelectedArea(null);
    } else {
      const citiesForState = patientDropdown.Places.filter(
        (city) => city.StateId === newState
      );
      setFilteredCities(citiesForState);
    }
  };

  const handlePermanentStateChange = (newState) => {
    form.setFieldsValue({
      permanentStateId: newState,
      permanentPlaceId: undefined,
      permanentAreaId: undefined,
    });
    setSelectedState(newState);
    if (!newState) {
      setFilteredCities([]);
      setSelectedCity(null);
      setFilteredAreas([]);
      setSelectedArea(null);
    } else {
      const citiesForState = patientDropdown.Places.filter(
        (city) => city.StateId === newState
      );
      setFilteredCities(citiesForState);
    }
  };

  const handlePresentCityChange = (newCity) => {
    form.setFieldsValue({
      presentPlaceId: newCity,
      presentAreaId: undefined,
    });
    setSelectedCity(newCity);
    if (!newCity) {
      setFilteredAreas([]);
      setSelectedArea(null);
    } else {
      const areasForCities = patientDropdown.Areas.filter(
        (area) => area.PlaceId === newCity
      );
      setFilteredAreas(areasForCities);
    }
  };

  const handleParmanentCityChange = (newCity) => {
    form.setFieldsValue({
      permanentPlaceId: newCity,
      permanentAreaId: undefined,
    });
    setSelectedCity(newCity);
    if (!newCity) {
      setFilteredAreas([]);
      setSelectedArea(null);
    } else {
      const areasForCities = patientDropdown.Areas.filter(
        (area) => area.PlaceId === newCity
      );
      setFilteredAreas(areasForCities);
    }
  };

  useEffect(() => {
    setLoading(true);
    customAxios.get(urlGetPatientDetail).then((response) => {
      const apiData = response.data.data;
      setPatientDropdown(apiData);
      setLoading(false);
    });
  }, []);

  const handleSearchToVisit = () => {
    const url = `/patient/NewVisit`;
    navigate(url);
  };

  const handleOnFinish = async (values) => {
    setLoadings(true);
    values.dob = selecteddob;
    const patientDetails = {
      PatientTitle: values.title === undefined ? null : values.title,
      PatientFirstName:
        values.PatientFirstName === undefined || values.PatientFirstName === ""
          ? null
          : values.PatientFirstName,
      PatientMiddleName:
        values.PatientMiddleName === undefined ||
        values.PatientMiddleName === ""
          ? null
          : values.PatientMiddleName,
      PatientLastName:
        values.PatientLastName === undefined || values.PatientLastName === ""
          ? null
          : values.PatientLastName,
      Gender: values.PatientGender === undefined ? null : values.PatientGender,
      FacilityId: 1,
      BloodGroup: values.BloodGroup === undefined ? null : values.BloodGroup,
      DateOfBirthstring: values.dob === undefined ? null : values.dob,
      FatherHusbandTitle:
        values.titleFatherHusband === undefined
          ? null
          : values.titleFatherHusband,
      FatherHusbandName:
        values.FatherHusbandName === undefined ||
        values.FatherHusbandName === ""
          ? null
          : values.FatherHusbandName,
      MaritalStatus:
        values.MaritalStatus === undefined ? null : values.MaritalStatus,
      Height:
        values.Height === undefined || values.Height === ""
          ? null
          : values.Height,
      Weight:
        values.Weight === undefined || values.Weight === ""
          ? null
          : values.Weight,
      MobileNumber:
        values.MobileNumber === undefined || values.MobileNumber === ""
          ? null
          : values.MobileNumber,
      LandlineNumber:
        values.LandlineNumber === undefined || values.LandlineNumber === ""
          ? null
          : values.LandlineNumber,
      EmailId:
        values.EmailId === undefined || values.EmailId === ""
          ? null
          : values.EmailId,
      PresentAddress1:
        values.presentAddress1 === undefined || values.presentAddress1 === ""
          ? null
          : values.presentAddress1,
      ReligionId: values.Religion === undefined ? null : values.Religion,
      PermanentAddress1:
        values.permanentAddress1 === undefined ||
        values.permanentAddress1 === ""
          ? null
          : values.permanentAddress1,
      PermanentCountryId: values?.permanentCountryId,
      PermanentStateId: values.permanentStateId,
      PermanentPlaceId: values.permanentPlaceId,
      PermanentAreaId: values.permanentAreaId,
      PermanentPinCode:
        values.permanentPinCode === undefined || values.permanentPinCode === ""
          ? null
          : values.permanentPinCode,
      PhotoUrl: uploadedImage,
      PresentCountryId: values?.presentCountryId,
      PresentStateId: values.presentStateId,
      PresentPlaceId: values.presentPlaceId,
      PresentAreaId: values.presentAreaId,
      PresentPinCode:
        values.presentPinCode === undefined || values.presentPinCode === ""
          ? null
          : values.presentPinCode,
      Occupation:
        values.Occupation === undefined || values.Occupation === ""
          ? null
          : values.Occupation,
      EthnicityId: values.Ethnicity === undefined ? null : values.Ethnicity,
      PrimaryLanguageId:
        values.PrimaryLanguageId === undefined
          ? null
          : values.PrimaryLanguageId,
      CanSpeakEnglish:
        values.CanSpeakEnglish === undefined || values.CanSpeakEnglish === ""
          ? null
          : values.CanSpeakEnglish,
      BirthPlace:
        values.BirthPlace === undefined || values.BirthPlace === ""
          ? null
          : values.BirthPlace,
      BirthIdentification1:
        values.birthIdentification1 === undefined ||
        values.birthIdentification1 === ""
          ? null
          : values.birthIdentification1,
      BirthIdentification2:
        values.birthIdentification2 === undefined ||
        values.birthIdentification2 === ""
          ? null
          : values.birthIdentification2,
    };

    const postData = {
      Patient: patientDetails,
      Identifiers: identifierDetails,
    };

    try {
      const response = await customAxios.post(urlAddNewPatient, postData);
      if (response.status !== 200) {
        throw new Error(`Server responded with status code ${response.status}`);
      }
      const data = response.data.data.PatientDetail.UhId;
      setLoadings(false);
      Modal.confirm({
        title: `Patient Registered Successfully. The UHID is ${data}`,
        content: "Do you want to create a visit?",
        onOk: () => {
          handlevisitmodal(response.data.data.PatientDetail);
        },
        onCancel: () => {
          navigate("/Patient");
        },
      });
    } catch (error) {
      console.error("Failed to send data to server: ", error);
      notification.error({
        message: "Error",
        description: "Failed to register patient. Please try again later.",
      });
      setLoadings(false);
    }
  };

  const onEdit = (record) => {
    setIsModalOpen(true);
    setIdentificationData(record);
    setIsEditingIdentifiersModal(true);
    form2.setFieldsValue({
      CardType: record.IdentificationId,
      IdNumber: record.IdNumber,
      Key: record.key,
    });
  };

  const onDelete = (record) => {
    let identifiersArray = identifierDetails.filter((obj) => obj.key !== record.key);
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
    form2.resetFields();
    setIsModalOpen(false);
  };

  const handleSaveIdentification = () => {
    const values = form2.getFieldsValue();
    let identifiersArray = [...identifierDetails];
    if (IsEditingIdentifiersModal) {
      const existingIndex = identifiersArray.findIndex(
        (obj) => obj.key === values.Key
      );
      if (existingIndex !== -1) {
        identifiersArray[existingIndex] = {
          key: identificationData.key,
          CardType: patientDropdown.CardType.find(
            (option) => option.LookupID === values.CardType
          ).LookupDescription,
          IdentificationId: values.CardType,
          IdNumber: values.IdNumber,
        };
      }
    } else {
      const existingIndex = identifiersArray.findIndex(
        (obj) =>
          obj.IdentificationId === values.CardType &&
          obj.IdNumber === values.IdNumber
      );
      if (existingIndex === -1) {
        identifiersArray.push({
          key: identifiersArray.length + 1,
          IdentificationId: values.CardType,
          CardType: patientDropdown.CardType.find(
            (option) => option.LookupID === values.CardType
          ).LookupDescription,
          IdNumber: values.IdNumber,
        });
      }
    }
    form2.resetFields();
    setIdentifierDetails(identifiersArray);
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
      width: 100,
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
      title: (
        <span style={{ display: "flex", alignItems: "end" }}>
          Action
          <Button type="link" onClick={handleAddIdentification}>
            <IoAddCircleOutline style={{ fontSize: "1.5rem" }} />
          </Button>
        </span>
      ),
      key: "action",
      fixed: "right",
      width: "8rem",
      render: (text, record) => (
        <Space size="small" style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            size="small"
            onClick={() => onEdit(record)}
            icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
          />
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
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAddressClick = () => {
    const presentAddressFields = form.getFieldsValue([
      "presentAddress1",
      "presentCountryId",
      "presentStateId",
      "presentPlaceId",
      "presentAreaId",
      "presentPinCode",
    ]);
    form.setFieldsValue({
      permanentAddress1: presentAddressFields.presentAddress1,
      permanentCountryId: presentAddressFields.presentCountryId,
      permanentStateId: presentAddressFields.presentStateId,
      permanentPlaceId: presentAddressFields.presentPlaceId,
      permanentAreaId: presentAddressFields.presentAreaId,
      permanentPinCode: presentAddressFields.presentPinCode,
    });
  };

  const handlevisitmodal = async (record) => {
    try {
      setSelectedRecord(record);
      setIsVisitCreated(false);
      setModalLoader(true);
      const [response, response1] = await Promise.all([
        customAxios.get(
          `${urlGetEncounterDetails}?PatientId=${record.PatientId}&PatientType=0&AppointmentId=0`
        ),
        customAxios.get(
          `${urlGetPatientHeaderDetails}?PatientId=${record.PatientId}`
        ),
      ]);
      if (response.data && response1.data) {
        setPatientHeaderDetails(response1.data.data.EncounterModel);
        setVisitDropdown(response.data.data);
        form1.setFieldsValue({
          EncounterType: response.data.data.EncounterTypeId,
        });
        setIsVisitModalVisible(true);
      } else {
        message.error("Failed to fetch visit details. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching visit modal data:", error);
      message.error("An error occurred while loading visit details.");
    } finally {
      setModalLoader(false);
    }
  };

  const handleVisitModalCancel = () => {
    setIsVisitModalVisible(false);
    setIsVisitCreated(false);
    form1.resetFields();
    navigate("/patient");
  };

  const handleOk = async () => {
     debugger;
 
   
     try {
       await form1.validateFields();
       const values = form1.getFieldsValue();
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
         },
       });
   
       if (response.data != null) {
         setIsSubmitLoader(false);
         if (response.data.EncounterResult != null) {
           messageApi.warning({
             type: "warning",
             content: response.data.EncounterResult,
           });
         } else {
           const genVisitId = response.data.GeneratedEncounterId;
           setEncounterId(genVisitId);
           messageApi.open({
             type: "success",
             content: `Successfully visit created for patient.`,
           });
   
           // ✅ Navigate to CreateBilling with state
           navigate("/CreateBilling", {
             state: {
               patientId: response.data.PatientId,
               encounterId: response.data.EncounterId,
             },
           });
         }
       } else {
         setIsSubmitLoader(false);
         messageApi.open({
           type: "error",
           content: `Visit Creation Unsuccessful`,
         });
         form1.resetFields();
       }
     } catch (error) {
       setIsSubmitLoader(false);
       if (error.errorFields) {
         form1.scrollToField(error.errorFields[0].name, {
           behavior: "smooth",
         });
         message.error("Please fill all required fields.");
       } else {
         console.error("Failed to send data to server: ", error);
         message.error(`Error creating visit for patient: ${error.message}.`);
         form1.resetFields();
       }
     }
   };

  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
          padding: "0.5rem", // Responsive padding
        }}
      >
        <Spin spinning={loadings}>
          {/* <Divider orientation="left">Patient Details</Divider> */}

          <Form
            layout="vertical"
            form={form}
            name="register"
            onFinish={handleOnFinish}
            scrollToFirstError={true}
            style={{ padding: "0 1rem" }} // Responsive padding
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={18}>
                <Row gutter={[8, 8]}>
                  <Col xs={12} sm={6} md={3}>
                    <Form.Item
                      name="title"
                      label="Title"
                      rules={[{ required: true, message: "Please select title" }]}
                    >
                      <Select placeholder="Select Title" allowClear loading={isloading}>
                        {patientDropdown.Title.map((option) => (
                          <Select.Option key={option.LookupID} value={option.LookupID}>
                            {option.LookupDescription}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={7}>
                    <Form.Item
                      name="PatientFirstName"
                      label="First Name"
                      rules={[{ required: true, message: "Please add First Name" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={7}>
                    <Form.Item name="PatientMiddleName" label="Middle Name">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={7}>
                    <Form.Item
                      name="PatientLastName"
                      label="Last Name"
                      rules={[{ required: true, message: "Please add Last Name" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={6} md={3}>
                    <Form.Item
                      name="PatientGender"
                      label="Gender"
                      rules={[{ required: true, message: "Please select gender" }]}
                    >
                      <Select placeholder="Select Gender" allowClear loading={isloading}>
                        {patientDropdown.Genders.map((option) => (
                          <Select.Option key={option.LookupID} value={option.LookupID}>
                            {option.LookupDescription}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={7}>
                    <Form.Item name="BloodGroup" label="Blood Group">
                      <Select allowClear loading={isloading}>
                        {patientDropdown.BloodGroup.map((option) => (
                          <Select.Option key={option.LookupID} value={option.LookupID}>
                            {option.LookupDescription}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={7}>
                    <Form.Item
                      name="dob"
                      label="Date of Birth"
                      rules={[{ required: true, message: "Please select Date Of Birth" }]}
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
                  <Col xs={24} sm={12} md={7}>
                    <Row gutter={[8, 8]}>
                      <Col xs={8}>
                        <Form.Item
                          label="Years"
                          rules={[
                            { pattern: /^\d{2,3}$/, message: "Valid years required" },
                          ]}
                        >
                          <Input
                            style={{ width: "100%" }}
                            max={120}
                            value={age?.years}
                            onChange={handleYearsChange}
                            maxLength={3}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={8}>
                        <Form.Item label="Months">
                          <Input
                            style={{ width: "100%" }}
                            min={0}
                            max={11}
                            value={age?.months}
                            onChange={handleMonthsChange}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={8}>
                        <Form.Item label="Days">
                          <Input
                            style={{ width: "100%" }}
                            min={0}
                            max={30}
                            value={age?.days}
                            onChange={handleDaysChange}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} sm={6} md={3}>
                    <Form.Item name="titleFatherHusband" label="Title">
                      <Select allowClear loading={isloading}>
                        {patientDropdown.Title.map((option) => (
                          <Select.Option key={option.LookupID} value={option.LookupID}>
                            {option.LookupDescription}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={7}>
                    <Form.Item name="FatherHusbandName" label="Father / Spouse Name">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={7}>
                    <Form.Item name="MaritalStatus" label="Marital Status">
                      <Select allowClear loading={isloading}>
                        {patientDropdown.MaritalStatus.map((option) => (
                          <Select.Option key={option.LookupID} value={option.LookupID}>
                            {option.LookupDescription}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={7}>
                    <Row gutter={[8, 8]}>
                      <Col xs={12}>
                        <Form.Item
                          name="Height"
                          label="Height"
                          rules={[
                            { pattern: /^\d{2,3}$/, message: "Valid height required" },
                          ]}
                        >
                          <Input suffix="Cms" type="number" />
                        </Form.Item>
                      </Col>
                      <Col xs={12}>
                        <Form.Item
                          name="Weight"
                          label="Weight"
                          rules={[
                            { pattern: /^\d{1,3}$/, message: "Valid weight required" },
                          ]}
                        >
                          <Input suffix="Kgs" type="number" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={6} style={{ textAlign: "center" }}>
                <WebcamImage onImageUpload={handleImageUpload} />
              </Col>
            </Row>

            <Divider orientation="left">Contact Details</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="MobileNumber"
                  label="Mobile Number"
                  rules={[
                    { required: true, message: "Please enter mobile number" },
                    { pattern: /^\d{10}$/, message: "Enter a valid 10-digit number" },
                  ]}
                >
                  <Input maxLength={10} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="LandlineNumber"
                  label="Landline Number"
                  rules={[{ pattern: /^\d{10}$/, message: "Enter a valid 10-digit number" }]}
                >
                  <Input maxLength={10} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="EmailId"
                  label="Email Id"
                  rules={[{ type: "email", message: "Enter a valid email" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="Occupation" label="Occupation">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Divider orientation="left" style={{ margin: "0" }}>
                  Present Address
                </Divider>
                <Row gutter={[8, 8]}>
                  <Col xs={24}>
                    <Form.Item name="presentAddress1" label="Address">
                      <TextArea placeholder="Add Address" autoSize />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="presentCountryId" label="Country">
                      <Select
                        value={selectedCountry || ""}
                        onChange={handlePresentCountryChange}
                        allowClear
                        loading={isloading}
                      >
                        {patientDropdown.Countries.map((option) => (
                          <Select.Option key={option.LookupID} value={option.LookupID}>
                            {option.LookupDescription}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="presentStateId" label="State">
                      <Select
                        value={selectedState || ""}
                        onChange={handlePresentStateChange}
                        allowClear
                      >
                        {filteredStates.map((option) => (
                          <Select.Option key={option.StateID} value={option.StateID}>
                            {option.StateName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="presentPlaceId" label="City">
                      <Select
                        value={selectedCity || ""}
                        onChange={handlePresentCityChange}
                        allowClear
                      >
                        {filteredCities.map((option) => (
                          <Select.Option key={option.PlaceId} value={option.PlaceId}>
                            {option.PlaceName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="presentAreaId" label="Area">
                      <Select
                        value={selectedArea || ""}
                        onChange={(value) => setSelectedArea(value)}
                        allowClear
                      >
                        {filteredAreas.map((option) => (
                          <Select.Option key={option.AreaId} value={option.AreaId}>
                            {option.AreaName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="presentPinCode"
                      label="Pin Code"
                      rules={[{ pattern: /^\d{6}$/, message: "Invalid Pin Code" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} style={{ textAlign: "center", marginTop: "1rem" }}>
                    <Tooltip title="Permanent Address same as Present Address?">
                      <Button type="primary" size="middle" onClick={handleAddressClick}>
                        <FaAnglesRight />
                      </Button>
                    </Tooltip>
                  </Col>
                </Row>
              </Col>

              <Col xs={24} md={12}>
                <Divider orientation="left" style={{ margin: "0" }}>
                  Permanent Address
                </Divider>
                <Row gutter={[8, 8]}>
                  <Col xs={24}>
                    <Form.Item name="permanentAddress1" label="Address">
                      <TextArea placeholder="Add Address" autoSize />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="permanentCountryId" label="Country">
                      <Select
                        value={selectedCountry || ""}
                        onChange={handlePermanentCountryChange}
                        allowClear
                        loading={isloading}
                      >
                        {patientDropdown.Countries.map((option) => (
                          <Select.Option key={option.LookupID} value={option.LookupID}>
                            {option.LookupDescription}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="permanentStateId" label="State">
                      <Select
                        value={selectedState || ""}
                        onChange={handlePermanentStateChange}
                        allowClear
                      >
                        {filteredStates.map((option) => (
                          <Select.Option key={option.StateID} value={option.StateID}>
                            {option.StateName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="permanentPlaceId" label="City">
                      <Select
                        value={selectedCity || ""}
                        onChange={handleParmanentCityChange}
                        allowClear
                      >
                        {filteredCities.map((option) => (
                          <Select.Option key={option.PlaceId} value={option.PlaceId}>
                            {option.PlaceName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="permanentAreaId" label="Area">
                      <Select
                        value={selectedArea || ""}
                        onChange={(value) => setSelectedArea(value)}
                        allowClear
                      >
                        {filteredAreas.map((option) => (
                          <Select.Option key={option.AreaId} value={option.AreaId}>
                            {option.AreaName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="permanentPinCode"
                      label="Pin Code"
                      rules={[{ pattern: /^\d{6}$/, message: "Invalid Pin Code" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Divider orientation="left">Other Details</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="Religion" label="Religion">
                  <Select placeholder="Select Religion" allowClear loading={isloading}>
                    {patientDropdown.Religion.map((option) => (
                      <Select.Option key={option.LookupID} value={option.LookupID}>
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="Ethnicity" label="Ethnicity">
                  <Select allowClear loading={isloading}>
                    {patientDropdown.Ethnicity.map((option) => (
                      <Select.Option key={option.LookupID} value={option.LookupID}>
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="PrimaryLanguageId" label="Primary Language">
                  <Select allowClear loading={isloading}>
                    {patientDropdown.Language.map((option) => (
                      <Select.Option key={option.LookupID} value={option.LookupID}>
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="CanSpeakEnglish" label="Can speak English?">
                  <Select>
                    <Select.Option key="Y">Yes</Select.Option>
                    <Select.Option key="N">No</Select.Option>
                    <Select.Option key="M">Maybe</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="BirthPlace" label="Birth Place">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="birthIdentification1" label="Birth Identification 1">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="birthIdentification2" label="Birth Identification 2">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left" style={{ fontSize: "1.3rem" }}>
              Patient Identifiers
            </Divider>
            <Table
              dataSource={identifierDetails}
              columns={columns}
              size="small"
              locale={{ emptyText: "No data available" }}
              className="vitals-table"
              scroll={{ x: "max-content" }} // Responsive table scrolling
              bordered
            />

            <Row justify="end" style={{ marginTop: "1rem" }}>
              <Col style={{ marginRight: "1rem" }}>
                <Form.Item>
                  <Button type="primary" disabled={loadings} htmlType="submit" size="middle">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" danger onClick={handleReset} size="middle">
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>

      <Modal
        title="Create Identifiers"
        open={isModalOpen}
        maskClosable={false}
        footer={null}
        onCancel={handleIdentificationModalCancel}
        width="90%" // Responsive modal width
        style={{ maxWidth: "500px" }}
      >
        <Form style={{ margin: "1rem 0" }} layout="vertical" form={form2} onFinish={handleSaveIdentification}>
          <Form.Item
            name="CardType"
            label="Card Type"
            rules={[{ required: true, message: "Please select card type" }]}
          >
            <Select allowClear loading={isloading}>
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
              { min: 12, max: 12, required: true, message: "Enter a valid 12-digit number" },
            ]}
          >
            <Input style={{ width: "100%" }} placeholder="xxxx-xxxx-xxxx" />
          </Form.Item>
          <Row gutter={[8, 8]} justify="end">
            <Col>
              <Button type="primary" size="middle" htmlType="submit">
                Save
              </Button>
            </Col>
            <Col>
              <Button type="default" size="middle" danger onClick={handleIdentificationModalCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      <ConfigProvider theme={{ token: { zIndexPopupBase: 3000 } }}>
        {contextHolder}
        {isVisitModalVisible && visitsDropdown.PatientType !== undefined && (
          <VisitModal
            open={isVisitModalVisible}
            handleOk={handleOk}
            ModalLoader={ModalLoader}
            close={handleVisitModalCancel}
            IsVisitCreated={IsVisitCreated}
            patientHeaderDetails={patientHeaderDetails}
            encounterId={encounterId}
            form1={form1}
            dropdown={visitsDropdown}
            showWard={showWard}
            isCancelOrEditVisit={false}
            isCancelEncounter={false}
          />
        )}
      </ConfigProvider>
    </>
  );
};

export default NewPatient;