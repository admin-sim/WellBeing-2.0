import { Button, Col, Form, Input, Layout, message, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import { ColWithSixSpan } from "../../../components/customGridColumns";
import CustomTable from "../../../components/customTable";
import { v4 as uuidv4 } from "uuid";
import UhidSelectComponent from "../../../components/UhidSelectComponent";
import {
  urlCancelBillIndex,
  urlGetAllVisitsForPatientId,
  urlGetPatientBills,
  urlGetPatientHeaderDetails,
  urlSaveBillCancelAction,
  urlSaveDepositCancelAction,
  urlSaveReceiptCancelAction,
  urlSaveRefundCancelAction,
} from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import moment from "moment/moment";
import PatientHeader from "../../../components/PatientHeader";
import dayjs from "dayjs";
import { render } from "react-dom";

function CancelBill() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sourceDoc, setSourceDoc] = useState([]);
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [encounterId, setEncounterId] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [saveDisable, setSaveDisable] = useState(true);
  const [cancelReason, setCancelReason] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowkeys, setRowKeys] = useState([]);

  const [form] = Form.useForm();

  const fetchDataHeader = async (patientId, encounterId) => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${patientId}&EncounterId=${encounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const detailsHeader = response.data.data.EncounterModel;
        setPatientData(detailsHeader);
      }
    } catch (error) {
      console.error("Error fetching patient header details:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;
    try {
      const response = await customAxios.get(urlCancelBillIndex);
      if (response.status === 200 && response.data != null) {
        setSourceDoc(response.data.data.DocumentType);
        setCancelReason(response.data.data.BillCancelReason);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  // const columns = [
  //   {
  //     title: "Cancel Date",
  //     dataIndex: "cancelDate",
  //   },
  //   {
  //     title: "Document Date",
  //     dataIndex: "documentDate",
  //   },
  //   {
  //     title: "Document Ref. ID",
  //     dataIndex: "documentRefID",
  //   },
  //   {
  //     title: "Patient/Payer",
  //     dataIndex: "patientPayer",
  //   },
  //   {
  //     title: "Provider",
  //     dataIndex: "Provider",
  //   },
  //   {
  //     title: "Document Amount",
  //     dataIndex: "DocumentAmount",
  //   },
  //   {
  //     title: "Outstanding Amount",
  //     dataIndex: "OutstandingAmount",
  //   },
  //   {
  //     title: "Cancellation Reason",
  //     dataIndex: "CancellationReason",
  //   },
  //   {
  //     title: "Cancellation Action",
  //     dataIndex: "CancellationAction",
  //   },
  // ];

  const rowSelection = {
    onChange: (rowkey, selectedRows) => {
      setSelectedRows(selectedRows);
      setRowKeys(rowkey);
    },
  };

  const handleSelectUHID = (value, option) => {
    setSelectedUhId(value);
    if (value === undefined) {
      form.setFieldsValue({
        PatientName: "",
      });
      setEncounterId(null);
      setPatientId(null);
      setDataSource([]);
      setSelectedRows([]);
    } else
      form.setFieldsValue({
        PatientName: option.data.PatientFirstName,
        // EncounterID: firstEncounter ? firstEncounter.EncounterId : ''
      });
    setPatientId(option?.data?.PatientId);
    getencounters(option?.data?.PatientId);
  };

  const getencounters = async (patientid) => {
    debugger;
    try {
      const visitsResponse = await customAxios.get(
        `${urlGetAllVisitsForPatientId}?PatientId=${patientid}`
      );

      if (
        visitsResponse.data &&
        Array.isArray(visitsResponse.data.data.EncounterModellist)
      ) {
        //setVisits(visitsResponse.data.data.EncounterModellist);
        const firstEncounter =
          visitsResponse.data.data.EncounterModellist.length > 0
            ? visitsResponse.data.data.EncounterModellist[0]
            : [];
        if (visitsResponse.data.data.EncounterModellist.length <= 1) {
          // setIsEncounterDisabled(true);
        }
        setEncounterId(firstEncounter.EncounterId);
        // form.setFieldsValue({
        //   Encounter: firstEncounter ? firstEncounter.EncounterId : "",
        // });
      } else {
        //setVisits([]);
      }
    } catch (error) {
      console.error("Error fetching visits data:", error);
      //setVisits([]);
    }
  };

  const handleChangeSource = async () => {
    setIsLoading(true);
    setDataSource([]);
    setSelectedRows([]);
    try {
      const doctype = form.getFieldsValue("source");
      if (patientId === undefined) {
        message.warning("Please select Patient");
        return;
      }
      if (doctype.source === undefined) {
        message.warning("Please select Source Doc Reference");
        return;
      }
      if (encounterId === undefined) {
        message.warning("Visit Is Not Created For This Patient");
        return;
      }
      const response = await customAxios.get(
        `${urlGetPatientBills}?PatientId=${patientId}&Type=${doctype.source}&EncounterId=${encounterId}`
      );

      // ... your existing code
      if (response.status === 200 && response.data != null) {
        const data = response.data.data;
        if (data.BillCancelReason && data.BillCancelReason.length > 0) {
          setCancelReason(data.BillCancelReason);
        } else {
          // If BillCancelReason is missing or empty, set it to an empty array or a default value
          setCancelReason([]);
          message.warning(
            "BillCancelReason is missing or empty in the response"
          );
        }
        await fetchDataHeader(patientId, encounterId);
        setDataSource(getTableDataBasedOnDocType(data));
        setColumns(getColumnsBasedOnDocType(data));
        setShowTable(true);
        // ... other code
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setEncounterId(null);
    setPatientId(null);
    setShowTable(false);
    setSelectedUhId(null);
  };

  // Function to get table data based on `docType`
  const getTableDataBasedOnDocType = (data) => {
    let tableData = [];

    switch (data.DocTypeDescription) {
      case "Invoice":
        tableData = data.PatientBills || [];
        break;
      case "Receipts":
        tableData = data.ReceiptAmounts || [];
        break;
      case "Deposits":
        tableData = data.DepositAmounts || [];
        break;
      case "Refunds":
        tableData = data.RefundAmounts || [];
        break;
      default:
        tableData = [];
    }

    // Add a unique key to each item
    return tableData.map((item) => ({
      ...item,
      key: uuidv4(),
    }));
  };

  const handleSave = async (values) => {
    debugger;
    const doctype = form.getFieldValue("source");
    // Find the corresponding description in sourceDoc using the LookupID
    const selectedOption = sourceDoc.find(
      (option) => option.LookupID === doctype
    );
    const lookupDescription = selectedOption
      ? selectedOption.LookupDescription
      : null;

    if (selectedRows.length <= 0) {
      message.warning("Please Select Records ");
      return;
    }

    try {
      if (lookupDescription === "Invoice") {
        const Bills = selectedRows.map((row) => {
          const key = row.key;
          const cancelReasonKey = `CancelReason_${key}`;
          const cancelReason = values[cancelReasonKey] || null; // Get the CancelReason using the key

          return {
            BillID: row.BillID,
            BillNumber: row.BillNumber,
            CancelReason: cancelReason, // Use the matched CancelReason
            IsSampleCollected: row.IsSampleCollected,
          };
        });

        // Check if any CancelReason is null
        const invalidBills = Bills.filter((bill) => bill.CancelReason === null);
        if (invalidBills.length > 0) {
          message.warning("Please select Cancel Reason For Selected Records");
          return;
        }

        const response = await customAxios.post(
          urlSaveBillCancelAction,
          Bills,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.data === 1) {
          // const remainingData = dataSource.filter(
          //   (item) => !selectedRows.some((row) => row.key === item.key)
          // );
         // setDataSource(remainingData);
          setSelectedRows([]); // Clear selected rows
          handleChangeSource();
          message.success("Invoice Cancel Action Success.");
        }
      } else if (lookupDescription === "Receipts") {
        const Receipts = selectedRows.map((row) => {
          const key = row.key;
          const cancelReasonKey = `CancelReason_${key}`;
          const cancelReason = values[cancelReasonKey] || null; // Get the CancelReason using the key

          const cancelAction = `CancelAction_${key}`;
          const cancelReasonAction = values[cancelAction] || null;

          return {
            ReceiptId: row.ReceiptId,
            CancelType: cancelReasonAction, // Use CancelAction
            CancelReason: cancelReason,
          };
        });

        // Check if any CancelReason or CancelType is null
        const invalidReceipts = Receipts.filter(
          (Receipt) =>
            Receipt.CancelReason === null || Receipt.CancelType === null
        );

        if (invalidReceipts.length > 0) {
          message.warning(
            "Please select Cancel Reason and Action For Selected Records"
          );
          return;
        }

        const response = await customAxios.post(
          urlSaveReceiptCancelAction,
          Receipts,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.data === 1) {
        
          setSelectedRows([]); // Clear selected rows
          handleChangeSource();
          message.success("Receipt Cancel Action Success");
        } else {
          message.warning("Cannot cancel Zero Bill.");
        }
      } else if (lookupDescription === "Deposits") {
        const Receipts = selectedRows.map((row) => {
          const key = row.key;
          const cancelReasonKey = `CancelReason_${key}`;
          const cancelReason = values[cancelReasonKey] || null; // Get the CancelReason using the key

          const cancelAction = `CancelAction_${key}`;
          const cancelReasonAction = values[cancelAction] || null;

          return {
            ReceiptId: row.ReceiptId,
            CancelType: cancelReasonAction, // Use CancelAction
            CancelReason: cancelReason,
            ReciptNumber: row.RecieptNumber,
          };
        });

        // Check if any CancelReason or CancelType is null
        const invalidReceipts = Receipts.filter(
          (Receipt) =>
            Receipt.CancelReason === null || Receipt.CancelType === null
        );

        if (invalidReceipts.length > 0) {
          message.warning(
            "Please select Cancel Reason and Action For Selected Records"
          );
          return;
        }

        const response = await customAxios.post(
          urlSaveDepositCancelAction,
          Receipts,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.data === 1) {
          setSelectedRows([]); // Clear selected rows
          handleChangeSource();
          message.success("Deposit cancel action success.");
        }
      } else if (lookupDescription === "Refunds") {
        const Receipts = selectedRows.map((row) => {
          const key = row.key;
          const cancelReasonKey = `CancelReason_${key}`;
          const cancelReason = values[cancelReasonKey] || null; // Get the CancelReason using the key

          const cancelAction = `CancelAction_${key}`;
          const cancelReasonAction = values[cancelAction] || null;

          return {
            ReFundId: row.ReFundId,
            CancelType: cancelReasonAction, // Use CancelAction
            CancelReason: cancelReason,
            ReFundAmount: row.ReFundAmount,
            ReciptNumber: row.RecieptNumber,
          };
        });

        // Check if any CancelReason or CancelType is null
        const invalidReceipts = Receipts.filter(
          (Receipt) =>
            Receipt.CancelReason === null || Receipt.CancelType === null
        );

        if (invalidReceipts.length > 0) {
          message.warning(
            "Please select Cancel Reason and Action For Selected Records"
          );
          return;
        }

        const response = await customAxios.post(
          urlSaveRefundCancelAction,
          Receipts,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.data === 1) {
          setSelectedRows([]); // Clear selected rows
          handleChangeSource();
          message.success("Refund cancel action success.");
        }
      }
    } catch (error) {
      message.error("An error occurred while saving data.");
      console.error("Error during save:", error);
    }
  };

  // Function to get table columns based on `docType`
  const getColumnsBasedOnDocType = (data) => {
    switch (data.DocTypeDescription) {
      case "Invoice":
        return [
          { title: "Cancel Date", render: () => dayjs().format("DD-MM-YYYY") },
          { title: "Document Date", dataIndex: "BillDatestring" },
          {
            title: "Document Type",
            dataIndex: "IsPharmacyBill",
            render: (isPharmacyBill) => (
              <span style={{ color: isPharmacyBill ? "green" : "blue" }}>
                {isPharmacyBill ? "Pharmacy" : "Regular"}
              </span>
            ),
          },
          { title: "Document Ref. Id", dataIndex: "BillNumber" },
          {
            title: "Patient/Payer",
            dataIndex: "PatientFullName",
            render: (_, option) =>
              option.PayerName ? option.PayerName : option.PatientFullName,
          },
          { title: "Provider", dataIndex: "PatientFullName" },
          { title: "Document Amount", dataIndex: "BillAmount" },
          { title: "Outstanding Amount", dataIndex: "BillOutstandingAmount" },
          {
            title: "Sample Collection Status",
            dataIndex: "IsSampleCollected",
            render: (IsSampleCollected) => (
              <span style={{ color: IsSampleCollected ? "green" : "blue" }}>
                {IsSampleCollected ? "Collected" : "NotCollected"}
              </span>
            ),
          },
          {
            title: "Cancellation Reason",
            render: (text, record) => (
              <Form.Item name={`CancelReason_${record.key}`}>
                <Select>
                  {cancelReason && cancelReason.length > 0 ? (
                    cancelReason.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupDescription}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option value="">Loading...</Select.Option>
                  )}
                </Select>
              </Form.Item>
            ),
          },
        ];
      case "Receipts":
        return [
          { title: "Cancel Date", render: () => dayjs().format("DD-MM-YYYY") },
          { title: "Document Date", dataIndex: "ReceiptDatestring" },
          {
            title: "Document Type",
            dataIndex: "IsPharmacyBill",
            render: (isPharmacyBill) => (
              <span style={{ color: isPharmacyBill ? "green" : "blue" }}>
                {isPharmacyBill ? "Pharmacy" : "Regular"}
              </span>
            ),
          },
          { title: "Document Ref. Id", dataIndex: "RecieptNumber" },
          { title: "Patient/Payer", dataIndex: "PatientFullName" },
          { title: "Provider", dataIndex: "PatientFullName" },
          { title: "Document Amount", dataIndex: "ReceiptAmount" },
          { title: "Outstanding Amount", dataIndex: "" },
          {
            title: "Cancellation Reason",
            render: (text, record) => (
              <Form.Item name={`CancelReason_${record.key}`}>
                <Select>
                  {cancelReason && cancelReason.length > 0 ? (
                    cancelReason.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option value="">Loading...</Select.Option>
                  )}
                </Select>
              </Form.Item>
            ),
          },
          {
            title: "Cancellation Action",
            render: (text, record) => (
              <Form.Item name={`CancelAction_${record.key}`}>
                <Select>
                  {/* Display "Cancel" in the dropdown but submit value as 1 */}
                  <Select.Option key="Cancel" value="1">
                    Cancel
                  </Select.Option>
                </Select>
              </Form.Item>
            ),
          },
        ];
      case "Deposits":
        return [
          { title: "Cancel Date", render: () => dayjs().format("DD-MM-YYYY") },
          { title: "Document Date", dataIndex: "ReceiptDatestring" },
          { title: "Document Ref. Id", dataIndex: "RecieptNumber" },
          { title: "Patient/Payer", dataIndex: "PatientFullName" },
          { title: "Provider", dataIndex: "PatientFullName" },
          { title: "Document Amount", dataIndex: "ReceiptAmount" },
          { title: "Outstanding Amount", dataIndex: "" },
          {
            title: "Cancellation Reason",
            render: (text, record) => (
              <Form.Item name={`CancelReason_${record.key}`}>
                <Select>
                  {cancelReason && cancelReason.length > 0 ? (
                    cancelReason.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option value="">Loading...</Select.Option>
                  )}
                </Select>
              </Form.Item>
            ),
          },
          {
            title: "Cancellation Action",
            render: (text, record) => (
              <Form.Item name={`CancelAction_${record.key}`}>
                <Select>
                  {/* Display "Cancel" in the dropdown but submit value as 1 */}
                  <Select.Option key="Cancel" value="1">
                    Cancel
                  </Select.Option>
                </Select>
              </Form.Item>
            ),
          },
          //{ title: 'Cancellation Reason', dataIndex: '' },
        ];
      case "Refunds":
        return [
          { title: "Cancel Date", render: () => dayjs().format("DD-MM-YYYY") },
          { title: "Document Ref. Id", dataIndex: "RecieptNumber" },
          //{ title: "Patient/Payer", dataIndex: "PatientFullName" },
          // { title: "Provider", dataIndex: "PatientFullName" },
          { title: "Document Amount", dataIndex: "ReFundAmount" },
          { title: "Outstanding Amount", dataIndex: "" },
        ];
      default:
        return [];
    }
  };

  // const handleChangeSource = () => {
  //   setSelectedRows([]);

  // };

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title={"Cancel Billing Management"} button={false} />
      <Form layout="vertical" form={form} onFinish={handleSave}>
        <Row gutter={16} style={{ margin: "1rem" }}>
          <ColWithSixSpan>
            <Form.Item name="uhid" label="UHID">
              <UhidSelectComponent
                selectedUhId={selectedUhId}
                handleSelectUHID={handleSelectUHID}
              />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="PatientName" label="Name">
              <Input disabled />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="source" label="Source Doc Reference">
              <Select onChange={handleChangeSource}>
                {sourceDoc.map((option) => (
                  <Select.Option key={option.LookupID} value={option.LookupID}>
                    {option.LookupDescription}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Row gutter={16}>
              <Col>
                <Form.Item label=" ">
                  <Button
                    htmlType="submit"
                    disabled={selectedRows.length === 0}
                    type="primary"
                  >
                    Save
                  </Button>
                </Form.Item>
              </Col>
              {/* <Col>
                <Form.Item label=" ">
                  <Button onClick={handleSource}>Select</Button>
                </Form.Item>
              </Col> */}
              <Col>
                <Form.Item label=" ">
                  <Button onClick={handleReset} danger>
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </ColWithSixSpan>
        </Row>
        {showTable && (
          <div style={{ margin: "0 2rem 1rem 2rem" }}>
            <PatientHeader patient={patientData} />
          </div>
        )}
        {showTable && (
          <CustomTable
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            actionColumn={false}
            isFilter={true}
          />
        )}
      </Form>
    </Layout>
  );
}

export default CancelBill;
