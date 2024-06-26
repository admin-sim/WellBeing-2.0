import customAxios from "../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
import {
  urlCreatePurchaseOrder,
  urlAutocompleteProduct,
  urlGetProductDetailsById,
  urlEditGRNDirect,
  urlAddNewGRNDirect,
  urlUpdateGRNDirect
} from "../../../endpoints";
import Select from "antd/es/select";
import {
  ConfigProvider,
  Typography,
  Checkbox,
  Tag,
  Modal,
  Popconfirm,
  message,
  Col,
  Divider,
  Row,
  AutoComplete,
} from "antd";
import Input from "antd/es/input";
import Form from "antd/es/form";
import { DatePicker } from "antd";
import Layout from "antd/es/layout/layout";
import { LeftOutlined, CloseSquareFilled, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
//import Typography from 'antd/es/typography';
import { useNavigate } from "react-router";
import { Table, InputNumber } from "antd";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

const CreateDirectGRN = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: [],
  });

  let [idCounter, setCounter] = useState(2);
  let [idCounterModel, setCounterModel] = useState(2);
  const location = useLocation();
  const grnHeaderId = location.state.GRNHeaderId;
  const [batchRecord, setBatchRecord] = useState([]);

  const initialDataSource =
    grnHeaderId === 0
      ? [
        {
          key: 1,
          ProductName: "",
          UomId: "",
          GrnLineId: '',
          ReceivedQty: "",
          BonusQty: '',
          PoRate: "",
          DiscountRate: "",
          DiscountAmount: "",
          Batch: "",
          LineAmount: "",
          TaxAmount: "",
          TotalAmount: "",
          Replaceable: true,
          ActiveFlag: true,
        },
      ]
      : [];

  const initialModelDataSource =
    grnHeaderId === 0
      ? [
        {
          key: 1,
          BarCode: '',
          BatchNo: '',
          BatchQty: 0,
          UomId: '',
          BatchBonusQty: 0,
          MFGDate: '',
          EXPDate: '',
          rate: 0,
          BatchMrp: 0,
          DiscountRate: 0,
          BatchTaxType1: '',
          BatchTaxAmount1: 0,
          BatchTaxType2: '',
          BatchTaxAmount1: 0,
          BatchStockLocator: '',
          ProductId: '',
          GrnBatchId: 0,
          UomId: '',
          ActiveFlag: true,
        },
      ]
      : [];

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const navigate = useNavigate();
  const [data, setData] = useState(initialDataSource);
  const [modalVisible, setModalVisible] = useState(false)
  //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');
  const [inputValues, setInputValues] = useState({});
  const [shouldValidate, setShouldValidate] = useState(false);
  const [selectedUom, setSelectedUom] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [shouldValidateModel, setShouldValidateModel] = useState(false);
  const [dataModel, setDataModel] = useState(initialModelDataSource);
  const [selectedUomText, setSelectedUomText] = useState({});
  const [buttonTitle, setButtonTitle] = useState('Save');
  const [selectedUomId, setSelectedUomId] = useState({});
  const [recordKeys, setRecordKeys] = useState();
  const [delivery, setDelivery] = useState([]);
  const [productIds, setProductIds] = useState({});
  const fields = form1.getFieldsValue();
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [productLineId, setProductLineId] = useState(0);
  const [mrp, setMrp] = useState();

  useEffect(() => {
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
  }, []);

  useEffect(() => {
    debugger;
    const fetchData = async () => {
      if (grnHeaderId > 0) {
        setButtonTitle('Update')
        try {
          const response = await customAxios.get(`${urlEditGRNDirect}?GrnHeaderId=${grnHeaderId}`);
          if (response.status == 200 && response.data.data != null) {
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
              SupplierList: formdata.SupplierId,
              StoreDetails: formdata.StoreId,
              DocumentType: formdata.DocumentType,
              InvoiceNumber: formdata.InvoiceNumber,
              InvoiceDate: DateBindtoDatepicker(formdata.InvoiceDate),
              DCChallanDate: DateBindtoDatepicker(formdata.DCChallanDate),
              DCChallanNumber: formdata.DCChallanNumber,
              ReceivingDate: DateBindtoDatepicker(formdata.ReceivingDate),
              InvoiceAmount: formdata.InvoiceAmount,
              Amount: formdata.TotalAmount,
              totalpoAmount: formdata.TotalPoAmount,
              GRNDate: DateBindtoDatepicker(formdata.GRNDate),
              Remarks: formdata.Remarks,
              GRNStatus: formdata.GRNStatus === 'Created' ? '' : formdata.GRNStatus,
              GRNHeaderId: formdata.GRNHeaderId,
              PoHeaderId: formdata.PoHeaderId
            });
            setCounter(products.length + 1);
            const batch = editeddata.BatchDetails.map(
              (item, index) => ({
                ...item,
                key: index + 1,
              })
            );
            setDataModel(batch);
            setCounterModel(editeddata.BatchDetails.length + 1)
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, []);

  const DateBindtoDatepicker = (value) => {
    const isoDateString = value;
    const dateValue = new Date(isoDateString);
    const formattedDate = dayjs(dateValue).format('DD-MM-YYYY');
    return dayjs(formattedDate, 'DD-MM-YYYY');
  }

  const getPanelValue = async (searchText) => {
    debugger;
    if (searchText === "") {
      form1.resetFields(['product', 'uom', 'recievingQty', 'BonusQty', 'poRate', 'discount', 'discountAmt', 'Batch', 'amount', 'taxAmount', 'totalAmount', 'replaceable']);
    } else {
      try {
        customAxios
          .get(`${urlAutocompleteProduct}?Product=${searchText}`)
          .then((response) => {
            const apiData = response.data.data;
            const newOptions = apiData.map((item) => ({
              value: item.LongName,
              key: item.ProductDefinitionId,
              UomId: item.UOMPrimaryUOM,
            }));
            setAutoCompleteOptions(newOptions);
          });
      } catch (error) {
        // Handle the error as needed
      }
    }
  };

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
    debugger;
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

  const onOkModal = async () => {
    debugger;
    await form2.validateFields();
    const values = form2.getFieldsValue();
    const valuesArray = Object.values(values);
    const qty = valuesArray.reduce((total, item) => item ? total + (item.Quantity || 0) : total, 0);
    if (qty <= batchRecord.ReceivedQty) {
      const updatedBatch = dataModel.map(item => {
        const key = item.key;
        if (values[key] != undefined) {
          if (values[key].Quantity || values[key].EXPDate || values[key].BatchMrp) {
            return {
              ...item,
              ProductId: batchRecord.ProductId,
              UomId: batchRecord.UomId,
              BarCode: values[key].BarCode,
              Quantity: values[key].Quantity,
              BatchBonusQty: values[key].BatchBonusQty,
              MFGDate: values[key].MFGDate,
              BatchNo: values[key].BatchNo,
              EXPDate: values[key].EXPDate,
              rate: values[key].rate,
              MRP: values[key].BatchMrp,
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
      setDataModel(updatedBatch);
      setModalVisible(false);
    } else {
      message.warning('Quantity must not be Greater than Recieved Quantity')
    }
  };

  const onFinishModel = (values) => {
    debugger;
    const deliveries = [];
    // if(form1.getFieldValue([recordKeys, 'recievingQty']) != form2.getFieldValue())
    for (let i = 0; i <= idCounterModel; i++) {
      const delivery = {
        BarCode: values[i].barcode === undefined ? null : values[i].barcode,
        BatchNo: values[i].batchnumber,
        BatchBonusQty: values[i].BonusQty,
        TaxType1: values[i].cgst === undefined ? 0 : values[i].cgst,
        TaxAmount1: values[i].cgstamt,
        DiscountAmount: values[i].discountamt,
        EXPDate: values[i].expdate,
        DiscountRate: values[i].mdiscount,
        MFGDate: values[i].mfgdate,
        MRP: values[i].mrp,
        Quantity: values[i].quantity,
        Rate: values[i].rate,
        TaxType2: values[i].sgst === undefined ? 0 : values[i].sgst,
        TaxAmount2: values[i].sgstamt,
        StockLocator: 0,
      };
      deliveries.push(delivery);
      setDelivery(deliveries);
      setIsModalOpen(false);
    }
  };

  const onCancelModel = () => {
    debugger;
    // form2.resetFields();    
    setModalVisible(false);
  };

  const handleCancel = () => {
    const url = "/DirectGRN";
    navigate(url);
    // form1.resetFields();
    // form2.resetFields();
    // setDelivery([]);
    // setData([]);
    // for (let i = idCounter; i > 0; i--) {
    //   handleDelete(i);
    // }
  };

  const handleOpenModal = async (value, record) => {
    debugger
    // const fieldNames = form1.getFieldsValue()
    // const fieldsToValidate = Object.keys(fieldNames).filter(fieldName => fieldName !== record.key, ProductName);
    record.BonusQty = form1.getFieldValue([record.key, 'BonusQty'])
    await form1.validateFields(['StoreId', [record.key, 'UomId'], [record.key, 'ProductName'], [record.key, 'ReceivedQty'], [record.key, 'PoRate']]);
    setBatchRecord(record);
    setModalVisible(true);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleToDirectGRN = () => {
    const url = "/DirectGRN";
    navigate(url);
  };

  const handleDelete = (record) => {
    debugger;
    const newData = data.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setData(newData);
    const newDataModel = dataModel.map((item) => {
      if (item.ProductId === record.ProductId) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setDataModel(newDataModel)
    const totalAmount = calculateTotalAmount(newData);

    form1.setFieldsValue({
      Amount: totalAmount,
      totalpoAmount: totalAmount,
    });
  };

  const ModelDelete = (record) => {
    debugger;
    const newData = dataModel.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setDataModel(newData);
  };

  // const handleInputChange = (value, option, key) => {
  //   setInputValues((prevState) => ({ ...prevState, [key]: value }));
  // };

  const handleOnFinish = async (values) => {
    debugger;
    const isAnyIdNotNull = dataModel.some(item => item.ProductId !== '' && item.ActiveFlag);
    const va = form1.getFieldsValue();
    if (isAnyIdNotNull) {
      if (values.InvoiceAmount === values.totalpoAmount) {
        const products = [];
        for (let i = 0; i <= idCounter; i++) {
          if (data[i] !== undefined) {
            const product = {
              ProductId: data[i].ProductId,
              UomId: data[i].UomId,
              ReceivedQty: data[i].ReceivedQty,
              BonusQuantity: data[i].BonusQty ?? 0,
              PoRate: data[i].PoRate,
              DiscountRate: data[i].DiscountRate == '' || data[i].DiscountRate == null || data[i].DiscountRate == undefined ? 0 : data[i].DiscountRate,
              DiscountAmount: data[i].DiscountAmount ?? 0,
              TaxAmount1: data[i].TaxAmount == '' || data[i].TaxAmount == undefined ? 0 : data[i].TaxAmount,
              TotalAmount: data[i].LineAmount,
              Replaceable: data[i].Replaceable === true || data[i].Replaceable == 'Y' ? 'Y' : 'N',
              LineAmount: data[i].LineAmount,
              PoLineId: data[i].PoLineId == null ? 0 : data[i].PoLineId,
              GrnLineId: data[i].GrnLineId == '' || data[i].GrnLineId == null || data[i].GrnLineId == undefined ? 0 : data[i].GrnLineId,
              ActiveFlag: data[i].ActiveFlag
            };
            products.push(product);
          }
        }

        const DirectGRN = {
          SupplierId: values.SupplierList,
          StoreId: values.StoreDetails,
          DocumentType: values.DocumentType,
          DCChallanDate: values.DCChallanDate,
          GRNDate: values.GRNDate,
          InvoiceDate: values.InvoiceDate,
          ReceivingDate: values.RecievingDate,
          RoundOff: values.RoundOff,
          InvoiceNumber: values.InvoiceNumber,
          DCChallanNumber: values.DCChallanNumber,
          Remarks: values.Remarks ?? null,
          GRNStatus: values.GRNStatus == '' || values.GRNStatus == undefined ? "Created" : values.GRNStatus,
          InvoiceAmount: values.InvoiceAmount,
          TotalAmount: values.Amount,
          TotalPoAmount: values.totalpoAmount,
          TaxAmount1: values.gstTax ?? 0,
          GRNHeaderId: values.GRNHeaderId,
          PoHeaderId: values.PoHeaderId
        };
        const postData = {
          newGRNAgainstPOModel: DirectGRN,
          GRNAgainstPODetails: products,
          BatchDetails: dataModel === undefined ? [] : dataModel,
        };
        if (grnHeaderId == 0) {
          // const response = await customAxios.post(
          //   urlAddNewGRNDirect,
          //   postData,
          //   {
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //   }
          // );
          if (response.status == 200) {
            message.success("GRN Created Successfully");
            handleCancel();
          } else {
            message.error("Something went wrong");
          }
        } else {
          // const response = await customAxios.post(
          //   urlUpdateGRNDirect,
          //   postData,
          //   {
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //   }
          // );
          if (response.status == 200) {
            message.success("GRN Updated Successfully");
            handleCancel();
          } else {
            message.error("Something went wrong");
          }
        }
        onCancelModel();
      } else {
        message.warning("Failure!Invoice Amount should match with Total Po Amount.");
      }
    } else {
      message.warning("Please add Batch details");
    }
  };

  const handleSelect = (value, option, column, record) => {
    debugger;
    form1.setFieldsValue({ [record.key]: { ProductId: option.key } })
    const newData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = { ...item, [column]: option.key, LongName: option.value, UomId: option.UomId, ProductId: option.key };
        return updatedItem;
      }
      return item;
    });
    setData(newData);
  };

  // useEffect(
  //   () => {
  //     console.log(selectedUom);
  //     console.log(selectedUomText); // log the current state
  //   },
  //   [selectedUom],
  //   [selectedUomText]
  // ); // run this effect whenever selectedUom changes

  const handleAdd = async () => {
    const fieldNames = form1.getFieldsValue()
    setProductOptions([]);
    const fieldsToValidate = Object.keys(fieldNames).filter(fieldName => fieldName !== 'InvoiceAmount');
    await form1.validateFields(fieldsToValidate);
    setData([
      ...data,
      {
        key: idCounter,
        ProductName: "",
        UomId: "",
        GrnLineId: '',
        ReceivedQty: "",
        BonusQty: '',
        PoRate: "",
        DiscountRate: "",
        DiscountAmount: "",
        Batch: "",
        LineAmount: "",
        TaxAmount: "",
        TotalAmount: "",
        Replaceable: true,
        ActiveFlag: true,
      },
    ]);
    setCounter(idCounter + 1);
  };

  const handleSearch = async (searchText) => {
    debugger
    if (searchText) {
      const response = await customAxios.get(
        `${urlAutocompleteProduct}?Product=${searchText}`
      );
      const apiData = response.data.data;
      const newOptions = apiData.map((item) => ({
        value: item.LongName,
        key: item.ProductDefinitionId,
        UomId: item.UOMPrimaryUOM
      }));
      setProductOptions(newOptions);
    }
  };

  const handleUomChange = (option, column, index, record) => {
    debugger;
    const newData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = { ...item, [column]: option.value, ShortName: option.children };
        return updatedItem;
      }
      return item;
    });
    setData(newData);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "ProductName",
      fixed: "left",
      key: "ProductName",
      width: 350,
      render: (text, record, index) => (
        <>
          <Form.Item
            name={[record.key, 'ProductName']}
            rules={[{ required: true, message: "Required" }]}
            initialValue={record.LongName == undefined ? record.ProductName : record.LongName}
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
              disabled={!!grnHeaderId && record.GrnLineId}
            />
          </Form.Item>
          <Form.Item hidden name={[record.key, 'ProductId']} initialValue={record.ProductId}><Input defaultValue={record.ProductId}></Input></Form.Item>
          <Form.Item hidden name={[record.key, 'PoLineId']} initialValue={record.PoLineId}><Input defaultValue={record.PoLineId}></Input></Form.Item>
          <Form.Item hidden name={[record.key, 'GrnLineId']} initialValue={record.GrnLineId}><Input defaultValue={record.GrnLineId}></Input></Form.Item>
        </>
      ),
    },
    {
      title: "UOM",
      dataIndex: "UomId",
      key: "UomId",
      width: 150,
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, 'UomId']}
          rules={[{ required: true, message: "Required" }]}
          initialValue={record.ShortName == undefined ? record.UomId : record.ShortName}
        >
          <Select defaultValue={text}
            onChange={(value, option) =>
              handleUomChange(option, "UomId", index, record)
            }
          >
            {DropDown.UOM.map((option) => (
              <Option key={option.UomId} value={option.UomId}>
                {option.ShortName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Recieved Qty",
      dataIndex: "ReceivedQty",
      width: 110,
      key: "ReceivedQty",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, 'ReceivedQty']}
          initialValue={text == 0 ? undefined : text}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }}
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
      ),
    },
    {
      title: "Bonus Qty",
      dataIndex: "BonusQuantity",
      width: 100,
      key: "BonusQuantity",
      render: (text, record) => (
        <Form.Item name={[record.key, 'BonusQuantity']} initialValue={record.BonusQuantity} style={{ width: "100%" }}>
          <InputNumber min={0} defaultValue={record.BonusQuantity} />
        </Form.Item>
      ),
    },
    {
      title: "PO Rate",
      dataIndex: "PoRate",
      width: 100,
      key: "PoRate",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, 'PoRate']}
          initialValue={text == 0 ? undefined : text}
          rules={[
            {
              required: true,
              message: 'require'
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }}
            onChange={(value) => {
              handleInputChange(
                { target: { value } },
                "PoRate",
                index,
                record
              );
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Discount%",
      dataIndex: "DiscountRate",
      width: 100,
      key: "DiscountRate",
      render: (text, record, index) => (
        <Form.Item name={[record.key, 'DiscountRate']} initialValue={text}>
          <InputNumber min={0} style={{ width: "100%" }} defaultValue={text}
            onChange={(value) => {
              handleInputChange(
                { target: { value } },
                "DiscountRate",
                index,
                record
              );
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Discount Amount",
      dataIndex: "DiscountAmount",
      width: 120,
      key: "DiscountAmount",
      render: (text, record) => (
        <Form.Item name={[record.key, 'DiscountAmount']} initialValue={text}>
          <InputNumber disabled style={{ width: "100%" }} defaultValue={text} />
        </Form.Item>
      ),
    },
    {
      title: "Batch",
      dataIndex: "Batch",
      width: 100,
      key: "Batch",
      render: (value, record) => (
        <Button type="link" onClick={() => handleOpenModal(value, record)}>
          Batch
        </Button>
      ),
    },
    {
      title: "Amount",
      dataIndex: "LineAmount",
      width: 100,
      key: "LineAmount",
      render: (text, record) => (
        <Form.Item name={[record.key, 'LineAmount']} initialValue={record.LineAmount}>
          <InputNumber min={0} style={{ width: "100%" }} disabled defaultValue={record.LineAmount} />
        </Form.Item>
      ),
    },
    {
      title: "Tax Amount",
      dataIndex: "TaxAmount1",
      width: 100,
      key: "TaxAmount1",
      render: (text, record) => (
        <Form.Item name={[record.key, 'TaxAmount1']} initialValue={text}>
          <InputNumber min={0} style={{ width: "100%" }} disabled defaultValue={text} />
        </Form.Item>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "TotalAmount",
      width: 100,
      key: "TotalAmount",
      render: (text, record) => (
        <Form.Item name={[record.key, 'TotalAmount']} initialValue={record.LineAmount}>
          <InputNumber disabled style={{ width: "100%" }} defaultValue={record.LineAmount} />
        </Form.Item>
      ),
    },
    {
      title: "Replaceable",
      dataIndex: "Replaceable",
      width: 100,
      key: "Replaceable",
      render: (text, record) => (
        <Form.Item name={[record.key, 'Replaceable']} initialValue={text} valuePropName='checked'>
          <Checkbox defaultValue={text}></Checkbox>
        </Form.Item>
      ),
    },
    {
      title: (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        ></Button>
      ),
      dataIndex: "add",
      key: "add",
      width: 50,
      render: (text, record, index) => (
        <Popconfirm
          title="Are you sure you want to delete this record?"
          onConfirm={() => handleDelete(record)}
        >
          <Button
            size="small"
            danger
            icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
          ></Button>
        </Popconfirm>
      ),
    },
  ];

  const ModelAdd = async () => {
    debugger;
    await form2.validateFields();
    setDataModel([
      ...dataModel,
      {
        key: idCounterModel,
        BarCode: '',
        BatchNo: '',
        BatchQty: 0,
        UomId: '',
        BatchBonusQty: 0,
        MFGDate: '',
        EXPDate: '',
        rate: 0,
        BatchMrp: 0,
        DiscountRate: 0,
        BatchTaxType1: '',
        BatchTaxAmount1: 0,
        BatchTaxType2: '',
        BatchTaxAmount1: 0,
        BatchStockLocator: '',
        ProductId: '',
        UomId: '',
        GrnBatchId: 0,
        ActiveFlag: true,
      },
    ]);
    setCounterModel(idCounterModel + 1);
  };

  const columnsModel = [
    {
      title: "Bar Code",
      dataIndex: "BarCode",
      key: "BarCode",
      width: 100,
      render: (_, record) => (
        <>
          <Form.Item name={[record.key, 'BarCode']} style={{ width: "100%" }} initialValue={record.BarCode}>
            <InputNumber min={0} defaultValue={record.BarCode} disabled={!!grnHeaderId && record.GrnBatchId} />
          </Form.Item>
          <Form.Item name={[record.key, 'GrnBatchId']} hidden initialValue={record.GrnBatchId}><Input></Input></Form.Item>
          <Form.Item name={[record.key, 'GrnLineId']} hidden initialValue={record.GrnLineId}><Input></Input></Form.Item>
        </>
      ),
    },
    {
      title: "Batch Number",
      dataIndex: "BatchNo",
      width: 100,
      key: "BatchNo",
      render: (text, record) => {
        return (
          <Form.Item style={{ width: "100%" }}
            initialValue={record.BatchNo}
            name={[record.key, 'BatchNo']}
            rules={[
              {
                required: true,
                message: "input!",
              },
            ]}
          >
            <Input allowClear style={{ width: 100 }} defaultValue={record.BatchNo} disabled={!!grnHeaderId && record.GrnBatchId} />
          </Form.Item>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      width: 100,
      key: "Quantity",
      render: (text, record) => (
        <Form.Item
          initialValue={record.Quantity}
          name={[record.key, 'Quantity']}
          style={{ width: "100%" }}
          rules={[
            {
              required: true,
              message: "input!",
            },
          ]}
        >
          <InputNumber min={0} disabled={!!grnHeaderId && record.GrnBatchId} />
        </Form.Item>
      ),
    },
    {
      title: "Bonus Qty",
      dataIndex: "BatchBonusQty",
      width: 100,
      key: "BatchBonusQty",
      render: (text, record) => (
        <Form.Item
          // name={["bonusqty", record.key]}
          name={[record.key, 'BatchBonusQty']}
          initialValue={batchRecord.BonusQty == undefined ? record.BatchBonusQty : batchRecord.BonusQty}
          style={{ width: 100 }}
        >
          <InputNumber min={0} style={{ width: 100 }} defaultValue={batchRecord.BonusQty} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Uom",
      dataIndex: "UomId",
      key: "UomId",
      width: 100,
      render: (text, record) => {
        <Form.Item name={[record.key, 'UomId']}>
          {batchRecord.ShortName}
        </Form.Item>;
      },
    },
    {
      title: "MFG Date",
      dataIndex: "MFGDate",
      width: 100,
      key: "MFGDate",
      render: (text, record) => (
        <Form.Item name={[record.key, 'MFGDate']} initialValue={record.MFGDate == '' || record.MFGDate == null ? '' : DateBindtoDatepicker(record.MFGDate)}>
          <DatePicker format="DD-MM-YYYY" disabled={!!grnHeaderId && record.GrnBatchId}
            // value={record.MFGDate && dayjs(record.MFGDate, "DD-MM-YYYY")} 
            style={{ width: 100 }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Exp Date",
      dataIndex: "EXPDate",
      key: "EXPDate",
      width: 100,
      render: (text, record) => (
        <Form.Item
          initialValue={record.EXPDate == null || record.EXPDate == '' ? '' : DateBindtoDatepicker(record.EXPDate)}
          name={[record.key, 'EXPDate']}
          rules={[
            {
              required: true,
              message: "input!",
            },
          ]}
        >
          <DatePicker format="DD-MM-YYYY" disabled={!!grnHeaderId && record.GrnBatchId} style={{ width: 100 }} />
        </Form.Item>
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      width: 100,
      render: (text, record) => (
        <Form.Item
          // name={["rate", record.key]}
          name={[record.key, 'rate']}
          initialValue={batchRecord.PoRate}
        >
          <InputNumber min={0} style={{ width: 100 }} disabled defaultValue={batchRecord.PoRate} />
        </Form.Item>
      ),
    },
    {
      title: "MRP",
      dataIndex: "MRP",
      key: "MRP",
      width: 100,
      render: (text, record) => (
        <Form.Item
          name={[record.key, 'MRP']}
          initialValue={record.MRP}
          rules={[
            {
              required: true,
              message: "input!",
            },
          ]}
        >
          <InputNumber min={0} style={{ width: 100 }} allowClear defaultValue={record.MRP} disabled={!!grnHeaderId && record.GrnBatchId} />
        </Form.Item>
      ),
    },
    {
      title: "Discount",
      dataIndex: "DiscountRate",
      key: "DiscountRate",
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'DiscountRate']} initialValue={batchRecord.DiscountRate}>
          <InputNumber min={0} style={{ width: 100 }} disabled defaultValue={batchRecord.DiscountRate} />
        </Form.Item>
      ),
    },
    {
      title: "Discount Amt",
      dataIndex: "DiscountAmount",
      key: "DiscountAmount",
      width: 100,
      render: (text, record) => (
        <Form.Item
          // name={["discountamt", record.key]}
          name={[record.key, 'DiscountAmount']}
          initialValue={batchRecord.DiscountAmount}
        >
          <InputNumber min={0} style={{ width: 100 }} disabled defaultValue={batchRecord.DiscountAmount} />
        </Form.Item>
      ),
    },
    {
      title: "CGST",
      dataIndex: "TaxType1",
      key: "TaxType1",
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'TaxType1']}>
          <Select disabled style={{ width: 100 }}></Select>
        </Form.Item>
      ),
    },
    {
      title: "CGST Amount",
      dataIndex: "TaxAmount1",
      key: "TaxAmount1",
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'TaxAmount1']}>
          <InputNumber min={0} style={{ width: 100 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "SGST",
      dataIndex: "TaxType2",
      key: "TaxType2",
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'TaxType2']}>
          <Select disabled style={{ width: 100 }}></Select>
        </Form.Item>
      ),
    },
    {
      title: "SGST Amount",
      dataIndex: "TaxAmount2",
      key: "TaxAmount2",
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'TaxAmount2']}>
          <InputNumber min={0} style={{ width: 100 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Stock Locator",
      dataIndex: "StockLocator",
      key: "StockLocator",
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, 'StockLocator']} initialValue='Manual'>
          <Input disabled={!!grnHeaderId && record.GrnBatchId} style={{ width: 100 }} />
        </Form.Item>
      ),
    },
    {
      title: (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={ModelAdd}
        ></Button>
      ),
      dataIndex: "add",
      key: "add",
      width: 50,
      render: (text, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => ModelDelete(record)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
      //<Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>
    },
  ];

  return (
    <Layout style={{ zIndex: "999999999" }}>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <Row
          style={{
            padding: "0.5rem 2rem 0.5rem 2rem",
            backgroundColor: "#40A2E3",
            borderRadius: "10px 10px 0px 0px ",
          }}
        >
          <Col span={16}>
            <Title
              level={4}
              style={{
                color: "white",
                fontWeight: 500,
                margin: 0,
                paddingTop: 0,
              }}
            >
              Create Direct GRN
            </Title>
          </Col>
          <Col offset={6} span={2}>
            <Button
              icon={<LeftOutlined />}
              style={{ marginBottom: 0 }}
              onClick={handleToDirectGRN}
            >
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
            maxWidth: 1500,
          }}
          form={form1}
          initialValues={{
            GRNDate: dayjs(),
            DCChallanDate: dayjs(),
            RecievingDate: dayjs(),
            InvoiceDate: dayjs(),
            Replaceable: true,
            RoundOff: 0,
            gstTax: 0,
            totalpoAmount: 0,
            Amount: 0,
          }}
        >
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ padding: "1rem 2rem", marginBottom: "0" }}
            align="Bottom"
          >
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  label="Supplier"
                  name="SupplierId"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear placeholder="Select Value" disabled={!!grnHeaderId}>
                    {/* <Select.Option key={0} value='Select Value'></Select.Option> */}
                    {DropDown.SupplierList.map((option) => (
                      <Select.Option
                        key={option.VendorId}
                        value={option.VendorId}
                      >
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name='GRNHeaderId' hidden><Input></Input></Form.Item>
                <Form.Item name='PoHeaderId' hidden><Input></Input></Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={5}>
              <div>
                <Form.Item
                  label="Recieving Store"
                  name="StoreId"
                  // style={{ marginLeft: '10px' }}
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear placeholder="Select Value" disabled={!!grnHeaderId}>
                    {/* <Select.Option key={0} value='Select Value'></Select.Option> */}
                    {DropDown.StoreDetails.map((option) => (
                      <Select.Option
                        key={option.StoreId}
                        value={option.StoreId}
                      >
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={5}>
              <div>
                <Form.Item
                  label="Document Type"
                  name="DocumentType"
                  // style={{ marginLeft: '10px' }}
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear placeholder="Select Value" disabled={!!grnHeaderId}>
                    {/* <Select.Option key={0} value='Select Value'></Select.Option> */}
                    {DropDown.DocumentType.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={3}>
              <div>
                <Form.Item label="GRN Date" name="GRNDate">
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={3}>
              <div>
                <Form.Item label="GRN Status" name="GRNStatus">
                  <Select allowClear placeholder="Select Value">
                    <Select.Option key="Draft" value="Draft"></Select.Option>
                    <Select.Option
                      key="Finalize"
                      value="Finalize"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={2}>
              <div>
                <Form.Item name="Submit" style={{ marginTop: "30px" }}>
                  <Checkbox>Submit</Checkbox>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  label="Invoice Number"
                  name="InvoiceNumber"
                  // style={{ marginLeft: '10px' }}
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} type="text"></Input>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={5}>
              <div>
                <Form.Item
                  label="Invoice Date"
                  name="InvoiceDate"
                  // style={{ marginLeft: '10px' }}
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    allowClear /*onChange={onChange}*/
                  />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={5}>
              <div>
                <Form.Item
                  label="Invoice Amount"
                  name="InvoiceAmount"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <InputNumber allowClear style={{ width: '100%' }} />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={8}>
              <div>
                <Form.Item label="Remarks" name="Remarks">
                  <TextArea autoSize allowClear />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="DC Challan Number" name="DCChallanNumber">
                  <Input type="text"></Input>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={5}>
              <div>
                <Form.Item label="DC Challan Date" name="DCChallanDate">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    allowClear
                  />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={5}>
              <div>
                <Form.Item
                  label="Recieving Date"
                  name="RecievingDate"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row justify="end" style={{ padding: "0rem 1rem" }}>
            <Col style={{ marginRight: "10px" }}>
              <Form.Item>
                <Button
                  type="primary"
                  loading={isSearchLoading}
                  htmlType="submit"
                >
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
          <Divider style={{ marginTop: "0" }}></Divider>
          <Table columns={columns} dataSource={data.filter((item) => item.ActiveFlag !== false)} scroll={{ x: 2000 }} />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "16px",
              float: "right",
            }}
          >
            <Form.Item
              label="Amount"
              name="TotalAmount"
              style={{ marginRight: "16px", width: 100 }}
            >
              <InputNumber min={0} disabled />
            </Form.Item>
            <Form.Item
              label="GST Tax"
              name="TaxAmount1"
              style={{ marginRight: "16px", width: 100 }}
            >
              <InputNumber min={0} disabled />
            </Form.Item>
            <Form.Item
              label="Round Off"
              name="RoundOff"
              style={{ marginRight: "16px", width: 100 }}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              label="Total PO Amount"
              name="TotalPoAmount"
              style={{ width: 150 }}
            >
              <InputNumber min={0} disabled />
            </Form.Item>
          </div>
        </Form>
        <ConfigProvider
          theme={{
            token: {
              zIndexPopupBase: 3000,
            },
          }}
        >
          <Modal
            title="Basic Modal"
            onOk={onOkModal}
            onCancel={onCancelModel}
            width={1500}
            open={modalVisible}
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
              // initialValues={{
              //   remember: true,
              // }}
              onFinish={onFinishModel}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form2}
            // initialValues={{
            //   [idCounterModel]: {
            //     BonusQty: 0,
            //     mdiscount: 0,
            //     discountamt: 0,
            //     cgstamt: 0,
            //     sgstamt: 0,
            //   },
            // }}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    label="Product"
                    name="Product"
                  >
                    <Tag color="blue">
                      {batchRecord.LongName == undefined ? batchRecord.ProductName : batchRecord.LongName}
                    </Tag>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    label="Recieved Quantity"
                    name="RecievedQty"
                  >
                    <Tag color="blue">
                      {batchRecord.ReceivedQty}
                    </Tag>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    label="Bonus Quantity"
                    name="BonusQuantity">
                    <Tag color="blue">
                      {batchRecord.BonusQty ? batchRecord.BonusQty : 0}
                    </Tag>
                  </Form.Item>
                </Col>
              </Row>
              {/* <Table
                scroll={{
                  x: 2500,
                }}
                columns={columnsModel}
                dataSource={dataModel}
              /> */}
              <Table columns={columnsModel} size="small"
                dataSource={batchRecord.ProductId
                  ? dataModel.filter(item => item.ProductId == batchRecord.ProductId && item.ActiveFlag || item.ProductId == '' && item.ActiveFlag)
                  : initialModelDataSource}
                scroll={{ x: 2000 }} />
            </Form>
          </Modal>
        </ConfigProvider>
      </div>
    </Layout>
  );
};

export default CreateDirectGRN;
