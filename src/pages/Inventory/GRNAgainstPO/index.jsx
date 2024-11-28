import React, { useState, useEffect } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Spin,
  Tag,
  Select,
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Modal,
} from "antd";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import Layout from "antd/es/layout/layout";
import {
  urlGetPurshaseOrderDetails,
  urlSearchGRN,
} from "../../../../endpoints.js";
import CustomTable from "../../../components/customTable/index.jsx";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";

const GRNAgainstPO = () => {
  const [Dropdown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
  });
  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dropDownLoad, setDropDownLoading] = useState(true);
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [error, setError] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setDropDown(apiData);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
    form.submit();
    setDropDownLoading(false);
  }, []);

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

  const navigate = useNavigate();

  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Finalize: "#52c41a",
  };

  const handleGRN = (GrnHeaderId) => {
    navigate("/CreateGRNAgainstPO", { state: { GrnHeaderId } });
  };

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
      sorter: (a, b) => a.GRNNumber - b.GRNNumber,
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if (record.GRNStatus === "Created" || record.GRNStatus === "Draft") {
          return (
            <Button type="link" onClick={() => handleGRN(record.GRNHeaderId)}>
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
      title: "GRN Date",
      dataIndex: "GRNDatestring",
      key: "GRNDatestring",
      sorter: (a, b) => new Date(a.GRNDatestring) - new Date(b.GRNDatestring),
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
      title: "GRN Owner",
      dataIndex: "GRNOwner",
      key: "GRNOwner",
      sorter: (a, b) => a.GRNOwner.localeCompare(b.GRNOwner),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "GRN Status",
      dataIndex: "GRNStatus",
      key: "GRNStatus",
      sorter: (a, b) => a.GRNStatus.localeCompare(b.GRNStatus),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        // let color = text === 'Pending' ? 'volcano' : text === 'Completed' ? 'green' : text === '';
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
      sorter: (a, b) => a.InvoiceNumber.localeCompare(b.InvoiceNumber),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record, index) => <Button type="link" onClick={(value) => handleReport(value, record)}>Report</Button>,
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
        GrnType: "GRN Against PO",
      };
      customAxios
        .get(
          `${urlSearchGRN}?DocumentType=${postData1.DocumentType}&GRNNumber=${postData1.GRNNumber}&Supplier=${postData1.Supplier}&ReceivingStore=${postData1.ReceivingStore}&GRNStatus=${postData1.GRNStatus}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&GrnType=${postData1.GrnType}`,
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
      console.error("Error:", error);
    }
  };

  const onReset = () => {
    setIsTableHasValue(false);
    form.resetFields();
  };

  const handleReport = async (value, record) => {
    setLoading(true)
    try {
      const request = {
        PONO: record.GRNNumber,
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
      "http://localhost:43705/api/ReportsApi/GetGRNRpt",
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
        title={"GRN Against PO"}
        buttonIcon={<PlusCircleOutlined style={{ fontSize: "1rem" }} />}
        buttonLabel={"Craate GRN Against PO"}
        onButtonClick={() => handleGRN(0)}
      />

      <Form
        form={form}
        initialValues={{
          ToDate: dayjs(),
          FromDate: dayjs().subtract(1, "day"),
          DocumentType: 0,
          GRNStatus: 0,
        }}
        layout="vertical"
        style={{
          margin: "1rem",
        }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <ColWithSixSpan>
            <Form.Item label="Document Type" name="DocumentType">
              <Select loading={dropDownLoad}>
                <Select.Option key={0} value={0}>
                  All
                </Select.Option>
                {Dropdown.DocumentType.map((option) => (
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
                allowClear
                placeholder="Select Value"
              >
                {Dropdown.SupplierList.map((option) => (
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
                allowClear
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
                allowClear
              />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="ReceivingStore" label="Receiving Store">
              <Select
                loading={dropDownLoad}
                allowClear
                placeholder="Select Value"
              >
                {Dropdown.StoreDetails.map((option) => {
                  if (option.StoreId === 1) {
                    return (
                      <Select.Option
                        key={option.StoreId}
                        value={option.StoreId}
                      >
                        {option.LongName}
                      </Select.Option>
                    );
                  }
                  return null;
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
                <Select.Option key={0} value={0}>
                  All
                </Select.Option>
                <Select.Option key="Created" value="Created"></Select.Option>
                <Select.Option key="Draft" value="Draft"></Select.Option>
                <Select.Option key="Completed" value="Finalize"></Select.Option>
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
      <CustomTable loading={loading}
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

export default GRNAgainstPO;
