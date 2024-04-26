import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder, urlAutocompleteProduct, urlGetProductDetailsById, urlAddNewIndent, urlEditIndent, urlUpdateIndent } from '../../../endpoints.js';
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
//import { useParams } from 'react-router-dom';

const CreateIndent = () => {
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
    const [productIds, setProductIds] = useState({});
    const [selectedUom, setSelectedUom] = useState({});
    const [selectedUomId, setSelectedUomId] = useState({});
    const [selectedUomText, setSelectedUomText] = useState({});
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [istablevisible, setIstablevisible] = useState(false);
    const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
    const fields = form1.getFieldsValue();
    const location = useLocation();
    const [indentId, setIndentId] = useState(location.state.IndentId);
    const [buttonTitle, setButtonTitle] = useState('Save');

    useEffect(() => {
        debugger;
        customAxios.get(urlCreatePurchaseOrder).then((response) => {
            const apiData = response.data.data;
            setDropDown(apiData);
        });
        if (indentId > 0) {
            setButtonTitle('Update');
            customAxios.get(`${urlEditIndent}?IndentId=${indentId}`).then((response) => {
                const apiData = response.data.data;
                if (apiData.newIndentModel !== null) {
                    setIstablevisible(true);
                    const isoDateString = apiData.newIndentModel.IndentDate;

                    const dateValue = new Date(isoDateString);

                    const formattedDate = dayjs(dateValue).format('DD-MM-YYYY');

                    const dateForDatePicker = dayjs(formattedDate, 'DD-MM-YYYY');
                    form1.setFieldsValue({ IndentId: indentId });
                    form1.setFieldsValue({ IndentDate: dateForDatePicker });
                    form1.setFieldsValue({ RequestingStore: apiData.newIndentModel.RequestingStoreId });
                    form1.setFieldsValue({ IssuingStore: apiData.newIndentModel.IssueingStoreId });
                    form1.setFieldsValue({ Remarks: apiData.newIndentModel.Remarks });
                    form1.setFieldsValue({ IndentTemplate: apiData.newIndentModel.IndentTemplateId === 0 ? '' : apiData.newIndentModel.IndentTemplateId });
                    form1.setFieldsValue({ IndentType: apiData.newIndentModel.IndentType });
                    form1.setFieldsValue({ IndentId: apiData.newIndentModel.IndentId });
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
                if (apiData.IndentDetails !== null) {
                    for (let i = counter; i <= apiData.IndentDetails.length; i++) {
                        form1.setFieldsValue({ [i]: { product: apiData.IndentDetails[i].ProductName } });
                        form1.setFieldsValue({ [i]: { uom: apiData.IndentDetails[i].UomId } });
                        form1.setFieldsValue({ [i]: { RequestingQty: apiData.IndentDetails[i].RequestQty } });
                        form1.setFieldsValue({ [i]: { RequestingStoreStock: apiData.IndentDetails[i].AvlReqQuantity } });
                        form1.setFieldsValue({ [i]: { RequestingStoreStock: apiData.IndentDetails[i].AvlReqQuantity } });
                        form1.setFieldsValue({ [i]: { IssuingStoreStock: apiData.IndentDetails[i].AvlIssueQuantity === null ? 0 : apiData.IndentDetails[i].AvlIssueQuantity } });
                        form1.setFieldsValue({ [i]: { fav: apiData.IndentDetails[i].Favourite === "N" ? false : true } });
                        form1.setFieldsValue({ [i]: { productId: apiData.IndentDetails[i].ProductId } });
                        form1.setFieldsValue({ [i]: { uomId: apiData.IndentDetails[i].UomId } });
                        form1.setFieldsValue({ [i]: { IndentLineId: apiData.IndentDetails[i].IndentLineId } });
                    }
                }
            });
            setIndentId(0);
        }
    }, []);

    const handleToIndent = () => {
        const url = '/Indent';
        navigate(url);
    }

    const getPanelValue = async (searchText, key) => {
        debugger;
        if (searchText === "") {
            form1.setFieldsValue({ [key]: { uom: undefined } });
            form1.setFieldsValue({ [key]: { RequestingQty: undefined } });
            form1.setFieldsValue({ [key]: { RequestingStoreStock: undefined } });
            form1.setFieldsValue({ [key]: { IssuingStoreStock: undefined } });
            form1.setFieldsValue({ [key]: { product: undefined } });
        }
        try {
            customAxios.get(`${urlAutocompleteProduct}?Product=${searchText}`).then((response) => {
                const apiData = response.data.data;
                const newOptions = apiData.map(item => ({ value: item.LongName, key: item.ProductDefinitionId, UomId: item.UOMPrimaryUOM }));
                setAutoCompleteOptions(newOptions);
            });
        } catch (error) {
            // Handle the error as needed
        }
    }

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

    const handleSelect = (value, option, key) => {
        debugger;
        customAxios.get(`${urlGetProductDetailsById}?ProductId=${option.key}`).then((response) => {
            debugger;
            const apiData = response.data.data;
            form1.setFieldsValue({ [productCount - 1]: { uom: apiData.UOMPrimaryUOM } });
            form1.setFieldsValue({ [productCount - 1]: { productId: apiData.ProductDefinitionId } });            
            if (apiData.PORate != null) {
                form1.setFieldsValue({ [productCount - 1]: { IndentLineId: apiData.PORate.PoLineId } });
                form1.setFieldsValue({ [key]: { poRate: apiData.PORate.PoRate } });
            }
            let reqstr = form1.getFieldValue('RequestingStore');
            let issstr = form1.getFieldValue('IssuingStore');
            let qty = 0, reqqty = 0;

            apiData.Stock.forEach(value => {
                if (apiData.Stock.length > 0 && apiData.Stock[0].StoreId === reqstr) {
                    reqqty += value.Quantity;
                }
                if (apiData.Stock.length > 0 && apiData.Stock[0].StoreId === issstr) {
                    qty += value.Quantity;
                }
            })
            if (qty !== 0) {
                form1.setFieldsValue({ [key]: { IssuingStoreStock: qty } });
                form1.setFieldsValue({ [key]: { RequestingStoreStock: reqqty } });
            } else {
                getPanelValue('', key);
                message.warning('Issue Store stock is empty! Please select other Product')
            }
        });

        // form1.setFieldsValue({ [key]: { product: value } });
        // setProductIds((prevState) => ({ ...prevState, [key]: option.key }));
        // setSelectedProductId((prevState) => {
        //     const newState = { ...prevState, [key]: option.key };
        //     return newState;
        // })

        // const matchingUom = DropDown.UOM.find((uomOption) => uomOption.UomId === option.UomId);
        // setSelectedUomText((prevState) => {
        //     const newState = { ...prevState, [key]: matchingUom.LongName };
        //     return newState;
        // });
        // setSelectedUomId((prevState) => {
        //     const newState = { ...prevState, [key]: matchingUom.UomId };
        //     console.log(selectedUomId);
        //     return newState;
        // });
        // if (matchingUom) {
        //     setSelectedUom((prevState) => {
        //         const newState = { ...prevState, [key]: matchingUom.UomId };
        //         console.log(newState); // Log the new state
        //         return newState;
        //     });

        //     form1.setFieldsValue({ [key]: { uom: matchingUom.UomId } });
        // } else {
        //     setSelectedUom((prevState) => {
        //         const newState = { ...prevState, [key]: null };
        //         console.log(newState); // Log the new state
        //         return newState;
        //     });
        //     form1.setFieldsValue({ [key]: { uom: null } });
        // }
    };

    const AddProduct = () => {
        const newData = {
            key: productCount.toString(),
            product: '',
            uom: '',
            RequestingQty: '',
            RequestingStoreStock: '',
            IssuingStoreStock: '',
            fav: '',
        }
        setData([...data, newData]);
        setProductcount(productCount + 1);
    }

    const columns = [
        {
            title: 'Product',
            width: 250,
            dataIndex: 'product',
            key: 'product',
            render: (_, record) => (
                <>
                    <Form.Item name={[record.key, 'product']}
                        rules={[
                            {
                                required: true,
                                message: 'Please input!'
                            }
                        ]}
                    >
                        <AutoComplete style={{ width: '100%' }}
                            options={autoCompleteOptions}
                            onSearch={(value) => getPanelValue(value, record.key)}
                            onSelect={(value, option) => handleSelect(value, option, record.key)}
                            placeholder="Search for a product"
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item name={[record.key, 'productId']} hidden>
                        <input></input>
                    </Form.Item>
                    <Form.Item name={[record.key, 'IndentLineId']} hidden>
                        <Input></Input>
                    </Form.Item>
                </>
            )
        },
        {
            title: 'UOM',
            dataIndex: 'uom',
            key: 'uom',
            render: (text, record) => (
                <Form.Item name={[record.key, 'uom']} style={{ width: '100%' }}>
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
                    style={{ width: '100%' }}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!'
                        }
                    ]}
                >
                    <InputNumber min={0} />
                </Form.Item>
            )
        },
        {
            title: 'Requesting Store Stock',
            dataIndex: 'RequestingStoreStock',
            key: 'RequestingStoreStock',
            render: (text, record) => (
                <Form.Item name={[record.key, 'RequestingStoreStock']} style={{ width: '100%' }}>
                    <InputNumber min={0} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Issuing Store Stock',
            dataIndex: 'IssuingStoreStock',
            key: 'IssuingStoreStock',
            render: (text, record) => (
                <Form.Item name={[record.key, 'IssuingStoreStock']}>
                    <InputNumber min={0} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Fav',
            dataIndex: 'fav',
            key: 'fav',
            render: (text, record) => (
                <Form.Item name={[record.key, 'fav']} style={{ width: 100 }} valuePropName="checked">
                    <Checkbox></Checkbox>
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

    const handleCancel = () => {
        const url = '/Indent';
        navigate(url);
    }

    const handleOnFinish = async (values) => {
        debugger;
        const products = [];
        for (let i = 0; i <= productCount; i++) {
            if (values[i] !== undefined) {
                const product = {
                    ProductId: values[i].productId === undefined ? selectedProductId[i] : values[i].productId,
                    UomId: values[i].uom,
                    RequestQty: values[i].RequestingQty,
                    Favourite: values[i].fav === false || values[i].fav === undefined ? "N" : "Y",
                    IssuingStoreStock: values[i].IssuingStoreStock,
                    RequestingStoreStock: values[i].RequestingStoreStock,
                    QuantityTobeIssued: values[i].IssuingStoreStock,
                    IndentLineId: values[i].IndentLineId === undefined ? 0 : values[i].IndentLineId
                }
                products.push(product);
            }
        }
        if (products.length > 0) {
            const Indent = {
                IndentDate: values.IndentDate,
                IndentId: values.IndentId === undefined ? 0 : values.IndentId,
                RequestingStoreId: values.RequestingStore,
                IssueingStoreId: values.IssuingStore,
                IndentTemplateId: values.IndentTemplate === undefined || values.IndentTemplate === "" ? 0 : values.IndentTemplate,
                IndentType: values.IndentType,
                Remarks: values.Remarks === undefined ? null : values.Remarks,
                IndentStatus: values.IndentStatus === undefined ? 'Created' : values.IndentStatus,
                IndentCategory: "StoreIndent",
            }
            const postData = {
                newIndentModel: Indent,
                IndentDetails: products,
            }
            try {
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
                // form1.resetFields();
            } catch (error) {
                // Handle error      
            }
            // setIsSearchLoading(false);
        } else {
            message.warning('Please add Product Details');
        }
    };

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Create Indent
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
                        IndentDate: dayjs(),
                    }}
                    onValuesChange={(changedValues, allValues) => {
                        debugger;
                        if (allValues.RequestingStore !== undefined && allValues.IssuingStore !== undefined) {
                            if (allValues.RequestingStore !== allValues.IssuingStore) {
                                setIstablevisible(true);
                            } else {
                                form1.resetFields();
                                setIstablevisible(false);
                                message.warning('Please select Different Stores');
                            }
                        } else {
                            setData([]);
                            setIstablevisible(false);
                        }
                        if (allValues[productCount - 1].RequestingQty !== undefined) {
                            if (allValues[productCount - 1].IssuingStoreStock >= allValues[productCount - 1].RequestingQty) {

                            }
                            else {
                                form1.setFieldsValue({ [productCount - 1]: { RequestingQty: undefined } })
                                message.warning('Requested Quanttity must less than Issue Store Stock');
                            }
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
                                <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                            </Form.Item>
                            <Form.Item name="IndentId" hidden>
                                <Input></Input>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Requesting Store" name="RequestingStore"
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
                            <Form.Item label="Indent Type" name="IndentType"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <Select allowClear placeholder='Select Value'>
                                    <Select.Option key='Effective' value='Effective'></Select.Option>
                                    <Select.Option key='Consumption Based' value='Consumption Based'></Select.Option>
                                    <Select.Option key='Urgent' value='Urgent'></Select.Option>
                                    <Select.Option key='Reorder level Based' value='Reorder level Based'></Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={3}>
                            <Form.Item label="Indent Status" name="IndentStatus">
                                <Select allowClear placeholder='Select Value'>
                                    <Option value="Draft">Draft</Option>
                                    <Option value="Pending">Finalize</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={3} >
                            <Form.Item name="SubmitCheck" style={{ paddingTop: 30 }} valuePropName="checked">
                                <Checkbox>Submit</Checkbox>
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
                    {istablevisible ? (
                        <div>
                            <Table columns={columns} dataSource={data} scroll={{ x: 0 }} />
                            {/* <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px', float: 'right' }}>
                                <Form.Item label="Amount" name='TotalAmount' style={{ marginRight: '16px', width: 100 }} >
                                    <InputNumber min={0} disabled />
                                </Form.Item>
                                <Form.Item label="Tax" name='Tax' style={{ marginRight: '16px', width: 100 }} >
                                    <InputNumber min={0} disabled />
                                </Form.Item>
                                <Form.Item label="Round Off" name='RoundOff' style={{ marginRight: '16px', width: 100 }}>
                                    <InputNumber min={0} disabled />
                                </Form.Item>
                                <Form.Item label="Total PO Amount" name='totalpoAmount' style={{ width: 150 }}>
                                    <InputNumber min={0} disabled />
                                </Form.Item>
                            </div> */}
                        </div>
                    ) : null}
                </Form>
            </div>
        </Layout >
    );
}

export default CreateIndent;
