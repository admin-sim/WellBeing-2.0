import React, { useState, useEffect } from 'react';
import customAxios from '../../../components/customAxios/customAxios.jsx';
import { PlusOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Layout from 'antd/es/layout/layout';
import { useNavigate } from 'react-router';
import { Spin, Skeleton, Collapse, Typography, Select, Popconfirm, Button, Form, Input, Row, AutoComplete, Col, DatePicker, Card, Divider, Tooltip, Table, Checkbox, message, Flex } from 'antd';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { urlCreateStore, urlAutocompleteProduct, urlEditStore } from '../../../../endpoints';
import { useLocation } from "react-router-dom";
import { render } from 'react-dom';
import FormItem from 'antd/es/form/FormItem/index.js';
import { lowerCase } from 'lodash';

const CreateStore = () => {
    const [DropDown, setDropDown] = useState({
        StoreDetails: [],
    });
    const location = useLocation();
    const [storeId, setStoreId] = useState(location.state == null ? 0 : location.state.StoreId);
    const [buttonTitle, setButtonTitle] = useState('Save');
    const [buttonTitle1, setButtonTitle1] = useState('Cancel');
    const [form] = Form.useForm();
    const { Title } = Typography;
    const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
    const [data, setData] = useState([
        {
            key: '0',
            product: '',
            age: '32',
            address: 'London, Park Lane no. 0',
        },
    ]);
    const [accessRights, setAccessRights] = useState([])
    const { Column, ColumnGroup } = Table;

    useEffect(() => {
        customAxios.get(urlCreateStore).then((response) => {
            const apiData = response.data.data;
            setDropDown(apiData);
            setAccessRights(apiData.StoreFunctions)
        });
        if (storeId > 0) {
            setData([])
            setButtonTitle('Update')
            setButtonTitle1('Back')
            customAxios.get(`${urlEditStore}?StoreId=${storeId}`).then((response) => {
                debugger;
                const apiData = response.data.data;
                form.setFieldsValue({ Store: apiData.newStoreModel.StoreId.toString() })
                form.setFieldsValue({ StoreType: apiData.newStoreModel.StoreType })
                form.setFieldsValue({ Remarks: apiData.newStoreModel.Remarks })
                form.setFieldsValue({ DefaultParentStore: apiData.newStoreModel.DefaultParentStoreId == 0 ? null : apiData.newStoreModel.DefaultParentStoreId.toString() })
                form.setFieldsValue({ Status: apiData.newStoreModel.Status.toLowerCase() })
                form.setFieldsValue({ AssociatedProduct: null })
                form.setFieldsValue({ StoreId: apiData.newStoreModel.StoreId })
                for (let i = 0; i < apiData.ProductDetails.length; i++) {
                    form.setFieldsValue({ [i]: { productId: apiData.ProductDetails[i].ProductId } })
                    form.setFieldsValue({ [i]: { product: apiData.ProductDetails[i].ProductName } })
                    form.setFieldsValue({ [i]: { MinQty: apiData.ProductDetails[i].MinQty } })
                    form.setFieldsValue({ [i]: { MaxQty: apiData.ProductDetails[i].MaxQty } })
                    form.setFieldsValue({ [i]: { ROL: apiData.ProductDetails[i].ROL } })
                    form.setFieldsValue({ [i]: { ROQ: apiData.ProductDetails[i].ROQ } })
                    form.setFieldsValue({ [i]: { MinStock: apiData.ProductDetails[i].MinStock } })
                    form.setFieldsValue({ [i]: { LeadTime: apiData.ProductDetails[i].LeadTime } })
                    form.setFieldsValue({ [i]: { Contigency: apiData.ProductDetails[i].Contigency } })
                    form.setFieldsValue({ [i]: { IndentBasis: apiData.ProductDetails[i].IndentBasis } })
                    form.setFieldsValue({ [i]: { StockLocator: apiData.ProductDetails[i].StockLocator } })
                    form.setFieldsValue({ [i]: { Status: apiData.ProductDetails[i].Status } })
                    form.setFieldsValue({ [i]: { IsConsumptionAllowed: apiData.ProductDetails[i].Isconsumptionallowed == 'Y' ? true : false } })
                    if (i != 0) {
                        handleAdd();
                    }
                }
                setAccessRights(apiData.AccessRights)
            });
        }
        setStoreId(0);
    }, []);

    const DateBindtoDatepicker = (value) => {
        const isoDateString = value;
        const dateValue = new Date(isoDateString);
        const formattedDate = dayjs(dateValue).format('DD-MM-YYYY');
        return dayjs(formattedDate, 'DD-MM-YYYY');
    }

    const navigate = useNavigate();
    const handleSearch = () => {
        navigate('/Store');
    }

    const onFinish = async (values) => {
        debugger;
        const VenderModel = {
            VendorId: values.VendorId === undefined ? 0 : values.VendorId,
            ShortName: values.ShortName === undefined ? '' : values.ShortName,
            LongName: values.LongName === undefined ? '' : values.LongName,
            VendorGroup: values.VendorGroup === undefined ? '' : values.VendorGroup,
            ContactPerson: values.ContactPerson === undefined ? null : values.ContactPerson,
            EffectiveFrom: values.EffectiveFrom,
            EffectiveTo: values.EffectiveTo,
            IsSupplier: values.isSupplier === undefined ? false : values.isSupplier,
            IsManufacturer: values.isManufacturer === undefined ? false : values.isManufacturer,
            Address1: values.Address === undefined ? '' : values.Address,
            CountryId: values.Country === undefined ? 0 : values.Country,
            StateId: values.State === undefined ? 0 : values.State,
            Place: values.Place === undefined ? 0 : values.Place,
            Area: values.Area === undefined ? 0 : values.Area,
            PinCode: values.Zip === undefined ? 0 : values.Zip,
            MobileNumber: values.Mobile === undefined ? '' : values.Mobile,
            EmailId: values.Email === undefined ? null : values.Email,
            LandlineNumber: values.Landline === undefined ? null : values.Landline,
            CreditDays: values.CreditDays === undefined ? 0 : values.CreditDays,
            ActiveFlag: values.Status === 'true' ? true : false,
        }
        const postData = {
            NewVendorModel: VenderModel,
        }
        try {
            if (values.VendorId > 0) {
                const response = await customAxios.post(urlUpdateVendorDetails, postData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.data === true) {
                    message.success('Success! Vendor record successfully updated.')
                    handleSearch();
                    // form.resetFields();
                    // handleCancel();
                } else {
                    message.error('Error to Update')
                }

            } else {
                if (postData.NewVendorModel.IsSupplier === true || postData.NewVendorModel.IsManufacturer === true) {
                    const response = await customAxios.post(urlAddNewVendor, postData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.data === 'Failed') {
                        message.error('Failed');
                    } else if (response.data === 'Already Exists') {
                        message.warning('Already Exists')
                    } else {
                        message.success('Success! Vendor record successfully Saved.')
                    }
                    handleSearch();
                    // form.resetFields();
                    // handleCancel();
                }
                else {
                    message.warning('Failure! Please select atleast one from IsSupplier or IsManufacturer')
                    return false
                }
            }
            // const response = await customAxios.post(urlAddNewPurchaseOrder, postData);
            // debugger;
            // form1.resetFields();
            // handleCancel();
        } catch (error) {
            // Handle error      
        }
    }

    const onReset = (value) => {
        debugger;
        if (value != undefined) {
            handleSearch();
        } else {
            form.resetFields();
        }
    }

    const disabledEffectiveToDate = (current) => {
        debugger;
        const effectiveFrom = form.getFieldValue('EffectiveFrom');
        if (!effectiveFrom) {
            return false;
        }
        return current && current < effectiveFrom.startOf('day');
    };

    const getPanelValue = async (searchText, key) => {
        try {
            customAxios.get(`${urlAutocompleteProduct}?Product=${searchText}`).then((response) => {
                const apiData = response.data.data;
                const newOptions = apiData.map(item => ({ value: item.LongName, key: item.ProductDefinitionId, UomId: item.UOMPrimaryUOM }));
                setAutoCompleteOptions(newOptions);
            });
        } catch (error) {
            //console.error("Error fetching purchase order details:", error);        
        }
    }


    const handleSelect = (value, option, key) => {
        debugger;
        try {
            customAxios.get(`${urlGetProductDetailsById}?ProductId=${option.key}`).then((response) => {
                debugger;
                const apiData = response.data.data;
            });
        } catch (error) {
            //console.error("Error fetching purchase order details:", error);        
        }
    };

    const handleAdd = () => {
        debugger;
        form
            .validateFields()
            .then(() => {
                setData(prevData => {
                    const newRow = {
                        key: prevData.length,
                        product: '',
                        age: '32',
                        address: 'London, Park Lane no. 0',
                    };
                    return [...prevData, newRow];
                });
            })
    }

    const defaultColumns = [
        {
            title: 'Product',
            // width: 15,
            dataIndex: 'product',
            key: 'product',
            render: (_, record) => (
                <>
                    <Form.Item style={{ width: '250px' }}
                        name={[record.key, 'product']}
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
                    <FormItem name={[record.key, 'productId']} hidden><Input></Input></FormItem>
                </>
            )
        },
        {
            title: 'Min. Qty',
            dataIndex: 'MinQty',
            key: 'MinQty',
            render: (_, record) => (
                <Form.Item name={[record.key, 'MinQty']}>
                    <Input></Input>
                </Form.Item>
            )
        },
        {
            title: 'Max. Qty',
            dataIndex: 'MaxQty',
            key: 'MaxQty',
            render: (_, record) => (
                <Form.Item name={[record.key, 'MaxQty']}>
                    <Input></Input>
                </Form.Item>
            )
        },
        {
            title: 'ROL',
            dataIndex: 'ROL',
            key: 'ROL',
            render: (_, record) => (
                <Form.Item name={[record.key, 'ROL']}>
                    <Input></Input>
                </Form.Item>
            )
        },
        {
            title: 'ROQ',
            dataIndex: 'ROQ.',
            key: 'ROQ',
            render: (_, record) => (
                <Form.Item name={[record.key, 'ROQ']}>
                    <Input></Input>
                </Form.Item>
            )
        },
        {
            title: 'Min. Stock',
            dataIndex: 'MinStock',
            key: 'MinStock',
            render: (_, record) => (
                <Form.Item name={[record.key, 'MinStock']}>
                    <Input></Input>
                </Form.Item>
            )
        },
        {
            title: 'Lead Time.',
            dataIndex: 'LeadTime',
            key: 'LeadTime',
            render: (_, record) => (
                <Form.Item name={[record.key, 'LeadTime']}>
                    <Input></Input>
                </Form.Item>
            )
        },
        {
            title: 'Contigency %',
            dataIndex: 'Contigency%',
            key: 'Contigency%',
            render: (_, record) => (
                <Form.Item name={[record.key, 'Contigency']}>
                    <Input></Input>
                </Form.Item>
            )
        },
        {
            title: 'Indent Basis',
            dataIndex: 'IndentBasis',
            key: 'IndentBasis',
            render: (_, record) => (
                <Form.Item name={[record.key, 'IndentBasis']}>
                    <Select defaultValue='Reorder Level'>
                        <Select.Option key='Reorder Level' value='Reorder Level'>Reorder Level</Select.Option>
                        <Select.Option key='Top up' value='Top up'>Top up</Select.Option>
                        <Select.Option key='Manual' value='Manual'>Manual</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            title: 'Stock Locator',
            dataIndex: 'StockLocator',
            key: 'StockLocator',
            render: (_, record) => (
                <Form.Item name={[record.key, 'StockLocator']}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!'
                        }
                    ]}
                >
                    <Input></Input>
                </Form.Item>
            )
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            render: (_, record) => (
                <Form.Item name={[record.key, 'Status']}>
                    <Select defaultValue='true'>
                        <Select.Option key='true' value='true'>Active</Select.Option>
                        <Select.Option key='false' value='false'>Hidden</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            title: 'Is Consumption Allowed',
            dataIndex: 'IsConsumptionAllowed',
            key: 'IsConsumptionAllowed',
            render: (_, record) => (
                <Form.Item name={[record.key, 'IsConsumptionAllowed']} valuePropName="checked">
                    <Checkbox defaultChecked />
                </Form.Item>
            )
        },
        {
            title: <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}></Button>,
            dataIndex: 'add',
            key: 'add',
            width: 50,
            // render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}><DeleteOutlined /></Popconfirm>
            //<Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>      
        }
    ];

    const items = [
        {
            key: '1',
            label: 'Product',
            children:
                <Table dataSource={data} columns={defaultColumns}>
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
                </Table>,
        },
        {
            key: '2',
            label: 'Access Rights',
            children: <div>
                <div style={{ display: 'flex' }}>
                    <Form.Item name='OP' label='OP'>
                        <Checkbox></Checkbox>
                    </Form.Item>
                    <Form.Item name='IP' label='IP'>
                        <Checkbox></Checkbox>
                    </Form.Item>
                    <Form.Item name='Direct' label='Direct'>
                        <Checkbox></Checkbox>
                    </Form.Item>
                </div>
                {/* <Table columns={acceessColumns} dataSource={accessRights} /> */}
                <Table dataSource={accessRights}>
                    <Column title="Features" dataIndex="LookupDescription" key="LookupDescription" />
                    <Column title="Applicable" dataIndex="Applicable" key="Applicable"
                        render={(_, record) => (
                            <Form.Item name='Applicatble'>
                                <Checkbox></Checkbox>
                            </Form.Item>
                        )}
                    />
                    <Column
                        title="Single Stage"
                        dataIndex="SingleStage"
                        key="SingleStage"
                        render={(_, record) => (
                            <Form.Item name='SingleStage'>
                                <Checkbox></Checkbox>
                            </Form.Item>
                        )}
                    />
                    <ColumnGroup title="Multi Stage">
                        <Column title="Draft" dataIndex="Draft" key="Draft"
                            render={(_, record) => (
                                <Form.Item name='Draft'>
                                    <Checkbox></Checkbox>
                                </Form.Item>
                            )}
                        />
                        <Column title="Finalize" dataIndex="Finalize" key="Finalize"
                            render={(_, record) => (
                                <Form.Item name='Finalize'>
                                    <Checkbox></Checkbox>
                                </Form.Item>
                            )}
                        />
                    </ColumnGroup>
                </Table>
            </div>,
        },
    ];

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Create Store
                        </Title>
                    </Col>
                    <Col offset={6} span={2}>
                        <Button icon={<PlusCircleOutlined />} style={{ marginRight: 0 }} onClick={handleSearch}>
                            Back
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
                        initialValues={{
                            Status: 'true',
                            StoreType: 'Main Store',
                            Status: 'true'
                        }}
                        onFinish={onFinish}
                    >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item label="Store" name="Store"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select>
                                        {DropDown.StoreDetails.map((Option) => (
                                            <Select.Option key={Option.StoreId} value={Option.StateId}>{Option.LongName}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="StoreId" hidden><Input></Input></Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item label='Store Type' name='StoreType'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select>
                                        <Select.Option key='Main Store'>Main Store</Select.Option>
                                        <Select.Option key='Sub Store'>Sub Store</Select.Option>
                                        <Select.Option key='Pharmacy'>Pharmacy</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item label="Remarks Person" name="Remarks">
                                    <TextArea allowClear></TextArea>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="DefaultParentStore" label="Default Parent Store">
                                    <Select>
                                        {DropDown.StoreDetails.map((Option) => (
                                            <Select.Option key={Option.StoreId} value={Option.StateId}>{Option.LongName}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="Status" label="Status"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select>
                                        <Select.Option key='true' value='true'>Active</Select.Option>
                                        <Select.Option key='false' value='false'>Hidden</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="AssociatedProduct" label="Associated Product">
                                    <Input></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="end">
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        {buttonTitle}
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    <Button type="default" onClick={() => onReset(form.getFieldValue('VendorId'))}>
                                        {buttonTitle1}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                        <hr />
                        <Collapse items={items} />
                    </Form>
                </Card>
            </div>
        </Layout>
    )
}

export default CreateStore;