import {
    Form,
    Input,
    Button,
    DatePicker,
    Card,
    Row,
    Col,
    Layout,
    Table,
    Tooltip,
    Spin,
    Space,
    AutoComplete,
    Select,
    Modal,
} from "antd";
import {
    MinusCircleOutlined,
    CheckCircleOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import {
    urlGetAllPatientTypeAsync,
    urlGetAllPaymentTypesAsync,
    urlGetAllUsers,
    urlGetPurshaseOrderDetails,
    urlSearchPatientsForLab,
    urlSearchUHID,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { useNavigate } from "react-router";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const PurchaseOrderReport = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Ant Design Form hook
    const [users, setUsers] = useState([]);
    const [paymenttypes, setpaymentTypes] = useState([]);
    const [patientttypes, setPatientTypes] = useState([]);
    const [reportUrl, setReportUrl] = useState(null);
    const [error, setError] = useState(null);
    const [blobData, setBlobData] = useState(null);
    const [dropDown, setDrpoDown] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false); // State for loader visibility
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());

    useEffect(() => {
        fetchDataHeader();
    }, []);

    const fetchDataHeader = async () => {
        try {
            const response = await customAxios.get(`${urlGetPurshaseOrderDetails}`);
            if (response.status === 200 && response.data != null) {
                const userdetail = response.data.data;
                setDrpoDown(userdetail);
            } else {
            }
        } catch (error) { }
    };

    const disableFromDate = (current) => {
        return current && current.isAfter(dayjs().endOf("day"));
    };

    const disableToDate = (current) => {
        return (
            current &&
            (current.isBefore(fromDate, "day") ||
                current.isAfter(dayjs().endOf("day")))
        );
    };

    const onFinish = async (values) => {
        debugger
        setLoading(true); // Show the loader when fetching the report
        setError(null); // Reset previous errors1

        const request = {
            FacilityId: 1,
            FromDate: values.FromDate.format("DD-MM-YYYY"),
            ToDate: values.ToDate.format("DD-MM-YYYY"),
            POSupplier: values.Supplier ? values.Supplier :0,
            PONo: values.PoNumber ? values.PoNumber : '',
            POStore: values.POStore ? values.POStore : 0,
            POType: values.POType ? values.POType : 0,
            use: 'Admin',
        };

        try {
            const { url, blob } = await fetchReport(request);
            setReportUrl(url);
            setBlobData(blob);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    async function fetchReport(request) {
        const response = await fetch(
            "http://localhost:43705/api/ReportsApi/GetPurchaseOrderRpt",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            }
        );

        if (!response.ok) {
            setLoading(false);
            throw new Error("Failed to fetch report");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return { url, blob };
    }

    const handleReset = () => {
        form.resetFields(); // Reset the form fields to their initial values
    };

    return (
        <Layout style={{ width: "100%" }}>
            <div
                style={{
                    width: "100%",
                    backgroundColor: "white",
                    minHeight: "max-content",
                    borderRadius: "10px",
                }}
            >
                <PageHeader title={"Purchase Order Report"} button={false} />
                <div
                    style={{
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        margin: "1rem",
                        boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                    }}
                >
                    <Form
                        initialValues={{
                            FromDate: dayjs(),
                            ToDate: dayjs(),
                            Supplier: '',
                            PoNumber: '',
                            POStore: '',
                            POType: ''
                        }}
                        layout="vertical"
                        onFinish={onFinish}
                        form={form}
                    >
                        <Row gutter={16} style={{ marginBottom: "12px" }}>
                            <ColWithSixSpan>
                                <Form.Item name="Supplier" label="Supplier">
                                    <Select
                                        placeholder="Select Value"
                                        allowClear
                                    >
                                        <Select.Option key="all" value={""}>
                                            All
                                        </Select.Option>
                                        {dropDown?.SupplierList.map((option) => (
                                            <Select.Option key={option.VendorId} value={option.VendorId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </ColWithSixSpan>
                            <ColWithSixSpan>
                                <Form.Item name="PoNumber" label="Po Number">
                                    <Select
                                        placeholder="Select Value"
                                        allowClear
                                    >
                                        <Select.Option key="all" value={""}>
                                            All
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </ColWithSixSpan>
                            <ColWithSixSpan>
                                <Form.Item name="FromDate" label="From Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Pick Date",
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        value={fromDate}
                                        onChange={(date) => setFromDate(date)}
                                        disabledDate={disableFromDate}
                                        style={{ width: "100%" }}
                                        format="DD-MM-YYYY"
                                    />
                                </Form.Item>
                            </ColWithSixSpan>
                            <ColWithSixSpan>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Pick Date",
                                        },
                                    ]}
                                    name="ToDate"
                                    label="To Date"
                                >
                                    <DatePicker
                                        value={toDate}
                                        onChange={(date) => setToDate(date)}
                                        disabledDate={disableToDate}
                                        style={{ width: "100%" }}
                                        format="DD-MM-YYYY"
                                    />
                                </Form.Item>
                            </ColWithSixSpan>
                            <ColWithSixSpan>
                                <Form.Item name="POType" label="PO Type">
                                    <Select
                                        placeholder="Select Value"
                                        allowClear
                                    >
                                        <Select.Option key="all" value={""}>
                                            All
                                        </Select.Option>
                                        {dropDown?.DocumentType.map((option) => (
                                            <Select.Option key={option.LookupID} value={option.LookupID}>
                                                {option.LookupDescription}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </ColWithSixSpan>
                            <ColWithSixSpan>
                                <Form.Item name="POStore" label="PO Store">
                                    <Select
                                        placeholder="Select Value"
                                        allowClear
                                    >
                                        <Select.Option key="all" value={""}>
                                            All
                                        </Select.Option>
                                        {dropDown?.StoreDetails.map((option) => (
                                            <Select.Option key={option.StoreId} value={option.StoreId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </ColWithSixSpan>
                        </Row>
                        <Row gutter={16} justify="end" style={{ marginTop: "1rem" }}>
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    <Button htmlType="button" danger onClick={handleReset}>
                                        Reset
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div style={{ position: "relative" }}>
                        {loading && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: "rgba(255, 255, 255, 0.8)", // Light overlay
                                    zIndex: 1000,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Spin size="large" />
                            </div>
                        )}

                        {error && <div>Error: {error}</div>}

                        {/* Conditionally render the report below the form */}
                        {reportUrl && (
                            <div style={{ marginTop: "20px" }}>
                                <h3>Report</h3>
                                <iframe
                                    src={reportUrl}
                                    style={{ width: "100%", height: "500px", border: "none" }}
                                    title="Report"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PurchaseOrderReport;
