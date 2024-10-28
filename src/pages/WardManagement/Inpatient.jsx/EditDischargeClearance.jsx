import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Layout,
    Row,
    Form,
    Select,
    Input,
    message,
} from "antd";
import PageHeader from "../../../components/PageHeader";
import { useNavigate } from "react-router";
import CustomTable from "../../../components/customTable";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import {
    urlShowDischargeClearance,
    urlGetPatientHeaderDetails,
    urlSaveDischargeClearanceForPatient
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios";
import PatientHeader from "../../../components/PatientHeader/index.jsx";

function EditDischargeClearance() {
    const location = useLocation();
    const record = location.state.record;
    const [patientData, setPatientData] = useState()
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(true)
    const [form] = Form.useForm();

    const getPatientHeader = async () => {
        try {
            const response = await customAxios.get(
                `${urlGetPatientHeaderDetails}?PatientId=${record.PatientID}&EncounterId=${record.EncounterID}`
            );
            if (response.status === 200 && response.data != null) {
                const detailsheader = response.data.data.EncounterModel;
                setLoading(false)
                setPatientData(detailsheader);
            }
        } catch (error) { }
    }

    useEffect(() => {
        const fetch = async () => {
            debugger
            try {
                const response = await customAxios.get(
                    `${urlShowDischargeClearance}?PatientId=${record.PatientID}&EncounterId=${record.EncounterID}&PatientType=${record.PatientTypeId}&Providername=${record.Provider}`
                );
                if (response.status === 200 && response.data.data != null) {
                    const detailsheader = response.data.data;
                    setTableData(detailsheader);
                    // setTableData1(response.data.data.DischargeClearanceDetails);
                    getPatientHeader()
                }
            } catch (error) { }
        }
        fetch()
    }, [])

    const columns = [
        {
            title: 'Clearance',
            dataIndex: 'LongName',
            key: 'longName',
        },
        {
            title: 'Clearance Type',
            dataIndex: 'ClearanceType',
            key: 'clearanceType',
            render: (text, record) => (
                <>
                    {text}
                    <Form.Item hidden name={[record.key, 'clearanceType']} initialValue={record.ClearanceType}>
                        <Input />
                    </Form.Item>
                </>
            ),
        },
        {
            title: 'Provider',
            dataIndex: 'ProviderName',
            key: 'providerName',
            render: (text, record) => (
                <>
                    {text}
                    <input type="hidden" className="DischargeClearanceSetUpId" value={record.DischargeClearanceSetupId} />
                </>
            ),
        },
        {
            title: 'Date Of Clearance',
            dataIndex: 'ClearanceDate',
            key: 'ClearanceDate',
            // render: (text) => (text ? dayjs(text).format('DD-MM-YYYY') : ''),
        },
        {
            title: 'Clearance Sequence',
            dataIndex: 'ClearanceSequence',
            key: 'clearanceSequence',
        },
        {
            title: 'Clearance Status',
            key: 'clearanceStatus',
            render: (record) => (
                <Form.Item name={[record.key, 'ClearanceStatus']}>
                    <Select style={{ width: '100%' }}
                        defaultValue={record.Status}
                        className={`ClearanceStatus-${record.Sequence}-${record.key}`}
                        disabled={record.disabled}
                    >
                        {(record.ClearanceStatus || []).map((option) => (
                            <Option key={option.LookupID} value={option.LookupID}>
                                {option.LookupDescription}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            ),
        },
        {
            title: 'Remarks',
            key: 'remarks',
            render: (record) => (
                <>
                    <Form.Item name={[record.key, 'Remarks']}>
                        <Input
                            defaultValue={record.Remarks}
                            className="form-control Remarks"
                            disabled={record.disabled}
                        />
                    </Form.Item>
                    <Form.Item name={[record.key, 'DischargeClearanceSetupId']}
                        initialValue={record.DischargeClearanceSetupId} hidden>
                        <Input />
                    </Form.Item>
                </>
            ),
        },
    ];

    const getDataSource = () => {
        return (tableData.DischargeClearanceSetupDetails || []).map((item, index) => {
            let status = '';
            let remarks = '';
            let date = '';
            let disabled = false;

            if (item.ActiveFlag) {
                const matchingDetail = (tableData.DischargeClearanceDetails || []).find(
                    (detail) => detail.DischargeClearanceSetUpId === item.DischargeClearanceSetupId &&
                        detail.PatientID === record.PatientID && detail.EncounterID === record.EncounterID
                );

                if (matchingDetail) {
                    status = matchingDetail.ClearanceStatus;
                    remarks = matchingDetail.Remarks;
                    date = matchingDetail.ClearanceDateString
                }

                const previousClearanceNotDone = (tableData.DischargeClearanceSetupDetails || []).some(
                    (prevItem) => prevItem.ClearanceSequence < item.ClearanceSequence &&
                        (tableData.DischargeClearanceDetails || []).find(
                            (prevDetail) => prevDetail.DischargeClearanceSetUpId === prevItem.DischargeClearanceSetupId &&
                                prevDetail.ClearanceStatusString !== 'Done'
                        )
                );

                if (previousClearanceNotDone) {
                    disabled = true;
                }
                return {
                    key: index,
                    LongName: item.LongName,
                    ClearanceType: item.ClearanceType,
                    ProviderName: item.ProviderName,
                    ClearanceDate: date,
                    ClearanceSequence: item.ClearanceSequence,
                    Status: status,
                    ClearanceStatus: tableData.ClearanceStatus,
                    Remarks: remarks,
                    DischargeClearanceSetupId: item.DischargeClearanceSetupId,
                    disabled,
                    statusOptions: [
                        { label: 'Pending', value: 0 },
                        { label: 'Done', value: 1 },
                    ],
                };
            }
            return item
        });
    }

    const dataSource = getDataSource();

    const handleSave = async (value) => {
        debugger
        let saves = []
        for (let i = 0; i < 5; i++) {
            if (value[i].ClearanceStatus) {
                const save = {
                    DischargeClearanceSetUpId: value[i].DischargeClearanceSetupId,
                    ClearanceStatus: value[i].ClearanceStatus,
                    ClearanceStatusString: value[i].ClearanceType,
                    PatientID: record.PatientID,
                    EncounterID: record.EncounterID,
                    Remarks: value[i].Remarks,
                    FacilityId: 1,
                    ClearanceStatusString: value[i].clearanceType
                }
                saves.push(save)
            }
        }
        const response = await customAxios.post(urlSaveDischargeClearanceForPatient, saves, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status == 200 && response.data.data == 'Patient Bill Not Settled') {
            message.warning('Patient Bill Not Settled')
        } else {
            navigate("/DischargeClearance")
        }
    }

    // if (loading) {
    //     return (
    //         <div style={{
    //             display: 'flex',
    //             justifyContent: 'center',
    //             alignItems: 'center',
    //             height: '100vh',
    //             backgroundColor: '#f0f2f5'
    //         }}>
    //             <Spin size="large" />
    //         </div>
    //     );
    // }

    return (
        <>
            <Layout
                style={{
                    backgroundColor: "white",
                    height: "max-content",
                    borderRadius: "10px",
                    width: "100%",
                }}
            >
                <PageHeader title={"Discharge Clearance"} button={false} />
                <PatientHeader patient={patientData} />
                <br />
                <Form
                    form={form}
                    name="control-hooks"
                    layout="vertical"
                    onFinish={handleSave}
                    // variant="outlined"
                    // style={{
                    //     maxWidth: 1500,
                    // }}
                    initialValues={{
                        Date: dayjs()
                    }}>
                    <CustomTable columns={columns} dataSource={dataSource} actionColumn={false} loading={loading} />
                    <Row justify="end">
                        <Col>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Save
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item>
                                <Button type="default" danger onClick={() => navigate("/DischargeClearance")}>
                                    Cancel
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Layout>
        </>
    )
}

export default EditDischargeClearance;