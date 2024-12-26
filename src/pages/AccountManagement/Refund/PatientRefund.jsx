import {
  Button,
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
} from "antd";
import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import { FaAnglesLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import PatientHeader from "../../../components/PatientHeader";
import { ColWithSixSpan } from "../../../components/customGridColumns";
import CustomTable from "../../../components/customTable";
import { v4 as uuidv4 } from "uuid";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import {
  urlCreatePharmacyReFund,
  urlCreateReFund,
  urlGetPatientHeaderDetails,
  urlUpdateReFundDetails,
} from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import dayjs from "dayjs";
function PatientRefund() {
  const [refundToField, setRefundToField] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [counter, setCounter] = useState(2);
  const location = useLocation();
  const { selectedRow, source } = location.state || {};
  const [patientData, setPatientData] = useState(null);
  const [banks, setBanks] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState(null);
  const [totalInstrumentAmount, setTotalInstrumentAmount] = useState(0);

  useEffect(() => {
    debugger;
    const fetchDataHeader = async () => {
      try {
        const response = await customAxios.get(
          `${urlGetPatientHeaderDetails}?PatientId=${
            selectedRow?.PatientId
          }&EncounterId=${
            selectedRow?.ReceiptEncounterId ?? selectedRow?.EncounterId
          }
`
        );
        if (response.status === 200 && response.data != null) {
          const detailsheader = response.data.data.EncounterModel;
          setPatientData(detailsheader);
        } else {
        }
      } catch (error) {}
    };
    fetchDataHeader();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // setTableLoading(true);
    debugger;
    if (source === "Pharmacy") {
      const response = await customAxios.get(
        `${urlCreatePharmacyReFund}?Patient=${selectedRow?.PatientId}&EncounterId=${selectedRow?.EncounterId}&BalanceAmount=${selectedRow?.BalanceAmount}&DocType=${source}&PharmacyReturnHeaderId=${selectedRow?.PharmacyReturnHeaderId}&BillNumber=${selectedRow?.BillNumber}`
      );
      if (response.status === 200 && response.data != null) {
        // setTableLoading(false);
        const data = response.data.data;
        setBanks(data.Bank);
        setPaymentTypes(data.PaymentType);
        form.setFieldsValue({
          RefundTo: data.LastEncounter.PatientName
            ? data.LastEncounter.PatientName
            : "",
          RefundAmount: response.data.data.RemainingAmount,
          AmountRefund: response.data.data.RemainingAmount,
          BalanceAmount: 0,
        });
      } else {
        //setTableLoading(false);
      }
    } else {
      try {
        const response = await customAxios.get(
          `${urlCreateReFund}?Patient=${selectedRow?.PatientId}&EncounterId=${
            selectedRow?.ReceiptEncounterId ?? selectedRow?.EncounterId
          }&RemainingAmount=${selectedRow?.RemainingAmount}&ReceiptId=${
            selectedRow?.ReceiptId
          }&ReceiptNumber=${selectedRow?.ReceiptNumber}`
        );
        if (response.status === 200 && response.data != null) {
          // setTableLoading(false);
          const data = response.data.data;
          setBanks(data.Bank);
          setPaymentTypes(data.PaymentType);
          form.setFieldsValue({
            RefundTo: data.LastEncounter.PatientName
              ? data.LastEncounter.PatientName
              : "",
            RefundAmount: response.data.data.RemainingAmount,
            AmountRefund: response.data.data.RemainingAmount,
            BalanceAmount: 0,
          });
        } else {
          //setTableLoading(false);
        }
      } catch (error) {
        // setTableLoading(false);
      }
    }
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

  const handleRefundSubmit = async (values) => {
    debugger;

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
      EncounterId: selectedRow?.ReceiptEncounterId ?? selectedRow?.EncounterId ?? "",

    }));
    const totalInstrumentAmount = formattedReceiptInsAmtData.reduce(
      (acc, item) => acc + item.InstrumentAmount,
      0
    );

    // Check if totalInstrumentAmount exceeds RefundAmount
    if (totalInstrumentAmount > values.RefundAmount) {
      // Show error message or handle the validation
      message.warning(`Total Instrument Amount  should be equal Refund Amount`);
      return; // Stop further execution if the condition is not met
    }
    if (totalInstrumentAmount < values.RefundAmount) {
      // Show error message or handle the validation
      message.warning(
        `Total Instrument Amount should be equal than Refund Amount`
      );
      return; // Stop further execution if the condition is not met
    }

    let refundDetails;

    if (source === "Pharmacy") {
      // If source is Pharmacy, assign RefundPhamacyDetails
      refundDetails = {
        PatientAccountReFundModel: {
          PatientId: selectedRow?.PatientId,
          ReFundTo: values.RefundTo,
          CashReFundDate: values.RefundDate
            ? values.RefundDate.format("DD-MM-YYYY")
            : "",
          ReFundAmount: values.RefundAmount,
          BalanceAmt: values.BalanceAmount,
          PharmacyReturnHeaderId: selectedRow?.PharmacyReturnHeaderId,
          EncounterId: selectedRow?.EncounterId,
          BillNumber: selectedRow?.BillNumber,
        },
        ReFundToPatientInstrumentList: formattedReceiptInsAmtData,
      };
    } else {
      // If source is not Pharmacy, assign RefundDetails
      refundDetails = {
        PatientAccountReFundModel: {
          PatientId: selectedRow?.PatientId,
          EncounterId: selectedRow?.ReceiptEncounterId ?? selectedRow?.EncounterId,
          ReFundTo: values.RefundTo,
          CashReFundDate: values.RefundDate
            ? values.RefundDate.format("DD-MM-YYYY")
            : "",
          ReFundAmount: values.RefundAmount,
          BalanceAmt: values.BalanceAmount,
          ReceiptId: selectedRow?.ReceiptId,
          ReciptNumber: selectedRow?.ReceiptNumber,
        },
        ReFundToPatientInstrumentList: formattedReceiptInsAmtData,
      };
    }
    
    // Now use the assigned refundDetails object for the axios call
    const response = await customAxios.post(urlUpdateReFundDetails, refundDetails, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200 && response.data != null) {
      if (response.data!=null) {
        message.success("ReFund Details Saved Successfully.");
        navigate("/Refund");
      } else {
        message.error("Something Error Went Wrong.");
      }
    }
  };

  return (
    <div>
      <Layout
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader
          title={"Patient Refund"}
          buttonIcon={<FaAnglesLeft style={{ fontSize: "1rem" }} />}
          buttonLabel={"Back"}
          onButtonClick={() => navigate("/Refund")}
        />
        <div style={{ margin: "0 1rem 1rem 1rem" }}>
          <PatientHeader patient={patientData} />
          <Divider orientation="left">Patient Banner</Divider>
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              RefundDate: dayjs(),
            }}
            onFinish={handleRefundSubmit}
          >
            <Row gutter={16}>
              <ColWithSixSpan>
                <Form.Item
                  name="RefundTo"
                  label={
                    <div>
                      <span>Refund To</span>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        style={{ marginLeft: "1rem" }}
                        onClick={() => setRefundToField(!refundToField)}
                      />
                    </div>
                  }
                >
                  <Input disabled={refundToField} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="RefundDate" label="Refund Date">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    disabled
                    // onChange={handleServiceDate}
                  />
                </Form.Item>
                <Form.Item name="AmountRefund" hidden></Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="RefundAmount"
                  label="Refund Amount"
                  rules={[
                    {
                      validator: (_, value) => {
                        const amountRefund =
                          form.getFieldValue("AmountRefund") || 0; // Get AmountRefund value from the form
                        if (value > amountRefund) {
                          return Promise.reject(
                            `Refund Amount cannot exceed ${amountRefund}`
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "+") {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const refundAmount = Number(e.target.value); // Get the entered RefundAmount

                      // Access the current AmountRefund from the form
                      const totalRefundAmount =
                        form.getFieldValue("AmountRefund") || 0;

                      // Calculate the balance as the difference between AmountRefund and refundAmount
                      const balanceAmount =
                        totalRefundAmount - refundAmount >= 0
                          ? totalRefundAmount - refundAmount
                          : 0;

                      // Update BalanceAmount in the form
                      form.setFieldsValue({ BalanceAmount: balanceAmount });
                    }}
                  />
                </Form.Item>
              </ColWithSixSpan>

              <ColWithSixSpan>
                <Form.Item name="BalanceAmount" label="Balance Amount">
                  <Input type="number" disabled />
                </Form.Item>
              </ColWithSixSpan>
            </Row>
            <Divider orientation="left" style={{ margin: "0" }}>
              Refund Mode
            </Divider>
            {/* <CustomTable
              columns={columns}
              dataSource={dataSource}
              actionColumn={false}
              isFilter={true}
            /> */}
            <CustomTable
              dataSource={receiptInsAmtData}
              columns={receiptInscolumns}
              actionColumn={false}
            />
            <Row gutter={16} justify={"end"} style={{ marginRight: "1rem" }}>
              <Col>
                <Form.Item>
                  <Button htmlType="submit" type="primary">
                    Save
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button danger>Cancel</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Layout>
    </div>
  );
}

export default PatientRefund;
