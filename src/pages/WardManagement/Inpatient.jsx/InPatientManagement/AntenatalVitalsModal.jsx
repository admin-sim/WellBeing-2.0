import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    message,
    Row,
    Select,
    Typography,
    InputNumber,
    Table,
    Popconfirm,
} from "antd";
import React, { useEffect, useState } from "react";
const { Text } = Typography;
import male from "../../../../assets/m.png";
import { FcDocument, FcInfo, FcOpenedFolder } from "react-icons/fc";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import PatientHeader from "../../../../components/PatientHeader";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { urlAddNewAVHeader, urlAddNewAVLine } from "../../../../../endpoints.js";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import CustomTable from "../../../../components/customTable/index.jsx";

function AntenatalVitals({ bed, Dropdown, patient, open, handleClose }) {
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [showModal, setShowModel] = useState(false)

    const columns = [
        {
            title: "Date Of Birth",
            dataIndex: "AntDOBString",
        },
        {
            title: "Duration of Pregnancy",
            dataIndex: "DurOfPreg",
        },
        {
            title: "Birth Weight",
            dataIndex: "BirthWeight",
        },
        {
            title: "Complications in Pregnancy",
            dataIndex: "ComplInPreg",
        },
        {
            title: "Complications in Labour",
            dataIndex: "ComplInLabour",
        },
        {
            title: "Pueperriun",
            dataIndex: "Pueperium",
        },
        {
            title: "Alive",
            dataIndex: "Alive",
        },
        {
            title: "Age at Death",
            dataIndex: "AgeAtDeath",
        },
        {
            title: "Cause at Death",
            dataIndex: "CauseOfDeath",
        },
        {
            title: "Remarks",
            dataIndex: "Remarks",
        },
        {
            title: (
                <Button type="link" onClick={handleAddRow}>
                    <PlusCircleOutlined />
                </Button>
            ),
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        <EditOutlined />
                    </Button>
                    <Popconfirm
                        danger
                        title="Sure to delete?"
                        onConfirm={() => handleDeleteRow(record)}
                    >
                        <DeleteOutlined />
                    </Popconfirm>
                </>
            ),
        },
    ];

    async function handleEdit(params) {
        debugger
        const response = await customAxios.get(
            `${urlSaveModal}?AVLineId=${params.AVLineId}&PatientId=${patient.PatientId}&EncounterId=${patient.EncounterId}`
          );
          if (response.status === 200 && response.data.data != null) {
            
          }
    }

    function handleDeleteRow(record) {

    }

    async function onFinish(params) {
        debugger
        const header = {
            AVHeaderId: params.AVHeaderId,
            PatientId: params.PatientId,
            EncounterId: params.EncounterId,
            LMPDateString: params.LMP.format('DD-MM-YYYY'),
            EDDDateString: params.EDO.format('DD-MM-YYYY'),
            EGAWeeks: params.EGAWeeks,
            EGADays: params.EGADays,
            TotalPrevPreg: params.PreviousPregnancyTotal,
            NuOfAlive: params.NumberAlive,
            HeartDisease: params.HeartDisease ? params.HeartDisease : (Dropdown.AntenatalVitalsHeader || {}).HeartDisease,
            Diabetes: params.Diabetes ? params.Diabetes : (Dropdown.AntenatalVitalsHeader || {}).Diabetes,
            Hypertension: params.Hypertension ? params.Hypertension : (Dropdown.AntenatalVitalsHeader || {}).Hypertension,
            SickleCell: params.sickieCell ? params.sickieCell : (Dropdown.AntenatalVitalsHeader || {}).sickieCell,
            Operations: params.Operations ? params.Operations : (Dropdown.AntenatalVitalsHeader || {}).Operations,
            ChestDisease: params.ChestDisease ? params.ChestDisease : (Dropdown.AntenatalVitalsHeader || {}).ChestDisease,
            KidneyDisease: params.KidneyDisease ? params.KidneyDisease : (Dropdown.AntenatalVitalsHeader || {}).KidneyDisease,
            Allergy: params.Allergy ? params.Allergy : (Dropdown.AntenatalVitalsHeader || {}).Allergy,
            Others: params.Others ? params.Others : (Dropdown.AntenatalVitalsHeader || {}).Others,
            PrimaryAssessment: params.PrimaryAssessment ? params.PrimaryAssessment : (Dropdown.AntenatalVitalsHeader || {}).PrimaryAssessment,
            PADateString: params.Date ? params.Date.format('DD-MM-YYYY') : (Dropdown.AntenatalVitalsHeader || {}).PADateString
        }
        const response = await customAxios.post(urlAddNewAVHeader, header, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status == 200) {
            message.success('Success')
            form.setFieldsValue({
                EncounterId: response.data.data.EncounterId,
                PatientId: response.data.data.PatientId,
                GestationDate: dayjs(),
                AVHeaderId: response.data.data.AVHeaderId,
                LMP: dayjs(response.data.data.LMPDateString, 'DD-MM-YYYY'),
                EDO: dayjs(response.data.data.EDDDateString, 'DD-MM-YYYY'),
                EGAWeeks: response.data.data.EGAWeeks,
                EGADays: response.data.data.EGADays,
                PreviousPregnancyTotal: response.data.data.TotalPrevPreg,
                NumberAlive: response.data.data.NuOfAlive,
                HeartDisease: response.data.data.HeartDisease,
                Diabetes: response.data.data.Diabetes,
                Hypertension: response.data.data.Hypertension,
                sickieCell: response.data.data.SickleCell,
                Operations: response.data.data.Operations,
                ChestDisease: response.data.data.ChestDisease,
                KidneyDisease: response.data.data.KidneyDisease,
                Allergy: response.data.data.Allergy,
                Others: response.data.data.Others,
                PrimaryAssessment: response.data.data.PrimaryAssessment,
                Date: dayjs(response.data.data.PADateString, 'DD-MM-YYYY')
            })
        }
    }

    async function onFinishModal(params) {
        debugger
        const Line = {
            PatientId: patient.PatientId,
            EncounterId: patient.EncounterId,
            AntDOBString: params.DateofBirth.format('DD-MM-YYYY'),
            DurOfPreg: params.DurationofPregnanacy,
            BirthWeight: params.BirthWeight,
            ComplInPreg: params.ComplicationinPregnanacy,
            ComplInLabour: params.ComplicationinLabour,
            Pueperium: params.Pueperium,
            Alive: params.Alive,
            AgeAtDeath: params.AgeAtDeath,
            CauseOfDeath: params.CauseAtDeath,
            Remarks: params.Remarks,
            AVHeaderId: params.AVHeaderId
        }
        const response = await customAxios.post(urlAddNewAVLine, Line, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status == 200) {
            message.success('Success')
            form1.resetFields()
            setTableData(response.data.data.AntenatalVitalsLine)
        }
    }

    function handleHistory() {
        if (showHistory) {
            setShowHistory(false)
        } else {
            setShowHistory(true)
        }
    }

    function handleAddRow() {
        setShowModel(true)
    }

    function handleClose1() {
        setShowModel(false)
    }

    function handleAdd(params) {
        debugger
    }

    return (
        <div>
            <Modal
                width={"80%"}
                height={"auto"}
                centered
                title={
                    <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                        Antenatal Vitals
                    </span>
                }
                open={open}
                maskClosable={false}
                footer={null}
                onCancel={handleClose}
            >
                <PatientHeader patient={patient} />
                <Row gutter={32}>
                    <Col>
                        <Form
                            style={{ marginTop: "1rem" }}
                            layout="vertical"
                            form={form}
                            onFinish={onFinish}
                            initialValues={{
                                EncounterId: (Dropdown.LastEncounter || {}).EncounterId,
                                PatientId: (Dropdown.LastEncounter || {}).PatientId,
                                GestationDate: dayjs(),
                                AVHeaderId: Dropdown.AntenatalVitalsHeader ? (Dropdown.AntenatalVitalsHeader || {}).AVHeaderId : 0,
                                LMP: Dropdown.AntenatalVitalsHeader ? dayjs((Dropdown.AntenatalVitalsHeader || {}).LMPDateString, 'DD-MM-YYYY') : dayjs(),
                                EDO: Dropdown.AntenatalVitalsHeader ? dayjs((Dropdown.AntenatalVitalsHeader || {}).EDDDateString, 'DD-MM-YYYY') : dayjs(),
                                EGAWeeks: (Dropdown.AntenatalVitalsHeader || {}).EGAWeeks,
                                EGADays: (Dropdown.AntenatalVitalsHeader || {}).EGADays,
                                PreviousPregnancyTotal: (Dropdown.AntenatalVitalsHeader || {}).TotalPrevPreg,
                                NumberAlive: (Dropdown.AntenatalVitalsHeader || {}).NuOfAlive,
                                HeartDisease: (Dropdown.AntenatalVitalsHeader || {}).HeartDisease,
                                Diabetes: (Dropdown.AntenatalVitalsHeader || {}).Diabetes,
                                Hypertension: (Dropdown.AntenatalVitalsHeader || {}).Hypertension,
                                sickieCell: (Dropdown.AntenatalVitalsHeader || {}).SickleCell,
                                Operations: (Dropdown.AntenatalVitalsHeader || {}).Operations,
                                ChestDisease: (Dropdown.AntenatalVitalsHeader || {}).ChestDisease,
                                KidneyDisease: (Dropdown.AntenatalVitalsHeader || {}).KidneyDisease,
                                Allergy: (Dropdown.AntenatalVitalsHeader || {}).Allergy,
                                Others: (Dropdown.AntenatalVitalsHeader || {}).Others,
                                PrimaryAssessment: (Dropdown.AntenatalVitalsHeader || {}).PrimaryAssessment,
                                Date: Dropdown.AntenatalVitalsHeader ? dayjs((Dropdown.AntenatalVitalsHeader || {}).PADateString, 'DD-MM-YYYY') : dayjs()
                            }}
                        >
                            <Row gutter={32}>
                                <Col span={4}>
                                    <Form.Item
                                        style={{ marginBottom: "0.5rem" }}
                                        name="LMP"
                                        label="LMP"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please select Reason",
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            format="DD-MM-YYYY"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={2}>
                                    <Form.Item name='days' label=' '>
                                        <Select>
                                            {Array.from({ length: 15 }, (_, index) => {
                                                const value = 21 + index;
                                                return (
                                                    <Select.Option key={value} value={value}>
                                                        {value}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item hidden name="PatientId"><Input /></Form.Item>
                                    <Form.Item hidden name="EncounterId"><Input /></Form.Item>
                                    <Form.Item name="AVHeaderId" hidden><Input /></Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ marginBottom: "0.5rem" }}
                                        name="EDO"
                                        label="EDO"
                                    >
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            format="DD-MM-YYYY"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label='Gestation Date'
                                        name="GestationDate"
                                    >
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            // showTime={{ format: "hh:mm A" }}
                                            format="DD-MM-YYYY"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ marginBottom: "0.5rem" }}
                                        name="EGAWeeks"
                                        label="EGA Weeks"
                                    >
                                        <InputNumber style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label='EGA Days'
                                        name="EGADays"
                                    >
                                        <InputNumber style={{ width: '100%' }} />
                                    </Form.Item>

                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ marginBottom: "0.5rem" }}
                                        name="PreviousPregnancyTotal"
                                        label="Previous Pregnancy Total"
                                    >
                                        <Input style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ marginBottom: "0.5rem" }}
                                        name="NumberAlive"
                                        label="Numbers of Alive"
                                    >
                                        <InputNumber style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Button type='link' onClick={handleHistory}>Previous Medical History</Button>
                                </Col>
                            </Row>
                            <Row gutter={32} style={{ height: "1.8rem" }}>
                                <Col offset={17} span={3}>
                                    <Form.Item>
                                        <Button loading={loading} type="primary" htmlType="submit">
                                            {form.getFieldValue('AVHeaderId') ? 'Update' : 'Save'}
                                        </Button>
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Form.Item>
                                        <Button type="default" danger>
                                            Cancel
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                            {showHistory && (
                                <Row gutter={32}>
                                    <Col span={12}>
                                        <Form.Item label='Heart Disease' name='HeartDisease'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Chest Disease' name='ChestDisease'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Diabetes' name='Diabetes'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Kidney Disease' name='KidneyDisease'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Hypertension' name='Hypertension'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Allergy' name='Allergy'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='sickie Cell' name='sickieCell'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Others' name='Others'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Operations' name='Operations'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Primary Assessment' name='PrimaryAssessment'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Date' name='Date'>
                                            <DatePicker
                                                style={{ width: "100%" }}
                                                format="DD-MM-YYYY"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                        </Form>
                        {/* <CustomTable columns={columns}
                            dataSource={(Dropdown.AntenatalVitalsLine || [])}
                            actionColumnName={<PlusCircleOutlined />}
                            actionColumn={handleAdd}
                        /> */}
                        <Table
                            columns={columns}
                            dataSource={(tableData.length > 0 ? tableData : Dropdown.AntenatalVitalsLine)}
                            pagination={false}
                            bordered
                            scroll={{
                                y: 200,
                            }}
                        />
                    </Col>
                </Row>
            </Modal>
            <Modal
                width={"80%"}
                height={"auto"}
                centered
                title={
                    <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                        Add New
                    </span>
                }
                open={showModal}
                maskClosable={false}
                footer={null}
                onCancel={handleClose1}
            // onOk={handleAdd}
            // okText='Save'
            >
                <Form
                    style={{ marginTop: "1rem" }}
                    layout="vertical"
                    form={form1}
                    onFinish={onFinishModal}
                    initialValues={{
                        DateofBirth: dayjs(),
                        AVHeaderId: Dropdown.AntenatalVitalsHeader ? (Dropdown.AntenatalVitalsHeader || {}).AVHeaderId : 0
                    }}
                >
                    <Row gutter={32}>
                        <Col span={6}>
                            <Form.Item label='Date of Birth' name='DateofBirth'>
                                <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                            </Form.Item>
                            <Form.Item hidden name='AVHeaderId'>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label='Duration of Pregnanacy' name='DurationofPregnanacy'>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label='Birth Weight' name='BirthWeight'>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label='Pueperium' name='Pueperium'>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label='Alive' name='Alive'>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label='Complication in Pregnanacy' name='ComplicationinPregnanacy'>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label='Complication in Labour' name='ComplicationinLabour'>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <label>Baby if Dead</label>
                    <Row gutter={32}>
                        <Col span={6}>
                            <Form.Item label='Age At Death' name='AgeAtDeath'>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label='Cause At Death' name='CauseAtDeath'>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label='Remarks' name='Remarks'>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={32} style={{ height: "1.8rem" }}>
                        <Col offset={17} span={3}>
                            <Form.Item>
                                <Button loading={loading} type="primary" htmlType="submit">
                                    Save
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item>
                                <Button type="default" danger onClick={handleClose1}>
                                    Cancel
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    )
}

export default AntenatalVitals