import {
  ArrowLeftOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Space,
  Popconfirm,
  Table,
  Modal,
  notification,
} from "antd";
import CustomTable from "../../../../components/customTable/index";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import customAxios from "../../../../components/customAxios/customAxios";
import {
  urlGetPayerViewModel,
  urlGetStatesBasedOnCountryId,
  urlGetPlacesBasedOnStateId,
  urlGetAreasBasedOnPlaceId,
  urlSearchPayerRecord,
  urlAddNewandUpdatePayer,
  urlAddNewAndUpdatePayerIdentity,
  urlGetPayerIdentificationDetails,
  urlDeletePayerIdentification,
} from "../../../../../endpoints";
import dayjs from "dayjs";
import {
  ColWithEightSpan,
  ColWithSixSpan,
  ColWithThreeSpan,
} from "../../../../components/customGridColumns";
import PageHeader from "../../../../components/PageHeader";

function PayerRegistration() {
  const navigate = useNavigate();
  const [form] = useForm();
  const [identifierForm] = useForm();
  const [payerDropDown, setPayerDropdown] = useState({
    PayerTypes: [],
    PayerIdentificationType: [],
    Countries: [],
    States: [],
    Places: [],
    Areas: [],
  });
  const [isloading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [places, setPlaces] = useState([]);
  const [areas, setAreas] = useState([]);

  const [identifierDetails, setIdentifierDetails] = useState([]);
  const [IsEditingIdentifiersModal, setIsEditingIdentifiersModal] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [identificationData, setIdentificationData] = useState();
  const [expiryDate, setExpiryDate] = useState();
  const [isEditPayerRegistration, setIsEditPayerRegistration] = useState(false);
  const [payerDetails, setPayerDetails] = useState([]);
  const location = useLocation();

  const [selectedPayerId, setSelectedPayerId] = useState();

  useEffect(() => {
    // Determine edit mode based on location.state
    const isEdit =
      location.state !== null && location.state.isEditPayerRegistration;
    const payerId = isEdit ? location.state.selectedRow.PayerId : null;

    // Update state based on edit mode
    setSelectedPayerId(isEdit ? payerId : null);
    setIsEditPayerRegistration(isEdit);

    // Fetch provider details (conditional based on edit mode)
    setLoading(true);
    if (isEdit) {
      customAxios
        .get(`${urlGetPayerViewModel}?PayerId=${payerId}`)
        .then((response) => {
          const apiData = response.data.data;
          const payerIdentificationData =
            response.data.data.PayerIdentifications.map((obj, index) => {
              return { ...obj, key: index + 1 };
            });

          console.log(response.data.data);
          setPayerDropdown(apiData);
          setPayerDetails(response.data.data.AddNewPayer);
          setIdentifierDetails(payerIdentificationData);
          setStates(response.data.data.States);
          setPlaces(response.data.data.Places);
          setAreas(response.data.data.Areas);
          setLoading(false);
        });
    } else {
      customAxios.get(urlGetPayerViewModel).then((response) => {
        const apiData = response.data.data;
        setPayerDropdown(apiData);
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (isEditPayerRegistration && payerDetails) {
      form.setFieldsValue({
        PayerType: payerDetails.PayerTypeId || null,
        PayerName: payerDetails.PayerName || null,
        EffectiveFrom: payerDetails.EffectiveFrom
          ? dayjs(payerDetails.EffectiveFrom)
          : null,
        EffectiveTo: payerDetails.EffectiveTo
          ? dayjs(payerDetails.EffectiveTo)
          : null,
        ContactPerson: payerDetails.ContactPerson || null,
        Status: payerDetails.Status === true ? "A" : "H" || null,
        Tariff: payerDetails.Tariff === "T" ? true : false || null,
        Address: payerDetails.AddressLine || null,
        Country: payerDetails.CountryId || null,
        State: payerDetails.StateId || null,
        City: payerDetails.PlaceId || null,
        Area: payerDetails.AreaId || null,
        Zip: payerDetails.PinCode || null,
        MobileNumber: payerDetails.MobileNo || null,
        LandlineNumber: payerDetails.LandlineNo || null,
        email: payerDetails.EmailId || null,
        credit: payerDetails.CreditDays || null,
        IsDunning:
          payerDetails.IsDunningApplicable === "T" ? true : false || null,
      });
    }
  }, [isEditPayerRegistration, payerDetails, form]);

  const options = [
    {
      value: "A",
      label: "Active",
    },
    {
      value: "H",
      label: "Hide",
    },
  ];

  const disabledStartDate = (current) => {
    const endDate = form.getFieldValue("EffectiveTo");
    if (endDate !== undefined) {
      return (
        current &&
        (current < dayjs().startOf("day") ||
          current >= dayjs(endDate).endOf("day"))
      );
    }
    return current && current < dayjs().startOf("day");
  };

  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue("EffectiveFrom");
    if (startDate !== undefined) {
      return (
        current &&
        (current < dayjs().startOf("day") ||
          current <= dayjs(startDate).endOf("day"))
      );
    }
    return current && current < dayjs().startOf("day");
  };

  const handleStartDateChange = (date) => {
    form.setFieldsValue({ EffectiveTo: null });
    form.validateFields(["EffectiveFrom", "EffectiveTo"]);
  };

  const handleEndDateChange = () => {
    form.validateFields(["EffectiveFrom", "EffectiveTo"]);
  };
  // const handleFieldsChange = () => {
  //   form.validateFields(["EffectiveFrom", "EffectiveTo"]);
  // };

  const searchPayer = () => {
    const url = `/Payer/Search`;
    // Navigate to the new URL
    navigate(url);
    form.resetFields();
    identifierForm.resetFields();
  };

  const handleExpiryDate = (date, dateString) => {
    setExpiryDate(dateString);
  };

  const handleCountriesChange = async (value) => {
    // setCountrySelectValue(value);

    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        const response = await customAxios.get(
          `${urlGetStatesBasedOnCountryId}?CountryId=${value}`
        );
        if (response.status === 200) {
          const states = response.data.data.States;

          // form.setFieldsValue({
          //   State: null,
          //   City: null,
          //   Area: null,
          // });
          setStates(states);
          setPlaces([]);
          setAreas([]);
        }
      } else {
        setStates([]);
        setPlaces([]);
        setAreas([]);
        form.setFieldsValue({
          State: null,
          City: null,
          Area: null,
        });

        // form.resetFields();
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handleStatesChange = async (value) => {
    // setCountrySelectValue(value);

    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        // form.setFieldsValue({ State:value,City: null, Area: null });
        const response = await customAxios.get(
          `${urlGetPlacesBasedOnStateId}?StateId=${value}`
        );
        if (response.status === 200) {
          const places = response.data.data.Places;

          setPlaces(places);
          setAreas([]);
        }
      } else {
        setPlaces([]);
        setAreas([]);
        form.setFieldsValue({ City: null, Area: null });
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handlePlacesChange = async (value) => {
    // setCountrySelectValue(value);

    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        const response = await customAxios.get(
          `${urlGetAreasBasedOnPlaceId}?PlaceId=${value}`
        );
        if (response.status === 200) {
          const areas = response.data.data.AreaModel;

          setAreas(areas);
          // form.setFieldsValue({ Area: null });
        }
      } else {
        setAreas([]);
        form.setFieldsValue({ Area: null });

        // form.resetFields();
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handleOnFinish = async (values) => {
    setLoading(true);
    console.log("Received values from form: ", values);

    const payerDetails = isEditPayerRegistration
      ? {
          PayerId: selectedPayerId,
          PayerTypeId: values.PayerType,
          PayerName: values.PayerName,
          EffectiveFrom:
            values.EffectiveFrom === undefined ? null : values.EffectiveFrom,
          EffectiveTo: values.EffectiveTo,
          ContactPerson:
            values.ContactPerson === undefined || values.ContactPerson === ""
              ? null
              : values.ContactPerson,

          Tariff: values.Tariff === undefined ? "F" : "T",
          Status:
            values.Status === undefined || values.Status === "A" ? true : false,
          FacilityId: 1,
          AddressLine: values.Address === undefined ? null : values.Address,
          CountryId: values.Country,
          StateId: values.State,
          City: payerDropDown.Places.find(
            (option) => option.PlaceId === values.City
          ).PlaceName,
          Area: payerDropDown.Areas.find(
            (option) => option.AreaId === values.Area
          ).AreaName,
          PinCode:
            values.Zip === undefined || values.Zip === "" ? null : values.Zip,

          MobileNo: values.MobileNumber,
          LandlineNumber:
            values.Zip === undefined || values.LandlineNumber === ""
              ? null
              : values.LandlineNumber,
          EmailId:
            values.email === undefined || values.email === ""
              ? null
              : values.email,
          CreditDays:
            values.credit === undefined || values.credit === ""
              ? null
              : values.credit,
          IsDunningApplicable: values.IsDunning === undefined ? "F" : "T",
        }
      : {
          PayerId: 0,
          PayerTypeId: values.PayerType,
          PayerName: values.PayerName,
          EffectiveFrom:
            values.EffectiveFrom === undefined ? null : values.EffectiveFrom,
          EffectiveTo: values.EffectiveTo,
          ContactPerson: values.ContactPerson,
          Tariff: values.Tariff === undefined ? "F" : "T",
          Status: values.Status === "A" ? true : false,
          FacilityId: 1,
          AddressLine: values.Address === undefined ? null : values.Address,
          CountryId: values.Country,
          StateId: values.State,
          City: payerDropDown.Places.find(
            (option) => option.PlaceId === values.City
          ).PlaceName,
          Area: payerDropDown.Areas.find(
            (option) => option.AreaId === values.Area
          ).AreaName,
          PinCode: values.Zip,
          MobileNo: values.MobileNumber,
          LandlineNumber:
            values.LandlineNumber === "" ? null : values.LandlineNumber,
          EmailId: values.email === undefined ? null : values.email,
          CreditDays: values.credit === undefined ? null : values.credit,
          IsDunningApplicable: values.IsDunning === undefined ? "F" : "T",
        };

    const payer = {
      AddNewPayer: payerDetails,
      PayerIdentifications: identifierDetails,
    };

    try {
      // Send a POST request to the server
      const response = await customAxios.post(urlAddNewandUpdatePayer, payer);

      // Check if the request was successful
      if (response.status !== 200) {
        throw new Error(`Server responded with status code ${response.status}`);
      }

      if (response.data !== null) {
        if (isEditPayerRegistration) {
          if (response.data === "Success") {
            // Display success notification
            notification.success({
              message: "Payer details updated Successfully",
            });
            searchPayer();
            setIsEditPayerRegistration(false);
            setPayerDetails(null);
            form.resetFields();
            identifierForm.resetFields();
          }
        } else {
          // Process the response data (this assumes the server responds with JSON)
          const data = response.data.data.AddNewPayer.PayerId;

          if (data > 0) {
            // Display success notification
            notification.success({
              message: "Payer Registration Successful",
              //description: `The patient details have been successfully registered.`,
            });
            //searchProvider();
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to send data to server: ", error);

      // Display error notification
      notification.error({
        message: "Error",
        description: "Failed to register patient. Please try again later.",
      });
      setLoading(false);
    }
  };

  const onEdit = (record) => {
    if (isEditPayerRegistration) {
      customAxios
        .get(
          `${urlGetPayerIdentificationDetails}?PayerIdentityId=${record.PayerIdentityId}`
        )
        .then((response) => {
          if (response.data !== null) {
            setIsModalOpen(true);
            setIsEditingIdentifiersModal(true);
            const identificationData = response.data.data;
            setIdentificationData(identificationData);
            identifierForm.setFieldsValue({
              IdentificationType: identificationData.IdentificationId,
              IdentityReferenceNo: identificationData.IdentityReferenceNo,
              // ExpiryDate: identificationData.ExpiryDate,
              ExpiryDate: identificationData.ExpiryDateString
                ? dayjs(identificationData.ExpiryDateString, "DD-MM-YYYY")
                : null,

              Remarks: identificationData.Remarks || null,
              Status: identificationData.Status,
            });
          }
        });
    } else {
      console.log("identifier record", record);
      setIsModalOpen(true);
      setIdentificationData(record);
      setIsEditingIdentifiersModal(true);
      identifierForm.setFieldsValue({
        IdentificationType: record.IdentificationId,
        IdentityReferenceNo: record.IdentityReferenceNo,
        ExpiryDate: dayjs(record.ExpiryDateString, "DD-MM-YYYY"),
        Remarks: record.Remarks,
        Status: record.Status,
        Key: record.key,
      });
    }
  };

  const onDelete = (record) => {
    console.log("identifier record", record);

    if (isEditPayerRegistration) {
      customAxios
        .delete(
          `${urlDeletePayerIdentification}?PayerIdentityId=${record.PayerIdentityId}&PayerId=${record.PayerId}`
        )
        .then((response) => {
          if (
            response.data != null &&
            Array.isArray(response.data.data.PayerIdentifications)
          ) {
            const identificationsDetails =
              response.data.data.PayerIdentifications.map((obj, index) => {
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

  const handleAddIdentification = () => {
    setIsModalOpen(true);
    setIsEditingIdentifiersModal(false);
    identifierForm.resetFields();
  };

  const handleIdentificationModalCancel = () => {
    setIsModalOpen(false);
    identifierForm.resetFields();
  };

  const handleSaveIdentification = async () => {
    const values = identifierForm.getFieldsValue();
    console.log("To save Identification", values);

    if (isEditPayerRegistration) {
      const identification = IsEditingIdentifiersModal
        ? {
            PayerIdentityId: identificationData.PayerIdentityId,
            PayerId: selectedPayerId,
            IdentificationId: identificationData.IdentificationId,
            IdentityReferenceNo: values.IdentityReferenceNo,
            ExpiryDateString: expiryDate === undefined ? null : expiryDate,
            ExpiryDate: values.ExpiryDate,
            Remarks: values.Remarks,
            Status: values.Status,
          }
        : {
            PayerIdentityId: 0,
            PayerId: selectedPayerId,
            IdentificationId: values.IdentificationType,
            IdentityReferenceNo: values.IdentityReferenceNo,
            ExpiryDateString: expiryDate === undefined ? null : expiryDate,
            ExpiryDate: values.ExpiryDate,
            Remarks: values.Remarks,
            Status: values.Status,
          };

      try {
        // Send a POST request to the server
        const response = await customAxios.post(
          urlAddNewAndUpdatePayerIdentity,
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
            setIsModalOpen(false);
            const identificationDetails =
              response.data.data.PayerIdentifications.map((obj, index) => {
                return { ...obj, key: index + 1 };
              });
            setIdentifierDetails(identificationDetails);
            {
              IsEditingIdentifiersModal
                ? notification.success({
                    message:
                      "Payer Identification details updated Successfully",
                  })
                : notification.success({
                    message: "Payer Identification details added Successfully",
                  });
            }
          }
        }
      } catch (error) {
        console.error("Failed to send data to server: ", error);

        {
          IsEditingIdentifiersModal
            ? notification.error({
                message: "Editing Payer Identification details UnSuccessful",
              })
            : notification.error({
                message: "Adding Payer Identification details UnSuccessful",
              });
        }
      }
    } else {
      // Get a copy of the current identifierDetails
      let identifiersArray = [...identifierDetails];
      if (IsEditingIdentifiersModal) {
        const existingIndex = identifiersArray.findIndex(
          (obj) => obj.key === identificationData.key
        );

        // If the record exists, update it
        if (existingIndex !== -1) {
          identifiersArray[existingIndex] = {
            key: identificationData.key,
            IdentificationTypeName: payerDropDown.PayerIdentificationType.find(
              (option) => option.LookupID === values.IdentificationType
            ).LookupDescription,
            IdentificationId: values.IdentificationType,
            IdentityReferenceNo: values.IdentityReferenceNo,
            ExpiryDateString: expiryDate,
            ExpiryDate: values.ExpiryDate,
            Remarks: values.Remarks,
            Status: values.Status,
          };
          identifierForm.resetFields();
        }
      } else {
        Object.entries(values).forEach(([key, value]) => {
          const existingIndex = identifiersArray.findIndex(
            (obj) =>
              obj.IdentificationId === values.IdentificationType &&
              obj.IdentityReferenceNo === values.IdentityReferenceNo
            // &&
            // obj.Remarks === values.Remarks &&
            // obj.Status === values.Status
          );
          if (existingIndex === -1) {
            identifiersArray.push({
              key: identifiersArray.length + 1, // incrementing the key value for each new entry
              IdentificationId: values.IdentificationType,
              IdentificationTypeName:
                payerDropDown.PayerIdentificationType.find(
                  (option) => option.LookupID === values.IdentificationType
                ).LookupDescription,
              IdentityReferenceNo: values.IdentityReferenceNo,
              ExpiryDateString: expiryDate,
              ExpiryDate: values.ExpiryDate,
              Remarks: values.Remarks,
              Status: values.Status,
            });
          }
        });
        identifierForm.resetFields();
      }

      setIdentifierDetails(identifiersArray);
      setIsModalOpen(false);
    }
  };

  const identifierColumns = [
    {
      title: "Sl No",
      dataIndex: "key",
      key: "key",
      width: 80,
    },
    {
      title: "Card Type",
      dataIndex: "IdentificationTypeName",
      key: "IdentificationTypeName",
      width: 150,
    },
    {
      title: "Card No",
      dataIndex: "IdentityReferenceNo",
      key: "IdentityReferenceNo",
      width: 150,
    },
    {
      title: "Expiry Date",
      dataIndex: "ExpiryDateString",
      key: "ExpiryDateString",
      width: 150,
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
      width: 150,
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
          <PageHeader
            title={"Payer Registration"}
            buttonLabel={"Search Payer"}
            buttonIcon={<SearchOutlined style={{ fontSize: "1.1rem" }} />}
            onButtonClick={searchPayer}
          />
          <Form
            style={{ margin: "1rem" }}
            layout="vertical"
            form={form}
            initialValues={{ Status: "A" }}
            onFinish={handleOnFinish}
            // onFieldsChange={handleFieldsChange}
          >
            <Row gutter={18}>
              <ColWithSixSpan>
                <Form.Item
                  name="PayerType"
                  label="Payer Type"
                  rules={[
                    {
                      required: true,
                      message: "Please select Payer Type",
                    },
                  ]}
                >
                  <Select allowClear>
                    {payerDropDown.PayerTypes.map((response) => (
                      <Select.Option
                        key={response.LookupID}
                        value={response.LookupID}
                      >
                        {response.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="PayerName"
                  label="Payer Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Payer Name",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} allowClear />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="EffectiveFrom"
                  label="Effective From"
                  rules={[
                    {
                      required: true,
                      message: "Please enter effective from date",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          !value ||
                          !getFieldValue("EffectiveTo") ||
                          value < getFieldValue("EffectiveTo")
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "Effective From date must be earlier than Effective To date"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    format={"DD-MM-YYYY"}
                    style={{ width: "100%" }}
                    disabledDate={disabledStartDate}
                    onchange={handleStartDateChange}
                    placeholder="DD-MM-YYYY"
                    allowClear
                  />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="EffectiveTo"
                  label="Effective To"
                  rules={[
                    {
                      required: true,
                      message: "Please enter effective to date",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          !value ||
                          !getFieldValue("EffectiveFrom") ||
                          value > getFieldValue("EffectiveFrom")
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "Effective To date must be later than Effective From date"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    format={"DD-MM-YYYY"}
                    style={{ width: "100%" }}
                    disabledDate={disabledEndDate}
                    onchange={handleEndDateChange}
                    placeholder="DD-MM-YYYY"
                    allowClear
                  />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="ContactPerson"
                  label="Contact Person"
                  allowClear
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="Status" label="Status">
                  <Select
                    options={options}
                    style={{ width: "100%" }}
                    allowClear
                  />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithThreeSpan>
                <Form.Item name="Tariff" label="Tariff" valuePropName="checked">
                  <Checkbox
                    style={{ width: "100%" }}
                    // onChange={}
                  />
                </Form.Item>
              </ColWithThreeSpan>
            </Row>
            <Divider orientation="left">Address Details</Divider>
            <Row gutter={16}>
              <ColWithSixSpan>
                <Form.Item
                  name="Address"
                  label="Address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter address",
                    },
                  ]}
                >
                  <TextArea style={{ width: "100%" }} autoSize allowClear />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="Country"
                  label="Country"
                  rules={[
                    {
                      required: true,
                      message: "Please select country",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    onChange={handleCountriesChange}
                    allowClear
                  >
                    {payerDropDown.Countries.map((response) => (
                      <Select.Option
                        key={response.LookupID}
                        value={response.LookupID}
                      >
                        {response.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="State"
                  label="State"
                  rules={[
                    {
                      required: true,
                      message: "Please select state",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    onChange={handleStatesChange}
                    allowClear
                  >
                    {states.map((response) => (
                      <Select.Option
                        key={response.StateID}
                        value={response.StateID}
                      >
                        {response.StateName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="City"
                  label="City"
                  rules={[
                    {
                      required: true,
                      message: "Please enter place",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    onChange={handlePlacesChange}
                    allowClear
                  >
                    {places.map((response) => (
                      <Select.Option
                        key={response.PlaceId}
                        value={response.PlaceId}
                      >
                        {response.PlaceName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>

              <ColWithSixSpan>
                <Form.Item
                  name="Area"
                  label="Area"
                  rules={[
                    {
                      required: true,
                      message: "Please enter place",
                    },
                  ]}
                >
                  <Select style={{ width: "100%" }} allowClear>
                    {areas.map((response) => (
                      <Select.Option
                        key={response.AreaId}
                        value={response.AreaId}
                      >
                        {response.AreaName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="Zip"
                  label="Zip"
                  rules={[
                    {
                      pattern: new RegExp(/^\d{6}$/),
                      message: "Invalid zip",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} maxLength={6} allowClear />
                </Form.Item>
              </ColWithSixSpan>
            </Row>
            <Divider orientation="left">Contact Details</Divider>
            <Row gutter={18}>
              <ColWithEightSpan>
                <Form.Item
                  name="MobileNumber"
                  label="Mobile Number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter mobile number",
                    },
                    {
                      pattern: /^\d{10}$/,
                      message: "Please enter a valid 10 digit number!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} maxLength={10} allowClear />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  name="LandlineNumber"
                  label="Landline Number"
                  rules={[
                    {
                      pattern: /^\d{10}$/,
                      message: "Please enter a valid 10 digit number!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} maxLength={10} allowClear />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  name="email"
                  label="Contact Email"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} allowClear />
                </Form.Item>
              </ColWithEightSpan>
            </Row>
            <Divider orientation="left">Financial Attributes</Divider>
            <Row gutter={16}>
              <ColWithEightSpan>
                <Form.Item name="credit" label="Credit Days">
                  <Input style={{ width: "100%" }} allowClear />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  name="IsDunning"
                  label="Is Dunning Applicable"
                  valuePropName="checked"
                >
                  <Checkbox style={{ width: "100%" }} />
                </Form.Item>
              </ColWithEightSpan>
            </Row>
            <CustomTable
              pagination={false}
              title={() => (
                <PageHeader
                  title={"Payer Identifiers"}
                  buttonLabel={"Add Identifiers"}
                  buttonIcon={
                    <PlusCircleOutlined style={{ fontSize: "1.1rem" }} />
                  }
                  onButtonClick={handleAddIdentification}
                />
              )}
              columns={identifierColumns}
              dataSource={identifierDetails}
              locale={{ emptyText: "Add Payer Identifiers" }}
              style={{
                margin: "0 0 1.5rem 0",
                boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2)",
              }}
              onDelete={() => onDelete(record)}
              onEdit={() => onEdit(record)}
            />
            <Modal
              title="Payer Identifiers"
              open={isModalOpen}
              maskClosable={false}
              footer={null}
              onCancel={handleIdentificationModalCancel}
            >
              <Form
                style={{ margin: "1rem 0" }}
                layout="vertical"
                form={identifierForm}
                onFinish={handleSaveIdentification}
                initialValues={{ Status: "A" }}
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
                        {payerDropDown.PayerIdentificationType.map(
                          (response) => (
                            <Select.Option
                              key={response.LookupID}
                              value={response.LookupID}
                            >
                              {response.LookupDescription}
                            </Select.Option>
                          )
                        )}
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
                      <Input style={{ width: "100%" }} allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="ExpiryDate"
                      label="Expiry Date"
                      rules={[
                        {
                          required: true,
                          message: "Please enter expiry date",
                        },
                      ]}
                    >
                      <DatePicker
                        format={"DD-MM-YYYY"}
                        style={{ width: "100%" }}
                        onChange={handleExpiryDate}
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="Remarks" label="Remarks" allowClear>
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="Status" label="Status">
                      <Select
                        style={{ width: "100%" }}
                        options={options}
                        allowClear
                      />
                    </Form.Item>
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
                        onClick={handleIdentificationModalCancel}
                      >
                        Cancel
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>

            <Row
              justify={"end"}
              style={{
                margin: "0 0.5rem",
                paddingBottom: 0,
              }}
            >
              <Col style={{ marginRight: "1rem" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="default" danger>
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Layout>
    </>
  );
}

export default PayerRegistration;
