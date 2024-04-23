import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder/*, urlAddNewGRNAgainstPO, urlCreateGRNAgainstPO, urlSearchPendingPO*/ } from '../../../endpoints.js';
import Select from 'antd/es/select';
import { ConfigProvider, Tooltip, Typography, Checkbox, Tag, Modal, Skeleton, Popconfirm, Spin, Col, Divider, Row, AutoComplete } from 'antd';
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
//import { useParams } from 'react-router-dom';

const CreateGRNAgainstPO = () => {
    const [DropDown, setDropDown] = useState({
        DocumentType: [],
        StoreDetails: [],
        SupplierList: [],
        UOM: [],
        TaxType: [],
        DateFormat: []
    });

    let [counter, setCounter] = useState(0);
    let [productCount, setProductcount] = useState(0);

    //const { PoHeaderId, SupplierId, StoreId } = useParams();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const { Title } = Typography;
    const { TextArea } = Input;
    const { Option } = Select;
    const navigate = useNavigate();
    //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [dataModal, setDataModal] = useState([]);
    const [dataBatchModal, setdataBatchModal] = useState([]);
    const [selectedStore, setSelectedStore] = useState({});
    const [istablevisible, setIstablevisible] = useState(false);
    const [shouldValidateModal, setshouldValidateModal] = useState(false);
    const [isPoSearchTable, setIsPoSearchTable] = useState(false);
    const [mrp, setMrp] = useState();
    const [poloading, setPoloading] = useState(false);
    const [productLineId, setProductLineId] = useState(0);
    const [selecetdUomText, setSelecetdUomText] = useState({});
    const [selecetdProductId, setSelecetdProductId] = useState({});
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        debugger;
        customAxios.get(urlCreatePurchaseOrder).then((response) => {
            const apiData = response.data.data;
            setDropDown(apiData);
        });
    }, []);

    const onOkModal = () => {
        debugger;
        form2
            .validateFields()
            .then(() => {
                setIsModalOpen(false);
                // If validation succeeds, submit the form        
            })
            .catch((error) => {
                console.log('Validation error:', error);
            });
    }

    const onFinishmodal = (values) => {
        debugger;
        setPoloading(true);
        setIsPoSearchTable(true);
        const postData = {
            Supplier: values.Supplier,
            ReceivingStore: values.ReceivingStore,
            POStatus: values.POStatus,
            FromDate: values.PODateFrom === undefined || values.PODateFrom === null ? '' : (values.PODateFrom.$D.toString().padStart(2, '0') + '-' + (values.PODateFrom.$M + 1).toString().padStart(2, '0') + '-' + values.PODateFrom.$y).toString(),
            ToDate: values.PODateTo === undefined || values.PODateTo === null ? '' : (values.PODateTo.$D.toString().padStart(2, '0') + '-' + (values.PODateTo.$M + 1).toString().padStart(2, '0') + '-' + values.PODateTo.$y).toString(), // A sample value
        }
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

    const BatchmodalOpen = (record) => {
        debugger;
        const fieldsToValidate = [[record.key, 'POReceivedQty']];
        form1
            .validateFields(fieldsToValidate)
            .then(() => {
                setBatches([]);
                setProductLineId(parseInt(record.key));
                setIsBatchModalOpen(true);
                BatchAdd();
            })
            .catch((error) => {
                console.log('Validation error:', error);
            });
    }

    const AddProduct = () => {
        const newData = {
            key: productCount.toString(),
            product: '',
            uom: '',
            poPendingQty: '',
            POReceivedQty: '',
            BonusQty: '',
            poRate: '',
            discount: '',
            discountAmt: '',
            Batch: '',
            Amount: '',
            TaxAmount: '',
            totalAmount: '',
            Replaceable: '',
        }
        setData([...data, newData]);
        setProductcount(productCount + 1);
    }

    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (_, record) => (
                <Form.Item name={[record.key, 'product']}>
                    <Input disabled />
                </Form.Item>
            )
        },
        {
            title: 'UOM',
            dataIndex: 'uom',
            key: 'uom',
            render: (text, record) => (
                <Form.Item name={[record.key, 'uom']}>
                    <Select disabled>
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
            title: 'PO Pending Qty',
            dataIndex: 'poPendingQty',
            key: 'poPendingQty',
            render: (text, record) => (
                <Form.Item name={[record.key, 'poPendingQty']}>
                    <InputNumber min={0} disabled />
                </Form.Item>
            )
        },
        {
            title: 'PO Received Qty',
            dataIndex: 'POReceivedQty',
            key: 'POReceivedQty',
            render: (text, record) => (
                <Form.Item name={[record.key, 'POReceivedQty']}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!'
                        }
                    ]}
                >
                    <InputNumber min={0} />
                </Form.Item>
            )
        },
        {
            title: 'Bonus Qty',
            dataIndex: 'BonusQty',
            key: 'BonusQty',
            render: (text, record) => (
                <Form.Item name={[record.key, 'BonusQty']}>
                    <InputNumber min={0} disabled />
                </Form.Item>
            )
        },
        {
            title: 'PO Rate',
            dataIndex: 'poRate',
            key: 'poRate',
            render: (text, record) => (
                <Form.Item name={[record.key, 'poRate']}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!'
                        }
                    ]}
                >
                    <InputNumber min={0} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Discount%',
            dataIndex: 'discount',
            key: 'discount',
            render: (text, record) => (
                <Form.Item name={[record.key, 'discount']}>
                    <InputNumber min={0} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Discount Amount',
            dataIndex: 'discountAmt',
            key: 'discountAmt',
            render: (text, record) => (
                <Form.Item name={[record.key, 'discountAmt']}>
                    <InputNumber disabled />
                </Form.Item>
            )
        },
        {
            title: 'Batch',
            dataIndex: 'Batch',
            key: 'Batch',
            render: (text, record, index) => <Button type="link" onClick={() => BatchmodalOpen(record)}>Batch</Button>
        },
        {
            title: 'Amount',
            dataIndex: 'Amount',
            key: 'Amount',
            render: (text, record) => (
                <Form.Item name={[record.key, 'Amount']}>
                    <InputNumber disabled />
                </Form.Item>
            )
        },
        {
            title: 'Tax Amount',
            dataIndex: 'TaxAmount',
            key: 'TaxAmount',
            render: (text, record) => (
                <Form.Item name={[record.key, 'TaxAmount']}>
                    <InputNumber disabled />
                </Form.Item>
            )
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (text, record) => (
                <Form.Item name={[record.key, 'totalAmount']}>
                    <InputNumber disabled />
                </Form.Item>
            )
        },
        {
            title: 'Replaceable',
            dataIndex: 'Replaceable',
            key: 'Replaceable',
            render: (text, record) => (
                <Form.Item name={[record.key, 'Replaceable']} initialValue={true} valuePropName="checked">
                    <Checkbox />
                </Form.Item>
            )
        }
    ]

    const columnsmodal = [
        {
            title: 'PO Number',
            dataIndex: 'PONumber',
            key: 'PONumber',
            render: (text, record, index) => <Button type="link" onClick={() => handlePoNumber(record)}>{text}</Button>
        },
        {
            title: 'Document Type',
            dataIndex: 'DocumentTypeName',
            key: 'DocumentTypeName',
            sorter: (a, b) => a.DocumentType.localeCompare(b.DocumentType),
        },
        {
            title: 'PO Date',
            dataIndex: 'PoDate',
            key: 'PoDate',
            sorter: (a, b) => a.PoDate.localeCompare(b.PoDate),
        },
        {
            title: 'PO Raised By',
            dataIndex: 'PORaisedBy',
            key: 'PORaisedBy',
            sorter: (a, b) => a.PORaisedBy.localeCompare(b.PORaisedBy),
        },
        {
            title: 'Status',
            dataIndex: 'PoStatus',
            key: 'PoStatus',
            sorter: (a, b) => a.PoStatus.localeCompare(b.PoStatus),
        },
    ];

    const onCancelmodal = () => {
        debugger;
        form2.resetFields();
        setIsModalOpen(false);
        setDataModal([]);
    }

    const handleCancel = () => {
        const url = '/GRNAgainstPO';
        navigate(url);
    }
    const handleReset = () => {
        form1.resetFields();
        form2.resetFields();
    };

    const Searchmodal = (value, record) => {
        debugger;
        const fieldsToValidate = ['SupplierList', 'StoreDetails'];
        form1
            .validateFields(fieldsToValidate)
            .then(() => {
                setIsModalOpen(true);
            })
            .catch((error) => {
                console.log('Validation error:', error);
            });
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handlePoNumber = (record) => {
        debugger;
        const postData = {
            PoHeaderId: record.PoHeaderId,
            Supplier: record.SupplierId,
            Store: record.ProcurementStoreId,
        }
        // try {
        //   customAxios.get(`${urlCreateGRNAgainstPO}?PoHeaderId=${postData.PoHeaderId}&Supplier=${postData.Supplier}&Store=${postData.Store}`).then((response) => {
        //     debugger;
        //     const apiData = response.data.data;
        //     setDropDown(prevState => ({
        //       ...prevState,
        //       UOM: apiData.UOM
        //     }));
        //     setIstablevisible(true);
        //     apiData.ProductDetails.map((product, index) => {
        //       if (data.length == 0) {
        //         AddProduct();
        //       }
        //       form1.setFieldsValue({ DocumentType: apiData.POProducts.DocumentType });
        //       form1.setFieldsValue({ [productCount]: { product: product.ProductName } });
        //       form1.setFieldsValue({ [productCount]: { uom: product.UomId } });
        //       form1.setFieldsValue({ [productCount]: { poPendingQty: product.PoQuantity } });
        //       form1.setFieldsValue({ [productCount]: { poRate: product.PoRate } });
        //       form1.setFieldsValue({ [productCount]: { BonusQty: product.BonusQuantity === null ? 0 : product.BonusQuantity } });
        //       form1.setFieldsValue({ [productCount]: { discount: product.DiscountRate } });
        //       form1.setFieldsValue({ [productCount]: { discountAmt: product.DiscountAmount } });
        //       form1.setFieldsValue({ [productCount]: { TaxAmount: product.TaxAmount1 } });
        //       setSelecetdUomText((prevState) => {
        //         const newState = { ...prevState, [productCount]: product.Uom };
        //         return newState;
        //       });
        //       setSelecetdProductId((prevState) => {
        //         const newState = { ...prevState, [productCount]: product.ProductId };
        //         return newState;
        //       });
        //       setMrp(product.MrpExpected);
        //     })
        //     setIsModalOpen(false);
        //   });
        // } catch (error) {
        //   //console.error("Error fetching purchase order details:", error);      
        // }
        //const url = `/CreateGRNAgainstPO/${record.PoHeaderId}/${record.SupplierId}/${record.ProcurementStoreId}`;
        //navigate(url);
    };

    const onOkBatchModal = () => {
        debugger;
        form3
            .validateFields()
            .then(() => {
                form3.submit();
                setIsBatchModalOpen(false);
            })
            .catch((error) => {
                console.log('Validation error:', error);
            });
    }

    const onCancelBatchmodal = () => {
        setIsBatchModalOpen(false);
        setdataBatchModal([]);
        setshouldValidateModal(false);
    }

    const onFinishBatchmodal = (values) => {
        debugger;
        const batche = [];
        for (let i = 0; i < counter; i++) {
            const batch = {
                BarCode: values[i].barcode,
                BatchNo: values[i].batchnumber,
                BatchQty: values[i].quantity,
                BatchBonusQty: values[i].bonusqty,
                UomId: values[i].uom,
                EXPDateString: values[i].expdate.$D.toString().padStart(2, '0') + '-' + (values[i].expdate.$M + 1).toString().padStart(2, '0') + '-' + (values[i].expdate.$y).toString(),
                BatchMRP: values[i].rate,
                MRP: values[i].mrp,
                DiscountRate: values[i].discount,
                DiscountAmount: values[i].discountamt,
                BatchTaxType1: values[i].cgst,
                BatchTaxAmount1: values[i].cgstamt,
                BatchTaxType2: values[i].sgst,
                BatchTaxAmount2: values[i].sgstamt,
                BatchStockLocator: values[i].stocklocator,
                MFGDateString: values[i].mfgdate === undefined ? null : (values[i].mfgdate.$D.toString().padStart(2, '0') + '-' + (values[i].mfgdate.$M + 1).toString().padStart(2, '0') + '-' + values[i].mfgdate.$y).toString(),
            }
            batche.push(batch);
            setBatches(batche);
            setIsBatchModalOpen(false);
        }
        onCancelBatchmodal();
    }

    const onFinishBatchFailed = () => {

    }
    const handleOnFinish = async (values) => {
        debugger;
        const products = [];
        for (let i = 0; i <= productCount; i++) {
            if (values[i] !== undefined) {
                const product = {
                    ProductId: selecetdProductId[i],
                    UomId: values[i].uom,
                    ReceivedQty: values[i].POReceivedQty,
                    PendingQty: values[i].poPendingQty === "" ? 0 : values[i].poPendingQty,
                    BonusQty: values[i].BonusQty === "" ? null : values[i].BonusQty,
                    QuantityTobeIssued: values[i].discount === "" ? 0 : values[i].discount,
                    PoRate: values[i].poRate === "" ? 0 : parseFloat(values[i].poRate),
                    DiscountRate: values[i].discount === "" ? 0 : values[i].discount,
                    DiscountAmount: values[i].discountAmt === "" ? 0 : values[i].discountAmt,
                    LineAmount: values[i].Amount === "" ? 0 : values[i].Amount,
                    TaxAmount: values[i].TaxAmount,
                    TotalAmount: values[i].totalAmount === "" ? 0 : values[i].totalAmount,
                    Replaceable: values[i].Replaceable === true ? "Yes" : "No"
                }
                products.push(product);
            }
        }

        const GRNAgainstPO = {
            SupplierId: values.SupplierList === undefined ? '' : values.SupplierList,
            ReceivingStoreId: values.StoreDetails === undefined ? '' : values.StoreDetails,
            DocumentType: values.DocumentType === undefined ? '' : values.DocumentType,
            // GrnNumber: values.PODate === undefined ? dayjs(`${currentDate}`).format(dateFormat) : values.PODate,
            GRNDatestring: values.GRNDate === undefined ? null : (values.GRNDate.$D.toString().padStart(2, '0') + '-' + (values.GRNDate.$M + 1).toString().padStart(2, '0') + '-' + values.GRNDate.$y).toString(),
            Remarks: values.Remarks === undefined ? null : values.Remarks,
            GrnStatus: values.GRNStatus === undefined ? null : values.GRNStatus,
            InvoiceNo: values.InvoiceNumber === undefined ? null : values.InvoiceNumber,
            InvoiceAmount: values.InvoiceAmount === undefined ? 0 : values.InvoiceAmount,
            InvoiceDateString: values.InvoiceDate === undefined ? null : (values.InvoiceDate.$D.toString().padStart(2, '0') + '-' + (values.InvoiceDate.$M + 1).toString().padStart(2, '0') + '-' + values.InvoiceDate.$y).toString(),
            DcNo: values.DCChallanNumber === undefined ? 0 : values.DCChallanNumber,
            DCChallanDateString: values.DCChallanDate === undefined ? null : (values.DCChallanDate.$D.toString().padStart(2, '0') + '-' + (values.DCChallanDate.$M + 1).toString().padStart(2, '0') + '-' + values.DCChallanDate.$y).toString(),
            ReceivingDateString: values.ReceivingDate === undefined ? null : (values.ReceivingDate.$D.toString().padStart(2, '0') + '-' + (values.ReceivingDate.$M + 1).toString().padStart(2, '0') + '-' + values.ReceivingDate.$y).toString(),
            Amount: values.PoTaxAmount === undefined ? 0 : values.PoTaxAmount,
            TaxAmount: values.TotalAmount === undefined ? 0 : values.TotalAmount,
            RoundOff: values.RoundOff === undefined ? 0 : values.RoundOff,
            TotalPoAmount: values.totalpoAmount === undefined ? 0 : values.totalpoAmount,
            // GrnType: values.PoTaxAmount === undefined ? 0 : values.PoTaxAmount,
        }
        const postData = {
            newGRNAgainstPOModel: GRNAgainstPO,
            GRNAgainstPODetails: products,
            BatchDetails: batches
        }
        // try {
        //   const response = await customAxios.post(urlAddNewGRNAgainstPO, postData, {
        //     headers: {
        //       'Content-Type': 'application/json'
        //     }
        //   });
        //   form1.resetFields();
        // } catch (error) {
        //   // Handle error      
        // }
        // setIsSearchLoading(false);
    };

    const BatchAdd = () => {
        debugger;
        if (shouldValidateModal) {
            form3
                .validateFields()
                .then(() => {
                    const newRow = {
                        key: counter.toString(),
                        barcode: '',
                        batchnumber: '',
                        quantity: '',
                        uom: '',
                        bonusqty: '',
                        mfgdate: '',
                        expdate: '',
                        rate: '',
                        mrp: '',
                        discountamt: '',
                        cgst: '',
                        cgstamt: '',
                        sgst: '',
                        sgstamt: '',
                        stocklocator: '',
                    };
                    setdataBatchModal([...dataBatchModal, newRow]);
                    setCounter(counter + 1);
                })
        } else {
            const newRow = {
                key: counter.toString(),
                barcode: '',
                batchnumber: '',
                quantity: '',
                bonusqty: '',
                uom: '',
                mfgdate: '',
                expdate: '',
                rate: '',
                mrp: '',
                discount: '',
                discountamt: '',
                cgst: '',
                cgstamt: '',
                sgst: '',
                sgstamt: '',
                stocklocator: '',
            };
            setdataBatchModal([...dataBatchModal, newRow]);
            setshouldValidateModal(true);
            setCounter(counter + 1);
        }
    };

    const Batchmodal = [
        {
            title: 'Bar Code',
            dataIndex: 'barcode',
            key: 'barcode',
            render: (_, record) => (
                <Form.Item name={[record.key, 'barcode']}
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <InputNumber style={{ width: 50 }} min={0} />
                </Form.Item>
            )
        },
        {
            title: 'Batch Number',
            dataIndex: 'batchnumber',
            key: 'batchnumber',
            render: (text, record) => {
                return (
                    <Form.Item style={{ width: 60 }} name={[record.key, 'batchnumber']}
                        rules={[
                            {
                                required: true,
                                message: "input!"
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                );
            }
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <Form.Item name={[record.key, 'quantity']}
                    rules={[
                        {
                            required: true,
                            message: "input!"
                        }
                    ]}
                >
                    <InputNumber min={0} style={{ width: 50 }} />
                </Form.Item>
            )
        },
        {
            title: 'Bonus Qty',
            dataIndex: 'bonusqty',
            key: 'bonusqty',
            render: (text, record) => (
                <Form.Item name={[record.key, 'bonusqty']} initialValue={form1.getFieldValue([productLineId, 'BonusQty'])}>
                    <InputNumber min={0} style={{ width: 50 }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Uom',
            dataIndex: 'uom',
            key: 'uom',
            render: (text, record) => (
                <Form.Item name={[record.key, 'uom']} initialValue={form1.getFieldValue([productLineId, 'uom'])}>
                    <Tag color="blue">{selecetdUomText[productLineId]}</Tag>
                </Form.Item>
            )
        },
        {
            title: 'MFG Date',
            dataIndex: 'mfgdate',
            key: 'mfgdate',
            render: (text, record) => (
                <Form.Item name={[record.key, 'mfgdate']}>
                    <DatePicker format={dateFormat} />
                </Form.Item>
            )
        },
        {
            title: 'Exp Date',
            dataIndex: 'expdate',
            key: 'expdate',
            render: (text, record) => (
                <Form.Item name={[record.key, 'expdate']}
                    rules={[
                        {
                            required: true,
                            message: "input!"
                        }
                    ]}
                >
                    <DatePicker format={dateFormat} />
                </Form.Item>
            )
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            render: (text, record) => (
                <Form.Item name={[record.key, 'rate']} initialValue={form1.getFieldValue([productLineId, 'poRate'])}>
                    <InputNumber min={0} style={{ width: 50 }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'MRP',
            dataIndex: 'mrp',
            key: 'mrp',
            render: (text, record) => (
                <Form.Item name={[record.key, 'mrp']} initialValue={mrp}>
                    <InputNumber min={0} style={{ width: 50 }} allowClear />
                </Form.Item>
            )
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            render: (text, record) => (
                <Form.Item name={[record.key, 'discount']} initialValue={form1.getFieldValue([productLineId, 'discount'])}>
                    <InputNumber min={0} style={{ width: 50 }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Discount Amt',
            dataIndex: 'discountamt',
            key: 'discountamt',
            render: (text, record) => (
                <Form.Item name={[record.key, 'discountamt']} initialValue={form1.getFieldValue([productLineId, 'discountAmt'])}>
                    <InputNumber min={0} style={{ width: 50 }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'CGST',
            dataIndex: 'cgst',
            key: 'cgst',
            render: (text, record) => (
                <Form.Item name={[record.key, 'cgst']}>
                    <Select>
                    </Select>
                </Form.Item>
            )
        },
        {
            title: 'CGST Amount',
            dataIndex: 'cgstamt',
            key: 'cgstamt',
            render: (text, record) => (
                <Form.Item name={[record.key, 'cgstamt']}>
                    <InputNumber min={0} style={{ width: 50 }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'SGST',
            dataIndex: 'sgst',
            key: 'sgst',
            render: (text, record) => (
                <Form.Item name={[record.key, 'sgst']}>
                    <Select>
                    </Select>
                </Form.Item>
            )
        },
        {
            title: 'SGST Amount',
            dataIndex: 'sgstamt',
            key: 'sgstamt',
            render: (text, record) => (
                <Form.Item name={[record.key, 'sgstamt']}>
                    <InputNumber min={0} style={{ width: 50 }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Stock Locator',
            dataIndex: 'stocklocator',
            key: 'stocklocator',
            render: (text, record) => (
                <Form.Item name={[record.key, 'stocklocator']} initialValue={'Manual'}>
                    <Input style={{ width: 60 }} />
                </Form.Item>
            )
        },
        {
            title: <Button type="primary" icon={<PlusOutlined />} onClick={BatchAdd}></Button>,
            dataIndex: 'add',
            key: 'add',
            width: 50,
            render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => BatchDelete(record)}><DeleteOutlined /></Popconfirm>
            //<Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>      
        }
    ]

    const BatchDelete = (record) => {
        debugger;
        const newData = data.filter((item) => item.key !== (record.key === undefined ? record.toString() : record.key));
        Object.keys(fields).forEach(fieldName => {
            if (fieldName.startsWith(`${record.key}.`)) {
                form1.resetFields([fieldName]);
            }
        });
        setData(newData);
    };

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Create GRN Against PO
                        </Title>
                    </Col>
                    <Col offset={6} span={2}>
                        <Button icon={<LeftOutlined />} style={{ marginBottom: 0 }} onClick={handleCancel}>
                            Back
                        </Button>
                    </Col>
                </Row>
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
                        GRNDate: dayjs(),
                        ReceivingDate: dayjs(),
                        InvoiceDate: dayjs(),
                        DCChallanDate: dayjs(),
                    }}
                    onValuesChange={(changedValues, allValues) => {
                        debugger;
                        for (let i = 0; i <= counter; i++) {
                            if (allValues[i] !== undefined) {
                                if (allValues[i]['POReceivedQty'] !== undefined) {
                                    const total = parseFloat(allValues[i]['POReceivedQty'] * allValues[i]['poRate']).toFixed(4);
                                    form1.setFieldsValue({ [i]: { Amount: total } });
                                    form1.setFieldsValue({ [i]: { totalAmount: total } });
                                    form1.setFieldsValue({ Tax: parseFloat(allValues[i]['TaxAmount']).toFixed(4) });
                                    // cosole.log(allValues['POReceivedQty']);
                                }
                            }
                        }
                        let totalAmount = 0;
                        for (let j = 0; j <= counter; j++) {
                            if (allValues[j] !== undefined) {
                                const Amount = form1.getFieldValue([j, 'Amount']);
                                totalAmount += Amount;
                            }
                        }
                        form1.setFieldsValue({ TotalAmount: totalAmount });
                        form1.setFieldsValue({ totalpoAmount: totalAmount });
                    }}
                >
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Supplier" name="SupplierList"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <Select allowClear placeholder='Select Value'>
                                    {DropDown.SupplierList.map((option) => (
                                        <Select.Option key={option.VendorId} value={option.VendorId}>
                                            {option.LongName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Receiving Store" name="StoreDetails"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <Select allowClear placeholder='Select Value'>
                                    {DropDown.StoreDetails.map((option) => (
                                        <Select.Option key={option.StoreId} value={option.StoreId}>
                                            {option.LongName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={2} style={{ paddingTop: 35 }}>
                            <Tooltip title="Search Pending PO">
                                <Typography.Link onClick={Searchmodal} style={{ fontWeight: 'bold' }}>Pending Po</Typography.Link>
                            </Tooltip>
                        </Col>
                        <Col className="gutter-row" span={3}>
                            <Form.Item label="Document Type" name="DocumentType"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <Select allowClear placeholder='Select Value'>
                                    {DropDown.DocumentType.map((option) => (
                                        <Select.Option key={option.LookupID} value={option.LookupID}>
                                            {option.LookupDescription}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={3}>
                            <Form.Item label="GRN Date" name="GRNDate">
                                <DatePicker format='DD-MM-YYYY' />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={2}>
                            <Form.Item label="GRNStatus" name="GRNStatus"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <Select allowClear placeholder='Select Value'>
                                    <Option value="Draft">Draft</Option>
                                    <Option value="Finalize">Finalize</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={2} style={{ paddingTop: 35 }}>
                            <Form.Item name="SubmitCheck">
                                <Checkbox>Submit</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Invoice Number" name="InvoiceNumber" hasFeedback validateDebounce={2000}>
                                <Input style={{ width: '100%' }} allowClear />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Invoice Date" name="InvoiceDate">
                                <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={5}>
                            <Form.Item label="Invoice Amount" name="InvoiceAmount">
                                <Input style={{ width: '100%' }} allowClear />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={7}>
                            <Form.Item label="Remarks" name="Remarks">
                                <TextArea allowClear autoSize />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="DC Challan Number" name="DCChallanNumber">
                                <Input style={{ width: '100%' }} allowClear />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="DC Challan Date" name="DCChallanDate">
                                <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={5}>
                            <Form.Item label="Receiving Date" name="ReceivingDate"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end" style={{ padding: '0rem 1rem' }}>
                        <Col style={{ marginRight: '10px' }}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
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
                    {istablevisible && (
                        <div>
                            <Table columns={columns} dataSource={data} scroll={{ x: 0 }} />
                            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px', float: 'right' }}>
                                <Form.Item label="Amount" name='TotalAmount' style={{ marginRight: '16px', width: 100 }} >
                                    <InputNumber min={0} disabled />
                                </Form.Item>
                                <Form.Item label="Tax" name='Tax' style={{ marginRight: '16px', width: 100 }} >
                                    <InputNumber min={0} disabled />
                                </Form.Item>
                                <Form.Item label="Round Off" name='RoundOff' style={{ marginRight: '16px', width: 100 }}>
                                    <InputNumber min={0} disabled />
                                </Form.Item>
                                <Form.Item label="Total PO Amount" name='totalpoAmount' style={{ width: 150 }}>
                                    <InputNumber min={0} disabled />
                                </Form.Item>
                            </div>
                        </div>
                    )}
                </Form>
                <ConfigProvider
                    theme={{
                        token: {
                            zIndexPopupBase: 3000
                        }
                    }}>
                    <Modal
                        title="Search for PO"
                        onOk={onOkModal}
                        onCancel={onCancelmodal}
                        width={1000}
                        open={isModalOpen}
                    >
                        <Form name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ width: '100%' }}
                            onFinish={onFinishmodal}
                            onFinishFailed={onFinishFailed}                            
                            form={form2}
                            initialValues={{
                                POStatus: 0,
                            }}
                        >
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={12}>
                                    <Form.Item label="Supplier" name="Supplier">
                                        <Tag color="blue"></Tag>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Receiving Store" name="ReceivingStore">
                                        <Tag color="blue">{selectedStore}</Tag>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
                                <Col span={6}>
                                    <Form.Item label="PO Status" name="POStatus">
                                        <Select>
                                            <Option key={0} value={0}>All</Option>
                                            <Option value="Pending">Pending</Option>
                                            <Option value="PartiallyPending">Partially Pending</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={9}>
                                    <>
                                        <Form.Item label="PO Date From" name="PODateFrom"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Input!"
                                                }
                                            ]}
                                        >
                                            <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                                        </Form.Item>
                                    </>
                                </Col>
                                <Col className="gutter-row" span={9}>
                                    <Form.Item label="PO Date To" name="PODateTo"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Input!"
                                            }
                                        ]}
                                    >
                                        <DatePicker format='DD-MM-YYYY' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify="end" style={{ padding: '0rem 1rem' }}>
                                <Col style={{ marginRight: '10px' }}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Search
                                        </Button>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item>
                                        <Button type="primary" onClick={handleReset}>
                                            Reset
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                            {isPoSearchTable && poloading ? (
                                <Skeleton active />
                            ) : (
                                <Table columns={columnsmodal} dataSource={dataModal} />
                            )}
                        </Form>
                    </Modal>
                </ConfigProvider>
                <ConfigProvider
                    theme={{
                        token: {
                            zIndexPopupBase: 3000
                        }
                    }}>
                    <Modal title="Product Batch Details" onOk={onOkBatchModal} onCancel={onCancelBatchmodal}
                        width={1700}
                        open={isBatchModalOpen}
                    >
                        <Form name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
                            style={{ width: '100%' }} onFinish={onFinishBatchmodal}
                            onFinishFailed={onFinishBatchFailed} autoComplete="off"
                            form={form3}
                        >
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={8}>
                                    <Form.Item label="Product" name="Product">
                                        <Tag color="blue">{form1.getFieldValue([productLineId, 'product'])}</Tag>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Received Qty" name="ReceivedQty" handleCancel>
                                        <Tag color="blue">{form1.getFieldValue([productLineId, 'POReceivedQty'])}</Tag>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <Form.Item label="Bonus qty" name="Bonusqty">
                                        <Tag color="blue">{form1.getFieldValue([productLineId, 'BonusQty'])}</Tag>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Table columns={Batchmodal} dataSource={dataBatchModal} />
                        </Form>
                    </Modal>
                </ConfigProvider>
            </div>
        </Layout >
    );
}

export default CreateGRNAgainstPO;
