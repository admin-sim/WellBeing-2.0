import {
    Avatar,
    Badge,
    Button,
    Col,
    Tabs,
    DatePicker,
    Divider,
    Form,
    Input,
    Modal,
    message,
    Row,
    Select,
    Checkbox,
    Table,
    Typography,
} from "antd";
import React, { useEffect, useState } from "react";
const { Text } = Typography;
import male from "../../../../assets/m.png";
import { FcDocument, FcInfo, FcOpenedFolder } from "react-icons/fc";
import { DollarTwoTone, FolderOpenTwoTone } from "@ant-design/icons";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { urlDischargePatient } from "../../../../../endpoints.js";
import PatientHeader from "../../../../components/PatientHeader";
import dayjs from "dayjs";


function DischargeModal({ bed, patient, Dropdown, open, handleClose }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [defaultActiveKey, setDefaultActiveKey] = useState('1')
    const [blockChecked, setBlockChecked] = useState(false)
    const [pendingStatus, setPendingStatus] = useState(false)
    const data = Dropdown.DischargeClearance
    const handleCancel = () => {
        form.resetFields();
        setBlockChecked(false)
        setPendingStatus(false)
        handleClose();
    };

    useEffect(() => {
        for (let i = 0; i < (Dropdown.DischargeClearance || []).length; i++) {
            if (Dropdown.DischargeClearance[i].ClearanceStatusString != 'Done') {
                setPendingStatus(true)
            }
        }
    }, [Dropdown.DischargeClearance])

    const Block = (event) => {
        setBlockChecked(event.target.checked)
    }

    const onFinish = async (values) => {
        debugger
        handleCancel();
    }

    const columns = [
        {
            title: `Tasks`,
            key: 'DischargeClearanceSetUp',
            dataIndex: 'DischargeClearanceSetUp'
        },
        {
            title: "Tasks Status",
            dataIndex: "ClearanceStatusString",
            key: "ClearanceStatusString",
        },
        {
            title: "Performed By",
            dataIndex: "PerformedBy",
            key: "PerformedBy",
        },
        {
            title: "Perfomed Date",
            dataIndex: "ClearanceDateString",
            key: "ClearanceDateString",
        },
    ]

    const handleSubmit = async (value) => {
        debugger
        setLoading(true)
        if (pendingStatus) {
            message.warning('Please complete discharge clearance.')
            return false
        }
        const postData = {
            DischargeID: value.DischargeID,
            DischargeStatus: 'Discharged',
            BedId: value.BedId,
            EncounterId: value.EncounterId,
            DischargeDate: value.DischargeDateTime.format("DD-MM-YYYY"),
            DischargeTime: value.DischargeDateTime.format("HH:mm:ss"),
            BlockDate: value.BlockTill.format("DD-MM-YYYY"),
            BlockTime: value.BlockTill.format("HH:mm:ss"),
            BlockReason: value.Block ? value.BlockReason : 0,
            RetainBed: value.Block ? 'Y' : 'N'
        }
        try {
            const response = await customAxios.get(
                `${urlDischargePatient}?DischargeID=${postData.DischargeID
                }&DischargeStatus=${postData.DischargeStatus}&BedId=${postData.BedId
                }&EncounterId=${postData.EncounterId}&DischargeDate=${postData.DischargeDate}&DischargeTime=${postData.DischargeTime
                }&BlockDate=${postData.BlockDate}&BlockTime=${postData.BlockTime
                }&BlockReason=${postData.BlockReason}&RetainBed=${postData.RetainBed}`
            );
            if (response.status === 200) {
                message.success('Success');
                handleCancel()
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false)
        }
    }

    const dischargeHeaders = [
        {
            label: `Tasks`,
            key: 1,
            children: <Table columns={columns} dataSource={data} />
        },
        {
            label: `Discharge`,
            key: 2,
            disabled: pendingStatus,
            children: <>
                {/* <PatientHeader patient={patient} /> */}
                <Row gutter={16}>
                    <Col span={10}>
                        <div
                            style={{
                                border: "1px solid silver",
                                borderRadius: "0.5rem",
                                padding: "0.5rem",
                                marginTop: "1.2rem",
                            }}
                        >
                            <Row>
                                <Col span={24}>Admitted Date and Time</Col>
                                <Col span={24}>
                                    <b>{Dropdown.PatientsCurrentDetails.AdmittedDateString}</b>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "0.5rem" }}>
                                <Col span={12}>
                                    <Col span={23}>Department</Col>
                                    <Col span={23}>
                                        <b>{Dropdown.PatientsCurrentDetails.DepartmentName}</b>
                                    </Col>
                                </Col>

                                <Col span={12}>
                                    <Col span={24}>Service Location</Col>
                                    <Col span={24}>
                                        <b>{Dropdown.PatientsCurrentDetails.ServiceLocationName}</b>
                                    </Col>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "0.5rem" }}>
                                <Col span={12}>
                                    <Col span={23}>Provider</Col>
                                    <Col span={23}>
                                        <b>{Dropdown.PatientsCurrentDetails.Provider}</b>
                                    </Col>
                                </Col>

                                <Col span={12}>
                                    <Col span={24}>Ward Category</Col>
                                    <Col span={24}>
                                        <b>{Dropdown.PatientsCurrentDetails.WardCategory}</b>
                                    </Col>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "0.5rem" }}>
                                <Col span={12}>
                                    <Col span={23}>Ward</Col>
                                    <Col span={23}>
                                        <b>{Dropdown.PatientsCurrentDetails.Ward}</b>
                                    </Col>
                                </Col>

                                <Col span={12}>
                                    <Col span={24}>Bed</Col>
                                    <Col span={24}>
                                        <b>{Dropdown.PatientsCurrentDetails.Bed}</b>
                                    </Col>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col span={14}>
                        <Form
                            style={{ marginTop: "1rem" }}
                            layout="vertical"
                            form={form}
                            onFinish={handleSubmit}
                            initialValues={{
                                DischargeDateTime: dayjs(),
                                BlockTill: dayjs()
                            }}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="DischargeAdvisedBy"
                                        label="Discharge Advised By"
                                    >
                                        <label>{(Dropdown.DischargeDetails || {}).Provider}</label>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="AdvisedDateTime"
                                        label="Advised Date&Time"
                                    >
                                        <label>{(Dropdown.DischargeDetails || {}).AdvisedDateTimeString}</label>
                                    </Form.Item>
                                    <Form.Item hidden
                                        name="EncounterId"
                                        initialValue={Dropdown.PatientsCurrentDetails.EncounterId}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item hidden
                                        name="BedId"
                                        initialValue={Dropdown.PatientsCurrentDetails.BedID}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item hidden
                                        name="DischargeID"
                                        initialValue={(Dropdown.DischargeDetails || {}).DischargeId}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="ExpectedDateTime"
                                        label="Expected Date&Time of Discharge"
                                    >
                                        <label>{(Dropdown.DischargeDetails || {}).ExpectedDischargeDateString}</label>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="DispositionType"
                                        label="Disposition Type"
                                    >
                                        <label>{(Dropdown.DischargeDetails || {}).DispositionType}</label>
                                    </Form.Item>
                                </Col>
                                <Col span={22}>
                                    <Form.Item
                                        name="DischargeDateTime"
                                        label="Discharge Date&Time"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please Enter Lookup Description",
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
                                <Col span={24}>
                                    <Form.Item name="Block" valuePropName="checked">
                                        <Checkbox onChange={Block}>Block Bed Till</Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col span={22} hidden={!blockChecked}>
                                    <Form.Item
                                        name="BlockTill"
                                        label="Block Till"
                                        rules={[
                                            {
                                                required: blockChecked,
                                                message: "Please select",
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
                                <Col span={22} hidden={!blockChecked}>
                                    <Form.Item
                                        name="BlockReason"
                                        label="Reason For Block"
                                        rules={[
                                            {
                                                required: blockChecked,
                                                message: "Please select Reason",
                                            },
                                        ]}
                                    >
                                        <Select style={{ width: "100%" }} placeholder='Select Reason'>
                                            {(Dropdown.ReasonForBlock || []).map((option) => (
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
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </>,
        }
    ]

    const handleTabChange = (activeKey) => {
        debugger
        setDefaultActiveKey(activeKey)
    };

    return (
        <div>
            <Modal
                width={"70%"}
                height={"auto"}
                centered
                title={
                    <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                        Discharge Patient
                    </span>
                }
                open={open}
                maskClosable={false}
                footer={null}
                onCancel={handleCancel}
            >
                <PatientHeader patient={patient} />
                <Row gutter={24}>
                    <Form
                        style={{ marginTop: "1rem", width: '100%' }}
                        layout="vertical"
                        form={form}
                        onFinish={handleSubmit}
                    >
                        <div style={{ marginTop: "1.5rem" }} >
                            <Tabs
                                defaultActiveKey={defaultActiveKey}
                                type="card"
                                size="small"
                                items={dischargeHeaders}
                                onChange={handleTabChange}
                            />
                        </div>
                        <Row justify="end">
                            <Col>
                                <Form.Item hidden={defaultActiveKey != 1 ? false : true}>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        Save
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
                </Row>
            </Modal>
        </div>
    );
}

export default DischargeModal;
