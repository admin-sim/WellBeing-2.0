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
import { render } from "react-dom";
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
    const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
    const [toDate, setToDate] = useState(dayjs());

    useEffect(() => {
        try {
            customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
                const apiData = response.data.data;
                setDropDown(apiData)
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
        Completed: "green",
    };

    const GetModelDetails = (text, record, index) => {
        const IndentReceiptId = record.IndentReceiptId ? record.IndentReceiptId : 0
        const IssueId = record.IssueId
        navigate("/UpdateItemReceipt", { state: { IssueId, IndentReceiptId } });
    };

    const handleFromDateChange = (date) => {
        setFromDate(date);
        if (toDate && date && date.isAfter(toDate)) {
            setToDate(null);
        }
    };

    const handleToDateChange = (date) => {
        setToDate(date);
    };

    const disabledFromDate = (current) => {
        return current && current.isAfter(dayjs().endOf('day'));
    };

    const disabledToDate = (current) => {
        return current && (current.isBefore(fromDate, 'day') || current.isAfter(dayjs().endOf('day')));
    };

    const columns = [
        {
            title: "Sl No",
            key: "index",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Issue Number",
            dataIndex: "IssueNumber",
            key: "IssueNumber",
            sorter: (a, b) => a.IssueNumber - b.IssueNumber,
            sortDirections: ["descend", "ascend"],
            render: (text, record, index) => {
                if (record.ReceiptStatus === "Finalize" && record.IssueStatus === "Finalize") {
                    return (<Tag style={{ marginLeft: '5px' }}>{text}</Tag>);
                }
                return (<Button type="link" onClick={() => GetModelDetails(text, record, index)}>
                    {text}
                </Button>)
                // if (record.ReceiptStatus != 'Finalize') {
                //     <Button
                //         type="link"
                //         onClick={() => GetModelDetails(text, record, index)}
                //     >
                //         {text}
                //     </Button>
                // }
                // else {
                //     <Tag>{text}</Tag>

                // }
            },
        },
        {
            title: "Indent Number",
            dataIndex: "IndentNumber",
            key: "IndentNumber",
            sorter: (a, b) => a.IndentNumber.localeCompare(b.IndentNumber),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Receipt Number",
            dataIndex: "ReceiptNumber",
            key: "ReceiptNumber",
            sorter: (a, b) => new Date(a.ReceiptNumber) - new Date(b.ReceiptNumber),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Indent Type",
            dataIndex: "IndentType",
            key: "IndentType",
            sorter: (a, b) => a.IndentType.localeCompare(b.IndentType),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Indent Date",
            dataIndex: "IndentDate",
            key: "IndentDate",
            sorter: (a, b) => a.IndentDate.localeCompare(b.IndentDate),
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                if (text != '' && text != null) {
                    const dateParts = text.split('T')[0].split('-');
                    const year = dateParts[0];
                    const month = dateParts[1];
                    const day = dateParts[2];

                    return `${day}-${month}-${year}`;
                }
            }
        },
        {
            title: "Issue Date",
            dataIndex: "IssueDate",
            key: "IssueDate",
            sorter: (a, b) => a.IssueDate.localeCompare(b.IssueDate),
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                if (text != '' && text != null) {
                    const dateParts = text.split('T')[0].split('-');
                    const year = dateParts[0];
                    const month = dateParts[1];
                    const day = dateParts[2];

                    return `${day}-${month}-${year}`;
                }
            },
        },
        {
            title: "Issueing Store",
            dataIndex: "IssueStoreName",
            key: "IssueStoreName",
            sorter: (a, b) => a.IssueStoreName.localeCompare(b.IssueStoreName),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Requesting Location",
            dataIndex: "RequestStoreName",
            key: "RequestStoreName",
            sorter: (a, b) => a.RequestStoreName.localeCompare(b.RequestStoreName),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Issue Status",
            dataIndex: "IssueStatus",
            key: "IssueStatus",
            sorter: (a, b) => a.IssueStatus.localeCompare(b.IssueStatus),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Receipt Status",
            dataIndex: "ReceiptStatus",
            key: "ReceiptStatus",
            sorter: (a, b) => a.ReceiptStatus.localeCompare(b.ReceiptStatus),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_, row) => (
                <Button type='link'>Report</Button>
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

    // const [formatedFromDate, setFormatedFromDate] = useState();
    // const [formatedToDate, setFormatedToDate] = useState();
    // function formatDate(inputDate) {
    //     const dateParts = inputDate.split("/");
    //     if (dateParts.length === 3) {
    //         const [year, month, day] = dateParts;
    //         return `${day}-${month}-${year}`;
    //     }
    //     return inputDate; 
    // }

    const onFinish = async (values) => {
        try {
            const postData1 = {
                IndentType: values.IndentType ? values.IndentType : null,
                IndentOwner: values.IndentOwner ? values.IndentOwner : null,
                IndentNumber: values.IndentNumber ? values.IndentNumber : null,
                IssueStatus: values.IssueStatus ? values.IssueStatus : null,
                FromDate: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : "",
                ToDate: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
                IssueStore: values.IssueStore ? values.IssueStore : 0,
                ReceiptStatus: values.ReceiptStatus ? values.ReceiptStatus : null,
                RequestingLocation: values.RequestingLocation ? values.RequestingLocation : 0,
            };
            customAxios
                .get(
                    `${urlSearchItemReceipt}?IndentType=${postData1.IndentType}&IndentOwner=${postData1.IndentOwner}&IndentNumber=${postData1.IndentNumber}&IssueStatus=${postData1.IssueStatus}&FromDateString=${postData1.FromDate}&ToDateString=${postData1.ToDate}&IssuingStoreId=${postData1.IssueStore}&ReceiptStatus=${postData1.ReceiptStatus}&RequestingStoreId=${postData1.RequestingLocation}`,
                    null,
                    {
                        params: postData1,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((response) => {
                    debugger
                    setFilteredData(response.data.data.IndentReceiptList);
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
                                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY"
                                        value={fromDate} onChange={handleFromDateChange} disabledDate={disabledFromDate} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item name="ToDate" label="To Date">
                                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY"
                                        value={toDate} onChange={handleToDateChange} disabledDate={disabledToDate} />
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
