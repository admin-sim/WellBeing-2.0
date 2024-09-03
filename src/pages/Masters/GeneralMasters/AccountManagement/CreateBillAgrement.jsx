import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  Layout,
  Card,
  DatePicker,
  message,
  Space,
  Checkbox,
  Typography,
} from "antd";
import Title from "antd/es/typography/Title";

import Input from "antd/es/input/Input";
import customAxios from "../../../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";
import {
  urlCreatePriceTariff,
  urlSaveNewPriceTariff,
  urlEditPriceTariffChargeParameter,
  urlGetDropDownsForPricetariif,
  urlSaveNewPriceTariffChargeParameter,
  urlEditPriceTariff,
  urlUpdatePriceTariff,
  urlBillAgreementCreate,
  urlSaveNewBillAgreement,
  urlGetDropDownsForBillAggrement,
  urlEditBillAgreement,
  urlEditBillAgreementChargeParameter,
  urlUpdateBillAgreement,
  urlDeleteBillAgreementChargeParameter,
} from "../../../../../endpoints";
import PriceChargeModal from "./PriceChargeModal";
import EditPriceChargeModal from "./EditPriceChargeModal";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Transfer } from "antd";
import CustomTable from "../../../../components/customTable";
import dayjs from "dayjs";
import FormItem from "antd/es/form/FormItem";
import BillAggrementModal from "./BillAggrementModal";
import EditBillAgrementModal from "./EditBillAgrementModal";

const { TextArea } = Input;

function CreateBillAgrement() {
  const [form] = Form.useForm();

  const location = useLocation();
  const EditedAgreementId = location.state?.AgreementId;
  console.log("EditedAgreementId", EditedAgreementId);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [columnData, setColumnData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [transferError, setTransferError] = useState(false);
  const [agreementId, setAgreementId] = useState(0);
  const [linedata, setLinedata] = useState(null);

  const [editedAgrementlineId, setEditedAgrementLineId] = useState(null);

  const [isChecked, setIsChecked] = useState(false);
  const [isDaysIsRestrictedChecked, setIsDaysIsRestrictedChecked] =
    useState(false);
  const [isDeductibleIsRestrictedChecked, setIsDeductibleIsRestrictedChecked] =
    useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };
  const handleCheckboxDaysIsRestrictedChange = (e) => {
    setIsDaysIsRestrictedChecked(e.target.checked);
  };
  const handleCheckboxDeductibleIsRestrictedChange = (e) => {
    setIsDeductibleIsRestrictedChecked(e.target.checked);
  };

  const [billagreementDropdown, setBillagreementDropdown] = useState({
    ChargeParameters: [],
    RestrictedTypes: [],
    PayerInsurance: [],
    PayerEmployer: [],
    Facility: [],
    Payer: [],
    Indicators: [],
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

  const handleCancel = () => {
    navigate("/BillAggrement");
  };

  const handleEdit = async (record) => {
    try {
      const response = await customAxios.get(
        `${urlEditBillAgreementChargeParameter}?BillAgreementLine=${record.AgreementLineId}`
      );
      if (response.status === 200 && response.data.data != null) {
        const editpricechargeparameteres = response.data.data;
        setEditbillAgrementChargeDropdown(editpricechargeparameteres);
        setLinedata(editpricechargeparameteres.AddNewBillAgreementLineModel);
        setEditedAgrementLineId(record.AgreementLineId);
        setEditModalOpen(true);
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    debugger;
    if (EditedAgreementId) {
      // Check if EditedPricetariffId exists
      const fetchData1 = async () => {
        const Revision = 0;
        try {
          const response = await customAxios.get(
            `${urlEditBillAgreement}?BillAgreement=${EditedAgreementId}&Revision=${Revision}`
          );
          if (response.status === 200 && response.data.data != null) {
            const editbillagrementdetail = response.data.data;
            form.setFieldsValue({
              AgreementReferenceNumber:
                editbillagrementdetail.AddNewBillAgreement
                  .AgreementReferenceNumber,
              AgreementDescription:
                editbillagrementdetail.AddNewBillAgreement.AgreementDescription,
              PayerId: editbillagrementdetail.AddNewBillAgreement.PayerId,
              EmployerId: editbillagrementdetail.AddNewBillAgreement.EmployerId,
              IsAuthLimitRestricted:
                editbillagrementdetail.AddNewBillAgreement
                  .IsAuthLimitRestricted,
              PreauthRequired:
                editbillagrementdetail.AddNewBillAgreement.PreauthRequired,
              IsDaysRestricted:
                editbillagrementdetail.AddNewBillAgreement.IsDaysRestricted,
              IsDeductibleRestricted:
                editbillagrementdetail.AddNewBillAgreement
                  .IsDeductibleRestricted,
              RestrictedAuthLimit:
                editbillagrementdetail.AddNewBillAgreement.RestrictedAuthLimit,
              RestrictedAuthLimitType:
                editbillagrementdetail.AddNewBillAgreement
                  .RestrictedAuthLimitType,
              InsurerId: editbillagrementdetail.AddNewBillAgreement.InsurerId,
              RestrictedDeductible:
                editbillagrementdetail.AddNewBillAgreement.RestrictedDeductible,
              RestrictedDeductibleType:
                editbillagrementdetail.AddNewBillAgreement
                  .RestrictedDeductibleType,
              RestrictedDays:
                editbillagrementdetail.AddNewBillAgreement.RestrictedDays,
              Status: editbillagrementdetail.AddNewBillAgreement.Status,
              DiscountShare:
                editbillagrementdetail.AddNewBillAgreement.DiscountShare,
              FacilityId: editbillagrementdetail.AddNewBillAgreement.FacilityId,
              Remarks: editbillagrementdetail.AddNewBillAgreement.Remarks,
              ValidFromDate: editbillagrementdetail.AddNewBillAgreement
                .ValidFromDate
                ? dayjs(
                    editbillagrementdetail.AddNewBillAgreement.ValidFromDate,
                    "DD-MM-YYYY"
                  )
                : null,
              ValidToDate: editbillagrementdetail.AddNewBillAgreement
                .ValidToDate
                ? dayjs(
                    editbillagrementdetail.AddNewBillAgreement.ValidToDate,
                    "DD-MM-YYYY"
                  )
                : null,
            });
            const filteredtransData =
              editbillagrementdetail.SelectedChargeParameters.filter(
                (item) => item.LookupDescription !== "Payer"
              ).map((item) => ({
                key: item.LookupID,
                title: item.LookupDescription,
                // Add more fields as needed
              }));

            // Set the pre-selected items in Transfer
            setTargetKeys(filteredtransData.map((item) => item.key));
            setColumnData(editbillagrementdetail.BillAgreementLineModels);
          } else {
            console.error("Failed to fetch patient details");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData1(); // Call the fetchData function
    }
  }, []);

  const handleChange = (nextTargetKeys) => {
    if (nextTargetKeys.length > 0) {
      setTransferError(false); // Reset the error state
    }
    setTargetKeys(nextTargetKeys);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlBillAgreementCreate}`);
      if (response.status == 200 && response.data.data != null) {
        setBillagreementDropdown(response.data.data);
        form.setFieldsValue({
          AgreementReferenceNumber: response.data.data.AgreementReferenceNumber,
        });
        const transData = response.data.data.ChargeParameters.map((item) => ({
          key: item.LookupID, // Replace 'id' with the unique key in your data
          title: item.LookupDescription, // Replace 'name' with the field you want to display in the list
          // Add more fields as needed
        }));
        setTransferData(transData);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDelete = async (record) => {
    debugger;
    try {
      const response = await customAxios.delete(
        `${urlDeleteBillAgreementChargeParameter}?billAgreementLineId=${record.AgreementLineId}&agreementId=${record.AgreementId}`
      );
      if (response.status === 200 && response.data.data != null) {
        setColumnData(response.data.data.BillAgreementLineModels);
        message.success("Deleted Sucessfully..");
      
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const onFinish = async (values) => {
    debugger;
    setLoading(true);

    const postData1 = {
      ValidFromDate: values.ValidFromDate
        ? values.ValidFromDate.format("DD-MM-YYYY")
        : "",
      ValidToDate: values.ValidToDate
        ? values.ValidToDate.format("DD-MM-YYYY")
        : "",
      AgreementReferenceNumber: values.AgreementReferenceNumber,
      AgreementDescription: values.AgreementDescription,
      FacilityId: 1,
      Remarks: values.Remarks,
      RestrictedDays: values.RestrictedDays,
      IsDaysRestricted: values.IsDaysRestricted,
      RestrictedDeductible: values.RestrictedDeductible,
      RestrictedDeductibleType: values.RestrictedDeductibleType,
      IsDeductibleRestricted: values.IsDeductibleRestricted,
      RestrictedAuthLimit: values.RestrictedAuthLimit,
      IsAuthLimitRestricted: values.IsAuthLimitRestricted,
      RestrictedAuthLimitType: values.RestrictedAuthLimitType,
      PayerId: values.PayerId,
      EmployerId: values.EmployerId,
      InsurerId: values.InsurerId,
      PreauthRequired: values.PreauthRequired,
      DiscountShare: values.DiscountShare,
      Status: values.Status,
      ActiveFlag: true,
      AgreementId: EditedAgreementId ? EditedAgreementId : 0,
    };

    const url =
      EditedAgreementId > 0 ? urlUpdateBillAgreement : urlSaveNewBillAgreement;
    try {
      const response = await customAxios.post(url, postData1, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 && response.data) {
        if (response.data.data > 0) {
          if (EditedAgreementId > 0) {
            message.success("PriceTariff Updated Successfully");
            navigate("/BillAggrement");
          } else {
            setAgreementId(response.data.data);
            message.success("PriceTariff Created Successfully");
          }
        } else {
          message.error(
            EditedAgreementId > 0
              ? "Something Went Wrong"
              : "PriceTariff With Same Name Already Exists"
          );
        }
      }
    } catch (error) {
      message.error("Something went wrong");
      console.error(error);
      setLoading(false);
    }

    setLoading(false);
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
      title: "Qty",
      dataIndex: "MaxQty",
      key: "qty",
    },
    {
      title: "Amount Indicator",
      dataIndex: "AmountIndicator",
      key: "amountIndicator",
      render: (amountIndicator) =>
        amountIndicator === "A"
          ? "Amount"
          : amountIndicator
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
      title: "Deductibles",
      dataIndex: "Deductible",
      key: "deductibles",
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
      key: "coverage",
      render: (coverageBy) =>
        coverageBy === "Payer" ? "Payer" : coverageBy ? "Patient" : "",
    },
    {
      title: "Max Coverage Limit",
      dataIndex: "MaxCoverage",
      key: "maxCoverage",
    },
    {
      title: "Applicable To",
      dataIndex: "ApplicableTo",
      key: "applicableTo",
      render: (applicableTo) =>
        applicableTo === "L" ? "LifeTime" : applicableTo ? "Encounter" : "",
    },
    {
      title: "PreAuth",
      dataIndex: "IsPreauthRequired",
      key: "preAuth",
      render: (isPreauthRequired) =>
        isPreauthRequired ? "True" : isPreauthRequired === false ? "" : "False",
    },
    {
      title: "Shared",
      dataIndex: "IsShared",
      key: "shared",
      render: (isShared) =>
        isShared ? "True" : isShared === false ? "" : "False",
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
                Bill Agreement
              </Title>
            </Col>
          </Row>
          <Card>
            <Form
              form={form}
              name="control-hooks"
              layout="vertical"
              variant="outlined"
              onFinish={onFinish}
              initialValues={{
                ValidFromDate: dayjs(),
                ValidToDate: dayjs(),
                IsAuthLimitRestricted: false,
                PreauthRequired: false,
                IsDaysRestricted: false,
                IsDeductibleRestricted: false,
                Status: "Active",
              }}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="AgreementReferenceNumber"
                    label="AgreementReferenceNumber"
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
                    name="AgreementDescription"
                    label="AgreementDescription"
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
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
                    <Select>
                      {billagreementDropdown.Payer.map((option) => (
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
                      {billagreementDropdown.PayerEmployer?.map((option) => (
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
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Please input!",
                      },
                    ]}
                    label="Valid From"
                    name="ValidFromDate"
                  >
                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
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
                    label="Valid To"
                    name="ValidToDate"
                  >
                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    label={
                      <>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          name="IsAuthLimitRestricted"
                          valuePropName="checked"
                        >
                          <Checkbox onChange={handleCheckboxChange} />
                        </Form.Item>
                        <span style={{ marginRight: 8 }}>
                          Restricted Authorisation Limit
                        </span>
                      </>
                    }
                  >
                    <Space.Compact>
                      <Form.Item name="RestrictedAuthLimit">
                        <Input disabled={!isChecked} />
                      </Form.Item>
                      <Form.Item name="RestrictedAuthLimitType">
                        <Select disabled={!isChecked} />
                      </Form.Item>
                    </Space.Compact>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="InsurerId" label="InsuranceProvider">
                    <Select>
                      {billagreementDropdown.PayerInsurance?.map((option) => (
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
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    label={
                      <>
                        <Form.Item
                          name="IsDeductibleRestricted"
                          valuePropName="checked"
                          style={{ marginBottom: 0 }}
                        >
                          <Checkbox
                            onChange={
                              handleCheckboxDeductibleIsRestrictedChange
                            }
                          />
                        </Form.Item>
                        <span style={{ marginRight: 8 }}>
                          Restricted Deductibles
                        </span>
                      </>
                    }
                  >
                    <Space.Compact>
                      <Form.Item name="RestrictedDeductible">
                        <Input disabled={!isDeductibleIsRestrictedChecked} />
                      </Form.Item>
                      <Form.Item name="RestrictedDeductibleType">
                        <Select disabled={!isDeductibleIsRestrictedChecked} />
                      </Form.Item>
                    </Space.Compact>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    label={
                      <>
                        <Form.Item
                          valuePropName="checked"
                          name="IsDaysRestricted"
                          style={{ marginBottom: 0 }}
                        >
                          <Checkbox
                            onChange={handleCheckboxDaysIsRestrictedChange}
                          />
                        </Form.Item>
                        <span style={{ marginRight: 8 }}>Restricted Days</span>
                      </>
                    }
                  >
                    <Space.Compact>
                      <Form.Item name="RestrictedDays">
                        <Input disabled={!isDaysIsRestrictedChecked} />
                      </Form.Item>
                    </Space.Compact>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="Status" label="Status">
                    <Select>
                      <Select.Option
                        key="Active"
                        value="Active"
                      ></Select.Option>
                      <Select.Option
                        key="Hidden"
                        value="Hidden"
                      ></Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="DiscountShare" label="DiscountShare">
                    <Select>
                      <Select.Option key="Payer" value="Payer"></Select.Option>
                      <Select.Option
                        key="Patient"
                        value="Patient"
                      ></Select.Option>
                      <Select.Option key="Both" value="Both"></Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Please input!",
                      },
                    ]}
                    name="FacilityId"
                    label="Facility"
                  >
                    <Select>
                      {billagreementDropdown.Facility?.map((option) => (
                        <Select.Option
                          key={option.FacilityId}
                          value={option.FacilityId}
                        >
                          {option.FacilityName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={
                      <>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          valuePropName="checked"
                          name="PreauthRequired"
                        >
                          <Checkbox />
                        </Form.Item>
                        <span style={{ marginRight: 8 }}>
                          Prior To Admin/Auth
                        </span>
                      </>
                    }
                  ></Form.Item>
                </Col>
                <Col span={6}>
                  {" "}
                  {/* Corresponds to col-sm-3 */}
                  <Form.Item
                    name="Remarks"
                    label="Remarks"
                    className="form-bottom-padding"
                  >
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="end">
                <Col>
                  <Form.Item
                    style={{
                      display:
                        agreementId === 0 &&
                        (EditedAgreementId === 0 || EditedAgreementId == null)
                          ? "inline-block"
                          : "none",
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        display:
                          agreementId === 0 &&
                          (EditedAgreementId === 0 || EditedAgreementId == null)
                            ? "inline-block"
                            : "none",
                      }}
                    >
                      Save
                    </Button>
                  </Form.Item>
                  <Form.Item
                    style={{
                      display: EditedAgreementId > 0 ? "inline-block" : "none",
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        display:
                          EditedAgreementId > 0 ? "inline-block" : "none",
                      }}
                    >
                      Update
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
              <div
                style={{
                  display:
                    agreementId > 0 || EditedAgreementId > 0 ? "block" : "none",
                }}
              >
                <div>
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
                </div>
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
                        style={{ marginLeft: "8rem" }}
                        icon={<PlusCircleOutlined />}
                        onClick={showModal}
                      ></Button>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Spin spinning={loading}>
                    <CustomTable
                      columns={columns}
                      dataSource={columnData}
                      actionColumn={true}
                      isFilter={true}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      rowKey={(row) => row.AgreementLineId}
                    />
                  </Spin>
                  <BillAggrementModal
                    options={billAgrementChargeDropdown}
                    open={isModalOpen}
                    handleClose={() => setIsModalOpen(false)}
                    agreementId={agreementId ? agreementId : EditedAgreementId}
                    setColumnData={setColumnData}
                  />
                  <EditBillAgrementModal
                    options={editbillAgrementChargeDropdown}
                    open={editModalOpen}
                    handleClose={() => setEditModalOpen(false)}
                    editedAgrementlineId={editedAgrementlineId}
                    setColumnData={setColumnData}
                    linedata={linedata}
                  />
                </div>
              </div>
            </Form>
          </Card>
        </div>
      </Layout>
    </>
  );
}

export default CreateBillAgrement;
