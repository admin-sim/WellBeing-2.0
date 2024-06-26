import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Spin, Skeleton, Tag, Typography, Select, Button, Form, Input, Row, Col, DatePicker, Card, Divider, Tooltip, Table } from 'antd';
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import customAxios from '../../components/customAxios/customAxios.jsx'; // Import your custom axios instance or use axios directly
import Layout from 'antd/es/layout/layout';
import { urlGetPurshaseOrderDetails, urlSearchGRN } from '../../../endpoints.js';
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const GRNAgainstPO = () => {
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
    const [isTableHasValue, setIsTableHasValue] = useState(false);
    const { Title } = Typography;

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
    }, []);

    const navigate = useNavigate();

    const colorMapping = {
        Created: 'blue',
        Draft: 'geekblue',
        FINALIZE: 'green',
    };

    const handleGRN = (GrnHeaderId) => {
        navigate("/CreateGRNAgainstPO", { state: { GrnHeaderId } });
    }

    const columns = [
        {
            title: 'Sl No',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'GRN Number',
            dataIndex: 'GRNNumber',
            key: 'GRNNumber',
            sorter: (a, b) => a.GRNNumber - b.GRNNumber,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                if (record.GRNStatus === "Created" || record.GRNStatus === "Draft") {
                    return (<Button type="link" onClick={() => handleGRN(record.GRNHeaderId)}>
                        {text}
                    </Button>
                    )
                }
                return (<Tag style={{ marginLeft: '15px' }}>{text}</Tag>);
            },
        },
        {
            title: 'Document Type',
            dataIndex: 'DocumentTypeName',
            key: 'DocumentTypeName',
            sorter: (a, b) => a.DocumentTypeName.localeCompare(b.DocumentTypeName),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'GRN Date',
            dataIndex: 'GRNDate',
            key: 'GRNDate',
            sorter: (a, b) => new Date(a.GRNDate) - new Date(b.GRNDate),
            sortDirections: ['descend', 'ascend'],
            render: (text) => {
                const dateParts = text.split('T')[0].split('-');
                const year = dateParts[0];
                const month = dateParts[1];
                const day = dateParts[2];

                return `${day}-${month}-${year}`;
            },
        },
        {
            title: 'Supplier Name',
            dataIndex: 'SupplierName',
            key: 'SupplierName',
            sorter: (a, b) => a.SupplierName.localeCompare(b.SupplierName),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Store Name',
            dataIndex: 'StoreName',
            key: 'StoreName',
            sorter: (a, b) => a.StoreName.localeCompare(b.StoreName),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'GRN Owner',
            dataIndex: 'GRNOwner',
            key: 'GRNOwner',
            sorter: (a, b) => a.GRNOwner.localeCompare(b.GRNOwner),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'GRN Status',
            dataIndex: 'GRNStatus',
            key: 'GRNStatus',
            sorter: (a, b) => a.GRNStatus.localeCompare(b.GRNStatus),
            sortDirections: ['descend', 'ascend'],
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
            title: 'Invoice Number',
            dataIndex: 'InvoiceNumber',
            key: 'InvoiceNumber',
            sorter: (a, b) => a.InvoiceNumber.localeCompare(b.InvoiceNumber),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record, index) => <Button type="link">Report</Button>
        },
    ];

    const onFinish = async (values) => {
        try {
            const postData1 = {
                DocumentType: values.DocumentType,
                Supplier: values.Supplier === undefined ? 0 : values.Supplier,
                ReceivingStore: values.ReceivingStore === undefined ? 0 : values.ReceivingStore,
                GRNStatus: values.GRNStatus === 0 ? null : values.GRNStatus,
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                GRNNumber: values.GRNNumber === undefined ? null : values.GRNNumber,
                GrnType: "GRN Against PO",
            };
            customAxios
                .get(
                    `${urlSearchGRN}?DocumentType=${postData1.DocumentType}&GRNNumber=${postData1.GRNNumber}&Supplier=${postData1.Supplier}&ReceivingStore=${postData1.ReceivingStore}&GRNStatus=${postData1.GRNStatus}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&GrnType=${postData1.GrnType}`,
                    null,
                    {
                        params: postData1,
                        headers: {
                            'Content-Type': 'application/json' // Replace with the appropriate content type if needed
                        }
                    }
                )
                .then((response) => {
                    console.log('Response:', response.data);
                    setFilteredData(response.data.data.GRNAgainstPODetails);
                    if (response.data.data.GRNAgainstPODetails.length > 0) {
                        setIsTableHasValue(true);
                    }
                    else {
                        setIsTableHasValue(false);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const onReset = () => {
        setIsTableHasValue(false);
        form.resetFields();
    };

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            GRN Against PO
                        </Title>
                    </Col>
                    <Col offset={5} span={2}>
                        <Button icon={<PlusCircleOutlined />} style={{ marginRight: 0 }} onClick={() => handleGRN(0)}>
                            Add GRN Against PO
                        </Button>
                    </Col>
                </Row>
                <Card>
                    <Form
                        form={form}
                        initialValues={{
                            ToDate: dayjs(),
                            FromDate: dayjs().subtract(1, 'day'),
                            DocumentType: 0,
                            GRNStatus: 0,
                        }}
                        name="control-hooks"
                        layout="vertical"
                        variant="outlined"
                        size="Default"
                        style={{
                            maxWidth: 1500
                        }}
                        onFinish={onFinish}
                    >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Document Type" name="DocumentType">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        {Dropdown.DocumentType.map((option) => (
                                            <Select.Option key={option.LookupID} value={option.LookupID}>
                                                {option.LookupDescription}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="Supplier" label="Supplier">
                                    <Select allowClear placeholder='Select Value'>
                                        {Dropdown.SupplierList.map((option) => (
                                            <Select.Option key={option.VendorId} value={option.VendorId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="FromDate" label="From Date">
                                    <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' allowClear />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="ToDate" label="To Date">
                                    <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' allowClear />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="ReceivingStore" label="Receiving Store">
                                    <Select allowClear placeholder='Select Value'>
                                        {Dropdown.StoreDetails.map((option) => {
                                            if (option.StoreId === 1) {
                                                return (
                                                    <Select.Option key={option.StoreId} value={option.StoreId}>
                                                        {option.LongName}
                                                    </Select.Option>
                                                );
                                            }
                                            return null;
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="GRN Number" name="GRNNumber">
                                    <Input allowClear />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="GRN Status" name="GRNStatus">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        <Select.Option key="Created" value="Created"></Select.Option>
                                        <Select.Option key="Draft" value="Draft"></Select.Option>
                                        <Select.Option key="Completed" value="Finalize"></Select.Option>
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
                {isTableHasValue && (
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
                            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        }}
                        rowKey={(row) => row.AppUserId}
                        size="small"
                        bordered
                    />
                )}
            </div>
        </Layout>
    );
};

export default GRNAgainstPO;
