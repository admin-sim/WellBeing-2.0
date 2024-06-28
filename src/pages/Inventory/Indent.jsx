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

import { useNavigate } from "react-router";

import { urlGetPurshaseOrderDetails, urlSearchIndent } from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";

const Indent = () => {
    const [IndentDropdown, setIndentDropDown] = useState({
        DocumentType: [],
        StoreDetails: [],
        SupplierList: [],
        DateFormat: []
    });
    const [paginationSize, setPaginationSize] = useState(5);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(1);
    const [form] = Form.useForm();
    const [isTable, setIsTable] = useState(false);
    const { Title } = Typography;
    const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
    const [toDate, setToDate] = useState(dayjs());

    useEffect(() => {
        try {
            customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
                const apiData = response.data.data;
                setIndentDropDown(apiData);
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

    const GetIndentById = (IndentId) => {
        navigate("/CreateIndent", { state: { IndentId } });
    };

    const columns = [
        {
            title: "Sl No",
            key: "index",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Indent Number",
            dataIndex: "IndentNumber",
            key: "IndentNumber",
            sorter: (a, b) => a.IndentNumber - b.IndentNumber,
            sortDirections: ["descend", "ascend"],
            render: (text, record, index) => {
                if (record.IndentStatus === "Created" || record.IndentStatus === "Draft") {
                    return (<Button type="link" onClick={() => GetIndentById(record.IndentId)}>
                        {text}
                    </Button>
                    )
                }
                return (<Tag style={{ marginLeft: '15px' }}>{text}</Tag>);
            }
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
            sorter: (a, b) => new Date(a.IndentDate) - new Date(b.IndentDate),
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
            title: "Issue Store",
            dataIndex: "IssueStoreName",
            key: "IssueStoreName",
            sorter: (a, b) => a.IssueStoreName.localeCompare(b.IssueStoreName),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Requesting Location",
            dataIndex: "StoreName",
            key: "StoreName",
            sorter: (a, b) => a.StoreName.localeCompare(b.StoreName),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Indented By",
            dataIndex: "PatientName",
            key: "PatientName",
            sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
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
            title: "Status",
            dataIndex: "IndentStatus",
            key: "IndentStatus",
            sorter: (a, b) => a.IndentStatus.localeCompare(b.IndentStatus),
            sortDirections: ["descend", "ascend"],
        },
        {
            render: (_, row) => (
                <Button type="link">Report</Button>
            ),
        },
    ];

    const onFinish = async (values) => {
        try {
            const postData1 = {
                IndentNumber: values.DocumentType === undefined ? null : values.DocumentType,
                IndentType: values.IndentType === 0 ? null : values.IndentType,
                RequestingStoreId: values.RequestingStore === undefined ? 0 : values.RequestingStore,
                IssuingStoreId: values.IssuingStore === undefined ? 0 : values.IssuingStore,
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                IndentStatus: values.IndentStatus === 0 ? null : values.IndentStatus,
            };
            customAxios
                .get(
                    `${urlSearchIndent}?IndentNumber=${postData1.IndentNumber}&IndentType=${postData1.IndentType}&RequestingStoreId=${postData1.RequestingStoreId}&IssuingStoreId=${postData1.IssuingStoreId}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&IndentStatus=${postData1.IndentStatus}`,
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
                    setFilteredData(response.data.data.IndentDetails);
                })
        } catch (error) {
            // Handle any errors here            
        }
    };

    const onReset = () => {
        setFilteredData([]);
        // setIsTable(false);
        form.resetFields();
    };

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Indent
                        </Title>
                    </Col>
                    <Col offset={6} span={2}>
                        <Button icon={<PlusCircleOutlined />} style={{ marginRight: 0 }} onClick={() => GetIndentById(0)}>
                            Add Indent
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
                            IndentStatus: 0,
                            IndentType: 0
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
                                        <Select.Option key='Reorder level Based' value='Reorder level Based'></Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="IndentNumber" label="Indent Number">
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="FromDate" label="From Date">
                                    <DatePicker value={fromDate} style={{ width: "100%" }} onChange={handleFromDateChange} disabledDate={disabledFromDate} format="DD-MM-YYYY" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="ToDate" label="To Date">
                                    <DatePicker value={toDate} style={{ width: "100%" }} onChange={handleToDateChange} disabledDate={disabledToDate} format="DD-MM-YYYY" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="RequestingStore" label="Requesting Store">
                                    <Select allowClear placeholder='Select Value'>
                                        {IndentDropdown.StoreDetails.map((option) => (
                                            <Select.Option key={option.StoreId} value={option.StoreId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Issuing Store" name="IssuingStore">
                                    <Select allowClear placeholder='Select Value'>
                                        {IndentDropdown.StoreDetails.map((option) => (
                                            <Select.Option key={option.StoreId} value={option.StoreId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Indent Status" name="IndentStatus">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
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
                                    <Button type="primary" htmlType="submit">
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
                    <Table display={setIsTable} dataSource={filteredData} columns={columns} scroll={"auto"}
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
                        rowKey={(row) => row.AppUserId} size="small" bordered
                    />
                </Card>
            </div>
        </Layout>
    );
};

export default Indent;
