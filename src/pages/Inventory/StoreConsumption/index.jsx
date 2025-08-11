import React, { useState, useEffect } from "react";
import Layout from "antd/es/layout/layout";
import { PlusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  Spin,
  Tag,
  Select,
  Button,
  Form,
  Row,
  Col,
  DatePicker,
  Card,
  Modal,
} from "antd";
import { useNavigate } from "react-router";
import CustomTable from "../../../components/customTable/index.jsx";
import {
  urlGetPurshaseOrderDetails,
  urlSearchStoreConsumption,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { useSelector } from "react-redux";

const StoreConsumption = () => {
  const [Dropdown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
  });

  const [filteredData, setFilteredData] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [error, setError] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userContext = useSelector((state) => state.userContext.value);

  useEffect(() => {
    try {
      customAxios
        .get(urlGetPurshaseOrderDetails, {
          params: { type: "Store Consumption" },
        })
        .then((response) => {
          const apiData = response.data.data;
          setDropDown(apiData);
        });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
    form.submit();
  }, []);

  const disableFromDate = (current) => {
    return current && current.isAfter(dayjs().endOf("day"));
  };

  const disableToDate = (current) => {
    return (
      current &&
      (current.isBefore(fromDate, "day") ||
        current.isAfter(dayjs().endOf("day")))
    );
  };

  const navigate = useNavigate();
  const handleAddTemplate = (StoreConsupmtionId) => {
    navigate("/CreateStoreConsumption", { state: { StoreConsupmtionId } });
  };

  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Pending: "#F5004F",
    "Partially Pending": "#8E3E63",
    Finalize: "#52c41a",
    Completed: "#FF9100",
  };

  const columns = [
    {
      title: "Sl No",
      key: "key",
      dataIndex: "key",
    },
    {
      title: "Consumption Number",
      dataIndex: "IssueNumber",
      key: "IssueNumber",
      sorter: (a, b) => a.IssueNumber - b.IssueNumber,
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        if (record.IssueStatus == "Finalize") {
          return <Tag style={{ marginLeft: "15px" }}>{text}</Tag>;
        }
        return (
          <Button type="link" onClick={() => handleAddTemplate(record.IssueId)}>
            {text}
          </Button>
        );
      },
    },
    {
      title: "Consumption Date",
      dataIndex: "IssueDateString",
      key: "IssueDateString",
      sorter: (a, b) => a.IssueDateString.localeCompare(b.IssueDateString),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Issuing Store",
      dataIndex: "IssueStoreName",
      key: "IssueStoreName",
      sorter: (a, b) => new Date(a.IssueStoreName) - new Date(b.IssueStoreName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Consumption Status",
      dataIndex: "IssueStatus",
      key: "IssueStatus",
      sorter: (a, b) => a.IssueStatus.localeCompare(b.IssueStatus),
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
      render: (_, record) => (
        <Button type="link" onClick={(value) => handleReport(value, record)}>
          Report
        </Button>
      ),
    },
  ];
  // const handleSearch = (value) => {
  //   setSearchText(value);
  //   if (value === '') {
  //     setFilteredData(loadUsers);
  //   } else {
  //     const filtered = loadUsers.filter(entry =>
  //       Object.values(entry).some(val =>
  //         val && val.toString().toLowerCase().includes(value.toLowerCase())
  //       )
  //     );
  //     setFilteredData(filtered);
  //   }
  // };

  /* const validateUserRole = (rule, value) => {
     if (value) {
       const existsInOptions = originalOptions.some(option => option.LookupDescription === value);
       if (!existsInOptions) {
         return Promise.reject('Please select a valid UserRole from the list.');
       }
     }
     return Promise.resolve();
   };*/

  const onFinish = async (values) => {
    setIsSearchLoading(true);
    setLoading(true);
    try {
      const postData1 = {
        IssuingStore: values.IssuingStore ? values.IssuingStore : 0,
        IssueStatus: values.IssueStatus === 0 ? null : values.IssueStatus,
        FromDateString: values.FromDate
          ? values.FromDate.format("DD-MM-YYYY")
          : "",
        ToDateString: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
      };
      customAxios
        .get(
          `${urlSearchStoreConsumption}?IssuingStoreId=${postData1.IssuingStore}&FromDateString=${postData1.FromDateString}&ToDateString=${postData1.ToDateString}&IssueStatus=${postData1.IssueStatus}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
            },
          }
        )
        .then((response) => {
          const ApiData = response.data.data.newIndentIssueModel.map(
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
    form.resetFields();
  };

  const handleReport = async (value, record) => {
    setLoading(true);
    try {
      const request = {
        PONO: record.IssueNumber,
        use: "admin",
        FileType: "pdf", // or 'excel'
        AppUser: userContext.AppUserName,
      };
      const { url, blob } = await fetchReport(request);
      setReportUrl(url);
      // setBlobData(blob);
      setIsModalVisible(true);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  async function fetchReport(request) {
    const response = await fetch(
      "https://192.168.29.254:808/api/ReportsApi/GetStoreConsumptionRpt",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      setLoading(false);
      throw new Error("Failed to fetch report");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setLoading(false);
    return { url, blob };
  }

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
          title={"Store Consumption"}
          buttonLabel="Add Store Consumption"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={() => handleAddTemplate(0)}
        />
        <Card>
          <Form
            form={form}
            name="control-hooks"
            layout="vertical"
            variant="outlined"
            size="Default"
            style={{
              maxWidth: 1500,
            }}
            initialValues={{
              FromDate: fromDate,
              ToDate: toDate,
              IssueStatus: 0,
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item label="From Date" name="FromDate">
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
                <Form.Item name="IssuingStore" label="Issuing Store">
                  <Select allowClear placeholder="Select Value">
                    {Dropdown.StoreDetails.map((Option) => (
                      <Select.Option
                        key={Option.StoreId}
                        value={Option.StoreId}
                      >
                        {Option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="IssueStatus" label="Issue Status">
                  <Select>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    <Select.Option key="Draft" value="Draft"></Select.Option>
                    <Select.Option
                      key="Finalize"
                      value="Finalize"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Form.Item>
                  <Button type="primary" loading={loading} htmlType="submit">
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
          <CustomTable
            dataSource={filteredData}
            columns={columns}
            isFilter={true}
            size="small"
            actionColumn={false}
            bordered
            loading={loading}
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

export default StoreConsumption;
