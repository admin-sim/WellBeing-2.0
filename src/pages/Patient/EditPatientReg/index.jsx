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
} from "antd";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaAnglesRight } from "react-icons/fa6";
import Layout from "antd/es/layout/layout";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router";

import {
  urlGetPatientDetail,
  urlAddNewPatient,
  urlGetDepartmentBasedOnPatitentType,
  urlGetProviderBasedOnDepartment,
  urlGetServiceLocationBasedonId,
  urlAddNewAndUpdatePatientIdentity,
  urlGetPatientIdentificationDetails,
  urlDeletePatientIdentification,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import WebcamImage from "../../../components/WebCam/index.jsx";
import dayjs from "dayjs";
import { DateTime } from "luxon";
import PageHeader from "../../../components/pageHeader.jsx/index.jsx";

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

  // const [departments, setDepartments] = useState([]);
  // const [providers, setProviders] = useState([]);
  // const [serviceLocations, setServiceLocations] = useState([]);
  // const [selectedPatientType, setSelectedPatientType] = useState("");
  // const [selectedDepartment, setSelectedDepartment] = useState("");
  // const [selectedProvider, setSelectedProvider] = useState("");
  // const [selectedServiceLocation, setSelectedServiceLocation] = useState("");
  const [loadings, setLoadings] = useState(false);
  const [isloading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const navigate = useNavigate();
  const [identifierDetails, setIdentifierDetails] = useState([]);
  const [IsEditingIdentifiersModal, setIsEditingIdentifiersModal] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [identificationData, setIdentificationData] = useState();
  const [patientDetails, setPatientDetails] = useState([]);
  const [dob, setDob] = useState(null);

  // useEffect(() => {
  //   setLoading(true);
  //   customAxios.get(urlGetPatientDetail).then((response) => {
  //     const apiData = response.data.data;
  //     setPatientDropdown(apiData);
  //     setLoading(false);
  //   });
  // }, []);

  const location = useLocation();
  const selectedRow = location.state.selectedRow;

  useEffect(() => {
    debugger;
    setLoading(true);
    customAxios
      .get(`${urlGetPatientDetail}?PatientId=${selectedRow.PatientId}`)
      .then((response) => {
        setLoading(false);
        const apiData = response.data.data;
        const patientData = response.data.data.AddNewPatient;
        const patientIdentificationData = response.data.data.Identifiers.map(
          (obj, index) => {
            return { ...obj, key: index + 1 };
          }
        );
        setPatientDropdown(apiData);
        setPatientDetails(patientData);
        setIdentifierDetails(patientIdentificationData);
        setFilteredStates(response.data.data.States);
        setFilteredCities(response.data.data.Places);
        setFilteredAreas(response.data.data.Areas);
        setDob(patientData.DateOfBirthstring);
        handleDateChange(patientData.DateOfBirthstring);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      dob: dayjs(patientDetails.DateOfBirthstring, "DD-MM-YYYY"),
      title: patientDetails.PatientTitle
        ? patientDetails.PatientTitle
        : undefined,
      PatientFirstName: patientDetails.PatientFirstName,
      PatientMiddleName: patientDetails.PatientMiddleName,
      PatientLastName: patientDetails.PatientLastName,

      PatientGender: patientDetails.Gender ? patientDetails.Gender : undefined,
      BloodGroup: patientDetails.BloodGroup
        ? patientDetails.BloodGroup
        : undefined,
      titleFatherHusband: patientDetails.FatherHusbandTitle,
      FatherHusbandName: patientDetails.FatherHusbandName,
      MaritalStatus: patientDetails.MaritalStatus
        ? patientDetails.MaritalStatus
        : undefined,
      Height: patientDetails.Height === 0 ? null : patientDetails.Height,
      Weight: patientDetails.Weight === 0 ? null : patientDetails.Weight,
      presentAddress1: patientDetails.PermanentAddress1,
      presentPinCode: patientDetails.PermanentPinCode
        ? patientDetails.PermanentPinCode
        : undefined,
      presentCountryId: patientDetails.PermanentCountryId
        ? patientDetails.PermanentCountryId
        : undefined,
      presentStateId: patientDetails.PermanentStateId
        ? patientDetails.PermanentStateId
        : undefined,
      presentPlaceId: patientDetails.PermanentPlaceId
        ? patientDetails.PermanentPlaceId
        : undefined,
      presentAreaId: patientDetails.PermanentAreaId
        ? patientDetails.PermanentAreaId
        : undefined,
      permanentAddress1: patientDetails.PermanentAddress1,
      permanentPinCode: patientDetails.PermanentPinCode
        ? patientDetails.PermanentPinCode
        : undefined,
      permanentCountryId: patientDetails.PermanentCountryId
        ? patientDetails.PermanentCountryId
        : undefined,
      permanentStateId: patientDetails.PermanentStateId
        ? patientDetails.PermanentStateId
        : undefined,
      permanentPlaceId: patientDetails.PermanentPlaceId
        ? patientDetails.PermanentPlaceId
        : undefined,
      permanentAreaId: patientDetails.PermanentAreaId
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
      birthIdentification1: patientDetails.BirthIdentification1,
      birthIdentification2: patientDetails.BirthIdentification2,
    });
  }, [patientDetails]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (selectedPatientType) {
  //       try {
  //         const response = await customAxios.get(
  //           `${urlGetDepartmentBasedOnPatitentType}?PatientType=${selectedPatientType}`
  //         );
  //         if (response.status === 200) {
  //           const dept = response.data.data.Department;
  //           setDepartments(dept);
  //         } else {
  //           console.error("Failed to fetch departments");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching departments:", error);
  //       }
  //     } else {
  //       // Reset the department dropdown if no patient type is selected
  //       setDepartments([]);
  //       setSelectedDepartment("");
  //     }
  //   };

  //   fetchData();
  // }, [selectedPatientType, setSelectedDepartment, setDepartments]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Fetch data for the "provider" and "servicelocation" dropdowns when "selectedDepartment" changes
  //     if (selectedDepartment) {
  //       try {
  //         const providerResponse = await customAxios.get(
  //           `${urlGetProviderBasedOnDepartment}?DepartmentId=${selectedDepartment}`
  //         );
  //         const serviceLocationResponse = await customAxios.get(
  //           `${urlGetServiceLocationBasedonId}?DepartmentId=${selectedDepartment}&patienttype=${selectedPatientType}`
  //         );

  //         if (providerResponse.status === 200) {
  //           const provider = providerResponse.data.data.Provider;
  //           setProviders(provider);
  //         } else {
  //           console.error("Failed to fetch providers");
  //         }

  //         if (serviceLocationResponse.status === 200) {
  //           const serviceloc =
  //             serviceLocationResponse.data.data.ServiceLocation;
  //           setServiceLocations(serviceloc);
  //         } else {
  //           console.error("Failed to fetch service locations");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     } else {
  //       // Reset the provider and servicelocation dropdowns if no department is selected
  //       setProviders([]);
  //       setServiceLocations([]);
  //       setSelectedProvider("");
  //       setSelectedServiceLocation("");
  //     }
  //   };

  //   fetchData();
  // }, [selectedDepartment, selectedPatientType]);

  const handleImageUpload = (base64data) => {
    setUploadedImage(base64data);
    console.log(base64data);
  };
  //Default Patient data

  const disabledDate = (current) => {
    // Disable dates that are in the future
    return current && current > new Date();
  };

  const handleDateChange = (date, dateString) => {
    debugger;

    if (date && dateString !== undefined) {
      setselecteddob(dateString);
      setSelectedDate(date);
      const now = DateTime.now();
      const birthDate = DateTime.fromJSDate(date.toDate());
      const diff = now.diff(birthDate, ["years", "months", "days"]).toObject();

      setAge({
        years: Math.floor(diff.years),
        months: Math.floor(diff.months),
        days: Math.floor(diff.days),
      });
    } else {
      setselecteddob(date);
      setAge({ years: 0, months: 0, days: 0 });
    }
  };

  const handleYearsChange = (e) => {
    const years = parseInt(e.target.value, 10) || 0;
    console.log(typeof years);
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

    // Period to subtract
    const yearsToSubtract = years;
    const monthsToSubtract = months;
    const daysToSubtract = days;

    // Create a new date object from today
    let newDate = new Date(today);

    // Subtract years
    newDate.setFullYear(newDate.getFullYear() - yearsToSubtract);

    // Subtract months
    newDate.setMonth(newDate.getMonth() - monthsToSubtract);

    // Subtract days
    newDate.setDate(newDate.getDate() - daysToSubtract);

    form.setFieldValue("dob", dayjs(newDate));
    setSelectedDate(dayjs(newDate).format("DD-MM-YYYY"));
    setselecteddob(dayjs(newDate).format("DD-MM-YYYY"));
  };

  const handlePresentCountryChange = (newCountry) => {
    // form.resetFields(["state", "city", area]);
    form.setFieldsValue({
      presentCountryId: newCountry,
      presentStateId: undefined,
      presentPlaceId: undefined,
      presentAreaId: undefined,
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
  const handlePermanentCountryChange = (newCountry) => {
    // form.resetFields(["state", "city", area]);
    form.setFieldsValue({
      permanentCountryId: newCountry,
      permanentStateId: undefined,
      permanentPlaceId: undefined,
      permanentAreaId: undefined,
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
      // Filter cities based on the selected state
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
      // Filter cities based on the selected state
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
      // Filter cities based on the selected state
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
      // Filter cities based on the selected state
      const areasForCities = patientDropdown.Areas.filter(
        (area) => area.PlaceId === newCity
      );
      setFilteredAreas(areasForCities);
    }
  };

  const handleSearchToVisit = () => {
    const url = `/patient/NewVisit`;
    // Navigate to the new URL
    navigate(url);
  };

  const handleOnFinish = async (values) => {
    debugger;
    setLoadings(true);
    console.log("Received values from form: ", values);

    values.dob = selecteddob;
    const patient = {
      PatientId: patientDetails.PatientId,
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
      // PhotoUrl: uploadedImage,
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
      patient: patient,
    };

    console.log("post data", postData);

    try {
      // Send a POST request to the server
      const response = await customAxios.post(urlAddNewPatient, postData);

      if (response.data != null) {
        if (response.data === false) {
          setLoadings(false);
          notification.error({
            message: "Error",
            description: "Failed to register patient. Please try again later.",
          });
        } else {
          // Display success notification
          notification.success({
            message: "Patient details updated Successful",
            description: `The patient details have been successfully registered`,
          });
          handleSearchToVisit();
          setLoadings(false);
        }
      }

      // Process the response data (this assumes the server responds with JSON)
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
            setIdentifierDetails(identifiers);
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
    form.resetFields();
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
          setIdentifierDetails(identificationDetails);
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
    } finally {
      form2.resetFields();
    }
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
      dataIndex: "IdentificationName",
      key: "IdentificationName",
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
        <Space
          size="small"
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
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
            ></Button>
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

  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader
          title="Edit Patient Details"
          buttonLabel=" Search Patient"
          buttonIcon={<SearchOutlined />}
          onButtonClick={handleSearchToVisit}
        />
        <Spin spinning={loadings}>
          <Divider orientation="left">Patient Details</Divider>

          <Form
            layout="vertical"
            form={form}
            name="register"
            onFinish={handleOnFinish}
            scrollToFirstError={true}
            style={{ padding: "0rem 2rem" }}
            initialValues={{
              dob: dayjs(patientDetails.DateOfBirthstring, "DD-MM-YYYY"),
              title: patientDetails.PatientTitle
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
              titleFatherHusband: patientDetails.FatherHusbandTitle,
              FatherHusbandName: patientDetails.FatherHusbandName,
              MaritalStatus: patientDetails.MaritalStatus
                ? patientDetails.MaritalStatus
                : undefined,
              Height: patientDetails.Height,
              Weight: patientDetails.Weight,
              presentAddress1: patientDetails.PermanentAddress1,
              presentPinCode: patientDetails.PermanentPinCode
                ? patientDetails.PermanentPinCode
                : undefined,
              presentCountryId: patientDetails.PermanentCountryId
                ? patientDetails.PermanentCountryId
                : undefined,
              presentStateId: patientDetails.PermanentStateId
                ? patientDetails.PermanentStateId
                : undefined,
              presentPlaceId: patientDetails.PermanentPlaceId
                ? patientDetails.PermanentPlaceId
                : undefined,
              presentAreaId: patientDetails.PermanentAreaId
                ? patientDetails.PermanentAreaId
                : undefined,
              permanentAddress1: patientDetails.PermanentAddress1,
              permanentPinCode: patientDetails.PermanentPinCode
                ? patientDetails.PermanentPinCode
                : undefined,
              permanentCountryId: patientDetails.PermanentCountryId
                ? patientDetails.PermanentCountryId
                : undefined,
              permanentStateId: patientDetails.PermanentStateId
                ? patientDetails.PermanentStateId
                : undefined,
              permanentPlaceId: patientDetails.PermanentPlaceId
                ? patientDetails.PermanentPlaceId
                : undefined,
              permanentAreaId: patientDetails.PermanentAreaId
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
              birthIdentification1: patientDetails.BirthIdentification1,
              birthIdentification2: patientDetails.BirthIdentification2,
            }}
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
                      <Select
                        placeholder="Select Title"
                        allowClear
                        loading={isloading}
                      >
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
                      <Select
                        placeholder="Select Gender"
                        allowClear
                        loading={isloading}
                      >
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
                      <Select allowClear loading={isloading}>
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
                            max={120}
                            value={age?.years}
                            onChange={handleYearsChange}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Months">
                          <Input
                            style={{ width: "100%" }}
                            // placeholder="Years"
                            onChange={handleMonthsChange}
                            min={0}
                            max={11}
                            value={age?.months}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Days">
                          <Input
                            style={{ width: "100%" }}
                            // placeholder=""
                            min={0}
                            max={30}
                            value={age?.days}
                            onChange={handleDaysChange}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={3}>
                    <Form.Item name="titleFatherHusband" label="Title">
                      <Select allowClear loading={isloading}>
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
                      <Select allowClear loading={isloading}>
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
                              message: "Please enter valid input for weight",
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

            <Divider />
            <Row gutter={32}>
              <Col span={12}>
                <Divider orientation="left" style={{ margin: "0" }}>
                  Present Address
                </Divider>
                <Row gutter={32}>
                  <Col span={24}>
                    <Form.Item name="presentAddress1" label="Address">
                      <TextArea placeholder="Add Address" autoSize />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="presentCountryId" label="Country">
                      <Select
                        value={selectedCountry || ""}
                        onChange={handlePresentCountryChange}
                        allowClear
                        loading={isloading}
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
                  <Col span={12}>
                    <Form.Item name="presentStateId" label="State">
                      <Select
                        value={selectedState || ""}
                        onChange={handlePresentStateChange}
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
                  <Col span={12}>
                    <Form.Item name="presentPlaceId" label="City">
                      <Select
                        value={selectedCity || ""}
                        onChange={handlePresentCityChange}
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
                  <Col span={12}>
                    <Form.Item name="presentAreaId" label="Area">
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
                  <Col span={12}>
                    <Form.Item
                      name="presentPinCode"
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
                  <Col
                    offset={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "1.5rem",
                    }}
                  >
                    <Tooltip title="Permanent Address same as Present Address?">
                      <Button
                        type="primary"
                        size="middle"
                        onClick={handleAddressClick}
                      >
                        <FaAnglesRight />
                      </Button>
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Divider orientation="left" style={{ margin: "0" }}>
                  Permanent Address
                </Divider>
                <Row gutter={32}>
                  <Col span={24}>
                    <Form.Item name="permanentAddress1" label="Address">
                      <TextArea placeholder="Add Address" autoSize />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="permanentCountryId" label="Country">
                      <Select
                        value={selectedCountry || ""}
                        onChange={handlePermanentCountryChange}
                        allowClear
                        loading={isloading}
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
                  <Col span={12}>
                    <Form.Item name="permanentStateId" label="State">
                      <Select
                        value={selectedState || ""}
                        onChange={handlePermanentStateChange}
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
                  <Col span={12}>
                    <Form.Item name="permanentPlaceId" label="City">
                      <Select
                        value={selectedCity || ""}
                        onChange={handleParmanentCityChange}
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
                  <Col span={12}>
                    <Form.Item name="permanentAreaId" label="Area">
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
                  <Col span={12}>
                    <Form.Item
                      name="permanentPinCode"
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
              </Col>
            </Row>
            <Divider orientation="left">Contact Details</Divider>
            <Row gutter={32}>
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
                      pattern: new RegExp(/^\d{10}$/),
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
            <Divider orientation="left">Other Details</Divider>
            <Row gutter={32}>
              <Col span={6}>
                <Form.Item name="Religion" label="Religion">
                  <Select
                    placeholder="Select Religion"
                    allowClear
                    loading={isloading}
                  >
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
                  <Select allowClear loading={isloading}>
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
                  <Select allowClear loading={isloading}>
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
                  name="birthIdentification1"
                  label="Birth Identification 1"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="birthIdentification2"
                  label="Birth Identification 2"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* <div
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
              </div> */}
            <Divider orientation="left" style={{ fontSize: "1.3rem" }}>
              Patient Identifiers
            </Divider>
            <Table
              dataSource={identifierDetails}
              columns={columns}
              size="small"
              locale={{ emptyText: "No data available" }}
              className="vitals-table"
              scroll={{ x: 1000 }}
              bordered
            />
            <Row justify="end" style={{ marginTop: "1rem" }}>
              <Col style={{ marginRight: "1rem" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="middle">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button
                    type="primary"
                    danger
                    onClick={handleReset}
                    size="middle"
                  >
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
      >
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={form2}
          onFinish={handleSaveIdentification}
        >
          <Form.Item
            style={{ marginBottom: "1rem" }}
            name="CardType"
            label="Card Type"
            rules={[
              {
                required: true,
                message: "Please select card type",
              },
            ]}
          >
            <Select allowClear loading={isloading} disabled={IsEditingIdentifiersModal}>
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
                message: "Please enter card number",
              },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>

          <Row gutter={32} style={{ height: "1rem" }} justify={"end"}>
            <Col>
              <Form.Item>
                <Button type="primary" size="middle" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button
                  type="default"
                  size="middle"
                  danger
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
