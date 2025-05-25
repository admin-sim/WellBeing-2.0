import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  message,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import {
  ColWithFourSpan,
  ColWithSixSpan,
} from "../../../components/customGridColumns";
import CustomTable from "../../../components/customTable";
import { v4 as uuidv4 } from "uuid";
import UhidSelectComponent from "../../../components/UhidSelectComponent";
import {
  urlAddNewPharmacyReturn,
  urlGetAllInvoice,
  urlGetAllVisitsForPatientId,
  urlGetPatientHeaderDetails,
  urlGetPharmacyReturnList,
} from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import { useNavigate } from "react-router-dom";
import PatientHeader from "../../../components/PatientHeader";
import moment from "moment/moment";
function OtcReturn() {
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [visits, setVisits] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [form] = Form.useForm();
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [isEncounterDisabled, setIsEncounterDisabled] = useState(false);
  const [isInvoicedisabled, setIsInvoiceDisabled] = useState(false);
  const [isPatientHeaderVisible, setIsPatientHeaderVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: (selectedKeys) => {
  //     setSelectedRowKeys(selectedKeys);
  //   },
  // };
  const navigate = useNavigate();

  const handleSelectUHID = (value, option) => {
    setSelectedUhId(value);
    if (value === undefined) {
      form.resetFields();
    } else
      form.setFieldsValue({
        PatientName: option.data.PatientFirstName,
        patientId: option?.data?.PatientId,
        // EncounterID: firstEncounter ? firstEncounter.EncounterId : ''
      });
    getencounters(option?.data?.PatientId);
    getInvoice(option?.data?.PatientId);
  };

  const getencounters = async (patientid) => {
    try {
      const visitsResponse = await customAxios.get(
        `${urlGetAllVisitsForPatientId}?PatientId=${patientid}`
      );

      if (
        visitsResponse.data &&
        Array.isArray(visitsResponse.data.data.EncounterModellist)
      ) {
        setVisits(visitsResponse.data.data.EncounterModellist);
        const firstEncounter =
          visitsResponse.data.data.EncounterModellist.length > 0
            ? visitsResponse.data.data.EncounterModellist[0]
            : [];
        if (visitsResponse.data.data.EncounterModellist.length <= 1) {
          setIsEncounterDisabled(true);
        }

        form.setFieldsValue({
          Encounter: firstEncounter ? firstEncounter.EncounterId : "",
        });
      } else {
        setVisits([]);
      }
    } catch (error) {
      console.error("Error fetching visits data:", error);
      setVisits([]);
    }
  };

  const getInvoice = async (patientid) => {
    try {
      const visitsResponse = await customAxios.get(
        `${urlGetAllInvoice}?PatientId=${patientid}`
      );

      console.log("hu".visitsResponse);

      if (visitsResponse.data && Array.isArray(visitsResponse.data)) {
        setInvoices(visitsResponse.data);
        const firstInvoice =
          visitsResponse.data.length > 0 ? visitsResponse.data[0] : [];
        if (visitsResponse.data.length <= 1) {
          setIsInvoiceDisabled(true);
        }

        form.setFieldsValue({
          BillID: firstInvoice ? firstInvoice.PatientBillID : "",
        });
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching visits data:", error);
      setInvoices([]);
    }
  };

  const fetchDataHeader = async (patientId, enconterId) => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${patientId}&EncounterId=${enconterId}`
      );
      if (response.status === 200 && response.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        console.log("header", detailsheader);

        setPatientData(detailsheader);
      } else {
      }
    } catch (error) {}
  };

  const handleSelect = async (values) => {
    const type = 1;
    const returnList = await customAxios.get(
      `${urlGetPharmacyReturnList}?PatientId=${values.patientId}&Type=${type}&EncounterId=${values.Encounter}&BillID=${values.BillID}`
    );
    setIsPatientHeaderVisible(true);
    await fetchDataHeader(values.patientId, values.Encounter);
    const patientAccountChargesWithKey =
      returnList.data.data.PatientAccountCharges.map((charge) => ({
        ...charge,
        key: charge.ChargeID, // Add ChargeId as the key property
      }));

    setDataSource(patientAccountChargesWithKey);
  };

  const handleReset = () => {
    form.resetFields();
    setIsPatientHeaderVisible(false);
    setShowTable(false);
    setSelectedUhId(null);
    dataSource.forEach((item) => {
      form.setFieldsValue({ [`ReturnQty_${item.key}`]: 0 });
    });

    // Clear ReturnQty in dataSource
    const clearedDataSource = dataSource.map((item) => ({
      ...item,
      ReturnQty: 0, // or ''
      NetReturnAmount: 0 
    }));

    setDataSource(clearedDataSource);
  };

  // Calculate the net return amount for an individual record
  const calculateNetReturnAmount = (record) => {
    const { ReturnQty, NetAmount, DiscountAmount } = record;
    const returnQty = parseFloat(ReturnQty) || 0;
    const netAmount = parseFloat(NetAmount) || 0;
    const discount = parseFloat(DiscountAmount) || 0;

    const result = returnQty * netAmount - discount;

    // Return 0.00 if result is not a valid number
    return isNaN(result) ? 0.0 : result;
  };

  // Function to calculate and set the total of all net return amounts
  const calculateTotal = (data) => {
    const totalSum = data.reduce(
      (sum, record) => sum + (record.NetReturnAmount || 0), // Sum based on the NetReturnAmount
      0
    );
    setTotal(parseFloat(totalSum.toFixed(2))); // Format the sum to two decimal places
  };

  // Update `total` every time you update a record's ReturnQty
  // Update `total` and the "Net Return Amount" every time `ReturnQty` changes
  const handleReturnQtyChange = (e, key) => {
    const updatedValue = e.target.value;
    const updatedDataSource = dataSource.map((item) =>
      item.key === key
        ? {
            ...item,
            ReturnQty: updatedValue,
            // Calculate Net Return Amount only after ReturnQty changes
            NetReturnAmount: calculateNetReturnAmount({
              ...item,
              ReturnQty: updatedValue,
            }),
          }
        : item
    );

    setDataSource(updatedDataSource);
    calculateTotal(updatedDataSource); // Recalculate total using the updated data source
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "ServiceName",
      key: "ServiceName",
    },
    {
      title: "Batch No",
      dataIndex: "BatchNo",
      key: "BatchNo",
    },
    {
      title: "Expiry Date",
      dataIndex: "EXPDateString",
      key: "EXPDateString",
    },
    {
      title: "Returned Quantity",
      dataIndex: "ReturnedQty",
      key: "ReturnedQty",
    },
    {
      title: "Returnable Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Return Qty",
      dataIndex: "ReturnQty",
      key: "ReturnQty",
      render: (text, record) => {
        const hasError =
          form.getFieldError(`ReturnQty_${record.key}`).length > 0;

        return (
          <Tooltip
            title={
              hasError ? form.getFieldError(`ReturnQty_${record.key}`)[0] : ""
            }
            open={hasError}
          >
            <Form.Item
              name={`ReturnQty_${record.key}`}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const returnableQty = record.Quantity;
                    if (!value || value <= returnableQty) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(`Cannot exceed Returnable Quantity`)
                    );
                  },
                }),
              ]}
              initialValue={record.ReturnQty}
              noStyle
            >
              <Input
                type="number"
                onChange={(e) => handleReturnQtyChange(e, record.key)}
              />
            </Form.Item>
          </Tooltip>
        );
      },
    },

    {
      title: "Return Amt/Unit",
      dataIndex: "NetAmount",
      key: "NetAmount",
      render: (text) => parseFloat(text).toFixed(2),
    },
    {
      title: "Tax Amt/Unit",
      dataIndex: "TaxAmount",
      key: "TaxAmount",
    },
    {
      title: "Discount",
      dataIndex: "DiscountAmount",
      key: "DiscountAmount",
    },
    {
      title: "Net Return Amount",
      dataIndex: "NetReturnAmount",
      key: "NetReturnAmount",
      render: (text, record) =>
        record.NetReturnAmount != null ? (
          <span>{record.NetReturnAmount.toFixed(2)}</span>
        ) : (
          <span>0.00</span> // Show 0.00 initially or any placeholder
        ),
    },
  ];

  const handleSave = async () => {
    await form.validateFields();
    // Filter dataSource to include only items with ReturnQty > 0
    const filteredData = dataSource
      .filter((item) => parseFloat(item.ReturnQty) > 0)
      .map((item) => ({
        ProductId: item.ServiceId, // Set ProductId to ServiceId
        ChargeID: item.ChargeID, // Set ProductId to ServiceId
        BatchNo: item.BatchNo,
        ReturnQty: parseFloat(item.ReturnQty), // Ensure ReturnQty is a number
        EXPDateString: item.EXPDateString,
        Amount: parseFloat(calculateNetReturnAmount(item)).toFixed(2), // Format Amount to two decimals
        Rate: item.Rate, // Include StoreId if needed
        TaxAmount: item.TaxAmount,
        Discount: item.DiscountAmount,
        // Add other necessary properties here, if any
      }));

      if (filteredData.length === 0) {
        alert("No items to save, please ensure ReturnQty > 0.");
        return;
      }

    // Get all form values
    const getformvalues = form.getFieldsValue();

    // Get today's date in dd-MM-yyyy format
    const todayDate = moment().format("DD-MM-YYYY");

    // Retrieve StoreId from the first item in dataSource, if it exists
    const storeId = dataSource.length > 0 ? dataSource[0].StoreId : null;
    const type = 1;
    // Prepare return data
    const returnData = {
      newReturnModel: {
        PatientId: getformvalues.patientId,
        EncounterId: getformvalues.Encounter,
        ReturnDatestring: todayDate,
        StoreId: storeId,
        PatientBillID: getformvalues.BillID,
        Amount: parseFloat(total).toFixed(2),
      },
      ReturnDetails: filteredData,
    };
    const response = await customAxios.post(
      urlAddNewPharmacyReturn,
      returnData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // This ensures the session cookie is sent
      }
    );
    if (response.status === 200 && response.data.data == 1) {
    
    //  // Reset specific fields like ReturnQty in dataSource
    //  const resetDataSource = dataSource.map(item => ({
    //   ...item,
    //   ReturnQty: 0, // Reset only the ReturnQty field
    //   NetReturnAmount: 0 // Optionally reset any calculated fields
    // }));

    // setDataSource(resetDataSource); // Update state with reset ReturnQty values
     // Reset form fields for `ReturnQty`
     dataSource.forEach((item) => {
      form.setFieldsValue({ [`ReturnQty_${item.key}`]: 0 });
    });

    // Clear ReturnQty in dataSource
    const clearedDataSource = dataSource.map((item) => ({
      ...item,
      ReturnQty: 0, // or ''
      NetReturnAmount: 0 
    }));

    setDataSource(clearedDataSource);
    setTotal(0);
      const returnList = await customAxios.get(
        `${urlGetPharmacyReturnList}?PatientId=${getformvalues.patientId}&Type=${type}&EncounterId=${getformvalues.Encounter}&BillID=${getformvalues.BillID}`
      );

      const patientAccountChargesWithKey =
        returnList.data.data.PatientAccountCharges.map((charge) => ({
          ...charge,
          key: charge.ChargeID, // Add ChargeId as the key property
        }));

      setDataSource(patientAccountChargesWithKey);
  
      message.success("Pharmacy Return saved succesfully.");
    } else {
      message.error("Store Return failed.");
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
      <PageHeader title={"OTC Returns"} button={false} />
      <Form layout="vertical" form={form} onFinish={handleSelect}>
        <Row gutter={16} style={{ margin: "1rem" }}>
          <ColWithSixSpan>
            <Form.Item name="uhid" label="UHID">
              <UhidSelectComponent
                selectedUhId={selectedUhId}
                handleSelectUHID={handleSelectUHID}
              />
            </Form.Item>
          </ColWithSixSpan>
          <Form.Item label="Patient Name" name="patientId" hidden>
            <Input />
          </Form.Item>
          <ColWithSixSpan>
            <Form.Item name="PatientName" label="Name">
              <Input disabled />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithFourSpan>
            <Form.Item
              label="Encounter ID"
              name="Encounter"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                //value={initialFormState.visit}
                disabled={isEncounterDisabled}
              >
                {visits?.map((option) => (
                  <Select.Option
                    key={option.EncounterId}
                    value={option.EncounterId}
                  >
                    {option.GeneratedEncounterId}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithFourSpan>
          <ColWithFourSpan>
            <Form.Item
              initialValue="Invoice"
              rules={[
                {
                  required: true,
                  message: "Source Document Required.",
                },
              ]}
              name="Source"
              label="Source Document"
            >
              <Select>
                <Select.Option key="Invoice" value="Invoice">
                  Invoice
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithFourSpan>
          <ColWithFourSpan>
            <Form.Item
              label="Invoice"
              name="BillID"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                //value={initialFormState.visit}
                disabled={isInvoicedisabled}
              >
                {invoices?.map((option) => (
                  <Select.Option
                    key={option.PatientBillID}
                    value={option.PatientBillID}
                  >
                    {option.BillNumber}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithFourSpan>
        </Row>
        <Row gutter={16} justify={"end"} style={{ marginRight: "1rem" }}>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Select
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button onClick={handleReset} danger>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {isPatientHeaderVisible && (
          <div style={{ margin: "0 2rem 1rem 2rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <PatientHeader patient={patientData} />
            </div>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              footer={() => (
                <div style={{ textAlign: "right", fontWeight: "bold" }}>
                  Total: {total?.toFixed(2) || "0.00"}{" "}
                  {/* Default to 0.00 if total is null */}
                </div>
              )}
            />

            {/* Add save button below the table */}
            <div style={{ textAlign: "right", marginTop: "1rem" }}>
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        )}
      </Form>
    </Layout>
  );
}

export default OtcReturn;
