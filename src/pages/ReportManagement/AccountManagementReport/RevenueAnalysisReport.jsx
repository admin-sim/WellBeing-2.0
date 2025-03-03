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
    urlGetAllFacilities,
    urlGetAllPatientTypeAsync,
    urlGetAllPayerTypes,
    urlGetAllPaymentTypesAsync,
    urlGetAllProducts,
    urlGetAllService,
    urlGetAllServiceClassifications,
    urlGetAllServiceGroup,
    urlGetAllUsers,
    urlGetFacilityDepartmentBasedOnFacilityId,
    urlGetProviderBasedOnFacilityDepartment,

} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { useNavigate } from "react-router";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";

import { useState, useEffect } from "react";
import dayjs from "dayjs";

const RevenueAnalysisReport = () => {
    const [form] = Form.useForm(); // Ant Design Form hook
    const [dDLoading, setDDLoading] = useState(true);
    const [paymenttypes, setpaymentTypes] = useState([]);
    const [patientttypes, setPatientTypes] = useState([]);
    const [reportUrl, setReportUrl] = useState(null);
    const [error, setError] = useState(null);
    const [facilities, setFacilities] = useState([]);
    const [providerBasedOnFacilityDepartment, setProviderBasedOnFacilityDepartment] = useState([])
    const [providerBasedOnFacilityDepartment1, setProviderBasedOnFacilityDepartment1] = useState([])
    const [allPayerTypes, setAllPayerTypes] = useState([])
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());

    const [loading, setLoading] = useState(false); // State for loader visibility

    useEffect(() => {
        fetchDataHeader();
        GetProviderBasedOnFacilityDepartment(0)
    }, []);

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

    const fetchDataHeader = async () => {
        try {
            const response = await customAxios.get(`${urlGetAllFacilities}`);
            if (response.status === 200 && response.data != null) {
                const userdetail = response.data.data.FacilityModel;
                setFacilities(userdetail);
            } else {
            }
        } catch (error) { }

        try {
            const response = await customAxios.get(`${urlGetAllPatientTypeAsync}`);
            if (response.status === 200 && response.data != null) {
                const paymentdetail = response.data.data.masters;
                setPatientTypes(paymentdetail);
            } else {
            }
        } catch (error) { }
    };

    async function GetProviderBasedOnFacilityDepartment(id, key) {
        debugger
        try {
            const response = await customAxios.get(`${urlGetProviderBasedOnFacilityDepartment}?facilityDepartment=${id}`);
            if (response.status === 200 && response.data != null) {
                const detail = response.data.data.FacilityDepartmentServiceLocations;
                if (!key) {
                    setProviderBasedOnFacilityDepartment1(detail)
                    setProviderBasedOnFacilityDepartment(detail);
                } else if (key === 1) {
                    setProviderBasedOnFacilityDepartment1(detail)
                } else {
                    setProviderBasedOnFacilityDepartment(detail);
                }
                setDDLoading(false)
            } else {
            }
        } catch (error) { }
    }

    async function GetAllPayerTypes(key) {
        try {
            const response = await customAxios.get(`${urlGetAllPayerTypes}`);
            if (response.status === 200 && response.data != null) {
                const detail = response.data.data;
                key === 1 ? setProviderBasedOnFacilityDepartment1(detail)
                    : setProviderBasedOnFacilityDepartment(detail);
                setDDLoading(false)
            } else {
            }
        } catch (error) { }
    }

    async function GetFacilityDepartmentBasedOnFacilityId(id, key) {
        try {
            const response = await customAxios.get(`${urlGetFacilityDepartmentBasedOnFacilityId}?FacilityId=${id}`);
            if (response.status === 200 && response.data != null) {
                const detail = response.data.data;
                key === 1 ? setProviderBasedOnFacilityDepartment1(detail)
                    : setProviderBasedOnFacilityDepartment(detail);
                setDDLoading(false)
            } else {
            }
        } catch (error) { }
    }

    async function GetAllServiceGroup(key) {
        try {
            const response = await customAxios.get(`${urlGetAllServiceGroup}`);
            if (response.status === 200 && response.data != null) {
                const detail = response.data.data;
                key === 1 ? setProviderBasedOnFacilityDepartment1(detail)
                    : setProviderBasedOnFacilityDepartment(detail);
                setDDLoading(false)
            } else {
            }
        } catch (error) { }
    }

    async function GetAllServiceClassifications(id, key) {
        try {
            const response = await customAxios.get(`${urlGetAllServiceClassifications}?FacilityId=${id}`);
            if (response.status === 200 && response.data != null) {
                const detail = response.data.data;
                key === 1 ? setProviderBasedOnFacilityDepartment1(detail)
                    : setProviderBasedOnFacilityDepartment(detail);
                setDDLoading(false)
            } else {
            }
        } catch (error) { }
    }

    async function GetAllService(id, key) {
        try {
            const response = await customAxios.get(`${urlGetAllService}?FacilityId=${id}`);
            if (response.status === 200 && response.data != null) {
                const detail = response.data.data;
                key === 1 ? setProviderBasedOnFacilityDepartment1(detail)
                    : setProviderBasedOnFacilityDepartment(detail);
                setDDLoading(false)
            } else {
            }
        } catch (error) { }
    }

    async function GetAllProducts(key) {
        try {
            const response = await customAxios.get(`${urlGetAllProducts}`)
            if (response.status === 200 && response.data != null) {
                const detail = response.data.data;
                key === 1 ? setProviderBasedOnFacilityDepartment1(detail)
                    : setProviderBasedOnFacilityDepartment(detail);
                setDDLoading(false)
            } else {
            }
        } catch (error) { }
    }

    function HandleReportGrouping(value, key) {
        debugger;
        setDDLoading(true)
        form.setFieldsValue({ 'Search': 0 })
        form.setFieldsValue({ 'Search1': 0 })
        if (value == 'Provider') {
            GetProviderBasedOnFacilityDepartment(0, key)
        } else if (value == 'Payer') {
            GetAllPayerTypes(key)
        } else if (value == 'Department') {
            GetFacilityDepartmentBasedOnFacilityId(1, key)
        } else if (value == 'Service Group') {
            GetAllServiceGroup(1, key)
        } else if (value == 'Service Classification') {
            GetAllServiceClassifications(1, key)
        } else if (value == 'Service') {
            GetAllService(1, key)
        } else {
            GetAllProducts(key)
        }
    }

    const onFinish = async (values) => {
        setLoading(true); // Show the loader when fetching the report
        setError(null); // Reset previous errors
        debugger
        const request = {
            FacilityId: 1,
            FromDate: values.FromDate.format("YYYY-MM-DD"),
            ToDate: values.ToDate.format("YYYY-MM-DD"),
            PatientType: values.PatientType == 12155 ? 0 : values.PatientType,
            ReportFor: values.ReportFor,
            ReportGrouping: values.ReportGrouping,
            ReportOption: values.ReportOption,
            GroupingID: values.Search,
            ReportForID: values.Search1,
        };

        try {
            const { url, blob } = await fetchReport(request);
            setReportUrl(url);
            //  setBlobData(blob); // You can use this if you want to download or process the blob.
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // Hide the loader when fetching is complete
        }
    };

    async function fetchReport(request) {
        const response = await fetch(
            "http://localhost:43705/api/ReportsApi/GetRevenueAnalysisRpt",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            }
        );
        console.log("respo", response);

        if (!response.ok) {
            setLoading(false)
            throw new Error("Failed to fetch report")
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return { url, blob };
    }

    const handleReset = () => {
        form.resetFields(); // Reset the form fields to their initial values
    };

    // function HandleReportFor(value) {

    // }

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
                <PageHeader title={"Revenue Analysis Report"} button={false} />
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
                            ToDate: dayjs(),
                            FromDate: dayjs(),
                            ReportOption: "2",
                            Search1: 0,
                            Search: 0,
                            ReportType: "",
                            ReportGrouping: "Provider",
                            ReportFor: "Provider",
                            PatientType: 12155,
                        }}
                        layout="vertical"
                        onFinish={onFinish}
                        form={form}
                    >
                        <Row gutter={16} style={{ marginBottom: "12px" }}>
                            <ColWithSixSpan>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select a Facility!",
                                        },
                                    ]}
                                    name="FacilityId"
                                    label="Facility"
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select the Facility"
                                        style={{ width: "100%" }}
                                        onChange={(value) => console.log(value)}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                    >
                                        {facilities?.map((option) => (
                                            <Select.Option
                                                key={option.FacilityId}
                                                value={option.FacilityId}
                                            >
                                                {option.FacilityName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </ColWithSixSpan>
                            <ColWithSixSpan>
                                <Form.Item name="PatientType" label="Patient Type">
                                    <Select loading={dDLoading}
                                        showSearch
                                        placeholder="Select the PaymentType"
                                        style={{ width: "100%" }}
                                        onChange={(value) => console.log(value)}
                                    >
                                        {patientttypes?.map((response) => (
                                            <Select.Option
                                                key={response.LookupID}
                                                value={response.LookupID}
                                            >
                                                {response.LookupDescription}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </ColWithSixSpan>
                            <ColWithSixSpan>
                                <Form.Item name="ReportGrouping" label="Report Grouping">
                                    <Select
                                        style={{ width: "100%" }}
                                        onChange={(v) => HandleReportGrouping(v, 0)}
                                    >
                                        <Select.Option key='Provider' value='Provider'></Select.Option>
                                        <Select.Option key='Payer' value='Payer'></Select.Option>
                                        <Select.Option key='Department' value='Department'></Select.Option>
                                        <Select.Option key='Service Group' value='Service Group'></Select.Option>
                                        <Select.Option key='Service Classification' value='Service Classification'></Select.Option>
                                        <Select.Option key='Service' value='Service'></Select.Option>
                                        <Select.Option key='Pharmacy' value='Pharmacy'></Select.Option>
                                    </Select>
                                </Form.Item>
                            </ColWithSixSpan>
                            <ColWithSixSpan>
                                <Form.Item name="Search" label="Search">
                                    <Select loading={dDLoading}
                                        showSearch
                                        placeholder="Select the User"
                                        style={{ width: "100%" }}
                                        onChange={(value) => console.log(value)}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                    >
                                        <Select.Option key={0} value={0}>
                                            All
                                        </Select.Option>
                                        {providerBasedOnFacilityDepartment?.map((response) => (
                                            <Select.Option
                                                key={response.ProviderId}
                                                value={response.ProviderId}
                                            >
                                                {response.ProviderName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </ColWithSixSpan>
                            <ColWithSixSpan>
                                <Form.Item
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: "Source Document Required.",
                                    //     },
                                    // ]}
                                    name="ReportFor"
                                    label="Report For"
                                >
                                    <Select
                                        style={{ width: "100%" }}
                                        onChange={(v) => HandleReportGrouping(v, 1)}
                                        defaultValue='Provider'
                                    >
                                        <Select.Option key='Provider' value='Provider'></Select.Option>
                                        <Select.Option key='Payer' value='Payer'></Select.Option>
                                        <Select.Option key='Department' value='Department'></Select.Option>
                                        <Select.Option key='Service Group' value='Service Group'></Select.Option>
                                        <Select.Option key='Service Classification' value='Service Classification'></Select.Option>
                                        <Select.Option key='Service' value='Service'></Select.Option>
                                        <Select.Option key='Pharmacy' value='Pharmacy'></Select.Option>
                                    </Select>
                                </Form.Item>
                            </ColWithSixSpan>
                            <ColWithSixSpan>
                                <Form.Item name="Search1" label="Search">
                                    <Select>
                                        <Select.Option key={0} value={0}>
                                            All
                                        </Select.Option>
                                        {providerBasedOnFacilityDepartment1?.map((response) => (
                                            <Select.Option
                                                key={response.ProviderId}
                                                value={response.ProviderId}
                                            >
                                                {response.ProviderName}
                                            </Select.Option>
                                        ))}
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
                                <Form.Item name="ReportOption" label="Report Option"
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: "Please select",
                                //     },
                                // ]}
                                >
                                    <Select
                                        placeholder="Select Value"
                                    >
                                        {/* <Select.Option key='1' value='1'>Consolidated</Select.Option> */}
                                        <Select.Option key='2' value='2'>Detailed</Select.Option>
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

export default RevenueAnalysisReport;
