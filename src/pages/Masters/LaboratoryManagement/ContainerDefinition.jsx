import React, { useState, useRef, useEffect } from "react";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import Layout from 'antd/es/layout/layout';
import {
    Spin,
    Skeleton,
    Tag,
    InputNumber,
    Typography,
    Select,
    Button,
    Form,
    Input,
    Row,
    Col,
    DatePicker,
    Card,
    Divider,
    Tooltip,
    Table,
    AutoComplete,
    Checkbox,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";

import { urlLoadContInfoGrid, urlLoadSubTestMapGridData } from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import { render } from "react-dom";
import FormItem from "antd/es/form/FormItem/index.js";
import TextArea from "antd/es/input/TextArea";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const ContainerDefinition = () => {
    const [subTestMappingIndex, setSubTestMappingIndex] = useState({
        SingleTests: [],
        Gender: [],
        Durations: [],
        ListTestMethodModel: []
    });
    const [paginationSize, setPaginationSize] = useState(5);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [mainTestOptions, setMainTestOptions] = useState([]);
    const [subTestOptions, setSubTestOptions] = useState([]);
    const { Title } = Typography;
    const hasEffectRun = useRef(false);

    useEffect(() => {
        if (!hasEffectRun.current) {
            try {
                customAxios.get(urlLoadContInfoGrid).then((response) => {
                    debugger
                    const apiData = response.data.data;
                    setFilteredData(apiData);
                });
            } catch (error) {
                //console.error("Error fetching purchase order details:", error);        
            }
            hasEffectRun.current = true;
        }
    }, []);

    const navigate = useNavigate();

    const GetPobyId = (PoHeaderId) => {
        debugger;
        navigate("/CreatePurchaseOrder", { state: { PoHeaderId } });
    };

    const [formatedFromDate, setFormatedFromDate] = useState();
    const [formatedToDate, setFormatedToDate] = useState();
    function formatDate(inputDate) {
        const dateParts = inputDate.split("/");
        if (dateParts.length === 3) {
            const [year, month, day] = dateParts;
            return `${day}-${month}-${year}`;
        }
        return inputDate; // Return as is if not in the expected format
    }

    const handleCancel = () => {

    }

    const onFinish = async (values) => {
        debugger;
        setIsSearchLoading(true);
        setLoading(true);
        try {
            const postData1 = {
                DocumentType: values.DocumentType,
                Supplier: values.Supplier,
                ProcurementStore: values.ProcurementStore,
                POStatus: values.POStatus === "" ? null : values.POStatus,
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                // FromDate: values.FromDate.$D.toString().padStart(2, "0") + "-" + (values.FromDate.$M + 1).toString().padStart(2, "0") + "-" + values.FromDate.$y,
                // ToDate: values.ToDate.$D.toString().padStart(2, "0") + "-" + (values.ToDate.$M + 1).toString().padStart(2, "0") + "-" + values.ToDate.$y,
                PONumber: values.PONumber === undefined ? null : values.PONumber, // A sample value
            };
            customAxios
                .get(
                    `${urlSearchPurchaseOrder}?DocumentType=${postData1.DocumentType}&Supplier=${postData1.Supplier}&ProcurementStore=${postData1.ProcurementStore}&DocumentStatus=${postData1.POStatus}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&PoNumber=${postData1.PONumber}`,
                    null,
                    {
                        params: postData1,
                        headers: {
                            "Content-Type": "application/json", // Replace with the appropriate content type if needed
                        },
                    }
                )
                .then((response) => {
                    debugger;
                    setFilteredData(response.data.data.PurchaseOrderDetails);
                    response.data.data.PurchaseOrderDetails.PoHeaderId
                    if (response.data.data.PurchaseOrderDetails.length > 0) {
                        setIsTableHasValues(true);
                    }
                    // setCurrentPage1(1);
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            // Handle any errors here
            console.error("Error:", error);
        }
        setIsSearchLoading(false);
    };

    const onReset = () => {
        setIsTableHasValues(false);
        form.resetFields();
    };

    const handleSelect = (value, option, key) => {
        debugger;
        try {
            customAxios.get(`${urlGetProductDetailsById}?ProductId=${option.key}`).then((response) => {
                debugger;
                const apiData = response.data.data;
            });
        } catch (error) {
            //console.error("Error fetching purchase order details:", error);        
        }
    };

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const onSearch = (value) => {
        debugger;

    };

    const onChange = (value) => {
        debugger
        try {
            customAxios.get(`${urlLoadSubTestMapGridData}?TestId=${value}`).then((response) => {
                debugger;
                const apiData = response.data.data.SubTestMappingList;
                setFilteredData(apiData)
            });
        } catch (error) {
            //console.error("Error fetching purchase order details:", error);        
        }
    }

    const handleDelete = () => {

    }

    const handleCheckboxChange = (e) => {
        setIsActive(e.target.checked);
    };

    const columns = [
        {
            title: "Container ID",
            dataIndex: "CDID",
            key: "CDID",
        },
        {
            title: "Container Name",
            dataIndex: "ContainerName",
            key: "ContainerName",
        },
        {
            title: "Container Value",
            dataIndex: "ValuesName",
            key: "ValuesName",
        },
        {
            title: "Is Active",
            dataIndex: "IsActive",
            key: "IsActive",
            render: (IsActive) => <Checkbox checked={IsActive} />
        }
    ];

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Test Method Management
                        </Title>
                    </Col>
                </Row>
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    pagination={{
                        onChange: (current, pageSize) => {
                            setPage(current);
                            setPaginationSize(pageSize);
                        },
                        defaultPageSize: 10,
                        hideOnSinglePage: true,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    }}
                    rowKey={(row) => row.AppUserId}
                    size="small"
                    bordered
                />
                <Row justify="end" style={{ padding: '0rem 1rem' }}>
                    <Col style={{ marginRight: '10px' }}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item>
                            <Button type="primary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

export default ContainerDefinition;
