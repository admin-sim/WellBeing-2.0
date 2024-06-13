import React, { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import Layout from 'antd/es/layout/layout';
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

import { urlGetPurshaseOrderDetails, urlSearchPurchaseOrder } from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
import { render } from "react-dom";
import FormItem from "antd/es/form/FormItem/index.js";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const PurchaseOrder = () => {
  const [purchaseOrderDropdown, setPurchaseOrderDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: []
  });
  const [paginationSize, setPaginationSize] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isTableHasValues, setIsTableHasValues] = useState(false);
  const { Title } = Typography;
  useEffect(() => {
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setPurchaseOrderDropDown(apiData);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
    form.submit();
  }, []);

  const navigate = useNavigate();

  const colorMapping = {
    Created: "blue",
    Draft: "geekblue",
    Pending: "volcano",
    "Partially Pending": "orange",
    Finalize: "green",
  };

  const GetPobyId = (PoHeaderId) => {
    debugger;
    navigate("/CreatePurchaseOrder", { state: { PoHeaderId } });
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
      render: (text, record, index) => {
        if (record.PoStatus === "Created" || record.PoStatus === "Draft") {
          return (<Button type="link" onClick={() => GetPobyId(record.PoHeaderId)}>
            {text}
          </Button>
          )
        }
        return (<Tag style={{ marginLeft: '15px' }}>{text}</Tag>);
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
      dataIndex: "PoDate",
      key: "PoDate",
      sorter: (a, b) => new Date(a.PoDate) - new Date(b.PoDate),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        const dateParts = text.split('T')[0].split('-');
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        return `${day}-${month}-${year}`;
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
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      render: (_, row) => (
        <Button type="link">Report</Button>
      )
    }
    // {
    //   title: "Actions",
    //   dataIndex: "actions",
    //   key: "actions",
    //   render: (_, row) => (
    //     <>
    //       <Tooltip title="Edit">
    //         <Button icon={<EditOutlined />} onClick={() => handleEdit(row)} />
    //       </Tooltip>
    //       <Tooltip title="Delete">
    //         <Button
    //           icon={<DeleteOutlined />}
    //           onClick={() => handleDelete(row)}
    //         />
    //       </Tooltip>
    //     </>
    //   ),
    // },
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
    debugger;
    setIsSearchLoading(true);
    setLoading(true);
    try {
      const postData1 = {
        DocumentType: values.DocumentType ,
        Supplier: values.Supplier,
        ProcurementStore: values.ProcurementStore,
        POStatus: values.POStatus === "" ? null : values.POStatus,
        FromDate: values.FromDate,
        ToDate: values.ToDate,
        // FromDate: values.FromDate.$D.toString().padStart(2, "0") + "-" + (values.FromDate.$M + 1).toString().padStart(2, "0") + "-" + values.FromDate.$y,
        // ToDate: values.ToDate.$D.toString().padStart(2, "0") + "-" + (values.ToDate.$M + 1).toString().padStart(2, "0") + "-" + values.ToDate.$y,
        PONumber: values.PONumber === undefined ? null : values.PONumber, // A sample value
      };
      customAxios
        .get(
          `${urlSearchPurchaseOrder}?DocumentType=${postData1.DocumentType}&Supplier=${postData1.Supplier}&ProcurementStore=${postData1.ProcurementStore}&DocumentStatus=${postData1.POStatus}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&PoNumber=${postData1.PONumber}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
            },
          }
        )
        .then((response) => {
          debugger;
          setFilteredData(response.data.data.PurchaseOrderDetails);
          response.data.data.PurchaseOrderDetails.PoHeaderId
          if (response.data.data.PurchaseOrderDetails.length > 0) {
            setIsTableHasValues(true);
          }
          // setCurrentPage1(1);
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
    setIsTableHasValues(false);
    form.resetFields();
  };

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
              Purchase Order
            </Title>
          </Col>
          <Col offset={5} span={2}>
            <Button icon={<PlusCircleOutlined />} style={{ marginRight: 0 }} onClick={() => GetPobyId(0)}>
              Add Purchase Order
            </Button>
          </Col>
        </Row>
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
              FromDate: dayjs().subtract(1, 'day'),
              ToDate: dayjs(),
              DocumentType: 0,
              Supplier: 0,
              ProcurementStore: 0,
              POStatus: '',
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item label="DocumentType" name="DocumentType">
                  <Select>
                    <Select.Option key={0} value={0}>All</Select.Option>
                    {purchaseOrderDropdown.DocumentType.map((option) => (
                      <Select.Option key={option.LookupID} value={option.LookupID}>
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="Supplier" label="Supplier">
                  <Select>
                    <Select.Option key={0} value={0}>All</Select.Option>
                    {purchaseOrderDropdown.SupplierList.map((option) => (
                      <Select.Option key={option.VendorId} value={option.VendorId}>
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
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item name="ProcurementStore" label="Procurement Store" rules={[{ required: false }]}>
                  <Select>
                    <Select.Option key={0} value={0}>All</Select.Option>
                    {purchaseOrderDropdown.StoreDetails.map((option) => (
                      <Select.Option key={option.StoreId} value={option.StoreId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item label="PO Number" name="PONumber">
                  <Input allowClear style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item label="PO Status" name="POStatus">
                  <Select>
                    <Select.Option key='' value=''>All</Select.Option>
                    <Select.Option key="Created" value="Created"></Select.Option>
                    <Select.Option key="Draft" value="Draft"></Select.Option>
                    <Select.Option key="Pending" value="Pending"></Select.Option>
                    <Select.Option key="Partially Pending" value="Partially Pending"></Select.Option>
                    <Select.Option key="Completed" value="Completed"></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Form.Item>
                  <Button type="primary" loading={isSearchLoading} htmlType="submit">
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
        {isTableHasValues && (
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{
              onChange: (current, pageSize) => {
                setPage(current);
                setPaginationSize(pageSize);
              },
              defaultPageSize: 5,
              hideOnSinglePage: true,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            }}
            rowKey={(row) => row.AppUserId}
            size="small"
            bordered
          />
        )}
        {/* {loading ? (
          <Skeleton active />
        ) : (
          // <Spin tip="Loading" size="large">
          //   <div className="content" />
          // </Spin>
          // <div>
          //   {isTable && (
              
          //   )}
          // </div>
        )} */}
      </div>
    </Layout>
  );
};

export default PurchaseOrder;
