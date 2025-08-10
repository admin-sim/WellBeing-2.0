import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Layout,
  message,
  Popconfirm,
  Row,
  Select,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import PatientHeader from "../../../components/PatientHeader";
import { useForm } from "antd/es/form/Form";

import { FaAnglesLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import {
  urlGetAllServiceAsync,
  urlGetPatientHeaderDetails,
  urlGetServiceChargeforProcedure,
  urlGetServiceDetails,
  urlPackageCreate,
  urlSavePackageReceiptDetails,
} from "../../../../endpoints";

import customAxios from "../../../components/customAxios/customAxios";
import { useLocation } from "react-router-dom";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function CreatePackage() {
  const [form] = useForm();
  const location = useLocation();
  const [patientData, setPatientData] = useState(null);
  const PatientId = location.state.patientId;
  const EncounterId = location.state.encounterId;

  const navigate = useNavigate();

  const [packages, setPackages] = useState(null);
  const [providers, setProviders] = useState(null);
  const [banks, setBanks] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState(null);
  const [counter, setCounter] = useState(2);
  const [providerId, setProviderId] = useState(null);
  useEffect(() => {
    fetchDataHeader();
    fetchPackageDetails();
  }, []);

  const fetchDataHeader = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${PatientId}&EncounterId=${EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setPatientData(detailsheader);
        form.setFieldsValue({
          RecievedFrom: detailsheader?.PatientName,
        });
      } else {
      }
    } catch (error) {}
  };

  const fetchPackageDetails = async () => {
    try {
      const response = await customAxios.get(
        `${urlPackageCreate}?PatientId=${PatientId}&EncounterId=${EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const detailsheader = response.data.data;
        setPaymentTypes(detailsheader.PaymentType);
        setBanks(detailsheader.Banks);
        setPackages(detailsheader.Services);
        setProviders(detailsheader.Provider);
        setProviderId(detailsheader.ProviderId); 

        const updatedPackageData = packageData.map((row) => ({
          ...row,
          ProviderId: detailsheader.ProviderId,
        }));

        setPackageData(updatedPackageData); 

        const formValues = {};
        updatedPackageData.forEach((row, index) => {
          formValues[`ProviderId[${index}]`] = detailsheader.ProviderId;
        });

        form.setFieldsValue(formValues);
      } else {
      }
    } catch (error) {}
  };

  const initialDataSource = [
    {
      key: 1,
      ServicePackageId: "",
      NoOfDays: "",
      StartDateTime: dayjs(), 
      EndDateTime: dayjs(), 
      ProviderId: "",
      PackageAmount: 1,
      DepositPaid: 0,
      BalanceAmt: 0,
      ServiceGroupId: "",
      ServiceClassificationId: "",
      EncounterID: EncounterId,
      PatientId: PatientId,
    },
  ];
  const [packageData, setPackageData] = useState(initialDataSource);

  const initialDataSourcePackage = [
    {
      key: 1,
      PaymentTypeId: "",
      InstrumentAmount: "",
      BankId: "",
      BranchName: "",
      IFSC: "",
      AuthorizationReference: "",
      CardExpiryDate: "",
      CardNumber: "",
      Cheqdate: "",
      Remarks: "",
    },
  ];

  const handleAddRow = async () => {
    await form.validateFields();
    setReceiptInsAmtData([
      ...receiptInsAmtData,
      {
        key: counter, 
        PaymentTypeId: "",
        InstrumentAmount: "",
        BankId: "",
        BranchName: "",
        IFSC: "",
        AuthorizationReference: "",
        CardExpiryDate: "",
        CardNumber: "",
        Cheqdate: "",
        Remarks: "",
      },
    ]);
    setCounter(counter + 1); 
  };

  const [receiptInsAmtData, setReceiptInsAmtData] = useState(
    initialDataSourcePackage
  );

  const handleFinish = async () => {
    try {
      const indicatorResponse = await customAxios.get(urlGetAllServiceAsync); 

      const indicatorId = indicatorResponse?.data?.data?.[0]?.LookupID;

      if (!indicatorId) {
        message.error("IndicatorId not found.");
        return;
      }

      const receipt = {
        PatientId: PatientId,
        ReceivedFrom: form.getFieldValue("RecievedFrom"),
        CashReceiptDate: dayjs(form.getFieldValue("ReceiptDate")).format(
          "DD-MM-YYYY"
        ),
        ReceiptAmount: form.getFieldValue("ReceiptAmount"),
        BalanceAmt: form.getFieldValue("BalanceDeposit"),
        EncounterId: EncounterId,
      };

      const packageModel = {
        EncounterID: EncounterId,
        PatientId: PatientId,
        ServicePackageId: packageData[0].ServicePackageId,
      };

      const mappedPackages = packageData.map((item) => ({
        ServicePackageId: item.ServicePackageId,
        NoOfDays: item.NoOfDays,
        StartDateTime: item.StartDateTime
          ? dayjs(item.StartDateTime).format("DD-MM-YYYY")
          : "",
        EndDateTime: item.EndDateTime
          ? dayjs(item.EndDateTime).format("DD-MM-YYYY")
          : "",
        ProviderId: item.ProviderId,
        PackageAmount: item.PackageAmount,
        DepositPaid: item.DepositPaid,
        BalanceAmt: item.BalanceAmt,
        EncounterID: EncounterId,
        PatientId: PatientId,
        ServiceClassificationId: item.ServiceClassificationId,
        ServiceGroupId: item.ServiceGroupId,
      }));

      const mappedAllocations = receiptInsAmtData.map((item) => ({
        PaymentTypeId: item.PaymentTypeId,
        IndicatorId: indicatorId,
        IndicatorDescriptionId: packageData[0].ServicePackageId,
        Balance: packageData[0].BalanceAmt,
        EncounterID: EncounterId, 
        PatientId: PatientId,
      }));

      const formattedReceiptInsAmtData = receiptInsAmtData.map((item) => ({
        AuthorizationReference: item.AuthorizationReference || "",
        BankId: item.BankId ? parseInt(item.BankId, 10) : 0,
        BranchName: item.BranchName || "",
        CardExpiryDate: item.CardExpiryDate || "",
        ChequeDates: item.Cheqdate || "",
        IFSC: item.IFSC || "",
        InstrumentAmount: item.InstrumentAmount
          ? parseFloat(item.InstrumentAmount)
          : 0,
        PaymentTypeId: item.PaymentTypeId,
        CardNumber: item.CardNumber || "",
        Remarks: item.Remarks || "",
        EncounterId: EncounterId || "",
      }));

      const postData = {
        ReceiptModel: receipt,
        Allocations: mappedAllocations,
        CollectionModes: formattedReceiptInsAmtData,
        Package: mappedPackages,
        PackageModel: packageModel,
      };

      const receiptAmount =
        parseFloat(form.getFieldValue("ReceiptAmount")) || 0;

      const totalDepositPaid = mappedPackages.reduce(
        (sum, item) => sum + (parseFloat(item.DepositPaid) || 0),
        0
      );

      const totalInstrumentAmount = formattedReceiptInsAmtData.reduce(
        (sum, item) => sum + (parseFloat(item.InstrumentAmount) || 0),
        0
      );

      if (
        receiptAmount !== totalDepositPaid ||
        receiptAmount !== totalInstrumentAmount
      ) {
        message.error(
          `Mismatch in amounts: Receipt (${receiptAmount}), DepositPaid (${totalDepositPaid}), InstrumentAmount (${totalInstrumentAmount})`
        );
        return; 
      }

      const response = await customAxios.post(
        urlSavePackageReceiptDetails,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const result = response.data.data; 

      if (result === "true") {
        message.success("Package Details Saved Successfully");
        form.resetFields();
        setPackageData(initialDataSource);
        setReceiptInsAmtData(initialDataSourcePackage);
      } else {
        message.error("Error: " + result); 
      }
    } catch (error) {
      console.error("Save failed", error);
      message.error("Save failed due to an error.");
    }
  };

  const handleInputChange = (value, fieldName, key) => {
    setReceiptInsAmtData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, [fieldName]: value } : item
      )
    );
  };

  const handlePackageInputChange = (value, fieldName, key) => {
    setPackageData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, [fieldName]: value } : item
      )
    );
  };

  const fetchServicePackDetails = async (serviceId, recordKey) => {
    try {
      const [priceRes, detailsRes] = await Promise.all([
        customAxios.get(
          `${urlGetServiceChargeforProcedure}?ServiceId=${serviceId}`
        ),
        customAxios.get(`${urlGetServiceDetails}?serviceId=${serviceId}`),
      ]);

      if (
        priceRes.status === 200 &&
        detailsRes.status === 200 &&
        priceRes.data?.data?.ServicePriceDefinition
      ) {
        const priceDef = priceRes.data.data.ServicePriceDefinition;
        const details = detailsRes.data.data;

        const price = priceDef.Price || 0;
        const noOfDays = details.PackageDays || 0;

        const currentDate = dayjs();
        const endDate = currentDate.add(noOfDays, "day");

        const deposit = 0;
        const balance = price - deposit;

        // Optional: default provider (if single or preselected)
        //const defaultProviderId = form.getFieldValue("ProviderId")?.[0] || "";

        // Update data state
        setPackageData((prevData) =>
          prevData.map((item) =>
            item.key === recordKey
              ? {
                  ...item,
                  PackageAmount: price,
                  ServiceClassificationId: priceDef.ServiceClassificationId,
                  ServiceGroupId: priceDef.ServiceGroupId,
                  ServicePackageId: serviceId,
                  DepositPaid: deposit,
                  BalanceAmt: balance,
                  NoOfDays: noOfDays,
                  StartDateTime: currentDate,
                  EndDateTime: endDate,
                  ProviderId: providerId,
                }
              : item
          )
        );

        form.setFieldsValue({
          ["PackageAmount"]: { [recordKey - 1]: price },
          ["DepositPaid"]: { [recordKey - 1]: deposit },
          ["BalanceAmt"]: { [recordKey - 1]: balance },
          ["NoOfDays"]: { [recordKey - 1]: noOfDays },
          ["StartDateTime"]: { [recordKey - 1]: currentDate },
          ["EndDateTime"]: { [recordKey - 1]: endDate },
          ["ProviderId"]: { [recordKey - 1]: providerId },
        });
      } else {
        message.warning("No standard price defined for the selected package.");

        const resetDate = dayjs();

        form.setFieldsValue({
          ["PackageAmount"]: { [recordKey - 1]: 0 },
          ["DepositPaid"]: { [recordKey - 1]: 0 },
          ["BalanceAmt"]: { [recordKey - 1]: 0 },
          ["NoOfDays"]: { [recordKey - 1]: 0 },
          ["StartDateTime"]: { [recordKey - 1]: resetDate },
          ["EndDateTime"]: { [recordKey - 1]: resetDate },
          ["ProviderId"]: { [recordKey - 1]: "" },
        });

        setPackageData((prevData) =>
          prevData.map((item) =>
            item.key === recordKey
              ? {
                  ...item,
                  PackageAmount: 0,
                  DepositPaid: 0,
                  BalanceAmt: 0,
                  NoOfDays: 0,
                  StartDateTime: resetDate,
                  EndDateTime: resetDate,
                  ProviderId: "",
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error fetching package details:", error);
      message.error("Error fetching package details");
    }
  };

  const packagecolumns = [
    {
      title: "Package",
      dataIndex: "ServicePackageId",
      width: 300,
      key: "ServicePackageId",
      render: (text, record, index) => (
        <Form.Item
          name={["ServicePackageId", record.key - 1]}
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            onChange={(value) => {
              handlePackageInputChange(value, "ServicePackageId", record.key);
              fetchServicePackDetails(value, record.key);
            }}
          >
            {packages?.map((option) => (
              <Option key={option.ServiceId} value={option.ServiceId}>
                {option.LongName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },

    {
      title: "No Of Days",
      dataIndex: "NoOfDays",
      width: 100,
      key: "NoOfDays",
      render: (text, record) => (
        <Form.Item
          name={["NoOfDays", record.key - 1]}
          style={{ width: "100%" }}
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber
            disabled={true}
            style={{ width: "100%" }}
            min={0}
            onChange={(value) =>
              handlePackageInputChange(value, "Rate", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Start date",
      dataIndex: "StartDateTime",
      width: 200,
      key: "StartDateTime",
      render: (text, record) => (
        <Form.Item
          name={["StartDateTime", record.key - 1]}
          //value={record.StartDateTime ? dayjs(record.StartDateTime) : null}
          initialValue={
            record.StartDateTime
              ? dayjs(record.StartDateTime, "DD-MM-YYYY")
              : null
          }
          style={{ width: "100%" }}
          rules={[{ required: true, message: "Required" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD-MM-YYYY"
            min={0}
            onChange={(value) =>
              handlePackageInputChange(value, "StartDateTime", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "End date",
      dataIndex: "EndDateTime",
      width: 200,
      key: "EndDateTime",
      render: (text, record, index) => (
        <Form.Item
          name={["EndDateTime", record.key - 1]}
          initialValue={
            record.EndDateTime ? dayjs(record.EndDateTime, "DD-MM-YYYY") : null
          }
          rules={[
            {
              required: true,
              message: "required.",
            },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD-MM-YYYY"
            min={0}
            onChange={(value) =>
              handlePackageInputChange(value, "EndDateTime", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Provider",
      dataIndex: "ProviderId",
      width: 250,
      key: "ProviderId",
      render: (text, record, index) => (
        <Form.Item
          name={["ProviderId", record.key - 1]}
          rules={[
            {
              required: true,
              message: "Provider is required.",
            },
          ]}
        >
          <Select
            onChange={(value) =>
              handlePackageInputChange(value, "ProviderId", record.key)
            }
          >
            {providers?.map((option) => (
              <Option key={option.ProviderId} value={option.ProviderId}>
                {`${option.ProviderFirstName} ${option.ProviderLastName}`}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      dataIndex: "PackageAmount",
      key: "PackageAmount",
      render: (text, record, index) => (
        <Form.Item
          name={["PackageAmount", record.key - 1]}
          style={{ width: "100%" }}
          // initialValue={record.Branch}
        >
          <Input
            disabled
            min={0}
            defaultValue={text}
            onChange={(e) =>
              handlePackageInputChange(
                e.target.value,
                "PackageAmount",
                record.key
              )
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Deposit",
      dataIndex: "DepositPaid",
      key: "DepositPaid",
      render: (text, record, index) => (
        <Form.Item
          name={["DepositPaid", record.key - 1]}
          style={{ width: "100%" }}
          rules={[
            {
              validator: (_, value) => {
                const deposit = parseFloat(value) || 0;
                const packageAmount = parseFloat(record.PackageAmount) || 0;
                if (deposit > packageAmount) {
                  return Promise.reject(
                    new Error("Deposit cannot be greater than Package Amount")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            min={0}
            defaultValue={text}
            onChange={(e) =>
              handlePackageInputChange(
                e.target.value,
                "DepositPaid",
                record.key
              )
            }
          />
        </Form.Item>
      ),
    },

    {
      title: "Balance Deposit",
      dataIndex: "BalanceAmt",
      key: "BalanceAmt",
      render: (text, record, index) => (
        <Form.Item
          name={["BalanceAmt", record.key - 1]}
          style={{ width: "100%" }}
          //initialValue={record.AuthRefNo}
        >
          <Input
            disabled
            min={0}
            defaultValue={text}
            onChange={(e) =>
              handlePackageInputChange(e.target.value, "BalanceAmt", record.key)
            }
          />
        </Form.Item>
      ),
    },
  ];

  const receiptInscolumns = [
    {
      title: "PaymentType",
      dataIndex: "PaymentTypeId",
      width: 150,
      key: "PaymentTypeId",
      render: (text, record, index) => (
        <Form.Item
          name={["PaymentTypeId", record.key - 1]} 
          rules={[
            { required: true, message: "Required" },
            {
              validator: (_, value) => {
                const otherRows = receiptInsAmtData.filter(
                  (row) => row.key !== record.key
                );
                const duplicateExists = otherRows.some(
                  (row) => row.PaymentTypeId === value
                );
                if (duplicateExists) {
                  return Promise.reject(
                    new Error("Payment Type should not be same")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          // initialValue={record.LookupDescription} // Set initial value of the field to UomId
        >
          <Select
            onChange={(value) =>
              handleInputChange(value, "PaymentTypeId", record.key)
            }
          >
            {paymentTypes?.map((option) => (
              <Option key={option.LookupID} value={option.LookupID}>
                {option.LookupDescription}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      dataIndex: "InstrumentAmount",
      width: 200,
      key: "InstrumentAmount",
      render: (text, record) => (
        <Form.Item
          name={["InstrumentAmount", record.key - 1]}
          style={{ width: "100%" }}
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            onChange={(value) =>
              handleInputChange(value, "InstrumentAmount", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Bank",
      dataIndex: "BankId",
      width: 150,
      key: "BankId",
      render: (text, record, index) => (
        <Form.Item name={["BankId", record.key - 1]}>
          <Select
            //disabled
            onChange={(value) => handleInputChange(value, "BankId", record.key)}
          >
            {banks?.map((option) => (
              <Option key={option.LookupID} value={option.LookupID}>
                {option.LookupDescription}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Branch",
      dataIndex: "BranchName",
      key: "BranchName",
      render: (text, record, index) => (
        <Form.Item
          name={["BranchName", record.key - 1]}
          style={{ width: "100%" }}
          // initialValue={record.Branch}
        >
          <Input
            // disabled
            min={0}
            defaultValue={text}
            onChange={(e) =>
              handleInputChange(e.target.value, "BranchName", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "IfscCode",
      dataIndex: "IFSC",
      key: "IFSC",
      render: (text, record, index) => (
        <Form.Item
          name={["IFSC", record.key - 1]}
          style={{ width: "100%" }}
          //initialValue={record.IfscCode}
        >
          <Input
            min={0}
            defaultValue={text}
            onChange={(e) =>
              handleInputChange(e.target.value, "IFSC", record.key)
            }
            // disabled
          />
        </Form.Item>
      ),
    },
    {
      title: "AuthRefNo",
      dataIndex: "AuthorizationReference",
      key: "AuthorizationReference",
      render: (text, record, index) => (
        <Form.Item
          name={["AuthorizationReference", record.key - 1]}
          style={{ width: "100%" }}
          //initialValue={record.AuthRefNo}
        >
          <Input
            // disabled
            min={0}
            defaultValue={text}
            onChange={(e) =>
              handleInputChange(
                e.target.value,
                "AuthorizationReference",
                record.key
              )
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "ExpiryDate",
      dataIndex: "CardExpiryDate",
      key: "CardExpiryDate",
      width: 120,
      render: (text, record, index) => (
        <Form.Item
          name={["CardExpiryDate", record.key - 1]}
          style={{ width: "100%" }}
          rules={[
            {
              validator: (_, value) =>
                value && value.isBefore(dayjs(), "month")
                  ? Promise.reject(
                      new Error(
                        "Expiry date cannot be earlier than the current month"
                      )
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <DatePicker
            format="MM-YYYY" 
            picker="month" 
            placeholder="Select Date"
            disabledDate={(current) => {
              return current && current.isBefore(dayjs().startOf("month"));
            }}
            onChange={(date, dateString) =>
              handleInputChange(dateString, "CardExpiryDate", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Card Number",
      dataIndex: "CardNumber",
      render: (_, record) => (
        <Form.Item name={["CardNumber", record.key - 1]}>
          <Input
            placeholder="Enter Card Number"
            onChange={(e) =>
              handleInputChange(e.target.value, "CardNumber", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Date",
      dataIndex: "Cheqdate",
      width: 150,
      render: (_, record) => (
        <Form.Item
          style={{ width: "100%" }}
          name={["Cheqdate", record.key - 1]} 
          rules={[
            {
              validator: (_, value) =>
                value && value.isBefore(dayjs(), "day")
                  ? Promise.reject(
                      new Error("Date cannot be earlier than today")
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <DatePicker
            format="DD-MM-YYYY" // Date format
            placeholder="Select Date"
            disabledDate={(current) => {
              return current && current.isBefore(dayjs(), "day");
            }}
            onChange={(date, dateString) =>
              handleInputChange(dateString, "Cheqdate", record.key)
            } 
          />
        </Form.Item>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      render: (_, record) => (
        <Form.Item name={["Remarks", record.key - 1]}>
          <Input
            placeholder="Enter Remarks"
            onChange={(e) =>
              handleInputChange(e.target.value, "Remarks", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined style={{ fontSize: "12px" }} />}
          onClick={() => handleAddRow()}
        ></Button>
      ),
      dataIndex: "add",
      key: "add",
      width: 50,
      render: (text, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleInstrumentDelete(record)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
      //<Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>
    },
  ];

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader
        title={"Package Create"}
        buttonIcon={<FaAnglesLeft style={{ fontSize: "1rem" }} />}
        buttonLabel={"Back"}
        onButtonClick={() => navigate("/PackageSubscription")}
      />
      <div style={{ margin: "0 1rem 1rem 1rem" }}>
        <PatientHeader patient={patientData} style={{ marginBottom: "1rem" }} />
        <Form
          form={form}
          layout="vertical"
          size="small"
          onFinish={handleFinish}
          initialValues={{ ReceiptDate: dayjs() }}
        >
          <Table
            dataSource={packageData}
            columns={packagecolumns}
            rowClassName={(record) => (record.disabled ? "disabled-row" : "")}
            size="small"
            bordered
            pagination={false}
            style={{ marginBottom: 24 }}
          />
          <Divider orientation="left">Receipt Details</Divider>
          <Row gutter={16}>
            <Col span={5}>
              <Form.Item
                label="Recieved From"
                name="RecievedFrom"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Recieved From" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label="Receipt Date"
                name="ReceiptDate"
                rules={[{ required: true, message: "Required" }]}
              >
                <DatePicker format={"DD-MM-YYYY"} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label="Receipt Amount"
                name="ReceiptAmount"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Collection Mode</Divider>
          <Table
            dataSource={receiptInsAmtData}
            columns={receiptInscolumns}
            size="small"
            bordered
            pagination={false}
          />

          <Row justify={"end"} gutter={16}>
            <Col>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Save
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button danger onClick={() => navigate("/PackageSubscription")}>
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Layout>
  );
}

export default CreatePackage;
