import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder, urlAutocompleteProduct, urlAddNewUrgentIssue, urlUrgentIssueEdit, urlGetProductDetailsById, urlUrgentIssueShowBatchDetails } from '../../../endpoints.js';
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
import { useLocation } from "react-router-dom";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
//import { useParams } from 'react-router-dom';

const CreateUrgentIssue = () => {
    const [DropDown, setDropDown] = useState({
        DocumentType: [],
        StoreDetails: [],
        SupplierList: [],
        UOM: [],
        TaxType: [],
        DateFormat: []
    });

    let [counter, setCounter] = useState(0);
    let [modalCounter, setModalCounter] = useState(0);
    const location = useLocation();
    const issueId = location.state.IssueId;

    const initialDataSource =
        issueId === 0
            ? [
                {
                    key: counter,
                    ProductName: '',
                    ProductId: '',
                    UomId: '',
                    IssueQty: '',
                    AvlQtyatIssue: '',
                    Remarks: '',
                    ActiveFlag: true,
                },
            ]
            : [];

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const { Title } = Typography;
    const { TextArea } = Input;
    const { Option } = Select;
    const navigate = useNavigate();
    const [buttonTitle, setButtonTitle] = useState('Save');
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [data, setData] = useState(initialDataSource);
    const [dataModal, setDataModal] = useState([]);
    const [dataBatchModal, setdataBatchModal] = useState([]);
    const [istablevisible, setIstablevisible] = useState(false);
    const [autoCompleteProduct, setAutoCompleteProduct] = useState([]);
    const [productDetails, setProductDetails] = useState([])
    const [isModelOpen, setIsModelOpen] = useState()
    const [batchDetails, setBatchDetails] = useState()
    const [issueStatus, setIssueStatus] = useState()

    const [batches, setBatches] = useState([]);

    useEffect(() => {
        customAxios.get(urlCreatePurchaseOrder).then((response) => {
            const apiData = response.data.data;
            setDropDown(apiData);
        });
        if (issueId > 0) {
            setButtonTitle('Update')
            customAxios.get(`${urlUrgentIssueEdit}?IssueId=${issueId}`).then((response) => {
                const apiData = response.data.data;
                if (apiData.newIndentIssueModel != null && apiData.newIndentIssueModel.length > 0) {
                    const products = apiData.newIndentIssueModel.map((item, index) => ({
                        ...item,
                        key: index,
                        AvlQtyatIssue: item.BalanceQty,
                        index: index + 1
                    }))
                    setData(products)
                    setCounter(products.length)
                    setIstablevisible(true)
                    const formdata = apiData.newPatientIssueModel
                    form1.setFieldsValue({
                        IssueStore: formdata.IssueingStoreId,
                        Remarks: formdata.Remarks,
                        IssueStatus: formdata.IssueStatus == 'Created' ? undefined : formdata.IssueStatus,
                        RequestingLocation: formdata.RequestingStoreId,
                        IssueId: formdata.IssueId
                    })
                }
                const newData = apiData.BatchDetails.map((item => {
                    return {
                        ...item,
                        RequestQty: item.IssueQty
                    }
                }))
                setDataModal(newData)
            })
        }
    }, []);

    const getPanelValue1 = (value, key) => {
        if (value === "") {
            form2.setFieldsValue({ [key]: { uom: '' } });
            form2.setFieldsValue({ [key]: { RequestQty: '' } });
            form2.setFieldsValue({ [key]: { Favourite: false } });
            form2.setFieldsValue({ [key]: { IssuingStoreStock: '' } });
        }
        try {
            customAxios.get(`${urlAutocompleteProduct}?Product=${value}`).then((response) => {
                const apiData = response.data.data;
                const filteredApiData = apiData.filter(apiItem =>
                    !data.some(option => option.ProductId === apiItem.ProductId && option.ActiveFlag)
                );
                const newOptions = filteredApiData.map(item => ({ value: item.LongName, key: item.ProductId, UomId: item.UOMPrimaryUOM }));
                setAutoCompleteProduct(newOptions);
            });
        } catch (error) {
            // Handle the error as needed
        }
    }

    const handleSelect1 = (value, option, key) => {
        debugger
        form2.setFieldsValue({ [key]: { UomId: option.UomId } });
        form2.setFieldsValue({ [key]: { ProductId: option.key } });
        customAxios.get(`${urlGetProductDetailsById}?ProductId=${option.key}`).then((response) => {
            const apiData = response.data.data;
            let reqstr = form1.getFieldValue('IssueStore');
            let qty = 0;
            apiData.Stock.forEach(value => {
                if (value.StoreId === reqstr) {
                    qty += value.Quantity;
                }
            })
            const newData = data.map((item) => {
                if (item.key === key) {
                    const updatedItem = {
                        ...item,
                        // [column]: option.key,
                        ProductName: option.value,
                        UomId: option.UomId,
                        ProductId: option.key,
                        AvlQtyatIssue: qty
                    };
                    return updatedItem;
                }
                return item;
            });
            setData(newData);
            form2.setFieldsValue({ [key]: { AvlQtyatIssue: qty } });
        });
    }

    const AddProduct = async () => {
        setAutoCompleteProduct([])
        const fieldsToValidate = data.map(record => [record.key, 'ProductName']);
        await form2.validateFields(fieldsToValidate);
        setData([
            ...data,
            {
                key: counter,
                ProductName: '',
                ProductId: '',
                UomId: '',
                IssueQty: '',
                AvlQtyatIssue: '',
                Remarks: '',
                ActiveFlag: true,
            },
        ]);
        setCounter(counter + 1);
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
        await form1.validateFields()
        await form2.validateFields()
        setProductDetails(record)
        const batch = {
            IssueQty: record.IssueQty,
            ProductId: record.ProductId,
            StoreId: form1.getFieldValue('IssueStore')
        }
        const post1 = {
            newIndentModel: batch,
            Batch: dataModal
        }
        try {
            const response = await customAxios.post(urlUrgentIssueShowBatchDetails, post1, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const ApiData = response.data.data;
            if (ApiData.Batch.length > 0) {
                const batchs = ApiData.Batch.map((item, index) => {
                    if (item.ProductId == ApiData.ProductDefinitionModel.ProductDefinitionId && item.ActiveFlag != false) {
                        if (item.IssueBatchId != 0) {
                            const newitem = {
                                ...item,
                                key: index,
                                BatchNo: item.BatchNo,
                                IssueQty: item.IssueQty,
                                AvlQtyatIssue: item.BalanceQty,
                                Uom: item.Uom,
                                UomId: record.UomId,
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
                setDataModal(batchs)
                setModalCounter(batchs.length)
            }
            else if (ApiData.BatchDetails.length > 0) {
                let qty = 0; let amount = 0; let totalbatchqty = 0; let total = 0;
                const batchs = ApiData.BatchDetails.map((item, index) => {
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
                                AvlQtyatIssue: item.PendingQty,
                                Uom: item.Uom,
                                UomId: record.UomId,
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
                setDataModal(batchs);
                setModalCounter(batchs.length)
            }
            const batchs = ApiData.BatchDetails.map((item, index) => {
                return {
                    ...item,
                    key: index,
                    index: index + 1
                }
            })
            setBatchDetails(batchs)
        } catch (error) {
        }
        setIsModelOpen(true)
    }

    const validateEqualValue = (record, value) => {
        debugger
        const newData = data.map((item => {
            if (record.key == item.key) {
                return {
                    ...item,
                    IssueQty: value
                }
            }
        }))
        setData(newData)
        const va = form1.getFieldsValue()
        if (value <= record.AvlQtyatIssue) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Must Not Greater than Available Qty'));
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
                        <AutoComplete style={{ width: '100%' }} disabled={!!issueId}
                            options={autoCompleteProduct}
                            onSearch={(value) => getPanelValue1(value, record.key)}
                            onSelect={(value, option) => handleSelect1(value, option, record.key)}
                            placeholder="Search for a product"
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item name={[record.key, 'ProductId']} hidden initialValue={record.ProductId}>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item name={[record.key, 'IndentIssueLineId']} hidden initialValue={record.IndentIssueLineId}>
                        <Input></Input>
                    </Form.Item>
                </>
            )
        },
        {
            title: 'UOM',
            dataIndex: 'UomId',
            key: 'UomId',
            width: 150,
            render: (text, record) => (
                <Form.Item name={[record.key, 'UomId']} style={{ width: '100%' }} initialValue={record.UomId}>
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
            title: 'Issue Qty',
            dataIndex: 'IssueQty',
            key: 'IssueQty',
            render: (text, record) => (
                <Form.Item style={{ width: '100%' }} initialValue={record.IssueQty}
                    name={[record.key, 'IssueQty']}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!'
                        },
                        {
                            validator: (_, value) => validateEqualValue(record, value)
                        }
                    ]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
            )
        },
        {
            title: 'Avl Qty at Issue',
            dataIndex: 'AvlQtyatIssue',
            key: 'AvlQtyatIssue',
            render: (text, record) => (
                <Form.Item name={[record.key, 'AvlQtyatIssue']} initialValue={record.AvlQtyatIssue}>
                    <Input disabled />
                </Form.Item>
            )
        },
        {
            title: 'Remarks',
            dataIndex: 'Remarks',
            key: 'Remarks',
            render: (text, record) => (
                <>
                    <Form.Item name={[record.key, 'Remarks']} initialValue={record.Remarks}>
                        <Input allowClear />
                    </Form.Item>
                </>
            )
        },
        {
            title: 'Batch Details',
            dataIndex: 'BatchDetails',
            key: 'BatchDetails',
            render: (text, record) => (
                <>
                    <Button type='link' onClick={() => OpenBatch(record)}>Batch</Button>
                </>
            )
        },
        {
            title: <Button type="primary" icon={<PlusOutlined />} onClick={AddProduct}></Button>,
            // title: <Button type="primary" icon={<PlusOutlined />} onClick={AddProduct}></Button>,
            dataIndex: 'add',
            key: 'add',
            width: 50,
            render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}><DeleteOutlined /></Popconfirm>
        }
    ]

    const handleDelete = () => {
        const newData = data.map((item) => {
            if (item.key === record.key) {
                return { ...item, ActiveFlag: false };
            }
            return item;
        });
        setData(newData);
    }

    const BatchSelect = (record) => {
        debugger
        const IsExist = dataModel.filter((item) => item.BatchNo == record)
        const temp = batchDetails.filter((item) => item.BatchNo === record)
        const newdata = temp.map((item) => {
            return {
                ...item,
                BatchNo: record,
                Quantity: item.PendingQty,
                UomId: item.Uom,
                EXPDate: DateBindtoDatepicker(item.EXPDate),
                MRP: item.MRP,
                amount: 0
            }
        })
        setDataModal(newdata)
        if (IsExist.length > 0) {
            message.warning('Same Batch No should not be selected.')
        }
    }

    const BatchAdd = async () => {
        const fieldsToValidate = data.map(record => [record.key, 'ProductName']);
        setDataModal([
            ...data,
            {
                key: modelCounter,
                BatchNo: '',
                Quantity: '',
                AvlQuantity: '',
                UomId: '',
                EXPDate: '',
                MRP: '',
                Amount: '',
                StockLocator: '',
                ActiveFlag: true
            },
        ]);
        setModalCounter(modalCounter + 1);
        setIsProductAvailable(false)
    };

    const DateBindtoDatepicker = (value) => {
        const isoDateString = value;
        const dateValue = new Date(isoDateString);
        const formattedDate = dayjs(dateValue).format("DD-MM-YYYY");
        return dayjs(formattedDate, "DD-MM-YYYY");
    };

    const validateEqualIssueQty = (record, value) => {
        const newData = dataModal.map((item => {
            if (record.key == item.key) {
                return {
                    ...item,
                    IssueQty: value
                }
            }
        }))
        setDataModal(newData)
        if (record.AvlQtyatIssue >= value) {
            return Promise.resolve()
        }
        return Promise.reject(new Error('Issue Qty must not be Avl Qty!'))
    }

    const columnsmodal = [
        {
            title: 'Batch No',
            dataIndex: 'BatchNo',
            key: 'BatchNo',
            width: 100,
            render: (_, record) => (
                <>
                    <Form.Item name={[record.key, 'BatchNo']}
                        rules={[
                            {
                                required: true,
                                message: 'Please input!'
                            },
                        ]}
                        initialValue={record.BatchNo}
                    >
                        <Select allowClear onChange={(record) => BatchSelect(record)} style={{ width: 100 }} disabled={!!record.IssueBatchId}>
                            {batchDetails.map((option) => (
                                <Select.Option key={option.BatchNo} value={option.BatchNo}>{option.BatchNo}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name={[record.key, 'ProductId']} hidden initialValue={record.ProductId}><Input /></Form.Item>
                    <Form.Item name={[record.key, 'IssueBatchId']} hidden initialValue={record.IssueBatchId}><Input /></Form.Item>
                </>
            )
        },
        {
            title: 'Quantity',
            dataIndex: 'IssueQty',
            key: 'IssueQty',
            width: 100,
            render: (text, record) => {
                return (
                    <Form.Item name={[record.key, 'IssueQty']} initialValue={record.IssueQty}
                        rules={[
                            {
                                required: true,
                                message: 'Please input!'
                            },
                            {
                                validator: (_, value) => validateEqualIssueQty(record, value)
                            }
                        ]}
                    >
                        <InputNumber allowClear />
                    </Form.Item>
                );
            }
        },
        {
            title: 'Avl Quantity',
            dataIndex: 'AvlQtyatIssue',
            key: 'AvlQtyatIssue',
            width: 100,
            render: (text, record) => (
                <Form.Item name={[record.key, 'AvlQtyatIssue']} initialValue={record.AvlQtyatIssue}>
                    <InputNumber disabled />
                </Form.Item>
            )
        },
        {
            title: 'UOM',
            dataIndex: 'UomId',
            key: 'UomId',
            width: 100,
            render: (text, record) => (
                <Form.Item name={[record.key, 'UomId']} initialValue={record.UomId}>
                    {record.Uom}
                </Form.Item>
            )
        },
        {
            title: 'Exp Date',
            dataIndex: 'EXPDate',
            key: 'EXPDate',
            width: 100,
            render: (text, record) => (
                <Form.Item name={[record.key, 'EXPDate']} initialValue={record.EXPDate == '' ? undefined : DateBindtoDatepicker(record.EXPDate)}>
                    <DatePicker style={{ width: 100 }} disabled format="MMMM-YYYY" />
                </Form.Item>
            )
        },
        {
            title: 'Rate',
            dataIndex: 'IssueRate',
            key: 'IssueRate',
            render: (text, record) => (
                <Form.Item name={[record.key, 'IssueRate']} initialValue={record.IssueRate}>
                    <InputNumber disabled />
                </Form.Item>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'Amount',
            key: 'Amount',
            render: (text, record) => (
                <Form.Item name={[record.key, 'Amount']} initialValue={record.Amount}>
                    <InputNumber disabled />
                </Form.Item>
            )
        },
        {
            title: 'Stock Locator',
            dataIndex: 'StockLocator',
            key: 'StockLocator',
            render: (text, record) => (
                <Form.Item name={[record.key, 'StockLocator']}>
                    <Input style={{ width: 100 }} allowClear disabled />
                </Form.Item>
            )
        },
        {
            title: <Button type="primary" icon={<PlusOutlined />} onClick={BatchAdd}></Button>,
            dataIndex: 'add',
            key: 'add',
            width: 50,
            render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => ModelDelete(record)}><DeleteOutlined /></Popconfirm>
        }
    ];

    const ModelDelete = (record) => {
        debugger;
        const newData = dataModal.filter((item) => item.key !== (record.key === undefined ? record.toString() : record.key));
        setDataModal(newData);
    };

    const handleCancel = () => {
        const url = '/UrgentIssue';
        navigate(url);
    }

    const SubmitChanged = (event) => {
        setIssueStatus(event.target.checked)
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // const handlePoNumber = (record) => {
    //     debugger;
    //     const postData = {
    //         PoHeaderId: record.PoHeaderId,
    //         Supplier: record.SupplierId,
    //         Store: record.ProcurementStoreId,
    //     }
    // try {
    //   customAxios.get(`${urlCreateUrgentIssue}?PoHeaderId=${postData.PoHeaderId}&Supplier=${postData.Supplier}&Store=${postData.Store}`).then((response) => {
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
    //const url = `/CreateUrgentIssue/${record.PoHeaderId}/${record.SupplierId}/${record.ProcurementStoreId}`;
    //navigate(url);
    // };

    const onCancelBatchmodal = () => {
        setIsBatchModalOpen(false);
        setdataBatchModal([]);
        setshouldValidateModal(false);
    }

    const handleOnFinish = async (values) => {
        debugger;
        if (dataModal.length == 0) {
            message.warning('Please Add Batch!')
            return false
        }
        const form2data = form2.getFieldsValue()
        const products = [];
        for (let i = 0; i <= data.length; i++) {
            if (data[i] !== undefined) {
                const product = {
                    ProductId: data[i].ProductId,
                    UomId: data[i].UomId,
                    IssueQty: data[i].IssueQty,
                    Remarks: data[i].Remarks,
                    IndentIssueLineId: data[i].IndentIssueLineId ? data[i].IndentIssueLineId : 0
                }
                products.push(product);
            }
        }

        const UrgentIssue = {
            IssueDateString: values.IssuingDate ? values.IssuingDate.format("DD-MM-YYYY") : '',
            RequestingStoreId: values.RequestingLocation,
            IssueingStoreId: values.IssueStore,
            IssueId: values.IssueId ? values.IssueId : 0,
            // IndentId: values.IndentId ? values.IndentId : 0,
            IssueStatus: !issueStatus ? 'Created' : values.IssueStatus,
            Remarks: values.Remarks,
        }
        const postData = {
            newIndentModel: UrgentIssue,
            IndentDetails: products,
            Batch: dataModal
        }
        try {
            const response = await customAxios.post(urlAddNewUrgentIssue, postData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            handleCancel()
        } catch (error) {
            // Handle error      
        }
        // setIsSearchLoading(false);
    };

    const onFinishModel = (values) => {
        debugger
        const qty = dataModal.reduce((sum, item) => sum + item.IssueQty, 0)
        if (productDetails.IssueQty !== qty) {
            message.warning('Batch Issue Qty is equals to Issued Qty');
            return false
        }
        setIsModelOpen(false)
    }

    const handleCloseModal = () => {
        setDataModal([])
        form3.resetFields()
        setIsModelOpen(false)
    }

    const handleSaveModal = () => {
        form3.submit()
    }

    const handleStore = (value) => {
        debugger
        const Va = form1.getFieldsValue()
        if (Va.RequestingLocation == Va.IssueStore) {
            message.warning('Please Select Different Store')
            form1.resetFields()
            return false
        }
        if (value != undefined) {
            setIstablevisible(true)
        }
    }

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Create Urgent Issue
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
                        IssuingDate: dayjs()
                    }}
                >
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
                        <Col className="gutter-row" span={4}>
                            <Form.Item
                                label="Issuing Date"
                                name="IssuingDate"
                            >
                                <DatePicker style={{ width: '100%' }} disabled format='DD-MM-YYYY' />
                            </Form.Item>
                            <Form.Item name="IssueId" hidden>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4}>
                            <Form.Item
                                label="Issuing Store"
                                name="IssueStore"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <Select allowClear placeholder='Select Value' onChange={handleStore} disabled={!!issueId}>
                                    {DropDown.StoreDetails.map((option) => (
                                        <Select.Option key={option.StoreId} value={option.StoreId}>
                                            {option.LongName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={4}>
                            <Form.Item
                                label="Requesting Location"
                                name="RequestingLocation"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!'
                                    }
                                ]}
                            >
                                <Select allowClear placeholder='Select Value' onChange={handleStore} disabled={!!issueId}>
                                    {DropDown.StoreDetails.map((option) => (
                                        <Select.Option key={option.StoreId} value={option.StoreId}>
                                            {option.LongName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Form.Item label="Issue Owner" name="IssueOwner">
                                <Input style={{ width: '100%' }} allowClear />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={3}>
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
                        </Col>
                        <Col className="gutter-row" span={3} >
                            <Form.Item name="SubmitCheck" style={{ marginTop: '30px' }} valuePropName='checked'>
                                <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={9}>
                            <Form.Item label="Remarks" name="Remarks">
                                <TextArea />
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
                    {/* {istablevisible ? (
                        <div>
                            <Table columns={columns} dataSource={data} scroll={{ x: 0 }} />
                        </div>
                    ) : null} */}
                    <Form
                        onFinish={handleOnFinish}
                        variant="outlined"
                        size="default"
                        style={{
                            maxWidth: 1500
                        }}
                        form={form2}
                    >
                        {istablevisible ? (
                            <div>
                                <Table columns={columns} dataSource={data.filter((item) => item.ActiveFlag !== false)} scroll={{ x: 0 }} />
                            </div>
                        ) : null}
                    </Form>
                </Form>
                <Modal
                    width={1000}
                    maskClosable={false}
                    title="Product Batch Details"
                    open={isModelOpen}
                    onOk={handleSaveModal}
                    onCancel={handleCloseModal}
                    okText={"Save"}
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
                            width: "100%",
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinishModel}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        form={form3}
                    >
                        <Row>
                            <Col className="gutter-row" span={12}>
                                <div>
                                    <span>
                                        Product :{" "}
                                        <b style={{ color: "#1677ff" }}>{productDetails.ProductName}</b>{" "}
                                    </span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <div>
                                    <span>
                                        Issued Quantity  :{" "}
                                        <b style={{ color: "#1677ff" }}>{productDetails.IssueQty}</b>{" "}
                                    </span>
                                </div>
                            </Col>
                        </Row>
                        <Table
                            columns={columnsmodal}
                            size="small"
                            locale={{ emptyText: "Nodata " }}
                            dataSource={dataModal}
                        //   deliveryRecord.ProductId
                        //     ? schedule.filter(
                        //       (item) =>
                        //         (item.ProductId === deliveryRecord.ProductId &&
                        //           item.ActiveFlag) ||
                        //         (item.ProductId === "" && item.ActiveFlag)
                        //     )
                        //     : initialDeliveryDataSource
                        // }
                        />
                    </Form>
                </Modal>
            </div>
        </Layout >
    );
}

export default CreateUrgentIssue;
