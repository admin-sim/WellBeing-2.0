import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder, urlStoreConsumptionEdit, urlAutocompleteProduct, urlGetProductDetailsById, urlStoreConsumptionShowBatchDetails, urlAddNewConsumption } from '../../../endpoints';
import Select from 'antd/es/select';
import { Tag, Typography, Checkbox, message, Modal, Popconfirm, Spin, Col, Card, Row, AutoComplete } from 'antd';
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
import { useLocation } from "react-router-dom";
import CustomTable from "../../components/customTable/index.jsx";
import PageHeader from "../../components/PageHeader/index.jsx";
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

  const location = useLocation();
  let [counter, setCounter] = useState(1);
  let [counterModel, setCounterModel] = useState(0);
  const StoreConsupmtionId = location.state.StoreConsupmtionId;


  const initialBatchDataSource =
    StoreConsupmtionId === 0
      ? [
        {
          key: 0,
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
          key: 0,
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
  const navigate = useNavigate();
  const [data, setData] = useState(initialDataSource);
  //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');
  const [productOptions, setProductOptions] = useState(null);
  const [selectedUom, setSelectedUom] = useState({});
  const [batchDetails, setBatchDetails] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [dataModal, setDataModal] = useState([]);
  const [selectedUomText, setSelectedUomText] = useState({});
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isTable, setIsTable] = useState(false);
  const [issueStatus, setIssueStatus] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Save')
  // const tableRef = useRef(null);

  useEffect(() => {
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
    if (StoreConsupmtionId > 0) {
      debugger
      setButtonTitle('Update')
      customAxios.get(`${urlStoreConsumptionEdit}?StoreConsumptionId=${StoreConsupmtionId}`).then((response) => {
        const apiData = response.data.data;
        if (apiData.newIndentIssueModel != null && apiData.newIndentIssueModel.length > 0) {
          const products = apiData.newIndentIssueModel.map((item, index) => ({
            ...item,
            key: index,
            Quantity: item.BalanceQty,
            ReasonforConsumption: item.Remarks,
            index: index + 1
          }))
          setData(products)
          setCounter(products.length)
          setIsTable(true)
          const formdata = apiData.newPatientIssueModel
          form1.setFieldsValue({
            IssuingStore: formdata.IssueingStoreId,
            Remarks: formdata.Remarks,
            IssueId: formdata.IssueId,
            ConsumptionStatus: formdata.IssueStatus == 'Created' || formdata.IssueStatus == 'Pending' ? undefined : formdata.IssueStatus,
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

  const handleSaveModal = () => {
    debugger;
    form3
      .validateFields()
      .then(() => {
        form3.submit();
      })
      .catch((error) => {
        console.log('Validation error:', error);
      });
  }

  const onFinishModel = (values) => {
    debugger;
    const total = dataModal.reduce((sum, item) => sum + item.IssueQty, 0)
    if (productDetails.IssueQty != total) {
      message.warning('Issue Qty is equals to Issued Qty')
      return false
    }
    setIsModalOpen(false)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleToStoreConsumption = () => {
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
    const newData = dataModal.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setDataModal(newData);
  };

  const handleOnFinish = async (values) => {
    debugger;
    const form2data = form2.getFieldsValue()
    if (dataModal.length == 0) {
      message.warning('Please Add Batch Details!')
      return false
    }
    for (const item of data) {
      const match = dataModal.find(item1 => item.ProductId === item1.ProductId && item.IssueQty === item1.IssueQty);
      if (!match) {
        message.warning('Please Add Batch Details!');
        return false;
      }
    }

    setIsSearchLoading(true);
    const products = [];
    for (let i = 0; i <= data.length; i++) {
      if (data[i] !== undefined) {
        const product = {
          ProductId: data[i].ProductId,
          UomId: data[i].UomId,
          IssueQty: data[i].IssueQty,
          Remarks: form2data[i].ReasonforConsumption,
          PatientIssueLineId: data[i].PatientIssueLineId
        }
        products.push(product);
      }
    }

    const StoreConsumption = {
      IssueingStoreId: values.IssuingStore,
      IssueDateString: values.ConsumptionDate ? values.ConsumptionDate.format("DD-MM-YYYY") : '',
      IssueStatus: issueStatus ? values.ConsumptionStatus : 'Created',
      Remarks: values.Remarks,
      ReceiptRate: 0,
      IssueId: values.IssueId ? values.IssueId : 0
    }
    const postData = {
      newIndentModel: StoreConsumption,
      IndentDetails: products,
      Batch: dataModal
    }
    try {
      const response = await customAxios.post(urlAddNewConsumption, postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      handleToStoreConsumption()
    } catch (error) {
      // Handle error      
    }
    setIsSearchLoading(false);
  };

  const handleSelect = (value, option, column, record) => {
    debugger;
    customAxios
      .get(`${urlGetProductDetailsById}?ProductId=${option.key}`)
      .then((response) => {
        const apiData = response.data.data;
        const store = form1.getFieldValue('IssuingStore')
        let qty = 0;
        apiData.Stock.forEach(value => {
          if (value.StoreId === store) {
            qty += value.Quantity;
          }
        })
        form2.setFieldsValue({ [record.key]: { ProductId: option.key } });
        form2.setFieldsValue({ [record.key]: { Quantity: qty } });
        form2.setFieldsValue({ [record.key]: { UomId: option.UomId } });
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
    if (searchText) {
      const response = await customAxios.get(`${urlAutocompleteProduct}?Product=${searchText}`);
      const apiData = response.data.data;

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
    const newData = data.map((item => {
      if (record.key == item.key) {
        return {
          ...item,
          IssueQty: value
        }
      }
    }))
    setData(newData)
    if (value <= record.Quantity) {
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
            initialValue={record.ProductName}
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
              disabled={!!record.IssueId}
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
            name={[record.key, "PatientIssueLineId"]}
            hidden
            initialValue={record.PatientIssueLineId}
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
          <Select disabled>
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
          <InputNumber style={{ width: '100%' }} disabled />
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
          <Input style={{ width: '100%' }} />
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
    // {
    //   title: <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}></Button>,
    //   dataIndex: 'add',
    //   key: 'add',
    //   width: 50,
    //   render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}><DeleteOutlined /></Popconfirm>
    // }
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false)
    form3.resetFields()
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
      // IssueId: record.IssueingStoreId,
      StoreId: form1.getFieldValue('IssuingStore')
    }
    const post1 = {
      newIndentModel: batch,
      Batch: dataModal
    }
    try {
      const response = await customAxios.post(urlStoreConsumptionShowBatchDetails, post1, {
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
                AvlQuantity: item.BalanceQty,
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
        setDataModal(batchs)
        setCounterModel(batchs.length)
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
                AvlQuantity: item.PendingQty,
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
        setDataModal(batchs);
        setCounterModel(batchs.length)
      }
      const batchs = ApiData.BatchDetails.map((item, index) => {
        return {
          ...item,
          key: index,
          index: index + 1
        }
      })
      setBatchDetails(batchs)
      // setCounter(ApiData.Batch.length > 0 ? ApiData.Batch.length + 1 : ApiData.BatchDetails.length + 1)
    } catch (error) {

    }
    setIsModalOpen(true)
  }

  const ModelAdd = async () => {
    debugger;
    await form3.validateFields();
    setDataModal([
      ...dataModal,
      {
        key: counterModel,
        BatchNo: '',
        IssueQty: '',
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
            <Select allowClear onChange={(record) => BatchSelect(record)} style={{ width: 100 }}>
              {batchDetails.map((option) => (
                <Select.Option key={option.BatchNo} value={option.BatchNo}>{option.BatchNo}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item hidden name={[record.key, 'IssueBatchId']} initialValue={record.IssueBatchId}>
            <Input />
          </Form.Item>
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
        <Form.Item name={[record.key, 'AvlQuantity']} initialValue={record.AvlQuantity}>
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
        <Form.Item name={[record.key, 'UomId']}>
          <Tag color="#7C00FE">{record.Uom}</Tag>
          {/* {record.Uom} */}
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
          <Input style={{ width: 100 }} disabled allowClear />
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
    const IsExist = dataModal.filter((item) => item.BatchNo == record)
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
        {/* <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
              Create Store Consumption
            </Title>
          </Col>
          <Col offset={6} span={2}>
            <Button icon={<LeftOutlined />} style={{ marginBottom: 0 }} onClick={handleToStoreConsumption}>
              Back
            </Button>
          </Col>
        </Row> */}
        <PageHeader
          title={"Create Store Consumption"}
          buttonLabel="Back"
          buttonIcon={<LeftOutlined />}
          onButtonClick={handleToStoreConsumption}
        />
        <Card>
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
                  <Form.Item name="IssueId" hidden>
                    <Input />
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
                    {buttonTitle}
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" onClick={handleToStoreConsumption}>
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
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
            {isTable &&
              <CustomTable
                dataSource={data.filter((item) => item.ActiveFlag !== false)}
                columns={columns}
                isFilter={false}
                // actionColumn={false}
                bordered
                actionColumnName={<Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                ></Button>}
                onDelete={handleDelete}
              />
              //  <Table
              //   bordered
              //   columns={columns}
              //   size="small"
              //   dataSource={data.filter((item) => item.ActiveFlag !== false)}
              //   locale={{ emptyText: "nodata " }}
              //   scroll={{
              //     x: 0,
              //   }}
              // />
            }
          </Form>
        </Card>
        <Modal
          width={1000}
          maskClosable={false}
          title="Product Batch Details"
          open={isModalOpen}
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
                  <Tag color="#1890ff">Product: {productDetails.ProductName}</Tag>
                  {/* <span>
                    Product :{" "}
                    <b style={{ color: "#1677ff" }}>{productDetails.ProductName}</b>{" "}
                  </span> */}
                </div>
              </Col>
              <Col className="gutter-row" span={12}>
                <div>
                  <Tag color="#52c41a">Product: {productDetails.IssueQty}</Tag>
                  {/* <span>
                    Issued Quantity  :{" "}
                    <b style={{ color: "#1677ff" }}>{productDetails.IssueQty}</b>{" "}
                  </span> */}
                </div>
              </Col>
            </Row>
            <Table
              columns={columnsModel}
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

export default CreateStoreConsumption;
