import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder, urlAutocompleteProduct, urlGetProductDetailsById, urlAddNewIndent, urlEditIndent, urlUpdateIndent } from '../../../endpoints.js';
import Select from 'antd/es/select';
import { ConfigProvider, message, Typography, Checkbox, Tooltip, Modal, Card, Popconfirm, Spin, Col, Divider, Row, AutoComplete } from 'antd';
import Input from 'antd/es/input';
import Form from 'antd/es/form';
import { DatePicker } from 'antd';
import Layout from 'antd/es/layout/layout';
//import Typography from 'antd/es/typography';
import { useNavigate } from 'react-router';
import { Table, InputNumber } from 'antd';
import { LeftOutlined, CloseSquareFilled, DeleteOutlined, PlusOutlined, } from '@ant-design/icons';
import { useLocation } from "react-router-dom";
import dayjs from 'dayjs';

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
    const [isProductAdded, setIsProductAdded] = useState(false);
    const [istablevisible, setIstablevisible] = useState(false);
    const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
    const fields = form1.getFieldsValue();
    const location = useLocation();
    const indentId = location.state.IndentId;
    const [buttonTitle, setButtonTitle] = useState('Save');
    const [indentStatus, setIndentStatus] = useState(false)
    const [isIssueQtyAvailable, setIsIssueQtyAvailable] = useState(false)
    const [data, setData] = useState([]);

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
                const products = apiData.IndentDetails.map(
                    (item, index) => ({
                        ...item,
                        key: index + 1,
                        RequestingStoreStock: apiData.IndentDetails[index].AvlReqQuantity,
                        IssuingStoreStock: apiData.IndentDetails[index].AvlIssueQuantity,
                        RequestingQty: apiData.IndentDetails[index].RequestQty,
                        Favourite: apiData.IndentDetails[index].Favourite === 'Y' ? true : false
                    })
                );
                setIstablevisible(true)
                setProductcount(apiData.IndentDetails.length)
                setData(products);
                const formdata = apiData.newIndentModel;
                form1.setFieldsValue({
                    RequestingStoreId: formdata.RequestingStoreId,
                    IndentNumber: formdata.IndentNumber,
                    IndentDate: DateBindtoDatepicker(formdata.IndentDate),
                    IssueingStoreId: formdata.IssueingStoreId,
                    ReceivingDate: DateBindtoDatepicker(formdata.ReceivingDate),
                    IndentType: formdata.IndentType,
                    IndentCategory: formdata.IndentCategory,
                    Remarks: formdata.Remarks,
                    IndentStatus: formdata.IndentStatus === 'Created' ? '' : formdata.IndentStatus,
                    IndentId: formdata.IndentId,
                    IndentTemplateId: formdata.IndentTemplateId
                });
            });
        }
    }, []);

    const handleToIndent = () => {
        const url = '/Indent';
        navigate(url);
    }

    const DateBindtoDatepicker = (value) => {
        const isoDateString = value;
        const dateValue = new Date(isoDateString);
        const formattedDate = dayjs(dateValue).format('DD-MM-YYYY');
        return dayjs(formattedDate, 'DD-MM-YYYY');
    }

    const handleDelete = (record) => {
        debugger;
        const newData = data.map((item) => {
            if (item.key === record.key) {
                return { ...item, ActiveFlag: false };
            }
            return item;
        });
        setData(newData);
    };

    const handleSelectProduct = (value, option, column, record) => {
        debugger
        const va = form1.getFieldsValue()
        customAxios.get(`${urlGetProductDetailsById}?ProductId=${option.key}`).then((response) => {
            debugger;
            const apiData = response.data.data;
            const issqty = apiData.Stock.filter((item) => item.StoreId == va.IssueingStoreId)
            const reqqty = apiData.Stock.filter((item) => item.StoreId == va.RequestingStoreId)
            const IsstotalQuantity = issqty.reduce((sum, element) => sum + element.Quantity, 0);
            const ReqtotalQuantity = reqqty.reduce((sum, element) => sum + element.Quantity, 0);
            const newData = data.map((item) => {
                if (item.key === record.key) {
                    const updatedItem = {
                        ...item, [column]: option.key, ProductName: option.value,
                        ProductId: option.key,
                        UomId: option.UomId,
                        IssuingStoreStock: IsstotalQuantity,
                        RequestingStoreStock: ReqtotalQuantity
                    };
                    return updatedItem;
                }
                return item;
            });
            setData(newData);
            form1.setFieldsValue({ [record.key]: { IssuingStoreStock: IsstotalQuantity } })
            form1.setFieldsValue({ [record.key]: { RequestingStoreStock: ReqtotalQuantity } })
            form1.setFieldsValue({ [record.key]: { UomId: option.UomId } })
        })
        form1.setFieldsValue({ [record.key]: { ProductId: option.key } })
    }

    const handleSelect = (value, option, column, record) => {
        const va = form1.getFieldsValue()
        if (va.RequestingStoreId !== undefined && va.IssueingStoreId != undefined) {
            if (va.RequestingStoreId !== va.IssueingStoreId) {
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
    };

    const handleUomChange = (option, column, index, record) => {
        const newData = data.map((item) => {
            if (item.key === record.key) {
                const updatedItem = { ...item, [column]: option.value, ShortName: option.children };
                return updatedItem;
            }
            return item;
        });
        setData(newData);
    };

    const handleSearch = async (searchText) => {
        if (searchText) {
            const response = await customAxios.get(
                `${urlAutocompleteProduct}?Product=${searchText}`
            );
            const apiData = response.data.data;
            const newOptions = apiData.map((item) => ({
                value: item.LongName,
                key: item.ProductId,
                UomId: item.UOMPrimaryUOM
            }));
            setAutoCompleteOptions(newOptions);
        }
    };

    const AddProduct = async () => {
        setAutoCompleteOptions([]);
        await form1.validateFields()
        setData([
            ...data,
            {
                key: productCount,
                ProductName: '',
                // ProductId: '',
                UomId: '',
                RequestingQty: '',
                RequestingStoreStock: '',
                IssuingStoreStock: '',
                Favourite: false,
                ActiveFlag: true,
            },
        ]);
        setProductcount(productCount + 1);
        setIsProductAdded(false)
    }

    const validateEqualValue = (record, value) => {
        const va = form1.getFieldsValue()
        if (value <= record.IssuingStoreStock) {
            const newdata = data.map((item) => {
                if (item.ProductId === record.ProductId) {
                    const updated = { ...item, RequestingQty: value }
                    return updated
                }
                return item
            })
            setData(newdata)
            return Promise.resolve();
        }
        return Promise.reject(new Error('Must less than Store Stock Qty!'));
    };

    const columns = [
        {
            title: "Product",
            dataIndex: "ProductName",
            fixed: "left",
            key: "ProductName",
            width: 450,
            render: (text, record, index) => (
                <>
                    <Form.Item
                        name={[record.key, 'ProductName']}
                        rules={[{ required: true, message: "Required" }]}
                        initialValue={record.ProductName}
                    >
                        <AutoComplete
                            defaultValue={record.ProductName}
                            options={autoCompleteOptions}
                            onSearch={handleSearch}
                            onSelect={(value, option) =>
                                handleSelectProduct(value, option, "ProductName", record)
                            }
                            onChange={(value) => {
                                if (!value) {
                                    setAutoCompleteOptions([]);
                                }
                            }}
                            allowClear={{
                                clearIcon: <CloseSquareFilled />,
                            }}
                            disabled={!!indentId}
                        />
                    </Form.Item>
                    <Form.Item name={[record.key, 'ProductId']} initialValue={record.ProductId} hidden ><Input></Input></Form.Item>
                    <Form.Item name={[record.key, 'IndentLineId']} initialValue={record.IndentLineId} hidden ><Input></Input></Form.Item>
                </>
            ),
        },
        {
            title: "UOM",
            dataIndex: "UomId",
            key: "UomId",
            width: 200,
            render: (text, record, index) => (
                <>
                    <Form.Item
                        name={[record.key, 'UomId']}
                        rules={[{ required: true, message: "Required" }]} initialValue={record.UomId}>
                        <Select defaultValue={record.UomId} disabled={!!indentId}
                            onChange={(value, option) =>
                                handleUomChange(option, "UomId", index, record)
                            }
                        >
                            {DropDown.UOM.map((option) => (
                                <Option key={option.UomId} value={option.UomId}>
                                    {option.ShortName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </>
            ),
        },
        {
            title: 'Requesting Qty',
            dataIndex: 'RequestingQty',
            key: 'RequestingQty',
            width: 200,
            render: (text, record) => (
                <Form.Item
                    name={[record.key, 'RequestingQty']}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!'
                        },
                        {
                            validator: (_, value) => validateEqualValue(record, value)
                        }
                    ]}
                    initialValue={record.RequestingQty}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
            )
        },
        {
            title: 'Requesting Store Stock',
            dataIndex: 'RequestingStoreStock',
            key: 'RequestingStoreStock',
            width: 200,
            render: (text, record) => (
                <Form.Item initialValue={record.RequestingStoreStock} name={[record.key, 'RequestingStoreStock']}>
                    <InputNumber min={0} style={{ width: '100%' }} defaultValue={record.RequestingQty} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Issuing Store Stock',
            dataIndex: 'IssuingStoreStock',
            key: 'IssuingStoreStock',
            render: (text, record) => (
                <Form.Item name={[record.key, 'IssuingStoreStock']} initialValue={record.IssuingStoreStock}>
                    <InputNumber min={0} disabled style={{ width: '100%' }} defaultValue={text} />
                </Form.Item>
            )
        },
        {
            title: 'Fav',
            dataIndex: 'Favourite',
            key: 'Favourite',
            render: (text, record) => (
                <Form.Item initialValue={record.Favourite}
                    name={[record.key, 'Favourite']}
                    style={{ width: 100 }} valuePropName="checked">
                    <Checkbox></Checkbox>
                </Form.Item>
            )
        },
        {
            title: (<Tooltip title="Please Add Product!" open={isProductAdded}>
                <Button type="primary" icon={<PlusOutlined />} onClick={AddProduct}></Button>
            </Tooltip>),
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
        const va = form1.getFieldsValue()
        data
        const products = [];
        for (let i = 0; i <= productCount; i++) {
            if (data[i] !== undefined) {
                const product = {
                    ProductId: data[i].ProductId,
                    UomId: data[i].UomId,
                    RequestQty: values[i] != undefined ? values[i].RequestingQty : 0,
                    Favourite: data[i].Favourite === true ? "Y" : "N",
                    IssuingStoreStock: data[i].IssuingStoreStock,
                    RequestingStoreStock: data[i].RequestingStoreStock,
                    QuantityTobeIssued: data[i].IssuingStoreStock,
                    IndentLineId: data[i].IndentLineId === undefined ? 0 : values[i].IndentLineId,
                    ActiveFlag: data[i].ActiveFlag
                }
                products.push(product);
            }
        }
        if (products.length == 0) {
            setIsProductAdded(true)
            return false
        }
        const Indent = {
            IndentDate: values.IndentDate,
            IndentId: values.IndentId === undefined ? 0 : values.IndentId,
            RequestingStoreId: values.RequestingStoreId,
            IssueingStoreId: values.IssueingStoreId,
            IndentTemplateId: values.IndentTemplateId === undefined ? 0 : values.IndentTemplateId,
            IndentType: values.IndentType,
            Remarks: values.Remarks === undefined ? null : values.Remarks,
            IndentStatus: !indentStatus ? 'Created' : values.IndentStatus,
            IndentCategory: "StoreIndent",
        }
        const postData = {
            newIndentModel: Indent,
            IndentDetails: products,
        }
        try {
            if (indentId > 0) {
                const response = await customAxios.post(urlUpdateIndent, postData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                message.success('Indent Updated!')
            } else {
                // const response = await customAxios.post(urlAddNewIndent, postData, {
                //     headers: {
                //         'Content-Type': 'application/json'
                //     }
                // });
                message.success('Indent Created!')
            }
            handleCancel();
        } catch (error) {
            // Handle error      
        }
    };

    const SubmitCheck = (event) => {
        setIndentStatus(event.target.checked)
    }

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
                                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" disabled={!!form1.getFieldValue('IndentId')} />
                                </Form.Item>
                                <Form.Item name="IndentId" hidden>
                                    <Input></Input>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Requesting Store" name="RequestingStoreId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select allowClear placeholder='Select Value' onChange={handleSelect} disabled={!!form1.getFieldValue('IndentId')} >
                                        {DropDown.StoreDetails.map((option) => (
                                            <Select.Option key={option.StoreId} value={option.StoreId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Issuing Store" name="IssueingStoreId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select allowClear placeholder='Select Value' onChange={handleSelect} disabled={!!form1.getFieldValue('IndentId')}>
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
                                <Form.Item label="Indent Template" name="IndentTemplateId">
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
                            <Col className="gutter-row" span={3} >
                                <Form.Item name="SubmitCheck" style={{ paddingTop: 30 }} valuePropName="checked">
                                    <Checkbox onChange={SubmitCheck}>Submit</Checkbox>
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
                                <Table columns={columns}
                                    dataSource={data.filter((item) => item.ActiveFlag !== false)}
                                    size="small" scroll={{ x: 0 }} bordered />
                            </div>
                        ) : null}
                    </Form>
                </Card>
            </div>
        </Layout >
    );
}

export default CreateIndent;
