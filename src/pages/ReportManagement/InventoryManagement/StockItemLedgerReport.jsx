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
    urlAutocomplete,
    urlGetPurshaseOrderDetails
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { useNavigate } from "react-router";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { ColWithSixSpan } from "../../../components/customGridColumns/index.jsx";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const StockItemLedgerReport = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [productOptions, setProductOptions] = useState([]);
    const [productId, setProductId] = useState();
    const [reportUrl, setReportUrl] = useState(null);
    const [error, setError] = useState(null);
    const [blobData, setBlobData] = useState(null);
    const [loading, setLoading] = useState(false); // State for loader visibility
    const [dropDown, setDrpoDown] = useState();
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());
    const [users, setUsers] = useState([]);
    const userContext = useSelector((state) => state.userContext.value);

    useEffect(() => {
        fetchDataHeader();
    }, []);

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const response = await customAxios.get(urlAutocomplete);
            if (response.status === 200 && response.data != null) {
                const userdetail = response.data.data;
                setUsers(userdetail);
            } else {
            }
        } catch (error) { }
    }

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
        setError(null); // Reset previous errors

        const request = {
            FacilityId: 1,
            FromDate: values.FromDate.format("YYYY-MM-DD"),
            ToDate: values.ToDate.format("YYYY-MM-DD"),
            PONo: values.StoreName,
            ProductId: values.ProductId == 'All' ? 0 : values.ProductId,
            Use: 'Admin',
            AppUser: userContext.AppUserName
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
            "https://192.168.29.254:808/api/ReportsApi/GetStockItemLedgerRpt",
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
        debugger
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
                <PageHeader title={"Stock Item Ledger Report"} button={false} />
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
                            StoreName: 1
                        }}
                        layout="vertical"
                        onFinish={onFinish}
                        form={form}
                    >
                        <Row gutter={16} style={{ marginBottom: "12px" }}>
                            <ColWithSixSpan>
                                <Form.Item name="StoreName" label="Store Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select",
                                        },
                                    ]}
                                >
                                    <Select
                                    // placeholder="Select Value"
                                    // allowClear
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
                                <Form.Item name="ProductId" label="Product Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Pick Date",
                                        },
                                    ]}
                                >
                                    <Select
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
                                        {/* "All" option as the first item */}
                                        {/* <Select.Option key="all" value={"All"}>
                                            All
                                        </Select.Option> */}

                                        {/* Mapping the users */}
                                        {users?.map((response) => (
                                            <Select.Option
                                                key={response.ProductId}
                                                value={response.ProductId}
                                            >
                                                {response.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    {/* <AutoComplete
                                        options={productOptions}
                                        placeholder='Please Search Product'
                                        onSearch={handleSearch}
                                        onSelect={(value, option) =>
                                            handleSelect(value, option, "ProductName")
                                        }
                                        onChange={(value) => {
                                            if (!value) {
                                                setProductOptions([]);
                                            }
                                        }}
                                        allowClear={{
                                            clearIcon: <CloseSquareFilled />,
                                        }}
                                    /> */}
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
                                <Form.Item name="ToDate" label="To Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Pick Date",
                                        },
                                    ]}
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

export default StockItemLedgerReport;
