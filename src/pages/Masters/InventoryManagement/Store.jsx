import React, { useState, useEffect } from 'react';
import customAxios from '../../../components/customAxios/customAxios.jsx';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Layout from 'antd/es/layout/layout';
import { useNavigate } from 'react-router';
import { Spin, Skeleton, Tag, Typography, Popconfirm, Select, Button, Form, Input, Row, Col, DatePicker, Card, Divider, Tooltip, Table, Checkbox, message } from 'antd';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { urlStoreIndex } from '../../../../endpoints';
import { useLocation } from "react-router-dom";


const Store = () => {
    const [dataTable, setDataTable] = useState()
    const location = useLocation();
    const [form] = Form.useForm();
    const { Title } = Typography;

    const DateBindtoDatepicker = (value) => {
        const isoDateString = value;
        const dateValue = new Date(isoDateString);
        const formattedDate = dayjs(dateValue).format('DD-MM-YYYY');
        return dayjs(formattedDate, 'DD-MM-YYYY');
    }

    useEffect(() => {        
        try {
            customAxios.get(urlStoreIndex, {}).then((response) => {
                const apiData = response.data.data;
                const menuItems = apiData.StoreDetails.map(item => ({
                    key: item.StoreId,
                    ShortName: item.StoreType,
                    StoreType: item.ShortName,
                    LongName: item.LongName,
                    DefaultParentStore: item.DefaultParentStore,
                    Status: item.Status,
                }));
                setDataTable(menuItems);
            });
        } catch (error) {
            console.error("Error fetching purchase order details:", error);
        }
    }, []);

    const handleAdd = () => {
        navigate("/CreateStore");
    };

    const ModelUpdate = (StoreId) => {        
        navigate("/CreateStore", { state: { StoreId } });
    }

    const columns = [
        {
            title: 'Short Name',
            dataIndex: 'ShortName',
            key: 'ShortName',
        },
        {
            title: 'Long Name',
            dataIndex: 'LongName1',
            key: 'LongName1',
        },
        {
            title: 'Default Parent Store',
            dataIndex: 'DefaultParentStore1',
            key: 'DefaultParentStore1',
        },
        {
            title: 'Status',
            dataIndex: 'Status1',
            key: 'Status1',
        },
        // {
        //     // title: 'Action',
        //     // dataIndex: '',
        //     // key: 'x',
        //     render: () => <Popconfirm title="Sure to edit?" onConfirm={() => ModelUpdate(record.ProductClassificationId)}>
        //         <EditOutlined style={{ marginRight: 4 }} />
        //     </Popconfirm>,
        // },
    ];

    // const columns = [
    //     {
    //         title: "Short Name",
    //         dataIndex: "ShortName",
    //         key: "ShortName",
    //         sorter: (a, b) => a.ShortName - b.ShortName,
    //         sortDirections: ["descend", "ascend"],
    //     },
    //     {
    //         title: "Long Name",
    //         dataIndex: "LongName",
    //         key: "LongName",
    //         sorter: (a, b) => a.LongName.localeCompare(b.LongName),
    //         sortDirections: ["descend", "ascend"],
    //     },
    //     {
    //         title: "Default Parent Store",
    //         dataIndex: "DefaultParentStore",
    //         key: "DefaultParentStore",
    //         sorter: (a, b) => new Date(a.DefaultParentStore) - new Date(b.DefaultParentStore),
    //         sortDirections: ["descend", "ascend"],
    //     },
    //     {
    //         title: "Status",
    //         dataIndex: "Status",
    //         key: "Status",
    //         sorter: (a, b) => a.Status.localeCompare(b.Status),
    //         sortDirections: ["descend", "ascend"],
    //     },
    //     {
    //         render: (text, record) => {
    //             return (
    //                 <Popconfirm title="Sure to edit?" onConfirm={() => ModelUpdate(record.ProductClassificationId)}>
    //                     <EditOutlined style={{ marginRight: 4 }} />
    //                 </Popconfirm>
    //             )
    //         }
    //     }
    //     // {
    //     //   title: "Actions",
    //     //   dataIndex: "actions",
    //     //   key: "actions",
    //     //   render: (_, row) => (
    //     //     <>
    //     //       <Tooltip title="Edit">
    //     //         <Button icon={<EditOutlined />} onClick={() => handleEdit(row)} />
    //     //       </Tooltip>
    //     //       <Tooltip title="Delete">
    //     //         <Button
    //     //           icon={<DeleteOutlined />}
    //     //           onClick={() => handleDelete(row)}
    //     //         />
    //     //       </Tooltip>
    //     //     </>
    //     //   ),
    //     // },
    // ];

    const navigate = useNavigate();
    const handleSearch = () => {
        navigate('/VendorSearch');
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

    const handleState = (CountryId) => {
        setState({ StateModel: [] });
        setPlace({ PlaceModels: [] });
        setArea({ AreaModel: [] });
        form.setFieldsValue({ State: '' });
        form.setFieldsValue({ Place: '' });
        form.setFieldsValue({ Area: '' });
        customAxios.get(`${urlGetStatesView}?CountryId=${CountryId}&Type=${1}`).then((response) => {
            const apiData = response.data.data;
            setState(apiData);
        });
    }

    const handlePlace = (StateId) => {
        setPlace({ PlaceModels: [] });
        setArea({ AreaModel: [] });
        form.setFieldsValue({ Place: '' });
        form.setFieldsValue({ Area: '' });
        customAxios.get(`${urlGetPlaceView}?StateId=${StateId}&Type=${1}`).then((response) => {
            const apiData = response.data.data;
            setPlace(apiData);
        });
    }

    const handleArea = (PlaceId) => {
        setArea({ AreaModel: [] });
        form.setFieldsValue({ Area: '' });
        customAxios.get(`${urlGetAreaView}?PlaceId=${PlaceId}&Type=${1}`).then((response) => {
            const apiData = response.data.data;
            setArea(apiData);
        });
    }

    const disabledEffectiveToDate = (current) => {
        debugger;
        const effectiveFrom = form.getFieldValue('EffectiveFrom');
        if (!effectiveFrom) {
            return false;
        }
        return current && current < effectiveFrom.startOf('day');
    };

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Store
                        </Title>
                    </Col>
                    <Col offset={6} span={2}>
                        <Button icon={<PlusCircleOutlined />} style={{ marginRight: 0 }} onClick={handleAdd}>
                            Add Store
                        </Button>
                    </Col>
                </Row>
                <Card>
                    <Table columns={columns}
                        expandable={{
                            expandedRowRender: (record) => (
                                <div style={{ display: 'flex' }}>
                                    <div style={{ marginLeft: 50 }}>{record.StoreType}</div>
                                    <div style={{ marginLeft: 320 }}>{record.LongName}</div>
                                    <div style={{ marginLeft: 300 }}>{record.DefaultParentStore}</div>
                                    <div style={{ marginLeft: 450 }}>{record.Status}</div>
                                    <div style={{ marginLeft: 30 }}><Popconfirm title="Sure to edit?" onConfirm={() => ModelUpdate(record.key)}>
                                        <EditOutlined style={{ marginRight: '4px' }} />
                                    </Popconfirm></div>
                                </div>
                            ),
                        }}
                        dataSource={dataTable} />
                </Card>
            </div>
        </Layout>
    )
}

export default Store;