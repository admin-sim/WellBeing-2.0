import React, { useState, useEffect } from "react";
import Layout from "antd/es/layout/layout";
import { PlusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
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
  Modal,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";
import {
  urlGetPurshaseOrderDetails,
  urlSearchGRN,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios";
import CustomTable from "../../../components/customTable/index.jsx";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";
import { useSelector } from "react-redux";

const DirectGRN = () => {
  const [DirectGRNDropdown, setDirectGRNDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
  });
  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dropDownLoad, setDropDownLoading] = useState(true);
  const { Title } = Typography;
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [error, setError] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userContext = useSelector((state) => state.userContext.value);

  useEffect(() => {
    try {
      customAxios
        .get(urlGetPurshaseOrderDetails, { params: { type: "Direct GRN" } })
        .then((response) => {
          const apiData = response.data.data;
          setDirectGRNDropDown(apiData);
        });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }

    form.submit();
    setDropDownLoading(false);
  }, []);

  const navigate = useNavigate();
  const handleAddTemplate = (GRNHeaderId) => {
    navigate("/CreateDirectGRN", { state: { GRNHeaderId } });
  };

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

  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Pending: "#F5004F",
    "Partially Pending": "#8E3E63",
    Finalize: "#52c41a",
    Completed: "#FF9100",
  };

  const handleReport = async (value, record) => {
    setLoading(true);
    try {
      const request = {
        PONo: record.GRNNumber,
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
      "https://192.168.29.254:808/api/ReportsApi/GetGRNDirectRpt",
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
      setLoading(false);
      throw new Error("Failed to fetch report");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setLoading(false);
    return { url, blob };
  }

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "GRN Number",
      dataIndex: "GRNNumber",
      key: "GRNNumber",
      render: (text, record, index) => {
        if (record.GRNStatus === "Created" || record.GRNStatus === "Draft") {
          return (
            <Button
              type="link"
              onClick={() => handleAddTemplate(record.GRNHeaderId)}
            >
              {text}
            </Button>
          );
        }
        return <Tag style={{ marginLeft: "15px" }}>{text}</Tag>;
      },
    },
    {
      title: "Document Type",
      dataIndex: "DocumentTypeName",
      key: "DocumentTypeName",
    },
    {
      title: "GRN Date",
      dataIndex: "GRNDatestring",
      key: "GRNDatestring",
    },
    {
      title: "Supplier",
      dataIndex: "SupplierName",
      key: "SupplierName",
    },
    {
      title: "Store",
      dataIndex: "StoreName",
      key: "StoreName",
    },
    {
      title: "GRN Owner",
      dataIndex: "LongName",
      key: "LongName",
    },
    {
      title: "GRN Status",
      dataIndex: "GRNStatus",
      key: "GRNStatus",
      render: (text) => {
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Invoice Number",
      dataIndex: "InvoiceNumber",
      key: "InvoiceNumber",
      render: (text) => {
        return <Tag style={{ marginLeft: "15px" }}>{text}</Tag>;
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

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const postData1 = {
        DocumentType: values.DocumentType ? values.DocumentType : "",
        Supplier: values.Supplier ? values.Supplier : "",
        ReceivingStore: values.ReceivingStore ? values.ReceivingStore : "",
        GRNStatus: values.GRNStatus ? values.GRNStatus : "",
        FromDate: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : "",
        ToDate: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
        GRNNumber: values.GRNNumber ? values.GRNNumber : "",
        GrnType: "Direct GRN",
      };
      customAxios
        .get(
          `${urlSearchGRN}?DocumentType=${postData1.DocumentType}&Supplier=${postData1.Supplier}&ReceivingStore=${postData1.ReceivingStore}&GRNStatus=${postData1.GRNStatus}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&GRNNumber=${postData1.GRNNumber}&GrnType=${postData1.GrnType}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
            },
          }
        )
        .then((response) => {
          const newColumnData = response.data.data.GRNAgainstPODetails.map(
            (obj, index) => {
              return { ...obj, key: index + 1 };
            }
          );
          setFilteredData(newColumnData);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      // Handle any errors here
      console.error("Error:", error);
    }
  };

  const onReset = () => {
    form.resetFields();
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
        title={"Direct GRN"}
        buttonIcon={<PlusCircleOutlined style={{ fontSize: "1rem" }} />}
        buttonLabel={"Add Direct GRN"}
        onButtonClick={() => handleAddTemplate(0)}
      />

      <Form
        form={form}
        layout="vertical"
        variant="outlined"
        style={{
          margin: "1rem",
        }}
        initialValues={{
          FromDate: dayjs().subtract(1, "day"),
          ToDate: dayjs(),
          DocumentType: 0,
          GRNStatus: "",
        }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <ColWithSixSpan>
            <Form.Item label="DocumentType" name="DocumentType">
              <Select loading={dropDownLoad}>
                <Select.Option key={0} value={0}>
                  All
                </Select.Option>
                {DirectGRNDropdown.DocumentType.map((option) => (
                  <Select.Option key={option.LookupID} value={option.LookupID}>
                    {option.LookupDescription}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Supplier" label="Supplier">
              <Select
                loading={dropDownLoad}
                placeholder="Select Value"
                allowClear
              >
                {DirectGRNDropdown.SupplierList.map((option) => (
                  <Select.Option key={option.VendorId} value={option.VendorId}>
                    {option.LongName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="FromDate" label="From Date">
              <DatePicker
                value={fromDate}
                onChange={(date) => setFromDate(date)}
                disabledDate={disableFromDate}
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="ToDate" label="To Date">
              <DatePicker
                value={toDate}
                onChange={(date) => setToDate(date)}
                disabledDate={disableToDate}
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="ReceivingStore" label="Receiving Store">
              <Select
                loading={dropDownLoad}
                placeholder="Select Value"
                allowClear
              >
                {DirectGRNDropdown.StoreDetails.map((option) => {
                  // if (option.StoreId === 1) {
                  return (
                    <Select.Option key={option.StoreId} value={option.StoreId}>
                      {option.LongName}
                    </Select.Option>
                  );
                  // }
                  //   return null;
                })}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item label="GRN Number" name="GRNNumber">
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item label="GRN Status" name="GRNStatus">
              <Select>
                <Select.Option key="" value="">
                  All
                </Select.Option>
                <Select.Option key="Created" value="Created"></Select.Option>
                <Select.Option key="Draft" value="Draft"></Select.Option>
                <Select.Option key="Finalize" value="Finalize"></Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
        </Row>
        <Row justify="end" gutter={16}>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Search
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button danger onClick={onReset}>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <CustomTable
        loading={loading}
        dataSource={filteredData}
        columns={columns}
        isFilter={true}
        actionColumn={false}
        scroll={{ x: 1200 }}
      />
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

export default DirectGRN;
