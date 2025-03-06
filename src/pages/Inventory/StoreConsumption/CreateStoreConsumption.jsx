import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import {
  urlCreatePurchaseOrder,
  urlStoreConsumptionEdit,
  urlAutocompleteProduct,
  urlGetProductDetailsById,
  urlStoreConsumptionShowBatchDetails,
  urlAddNewConsumption
} from '../../../../endpoints.js';
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
import { v4 as uuidv4 } from "uuid";
import customAxios from '../../../components/customAxios/customAxios.jsx';
import PageHeader from '../../../components/PageHeader/index.jsx';
import CustomTable from '../../../components/customTable/index.jsx';
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
          key: uuidv4(),
          ProductName: "",
          PoLineId: 0,
          UomId: "",
          IssueQty: '',
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
  const [loading, setLoading] = useState(false);
  const [batchDetails, setBatchDetails] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [dataModal, setDataModal] = useState([]);
  // const [isSearchLoading, setIsSearchLoading] = useState(false);
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
      setLoading(true)
      setButtonTitle('Update')
      customAxios.get(`${urlStoreConsumptionEdit}?StoreConsumptionId=${StoreConsupmtionId}`).then((response) => {
        const apiData = response.data.data;
        if (apiData.newIndentIssueModel != null && apiData.newIndentIssueModel.length > 0) {
          const products = apiData.newIndentIssueModel.map((item, index) => ({
            ...item,
            key: uuidv4(),
            Quantity: item.BalanceQty,
            ReasonforConsumption: item.Remarks,
            // index: index + 1
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
        setLoading(false)
      })
    }
  }, []);

  const handleSaveModal = () => {
    form3.submit();
  }

  const onFinishModel = async () => {
    await form3.validateFields();
    const values = form3.getFieldsValue();
    // Extract the values from the object as an array
    const valueArray = Object.values(values);

    const activeItems = dataModal.filter((item) => item.ActiveFlag);
    const stockIdCounts = activeItems.reduce((acc, item) => {
      acc[item.StockId] = (acc[item.StockId] || 0) + 1;
      return acc;
    }, {});

    const duplicateStockIds = Object.keys(stockIdCounts).filter(
      (stockId) => stockIdCounts[stockId] > 1
    );

    if (duplicateStockIds.length > 0) {
      message.error("Same Batch Number should not be selected.");
      return false;
    }
    // Sum the IssueQty values
    const totalIssueQty = valueArray.reduce((sum, item) => {
      // Ensure IssueQty is a number
      const issueQty = Number(item.IssueQty);
      return sum + (isNaN(issueQty) ? 0 : issueQty);
    }, 0);

    if (parseInt(totalIssueQty) == productDetails.IssueQty) {
      const filteredDataModel = dataModal
        .filter((item) => {
          if (item.IssueBatchId > 0) {
            return true; // include all items with IssueBatchId > 0
          } else {
            return item.ActiveFlag === true; // only include items with IssueBatchId = 0 or null and ActiveFlag = true
          }
        })
        .map((item) => {
          // Append ProductId only if it's an empty string
          if (item.ProductId === "") {
            return { ...item, ProductId: batchDetails.ProductId };
          }
          return item;
        });
      setDataModal(filteredDataModel);
      setIsModalOpen(false);
    } else {
      message.warning("Total Quantity should be equal to Issued Quantity");
    }
    // const form3data = form3.getFieldsValue()
    // // const total = Object.values(form3data).reduce((sum, item) => sum + item.IssueQty, 0)
    // const total = Object.values(form3data).reduce((sum, item) => sum + (item.IssueQty || 0), 0);
    // if (productDetails.IssueQty != total) {
    //   message.warning('Quantity is equals to Issued Qty')
    //   return false
    // }
    // setIsModalOpen(false)
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

  const checkActiveBatches = (products, batches) => {
    const allActiveProductsHaveActiveBatch = products.every((product) =>
      batches.some(
        (batch) => batch.ProductId === product.ProductId && batch.ActiveFlag
      )
    );
    return {
      allActiveProductsHaveActiveBatch,
    };
  };

  const handleOnFinish = async (values) => {
    setLoading(true)
    await form2.validateFields()
    const form2data = form2.getFieldsValue()
    const form2new = Object.values(form2data)
    const products = [];
    data.forEach((item) => {
      if (item !== undefined) {
        const product = {
          Remarks: item.ReasonforConsumption,
          ProductId: item.ProductId,
          UomId: item.UomId,
          // RequestQty: item.RequestQty,
          IssueQty: item.IssueQty,
          ActiveFlag: item.ActiveFlag,
          IndentLineId: item.IndentLineId,
          PatientIssueLineId: item.PatientIssueLineId
            ? item.PatientIssueLineId
            : 0,
          StockId: item.StockId,
          PendingQty:
            values.IssueStatus == "Finalize"
              ? item.IssueQty - item.PendingQty
              : item.PendingQty,
        };
        products.push(product);
      }
    })
    if (products.length === 0) {
      message.warning("Please Add Products")
      setLoading(false)
      return false;
    }

    const result = checkActiveBatches(products, dataModal);
    if (!result.allActiveProductsHaveActiveBatch) {
      message.warning("Please Add BatchDeatils");
      setLoading(false)
      return false;
    }
    const sumItems = (items, key) =>
      items.reduce((sum, item) => sum + parseInt(item[key] || 0, 10), 0);

    const activeItems = dataModal.filter((item) => item.ActiveFlag);

    const totalReceivedQty = sumItems(products, "IssueQty");
    const totalBatchQuantity = sumItems(activeItems, "IssueQty");

    if (totalReceivedQty !== totalBatchQuantity) {
      message.warning("Please enter valid batch details..");
      setLoading(false)
      return false;
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
        key: uuidv4(),
        ProductName: "",
        PoLineId: 0,
        UomId: "",
        IssueQty: "",
        AvailableQtyatIssue: "",
        ReasonforConsumption: "",
        ActiveFlag: true,
      },
    ]);
    // setCounter(counter + 1);
  };

  const handleSearch = async (searchText, key) => {
    if (searchText === "") {
      form1.setFieldsValue({ [key]: { uom: "" } });
      form1.setFieldsValue({ [key]: { RequestQty: "" } });
      form1.setFieldsValue({ [key]: { Favourite: false } });
      form1.setFieldsValue({ [key]: { IssuingStoreStock: "" } });
    }
    try {
      customAxios
        .get(`${urlAutocompleteProduct}?Product=${searchText}`)
        .then((response) => {
          const apiData = response.data.data;
          const filteredApiData = apiData.filter(
            (apiItem) =>
              !data.some(
                (option) =>
                  option.ProductId === apiItem.ProductId && option.ActiveFlag
              )
          );
          const newOptions = filteredApiData.map((item) => ({
            value: item.LongName,
            key: item.ProductId,
            UomId: item.UOMPrimaryUOM,
          }));
          setProductOptions(newOptions);
        });
    } catch (error) {
      // Handle the error as needed
    }
    // if (searchText) {
    //   const response = await customAxios.get(`${urlAutocompleteProduct}?Product=${searchText}`);
    //   const apiData = response.data.data;

    //   const filteredApiData = apiData.filter(apiItem =>
    //     !data.some(option => option.ProductId === apiItem.ProductId)
    //   );

    //   const newOptions = filteredApiData.map((item) => ({
    //     value: item.LongName,
    //     key: item.ProductId,
    //     UomId: item.UOMPrimaryUOM,
    //   }));
    //   setProductOptions(newOptions);
    // }
  }

  const validateEqualValue = (record, value) => {
    const newData = data.map((item => {
      if (record.key == item.key) {
        return {
          ...item,
          IssueQty: value
        }
      }
      return item
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
              onSearch={(value) => handleSearch(value, record.key)}
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
        <Form.Item name={[record.key, 'Quantity']} initialValue={text}
          rules={[
            {
              required: true,
              type: "number",
              min: 1,
              message: 'value must greater than 0!'
            }
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={0} disabled />
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
    await form1.validateFields()
    await form2.validateFields()

    const form2Values = form2.getFieldsValue();
    const form1Values = form1.getFieldsValue();

    // Update the record with the form value
    record.IssueQty = form2Values[record.key].IssueQty;
    setProductDetails(record);
    // setBatchRecord(record);

    // Construct the product object
    const product = {
      IssueQty: record.IssueQty,
      ProductId: record.ProductId,
      IssueId: form1Values.IssuingStore,
      StoreId: form1Values.IssuingStore,
    };

    // Filter dataModel based on ProductId and ActiveFlag
    const filteredDataModel = dataModal.filter(
      (item) => item.ProductId === record.ProductId
      // &&
      //   item.ActiveFlag === true &&
      //   item.IssueBatchId > 0
    );

    const post1 = {
      newIndentModel: product,
      Batch: filteredDataModel
    }
    try {
      const response = await customAxios.post(urlStoreConsumptionShowBatchDetails, post1, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const ApiData = response.data.data;
      setBatchDetails(ApiData.BatchDetails);
      if (ApiData.Batch.length > 0) {
        const batch = ApiData.Batch.map((item, index) => {
          if (
            item.ProductId ===
            ApiData.ProductDefinitionModel.ProductDefinitionId &&
            item.ActiveFlag !== false
          ) {
            if (item.IssueBatchId !== 0) {
              return {
                ...item,
                key: uuidv4(),
                LineAmount: item.IssueRate * item.IssueQty,
              };
            }
            return item;
          }
          return item;
        });
        const filteredBstchProductId = batch.map((item) => item.ProductId);

        const updatedbatch = dataModal.filter(
          (item) => !filteredBstchProductId.includes(item.ProductId)
        );

        // Append the new filteredDataModel to the updated final batch details
        setDataModal([...updatedbatch, ...batch]);
      }
      else {
        const calculateQuantitiesAndAmounts = (issueQty) => {
          let totalQty = 0;
          const sortedBatchDetails = [...ApiData.BatchDetails].sort(
            (a, b) => new Date(a.EXPDate) - new Date(b.EXPDate)
          );
          const updatedBatchDetails = sortedBatchDetails.map((item) => {
            let qty = 0;
            let amount = 0;

            if (!item.IsProductBatchExpired && totalQty < issueQty) {
              qty = Math.min(item.BalanceQty, issueQty - totalQty);
              totalQty += qty;
              amount = qty * item.MRP;
            }
            return { ...item, qty, amount };
          });
          return updatedBatchDetails.filter((item) => item.qty > 0);
        };

        const updatedBatch = calculateQuantitiesAndAmounts(record.IssueQty).map(
          (item, index) => ({
            ...item,
            key: uuidv4(),
            IssueQty: item.qty,
            IssueRate: item.MRP,
            LineAmount: item.amount,
            EXPDate: item.EXPDate ? dayjs(item.EXPDate) : undefined,
            RequestQty: item.qty,
          })
        );

        form2.setFieldsValue(
          updatedBatch.reduce((acc, item) => {
            acc[item.key] = {
              IssueQty: item.IssueQty,
              BatchNo: item.BatchNo,
              IssueRate: item.IssueRate,
              LineAmount: item.LineAmount,
              EXPDate: item.EXPDate,
              MRP: item.MRP,
              qty: item.qty,
            };
            return acc;
          }, {})
        );

        setDataModal((prevDataModel) => {
          return [...prevDataModel, ...updatedBatch];
        });
      }
    } catch (error) {

    }
    setIsModalOpen(true)
  }

  const ModelAdd = async () => {
    await form3.validateFields();
    setDataModal([
      ...dataModal,
      {
        key: uuidv4(),
        ProductId: '',
        BatchNo: '',
        IssueQty: 0,
        AvlQuantity: '',
        UomId: '',
        EXPDate: '',
        MRP: '',
        Amount: '',
        StockLocator: 0,
        ActiveFlag: true
      },
    ]);
    // setCounterModel(counterModel + 1);
  };

  const SubmitChanged = (event) => {
    setIssueStatus(event.target.checked)
  }

  const columnsModel = [
    {
      title: 'Batch No',
      dataIndex: 'BatchNo',
      key: 'BatchNo',
      // width: 100,
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "BatchNo"]}
            rules={[{ required: true, message: "Required" }]}
            initialValue={record.BatchNo}
          >
            <Select
              onChange={(value) => BatchSelect(value, record.key)}
              style={{ width: 100 }}
              disabled={!!record.IssueBatchId}
            >
              {batchDetails.map((option) => (
                <Select.Option key={option.StockId} value={option.StockId}>
                  {option.BatchNo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={[record.key, "BatchId"]}
            initialValue={record.StockId}
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={[record.key, "IssueBatchId"]}
            initialValue={record.StockId}
            hidden
          >
            <Input />
          </Form.Item>
        </>
        // <>
        //   <Form.Item name={[record.key, 'BatchNo']}
        //     rules={[
        //       {
        //         required: true,
        //         message: 'Please input!'
        //       },
        //     ]}
        //     initialValue={record.BatchNo}
        //   >
        //     <Select allowClear onChange={(value) => BatchSelect(value, record)} style={{ width: 100 }}>
        //       {batchDetails.map((option) => (
        //         <Select.Option key={option.BatchNo} value={option.BatchNo}>{option.BatchNo}</Select.Option>
        //       ))}
        //     </Select>
        //   </Form.Item>
        //   <Form.Item hidden name={[record.key, 'IssueBatchId']} initialValue={record.IssueBatchId}>
        //     <Input />
        //   </Form.Item>
        // </>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'IssueQty',
      key: 'IssueQty',
      // width: 100,
      render: (text, record) => {
        return (
          <Form.Item name={[record.key, 'IssueQty']} initialValue={record.IssueQty}
            rules={[
              {
                required: true,
                message: 'Please input!'
              },
              {
                validator: (_, value) => {
                  if (value > record.AvlQuantity) {
                    return Promise.reject(
                      new Error("Quantity not greater than Avl Quantity.")
                    );
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber allowClear style={{ width: 100 }} />
          </Form.Item>
        );
      }
    },
    {
      title: 'Avl Quantity',
      dataIndex: 'AvlQuantity',
      key: 'AvlQuantity',
      // width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'AvlQuantity']} initialValue={record.PendingQty}>
          <InputNumber disabled />
        </Form.Item>
      )
    },
    {
      title: 'UOM',
      dataIndex: 'UomId',
      key: 'UomId',
      width: 140,
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
      width: 160,
      render: (text, record) => (
        <Form.Item name={[record.key, 'EXPDate']} initialValue={dayjs(record.EXPDate)}
          rules={
            [
              {
                validator: (_, value) => {
                  // if (!value || !value.$isDayjsObject) {
                  if (!value) {
                    // return Promise.reject(new Error("Invalid date format!"));
                    return Promise.resolve();
                  }

                  const today = dayjs();
                  if (value.isBefore(today, "day")) {
                    return Promise.reject(new Error("Date is expired!"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
        >
          {
            record.Expiry === "Not applicable" ? (
              <span>Is Not Applicable</span>
            ) : (
              <DatePicker
                format={
                  record.Expiry === "Month wise"
                    ? "MMMM YYYY"
                    : record.Expiry === "Date wise"
                      ? "DD-MM-YYYY"
                      : "DD-MM-YYYY"
                }
                defaultValue={dayjs(record.EXPDate)}
                disabled
                style={{ width: 140 }}
              />
            )
          }
        </Form.Item >
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
        <Form.Item name={[record.key, 'Amount']} initialValue={record.LineAmount}>
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
    // {
    //   title: <Button type="primary" icon={<PlusOutlined />} onClick={ModelAdd}></Button>,
    //   dataIndex: 'add',
    //   key: 'add',
    //   width: 50,
    //   render: (text, record) => <Popconfirm title="Sure to delete?" onConfirm={() => ModelDelete(record)}><DeleteOutlined /></Popconfirm>
    // }
  ]

  const BatchSelect = (selectedStockId, recordKey) => {
    const existingBatch = dataModal.find(
      (item) => item.StockId === selectedStockId && item.ActiveFlag === true
    );

    if (existingBatch) {
      message.warning("Same Batch Number should not be selected.");
      //  return;
    }
    const selectedBatch = batchDetails.find(
      (batch) => batch.StockId === selectedStockId
    );

    if (selectedBatch) {
      const updatedDataModel = dataModal.map((item) =>
        item.key === recordKey
          ? {
            ...item,
            BatchNo: selectedBatch.BatchNo,
            StockId: selectedBatch.StockId,
            IssueBatchId: selectedBatch.IssueBatchId,
            IssueQty: selectedBatch.IssueQty, // Set IssueQty with qty
            IssueRate: selectedBatch.MRP,
            //LineAmount:item.LineAmount,
            BalanceQty: selectedBatch.BalanceQty,
            EXPDate: selectedBatch.EXPDate
              ? dayjs(selectedBatch.EXPDate)
              : null,
            MRP: selectedBatch.MRP,
            // qty:item.qty,
            amount: selectedBatch.amount,
          }
          : item
      );

      // Update form2 with the respective values
      form2.setFieldsValue({
        [recordKey]: {
          StockId: selectedBatch.StockId,
          IssueBatchId: selectedBatch.IssueBatchId,
          IssueQty: selectedBatch.IssueQty, // Set IssueQty with qty
          BatchNo: selectedBatch.BatchNo,
          // LineAmount:item.LineAmount,
          BalanceQty: selectedBatch.BalanceQty,
          EXPDate: selectedBatch.EXPDate ? dayjs(selectedBatch.EXPDate) : null,
          IssueRate: selectedBatch.MRP,
          //qty:selectedBatch.qty,
          amount: 0.0,
        },
      });
      setDataModal(updatedDataModel);

      // calculateAmount(recordKey, selectedBatch.IssueQty, selectedBatch.MRP)
    }
    // const IsExist = dataModal.filter((item) => item.BatchNo == value && item.UomId != '')
    // if (IsExist.length > 0) {
    //   message.warning('Same Batch No should not be selected.')
    //   return false
    // }
    // const temp = batchDetails.filter((item) => item.BatchNo == value)
    // const newdata = dataModal.map((item) => {
    //   if (record.key == item.key) {
    //     return {
    //       ...item,
    //       key: uuidv4(),
    //       BatchNo: value,
    //       IssueQty: 0,
    //       UomId: temp[0].UomId,
    //       Uom: temp[0].Uom,
    //       AvlQuantity: temp[0].BalanceQty,
    //       EXPDate: dayjs(temp[0].EXPDate),
    //       MRP: temp[0].MRP,
    //       amount: 0
    //     }
    //   } else {
    //     return item
    //   }
    // })
    // setDataModal(newdata)
  }

  const handleStore = (value) => {
    if (value) {
      setData(initialDataSource)
      setIsTable(true)
    } else {
      setIsTable(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
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
                  <Button type="primary" disabled={loading} htmlType="submit">
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
            }
          </Form>
        </Card>
        <Modal
          width={1200}
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
                  <Tag color="#52c41a">Issued Quantity: {productDetails.IssueQty}</Tag>
                  {/* <span>
                    Issued Quantity  :{" "}
                    <b style={{ color: "#1677ff" }}>{productDetails.IssueQty}</b>{" "}
                  </span> */}
                </div>
              </Col>
            </Row>
            <CustomTable
              columns={columnsModel}
              size="small"
              locale={{ emptyText: "Nodata " }}
              actionColumnName={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={ModelAdd}
                />
              }
              onDelete={ModelDelete}
              dataSource={
                productDetails.ProductId
                  ? dataModal.filter(
                    (item) =>
                      (item.ProductId === productDetails.ProductId &&
                        item.ActiveFlag) ||
                      (item.ProductId === "" && item.ActiveFlag)
                  )
                  : []
              }
            />
          </Form>
        </Modal>
      </div>
    </Layout >
  );
}

export default CreateStoreConsumption;
