import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder, urlAddNewGRNAgainstPO, urlCreateGRNAgainstPO, urlSearchPendingPO, urlEditGRNAgainstPO, urlUpdateGRNAgainstPO } from '../../../endpoints.js';
import Select from 'antd/es/select';
import { ConfigProvider, Tooltip, Typography, Checkbox, Tag, Modal, Skeleton, Popconfirm, Spin, Col, Divider, Row, AutoComplete, message } from 'antd';
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
import { MdOutlineWifiTetheringError } from 'react-icons/md';
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

    let [counter, setCounter] = useState(2);
    let [productCount, setProductcount] = useState(1);

    const initialProductDataSource =
        [
            {
                key: 1,
                ProductName: '',
                UomId: '',
                PoBalanceQty: '',
                ReceivedQty: '',
                BonusQuantity: '',
                PoRate: '',
                DiscountRate: '',
                DiscountAmount: '',
                Batch: '',
                LineAmount: '',
                TaxAmount1: 0,
                TotalAmount: 0,
                Replaceable: '',
                ActiveFlag: true,
            },
        ]

    const initialModelDataSource =
        [
            {
                key: 1,
                BarCode: '',
                BatchNo: '',
                Quantity: '',
                ProductId: '',
                uom: '',
                BatchBonusQty: '',
                MFGDate: '',
                EXPDate: '',
                rate: '',
                mrp: '',
                DiscountRate: '',
                DiscountAmount: '',
                TaxType1: undefined,
                TaxAmount1: undefined,
                TaxType2: undefined,
                TaxAmount2: undefined,
                stocklocator: 0,
                ActiveFlag: true,
            },
        ]
    const location = useLocation();
    //const { PoHeaderId, SupplierId, StoreId } = useParams();
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const { Title } = Typography;
    const { TextArea } = Input;
    const { Option } = Select;
    const GrnHeaderId = location.state.GrnHeaderId;
    const navigate = useNavigate();
    //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [data, setData] = useState(initialProductDataSource);
    const [dataModal, setDataModal] = useState();
    const [dataBatchModal, setdataBatchModal] = useState(initialModelDataSource);
    const [selectedStore, setSelectedStore] = useState();
    const [selectedSupplier, setSelectedSupplier] = useState();
    const [istablevisible, setIstablevisible] = useState(false);
    const [shouldValidateModal, setshouldValidateModal] = useState(false);
    const [isPoSearchTable, setIsPoSearchTable] = useState(false);
    const [mrp, setMrp] = useState();
    const [poloading, setPoloading] = useState(false);
    const [productLineId, setProductLineId] = useState(0);
    const [selecetdUomText, setSelecetdUomText] = useState({});
    const [buttonTitle, setButtonTitle] = useState('Save');
    const [batches, setBatches] = useState([]);
    const [batchRecord, setBatchRecord] = useState([]);

    useEffect(() => {
        customAxios.get(urlCreatePurchaseOrder).then((response) => {
            const apiData = response.data.data;
            setDropDown(apiData);
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (GrnHeaderId > 0) {
                setButtonTitle('Update')
                try {
                    const response = await customAxios.get(
                        `${urlEditGRNAgainstPO}?GrnHeaderId=${GrnHeaderId}`
                    );
                    if (response.status == 200 && response.data.data != null) {
                        setIstablevisible(true);
                        const editeddata = response.data.data;
                        const products = editeddata.GRNAgainstPODetails.map(
                            (item, index) => ({
                                ...item,
                                key: index + 1,
                            })
                        );
                        setData(products);
                        const formdata = editeddata.newGRNAgainstPOModel;

                        form1.setFieldsValue({
                            SupplierId: formdata.SupplierId,
                            StoreId: formdata.StoreId,
                            DocumentType: formdata.DocumentType,
                            TotalAmount: formdata.TotalPoAmount,
                            TotalPoAmount: formdata.TotalPoAmount,
                            PoHeaderId: formdata.PoHeaderId,
                            GRNHeaderId: formdata.GRNHeaderId,
                            InvoiceNumber: formdata.InvoiceNumber,
                            InvoiceAmount: formdata.InvoiceAmount,
                            InvoiceDate: DateBindtoDatepicker(formdata.InvoiceDate),
                            ReceivingDate: DateBindtoDatepicker(formdata.InvoiceDate),
                            DCChallanDate: DateBindtoDatepicker(formdata.InvoiceDate),
                            DCChallanNumber: formdata.DCChallanNumber,
                            GRNStatus: formdata.GRNStatus == 'Created' ? undefined : formdata.GRNStatus,
                            GRNDate: DateBindtoDatepicker(formdata.GRNDate),
                            Remarks: formdata.Remarks
                        });
                        setProductcount(products.length + 1);
                        const batch = editeddata.BatchDetails.map(
                            (item, index) => ({
                                ...item,
                                key: index + 1,
                            })
                        );
                        setCounter(editeddata.BatchDetails.length + 1)
                        setdataBatchModal(editeddata.BatchDetails);
                        const updatedBatch = batch.map(item => {
                            const key = item.key - 1;
                            const prod = editeddata.GRNAgainstPODetails.filter(item1 => item1.GrnLineId === item.GrnLineId)
                            if (batch[key] != undefined) {
                                if (batch[key].Quantity || batch[key].EXPDate || batch[key].BatchNo) {
                                    return {
                                        ...item,
                                        ProductId: prod[0].ProductId,
                                        Quantity: batch[key].Quantity,
                                        EXPDate: DateBindtoDatepicker(batch[key].EXPDate),
                                        BarCode: batch[key].BarCode,
                                        BatchNo: batch[key].BatchNo,
                                        UomId: prod[0].UomId,
                                        Uom: prod[0].Uom
                                    };
                                }
                                return item;
                            }
                            return item;
                        });
                        setdataBatchModal(updatedBatch);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, []);

    const onOkModal = () => {
        debugger;
        form2
            .validateFields()
            .then(() => {
                setIsModalOpen(false);
            })
            .catch((error) => {
                console.log('Validation error:', error);
            });
    }

    function calculateTotalAmount(data) {
        let totalAmount = 0;
        data.forEach((item) => {
            if (
                item.ActiveFlag &&
                !isNaN(item.LineAmount) &&
                item.LineAmount !== null &&
                item.LineAmount !== undefined
            ) {
                totalAmount += parseFloat(item.LineAmount);
            }
        });
        return totalAmount;
    }

    const handleInputChange = (e, column, index, record) => {
        let newData;
        if (["ReceivedQty", "PoRate", "DiscountRate"].includes(column)) {
            newData = data.map((item) => {
                if (item.key === record.key) {
                    const updatedItem = { ...item, [column]: e.target.value };
                    const recievingQty = column === "ReceivedQty" ? e.target.value : item.ReceivedQty;
                    const poRate = column === "PoRate" ? e.target.value : item.PoRate;
                    const discountRate = column === "DiscountRate" ? e.target.value : item.DiscountRate;

                    let discountAmount = 0;
                    let amount = 0;
                    if (poRate != null && recievingQty != null) {
                        const discount = discountRate != null ? discountRate : 0;
                        discountAmount = (poRate * recievingQty * discount) / 100;
                        amount = poRate * recievingQty - discountAmount;
                    }

                    updatedItem.DiscountAmount = discountAmount;
                    updatedItem.LineAmount = amount;
                    updatedItem.TotalAmount = amount;

                    form1.setFieldsValue({ [record.key]: { DiscountAmount: discountAmount } });
                    form1.setFieldsValue({ [record.key]: { LineAmount: amount } });
                    form1.setFieldsValue({ [record.key]: { TotalAmount: amount } });

                    return updatedItem;
                }
                return item;
            });
        } else {
            newData = data.map((item) => {
                if (item.key === record.key) {
                    const updatedItem = { ...item, [column]: e.target.value };
                    return updatedItem;
                }
                return item;
            });
        }

        if (["ReceivedQty", "PoRate", "DiscountRate"].includes(column)) {
            const totalAmount = calculateTotalAmount(newData);
            form1.setFieldsValue({
                TotalAmount: totalAmount,
                TotalPoAmount: totalAmount,
            });
        }
        setData(newData);
    };

    const onFinishmodal = (values) => {
        debugger;
        const va = form1.getFieldsValue()
        setPoloading(true);
        setIsPoSearchTable(true);
        const postData = {
            Supplier: va.SupplierId,
            ReceivingStore: va.StoreId,
            POStatus: values.POStatus,
            FromDate: values.PODateFrom,
            ToDate: values.PODateTo
        }
        try {
            customAxios.get(`${urlSearchPendingPO}?Supplier=${postData.Supplier}&Store=${postData.ReceivingStore}&POStatus=${postData.POStatus}&PODateFrom=${postData.FromDate}&PODateTo=${postData.ToDate}`).then((response) => {
                debugger;
                const apiData = response.data.data;
                setDataModal(apiData.PurchaseOrderDetails);
                setPoloading(false);
            });
        } catch (error) {
            // Handle the error as needed
        }
    }

    const BatchmodalOpen = (record) => {
        debugger;
        const fieldsToValidate = [[record.key, 'POReceivedQty']];
        const va = form1.getFieldsValue();
        form1.validateFields(fieldsToValidate)
        if (va[record.key].ReceivedQty <= va[record.key].PoBalanceQty) {
            record.ReceivedQty = va[record.key].ReceivedQty
            setBatchRecord(record);
            setBatches([]);
            setProductLineId(parseInt(record.key));
            setIsBatchModalOpen(true);
        }
        else {
            message.warning('Recieved Qty should not greater than Pending Qty.')
        }
    }

    const handlePoNumber = (record) => {
        debugger;
        form1.resetFields()
        const postData = {
            PoHeaderId: record.PoHeaderId,
            Supplier: record.SupplierId,
            Store: record.ProcurementStoreId,
        }
        try {
            customAxios.get(`${urlCreateGRNAgainstPO}?PoHeaderId=${postData.PoHeaderId}&Supplier=${postData.Supplier}&Store=${postData.Store}`).then((response) => {
                debugger;
                const apiData = response.data.data;
                const products = apiData.ProductDetails.map(
                    (item, index) => ({
                        ...item,
                        key: index + 1,
                    })
                );
                setData(products);
                const formdata = apiData.POProducts;
                form1.setFieldsValue({
                    SupplierId: formdata.SupplierId,
                    StoreId: formdata.ProcurementStoreId,
                    DocumentType: formdata.DocumentType,
                    // GRNDate: DateBindtoDatepicker(formdata.PoDate),
                    // GRNStatus: formdata.PoStatus,
                    PoHeaderId: formdata.PoHeaderId
                });
                setIstablevisible(true);
                setIsModalOpen(false);
            });
        } catch (error) {
            //console.error("Error fetching purchase order details:", error);      
        }
    };

    const AddProduct = async () => {
        await form2.validateFields();
        setData([
            ...data,
            {
                key: productCount,
                ProductName: '',
                UomId: '',
                PoBalanceQty: '',
                ReceivedQty: '',
                BonusQuantity: '',
                PoRate: '',
                DiscountRate: '',
                DiscountAmount: '',
                Batch: '',
                LineAmount: '',
                TaxAmount1: '',
                totalAmount: '',
                Replaceable: '',
                ActiveFlag: true,
            },
        ]);
        setProductcount(productCount + 1);
    }

    const columns = [
        {
            title: 'Product',
            dataIndex: 'ProductName',
            key: 'ProductName',
            render: (_, record) => (
                <>
                    <Form.Item name={[record.key, 'ProductName']} initialValue={record.ProductName}>
                        <Input style={{ width: 100 }} disabled value={record.ProductName} />
                    </Form.Item>
                    <Form.Item name={[record.key, 'ProductId']} hidden initialValue={record.ProductId}><Input /></Form.Item>
                    <Form.Item name={[record.key, 'PoLineId']} hidden initialValue={record.PoLineId}><Input /></Form.Item>
                    <Form.Item name={[record.key, 'GrnLineId']} hidden initialValue={record.GrnLineId}><Input /></Form.Item>
                </>
            )
        },
        {
            title: 'UOM',
            dataIndex: 'UomId',
            key: 'UomId',
            render: (text, record) => (
                <Form.Item name={[record.key, 'UomId']} initialValue={record.UomId}>
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
            dataIndex: 'PoBalanceQty',
            key: 'PoBalanceQty',
            render: (text, record) => (
                <Form.Item name={[record.key, 'PoBalanceQty']} initialValue={record.PoBalanceQty}>
                    <InputNumber min={0} disabled />
                </Form.Item>
            )
        },
        {
            title: 'PO Received Qty',
            dataIndex: 'ReceivedQty',
            key: 'ReceivedQty',
            render: (text, record, index) => (
                <Form.Item name={[record.key, 'ReceivedQty']} initialValue={record.ReceivedQty == 0 ? undefined : record.ReceivedQty}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!'
                        },
                    ]}
                >
                    <InputNumber min={0}
                        onChange={(value) => {
                            handleInputChange(
                                { target: { value } },
                                "ReceivedQty",
                                index,
                                record
                            );
                        }}
                    />
                </Form.Item>
            )
        },
        {
            title: 'Bonus Qty',
            dataIndex: 'BonusQuantity',
            key: 'BonusQuantity',
            render: (text, record) => (
                <Form.Item name={[record.key, 'BonusQuantity']} initialValue={record.BonusQuantity}>
                    <InputNumber min={0} disabled />
                </Form.Item>
            )
        },
        {
            title: 'PO Rate',
            dataIndex: 'PoRate',
            key: 'PoRate',
            render: (text, record) => (
                <Form.Item name={[record.key, 'PoRate']} initialValue={record.PoRate}
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
            dataIndex: 'DiscountRate',
            key: 'DiscountRate',
            render: (text, record) => (
                <Form.Item name={[record.key, 'DiscountRate']} initialValue={record.DiscountRate}>
                    <InputNumber min={0} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Discount Amount',
            dataIndex: 'DiscountAmont',
            key: 'DiscountAmont',
            render: (text, record) => (
                <Form.Item name={[record.key, 'DiscountAmont']} initialValue={record.DiscountAmont}>
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
            dataIndex: 'LineAmount',
            key: 'LineAmount',
            render: (text, record) => (
                <Form.Item name={[record.key, 'LineAmount']} initialValue={record.LineAmount}>
                    <InputNumber disabled />
                </Form.Item>
            )
        },
        {
            title: 'Tax Amount',
            dataIndex: 'TaxAmount1',
            key: 'TaxAmount1',
            render: (text, record) => (
                <Form.Item name={[record.key, 'TaxAmount1']} >
                    <InputNumber disabled />
                </Form.Item>
            )
        },
        {
            title: 'Total Amount',
            dataIndex: 'LineAmount',
            key: 'LineAmount',
            render: (text, record) => (
                <Form.Item name={[record.key, 'LineAmount']} initialValue={record.LineAmount}>
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
            render: (text) => {
                if (text !== undefined) {
                    const dateParts = text.split('T')[0].split('-');
                    const year = dateParts[0];
                    const month = dateParts[1];
                    const day = dateParts[2];

                    return `${day}-${month}-${year}`;
                }
            },
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
        const fieldsToValidate = ['SupplierId', 'StoreId'];
        form1
            .validateFields(fieldsToValidate)
            .then(() => {
                const selectedSupplier = form1.getFieldValue('SupplierId');
                const selcctedStore = form1.getFieldValue('StoreId');

                const selectedOptionSupplier = DropDown.SupplierList.find(option => option.VendorId === selectedSupplier);
                const selectedOptionStore = DropDown.StoreDetails.find(option => option.StoreId === selcctedStore)

                if (selectedOptionStore && selectedOptionSupplier) {
                    setSelectedSupplier(selectedOptionStore.LongName);
                    setSelectedStore(selectedOptionSupplier.LongName);
                }
                setIsModalOpen(true);
            })
            .catch((error) => {
                console.log('Validation error:', error);
            });
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onOkBatchModal = async () => {
        debugger;
        await form3.validateFields();
        const values = form3.getFieldsValue();
        const valuesArray = Object.values(values);
        const qty = valuesArray.reduce((total, item) => item ? total + (item.Quantity || 0) : total, 0);
        if (qty <= batchRecord.ReceivedQty) {
            const updatedBatch = dataBatchModal.map(item => {
                const key = item.key;
                if (values[key] != undefined) {
                    if (values[key].Quantity || values[key].EXPDate || values[key].mrp) {
                        return {
                            ...item,
                            ProductId: batchRecord.ProductId,
                            UomId: batchRecord.UomId,
                            BarCode: values[key].BarCode,
                            Quantity: values[key].Quantity,
                            BatchBonusQty: values[key].BatchBonusQty,
                            MFGDate: values[key].MFGDate == '' ? undefined : values[key].MFGDate,
                            BatchNo: values[key].BatchNo,
                            EXPDate: values[key].EXPDate,
                            rate: values[key].rate,
                            mrp: values[key].mrp,
                            DiscountRate: values[key].DiscountRate == '' ? 0 : values[key].DiscountRate,
                            DiscountAmount: values[key].DiscountAmount,
                            StockLocator: 0,
                            PoLineId: values[key].PoLineId === undefined ? 0 : values[key].PoLineId
                        };
                    }
                    return item;
                }
                return item;
            });
            setdataBatchModal(updatedBatch);
            setIsBatchModalOpen(false);
        } else {
            message.warning('Quantity must not be Greater than Recieved Quantity')
        }
    };

    const onCancelBatchmodal = () => {
        setIsBatchModalOpen(false);
    }

    const DateBindtoDatepicker = (value) => {
        const isoDateString = value;
        const dateValue = new Date(isoDateString);
        const formattedDate = dayjs(dateValue).format('DD-MM-YYYY');
        return dayjs(formattedDate, 'DD-MM-YYYY');
    }

    const onFinishBatchmodal = () => {
        debugger;

    }

    const onFinishBatchFailed = () => {

    }
    const handleOnFinish = async (values) => {
        debugger;
        const products = [];
        for (let i = 0; i <= productCount; i++) {
            if (values.TotalPoAmount == values.InvoiceAmount) {
                if (values[i] !== undefined) {
                    if (values[i].ReceivedQty + values[i].BonusQuantity <= values[i].PoBalanceQty) {
                        const product = {
                            ProductId: values[i].ProductId,
                            UomId: values[i].UomId,
                            ReceivedQty: values[i].ReceivedQty,
                            PoBalanceQty: values[i].PoBalanceQty,
                            BonusQuantity: values[i].BonusQuantity,
                            PoLineId: values[i].PoLineId,
                            GrnLineId: values[i].GrnLineId,
                            // QuantityTobeIssued: values[i].discount === "" ? 0 : values[i].discount,
                            PoRate: values[i].PoRate,
                            DiscountRate: values[i].DiscountRate,
                            DiscountAmount: values[i].DiscountAmount == undefined ? 0 : values[i].DiscountAmount,
                            LineAmount: values[i].LineAmount,
                            TaxAmount1: values[i].TaxAmount1 == undefined ? 0 : values[i].TaxAmount1,
                            TotalAmount: values[i].LineAmount,
                            Replaceable: values[i].Replaceable === true ? "Y" : "N",
                            PoStatus: values[i].ReceivedQty + values[i].BonusQuantity == values[i].PoBalanceQty ? 'Completed' : 'Pending',
                            ActiveFlag: true
                        }
                        products.push(product);
                    }
                    else {
                        message.warning('Recieved Qty must not Greater than PoPending Qty')
                        return false
                    }
                }
            } else {
                message.warning('Invoice Amount Must be equals to Total Po Amount')
                return false
            }
        }

        const GRNAgainstPO = {
            GRNHeaderId: values.GRNHeaderId,
            PoHeaderId: values.PoHeaderId,
            SupplierId: values.SupplierId,
            StoreId: values.StoreId,
            DocumentType: values.DocumentType === undefined ? '' : values.DocumentType,
            // GrnNumber: values.PODate === undefined ? dayjs(`${currentDate}`).format(dateFormat) : values.PODate,
            // GRNDatestring: values.GRNDate === undefined ? null : (values.GRNDate.$D.toString().padStart(2, '0') + '-' + (values.GRNDate.$M + 1).toString().padStart(2, '0') + '-' + values.GRNDate.$y).toString(),
            GRNDate: values.GRNDate,
            Remarks: values.Remarks === undefined ? null : values.Remarks,
            GrnStatus: values.GRNStatus === undefined ? 'Created' : values.GRNStatus,
            InvoiceNumber: values.InvoiceNumber === undefined ? null : values.InvoiceNumber,
            InvoiceAmount: values.InvoiceAmount === undefined ? 0 : values.InvoiceAmount,
            InvoiceDate: values.InvoiceDate,
            DCChallanNumber: values.DCChallanNumber,
            DCChallanDate: values.DCChallanDate,
            ReceivingDate: values.ReceivingDate,
            TotalAmount: values.TotalAmount,
            TaxAmount1: values.TaxAmount == undefined ? 0 : values.TaxAmount,
            RoundOff: values.RoundOff == undefined ? 0 : values.RoundOff,
            TotalPoAmount: values.TotalPoAmount,
            // GrnType: values.PoTaxAmount === undefined ? 0 : values.PoTaxAmount,
        }
        batches.forEach((item, index) => {
            form1.getFieldValue([index, 'POReceivedQty'])
        })
        const activeData = dataBatchModal.filter((item) => item.ActiveFlag === true && item.ProductId);
        const postData = {
            newGRNAgainstPOModel: GRNAgainstPO,
            GRNAgainstPODetails: products,
            BatchDetails: activeData.length > 0 && activeData[0].ProductId === '' ? [] : activeData,
        }
        if (GrnHeaderId > 0) {
            const response = await customAxios.post(urlUpdateGRNAgainstPO, postData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response != false && response.status == 200) {
                message.success('Updated Successfully')
            } else {
                message.error('Updated Failure')
            }
        }
        else {
            const response = await customAxios.post(urlAddNewGRNAgainstPO, postData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response != false && response.status == 200) {
                message.success('Created Successfully')
            } else {
                message.error('Create Failure')
            }
        }
        handleCancel()
    };

    const BatchAdd = async () => {
        debugger;
        await form2.validateFields();
        setdataBatchModal([
            ...dataBatchModal,
            {
                key: counter,
                BarCode: '',
                BatchNo: '',
                Quantity: '',
                uom: '',
                BatchBonusQty: '',
                MFGDate: '',
                EXPDate: '',
                rate: '',
                mrp: '',
                DiscountRate: '',
                DiscountAmount: '',
                TaxType1: undefined,
                TaxAmount1: undefined,
                TaxType2: undefined,
                TaxAmount2: undefined,
                stocklocator: 0,
                ActiveFlag: true,
            },
        ]);
        setCounter(counter + 1);
    };

    const Batchmodal = [
        {
            title: 'Bar Code',
            dataIndex: 'BarCode',
            key: 'BarCode',
            render: (_, record) => (
                <>
                    <Form.Item name={[record.key, 'BarCode']} initialValue={record.BarCode}>
                        <InputNumber style={{ width: 50 }} min={0} disabled={!!GrnHeaderId} />
                    </Form.Item>
                    <Form.Item name={[record.key, 'GrnLineId']} hidden initialValue={record.GrnLineId}><Input></Input></Form.Item>
                    <Form.Item name={[record.key, 'GrnBatchId']} hidden initialValue={record.GrnBatchId}><Input></Input></Form.Item>
                </>
            )
        },
        {
            title: 'Batch Number',
            dataIndex: 'BatchNo',
            key: 'BatchNo',
            render: (text, record) => {
                return (
                    <Form.Item style={{ width: 100 }} name={[record.key, 'BatchNo']} initialValue={record.BatchNo}
                        rules={[
                            {
                                required: true,
                                message: "input!"
                            }
                        ]}
                    >
                        <Input disabled={!!GrnHeaderId} />
                    </Form.Item>
                );
            }
        },
        {
            title: 'Quantity',
            dataIndex: 'Quantity',
            key: 'Quantity',
            render: (text, record) => (
                <Form.Item name={[record.key, 'Quantity']} initialValue={record.Quantity}
                    rules={[
                        {
                            required: true,
                            message: "input!"
                        }
                    ]}
                >
                    <InputNumber min={0} style={{ width: 50 }} disabled={!!GrnHeaderId} />
                </Form.Item>
            )
        },
        {
            title: 'Bonus Qty',
            dataIndex: 'BatchBonusQty',
            key: 'BatchBonusQty',
            render: (text, record) => (
                <Form.Item name={[record.key, 'BatchBonusQty']} initialValue={batchRecord.BonusQuantity}
                    disabled={!!GrnHeaderId}
                >
                    <InputNumber min={0} style={{ width: 50 }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Uom',
            dataIndex: 'uom',
            key: 'uom',
            render: (text, record) => (
                <Form.Item name={[record.key, 'uom']}>
                    <Tag color="blue">{batchRecord.Uom}</Tag>
                </Form.Item>
            )
        },
        {
            title: 'MFG Date',
            dataIndex: 'MFGDate',
            key: 'MFGDate',
            render: (text, record) => (
                <Form.Item name={[record.key, 'MFGDate']} initialValue={record.MFGDate} >
                    <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' disabled={!!GrnHeaderId} />
                </Form.Item>
            )
        },
        {
            title: 'Exp Date',
            dataIndex: 'EXPDate',
            key: 'EXPDate',
            render: (text, record) => (
                <Form.Item name={[record.key, 'EXPDate']} initialValue={record.EXPDate}
                    rules={[
                        {
                            required: true,
                            message: "input!"
                        }
                    ]}
                >
                    <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' disabled={!!GrnHeaderId} />
                </Form.Item>
            )
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            render: (text, record) => (
                <Form.Item name={[record.key, 'rate']} initialValue={batchRecord.PoRate}>
                    <InputNumber min={0} style={{ width: 50 }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'MRP',
            dataIndex: 'mrp',
            key: 'mrp',
            render: (text, record) => (
                <Form.Item name={[record.key, 'mrp']} initialValue={batchRecord.MrpExpected == 0 ? undefined : batchRecord.MrpExpected}
                    rules={[
                        {
                            required: true,
                            message: "input!"
                        }
                    ]}
                >
                    <InputNumber min={0} style={{ width: 50 }} allowClear disabled={!!GrnHeaderId} />
                </Form.Item>
            )
        },
        {
            title: 'Discount',
            dataIndex: 'DiscountRate',
            key: 'DiscountRate',
            render: (text, record) => (
                <Form.Item name={[record.key, 'DiscountRate']} initialValue={batchRecord.DiscountRate}>
                    <InputNumber min={0} style={{ width: 50 }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Discount Amt',
            dataIndex: 'DiscountAmount',
            key: 'DiscountAmount',
            render: (text, record) => (
                <Form.Item name={[record.key, 'DiscountAmount']} initialValue={batchRecord.DiscountAmount}>
                    <InputNumber min={0} style={{ width: 50 }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'CGST',
            dataIndex: 'TaxType1',
            key: 'TaxType1',
            render: (text, record) => (
                <Form.Item name={[record.key, 'TaxType1']}>
                    <Select disabled={!!GrnHeaderId}>
                    </Select>
                </Form.Item>
            )
        },
        {
            title: 'CGST Amount',
            dataIndex: 'TaxAmount1',
            key: 'TaxAmount1',
            render: (text, record) => (
                <Form.Item name={[record.key, 'TaxAmount1']}>
                    <InputNumber min={0} style={{ width: 50 }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'SGST',
            dataIndex: 'TaxType2',
            key: 'TaxType2',
            render: (text, record) => (
                <Form.Item name={[record.key, 'TaxType2']}>
                    <Select disabled={!!GrnHeaderId}>
                    </Select>
                </Form.Item>
            )
        },
        {
            title: 'SGST Amount',
            dataIndex: 'TaxAmount2',
            key: 'TaxAmount2',
            render: (text, record) => (
                <Form.Item name={[record.key, 'TaxAmount2']}>
                    <InputNumber min={0} style={{ width: 50 }} disabled />
                </Form.Item>
            )
        },
        {
            title: 'Stock Locator',
            dataIndex: 'StockLocator',
            key: 'StockLocator',
            render: (text, record) => (
                <Form.Item name={[record.key, 'StockLocator']} initialValue={'Manual'}>
                    <Input style={{ width: 60 }} disabled={!!GrnHeaderId} />
                </Form.Item>
            )
        },
        {
            title: <Button type="primary" icon={<PlusOutlined />} onClick={BatchAdd}></Button>,
            dataIndex: 'add',
            key: 'add',
            width: 50,
            render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => BatchDelete(record)}><DeleteOutlined /></Popconfirm>
        }
    ]

    const BatchDelete = (record) => {
        debugger;
        const newData = dataBatchModal.map((item) => {
            if (item.key === record.key) {
                return { ...item, ActiveFlag: false };
            }
            return item;
        });
        setdataBatchModal(newData);
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
                >
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
                        <Col className="gutter-row" span={6}>
                            <>
                                <Form.Item label="Supplier" name="SupplierId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select loading={true} allowClear placeholder='Select Value' disabled={!!GrnHeaderId}>
                                        {DropDown.SupplierList.map((option) => (
                                            <Select.Option key={option.VendorId} value={option.VendorId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item name='PoHeaderId' hidden><Input></Input></Form.Item>
                                <Form.Item name='GRNHeaderId' hidden><Input></Input></Form.Item>
                            </>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Receiving Store" name="StoreId"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <Select allowClear placeholder='Select Value' disabled={!!GrnHeaderId}>
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
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Please input!'
                            //     }
                            // ]}
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
                            <Form.Item label="Invoice Number" name="InvoiceNumber" hasFeedback validateDebounce={2000}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <Input style={{ width: '100%' }} allowClear />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Invoice Date" name="InvoiceDate">
                                <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={5}>
                            <Form.Item label="Invoice Amount" name="InvoiceAmount"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
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
                                    {buttonTitle}
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
                                <Form.Item label="Tax" name='TaxAmount' style={{ marginRight: '16px', width: 100 }} >
                                    <InputNumber min={0} disabled />
                                </Form.Item>
                                <Form.Item label="Round Off" name='RoundOff' style={{ marginRight: '16px', width: 100 }}>
                                    <InputNumber min={0} disabled />
                                </Form.Item>
                                <Form.Item label="Total PO Amount" name='TotalPoAmount' style={{ width: 150 }}>
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
                                PODateFrom: dayjs().subtract(1, 'day'),
                                PODateTo: dayjs()
                            }}
                        >
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={12}>
                                    <Form.Item label="Supplier" name="Supplier">
                                        <Tag color="blue">{selectedStore}</Tag>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Receiving Store" name="ReceivingStore">
                                        <Tag color="blue">{selectedSupplier}</Tag>
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
                            <Table columns={columnsmodal} dataSource={dataModal} />
                            {/* {isPoSearchTable && poloading ? (
                                <Skeleton active />
                            ) : (
                                <Table columns={columnsmodal} dataSource={dataModal} />
                            )} */}
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
                                        <Tag color="blue">{batchRecord.ProductName}</Tag>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Received Qty" name="ReceivedQty" handleCancel>
                                        <Tag color="blue">{batchRecord.ReceivedQty}</Tag>
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <Form.Item label="Bonus qty" name="Bonusqty">
                                        <Tag color="blue">{batchRecord.BonusQuantity}</Tag>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Table
                                columns={Batchmodal} size="small"
                                dataSource={
                                    batchRecord.ProductId
                                        ? dataBatchModal.filter(item => item.ProductId === batchRecord.ProductId && item.ActiveFlag || item.ProductId === "" && item.ActiveFlag)
                                        : initialModelDataSource
                                }
                            // dataSource={dataBatchModal} 
                            />
                        </Form>
                    </Modal>
                </ConfigProvider>
            </div>
        </Layout >
    );
}

export default CreateGRNAgainstPO;
