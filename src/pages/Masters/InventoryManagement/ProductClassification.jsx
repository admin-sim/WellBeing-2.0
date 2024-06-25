import React, { useState, useEffect } from 'react';
import customAxios from '../../../components/customAxios/customAxios.jsx';
import { EditOutlined, DeleteOutlined, PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Layout from 'antd/es/layout/layout';
import { Spin, Skeleton, Tag, Typography, Modal, ConfigProvider, Select, Button, Form, Input, Row, Col, DatePicker, Card, Divider, Popconfirm, Table, Checkbox, message } from 'antd';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { urlProductClassificationIndex, urlGetList, urlSaveNewProductClassification, urlUpdateProductClassification, urlShowEditClassification, urlDeleteProductClassification } from '../../../../endpoints';
import { useNavigate } from "react-router";
import FormItem from 'antd/es/form/FormItem/index.js';

const ProductClassification = () => {

    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const { Title } = Typography;
    const [dPPData, setDPPData] = useState([]);
    const [productGroup, setProductGroup] = useState();
    const [productGroupId, setProductGroupId] = useState();
    const [classificationAction, setClassificationAction] = useState()
    const [showTable, setShowTable] = useState(false)
    const [paginationSize, setPaginationSize] = useState(5);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [buttonTitle, setButtonTitle] = useState('Save');
    const [dropDown, setDropDown] = useState({
        ProductGroup: []
    });

    useEffect(() => {
        try {
            customAxios.get(urlProductClassificationIndex, {}).then((response) => {
                const apiData = response.data.data;
                setDropDown(apiData);
            });
        } catch (error) {
            console.error("Error fetching purchase order details:", error);
        }
    }, []);

    const onclick = (values) => {
        try {
            customAxios
                .get(
                    `${urlGetList}?ProductGroupId=${values}`,
                    null,
                    {
                        params: values,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((response) => {
                    setShowTable(true)
                    setProductGroup(response.data.data.ProductGroupName.LookupDescription)
                    setProductGroupId(response.data.data.NewProductClassificationModel.ProductGroupId)
                    setDPPData(response.data.data.ProductClassification);
                })
        } catch (error) {

        }
    }

    const ModelAdd = () => {
        setButtonTitle('Save')
        setIsModalOpen(true)
        setClassificationAction('Add Product Classification')
    }

    const ModelUpdate = (ProductClassificationId) => {
        customAxios.get(`${urlShowEditClassification}?ProductClassificationId=${ProductClassificationId}`).then((response) => {
            const apiData = response.data.data;
            setButtonTitle('Update');
            setIsModalOpen(true)
            form1.setFieldsValue({ ProductClassificationId: apiData.NewProductClassificationModel.ProductClassificationId })
            form1.setFieldsValue({ ShortName: apiData.NewProductClassificationModel.ShortName })
            form1.setFieldsValue({ LongName: apiData.NewProductClassificationModel.LongName })
            form1.setFieldsValue({ Status: apiData.NewProductClassificationModel.Status })
            form1.setFieldsValue({ Remarks: apiData.NewProductClassificationModel.Remarks === '' ? null : apiData.NewProductClassificationModel.Remarks })
        })
    }

    const ModelDelete = (ProductClassificationId) => {
        debugger
        customAxios.post(`${urlDeleteProductClassification}?ProductClassificationId=${ProductClassificationId}&ProductGroupId=${productGroupId}`).then((response) => {
            debugger;             
            const apiData = response.data;
                if (apiData === 'Failure') {
                    setIsModalOpen(false);
                    message.error('Failure')
                } else if (apiData === 'Already Exists') {
                    setIsModalOpen(false);
                    message.warning('Already Exists')
                } else {
                    setIsModalOpen(false);
                    form1.resetFields()
                    setDPPData(response.data.data.ProductClassification);
                    message.success('Deleted Successfully')
                }           
        })
    }

    const columns = [
        {
            title: "Short Name",
            dataIndex: "ShortName",
            key: "ShortName",
            sorter: (a, b) => a.ShortName.localeCompare(b.ShortName),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Long Name",
            dataIndex: "LongName",
            key: "LongName",
            sorter: (a, b) => a.LongName - b.LongName,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Product Group",
            dataIndex: "ProductGroup",
            key: "ProductGroup",
            sorter: (a, b) => new Date(a.ProductGroup) - new Date(b.ProductGroup),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
            sorter: (a, b) => a.Status.localeCompare(b.Status),
            sortDirections: ["descend", "ascend"],
            render: (text, record) => {
                if (text === true) {
                    return 'Active'
                }
            }
        },
        {
            title: <Button type="primary" icon={<PlusOutlined />} onClick={ModelAdd}></Button>,
            // dataIndex: 'add',
            // key: 'add',
            width: 50,
            render: (text, record) => {
                return (
                    <>
                        <Popconfirm title="Sure to edit?" onConfirm={() => ModelUpdate(record.ProductClassificationId)}>
                            <EditOutlined style={{ marginRight: 4 }} />
                        </Popconfirm>
                        <Popconfirm title="Sure to delete?" onConfirm={() => ModelDelete(record.ProductClassificationId)}>
                            <DeleteOutlined />
                        </Popconfirm>
                    </>
                )
            }
        }
    ];

    const onReset = () => {
        form.resetFields();
    }
    const navigate = useNavigate();
    const handleVendor = (VendorId) => {
        navigate('/Vendor', { state: { VendorId } });
    }

    const onOkModal = () => {
        form1.submit();
    }

    const onCancelModel = () => {
        debugger;
        setIsModalOpen(false);
        form1.resetFields();
    }

    const onFinishModel = (values) => {
        debugger;
        if (values.ProductClassificationId === undefined) {
            customAxios.post(`${urlSaveNewProductClassification}?ShortName=${values.ShortName}&LongName=${values.LongName}&ProductGroupId=${values.ProductGroupId}&Remarks=${values.Remarks}&Status=${values.Status}`).then((response) => {
                debugger;
                const apiData = response.data;
                if (apiData === 'Failure') {
                    setIsModalOpen(false);
                    message.error('Failure')
                } else if (apiData === 'Already Exists') {
                    setIsModalOpen(false);
                    message.warning('Already Exists')
                } else {
                    setIsModalOpen(false);
                    form1.resetFields()
                    setDPPData(response.data.data.ProductClassification);
                    message.success('Saved Successfully')
                }
            })
        } else {
            customAxios.post(`${urlUpdateProductClassification}?ProductClassificationId=${values.ProductClassificationId}&LongName=${values.LongName}&ProductGroupId=${values.ProductGroupId}&Remarks=${values.Remarks}&Status=${values.Status}`).then((response) => {
                debugger;
                const apiData = response.data;
                if (apiData === 'Failure') {
                    setIsModalOpen(false);
                    message.error('Failure')
                } else if (apiData === 'Already Exists') {
                    setIsModalOpen(false);
                    message.warning('Already Exists')
                } else {
                    setIsModalOpen(false);
                    form1.resetFields()
                    setDPPData(response.data.data.ProductClassification);
                    message.success('Updated Successfully')
                }
            })
        }
    }

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Product Classification
                        </Title>
                    </Col>
                </Row>
                <Card>
                    <Layout style={{ zIndex: '999999999' }}>
                        <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                            <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                                <Col span={16}>
                                    <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                                        Product Group
                                    </Title>
                                </Col>
                            </Row>
                            <Card>
                                <div style={{ width: '100%' }}>
                                    {dropDown.ProductGroup.map((item) => (
                                        <Button key={item.LookupID} type="link" onClick={() => onclick(item.LookupID)}>
                                            {item.LookupDescription}
                                        </Button>
                                    ))}
                                </div>
                                <br />
                                <hr />
                                <div style={{ width: '100%' }}>
                                    {showTable && (
                                        <>
                                            <h4>{productGroup}</h4>
                                            <Table
                                                dataSource={dPPData}
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
                                        </>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </Layout>
                </Card>
                <ConfigProvider
                    theme={{
                        token: {
                            zIndexPopupBase: 3000
                        }
                    }}>
                    <Modal
                        title='Add Product Classification'
                        onOk={onOkModal}
                        onCancel={onCancelModel}
                        // width={1000}
                        open={isModalOpen}
                        layout="vertical"
                        footer={[
                            <Button key="submit" type="primary" onClick={onOkModal}>
                                {buttonTitle}
                            </Button>,
                            <Button key="back" onClick={onCancelModel}>
                                Close
                            </Button>
                        ]}
                    >
                        <Form
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                width: '100%',
                            }}
                            onFinish={onFinishModel}
                            // onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            form={form1}
                            initialValues={{
                                Status: true,
                                ProductGroupId: productGroupId,
                                // Remarks: '',
                            }}
                        >
                            <h4>Product Group: {productGroup}</h4>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="Short Name"
                                        name="ShortName"
                                        style={{ marginLeft: '10px' }}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input!'
                                            }
                                        ]}
                                    >
                                        <Input type='text' disabled={true} allowClear></Input>
                                    </Form.Item>
                                    <FormItem hidden name='ProductClassificationId'><Input></Input></FormItem>
                                    <FormItem hidden name='ProductGroupId'><Input></Input></FormItem>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="Status"
                                        name="Status"
                                        style={{ marginLeft: '10px' }}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input!'
                                            }
                                        ]}
                                    >
                                        <Select>
                                            <Option key={true} value={true}>Active</Option>
                                            <Option key='false' value='false'>Hidden</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Long Name"
                                        name="LongName"
                                        style={{ marginLeft: '10px' }}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input!'
                                            }
                                        ]}
                                    >
                                        <Input type='text' allowClear></Input>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="Remarks"
                                        name="Remarks"
                                        style={{ marginLeft: '10px' }}
                                    >
                                        <Input type='text' allowClear></Input>
                                    </Form.Item>
                                </Col>
                            </Row>
                            {/* <Row justify="end">
                                <Col>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Save
                                        </Button>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item>
                                        <Button type="default">
                                            Close
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row> */}
                        </Form>
                    </Modal>
                </ConfigProvider>
            </div>
        </Layout >
    )
}

export default ProductClassification;