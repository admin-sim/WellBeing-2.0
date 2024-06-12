import customAxios from "../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
import {
  urlCreatePurchaseOrder,
  urlAutocompleteProduct,
  urlGetProductDetailsById,
  urlAddNewGRNDirect,
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
import { LeftOutlined } from "@ant-design/icons";
//import Typography from 'antd/es/typography';
import { useNavigate } from "react-router";
import { Table, InputNumber } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
//import { Calculate } from '@mui/icons-material';

const CreateDirectGRN = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: [],
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
  const [productLineId, setProductLineId] = useState(0);
  const [selecetdUomText, setSelecetdUomText] = useState({});
  const [mrp, setMrp] = useState();
  // const tableRef = useRef(null);

  useEffect(() => {
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
    if (idCounter === 0) {
      handleAdd();
      ModelAdd();
    }
  }, []);

  const getPanelValue = async (searchText) => {
    debugger;
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
  };
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
        console.log("Validation error:", error);
      });
  };
  const onFinishModel = (values) => {
    debugger;
    const deliveries = [];
    for (let i = 0; i <= idCounterModel; i++) {
      const delivery = {
        BarCode: values[i].barcode === undefined ? null : values[i].barcode,
        BatchNo: values[i].batchnumber,
        BatchBonusQty: values[i].bonusqty,
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
    form2.resetFields();
    for (let i = idCounterModel; i > 0; i--) {
      ModelDelete(i);
    }
    setIsModalOpen(false);
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

  const ModelOpen = (value, record) => {
    debugger;
    form1
      .validateFields()
      .then(() => {
        // If validation succeeds, submit the form
        setRecordKeys(record.key);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.log("Validation error:", error);
      });
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
    const newData = data.filter(
      (item) =>
        item.key !== (record.key === undefined ? record.toString() : record.key)
    );
    Object.keys(fields).forEach((fieldName) => {
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
    const newData = dataModel.filter(
      (item) =>
        item.key !== (record.key === undefined ? record.toString() : record.key)
    );
    Object.keys(fields).forEach((fieldName) => {
      if (fieldName.startsWith(`${record.key}.`)) {
        form2.resetFields([fieldName]);
      }
    });
    setDataModel(newData);
  };

  const handleInputChange = (value, option, key) => {
    setInputValues((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleOnFinish = async (values) => {
    debugger;
    if (delivery.length > 0) {
      setIsSearchLoading(true);
      const products = [];
      for (let i = 0; i <= idCounter; i++) {
        if (values[i] !== undefined) {
          const product = {
            ProductId: productIds[i],
            UomId: values[i].uom,
            ReceivedQty: values[i].recievingQty,
            BonusQuantity: values[i].bounsQty === "" ? 0 : values[i].bounsQty,
            PoRate:
              values[i].poRate === undefined ? 0 : values[i].poRate.toFixed(4),
            DiscountRate:
              values[i].discount === undefined
                ? 0
                : values[i].discount.toFixed(4),
            DiscountAmount:
              values[i].discountAmt === undefined
                ? 0
                : parseFloat(values[i].discountAmt).toFixed(4),
            // DiscountAmount: values[i].discountAmt === "" ? 0 : (form1.getFieldValue([i, 'discountAmt'])).toFixed(4),
            TaxAmount1:
              values[i].taxAmount === "" ? 0 : values[i].taxAmount.toFixed(4),
            TotalAmount:
              values[i].totalAmount === "" ? 0 : values[i].totalAmount,
            Replaceable:
              values[i].replaceable === undefined
                ? "true"
                : values[i].cgstAmt.toFixed(4),
            LineAmount: values[i].amount === undefined ? 0 : values[i].amount,
          };
          products.push(product);
        }
      }

      const DirectGRN = {
        SupplierId:
          values.SupplierList === undefined ? "" : values.SupplierList,
        StoreId: values.StoreDetails === undefined ? "" : values.StoreDetails,
        DocumentType:
          values.DocumentType === undefined ? "" : values.DocumentType,
        DCChallanDate: values.DCChallanDate,
        GRNDate: values.GRNDate,
        InvoiceDate: values.InvoiceDate,
        ReceivingDate: values.RecievingDate,
        RoundOff: values.RoundOff,
        // gstTax: values.gstTax,
        InvoiceNumber: values.InvoiceNumber,
        DCChallanNumber:
          values.DCChallanNumber === undefined ? null : values.DCChallanNumber,
        Remarks: values.Remarks === undefined ? null : values.Remarks,
        GRNStatus:
          values.GRNStatus === undefined ? "Created" : values.GRNStatus,
        InvoiceAmount:
          values.InvoiceAmount === undefined ? null : values.InvoiceAmount,
        Amount: values.Amount === undefined ? null : values.Amount,
        TotalPoAmount:
          values.totalpoAmount === undefined ? null : values.totalpoAmount,
        TaxAmount1: values.gstTax === undefined ? 0 : values.gstTax,
      };
      const postData = {
        newGRNAgainstPOModel: DirectGRN,
        GRNAgainstPODetails: products,
        BatchDetails: delivery === undefined ? [] : delivery,
      };
      try {
        const response = await customAxios.post(urlAddNewGRNDirect, postData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        form1.resetFields();
      } catch (error) {
        // Handle error
      }
      setIsSearchLoading(false);
      onCancelModel();
    } else {
      message.warning("Please add Batch details");
    }
  };

  const handleSelect = (value, option, key) => {
    debugger;
    try {
      customAxios
        .get(`${urlGetProductDetailsById}?ProductId=${option.key}`)
        .then((response) => {
          debugger;
          const apiData = response.data.data;
          if (apiData.PORate != null) {
            form1.setFieldsValue({ [key]: { poRate: apiData.PORate.PoRate } });
            // form1.setFieldsValue({ [key]: { expectedMRP: apiData.PORate.MrpExpected } });
          }
          //   let qty = 0;
          //   if (apiData.Stock.length > 0) {
          //     apiData.Stock.forEach(value => {
          //       qty += value.Quantity
          //     })
          //   }
          //   form1.setFieldsValue({ [key]: { avlQty: qty } });
          //   form1.setFieldsValue({ [key]: { discountAmt: 0 } });
          //   form1.setFieldsValue({ [key]: { amount: 0 } });
          //   form1.setFieldsValue({ [key]: { totalAmount: 0 } });
        });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);
    }
    // Update the product value in the form
    form1.setFieldsValue({ [key]: { product: value } });
    setProductIds((prevState) => ({ ...prevState, [key]: option.key }));
    setSelectedProductId((prevState) => {
      const newState = { ...prevState, [key]: option.key };
      return newState;
    });

    // form1.setFieldsValue({option});
    // Set the selected UOM based on the selected product
    const matchingUom = DropDown.UOM.find(
      (uomOption) => uomOption.UomId === option.UomId
    );
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

  useEffect(
    () => {
      console.log(selectedUom);
      console.log(selectedUomText); // log the current state
    },
    [selectedUom],
    [selectedUomText]
  ); // run this effect whenever selectedUom changes

  const handleAdd = () => {
    setCounter(idCounter + 1);
    // if (shouldValidate) { //first time going to add row without validation, call from use useEffect
    //     // If shouldValidate is true, then perform form validation
    //     form1
    //         .validateFields()
    //         .then(() => {
    //             const newRow = {
    //                 key: idCounter.toString(),
    //                 product: '',
    //                 uom: '',
    //                 poQty: '',
    //                 bounsQty: '',
    //                 poRate: '',
    //                 discount: '',
    //                 discountAmt: '',
    //                 expectedMRP: '',
    //                 cgst: '',
    //                 cgstAmt: '',
    //                 sgst: '',
    //                 sgstAmt: '',
    //                 amount: '',
    //                 totalAmount: '',
    //                 avlQty: '',
    //                 deliverySchedule: ''
    //             }; // Define your new row data here
    //             setData([...data, newRow]);
    //         })
    // } else {
    const newRow = {
      key: idCounter.toString(),
      product: "",
      uom: "",
      recievingQty: "",
      bounsQty: "",
      poRate: "",
      discount: "",
      discountAmt: "",
      Batch: "",
      amount: "",
      taxAmount: "",
      totalAmount: "",
      replaceable: "",
    };
    setData([...data, newRow]);
    setShouldValidate(true);
    // }
  };

  const columns = [
    {
      title: "Product",
      width: 250,
      dataIndex: "product",
      key: "product",
      render: (_, record) => (
        <Form.Item
          name={[record.key, "product"]}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <AutoComplete
            style={{ width: "100%" }}
            options={autoCompleteOptions}
            onSearch={getPanelValue}
            onSelect={(value, option) =>
              handleSelect(value, option, record.key)
            }
            placeholder="Search for a product"
            allowClear
          />
        </Form.Item>
      ),
    },
    {
      title: "UOM",
      width: 100,
      dataIndex: "uom",
      key: "uom",
      render: (text, record) => (
        <Form.Item name={[record.key, "uom"]}>
          <Select
            value={selectedUom[record.key]}
            style={{ width: "100%" }}
            onChange={(option) => handleSelectChange(record.key, option)}
          >
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
      title: "Recieving Qty",
      dataIndex: "recievingQty",
      width: 110,
      key: "recievingQty",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "recievingQty"]}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
      ),
    },
    {
      title: "Bonus Qty",
      dataIndex: "bounsQty",
      width: 100,
      key: "bounsQty",
      render: (text, record) => (
        <Form.Item name={[record.key, "bounsQty"]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "PO Rate",
      dataIndex: "poRate",
      width: 100,
      key: "poRate",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "poRate"]}
          initialValue={text}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Discount%",
      dataIndex: "discount",
      width: 100,
      key: "discount",
      render: (text, record) => (
        <Form.Item name={[record.key, "discount"]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Discount Amount",
      dataIndex: "discountAmt",
      width: 120,
      key: "discountAmt",
      render: (text, record) => (
        <Form.Item name={[record.key, "discountAmt"]}>
          <InputNumber disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Batch",
      dataIndex: "Batch",
      width: 100,
      key: "Batch",
      render: (value, record) => (
        <Button type="link" onClick={() => ModelOpen(value, record)}>
          Batch
        </Button>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 100,
      key: "amount",
      render: (text, record) => (
        <Form.Item name={[record.key, "amount"]}>
          <InputNumber min={0} style={{ width: "100%" }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Tax Amount",
      dataIndex: "taxAmount",
      width: 100,
      key: "taxAmount",
      render: (text, record) => (
        <Form.Item name={[record.key, "taxAmount"]}>
          <InputNumber min={0} style={{ width: "100%" }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      width: 100,
      key: "totalAmount",
      render: (text, record) => (
        <Form.Item name={[record.key, "totalAmount"]}>
          <InputNumber disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Replaceable",
      dataIndex: "replaceable",
      width: 100,
      key: "replaceable",
      render: (text, record) => (
        <Form.Item name={[record.key, "replaceable"]}>
          <Checkbox></Checkbox>
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
      render: (text, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
      //<Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>
    },
  ];
  const ModelAdd = () => {
    debugger;
    setCounterModel(idCounterModel + 1);
    // if (shouldValidateModel) {
    //     form2
    //         .validateFields()
    //         .then(() => {
    //             const newRow = {
    //                 key: counter.toString(),
    //                 barcode: '',
    //                 batchnumber: '',
    //                 quantity: '',
    //                 muom: '',
    //                 bonusqty: '',
    //                 mfgdate: '',
    //                 expdate: '',
    //                 rate: '',
    //                 mrp: '',
    //                 discountamt: '',
    //                 cgst: '',
    //                 cgstamt: '',
    //                 sgst: '',
    //                 sgstamt: '',
    //                 stocklocator: '',
    //             };
    //             setDataModel([...dataModel, newRow]);
    //             setCounter(idCounterModel + 1);
    //         })
    // } else {
    const newRow = {
      key: idCounterModel.toString(),
      barcode: "",
      batchnumber: "",
      quantity: "",
      bonusqty: "",
      muom: "",
      mfgdate: "",
      expdate: "",
      rate: "",
      mrp: "",
      mdiscount: "",
      discountamt: "",
      cgst: "",
      cgstamt: "",
      sgst: "",
      sgstamt: "",
      stocklocator: "",
    };
    setDataModel([...dataModel, newRow]);
    setShouldValidateModel(true);
    // }
  };

  const columnsModel = [
    {
      title: "Bar Code",
      dataIndex: "barcode",
      key: "barcode",
      width: 180,
      render: (_, record) => (
        <Form.Item name={[record.key, "barcode"]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Batch Number",
      dataIndex: "batchnumber",
      width: 100,
      key: "batchnumber",
      render: (text, record) => {
        return (
          <Form.Item
            name={[record.key, "batchnumber"]}
            style={{ width: "150%" }}
            rules={[
              {
                required: true,
                message: "input!",
              },
            ]}
          >
            <Input style={{ width: "100%" }} allowClear />
          </Form.Item>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 100,
      key: "quantity",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "quantity"]}
          style={{ width: "150%" }}
          rules={[
            {
              required: true,
              message: "input!",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
    {
      title: "Bonus Qty",
      dataIndex: "bonusqty",
      width: 100,
      key: "bonusqty",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "bonusqty"]}
          initialValue={form1.getFieldValue([productLineId, "BonusQty"])}
          style={{ width: "150%" }}
        >
          <InputNumber min={0} style={{ width: 50 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Uom",
      dataIndex: "muom",
      key: "muom",
      render: (text, record) => {
        debugger;
        const recordKeyAsNumber = parseInt(recordKeys);
        const uoms = selectedUomText[recordKeyAsNumber];
        <Form.Item
          name={[record.key, "muom"]}
          initialValue={selectedUomId[recordKeyAsNumber]}
        >
          <Tag color="blue">{uoms}</Tag>
        </Form.Item>;
      },
    },
    {
      title: "MFG Date",
      dataIndex: "mfgdate",
      key: "mfgdate",
      render: (text, record) => (
        <Form.Item name={[record.key, "mfgdate"]}>
          <DatePicker format="DD-MM-YYYY" />
        </Form.Item>
      ),
    },
    {
      title: "Exp Date",
      dataIndex: "expdate",
      key: "expdate",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "expdate"]}
          rules={[
            {
              required: true,
              message: "input!",
            },
          ]}
        >
          <DatePicker format="DD-MM-YYYY" />
        </Form.Item>
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "rate"]}
          initialValue={form1.getFieldValue([productLineId, "poRate"])}
        >
          <InputNumber min={0} style={{ width: 50 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "MRP",
      dataIndex: "mrp",
      key: "mrp",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "mrp"]}
          initialValue={mrp}
          rules={[
            {
              required: true,
              message: "input!",
            },
          ]}
        >
          <InputNumber min={0} style={{ width: 50 }} allowClear />
        </Form.Item>
      ),
    },
    {
      title: "Discount",
      dataIndex: "mdiscount",
      key: "mdiscount",
      render: (text, record) => (
        <Form.Item name={[record.key, "mdiscount"]}>
          <InputNumber min={0} style={{ width: 50 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Discount Amt",
      dataIndex: "discountamt",
      key: "discountamt",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "discountamt"]}
          initialValue={form1.getFieldValue([productLineId, "discountAmt"])}
        >
          <InputNumber min={0} style={{ width: 50 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "CGST",
      dataIndex: "cgst",
      key: "cgst",
      render: (text, record) => (
        <Form.Item name={[record.key, "cgst"]}>
          <Select disabled></Select>
        </Form.Item>
      ),
    },
    {
      title: "CGST Amount",
      dataIndex: "cgstamt",
      key: "cgstamt",
      render: (text, record) => (
        <Form.Item name={[record.key, "cgstamt"]}>
          <InputNumber min={0} style={{ width: 50 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "SGST",
      dataIndex: "sgst",
      key: "sgst",
      render: (text, record) => (
        <Form.Item name={[record.key, "sgst"]}>
          <Select disabled></Select>
        </Form.Item>
      ),
    },
    {
      title: "SGST Amount",
      dataIndex: "sgstamt",
      key: "sgstamt",
      render: (text, record) => (
        <Form.Item name={[record.key, "sgstamt"]}>
          <InputNumber min={0} style={{ width: 50 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Stock Locator",
      dataIndex: "stocklocator",
      key: "stocklocator",
      render: (text, record) => (
        <Form.Item name={[record.key, "stocklocator"]}>
          <Input style={{ width: 60 }} />
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
            [idCounter]: {
              bounsQty: 0,
            },
          }}
          onValuesChange={(changedValues, allValues) => {
            debugger;
            for (let i = 0; i < 9; i++) {
              if (changedValues[i] !== undefined) {
                if (changedValues[i].product !== undefined) {
                  getPanelValue(form1.getFieldValue([i, "product"]));
                }
                const RecievingQty = allValues[i]["recievingQty"];
                const poRate = allValues[i]["poRate"];

                if (RecievingQty > 0 && poRate > 0) {
                  const total = RecievingQty * poRate;
                  // Update the total value in the form fields
                  if (allValues[i]["discount"] !== undefined) {
                    form1.setFieldsValue({
                      [i]: {
                        discountAmt: (
                          total *
                          (allValues[i]["discount"] / 100)
                        ).toFixed(2),
                      },
                    });
                    form1.setFieldsValue({
                      [i]: {
                        amount:
                          total - total * (allValues[i]["discount"] / 100),
                      },
                    });
                    form1.setFieldsValue({
                      [i]: {
                        totalAmount:
                          total - total * (allValues[i]["discount"] / 100),
                      },
                    });
                    form1.setFieldsValue({ [i]: { taxAmount: 0 } });
                  } else {
                    form1.setFieldsValue({ [i]: { amount: total } });
                    form1.setFieldsValue({ [i]: { totalAmount: total } });
                    form1.setFieldsValue({ [i]: { taxAmount: 0 } });
                  }
                }
                break;
              }
            }
            let totalAmount = 0;
            for (let j = 0; j < 10; j++) {
              if (allValues[j] !== undefined) {
                if (
                  allValues[j]["recievingQty"] > 0 &&
                  allValues[j]["poRate"] > 0
                ) {
                  const Amount = form1.getFieldValue([j, "amount"]);
                  totalAmount += Amount;
                }
              }
            }
            form1.setFieldsValue({ Amount: totalAmount });
            form1.setFieldsValue({ totalpoAmount: totalAmount });
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
                  name="SupplierList"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear placeholder="Select Value">
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
              </div>
            </Col>
            <Col className="gutter-row" span={5}>
              <div>
                <Form.Item
                  label="Recieving Store "
                  name="StoreDetails"
                  // style={{ marginLeft: '10px' }}
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear placeholder="Select Value">
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
                  <Select allowClear placeholder="Select Value">
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
                  <Input type="number"></Input>
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
                    allowClear /*onChange={onChange}*/
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

          <Divider style={{ marginTop: "0" }}></Divider>

          <Table columns={columns} dataSource={data} scroll={{ x: 2000 }} />
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
              name="Amount"
              style={{ marginRight: "16px", width: 100 }}
            >
              <InputNumber min={0} disabled />
            </Form.Item>
            <Form.Item
              label="GST Tax"
              name="gstTax"
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
              name="totalpoAmount"
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
            width={2000}
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
                width: "100%",
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinishModel}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form2}
              initialValues={{
                [idCounterModel]: {
                  bonusqty: 0,
                  mdiscount: 0,
                  discountamt: 0,
                  cgstamt: 0,
                  sgstamt: 0,
                },
              }}
            >
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Product"
                  name="Product"
                  initialValue={selectedProductId[recordKeys]}
                >
                  <Tag color="blue">
                    {form1.getFieldValue([recordKeys, "product"])}
                  </Tag>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Recieved Quantity"
                  name="RecievedQty"
                  initialValue={selectedProductId[recordKeys]}
                >
                  <Tag color="blue">
                    {form1.getFieldValue([recordKeys, "recievingQty"])}
                  </Tag>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Bonus Quantity"
                  name="BonusQuantity"
                  initialValue={selectedProductId[recordKeys]}
                >
                  <Tag color="blue">
                    {form1.getFieldValue([recordKeys, "bounsQty"])}
                  </Tag>
                </Form.Item>
              </Col>
              <Table
                scroll={{
                  x: 2000,
                }}
                columns={columnsModel}
                dataSource={dataModel}
              />
            </Form>
          </Modal>
        </ConfigProvider>
      </div>
    </Layout>
  );
};

export default CreateDirectGRN;
