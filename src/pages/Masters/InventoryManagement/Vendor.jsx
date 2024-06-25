import React, { useState, useEffect } from 'react';
import customAxios from '../../../components/customAxios/customAxios.jsx';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Layout from 'antd/es/layout/layout';
import { useNavigate } from 'react-router';
import { Spin, Skeleton, Tag, Typography, Select, Button, Form, Input, Row, Col, DatePicker, Card, Divider, Tooltip, Table, Checkbox, message } from 'antd';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { urlVendorIndex, urlGetStatesView, urlGetPlaceView, urlGetAreaView, urlEditVendor, urlUpdateVendorDetails, urlAddNewVendor } from '../../../../endpoints';
import { useLocation } from "react-router-dom";


const Vendor = () => {
    const [DropDown, setDropDown] = useState({
        Countries: [],
    });
    const location = useLocation();
    const [vendorId, setVendorId] = useState(location.state == null ? 0 : location.state.VendorId);
    const [state, setState] = useState({ StateModel: [] });
    const [place, setPlace] = useState({ PlaceModels: [] });
    const [area, setArea] = useState({ AreaModel: [] });
    const [buttonTitle, setButtonTitle] = useState('Submit');
    const [buttonTitle1, setButtonTitle1] = useState('Reset');
    const [form] = Form.useForm();
    const { Title } = Typography;

    useEffect(() => {
        customAxios.get(urlVendorIndex).then((response) => {
            const apiData = response.data.data;
            setDropDown(apiData);
        });
        if (vendorId > 0) {
            setButtonTitle('Update')
            setButtonTitle1('Back')
            form.setFieldsValue({ VendorId: vendorId })
            customAxios.get(`${urlEditVendor}?VendorId=${vendorId}`).then((response) => {
                debugger;
                const apiData = response.data.data;
                if (apiData.States != null) {
                    setState(prevState => ({
                        ...prevState,
                        StateModel: apiData.States
                    }));
                }
                if (apiData.Places != null) {
                    setPlace(prevPlace => ({
                        ...prevPlace,
                        PlaceModels: apiData.Places
                    }));
                }
                if (apiData.Areas != null) {
                    setArea(prevArea => ({
                        ...prevArea,
                        AreaModel: apiData.Areas
                    }));
                }
                if (apiData.NewVendorModel != null) {
                    form.setFieldsValue({ VendorId: apiData.NewVendorModel.VendorId })
                    form.setFieldsValue({ ShortName: apiData.NewVendorModel.ShortName })
                    form.setFieldsValue({ LongName: apiData.NewVendorModel.LongName })
                    form.setFieldsValue({ ContactPerson: apiData.NewVendorModel.ContactPerson })
                    form.setFieldsValue({ VendorGroup: apiData.NewVendorModel.VendorGroup })
                    form.setFieldsValue({ EffectiveFrom: DateBindtoDatepicker(apiData.NewVendorModel.EffectiveFrom) })
                    form.setFieldsValue({ EffectiveTo: DateBindtoDatepicker(apiData.NewVendorModel.EffectiveTo) })
                    form.setFieldsValue({ Status: apiData.NewVendorModel.ActiveFlag ? 'true' : 'false' })
                    form.setFieldsValue({ isSupplier: apiData.NewVendorModel.IsSupplier })
                    form.setFieldsValue({ isManufacturer: apiData.NewVendorModel.IsManufacturer })
                    form.setFieldsValue({ Address: apiData.NewVendorModel.Address1 })
                    form.setFieldsValue({ Mobile: apiData.NewVendorModel.MobileNumber })
                    form.setFieldsValue({ Landline: apiData.NewVendorModel.LandlineNumber })
                    form.setFieldsValue({ Country: apiData.NewVendorModel.CountryId })
                    form.setFieldsValue({ State: apiData.NewVendorModel.StateId })
                    form.setFieldsValue({ Place: apiData.NewVendorModel.Place })
                    form.setFieldsValue({ Email: apiData.NewVendorModel.EmailId })
                    form.setFieldsValue({ Area: apiData.NewVendorModel.Area })
                    form.setFieldsValue({ CreditDays: apiData.NewVendorModel.CreditDays })
                    form.setFieldsValue({ Zip: apiData.NewVendorModel.PinCode })
                }
            });
        }
        setVendorId(0);
    });

    const DateBindtoDatepicker = (value) => {
        const isoDateString = value;
        const dateValue = new Date(isoDateString);
        const formattedDate = dayjs(dateValue).format('DD-MM-YYYY');
        return dayjs(formattedDate, 'DD-MM-YYYY');
    }

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
                            Vendor
                        </Title>
                    </Col>
                    <Col offset={6} span={2}>
                        <Button icon={<PlusCircleOutlined />} style={{ marginRight: 0 }} onClick={handleSearch}>
                            Search
                        </Button>
                    </Col>
                </Row>
                <Card>
                    <Form
                        form={form}
                        initialValues={{
                            EffectiveTo: dayjs(),
                            EffectiveFrom: dayjs().subtract(1, 'day'),
                            Status: 'true',
                            VendorGroup: 'Local Suppliers'
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
                                <Form.Item label="Short Name" name="ShortName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Input type="text" allowClear></Input>
                                </Form.Item>
                                <Form.Item name="VendorId" hidden><Input></Input></Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label='Long Name' name='LongName'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Input type="text" allowClear></Input>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Contact Person" name="ContactPerson">
                                    <Input type="text" allowClear></Input>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="VendorGroup" label="Vendor Group"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select>
                                        <Select.Option key='Local Suppliers' value='Local Suppliers'></Select.Option>
                                        <Select.Option key='Overseas Suppliers' value='Overseas Suppliers'></Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="EffectiveFrom" label="Effective From"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                    onChange={() => form.validateFields(['EffectiveTo'])}
                                >
                                    <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY'></DatePicker>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="EffectiveTo" label="Effective To"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY'
                                        disabledDate={disabledEffectiveToDate}></DatePicker>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Status" name="Status"
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
                            <Col className="gutter-row" span={3}>
                                <Form.Item label="isSupplier" name="isSupplier" valuePropName="checked">
                                    <Checkbox />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <Form.Item label="isManufacturer" name="isManufacturer" valuePropName="checked">
                                    <Checkbox />
                                </Form.Item>
                            </Col>
                        </Row>
                        <hr />
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={12}>
                                <Form.Item name="Address" label="Address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <TextArea allowClear></TextArea>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="Mobile" label="Mobile"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Input allowClear></Input>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Landline" name="Landline">
                                    <Input allowClear></Input>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Country" name="Country"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select onChange={handleState}>
                                        {DropDown.Countries.map((Option) => (
                                            <Select.Option key={Option.LookupID} value={Option.LookupID}>
                                                {Option.LookupDescription}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="State" name="State"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select onChange={handlePlace}>
                                        {state.StateModel.map((Option) => (
                                            <Select.Option key={Option.StateID} value={Option.StateID}>
                                                {Option.StateName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Email" name="Email">
                                    <Input allowClear></Input>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}></Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Place" name="Place"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select onChange={handleArea}>
                                        {place.PlaceModels.map((Option) => (
                                            <Select.Option key={Option.PlaceId} value={Option.PlaceId}>
                                                {Option.PlaceName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Area" name="Area"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select>
                                        {area.AreaModel.map((Option) => (
                                            <Select.Option key={Option.AreaId} value={Option.AreaId}>
                                                {Option.AreaName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}></Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Zip" name="Zip">
                                    <Input allowClear></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        <hr />
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Credit Days" name="CreditDays">
                                    <Input allowClear></Input>
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
                    </Form>
                </Card>
            </div>
        </Layout>
    )
}

export default Vendor;