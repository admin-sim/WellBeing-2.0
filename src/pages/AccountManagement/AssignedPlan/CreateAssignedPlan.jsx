import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Popconfirm,
  Input,
  InputNumber,
  ConfigProvider,
  Row,
  Select,
  message,
  DatePicker,
  Divider,
  notification,
  Table,
  Modal,
  Tooltip,
  AutoComplete,
  Typography,
  Empty,
  Checkbox,
  Space,
  Transfer,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LeftOutlined,
  PlusOutlined,
  CloseSquareFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import Layout from "antd/es/layout/layout";
const { Text } = Typography;
import { useNavigate } from "react-router";
import customAxios from "../../../components/customAxios/customAxios";

import {
  urlCreateAssignedPlan,
  urlDeleteAuthorisation,
  urlDeleteAuthorisationLineChargeParameter,
  urlDeleteSelectedAssignedPlan,
  urlEditAssignedPlan,
  urlEditAuthorisation,
  urlEditAuthorisationChargeParameter,
  urlGetAuthorizationListByAssignPlanId,
  urlGetDropDownsForBillAggrement,
  urlGetPatientHeaderDetails,
  //urlGetPriceTariffsAddnew,
  urlSaveNewAssignedPlan,
  urlSaveNewAuthorisation,
  urlUpdateAssignedPlan,
  urlUpdateAuthorisation,
} from "../../../../endpoints";
import Title from "antd/es/typography/Title";
import { useLocation } from "react-router-dom";
import PatientHeader from "../../../components/PatientHeader";
import { CiDiscount1 } from "react-icons/ci";
import dayjs from "dayjs";
import { debounce, set, values } from "lodash";
import CustomTable from "../../../components/customTable";
import AssignedPlanModal from "./AssignedPlanModal";
import EditAssignedPlanModal from "./EditAssignedPlanModal";

const CreateAssignedPlan = () => {
  const location = useLocation();
  const PatientId = location.state.patientId;
  const EncounterId = location.state.encounterId;
  const [show, setShow] = useState(false);
  const [addAuth, setAddAuth] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [paramTable, setParamTable] = useState(false);
  const [buttonshow, setButtonShow] = useState(false);

  const [disable, setDisable] = useState(false);

  const [patientData, setPatientData] = useState(null);
  const [AssignedPlanId, setAssignedPlanId] = useState(null);
  const [PatientTypeId, setPatientTypeId] = useState(null);
  const [isDaysIsRestrictedChecked, setIsDaysIsRestrictedChecked] =
    useState(false);
  const [isAuthAmountChecked, setIsAuthAmountChecked] = useState(false);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [assignedPlan, setAssignedPlan] = useState([]);
  const [addNewAssignedPlan, setAddNewAssignedPlan] = useState([]);
  const [transferData, setTransferData] = useState([]);
  const [columnData, setColumnData] = useState();
  const [columnAuthData, setAuthColumnData] = useState([]);
  const [transferError, setTransferError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetKeys, setTargetKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedAuthlineId, setEditedAuthLineId] = useState(null);
  const [planAuthId, setPlanAuthId] = useState(null);
  const [linedata, setLinedata] = useState(null);
  const [addNewAuthShowBtn, setAddNewAuthShowBtn] = useState(false);
  const [billagreementDropdown, setBillagreementDropdown] = useState({
    ChargeParameters: [],
    RestrictedTypes: [],
    PayerInsurance: [],
    PayerEmployer: [],
    Facility: [],
    Payer: [],
    Indicators: [],
    BillAgreementModels: [],
    WardType: [],
    PriceTariff: [],
  });

  const [billAgrementChargeDropdown, setBillAgrementChargeDropdown] = useState({
    PatientType: [],
    Nationality: [],
    Gender: [],
    Indicators: [],
    WardType: [],
    Provider: [],
    PatientTypeFlag: false,
    NationalityFlag: false,
    GenderFlag: false,
    WardTypeFlag: false,
    FamilyIncomeFlag: false,
    ProviderFlag: false,
  });
  const [editbillAgrementChargeDropdown, setEditbillAgrementChargeDropdown] =
    useState({
      PatientType: [],
      Nationality: [],
      Gender: [],
      Indicators: [],
      WardType: [],
      Provider: [],
      PatientTypeFlag: false,
      NationalityFlag: false,
      GenderFlag: false,
      WardTypeFlag: false,
      FamilyIncomeFlag: false,
      ProviderFlag: false,
    });

  useEffect(() => {
    debugger;
    const fetchDataHeader = async () => {
      try {
        const response = await customAxios.get(
          `${urlGetPatientHeaderDetails}?PatientId=${PatientId}&EncounterId=${EncounterId}`
        );
        if (response.status === 200 && response.data.data != null) {
          const detailsheader = response.data.data.EncounterModel;
          setPatientData(detailsheader);
          console.log("headerdata", detailsheader.PatientDetail);
        } else {
          console.error("Failed to fetch patient details");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataHeader();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;
    try {
      if (PatientId && EncounterId != null) {
        const assignedPlanId = "";
        const response = await customAxios.get(
          `${urlCreateAssignedPlan}?patientId=${PatientId}&encounterId=${EncounterId}&assignedPlanId=${assignedPlanId}`
        );
        if (response.status === 200 && response.data.data != null) {
          setBillagreementDropdown(response.data.data);
          setAssignedPlan(response.data.data.AssignedPlan);

          const transData = response.data.data.ChargeParameters.map((item) => ({
            key: item.LookupID, // Replace 'id' with the unique key in your data
            title: item.LookupDescription, // Replace 'name' with the field you want to display in the list
            // Add more fields as needed
          }));
          setTransferData(transData);
          const AddNewAssignedPlanData = response.data.data.AddNewAssignedPlan;
          setAddNewAssignedPlan(AddNewAssignedPlanData);
          setPatientTypeId(response.data.data.PatientTypeId);
          setAuthColumnData(response.data.data.Authorisation);
          if (
            AddNewAssignedPlanData != null &&
            !response.data.data.CashPatient
          ) {
            setShow(true);
            setButtonShow(true);
            setAssignedPlanId(AddNewAssignedPlanData.AssignedPlanId);
            form.setFieldsValue({
              PayerId: AddNewAssignedPlanData.PayerId,
              EmployerId: AddNewAssignedPlanData.EmployerId
                ? AddNewAssignedPlanData.EmployerId
                : "",
              InsurerId: AddNewAssignedPlanData.InsurerId
                ? AddNewAssignedPlanData.InsurerId
                : "",
              TariffPlanId: AddNewAssignedPlanData.TariffPlanId,
              AgreementReference: AddNewAssignedPlanData.AgreementReference,
              MembershipValidFromDate:
                AddNewAssignedPlanData.MembershipValidFromDate
                  ? dayjs(
                      AddNewAssignedPlanData.MembershipValidFromDate,
                      "DD-MM-YYYY"
                    )
                  : null,
              MembershipValidToDate:
                AddNewAssignedPlanData.MembershipValidToDate
                  ? dayjs(
                      AddNewAssignedPlanData.MembershipValidToDate,
                      "DD-MM-YYYY"
                    )
                  : null,
              EmployeeNumber: AddNewAssignedPlanData.EmployeeNo,
              ParentPriceApplicable:
                AddNewAssignedPlanData.IsParentPriceApplicable,
              DocumentReference: AddNewAssignedPlanData.DocumentReference,
              EligibleWardTypeId: AddNewAssignedPlanData.EligibleWardTypeId
                ? AddNewAssignedPlanData.EligibleWardTypeId
                : "",
              VerificationRemarks: AddNewAssignedPlanData.VerificationRemarks,
            });
          }
        } else {
          console.error("Failed to fetch patient details");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleOnFinish = async (values) => {
    debugger;
    console.log(values);
    // do something with the form values
    values.AssignedPlanId = AssignedPlanId ? AssignedPlanId : 0;
    values.FacilityId = 1;
    values.PatientId = PatientId;
    values.EncounterId = EncounterId;
    values.EmployerId = values.EmployerId ? values.EmployerId : null;
    values.EligibleWardTypeId = values.EligibleWardTypeId
      ? values.EligibleWardTypeId
      : null;

    values.Priority = 2;
    values.MembershipValidFromDate = values.MembershipValidFromDate
      ? values.MembershipValidFromDate.format("DD-MM-YYYY")
      : "";
    values.MembershipValidToDate = values.MembershipValidToDate
      ? values.MembershipValidToDate.format("DD-MM-YYYY")
      : "";

    values.InsurerId = values.InsurerId ? values.InsurerId : null;

    const url = AssignedPlanId ? urlUpdateAssignedPlan : urlSaveNewAssignedPlan;
    try {
      const response = await customAxios.post(url, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resultdata = response.data.data.result;
      if (resultdata === "Success") {
        setDisable(true);
        const messsage1=AssignedPlanId ? "Plan Updated Successfully..." : "Plan Applied Successfully..."
        message.success(messsage1);
        if (response.data.data.AssignedPlan != null) {
          setAssignedPlan(response.data.data.AssignedPlan);
          setAssignedPlanId(response.data.data.AssignedPlanId);
        }
      } else if (resultdata === "Exists") {
        message.warning("Payer with same Plan already exists...");
      } else {
        message.warning("Something Went Wrong");
      }
    } catch (error) {}
  };

  const onFinishAddAuth = async (values) => {
    debugger;

    values.AuthorisationDate = values.AuthorisationDate
      ? values.AuthorisationDate.format("DD-MM-YYYY")
      : "";
    values.AuthValidFromDate = values.AuthValidFromDate
      ? values.AuthValidFromDate.format("DD-MM-YYYY")
      : "";
    values.AuthValidToDate = values.AuthValidToDate
      ? values.AuthValidToDate.format("DD-MM-YYYY")
      : "";
    values.AssignedPlanId = AssignedPlanId;
    values.PlanAuthId = planAuthId ? planAuthId : 0;
    values.AuthAmount=values.AuthAmount ? values.AuthAmount : null;
    values.ApprovedDays=values.ApprovedDays ? values.ApprovedDays : null;
    values.AmtDeductible=values.AmtDeductible ? values.AmtDeductible : 0;

    const url = planAuthId ? urlUpdateAuthorisation : urlSaveNewAuthorisation;
    try {
      const response = await customAxios.post(
        url,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.data != null && response.data.data > 0) {
        setPlanAuthId(response.data.data);
        setAddNewAuthShowBtn(true);
        const message1=planAuthId ? "Authorisation Updated Successfully" : "New Authorisation Added Successfully";
        message.success(message1);
      }
    } catch (error) {}
  };

  const handleCancel = {};

  const handleAddNew = async () => {
    debugger;
    setShow(true);
    setDisable(false);
    setButtonShow(false);
    setAssignedPlanId(null);
    setAddAuth(false);
    setAuthColumnData([]);
    form.resetFields();
    setPlanAuthId(null);

    // const response = await customAxios.get(
    //   `${urlGetPriceTariffsAddnew}?patientId=${PatientId}&encounterId=${EncounterId}`
    // );
    // if (response.status === 200 && response.data.data != null) {
    //   setBillagreementDropdown(response.data.data);
    // }
  };

  const handleAddAuthorisation = async () => {
    debugger;
    form1.resetFields();
    if (AssignedPlanId > 0) {
      setAddAuth(true);
      setAddNewAuthShowBtn(false);
      setPlanAuthId(null);
    } else {
      message.warning("Please save the Assign plan to continue");
    }
  };
  const handleCancelAddAuth = async () => {
    debugger;
    setAddAuth(false);
    setPlanAuthId(null);
   // setAssignedPlanId(null);
    form1.resetFields();
    const response = await customAxios.get(
      `${urlGetAuthorizationListByAssignPlanId}?AssignedPlanId=${AssignedPlanId}`
    );
    if (response.status === 200 && response.data.data != null) {
      setAuthColumnData(response.data.data);
    }
  };

  const handleEdit = async (assignPlanId) => {
    debugger;
    const response = await customAxios.get(
      `${urlEditAssignedPlan}?AssignedPlanId=${assignPlanId}`
    );
    if (response.status === 200 && response.data.data != null) {
      setBillagreementDropdown(response.data.data);
      const AddNewAssignedPlanData = response.data.data.AddNewAssignedPlan;
      setAddNewAssignedPlan(AddNewAssignedPlanData);
      if (AddNewAssignedPlanData != null && !response.data.data.CashPatient) {
        setShow(true);
        setButtonShow(true);
        setDisable(false);
        setAssignedPlanId(AddNewAssignedPlanData.AssignedPlanId);
        setAuthColumnData(response.data.data.Authorisation);
        form.setFieldsValue({
          PayerId: AddNewAssignedPlanData.PayerId,
          EmployerId: AddNewAssignedPlanData.EmployerId
            ? AddNewAssignedPlanData.EmployerId
            : "",
          InsurerId: AddNewAssignedPlanData.InsurerId
            ? AddNewAssignedPlanData.InsurerId
            : "",
          TariffPlanId: AddNewAssignedPlanData.TariffPlanId,
          AgreementReference: AddNewAssignedPlanData.AgreementReference,
          MembershipValidFromDate:
            AddNewAssignedPlanData.MembershipValidFromDate
              ? dayjs(
                  AddNewAssignedPlanData.MembershipValidFromDate,
                  "DD-MM-YYYY"
                )
              : null,
          MembershipValidToDate: AddNewAssignedPlanData.MembershipValidToDate
            ? dayjs(AddNewAssignedPlanData.MembershipValidToDate, "DD-MM-YYYY")
            : null,
          EmployeeNumber: AddNewAssignedPlanData.EmployeeNo,
          ParentPriceApplicable: AddNewAssignedPlanData.IsParentPriceApplicable,
          DocumentReference: AddNewAssignedPlanData.DocumentReference,
          EligibleWardTypeId: AddNewAssignedPlanData.EligibleWardTypeId
            ? AddNewAssignedPlanData.EligibleWardTypeId
            : "",
          VerificationRemarks: AddNewAssignedPlanData.VerificationRemarks,
        });
      }
    }
  };
  const handleDelete = async (assignPlanId) => {
    debugger;
    const response = await customAxios.delete(
      `${urlDeleteSelectedAssignedPlan}?AssignedPlanId=${assignPlanId}&PatientId=${PatientId}&EncounterId=${EncounterId}`
    );
    if (response.data.data.AssignedPlan != null) {
      setAssignedPlan(response.data.data.AssignedPlan);
      setShow(false);
      message.success("AssignedPlan Deleted Successfully");
    }
  };
  const handleDeleteAuth = async (record) => {
    debugger;
    const response = await customAxios.delete(
      `${urlDeleteAuthorisation}?PlanAuthId=${record.PlanAuthId}&AssignedPlanId=${record.AssignedPlanId}`
    );
    if(response.status === 200){
      setAuthColumnData(response.data.data);
      setAddAuth(false);
      setPlanAuthId(null);
      message.success("Authorisation Deleted Successfully...");
    }
  };

  const handleDeleteAuthorisationLineChargeParameter = async (record) => {
    debugger;
    const response = await customAxios.delete(
      `${urlDeleteAuthorisationLineChargeParameter}?authorisationLineId=${record.AuthLineId}&PlanAuthId=${record.PlanAuthId}`
    );
    if (response.status===200 &&  response.data.data != null) {
      setColumnData(response.data.data.AssignedPlan);
      message.success("AuthorisationLineChargeParameter Deleted Successfully");
    }
  };
  

  // const handlePayerChange =async (value) => {
  //   debugger;
  //   console.log("Selected PayerId:", value);
  //   // Perform any other actions you need with the selected PayerId
  //   const response = await customAxios.get(
  //     `${urlGetTariffPlanForPayerAndGetPayerBillAgreement}?id=${value}&PatientTypeId=${PatientTypeId}`
  //   );
  //   if (response.status === 200 && response.data.data != null){
  //     setBillagreementDropdown(response.data.data);
  //   }
  // };

  const handleCheckboxDaysIsRestrictedChange = (e) => {
    setIsDaysIsRestrictedChecked(e.target.checked);
  };

  const handleCheckboxAuthAmountChange = (e) => {
    setIsAuthAmountChecked(e.target.checked);
  };

  const handleChange = (nextTargetKeys) => {
    if (nextTargetKeys.length > 0) {
      setTransferError(false); // Reset the error state
    }
    setTargetKeys(nextTargetKeys);
  };

  const showModal = async () => {
    debugger;
    await form.validateFields();
    const formvalues = form.getFieldValue();
    if (targetKeys.length === 0) {
      setTransferError(true);
      //message.error('Please select at least one item before proceeding.');
      return; // Stop execution if targetKeys is empty
    }

    setTransferError(false); // Reset the error state

    try {
      if (targetKeys.length > 0) {
        // Check if targetKeys has elements
        // Create an array of MasterModel objects using targetKeys
        const masterModels = targetKeys.map((key) => ({
          LookupID: key, // Assuming LookupID should be assigned targetKey
          // You can assign other properties based on your requirement
        }));

        // Prepare the payload for the POST request
        const payload = {
          SelectedValues: masterModels, // Array of MasterModel objects
          Payer: formvalues.PayerId, // Payer ID value
        };

        const response = await customAxios.post(
          urlGetDropDownsForBillAggrement, // Send payload in the request body
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.data != null) {
          if (response.data.data) {
            setBillAgrementChargeDropdown(response.data.data);
            setIsModalOpen(true);
            //message.success('PriceTariffCreated Successfully');
          } else {
            message.error("PriceTariff With Same Name Already Exists");
          }
        }
      } else {
        // Handle case when targetKeys is empty
        message.error("No keys selected");
      }
    } catch (error) {
      message.error("Something went wrong");
      console.error(error);
    }
  };

  const handleEditAuth = async (values) => {
    debugger;

    try {
      const response = await customAxios.get(
        `${urlEditAuthorisation}?PayerId=${values.PayerId}&PatientId=${PatientId}&EncounterId=${EncounterId}&Authorisation=${values.PlanAuthId}&AssignedPlanId=${values.AssignedPlanId}`
      );
      if (response.status === 200 && response.data.data != null) {
        const AuthData = response.data.data.AddNewAuthorisation;
        form1.setFieldsValue({
          AuthReference: AuthData.AuthReference,
          AuthorisationDate: AuthData.AuthorisationDate
            ? dayjs(AuthData.AuthorisationDate, "DD-MM-YYYY")
            : null,
            AuthValidFromDate: AuthData.AuthValidFromDate
            ? dayjs(AuthData.AuthValidFromDate, "DD-MM-YYYY")
            : null,
            AuthValidToDate: AuthData.AuthValidToDate
            ? dayjs(AuthData.AuthValidToDate, "DD-MM-YYYY")
            : null,
            IsDaysRestricted:AuthData.IsDaysRestricted,
            ApprovedDays : AuthData.ApprovedDays,
            IsAmtAuthorized : AuthData.IsAmtAuthorized,
            AuthAmount : AuthData.AuthAmount,
            AmtDeductible : AuthData.AmtDeductible

        });
         
        const filteredtransData =
        response.data.data.SelectedChargeParameters?.filter(
          (item) => item.LookupDescription !== "Payer"
        ).map((item) => ({
          key: item.LookupID,
          title: item.LookupDescription,
          // Add more fields as needed
        }));

      // Set the pre-selected items in Transfer
      setTargetKeys(filteredtransData?.map((item) => item.key));
      setColumnData(response.data.data.AuthorisationLine);

      setAddAuth(true);
      setAddNewAuthShowBtn(false);
      setPlanAuthId(values.PlanAuthId);
      setAssignedPlanId(values.AssignedPlanId);

      }
    } catch (error) {}
  };

  const handleEditChargeParameter = async(record) =>{
    debugger;
    try {
      const response = await customAxios.get(
        `${urlEditAuthorisationChargeParameter}?AuthorisationLine=${record.AuthLineId}`
      );
      if (response.status === 200 && response.data.data != null) {
        const editchargeparameteres = response.data.data;
        setEditbillAgrementChargeDropdown(editchargeparameteres);
        setLinedata(editchargeparameteres.AddNewAuthorisationLine);
        setEditedAuthLineId(record.AuthLineId);
        setEditModalOpen(true);
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }



  const columns = [
    {
      title: "Charge Parameters",
      dataIndex: "ListOfChargeParameters",
      key: "chargeParameters",
      render: (text, record) => {
        const chargeParameters = [];
        if (record.NationalityName)
          chargeParameters.push(record.NationalityName);
        if (record.PatientTypeName)
          chargeParameters.push(record.PatientTypeName);
        if (record.ProviderName) chargeParameters.push(record.ProviderName);
        if (record.WardTypeName) chargeParameters.push(record.WardTypeName);
        if (record.GenderName) chargeParameters.push(record.GenderName);
        if (record.PayerName) chargeParameters.push(record.PayerName);
        if (record.IncomeLimit)
          chargeParameters.push(record.IncomeLimit.toString());
        return chargeParameters.join(", ");
      },
    },
    {
      title: "Indicator",
      dataIndex: "IndicatorName",
      key: "indicator",
    },
    {
      title: "Description",
      dataIndex: "IndicatorDescriptionName",
      key: "description",
    },
    {
      title: "Is Excluded",
      dataIndex: "IsExcluded",
      key: "isExcluded",
      render: (isExcluded) => (isExcluded ? "True" : "False"),
    },
    {
      title: "DenialCode",
      dataIndex: "DenialCode",
      key: "DenialCode",
    },
    {
      title: "Qty",
      dataIndex: "Qty",
      key: "qty",
    },
    {
      title: "Amount Indicator",
      dataIndex: "AmtIndicator",
      key: "AmtIndicator",
      render: (amtIndicator) =>
        amtIndicator === "A"
          ? "Amount"
          : amtIndicator
          ? "Percentage"
          : "",
    },
    {
      title: "Value",
      dataIndex: "Value",
      key: "value",
    },
    {
      title: "Priority",
      dataIndex: "Priority",
      key: "priority",
      render: (priority) =>
        priority === "A" ? "Amount" : priority ? "Quantity" : "",
    },
    
    {
      title: "Requested Amt",
      dataIndex: "AmtRequested",
      key: "AmtRequested",
    },
  
    {
      title: "Deductibles",
      dataIndex: "AmtDeductible",
      key: "AmtDeductible",
    },
    {
      title: "Coverage Limit",
      dataIndex: "CoverageType",
      key: "coverageLimit",
      render: (coverageType) =>
        coverageType === "PD" ? "Per day" : coverageType ? "Per Encounter" : "",
    },
    {
      title: "Coverage",
      dataIndex: "CoverageBy",
      key: "CoverageBy",
      render: (coverageBy) =>
        coverageBy === "Payer" ? "Payer" : coverageBy ? "Patient" : "",
    },
    {
      title: "Max Coverage Limit",
      dataIndex: "MaxCoverageAmt",
      key: "MaxCoverageAmt",
    },
    {
      title: "Approval Code",
      dataIndex: "ApprovalCode",
      key: "ApprovalCode",
      render: (ApprovalCode) =>
        ApprovalCode === "L" ? "LifeTime" : ApprovalCode ? "Encounter" : "",
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
      
    },
  
  ];
  const columnsAuth = [
    {
      title: "AuthReference",
      dataIndex: "AuthReference",
      key: "AuthReference",
    },
    {
      title: "AuthDate",
      dataIndex: "AuthorisationDate",
      key: "AuthorisationDate",
    },
    {
      title: "AuthValidFrom",
      dataIndex: "AuthValidFromDate",
      key: "AuthValidFromDate",
    },
    {
      title: "AuthValidTo",
      dataIndex: "AuthValidToDate",
      key: "AuthValidToDate",
    },

    {
      title: "AmtDeductible",
      dataIndex: "AmtDeductible",
      key: "AmtDeductible",
    },

    {
      title: "ApprovedDays",
      dataIndex: "ApprovedDays",
      key: "ApprovedDays",
    },
    {
      title: "AuthAmount",
      dataIndex: "AuthAmount",
      key: "AuthAmount",
    },
  ];

  return (
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
            padding: "0.2rem 2rem 0rem 2rem",
            backgroundColor: "#40A2E3",
            borderRadius: "5px 5px 0px 0px ",
          }}
        >
          <Col span={16}>
            <Title level={4} style={{ color: "white", fontWeight: 500 }}>
              Assigned Plan
            </Title>
          </Col>
        </Row>
        <div style={{ margin: "0 2rem 1rem 2rem" }}>
          <PatientHeader patient={patientData} />
        </div>

        <Row gutter={16}>
          <Col span={6}>
            <div
              style={{
                height: "min-content",
                width: "100%",
                borderRadius: "0.5rem",
                boxShadow:
                  "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
              }}
            >
              <Row
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.8rem",
                }}
              >
                <Col>
                  <span>Plan Assigned</span>
                </Col>
                <Col>
                  <Button onClick={handleAddNew} type="primary">
                    Add New
                  </Button>
                </Col>
              </Row>

              {assignedPlan?.map((Plan, index) => {
                return (
                  <Row
                    key={index}
                    style={{
                      height: "max-content",
                      backgroundColor: "#ccc",
                      // width: "100%",
                      margin: "0.5rem 1.5rem",
                      padding: "0.5rem 0",
                    }}
                  >
                    <Col span={20}>
                      <span
                        style={{
                          paddingLeft: "0.5rem",
                          wordBreak: "break-word",
                        }}
                      >
                        {Plan?.PayerId ? Plan.PayerName : "Self Pay"}
                      </span>
                    </Col>
                    <Col
                      span={4}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {Plan?.PayerId && (
                        <>
                          <Button
                            onClick={() => handleEdit(Plan.AssignedPlanId)}
                            type="link"
                            icon={<EditOutlined />}
                          />
                          <Button
                            onClick={() => handleDelete(Plan.AssignedPlanId)}
                            type="link"
                            icon={<DeleteOutlined />}
                          />
                        </>
                      )}
                    </Col>
                  </Row>
                );
              })}
            </div>
          </Col>
          <Col span={18}>
            {show && (
              <div
                style={{
                  height: "min-content",
                  width: "100%",
                }}
              >
                <Form
                  layout="vertical"
                  onFinish={(values) => {
                    debugger;
                    handleOnFinish(values);
                  }}
                  variant="outlined"
                  style={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
                  }}
                  form={form}
                  initialValues={{
                    ParentPriceApplicable: false,
                    MembershipValidToDate: dayjs(),
                    MembershipValidFromDate: dayjs(),
                  }}
                >
                  <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                      <Form.Item
                        name="PayerId"
                        rules={[
                          {
                            required: true,
                            message: "Please input!",
                          },
                        ]}
                        label="Payer"
                      >
                        {/* <Select onChange={(value) => handlePayerChange(value)} > */}
                        <Select>
                          {billagreementDropdown.Payer?.map((option) => (
                            <Select.Option
                              key={option.PayerId}
                              value={option.PayerId}
                            >
                              {option.PayerName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Form.Item name="EmployerId" label="Employer">
                        <Select>
                          {billagreementDropdown.PayerEmployer?.map(
                            (option) => (
                              <Select.Option
                                key={option.PayerId}
                                value={option.PayerId}
                              >
                                {option.PayerName}
                              </Select.Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Form.Item name="InsurerId" label="InsuranceProvider">
                        <Select>
                          {billagreementDropdown.PayerInsurance?.map(
                            (option) => (
                              <Select.Option
                                key={option.PayerId}
                                value={option.PayerId}
                              >
                                {option.PayerName}
                              </Select.Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: "Please input!",
                          },
                        ]}
                        name="TariffPlanId"
                        label="Tariff Plan"
                      >
                        <Select>
                          {billagreementDropdown.PriceTariff?.map((option) => (
                            <Select.Option
                              key={option.PriceTariffId}
                              value={option.PriceTariffId}
                            >
                              {option.LongPriceDescription}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item
                        name="AgreementReference"
                        label="Agreement Reference"
                      >
                        <Select>
                          {billagreementDropdown.BillAgreementModels?.map(
                            (option) => (
                              <Select.Option
                                key={option.AgreementReferenceNumber}
                                value={option.AgreementReferenceNumber}
                              >
                                {option.AgreementDescription}
                              </Select.Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: "Please input!",
                          },
                        ]}
                        label="Membership&nbsp;Valid&nbsp;FromDate"
                        name="MembershipValidFromDate"
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="DD-MM-YYYY"
                        />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: "Please input!",
                          },
                        ]}
                        label="Membership Valid ToDate"
                        name="MembershipValidToDate"
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="DD-MM-YYYY"
                        />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Form.Item name="EmployeeNumber" label="EmployeeNumber">
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item
                        label={
                          <>
                            <Form.Item
                              style={{ marginBottom: 0 }}
                              valuePropName="checked"
                              name="ParentPriceApplicable"
                            >
                              <Checkbox />
                            </Form.Item>
                            <span style={{ marginRight: 8 }}>
                              Parent Price Applicable
                            </span>
                          </>
                        }
                      ></Form.Item>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Form.Item
                        name="DocumentReference"
                        label="DocumentReference"
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="EligibleWardTypeId"
                        label="Eligible Accomodation Type"
                      >
                        <Select>
                          {billagreementDropdown.WardType?.map((option) => (
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
                    <Col className="gutter-row" span={6}>
                      <Form.Item
                        name="VerificationRemarks"
                        label="Verification Remarks"
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row justify="end">
                    <Col>
                      <Form.Item>
                        <Button
                          disabled={disable}
                          type="primary"
                          htmlType="submit"
                        >
                          {buttonshow ? "Update" : "Save"}
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item>
                        <Button type="default" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                <Row style={{ marginTop: "1rem" }}>
                  <Col>
                    <Form.Item>
                      <Button onClick={handleAddAuthorisation} type="link">
                        Authorisation
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
                {columnAuthData && columnAuthData.length > 0 && (
                  <CustomTable
                    columns={columnsAuth}
                    dataSource={columnAuthData}
                    actionColumn={true}
                    //isFilter={true}
                    onEdit={handleEditAuth}
                    onDelete={handleDeleteAuth}
                    scroll={{
                      x: 800,
                    }}
                    rowKey={(row) => row.PlanAuthId}
                  />
                )}

                <Form
                  form={form1}
                  name="control-hooks"
                  layout="vertical"
                  variant="outlined"
                  style={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
                  }}
                  onFinish={onFinishAddAuth}
                  initialValues={{
                    IsDaysRestricted: false,
                    IsAmtAuthorized: false,
                    AuthValidToDate: dayjs(),
                    AuthValidFromDate: dayjs(),
                    AuthorisationDate: dayjs(),
                  }}
                >
                  {addAuth && (
                    <>
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
                            Add Authorisation
                          </Title>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                          <Form.Item
                            rules={[
                              {
                                required: true,
                                message: "Please input!",
                              },
                            ]}
                            name="AuthReference"
                            label="AuthorisationReference"
                          >
                            <Input style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item
                            rules={[
                              {
                                required: true,
                                message: "Please input!",
                              },
                            ]}
                            label="Authorisation Date"
                            name="AuthorisationDate"
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              format="DD-MM-YYYY"
                            />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item
                            rules={[
                              {
                                required: true,
                                message: "Please input!",
                              },
                            ]}
                            label="Authorisation Valid From"
                            name="AuthValidFromDate"
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              format="DD-MM-YYYY"
                            />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                          <Form.Item
                            rules={[
                              {
                                required: true,
                                message: "Please input!",
                              },
                            ]}
                            label="Authorisation Valid To"
                            name="AuthValidToDate"
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              format="DD-MM-YYYY"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={4}>
                          <Form.Item
                            label={
                              <>
                                <Form.Item
                                  valuePropName="checked"
                                  name="IsDaysRestricted"
                                  style={{
                                    marginBottom: 0,
                                    display: "inline-block",
                                  }}
                                >
                                  <Checkbox
                                    onChange={
                                      handleCheckboxDaysIsRestrictedChange
                                    }
                                  />
                                </Form.Item>
                                <span style={{ marginLeft: 8 }}>
                                  Restricted Days
                                </span>
                              </>
                            }
                          >
                            <Input.Group compact>
                              <Form.Item name="ApprovedDays" noStyle>
                                <Input
                                  disabled={!isDaysIsRestrictedChecked}
                                  style={{ width: "100%" }}
                                  placeholder="Approved Days"
                                />
                              </Form.Item>
                            </Input.Group>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4}>
                          <Form.Item
                            label={
                              <>
                                <Form.Item
                                  valuePropName="checked"
                                  name="IsAmtAuthorized"
                                  style={{
                                    marginBottom: 0,
                                    display: "inline-block",
                                  }}
                                >
                                  <Checkbox
                                    onChange={handleCheckboxAuthAmountChange}
                                  />
                                </Form.Item>
                                <span style={{ marginLeft: 8 }}>
                                  Auth Amount
                                </span>
                              </>
                            }
                          >
                            <Input.Group compact>
                              <Form.Item name="AuthAmount" noStyle>
                                <Input
                                  disabled={!isAuthAmountChecked}
                                  style={{ width: "100%" }}
                                  placeholder="Auth Amount"
                                />
                              </Form.Item>
                            </Input.Group>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4}>
                          <Form.Item name="AmtDeductible" label="Deductibles">
                            <Input style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row justify="end">
                        <Col>
                          <Form.Item>
                            <Button
                              disabled={addNewAuthShowBtn}
                              type="primary"
                              htmlType="submit"
                            >
                              {/* {buttonshow ? "Update" : "Save"} */}Ok
                            </Button>
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item>
                            <Button
                              type="default"
                              onClick={handleCancelAddAuth}
                            >
                              Close
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form>
                {planAuthId && (
                  <div
                    style={{
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      marginTop: "1rem",
                      boxShadow:
                        "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
                    }}
                  >
                    <Form form={form2}>
                      <Divider style={{ marginTop: "0.2rem" }}></Divider>

                      <Form.Item
                        label="Transfer"
                        validateStatus={transferError ? "error" : ""}
                        help={
                          transferError ? "Please select at least one item" : ""
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please select at least one item",
                          },
                        ]}
                      >
                        <Transfer
                          dataSource={transferData}
                          targetKeys={targetKeys}
                          onChange={handleChange}
                          render={(item) => item.title}
                          disabled={columnData?.length > 0}
                        />
                      </Form.Item>
                    </Form>

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
                          marginTop: "3rem",
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
                          ></Title>
                        </Col>
                        <Col offset={5} span={3}>
                          <Button
                            style={{ marginLeft: "6rem" }}
                            icon={<PlusCircleOutlined />}
                            onClick={showModal}
                          ></Button>
                        </Col>
                      </Row>
                      <div>
                        <Spin spinning={loading}>
                          <CustomTable
                            columns={columns}
                            dataSource={columnData}
                            actionColumn={true}
                            isFilter={true}
                            onEdit={handleEditChargeParameter}
                            onDelete={handleDeleteAuthorisationLineChargeParameter}
                            scroll={{
                              x: 1500,
                            }}
                            rowKey={(row) => row.AuthLineId}
                          />
                        </Spin>
                        <AssignedPlanModal
                          options={billAgrementChargeDropdown}
                          open={isModalOpen}
                          handleClose={() => setIsModalOpen(false)}
                          planAuthId={planAuthId}
                          setColumnData={setColumnData}
                        />
                        <EditAssignedPlanModal
                            options={editbillAgrementChargeDropdown}
                            open={editModalOpen}
                            handleClose={() => setEditModalOpen(false)}
                            editedAuthlineId={editedAuthlineId}
                            setColumnData={setColumnData}
                            linedata={linedata}
                          />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>

        {/* <Divider orientation="left"></Divider> */}
      </div>
    </Layout>
  );
};

export default CreateAssignedPlan;
