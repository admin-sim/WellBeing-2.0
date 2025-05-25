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
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import PatientHeader from "../../../components/PatientHeader";
import { useForm } from "antd/es/form/Form";
import {
  ColWithEightSpan,
  ColWithSixSpan,
  ColWithSixteenSpan,
} from "../../../components/customGridColumns";
import TextArea from "antd/es/input/TextArea";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CustomTable from "../../../components/customTable";
import AddAllocationModal from "./AddAllocationModal";
import { FaAnglesLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  urlGetPatientHeaderDetails,
  urlReceiptCreate,
  urlSaveNewReceipt,
  urlShowAllPendingBills,
  urlShowOutStandingAmount,
} from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
function CreateReceipt() {
  const [form] = useForm();
  const location = useLocation();
  const [addAllocationModalOpen, setAddAllocationModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isDepositChecked, setIsDepositChecked] = useState(true);
  const [recievedFromField, setRecievedFromField] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const PatientId = location.state.patientId;
  const EncounterId = location.state.encounterId;
  const [banks, setBanks] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState(null);
  const [counter, setCounter] = useState(2);
  const [assosiateBills, setAssosiateBills] = useState([]);
  const [options, setOptions] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [receiptAmount, setReceiptAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("1");
  const [activeTabDisable, setActiveTabDisable] = useState(true);
  const [totalInstrumentAmount, setTotalInstrumentAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    debugger;

    fetchDataHeader();
  }, []);

  const fetchDataHeader = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${PatientId}&EncounterId=${EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setPatientData(detailsheader);
      } else {
      }
    } catch (error) {}
  };
  useEffect(() => {
    debugger;

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await customAxios.get(
        `${urlReceiptCreate}?Patient=${PatientId}&EncounterId=${EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        form.setFieldsValue({
          ReceivedFrom: response.data.PatientRecord.PatientName,
        });
        setBanks(response.data.Bank);
        setPaymentTypes(response.data.PaymentType);

        const assosiateBills = response.data?.ReceiptAllocations?.map(
          (item) => ({
            ...item,
            key: uuidv4(),
          })
        );
        setAssosiateBills(assosiateBills);

        setOptions(response.data);
      } else {
      }
    } catch (error) {}
  };

  function handleAddAllocationModalOpen() {
    setAddAllocationModalOpen(true);
  }

  function handleAddAllocationModalSubmit(values) {
    debugger;

    // Create the new data object
    const newEntry = {
      key: uuidv4(), // Unique key for the table row
      ...values, // Spread the values object into this new object
    };

    console.log("Formatted data for Ant Design Table:", newEntry);

    // Append the new entry to the previous state
    setAllocations((prev) => [...prev, newEntry]);
  }

  const handleCheckboxChange = (e) => {
    setIsDepositChecked(e.target.checked);
    form.resetFields();
    if (e.target.checked === true) {
      form.resetFields(["DocumentType", "Outstanding"]); // Use strings for field names
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const handleDelete = (record) => {
    setAllocations((prev) => prev.filter((item) => item.key !== record.key));
  };

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
      CardNumber: "",
      Cheqdate: "",
      Remarks: "",
    },
  ];
  const [receiptInsAmtData, setReceiptInsAmtData] = useState(initialDataSource);

  const handleAddRow = async () => {
    await form.validateFields();
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
        CardNumber: "",
        Cheqdate: "",
        Remarks: "",
      },
    ]);
    setCounter(counter + 1); // increment counter
  };

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
      form.validateFields(); // Trigger validation after changing the value
    }
  };

  const handleDocumentType = async (value) => {
    debugger;
    if (value) {
      const response = await customAxios.get(
        `${urlShowOutStandingAmount}?EncounterId=${EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        if (value === "Regular") {
          form.setFieldsValue({
            Outstanding: response.data.OutstandingAmountsRegular,
          });
        } else {
          form.setFieldsValue({
            Outstanding: response.data.OutstandingAmountsPharmacy,
          });
        }
      } else {
      }
    }
  };
  const handleReceiptAmount = (e) => {
    debugger;

    if (e.target.value === "") {
      setActiveTabDisable(true);
      return;
    }
    const outstand = form.getFieldValue("Outstanding");
    setReceiptAmount(Number(e.target.value));
    if (Number(e.target.value) && isDepositChecked) {
      setActiveTabDisable(false);
    }
    if (!isDepositChecked && outstand > 0) {
      setActiveTabDisable(false);
    }
  };

  const receiptInscolumns = [
    {
      title: "PaymentType",
      dataIndex: "PaymentTypeId",
      width: 150,
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
            format="MM-YYYY" // Date format
            picker="month" // Month picker
            placeholder="Select Date"
            disabledDate={(current) => {
              // Disable dates before the current month
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
          name={["Cheqdate", record.key - 1]} // Use record.key for dynamic name
          rules={[
            {
              validator: (_, value) =>
                value && value.isBefore(dayjs(), "day")
                  ? Promise.reject(new Error("Date cannot be earlier than today"))
                  : Promise.resolve(),
            },
          ]}
        >
          <DatePicker
            format="DD-MM-YYYY" // Date format
            placeholder="Select Date"
            disabledDate={(current) => {
              // Disable dates before today
              return current && current.isBefore(dayjs(), "day");
            }}
            onChange={(date, dateString) =>
              handleInputChange(dateString, "Cheqdate", record.key)
            } // Pass the date, column name, and record.key to handleInputChange
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

  const handleInstrumentDelete = (record) => {
    setReceiptInsAmtData(
      receiptInsAmtData.filter((item) => item.key !== record.key)
    );
  };

  const handleFinish = async (values) => {
    debugger;
    console.log("instrument", receiptInsAmtData);
    console.log("allocation", allocations);
    console.log("object", values);
    console.log("assosiatebills", assosiateBills);

    const updatedBills = assosiateBills
      .filter((bill) => selectedRowKeys.includes(bill.key)) // Filter only the selected bills
      .map((bill) => {
        const receiptAmountKey = `ReceiptAmt_${bill.key}`;
        return {
          AssocitedReceiptAmount:
            Number(values[receiptAmountKey]) || bill.ReceiptAmount, // Convert to number
          AssocitedBillNumber: bill.BillNumber,
          AssociatedBillID: bill.AssociateBillID,
          AssocitedOutStandingAmount: bill.OutStandingAmount,
          IsPharmacyBill: bill.IsPharmacyBill,
        };
      });

    // Calculate the total sum of ReceiptAmount for all records
    const totalReceiptAmount = updatedBills.reduce((sum, bill) => {
      return sum + (Number(bill.AssocitedReceiptAmount) || 0);
    }, 0);

    const updatedBillsWithTotal = updatedBills.map((bill) => ({
      ...bill,
      ReceiptAmount: totalReceiptAmount,
    }));

    const updatedReceiptInsAmtData = receiptInsAmtData.map((item) => ({
      ...item,
      EncounterID: EncounterId,
      BankId: item.BankId ? item.BankId : null,
      AuthorizationReference: item.AuthorizationReference || "",
      BankId: item.BankId ? parseInt(item.BankId, 10) : 0,
      BranchName: item.BranchName || "",
      CardExpiryDate: item.CardExpiryDate || "",
      ChequeDates: item.Cheqdate || "",
      IFSC: item.IFSC || "",
      // InstrumentAmount: item.InstrumentAmount
      //   ? parseFloat(item.InstrumentAmount)
      //   : 0,
      PaymentTypeId: item.PaymentTypeId,
      CardNumber: item.CardNumber || "",
      Remarks: item.Remarks || "",
    }));

    // Append EncounterID to each item in allocations
    const updatedAllocations = allocations.map((item) => ({
      ...item,
      EncounterID: EncounterId,
      ReceiptAllocationId: 0,
    }));

    const Receipt = {
      DocumentType: isDepositChecked ? "Deposit" : "Receipt",
      CashReceiptDate: values.CashReceiptDate
        ? values.CashReceiptDate.format("DD-MM-YYYY")
        : "",
      DepositType: values.DepositType,
      EncounterId: EncounterId,
      IsDeposit: isDepositChecked,
      PatientId: PatientId,
      ReceiptAmount: Number(values.ReceiptAmount),
      ReceivedFrom: values.ReceivedFrom,
    };

    // Perform conditional validation based on isDepositChecked
    if (isDepositChecked && updatedAllocations?.length === 0) {
      message.warning(
        "Please Fill Allocation Details when isDepositChecked is Checked."
      );
      return; // Exit early if validation fails
    } else if (!isDepositChecked && updatedBillsWithTotal?.length === 0) {
      message.warning("Please Pay  Assosiate bills To Proceed.");
      return; // Exit early if validation fails
    }

    // Validation: Check if total of InstrumentAmount and ReceiptAmount matches Receipt.ReceiptAmount
    const totalInstrumentAmount = updatedReceiptInsAmtData.reduce(
      (sum, item) => {
        return sum + (Number(item.InstrumentAmount) || 0);
      },
      0
    );
    const totalAllocationAmount = updatedAllocations.reduce((sum, item) => {
      return sum + (Number(item.AllocationAmount) || 0);
    }, 0);

    if (totalInstrumentAmount !== Receipt.ReceiptAmount) {
      message.warning(
        `The total InstrumentAmount must be  equal ReceiptAmount`
      );
      return; // Exit early if validation fails
    }

    if (!isDepositChecked && totalReceiptAmount !== Receipt.ReceiptAmount) {
      message.warning(
        `The total AssosiatedBill Receipt Amount  must be equal to  ReceiptAmount`
      );
      return; // Exit early if validation fails
    }
    if (isDepositChecked && totalAllocationAmount !== Receipt.ReceiptAmount) {
      message.warning(
        `The total AllocationAmount   must be equal to  ReceiptAmount`
      );
      return; // Exit early if validation fails
    }

    const ReceiptDetails = {
      NewReceipt: Receipt, // This maps to 'NewReceipt' in the backend
      ReceiptAllocations: isDepositChecked ? updatedAllocations : [], // Maps to 'ReceiptAllocations'
      ReceiptInstruments: updatedReceiptInsAmtData, // Maps to 'ReceiptInstruments'
      PatientAccountBills: isDepositChecked ? [] : updatedBillsWithTotal, // Maps to 'Receipts'
    };
    const response = await customAxios.post(urlSaveNewReceipt, ReceiptDetails, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const assosiateBills = response.data?.bills?.map((item) => ({
        ...item,
        key: uuidv4(),
      }));
      setAssosiateBills(assosiateBills);
      form.resetFields();
      setAllocations([]);
      setActiveTab("1");
      fetchDataHeader();
      setActiveTabDisable(true);
      setIsDepositChecked(true);
      message.success("Saved Successfully....");
    }
  };
  const validateReceiptAmount = (_, value) => {
    if (!isDepositChecked) {
      const outstanding = form.getFieldValue("Outstanding");
      if (value > outstanding) {
        return Promise.reject(
          new Error("Receipt Amount cannot be greater than Outstanding amount.")
        );
      }
    }
    return Promise.resolve();
  };

  // const handleReceiptAmountChange = (key, value) => {
  //   debugger;
  //   const updatedBills = assosiateBills.map((bill) => {
  //     if (bill.key === key) {
  //       return { ...bill, ReceiptAmount: value };
  //     }
  //     return bill;
  //   });
  //   setAssosiateBills(updatedBills);
  // };

  const columns2 = [
    {
      title: "Indicator",
      dataIndex: "IndicatorDescriptionName",
    },
    {
      title: "Description",
      dataIndex: "SelectedDescriptionName",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientTypeDescription",
    },
    {
      title: "Encounter Id",
      dataIndex: "Encounter",
    },
    {
      title: "Percentage",
      dataIndex: "AllocationPercentage",
    },
    {
      title: "Amount",
      dataIndex: "AllocationAmount",
    },
    {
      title: "Utilized",
      dataIndex: "Utilized",
    },
    {
      title: "Balance",
      dataIndex: "Balance",
    },
  ];

  const columns3 = [
    {
      title: "Bill Number",
      dataIndex: "BillNumber",
    },
    {
      title: "Bill Date",
      dataIndex: "BillDatestring",
    },
    {
      title: "Document Type",
      dataIndex: "IsPharmacyBill",

      render: (text) => (
        <span
          style={{
            color: text ? "black" : "blue", // Black for Pharmacy, Green for Regular
            fontWeight: "600",
          }}
        >
          {text ? "Pharmacy" : "Regular"}{" "}
          {/* Show Pharmacy if true, Regular if false */}
        </span>
      ),
    },

    {
      title: "Encounter Id",
      dataIndex: "EncounterId",
    },
    {
      title: "Bill Amount",
      dataIndex: "BillAmount",
    },
    {
      title: "OutStanding Amount",
      dataIndex: "OutStandingAmount",
    },
    {
      title: "Receipt Amount",

      render: (text, record) => (
        <Form.Item
          name={`ReceiptAmt_${record.key}`}
          rules={[
            {
              validator: (_, value) => {
                if (value > record.OutStandingAmount) {
                  return Promise.reject(
                    `Receipt Amount cannot be greater than Outstanding Amount (${record.OutStandingAmount})`
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            disabled={!selectedRowKeys.includes(record.key)}
          />
        </Form.Item>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "Receipt Details",
      children: (
        <>
          <Row gutter={32}>
            <ColWithSixteenSpan>
              <Row gutter={16}>
                <ColWithSixSpan>
                  <Form.Item
                    name="ReceivedFrom"
                    label={
                      <div>
                        <span>Recieved From</span>
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          style={{ marginLeft: "1rem" }}
                          onClick={() =>
                            setRecievedFromField(!recievedFromField)
                          }
                        />
                      </div>
                    }
                  >
                    <Input disabled={!recievedFromField} />
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithSixSpan>
                  <Form.Item name="CashReceiptDate" label="Receipt Date">
                    <DatePicker
                      style={{ width: "100%" }}
                      format="DD-MM-YYYY"
                      // onChange={handleServiceDate}
                    />
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithSixSpan
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Form.Item name="Deposit" label=" ">
                    <Checkbox
                      checked={isDepositChecked}
                      onChange={handleCheckboxChange}
                    >
                      Deposit
                    </Checkbox>
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithSixSpan>
                  <Form.Item
                    hidden={isDepositChecked}
                    name="DocumentType"
                    label="Document Type"
                  >
                    <Select onChange={handleDocumentType}>
                      <Select.Option key="0" value="Regular"></Select.Option>
                      <Select.Option key="1" value="Pharmacy"></Select.Option>
                    </Select>
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithEightSpan>
                  <Form.Item
                    name="DepositType"
                    label="Deposit Type"
                    initialValue="Pre payment"
                  >
                    <Select>
                      <Select.Option
                        key="Pre payment"
                        value="Pre payment"
                      ></Select.Option>
                      <Select.Option
                        key="Security Deposit"
                        value="Security Deposit"
                      ></Select.Option>
                    </Select>
                  </Form.Item>
                </ColWithEightSpan>
                <ColWithEightSpan>
                  <Form.Item
                    name="ReceiptAmount"
                    label="Receipt Amount"
                    rules={[{ validator: validateReceiptAmount }]}
                  >
                    <Input
                      value={receiptAmount}
                      onChange={handleReceiptAmount} // Handle input change
                    />
                  </Form.Item>
                </ColWithEightSpan>
                <ColWithEightSpan>
                  <Form.Item
                    hidden={isDepositChecked}
                    name="Outstanding"
                    label="Total Bill Outstanding Amount"
                    initialValue={0}
                  >
                    <Input disabled />
                  </Form.Item>
                </ColWithEightSpan>
              </Row>
            </ColWithSixteenSpan>
            <ColWithEightSpan>
              <Form.Item label="Remarks" name="Remarks">
                <TextArea
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                  allowClear
                />
              </Form.Item>
            </ColWithEightSpan>
          </Row>
        </>
      ),
    },
    {
      key: "2",
      label: "Allocation Details",
      disabled: activeTabDisable,
      children: (
        <div
          style={{ border: "1px solid #ddd", borderRadius: "10px 10px 0 0" }}
        >
          <PageHeader
            title={"Allocation"}
            buttonIcon={<PlusCircleOutlined />}
            buttonLabel={"Add"}
            onButtonClick={handleAddAllocationModalOpen}
          />
          <CustomTable
            columns={columns2}
            dataSource={allocations}
            onDelete={handleDelete}
            // isFilter={false}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: "Associate Bills",
      disabled: activeTabDisable,
      children: (
        <div style={{ border: "1px solid #ddd" }}>
          <Table
            rowSelection={rowSelection}
            columns={columns3}
            dataSource={assosiateBills}
          />
        </div>
      ),
    },
  ];

  const visibleItems = isDepositChecked
    ? [items[0], items[1]]
    : [items[0], items[2]];

  const handleTabChange = async (key) => {
    debugger;
    setActiveTab(key);
    if (key === "3") {
      const response = await customAxios.get(
        `${urlShowAllPendingBills}?PatientId=${PatientId}`
      );
      if (response.status === 200 && response.data != null) {
        const assosiateBills = response.data?.ReceiptAllocations.map(
          (item) => ({
            ...item,
            key: uuidv4(),
          })
        );
        setAssosiateBills(assosiateBills);
      }
    }
  };
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
        title={"Receipt Create"}
        buttonIcon={<FaAnglesLeft style={{ fontSize: "1rem" }} />}
        buttonLabel={"Back"}
        onButtonClick={() => navigate("/Receipt")}
      />
      <div style={{ margin: "0 1rem 1rem 1rem" }}>
        <PatientHeader patient={patientData} style={{ marginBottom: "1rem" }} />
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          initialValues={{
            CashReceiptDate: dayjs(),
          }}
        >
          <Tabs
            type="card"
            defaultActiveKey="1"
            activeKey={activeTab}
            onChange={handleTabChange}
            items={visibleItems}
          />
          <Divider style={{ marginTop: "0" }} />

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
                <Button danger onClick={() => alert("Cancel Clicked")}>
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <AddAllocationModal
        open={addAllocationModalOpen}
        options={options}
        handleClose={() => setAddAllocationModalOpen(false)}
        onSubmit={handleAddAllocationModalSubmit}
        receiptAmount={receiptAmount}
      />
    </Layout>
  );
}

export default CreateReceipt;
