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
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LeftOutlined,
  PlusOutlined,
  CloseSquareFilled,
} from "@ant-design/icons";
import Layout from "antd/es/layout/layout";
const { Text } = Typography;
import { useNavigate } from "react-router";
import customAxios from "../../components/customAxios/customAxios";
import DiscountModal from "./DiscountModal.jsx";
import InvoiceDiscountModal from "./InvoiceDiscountModal.jsx";
import {
  urlGetAllAutocompleteServicesAsync,
  urlAddNewBill,
  urlGetServiceCharge,
  urlGetAllProviders,
  urlAddNewCharge,
  urlBillingCreate,
  urlGetPatientDetails,
  urlEditDiscount,
  urlUpdateDiscount,
  urlInvoiceDiscount,
} from "../../../endpoints";
import Title from "antd/es/typography/Title";
import { useLocation } from "react-router-dom";
import PatientHeader from "../../components/PatientHeader";
import { CiDiscount1 } from "react-icons/ci";
import dayjs from "dayjs";

const CreateBilling = () => {
  const location = useLocation();
  const PatientId = location.state.patientId;
  const EncounterId = location.state.encounterId;
  const Encounter = location.state.encounter;
  const [services, setServices] = useState(null);
  const [providers, setProviders] = useState(null);
  const [charges, setCharges] = useState([]);
  const [totalInstrumentAmount, setTotalInstrumentAmount] = useState(0);
  const [serviceId, setSelectedServiceId] = useState(null);
  const [providerId, setSelectedProviderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceDate, setServiceDate] = useState(null);
  const [receiptDate, setReceiptDate] = useState(null);
  const [banks, setBanks] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [discountReason, setDiscountReason] = useState([]);
  const [discountDetails, setDiscountDetails] = useState([]);
  const [Amount2, setAmount2] = useState(0);
  const [PatientAmount2, setPatientAmount2] = useState(0);
  const [invoicediscountDetails, setInvoiceDiscountDetails] = useState([]);
  const [invoicediscountReason, setInvoiceDiscountReason] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isinvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const navigate = useNavigate();
  const [counter, setCounter] = useState(2);

  useEffect(() => {
    debugger;
    const fetchDataHeader = async () => {
      try {
        const response = await customAxios.get(
          `${urlGetPatientDetails}?PatientId=${PatientId}&Encounter=${Encounter}&EncounterId=${EncounterId}`
        );
        if (response.status === 200 && response.data.data != null) {
          const detailsheader = response.data.data;
          setPatientData(detailsheader.PatientDetail);
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
    try {
      const response = await customAxios.get(
        `${urlBillingCreate}?PatientId=${PatientId}&EncounterId=${EncounterId}`
      );
      if (response.status === 200 && response.data.data != null) {
        const details = response.data.data;
        setBanks(details.Bank);
        setPaymentTypes(details.PaymentType);
        console.log("ptypes", details.PaymentType);
        setCharges(details.PatientAccountCharges);
        console.log("charges", details.PatientAccountCharges);
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const totalAmount =
    charges?.reduce((total, row) => total + row.PatientNetAmount, 0) ?? 0;

  useEffect(() => {
    form1.setFieldsValue({
      ReceiptDate: dayjs(),
      ReceiptAmount: totalAmount,
    });
  }, [form, totalAmount]);

  console.log("totalamt", totalAmount);
  const initialDataSource = [
    {
      key: 1,
      PaymentTypeId: "",
      InstrumentAmount: "",
      BankId: "",
      BranchName: "",
      IFSC: "",
      AuthorizationReference: "",
      CardExpiryDate: "",
    },
  ];
  const [receiptInsAmtData, setReceiptInsAmtData] = useState(initialDataSource);

  const handleAddRow = async () => {
    await form1.validateFields();
    setReceiptInsAmtData([
      ...receiptInsAmtData,
      {
        key: counter, // use counter as key
        PaymentTypeId: "",
        InstrumentAmount: "",
        BankId: "",
        BranchName: "",
        IFSC: "",
        AuthorizationReference: "",
        CardExpiryDate: "",
      },
    ]);
    setCounter(counter + 1); // increment counter
  };

  const handleCreateService = async () => {

    navigate('/Billing')
  };

  const handleAutoCompleteChange = async (value) => {
    debugger;
    setLoading(true); // Start loading
    try {
      if (!value.trim()) {
        setServices(null); // Set options to an empty array
        setLoading(false); // Stop loading
        return;
      }
      const response = await customAxios.get(
        `${urlGetAllAutocompleteServicesAsync}?Description=${value}`
      );
      const responseData = response.data || [];
      // Ensure responseData is an array and has the expected structure
      if (
        Array.isArray(responseData) &&
        responseData.length > 0 &&
        responseData[0].Id !== undefined
      ) {
        const newOptions = responseData.map((option) => ({
          value: option.Name,
          label: option.Name,
          key: option.Id,
        }));
        setServices(newOptions);
      } else {
        setServices(null);
        form.setFieldValue("Services", "");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setServices(null); // Set options to an empty array in case of an error
    }
    setLoading(false); // Stop loading
  };

  const handleSelect = async (value, option) => {
    debugger;
    setSelectedServiceId(option.key);
    setLoading(true);
    if (option.key) {
      try {
        const newData = await fetchDataForSelectedService(option.key);
        if (newData[0]) {
          form.setFieldsValue({
            Amount: newData[0].ChargeAmount,
            PatientAmount: newData[0].PatientNetAmount,
            Provider: newData[0].ProviderName,
          });
        }
        setAmount2(newData[0].OriginalChargeAmount);
        setPatientAmount2(newData[0].OriginalPatientChargeAmount);
        setSelectedProviderId(newData[0].ProviderID);
      } catch (error) {
        console.error("Error handling selected client data:", error);
        setLoading(false);
      }
    }
    setLoading(false);
  };

  const fetchDataForSelectedService = async (ServiceId) => {
    try {
      const response = await customAxios.get(
        `${urlGetServiceCharge}?ServiceId=${ServiceId}&PatientId=${PatientId}&EncounterId=${EncounterId}`
      );
      return response.data.data;
    } catch (error) {
      throw error; // You might want to handle or log the error appropriately
    }
  };

  const handleproviderAutoCompleteChange = async (value) => {
    debugger;
    setLoading(true); // Start loading
    try {
      if (!value.trim()) {
        setProviders(null); // Set options to an empty array
        setLoading(false); // Stop loading
        return;
      }
      const response = await customAxios.get(
        `${urlGetAllProviders}?providerName=${value}`
      );
      const responseData = response.data.data.Providers || [];
      // Ensure responseData is an array and has the expected structure
      if (
        Array.isArray(responseData) &&
        responseData.length > 0 &&
        responseData[0].ProviderId !== undefined
      ) {
        const newOptions = responseData.map((option) => ({
          value: option.ProviderFirstName,
          label: option.ProviderFirstName,
          key: option.ProviderId,
        }));
        setProviders(newOptions);
      } else {
        setProviders(null);
        form.setFieldValue("Provider", "");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setProviders(null); // Set options to an empty array in case of an error
    }
    setLoading(false); // Stop loading
  };

  const handleProviderSelect = async (value, option) => {
    setSelectedProviderId(option.key);
  };
  // Function to handle discount click
  const handleDiscount = async (row) => {
    debugger;
    const response = await customAxios.get(
      `${urlEditDiscount}?DiscountChargeId=${row.ChargeID}&PatientId=${row.PatientId}&EncounterId=${row.EncounterId}`
    );
    if (response.status === 200 && response.data.data != null) {
      setDiscountReason(response.data.data.DiscountReasons);
      setDiscountDetails(response.data.data.AddDiscountModel);
      setIsModalOpen(true);
    }
  };
  const handleInvoiceDiscount = async (row) => {
    debugger;
    const Flag="";
    const response = await customAxios.get(
      `${urlInvoiceDiscount}?PatientId=${PatientId}&EncounterId=${EncounterId}&Flag=${Flag}`
    );
    if(response.status===200 && response.data.data!=null){

      setInvoiceDiscountReason(response.data.data.DiscountReasons);
      setInvoiceDiscountDetails(response.data.data.InvoiceDetailModel);
      setIsInvoiceModalOpen(true);
    }
  };

  const columns = [
    {
      title: (
        <span style={{ display: "flex", justifyContent: "flex-start" }}>
          ChargeDetails
        </span>
      ),

      children: [
        {
          title: "ServiceName",
          dataIndex: "ServiceName",
          key: "ServiceName",
        },
        {
          title: "Date",
          dataIndex: "StrServiceDate",
          key: "StrServiceDate",
          width: 130,
        },
        {
          title: "Provider",
          dataIndex: "ProviderFirstName",
          key: "ProviderFirstName",
        },
        {
          title: "ChargeAmt",
          dataIndex: "ChargeAmount",
          key: "ChargeAmount",
        },
        {
          title: "Qty",
          dataIndex: "Quantity",
          key: "Quantity",
          width: 80,
        },
        {
          title: "NetAmt",
          dataIndex: "NetAmount",
          key: "NetAmount",
        },
        {
          title: "InsAmt",
          dataIndex: "InsuranceCoveredAmount",
          key: "InsuranceCoveredAmount",
        },
        {
          title: "TaxAmt",
          dataIndex: "TaxRate",
          key: "TaxRate",
        },
        {
          title: "NetInsAmt",
          dataIndex: "NetInsurenceAmount",
          key: "NetInsurenceAmount",
        },
      ],
    },
    {
      title: (
        <span style={{ display: "flex", justifyContent: "flex-start" }}>
          PatientAmount
        </span>
      ),
      children: [
        {
          title: "Charge",
          dataIndex: "PatientChargeAmount",
          key: "PatientChargeAmount",
        },
        {
          title: "Discount",
          dataIndex: "PatientDiscountAmount",
          key: "PatientDiscountAmount",
        },
        {
          title: "Tax",
          dataIndex: "PatientTaxRate",
          key: "PatientTaxRate",
        },
        {
          title: "NetAmt",
          dataIndex: "PatientNetAmount",
          key: "PatientNetAmount",
        },
        {
          title: "AdjAmt",
          dataIndex: "AdjustedAmount",
          key: "AdjustedAmount",
        },
        {
          title: "LL Disc",
          dataIndex: "Discount",
          key: "Discount",
          render: (_, row) => (
            <Tooltip title="Discount">
              <Button type="link" onClick={() => handleDiscount(row)}>
                <CiDiscount1 style={{ fontSize: "1.2rem" }} />
              </Button>
            </Tooltip>
          ),
        },
        {
          title: "",
          dataIndex: "actions",
          key: "actions",
          render: (_, row) => (
            <span style={{ display: "flex" }}>
              <Tooltip title="Delete">
                <Button type="danger" onClick={() => handleEdit(row)}>
                  <DeleteOutlined style={{ fontSize: ".8rem" }} />
                </Button>
              </Tooltip>
            </span>
          ),
        },
      ],
    },
  ];

  // const handleInputChange = (e, column, index,record) => {
  //   const newData = [...receiptInsAmtData];
  //   newData[index][column] = e.target.value;
  //   setReceiptInsAmtData(newData);

  //   // if (column === 'InstrumentAmount') {
  //   //   const newTotal = newData.reduce((sum, item) => sum + (parseFloat(item.InstrumentAmount) || 0), 0);
  //   //   setTotalInstrumentAmount(newTotal);
  //   //   form1.validateFields(); // Trigger validation after changing the value
  //   // }

  // };
  const handleInputChange = (value, column, key) => {
    const newData = receiptInsAmtData.map((item) => {
      if (item.key === key) {
        return { ...item, [column]: value };
      }
      return item;
    });
    setReceiptInsAmtData(newData);
    if (column === "InstrumentAmount") {
      const newTotal = newData.reduce(
        (sum, item) => sum + (parseFloat(item.InstrumentAmount) || 0),
        0
      );
      setTotalInstrumentAmount(newTotal);
      form1.validateFields(); // Trigger validation after changing the value
    }
  };

  const handleProvisional = () => {
    form1.resetFields();
    setReceiptInsAmtData(initialDataSource); // Reset the data source
  };

  const receiptInscolumns = [
    {
      title: "PaymentType",
      dataIndex: "PaymentTypeId",
      width: 180,
      key: "PaymentTypeId",
      render: (text, record, index) => (
        <Form.Item
          name={["PaymentTypeId", record.key - 1]} // subtract 1 from key
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
                  // return Promise.reject('Payment Type already selected in another row');
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
          rules={[
            { required: true, message: "Required" },
            {
              validator: (_, value) => {
                const newTotal =
                  totalInstrumentAmount -
                  (parseFloat(record.InstrumentAmount) || 0) +
                  value;
                if (newTotal > totalAmount) {
                  return Promise.reject(
                    new Error(
                      "Total Amount should not be greater than ReceiptAmount"
                    )
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          //  initialValue={record.InstrumentAmount}
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
            min={0}
            defaultValue={text}
            onChange={(value) =>
              handleInputChange(value, "BranchName", record.key)
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
            onChange={(value) => handleInputChange(value, "IFSC", record)}
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
            min={0}
            defaultValue={text}
            onChange={(value) =>
              handleInputChange(value, "AuthorizationReference", record)
            }
          />
        </Form.Item>
      ),
    },

    {
      title: "ExpiryDate",
      dataIndex: "CardExpiryDate",
      key: "CardExpiryDate",
      render: (text, record, index) => (
        <Form.Item
          name={["CardExpiryDate", record.key - 1]}
          style={{ width: "100%" }}
          // initialValue={record.ExpiryDate}
        >
          <Input min={0} defaultValue={text} />
        </Form.Item>
      ),
    },

    {
      title: (
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined style={{ fontSize: "12px" }} />}
          onClick={handleAddRow}
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

  const handleInstrumentDelete = (record) => {
    setReceiptInsAmtData(
      receiptInsAmtData.filter((item) => item.key !== record.key)
    );
    console.log("deletedreceiptdata", receiptInsAmtData);
  };

  const handleOnFinish = async (values) => {
    debugger;
    console.log("values", values);
    const Charge = {
      PatientId: PatientId,
      EncounterId: EncounterId,
      ServiceId: serviceId,
      ProviderID: providerId,
      Rate: Amount2,
      PatientChargeAmount: values.PatientAmount,
      ChargeAmount: PatientAmount2,
      FacilityId: 1,
      ActiveFlag: true,
      ServiceQuantity: 1,
      PatientTypeID: 22,
    };
    try {
      const response = await customAxios.post(urlAddNewCharge, Charge, {
        headers: {
          "Content-Type": "application/json", // Replace with the appropriate content type if needed
          // Add any other required headers here
        },
      });

      if (response.status == 200) {
        console.log("response", response);
        setCharges(response.data.data.PatientAccountCharges);
        message.success("Charge Added Successfully");
        form.resetFields();
      } else {
        message.error("Something went wrong");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const handleServiceDate = (date, dateString) => {
    setServiceDate(dateString);
  };
  const handleReceiptDate = (date, dateString) => {
    setReceiptDate(dateString);
  };

  const handleSaveBill = async (values) => {
    debugger;

    const formattedReceiptInsAmtData = receiptInsAmtData.map((item) => ({
      AuthorizationReference: item.AuthorizationReference || "",
      BankId: item.BankId ? parseInt(item.BankId, 10) : 0,
      BranchName: item.BranchName || "",
      CardExpiryDate: item.CardExpiryDate || "",
      IFSC: item.IFSC || "",
      InstrumentAmount: item.InstrumentAmount
        ? parseFloat(item.InstrumentAmount)
        : 0,
      PaymentTypeId: item.PaymentTypeId,
    }));

    try {
      const billingData = {
        PatientAccountReceiptModel: {
          ReceiptAmount: values.ReceiptAmount,

          CashReceiptDate: receiptDate
            ? receiptDate
            : dayjs().format("DD-MM-YYYY"),
          PatientId: PatientId,
          EncounterId: EncounterId,
          FacilityId: 1,
          ActiveFlag: true,
        },
        PatientAccountReceiptInstrumentModels: formattedReceiptInsAmtData,
        PatientAccountChargeModel: charges, // Assuming chargeDetails is an array of charge details
      };

      const response = await customAxios.post(urlAddNewBill, billingData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 && response.data) {
        if (
          response.data === "Failed To Generate Bill" ||
          response.data === ""
        ) {
          message.error("Failed to generate bill");
        } else {
          message.success("Bill generated successfully!");
          fetchData();
          form1.resetFields();
          setReceiptInsAmtData(initialDataSource);

          // Reset the data source
        }
      }

      // ... rest of your logic
    } catch (error) {
      message.error("Something Went Wrong");
    }
  };

  return (
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
            padding: "0.2rem 2rem 0rem 2rem",
            backgroundColor: "#40A2E3",
            borderRadius: "5px 5px 0px 0px ",
          }}
        >
          <Col span={16}>
            <Title level={4} style={{ color: "white", fontWeight: 500 }}>
              Biliing
            </Title>
          </Col>
          <Col offset={5} span={3}>
            <Button icon={<LeftOutlined />} onClick={handleCreateService}>
              Back
            </Button>
          </Col>
        </Row>
        <div style={{ margin: "0 2rem 1rem 2rem" }}>
          <PatientHeader patient={patientData} />
        </div>
        <Form
          layout="vertical"
          onFinish={handleOnFinish}
          variant="outlined"
          style={{ padding: "0rem 2rem" }}
          form={form}
          initialValues={{
            ServiceDate: dayjs(),
          }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  label="Services"
                  name="Services"
                  rules={[
                    {
                      required: true,
                      message: "Service Required.",
                    },
                  ]}
                >
                  <AutoComplete
                    options={services}
                    onSearch={handleAutoCompleteChange}
                    onSelect={handleSelect}
                    onChange={(value) => {
                      if (!value) {
                        form.setFieldsValue({
                          Amount: "",
                          PatientAmount: "",
                          Provider: "",
                        });
                        setServices(null);
                        setSelectedProviderId(null);
                      }
                    }}
                    allowClear={{
                      clearIcon: <CloseSquareFilled />,
                    }}
                    loading={loading}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div>
                <Form.Item label="ServiceDate" name="ServiceDate">
                  <DatePicker
                    style={{ width: "100%" }}
                    disabled
                    format="DD-MM-YYYY"
                    onChange={handleServiceDate}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div>
                <Form.Item
                  style={{ width: "100%" }}
                  label="Provider"
                  name="Provider"
                  rules={[
                    {
                      required: true,
                      message: "Provider Is Required",
                    },
                  ]}
                >
                  <AutoComplete
                    options={providers}
                    onSearch={handleproviderAutoCompleteChange}
                    onSelect={handleProviderSelect}
                    onChange={(value) => {
                      if (!value) {
                        setProviders(null);
                      }
                    }}
                    allowClear={{
                      clearIcon: <CloseSquareFilled />,
                    }}
                    loading={loading}
                  />
                </Form.Item>
              </div>
            </Col>

            <Col className="gutter-row" span={3}>
              <div>
                <Form.Item
                  style={{ width: "100%" }}
                  label="Amount"
                  name="Amount"
                  rules={[
                    {
                      required: true,
                      message: "Amount Is Required",
                    },
                  ]}
                >
                  <Input disabled></Input>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={3}>
              <div>
                <Form.Item
                  style={{ width: "100%" }}
                  label="PatientAmount"
                  name="PatientAmount"
                  rules={[
                    {
                      required: true,
                      message: "PatientAmount Is Required",
                    },
                  ]}
                >
                  <Input disabled></Input>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={3}>
              <div>
                <Form.Item label="&nbsp;">
                  <Button type="link" onClick={() => handleInvoiceDiscount()}>
                    InvoiceDisc <CiDiscount1 style={{ fontSize: "1.8rem" }} />
                  </Button>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={1}>
              <div>
                <Form.Item label="&nbsp;">
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                  ></Button>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
        {/* <Divider orientation="left"></Divider> */}
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#E6E6FA",
              },
            },
          }}
        >
          <Table
            // style={{ padding: '0rem 2rem' }}
            dataSource={charges}
            columns={columns}
            rowKey={(row) => row.ChargeID} // Specify the custom id property here
            locale={{
              emptyText: <span style={{ color: "" }}>No data available</span>,
            }}
            bordered
            pagination={{
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            }}
            scroll={{ x: 1400 }}
            summary={(pageData) => {
              let netamt = 0;
              let insamt = 0;
              let taxamt = 0;
              let netinsamt = 0;
              let discamt = 0;
              let taxrate = 0;
              let patientnetamt = 0;
              let adjamt = 0;
              pageData.forEach(
                ({
                  NetAmount,
                  InsuranceCoveredAmount,
                  TaxRate,
                  NetInsurenceAmount,
                  PatientDiscountAmount,
                  PatientTaxRate,
                  PatientNetAmount,
                  AdjustedAmount,
                }) => {
                  netamt += NetAmount;
                  insamt += InsuranceCoveredAmount;
                  taxamt += TaxRate;
                  netinsamt += NetInsurenceAmount;
                  discamt += PatientDiscountAmount;
                  taxrate += PatientTaxRate;
                  patientnetamt += PatientNetAmount;
                  adjamt += AdjustedAmount;
                }
              );
              return (
                <>
                  <Table.Summary.Row>
                    {/* Adjust the cell spans based on your column structure */}
                    <Table.Summary.Cell
                      index={0}
                      colSpan={4}
                    ></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text type="danger">Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text type="danger">{netamt}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text type="danger">{insamt}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text type="danger">{taxamt}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text type="danger">{netinsamt}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text type="danger">Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text type="danger">{discamt.toFixed(2)}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text type="danger">{taxrate}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text type="danger">{patientnetamt}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text type="danger">{adjamt}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={2}
                      colSpan={9}
                    ></Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </ConfigProvider>
        <InvoiceDiscountModal
          options={invoicediscountReason}
          open={isinvoiceModalOpen}
          handleClose={() => setIsInvoiceModalOpen(false)}
          discountDetails={invoicediscountDetails}
          setCharges={setCharges}
        />
        <DiscountModal
          options={discountReason}
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          discountDetails={discountDetails}
          setCharges={setCharges}
        />
        {/* <Divider orientation="left"></Divider> */}
        <Form
          layout="vertical"
          onFinish={handleSaveBill}
          variant="outlined"
        
          //style={{ padding: '0rem 2rem' }}
          form={form1}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="ReceiptDate" name="ReceiptDate">
                  <DatePicker
                    style={{ width: "100%" }}
                    disabled
                    format="DD-MM-YYYY"
                    onChange={handleReceiptDate}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div>
                <Form.Item
                  style={{ width: "100%" }}
                  label="ReceiptAmount"
                  name="ReceiptAmount"
                  rules={[
                    {
                      required: true,
                      message: "ReceiptAmount Is Required",
                    },
                  ]}
                >
                  <Input disabled></Input>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: "#E6E6FA",
                },
              },
            }}
          >
            <Table
              dataSource={receiptInsAmtData}
              columns={receiptInscolumns}
              // rowKey={(row) => row.ServiceId} // Specify the custom id property here
              size="small"
              bordered
              pagination={false}
            />
          </ConfigProvider>

          <Row justify="end" style={{ padding: "0rem 1rem" }}>
            <Col style={{ marginRight: "20px", marginTop: "1rem" }}>
              <Form.Item>
                <Button
                  type="primary"
                  //loading={isSearchLoading}
                  htmlType="submit"
                >
                  Save
                </Button>
              </Form.Item>
            </Col>
            <Col style={{ marginRight: "20px", marginTop: "1rem" }}>
              <Form.Item>
                <Button type="primary" onClick={handleProvisional}>
                  Provisional
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Layout>
  );
};

export default CreateBilling;
