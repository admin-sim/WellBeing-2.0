import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlGetPurshaseOrderDetails, urlAutocompleteProduct } from '../../../endpoints';
import Select from 'antd/es/select';
import { ConfigProvider, Typography, Checkbox, Tag, Modal, Popconfirm, Spin, Col, Divider, Row, AutoComplete } from 'antd';
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
//import { Calculate } from '@mui/icons-material';

const CreateOpeningStock = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: []
  });

  let [idCounter, setCounter] = useState(0);
  let [idCounterModel, setCounterModel] = useState(0);

  /*   const initialdata = [
    {
      key: idCounter.toString(),
      product: '',
      uom: '',
      poQty: '',
      bounsQty: '',
      poRate: '',
      discount: '',
      discountAmt: '',
      expectedMRP: '',
      cgst: '',
      cgstAmt: '',
      sgst: '',
      sgstAmt: '',
      amount: '',
      totalAmount: '',
      avlQty: '',
      deliverySchedule: ''
    }
  ];
 */
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const currentDate = new Date();
  //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');
  const [isLoading, setIsLoading] = useState(true);
  const [inputValues, setInputValues] = useState({});
  const [shouldValidate, setShouldValidate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedUom, setSelectedUom] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [shouldValidateModel, setShouldValidateModel] = useState(false);
  const [dataModel, setDataModel] = useState([]);
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
  // const tableRef = useRef(null);

  useEffect(() => {
    customAxios.get(urlGetPurshaseOrderDetails).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
  }, []);

  const getPanelValue = async (searchText) => {
        debugger;
        try {
          customAxios.get(`${urlAutocompleteProduct}?Product=${searchText}`).then((response) => {
            const apiData = response.data.data;
            const newOptions = apiData.map(item => ({ value: item.LongName, key: item.ProductDefinitionId, UomId: item.UOMPrimaryUOM }));
            setAutoCompleteOptions(newOptions);
          });
        } catch (error) {
          //error          
        }
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
    form2
      .validateFields()
      .then(() => {
        // If validation succeeds, submit the form
        form2.submit();
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
      setIsModalOpen(false);
    }
    onCancelModel();
  }

  const onCancelModel = () => {
    debugger;
    form2.resetFields();
    for (let i = idCounterModel; i > 0; i--) {
      ModelDelete(i);
    }
    setIsModalOpen(false);
  }
  const handleCancel = () => {
    const url = '/OpeningStock';
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
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.log('Validation error:', error);
      });
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleToPurchaseOrder = () => {
    const url = '/OpeningStock';
    navigate(url);
  };

  const handleDelete = (record) => {
    debugger;
    const newData = data.filter((item) => item.key !== (record.key === undefined ? record.toString() : record.key));
    Object.keys(fields).forEach(fieldName => {
      if (fieldName.startsWith(`${record.key}.`)) {
        form1.resetFields([fieldName]);
      }
    });
    setData(newData);
    // if (tableRef.current) {
    //   tableRef.current.scrollLeft = 0;
    // }    
  };

  const ModelDelete = (record) => {
    debugger;
    const newData = dataModel.filter((item) => item.key !== (record.key === undefined ? record.toString() : record.key));
    setDataModel(newData);
  };

  const handleInputChange = (value, option, key) => {
    setInputValues((prevState) => ({ ...prevState, [key]: value }));
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

  const handleSelect = (value, option, key) => {
    debugger;
    // Update the product value in the form
    form1.setFieldsValue({ [key]: { product: value } });
    setProductIds((prevState) => ({ ...prevState, [key]: option.key }));
    setSelectedProductId((prevState) => {
      const newState = { ...prevState, [key]: option.key };
      return newState;
    })

    // form1.setFieldsValue({option});
    // Set the selected UOM based on the selected product
    const matchingUom = DropDown.UOM.find((uomOption) => uomOption.UomId === option.UomId);
    setSelectedUomText((prevState) => {
      const newState = { ...prevState, [key]: matchingUom.LongName };
      return newState;
    });
    setSelectedUomId((prevState) => {
      const newState = { ...prevState, [key]: matchingUom.UomId };
      console.log(selectedUomId);
      return newState;
    });
    if (matchingUom) {
      // If a matching UomId is found, set this as the selected Uom
      setSelectedUom((prevState) => {
        const newState = { ...prevState, [key]: matchingUom.UomId };
        console.log(newState); // Log the new state
        return newState;
      });

      // Update the UOM value in the form
      form1.setFieldsValue({ [key]: { uom: matchingUom.UomId } });
    } else {
      // If no matching UomId is found, clear the selected Uom
      setSelectedUom((prevState) => {
        const newState = { ...prevState, [key]: null };
        console.log(newState); // Log the new state
        return newState;
      });

      // Clear the UOM value in the form
      form1.setFieldsValue({ [key]: { uom: null } });
    }
  };

  useEffect(() => {
    console.log(selectedUom);
    console.log(selectedUomText);// log the current state
  }, [selectedUom], [selectedUomText]); // run this effect whenever selectedUom changes

  const handleAdd = () => {
    setCounter(idCounter + 1);
    if (shouldValidate) {       
      form1
        .validateFields()
        .then(() => {
          const newRow = {
            key: idCounter.toString(),
            product: '',
            uom: '',
            quantity: '',
            rate: '',
            value: '',
            batch: '',
            replacable: ''
          };
          setData([...data, newRow]);
        })
    } else {
      const newRow = {
        key: idCounter.toString(),
        product: '',
        uom: '',
        quantity: '',
        rate: '',
        value: '',
        batch: '',
        replacable: ''
      };
      setData([...data, newRow]);
      setShouldValidate(true);
    }
  };

  const columns = [
    {
      title: 'Product',
      width: 250,
      dataIndex: 'product',
      key: 'product',
      render: (_, record) => (
        <Form.Item
          name={[record.key, 'product']}
          rules={[
            {
              required: true,
              message: 'Please input!'
            }
          ]}
          style={{ width: '100%' }}
        >
          <AutoComplete
            options={autoCompleteOptions}            
            onSearch={getPanelValue}            
            onSelect={(value, option) => handleSelect(value, option, record.key)}
            placeholder="Search for a product"
            allowClear
          />
        </Form.Item>
      )
    },
    {
      title: 'UOM',
      width: 100,
      dataIndex: 'uom',
      key: 'uom',
      render: (text, record) => (
        <Form.Item
          name={[record.key, 'uom']}
          style={{ width: '100%' }}
        >
          <Select value={selectedUom[record.key]} placeholder='Select Value'>
            {DropDown.UOM.map((option) => (
              <Select.Option key={option.UomId} value={option.UomId}>
                {option.ShortName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 100,
      key: 'quantity',
      render: (text, record) => (
        <Form.Item name={[record.key, 'quantity']}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      )
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      width: 100,
      key: 'rate',
      render: (text, record) => (
        <Form.Item name={[record.key, 'rate']}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      )
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: 100,
      key: 'value',
      render: (text, record) => (
        <Form.Item name={[record.key, 'value']} >
          <InputNumber min={0} disabled style={{ width: '100%' }} />
        </Form.Item>
      )
    },
    {
      title: 'Batch',
      dataIndex: 'batch',
      width: 100,
      key: 'batch',
      render: (text, record) => (
        <Button type='link'>Batch</Button>
      )
    },
    {
      title: 'Replacable',
      dataIndex: 'replacable',
      width: 120,
      key: 'replacable',
      render: (text, record) => (
        <Form.Item name={[record.key, 'replacable']}>
          <Checkbox></Checkbox>
        </Form.Item>
      )
    },
    {
      title: <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}></Button>,
      dataIndex: 'add',
      key: 'add',
      width: 50,
      render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}><DeleteOutlined /></Popconfirm>
      //<Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>      
    }
  ];

  const ModelAdd = () => {
    debugger;
    setCounterModel(idCounterModel + 1);
    if (shouldValidateModel) { //first time going to add row without validation, call from use useEffect      
      form2
        .validateFields()
        .then(() => {
          const newRow = {
            key: idCounterModel.toString(),
            quantity: '',
            uom: '',
            datedelivery: '',
            deliveryloc: '',
          }; // Define your new row data here
          setDataModel([...dataModel, newRow]);
        })
    } else {
      const newRow = {
        key: idCounterModel.toString(),
        quantity: '',
        uom: '',
        datedelivery: '',
        deliveryloc: '',
      };
      setDataModel([...dataModel, newRow]);
      setShouldValidateModel(true);
    }
    //setIsTableReady(false);
  };
  const columnsModel = [
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) => (
        <Form.Item style={{ width: 100 }}
          name={[record.key, 'quantity']}
          rules={[
            {
              required: true,
              message: 'Please input!'
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) {
                  return Promise.resolve();
                }
                if (value === form1.getFieldValue([recordKeys, 'poQty'])) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(`Quantity must be equal to PO Qty is ${form1.getFieldValue([recordKeys, 'poQty'])}!`));
              },
            }),
          ]}
        >
          <InputNumber min={0} style={{ width: '150%' }} allowClear />
        </Form.Item>
      )
    },
    {
      title: 'UOM',
      // width: 150,
      dataIndex: 'uom',
      key: 'uom',
      render: (text, record) => {
        const recordKeyAsNumber = parseInt(recordKeys);
        const uoms = selectedUomText[recordKeyAsNumber];
        console.log(selectedUomText);
        return (
          <Form.Item style={{ width: 100 }}
            name={[record.key, 'uom']}
            initialValue={selectedUomId[recordKeyAsNumber]}
            rules={[
              {
                required: false,
              }
            ]}
          >
            <Tag color="blue">{uoms}</Tag>
          </Form.Item>
        );
      }
    },
    {
      title: 'Date of Delivery',
      dataIndex: 'datedelivery',
      // width: 150,
      key: 'datedelivery',
      render: (text, record) => (
        <Form.Item style={{ width: 200 }}
          name={[record.key, 'datedelivery']}
          initialValue={dayjs(`${currentDate}`)}
          rules={[
            {
              required: true,
            }
          ]}
        >
          <DatePicker style={{ width: '150%' }} format="DD-MM-YYYY" /*format={dateFormat} */ />
        </Form.Item>
      )
    },
    {
      title: 'Delivery Location',
      dataIndex: 'deliveryloc',
      // width: 150,
      key: 'deliveryloc',
      render: (text, record) => (
        <Form.Item name={[record.key, 'deliveryloc']} initialValue={text} style={{ width: 200 }}>
          <Input style={{ width: '150%' }} allowClear />
        </Form.Item>
      )
    },
    {
      title: <Button type="primary" icon={<PlusOutlined />} onClick={ModelAdd}></Button>,
      dataIndex: 'add',
      key: 'add',
      width: 50,
      render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => ModelDelete(record)}><DeleteOutlined /></Popconfirm>
      //<Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>      
    }
  ]

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
              Create Opening Stock
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
            Date: dayjs(),
          }}          
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
            <Col className="gutter-row" span={6}>
              <Form.Item
                label="Receiving Store"
                name="ReceivingStore"
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
            <Col className="gutter-row" span={6}>
              <Form.Item label="Date" name="Date">
                <DatePicker style={{ width: '100%' }} disabled format='DD-MM-YYYY' />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item label="Openng Stock Status" name="OpenngStockStatus">
                <Select allowClear placeholder='Select Value'>                  
                    <Select.Option key='Draft' value='Draft'></Select.Option>
                    <Select.Option key='Finalize' value='Finalize'></Select.Option>                  
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item name="CheckSubmit" style={{ marginTop: '30px' }}>
                <Checkbox>Submit</Checkbox>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item label="Remarks" name="Remarks">
                <TextArea autoSize />
              </Form.Item>
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
            <Col style={{ marginRight: '10px' }}>
              <Form.Item>
                <Button type="primary">
                  Import
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
          <Table columns={columns} dataSource={data} scroll={{ x: 0 }} />
        </Form>
        <ConfigProvider
          theme={{
            token: {
              zIndexPopupBase: 3000
            }
          }}>
          <Modal
            title="Basic Modal"
            onOk={onOkModal}
            onCancel={onCancelModel}
            width={1000}
            open={isModalOpen}
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
              onFinish={onFinishModel}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form2}
            >
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item
                    label="Product"
                    name="Product"
                    initialValue={selectedProductId[recordKeys]}
                    style={{ marginLeft: '10px' }}
                    rules={[
                      {
                        required: false,
                      }
                    ]}
                  >
                    <Tag color="blue">{form1.getFieldValue([recordKeys, 'product'])}</Tag>
                  </Form.Item>
                </div>
              </Col>
              <Table columns={columnsModel} dataSource={dataModel} />
            </Form>
          </Modal>
        </ConfigProvider>
      </div>
    </Layout >
  );
}

export default CreateOpeningStock;
