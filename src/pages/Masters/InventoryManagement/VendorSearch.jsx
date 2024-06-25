import React, { useState, useEffect } from 'react';
import customAxios from '../../../components/customAxios/customAxios.jsx';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Layout from 'antd/es/layout/layout';
import { Spin, Skeleton, Tag, Typography, Select, Button, Form, Input, Row, Col, DatePicker, Card, Divider, Tooltip, Table, Checkbox } from 'antd';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { urlSearchVendor } from '../../../../endpoints';
import { useNavigate } from "react-router";

const VendorSearch = () => {

    const [form] = Form.useForm();
    const { Title } = Typography;
    const [filteredData, setFilteredData] = useState([]);

    const onFinish = (values) => {        
        try {
            const postData1 = {
                City: values.City === undefined ? null : values.City,
                ContactName: values.ContactPerson === undefined ? null : values.ContactPerson,
                MobileNumber: values.Mobile === undefined ? null : values.Mobile,
                VendorGroup: values.VendorGroup,
                LongName: values.VendorName === undefined ? null : values.VendorName,
            };
            customAxios
                .get(
                    `${urlSearchVendor}?LongName=${postData1.LongName}&ContactName=${postData1.ContactName}&VendorGroup=${postData1.VendorGroup}&MobileNumber=${postData1.MobileNumber}&City=${postData1.City}`,
                    null,
                    {
                        params: postData1,
                        headers: {
                            "Content-Type": "application/json", 
                        },
                    }
                )
                .then((response) => {                    
                    setFilteredData(response.data.data.VendorDetails);                    
                })
        } catch (error) {
                
        }
    }

    const onReset = () => {
        form.resetFields();
    }
    const navigate = useNavigate();
    const handleVendor = (VendorId) => {        
        navigate('/Vendor', { state: { VendorId } });
    }

    const columns = [
        {
            title: "Sl No",
            key: "index",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Vendor Name",
            dataIndex: "LongName",
            key: "LongName",
            sorter: (a, b) => a.LongName - b.LongName,
            sortDirections: ["descend", "ascend"],
            render: (text, record, index) => {
                return (<Button type="link" onClick={() => handleVendor(record.VendorId)}>
                    {text}
                </Button>
                )
            },
        },
        {
            title: "Contact Person",
            dataIndex: "ContactPerson",
            key: "ContactPerson",
            sorter: (a, b) => a.ContactPerson.localeCompare(b.ContactPerson),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Vendor Group",
            dataIndex: "VendorGroup",
            key: "VendorGroup",
            sorter: (a, b) => new Date(a.VendorGroup) - new Date(b.VendorGroup),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Mobile Number",
            dataIndex: "MobileNumber",
            key: "MobileNumber",
            sorter: (a, b) => a.MobileNumber.localeCompare(b.MobileNumber),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Status",
            dataIndex: "ActiveFlag",
            key: "ActiveFlag",
            sorter: (a, b) => a.ActiveFlag.localeCompare(b.ActiveFlag),
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                if (text === true) {
                    return 'Active'
                }
                else {
                    return 'Hidden'                    
                }
            },
        },
    ];

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Vendor Search
                        </Title>
                    </Col>
                    <Col offset={6} span={2}>
                        <Button icon={<PlusCircleOutlined />} style={{ marginRight: 0 }} onClick={() => handleVendor(0)}>
                            Add
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
                            maxWidth: 1500
                        }}
                        onFinish={onFinish}
                        initialValues={{
                            VendorGroup: 'Local Suppliers'
                        }}
                    >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item label="Vendor Name" name="VendorName">
                                    <Input type="text" allowClear></Input>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item label='Contact Person' name='ContactPerson'>
                                    <Input type="text" allowClear></Input>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="VendorGroup" label="Vendor Group">
                                    <Select>
                                        <Select.Option key='Local Suppliers' value='Local Suppliers'></Select.Option>
                                        <Select.Option key='Overseas Suppliers' value='Overseas Suppliers'></Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="Mobile" label="Mobile">
                                    <Input type="text" allowClear></Input>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="City" label="City">
                                    <Input type="text" allowClear></Input>
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
                </Card>
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
            </div>
        </Layout>
    )
}

export default VendorSearch;