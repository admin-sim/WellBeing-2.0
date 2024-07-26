import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder, urlSearchUHID, urlGetLastEncounter, urlAutocompleteProduct, urlUpdatePatientIndent, urlEditPatientIndent, urlGetProductDetailsById, urlAddNewPatientIndent } from '../../../endpoints.js';
import Select from 'antd/es/select';
import { ConfigProvider, Card, Typography, Checkbox, Tooltip, Modal, Skeleton, Popconfirm, Spin, Col, Divider, Row, AutoComplete } from 'antd';
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

    let [counter, setCounter] = useState(1);
    const location = useLocation();
    const navigate = useNavigate();
    const indentId = location.state.IndentId;

    const initialDataSource =
        indentId === 0
            ? [
                {
                    key: 0,
                    ProductName: '',
                    ProductId: '',
                    UomId: '',
                    RequestQty: '',
                    RequestingStoreStock: '',
                    IssuingStoreStock: '',
                    Favourite: false,
                    ActiveFlag: true,
                },
            ]
            : [];

    const [encounter, setEncounter] = useState([]);
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const { Title } = Typography;
    const { TextArea } = Input;
    const { Option } = Select;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState(initialDataSource);
    const [dataModal, setDataModal] = useState([]);
    const [poloading, setPoloading] = useState(false);
    const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
    const [autoCompleteProduct, setAutoCompleteProduct] = useState([]);
    const fields = form1.getFieldsValue();
    const [buttonTitle, setButtonTitle] = useState('Save');
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [uhId, setUhId] = useState();
    const [indentStatus, setIndentStatus] = useState(false);
    const [isProductAvailable, setIsProductAvailable] = useState(false)

    useEffect(() => {
        customAxios.get(urlCreatePurchaseOrder).then((response) => {
            const apiData = response.data.data;
            setDropDown(apiData);
        });
        if (indentId > 0) {
            setButtonTitle('Update');
            customAxios.get(`${urlEditPatientIndent}?IndentId=${indentId}`).then((response) => {
                const apiData = response.data.data;
                const products = apiData.IndentDetails.map((item, index) => ({
                    ...item,
                    key: index,
                    IssuingStoreStock: apiData.IndentDetails[index].AvlIssueQuantity,
                    RequestingStoreStock: apiData.IndentDetails[index].AvlReqQuantity,
                    Favourite: apiData.IndentDetails[index].Favourite == 'N' ? false : true,
                    index: index + 1
                }))
                setData(products);
                setCounter(products.length)
                setIsTableVisible(true)
                const formdata = apiData.newIndentModel
                form1.setFieldsValue({
                    IssuingStore: formdata.IssueingStoreId,
                    IndentType: formdata.IndentType,
                    Remarks: formdata.Remarks,
                    IndentTemplate: formdata.IndentTemplateId == 0 ? undefined : formdata.IndentTemplateId,
                    IndentStatus: formdata.IndentStatus == 'Created' ? undefined : formdata.IndentStatus,
                    UHID: formdata.UhId,
                    Name: formdata.PatientName,
                    Encounter: formdata.Encounter,
                    EncounterId: formdata.EncounterId,
                    PatientId: formdata.PatientId,
                    IndentId: formdata.IndentId
                })
            });
        }
    }, []);

    const onOkModal = () => {
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

    const AddProduct = async () => {
        setAutoCompleteProduct([])
        const fieldsToValidate = data.map(record => [record.key, 'ProductName']);
        await form2.validateFields(fieldsToValidate);
        setData([
            ...data,
            {
                key: counter,
                ProductName: '',
                ProductId: '',
                UomId: '',
                RequestQty: '',
                RequestingStoreStock: '',
                IssuingStoreStock: '',
                Favourite: false,
                ActiveFlag: true,
            },
        ]);
        setCounter(counter + 1);
        setIsProductAvailable(false)
    }

    const getPanelValue1 = (value, key) => {
        if (value === "") {
            form2.setFieldsValue({ [key]: { uom: '' } });
            form2.setFieldsValue({ [key]: { RequestQty: '' } });
            form2.setFieldsValue({ [key]: { Favourite: false } });
            form2.setFieldsValue({ [key]: { IssuingStoreStock: '' } });
        }
        try {
            customAxios.get(`${urlAutocompleteProduct}?Product=${value}`).then((response) => {
                const apiData = response.data.data;
                const filteredApiData = apiData.filter(apiItem =>
                    !data.some(option => option.ProductId === apiItem.ProductId && option.ActiveFlag)
                );
                const newOptions = filteredApiData.map(item => ({ value: item.LongName, key: item.ProductId, UomId: item.UOMPrimaryUOM }));
                setAutoCompleteProduct(newOptions);
            });
        } catch (error) {
            // Handle the error as needed
        }
    }

    const handleSelect1 = (value, option, key) => {
        form2.setFieldsValue({ [key]: { UomId: option.UomId } });
        form2.setFieldsValue({ [key]: { ProductId: option.key } });
        customAxios.get(`${urlGetProductDetailsById}?ProductId=${option.key}`).then((response) => {
            const apiData = response.data.data;
            let reqstr = form1.getFieldValue('IssuingStore');
            let qty = 0;
            apiData.Stock.forEach(value => {
                if (value.StoreId === reqstr) {
                    qty += value.Quantity;
                }
            })
            const newData = data.map((item) => {
                if (item.key === key) {
                    const updatedItem = {
                        ...item,
                        // [column]: option.key,
                        // LongName: option.value,
                        UomId: option.UomId,
                        ProductId: option.key,
                        // PoRate: apiData.PORate !== null ? apiData.PORate.PoRate : 0,
                    };
                    return updatedItem;
                }
                return item;
            });
            setData(newData);
            form2.setFieldsValue({ [key]: { IssuingStoreStock: qty } });
        });
    }

    const columns = [
        {
            title: 'Product',
            dataIndex: 'ProductName',
            key: 'ProductName',
            width: 450,
            render: (_, record) => (
                <>
                    <Form.Item name={[record.key, 'ProductName']} style={{ width: '100%' }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input!'
                            }
                        ]}
                        initialValue={record.ProductName}
                    >
                        <AutoComplete style={{ width: '100%' }} disabled={!!indentId && record.IndentLineId}
                            options={autoCompleteProduct}
                            onSearch={(value) => getPanelValue1(value, record.key)}
                            onSelect={(value, option) => handleSelect1(value, option, record.key)}
                            placeholder="Search for a product"
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item name={[record.key, 'ProductId']} hidden initialValue={record.ProductId}>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item name={[record.key, 'IndentLineId']} hidden initialValue={record.IndentLineId}>
                        <Input></Input>
                    </Form.Item>
                </>
            )
        },
        {
            title: 'UOM',
            dataIndex: 'UomId',
            key: 'UomId',
            width: 150,
            render: (text, record) => (
                <Form.Item name={[record.key, 'UomId']} style={{ width: '100%' }} initialValue={record.UomId}>
                    <Select disabled defaultValue={record.UomId}>
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
            dataIndex: 'RequestQty',
            key: 'RequestQty',
            render: (text, record) => (
                <Form.Item style={{ width: '100%' }} initialValue={record.RequestQty}
                    name={[record.key, 'RequestQty']}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!'
                        }
                    ]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
            )
        },
        (indentId > 0 ?
            {
                title: 'RequestingStoreStock',
                dataIndex: 'RequestingStoreStock',
                key: 'RequestingStoreStock',
                render: (text, record) => (
                    <Form.Item name={[record.key, 'RequestingStoreStock']} initialValue={record.RequestingStoreStock}>
                        <Input disabled />
                    </Form.Item>
                )
            }
            : {}),
        {
            title: 'Issuing Store Stock',
            dataIndex: 'IssuingStoreStock',
            key: 'IssuingStoreStock',
            render: (text, record) => (
                <Form.Item name={[record.key, 'IssuingStoreStock']} initialValue={record.IssuingStoreStock}>
                    <Input disabled />
                </Form.Item>
            )
        },
        {
            title: 'Fav',
            dataIndex: 'Favourite',
            key: 'Favourite',
            render: (text, record) => (
                <>
                    <Form.Item name={[record.key, 'Favourite']} initialValue={record.Favourite} valuePropName="checked">
                        <Checkbox onChange={() => FavouriteChanged(record)}></Checkbox>
                    </Form.Item>
                </>
            )
        },
        {
            title: (<Tooltip title="Please Add Product!" open={isProductAvailable}>
                <Button type="primary" icon={<PlusOutlined />} onClick={AddProduct}></Button>
            </Tooltip>),
            // title: <Button type="primary" icon={<PlusOutlined />} onClick={AddProduct}></Button>,
            dataIndex: 'add',
            key: 'add',
            width: 50,
            render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}><DeleteOutlined /></Popconfirm>
        }
    ]

    const handleDelete = (record) => {
        const newData = data.map((item) => {
            if (item.key === record.key) {
                return { ...item, ActiveFlag: false };
            }
            return item;
        });
        setData(newData);
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
        await form2.validateFields()
        const products = [];
        if (data.length == 0) {
            setIsProductAvailable(true)
            return false;
        }
        else {
            const temp = data.filter(item => item.ActiveFlag == true)
            if (temp.length == 0) {
                setIsProductAvailable(true)
                return false;
            }
        }
        const formData = form2.getFieldsValue();

        const mergedData = data.map(item => {
            const matchingFormItem = formData[item.key];
            if (matchingFormItem) {
                return { ...item, ...matchingFormItem };
            }
            return item;
        });

        setData(mergedData);
        for (let i = 0; i < mergedData.length; i++) {
            if (mergedData[i].ProductId != '') {
                mergedData[i].RequestQty = mergedData[i].RequestQty == '' ? 0 : mergedData[i].RequestQty
                mergedData[i].Favourite = mergedData[i].Favourite == false ? 'N' : 'Y'
                mergedData[i].IndentLineId = mergedData[i].IndentLineId ? mergedData[i].IndentLineId : 0
                products.push(mergedData[i])
            }
        }
        // for (let i = 0; i <= data.length; i++) {
        //     if (data[i] !== undefined && va[i] !== undefined) {
        //         const product = {
        //             ProductId: va[i].ProductId != '' ? va[i].ProductId : 0,
        //             UomId: va[i].UomId != '' ? va[i].UomId : 0,
        //             IssuingStoreStock: va[i].IssuingStoreStock,
        //             RequestQty: va[i].RequestQty ? va[i].RequestQty : 0,
        //             Favourite: va[i].Favourite === false ? 'N' : 'Y',
        //             IndentLineId: va[i].IndentLineId ? va[i].IndentLineId : 0,
        //             ActiveFlag: data[i].ActiveFlag
        //         }
        //         products.push(product);
        //     }
        // else {
        //     if (data[i] != undefined) {
        //         // data[i].Favourite = data[i].Favourite == false ? 'N' : 'Y'
        //         products.push(data[i])
        //     }
        // }
        // }

        const Indent = {
            IndentId: values.IndentId ? values.IndentId : 0,
            IndentDate: values.IndentDate,
            IndentStatus: !indentStatus ? 'Created' : values.IndentStatus,
            IndentTemplateId: values.IndentTemplate ? values.IndentTemplate : 0,
            IndentType: values.IndentType,
            IssueingStoreId: values.IssuingStore,
            Name: values.Name,
            Remarks: values.Remarks,
            UHID: values.UHID === undefined ? 0 : values.UHID,
            SubmitCheck: values.SubmitCheck,
            PatientId: values.PatientId,
            EncounterId: !!indentId ? values.EncounterId : values.Encounter,
            IndentCategory: 'PatientIndent',
            RequestingStoreId: 0
        }
        const postData = {
            newIndentModel: Indent,
            IndentDetails: products,
        }
        if (indentId > 0) {
            const response = await customAxios.post(urlUpdatePatientIndent, postData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            handleCancel();
        } else {
            const response = await customAxios.post(urlAddNewPatientIndent, postData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            handleCancel();
        }
    };

    const FavouriteChanged = (record) => {
        record.Favourite = !record.Favourite
    }

    const SubmitChanged = (event) => {
        setIndentStatus(event.target.checked)
    }

    const GetUHID = (value) => {
        if (value !== "") {
            customAxios.get(`${urlSearchUHID}?Uhid=${value}`).then((response) => {
                const apiData = response.data.data;
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

    const handleStoreChange = (value) => {       
        setData(initialDataSource);
        form2.resetFields();
        if (value !== undefined) {
            setIsTableVisible(true);
        } else {
            setIsTableVisible(false);
        }
    }

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
                <Card>
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
                            SubmitCheck: false
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
                                    <Select allowClear placeholder='Select Value' onChange={handleStoreChange} disabled={!!indentId}>
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
                                <Form.Item label="Indent Status" name="IndentStatus"
                                    rules={[
                                        {
                                            required: indentStatus,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select allowClear placeholder='Select Value'>
                                        <Option value="Draft">Draft</Option>
                                        <Option value="Pending">Finalize</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={7} >
                                <Form.Item name="SubmitCheck" style={{ marginTop: '30px' }} valuePropName='checked'>
                                    <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
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
                                    <AutoComplete style={{ width: '100%' }} disabled={!!indentId}
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
                                <Form.Item name="EncounterId" hidden>
                                    <Input></Input>
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
                    </Form>
                    <Form
                        onFinish={handleOnFinish}
                        variant="outlined"
                        size="default"
                        style={{
                            maxWidth: 1500
                        }}
                        form={form2}
                    >
                        {isTableVisible ? (
                            <div>
                                <Table columns={columns} dataSource={data.filter((item) => item.ActiveFlag !== false)} scroll={{ x: 0 }} />
                            </div>
                        ) : null}
                    </Form>
                </Card>
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
                            form={form3}
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
