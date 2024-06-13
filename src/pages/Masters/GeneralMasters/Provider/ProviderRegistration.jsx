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
  Popconfirm,
  Checkbox,
  Card,
  Space,
  Table,
  Modal,
} from "antd";
import Layout from "antd/es/layout/layout";
import {
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router";
const { Option } = Select;
import {
  urlGetProviderDetails,
  urlGetStatesBasedOnCountryId,
  urlGetPlacesBasedOnStateId,
  urlGetAreasBasedOnPlaceId,
  urlAddNewAndUpdateProvider,
  urlAddNewAndUpdateProviderIdentification,
  urlGetProviderIdentificationDetails,
  urlDeleteProviderIdentification,
  urlAddNewAndUpdateProviderCredential,
  urlGetProviderCredentialDetails,
  urlDeleteProviderCredential,
} from "../../../../../endpoints.js";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import WebcamImage from "../../../../components/WebCam/index.jsx";
import dayjs from "dayjs";
//import "../../../Patient/style.css"

const Provider = () => {
  const [providerDropdown, setProviderDropdown] = useState({
    Titles: [],
    Genders: [],
    BloodGroup: [],
    MaritalStatus: [],
    Countries: [],
    States: [],
    Places: [],
    Areas: [],
    VisitType: [],
    Religion: [],
    Ethnicity: [],
    Language: [],
    CardType: [],
    StructuralRoles: [],
    ConsultantType: [],
    ProviderCredentialType: [],
    ProviderIdentificationType: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [places, setPlaces] = useState([]);
  const [areas, setAreas] = useState([]);
  const [permanentStates, setPermanentStates] = useState([]);
  const [permanentPlaces, setPermanentPlaces] = useState([]);
  const [permanentAreas, setPermanentAreas] = useState([]);
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [IsIdentifiersModalOpen, setIsIdentifiersModalOpen] = useState(false);
  const [IsCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [identificationData, setIdentificationData] = useState();
  const [credentialData, setCredentialData] = useState();
  const [IsEditingIdentifiersModal, setIsEditingIdentifiersModal] =
    useState(false);
  const [IsEditingCredentialsModal, setIsEditingCredentialsModal] =
    useState(false);
  const [identifierDetails, setIdentifierDetails] = useState([]);
  const [credentialsDetails, setCredentialsDetails] = useState([]);
  const [expiryDate, setExpiryDate] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [form] = Form.useForm();
  const [credentialForm] = Form.useForm();
  const [identifierForm] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditProviderRegistration, setIsEditProviderRegistration] =
    useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState();
  const [providerDetails, setProviderDetails] = useState([]);

  useEffect(() => {
    debugger;

    // Determine edit mode based on location.state
    const isEdit =
      location.state !== null && location.state.isEditProviderRegistration;
    const providerId = isEdit ? location.state.selectedRow.ProviderId : null;

    // Update state based on edit mode
    setSelectedProviderId(isEdit ? providerId : null);
    setIsEditProviderRegistration(isEdit);

    // Fetch provider details (conditional based on edit mode)
    setIsLoading(true);
    if (isEdit) {
      customAxios
        .get(`${urlGetProviderDetails}?ProviderId=${providerId}`)
        .then((response) => {
          const apiData = response.data.data;
          const providerIdentificationData =
            response.data.data.ProviderIdentifications.map((obj, index) => {
              return { ...obj, key: index + 1 };
            });
          const providerCredentialData =
            response.data.data.ProviderCredentials.map((obj, index) => {
              return { ...obj, key: index + 1 };
            });
          console.log(response.data.data);
          setProviderDropdown(apiData);
          setProviderDetails(response.data.data.AddNewProvider);
          setIdentifierDetails(providerIdentificationData);
          setCredentialsDetails(providerCredentialData);
          setStates(response.data.data.PresentStates);
          setPlaces(response.data.data.PresentPlaces);
          setAreas(response.data.data.PresentAreas);
          setPermanentStates(response.data.data.PermanentStates);
          setPermanentPlaces(response.data.data.PermanentPlaces);
          setPermanentAreas(response.data.data.PermanentAreas);
          setIsSameAddress(false);
          setIsLoading(false);
        });
    } else {
      customAxios.get(urlGetProviderDetails).then((response) => {
        const apiData = response.data.data;
        setProviderDropdown(apiData);
        setIsSameAddress(false);
        setIsLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (isEditProviderRegistration && providerDetails) {
      form.setFieldsValue({
        title: providerDetails.ProviderTitle || null,
        PatientFirstName: providerDetails.ProviderFirstName || null,
        PatientMiddleName: providerDetails.ProviderMiddleName || null,
        PatientLastName: providerDetails.ProviderLastName || null,
        PatientGender: providerDetails.Gender || null,
        Qualification: providerDetails.Qualification || null,
        dob: providerDetails.Dob ? dayjs(providerDetails.Dob) : null,
        structuralRole: providerDetails.StructuralRoleId || null,
        consultantType: providerDetails.ConsultantTypeId || null,
        PresentAddress: providerDetails.PresentAddress1 || null,
        PresentCountry: providerDetails.PresentCountryId || null,
        PresentState: providerDetails.PresentStateId || null,
        PresentCity: providerDetails.PresentPlaceId || null,
        PresentArea: providerDetails.PresentAreaId || null,
        PresentPinCode: providerDetails.PresentPin || null,
        PermanentAddress: providerDetails.PermanentAddress1 || null,
        PermanentCountry: providerDetails.PermanentCountryId || null,
        PermanentState: providerDetails.PermanentStateId || null,
        PermanentCity: providerDetails.PermanentPlaceId || null,
        PermanentArea: providerDetails.PermanentAreaId || null,
        PermanentPinCode: providerDetails.PermanentPin || null,
        MobileNumber: providerDetails.MobileNumber || null,
        LandlineNumber: providerDetails.LandlineNumber || null,
        EmailId: providerDetails.EmailId || null,
      });
    }
  }, [isEditProviderRegistration, providerDetails, form]);

  const searchProvider = () => {
    const url = `/Provider/Search`;
    // Navigate to the new URL
    navigate(url);
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleOnFinish = async (values) => {
    debugger;
    console.log("Received values from form: ", values);

    const patientDetails = isEditProviderRegistration
      ? {
          ProviderId: providerDetails.ProviderId,
          ProviderTitle: values.title,
          ProviderFirstName: values.PatientFirstName,
          ProviderMiddleName:
            values.PatientMiddleName === undefined
              ? null
              : values.PatientMiddleName,
          ProviderLastName: values.PatientLastName,
          Gender: values.PatientGender,
          FacilityId: 1,
          Qualification:
            values.Qualification === undefined ? null : values.Qualification,
          DateOfBirth: values.dob,
          StructuralRoleId: values.structuralRole,
          ConsultantTypeId: values.consultantType,
          PresentAddress1:
            values.PresentAddress === undefined ? null : values.PresentAddress,
          PresentCountryId: values.PresentCountry,
          PresentStateId: values.PresentState,
          PresentPlaceId: values.PresentCity,
          PresentAreaId:
            values.PresentArea === undefined ? null : values.PresentArea,
          PresentPin:
            values.PresentPinCode === undefined ? null : values.PresentPinCode,
          PermanentAddress1:
            values.PermanentAddress === undefined
              ? null
              : values.PermanentAddress,
          PermanentCountryId: values.PermanentCountry,
          PermanentStateId: values.PermanentState,
          PermanentPlaceId: values.PermanentCity,
          PermanentAreaId:
            values.PermanentArea === undefined ? null : values.PermanentArea,
          PermanentPin:
            values.PermanentPinCode === undefined
              ? null
              : values.PresentPinCode,

          MobileNumber: values.MobileNumber,
          LandlineNumber:
            values.LandlineNumber === "" ? null : values.LandlineNumber,
          EmailId: values.EmailId === undefined ? null : values.EmailId,
        }
      : {
          ProviderId: 0,
          ProviderTitle: values.title,
          ProviderFirstName: values.PatientFirstName,
          ProviderMiddleName:
            values.PatientMiddleName === undefined
              ? null
              : values.PatientMiddleName,
          ProviderLastName: values.PatientLastName,
          Gender: values.PatientGender,
          FacilityId: 1,
          Qualification:
            values.Qualification === undefined ? null : values.Qualification,
          DateOfBirth: values.Dob,
          StructuralRoleId: values.structuralRole,
          ConsultantTypeId: values.consultantType,
          PresentAddress1:
            values.PresentAddress === undefined ? null : values.PresentAddress,
          PresentCountryId: values.PresentCountry,
          PresentStateId: values.PresentState,
          PresentPlaceId: values.PresentCity,
          PresentAreaId:
            values.PresentArea === undefined ? null : values.PresentArea,
          PresentPin:
            values.PresentPinCode === undefined ? null : values.PresentPinCode,
          PermanentAddress1:
            values.PermanentAddress === undefined
              ? null
              : values.PermanentAddress,
          PermanentCountryId: values.PermanentCountry,
          PermanentStateId: values.PermanentState,
          PermanentPlaceId: values.PermanentCity,
          PermanentAreaId:
            values.PermanentArea === undefined ? null : values.PermanentArea,
          PermanentPin:
            values.PermanentPinCode === undefined
              ? null
              : values.PresentPinCode,

          MobileNumber: values.MobileNumber,
          LandlineNumber:
            values.LandlineNumber === "" ? null : values.LandlineNumber,
          EmailId: values.EmailId === undefined ? null : values.EmailId,
        };

    const postData = {
      AddNewProvider: patientDetails,
      ProviderCredentials: credentialsDetails,
      ProviderIdentifications: identifierDetails,
    };

    try {
      // Send a POST request to the server
      const response = await customAxios.post(
        urlAddNewAndUpdateProvider,
        postData
      );

      // Check if the request was successful
      if (response.status !== 200) {
        throw new Error(`Server responded with status code ${response.status}`);
      }

      if (response.data !== null) {
        if (isEditProviderRegistration) {
          if (response.data === "Success") {
            // Display success notification
            notification.success({
              message: "Provider details updated Successfully",
            });
            searchProvider();
          }
        } else {
          // Process the response data (this assumes the server responds with JSON)
          const data = response.data.data.AddNewProvider.ProviderId;

          if (data > 0) {
            // Display success notification
            notification.success({
              message: "Provider Registration Successful",
            });
            searchProvider();
          }
        }
      }

      // setLoadings(false);
    } catch (error) {
      // Display error notification
      if (isEditProviderRegistration) {
        notification.error({
          message: "Error",
          description:
            "Failed to edit provider details. Please try again later.",
        });
      }

      notification.error({
        message: "Error",
        description: "Failed to register provider. Please try again later.",
      });
    }
  };

  const handleCheckBox = (checked) => {
    debugger;
    const getAddressValues = form.getFieldsValue();
    setIsSameAddress(e.target.checked);
    if (e.target.checked) {
      form.setFieldsValue({
        PermanentAddress: getAddressValues.PresentAddress,
        PermanentCountry: getAddressValues.PresentCountry,
        PermanentState: getAddressValues.PresentState,
        PermanentCity: getAddressValues.PresentCity,
        PermanentArea: getAddressValues.PresentArea,
        PermanentPinCode: getAddressValues.PresentPinCode,
      });
    } else {
      form.setFieldsValue({
        PermanentAddress: null,
        PermanentCountry: null,
        PermanentState: null,
        PermanentCity: null,
        PermanentArea: null,
        PermanentPinCode: null,
      });
      setPermanentAreas([]);
      setPermanentPlaces([]);
      setPermanentStates([]);
    }

    console.log(getAddressValues);
  };

  const handleCountriesChange = async (value, isPermanent) => {
    // setCountrySelectValue(value);
    debugger;

    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        const response = await customAxios.get(
          `${urlGetStatesBasedOnCountryId}?CountryId=${value}`
        );
        if (response.status === 200) {
          const states = response.data.data.States;

          if (isPermanent) {
            form.setFieldsValue({
              PermanentState: null,
              PermanentCity: null,
              PermanentArea: null,
            });
            setPermanentStates(states);
            setPermanentPlaces([]);
            setPermanentAreas([]);
          } else {
            form.setFieldsValue({
              PresentState: null,
              PresentCity: null,
              PresentArea: null,
            });
            setStates(states);
            setPlaces([]);
            setAreas([]);
          }
        }
      } else {
        if (isPermanent) {
          setPermanentStates([]);
          setPermanentPlaces([]);
          setPermanentAreas([]);
          form.setFieldsValue({
            PermanentState: null,
            PermanentCity: null,
            PermanentArea: null,
          });
        } else {
          setStates([]);
          setPlaces([]);
          setAreas([]);
          form.setFieldsValue({
            PresentState: null,
            PresentCity: null,
            PresentArea: null,
          });
        }
        // form.resetFields();
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handleStatesChange = async (value, isPermanent) => {
    // setCountrySelectValue(value);
    debugger;
    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        const response = await customAxios.get(
          `${urlGetPlacesBasedOnStateId}?StateId=${value}`
        );
        if (response.status === 200) {
          const places = response.data.data.Places;

          if (isPermanent) {
            setPermanentPlaces(places);
            setPermanentAreas([]);
            form.setFieldsValue({ PermanentCity: null, PermanentArea: null });
          } else {
            setPlaces(places);
            setAreas([]);
            form.setFieldsValue({ PresentCity: null, PresentArea: null });
          }
        }
      } else {
        if (isPermanent) {
          setPermanentPlaces([]);
          setPermanentAreas([]);
          form.setFieldsValue({ PermanentCity: null, PermanentArea: null });
        } else {
          setPlaces([]);
          setAreas([]);
          form.setFieldsValue({ PresentCity: null, PresentArea: null });
        }
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handlePlacesChange = async (value, isPermanent) => {
    // setCountrySelectValue(value);
    debugger;
    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        const response = await customAxios.get(
          `${urlGetAreasBasedOnPlaceId}?PlaceId=${value}`
        );
        if (response.status === 200) {
          const areas = response.data.data.AreaModel;

          if (isPermanent) {
            setPermanentAreas(areas);
            form.setFieldsValue({ PermanentArea: null });
          } else {
            setAreas(areas);
            form.setFieldsValue({ PresentArea: null });
          }
        }
      } else {
        if (isPermanent) {
          setPermanentAreas([]);
          form.setFieldsValue({ PermanentArea: null });
        } else {
          setAreas([]);
          form.setFieldsValue({ PresentArea: null });
        }

        // form.resetFields();
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handleExpiryDate = (date, dateString) => {
    debugger;
    setExpiryDate(dateString);
  };

  const handleDateOfBirth = (date, dateString) => {
    debugger;
    setDateOfBirth(dateString);
  };

  //editing the details from credential table
  const onEditCredential = (record) => {
    debugger;
    console.log("identifier record", record);

    if (isEditProviderRegistration) {
      customAxios
        .get(
          `${urlGetProviderCredentialDetails}?ProviderCredentialId=${record.ProviderCredentialId}`
        )
        .then((response) => {
          if (response.data !== null) {
            setIsCredentialsModalOpen(true);
            setIsEditingCredentialsModal(true);
            const credentialData = response.data.data.ProviderCredentialModel;

            setCredentialData(credentialData);
            credentialForm.setFieldsValue({
              CredentialType: credentialData.CredentialId,
              ReferenceNo: credentialData.ReferenceNo,
              Remarks: credentialData.Remarks,
              Status: credentialData.Status,
            });
          }
        });
    } else {
      setIsCredentialsModalOpen(true);
      setCredentialData(record);
      setIsEditingCredentialsModal(true);
      credentialForm.setFieldsValue({
        CredentialType: record.CredentialId,
        ReferenceNo: record.ReferenceNo,
        Remarks: record.Remarks,
        Status: record.Status,
        Key: record.key,
      });
    }
  };

  //editing the details from credential table
  const onEditIdentification = (record) => {
    debugger;
    if (isEditProviderRegistration) {
      customAxios
        .get(
          `${urlGetProviderIdentificationDetails}?ProviderIdentityId=${record.ProviderIdentityId}`
        )
        .then((response) => {
          if (response.data !== null) {
            setIsIdentifiersModalOpen(true);
            setIsEditingIdentifiersModal(true);
            const identificationData =
              response.data.data.ProviderIdentificationModel;
            setIdentificationData(identificationData);
            identifierForm.setFieldsValue({
              IdentificationType: identificationData.IdentificationId,
              IdentityReferenceNo: identificationData.IdentityReferenceNo,
              // ExpiryDate: identificationData.ExpiryDate,
              ExpiryDate: identificationData.ExpiryDateString
                ? dayjs(identificationData.ExpiryDateString, "DD-MM-YYYY")
                : null,

              IdentityRemarks: identificationData.IdentityRemarks,
              IdentityStatus: identificationData.IdentityStatus,
            });
          }
        });
    } else {
      console.log("identifier record", record);
      setIsIdentifiersModalOpen(true);
      setIdentificationData(record);
      setIsEditingIdentifiersModal(true);
      identifierForm.setFieldsValue({
        IdentificationType: record.IdentificationId,
        IdentityReferenceNo: record.IdentityReferenceNo,
        ExpiryDate: dayjs(record.ExpiryDateString, "DD-MM-YYYY"),
        IdentityRemarks: record.IdentityRemarks,
        IdentityStatus: record.IdentityStatus,
        Key: record.key,
      });
    }
  };

  //Deleting  the details from credential table
  const onDeleteCredential = (record) => {
    // (int ProviderIdentityId, long ProviderId)
    // int ProviderCredentialId, long ProviderId)
    debugger;
    console.log("credential record", record);
    if (isEditProviderRegistration) {
      customAxios
        .delete(
          `${urlDeleteProviderCredential}?ProviderCredentialId=${record.ProviderCredentialId}&ProviderId=${record.ProviderId}`
        )
        .then((response) => {
          if (
            response.data != null &&
            Array.isArray(response.data.data.ProviderCredentials)
          ) {
            const credentialDetails =
              response.data.data.ProviderCredentials.map((obj, index) => {
                return { ...obj, key: index + 1 };
              });
            setCredentialsDetails(credentialDetails);
          } else {
            // Handle case when ProviderCredentialModel is not an array
            setCredentialsDetails([]);
          }
        });
    } else {
      // Filter out the entry to be deleted
      let credentialsArray = credentialsDetails.filter(
        (obj) => obj.key !== record.key
      );

      // Reorder the key values of the remaining entries
      credentialsArray = credentialsArray.map((obj, index) => ({
        ...obj,
        key: index + 1,
      }));

      setCredentialsDetails(credentialsArray);
    }
  };

  //Deleting  the details from credential table
  const onDeleteIdentification = (record) => {
    debugger;
    console.log("identifier record", record);
    if (isEditProviderRegistration) {
      customAxios
        .delete(
          `${urlDeleteProviderIdentification}?ProviderIdentityId=${record.ProviderIdentityId}&ProviderId=${record.ProviderId}`
        )
        .then((response) => {
          if (
            response.data != null &&
            Array.isArray(response.data.data.ProviderIdentifications)
          ) {
            const identificationsDetails =
              response.data.data.ProviderIdentifications.map((obj, index) => {
                return { ...obj, key: index + 1 };
              });
            setIdentifierDetails(identificationsDetails);
          } else {
            // Handle case when ProviderCredentialModel is not an array
            setIdentifierDetails([]);
          }
        });
    } else {
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
    }
  };

  //Opening the Modal for adding the Credentials
  const handleAddCredential = () => {
    setIsCredentialsModalOpen(true);
    setIsEditingCredentialsModal(false);
    credentialForm.resetFields();
  };

  //Opening the Modal for adding the Credentials
  const handleAddIdentification = () => {
    setIsIdentifiersModalOpen(true);
    setIsEditingIdentifiersModal(false);
    identifierForm.resetFields();
  };

  //Closing the credential modal
  const handleCredentialsModalClose = () => {
    setIsCredentialsModalOpen(false);
  };

  //Closing the credential modal
  const handleIdentifierModalClose = () => {
    setIsIdentifiersModalOpen(false);
  };

  //Saving the details of credentials
  const handleSaveCredentials = async () => {
    debugger;
    const values = credentialForm.getFieldsValue();
    console.log("To save Identification", values);
    if (isEditProviderRegistration) {
      const credential = IsEditingCredentialsModal
        ? {
            ProviderId: providerDetails.ProviderId,
            ProviderCredentialId: credentialData.ProviderCredentialId,
            CredentialId: credentialData.CredentialId,
            ReferenceNo: values.ReferenceNo,
            Remarks: values.Remarks,
            Status: values.Status,
          }
        : {
            ProviderCredentialId: 0,
            ProviderId: selectedProviderId,
            CredentialId: values.CredentialType,
            ReferenceNo: values.ReferenceNo,
            Remarks: values.Remarks,
            Status: values.Status,
          };

      try {
        // Send a POST request to the server
        const response = await customAxios.post(
          urlAddNewAndUpdateProviderCredential,
          credential,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data !== null) {
          if (response.data === "AlreadyExists") {
            notification.warning({
              message: "Provider credential already exists",
            });
          } else {
            setIsCredentialsModalOpen(false);
            const credentialDetails =
              response.data.data.ProviderCredentials.map((obj, index) => {
                return { ...obj, key: index + 1 };
              });
            setCredentialsDetails(credentialDetails);
            {
              IsEditingCredentialsModal
                ? notification.success({
                    message: "Provider credential details updated Successfully",
                  })
                : notification.success({
                    message: "Provider credential details added Successfully",
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
    } else {
      // Get a copy of the current identifierDetails
      let credentialsArray = [...credentialsDetails];
      if (IsEditingCredentialsModal) {
        const existingIndex = credentialsArray.findIndex(
          (obj) => obj.key === values.Key
        );

        // If the record exists, update it
        if (existingIndex !== -1) {
          credentialsArray[existingIndex] = {
            key: credentialData.key,
            CredentialTypeName: providerDropdown.ProviderCredentialType.find(
              (option) => option.LookupID === values.CredentialType
            ).LookupDescription,
            CredentialId: values.CredentialType,
            ReferenceNo: values.ReferenceNo,
            Remarks: values.Remarks,
            Status: values.Status,
          };
          credentialForm.resetFields();
        }
      } else {
        Object.entries(values).forEach(([key, value]) => {
          const existingIndex = credentialsArray.findIndex(
            (obj) =>
              obj.CredentialId === values.CredentialType &&
              obj.ReferenceNo === values.ReferenceNo &&
              obj.Status === values.Status &&
              obj.remarks === values.remarks
          );
          if (existingIndex === -1) {
            credentialsArray.push({
              key: credentialsArray.length + 1, // incrementing the key value for each new entry
              CredentialId: values.CredentialType,
              CredentialTypeName: providerDropdown.ProviderCredentialType.find(
                (option) => option.LookupID === values.CredentialType
              ).LookupDescription,
              ReferenceNo: values.ReferenceNo,
              Remarks: values.Remarks,
              Status: values.Status,
            });
          }
        });
        credentialForm.resetFields();
      }

      setCredentialsDetails(credentialsArray);
      setIsCredentialsModalOpen(false);
    }
  };

  //Saving the details of credentials
  const handleSaveIdentification = async () => {
    debugger;
    const values = identifierForm.getFieldsValue();
    console.log("To save Identification", values);
    if (isEditProviderRegistration) {
      const identification = IsEditingIdentifiersModal
        ? {
            ProviderIdentityId: identificationData.ProviderIdentityId,
            ProviderId: providerDetails.ProviderId,
            IdentificationId: identificationData.IdentificationId,
            IdentityReferenceNo: values.IdentityReferenceNo,
            ExpiryDateString: expiryDate === undefined ? null : expiryDate,
            ExpiryDate: values.ExpiryDate,
            IdentityRemarks: values.IdentityRemarks,
            IdentityStatus: values.IdentityStatus,
          }
        : {
            ProviderIdentityId: 0,
            ProviderId: selectedProviderId,
            IdentificationId: values.IdentificationType,
            IdentityReferenceNo: values.IdentityReferenceNo,
            ExpiryDateString: expiryDate === undefined ? null : expiryDate,
            ExpiryDate: values.ExpiryDate,
            IdentityRemarks: values.IdentityRemarks,
            IdentityStatus: values.IdentityStatus,
          };

      try {
        // Send a POST request to the server
        const response = await customAxios.post(
          urlAddNewAndUpdateProviderIdentification,
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
              message: "Provider identifier already exists",
            });
          } else {
            setIsIdentifiersModalOpen(false);
            const identificationDetails =
              response.data.data.ProviderIdentifications.map((obj, index) => {
                return { ...obj, key: index + 1 };
              });
            setIdentifierDetails(identificationDetails);
            {
              IsEditingIdentifiersModal
                ? notification.success({
                    message:
                      "Provider Identification details updated Successfully",
                  })
                : notification.success({
                    message:
                      "Provider Identification details added Successfully",
                  });
            }
          }
        }
      } catch (error) {
        console.error("Failed to send data to server: ", error);

        {
          IsEditingIdentifiersModal
            ? notification.error({
                message: "Editing Provider Identification details UnSuccessful",
              })
            : notification.error({
                message: "Adding Provider Identification details UnSuccessful",
              });
        }
      }
    } else {
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
            IdentificationTypeName:
              providerDropdown.ProviderIdentificationType.find(
                (option) => option.LookupID === values.IdentificationType
              ).LookupDescription,
            IdentificationId: values.IdentificationType,
            IdentityReferenceNo: values.IdentityReferenceNo,
            ExpiryDateString: expiryDate,
            ExpiryDate: values.ExpiryDate,
            IdentityRemarks: values.IdentityRemarks,
            IdentityStatus: values.IdentityStatus,
          };
          identifierForm.resetFields();
        }
      } else {
        Object.entries(values).forEach(([key, value]) => {
          const existingIndex = identifiersArray.findIndex(
            (obj) =>
              obj.IdentificationId === values.IdentificationType &&
              obj.IdentityReferenceNo === values.IdentityReferenceNo &&
              obj.IdentityRemarks === values.IdentityRemarks &&
              obj.IdentityStatus === values.IdentityStatus
          );
          if (existingIndex === -1) {
            identifiersArray.push({
              key: identifiersArray.length + 1, // incrementing the key value for each new entry
              IdentificationId: values.IdentificationType,
              IdentificationTypeName:
                providerDropdown.ProviderIdentificationType.find(
                  (option) => option.LookupID === values.IdentificationType
                ).LookupDescription,
              IdentityReferenceNo: values.IdentityReferenceNo,
              ExpiryDateString: expiryDate,
              ExpiryDate: values.ExpiryDate,
              IdentityRemarks: values.IdentityRemarks,
              IdentityStatus: values.IdentityStatus,
            });
          }
        });
        identifierForm.resetFields();
      }

      setIdentifierDetails(identifiersArray);
      setIsIdentifiersModalOpen(false);
    }
  };

  //headers of the credential table
  const CredentialColumns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Credential Type",
      dataIndex: "CredentialTypeName",
      key: "CredentialTypeName",
    },
    {
      title: "Card No",
      dataIndex: "ReferenceNo",
      key: "ReferenceNo",
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
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
            onClick={() => onEditCredential(record)}
            icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
          ></Button>

          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => onDeleteCredential(record)}
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

  const IdentifiersColumns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Identification Type",
      dataIndex: "IdentificationTypeName",
      key: "IdentificationTypeName",
    },
    {
      title: "Card No",
      dataIndex: "IdentityReferenceNo",
      key: "IdentityReferenceNo",
    },
    {
      title: "Expiry Date",
      dataIndex: "ExpiryDateString",
      key: "ExpiryDateString",
    },
    {
      title: "Remarks",
      dataIndex: "IdentityRemarks",
      key: "IdentityRemarks",
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
            onClick={() => onEditIdentification(record)}
            icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
          ></Button>

          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => onDeleteIdentification(record)}
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
                Provider Registration
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button icon={<SearchOutlined />} onClick={searchProvider}>
                Search Provider
              </Button>
            </Col>
          </Row>

          <Divider orientation="left">Provider Details</Divider>

          <Form
            layout="vertical"
            form={form}
            name="register"
            onFinish={handleOnFinish}
            scrollToFirstError={true}
            style={{ padding: "0rem 2rem" }}
            // initialValues={
            //   isEditProviderRegistration
            //     ? {
            //         title: providerDetails.ProviderTitle
            //           ? providerDetails.ProviderTitle
            //           : null,
            //         PatientFirstName: providerDetails.ProviderFirstName
            //           ? providerDetails.ProviderFirstName
            //           : null,
            //         PatientMiddleName: providerDetails.ProviderMiddleName,
            //         PatientLastName: providerDetails.ProviderLastName,
            //         PatientGender: providerDetails.Gender,
            //         Qualification: providerDetails.Qualification,
            //         dob: providerDetails.Dob
            //           ? dayjs(providerDetails.Dob)
            //           : null,
            //         structuralRole: providerDetails.StructuralRoleId,
            //         consultantType: providerDetails.ConsultantTypeId,
            //         PresentAddress: providerDetails.PresentAddress1,
            //         PresentCountry: providerDetails.PresentCountryId,
            //         PresentState: providerDetails.PresentStateId,
            //         PresentCity: providerDetails.PresentPlaceId,
            //         PresentArea: providerDetails.PresentAreaId,
            //         PresentPinCode: providerDetails.PresentPin,
            //         PermanentAddress: providerDetails.PermanentAddress1,
            //         PermanentCountry: providerDetails.PermanentCountryId,
            //         PermanentState: providerDetails.PermanentStateId,
            //         PermanentCity: providerDetails.PermanentPlaceId,
            //         PermanentArea: providerDetails.PermanentAreaId,
            //         PermanentPinCode: providerDetails.PermanentPin,
            //         MobileNumber: providerDetails.MobileNumber,
            //         LandlineNumber: providerDetails.LandlineNumber,
            //         EmailId: providerDetails.EmailId,
            //       }
            //     : {}
            // }
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
                        {providerDropdown.Titles.map((option) => (
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
                        {providerDropdown.Genders.map((option) => (
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
                    <Row gutter={32}>
                      <Col span={12}>
                        <Form.Item name="Qualification" label="Qualification">
                          <Input allowClear />
                        </Form.Item>
                      </Col>
                      <Col span={12} className="custom-padding">
                        <Form.Item
                          name="dob"
                          label="Date&nbsp;of&nbsp;Birth"
                          rules={[
                            {
                              required: true,
                              message: "Please select Date Of Birth",
                            },
                          ]}
                        >
                          <DatePicker
                            style={{ width: "100%" }}
                            format="DD-MM-YYYY"
                            onChange={handleDateOfBirth}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={7}>
                    <Form.Item
                      name="structuralRole"
                      label="Structural Role"
                      rules={[
                        {
                          required: true,
                          message: "Please select Structural Role",
                        },
                      ]}
                    >
                      <Select placeholder="Select Title" allowClear>
                        {providerDropdown.StructuralRoles.map((option) => (
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
                      name="consultantType"
                      label="Consultant Type"
                      rules={[
                        {
                          required: true,
                          message: "Please select Consultant Type",
                        },
                      ]}
                    >
                      <Select placeholder="Select Title" allowClear>
                        {providerDropdown.ConsultantType.map((option) => (
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
                </Row>
              </Col>
              <Col
                span={6}
                style={{
                  overflow: "hidden",
                  paddingRight: "0px",
                  marginTop: "-30px",
                }}
              >
                <WebcamImage
                //  onImageUpload={handleImageUpload}
                />
              </Col>
            </Row>

            <Divider orientation="left">Present Address</Divider>
            <Row gutter={14}>
              <Col span={6}>
                <Form.Item
                  name="PresentAddress"
                  label="Address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Address",
                    },
                  ]}
                >
                  <TextArea placeholder="Add Address" autoSize />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="PresentCountry"
                  label="Country"
                  rules={[
                    {
                      required: true,
                      message: "Please select country",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => handleCountriesChange(value, false)}
                    allowClear
                  >
                    {providerDropdown.Countries.map((option) => (
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
                <Form.Item
                  name="PresentState"
                  label="State"
                  rules={[
                    {
                      required: true,
                      message: "Please select state",
                    },
                  ]}
                >
                  <Select
                    // value={selectedState || ""}
                    onChange={(value) => handleStatesChange(value, false)}
                    allowClear
                  >
                    {states.map((option) => (
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
                <Form.Item
                  name="PresentCity"
                  label="Place"
                  rules={[
                    {
                      required: true,
                      message: "Please select place",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => handlePlacesChange(value, false)}
                    allowClear
                  >
                    {places.map((option) => (
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
                <Form.Item
                  name="PresentArea"
                  label="Area"
                  rules={[
                    {
                      required: true,
                      message: "Please select area",
                    },
                  ]}
                >
                  <Select allowClear>
                    {areas.map((option) => (
                      <Select.Option key={option.AreaId} value={option.AreaId}>
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
            <Checkbox onChange={handleCheckBox}>
              Is permanent address is same as present.
            </Checkbox>
            <Divider orientation="left">Permanent Address</Divider>
            <Row gutter={14}>
              <Col span={6}>
                <Form.Item
                  name="PermanentAddress"
                  label="Address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Address",
                    },
                  ]}
                >
                  <TextArea placeholder="Add Address" autoSize />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="PermanentCountry"
                  label="Country"
                  rules={[
                    {
                      required: true,
                      message: "Please select country",
                    },
                  ]}
                >
                  <Select
                    // value={selectedCountry || ""}
                    onChange={(value) => handleCountriesChange(value, true)}
                    allowClear
                  >
                    {providerDropdown.Countries.map((option) => (
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
                <Form.Item
                  name="PermanentState"
                  label="State"
                  rules={[
                    {
                      required: true,
                      message: "Please select state",
                    },
                  ]}
                >
                  {isSameAddress ? (
                    <Select
                      onChange={(value) => handleStatesChange(value, true)}
                      allowClear
                    >
                      {providerDropdown.States.map((option) => (
                        <Select.Option
                          key={option.StateID}
                          value={option.StateID}
                        >
                          {option.StateName}
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <Select
                      onChange={(value) => handleStatesChange(value, true)}
                      allowClear
                    >
                      {permanentStates.map((option) => (
                        <Select.Option
                          key={option.StateID}
                          value={option.StateID}
                        >
                          {option.StateName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="PermanentCity"
                  label="Place"
                  rules={[
                    {
                      required: true,
                      message: "Please select place",
                    },
                  ]}
                >
                  {isSameAddress ? (
                    <Select
                      onChange={(value) => handlePlacesChange(value, true)}
                      allowClear
                    >
                      {providerDropdown.Places.map((option) => (
                        <Select.Option
                          key={option.PlaceId}
                          value={option.PlaceId}
                        >
                          {option.PlaceName}
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <Select
                      onChange={(value) => handlePlacesChange(value, true)}
                      allowClear
                    >
                      {permanentPlaces.map((option) => (
                        <Select.Option
                          key={option.PlaceId}
                          value={option.PlaceId}
                        >
                          {option.PlaceName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="PermanentArea"
                  label="Area"
                  rules={[
                    {
                      required: true,
                      message: "Please select area",
                    },
                  ]}
                >
                  {isSameAddress ? (
                    <Select allowClear>
                      {providerDropdown.Areas.map((option) => (
                        <Select.Option
                          key={option.AreaId}
                          value={option.AreaId}
                        >
                          {option.AreaName}
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <Select allowClear>
                      {permanentAreas.map((option) => (
                        <Select.Option
                          key={option.AreaId}
                          value={option.AreaId}
                        >
                          {option.AreaName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
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
                    {
                      required: true,
                      message: "Please enter email-id",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left">Other Details</Divider>
            <Space size="large">{""}</Space>

            <Table
              pagination={false}
              title={() => (
                <>
                  <Row
                    style={{
                      backgroundColor: "#40A2E3",
                      padding: "0.3rem 0rem 0.3rem 1.5rem",
                      color: "white",
                      borderRadius: "5px",
                    }}
                  >
                    <Col
                      span={5}
                      style={{
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        fontSize: "1.2rem",
                      }}
                    >
                      Provider Credentials
                    </Col>
                    <Col
                      offset={15}
                      span={4}
                      style={{
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        fontSize: "1.2rem",
                      }}
                    >
                      <Button onClick={handleAddCredential}>
                        <PlusCircleOutlined />
                        Add Credentials
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
              columns={CredentialColumns}
              bordered
              dataSource={credentialsDetails}
              // rowKey={(row) => row.ProviderIdentityId}
              size="small"
              className="vitals-table"
              style={{
                margin: "0 0 1.5rem 0",
                boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2)",
              }}
              locale={{
                emptyText: "There is no Provider credentials  to show",
              }}
            />

            <Space size="large">{""}</Space>

            <Table
              pagination={false}
              title={() => (
                <>
                  <Row
                    style={{
                      backgroundColor: "#40A2E3",
                      // padding: "0.3rem 1rem",
                      color: "white",
                      borderRadius: "5px",
                      padding: "0.3rem 0rem 0.3rem 1.5rem",
                    }}
                  >
                    <Col
                      span={5}
                      style={{
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        fontSize: "1.2rem",
                      }}
                    >
                      Provider Identifiers
                    </Col>
                    <Col
                      offset={15}
                      span={4}
                      style={{
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        fontSize: "1.2rem",
                      }}
                    >
                      <Button onClick={handleAddIdentification}>
                        <PlusCircleOutlined />
                        Add Identifiers
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
              columns={IdentifiersColumns}
              bordered
              dataSource={identifierDetails}
              size="small"
              // rowKey={(row) => row.ProviderIdentityId}
              className="vitals-table"
              style={{
                margin: "0 0 1.5rem 0",
                boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2)",
              }}
              locale={{
                emptyText: "There is no Provider Identifier to show",
              }}
            />

            <Row justify="end">
              <Col style={{ marginRight: "10px" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="default" danger onClick={handleReset}>
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Layout>
      <Modal
        title="Credentials"
        open={IsCredentialsModalOpen}
        maskClosable={false}
        footer={null}
        onCancel={handleCredentialsModalClose}
      >
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={credentialForm}
          onFinish={handleSaveCredentials}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="CredentialType"
                label="Credential Type"
                rules={[
                  {
                    required: true,
                    message: "Please select Credential Type",
                  },
                ]}
              >
                <Select style={{ width: "100%" }} allowClear>
                  {providerDropdown.ProviderCredentialType.map((option) => (
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
              <Form.Item
                name="ReferenceNo"
                label="Card Number"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Card Number",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="Remarks" label="Remarks">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="Status" label="Status">
                <Select style={{ width: "100%" }}>
                  <Select.Option key="A">Active</Select.Option>
                  <Select.Option key="H">Hide</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="Key"></Form.Item>
            </Col>
          </Row>
          <Row gutter={32} style={{ height: "1.8rem" }}>
            <Col offset={14} span={4}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <Button
                  type="default"
                  danger
                  onClick={handleCredentialsModalClose}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Identifiers"
        open={IsIdentifiersModalOpen}
        maskClosable={false}
        footer={null}
        onCancel={handleIdentifierModalClose}
      >
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={identifierForm}
          onFinish={handleSaveIdentification}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="IdentificationType"
                label="Identification Type"
                rules={[
                  {
                    required: true,
                    message: "Please select Identification Type",
                  },
                ]}
              >
                <Select style={{ width: "100%" }} allowClear>
                  {providerDropdown.ProviderIdentificationType.map((option) => (
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
              <Form.Item
                name="IdentityReferenceNo"
                label="Card Number"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Card Number",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ExpiryDate"
                label="Expiry Date"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please enter expiry date",
                //   },
                // ]}
              >
                <DatePicker
                  format="DD-MM-YYYY"
                  style={{ width: "100%" }}
                  onChange={handleExpiryDate}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="IdentityRemarks" label="Remarks">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="IdentityStatus" label="Status">
                <Select style={{ width: "100%" }}>
                  <Select.Option key="A">Active</Select.Option>
                  <Select.Option key="H">Hide</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="Key"></Form.Item>
            </Col>
          </Row>
          <Row gutter={32} style={{ height: "1.8rem" }}>
            <Col offset={14} span={4}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <Button
                  type="default"
                  danger
                  onClick={handleIdentifierModalClose}
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

export default Provider;
