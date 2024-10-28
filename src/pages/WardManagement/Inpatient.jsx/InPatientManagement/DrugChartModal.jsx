import {
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
    AutoComplete,
    Table,
    InputNumber,
    Spin,
} from "antd";

import {
    EditOutlined,
    DeleteOutlined,
    CloseSquareFilled
} from "@ant-design/icons";

import React, { useEffect, useState } from "react";
import PatientHeader from "../../../../components/PatientHeader";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlGetSpecificDrugForEdit, urlAddNewDrugChart, urlUpdateDrugChart, urlGetProducts, urlDeleteSpecificDrug } from "../../../../../endpoints.js";
import dayjs from "dayjs";
import CustomTable from "../../../../components/customTable/index.jsx";

function DrugChartModal({ bed, patient, Dropdown, open, handleClose }) {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState(Dropdown.DrugListModel)
    const [buttonTitle, setButtonTitle] = useState('Save')
    const [productOptions, setProductOptions] = useState([]);
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)

    const handleCancel = () => {
        form.resetFields();
        setProductOptions([])
        setButtonTitle('Save')
        handleClose();
    };

    const handleReset = () => {
        form.resetFields()
        setLoading(false)
        setButtonTitle('Save')
    }

    const onFinish = async (values) => {
        debugger
        setLoading(true)
        const form = {
            DateString: values.Date ? values.Date.format('DD-MM-YYYY') : '',
            TimeString: values.Date ? values.Date.format('HH:mm:ss') : '',
            Dose: values.Dose,
            DrugId: values.DrugId,
            DrugName: values.DrugName,
            DrugId: values.DrugId,
            NurseInitial: values.NurseInitial,
            PatientId: values.PatientId,
            Route: values.Route,
            UomId: values.UomId,
            EncounterId: values.EncounterId,
            Remarks: values.Remarks ? values.Remarks : '',
            DrugChartId: values.DrugChartId
        }
        const url = values.DrugChartId ? urlUpdateDrugChart : urlAddNewDrugChart
        const response = await customAxios.post(url, form, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200 && response.data.data != null) {
            handleReset()
            setButtonTitle('Save')
            message.success('Success')
            setTableData(response.data.data.DrugListModel)
        }
    }

    const DrugEdit = async (id, id1, id2, id3) => {
        debugger
        setPageLoading(true)
        if (id2 === id3) {
            const response = await customAxios.get(
                `${urlGetSpecificDrugForEdit}?DrugChartId=${id}&DrugId=${id1}`);
            if (response.status === 200 && response.data.data != null) {
                setButtonTitle('Update')
                const formdata = response.data.data
                form.setFieldsValue({
                    DrugName: formdata.DrugName,
                    Route: formdata.Route,
                    Dose: formdata.Dose,
                    UomId: formdata.UomId,
                    NrInitials: formdata.NurseInitialString,
                    NurseInitial: formdata.NurseInitial,
                    Remarks: formdata.Remarks,
                    DrugId: formdata.DrugId,
                    DrugChartId: formdata.DrugChartId
                });
            }
        } else {
            message.warning('Different Users Not Allowed to Modify given Drug.');
            return false;
        }
        setPageLoading(false)
    }

    const DrugDelete = async (id, id1, id2) => {
        debugger
        const PatientId = form.getFieldValue('PatientId')
        const EncounterId = form.getFieldValue('EncounterId')
        if (id1 === id2) {
            const response = await customAxios.get(
                `${urlDeleteSpecificDrug}?DrugChartId=${id}&PatientId=${PatientId}&EncounterId=${EncounterId}`);
            if (response.status === 200 && response.data.data != null) {
                message.success('Deleted')
                handleReset()
                setTableData(response.data.data.DrugListModel)
            }
        } else {
            message.warning('Different Users Not Allowed to delete given Drug.');
            return false;
        }
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
            title: 'DrugName',
            key: 'DrugName',
            dataIndex: 'DrugName'
        },
        {
            title: 'Route',
            key: 'RouteName',
            dataIndex: 'RouteName'
        },
        {
            title: 'Dosage',
            key: 'Uom',
            dataIndex: 'Uom'
        },
        {
            title: 'Nr.initials',
            key: 'NurseInitialString',
            dataIndex: 'NurseInitialString'
        },
        {
            title: 'Remarks',
            key: 'Remarks',
            dataIndex: 'Remarks'
        },
        // {
        //     title: 'Action',
        //     key: 'Action',
        //     dataIndex: 'Date',
        //     render: (text, record) => {
        //         return (
        //             <>
        //                 <EditOutlined onClick={() => DrugEdit(record.DrugChartId, record.DrugId, (Dropdown.NurseName || {}).ProviderId, record.NurseInitial)} />
        //                 <Popconfirm
        //                     title="Sure to delete?"
        //                     onConfirm={() => DrugDelete(record.DrugChartId, (Dropdown.NurseName || {}).ProviderId, record.NurseInitial)}
        //                 >
        //                     <DeleteOutlined />
        //                 </Popconfirm>
        //             </>
        //         );
        //     },
        // }
    ]

    const handleSearch = async (searchText) => {
        if (searchText) {
            const response = await customAxios.get(`${urlGetProducts}?Product=${searchText}`);
            const apiData = response.data.data;
            const newOptions = apiData.map((item) => ({
                value: item.LongName,
                key: item.ProductDefinitionId,
            }));
            setProductOptions(newOptions);
        }
    }

    const handleSelect = (value, option) => {
        form.setFieldsValue({ DrugId: option.key })
    };

    return (
        <div>
            <Modal
                width={"70%"}
                height={"auto"}
                centered
                title={
                    <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                        Drug Chart
                    </span>
                }
                open={open}
                maskClosable={false}
                footer={null}
                onCancel={handleCancel}
            >
                <PatientHeader patient={patient} />
                <Row gutter={16}>
                    <Spin spinning={pageLoading}>
                        <Form
                            style={{ marginTop: "1rem" }}
                            layout="vertical"
                            form={form}
                            onFinish={onFinish}
                            initialValues={{
                                Date: dayjs(),
                                NrInitials: (Dropdown.NurseName || {}).ProviderName,
                                NurseInitial: (Dropdown.NurseName || {}).ProviderId
                            }}
                        >
                            <Row gutter={32}>
                                <Col span={8}>
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
                                            format="dddd , DD-MM-YYYY , hh:mm A"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
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
                                        name="DrugId"
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item hidden
                                        name="DrugChartId"
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item hidden
                                        name="NurseInitial"
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ marginBottom: "0.5rem" }}
                                        name="DrugName"
                                        label="DrugName"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please select Reason",
                                            },
                                        ]}
                                    >
                                        <AutoComplete
                                            options={productOptions}
                                            onSearch={handleSearch}
                                            onSelect={(value, option) =>
                                                handleSelect(value, option)
                                            }
                                            onChange={(value) => {
                                                if (!value) {
                                                    setProductOptions([]);
                                                }
                                            }}
                                            allowClear={{
                                                clearIcon: <CloseSquareFilled />,
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
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
                                <Col span={4}>
                                    <Form.Item
                                        style={{ marginBottom: "0.5rem" }}
                                        name="Dose"
                                        label="Dose"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please select Reason",
                                            },
                                        ]}
                                    >
                                        <InputNumber max={30} min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
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
                                <Col span={4}>
                                    <Form.Item
                                        style={{ marginBottom: "0.5rem" }}
                                        name="NrInitials"
                                        label="NrInitials"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        style={{ marginBottom: "0.5rem" }}
                                        name="Remarks"
                                        label="Remarks"
                                    >
                                        <Input allowClear />
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
                                        <Button type="default" danger onClick={buttonTitle === 'Save' ? handleCancel : handleReset}>
                                            {buttonTitle === 'Save' ? 'Cancel' : 'Reset'}
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Row>
                <CustomTable columns={columns} dataSource={tableData ? tableData : Dropdown.DrugListModel}
                    onDelete={(record) => DrugDelete(record.DrugChartId, (Dropdown.NurseName || {}).ProviderId, record.NurseInitial)}
                    onEdit={(record) => DrugEdit(record.DrugChartId, record.DrugId, (Dropdown.NurseName || {}).ProviderId, record.NurseInitial)}
                    loading={loading} />
            </Modal>
        </div >
    );
}

export default DrugChartModal;
