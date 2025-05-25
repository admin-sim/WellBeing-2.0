import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Layout from "antd/es/layout/layout";
import CustomTable from "../../../components/customTable/index.jsx";
import moment from "moment";
import {
  Spin,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Typography,
  Table,
  Checkbox,
  Modal,
  message,
} from 'antd';
import {
  urlGetOption,
  urlSearchDetailedClaimRecord,
  urlGetPatientHeaderDetails,
  urlAddNewCliamInvvoice,
} from '../../../../endpoints.js';
import { EditOutlined } from '@ant-design/icons';
import customAxios from "../../../components/customAxios/customAxios.jsx";
import PageHeader from "../../../components/PageHeader/index.jsx";
import UhidSelectComponent from "../../../components/UhidSelectComponent/index.jsx";
import PatientHeader from "../../../components/PatientHeader";

const { Option } = Select;

const PatientClaimForm = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [status, setStatus] = useState([]);
  const [dropDownLoad, setDropDownLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [payerOptions, setPayerOptions] = useState([]);
  const [claimStatusOptions, setClaimStatusOptions] = useState([]);
  const [patientData, setPatientData] = useState();
  const [filteredData, setFilteredData] = useState([]); // Store API data
  const [model, setModel] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for table
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [reportloading, setReportLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);
  const [blobData, setBlobData] = useState(null);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [error, setError] = useState(null);

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <a
          href="#"
          onClick={() => showModal(record)}
          style={{ textDecoration: "none" }}
        >
          <EditOutlined />
        </a>
      ),
    },
    { title: "Payer", dataIndex: "PayerName", key: "Payer" },
    { title: "UHID", dataIndex: "UhID", key: "Uhid" },
    { title: "Name", dataIndex: "PatientFullName", key: "PatientName" },
    {
      title: "Bill Number",
      dataIndex: "BillNumber",
      key: "BillNumber",
      // render: (text, record) => (
      //   <a href={`/bill-details/${record.BillNumber}`} target="_blank" rel="noopener noreferrer">
      //     {text}
      //   </a>
      // ),
      render: (_, record) => <Button type="link" onClick={(value) => handlePrintBill(value, record)}>{record.BillNumber}</Button>,

    },
    { title: "Bill Amount", dataIndex: "BillAmount", key: "BillAmount" },
    { title: "Bill Date", dataIndex: "BillDatestring", key: "BillDate" },
    { title: "Original Claim Amount", dataIndex: "OrginalCliamAmount", key: "OriginalClaimAmount" },
    { title: "Agreed Amount", dataIndex: "ClaimAgreedAmount", key: "AgreedAmount" },
    { title: "Denied Amount", dataIndex: "ClaimDeniedAmount", key: "DeniedAmount" },
    { title: "Pending Amount", dataIndex: "ClaimPendingAmount", key: "PendingAmount" },
    { title: "Claim Amount", dataIndex: "ClaimAmount", key: "ClaimAmount" },
    model.Invoicetype === 1 ?
      { title: "Claim Status", dataIndex: "Statusname", key: "Statusname" } :
      { title: "Claim Status", dataIndex: "ClaimStatusname", key: "ClaimStatusname" }
  ];

  const disableFromDate = (current) => {
    return current && current.isAfter(dayjs().endOf("day"));
  };

  const handlePrintBill = async (value, record) => {
    debugger
    setReportLoading(true);
    try {
      const request = {
        BillingId: record.BillNumber,
        EncounterId: record.EncounterID,
        FileType: "pdf", // or 'excel'
      };
      const { url, blob } = await fetchReport(request);
      setReportUrl(url);
      setBlobData(blob);
      setIsModalVisible1(true);
    } catch (error) {
      setReportLoading(false)
      setError(error.message);
    } finally {
      setReportLoading(false); // End loading
    }
  };
  async function fetchReport(request) {
    const response = await fetch(
      "https://192.168.29.254:808/api/ReportsApi/BillReport",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );
    console.log("respo", response);

    if (!response.ok) {
      setReportLoading(false)
      throw new Error("Failed to fetch report");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return { url, blob };
  }

  const disableToDate = (current) => {
    return (
      current &&
      (current.isBefore(fromDate, "day") ||
        current.isAfter(dayjs().endOf("day")))
    );
  };

  const fetchOptions = async () => {
    setLoading(true);
    try {
      debugger
      const response = await customAxios.get(urlGetOption)
      if (response.status === 200 && response.data) {
        setPayerOptions(response.data.data.Payer || []);
        setClaimStatusOptions(response.data.data.CliamStatus || []);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
      message.error('Failed to fetch dropdown options');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchDataHeader = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${selectedRecord.PatientID}&EncounterId=${selectedRecord.EncounterID}`
      );
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setPatientData(detailsheader); // Update patient header
      }
    } catch (error) {
      console.error("Failed to fetch patient header details:", error);
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      fetchDataHeader();
    }
  }, [isModalVisible]);

  const handleCancel = () => {
    form.resetFields();
  };

  const showModal = (record) => {
    debugger
    setSelectedRecord(record);
    setIsModalVisible(true);

  };

  useEffect(() => {
    if (isModalVisible && selectedRecord) {
      form1.setFieldsValue({
        authorisationReference: selectedRecord?.AuthRef || "",
        authorisationDate: selectedRecord?.AuthDateString
          ? dayjs(selectedRecord?.AuthDateString).format("DD-MM-YYYY")
          : null,
        SubbmitedDate: selectedRecord?.SubbmitedDateString
          ? dayjs(selectedRecord?.SubbmitedDateString).format("DD-MM-YYYY")
          : dayjs(),
        PayerName: selectedRecord?.PayerName || "",
        originalClaimAmount: selectedRecord?.OrginalCliamAmount || "",
      });
    }
  }, [isModalVisible, selectedRecord]);

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
    setPatientData(null);
    form1.resetFields();
  };

  const handleSelectUHID = (value, option) => {
    setSelectedUhId(value);

    if (option) {
      const selectedPatientData = option;
      console.log("Selected Patient Data:", selectedPatientData);

      const patientId = option?.data?.PatientId; // Extract patientId
      setSelectedPatientId(patientId); // Update selected patientId
    }
    form.setFieldsValue({
      Uhid: option?.data?.UhId,
      PatientName: option?.data?.PatientFirstName,
      patientId: option?.data?.PatientId,
    });

    setIsEncounterDisabled(false);
    getencounters(option?.data?.PatientId);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setSearchContainer(false);
  };

  const handleSearch = async (values) => {
    debugger
    setLoading(true);
    try {
      const searchParams = {
        Uhid: values.Uhid || '',
        Patientid: form.getFieldValue("patientId") || 0,
        PatientName: values.PatientName ? values.PatientName : '',
        StatusType: values.status || 0,
        PayerType: values.payerName || 0,
        FromDate: values.fromDate ? values.fromDate.format("DD-MM-YYYY") : '',
        ToDate: values.toDate ? values.toDate.format("DD-MM-YYYY") : '',
        cliamnumber: form.getFieldValue("claimNumber") || '',
        Type: form.getFieldValue("type") || 0,
      };

      const response = await customAxios.get(
        `${urlSearchDetailedClaimRecord}?Uhid=${searchParams.Uhid}&Patientid=${searchParams.Patientid}&PatientName=${searchParams.PatientName}&StatusType=${searchParams.StatusType}&PayerType=${searchParams.PayerType}&FromDate=${searchParams.FromDate}&ToDate=${searchParams.ToDate}&cliamnumber=${searchParams.cliamnumber}&Type=${searchParams.Type}`
      );

      if (response.status === 200 && response.data.data) {
        const resultData = response.data.data.PatientClaim.map((item, index) => ({
          ...item,
          key: index + 1,
        }));
        setModel(response.data.data)
        setFilteredData(resultData);
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  //MODAL OPERATION
  const handleSave = async () => {
    // Collect form data
    const formData = await form1.validateFields(); // Ensure the form is valid before sending the request
    //   let submittedDate = formData.SubbmitedDate;
    // if (submittedDate) {
    //   submittedDate = moment(submittedDate).format('MM/DD/YYYY hh:mm:ss A');
    // }

    // // Convert authorisationDate to the required format "MM/DD/YYYY hh:mm:ss A"
    // let authorisationDate = formData.authorisationDate;
    // if (authorisationDate) {
    //   authorisationDate = moment(authorisationDate).format('MM/DD/YYYY hh:mm:ss A');
    // }
    const Memory = {
      ClaimStatus: formData.claimStatus,
      OrginalCliamAmount: formData.originalClaimAmount === "" ? 0 : formData.originalClaimAmount,
      // SubbmitedDate: formData.SubmittedDate.format('DD-MM-YYYY'),
      BillID: selectedRecord.BillID,
      Tempdate: formData.SubbmitedDate.format('DD-MM-YYYY'),
    };
    //  const Invoice = {
    //    Invoice: Memory,
    //  };
    try {
      debugger
      const response = await customAxios.post(
        urlAddNewCliamInvvoice,
        Memory,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        if (response.data === 'Success') {
          console.log('Claim Invoice Added Successfully:', response.data);
          message.success('Claim Invoice Added Successfully');
          form.submit()
          handleModalClose();
        } else {
          console.log('Claim Invoice Added Failed:', response.data);
          message.error('Failed to Add Claim Invoice');
        }
      } else {
        // Handle error
        console.error('Error:', response.data);
        message.error('Failed to Add Claim Invoice');
      }
    } catch (error) {
      console.error('API Request Error:', error);
      message.error('An error occurred while adding the Claim Invoice');
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
      <PageHeader title={"Patient Claim"} button={false} />
      <Form
        layout="vertical"
        form={form}
        name="patientClaimForm"
        onFinish={handleSearch}
        scrollToFirstError
        style={{
          marginTop: "20px",
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
        }}
        initialValues={{
          fromDate: dayjs().subtract(1, "day"),
          toDate: dayjs()
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="UHID" name="Uhid">
              <UhidSelectComponent
                selectedUhId={selectedUhId}
                handleSelectUHID={handleSelectUHID}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Name" name="PatientName">
              <Input placeholder="Enter Name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Status" name="status">
              <Select placeholder="Select Claim Status" allowClear>
                {claimStatusOptions.map((status) => (
                  <Option key={status.LookupID} value={status.LookupID}>
                    {status.LookupDescription}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Payer Name"
              name="payerName"
            >
              <Select placeholder="Select Payer" allowClear>
                {payerOptions.map((payer) => (
                  <Option key={payer.PayerId} value={payer.PayerId}>
                    {payer.PayerName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="From Date" name="fromDate">
              {/* <DatePicker style={{ width: "100%" }} format='DD-MM-YYYY' /> */}
              <DatePicker
                value={fromDate}
                onChange={(date) => setFromDate(date)}
                disabledDate={disableFromDate}
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="To Date" name="toDate">
              {/* <DatePicker style={{ width: "100%" }} format='DD-MM-YYYY' /> */}
              <DatePicker
                value={toDate}
                onChange={(date) => setToDate(date)}
                disabledDate={disableToDate}
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} justify="end" style={{ marginTop: "20px" }}>
          <Col>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Col>
          <Col>
            <Button danger onClick={handleCancel}>
              Reset
            </Button>
          </Col>
        </Row>
      </Form>
      <Spin spinning={loading}>
        <CustomTable
          dataSource={filteredData}
          columns={columns}
          actionColumn={false}
          isFilter={true}
          scroll={{ x: 1000 }}
        />
      </Spin>
      <Modal
        title={null} // Using PageHeader for the title
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button
            key="save"
            type="primary"
            onClick={handleSave}
          >
            Save
          </Button>,
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
        width={1100}
      >
        <Row>
          <Col span={24}>
            <PageHeader
              title={"Patient Claim Pending Invoice"}
              button={false}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            {selectedRecord ? (
              <PatientHeader patient={patientData} />
            ) : (
              <p>No patient selected.</p>
            )}
          </Col>
        </Row>
        <Form
          form={form1}
          layout="vertical"
          style={{ marginTop: 16 }}
          initialValues={{
            authorisationReference: selectedRecord?.AuthRef || "",
            authorisationDate: selectedRecord?.AuthDate || null,
            PayerName: selectedRecord?.PayerName || "",
            claimStatus: null,
            originalClaimAmount: selectedRecord?.OrginalCliamAmount || "",
            SubbmitedDate: dayjs(),
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Authorisation Reference"
                name="authorisationReference"
              >
                <Input value={selectedRecord?.AuthRef} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Authorisation Date" name="authorisationDate">
                <Input value={selectedRecord?.AuthDate} disabled />

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Insurance Provider" name="PayerName">
                <Input value={selectedRecord?.PayerName} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Claim Status"
                name="claimStatus"
                rules={[
                  { required: true, message: "Please select a claim status" },
                ]}
              >
                <Select placeholder="Select Claim Status" loading={loading}>
                  {claimStatusOptions.map((status) => (
                    <Option key={status.LookupID} value={status.LookupID}>
                      {status.LookupDescription}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Original Claim Amount"
                name="originalClaimAmount"
              >
                <Input value={selectedRecord?.OrginalCliamAmount} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Submitted Date" name="SubbmitedDate">
                <DatePicker style={{ width: "100%" }} format='DD-MM-YYYY' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      {reportloading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Light overlay
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <div>
        {error && <div>Error: {error}</div>}

        <Modal
          title="Report"
          open={isModalVisible1}
          onCancel={() => setIsModalVisible1(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible1(false)}>
              Close
            </Button>,
          ]}
          width={"60rem"}
        >
          {reportUrl && (
            <iframe
              src={reportUrl}
              style={{ width: "100%", height: "500px", border: "none" }}
              title="Report"
            />
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default PatientClaimForm;
