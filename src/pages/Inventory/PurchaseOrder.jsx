import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
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
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";

import {
  urlGetPurshaseOrderDetails,
  //   urlSearchPurchaseOrder,
} from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const PurchaseOrder = () => {
  const [purchaseOrderDropdown, setPurchaseOrderDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
  });

  const [paginationSize, setPaginationSize] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // debugger;
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setPurchaseOrderDropDown(apiData);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
  }, []);

  const navigate = useNavigate();
  const handleAddTemplate = () => {
    navigate("/CreatePurchaseOrder");
  };

  const colorMapping = {
    Created: "blue",
    Draft: "geekblue",
    Pending: "volcano",
    "Partially Pending": "orange",
    Completed: "green",
  };

  const GetModelDetails = (text, record, index) => {
    debugger;
    console.log("welcome");
  };
  const columns = [
    {
      title: "Sl No",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "PO Number",
      dataIndex: "PONumber",
      key: "PONumber",
      sorter: (a, b) => a.PONumber - b.PONumber,
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => (
        <Button
          type="link"
          onClick={() => GetModelDetails(text, record, index)}
        >
          {text}
        </Button>
      ),
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
      dataIndex: "PoDate",
      key: "PoDate",
      sorter: (a, b) => new Date(a.PoDate) - new Date(b.PoDate),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        //const poDate = new Date(text);
        //const formattedDate = text;
        return text;
      },
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
      title: "PO Raised By",
      dataIndex: "PORaisedBy",
      key: "PORaisedBy",
      sorter: (a, b) => a.PurchaseOrderId.localeCompare(b.PurchaseOrderId),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Po Status",
      dataIndex: "PoStatus",
      key: "PoStatus",
      sorter: (a, b) => a.PoStatus.localeCompare(b.PoStatus),
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
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, row) => (
        <>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(row)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(row)}
            />
          </Tooltip>
        </>
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

  const handleSubmit = (values) => {
    // Handle form submission logic here
    console.log("Form submitted with values:", values);

    console.log("Form Values:", values);
    //const uhid = selectedUhId ? selectedUhId.UhId : '';

    // ... Repeat for other parameters
  };
  const [formatedFromDate, setFormatedFromDate] = useState();
  const [formatedToDate, setFormatedToDate] = useState();
  function formatDate(inputDate) {
    const dateParts = inputDate.split("/");
    if (dateParts.length === 3) {
      const [year, month, day] = dateParts;
      return `${day}-${month}-${year}`;
    }
    return inputDate; // Return as is if not in the expected format
  }
  const onFinish = async (values) => {
    // debugger;
    // setIsSearchLoading(true);
    // setLoading(true);
    // try {
    //   const postData1 = {
    //     DocumentType:
    //       values.DocumentType === undefined ? "" : values.DocumentType, // Set to empty string when left blank
    //     Supplier: values.Supplier === undefined ? "" : values.Supplier,
    //     ProcurementStore:
    //       values.ProcurementStore === undefined ? "" : values.ProcurementStore,
    //     POStatus: values.POStatus === undefined ? "" : values.POStatus,
    //     FromDate:
    //       values.FromDate === undefined || values.FromDate === null
    //         ? ""
    //         : (
    //             values.FromDate.$D.toString().padStart(2, "0") +
    //             "-" +
    //             (values.FromDate.$M + 1).toString().padStart(2, "0") +
    //             "-" +
    //             values.FromDate.$y
    //           ).toString(),
    //     ToDate:
    //       values.ToDate === undefined || values.ToDate === null
    //         ? ""
    //         : (
    //             values.ToDate.$D.toString().padStart(2, "0") +
    //             "-" +
    //             (values.ToDate.$M + 1).toString().padStart(2, "0") +
    //             "-" +
    //             values.ToDate.$y
    //           ).toString(), // A sample value
    //     PONumber: values.PONumber === undefined ? "" : values.PONumber, // A sample value
    //   };
    //   customAxios
    //     .get(
    //       `${urlSearchPurchaseOrder}?DocumentType=${postData1.DocumentType}&Supplier=${postData1.Supplier}&ProcurementStore=${postData1.ProcurementStore}&DocumentStatus=${postData1.POStatus}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&PoNumber=${postData1.PONumber}`,
    //       null,
    //       {
    //         params: postData1,
    //         headers: {
    //           "Content-Type": "application/json", // Replace with the appropriate content type if needed
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       console.log("Response:", response.data);
    //       //resetForm();
    //       setFilteredData(response.data.data.PurchaseOrderDetails);
    //       // setCurrentPage1(1);
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //     });
    // } catch (error) {
    //   // Handle any errors here
    //   console.error("Error:", error);
    // }
    // setIsSearchLoading(false);
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  if (!isLoading) {
    return <Spin tip="Loading" size="large" />;
  } else {
    return (
      <div>
        <Typography.Title
          level={3}
          style={{
            backgroundColor: "#1E88E5",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Purchase Order
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={handleAddTemplate}
          >
            Add PO
          </Button>
        </Typography.Title>
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
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="DocumentType"
                  name="DocumentType"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Select allowClear>
                    {purchaseOrderDropdown.DocumentType.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="Supplier"
                  label="Supplier"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Select allowClear>
                    {purchaseOrderDropdown.SupplierList.map((option) => (
                      <Select.Option
                        key={option.VendorId}
                        value={option.VendorId}
                      >
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="FromDate"
                  label="From Date"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    allowClear /*onChange={onChange}*/
                  />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="ToDate"
                  label="To Date"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    allowClear /*onChange={onChange}*/
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="ProcurementStore"
                  label="Procurement Store"
                  rules={[{ required: false }]}
                >
                  <Select allowClear>
                    {purchaseOrderDropdown.StoreDetails.map((option) => (
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
                <Form.Item
                  label="PO Number"
                  name="PONumber"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="PO Status"
                  name="POStatus"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Select allowClear>
                    <Select.Option
                      key="Created"
                      value="Created"
                    ></Select.Option>
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
                    loading={isSearchLoading}
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
        </Card>
        {loading ? (
          <Skeleton active />
        ) : (
          // <Spin tip="Loading" size="large">
          //   <div className="content" />
          // </Spin>
          <div>
            <Table
              dataSource={filteredData}
              columns={columns}
              pagination={{
                onChange: (current, pageSize) => {
                  setPage(current);
                  setPaginationSize(pageSize);
                },
                defaultPageSize: 5, // Set your default pagination size
                hideOnSinglePage: true,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `Showing ${range[0]} to ${range[1]} of ${total} entries`,
              }}
              rowKey={(row) => row.AppUserId} // Specify the custom id property here
              size="small"
              bordered
            />
          </div>
        )}
      </div>
    );
  }
};

export default PurchaseOrder;
