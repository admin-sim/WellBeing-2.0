import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder, urlSearchUHID, urlGetLastEncounter, urlAutocompleteProduct, urlUpdateIndent, urlEditIndent, urlGetProductDetailsById, urlAddNewIndent } from '../../../endpoints.js';
import Select from 'antd/es/select';
import { ConfigProvider, Tooltip, Typography, Checkbox, Tag, Modal, Skeleton, Popconfirm, Spin, Col, Divider, Row, AutoComplete } from 'antd';
import Input from 'antd/es/input';
import Form from 'antd/es/form';
import { DatePicker } from 'antd';
import Layout from 'antd/es/layout/layout';
import { LeftOutlined } from '@ant-design/icons';
//import Typography from 'antd/es/typography';
import { useNavigate } from 'react-router';
import { Table, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useLocation } from "react-router-dom";
//import { useParams } from 'react-router-dom';

const CreatePatientIndent = () => {
    const [DropDown, setDropDown] = useState({
        DocumentType: [],
        StoreDetails: [],
        SupplierList: [],
        UOM: [],
        TaxType: [],
        DateFormat: []
    });

    let [counter, setCounter] = useState(0);
    let [productCount, setProductcount] = useState(0);

    const [encounter, setEncounter] = useState([]);
    //const { PoHeaderId, SupplierId, StoreId } = useParams();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const { Title } = Typography;
    const { TextArea } = Input;
    const { Option } = Select;
    const navigate = useNavigate();
    const currentDate = new Date();
    //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [dataModal, setDataModal] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedStore, setSelectedStore] = useState({});
    const [shouldValidateModal, setshouldValidateModal] = useState(false);
    const [isPoSearchTable, setIsPoSearchTable] = useState(false);
    const [mrp, setMrp] = useState();
    const [poloading, setPoloading] = useState(false);
    const [productLineId, setProductLineId] = useState(0);
    const [selecetdUomText, setSelecetdUomText] = useState({});
    const [selecetdProductId, setSelecetdProductId] = useState({});
    const [batches, setBatches] = useState([]);
    const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
    const [autoCompleteProduct, setAutoCompleteProduct] = useState([]);
    const fields = form1.getFieldsValue();
    const [buttonTitle, setButtonTitle] = useState('Save');
    const location = useLocation();
    const [indentId, setIndentId] = useState(location.state.IndentId);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [uhId, setUhId] = useState();

    useEffect(() => {
        customAxios.get(urlCreatePurchaseOrder).then((response) => {
            const apiData = response.data.data;
            setDropDown(apiData);
        });
        if (indentId > 0) {
            debugger;
            setButtonTitle('Update');
            customAxios.get(`${urlEditIndent}?IndentId=${indentId}`).then((response) => {
                const apiData = response.data.data;
                if (apiData.newIndentModel !== null) {
                    const option = {
                        PatientId: apiData.newIndentModel.PatientId, value: apiData.newIndentModel.UhId,
                        PatientName: apiData.newIndentModel.PatientName
                    }
                    handleSelect(0, option);
                    setIsTableVisible(true);
                    const isoDateString = apiData.newIndentModel.IndentDate;

                    const dateValue = new Date(isoDateString);

                    const formattedDate = dayjs(dateValue).format('DD-MM-YYYY');

                    const dateForDatePicker = dayjs(formattedDate, 'DD-MM-YYYY');
                    // form1.setFieldsValue({ IndentId: indentId });
                    form1.setFieldsValue({ IndentDate: dateForDatePicker });
                    // form1.setFieldsValue({ RequestingStore: apiData.newIndentModel.RequestingStoreId });
                    form1.setFieldsValue({ IssuingStore: apiData.newIndentModel.IssueingStoreId });
                    // form1.setFields([
                    //     {
                    //         name: 'IssuingStore',
                    //         value: apiData.newIndentModel.IssueingStoreId,                            
                    //         disabled: true,
                    //     },
                    // ]);
                    form1.setFieldsValue({ Remarks: apiData.newIndentModel.Remarks });
                    form1.setFieldsValue({ IndentTemplate: apiData.newIndentModel.IndentTemplateId === 0 ? '' : apiData.newIndentModel.IndentTemplateId });
                    form1.setFieldsValue({ IndentType: apiData.newIndentModel.IndentType });
                    form1.setFieldsValue({ IndentId: apiData.newIndentModel.IndentId });
                    // form1.setFieldsValue({ PatientId: apiData.newIndentModel.PatientId });
                    form1.setFieldsValue({ Encounter: apiData.newIndentModel.EncounterId });
                    // const newOptions = ({ value: apiData.newIndentModel.UhId, key: apiData.newIndentModel.UhId, PatientId: apiData.newIndentModel.PatientId, PatientName: apiData.newIndentModel.PatientName });
                    // setAutoCompleteOptions(newOptions);
                    setUhId(apiData.newIndentModel.UhId);
                    // form1.setFieldsValue({ UHID: uhId });
                    // form1.setFieldsValue({ Name: apiData.newIndentModel.PatientName });
                }
                // <Select disabled>
                //     {DropDown.UOM.map((option) => (
                //         <Select.Option key={option.UomId} value={option.UomId}>
                //             {option.FullName}
                //         </Select.Option>
                //     ))}
                // </Select>
                for (let i = counter; i < apiData.IndentDetails.length; i++) {
                    AddProduct();
                }
                if (response.data.data.IndentDetails !== null) {
                    for (let i = counter; i <= response.data.data.IndentDetails.length; i++) {
                        form1.setFieldsValue({ [i]: { product: apiData.IndentDetails[i].ProductName } });
                        form1.setFieldsValue({ [i]: { uom: apiData.IndentDetails[i].UomId } });
                        form1.setFieldsValue({ [i]: { RequestingQty: apiData.IndentDetails[i].RequestQty } });
                        form1.setFieldsValue({ [i]: { RequestingStoreStock: apiData.IndentDetails[i].AvlReqQuantity } });
                        form1.setFieldsValue({ [i]: { RequestingStoreStock: apiData.IndentDetails[i].AvlReqQuantity } });
                        form1.setFieldsValue({ [i]: { IssuingStoreStock: apiData.IndentDetails[i].AvlIssueQuantity === null ? 0 : apiData.IndentDetails[i].AvlIssueQuantity } });
                        form1.setFieldsValue({ [i]: { fav: apiData.IndentDetails[i].Favourite === "N" ? false : true } });
                        form1.setFieldsValue({ [i]: { productId: apiData.IndentDetails[i].ProductId } });
                        form1.setFieldsValue({ [i]: { uomId: response.data.data.IndentDetails[i].UomId } });
                        form1.setFieldsValue({ [i]: { IndentLineId: apiData.IndentDetails[i].IndentLineId } });
                    }
                }
            });
            setIndentId(0);
        }
    }, []);

    const onOkModal = () => {
        debugger;
        form2
            .validateFields()
            .then(() => {
                setIsModalOpen(false);
            })
            .catch((error) => {
                console.log('Validation error:', error);
            });
    }

    const onFinishmodal = (values) => {
        debugger;
        setPoloading(true);
        setIsPoSearchTable(true);
        const postData = {
            Supplier: values.Supplier,
            ReceivingStore: values.ReceivingStore,
            POStatus: values.POStatus,
            FromDate: values.PODateFrom === undefined || values.PODateFrom === null ? '' : (values.PODateFrom.$D.toString().padStart(2, '0') + '-' + (values.PODateFrom.$M + 1).toString().padStart(2, '0') + '-' + values.PODateFrom.$y).toString(),
            ToDate: values.PODateTo === undefined || values.PODateTo === null ? '' : (values.PODateTo.$D.toString().padStart(2, '0') + '-' + (values.PODateTo.$M + 1).toString().padStart(2, '0') + '-' + values.PODateTo.$y).toString(), // A sample value
        }
        // try {
        //   customAxios.get(`${urlSearchPendingPO}?Supplier=${postData.Supplier}&ReceivingStore=${postData.ReceivingStore}&POStatus=${postData.POStatus}&PODateFrom=${postData.FromDate}&PODateTo=${postData.ToDate}`).then((response) => {
        //     debugger;
        //     const apiData = response.data.data;
        //     setDataModal(apiData.PurchaseOrderDetails);
        //     setPoloading(false);
        //   });
        // } catch (error) {
        //   // Handle the error as needed
        // }
    }

    const AddProduct = () => {
        const newData = {
            key: productCount.toString(),
            productId: '',
            product: '',
            uomId: '',
            uom: '',
            RequestingQty: '',
            IssuingStoreStock: '',
            fav: ''
        }
        setData([...data, newData]);
        setProductcount(counter + 1);
    }

    const getPanelValue1 = (value, key) => {
        if (value === "") {
            form1.setFieldsValue({ [key]: { uom: '' } });
            form1.setFieldsValue({ [key]: { RequestingQty: '' } });
            form1.setFieldsValue({ [key]: { fav: false } });
            form1.setFieldsValue({ [key]: { IssuingStoreStock: '' } });
        }
        try {
            customAxios.get(`${urlAutocompleteProduct}?Product=${value}`).then((response) => {
                const apiData = response.data.data;
                debugger
                const newOptions = apiData.map(item => ({ value: item.LongName, key: item.ProductDefinitionId, UomId: item.UOMPrimaryUOM }));
                setAutoCompleteProduct(newOptions);
            });
        } catch (error) {
            // Handle the error as needed
        }
    }

    const handleSelect1 = (value, option, key) => {
        debugger;
        form1.setFieldsValue({ [key]: { uom: option.UomId } });
        form1.setFieldsValue({ [key]: { productId: option.key } });
        customAxios.get(`${urlGetProductDetailsById}?ProductId=${option.key}`).then((response) => {
            const apiData = response.data.data;
            debugger;
            let reqstr = form1.getFieldValue('IssuingStore');
            let qty = 0;
            apiData.Stock.forEach(value => {
                if (value.StoreId === reqstr) {
                    qty += value.Quantity;
                }
            })
            form1.setFieldsValue({ [key]: { IssuingStoreStock: qty } });
        });
    }
    const columns = [
        {
            // title: 'productId',
            dataIndex: 'productId',
            key: 'productId',
            width: 0,
            render: (_, record) => (
                <Form.Item name={[record.key, 'productId']} hidden>
                    <Input></Input>
                </Form.Item>
            )
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (_, record) => (
                <Form.Item name={[record.key, 'product']} style={{ width: 250 }}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!'
                        }
                    ]}
                >
                    <AutoComplete style={{ width: '100%' }}
                        options={autoCompleteProduct}
                        onSearch={(value) => getPanelValue1(value, record.key)}
                        onSelect={(value, option) => handleSelect1(value, option, record.key)}
                        placeholder="Search for a product"
                        allowClear
                    />
                </Form.Item>
            )
        },
        {
            // title: 'UOM',
            dataIndex: 'uomId',
            key: 'uomId',
            width: 0,
            render: (text, record) => (
                <Form.Item name={[record.key, 'uomId']} hidden>
                    <Input></Input>
                </Form.Item >
            )
        },
        {
            title: 'UOM',
            dataIndex: 'uom',
            key: 'uom',
            render: (text, record) => (
                <Form.Item name={[record.key, 'uom']} style={{ width: 100 }}>
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
            title: 'Requesting Qty',
            dataIndex: 'RequestingQty',
            key: 'RequestingQty',
            render: (text, record) => (
                <Form.Item
                    name={[record.key, 'RequestingQty']}
                    style={{ width: 100 }}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!'
                        }
                    ]}
                >
                    <InputNumber min={1} />
                </Form.Item>
            )
        },
        {
            title: 'Issuing Store Stock',
            dataIndex: 'IssuingStoreStock',
            key: 'IssuingStoreStock',
            render: (text, record) => (
                <Form.Item name={[record.key, 'IssuingStoreStock']}>
                    <Input disabled />
                </Form.Item>
            )
        },
        {
            title: 'Fav',
            dataIndex: 'fav',
            key: 'fav',
            render: (text, record) => (
                <Form.Item name={[record.key, 'fav']}>
                    <Checkbox valuePropName="checked"></Checkbox>
                </Form.Item>
            )
        },
        {
            title: <Button type="primary" icon={<PlusOutlined />} onClick={AddProduct}></Button>,
            dataIndex: 'add',
            key: 'add',
            width: 50,
            render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}><DeleteOutlined /></Popconfirm>
        }
    ]

    const handleDelete = (record) => {
        debugger;
        const newData = data.filter((item) => item.key !== (record.key === undefined ? record.toString() : record.key));
        Object.keys(fields).forEach(fieldName => {
            if (fieldName.startsWith(`${record.key}.`)) {
                form1.resetFields([fieldName]);
            }
        });
        setData(newData);
        setCounter(newData.length);
        // if (tableRef.current) {
        //   tableRef.current.scrollLeft = 0;
        // }      
    };

    const Modelcolumns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date.localeCompare(b.date),
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            sorter: (a, b) => a.time.localeCompare(b.time),
        },
        {
            title: 'View',
            dataIndex: 'view',
            key: 'view',
            sorter: (a, b) => a.view.localeCompare(b.view),
        }
    ];

    const onCancelmodal = () => {
        debugger;
        setIsModalOpen(false);
        // setDataModal([]);
    }

    const handleCancel = () => {
        const url = '/PatientIndent';
        navigate(url);
    }
    const ShowModel = () => {
        debugger;
        const uhid = form1.getFieldValue('UHID');
        form1
            .validateFields(['UHID'])
            .then(() => {
                setIsModalOpen(true);
            })
            .catch((error) => {
                console.log('Validation error:', error);
            });
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleOnFinish = async (values) => {
        debugger;
        const products = [];
        for (let i = 0; i <= productCount; i++) {
            if (values[i] !== undefined) {
                const product = {
                    ProductId: values[i].productId,
                    UomId: values[i].uom,
                    IssuingStoreStock: values[i].IssuingStoreStock,
                    RequestQty: values[i].RequestingQty === "" ? 0 : values[i].RequestingQty,
                    Favourite: values[i].fav === undefined || values[i].fav === false ? 'N' : 'Y',
                }
                products.push(product);
            }
        }
        if (products.length > 0) {
            const Indent = {
                IndentId: values.IndentId === undefined ? 0 : values.IndentId,
                IndentDate: values.IndentDate === undefined ? '' : values.IndentDate,
                IndentStatus: values.IndentStatus === undefined ? 'Created' : values.IndentStatus,
                IndentTemplateId: values.IndentTemplate === undefined || values.IndentTemplate === "" ? 0 : values.IndentTemplate,
                IndentType: values.IndentType === undefined ? null : values.IndentType,
                IssueingStoreId: values.IssuingStore,
                Name: values.Name === undefined ? null : values.Name,
                Remarks: values.Remarks === undefined ? null : values.Remarks,
                UHID: values.UHID === undefined ? 0 : values.UHID,
                SubmitCheck: values.SubmitCheck === undefined ? null : values.SubmitCheck,
                PatientId: values.PatientId === undefined ? 0 : values.PatientId,
                EncounterId: values.Encounter === undefined ? null : values.Encounter,
                IndentCategory: 'PatientIndent'
            }
            const postData = {
                newIndentModel: Indent,
                IndentDetails: products,
            }
            if (values.IndentId > 0) {
                const response = await customAxios.post(urlUpdateIndent, postData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                handleCancel();
            } else {
                const response = await customAxios.post(urlAddNewIndent, postData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                handleCancel();
            }
        } else {
            message.warning('Please add Product Details');
        }
    };

    const GetUHID = (value) => {
        if (value !== "") {
            customAxios.get(`${urlSearchUHID}?Uhid=${value}`).then((response) => {
                const apiData = response.data.data;
                debugger;
                const newOptions = apiData.map(item => ({ value: item.UhId, key: item.UhId, PatientId: item.PatientId, PatientName: item.PatientFirstName + '' + item.PatientLastName }));
                setAutoCompleteOptions(newOptions);
            });
        } else {
            setEncounter([]);
            form1.setFieldsValue({ Encounter: '' });
            form1.setFieldsValue({ Name: '' });
        }
    }

    const handleSelect = (value, option) => {
        debugger;
        form1.setFieldsValue({ Name: option.PatientName });
        form1.setFieldsValue({ UHID: option.value });
        customAxios.get(`${urlGetLastEncounter}?Uhid=${option.key}`).then((response) => {
            const apiData = response.data.data;
            if (apiData.length > 0) {
                setEncounter(apiData);
                form1.setFieldsValue({ Encounter: apiData[0].EncounterId });
                form1.setFieldsValue({ PatientId: option.PatientId });
            } else {
                setEncounter([]);
                form1.setFieldsValue({ Encounter: '' });
                form1.setFieldsValue({ PatientId: '' });
            }
        });
    }

    useEffect(() => {

    }, [encounter]);

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Create Patient Indent
                        </Title>
                    </Col>
                    <Col offset={6} span={2}>
                        <Button icon={<LeftOutlined />} style={{ marginBottom: 0 }} onClick={handleCancel}>
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
                        IndentDate: dayjs(),
                        UHID: ''
                    }}
                    onValuesChange={(changedValues, allValues) => {
                        debugger;
                        if (allValues.IssuingStore !== undefined) {
                            setIsTableVisible(true);
                        } else {
                            setData([]);
                            setIsTableVisible(false);
                        }
                    }}
                >
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Indent Date" name="IndentDate"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="DD-MM-YYYY"
                                />
                            </Form.Item>
                            <Form.Item name="IndentId" hidden>
                                <Input></Input>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Issuing Store" name="IssuingStore"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <Select allowClear placeholder='Select Value'>
                                    {DropDown.StoreDetails.map((option) => (
                                        <Select.Option key={option.StoreId} value={option.StoreId}>
                                            {option.LongName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Indent Type" name="IndentType"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <Select placeholder='Select Value' allowClear>
                                    <Select.Option key='Effective' value='Effective'></Select.Option>
                                    <Select.Option key='Consumption Based' value='Consumption Based'></Select.Option>
                                    <Select.Option key='Urgent' value='Urgent'></Select.Option>
                                    <Select.Option key='Reorder level Based' value='Reorder level Based'></Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div>
                                <Form.Item label="Remarks" name="Remarks">
                                    <TextArea autoSize allowClear />
                                </Form.Item>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Indent Template" name="IndentTemplate">
                                <Select allowClear placeholder='Select Value'>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Indent Status" name="IndentStatus">
                                <Select allowClear placeholder='Select Value'>
                                    <Option value="Draft">Draft</Option>
                                    <Option value="Finalize">Finalize</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={7} >
                            <Form.Item name="SubmitCheck" style={{ paddingTop: 30 }}>
                                <Checkbox>Submit</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="UHID" name="UHID"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <AutoComplete style={{ width: '100%' }}
                                    options={autoCompleteOptions}
                                    onSearch={(value) => GetUHID(value)}
                                    onSelect={(value, option) => handleSelect(value, option)}
                                    value={uhId}
                                    allowClear
                                />
                                <Button type="link" onClick={ShowModel}>Dr Note</Button>
                            </Form.Item>
                            <Form.Item name="PatientId" hidden>
                                <Input></Input>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Name" name="Name">
                                <Input style={{ width: '100%' }} disabled></Input>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Encounter" name="Encounter">
                                <Select disabled={encounter.length > 1 ? false : true}>
                                    {encounter.map((option) => (
                                        <Select.Option key={option.EncounterId} value={option.EncounterId}>{option.GeneratedEncounterId}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end" style={{ padding: '0rem 1rem' }}>
                        <Col style={{ marginRight: '10px' }}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    {buttonTitle}
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
                    {isTableVisible ? (
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
                        width={500}
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
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            form={form2}
                        >
                            <Table columns={Modelcolumns} dataSource={dataModal} scroll={{ x: 0 }} />
                        </Form>
                    </Modal>
                </ConfigProvider>
            </div>
        </Layout >
    );
}

export default CreatePatientIndent;
