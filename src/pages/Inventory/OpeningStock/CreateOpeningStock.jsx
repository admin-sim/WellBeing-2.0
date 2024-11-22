import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder, urlEditOpeningStock, urlUpdateOpeningStock, urlAutocompleteProduct, urlAddNewStock } from '../../../../endpoints.js';
import Select from 'antd/es/select';
import { ConfigProvider, Typography, Checkbox, Tag, Modal, Popconfirm, message, Col, Divider, Row, Spin, AutoComplete, Card } from 'antd';
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
import { v4 as uuidv4 } from "uuid";
import customAxios from '../../../components/customAxios/customAxios.jsx';
import CustomTable from '../../../components/customTable/index.jsx';
import PageHeader from '../../../components/PageHeader/index.jsx';

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

  const location = useLocation();
  let [counter, setCounter] = useState(1);
  let [counterModal, setCounterModal] = useState(0);
  const [loading, setLoading] = useState(false);

  const GRNHeaderId = location.state.GRNHeaderId;

  const initialDataSource =
    GRNHeaderId === 0
      ? [
        {
          key: uuidv4(),
          ProductName: "",
          UomId: "",
          ReceivedQty: "",
          PoRate: "",
          LineAmount: "",
          Replaceable: true,
          ActiveFlag: true,
        },
      ]
      : [];

  const initialModelDataSource =
    GRNHeaderId === 0
      ? [
        {
          key: uuidv4(),
          BarCode: "",
          BatchNo: "",
          Quantity: 0,
          ProductId: "",
          UomId: null,
          BatchBonusQty: 0,
          MFGDate: "",
          EXPDateString: "",
          PoRate: 0,
          MRP: 0,
          TaxType1: "",
          TaxAmount1: 0,
          TaxType2: "",
          TaxAmount2: 0,
          StockLocator: "",
          ActiveFlag: true,
          PoLineId: 0,
          DiscountRate: 0,
          DiscountAmount: 0,
          GrnBatchId: 0,
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
  const [dataModal, setDataModal] = useState(initialModelDataSource);
  const currentDate = new Date();
  //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [issueStatus, setIssueStatus] = useState(false);
  const fields = form1.getFieldsValue();
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [productOptions, setProductOptions] = useState()
  const [dropDownLoad, setDropDownLoad] = useState(true);
  const [buttonTitle, setButtonTitle] = useState('Save')

  // const tableRef = useRef(null);

  useEffect(() => {
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
    setDropDownLoad(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (GRNHeaderId > 0) {
        setLoading(true)
        setButtonTitle("Update");
        try {
          const response = await customAxios.get(
            `${urlEditOpeningStock}?OpeningStockId=${GRNHeaderId}`
          );
          if (response.status == 200 && response.data.data != null) {
            const editeddata = response.data.data;
            const products = editeddata.GRNAgainstPODetails.map(
              (item, index) => ({
                ...item,
                key: uuidv4(),
                Replaceable: item.Replaceable == 'Y' ? true : false,
              })
            );
            setData(products);
            const formdata = editeddata.newGRNAgainstPOModel;

            form1.setFieldsValue({
              // Date: formdata.GRNDate,
              ReceivingStore: formdata.StoreId,
              GRNHeaderId: formdata.GRNHeaderId,
              Remarks: formdata.Remarks,
            });
            setCounter(products.length + 1);
            const delivery = editeddata.BatchDetails.map((item, index) => ({
              ...item,
              key: uuidv4(),
            }));
            setCounterModal(editeddata.BatchDetails.length + 1);
            setDataModal(delivery);
            setLoading(false)
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, []);

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

  const onOkModal = async () => {
    debugger
    await form3.validateFields()
    const form3data = form3.getFieldsValue()
    const form3Obj = Object.values(form3data)
    const TotalQty = form3Obj.reduce((sum, item) => sum + (item.Quantity || 0), 0);

    if (TotalQty !== productDetails.ReceivedQty) {
      message.warning('Quantities must be Equals')
      return false
    } else {
      const newdatamodal = dataModal.map((item, index) => {
        if (form3data[item.key] != null) {
          return {
            ...item,
            BarCode: form3data[item.key].BarCode,
            BatchNo: form3data[item.key].BatchNo,
            EXPDateString: form3data[item.key].EXPDateString ? form3data[item.key].EXPDateString.format("DD-MM-YYYY") : "",
            GrnBatchId: form3data[item.key].GrnBatchId,
            MFGDateString: form3data[item.key].MFGDate ? form3data[item.key].MFGDate.format("DD-MM-YYYY") : "",
            MRP: form3data[item.key].MRP,
            ProductId: form3data[item.key].ProductId,
            Quantity: form3data[item.key].Quantity,
            StockLocator: 0,
            Rate: form3data[item.key].PoRate,
            UomId: form3data[item.key].UomId,
            TaxAmount1: form3data[item.key].TaxAmount1 ? form3data[item.key].TaxAmount1 : 0,
            TaxAmount2: form3data[item.key].TaxAmount2 ? form3data[item.key].TaxAmount2 : 0,
            TaxType1: 0,
            TaxType2: 0
          }
        }
        return item
      })
      setDataModal(newdatamodal)
      setIsModalOpen(false);
    }
    // onCancelModel();
  }

  const onFinishModel = (values) => { }

  const onCancelModel = () => {
    // form3.resetFields();
    setIsModalOpen(false);
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleOpeningStock = () => {
    const url = '/OpeningStock';
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

  const handleOnFinish = async (values) => {
    await form2.validateFields()
    const form2data = form2.getFieldsValue()
    setIsSearchLoading(true);
    const products = [];
    for (let i = 0; i <= data.length; i++) {
      if (form2data[i] !== undefined) {
        const product = {
          ProductId: form2data[i].ProductId,
          UomId: form2data[i].UomId,
          PORate: form2data[i].PoRate,
          ReceivedQty: form2data[i].ReceivedQty,
          LineAmount: form2data[i].LineAmount,
          Replaceable: form2data[i].Replaceable == true ? 'Y' : 'N',
          GrnLineId: form2data[i].GrnLineId ? form2data[i].GrnLineId : 0,
          ActiveFlag: true
        }
        products.push(product);
      }
    }

    const OpeningStock = {
      GRNHeaderId: values.GRNHeaderId ? values.GRNHeaderId : 0,
      StoreId: values.ReceivingStore,
      GRNDatestring: values.Date ? values.Date.format("DD-MM-YYYY") : "",
      GRNStatus: !issueStatus ? 'Created' : values.GRNStatus,
      Remarks: values.Remarks,
    }

    const postData = {
      newGRNAgainstPOModel: OpeningStock,
      GRNAgainstPODetails: products,
      BatchDetails: dataModal
    }
    const url = GRNHeaderId == 0 ? urlAddNewStock : urlUpdateOpeningStock;
    const response = await customAxios.post(url, postData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status == 200) {
      message.success(`Stock ${GRNHeaderId == 0 ? "Created" : "Updated"} Successfully`);
      // handleCancel();
      handleOpeningStock()
    } else {
      message.error("Something went wrong");
    }
    setIsSearchLoading(false);
  };

  const handleAdd = async () => {
    setProductOptions([]);
    await form2.validateFields();
    setData([
      ...data,
      {
        key: uuidv4(),
        ProductName: "",
        UomId: "",
        Uom: '',
        ReceivedQty: "",
        PoRate: "",
        LineAmount: "",
        Replaceable: true,
        ActiveFlag: true,
      },
    ]);
    setCounter(counter + 1);
  };

  const handleSelect = async (value, option, column, record) => {
    form2.setFieldsValue({ [record.key]: { UomId: option.UomId } });
    form2.setFieldsValue({ [record.key]: { ProductId: option.key } });
    const newdata = data.map((item) => {
      if (item.key === record.key) {
        return {
          ...item,
          ProductId: option.key,
          UomId: option.UomId,
          ProductName: option.value
        }
      }
      return item
    })
    setData(newdata)
  };

  const handleInputChange = (value, fieldName, index, record) => {
    const formdata = form2.getFieldsValue()
    const formObj = Object.values(formdata)
    formObj.forEach((i) => {
      if (i.ReceivedQty != "" && i.PoRate != "") {
        form2.setFieldsValue({ [record.key]: { LineAmount: i.PoRate * i.ReceivedQty } })
      }
    })

    const newData1 = data.map((item => {
      if (record.key == item.key) {
        return {
          ...item,
          PoRate: formdata[item.key].PoRate,
          ReceivedQty: formdata[item.key].ReceivedQty,
          LineAmount: formdata[item.key].ReceivedQty * formdata[item.key].PoRate,
        }
      }
      return item
    }))
    setData(newData1);
  };

  const OpenBatch = async (record) => {
    await form2.validateFields([
      [record.key, "ProductName"],
      [record.key, "PoRate"],
      [record.key, "ReceivedQty"]
    ]);
    setProductDetails(record)
    setIsModalOpen(true)
  }

  const columns = [
    {
      title: 'Product',
      width: 350,
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
            style={{ width: '100%' }}
            initialValue={record.ProductName}
          >
            <AutoComplete disabled={!!record.GrnLineId}
              options={productOptions}
              onSearch={handleSearch}
              onSelect={(value, option) =>
                handleSelect(value, option, "ProductName", record)
              }
              placeholder="Search for a product"
              allowClear
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
            name={[record.key, "GrnLineId"]}
            hidden
            initialValue={record.GrnLineId}
          >
            <Input></Input>
          </Form.Item>
        </>
      )
    },
    {
      title: 'UOM',
      // width: 100,
      dataIndex: 'UomId',
      key: 'UomId',
      render: (text, record) => (
        <Form.Item name={[record.key, 'UomId']} initialValue={record.UomId}>
          <Select placeholder='Select Value' disabled>
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
      dataIndex: 'ReceivedQty',
      // width: 100,
      key: 'ReceivedQty',
      render: (text, record, index) => (
        <Form.Item name={[record.key, 'ReceivedQty']} initialValue={record.ReceivedQty}
          rules={[
            {
              required: true,
              message: 'Please input!'
            }
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }}
            onChange={(value) => {
              handleInputChange(value, "ReceivedQty", index, record);
            }}
          />
        </Form.Item>
      )
    },
    {
      title: 'Rate',
      dataIndex: 'PoRate',
      // width: 100,
      key: 'PoRate',
      render: (text, record, index) => (
        <Form.Item name={[record.key, 'PoRate']} initialValue={record.PoRate}
          rules={[
            {
              required: true,
              message: 'Please input!'
            }
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }}
            onChange={(value) => {
              handleInputChange(value, "PoRate", index, record);
            }}
          />
        </Form.Item>
      )
    },
    {
      title: 'Value',
      dataIndex: 'LineAmount',
      // width: 100,
      key: 'LineAmount',
      render: (text, record) => (
        <Form.Item name={[record.key, 'LineAmount']} initialValue={record.LineAmount}
          rules={[
            {
              required: true,
              type: "number",
              min: 1,
              message: 'value must greater than 0!'
            }
          ]}
        >
          <InputNumber min={0} disabled style={{ width: '100%' }} precision={4} />
        </Form.Item>
      )
    },
    {
      title: 'Batch',
      dataIndex: 'batch',
      // width: 100,
      key: 'batch',
      render: (text, record) => (
        <Button type='link' onClick={() => OpenBatch(record)}>Batch</Button>
      )
    },
    {
      title: 'Replacable',
      dataIndex: 'Replaceable',
      // width: 120,
      key: 'Replaceable',
      render: (text, record) => (
        <Form.Item name={[record.key, 'Replaceable']} initialValue={record.Replaceable} valuePropName='checked'>
          <Checkbox></Checkbox>
        </Form.Item>
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

  const BatchAdd = async () => {
    setDataModal([
      ...dataModal,
      {
        key: uuidv4(),
        BarCode: "",
        BatchNo: "",
        Quantity: 0,
        ProductId: "",
        UomId: null,
        BatchBonusQty: 0,
        MFGDate: "",
        EXPDateString: "",
        PoRate: 0,
        MRP: 0,
        TaxType1: 0,
        TaxAmount1: 0,
        TaxType2: 0,
        TaxAmount2: 0,
        StockLocator: 0,
        // StockLocatorName: "",
        ActiveFlag: true,
        DiscountRate: 0,
        DiscountAmount: 0,
        GrnBatchId: 0,
      },
    ]);
    // setCounterModal(counterModal + 1);
  };

  const Batchmodal = [
    {
      title: "Bar Code",
      dataIndex: "BarCode",
      key: "BarCode",
      // width: 100,
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "BarCode"]}
            initialValue={record.BarCode}
          >
            <Input
              min={0} style={{ width: 100 }} disabled={!!record.GrnBatchId}
            />
          </Form.Item>
          <Form.Item name={[record.key, "ProductId"]} hidden initialValue={productDetails.ProductId}>
            <Input></Input>
          </Form.Item>
          <Form.Item name={[record.key, "GrnBatchId"]} hidden initialValue={record.GrnBatchId}>
            <Input></Input>
          </Form.Item>
          <Form.Item name={[record.key, "GrnLineId"]} hidden initialValue={record.GrnLineId}>
            <Input></Input>
          </Form.Item>
        </>
      ),
    },
    {
      title: "Batch Number",
      dataIndex: "BatchNo",
      key: "BatchNo",
      render: (text, record) => {
        return (
          <Form.Item
            name={[record.key, "BatchNo"]}
            initialValue={record.BatchNo}
            rules={[
              {
                required: true,
                message: "input!",
              },
            ]}
          >
            <Input style={{ width: 100 }} disabled={!!record.GrnBatchId} />
          </Form.Item>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "Quantity"]}
          initialValue={record.Quantity}
          rules={[
            {
              required: true,
              message: "input!",
            },
          ]}
        >
          <InputNumber
            min={0} disabled={!!record.GrnBatchId}
            style={{ width: 100 }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Uom",
      dataIndex: "UomId",
      key: "UomId",
      // width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, "UomId"]} initialValue={productDetails.UomId}>
          <Select disabled defaultValue={productDetails.UomId} style={{ width: 100 }}>
            {DropDown.UOM.map((option) => (
              <Select.Option key={option.UomId} value={option.UomId}>
                {option.ShortName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "MFG Date",
      dataIndex: "MFGDate",
      key: "MFGDate",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "MFGDate"]}
          initialValue={
            record.MFGDate
              ? dayjs(record.MFGDate, "DD-MM-YYYY")
              : null
          }
        >
          <DatePicker disabled={!!record.GrnBatchId}
            style={{ width: 140 }}
            format="DD-MM-YYYY"
            disabledDate={(current) => {
              return current && current > dayjs().endOf("day");
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Exp Date",
      dataIndex: "EXPDateString",
      key: "EXPDateString",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "EXPDateString"]}
          rules={[
            {
              required: true,
              message: "input!",
            },
          ]}
          initialValue={
            record.EXPDateString
              ? dayjs(record.EXPDateString, "DD-MM-YYYY")
              : null
          }
        >
          <DatePicker disabled={!!record.GrnBatchId}
            style={{ width: 140 }}
            format="DD-MM-YYYY"
            disabledDate={(current) => {
              return current && current < dayjs().startOf("day");
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Rate",
      dataIndex: "PoRate",
      key: "PoRate",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "PoRate"]} initialValue={productDetails.PoRate}
        >
          <InputNumber defaultValue={productDetails.PoRate}
            min={0}
            style={{ width: 100 }}
            disabled
          />
        </Form.Item>
      ),
    },
    {
      title: "MRP",
      dataIndex: "MRP",
      key: "MRP",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "MRP"]} initialValue={record.MRP}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
            {
              validator: (_, value) => {
                if (value < record.Rate) {
                  return Promise.reject(
                    new Error("MRP not be less than Rate.")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={0} disabled={!!record.GrnBatchId}
            style={{ width: 100 }}
            allowClear
          />
        </Form.Item>
      ),
    },
    {
      title: "CGST",
      dataIndex: "TaxType1",
      key: "TaxType1",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxType1"]}>
          <Select allowClear placeholder='Select Tax' disabled style={{ width: 100 }}>
            {DropDown.TaxType.map((option) => (
              <Select.Option key={option.TaxType1} value={option.TaxType1}>
                {option.TaxTypeName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "CGST Amount",
      dataIndex: "TaxAmount1",
      key: "TaxAmount1",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxAmount1"]}>
          <InputNumber min={0} style={{ width: 100 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "SGST",
      dataIndex: "TaxType2",
      key: "TaxType2",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxType2"]} >
          <Select allowClear placeholder='Select Tax' disabled style={{ width: 100 }}>
            {DropDown.TaxType.map((option) => (
              <Select.Option key={option.TaxType1} value={option.TaxType1}>
                {option.TaxTypeName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "SGST Amount",
      dataIndex: "TaxAmount2",
      key: "TaxAmount2",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxAmount2"]}>
          <InputNumber min={0} style={{ width: 100 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Stock Locator",
      dataIndex: "StockLocator",
      key: "StockLocator",
      render: (text, record) => (
        <Form.Item name={[record.key, "StockLocator"]} initialValue={"Manual"}>
          <Input style={{ width: 100 }} disabled={!!record.GrnBatchId} />
        </Form.Item>
      ),
    },
    {
      title: (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={BatchAdd}
        ></Button>
      ),
      dataIndex: "add",
      key: "add",
      // width: 50,
      render: (text, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => BatchDelete(record)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
    },
  ];

  const BatchDelete = (record) => {
    const newData = dataModal.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setDataModal(newData);
  };

  const SubmitChanged = (event) => {
    setIssueStatus(event.target.checked)
  }

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <PageHeader
          title={"Create Opening Stock"}
          buttonLabel="Back"
          buttonIcon={<LeftOutlined />}
          onButtonClick={handleOpeningStock}
        />
        <Card>
          <Form
            layout="vertical"
            onFinish={handleOnFinish}
            variant="outlined"
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
                  <Select allowClear placeholder='Select Value' loading={dropDownLoad} disabled={!!GRNHeaderId}>
                    {DropDown.StoreDetails.map((option) => (
                      <Select.Option key={option.StoreId} value={option.StoreId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="GRNHeaderId" hidden>
                  <Input />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Date" name="Date">
                  <DatePicker style={{ width: '100%' }} disabled format='DD-MM-YYYY' />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Openng Stock Status" name="GRNStatus"
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
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="SubmitCheck" style={{ marginTop: '30px' }} valuePropName='checked'>
                  <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
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
              <Col style={{ marginRight: '10px' }}>
                <Form.Item>
                  <Button type="primary">
                    Import
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" onClick={handleOpeningStock}>
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
            style={{
              maxWidth: 1500
            }}
            form={form2}
          >
            <Spin spinning={loading}>
              <CustomTable
                dataSource={data.filter((item) => item.ActiveFlag !== false)}
                columns={columns}
                isFilter={false}
                bordered
                onDelete={handleDelete}
                actionColumnName={<Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                ></Button>}
              />
            </Spin>
          </Form>
        </Card>
        <Modal
          title="Product Batch Details"
          onOk={onOkModal}
          onCancel={onCancelModel}
          width={1700}
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
            form={form3}
          >
            <Row>
              <Col className="gutter-row" span={12}>
                <div>
                  <Tag color="#1890ff">Product: {productDetails.ProductName}</Tag>
                  {/* </Form.Item> */}
                </div>
              </Col>
              <Col className="gutter-row" span={12}>
                <div>
                  <Tag color="#52c41a">
                    Quantity: {productDetails.ReceivedQty}
                  </Tag>{" "}
                  {/* </Form.Item> */}
                </div>
              </Col>
            </Row>
            {/* <CustomTable columns={Batchmodal}
                dataSource={dataModal.filter((item) => item.ActiveFlag !== false)}
              /> */}
            <Table columns={Batchmodal}
              dataSource={
                productDetails.ProductId
                  ? dataModal.filter(
                    (item) =>
                      (item.ProductId === productDetails.ProductId &&
                        item.ActiveFlag) ||
                      (item.ProductId === "" && item.ActiveFlag)
                  )
                  : initialModelDataSource
              }
              scroll={{ x: 900 }} />
          </Form>
        </Modal>
      </div>
    </Layout >
  );
}

export default CreateOpeningStock;
