import React, { useState, useEffect } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Layout from "antd/es/layout/layout";
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
  urlSearchPurchaseOrder,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import CustomTable from "../../../components/customTable/index.jsx";
import moment from "moment";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";
import { useSelector } from "react-redux";

const PurchaseOrder = () => {
  const [purchaseOrderDropdown, setPurchaseOrderDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
  });
  const [filteredData, setFilteredData] = useState([]);
  const [dropDownLoad, setDropDownLoading] = useState(true);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { Title } = Typography;
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [error, setError] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userContext = useSelector((state) => state.userContext.value);

  useEffect(() => {
    try {
      customAxios
        .get(urlGetPurshaseOrderDetails, { params: { type: "Purchase Order" } })
        .then((response) => {
          const apiData = response.data.data;
          setPurchaseOrderDropDown(apiData);
        });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
    setDropDownLoading(false);
    form.submit();
  }, []);

  const navigate = useNavigate();

  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Pending: "#F5004F",
    "Partially Pending": "#8E3E63",
    Finalize: "#52c41a",
    Completed: "#FF9100",
  };

  const GetPobyId = (PoHeaderId) => {
    navigate("/CreatePurchaseOrder", { state: { PoHeaderId } });
  };
  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "PO Number",
      dataIndex: "PONumber",
      key: "PONumber",
      sorter: (a, b) => a.PONumber - b.PONumber,
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if (record.PoStatus === "Created" || record.PoStatus === "Draft") {
          return (
            <Button type="link" onClick={() => GetPobyId(record.PoHeaderId)}>
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
      sorter: (a, b) => a.DocumentTypeName.localeCompare(b.DocumentTypeName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Po Date",
      dataIndex: "PoDateString",
      key: "PoDateString",
      sorter: (a, b) => new Date(a.PoDateString) - new Date(b.PoDateString),
      sortDirections: ["descend", "ascend"],
      // render: (text) => {
      //   const dateParts = text.split("T")[0].split("-");
      //   const year = dateParts[0];
      //   const month = dateParts[1];
      //   const day = dateParts[2];

      //   return `${day}-${month}-${year}`;
      // },
    },
    {
      title: "Supplier Name",
      dataIndex: "SupplierName",
      key: "SupplierName",
      sorter: (a, b) => a.SupplierName.localeCompare(b.SupplierName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Store Name",
      dataIndex: "StoreName",
      key: "StoreName",
      sorter: (a, b) => a.StoreName.localeCompare(b.StoreName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "PO Auth By",
      dataIndex: "ShortName",
      key: "ShortName",
      sorter: (a, b) => a.ShortName.localeCompare(b.ShortName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Po Status",
      dataIndex: "PoStatus",
      key: "PoStatus",
      sorter: (a, b) => a.PoStatus.localeCompare(b.PoStatus),
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
        ProcurementStore: values.ProcurementStore
          ? values.ProcurementStore
          : "",
        DocumentStatus: values.DocumentStatus ? values.DocumentStatus : "",
        FromDate: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : "",
        ToDate: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
        PONumber: values.PONumber ? values.PONumber : "",
      };
      customAxios
        .get(
          `${urlSearchPurchaseOrder}?DocumentType=${postData1.DocumentType}&Supplier=${postData1.Supplier}&ProcurementStore=${postData1.ProcurementStore}&DocumentStatus=${postData1.DocumentStatus}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&PoNumber=${postData1.PONumber}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
            },
          }
        )
        .then((response) => {
          const newColumnData = response.data.data.PurchaseOrderDetails.map(
            (obj, index) => {
              return { ...obj, key: index + 1 };
            }
          );
          setFilteredData(newColumnData);
          // setCurrentPage1(1);
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

  const handleReport = async (value, record) => {
    debugger;
    setLoading(true);
    try {
      const request = {
        PONo: record.PONumber,
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
      "https://192.168.29.254:808/api/ReportsApi/GetPORpt",
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
        title={"Purchase Order"}
        buttonIcon={<PlusCircleOutlined />}
        buttonLabel={"Add Purchase Order"}
        onButtonClick={() => GetPobyId(0)}
      />

      <Form
        form={form}
        name="control-hooks"
        layout="vertical"
        variant="outlined"
        style={{
          margin: "1rem",
        }}
        initialValues={{
          FromDate: dayjs().subtract(1, "day"),
          ToDate: dayjs(),
          DocumentType: 0,
          Supplier: 0,
          ProcurementStore: 0,
          DocumentStatus: "",
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
                {purchaseOrderDropdown.DocumentType.map((option) => (
                  <Select.Option key={option.LookupID} value={option.LookupID}>
                    {option.LookupDescription}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Supplier" label="Supplier">
              <Select loading={dropDownLoad}>
                <Select.Option key={0} value={0}>
                  All
                </Select.Option>
                {purchaseOrderDropdown.SupplierList.map((option) => (
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
                disabledDate={(current) => current > moment()}
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
                disabledDate={(current) => current < fromDate}
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              name="ProcurementStore"
              label="Procurement Store"
              rules={[{ required: false }]}
            >
              <Select loading={dropDownLoad}>
                <Select.Option key={0} value={0}>
                  All
                </Select.Option>
                {purchaseOrderDropdown.StoreDetails.map((option) => (
                  <Select.Option key={option.StoreId} value={option.StoreId}>
                    {option.LongName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item label="PO Number" name="PONumber">
              <Input allowClear style={{ width: "100%" }} />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item label="PO Status" name="DocumentStatus">
              <Select>
                <Select.Option key="" value="">
                  All
                </Select.Option>
                <Select.Option key="Created" value="Created"></Select.Option>
                <Select.Option key="Draft" value="Draft"></Select.Option>
                <Select.Option key="Pending" value="Pending"></Select.Option>
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
        actionColumn={false}
        isFilter={true}
        scroll={{ x: 1000 }}
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

export default PurchaseOrder;
