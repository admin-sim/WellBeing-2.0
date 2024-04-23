import React, { useState, useEffect } from "react";
import Layout from 'antd/es/layout/layout';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
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

import { urlGetPurshaseOrderDetails, urlSearchItemReceipt } from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
import { Option } from "antd/es/mentions";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const ItemReceipt = () => {
    const [Dropdown, setDropDown] = useState({
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
    const [isTable, setIsTable] = useState(false);
    const { Title } = Typography;
    useEffect(() => {
        try {
            customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
                const apiData = response.data.data;
            });
        } catch (error) {
            console.error("Error fetching purchase order details:", error);
        }
    }, []);

    const navigate = useNavigate();
    const handleAddTemplate = () => {
        navigate(`/CreateItemReceipt`);
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
            sorter: (a, b) => a.ItemReceiptId.localeCompare(b.ItemReceiptId),
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
        try {
            const postData1 = {
                IndentType: values.IndentType === 0 ? null : values.IndentType,
                IndentOwner: values.IndentOwner === undefined ? null : values.IndentOwner,
                IndentNumber: values.IndentNumber === undefined ? null : values.IndentNumber,
                IssueStatus: values.IssueStatus === 0 ? null : values.IssueStatus,
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                IssueStore: values.IssueStore === undefined ? 0 : values.IssueStore,
                ReceiptStatus: values.ReceiptStatus === 0 ? null : values.ReceiptStatus,
                RequestingLocation: values.RequestingLocation === undefined ? 0 : values.RequestingLocation,
            };
            customAxios
                .get(
                    `${urlSearchItemReceipt}?IndentType=${postData1.IndentType}&IndentOwner=${postData1.IndentOwner}&IndentNumber=${postData1.IndentNumber}&IssueStatus=${postData1.IssueStatus}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&IssuingStoreId=${postData1.IssueStore}&ReceiptStatus=${postData1.ReceiptStatus}&RequestingStoreId=${postData1.RequestingLocation}`,
                    null,
                    {
                        params: postData1,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((response) => {
                    debugger;
                    setFilteredData(response.data.data.ItemReceiptDetails);
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Item Receipt
                        </Title>
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
                            IndentType: 0,
                            ReceiptStatus: 0,
                            IssueStatus: 0,
                        }}
                        onFinish={onFinish}
                    >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Indent Type" name="IndentType">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        <Select.Option key='Effective' value='Effective'></Select.Option>
                                        <Select.Option key='Consumption Based' value='Consumption Based'></Select.Option>
                                        <Select.Option key='Urgent' value='Urgent'></Select.Option>
                                        <Select.Option key='Reorder Level Based' value='Reorder Level Based'></Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="IndentNumber" label="Indent Number">
                                    <Input style={{ width: '100%' }} allowClear />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item name="FromDate" label="From Date">
                                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item name="ToDate" label="To Date">
                                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item name="IssueStore" label="Issue Store">
                                    <Select allowClear placeholder='Select Value'>
                                        {Dropdown.StoreDetails.map((Option) => (
                                            <Select.Option key={Option.StoreId} value={Option.StoreId}>{Option.LongName}</Select.Option>
                                        ))};
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="RequestingLocation" label="Requesting Location">
                                    <Select allowClear placeholder='Select Value'>
                                        {Dropdown.StoreDetails.map((Option) => (
                                            <Select.Option key={Option.StoreId} value={Option.StoreId}>{Option.LongName}</Select.Option>
                                        ))};
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="IndentOwner" label="Indent Owner">
                                    <Input style={{ width: '100%' }} allowClear />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item name="IssueStatus" label="Issue Status">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        <Select.Option key='Draft' value='Draft'></Select.Option>
                                        <Select.Option key='Completed' value='Completed'></Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item name="ReceiptStatus" label="Receipt Status">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        <Select.Option key='Draft' value='Draft'></Select.Option>
                                        <Select.Option key='Completed' value='Completed'></Select.Option>
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
                <Table display={setIsTable}
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
            </div>
        </Layout>
    );
};

export default ItemReceipt;
