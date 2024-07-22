import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder, urlSearchUHID, urlShowPatientIssueBatchDetails, urlAutocompleteProduct, urlUpdatePatientIndent, urlCreatePatientIssue, urlGetProductDetailsById, urlAddNewIndentPatientIssue } from '../../../endpoints.js';
import Select from 'antd/es/select';
import { ConfigProvider, Card, Typography, Checkbox, message, Tooltip, Modal, Tag, Popconfirm, Spin, Col, Divider, Row, AutoComplete } from 'antd';
import Input from 'antd/es/input';
import Form from 'antd/es/form';
import { DatePicker } from 'antd';
import Layout from 'antd/es/layout/layout';
import { LeftOutlined } from '@ant-design/icons';
//import Typography from 'antd/es/typography';
import { useNavigate } from 'react-router';
import { Table, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useLocation } from "react-router-dom";
//import { useParams } from 'react-router-dom';

const UpdatePatientIssue = () => {
    const [DropDown, setDropDown] = useState({
        DocumentType: [],
        StoreDetails: [],
        SupplierList: [],
        UOM: [],
        TaxType: [],
        DateFormat: []
    });

    let [counter, setCounter] = useState(0);
    let [modelCounter, setModelCounter] = useState(0)

    const [encounter, setEncounter] = useState([]);
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const { Title } = Typography;
    const { TextArea } = Input;
    const { Option } = Select;
    const navigate = useNavigate();
    //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');    
    const [data, setData] = useState([]);
    const [dataModal, setDataModal] = useState([]);
    const [poloading, setPoloading] = useState(false);
    const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
    const fields = form1.getFieldsValue();
    const location = useLocation();
    const indentId = location.state.IndentId;
    const [batchOpen, setBatchOpen] = useState(false)
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [productDetails, setProductDetails] = useState([]);
    const [issueStatus, setIssueStatus] = useState(false);
    const [batchDetails, setBatchDetails] = useState()

    useEffect(() => {
        debugger
        customAxios.get(urlCreatePurchaseOrder).then((response) => {
            const apiData = response.data.data;
            setDropDown(apiData);
        });
        if (indentId > 0) {
            customAxios.get(`${urlCreatePatientIssue}?IndentId=${indentId}`).then((response) => {
                const apiData = response.data.data;
                if (apiData.IndentDetails != null && apiData.IndentDetails.length > 0) {
                    const products = apiData.IndentDetails.map((item, index) => {
                        let matchedProduct = null;

                        if (apiData.newIndentIssueModel.length > 0) {
                            matchedProduct = apiData.newIndentIssueModel.find((item1, index1) => {
                                if (item1.ProductId === item.ProductId && apiData.newPatientIssueModel.IndentId === item.IndentId) {
                                    return true;
                                }
                                return false;
                            });

                            if (matchedProduct) {
                                return {
                                    ...matchedProduct,
                                    key: index,
                                    IssueQty: matchedProduct.IssueQty,
                                    PatientIssueLineId: matchedProduct.PatientIssueLineId,
                                    AvlQtyatIssue: item.StockBalanceQty,
                                    Remarks: matchedProduct.Remarks,
                                    RequestQty: item.RequestQty,
                                    PendingQty: item.PendingQty,
                                    index: index + 1
                                };
                            }
                        }

                        return {
                            ...item,
                            key: index,
                            AvlQtyatIssue: item.AvlIssueQuantity,
                            // RequestingStoreStock: item.RequestQty,
                            PendingQty: item.PendingQty,
                            index: index + 1
                        };
                    });
                    setData(products);
                    setCounter(products.length);
                    const batch = apiData.BatchDetails.map((item, index) => {
                        return {
                            ...item,
                            key: index,
                            index: index + 1
                        }
                    })
                    setDataModal(batch)
                    setModelCounter(batch.length)
                    setIsTableVisible(true);
                }

                const formdata = apiData.newIndentModel
                form1.setFieldsValue({
                    IssuingStore: formdata.IssueingStoreId,
                    IndentType: formdata.IndentType,
                    Remarks: formdata.Remarks,
                    IndentNumber: formdata.IndentNumber,
                    IssueStatus: formdata.IssueStatus == 'Created' || formdata.IssueStatus == 'Pending' ? undefined : formdata.IssueStatus,
                    UHID: formdata.UhId,
                    Name: formdata.PatientName,
                    Encounter: formdata.Encounter,
                    EncounterId: formdata.EncounterId,
                    PatientId: formdata.PatientId,
                    IndentId: formdata.IndentId,
                    IssueId: apiData.newPatientIssueModel != null ? apiData.newPatientIssueModel.IssueId : 0
                })
            });
        }
    }, []);

    const onOkModal = async () => {
        debugger
        await form2.validateFields();
        const totalQuantity = dataModal.reduce((sum, item) => sum + item.IssueQty, 0);
        if (productDetails.IssueQty === totalQuantity) {
            setBatchOpen(false);
            form2.submit()
        }
        else {
            message.warning('Batch Qty is must equals to Issued Qty')
        }
    }

    const onFinishmodal = (values) => {
        debugger;
        // setPoloading(true);
        // setIsPoSearchTable(true);
        // const postData = {
        //     Supplier: values.Supplier,
        //     ReceivingStore: values.ReceivingStore,
        //     POStatus: values.POStatus,
        //     FromDate: values.PODateFrom === undefined || values.PODateFrom === null ? '' : (values.PODateFrom.$D.toString().padStart(2, '0') + '-' + (values.PODateFrom.$M + 1).toString().padStart(2, '0') + '-' + values.PODateFrom.$y).toString(),
        //     ToDate: values.PODateTo === undefined || values.PODateTo === null ? '' : (values.PODateTo.$D.toString().padStart(2, '0') + '-' + (values.PODateTo.$M + 1).toString().padStart(2, '0') + '-' + values.PODateTo.$y).toString(), // A sample value
        // }
        // try {
        //   customAxios.get(`${urlSearchPendingPO}?Supplier=${postData.Supplier}&ReceivingStore=${postData.ReceivingStore}&POStatus=${postData.POStatus}&PODateFrom=${postData.FromDate}&PODateTo=${postData.ToDate}`).then((response) => {
        //     debugger;
        //     const apiData = response.data.data;
        //     setDataModal(apiData.PurchaseOrderDetails);
        //     setPoloading(false);
        //   });
        // } catch (error) {
        //   // Handle the error as needed
        // }
    }    

    function isExpired(dateString) {
        if (new Date() > new Date(dateString)) {
            return false
        }
        else {
            return true
        }
    }

    const OpenBatch = async (record) => {
        debugger
        setProductDetails(record)
        await form1.validateFields()
        const va = form1.getFieldsValue()
        record.IssueQty = va[record.key].IssueQty
        setProductDetails(record)
        const batch = {
            IssueQty: record.IssueQty,
            ProductId: record.ProductId,
            IssueId: record.IssueingStoreId,
            StoreId: record.IssueingStoreId
        }
        const post1 = {
            newIndentModel: batch,
            Batch: dataModal
        }
        try {
            const response = await customAxios.post(urlShowPatientIssueBatchDetails, post1, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const ApiData = response.data.data;
            if (ApiData.Batch.length > 0) {
                const batch = ApiData.Batch.map((item, index) => {
                    if (item.ProductId == ApiData.ProductDefinitionModel.ProductDefinitionId && item.ActiveFlag != false) {
                        if (item.IssueBatchId != 0) {
                            const newitem = {
                                ...item,
                                key: index,
                                BatchNo: item.BatchNo,
                                IssueQty: item.IssueQty,
                                AvlQty: item.BalanceQty,
                                Uom: item.Uom,
                                EXPDate: item.EXPDate,
                                IssueRate: item.IssueRate,
                                Amount: item.IssueRate * item.IssueQty,
                                StockLocator: item.StockLocatorName,
                                index: index + 1
                            };
                            return newitem
                        }
                        return item
                    }
                    return item
                })
                setDataModal(batch)
                setModelCounter(batch.length)
            }
            else if (ApiData.BatchDetails.length > 0) {
                let qty = 0; let amount = 0; let totalbatchqty = 0; let total = 0;
                const batch = ApiData.BatchDetails.map((item, index) => {
                    total += qty;
                    qty = item.PendingQty;
                    totalbatchqty += qty;

                    if (totalbatchqty > ApiData.newIndentModel.IssueQty) {
                        qty = ApiData.newIndentModel.IssueQty - total;
                    }

                    amount = qty * item.MRP;

                    if (isExpired(item.EXPDate)) {
                        if (qty > 0) {
                            const newitem = {
                                ...item,
                                key: index,
                                BatchNo: item.BatchNo,
                                IssueQty: qty,
                                AvlQty: item.PendingQty,
                                Uom: item.Uom,
                                EXPDate: item.EXPDate,
                                IssueRate: item.MRP,
                                Amount: amount,
                                StockLocator: item.StockLocatorName,
                                index: index + 1
                            };
                            return newitem
                        }
                        return null
                    }
                    return null;
                }).filter(item => item !== null);
                setDataModal(batch);
                setModelCounter(batch.length)
            }
            const batch = ApiData.BatchDetails.map((item, index) => {
                return {
                    ...item,
                    key: index,
                    index: index + 1
                }
            })
            setBatchDetails(batch)
            // setCounter(ApiData.Batch.length > 0 ? ApiData.Batch.length + 1 : ApiData.BatchDetails.length + 1)
        } catch (error) {

        }
        setBatchOpen(true)
    }

    const validateNotGreaterValue = (record, value) => {
        if (value > record.PendingQty || value > record.AvlQtyatIssue) {
            if (value > record.PendingQty) {
                return Promise.reject(new Error('Must not Greater than Pending Qty!'));
            }
            else if (value > record.AvlQtyatIssue) {
                return Promise.reject(new Error('Must not Greater than Available at Issue!'));
            }

        }
        else {
            return Promise.resolve();
        }
    };

    const validateEqualValue = (record, value) => {
        debugger
        if (record.IssueQty <= record.AvlQty) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Equals to Issued Qty!'));
    }

    const validateExpiryValue = (record, value) => {
        debugger
        if (isExpired(record.EXPDate)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Batch is Expired!'))
    }

    const columns = [
        {
            title: 'Product',
            dataIndex: 'ProductName',
            key: 'ProductName',
            width: 450,
            render: (_, record) => (
                <>
                    <Form.Item name={[record.key, 'ProductName']} style={{ width: '100%' }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input!'
                            }
                        ]}
                        initialValue={record.ProductName}
                    >
                        <Input disabled />
                        {/* <AutoComplete style={{ width: '100%' }} disabled={!!indentId && record.IndentLineId}
                            options={autoCompleteProduct}
                            onSearch={(value) => getPanelValue1(value, record.key)}
                            onSelect={(value, option) => handleSelect1(value, option, record.key)}
                            placeholder="Search for a product"
                            allowClear
                        /> */}
                    </Form.Item>
                    <Form.Item name={[record.key, 'ProductId']} hidden initialValue={record.ProductId}>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item name={[record.key, 'PatientIssueLineId']} hidden initialValue={record.PatientIssueLineId}>
                        <Input></Input>
                    </Form.Item>
                </>
            )
        },
        {
            title: 'UOM',
            dataIndex: 'UomId',
            key: 'UomId',
            render: (text, record) => (
                <Form.Item name={[record.key, 'UomId']} initialValue={record.UomId}>
                    <Select disabled defaultValue={record.UomId}>
                        {DropDown.UOM.map((option) => (
                            <Select.Option key={option.UomId} value={option.UomId}>
                                {option.FullName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item >
            )
        },
        {
            title: 'Requested Qty',
            dataIndex: 'RequestQty',
            key: 'RequestQty',
            render: (text, record) => (
                <Form.Item initialValue={record.RequestQty}
                    name={[record.key, 'RequestQty']}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!'
                        }
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Issue Qty',
            dataIndex: 'IssueQty',
            key: 'IssueQty',
            render: (text, record) => (
                <Form.Item name={[record.key, 'IssueQty']}
                    initialValue={record.IssueQty != null ? record.IssueQty : 0}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!'
                        },
                        {
                            validator: (_, value) => validateNotGreaterValue(record, value)
                        }
                    ]}
                >
                    <InputNumber allowClear min={0} />
                </Form.Item>
            )
        },
        {
            title: 'Avl Qty at Issue',
            dataIndex: 'AvlQtyatIssue',
            key: 'AvlQtyatIssue',
            render: (text, record) => (
                <Form.Item name={[record.key, 'AvlQtyatIssue']} initialValue={record.AvlQtyatIssue}>
                    <InputNumber disabled />
                </Form.Item>
            )
        },
        {
            title: 'Remarks',
            dataIndex: 'Remarks',
            key: 'Remarks',
            render: (text, record) => (
                <Form.Item name={[record.key, 'Remarks']} initialValue={record.Remarks}>
                    <Input />
                </Form.Item>
            )
        },
        {
            title: 'Batch',
            dataIndex: 'Batch',
            key: 'Batch',
            render: (text, record) => (
                <Button type='link' onClick={() => OpenBatch(record)}>Batch</Button>
            )
        },
        {
            title: 'Pending Qty',
            dataIndex: 'PendingQty',
            key: 'PendingQty',
            render: (text, record) => (
                <>
                    <Form.Item name={[record.key, 'PendingQty']} initialValue={record.PendingQty}>
                        <InputNumber disabled />
                    </Form.Item>
                </>
            )
        },
    ]

    // const handleDelete = (record) => {
    //     const newData = data.map((item) => {
    //         if (item.key === record.key) {
    //             return { ...item, ActiveFlag: false };
    //         }
    //         return item;
    //     });
    //     setData(newData);
    // };

    const handleAddBatch = async () => {
        debugger;
        await form2.validateFields();
        setDataModal([
            ...dataModal,
            {
                key: modelCounter,
                BatchNo: '',
                IssueQty: '',
                AvlQty: '',
                UomId: '',
                EXPDate: '',
                Rate: '',
                IssueRate: '',
                Stocklocator: '',
                ActiveFlag: true,
            },
        ]);
        setModelCounter(modelCounter + 1);
    };

    const BatchSelect = (value, record) => {
        debugger
        form2.resetFields()
        const IsExist = dataModal.filter((item) => item.BatchNo == record && item.BatchNo != '' && item.ActiveFlag == true)
        if (IsExist.length > 0) {
            message.warning('Same Batch No should not be selected.')
            return false
        }
        const newdata = dataModal.map((item) => {
            const matchingBatch = batchDetails.find((item1) => item.key === record.key && value === item1.BatchNo);
            if (matchingBatch) {
                return {
                    ...item,
                    BatchNo: matchingBatch.BatchNo,
                    IssueQty: 0,
                    AvlQty: matchingBatch.PendingQty,
                    Uom: matchingBatch.Uom,
                    IssueBatchId: 0,
                    EXPDate: matchingBatch.EXPDate,
                    IssueRate: matchingBatch.MRP,
                    Amount: 0
                };
            }
            return item;
        });
        setDataModal(newdata);
    }

    const handleQuantityChange = (value, record) => {
        debugger
        const newData = dataModal.map(item => {
            if (item.key === record.key) {
                const updatedItem = {
                    ...item,
                    IssueQty: value,
                    Amount: value * item.IssueRate
                };
                return updatedItem;
            }
            return item;
        });
        setDataModal(newData);
    }
    const columnsModel = [
        {
            title: "BatchNo",
            dataIndex: "BatchNo",
            width: 100,
            key: "BatchNo",
            render: (text, record, index) => (
                <>
                    <Form.Item
                        name={[record.key, "BatchNo"]}
                        rules={[{ required: true, message: "Required" }]}
                        initialValue={record.BatchNo}
                    >
                        <Select allowClear onChange={(value) => BatchSelect(value, record)} style={{ width: 100 }} disabled={!!record.IssueBatchId}>
                            {batchDetails.map((option) => (
                                <Select.Option key={option.BatchNo} value={option.BatchNo}>{option.BatchNo}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name={[record.key, "BatchId"]} initialValue={record.StockId} hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item name={[record.key, "IssueBatchId"]} initialValue={record.StockId} hidden>
                        <Input />
                    </Form.Item>
                </>

            ),
        },
        {
            title: "Quantity",
            dataIndex: "IssueQty",
            key: "IssueQty",
            width: 100,
            render: (text, record, index) => (
                <Form.Item name={[record.key, "IssueQty"]} initialValue={record.IssueQty}
                    rules={[{ required: true, message: "Required" },
                    {
                        validator: (_, value) => validateEqualValue(record, value)
                    }
                    ]}
                    style={{ width: "100%" }}
                >
                    <InputNumber min={0} onChange={(value) => handleQuantityChange(value, record)} />
                </Form.Item>
            ),
        },
        {
            title: "AvlQty",
            dataIndex: "AvlQty",
            key: "AvlQty",
            render: (text, record, index) => (
                <Form.Item name={[record.key, "AvlQty"]} initialValue={record.AvlQty}>
                    <Input style={{ width: 70 }} disabled />
                </Form.Item>
            ),
        },
        {
            title: "Uom",
            dataIndex: "UomId",
            width: 100,
            key: "UomId",
            render: (text, record, index) => (
                <Form.Item
                    name={[record.key, "UomId"]}
                >
                    <Input style={{ width: 100 }} defaultValue={record.Uom} disabled />
                </Form.Item>
            ),
        },
        {
            title: "Exp Date",
            dataIndex: "EXPDate",
            width: 100,
            key: "EXPDate",
            render: (text, record, index) => (
                <Form.Item
                    name={[record.key, "EXPDate"]}
                    initialValue={record.EXPDate == '' ? undefined : DateBindtoDatepicker(record.EXPDate)}
                    rules={[{ required: true, message: "Required" },
                    {
                        validator: (_, value) => validateExpiryValue(record, value)
                    }
                    ]}
                >
                    <DatePicker style={{ width: 100 }} disabled format='MMMM YYYY'></DatePicker>
                </Form.Item>
            ),
        },
        {
            title: "Rate",
            dataIndex: "IssueRate",
            width: 100,
            key: "IssueRate",
            render: (text, record, index) => (
                <Form.Item
                    name={[record.key, "IssueRate"]}
                    initialValue={record.IssueRate}
                >
                    <Input style={{ width: 100 }} allowClear disabled />
                </Form.Item>
            ),
        },
        {
            title: "Amount",
            dataIndex: "Amount",
            width: 100,
            key: "Amount",
            render: (text, record, index) => (
                <Form.Item name={[record.key, "Amount"]} initialValue={record.Amount}>
                    <Input style={{ width: 100 }} allowClear disabled />
                </Form.Item>
            ),
        },
        {
            title: "Stock Locator",
            dataIndex: "StockLocator",
            width: 100,
            key: "StockLocator",
            render: (text, record, index) => (
                <Form.Item
                    name={[record.key, "StockLocator"]}
                    initialValue={record.StockLocatorName}
                >
                    <Input style={{ width: 100 }} allowClear disabled />
                </Form.Item>
            ),
        },
        {
            title: (
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddBatch}
                ></Button>
            ),
            dataIndex: "add",
            key: "add",
            width: 50,
            render: (text, record) => (
                <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => ModelDelete(record)}
                >
                    <DeleteOutlined />
                </Popconfirm>
            ),
        },
    ];

    const ModelDelete = (record) => {
        debugger
        const newData = dataModal.map((item) => {
            if (item.key === record.key) {
                return { ...item, ActiveFlag: false };
            }
            return item;
        });
        setDataModal(newData);
    }

    const DateBindtoDatepicker = (value) => {
        const isoDateString = value;
        const dateValue = new Date(isoDateString);
        const formattedDate = dayjs(dateValue).format("DD-MM-YYYY");
        return dayjs(formattedDate, "DD-MM-YYYY");
    };

    const onCancelmodal = () => {
        setDataModal([])
        setModelCounter(0)
        form2.resetFields()
        setBatchOpen(false)
    }

    const handleCancel = () => {
        const url = '/PatientIssue';
        navigate(url);
    }
    // const ShowModel = () => {
    //     debugger;
    //     const uhid = form1.getFieldValue('UHID');
    //     form1
    //         .validateFields(['UHID'])
    //         .then(() => {
    //             setBatchOpen(false);
    //         })
    //         .catch((error) => {
    //             console.log('Validation error:', error);
    //         });
    // }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleOnFinish = async (values) => {
        debugger;

        if (dataModal.length == 0) {
            message.warning('Please Add Batch Details!')
            return false
        }

        const products = [];

        for (let i = 0; i <= counter; i++) {
            if (data[i] !== undefined && values[i] !== undefined) {
                const product = {
                    ProductId: data[i].ProductId,
                    UomId: data[i].UomId,
                    RequestQty: data[i].RequestQty,
                    IssueQty: values[i].IssueQty,
                    PendingQty: values[i].PendingQty - values[i].IssueQty,
                    PatientIssueLineId: data[i].PatientIssueLineId,
                    Remarks: values[i].Remarks
                }
                products.push(product);
            }
        }

        const Indent = {
            FacilityId: 1,
            IssueingStoreId: values.IssuingStore,
            IssueDateString: values.IssueDate ? values.IssueDate.format("DD-MM-YYYY") : "",
            IndentId: values.IndentId,
            PatientId: values.PatientId,
            EncounterId: values.EncounterId,
            IssueStatus: !issueStatus ? 'Created' : values.IssueStatus,
            IssueId: values.IssueId ? values.IssueId : 0,
            IndentType: values.IndentType,
            IndentCategory: 'PatientIssue',
        }
        const postData = {
            newIndentModel: Indent,
            IndentDetails: products,
            Batch: dataModal
        }
        if (indentId > 0) {
            const response = await customAxios.post(urlAddNewIndentPatientIssue, postData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            handleCancel();
        }
    };

    const SubmitChanged = (event) => {
        setIssueStatus(event.target.checked)
    }

    const GetUHID = (value) => {
        if (value !== "") {
            customAxios.get(`${urlSearchUHID}?Uhid=${value}`).then((response) => {
                const apiData = response.data.data;
                const newOptions = apiData.map(item => ({ value: item.UhId, key: item.UhId, PatientId: item.PatientId, PatientName: item.PatientFirstName + '' + item.PatientLastName }));
                setAutoCompleteOptions(newOptions);
            });
        } else {
            setEncounter([]);
            form1.setFieldsValue({ Encounter: '' });
            form1.setFieldsValue({ Name: '' });
        }
    }

    // const handleSelect = (value, option) => {
    //     form1.setFieldsValue({ Name: option.PatientName });
    //     form1.setFieldsValue({ UHID: option.value });
    //     customAxios.get(`${urlGetLastEncounter}?Uhid=${option.key}`).then((response) => {
    //         const apiData = response.data.data;
    //         if (apiData.length > 0) {
    //             setEncounter(apiData);
    //             form1.setFieldsValue({ Encounter: apiData[0].EncounterId });
    //             form1.setFieldsValue({ PatientId: option.PatientId });
    //         } else {
    //             setEncounter([]);
    //             form1.setFieldsValue({ Encounter: '' });
    //             form1.setFieldsValue({ PatientId: '' });
    //         }
    //     });
    // }

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Patient Issue
                        </Title>
                    </Col>
                    <Col offset={6} span={2}>
                        <Button icon={<LeftOutlined />} style={{ marginBottom: 0 }} onClick={handleCancel}>
                            Back
                        </Button>
                    </Col>
                </Row>
                <Card>
                    <Form
                        layout="vertical"
                        onFinish={handleOnFinish}
                        variant="outlined"
                        size="default"
                        style={{
                            maxWidth: 1500
                        }}
                        name="trigger"
                        form={form1}
                        initialValues={{
                            IssueDate: dayjs(),
                            SubmitCheck: false
                        }}
                    >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Indent Number" name="IndentNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Input disabled={!!indentId} />
                                </Form.Item>
                                <Form.Item name="IndentId" hidden>
                                    <InputNumber></InputNumber>
                                </Form.Item>
                                <Form.Item name="IssueId" hidden>
                                    <InputNumber></InputNumber>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Indent Type" name="IndentType"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select placeholder='Select Value' allowClear disabled={!!indentId}>
                                        <Select.Option key='Effective' value='Effective'></Select.Option>
                                        <Select.Option key='Consumption Based' value='Consumption Based'></Select.Option>
                                        <Select.Option key='Urgent' value='Urgent'></Select.Option>
                                        <Select.Option key='Reorder level Based' value='Reorder level Based'></Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <Form.Item label="Issuing Store" name="IssuingStore"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select allowClear placeholder='Select Value' disabled={!!indentId}>
                                        {DropDown.StoreDetails.map((option) => (
                                            <Select.Option key={option.StoreId} value={option.StoreId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Issue Date" name="IssueDate"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <DatePicker style={{ width: '100%' }} disabled={!!indentId} format='DD-MM-YYYY' />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Issue Owner" name="IssueOwner"
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: 'Please input!'
                                //     }
                                // ]}
                                >
                                    <Input allowClear />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Issue Status" name="IssueStatus"
                                    rules={[
                                        {
                                            required: issueStatus,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select allowClear placeholder='Select Value'>
                                        <Option value="Draft">Draft</Option>
                                        <Option value="Finalize">Finalize</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="EncounterId" hidden>
                                    <Input></Input>
                                </Form.Item>
                                <Form.Item name="PatientId" hidden>
                                    <Input></Input>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6} >
                                <Form.Item name="SubmitCheck" style={{ marginTop: '30px' }} valuePropName='checked'>
                                    <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <div>
                                    <Form.Item label="Remarks" name="Remarks">
                                        <TextArea autoSize allowClear />
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                        <Row justify="end" style={{ padding: '0rem 1rem' }}>
                            <Col style={{ marginRight: '10px' }}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Save
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
                        <Divider style={{ marginTop: '0' }}></Divider>
                        {isTableVisible ? (
                            <div>
                                <Table columns={columns} dataSource={data.filter((item) => item.ActiveFlag !== false)} scroll={{ x: 0 }} />
                            </div>
                        ) : null}
                    </Form>
                </Card>
                <ConfigProvider
                    theme={{
                        token: {
                            zIndexPopupBase: 3000
                        }
                    }}>
                    <Modal
                        title="Product Batch Details"
                        onOk={onOkModal}
                        onCancel={onCancelmodal}
                        width={1000}
                        open={batchOpen}
                        okText='Save'
                    >
                        <Form
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                width: '100%',
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            // layout='vertical'
                            onFinish={onFinishmodal}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            form={form2}
                        >
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="Product"
                                        name="Product"
                                    >
                                        <Tag color="blue">
                                            {productDetails.ProductName}
                                        </Tag>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Form.Item
                                        label="Issued Qty"
                                        name="IssuedQuantity"
                                    >
                                        <Tag color="blue">
                                            {productDetails.IssueQty}
                                        </Tag>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Table columns={columnsModel} dataSource={dataModal.filter(item => item.ActiveFlag == true)} scroll={{ x: 0 }} />
                        </Form>
                    </Modal>
                </ConfigProvider>
            </div>
        </Layout >
    );
}

export default UpdatePatientIssue;
