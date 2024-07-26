import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import Select from 'antd/es/select';
import { ConfigProvider, Typography, Checkbox, Tag, Modal, Popconfirm, Spin, Col, Divider, Row, AutoComplete, message } from 'antd';
import Input from 'antd/es/input';
import Form from 'antd/es/form';
import { DatePicker } from 'antd';
import Layout from 'antd/es/layout/layout';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { Table, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useLocation } from "react-router-dom";
import { urlCreatePurchaseOrder, urlSearchUHID, urlGetLastEncounter, urlAutocompleteProduct, urlAddNewPatientConsumption, urlPatientConsumptionEdit, urlGetProductDetailsById, urlPatientConsuptionShowBatchDetails } from "../../../endpoints.js";
import { find } from 'lodash';

const PatientConsumption = () => {
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
  let [counterModal, setCounterModal] = useState(0);
  const issueId = location.state.IssueId;

  const initialDataSource =
    issueId === 0
      ? [
        {
          key: 0,
          ProductName: '',
          ProductId: '',
          UomId: '',
          IssueQty: '',
          AvlatIssueQty: '',
          ReasonforConsumption: '',
          Batch: '',
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
  const [dataModal, setDataModal] = useState([]);
  //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');
  const [productDetails, setProductDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [autoCompleteProduct, setAutoCompleteProduct] = useState([]);
  const [encounter, setEncounter] = useState([])
  const [isDisabled, setIsDisable] = useState(true);
  const [batchDetails, setBatchDetails] = useState([])
  const fields = form1.getFieldsValue();
  const [uhId, setUhId] = useState();
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isTable, setIsTable] = useState(false);
  const [issueStatus, setIssueStatus] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Save')
  // const tableRef = useRef(null);

  useEffect(() => {
    debugger
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
    if (issueId > 0) {
      setButtonTitle('Update')
      customAxios.get(`${urlPatientConsumptionEdit}?IssueId=${issueId}`).then((response) => {
        const apiData = response.data.data;
        if (apiData.newIndentIssueModel != null && apiData.newIndentIssueModel.length > 0) {
          const products = apiData.newIndentIssueModel.map((item, index) => ({
            ...item,
            key: index,
            AvlQtyAtIssue: item.StockBalanceQty,
            index: index + 1
          }))
          setData(products)
          setCounter(products.length)
          setIsTable(true)
          const formdata = apiData.newPatientIssueModel
          form1.setFieldsValue({
            IssueStore: formdata.IssueingStoreId,
            // IndentType: formdata.IndentType,
            Remarks: formdata.Remarks,
            IndentNumber: formdata.IndentNumber,
            Status: formdata.IssueStatus == 'Created' || formdata.IssueStatus == 'Pending' ? undefined : formdata.IssueStatus,
            UHID: formdata.UhId,
            Name: formdata.PatientName,
            Encounter: formdata.Encounter,
            EncounterId: formdata.EncounterId,
            PatientId: formdata.PatientId,
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

  const handleSelect = (value, option) => {
    form1.setFieldsValue({ Name: option.PatientName });
    form1.setFieldsValue({ UHID: option.value });
    customAxios.get(`${urlGetLastEncounter}?Uhid=${option.key}`).then((response) => {
      const apiData = response.data.data;
      if (apiData.length > 0) {
        setEncounter(apiData);
        form1.setFieldsValue({ Encounter: apiData[0].EncounterId });
        form1.setFieldsValue({ PatientId: option.PatientId });
      } else {
        setEncounter([]);
        form1.setFieldsValue({ Encounter: '' });
        form1.setFieldsValue({ PatientId: '' });
      }
    });
  }

  const onOkModal = () => {
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
    // for (let i = 0; i < counterModal; i++) {
    //   if (values[i] != null) {
    //     dataModal[i].IssueQty = values[i].IssueQty
    //   }
    // }
    // const deliveries = [];
    // for (let i = 0; i < counterModal; i++) {
    //   const delivery = {
    //     ProductId: values.Product,
    //     DeliveryQuantity: values[i].quantity,
    //     UomId: values[i].uom,
    //     DelDate: values.FromDate === null ? '' : (values[i].datedelivery.$D.toString().padStart(2, '0') + '-' + (values[i].datedelivery.$M + 1).toString().padStart(2, '0') + '-' + values[i].datedelivery.$y).toString(),
    //     DeliveryLocation: values[i].deliveryloc === undefined ? null : values[i].deliveryloc,
    //   }
    //   deliveries.push(delivery);
    //   setDelivery(deliveries);
    //   setIsModalOpen(false);
    // }
    setIsModalOpen(false)
  }

  const onCancelModel = () => {
    debugger;
    // setDataModal([])
    form3.resetFields();
    setIsModalOpen(false);
  }
  const handleCancel = () => {
    const url = '/PatientConsumption';
    navigate(url);
  };

  // const ModelOpen = (value, record) => {
  //   debugger;
  //   form1
  //     .validateFields()
  //     .then(() => {
  //       // If validation succeeds, submit the form
  //       setRecordKeys(record.key)
  //       setIsModalOpen(true);
  //     })
  //     .catch((error) => {
  //       console.log('Validation error:', error);
  //     });
  // }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleToPurchaseOrder = () => {
    const url = '/PatientConsumption';
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
    debugger;
    const newData = dataModal.filter((item) => item.key !== (record.key === undefined ? record.toString() : record.key));
    setDataModal(newData);
  };

  const handleOnFinish = async (values) => {
    debugger;
    const form2data = form2.getFieldsValue()
    data
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
    const products = [];
    for (let i = 0; i <= counter; i++) {
      if (form2data[i] !== undefined) {
        const product = {
          ProductId: form2data[i].ProductId,
          UomId: form2data[i].UomId,
          IssueQty: form2data[i].IssueQty,
          Remarks: form2data[i].ReasonforConsumption,
          PatientIssueLineId: form2data[i].PatientIssueLineId ? form2data[i].PatientIssueLineId : 0,
          ActiveFlag: data[i].ActiveFlag
        }
        products.push(product);
      }
    }

    const PatientConsumption = {
      IssueDateString: values.IssueDate ? values.IssueDate.format("DD-MM-YYYY") : '',
      FacilityId: 1,
      PatientId: values.PatientId,
      EncounterId: values.EncounterId ? values.EncounterId : values.Encounter,
      IssueId: values.IssueId ? values.IssueId : 0,
      IndentCategory: 'PatientConsumption',
      IssueStatus: !issueStatus ? 'Created' : values.Status,
      IssueingStoreId: values.IssueStore,
      Remarks: values.Remarks,
    }
    const postData = {
      newIndentModel: PatientConsumption,
      IndentDetails: products,
      Batch: dataModal
    }
    try {
      const response = await customAxios.post(urlAddNewPatientConsumption, postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      // Handle error      
    }
    handleCancel()
  };

  const handleAdd = async () => {
    setAutoCompleteProduct([])
    // const fieldsToValidate = data.map(record => [record.key, 'ProductName']);
    await form2.validateFields();
    setData([
      ...data,
      {
        key: counter,
        ProductName: '',
        ProductId: '',
        UomId: '',
        IssueQty: '',
        AvlatIssueQty: '',
        ReasonforConsumption: '',
        Batch: '',
        ActiveFlag: true,
      },
    ]);
    setCounter(counter + 1);
  };

  const OpenBatch = async (record) => {
    debugger
    await form1.validateFields()
    await form2.validateFields()
    setProductDetails(record)
    const batch = {
      IssueQty: record.IssueQty,
      ProductId: record.ProductId,
      // IssueId: record.IssueingStoreId,
      StoreId: form1.getFieldValue('IssueStore')
    }
    const post1 = {
      newIndentModel: batch,
      Batch: dataModal
    }
    try {
      const response = await customAxios.post(urlPatientConsuptionShowBatchDetails, post1, {
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
        setDataModal(batchs)
        setCounterModal(batchs.length)
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
        setDataModal(batchs);
        setCounterModal(batchs.length)
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

  const getPanelValue1 = (value, key) => {
    debugger
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
            ProductName: option.value,
            UomId: option.UomId,
            ProductId: option.key,
            AvlQtyAtIssue: qty
          };
          return updatedItem;
        }
        return item;
      });
      setData(newData);
      form2.setFieldsValue({ [key]: { AvlQtyAtIssue: qty } });
    });
  }

  const validateGreaterValue = (record, value) => {
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
    // record.IssueQty = value
    if (value != undefined) {
      if (record.AvlQtyAtIssue >= value) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('Not Greater than Avl Issue Qty'))
    }
    return Promise.resolve()
  }

  const columns = [
    {
      title: 'Product',
      width: 450,
      dataIndex: 'ProductName',
      key: 'ProductName',
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, 'ProductName']}
            rules={[
              {
                required: true,
                message: 'Please input!'
              }
            ]}
            initialValue={record.ProductName}
          >
            <AutoComplete style={{ width: '100%' }} disabled={!!record.IssueId}
              options={autoCompleteProduct}
              onSearch={(value) => getPanelValue1(value, record.key)}
              onSelect={(value, option) => handleSelect1(value, option, record.key)}
              placeholder="Search for a product"
              allowClear
            />
          </Form.Item>
          <Form.Item name={[record.key, 'ProductId']} hidden initialValue={record.ProductId}>
            <Input></Input>
          </Form.Item >
          <Form.Item name={[record.key, 'PatientIssueLineId']} hidden initialValue={record.PatientIssueLineId}>
            <Input></Input>
          </Form.Item>
        </>
      )
    },
    {
      title: 'UOM',
      width: 150,
      dataIndex: 'UomId',
      key: 'UomId',
      render: (text, record) => (
        <Form.Item name={[record.key, 'UomId']}
          initialValue={record.UomId}
        >
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
      // width: 100,
      key: 'IssueQty',
      render: (text, record) => (
        <Form.Item
          name={[record.key, 'IssueQty']}
          initialValue={record.IssueQty}
          rules={[
            {
              required: true,
              message: 'Please input!'
            },
            {
              validator: (_, value) => validateGreaterValue(record, value)
            }
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      )
    },
    {
      title: 'Avl Qty At Issue',
      dataIndex: 'AvlQtyAtIssue',
      // width: 100,
      key: 'AvlQtyAtIssue',
      render: (text, record) => (
        <Form.Item name={[record.key, 'AvlQtyAtIssue']} initialValue={record.AvlQtyAtIssue}>
          <InputNumber min={0} style={{ width: '100%' }} disabled />
        </Form.Item>
      )
    },
    {
      title: 'Reason for Consumption',
      dataIndex: 'ReasonforConsumption',
      // width: 100,
      key: 'ReasonforConsumption',
      render: (text, record) => (
        <Form.Item
          name={[record.key, 'ReasonforConsumption']}
          initialValue={text}
        >
          <Input allowClear style={{ width: '100%' }} />
        </Form.Item>
      )
    },
    {
      title: 'Batch Details',
      dataIndex: 'Batch',
      // width: 100,
      key: 'Batch',
      render: (text, record) => (
        <Form.Item>
          <Button type='link' onClick={() => OpenBatch(record)}>Batch</Button>
        </Form.Item>
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

  const ModelAdd = async () => {
    debugger;
    await form3.validateFields();
    setDataModal([
      ...dataModal,
      {
        key: counterModal,
        BatchNo: '',
        Quantity: '',
        AvlQty: '',
        Uom: '',
        EXPDate: '',
        Rate: '',
        Amount: '',
        StockLocator: '',
        ActiveFlag: true,
      },
    ]);
    setCounterModal(counterModal + 1);
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

  const validateEqualValue = (record, value) => {
    debugger
    const newData = dataModal.map((item => {
      if (record.key == item.key) {
        return {
          ...item,
          IssueQty: value
        }
      }
    }))
    setDataModal(newData)
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

  const columnsModel = [
    {
      title: 'Batch No',
      dataIndex: 'BatchNo',
      key: 'BatchNo',
      width: 100,
      render: (_, record) => (
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
          </Form.Item >
          <Form.Item name={[record.key, "BatchId"]} initialValue={record.StockId} hidden>
            <Input />
          </Form.Item>
          <Form.Item name={[record.key, "IssueBatchId"]} initialValue={record.StockId} hidden>
            <Input />
          </Form.Item>
        </>
      )
    },
    {
      title: 'Quantity',
      // width: 150,
      dataIndex: 'IssueQty',
      key: 'IssueQty',
      render: (text, record) => {
        return (
          <Form.Item
            name={[record.key, 'IssueQty']}
            rules={[
              {
                required: true,
                message: 'please input'
              },
              {
                validator: (_, value) => validateEqualValue(record, value)
              }
            ]}
            initialValue={record.IssueQty}
          >
            <InputNumber allowClear />
          </Form.Item>
        );
      }
    },
    {
      title: 'Avl Qty',
      // width: 150,
      dataIndex: 'AvlQty',
      key: 'AvlQty',
      render: (text, record) => {
        return (
          <Form.Item name={[record.key, 'AvlQty']} initialValue={record.AvlQty}>
            <InputNumber style={{ width: 100 }} allowClear disabled />
          </Form.Item>
        );
      }
    },
    {
      title: 'UOM',
      // width: 150,
      dataIndex: 'Uom',
      key: 'Uom',
      render: (text, record) => {
        return (
          <Form.Item name={[record.key, 'Uom']} style={{ width: 110 }}>
            {record.Uom}
          </Form.Item>
        );
      }
    },
    {
      title: 'EXP Date',
      dataIndex: 'EXPDate',
      // width: 150,
      key: 'EXPDate',
      render: (text, record) => (
        <Form.Item name={[record.key, 'EXPDate']} initialValue={record.EXPDate == '' ? undefined : DateBindtoDatepicker(record.EXPDate)}
          rules={[{
            required: true,
            message: 'please input'
          },
          {
            validator: (_, value) => validateExpiryValue(record, value)
          }
          ]}
        >
          <DatePicker disabled style={{ width: 100 }} format="MMMM YYYY" />
        </Form.Item>
      )
    },
    {
      title: 'Rate',
      dataIndex: 'IssueRate',
      // width: 150,
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
      // width: 150,
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
      // width: 150,
      key: 'StockLocator',
      render: (text, record) => (
        <Form.Item name={[record.key, 'StockLocator']} >
          <Input style={{ width: 100 }} disabled />
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

  function isExpired(dateString) {
    if (new Date() > new Date(dateString)) {
      return false
    }
    else {
      return true
    }
  }

  const DateBindtoDatepicker = (value) => {
    const isoDateString = value;
    const dateValue = new Date(isoDateString);
    const formattedDate = dayjs(dateValue).format("DD-MM-YYYY");
    return dayjs(formattedDate, "DD-MM-YYYY");
  };

  const handleStoreChange = (value) => {
    debugger
    form2.resetFields();
    setData(initialDataSource);
    if (value !== undefined) {
      setIsTable(true);
    } else {
      setIsTable(false);
    }
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

  const SubmitChanged = (event) => {
    setIssueStatus(event.target.checked)
  }

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
              Create Patient Consumption
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
            IssueDate: dayjs(),
          }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
            <Col className="gutter-row" span={6}>
              <Form.Item
                label="Issue Store"
                name="IssueStore"
                rules={[
                  {
                    required: true,
                    message: 'Please input!'
                  }
                ]}
              >
                <Select allowClear placeholder='Select Value' onChange={handleStoreChange} disabled={!!issueId}>
                  {DropDown.StoreDetails.map((option) => (
                    <Select.Option key={option.StoreId} value={option.StoreId}>
                      {option.LongName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item hidden name="IssueId">
                <Input />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item
                label="Consumption Date"
                name="IssueDate"
              >
                <DatePicker disabled style={{ width: '100%' }} format='DD-MM-YYYY' />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Issue Owner" name="IssueOwner">
                  <Input style={{ width: '100%' }} allowClear />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={3}>
              <div>
                <Form.Item label="Status" name="Status"
                  rules={[
                    {
                      required: issueStatus,
                      message: 'please input'
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
            <Col className="gutter-row" span={3}>
              <div>
                <Form.Item name="SubmitCheck" style={{ marginTop: '30px' }} valuePropName='checked'>
                  <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="UHID" name="UHID"
                  rules={[
                    {
                      required: true,
                      message: 'Please input!'
                    }
                  ]}
                >
                  <AutoComplete style={{ width: '100%' }} disabled={!!issueId}
                    options={autoCompleteOptions}
                    onSearch={(value) => GetUHID(value)}
                    onSelect={(value, option) => handleSelect(value, option)}
                    value={uhId}
                    allowClear
                  />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Name" name="Name">
                  <Input style={{ width: '100%' }} disabled />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Encounter" name="Encounter">
                  <Select disabled={isDisabled}>
                    {encounter.map((option) => (
                      <Select.Option key={option.EncounterId} value={option.EncounterId}>{option.GeneratedEncounterId}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="EncounterId" hidden>
                  <Input></Input>
                </Form.Item>
                <Form.Item name="PatientId" hidden>
                  <Input></Input>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={12}>
              <div>
                <Form.Item label="Remarks" name="Remarks">
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
                <Button type="primary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ marginTop: '0' }}></Divider>
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
          {isTable && (
            <Table columns={columns} dataSource={data.filter(item => item.ActiveFlag != false)} scroll={{ x: 0 }} />
          )}
        </Form>
        <ConfigProvider
          theme={{
            token: {
              zIndexPopupBase: 3000
            }
          }}>
          <Modal
            title="Product Batch Details"
            onOk={onOkModal}
            onCancel={onCancelModel}
            width={1000}
            open={isModalOpen}
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
              onFinish={onFinishModel}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form3}
            >
              <Row>
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
              <Table columns={columnsModel} dataSource={dataModal} />
            </Form>
          </Modal>
        </ConfigProvider>
      </div>
    </Layout >
  );
}

export default PatientConsumption;
