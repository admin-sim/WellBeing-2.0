import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder, urlShowBatchDetails, urlEditIndentIssue, urlAddNewIndentIssue } from '../../../endpoints.js';
import Select from 'antd/es/select';
import { ConfigProvider, message, Typography, Checkbox, Tag, Modal, Skeleton, Popconfirm, Spin, Col, Divider, Row, AutoComplete } from 'antd';
import Input from 'antd/es/input';
import Form from 'antd/es/form';
import { DatePicker } from 'antd';
import Layout from 'antd/es/layout/layout';
import { LeftOutlined } from '@ant-design/icons';
//import Typography from 'antd/es/typography';
import { useNavigate } from 'react-router';
import { Table, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLocation } from "react-router-dom";
import dayjs from 'dayjs';
import FormItem from 'antd/es/form/FormItem/index.js';
//import { useParams } from 'react-router-dom';

const UpdateIndentIssue = () => {
    const [DropDown, setDropDown] = useState({
        DocumentType: [],
        StoreDetails: [],
        SupplierList: [],
        UOM: [],
        TaxType: [],
        DateFormat: []
    });

    let [productCount, setProductcount] = useState(0);
    let [batchCount, setBatchCount] = useState(0);

    //const { PoHeaderId, SupplierId, StoreId } = useParams();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const { Title } = Typography;
    const { TextArea } = Input;
    const { Option } = Select;
    const navigate = useNavigate();
    const [selectedProductId, setSelectedProductId] = useState({});
    //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [dataModel, setDataModel] = useState([]);
    const [batchDetails, setBatchDetails] = useState([]);
    const [batchRecord, setBatchRecord] = useState();
    const [productDetails, setProductDetails] = useState({});
    const [selectedUomText, setSelectedUomText] = useState({});
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [istablevisible, setIstablevisible] = useState(false);
    const [batches, setBatches] = useState([]);
    const fields = form1.getFieldsValue();
    const location = useLocation();
    const [shouldValidateModal, setshouldValidateModal] = useState(false);
    const [indentId, setIndentId] = useState(location.state.IndentId);

    useEffect(() => {
        customAxios.get(urlCreatePurchaseOrder).then((response) => {
            const apiData = response.data.data;
            setDropDown(apiData);
        });
        if (indentId > 0) {
            debugger;
            customAxios.get(`${urlEditIndentIssue}?IndentId=${indentId}`).then((response) => {
                const apiData = response.data.data;
                if (apiData.newIndentModel !== null) {
                    setIstablevisible(true);
                    // if (apiData.IndentDetails != null && apiData.IndentDetails.length > 0) {
                    //     {
                    //         apiData.IndentDetails.map((item) => {
                    //             if (item.PendingQty === 0) {

                    //             }
                    //             else{

                    //             }
                    //         })
                    //     }
                    //     if (apiData.newIndentIssueModel != null && apiData.newIndentIssueModel.length > 0) {
                    //         {
                    //             apiData.newIndentIssueModel.map((items) => {
                    //                 if (apiData.newIndentIssueModel.IssueStatus != 'Finalize') {
                    //                     if (items.ProductId == item.ProductId && Model.newPatientIssueModel.IndentId == item.IndentId) {
                    //                         form1.setFieldsValue({ IssueId: items.IssueId === null ? 0 : items.IssueId });
                    //                     }
                    //                 }
                    //             })
                    //         }
                    //     }
                    // }                    
                    // form1.setFieldsValue({ IndentId: indentId });
                    form1.setFieldsValue({ RequestingLocation: apiData.newIndentModel.RequestingStoreId });
                    form1.setFieldsValue({ IssuingStore: apiData.newIndentModel.IssueingStoreId });
                    form1.setFieldsValue({ Remarks: apiData.newIndentModel.Remarks });
                    form1.setFieldsValue({ IndentNumber: apiData.newIndentModel.IndentNumber });
                    form1.setFieldsValue({ IndentType: apiData.newIndentModel.IndentType });
                    form1.setFieldsValue({ IndentId: apiData.newIndentModel.IndentId });
                    form1.setFieldsValue({ IssueId: apiData.newPatientIssueModel.IssueId });
                }
                for (let i = productCount; i < apiData.IndentDetails.length; i++) {
                    AddProduct();
                }
                if (apiData.IndentDetails !== null) {
                    for (let i = productCount; i <= apiData.IndentDetails.length; i++) {
                        if (apiData.IndentDetails[i] !== undefined) {
                            form1.setFieldsValue({ [i]: { product: apiData.IndentDetails[i].ProductName } });
                            form1.setFieldsValue({ [i]: { uom: apiData.IndentDetails[i].UomId } });
                            form1.setFieldsValue({ [i]: { RequestedQty: apiData.IndentDetails[i].RequestQty } });
                            form1.setFieldsValue({ [i]: { IssueQty: apiData.IndentDetails[i].IssueQty === null ? 0 : apiData.IndentDetails[i].IssueQty } });
                            form1.setFieldsValue({ [i]: { AvgqtyatIssue: apiData.IndentDetails[i].AvlIssueQuantity === null ? 0 : apiData.IndentDetails[i].AvlIssueQuantity } });
                            form1.setFieldsValue({ [i]: { AvgqtyatReq: apiData.IndentDetails[i].AvlReqQuantity === null ? 0 : apiData.IndentDetails[i].AvlReqQuantity } });
                            form1.setFieldsValue({ [i]: { productId: apiData.IndentDetails[i].ProductId } });
                            form1.setFieldsValue({ [i]: { pendingQty: apiData.IndentDetails[i].PendingQty } });
                            form1.setFieldsValue({ [i]: { IndentLineId: apiData.IndentDetails[i].IndentLineId } });
                            form1.setFieldsValue({ [i]: { IndentIssueLineId: apiData.newIndentIssueModel[i].IndentIssueLineId } });
                        }
                    }
                }
            });
            setIndentId(0);
        }
    }, []);

    const handleToIndent = () => {
        const url = '/IndentIssue';
        navigate(url);
    }

    const onOkModal = () => {
        debugger;
        form2.submit();
    }

    const onFinishmodal = (values) => {
        debugger;
        for (let i = 0; i < batchCount; i++) {
            const batch = {
                // StockId: 1,
                IssueQty: Number(values[i].quantity),
                ProductId: values[i].productId,
                BatchNo: values[i].batchNumber,
                EXPDate: values[i].EXPDate,
                StockId: values[i].StockId,
                IssueRate: values[i].rate,
                UomId: values[i].uom,
                stockLocator: values[i].stockLocator === undefined ? 0 : values[i].stockLocator
            }
            batches.push(batch);
        }
        setIsModalOpen(false);
    }

    const AddProduct = () => {
        setProductcount(productCount + 1);
        const newData = {
            key: productCount.toString(),
            productId: '',
            product: '',
            uom: '',
            RequestedQty: '',
            IssueQty: '',
            AvgqtyatIssue: '',
            AvgqtyatReq: '',
            remarks: '',
            BatchDetails: '',
            Batch: '',
            pendingQty: ''
        }
        setData([...data, newData]);
    }

    const columns = [
        {
            dataIndex: 'productId',
            key: 'productId',
            width: 0,
            render: (_, record) => (
                <>
                    <Form.Item name={[record.key, 'productId']} hidden>
                        <input></input>
                    </Form.Item>
                    <Form.Item name={[record.key, 'IndentLineId']} hidden>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item name={[record.key, 'IndentIssueLineId']} hidden>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item name={[record.key, 'StockId']} hidden>
                        <Input></Input>
                    </Form.Item>
                </>
            )
        },
        {
            title: 'Product',
            width: 250,
            dataIndex: 'product',
            key: 'product',
            render: (_, record) => (
                <Form.Item name={[record.key, 'product']}>
                    <Input style={{ width: '100%' }} disabled></Input>
                </Form.Item>
            )
        },
        {
            title: 'UOM',
            dataIndex: 'uom',
            key: 'uom',
            render: (text, record) => (
                <Form.Item
                    name={[record.key, 'uom']}
                    style={{ width: '100%' }}
                >
                    <Select disabled>
                        {DropDown.UOM.map((option) => (
                            <Select.Option key={option.UomId} value={option.UomId}>
                                {option.FullName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item >
            )
        },
        {
            title: 'Requested Qty',
            dataIndex: 'RequestedQty',
            key: 'RequestedQty',
            render: (text, record) => (
                <Form.Item name={[record.key, 'RequestedQty']} style={{ width: '100%' }}>
                    <InputNumber min={0} disabled />
                </Form.Item>
            )
        },
        {
            title: 'IssueQty',
            dataIndex: 'IssueQty',
            key: 'IssueQty',
            render: (text, record) => (
                <Form.Item name={[record.key, 'IssueQty']} style={{ width: '100%' }}>
                    <InputNumber min={0} />
                </Form.Item>
            )
        },
        {
            title: 'Avg qty at Issue',
            dataIndex: 'AvgqtyatIssue',
            key: 'AvgqtyatIssue',
            render: (text, record) => (
                <Form.Item name={[record.key, 'AvgqtyatIssue']} style={{ width: '100%' }}>
                    <InputNumber min={0} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Avg qty at Req',
            dataIndex: 'AvgqtyatReq',
            key: 'AvgqtyatReq',
            render: (text, record) => (
                <Form.Item name={[record.key, 'AvgqtyatReq']}>
                    <InputNumber min={0} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            render: (text, record) => (
                <Form.Item name={[record.key, 'remarks']}>
                    <Input style={{ width: '100%' }} allowClear></Input>
                </Form.Item>
            )
        },
        {
            title: 'Batch Details',
            dataIndex: 'BatchDetails',
            key: 'BatchDetails',
            render: (text, record) => (
                <Button type='link' onClick={() => OpenModel(record)}>Batch</Button>
            )
        },
        {
            title: 'Pending Qty',
            dataIndex: 'pendingQty',
            key: 'pendingQty',
            render: (text, record) => (
                <Form.Item name={[record.key, 'pendingQty']}>
                    <Input style={{ width: '100%' }} disabled></Input>
                </Form.Item>
            )
        },
    ]

    const OpenModel = async (record) => {
        debugger;
        setProductDetails(form1.getFieldValue([record.key], 'IssueQty'))
        const batch = {
            IssueQty: form1.getFieldValue([record.key], 'IssueQty').IssueQty,
            ProductId: form1.getFieldValue([record.key], 'productId').productId,
            IssueId: 0,
            StoreId: form1.getFieldValue('IssuingStore')
        }
        const post1 = {
            newIndentModel: batch,
            IndentDetails: [],
            newIndentIssueModel: []
        }
        try {
            const response = await customAxios.post(urlShowBatchDetails, post1, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const ApiData = response.data.data;
            setBatchRecord(ApiData);
            form1.setFieldsValue({ [productCount - 1]: { StockId: ApiData.BatchDetails[productCount - 1].StockId } })
            setBatchDetails(ApiData.BatchDetails);
        } catch (error) {

        }
        setIsModalOpen(true);
    }
    const handleCancel = () => {
        const url = '/IndentIssue';
        navigate(url);
    }

    const BatchAdd = () => {
        setBatchCount(batchCount + 1);
        if (shouldValidateModal) {
            form2
                .validateFields()
                .then(() => {
                    const newRow = {
                        key: batchCount.toString(),
                        batchNumber: '',
                        quantity: '',
                        uom: '',
                        expDate: '',
                        rate: '',
                        amount: '',
                        stockLocator: '',
                    };
                    setDataModel([...dataModel, newRow]);
                    setBatchCount(batchCount + 1);
                })
        } else {
            const newRow = {
                key: batchCount.toString(),
                batchNumber: '',
                quantity: '',
                uom: '',
                expDate: '',
                rate: '',
                amount: '',
                stockLocator: '',
            };
            setDataModel([...dataModel, newRow]);
            setshouldValidateModal(true);
        }
    };

    const Batchmodal = [
        {
            title: 'Batch Number',
            dataIndex: 'batchNumber',
            width: 150,
            key: 'batchNumber',
            render: (_, record) => (
                <>
                    <Form.Item name={[record.key, 'batchNumber']} style={{ width: '150%' }}
                        rules={[
                            {
                                required: true,
                                message: "input!"
                            },
                        ]}
                    >
                        <Select allowClear>
                            {batchDetails.map((option) => (
                                <Select.Option key={option.BatchNo} value={option.BatchNo}>{option.BatchNo}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <FormItem name={[record.key, 'productId']} hidden><Input></Input></FormItem>
                    <FormItem name={[record.key, 'StockId']} hidden><Input></Input></FormItem>
                </>
            )
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            width: 110,
            key: 'quantity',
            render: (text, record) => {
                return (
                    <Form.Item style={{ width: '150%' }} name={[record.key, 'quantity']}
                        rules={[
                            {
                                required: true,
                                message: "input!"
                            }
                        ]}
                    >
                        <Input allowClear />
                    </Form.Item>
                );
            }
        },
        {
            title: 'Avg Quantity',
            dataIndex: 'avgquantity',
            key: 'avgquantity',
            width: 140,
            render: (text, record) => {
                return (
                    <>
                        <Form.Item style={{ width: '130%' }} name={[record.key, 'avgquantity']}>
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name={[record.key, 'StockId']} hidden>
                            <Input />
                        </Form.Item>
                    </>
                );
            }
        },
        {
            title: 'Uom',
            dataIndex: 'uom',
            width: 110,
            key: 'uom',
            render: (text, record) => (
                <Form.Item name={[record.key, 'uom']}>
                    <Select style={{ width: '100%' }} disabled>
                        {DropDown.UOM.map((option) => (
                            <Select.Option key={option.UomId} value={option.UomId}>{option.FullName}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            )
        },
        {
            title: 'EXP Date',
            dataIndex: 'expDate',
            key: 'expDate',
            render: (text, record) => (
                <>
                    <Form.Item name={[record.key, 'expDate']}>
                        <InputNumber min={0} style={{ width: 50 }} disabled />
                    </Form.Item>
                    <Form.Item name={[record.key, 'EXPDate']} hidden>
                        <InputNumber min={0} style={{ width: 50 }} disabled />
                    </Form.Item>
                </>
            )
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            render: (text, record) => (
                <Form.Item name={[record.key, 'rate']}>
                    <Input style={{ width: '100%' }} disabled></Input>
                </Form.Item>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text, record) => (
                <Form.Item name={[record.key, 'amount']}>
                    <Input style={{ width: '100%' }} disabled></Input>
                </Form.Item>
            )
        },
        {
            title: 'Stock Locator',
            dataIndex: 'stockLocator',
            key: 'stockLocator',
            render: (text, record) => (
                <Form.Item name={[record.key, 'stockLocator']}>
                    <Input style={{ width: '100%' }} disabled></Input>
                </Form.Item>
            )
        },
        {
            title: <Button type="primary" icon={<PlusOutlined />} onClick={BatchAdd}></Button>,
            dataIndex: 'add',
            key: 'add',
            width: 50,
            render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}><DeleteOutlined /></Popconfirm>
            //<Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>      
        }
    ]

    const onCancelmodal = () => {
        setDataModel([]);
        form2.resetFields();
        setshouldValidateModal(false);
        setIsModalOpen(false);
        setBatchCount(0);
    }

    const handleDelete = (record) => {
        form2.setFieldsValue({
            [record.key]: {
                batchNumber: '',
                quantity: '',
                uom: '',
                stockLocator: '',
                amount: '',
                rate: '',
                expDate: '',
                product: ''
            }
        });
        const newData = dataModel.filter((item) => item.key !== (record.key === undefined ? record.toString() : record.key));
        Object.keys(fields).forEach(fieldName => {
            if (fieldName.startsWith(`${record.key}.`)) {
                form1.resetFields([fieldName]);
            }
        });
        setDataModel(newData);
        setBatchCount(newData.length);
    };

    const handleOnFinish = async (values) => {
        debugger;
        const products = [];
        for (let i = 0; i <= productCount; i++) {
            if (values[i] !== undefined) {
                const product = {
                    ProductId: values[i].productId === undefined ? selectedProductId[i] : values[i].productId,
                    UomId: values[i].uom,
                    RequestQty: values[i].RequestedQty,
                    IssueQty: values[i].IssueQty,
                    PendingQty: values[i].pendingQty,
                    IndentLineId: values[i].IndentLineId,
                    // IssuingStoreStock: values[i].IssuingStoreStock === "" ? null : values[i].IssuingStoreStock,
                    // QuantityTobeIssued: values[i].discount === "" ? 0 : values[i].RequestingStoreStock,
                    IndentIssueLineId: values[i].IndentIssueLineId === undefined ? 0 : values[i].IndentIssueLineId,
                    StockId: values[i].StockId
                }
                products.push(product);
            }
        }
        if (batches.length > 0) {
            const Indent = {
                IssueDate: values.IssuingDate,
                IndentId: values.IndentId === undefined ? 0 : values.IndentId,
                IssueId: values.IssueId === undefined ? 0 : values.IssueId,
                Remarks: values.Remarks === undefined ? null : values.Remarks,
                RequestingStoreId: values.RequestingLocation,
                IssueingStoreId: values.IssuingStore,
                IssueStatus: values.IssueStatus === undefined ? 'Created' : values.IssueStatus,
                IndentCategory: "Indent Issue",
            }
            const postData = {
                newIndentModel: Indent,
                IndentDetails: products,
                BatchDetails: batches,
                Batch: []
            }
            try {
                if (values.IndentId > 0) {
                    const response = await customAxios.post(urlAddNewIndentIssue, postData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    handleCancel();
                }
                // else {
                //     const response = await customAxios.post(urlAddNewIndent, postData, {
                //         headers: {
                //             'Content-Type': 'application/json'
                //         }
                //     });
                //     handleCancel();
                // }
                // form1.resetFields();
            } catch (error) {
                // Handle error      
            }
            // setIsSearchLoading(false);
        } else {
            message.warning('Please add Batch Details');
        }
    };

    function formatDateString(dateString) {
        debugger;
        if (dateString !== '' && dateString !== undefined) {
            const date = new Date(dateString);

            const options = { month: 'long', year: 'numeric' };

            const formatter = new Intl.DateTimeFormat('en-US', options);

            return formatter.format(date);
        }
        return '';
    }

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Indent Issue
                        </Title>
                    </Col>
                    <Col offset={6} span={2}>
                        <Button icon={<LeftOutlined />} style={{ marginBottom: 0 }} onClick={handleToIndent}>
                            Back
                        </Button>
                    </Col>
                </Row>
                <Form
                    layout="vertical"
                    onFinish={handleOnFinish}
                    variant="outlined"
                    size="default"
                    style={{
                        maxWidth: 1500
                    }}
                    name="trigger"
                    form={form1}
                    initialValues={{
                        IssuingDate: dayjs(),
                    }}
                    onValuesChange={(changedValues, allValues) => {
                        // debugger;
                        // if (allValues[productCount - 1].RequestingStore !== undefined && allValues[productCount - 1].ReceivingStore !== undefined) {
                        //     if (allValues.RequestingStore !== allValues.ReceivingStore) {
                        //         setIstablevisible(true);
                        //     } else {
                        //         form1.resetFields();
                        //         setIstablevisible(false);
                        //         message.warning('Please select Different Stores');
                        //     }
                        // } else {
                        //     setData([]);
                        //     setIstablevisible(false);
                        // }
                    }}
                >
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Indent Number" name="IndentNumber">
                                <Input style={{ width: '100%' }} disabled></Input>
                            </Form.Item>
                            <Form.Item name="IndentId" hidden>
                                <Input></Input>
                            </Form.Item>
                            <Form.Item name="IssueId" hidden>
                                <Input></Input>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Indent Type" name="IndentType">
                                <Input style={{ width: '100%' }} disabled></Input>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Issuing Store" name="IssuingStore">
                                <Select disabled>
                                    {DropDown.StoreDetails.map((option) => (
                                        <Select.Option key={option.StoreId} value={option.StoreId}>{option.LongName}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Requesting Location" name="RequestingLocation">
                                <Select disabled>
                                    {DropDown.StoreDetails.map((option) => (
                                        <Select.Option key={option.StoreId} value={option.StoreId}>{option.LongName}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Issuing Date" name="IssuingDate">
                                <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" disabled />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Issue Owner" name="IssueOwner"
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Please input!'
                            //     }
                            // ]}
                            >
                                <Input style={{ width: '100%' }} allowClear ></Input>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Issue Status" name="IssueStatus">
                                <Select allowClear placeholder='Select Value'>
                                    <Option value="Draft">Draft</Option>
                                    <Option value="Finalize">Finalize</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6} >
                            <Form.Item name="SubmitCheck" style={{ paddingTop: 30 }} valuePropName="checked">
                                <Checkbox>Submit</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={12} >
                            <Form.Item label='Remarks' name="remarks">
                                <TextArea></TextArea>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end" style={{ padding: '0rem 1rem' }}>
                        <Col style={{ marginRight: '10px' }}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Save
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item>
                                <Button type="primary" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider style={{ marginTop: '0' }}></Divider>
                    {istablevisible ? (
                        <div>
                            <Table columns={columns} dataSource={data} scroll={{ x: 0 }} />
                        </div>
                    ) : null}
                </Form>
                <ConfigProvider
                    theme={{
                        token: {
                            zIndexPopupBase: 3000
                        }
                    }}>
                    <Modal
                        title="Doctor Note"
                        onOk={onOkModal}
                        onCancel={onCancelmodal}
                        width={1500}
                        open={isModalOpen}
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
                            initialValues={{
                                remember: true,
                            }}
                            // layout='vertical'
                            onFinish={onFinishmodal}
                            // onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            form={form2}
                            onValuesChange={(changedValues, allValues) => {
                                debugger;
                                if (allValues[batchCount - 1].batchNumber !== undefined) {
                                    const temp = form1.getFieldValue([productCount - 1], 'AvgqtyatIssue');
                                    form2.setFieldsValue({ [batchCount - 1]: { avgquantity: temp.AvgqtyatIssue } });
                                    form2.setFieldsValue({ [batchCount - 1]: { uom: temp.uom } });
                                    // form2.setFieldsValue({ [batchCount - 1]: { uom: temp.uom } });
                                    const isoDateString = batchRecord.BatchDetails[batchCount - 1].EXPDate;

                                    const dateValue = new Date(isoDateString);

                                    const formattedDate = dayjs(dateValue).format('DD-MM-YYYY');

                                    const dateForDatePicker = dayjs(formattedDate, 'DD-MM-YYYY');
                                    form2.setFieldsValue({ [batchCount - 1]: { rate: batchRecord.BatchDetails[batchCount - 1].MRP } });
                                    form2.setFieldsValue({ [batchCount - 1]: { expDate: formatDateString(batchRecord.BatchDetails[batchCount - 1].EXPDate) } });
                                    form2.setFieldsValue({ [batchCount - 1]: { EXPDate: dateForDatePicker } });
                                    form2.setFieldsValue({ [batchCount - 1]: { StockId: temp.StockId } });
                                    form2.setFieldsValue({ [batchCount - 1]: { productId: temp.productId } });
                                    if (allValues[batchCount - 1].quantity !== undefined && allValues[batchCount - 1].rate !== undefined) {
                                        form2.setFieldsValue({ [batchCount - 1]: { amount: allValues[batchCount - 1].quantity * allValues[batchCount - 1].rate } });
                                    } else {
                                        form2.setFieldsValue({ [batchCount - 1]: { amount: 0 } });
                                    }
                                    const demo = Number(allValues[batchCount - 1].quantity)
                                    if (temp.IssueQty < demo) {
                                        form2.setFieldsValue({ [batchCount - 1]: { quantity: '' } });
                                        message.warning('Quantity must not be greater than Issue Quantity')
                                    }
                                }
                            }}
                        >
                            <Tag>Product: {productDetails.product}</Tag>
                            <Tag>Issued Quantity: {productDetails.IssueQty}</Tag>
                            <Table columns={Batchmodal} dataSource={dataModel} scroll={{ x: 0 }} />
                        </Form>
                    </Modal>
                </ConfigProvider>
            </div>
        </Layout >
    );
}

export default UpdateIndentIssue;
