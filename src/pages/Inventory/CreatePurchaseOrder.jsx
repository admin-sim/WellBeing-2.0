import customAxios from "../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
import {
  urlCreatePurchaseOrder,
  urlAutocompleteProduct,
  urlGetProductDetailsById,
  urlAddNewPurchaseOrder,
  urlEditPurchaseOrder,
  urlUpdatePurchaseOrder,
} from "../../../endpoints";
import Select from "antd/es/select";
import {
  ConfigProvider,
  Typography,
  Checkbox,
  Tag,
  Modal,
  Popconfirm,
  Spin,
  Col,
  Divider,
  Row,
  AutoComplete,
  message,
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
import { useLocation } from "react-router-dom";
import FormItem from "antd/es/form/FormItem/index.js";
//import { Calculate } from '@mui/icons-material';

const CreatePurchaseOrder = () => {
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

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');
  const [isLoading, setIsLoading] = useState(true);
  const [inputValues, setInputValues] = useState({});
  const [shouldValidate, setShouldValidate] = useState(false);
  const [selectedUom, setSelectedUom] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [shouldValidateModel, setShouldValidateModel] = useState(false);
  const [dataModel, setDataModel] = useState([]);
  const [selectedUomText, setSelectedUomText] = useState({});
  const [selectedProductId, setSelectedProductId] = useState({});
  const [selectedUomId, setSelectedUomId] = useState({});
  const [recordKeys, setRecordKeys] = useState();
  const fields = form1.getFieldsValue();
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [productIds, setProductIds] = useState({});
  const location = useLocation();
  const [poHeaderId, setPoHeaderId] = useState(location.state.PoHeaderId);
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [schedule, setSchedule] = useState();
  const [poQty, setPoQty] = useState();

  useEffect(() => {
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
      setIsLoading(false);
    });
    if (idCounter === 0) {
      ModelAdd();
      handleAdd();
    }
    if (poHeaderId > 0) {
      setButtonTitle("Update");
      debugger;
      customAxios
        .get(`${urlEditPurchaseOrder}?Id=${poHeaderId}`)
        .then((response) => {
          const apiData = response.data.data;
          if (apiData.newPurchaseOrderModel != null) {
            form1.setFieldsValue({ PoHeaderId: poHeaderId });
            form1.setFieldsValue({
              SupplierList: apiData.newPurchaseOrderModel.SupplierId,
            });
            form1.setFieldsValue({
              StoreDetails: apiData.newPurchaseOrderModel.ProcurementStoreId,
            });
            form1.setFieldsValue({
              DocumentType: apiData.newPurchaseOrderModel.DocumentType,
            });
            form1.setFieldsValue({
              Remarks: apiData.newPurchaseOrderModel.Remarks,
            });
            let dateForDatePicker = null;
            if (apiData.newPurchaseOrderModel.PoDate != null) {
              dateForDatePicker = DateBindtoDatepicker(
                apiData.newPurchaseOrderModel.PoDate
              );
            }
            form1.setFieldsValue({ PODate: dateForDatePicker });
            form1.setFieldsValue({
              POStatus:
                apiData.newPurchaseOrderModel.PoStatus === "Created"
                  ? undefined
                  : apiData.newPurchaseOrderModel.PoStatus,
            });
            form1.setFieldsValue({
              Amount: apiData.newPurchaseOrderModel.PoPurchaseValue,
            });
            form1.setFieldsValue({
              gstTax: apiData.newPurchaseOrderModel.PoTaxAmount,
            });
            form1.setFieldsValue({
              totalpoAmount: apiData.newPurchaseOrderModel.PoTotalAmount,
            });
          }
          if (apiData.PurchaseOrderDetails != null) {
            for (let i = 0; i < apiData.PurchaseOrderDetails.length; i++) {
              form1.setFieldsValue({
                [i]: { productId: apiData.PurchaseOrderDetails[i].ProductId },
              });
              form1.setFieldsValue({
                [i]: { product: apiData.PurchaseOrderDetails[i].ProductName },
              });
              form1.setFieldsValue({
                [i]: { uom: apiData.PurchaseOrderDetails[i].UomId },
              });
              form1.setFieldsValue({
                [i]: { poQty: apiData.PurchaseOrderDetails[i].PoQuantity },
              });
              form1.setFieldsValue({
                [i]: {
                  bounsQty: apiData.PurchaseOrderDetails[i].BonusQuantity,
                },
              });
              form1.setFieldsValue({
                [i]: { poRate: apiData.PurchaseOrderDetails[i].PoRate },
              });
              form1.setFieldsValue({
                [i]: { discount: apiData.PurchaseOrderDetails[i].DiscountRate },
              });
              form1.setFieldsValue({
                [i]: {
                  discountAmt: apiData.PurchaseOrderDetails[i].DiscountAmount,
                },
              });
              form1.setFieldsValue({
                [i]: {
                  expectedMRP: apiData.PurchaseOrderDetails[i].MrpExpected,
                },
              });
              form1.setFieldsValue({
                [i]: {
                  cgst:
                    apiData.PurchaseOrderDetails[i].TaxType1 === 0
                      ? null
                      : apiData.PurchaseOrderDetails[i].TaxType1,
                },
              });
              form1.setFieldsValue({
                [i]: { cgstAmt: apiData.PurchaseOrderDetails[i].TaxAmount1 },
              });
              form1.setFieldsValue({
                [i]: {
                  sgst:
                    apiData.PurchaseOrderDetails[i].TaxType2 === 0
                      ? null
                      : apiData.PurchaseOrderDetails[i].TaxType2,
                },
              });
              form1.setFieldsValue({
                [i]: { sgstAmt: apiData.PurchaseOrderDetails[i].TaxAmount2 },
              });
              form1.setFieldsValue({
                [i]: { amount: apiData.PurchaseOrderDetails[i].LineAmount },
              });
              form1.setFieldsValue({
                [i]: {
                  totalAmount: apiData.PurchaseOrderDetails[i].LineAmount,
                },
              });
              form1.setFieldsValue({
                [i]: {
                  avlQty: apiData.PurchaseOrderDetails[i].AvailableQuantity,
                },
              });
              form2.setFieldsValue({
                [i]: { uom: apiData.PurchaseOrderDetails[i].UomId },
              });
              form2.setFieldsValue({
                Product: apiData.PurchaseOrderDetails[i].ProductName,
              });
              form2.setFieldsValue({
                productId: apiData.PurchaseOrderDetails[i].ProductId,
              });
            }
          }
          if (apiData.DeliveryDetails != null) {
            for (let i = 0; i < apiData.DeliveryDetails.length; i++) {
              form2.setFieldsValue({
                [i]: {
                  datedelivery: DateBindtoDatepicker(
                    apiData.DeliveryDetails[i].DeliveryDate
                  ),
                },
              });
              form2.setFieldsValue({
                [i]: {
                  deliveryloc: apiData.DeliveryDetails[i].DeliveryLocation,
                },
              });
              form2.setFieldsValue({
                [i]: { quantity: apiData.DeliveryDetails[i].DeliveryQuantity },
              });
              form2.setFieldsValue({
                [i]: { poQty: apiData.DeliveryDetails[i].PoLineId },
              });
              form2.setFieldsValue({
                [i]: { bounsQty: apiData.DeliveryDetails[i].PoDeliveryId },
              });
            }
          }
        });
      setPoHeaderId(0);
    }
  }, []);

  const DateBindtoDatepicker = (value) => {
    const isoDateString = value;

    const dateValue = new Date(isoDateString);

    const formattedDate = dayjs(dateValue).format("DD-MM-YYYY");

    return dayjs(formattedDate, "DD-MM-YYYY");
  };

  const getPanelValue = async (searchText, key) => {
    debugger;
    if (searchText === "") {
      form1.setFieldsValue({ [key]: { uom: "" } });
      form1.setFieldsValue({ [key]: { poQty: "" } });
      form1.setFieldsValue({ [key]: { bounsQty: "" } });
      form1.setFieldsValue({ [key]: { poRate: "" } });
      form1.setFieldsValue({ [key]: { discountAmt: 0 } });
      form1.setFieldsValue({ [key]: { discount: "" } });
      form1.setFieldsValue({ [key]: { cgstAmt: 0 } });
      form1.setFieldsValue({ [key]: { sgstAmt: 0 } });
      form1.setFieldsValue({ [key]: { amount: 0 } });
      form1.setFieldsValue({ [key]: { totalAmount: 0 } });
      form1.setFieldsValue({ [key]: { avlQty: 0 } });
      form1.setFieldsValue({ [key]: { expectedMRP: "" } });
    }

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
      //console.error("Error fetching purchase order details:", error);
    }
  };

  const onOkModal = () => {
    debugger;
    form2
      .validateFields()
      .then(() => {
        form2.submit();
      })
      .catch((error) => {
        console.log("Validation error:", error);
      });
  };

  const onFinishModel = (values) => {
    debugger;
    const deliveries = [];
    for (let i = 0; i < idCounterModel; i++) {
      if (values[i] !== undefined) {
        const delivery = {
          DeliveryQuantity: values[i].quantity,
          UomId: values[i].uom,
          DeliveryDate: values[i].datedelivery,
          DeliveryLocation:
            values[i].deliveryloc === undefined ? null : values[i].deliveryloc,
          ProductId: values.productId,
        };
        deliveries.push(delivery);
      }
    }
    let Poqty = 0;
    for (let i = 0; i < idCounterModel; i++) {
      if (deliveries[i] !== undefined) {
        Poqty += deliveries[i].DeliveryQuantity;
      }
    }

    if (Poqty === poQty) {
      setSchedule(deliveries);
      setIsModalOpen(false);
    } else {
      message.warning("Quantity Must Equal to PO Quantity");
      return false;
    }
    onCancelModel();
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
    const url = "/purchaseOrder";
    navigate(url);
  };

  const ModelOpen = (value, record) => {
    debugger;
    form1
      .validateFields()
      .then(() => {
        setRecordKeys(record.key);
        setIsModalOpen(true);
        setPoQty(form1.getFieldValue([record.key, "poQty"]));
      })
      .catch((error) => {
        console.log("Validation error:", error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleToPurchaseOrder = () => {
    const url = "/purchaseOrder";
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
    setCounter(newData.length);
  };

  const ModelDelete = (record) => {
    debugger;
    const newData = dataModel.filter(
      (item) =>
        item.key !== (record.key === undefined ? record.toString() : record.key)
    );
    setDataModel(newData);
  };

  const handleInputChange = (value, option, key) => {
    setInputValues((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleOnFinish = async (values) => {
    debugger;
    // setIsSearchLoading(true);
    const products = [];
    for (let i = 0; i <= idCounter; i++) {
      if (values[i] !== undefined) {
        const product = {
          ProductId: productIds[i],
          UomId: values[i].uom,
          PoQuantity: values[i].poQty,
          BonusQuantity:
            values[i].bounsQty === undefined ? 0 : values[i].bounsQty,
          PoRate: values[i].poRate === undefined ? null : values[i].poRate,
          DiscountRate:
            values[i].discount === undefined ? 0 : values[i].discount,
          DiscountAmount:
            values[i].discountAmt === ""
              ? 0
              : parseFloat(values[i].discountAmt),
          MrpExpected:
            values[i].expectedMRP === undefined ? 0 : values[i].expectedMRP,
          TaxType1: values[i].cgst === undefined ? 0 : values[i].cgst,
          TaxAmount1: values[i].cgstAmt === "" ? 0 : values[i].cgstAmt,
          TaxType2: values[i].sgst === undefined ? 0 : values[i].sgst,
          TaxAmount2: values[i].sgstAmt === "" ? 0 : values[i].sgstAmt,
          LineAmount: values[i].amount === "" ? null : values[i].amount,
          PoTotalAmount:
            values[i].totalAmount === "" ? null : values[i].totalAmount,
          AvailableQuantity: values[i].avlQty === "" ? null : values[i].avlQty,
        };
        products.push(product);
      }
    }

    const purchaseOrder = {
      SupplierId: values.SupplierList === undefined ? "" : values.SupplierList,
      ProcurementStoreId:
        values.StoreDetails === undefined ? "" : values.StoreDetails,
      DocumentType:
        values.DocumentType === undefined ? "" : values.DocumentType,
      PurchaseDate: values.PODate,
      PoStatus: values.POStatus === undefined ? "Created" : values.POStatus,
      Remarks: values.Remarks === undefined ? null : values.Remarks,
      PoPurchaseValue: values.Amount === undefined ? null : values.Amount,
      PoTotalAmount:
        values.totalpoAmount === undefined ? null : values.totalpoAmount,
      PoTaxAmount: values.PoTaxAmount === undefined ? 0 : values.PoTaxAmount,
    };
    const postData = {
      newPurchaseOrderModel: purchaseOrder,
      PurchaseOrderDetails: products,
      Delivery: schedule === undefined ? [] : schedule,
    };
    try {
      if (values.PoHeaderId > 0) {
        // const response = await customAxios.post(urlUpdatePurchaseOrder, postData, {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        // form1.resetFields();
        handleCancel();
      } else {
        const response = await customAxios.post(
          urlAddNewPurchaseOrder,
          postData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        form1.resetFields();
        handleCancel();
      }
      // const response = await customAxios.post(urlAddNewPurchaseOrder, postData);
      // debugger;
      // form1.resetFields();
      // handleCancel();
    } catch (error) {
      // Handle error
    }
    // setIsSearchLoading(false);
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
            form1.setFieldsValue({
              [key]: { expectedMRP: apiData.PORate.MrpExpected },
            });
          }
          let qty = 0;
          if (apiData.Stock.length > 0) {
            apiData.Stock.forEach((value) => {
              qty += value.Quantity;
            });
          }
          form1.setFieldsValue({ [key]: { avlQty: qty } });
          form1.setFieldsValue({ [key]: { discountAmt: 0 } });
          form1.setFieldsValue({ [key]: { amount: 0 } });
          form1.setFieldsValue({ [key]: { totalAmount: 0 } });
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

    // // form1.setFieldsValue({option});
    // // Set the selected UOM based on the selected product
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
      setSelectedUom((prevState) => {
        const newState = { ...prevState, [key]: matchingUom.UomId };
        console.log(newState);
        return newState;
      });

      form1.setFieldsValue({ [key]: { uom: matchingUom.UomId } });
    } else {
      setSelectedUom((prevState) => {
        const newState = { ...prevState, [key]: null };
        console.log(newState);
        return newState;
      });

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
    //   // If shouldValidate is true, then perform form validation
    //   form1
    //     .validateFields()
    //     .then(() => {
    //       const newRow = {
    //         key: idCounter.toString(),
    //         product: '',
    //         uom: '',
    //         poQty: '',
    //         bounsQty: '',
    //         poRate: '',
    //         discount: '',
    //         discountAmt: '',
    //         expectedMRP: '',
    //         cgst: '',
    //         cgstAmt: '',
    //         sgst: '',
    //         sgstAmt: '',
    //         amount: '',
    //         totalAmount: '',
    //         avlQty: '',
    //         deliverySchedule: ''
    //       }; // Define your new row data here
    //       setData([...data, newRow]);
    //     })
    // } else {
    const newRow = {
      key: idCounter.toString(),
      product: "",
      uom: "",
      poQty: "",
      bounsQty: "",
      poRate: "",
      discount: "",
      discountAmt: "",
      expectedMRP: "",
      cgst: "",
      cgstAmt: "",
      sgst: "",
      sgstAmt: "",
      amount: "",
      totalAmount: "",
      avlQty: "",
      deliverySchedule: "",
    };
    setData([...data, newRow]);
    setShouldValidate(true);
    // }
  };

  const columns = [
    {
      title: "Product",
      // width: 15,
      dataIndex: "product",
      key: "product",
      render: (_, record) => (
        <>
          <Form.Item
            style={{ width: "250px" }}
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
              onSearch={(value) => getPanelValue(value, record.key)}
              onSelect={(value, option) =>
                handleSelect(value, option, record.key)
              }
              placeholder="Search for a product"
              allowClear
            />
          </Form.Item>
          <FormItem name="productId" hidden>
            <Input></Input>
          </FormItem>
        </>
      ),
    },
    {
      title: "UOM",
      //width: 110,
      dataIndex: "uom",
      key: "uom",
      render: (text, record) => (
        <Form.Item name={[record.key, "uom"]} style={{ width: "100%" }}>
          <Select
            value={selectedUom[record.key]}
            placeholder="Select Value"
            style={{ width: "100%" }}
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
      title: "PO Qty",
      dataIndex: "poQty",
      // width: 100,
      key: "poQty",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "poQty"]}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
          style={{ width: "100%" }}
        >
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
    {
      title: "Bonus Qty",
      dataIndex: "bounsQty",
      // width: 100,
      key: "bounsQty",
      render: (text, record) => (
        <Form.Item name={[record.key, "bounsQty"]} style={{ width: "100%" }}>
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
    {
      title: "PO Rate",
      dataIndex: "poRate",
      // width: 100,
      key: "poRate",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "poRate"]}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
          style={{ width: "100%" }}
        >
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
    {
      title: "Discount%",
      dataIndex: "discount",
      // width: 100,
      key: "discount",
      render: (text, record) => (
        <Form.Item name={[record.key, "discount"]} style={{ width: 100 }}>
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
    {
      title: "Discount Amount",
      dataIndex: "discountAmt",
      //width: 250,
      key: "discountAmt",
      render: (text, record) => (
        <Form.Item name={[record.key, "discountAmt"]}>
          <InputNumber disabled />
        </Form.Item>
      ),
    },
    {
      title: "ExpectedMRP",
      dataIndex: "expectedMRP",
      // width: 100,
      key: "expectedMRP",
      render: (text, record) => (
        <Form.Item name={[record.key, "expectedMRP"]} style={{ width: 100 }}>
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
    {
      title: "CGST",
      dataIndex: "cgst",
      // width: 100,
      key: "cgst",
      render: (text, record) => (
        <Form.Item name={[record.key, "cgst"]} style={{ width: 100 }}>
          <Select value={selectedUom[record.key]}>
            {DropDown.TaxType.map((option) => (
              <Select.Option key={option.LookupID} value={option.LookupID}>
                {option.LookupDescription}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "CGST Amount",
      dataIndex: "cgstAmt",
      // width: 100,
      key: "cgstAmt",
      render: (text, record) => (
        <Form.Item name={[record.key, "cgstAmt"]} style={{ width: 100 }}>
          <InputNumber disabled />
        </Form.Item>
      ),
    },
    {
      title: "SGST",
      dataIndex: "sgst",
      // width: 100,
      key: "sgst",
      render: (text, record) => (
        <Form.Item name={[record.key, "sgst"]} style={{ width: 100 }}>
          <Select value={selectedUom[record.key]}>
            {DropDown.TaxType.map((option) => (
              <Select.Option key={option.LookupID} value={option.LookupID}>
                {option.LookupDescription}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "SGST Amount",
      dataIndex: "sgstAmt",
      // width: 100,
      key: "sgstAmt",
      render: (text, record) => (
        <Form.Item name={[record.key, "sgstAmt"]} style={{ width: 100 }}>
          <InputNumber disabled />
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      // width: 100,
      key: "amount",
      render: (text, record) => (
        <Form.Item name={[record.key, "amount"]} style={{ width: 100 }}>
          <InputNumber disabled />
        </Form.Item>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      // width: 100,
      key: "totalAmount",
      render: (text, record) => (
        <Form.Item name={[record.key, "totalAmount"]} style={{ width: 100 }}>
          <InputNumber disabled />
        </Form.Item>
      ),
    },
    {
      title: "Avl Qty",
      dataIndex: "avlQty",
      // width: 100,
      key: "avlQty",
      render: (text, record) => (
        <Form.Item name={[record.key, "avlQty"]} style={{ width: 100 }}>
          <InputNumber disabled />
        </Form.Item>
      ),
    },
    {
      title: "Delivery Schedule",
      dataIndex: "deliverySchedule",
      width: 150,
      key: "deliverySchedule",
      render: (value, record) => (
        <Button type="link" onClick={() => ModelOpen(value, record)}>
          Delivery Schedule
        </Button>
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
    if (shouldValidateModel) {
      //first time going to add row without validation, call from use useEffect
      form2.validateFields().then(() => {
        const newRow = {
          key: idCounterModel.toString(),
          quantity: "",
          uom: "",
          datedelivery: "",
          deliveryloc: "",
        }; // Define your new row data here
        setDataModel([...dataModel, newRow]);
      });
    } else {
      const newRow = {
        key: idCounterModel.toString(),
        quantity: "",
        uom: "",
        datedelivery: "",
        deliveryloc: "",
      };
      setDataModel([...dataModel, newRow]);
      setShouldValidateModel(true);
    }
    //setIsTableReady(false);
  };

  const columnsModel = [
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => (
        <Form.Item
          style={{ width: 100 }}
          name={[record.key, "quantity"]}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
            // ({ getFieldValue }) => ({
            //   validator(_, value) {
            //     if (!value) {
            //       return Promise.resolve();
            //     }
            //     if (value === form1.getFieldValue([recordKeys, 'poQty'])) {
            //       return Promise.resolve();
            //     }
            //     return Promise.reject(new Error(`Quantity must be equal to PO Qty is ${form1.getFieldValue([recordKeys, 'poQty'])}!`));
            //   },
            // }),
          ]}
        >
          <InputNumber min={0} style={{ width: "150%" }} allowClear />
        </Form.Item>
      ),
    },
    {
      title: "UOM",
      // width: 150,
      dataIndex: "uom",
      key: "uom",
      render: (text, record) => {
        return (
          <>
            <Form.Item
              style={{ width: 100 }}
              name={[record.key, "uom"]}
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select disabled>
                {DropDown.UOM.map((option) => (
                  <Select.Option value={option.UomId} key={option.UomId}>
                    {option.LongName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <FormItem name="PoLineId" hidden>
              <Input></Input>
            </FormItem>
            <FormItem name="PoDeliveryId" hidden>
              <Input></Input>
            </FormItem>
          </>
        );
      },
    },
    {
      title: "Date of Delivery",
      dataIndex: "datedelivery",
      key: "datedelivery",
      render: (text, record) => (
        <Form.Item
          style={{ width: 200 }}
          name={[record.key, "datedelivery"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker style={{ width: "150%" }} format="DD-MM-YYYY" />
        </Form.Item>
      ),
    },
    {
      title: "Delivery Location",
      dataIndex: "deliveryloc",
      // width: 150,
      key: "deliveryloc",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "deliveryloc"]}
          initialValue={text}
          style={{ width: 200 }}
        >
          <Input style={{ width: "150%" }} allowClear />
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

  useEffect(() => {
    form2.setFieldsValue({
      [idCounterModel - 1]: {
        datedelivery: dayjs(),
        uom: form1.getFieldValue([idCounter - 1, "uom"]),
      },
    });
  }, [idCounterModel]);

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
              Create Purchase Order
            </Title>
          </Col>
          <Col offset={6} span={2}>
            <Button
              icon={<LeftOutlined />}
              style={{ marginBottom: 0 }}
              onClick={handleToPurchaseOrder}
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
            PODate: dayjs(),
            [idCounter]: {
              discountAmt: 0,
              totalAmount: 0,
              amount: 0,
              cgstAmt: 0,
              sgstAmt: 0,
            },
            totalpoAmount: 0.0,
            Amount: 0.0,
            gstTax: 0.0,
          }}
          onValuesChange={(changedValues, allValues) => {
            debugger;
            for (let i = 0; i < 9; i++) {
              if (changedValues[i] !== undefined) {
                if (changedValues[i].product !== undefined) {
                  getPanelValue(form1.getFieldValue([i, "product"]));
                }
                const poQty = allValues[i]["poQty"];
                const poRate = allValues[i]["poRate"];

                if (poQty !== "" && poRate !== "") {
                  const total = poQty * poRate;
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
                    // form1.setFieldsValue({ Amount: form1.getFieldValue('Amount') + (total - (total * (allValues[i]['discount'] / 100))) })
                  } else {
                    if (total > 0) {
                      form1.setFieldsValue({ [i]: { amount: total } });
                      form1.setFieldsValue({ [i]: { totalAmount: total } });
                    }
                  }
                }
                break;
              }
            }
            let totalAmount = 0;
            for (let j = 0; j < idCounter; j++) {
              if (allValues[j] !== undefined) {
                const Amount = form1.getFieldValue([j, "amount"]);
                totalAmount += Amount;
              }
            }
            form1.setFieldsValue({ Amount: totalAmount });
            form1.setFieldsValue({ totalpoAmount: totalAmount });
            // Assuming 'poQty' and 'poRate' are the names of the fields

            // Check if both values are valid numbers
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
                <FormItem name="PoHeaderId" hidden>
                  <Input></Input>
                </FormItem>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  label="Procurement Store"
                  name="StoreDetails"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear placeholder="Select Value">
                    {/* <Option value="">Select Value</Option> */}
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
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  label="Document Type"
                  name="DocumentType"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear placeholder="Select Value">
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
            <Col className="gutter-row" span={6}>
              <Form.Item label="Remarks" name="Remarks">
                <TextArea autoSize allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ padding: "0rem 2rem", marginTop: "0" }}
          >
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="PO Date" name="PODate">
                  <DatePicker
                    style={{ width: "100%" }}
                    disabled
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  label="PO Status"
                  name="POStatus"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please input!'
                  //   }
                  // ]}
                >
                  <Select allowClear placeholder="Select Value">
                    <Option value="Draft">Draft</Option>
                    <Option value="Finalize">Finalize</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col>
              <Form.Item name="SubmitCheck" style={{ marginTop: "30px" }}>
                <Checkbox>Submit</Checkbox>
              </Form.Item>
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
          <Table columns={columns} dataSource={data} scroll={{ x: 0 }} />
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
                width: "100%",
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinishModel}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form2}
              // initialValues={{
              //   [idCounterModel - 1]: {
              //     datedelivery: dayjs(),
              //   },
              // }}
              onValuesChange={(changedValues, allValues) => {
                debugger;
              }}
            >
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item
                    label="Product"
                    name="Product"
                    style={{ marginLeft: "10px" }}
                  >
                    <Tag color="blue"></Tag>
                  </Form.Item>
                  <FormItem hidden name="productId">
                    <Input></Input>
                  </FormItem>
                </div>
              </Col>
              <Table columns={columnsModel} dataSource={dataModel} />
            </Form>
          </Modal>
        </ConfigProvider>
      </div>
    </Layout>
  );
};

export default CreatePurchaseOrder;
