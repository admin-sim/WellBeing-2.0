import {
    Tabs,
    Button,
    Col,
    Popconfirm,
    DatePicker,
    Form,
    Input,
    Modal,
    message,
    Row,
    Select,
    Spin,
    InputNumber,
} from "antd";
import CustomTable from "../../../../components/customTable/index.jsx";
import {
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import React, { useEffect, useState } from "react";
import PatientHeader from "../../../../components/PatientHeader";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlAddNewFluidChart, urlGetSpecificFluidChartForEdit, urlDeleteSpecificFluidChart } from "../../../../../endpoints.js";
import dayjs from "dayjs";

function FluidChartModal({ bed, patient, Dropdown, open, handleClose }) {
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form3] = Form.useForm();
    const [buttonTitle, setButtonTitle] = useState('Save')
    const [tableData, setTableData] = useState()
    const [activeTabKey, setActiveTabKey] = useState("1");
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)

    const handleCancel = () => {
        form.resetFields();
        setButtonTitle('Save')
        setActiveTabKey("1")
        handleClose();
        setLoading(false)
        setPageLoading(false)
    };

    const handleReset = () => {
        form.resetFields();
        setButtonTitle('Save')
        form1.resetFields();
    }

    const FluidEdit = async (id, id1, id2, id4) => {
        debugger
        setPageLoading(true)
        if (id1 === id2) {
            const response = await customAxios.get(
                `${urlGetSpecificFluidChartForEdit}?Id=${id}`);
            if (response.status === 200) {
                const formdata = response.data.data
                if (id4 === 1) {
                    setButtonTitle('Update')
                    form.setFieldsValue({
                        NatureOfFluid: formdata.Fluidid,
                        Route: formdata.Route,
                        Volume: formdata.RouteData,
                        UomId: formdata.InputUom,
                        NrInitials: formdata.NurseInitialString,
                        NurseInitial: formdata.NurseInitial,
                        Remarks: formdata.Remarks,
                        Id: formdata.Id,
                        DrugChartId: formdata.DrugChartId
                    });
                } else {
                    setButtonTitle('Update')
                    form1.setFieldsValue({
                        NrInitials: formdata.NurseInitialString,
                        NurseInitial: formdata.NurseInitial,
                        // DateString: values.Date.format('DD-MM-YYYY'),
                        // TimeString: values.Date.format('HH:mm:ss'),
                        Rectal: formdata.Rectal ? parseInt(formdata.Rectal) : undefined,
                        RectalUom: formdata.RectalUom != 0 ? formdata.RectalUom : undefined,
                        Urine: formdata.Urine ? parseInt(formdata.Urine) : undefined,
                        Diarrhoea: formdata.Diarrhoea ? parseInt(formdata.Diarrhoea) : undefined,
                        Vomit: formdata.Vomit ? parseInt(formdata.Vomit) : undefined,
                        Suction: formdata.Suction ? parseInt(formdata.Suction) : undefined,
                        UrineUom: formdata.UrineUom != 0 ? formdata.UrineUom : undefined,
                        VomitUom: formdata.VomitUom != 0 ? formdata.VomitUom : undefined,
                        DiarrhoeaUom: formdata.DiarrhoeaUom != 0 ? formdata.DiarrhoeaUom : undefined,
                        SuctionUom: formdata.SuctionUom != 0 ? formdata.SuctionUom : undefined,
                        Id1: formdata.Id
                    });
                }
            }
        } else {
            message.warning('Different Users Not Allowed to Modify given Drug.');
            return false;
        }
        setPageLoading(false)
    }

    const FluidDelete = async (id, id1, id2, id4) => {
        debugger
        const PatientId = form.getFieldValue('PatientId')
        const EncounterId = form.getFieldValue('EncounterId')
        setTableData()
        if (id1 === id2) {
            setLoading(true)
            const response = await customAxios.get(
                `${urlDeleteSpecificFluidChart}?Id=${id}&PatientId=${PatientId}&EncounterId=${EncounterId}&Flag=${id4}`);
            if (response.status === 200 && response.data.data != null) {
                message.success('Deleted')
                handleReset()
                setTableData(response.data.data.FluidChartListModel)
            }
        } else {
            message.warning('Different Users Not Allowed to delete given Drug.');
            return false;
        }
        setLoading(false)
    }

    const DrNoteView = (Id, PatientId) => {
        debugger
    }

    const columns = [
        {
            title: 'Date',
            key: 'DateString',
            dataIndex: 'DateString',
        },
        {
            title: 'Time',
            key: 'Time',
            dataIndex: 'Time'
        },
        {
            title: 'Nr.initials',
            key: 'NurseInitialString',
            dataIndex: 'NurseInitialString'
        },
        {
            title: 'Naature of Fluid',
            key: 'FluidName',
            dataIndex: 'FluidName'
        },
        {
            title: 'Route',
            key: 'RouteName',
            dataIndex: 'RouteName'
        },
        {
            title: 'Volume',
            key: 'RouteData',
            dataIndex: 'RouteData'
        },
        // {
        //     title: 'Action',
        //     key: 'Action',
        //     dataIndex: 'Date',
        //     render: (text, record) => {
        //         return (
        //             <>
        //                 <EditOutlined onClick={() => FluidEdit(record.Id, (Dropdown.NurseName || {}).ProviderId, record.NurseInitial, 1)} />
        //                 <Popconfirm
        //                     title="Sure to delete?"
        //                     onConfirm={() => FluidDelete(record.Id, (Dropdown.NurseName || {}).ProviderId, record.NurseInitial, 1)}
        //                 >
        //                     <DeleteOutlined />
        //                 </Popconfirm>
        //             </>
        //         );
        //     },
        // }
    ]

    const columns1 = [
        {
            title: 'Date',
            key: 'DateString',
            dataIndex: 'DateString',
        },
        {
            title: 'Time',
            key: 'Time',
            dataIndex: 'Time'
        },
        {
            title: 'Nr.initials',
            key: 'NurseInitialString',
            dataIndex: 'NurseInitialString'
        },
        {
            title: 'Rectal',
            key: 'Rectal',
            dataIndex: 'Rectal'
        },
        {
            title: 'Urine',
            key: 'Urine',
            dataIndex: 'Urine'
        },
        {
            title: 'Vomit',
            key: 'Vomit',
            dataIndex: 'Vomit'
        },
        {
            title: 'Diarrhoea',
            key: 'Diarrhoea',
            dataIndex: 'Diarrhoea'
        },
        {
            title: 'Suction',
            key: 'Suction',
            dataIndex: 'Suction'
        },
        // {
        //     title: 'Action',
        //     key: 'Action',
        //     dataIndex: 'Date',
        //     render: (text, record) => {
        //         return (
        //             <>
        //                 <EditOutlined onClick={() => FluidEdit(record.Id, (Dropdown.NurseName || {}).ProviderId, record.NurseInitial, 2)} />
        //                 <Popconfirm
        //                     title="Sure to delete?"
        //                     onConfirm={() => FluidDelete(record.Id, (Dropdown.NurseName || {}).ProviderId, record.NurseInitial, 2)}
        //                 >
        //                     <DeleteOutlined />
        //                 </Popconfirm>
        //             </>
        //         );
        //     },
        // }
    ]

    const columns2 = [
        {
            title: 'Date',
            key: 'DateString',
            dataIndex: 'DateString',
        },
        {
            title: 'Time',
            key: 'Time',
            dataIndex: 'Time'
        },
        {
            title: 'Nr.initials',
            key: 'NurseInitialString',
            dataIndex: 'NurseInitialString'
        },
        {
            title: 'Naature of Fluid',
            key: 'NaatureofFluid',
            dataIndex: 'FluidName'
        },
        {
            title: 'Route',
            key: 'RouteName',
            dataIndex: 'RouteName'
        },
        {
            title: 'Volume',
            key: 'Volume',
            dataIndex: 'RouteData'
        },
    ]

    const columns3 = [
        {
            title: 'Date',
            key: 'DateString',
            dataIndex: 'DateString',
        },
        {
            title: 'Time',
            key: 'Time',
            dataIndex: 'Time'
        },
        {
            title: 'Nr.initials',
            key: 'NurseInitialString',
            dataIndex: 'NurseInitialString'
        },
        {
            title: 'Rectal',
            key: 'Rectal',
            dataIndex: 'Rectal'
        },
        {
            title: 'Urine',
            key: 'Urine',
            dataIndex: 'Urine'
        },
        {
            title: 'Vomit',
            key: 'Vomit',
            dataIndex: 'Vomit'
        },
        {
            title: 'Diarrhoea',
            key: 'Diarrhoea',
            dataIndex: 'Diarrhoea'
        },
        {
            title: 'Suction',
            key: 'Suction',
            dataIndex: 'Suction'
        },
    ]

    const columns4 = [
        {
            title: 'Date',
            key: 'DateString',
            dataIndex: 'DateString',
        },
        {
            title: 'Time',
            key: 'Time',
            dataIndex: 'Time'
        },
        {
            title: 'View',
            key: 'View',
            dataIndex: 'View',
            render: (text, record) => {
                return (
                    <>
                        <Button type="like" onClick={() => DrNoteView(record.DrNoteId, form3.getFieldValue('PatientId'), form3.getFieldValue('EncouterId'))}>View</Button>
                    </>
                );
            },
        },
    ]

    const TabTitle = (key) => {
        switch (key) {
            case "1":
                return 'InTake Details'
            case "2":
                return 'Output Details'
            case '3':
                return 'InTake/Output Details'
            default:
                return 'Doctor Notes'
        }
    }

    const items = new Array(4).fill(null).map((_, i) => {
        const id = String(i + 1);
        return {
            label: TabTitle(id),
            key: id,
        };
    });

    const handleTabChange = (key) => {
        setButtonTitle('Save')
        form.resetFields()
        form1.resetFields()
        setActiveTabKey(key);
    };

    return (
        <div>
            <Modal
                width={"80%"}
                height={"auto"}
                centered
                title={
                    <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                        Fluid Chart
                    </span>
                }
                open={open}
                maskClosable={false}
                footer={null}
                onCancel={handleCancel}
            >
                <PatientHeader patient={patient} />
                <Tabs style={{ marginTop: 20 }} type="card" activeKey={activeTabKey} items={items} onChange={handleTabChange} />
                {activeTabKey === "1" && (
                    <>
                        <Spin spinning={pageLoading}>
                            <Form
                                style={{ marginTop: "1rem" }}
                                layout="vertical"
                                form={form}
                                onFinish={async (values) => {
                                    debugger
                                    setLoading(true)
                                    setTableData()
                                    const Intake = {
                                        Route: values.Route,
                                        NurseInitial: values.NurseInitial,
                                        DateString: values.Date ? values.Date.format('DD-MM-YYYY') : '',
                                        TimeString: values.Date ? values.Date.format('HH:mm:ss') : '',
                                        Fluidid: values.NatureOfFluid,
                                        RouteData: String(values.Volume),
                                        PatientId: values.PatientId,
                                        EncounterId: values.EncounterId,
                                        InputUom: values.UomId,
                                        Type: "IN",
                                        Id: values.Id
                                    }
                                    const response = await customAxios.post(urlAddNewFluidChart, Intake, {
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    });
                                    if (response.status === 200) {
                                        form.resetFields()
                                        setTableData(response.data.data.FluidChartListModel)
                                        setButtonTitle('Save')
                                        setLoading(false)
                                    }
                                }}
                                initialValues={{
                                    Date: dayjs(),
                                    NrInitials: (Dropdown.NurseName || {}).ProviderName,
                                    NurseInitial: (Dropdown.NurseName || {}).ProviderId,
                                    PatientId: (Dropdown.LastEncounter || {}).PatientId,
                                    EncounterId: (Dropdown.LastEncounter || {}).EncounterId,
                                    Id: 0
                                }}
                            >
                                <Row gutter={32}>
                                    <Col span={10}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="Date"
                                            label="Date"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select Reason",
                                                },
                                            ]}
                                        >
                                            <DatePicker
                                                style={{ width: "100%" }}
                                                showTime={{ format: "hh:mm A" }}
                                                format="DD-MM-YYYY , hh:mm A"
                                            />
                                        </Form.Item>
                                        <Form.Item hidden
                                            name="PatientId"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item hidden
                                            name="EncounterId"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item hidden
                                            name="NurseInitial"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item hidden
                                            name="Id"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="NrInitials"
                                            label="NrInitials"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select",
                                                },
                                            ]}
                                        >
                                            <Input disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={9}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="NatureOfFluid"
                                            label="Nature Of Fluid"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select",
                                                },
                                            ]}
                                        >
                                            <Select style={{ width: "100%" }} placeholder='Select' allowClear>
                                                {(Dropdown.NatureOfFluid || []).map(option => (
                                                    <Select.Option key={option.LookupID} value={option.LookupID}>
                                                        {option.LookupDescription}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="Route"
                                            label="Route"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select",
                                                },
                                            ]}
                                        >
                                            <Select placeholder='Select' allowClear>
                                                {(Dropdown.Route || []).map((option) => (
                                                    <Select.Option key={option.LookupID} value={option.LookupID}>
                                                        {option.LookupDescription}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="Volume"
                                            label="Volume"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select",
                                                },
                                            ]}
                                        >
                                            <InputNumber style={{ width: '100%' }} min={0} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="UomId"
                                            label="Uom"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select",
                                                },
                                            ]}
                                        >
                                            <Select style={{ width: "100%" }} placeholder='Select' allowClear>
                                                {(Dropdown.UomModel || []).map(option => (
                                                    <Select.Option key={option.UomId} value={option.UomId}>
                                                        {option.ShortName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col offset={17} span={3}>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" loading={loading}>
                                                {buttonTitle}
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                    <Col span={3}>
                                        <Form.Item>
                                            <Button type="default" danger onClick={buttonTitle === 'Save' ? handleClose : handleReset}>
                                                {buttonTitle === 'Save' ? 'Cancel' : 'Reset'}
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Spin>
                        <CustomTable
                            dataSource={tableData ? (tableData || []).filter((item) => item.Type === 'IN') : (Dropdown.FluidChartListModel || []).filter((item) => item.Type === 'IN')}
                            columns={columns}
                            isFilter={true}
                            onEdit={(record) => FluidEdit(record.Id, (Dropdown.NurseName || {}).ProviderId, record.NurseInitial, 1)}
                            onDelete={(record) => FluidDelete(record.Id, (Dropdown.NurseName || {}).ProviderId, record.NurseInitial, 1)}
                            bordered
                            loading={loading}
                        />
                    </>
                )}
                {activeTabKey == '2' && (
                    <>
                        <Spin spinning={pageLoading}>
                            <Form
                                style={{ marginTop: "1rem" }}
                                layout="vertical"
                                form={form1}
                                onFinish={async (values) => {
                                    debugger
                                    setLoading(true)
                                    setTableData()
                                    const output = {
                                        NurseInitial: values.NurseInitial,
                                        DateString: values.Date.format('DD-MM-YYYY'),
                                        TimeString: values.Date.format('HH:mm:ss'),
                                        PatientId: values.PatientId,
                                        Rectal: values.Rectal ? String(values.Rectal) : undefined,
                                        RectalUom: values.RectalUom,
                                        Urine: values.Urine ? String(values.Urine) : undefined,
                                        Diarrhoea: values.Diarrhoea ? String(values.Diarrhoea) : undefined,
                                        Vomit: values.Vomit ? String(values.Vomit) : undefined,
                                        Suction: values.Suction ? String(values.Suction) : undefined,
                                        EncounterId: values.EncounterId,
                                        UrineUom: values.UrineUom,
                                        VomitUom: values.VomitUom,
                                        DiarrhoeaUom: values.DiarrhoeaUom,
                                        SuctionUom: values.SuctionUom,
                                        Type: "OUT",
                                        Id: values.Id1
                                    }
                                    const response = await customAxios.post(urlAddNewFluidChart, output, {
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    });
                                    if (response.status === 200) {
                                        form1.resetFields()
                                        setTableData(response.data.data.FluidChartListModel)
                                        setButtonTitle('Save')
                                        setLoading(false)
                                    }
                                }}
                                initialValues={{
                                    Date: dayjs(),
                                    NrInitials: (Dropdown.NurseName || {}).ProviderName,
                                    NurseInitial: (Dropdown.NurseName || {}).ProviderId,
                                    PatientId: (Dropdown.LastEncounter || {}).PatientId,
                                    EncounterId: (Dropdown.LastEncounter || {}).EncounterId,
                                    Id1: 0
                                }}
                            >
                                <Row gutter={32}>
                                    <Col span={10}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="Date"
                                            label="Date"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select Reason",
                                                },
                                            ]}
                                        >
                                            <DatePicker
                                                style={{ width: "100%" }}
                                                showTime={{ format: "hh:mm A" }}
                                                format="DD-MM-YYYY , hh:mm A"
                                            />
                                        </Form.Item>
                                        <Form.Item hidden
                                            name="PatientId"
                                            initialValue={(Dropdown.LastEncounter || []).PatientId}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item hidden
                                            name="EncounterId"
                                            initialValue={(Dropdown.LastEncounter || []).EncounterId}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item hidden
                                            name="Id1"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item hidden
                                            name="NurseInitial"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="NrInitials"
                                            label="NrInitials"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select",
                                                },
                                            ]}
                                        >
                                            <Input disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="Rectal"
                                            label="Rectal"
                                        >
                                            <InputNumber min={0} style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="RectalUom"
                                            label="RectalUom"
                                        >
                                            <Select placeholder='Select' allowClear>
                                                {(Dropdown.UomModel || []).map((option) => (
                                                    <Select.Option key={option.UomId} value={option.UomId}>
                                                        {option.ShortName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="Urine"
                                            label="Urine"
                                        >
                                            <InputNumber style={{ width: '100%' }} min={0} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="UrineUom"
                                            label="UrineUom"
                                        >
                                            <Select style={{ width: "100%" }} placeholder='Select' allowClear>
                                                {(Dropdown.UomModel || []).map(option => (
                                                    <Select.Option key={option.UomId} value={option.UomId}>
                                                        {option.ShortName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="Vomit"
                                            label="Vomit"
                                        >
                                            <InputNumber style={{ width: '100%' }} min={0} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="VomitUom"
                                            label="VomitUom"
                                        >
                                            <Select style={{ width: "100%" }} placeholder='Select' allowClear>
                                                {(Dropdown.UomModel || []).map(option => (
                                                    <Select.Option key={option.UomId} value={option.UomId}>
                                                        {option.ShortName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="Diarrhoea"
                                            label="Diarrhoea"
                                        >
                                            <InputNumber style={{ width: '100%' }} min={0} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="DiarrhoeaUom"
                                            label="DiarrhoeaUom"
                                        >
                                            <Select style={{ width: "100%" }} placeholder='Select' allowClear>
                                                {(Dropdown.UomModel || []).map(option => (
                                                    <Select.Option key={option.UomId} value={option.UomId}>
                                                        {option.ShortName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="Suction"
                                            label="Suction"
                                        >
                                            <InputNumber style={{ width: '100%' }} min={0} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            style={{ marginBottom: "0.5rem" }}
                                            name="SuctionUom"
                                            label="SuctionUom"
                                        >
                                            <Select style={{ width: "100%" }} placeholder='Select' allowClear>
                                                {(Dropdown.UomModel || []).map(option => (
                                                    <Select.Option key={option.UomId} value={option.UomId}>
                                                        {option.ShortName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col offset={17} span={3}>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" loading={loading}>
                                                {buttonTitle}
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                    <Col span={3}>
                                        <Form.Item hidden={buttonTitle === 'Save' ? true : false}>
                                            <Button type="default" danger onClick={handleReset}>
                                                Cancel
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Spin>
                        <CustomTable
                            dataSource={(tableData ? (tableData || []).filter((item) => item.Type === 'OUT') :
                                Dropdown.FluidChartListModel || []).filter((item) => item.Type === 'OUT')}
                            columns={columns1}
                            isFilter={true}
                            bordered
                            loading={loading}
                            onEdit={(record) => FluidEdit(record.Id, (Dropdown.NurseName || {}).ProviderId, record.NurseInitial, 2)}
                            onDelete={(record) => FluidDelete(record.Id, (Dropdown.NurseName || {}).ProviderId, record.NurseInitial, 2)}
                        />
                    </>
                )}
                {activeTabKey == '3' && (
                    <Row>
                        <Col span={12}>
                            <CustomTable
                                dataSource={(tableData ? (tableData || []).filter((item) => item.Type === 'IN') :
                                    Dropdown.FluidChartListModel || []).filter((item) => item.Type === 'IN')}
                                columns={columns2}
                                isFilter={true}
                                actionColumn={false}
                                bordered
                            />
                        </Col>
                        <Col span={12}>
                            <CustomTable
                                dataSource={(tableData ? (tableData || []).filter((item) => item.Type === 'OUT') :
                                    Dropdown.FluidChartListModel || []).filter((item) => item.Type === 'OUT')}
                                columns={columns3}
                                isFilter={true}
                                actionColumn={false}
                                bordered
                            />
                        </Col>
                    </Row>
                )}
                {activeTabKey == '4' && (
                    <Form
                        style={{ marginTop: "1rem" }}
                        layout="vertical"
                        form={form3}
                        onFinish={() => {
                            debugger
                        }}
                    >
                        <Form.Item hidden
                            name="PatientId"
                            initialValue={(Dropdown.LastEncounter || []).PatientId}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item hidden
                            name="EncounterId"
                            initialValue={(Dropdown.LastEncounter || []).EncounterId}
                        >
                            <Input />
                        </Form.Item>
                        <CustomTable
                            dataSource={(Dropdown.DrNotesList || [])}
                            columns={columns4}
                            isFilter={true}
                            actionColumn={false}
                            bordered
                        />
                    </Form>
                )}
                {/* <Table columns={columns} dataSource={tableData ? tableData : Dropdown.DrugListModel} /> */}
            </Modal>
        </div >
    );
}

export default FluidChartModal;
