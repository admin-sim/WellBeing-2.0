import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Layout from "antd/es/layout/layout";
import CustomTable from "../../../components/customTable/index.jsx";
import {
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
  Spin,
} from 'antd';
import { urlGetOption,
  urlPatientClaimSubmission,
  urlSearchDetailedClaimRecord,

 } from '../../../../endpoints.js';
import customAxios from "../../../components/customAxios/customAxios.jsx";
import PageHeader from "../../../components/PageHeader/index.jsx";
import UhidSelectComponent from "../../../components/UhidSelectComponent/index.jsx";

const columns = [
  // {
  //   title: "Action",
  //   dataIndex: "action",
  //   key: "action",
  //   render: (_, record) => (
  //     <a
  //       href="#"
  //       onClick={() => showModal(record)}
  //       style={{ textDecoration: "none" }}
  //     >
  //       <EditOutlined />
  //     </a>
  //   ),
  // },
  { title: "Payer", dataIndex: "PayerName", key: "Payer" },
  { title: "UHID", dataIndex: "UhID", key: "Uhid" },
  { title: "Name", dataIndex: "PatientFullName", key: "PatientName" },
  {
    title: "Bill Number",
    dataIndex: "BillNumber",
    key: "BillNumber",
    render: (text, record) => (
      <a href={`/bill-details/${record.BillNumber}`} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    ),
  }, 
  { title: "Bill Amount", dataIndex: "BillAmount", key: "BillAmount" },
  { title: "Bill Date", dataIndex: "BillDatestring", key: "BillDate" },
  { title: "Original Claim Amount", dataIndex: "OrginalCliamAmount", key: "OriginalClaimAmount" },
  { title: "Agreed Amount", dataIndex: "ClaimAgreedAmount", key: "AgreedAmount" },
  { title: "Denied Amount", dataIndex: "ClaimDeniedAmount", key: "DeniedAmount" },
  { title: "Pending Amount", dataIndex: "ClaimPendingAmount", key: "PendingAmount" },
  { title: "Claim Amount", dataIndex: "ClaimAmount", key: "ClaimAmount" },
  { title: "Claim Status", dataIndex: "BillStatus", key: "ClaimStatus" },
];
const { Option } = Select;

const PatientClaimSubmission = () => {
  const [form] = Form.useForm();
   const [selectedUhId, setSelectedUhId] = useState(null);
   const [status, setStatus] = useState([]);
   const [dropDownLoad, setDropDownLoading] = useState(true);
   const [filteredData, setFilteredData] = useState([]); // Store API data
   const [payerOptions, setPayerOptions] = useState([]);
   const [claimStatusOptions, setClaimStatusOptions] = useState([]);
   const [actionStatusOptions, setActionStatusOptions] = useState([]);
   const [loading, setLoading] = useState(true);
 
   const fetchOptions = async () => {
    setLoading(true);
    try {
        debugger
      const response =  await customAxios.get(urlPatientClaimSubmission)
      if (response.status === 200 && response.data) {
        // const data = JSON.parse(response.data); // Ensure valid JSON parsing
        setPayerOptions(response.data.data.Payer || []);
        setClaimStatusOptions(response.data.data.CliamStatus || []);
        setActionStatusOptions(response.data.data.ActionStatus || []);
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
  const handleSearch = async (values) => {
    debugger
    setLoading(true);
    try {
      const searchParams = {
        Uhid: values.Uhid || null,
        Patientid: form.getFieldValue("patientId") || 0,
        PatientName:  values.PatientName  ? values.PatientName : null,
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
          key: index + 1, // Ensure each row has a unique key
        }));
        setFilteredData(resultData); // Update table data
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleSelectUHID = (value, option) => {
    setSelectedUhId(value);

    if (option) {
      const selectedPatientData = option;
      console.log("Selected Patient Data:", selectedPatientData);
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
        name="patientClaimSubmission"
        onFinish={handleSearch}
        style={{
          marginTop: "20px",
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        {/* Row 1 */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Claim Number" name="claimNumber">
              <Input placeholder="Enter Claim Number" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2 */}
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
              <Select placeholder="Select Claim Status">
                {actionStatusOptions.map((status) => (
                  <Option key={status.LookupID} value={status.LookupID}>
                    {status.LookupDescription}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3 */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Payer Name"
              name="payerName"
              rules={[{ required: true, message: "Payer Name is required" }]}
            >
              <Select placeholder="Select Payer">
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
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="To Date" name="toDate">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row gutter={16} justify="end" style={{ marginTop: "20px" }}>
          <Col>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Col>
          <Col>
            <Button danger onClick={handleReset}>
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
    </Layout>
  );
};

export default PatientClaimSubmission;
