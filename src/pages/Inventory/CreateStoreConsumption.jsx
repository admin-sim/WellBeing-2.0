import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlGetPurshaseOrderDetails, urlAutocompleteProduct, urlGetProductDetailsById, urlShowBatchDetails } from '../../../endpoints';
import Select from 'antd/es/select';
import { ConfigProvider, Typography, Checkbox, message, Modal, Popconfirm, Spin, Col, Card, Row, AutoComplete } from 'antd';
import Input from 'antd/es/input';
import Form from 'antd/es/form';
import { DatePicker } from 'antd';
import Layout from 'antd/es/layout/layout';
import { LeftOutlined } from '@ant-design/icons';
//import Typography from 'antd/es/typography';
import { useNavigate } from 'react-router';
import { Table, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined, CloseSquareFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
//import { Calculate } from '@mui/icons-material';

const CreateStoreConsumption = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: []
  });

  let [counter, setCounter] = useState(0);
  let [counterModel, setCounterModel] = useState(0);
  const StoreConsupmtionId = 0

  const initialBatchDataSource =
    StoreConsupmtionId === 0
      ? [
        {
          key: 1,
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
      ]
      : [];

  const initialDataSource =
    StoreConsupmtionId === 0
      ? [
        {
          key: 1,
          ProductName: "",
          PoLineId: 0,
          UomId: "",
          IssueQty: "",
          AvailableQtyatIssue: "",
          ReasonforConsumption: "",
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
  const [data, setData] = useState(initialDataSource);
  const currentDate = new Date();
  //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');
  const [isLoading, setIsLoading] = useState(true);
  const [inputValues, setInputValues] = useState({});
  const [shouldValidate, setShouldValidate] = useState(false);
  const [productOptions, setProductOptions] = useState(null);
  const [selectedUom, setSelectedUom] = useState({});
  const [batchDetails, setBatchDetails] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [dataModel, setDataModel] = useState(initialBatchDataSource);
  const [formData, setFormData] = useState({});
  const [selectedUomText, setSelectedUomText] = useState({});
  const [selectedProductId, setSelectedProductId] = useState({});
  const [selectedUomId, setSelectedUomId] = useState({});
  const [recordKeys, setRecordKeys] = useState();
  const [delivery, setDelivery] = useState([]);
  const [productIds, setProductIds] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const fields = form1.getFieldsValue();
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isTable, setIsTable] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [issueStatus, setIssueStatus] = useState()
  // const tableRef = useRef(null);

  useEffect(() => {
    customAxios.get(urlGetPurshaseOrderDetails).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
  }, []);

  const getPanelValue = async (searchText) => {
    //     debugger;
    //     try {
    //       customAxios.get(`${urlAutocompleteProduct}?Product=${searchText}`).then((response) => {
    //         const apiData = response.data.data;
    //         const newOptions = apiData.map(item => ({ value: item.LongName, key: item.ProductDefinitionId, UomId: item.UOMPrimaryUOM }));
    //         setAutoCompleteOptions(newOptions);
    //       });
    //     } catch (error) {
    //       //console.error("Error fetching purchase order details:", error);
    //       // Handle the error as needed
    //     }
  }
  // useEffect(() => {
  //   debugger;
  //   const fetchData = async () => {
  //     try {
  //       Object.entries(inputValues).forEach(async ([key, value]) => {
  //         if (value) {
  //           const response = await customAxios.get(`${urlAutocompleteProduct}?Product=${value}`);
  //           const apiData = response.data.data;
  //           const newOptions = apiData.map((item) => ({ value: item.LongName, key: item.ProductDefinitionId, UomId: item.UOMPrimaryUOM }));
  //           setAutoCompleteOptions((prevState) => ({ ...prevState, [key]: newOptions }));
  //         }
  //       });
  //     } catch (error) {
  //       // Handle the error as needed
  //     }
  //   };

  //   fetchData();
  // }, [inputValues]);

  const onOkModal = () => {
    debugger;
    form3
      .validateFields()
      .then(() => {
        // If validation succeeds, submit the form
        form3.submit();
      })
      .catch((error) => {
        console.log('Validation error:', error);
      });
  }

  const onFinishModel = (values) => {
    debugger;
    const deliveries = [];
    for (let i = 0; i < idCounterModel; i++) {
      const delivery = {
        ProductId: values.Product,
        DeliveryQuantity: values[i].quantity,
        UomId: values[i].uom,
        DelDate: values.FromDate === null ? '' : (values[i].datedelivery.$D.toString().padStart(2, '0') + '-' + (values[i].datedelivery.$M + 1).toString().padStart(2, '0') + '-' + values[i].datedelivery.$y).toString(),
        DeliveryLocation: values[i].deliveryloc === undefined ? null : values[i].deliveryloc,
      }
      deliveries.push(delivery);
      setDelivery(deliveries);
      setIsModelOpen(false);
    }
    onCancelModel();
  }

  const onCancelModel = () => {
    debugger;
    form3.resetFields();
    for (let i = idCounterModel; i > 0; i--) {
      ModelDelete(i);
    }
    setIsModelOpen(false);
  }

  const handleCancel = () => {
    const url = '/StoreConsumption';
    navigate(url);
    // form1.resetFields();
    // form2.resetFields();
    // setDelivery([]);
    // setData([]);
    // for (let i = idCounter; i > 0; i--) {
    //   handleDelete(i);
    // }
  };

  const ModelOpen = (value, record) => {
    debugger;
    form1
      .validateFields()
      .then(() => {
        // If validation succeeds, submit the form
        setRecordKeys(record.key)
        setIsModelOpen(true);
      })
      .catch((error) => {
        console.log('Validation error:', error);
      });
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleToPurchaseOrder = () => {
    const url = '/StoreConsumption';
    navigate(url);
  };

  const handleDelete = (record) => {
    const newData = data.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setData(newData);
  };

  const ModelDelete = (record) => {
    const newData = dataModel.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setDataModel(newData);
  };

  const handleOnFinish = async (values) => {
    //     debugger;
    //     setIsSearchLoading(true);
    //     const products = [];
    //     for (let i = 0; i <= idCounter; i++) {
    //       if (values[i] !== undefined) {
    //         const product = {
    //           ProductId: productIds[i],
    //           UomId: values[i].uom,
    //           PoQuantity: values[i].poQty,
    //           BonusQuantity: values[i].bounsQty === "" ? 0 : values[i].bounsQty,
    //           PoRate: values[i].poRate === "" ? null : values[i].poRate.toFixed(4),
    //           DiscountRate: values[i].discount === "" ? 0 : values[i].discount.toFixed(4),
    //           DiscountAmount: values[i].discountAmt === "" ? 0 : parseFloat(values[i].discountAmt).toFixed(4),
    //           // DiscountAmount: values[i].discountAmt === "" ? 0 : (form1.getFieldValue([i, 'discountAmt'])).toFixed(4),          
    //           MrpExpected: values[i].expectedMRP === "" ? 0 : values[i].expectedMRP.toFixed(4),
    //           TaxType1: values[i].cgst === "" ? 0 : values[i].cgst,
    //           TaxAmount1: values[i].cgstAmt === "" ? 0 : values[i].cgstAmt.toFixed(4),
    //           TaxType2: values[i].sgst === "" ? 0 : values[i].sgst,
    //           TaxAmount2: values[i].sgstAmt === "" ? 0 : values[i].sgstAmt.toFixed(4),
    //           LineAmount: values[i].amount === "" ? null : values[i].amount.toFixed(4),
    //           PoTotalAmount: values[i].totalAmount === "" ? null : values[i].totalAmount,
    //           AvailableQuantity: values[i].avlQty === "" ? null : values[i].avlQty,
    //         }
    //         products.push(product);
    //       }
    //     }

    //     const purchaseOrder = {
    //       SupplierId: values.SupplierList === undefined ? '' : values.SupplierList,
    //       ProcurementStoreId: values.StoreDetails === undefined ? '' : values.StoreDetails,
    //       DocumentType: values.DocumentType === undefined ? '' : values.DocumentType,
    //       PurchaseDate: values.PODate === undefined ? dayjs(`${currentDate}`).format(dateFormat) : values.PODate,
    //       PoStatus: values.POStatus === undefined ? null : values.POStatus,
    //       Remarks: values.Remarks === undefined ? null : values.Remarks,
    //       PoPurchaseValue: values.Amount === undefined ? null : values.Amount,
    //       PoTotalAmount: values.totalpoAmount === undefined ? null : values.totalpoAmount,
    //       PoTaxAmount: values.PoTaxAmount === undefined ? 0 : values.PoTaxAmount,
    //     }
    //     const postData = {
    //       newPurchaseOrderModel: purchaseOrder,
    //       PurchaseOrderDetails: products,
    //       Delivery: delivery
    //     }
    //     try {
    //       const response = await customAxios.post(urlAddNewPurchaseOrder, postData, {        
    //         headers: {
    //           'Content-Type': 'application/json'
    //         }        
    //       });
    //       form1.resetFields();
    //     } catch (error) {
    //       // Handle error      
    //     }
    //     setIsSearchLoading(false);
  };

  const handleSelect = (value, option, column, record) => {
    debugger;
    customAxios
      .get(`${urlGetProductDetailsById}?ProductId=${option.key}`)
      .then((response) => {
        const apiData = response.data.data;
        const valuesArray = apiData.Stock.filter((item) => item.StoreId = form1.getFieldValue('IssuingStore'))
        const qty = valuesArray.reduce(
          (total, item) => total + (item.Quantity || 0),
          0
        );
        form2.setFieldsValue({ [record.key]: { ProductId: option.key } });
        form2.setFieldsValue({ [record.key]: { Quantity: qty } });
        const newData = data.map((item) => {
          if (item.key === record.key) {
            const updatedItem = {
              ...item,
              [column]: option.key,
              ProductName: option.value,
              UomId: option.UomId,
              ProductId: option.key,
              Quantity: qty
            };
            return updatedItem;
          }
          return item;
        });
        setData(newData);
      });
  };

  useEffect(() => {
    console.log(selectedUom);
    console.log(selectedUomText);
  }, [selectedUom], [selectedUomText]);

  const handleAdd = async () => {
    setProductOptions([]);
    await form2.validateFields();
    setData([
      ...data,
      {
        key: counter,
        ProductName: "",
        PoLineId: 0,
        UomId: "",
        IssueQty: "",
        AvailableQtyatIssue: "",
        ReasonforConsumption: "",
        ActiveFlag: true,
      },
    ]);
    setCounter(counter + 1);
  };

  const handleSearch = async (searchText) => {
    debugger;
    if (searchText) {
      const response = await customAxios.get(`${urlAutocompleteProduct}?Product=${searchText}`);
      const apiData = response.data.data;

      // Filter apiData with productOptions
      const filteredApiData = apiData.filter(apiItem =>
        !data.some(option => option.ProductId === apiItem.ProductId)
      );

      const newOptions = filteredApiData.map((item) => ({
        value: item.LongName,
        key: item.ProductId,
        UomId: item.UOMPrimaryUOM,
      }));
      setProductOptions(newOptions);
    }
  }

  const validateEqualValue = (record, value) => {
    debugger
    const va = form1.getFieldsValue()
    if (value <= record.Quantity) {
      // const newdata = data.map((item) => {
      //     if (item.ProductId === record.ProductId) {
      //         const updated = { ...item, RequestingQty: value }
      //         return updated
      //     }
      //     return item
      // })
      // setData(newdata)
      return Promise.resolve();
    }
    return Promise.reject(new Error('Must Not Greater than Available Qty'));
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "ProductName",
      fixed: "left",
      key: "ProductName",
      width: 450,
      render: (text, record, index) => (
        <>
          <Form.Item
            name={[record.key, "ProductName"]}
            rules={[{ required: true, message: "Required" }]}
            initialValue={
              record.LongName == undefined
                ? record.ProductName
                : record.LongName
            }
          >
            <AutoComplete
              options={productOptions}
              onSearch={handleSearch}
              onSelect={(value, option) =>
                handleSelect(value, option, "ProductName", record)
              }
              onChange={(value) => {
                if (!value) {
                  setProductOptions([]);
                }
              }}
              allowClear={{
                clearIcon: <CloseSquareFilled />,
              }}
              disabled={!!record.PoLineId}
            />
          </Form.Item>
          <Form.Item
            name={[record.key, "ProductId"]}
            hidden
            initialValue={record.ProductId}
          >
            <Input defaultValue={record.ProductId}></Input>
          </Form.Item>
          <Form.Item
            name={[record.key, "StoreConsumptionId"]}
            hidden
            initialValue={record.PoLineId}
          >
            <Input></Input>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'UOM',
      dataIndex: 'UomId',
      key: 'UomId',
      render: (text, record) => (
        <Form.Item name={[record.key, 'UomId']} initialValue={record.UomId}>
          <Select value={selectedUom[record.key]} style={{ width: '100%' }} disabled>
            {/* {DropDown.UOM.map((option) => (
              <Select.Option key={option.UomId} value={option.UomId}>
                {option.ShortName}
              </Select.Option>
            ))} */}
          </Select>
        </Form.Item>
      )
    },
    {
      title: 'Issue Qty',
      dataIndex: 'IssueQty',
      key: 'IssueQty',
      render: (text, record) => (
        <Form.Item
          name={[record.key, 'IssueQty']}
          initialValue={text}
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
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      )
    },
    {
      title: 'Avl Qty at Issue',
      dataIndex: 'Quantity',
      key: 'Quantity',
      render: (text, record) => (
        <Form.Item name={[record.key, 'Quantity']} initialValue={text}>
          <InputNumber min={0} style={{ width: '100%' }} disabled />
        </Form.Item>
      )
    },
    {
      title: 'Reason for Consumption',
      dataIndex: 'ReasonforConsumption',
      key: 'ReasonforConsumption',
      render: (text, record) => (
        <Form.Item
          name={[record.key, 'ReasonforConsumption']}
          initialValue={text}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      )
    },
    {
      title: 'Batch Details',
      dataIndex: 'Batch',
      key: 'Batch',
      render: (text, record) => (
        <Button type='link' onClick={() => OpenBatch(record)}>Batch</Button>
      )
    },
    {
      title: <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}></Button>,
      dataIndex: 'add',
      key: 'add',
      width: 50,
      render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}><DeleteOutlined /></Popconfirm>
    }
  ];

  const handleCloseModal = () => {
    setIsModelOpen(false)
    form3.resetFields()
  }

  const OpenBatch = async (record) => {
    debugger
    const va = form2.getFieldsValue();
    for (let i = 1; i <= dataModel.length; i++) {
      if (va[i].ProductId = record.ProductId) {
        record.IssueQty = va[i].IssueQty
      }
    }
    // record.IssueQty = temp.IssueQty
    setProductDetails(record)
    await form2.validateFields()
    const va1 = form1.getFieldsValue()
    const batch = {
      ProductId: record.ProductId,
      StoreId: va1.IssuingStore
    }
    const post1 = {
      newIndentModel: batch,
    }
    try {
      const response = await customAxios.post(urlShowBatchDetails, post1, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const ApiData = response.data.data;
      // setBatchRecord(ApiData);
      // form1.setFieldsValue({ [productCount - 1]: { StockId: ApiData.BatchDetails[productCount - 1].StockId } })            
      setBatchDetails(ApiData.BatchDetails)
    } catch (error) {

    }
    setIsModelOpen(true)
  }

  const ModelAdd = async () => {
    debugger;
    await form3.validateFields();
    setDataModel([
      ...dataModel,
      {
        key: counterModel,
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
    setCounterModel(counterModel + 1);
  };

  const SubmitChanged = (event) => {
    setIssueStatus(event.target.checked)
  }

  const columnsModel = [
    {
      title: 'Batch No',
      dataIndex: 'BatchNo',
      key: 'BatchNo',
      width: 100,
      render: (_, record) => (
        <Form.Item name={[record.key, 'BatchNo']}
          rules={[
            {
              required: true,
              message: 'Please input!'
            },
          ]}
          initialValue={record.BatchNo}
        >
          <Select allowClear onChange={(record) => BatchSelect(record)} style={{ width: 100 }}>
            {batchDetails.map((option) => (
              <Select.Option key={option.BatchNo} value={option.BatchNo}>{option.BatchNo}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',
      width: 100,
      render: (text, record) => {
        return (
          <Form.Item name={[record.key, 'Quantity']} initialValue={record.Quantity}
            rules={[
              {
                required: true,
                message: 'Please input!'
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
      dataIndex: 'AvlQuantity',
      key: 'AvlQuantity',
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'AvlQuantity']}>
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
        <Form.Item name={[record.key, 'UomId']} >
          {record.UomId}
        </Form.Item>
      )
    },
    {
      title: 'Exp Date',
      dataIndex: 'EXPDate',
      key: 'EXPDate',
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'EXPDate']} initialValue={record.EXPDate}>
          <DatePicker style={{ width: 100 }} disabled format="MMMM-YYYY" />
        </Form.Item>
      )
    },
    {
      title: 'Rate',
      dataIndex: 'MRP',
      key: 'MRP',
      render: (text, record) => (
        <Form.Item name={[record.key, 'MRP']} initialValue={record.MRP}>
          <InputNumber disabled />
        </Form.Item>
      )
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
      title: 'Stock Locator',
      dataIndex: 'StockLocator',
      key: 'StockLocator',
      render: (text, record) => (
        <Form.Item name={[record.key, 'StockLocator']}>
          <Input style={{ width: 100 }} allowClear />
        </Form.Item>
      )
    },
    {
      title: <Button type="primary" icon={<PlusOutlined />} onClick={ModelAdd}></Button>,
      dataIndex: 'add',
      key: 'add',
      width: 50,
      render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => ModelDelete(record)}><DeleteOutlined /></Popconfirm>
    }
  ]

  const DateBindtoDatepicker = (value) => {
    const isoDateString = value;
    const dateValue = new Date(isoDateString);
    const formattedDate = dayjs(dateValue).format('DD-MM-YYYY');
    return dayjs(formattedDate, 'DD-MM-YYYY');
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
    setDataModel(newdata)
    if (IsExist.length > 0) {
      message.warning('Same Batch No should not be selected.')
    }
  }

  const handleSaveModal = () => {

  }

  const handleStore = (value) => {
    if (value) {
      setIsTable(true)
    } else {
      setIsTable(false)
    }
  }

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
              Create Store Consumption
            </Title>
          </Col>
          <Col offset={6} span={2}>
            <Button icon={<LeftOutlined />} style={{ marginBottom: 0 }} onClick={handleToPurchaseOrder}>
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
          form={form1}
          initialValues={{
            ConsumptionDate: dayjs(),
          }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Issuing Store" name="IssuingStore"
                  rules={[
                    {
                      required: true,
                      message: 'Please input!'
                    }
                  ]}
                >
                  <Select placeholder='Select Value' allowClear onChange={handleStore}>
                    {DropDown.StoreDetails.map((option) => (
                      <Select.Option key={option.StoreId} value={option.StoreId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Consumption Date" name="ConsumptionDate">
                  <DatePicker disabled style={{ width: '100%' }} format='DD-MM-YYYY' />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Consumption Status" name="ConsumptionStatus"
                  rules={[
                    {
                      required: issueStatus,
                      message: 'Please input!'
                    }
                  ]}
                >
                  <Select allowClear placeholder='Select Value'>
                    <Select.Option key='Draft' value='Draft'></Select.Option>
                    <Select.Option key='Finalize' value='Finalize'></Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item name="SubmitCheck" style={{ marginTop: '30px' }} valuePropName='checked'>
                  <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={12}>
              <div>
                <Form.Item label='Remarks' name="Remarks">
                  <TextArea allowClear />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row justify="end" style={{ padding: '0rem 1rem' }}>
            <Col style={{ marginRight: '10px' }}>
              <Form.Item>
                <Button type="primary" loading={isSearchLoading} htmlType="submit">
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
        </Form>
        <Card>
          <Form
            layout="vertical"
            onFinish={handleOnFinish}
            variant="outlined"
            size="default"
            style={{
              maxWidth: 1500
            }}
            form={form2}
          >
            {isTable && <Table
              bordered
              columns={columns}
              size="small"
              dataSource={data.filter((item) => item.ActiveFlag !== false)}
              locale={{ emptyText: "nodata " }}
              scroll={{
                x: 0,
              }}
            />}
          </Form>
        </Card>
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
              columns={columnsModel}
              size="small"
              locale={{ emptyText: "Nodata " }}
              dataSource={dataModel}
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

export default CreateStoreConsumption;
