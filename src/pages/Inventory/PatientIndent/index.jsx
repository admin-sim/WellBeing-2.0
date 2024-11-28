import React, { useState, useEffect } from "react";
import Layout from "antd/es/layout/layout";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  Spin,
  Skeleton,
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
  Modal,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";
import {
  urlGetPurshaseOrderDetails,
  urlSearchPatientIndent,
} from "../../../../endpoints.js";
import PageHeader from "../../../components/PageHeader/index.jsx";
import CustomTable from "../../../components/customTable/index.jsx";
import customAxios from "../../../components/customAxios/customAxios.jsx";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const PatientIndent = () => {
  const [PatientIndentDropdown, setPatientIndentDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
  });
  const [paginationSize, setPaginationSize] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isTable, setIsTable] = useState(false);
  const { Title } = Typography;
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [dropDownLoad, setDropDownLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    debugger
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setPatientIndentDropDown(apiData);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
    form.submit();
    setDropDownLoading(false)
  }, []);

  const navigate = useNavigate();

  const disableFromDate = (current) => {
    // Disable dates that are after today
    return current && current.isAfter(dayjs().endOf("day"));
  };

  const disableToDate = (current) => {
    // Disable dates that are before the selected fromDate or after today
    return (
      current &&
      (current.isBefore(fromDate, "day") ||
        current.isAfter(dayjs().endOf("day")))
    );
  };

  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Pending: "#F5004F",
    "Partially Pending": "#8E3E63",
    Finalize: "#52c41a",
    Completed: "#FF9100",
  };

  const GetIndentById = (IndentId) => {
    navigate("/CreatePatientIndent", { state: { IndentId } });
  };

  const columns = [
    {
      title: "Sl No",
      key: "key",
      dataIndex: "key",
    },
    {
      title: "UHID",
      dataIndex: "UhId",
      key: "UhId",
      sorter: (a, b) => a.UhId - b.UhId,
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => <Tag>{text}</Tag>,
    },
    {
      title: "Encounter",
      dataIndex: "Encounter",
      key: "Encounter",
      sorter: (a, b) => a.Encounter.localeCompare(b.Encounter),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Patient Name",
      dataIndex: "PatientName",
      key: "PatientName",
      sorter: (a, b) => new Date(a.PatientName) - new Date(b.PatientName),
      sortDirections: ["ascend", "descend"],
      render: (text) => {
        return text;
      },
    },
    {
      title: "Indent Number",
      dataIndex: "IndentNumber",
      key: "IndentNumber",
      sorter: (a, b) => a.IndentNumber.localeCompare(b.IndentNumber),
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if (
          record.IndentStatus === "Created" ||
          record.IndentStatus === "Draft"
        ) {
          return (
            <Button type="link" onClick={() => GetIndentById(record.IndentId)}>
              {text}
            </Button>
          );
        }
        return <Tag style={{ marginLeft: "15px" }}>{text}</Tag>;
      },
    },
    {
      title: "Indent Type",
      dataIndex: "IndentType",
      key: "IndentType",
      sorter: (a, b) => a.IndentType.localeCompare(b.IndentType),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return text;
      },
    },
    {
      title: "Indent Date",
      dataIndex: "IndentDatestring",
      key: "IndentDatestring",
    },
    {
      title: "Issuing Store",
      dataIndex: "IssueStoreName",
      key: "IssueStoreName",
      sorter: (a, b) => a.IssueStoreName.localeCompare(b.IssueStoreName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Indented By",
      dataIndex: "IndentedBy",
      key: "IndentedBy",
      sorter: (a, b) => a.IndentedBy.localeCompare(b.IndentedBy),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Status",
      dataIndex: "IndentStatus",
      key: "IndentStatus",
      sorter: (a, b) => a.IndentStatus.localeCompare(b.IndentStatus),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text}
          </Tag>
        );
      },
    },
    {
      render: (_, record) => <Button type="link" onClick={(value) => handleReport(value, record)}>Report</Button>,
    },
  ];

  const handleReport = async (value, record) => {
    setLoading(true)
    try {
      const request = {
        PONO: record.IndentNumber,
        use: 'admin',
        FileType: "pdf", // or 'excel'
      };
      const { url, blob } = await fetchReport(request);
      setReportUrl(url);
      // setBlobData(blob);
      setIsModalVisible(true);
    } catch (error) {
      setError(error.message);
    }
  };

  async function fetchReport(request) {
    const response = await fetch(
      "http://localhost:43705/api/ReportsApi/GetPatientIndentRpt",
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
      throw new Error("Failed to fetch report");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setLoading(false)
    return { url, blob };
  }

  const onFinish = async (values) => {
    debugger
    setLoading(true);
    try {
      const postData1 = {
        IndentType: values.IndentType ? values.IndentType : "",
        IndentStatus: values.IndentStatus ? values.IndentStatus : "",
        IssuingStoreId: values.IssuingStore ? values.IssuingStore : "",
        FromDate: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : "",
        ToDate: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
        IndentNumber: values.IndentNumber ? values.IndentNumber : "",
      };
      customAxios
        .get(
          `${urlSearchPatientIndent}?IndentType=${postData1.IndentType}&IndentStatus=${postData1.IndentStatus}&IssuingStoreId=${postData1.IssuingStoreId}&FromDateString=${postData1.FromDate}&ToDateString=${postData1.ToDate}&IndentNumber=${postData1.IndentNumber}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const ApiData = response.data.data.IndentDetails.map(
            (item, index) => {
              return {
                ...item,
                key: index + 1,
              };
            }
          );
          setFilteredData(ApiData);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      // Handle any errors here
      console.error("Error:", error);
    }
    setIsSearchLoading(false);
  };

  const onReset = () => {
    setFilteredData([]);
    form.resetFields();
  };

  const handleStoreChange = () => {
    debugger;
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
        <PageHeader
          title={"Patient Indent"}
          buttonLabel="Add Patient Indent"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={() => GetIndentById(0)}
        />
        <Card>
          <Form
            form={form}
            name="control-hooks"
            layout="vertical"
            variant="outlined"
            style={{
              maxWidth: 1500,
            }}
            initialValues={{
              FromDate: dayjs().subtract(1, "day"),
              ToDate: dayjs(),
              IndentStatus: 0,
              IndentType: 0,
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Indent Type" name="IndentType">
                  <Select loading={dropDownLoad}>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    <Select.Option
                      key="Effective"
                      value="Effective"
                    ></Select.Option>
                    <Select.Option
                      key="Consumption Based"
                      value="Consumption Based"
                    ></Select.Option>
                    <Select.Option key="Urgent" value="Urgent"></Select.Option>
                    <Select.Option
                      key="Reorder level Based"
                      value="Reorder level Based"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="IndentNumber" label="Indent Number">
                  <Input allowClear style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="FromDate" label="From Date">
                  <DatePicker
                    value={fromDate}
                    onChange={(date) => setFromDate(date)}
                    disabledDate={disableFromDate}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="ToDate" label="To Date">
                  <DatePicker
                    value={toDate}
                    onChange={(date) => setToDate(date)}
                    disabledDate={disableToDate}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Issuing Store" name="IssuingStore">
                  <Select loading={dropDownLoad}
                    allowClear
                    placeholder="Select Value"
                    onChange={handleStoreChange}
                  >
                    {PatientIndentDropdown.StoreDetails.map((option) => (
                      <Select.Option
                        key={option.StoreId}
                        value={option.StoreId}
                      >
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Indent Status" name="IndentStatus">
                  <Select>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    <Select.Option key="Draft" value="Draft"></Select.Option>
                    <Select.Option
                      key="Pending"
                      value="Pending"
                    ></Select.Option>
                    <Select.Option
                      key="Partially Pending"
                      value="Partially Pending"
                    ></Select.Option>
                    <Select.Option
                      key="Completed"
                      value="Completed"
                    ></Select.Option>
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
          <CustomTable loading={loading}
            dataSource={filteredData}
            columns={columns}
            isFilter={true}
            size="small"
            bordered
            actionColumn={false}
          />
        </Card>
      </div>
      <div>
        {error && <div>Error: {error}</div>}

        <Modal
          title="Report"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={"60rem"} // You can adjust the width as needed
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

export default PatientIndent;
