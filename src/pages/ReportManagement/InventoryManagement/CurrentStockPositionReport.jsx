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
    CloseSquareFilled,
} from "@ant-design/icons";
import {
    urlAutocompleteProduct,
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

const CurrentStockPositionReport = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [productId, setProductId] = useState(0);
    const [productOptions, setProductOptions] = useState([]);
    const [reportUrl, setReportUrl] = useState(null);
    const [error, setError] = useState(null);
    const [blobData, setBlobData] = useState(null);
    const [dropDown, setDrpoDown] = useState();
    const [loading, setLoading] = useState(false); // State for loader visibility

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

    const onFinish = async (values) => {
        debugger
        setLoading(true); // Show the loader when fetching the report
        setError(null); // Reset previous errors

        const request = {
            FacilityId: 1,
            ProductId: productId,
            POStore: values.StoreName,
            ReportOption: values.ReportOption
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
            "https://192.168.29.254:808/api/ReportsApi/GetCurrentStockPositionRpt",
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

    const handleSearch = async (searchText) => {
        if (searchText) {
            const response = await customAxios.get(
                `${urlAutocompleteProduct}?Product=${searchText}`
            );
            const apiData = response.data.data;

            const newOptions = apiData.map((item) => ({
                value: item.LongName,
                key: item.ProductId,
                UomId: item.UOMPrimaryUOM,
            }));
            setProductOptions(newOptions);
        } else {
            setProductId(0)
        }
    };

    const handleSelect = (value, option, column) => {
        setProductId(option.key)
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
                <PageHeader title={"Current Stock Position Report"} button={false} />
                <div
                    style={{
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        margin: "1rem",
                        boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
                    }}
                >
                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        form={form}
                    >
                        <Row gutter={16} style={{ marginBottom: "12px" }}>
                            <ColWithSixSpan>
                                <Form.Item name="StoreName" label="Store"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Select Value"
                                        allowClear
                                    >
                                        {dropDown?.StoreDetails.map((option) => (
                                            <Select.Option key={option.StoreId} value={option.StoreId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </ColWithSixSpan>
                            <ColWithSixSpan>
                                <Form.Item name="Currentstockposition" label="Current stock position as On"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select",
                                        },
                                    ]}
                                >
                                    <AutoComplete
                                        options={productOptions}
                                        onSearch={handleSearch}
                                        placeholder='Please Search Product'
                                        onSelect={(value, option) =>
                                            handleSelect(value, option, "Currentstockposition")
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
                            </ColWithSixSpan>
                            <ColWithSixSpan>
                                <Form.Item name="ReportOption" label="Report Option"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Select Value"
                                        allowClear
                                    >
                                        <Select.Option key='1' value='1'>Consolidated</Select.Option>
                                        <Select.Option key='2' value='2'>Detailed</Select.Option>
                                    </Select>
                                </Form.Item>
                            </ColWithSixSpan>
                        </Row>
                        <Row gutter={16} justify="end" style={{ marginTop: "1rem" }}>
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Preview
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    <Button htmlType="button" danger onClick={handleReset}>
                                        Exit
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

export default CurrentStockPositionReport;
