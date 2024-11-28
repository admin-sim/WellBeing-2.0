import React, { useState, useEffect } from "react";
import Layout from 'antd/es/layout/layout';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import {
  Spin,
  Tag,
  Typography,
  Select,
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Card,
  Divider,
  Tooltip,
  Table,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";
import { urlGetPurshaseOrderDetails, urlSearchStoreReturn } from "../../../../endpoints.js";
import PageHeader from "../../../components/PageHeader/index.jsx";
import CustomTable from "../../../components/customTable/index.jsx";
import customAxios from "../../../components/customAxios/customAxios.jsx";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const StoreReturn = () => {
  const [StoreReturnDropdown, setStoreReturnDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: []
  });

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { Title } = Typography;

  useEffect(() => {
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setStoreReturnDropDown(apiData);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
    form.submit()
  }, []);

  const navigate = useNavigate();
  const handleAddTemplate = () => {
    navigate(`/CreateStoreReturn`);
  };

  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Pending: "#F5004F",
    "Partially Pending": "#8E3E63",
    Finalize: "#52c41a",
    Completed: "#FF9100",
  };

  const GetModelDetails = (ReturnHeaderId) => {
    navigate("/CreateStoreReturn", { state: { ReturnHeaderId } });
  };
  const columns = [
    {
      title: "Returned ID",
      dataIndex: "ReturnNumber",
      key: "ReturnNumber",
      sorter: (a, b) => a.ReturnNumber - b.ReturnNumber,
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if (record.ReturnStatus === "Created" || record.ReturnStatus === "Draft") {
          return (
            <Button type="link" onClick={() => GetModelDetails(record.ReturnHeaderId)}>
              {text}
            </Button>
          );
        }
        return <Tag style={{ marginLeft: "15px" }}>{text}</Tag>;
      },
    },
    {
      title: "Returned Date",
      dataIndex: "ReturnDatestring",
      key: "ReturnDatestring",
      sorter: (a, b) => a.ReturnDatestring.localeCompare(b.ReturnDatestring),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Returning Location",
      dataIndex: "StoreName",
      key: "StoreName",
      sorter: (a, b) => new Date(a.StoreName) - new Date(b.StoreName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Returned to Location",
      dataIndex: "ReturnStoreName",
      key: "ReturnStoreName",
      sorter: (a, b) => new Date(a.ReturnStoreName) - new Date(b.ReturnStoreName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Status",
      dataIndex: "ReturnStatus",
      key: "ReturnStatus",
      sorter: (a, b) => a.ReturnStatus.localeCompare(b.ReturnStatus),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Report",
      dataIndex: "Report",
      key: "Report",
      render: (record) => {
        return <Button type="link">Report</Button>
      }
    },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const postData1 = {
        Store: values.ReturningStore ? values.ReturningStore : 0,
        ReturnedToStore: values.ReturnedToLocation ? values.ReturnedToLocation : 0,
        Status: values.Status == 'All' ? '' : values.Status,
        FromDateString: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : null,
        ToDateString: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : null
      };
      customAxios
        .get(
          `${urlSearchStoreReturn}?Store=${postData1.Store}&ReturnedToStore=${postData1.ReturnedToStore}&Status=${postData1.Status}&FromDateString=${postData1.FromDateString}&ToDateString=${postData1.ToDateString}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setFilteredData(response.data.data.ReturnDetails);
          setLoading(false);
        })
    } catch (error) {
      // Handle any errors here      
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <PageHeader
          title={"Store Return"}
          buttonLabel="Add Store Return"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={() => GetModelDetails(0)}
        />
        <Card>
          <Form
            form={form}
            name="control-hooks"
            layout="vertical"
            variant="outlined"
            // size="Default"
            style={{
              maxWidth: 1500,
            }}
            initialValues={{
              FromDate: dayjs().subtract(1, 'day'),
              ToDate: dayjs(),
              Status: 'All',
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Returning Location" name="ReturningStore">
                  <Select allowClear placeholder='Select Value'>
                    {StoreReturnDropdown.StoreDetails.map((option) => (
                      <Select.Option key={option.StoreId} value={option.StoreId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="ReturnedToLocation" label="Returned To Location">
                  <Select allowClear placeholder='Select Value'>
                    {StoreReturnDropdown.StoreDetails.map((option) => (
                      <Select.Option key={option.StoreId} value={option.StoreId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="FromDate" label="From Date">
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="ToDate" label="To Date">
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="Status" label="Status">
                  <Select>
                    <Select.Option key='All' value='All'></Select.Option>
                    <Select.Option key='Create' value='Create'></Select.Option>
                    <Select.Option key='Draft' value='Draft'></Select.Option>
                    <Select.Option key='Finalize' value='Finalize'></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Form.Item>
                  <Button
                    type="primary"
                    loading={loading}
                    htmlType="submit"
                  >
                    Search
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="default" onClick={onReset}>
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Spin spinning={loading}>
            <CustomTable
              dataSource={filteredData}
              columns={columns}
              isFilter={true}
              actionColumn={false}
              bordered
            />
          </Spin>
        </Card>
      </div>
    </Layout>
  );
};
// Utility function to fetch the report
// async function fetchReport(request) {
//   const response = await fetch('http://localhost:901/api/ReportsApi/GetAdmissionRpt', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(request),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to fetch report');
//   }

//   const blob = await response.blob();
//   const url = URL.createObjectURL(blob);
//   return { url, blob };
// }

// const ReportViewer = ({ request }) => {
//   const [reportUrl, setReportUrl] = useState(null);
//   const [error, setError] = useState(null);
//   const [blobData, setBlobData] = useState(null);

//   const loadReport = async () => {
//     try {
//       const { url, blob } = await fetchReport(request);
//       setReportUrl(url);
//       setBlobData(blob);
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   const handleDownload = () => {
//     if (blobData) {
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blobData);
//       link.download = `AdmissionRpt.${request.FileType === 'excel' ? 'xls' : 'pdf'}`;
//       link.click();
//     }
//   };

//   return (
//     <div>
//       <button onClick={loadReport}>Load Report</button>
//       {error && <div>Error: {error}</div>}
//       {reportUrl && (
//         <div>
//           <iframe
//             src={reportUrl}
//             style={{ width: '100%', height: '500px' }}
//             title="Report"
//           />
//           <button onClick={handleDownload}>Download Report</button>
//         </div>
//       )}
//     </div>
//   );
// };

// const StoreReturn = () => {
//   const request = {
//     FacilityId: 1,
//     DeptId: 0,
//     ServLocId: 0,
//     PatientTypeId: 23,
//     FromDate: '2020-01-01',
//     ToDate: '2024-12-31',
//     ProviderId: 0,
//     FileType: 'pdf', // or 'excel'
//   };

//   return (
//     <div>
//       <h1>Admission Report</h1>
//       <ReportViewer request={request} />
//     </div>
//   );
// };

export default StoreReturn;
