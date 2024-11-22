import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, InputNumber, Row, Select, Spin, Tabs, Layout, Input, AutoComplete, message, Popconfirm, Tooltip, Card, Checkbox, DatePicker } from "antd";
import Title from "antd/es/typography/Title";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import PageHeader from '../../../../components/PageHeader/index.jsx'
import React, { useEffect, useState } from "react";
import {
    urlAdditionalChargeCreate, urlSaveNewAdditionalCharge, urlAddNewRule, urlAdditionalChargeEdit, urlUpdateAdditionalCharge,
    urlDeleteSelectedSurgeryRule, urlDeleteSelectedAssociation, urlDeleteSelectedAdditionalChargeRule, urlAddNewAssociation,
    urlAddNewSurgery
} from "../../../../../endpoints";
import CustomTable from "../../../../components/customTable";
import { useNavigate } from "react-router";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

function CreateAdditionalCharge() {
    const location = useLocation();
    const [showTable, setShowTable] = useState(false)
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState()
    const navigate = useNavigate();
    const AdditionalChargeId = location.state?.AdditionalChargeId;
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [activeTabKey, setActiveTabKey] = useState("1");
    const [additionalChargeType, setAdditionalChargeType] = useState(1)
    const [buttonTitle, setButtonTitle] = useState('Save')
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());
    const [dropdown, setDropdown] = useState({
        AnesthesiaType: [],
        AdditionalChargesRule: [],
        AdditionalChargesAssociation: [],
        AdditionalChargesSurgery: [],
        Services: [],
        SurgeryServices: [],
        SurgeryServices: [],
        AnesthesiaChargeType: [],
        Facilities: [],
        Indicators: [],
    })

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(false);
        try {
            const response = await customAxios.get(`${urlAdditionalChargeCreate}`);
            if (response.status === 200 && response.data.data != null) {
                setDropdown(response.data.data)
            } else {
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        debugger;
        const fetchData1 = async () => {
            if (AdditionalChargeId > 0) {
                setPageLoading(true)
                setButtonTitle('Update')
                try {
                    const response = await customAxios.get(
                        `${urlAdditionalChargeEdit}?AdditionalChargeId=${AdditionalChargeId}`
                    );
                    if (response.status === 200 && response.data.data != null) {
                        const editedCharge = response.data.data.AddNewAdditionalCharges;
                        setDropdown(response.data.data)
                        handleAdditionalChargeType(editedCharge.AdditionalChargeType)
                        form.setFieldsValue({
                            Facility: editedCharge.FacilityId,
                            ShortName: editedCharge.ShortName,
                            LongName: editedCharge.LongName,
                            EffectiveFrom: dayjs(editedCharge.EffectiveFromDate, 'DD-MM-YYYY'),
                            EffectiveTo: dayjs(editedCharge.EffectiveToDate, 'DD-MM-YYYY'),
                            AdditionalChargeType: editedCharge.AdditionalChargeType,
                            TaxType: editedCharge.TaxType,
                            CoveredByPayer: editedCharge.CoveredByPayer,
                            IncludeBonusQuantity: editedCharge.IncludeBonusQuantity,
                            ChargeFromPatientAmt: editedCharge.ChargeFromPatientAmt,
                            //object.Remarks = $("#Remarks").val();
                            IsActive: editedCharge.IsActive,
                            ActiveFlag: true,
                            AdditionalChargeId: editedCharge.AdditionalChargeId
                        });
                    } else {
                        console.error("Failed to fetch patient details");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
                setPageLoading(false)
            } else {
                form.setFieldsValue({ AdditionalChargeId: AdditionalChargeId })
            }
            // Call the fetchData function
        }
        fetchData1();
    }, []);

    const disableFromDate = (current) => {
        // Disable dates that are after today
        return current.isBefore(dayjs().startOf('day'));
    };

    const disableToDate = (current) => {
        // Disable dates that are before the selected fromDate or after today
        return (
            current &&
            current.isBefore(fromDate, "day")
        );
    };

    const columns1 = [
        // {
        //     title: "Sl. No.",
        //     dataIndex: "key",
        //     key: "key",
        // },
        {
            title: "Component Name",
            dataIndex: "ComponentName",
            key: "ComponentName",
        },
        {
            title: "Percentage",
            dataIndex: "ChargeType",
            key: "ChargeType",
        },
        {
            title: "Value",
            dataIndex: "ChargeValue",
            key: "ChargeValue",
        },
        {
            title: "Additional Charge Indicator",
            dataIndex: "AdditionalChargeIndicator",
            key: "AdditionalChargeIndicator",
        },
        // {
        //     title: "To Date",
        //     dataIndex: "EffectiveToDate",
        //     key: "EffectiveToDate",
        // },
        // {
        //     title: "Additional Charge Type",
        //     dataIndex: "AdditionalChargeType",
        //     key: "AdditionalChargeType",
        // },
        // {
        //     title: "Status",
        //     dataIndex: "Status",
        //     key: "Status",
        //     render: (text, record) => (record.Status ? "Active" : "Hidden"),
        // },
        // {
        //     title: '',
        //     dataIndex: 'actions',
        //     key: 'actions',
        //     render: (_, record, index) => (
        //         <span style={{ display: 'flex' }}>
        //             {/* <Tooltip title="Edit">
        //                 <EditOutlined style={{ fontSize: '0.8rem', cursor: 'pointer', marginRight: '10px' }} onClick={() => handleEdit(record.AdditionalChargeId)} />
        //             </Tooltip> */}
        //             {/* <Tooltip title="Delete">
        //                 <DeleteOutlined style={{ fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => handleDeleteRule(record.AdditionalChargeRuleId)} />
        //             </Tooltip> */}
        //             <Popconfirm
        //                 title="Are you sure you want to delete this record?"
        //                 onConfirm={() => handleDeleteRule(record.AdditionalChargeRuleId)}
        //             >
        //                 <Button
        //                     size="small"
        //                     danger
        //                     icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
        //                 ></Button>
        //             </Popconfirm>
        //         </span>
        //     ),
        // },
    ];

    const columns2 = [
        {
            title: "Anesthesia Type",
            dataIndex: "AnesthesiaTypeName",
            key: "AnesthesiaTypeName",
        },
        {
            title: "Charge Type",
            dataIndex: "AnesthesiaChargeTypeName",
            key: "AnesthesiaChargeTypeName",
        },
        {
            title: "Charge Entry Catalog",
            dataIndex: "ChargeEntryCatalogName",
            key: "ChargeEntryCatalogName",
        },
        {
            title: "Percentage / Amount",
            dataIndex: "ChargeType",
            key: "ChargeType",
        },
        {
            title: "Value",
            dataIndex: "ChargeValue",
            key: "ChargeValue",
        },
        {
            title: "Depend on",
            dataIndex: "DependOnServiceName",
            key: "DependOnServiceName",
        },
        // {
        //     title: '',
        //     dataIndex: 'actions',
        //     key: 'actions',
        //     render: (_, record, index) => (
        //         <span style={{ display: 'flex' }}>
        //             {/* <Tooltip title="Edit">
        //                 <EditOutlined style={{ fontSize: '0.8rem', cursor: 'pointer', marginRight: '10px' }} onClick={() => handleEdit(record.AdditionalChargeId)} />
        //             </Tooltip> */}
        //             {/* <Tooltip title="Delete">
        //                 <DeleteOutlined style={{ fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => handleDeleteSurgery(record.SurgeryRuleId)} />
        //             </Tooltip> */}
        //             <Popconfirm
        //                 title="Are you sure you want to delete this record?"
        //                 onConfirm={() => handleDeleteSurgery(record.SurgeryRuleId)}
        //             >
        //                 <Button
        //                     size="small"
        //                     danger
        //                     icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
        //                 ></Button>
        //             </Popconfirm>
        //         </span>
        //     ),
        // },
    ];

    const columns3 = [
        {
            title: "Indicator",
            dataIndex: "IndicatorName",
            key: "IndicatorName",
        },
        {
            title: "Description",
            dataIndex: "DescriptionName",
            key: "DescriptionName",
        },
        {
            title: "Effective From",
            dataIndex: "EffectiveFromDate1",
            key: "EffectiveFromDate1",
        },
        {
            title: "Effective To",
            dataIndex: "EffectiveToDate1",
            key: "EffectiveToDate1",
        },
        // {
        //     title: '',
        //     dataIndex: 'actions',
        //     key: 'actions',
        //     render: (_, record, index) => (
        //         <span style={{ display: 'flex' }}>
        //             {/* <Tooltip title="Edit">
        //                 <EditOutlined style={{ fontSize: '0.8rem', cursor: 'pointer', marginRight: '10px' }} onClick={() => handleEdit(record.AdditionalChargeId)} />
        //             </Tooltip> */}
        //             {/* <Tooltip title="Delete">
        //                 <DeleteOutlined style={{ fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => handleDeleteAssociation(record.AssociationId)} />
        //             </Tooltip> */}
        //             <Popconfirm
        //                 title="Are you sure you want to delete this record?"
        //                 onConfirm={() => handleDeleteAssociation(record.AssociationId)}
        //             >
        //                 <Button
        //                     size="small"
        //                     danger
        //                     icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
        //                 ></Button>
        //             </Popconfirm>
        //         </span>
        //     ),
        // },
    ];

    const handleEdit = (record) => {
        debugger;
        navigate("/CreateAutoCharge", { state: { AdditionalChargeId: record.AdditionalChargeId } });
    };
    const handleDeleteRule = async (record) => {
        debugger;
        const response = await customAxios.get(
            `${urlDeleteSelectedAdditionalChargeRule}?AdditionalChargeRuleId=${record.AdditionalChargeRuleId}&AdditionalChargeId=${form.getFieldValue('AdditionalChargeId')}`
        );
        if (response.status === 200) {
            setDropdown((prevDropdown) => {
                const updatedDropdown = {
                    ...prevDropdown,
                    AdditionalChargesRule: response.data.data.AdditionalChargesRule
                }
                return updatedDropdown;
            });
        }
    };

    const handleDeleteAssociation = async (record) => {
        debugger;
        const response = await customAxios.get(
            `${urlDeleteSelectedAssociation}?AssociationId=${record.AssociationId}&AdditionalChargeId=${form.getFieldValue('AdditionalChargeId')}`
        );
        if (response.status === 200) {
            setDropdown((prevDropdown) => {
                const updatedDropdown = {
                    ...prevDropdown,
                    AdditionalChargesAssociation: response.data.data.AdditionalChargesAssociation
                }
                return updatedDropdown;
            });
        }
    }

    const handleDeleteSurgery = async (record) => {
        debugger;
        const response = await customAxios.get(
            `${urlDeleteSelectedSurgeryRule}?SurgeryRuleId=${record.SurgeryRuleId}&AdditionalChargeId=${form.getFieldValue('AdditionalChargeId')}`
        );
        if (response.status === 200) {
            setDropdown((prevDropdown) => {
                const updatedDropdown = {
                    ...prevDropdown,
                    AdditionalChargesSurgery: response.data.data.AdditionalChargesSurgery
                }
                return updatedDropdown;
            });
        }
    }

    const handlePlusButton = (value) => {
        debugger
        setShowTable(true)
    }

    const handleCancel = () => {
        navigate("/AdditionalCharge");
    }

    const handleTabChange = (key) => {
        // form1.resetFields()
        // form2.resetFields()
        setActiveTabKey(key);
    };

    const TabTitle = (key) => {
        switch (key) {
            case "1":
                return 'Rules'
            case "2":
                return 'Surgery Rule'
            default:
                return 'Service Association'
        }
    }

    const items = new Array(3).fill(null).map((_, i) => {
        const id = String(i + 1);
        return {
            label: TabTitle(id),
            key: id,
            disabled: (additionalChargeType == 2 && id == '1') || (additionalChargeType != 2 && id == '2')
        };
    });

    const handleAdditionalChargeType = (value) => {
        debugger
        if (value == 'Associated Services') {
            setAdditionalChargeType(2)
            setActiveTabKey(2)
        } else {
            setAdditionalChargeType(1)
            setActiveTabKey(1)
        }
    }

    const handleAddRule = async () => {
        await form1.validateFields()
    }

    const handleAddService = async () => {
        await form3.validateFields()
    }

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    if (pageLoading) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}>
            <Spin size="large" />
        </div>
    }

    return (
        <>
            <Layout>
                <div
                    style={{
                        width: "100%",
                        backgroundColor: "white",
                        minHeight: "max-content",
                        borderRadius: "10px",
                    }}
                >
                    <PageHeader title='Additional Charge Setup Manager' buttonIcon={<PlusCircleOutlined />} onButtonClick={() => handlePlusButton(0)} button={false} />
                    <Card>
                        <Form
                            form={form}
                            name="control-hooks"
                            layout="vertical"
                            variant="outlined"
                            size="Default"
                            style={{
                                maxWidth: 1500,
                            }}
                            onFinish={async (values) => {
                                debugger
                                const AddCharge = {
                                    FacilityId: values.Facility,
                                    ShortName: values.ShortName,
                                    LongName: values.LongName,
                                    EffectiveFromDate: values.EffectiveFrom ? values.EffectiveFrom.format('DD-MM-YYYY') : '',
                                    EffectiveToDate: values.EffectiveTo ? values.EffectiveTo.format('DD-MM-YYYY') : '',
                                    AdditionalChargeType: values.AdditionalChargeType,
                                    TaxType: values.TaxType,
                                    CoveredByPayer: values.CoveredByPayer,
                                    IncludeBonusQuantity: values.IncludeBonusQuantity,
                                    ChargeFromPatientAmt: values.ChargeFromPatientAmt,
                                    //object.Remarks = $("#Remarks").val();
                                    IsActive: values.IsActive,
                                    ActiveFlag: true,
                                    AdditionalChargeId: values.AdditionalChargeId
                                }
                                const url = form.getFieldValue('AdditionalChargeId') > 0 ? urlUpdateAdditionalCharge : urlSaveNewAdditionalCharge
                                const response = await customAxios.post(url, AddCharge, {
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                });
                                if (response.status == 200) {
                                    form.setFieldsValue({ AdditionalChargeId: response.data })
                                    setButtonTitle('Update')
                                    message.success('Saved')
                                }
                            }}
                            initialValues={{
                                AdditionalChargeType: 'Tax(Inclusive)',
                                IsActive: true,
                                TaxType: 'Input Tax',
                                EffectiveFrom: fromDate,
                                EffectiveTo: toDate,
                                CoveredByPayer: false,
                                IncludeBonusQuantity: false,
                                ChargeFromPatientAmt: false,
                                // AdditionalChargeId: AdditionalChargeId
                            }}
                        >
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col className="gutter-row" span={6}>
                                    <Form.Item
                                        name="ShortName"
                                        label="Short Name"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Required.",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="AdditionalChargeId" hidden>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Form.Item
                                        name="LongName"
                                        label="Long Name"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Required.",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Form.Item name="AdditionalChargeType" label="Additional Charge Type">
                                        <Select showSearch onChange={handleAdditionalChargeType}>
                                            <Select.Option key='Tax(Inclusive)' value='Tax(Inclusive)'>Tax(Inclusive)</Select.Option>
                                            <Select.Option key='Tax(Exclusive)' value='Tax(Exclusive)'>Tax(Exclusive)</Select.Option>
                                            <Select.Option key='Associated Services' value='Associated Services'>Associated Services</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Form.Item
                                        name="IsActive"
                                        label="Status"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Required.",
                                            },
                                        ]}
                                    >
                                        <Select showSearch>
                                            <Select.Option key={true} value={true}>Active</Select.Option>
                                            <Select.Option key={false} value={false}>Hidden</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Form.Item
                                        name="EffectiveFrom"
                                        label="Effective From"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Required.",
                                            },
                                        ]}
                                    >
                                        <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY'
                                            value={fromDate}
                                            onChange={(date) => setFromDate(date)}
                                            disabledDate={disableFromDate} />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Form.Item
                                        label="Effective To"
                                        name="EffectiveTo"
                                    >
                                        <DatePicker format='DD-MM-YYYY' style={{ width: '100%' }}
                                            value={toDate}
                                            onChange={(date) => setToDate(date)}
                                            disabledDate={disableToDate} />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Form.Item label="Tax Type" name="TaxType">
                                        <Select showSearch>
                                            <Select.Option selected key='Input Tax' value='Input Tax'>Input Tax</Select.Option>
                                            <Select.Option key='Output Tax' value='Output Tax'>Output Tax</Select.Option>
                                            <Select.Option key='Service Tax' value='Service Tax'>Service Tax</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Form.Item name="Facility" label="Facility"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Required.",
                                            },
                                        ]}
                                    >
                                        <Select placeholder='Select' loading={loading}>
                                            {dropdown.Facilities.map((option) => (
                                                <Select.Option
                                                    key={option.FacilityId}
                                                    value={option.FacilityId}
                                                >
                                                    {option.FacilityName}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col className="gutter-row" span={6}>
                                    <Form.Item
                                        name="CoveredByPayer"
                                        valuePropName="checked"
                                    >
                                        <Checkbox disabled={additionalChargeType == 2 ? true : false}>Covered By Payer</Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Form.Item
                                        name="IncludeBonusQuantity"
                                        valuePropName="checked"
                                    >
                                        <Checkbox>Include Bonus Quantity</Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        name="ChargeFromPatientAmt"
                                        valuePropName="checked"
                                    >
                                        <Checkbox>On Patient Amount</Checkbox>
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
                                        <Button type="default" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Tabs type="card" activeKey={activeTabKey} items={items} onChange={handleTabChange} />
                        {activeTabKey == '1' && (
                            <Card>
                                <Form
                                    form={form1}
                                    name="control-hooks"
                                    layout="vertical"
                                    variant="outlined"
                                    size="Default"
                                    style={{
                                        maxWidth: 1500,
                                    }}
                                    initialValues={{
                                        PercentageAmount: 'Percentage',
                                        AdditionalChargeIndicator: 'Gross',
                                        // AdditionalChargeId: dropdown.AdditionalChargeId,
                                    }}
                                    onFinish={async (values) => {
                                        debugger
                                        const Rules = {
                                            AdditionalChargeId: form.getFieldValue('AdditionalChargeId'),
                                            ComponentName: values.ChargeComponent,
                                            ChargeType: values.PercentageAmount,
                                            ChargeValue: values.Value,
                                            AdditionalChargeIndicator: values.AdditionalChargeIndicator,
                                        }
                                        const response = await customAxios.post(urlAddNewRule, Rules, {
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                        });
                                        if (response.status == 200) {
                                            setDropdown((prevDropdown) => {
                                                const updatedDropdown = {
                                                    ...prevDropdown,
                                                    AdditionalChargesRule: response.data.data.AdditionalChargesRule
                                                }
                                                return updatedDropdown;
                                            });
                                            form1.resetFields()
                                        }
                                    }}
                                >
                                    {/* Form fields here */}
                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                        <Col className="gutter-row" span={5}>
                                            <Form.Item
                                                name="ChargeComponent"
                                                label="Charge Component"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Required.",
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={5}>
                                            <Form.Item
                                                name="PercentageAmount"
                                                label="Percentage / Amount"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Required.",
                                                    },
                                                ]}
                                            >
                                                <Select allowClear>
                                                    <Select.Option key='Percentage' value='Percentage'>Percentage</Select.Option>
                                                    <Select.Option key='Amount' value='Amount'>Amount</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={5}>
                                            <Form.Item
                                                name="Value"
                                                label="Value"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Required.",
                                                    },
                                                ]}
                                            >
                                                <InputNumber min={0} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={5}>
                                            <Form.Item
                                                name="AdditionalChargeIndicator"
                                                label="Additional Charge Indicator"
                                            >
                                                <Select>
                                                    <Select.Option key='Gross' value='Gross'>Gross</Select.Option>
                                                    <Select.Option key='Net' value='Net'>Net</Select.Option>
                                                    <Select.Option key='MRP' value='MRP'>MRP</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={4}>
                                            <Button style={{ marginTop: '28px' }} icon={<PlusCircleOutlined />} htmlType="submit"
                                                disabled={form.getFieldValue('AdditionalChargeId') == 0 ? true : false}></Button>
                                        </Col>
                                    </Row>
                                    <CustomTable
                                        columns={columns1}
                                        dataSource={dropdown.AdditionalChargesRule}
                                        isFilter={true}
                                        onDelete={handleDeleteRule}
                                    />
                                </Form>
                            </Card>
                        )}
                        {activeTabKey == '2' && (
                            <Card>
                                <Form
                                    form={form2}
                                    name="control-hooks"
                                    layout="vertical"
                                    variant="outlined"
                                    size="Default"
                                    style={{
                                        maxWidth: 1500,
                                    }}
                                    onFinish={async (values) => {
                                        debugger
                                        const Surgery = {
                                            AdditionalChargeId: form.getFieldValue('AdditionalChargeId'),
                                            AnesthesiaTypeId: values.AnesthesiaType,
                                            AnesthesiaChargeTypeId: values.ChargeType,
                                            ChargeEntryCatalogId: values.ChargeEntryCatalog,
                                            ChargeType: values.PercentageAmount,
                                            ChargeValue: values.Value,
                                            DependOnServiceId: values.Dependon
                                        }
                                        const response = await customAxios.post(urlAddNewSurgery, Surgery, {
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                        });
                                        if (response.status == 200) {
                                            setDropdown((prevDropdown) => {
                                                const updatedDropdown = {
                                                    ...prevDropdown,
                                                    AdditionalChargesSurgery: response.data.data.AdditionalChargesSurgery
                                                }
                                                return updatedDropdown;
                                            });
                                            form2.resetFields()
                                        }
                                    }}
                                    initialValues={{
                                        PercentageAmount: 'Percentage',
                                    }}
                                >
                                    {/* Form fields here */}
                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                        <Col className="gutter-row" span={3}>
                                            <Form.Item
                                                name="AnesthesiaType"
                                                label="Anesthesia Type"
                                            >
                                                <Select placeholder='Select' loading={loading}>
                                                    {dropdown.AnesthesiaType?.map((option) => (
                                                        <Select.Option
                                                            key={option.LookupID}
                                                            value={option.LookupID}
                                                        >
                                                            {option.LookupDescription}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={3}>
                                            <Form.Item
                                                name="ChargeType"
                                                label="Charge Type"
                                            >
                                                <Select placeholder='Select' loading={loading}>
                                                    {dropdown.AnesthesiaChargeType?.map((option) => (
                                                        <Select.Option
                                                            key={option.LookupID}
                                                            value={option.LookupID}
                                                        >
                                                            {option.LookupDescription}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={3}>
                                            <Form.Item
                                                name="ChargeEntryCatalog"
                                                label="Charge Entry Catalog"
                                            >
                                                <Select placeholder='Select' loading={loading}>
                                                    {dropdown.SurgeryServices?.map((option) => (
                                                        <Select.Option
                                                            key={option.ServiceId}
                                                            value={option.ServiceId}
                                                        >
                                                            {option.Name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={3}>
                                            <Form.Item
                                                name="PercentageAmount"
                                                label="Percentage / Amount"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Required.",
                                                    },
                                                ]}
                                            >
                                                <Select>
                                                    <Select.Option key='Percentage' value='Percentage'>Percentage</Select.Option>
                                                    <Select.Option key='Amount' value='Amount'>Amount</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={3}>
                                            <Form.Item
                                                name="Value"
                                                label="Value"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Required.",
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={3}>
                                            <Form.Item
                                                name="Dependon"
                                                label="Depend on"
                                            >
                                                <Select placeholder='Select' loading={loading}>
                                                    {dropdown.Services?.map((option) => (
                                                        <Select.Option
                                                            key={option.ServiceId}
                                                            value={option.ServiceId}
                                                        >
                                                            {option.Name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={4}>
                                            <Button style={{ marginTop: '28px' }} icon={<PlusCircleOutlined />}
                                                htmlType="submit" disabled={form.getFieldValue('AdditionalChargeId') == 0 ? true : false}></Button>
                                        </Col>
                                    </Row>
                                    <CustomTable
                                        columns={columns2}
                                        dataSource={dropdown.AdditionalChargesSurgery}
                                        isFilter={true}
                                        onDelete={handleDeleteSurgery}
                                    />
                                </Form>
                            </Card>
                        )}
                        {activeTabKey == '3' && (
                            <Card>
                                <Form
                                    form={form3}
                                    name="control-hooks"
                                    layout="vertical"
                                    variant="outlined"
                                    size="Default"
                                    style={{
                                        maxWidth: 1500,
                                    }}
                                    onFinish={async (values) => {
                                        debugger
                                        const Association = {
                                            AdditionalChargeId: form.getFieldValue('AdditionalChargeId'),
                                            IndicatorId: values.Indicator,
                                            DescriptionId: 0,
                                            EffectiveFromDate1: values.EffectiveFrom ? values.EffectiveFrom.format('DD-MM-YYYY') : '',
                                            EffectiveToDate1: values.EffectiveFrom ? values.EffectiveFrom.format('DD-MM-YYYY') : ''
                                        }
                                        const response = await customAxios.post(urlAddNewAssociation, Association, {
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                        });
                                        if (response.status == 200) {
                                            setDropdown((prevDropdown) => {
                                                const updatedDropdown = {
                                                    ...prevDropdown,
                                                    AdditionalChargesAssociation: response.data.data.AdditionalChargesAssociation
                                                }
                                                return updatedDropdown;
                                            });
                                            form3.resetFields()
                                        }
                                    }}
                                    initialValues={{
                                        EffectiveFrom: dayjs(),
                                        EffectiveTo: dayjs()
                                    }}
                                >
                                    {/* Form fields here */}
                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                        <Col className="gutter-row" span={5}>
                                            <Form.Item
                                                name="Indicator"
                                                label="Indicator"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Required.",
                                                    },
                                                ]}
                                            >
                                                <Select placeholder='Select' loading={loading}>
                                                    {dropdown.Indicators.map((option) => (
                                                        <Select.Option
                                                            key={option.LookupID}
                                                            value={option.LookupID}
                                                        >
                                                            {option.LookupDescription}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={5}>
                                            <Form.Item
                                                name="Description"
                                                label="Description"
                                                // rules={[
                                                //     {
                                                //         required: true,
                                                //         message: "Required.",
                                                //     },
                                                // ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="AssociationId" hidden >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={5}>
                                            <Form.Item
                                                name="EffectiveFrom"
                                                label="Effective From"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Required.",
                                                    },
                                                ]}
                                            >
                                                <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={5}>
                                            <Form.Item
                                                name="EffectiveTo"
                                                label="Effective To"
                                            >
                                                <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                                            </Form.Item>
                                        </Col>
                                        <Col className="gutter-row" span={4}>
                                            <Button style={{ marginTop: '28px' }} icon={<PlusCircleOutlined />} htmlType="submit"
                                                disabled={form.getFieldValue('AdditionalChargeId') == 0 ? true : false}></Button>
                                        </Col>
                                    </Row>
                                    <CustomTable
                                        columns={columns3}
                                        dataSource={dropdown.AdditionalChargesAssociation}
                                        isFilter={true}
                                        onDelete={handleDeleteAssociation}
                                    />
                                </Form>
                            </Card>
                        )}
                    </Card>
                    {/* <Spin spinning={loading}>
                        <CustomTable
                            columns={columns}
                            dataSource={columnData}
                            isFilter={true}
                        />
                    </Spin> */}
                </div>
            </Layout >
        </>
    );
}

export default CreateAdditionalCharge;
