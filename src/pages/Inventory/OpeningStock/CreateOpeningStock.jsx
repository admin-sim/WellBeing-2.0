import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlCreatePurchaseOrder, urlEditOpeningStock, urlUpdateOpeningStock, urlAutocompleteProduct, urlAddNewStock, urlGetProductDetailsById, urlGetTaxDetails } from '../../../../endpoints.js';
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
import { ColWithEightSpan } from '../../../components/customGridColumns/index.jsx';

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
  const [alternateUoms, setAlternateUoms] = useState([])
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
  const [amount, setAmount] = useState()
  const [gstTax, setGSTTax] = useState()
  const [totalAmount, setTotalAmount] = useState()

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
                UOM: response.data.data.UOM.filter(m => item.ProductDetails.AlternateUoms.find(i1 => i1.AlternateUom === m.UomId) || m.UomId === item.ProductDetails.UOMPrimaryUOM),
                LineAmount: item.ProductDetails.AlternateUoms.length > 0
                  ? (() => {
                    const matchedUom = item.ProductDetails.AlternateUoms.find(x => x.AlternateUom === item.UomId);
                    return matchedUom ? item.LineAmount * matchedUom.EquivalentUOMUnits : item.LineAmount;
                  })()
                  : item.LineAmount
              })
            );
            setAlternateUoms(products.flatMap(item => ({
              key: item.key,
              data: item.ProductDetails.AlternateUoms,
            })));
            setData(products);
            const totalAmount = calculateTotalAmount(products);
            form2.setFieldsValue({
              GSTTax: totalAmount.taxAmount,
              TotalPoAmount: totalAmount.totalAmount,
            });
            setTotalAmount(totalAmount.totalAmount)
            setGSTTax(totalAmount.taxAmount)
            const formdata = editeddata.newGRNAgainstPOModel;
            form1.setFieldsValue({
              // Date: formdata.GRNDate,
              ReceivingStore: formdata.StoreId,
              GRNHeaderId: formdata.GRNHeaderId,
              Remarks: formdata.Remarks,
            });
            const delivery = editeddata.BatchDetails.map((item, index) => ({
              ...item,
              key: uuidv4(),
            }));
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

  const handleSearch = async (searchText, record) => {
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
        Uom: item.UOMPrimaryUOMname
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

    const taxamt1 = form3Obj.reduce(
      (total, item) => (item ? total + (item.TaxAmount1 || 0) : total),
      0
    ); const taxamt2 = form3Obj.reduce(
      (total, item) => (item ? total + (item.TaxAmount2 || 0) : total),
      0
    );

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
            MFGDateString: form3data[item.key].MFGDateString ? form3data[item.key].MFGDateString.format("DD-MM-YYYY") : "",
            MRP: form3data[item.key].MRP,
            ProductId: form3data[item.key].ProductId,
            Quantity: form3data[item.key].Quantity,
            GrnLineId: form3data[item.key].GrnLineId ?? 0,
            StockLocator: 0,
            Rate: form3data[item.key].PoRate,
            UomId: form3data[item.key].UomId,
            TaxType1: form3data[item.key].TaxType1 != '' ? form3data[item.key].TaxType1 : 0,
            TaxAmount1: form3data[item.key].TaxAmount1 ? form3data[item.key].TaxAmount1 : 0,
            TaxType2: form3data[item.key].TaxType2 != '' ? form3data[item.key].TaxType2 : 0,
            TaxAmount2: form3data[item.key].TaxAmount2 ? form3data[item.key].TaxAmount2 : 0,
          }
        }
        return item
      })
      setDataModal(newdatamodal)
      const newData = data.map((item) => {
        const key = item.key;
        if (productDetails.key == key) {
          return {
            ...item,
            TaxAmount1: taxamt1 + taxamt2
          }
        }
        return item
      })
      form2.setFieldsValue({ [productDetails.key]: { TaxAmount1: taxamt1 + taxamt2 } });
      setData(newData)
      const totalAmount = calculateTotalAmount(newData);
      form2.setFieldsValue({
        GSTTax: totalAmount.taxAmount,
        TotalPoAmount: totalAmount.totalAmount,
      });
      setTotalAmount(totalAmount.totalAmount)
      setGSTTax(totalAmount.taxAmount)
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
    const totalAmount = calculateTotalAmount(newData);
    form2.setFieldsValue({
      GSTTax: totalAmount.taxAmount,
      TotalPoAmount: totalAmount.totalAmount
    });
    setTotalAmount(totalAmount.totalAmount)
    setGSTTax(totalAmount.taxAmount)

    const newdataModel = dataModal.map((i) => {
      if (i.ProductId === record.ProductId) {
        return { ...i, ActiveFlag: false };
      }
      return i
    })
    setDataModal(newdataModel)
  };

  const handleOnFinish = async (values) => {
    debugger
    await form2.validateFields()
    const form2data = form2.getFieldsValue()
    setIsSearchLoading(true);
    // const filterData = data.filter((m) => m.ActiveFlag == true)

    const products = [];

    data.forEach((s) => {
      const product = {
        ProductId: s.ProductId,
        UomId: s.UomId,
        PORate: s.PoRate,
        ReceivedQty: s.ReceivedQty,
        LineAmount: s.LineAmount,
        TotalAmount: s.LineAmount,
        TaxAmount1: s.TaxAmount1,
        Replaceable: s.Replaceable == true ? 'Y' : 'N',
        GrnLineId: s.GrnLineId ? s.GrnLineId : 0,
        ActiveFlag: s.ActiveFlag
      }
      products.push(product);
    })

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
  };

  const handleSelect = async (value, option, column, record) => {
    form2.setFieldsValue({ [record.key]: { ProductId: option.key } });
    customAxios
      .get(`${urlGetProductDetailsById}?ProductId=${option.key}`)
      .then((response) => {
        const apiData = response.data.data
        let uoms = []
        if (apiData.AlternateUoms.length > 0) {
          setAlternateUoms((prev) => [
            ...prev,
            { key: record.key, data: apiData.AlternateUoms },
          ]);
          uoms = DropDown.UOM.filter(
            i =>
              apiData.AlternateUoms.find(i1 => i1.AlternateUom === i.UomId || i.UomId === option.UomId)
          )
        } else {
          uoms = DropDown.UOM.filter(i => i.UomId === option.UomId)
        }
        form2.setFieldsValue({ [record.key]: { UomId: option.UomId } })
        const newData = data.map((item) => {
          if (item.key === record.key) {
            const updatedItem = {
              ...item,
              [column]: option.value,
              UomId: option.UomId,
              ProductId: option.key,
              TaxAmount1: 0,
              Uom: option.Uom,
              Expiry: option.Expiry,
              UOM: uoms
            };
            return updatedItem
          }
          return item
        });
        setData(newData)
      });
  };

  function calculateTotalAmount(data) {
    // let amount = 0;
    let totalAmount = 0;
    let taxAmount = 0;
    data.forEach((item) => {
      if (
        item.ActiveFlag &&
        !isNaN(item.LineAmount) &&
        item.LineAmount !== null &&
        item.LineAmount !== undefined
      ) {
        totalAmount += item.LineAmount;
        taxAmount += item.TaxAmount1;
        // amount += taxTemp == 0 ?
        //   item.LineAmount + item.TaxAmount1 :
        //   item.LineAmount - item.TaxAmount1;
      }
    });
    return totalAmount = {
      // amount: amount,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
    };
  }

  const handleInputChange = (e, column, index, record) => {
    debugger
    let newData;
    if (["ReceivedQty", "PoRate"].includes(column)) {
      newData = data.map((item) => {
        if (item.key === record.key) {
          const updatedItem = { ...item, [column]: e.target.value };
          const altUomData = alternateUoms.find(i => i.key == record.key)
          const altUom = altUomData ? altUomData.data.find((i1) => i1.AlternateUom == updatedItem.UomId || i1.UomId == updatedItem.UomId) : undefined
          const recievingQty = column === "ReceivedQty" ? e.target.value : item.ReceivedQty;
          const poRate = column === "PoRate" ? e.target.value : item.PoRate;

          let amount = 0;
          if (poRate != '' && recievingQty != '') {
            amount = poRate * recievingQty * (altUom ? altUom.EquivalentUOMUnits : 1);
          }

          updatedItem.LineAmount = amount;

          form2.setFieldsValue({ [record.key]: { TaxAmount1: item.TaxAmount1 } });
          form2.setFieldsValue({ [record.key]: { LineAmount: amount } });
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

    if (["ReceivedQty", "PoRate"].includes(column)) {
      const totalAmount = calculateTotalAmount(newData);
      form2.setFieldsValue({
        // TotalAmount: totalAmount.amount,
        GSTTax: totalAmount.taxAmount,
        TotalPoAmount: totalAmount.totalAmount,
      });
      // setPoAmount(totalAmount.amount)
      setTotalAmount(totalAmount.totalAmount)
      setGSTTax(totalAmount.taxAmount)
    }
    setData(newData);

    const newdataModel = dataModal.map((i) => {
      if (i.ProductId === record.ProductId) {
        return { ...i, ActiveFlag: false };
      }
      return i
    })
    setDataModal(newdataModel)
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

  function handleUomChange(option, column, index, record) {
    form2.setFieldsValue({ [record.key]: { UomId: option.value } });
    form2.setFieldsValue({ [record.key]: { TaxAmount1: 0 } });
    form2.setFieldsValue({ [record.key]: { PoRate: '' } });
    form2.setFieldsValue({ [record.key]: { ReceivedQty: '' } });
    form2.setFieldsValue({ [record.key]: { LineAmount: 0 } });
    const newData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = {
          ...item,
          [column]: option.value,
          ShortName: option.children,
          Uom: option.children,
          TaxAmount1: 0,
          PoRate: 0,
          ReceivedQty: 0,
          LineAmount: 0
        };
        return updatedItem;
      }
      return item;
    });
    setData(newData);
    setTotalAmount(0)
    setGSTTax(0)

    const totalAmount = calculateTotalAmount(newData);
    form2.setFieldsValue({
      // TotalAmount: totalAmount.amount,
      GSTTax: totalAmount.taxAmount,
      TotalPoAmount: totalAmount.totalAmount,
    });
    // setPoAmount(totalAmount.amount)
    setTotalAmount(totalAmount.totalAmount)
    setGSTTax(totalAmount.taxAmount)

    const newdataModel = dataModal.map((i) => {
      if (i.ProductId === record.ProductId) {
        return { ...i, ActiveFlag: false };
      }
      return i
    })
    setDataModal(newdataModel)
  };

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
              onSearch={(value) => handleSearch(value, record)}
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
      dataIndex: 'UomId',
      key: 'UomId',
      render: (text, record, index) => (
        <Form.Item name={[record.key, 'UomId']} initialValue={record.ShortName == undefined ? record.UomId : record.ShortName}>
          <Select
            defaultValue={record.UomId}
            onChange={(value, option) => {
              handleUomChange(option, "UomId", index, record)
            }}
          >
            {(record.UOM || []).map((option) => (
              <Option key={option.UomId} value={option.UomId}>
                {option.ShortName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'ReceivedQty',
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
              handleInputChange({ target: { value } }, "ReceivedQty", index, record);
            }}
          />
        </Form.Item>
      )
    },
    {
      title: 'Rate',
      dataIndex: 'PoRate',
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
              handleInputChange({ target: { value } }, "PoRate", index, record);
            }}
          />
        </Form.Item>
      )
    },
    {
      title: 'Tax',
      dataIndex: 'TaxAmount1',
      key: 'TaxAmount1',
      render: (text, record) => (
        <Form.Item name={[record.key, 'TaxAmount1']} initialValue={text}>
          <InputNumber min={0} disabled style={{ width: '100%' }} precision={4} />
        </Form.Item>
      )
    },
    {
      title: 'Value',
      dataIndex: 'LineAmount',
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
      key: 'batch',
      render: (text, record) => (
        <Button type='link' onClick={() => OpenBatch(record)}>Batch</Button>
      )
    },
    {
      title: 'Replacable',
      dataIndex: 'Replaceable',
      key: 'Replaceable',
      render: (text, record) => (
        <Form.Item name={[record.key, 'Replaceable']} initialValue={record.Replaceable} valuePropName='checked'>
          <Checkbox></Checkbox>
        </Form.Item>
      )
    },
  ];

  const BatchAdd = async () => {
    setDataModal([
      ...dataModal,
      {
        key: uuidv4(),
        BarCode: "",
        BatchNo: "",
        Quantity: 0,
        ProductId: productDetails.ProductId,
        UomId: null,
        BatchBonusQty: 0,
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
  };

  const handleBatchChange = async (e, column, index, record) => {
    const value = e.target.value;
    let updatedData = [...dataModal];

    updatedData = updatedData.map((item) => {
      if (item.key === record.key) {
        return { ...item, [column]: value };
      }
      return item;
    });

    if (["Quantity", 'MRP', "TaxType1", "TaxType2"].includes(column)) {
      const currentRecord = updatedData.find((item) => item.key === record.key);

      const poQuantity = parseFloat(currentRecord.Quantity || 0);
      const poRate = parseFloat(productDetails.PoRate || 0);
      const amount = poQuantity * poRate;
      const taxType1 = currentRecord.TaxType1;
      const taxType2 = currentRecord.TaxType2;

      let taxAmount = 0;
      let temp = 0
      if (taxType1 != '' && taxType1) {
        try {
          const response = await customAxios.get(`${urlGetTaxDetails}?AdditionalChargeId=${taxType1}`);
          const taxDetails = response.data.data[0];
          temp = taxDetails.AdditionalChargeType == 'Tax(Exclusive)' ? 0 : 1
          taxAmount = calculateTax(amount, taxDetails, currentRecord);

          currentRecord.TaxAmount1 = taxAmount.taxAmount;
        } catch (error) {
          console.error("Error fetching tax details:", error);
        }
      } else {
        currentRecord.TaxAmount1 = 0;
      }
      if (taxType2 != '' && taxType2) {
        try {
          const response = await customAxios.get(`${urlGetTaxDetails}?AdditionalChargeId=${taxType2}`);
          const taxDetails = response.data.data[0];
          temp = taxDetails.AdditionalChargeType == 'Tax(Exclusive)' ? 0 : 1
          taxAmount = calculateTax(amount, taxDetails, currentRecord);

          currentRecord.TaxAmount2 = taxAmount.taxAmount;
        } catch (error) {
          console.error("Error fetching tax details:", error);
        }
      } else {
        currentRecord.TaxAmount2 = 0;
      }

      form3.setFieldsValue({
        [record.key]: {
          TaxAmount1: currentRecord.TaxAmount1 || 0,
          TaxAmount2: currentRecord.TaxAmount2 || 0
        }
      })
    }

    setDataModal(updatedData)
  };

  const calculateTax = (amount, taxDetails, record) => {
    let taxAmount = 0;
    let temp = 0
    const mrp = (record.MRP || 0)
    const altUomData = alternateUoms.find(i => i.key == productDetails.key)
    const altUom = altUomData ? altUomData.data.find((i1) => i1.AlternateUom == productDetails.UomId) : undefined
    let poQuantity = record.Quantity * (altUom ? altUom.EquivalentUOMUnits : 1)
    amount = amount * (altUom ? altUom.EquivalentUOMUnits : 1)
    if (taxDetails.IncludeBonusQuantity) {
      poQuantity = (poQuantity || 0) + (record.BatchBonusQty || 0);
      amount = poQuantity * (productDetails.PoRate || 0);
    }
    if (true) {
      switch (taxDetails.ChargeType) {
        case "Percentage":
          if (taxDetails.AdditionalChargeType == 'Tax(Exclusive)') {
            if (taxDetails.AdditionalChargeIndicator == "Gross") {
              taxAmount = amount * taxDetails.ChargeValue / 100;
            } else if (taxDetails.AdditionalChargeIndicator == "Net") {
              taxAmount = amount * taxDetails.ChargeValue / 100;
            } else {
              taxAmount = (mrp * poQuantity) * taxDetails.ChargeValue / 100;
            }
          } else {
            if (taxDetails.AdditionalChargeIndicator == "Gross") {
              taxAmount = amount - (amount / (1 + taxDetails.ChargeValue / 100));
              temp = 1;
            } else if (taxDetails.AdditionalChargeIndicator == "Net") {
              taxAmount = amount - (amount / (1 + taxDetails.ChargeValue / 100));
              temp = 1;
            } else {
              taxAmount = (mrp * poQuantity) - ((mrp * poQuantity) / (1 + taxDetails.ChargeValue / 100));
              temp = 1;
            }
          }
          break;

        case "Amount":
          if (taxDetails.AdditionalChargeType == 'Tax(Exclusive)') {
            if (taxDetails.AdditionalChargeIndicator == "Gross") {
              taxAmount = amount + taxDetails.ChargeValue;
            } else if (taxDetails.AdditionalChargeIndicator == "Net") {
              taxAmount = amount + taxDetails.ChargeValue;
            } else {
              taxAmount = (mrp * poQuantity) + taxDetails.ChargeValue;
            }
          } else {
            if (taxDetails.AdditionalChargeIndicator == "Gross") {
              taxAmount = amount - taxDetails.ChargeValue;
              temp = 1;
            } else if (taxDetails.AdditionalChargeIndicator == "Net") {
              taxAmount = amount - taxDetails.ChargeValue;
              temp = 1;
            } else {
              taxAmount = mrp * poQuantity - taxDetails.ChargeValue;
              temp = 1;
            }
          }
          break;

        default:
          break;
      }
    }
    return taxAmount = {
      taxAmount: taxAmount,
      temp: temp
    };
  };

  const Batchmodal = [
    {
      title: "Bar Code",
      dataIndex: "BarCode",
      key: "BarCode",
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
      render: (text, record, index) => (
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
            onChange={(value) => {
              handleBatchChange(
                { target: { value } },
                "Quantity",
                index,
                record
              );
            }}
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
      render: (text, record) => (
        <Form.Item name={[record.key, "UomId"]} initialValue={productDetails.UomId}>
          <Tag color="#7C00FE">{productDetails.Uom}</Tag>
          {/* <Select disabled defaultValue={productDetails.UomId} style={{ width: 100 }}>
            {DropDown.UOM.map((option) => (
              <Select.Option key={option.UomId} value={option.UomId}>
                {option.ShortName}
              </Select.Option>
            ))}
          </Select> */}
        </Form.Item>
      ),
    },
    {
      title: "MFG Date",
      dataIndex: "MFGDateString",
      key: "MFGDateString",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "MFGDateString"]}
          initialValue={
            record.MFGDateString
              ? dayjs(record.MFGDateString, "DD-MM-YYYY")
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
        <Form.Item name={[record.key, "PoRate"]} initialValue={productDetails.PoRate}>
          <InputNumber
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
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "MRP"]} initialValue={record.MRP}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
            {
              validator: (_, value) => {
                debugger
                if (value < productDetails.PoRate) {
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
            onChange={(value) => {
              handleBatchChange(
                { target: { value } },
                "MRP",
                index,
                record
              );
            }}
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
      render: (text, record, index) => (
        <Form.Item name={[record.key, "TaxType1"]} initialValue={text}>
          <Select allowClear placeholder='Select Tax' style={{ width: 100 }}
            onChange={(value) => {
              handleBatchChange(
                { target: { value } },
                "TaxType1",
                index,
                record
              );
            }}
          >
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
        <Form.Item name={[record.key, "TaxAmount1"]} initialValue={text}>
          <InputNumber min={0} style={{ width: 100 }} disabled precision={4} />
        </Form.Item>
      ),
    },
    {
      title: "SGST",
      dataIndex: "TaxType2",
      key: "TaxType2",
      render: (text, record, index) => (
        <Form.Item name={[record.key, "TaxType2"]} initialValue={text}>
          <Select allowClear placeholder='Select Tax' style={{ width: 100 }}
            onChange={(value) => {
              handleBatchChange(
                { target: { value } },
                "TaxType2",
                index,
                record
              );
            }}
          >
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
        <Form.Item name={[record.key, "TaxAmount2"]} initialValue={text}>
          <InputNumber min={0} style={{ width: 100 }} disabled precision={4} />
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
            <Row justify={"end"}>
              <ColWithEightSpan>
                <Form.Item
                  label=""
                  name="GSTTax"
                // style={{ marginRight: "16px" }}
                >
                  <Row gutter={16} style={{ marginTop: "5px" }}>
                    <Col span={12}>
                      <span>GST Tax : </span>
                    </Col>
                    <Col span={12}>
                      <InputNumber style={{ width: "100%" }} min={0} disabled value={gstTax} precision={4} />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item label="" name="TotalAmount">
                  <Row gutter={16} style={{ marginTop: "5px" }}>
                    <Col span={12}>
                      <span>Total Amount :</span>
                    </Col>
                    <Col span={12}>
                      <InputNumber style={{ width: "100%" }} min={0} disabled value={totalAmount} precision={4} />
                    </Col>
                  </Row>
                </Form.Item>
              </ColWithEightSpan>
            </Row>
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
