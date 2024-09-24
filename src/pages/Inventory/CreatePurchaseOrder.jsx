import {
  urlCreatePurchaseOrder,
  urlAutocompleteProduct,
  urlGetProductDetailsById,
  urlAddNewPurchaseOrder,
  urlEditPurchaseOrder,
  urlUpdatePurchaseOrder,
  urlGetTaxDetails
} from "../../../endpoints";
import Select from "antd/es/select";
import {
  ConfigProvider,
  Typography,
  Checkbox,
  Card,
  Modal,
  Popconfirm,
  Spin,
  Col,
  Divider,
  Row,
  AutoComplete,
  message,
  Button,
  Tag
} from "antd";
import Input from "antd/es/input";
import Form from "antd/es/form";
import { DatePicker } from "antd";
import Layout from "antd/es/layout/layout";
import {
  LeftOutlined,
  CloseSquareFilled,
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import PageHeader from "../../components/PageHeader/index.jsx";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { Table, InputNumber } from "antd";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import customAxios from "../../components/customAxios/customAxios";
import CustomTable from "../../components/customTable/index.jsx";

const CreatePurchaseOrder = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: [],
  });

  const [dropDownLoad, setDropDownLoad] = useState(true);

  const location = useLocation();
  const PoHeaderId = location.state.PoHeaderId;

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const navigate = useNavigate();

  const [counter, setCounter] = useState(2);
  const [counterDelivery, setCounterDelivery] = useState(2);
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [productOptions, setProductOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(dayjs());
  const [deliveryRecord, setDeliveryRecord] = useState([]);
  const [poStatus, setPoStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialDataSource =
    PoHeaderId === 0
      ? [
        {
          key: 1,
          ProductName: "",
          // ProductId: 0,
          PoLineId: 0,
          UomId: "",
          PoQuantity: "",
          BonusQuantity: "",
          PoRate: "",
          DiscountRate: "",
          DiscountAmount: 0,
          MrpExpected: "",
          TaxType1: "",
          TaxAmount1: 0,
          TaxType2: "",
          TaxAmount2: 0,
          LineAmount: 0,
          LineTotalAmount: 0,
          AvailableQuantity: "",
          deliverySchedule: "",
          LongName: "",
          ShortName: "",
          ActiveFlag: true,
        },
      ]
      : [];

  const [data, setData] = useState(initialDataSource);

  const initialDeliveryDataSource =
    PoHeaderId === 0
      ? [
        {
          key: 1,
          ProductId: "",
          UomId: "",
          PoDeliveryId: 0,
          DeliveryQuantity: "",
          DelDate: "",
          DeliveryLocation: "",
          ActiveFlag: true,
        },
      ]
      : [];

  const [schedule, setSchedule] = useState(initialDeliveryDataSource);

  useEffect(() => {
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
      setDropDownLoad(false);
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (PoHeaderId > 0) {
      setButtonTitle("Update");
      setLoading(true);
      try {
        const response = await customAxios.get(
          `${urlEditPurchaseOrder}?Id=${PoHeaderId}`
        );
        if (response.status == 200 && response.data.data != null) {
          const editeddata = response.data.data;
          const products = editeddata.PurchaseOrderDetails.map(
            (item, index) => ({
              ...item,
              key: index + 1,
              LineTotalAmount: item.LineAmount + (item.TaxAmount1 * 2)
            })
          );
          setData(products);
          const formdata = editeddata.newPurchaseOrderModel;

          form1.setFieldsValue({
            SupplierId: formdata.VendorId,
            StoreId: formdata.ProcurementStoreId,
            DocumentType: formdata.DocumentType,
            TotalAmount: formdata.PoPurchaseValue,
            PoTaxAmount: formdata.PoTaxAmount,
            TotalPoAmount: formdata.PoPurchaseValue,
          });
          setCounter(products.length + 1);
          const delivery = editeddata.DeliveryDetails.map((item, index) => ({
            ...item,
            key: index + 1,
          }));
          setCounterDelivery(editeddata.DeliveryDetails.length + 1);

          setSchedule(delivery);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  const handleCancel = () => {
    const url = "/purchaseOrder";
    navigate(url);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleOnFinish = async (values) => {
    const products = data
      .filter(item => item !== undefined)
      .map(item => ({
        ProductId: item.ProductId,
        UomId: item.UomId,
        PoQuantity: item.PoQuantity,
        BonusQuantity: item.BonusQuantity === "" ? 0 : item.BonusQuantity,
        PoRate: item.PoRate,
        DiscountRate: item.DiscountRate === "" ? 0 : item.DiscountRate,
        DiscountAmount: item.DiscountAmount,
        MrpExpected: item.MrpExpected === "" ? 0 : item.MrpExpected,
        TaxType1: item.TaxType1 === "" ? 0 : item.TaxType1,
        TaxAmount1: item.TaxAmount1,
        TaxType2: item.TaxType2 === "" ? 0 : item.TaxType2,
        TaxAmount2: item.TaxAmount2,
        LineAmount: item.LineAmount,
        PoTotalAmount: item.LineTotalAmount,
        AvailableQuantity: item.AvailableQuantity === "" ? 0 : item.AvailableQuantity,
        PoLineId: item.PoLineId,
        ActiveFlag: item.ActiveFlag,
      }));

    const purchaseOrder = {
      PoHeaderId: values.PoHeaderId,
      SupplierId: values.SupplierId,
      ProcurementStoreId: values.StoreId,
      DocumentType: values.DocumentType,
      PurchaseDate: values.PODate ? values.PODate.format('DD-MM-YYYY') : '',
      PoStatus: poStatus ? values.PoStatus : "Created",
      Remarks: values.Remarks,
      PoPurchaseValue: values.TotalAmount,
      PoTotalAmount: values.TotalPoAmount,
      PoTaxAmount: values.PoTaxAmount === undefined ? 0 : values.PoTaxAmount,
    };

    const activeData = schedule.filter(item => item.ProductId);

    const activeProducts = products.filter(item => item.ActiveFlag === true && item.ProductId);
    if (activeProducts.length === 0) {
      message.warning("Please Add Product");
      return false;
    }

    const postData = {
      newPurchaseOrderModel: purchaseOrder,
      PurchaseOrderDetails: PoHeaderId === 0 ? activeProducts : products.filter(item => item.ProductId),
      Delivery: PoHeaderId === 0 ? activeData.filter(item => item.ActiveFlag === true) : activeData,
    };

    const url = PoHeaderId === 0 ? urlAddNewPurchaseOrder : urlUpdatePurchaseOrder;
    const response = await customAxios.post(url, postData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const successMessage = PoHeaderId === 0 ? "Purchase Order Created Successfully" : "Purchase Order Updated Successfully";
      message.success(successMessage);
      setLoading(false);
      handleCancel();
    } else {
      message.error("Something went wrong");
    }
  };

  const handleToPurchaseOrder = () => {
    const url = "/purchaseOrder";
    navigate(url);
  };

  const handleAddRow = async () => {
    setProductOptions([]);
    await form1.validateFields();
    setData([
      ...data,
      {
        key: counter,
        ProductName: "",
        // ProductId: 0,
        PoLineId: 0,
        UomId: "",
        PoQuantity: "",
        BonusQuantity: "",
        PoRate: "",
        DiscountRate: "",
        DiscountAmount: 0,
        MrpExpected: "",
        TaxType1: "",
        TaxAmount1: 0,
        TaxType2: "",
        TaxAmount2: 0,
        LineAmount: 0,
        LineTotalAmount: 0,
        AvailableQuantity: "",
        deliverySchedule: "",
        ActiveFlag: true,
      },
    ]);
    setCounter(counter + 1);
  };

  const handleAddDelivery = async () => {
    await form2.validateFields();
    setSchedule([
      ...schedule,
      {
        key: counterDelivery,
        ProductId: "",
        UomId: "",
        PoDeliveryId: 0,
        DeliveryQuantity: "",
        DelDate: "",
        DeliveryLocation: "",
        ActiveFlag: true,
      },
    ]);
    setCounterDelivery(counterDelivery + 1);
  };

  const handleSearch = async (searchText) => {
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

  function calculateTotalAmount(data) {
    let LineAmount = 0;
    let LineTotalAmount = 0;
    let TotalTax = 0
    data.forEach((item) => {
      if (
        item.ActiveFlag &&
        !isNaN(item.LineAmount) &&
        item.LineAmount !== null &&
        item.LineAmount !== undefined
      ) {
        LineAmount += parseFloat(item.LineAmount)
        TotalTax += 2 * parseFloat(item.TaxAmount1)
        LineTotalAmount += parseFloat(item.LineTotalAmount)
      }
    });
    const total = {
      LineAmount: LineAmount,
      TaxAmount: TotalTax,
      LineTotalAmount: LineTotalAmount
    }
    return total;
  }

  const handleSelect = (value, option, column, record) => {
    customAxios
      .get(`${urlGetProductDetailsById}?ProductId=${option.key}`)
      .then((response) => {
        const apiData = response.data.data;
        form1.setFieldsValue({ [record.key]: { ProductId: option.key } });
        const newData = data.map((item) => {
          if (item.key === record.key) {
            const updatedItem = {
              ...item,
              [column]: option.key,
              LongName: option.value,
              UomId: option.UomId,
              ProductId: option.key,
              PoRate: apiData.PORate !== null ? apiData.PORate.PoRate : 0,
              Uom: apiData.UOMPrimaryUOMname
            };
            return updatedItem;
          }
          return item;
        });
        setData(newData);
        form1.setFieldsValue({ [record.key]: { UomId: option.UomId } })
      });
  };

  // const showTaxamount = (value, record, Id) => {
  //   let POQty = record.PoQuantity ? record.PoQuantity : 0
  //   let PORate = record.PoRate
  //   let BonusQty = record.BonusQuantity ? record.BonusQuantity : 0
  //   let DiscountAmount = record.DiscountAmount
  //   let POAmount = (POQty * PORate) - DiscountAmount;
  //   let MRP = record.MrpExpected ? record.MrpExpected : 0
  //   let temp = 0; var temp1 = 0;
  //   let Amount = POAmount;
  //   form1.setFieldsValue({ [record.key]: { TaxType2: value } });

  //   let TaxAmount = 0;
  //   let TotalTax = 0
  //   customAxios.get(`${urlGetTaxDetails}?AdditionalChargeId=${value}`)
  //     .then((response) => {
  //       const apiData = response.data.data;
  //       if (apiData != null && apiData.length > 0) {
  //         const newData = apiData.map((item) => {
  //           if (item.IncludeBonusQuantity == true) {
  //             POQty = POQty = form1.getFieldValue([record.key, 'PoQuantity']);
  //             POQty = parseInt(POQty) + parseInt(BonusQty);
  //             Amount = (POQty * PORate) - DiscountAmount;
  //           }

  //           if (item.ChargeType == "Percentage" && item.AdditionalChargeType == "Tax(Exclusive)" && item.AdditionalChargeIndicator == "Gross") {
  //             TaxAmount = (parseInt(Amount) + parseInt(DiscountAmount)) * item.ChargeValue / 100;
  //           }

  //           else if (item.ChargeType == "Percentage" && item.AdditionalChargeType == "Tax(Exclusive)" && item.AdditionalChargeIndicator == "Net") {
  //             TaxAmount = Amount * item.ChargeValue / 100;
  //           }

  //           else if (item.ChargeType == "Percentage" && item.AdditionalChargeType == "Tax(Exclusive)" && item.AdditionalChargeIndicator == "MRP") {
  //             TaxAmount = (parseInt(MRP) * parseInt(POQty)) * item.ChargeValue / 100;
  //           }

  //           else if (item.ChargeType == "Amount" && item.AdditionalChargeType == "Tax(Exclusive)" && item.AdditionalChargeIndicator == "Gross") {
  //             TaxAmount = (parseInt(Amount) + parseInt(DiscountAmount)) + parseInt(item.ChargeValue);
  //           }

  //           else if (item.ChargeType == "Amount" && item.AdditionalChargeType == "Tax(Exclusive)" && item.AdditionalChargeIndicator == "Net") {
  //             TaxAmount = parseInt(Amount) + parseInt(item.ChargeValue);
  //           }

  //           else if (item.ChargeType == "Amount" && item.AdditionalChargeType == "Tax(Exclusive)" && item.AdditionalChargeIndicator == "MRP") {
  //             TaxAmount = (MRP * POQty) + parseInt(item.ChargeValue);
  //           }

  //           else if (item.ChargeType == "Percentage" && item.AdditionalChargeType == "Tax(Inclusive)" && item.AdditionalChargeIndicator == "Gross") {
  //             TaxAmount = (parseInt(Amount) + parseInt(DiscountAmount)) - ((parseInt(Amount) + parseInt(DiscountAmount)) / (1 + item.ChargeValue / 100));
  //             temp = 1;
  //           }

  //           else if (item.ChargeType == "Percentage" && item.AdditionalChargeType == "Tax(Inclusive)" && item.AdditionalChargeIndicator == "Net") {
  //             TaxAmount = Amount - (Amount / (1 + item.ChargeValue / 100));
  //             temp = 1;
  //           }

  //           else if (item.ChargeType == "Percentage" && item.AdditionalChargeType == "Tax(Inclusive)" && item.AdditionalChargeIndicator == "MRP") {
  //             TaxAmount = (MRP * POQty) - ((MRP * POQty) / (1 + item.ChargeValue / 100));
  //             temp = 1;
  //           }

  //           else if (item.ChargeType == "Amount" && item.AdditionalChargeType == "Tax(Inclusive)" && item.AdditionalChargeIndicator == "Gross") {
  //             TaxAmount = (parseInt(Amount) + parseInt(DiscountAmount)) - item.ChargeValue;
  //             temp = 1;
  //           }

  //           else if (item.ChargeType == "Amount" && item.AdditionalChargeType == "Tax(Inclusive)" && item.AdditionalChargeIndicator == "Net") {
  //             TaxAmount = Amount - item.ChargeValue;
  //             temp = 1;
  //           }

  //           else if (item.ChargeType == "Amount" && item.AdditionalChargeType == "Tax(Inclusive)" && item.AdditionalChargeIndicator == "MRP") {
  //             TaxAmount = (MRP * POQty) - item.ChargeValue;
  //             temp = 1;
  //           }
  //           TaxAmount = parseFloat(TaxAmount);

  //           if (Id === 1) {
  //             form1.setFieldsValue({ [record.key]: { TaxAmount1: parseFloat(TaxAmount).toFixed(4) } });
  //             form1.setFieldsValue({ [record.key]: { TaxAmount2: parseFloat(TaxAmount).toFixed(4) } });
  //             // var Amount1 = parseFloat(record.TaxAmount2).toFixed(4);
  //           } else {
  //             form1.setFieldsValue({ [record.key]: { TaxAmount2: parseFloat(TaxAmount).toFixed(4) } });
  //             // var Amount1 = parseFloat(record.TaxAmount1).toFixed(4);
  //           }

  //           if (temp == 1) {
  //             form1.setFieldsValue({ [record.key]: { LineAmount: parseFloat(POAmount - TaxAmount * 2).toFixed(4) } });
  //             form1.setFieldsValue({ [record.key]: { LineTotalAmount: POAmount } });
  //             record.LineAmount = parseFloat(POAmount - TaxAmount * 2).toFixed(4)
  //             record.LineTotalAmount = POAmount
  //           } else {
  //             form1.setFieldsValue({ [record.key]: { LineAmount: POAmount } });
  //             form1.setFieldsValue({ [record.key]: { LineTotalAmount: parseFloat(parseFloat(POAmount) + parseFloat(TaxAmount * 2)).toFixed(4) } });
  //             record.LineAmount = POAmount
  //             record.LineTotalAmount = parseFloat(parseFloat(POAmount) + parseFloat(TaxAmount * 2).toFixed(4))
  //           }
  //           const newData1 = data.map((i) => {
  //             if (record.key === i.key) {
  //               return {
  //                 ...i,
  //                 TaxType1: value,
  //                 TaxType2: value,
  //                 TaxAmount1: parseFloat(TaxAmount).toFixed(4),
  //                 TaxAmount2: parseFloat(TaxAmount).toFixed(4)
  //               }
  //             }
  //             return i
  //           })
  //           setData(newData1)
  //           const totalAmount = calculateTotalAmount(newData1)
  //           TotalTax = 2 * newData1
  //             .filter(i => i.ActiveFlag === true)
  //             .reduce((sum, i) => sum + parseFloat(i.TaxAmount1), 0)
  //           form1.setFieldsValue({
  //             TotalAmount: totalAmount.LineAmount,
  //             PoTaxAmount: parseFloat(totalAmount.TaxAmount).toFixed(4),
  //             TotalPoAmount: totalAmount.LineTotalAmount,
  //           });
  //         })
  //       }
  //     })
  // }

  const handleInputChange = (e, column, index, record) => {
    debugger
    let newData;
    if (["PoQuantity", "PoRate", "DiscountRate", 'TaxType1', 'BonusQuantity'].includes(column)) {
      newData = data.map((item1) => {
        if (item1.key === record.key) {
          const updatedItem = { ...item1, [column]: e.target.value };

          const poQuantity = column === "PoQuantity" ? e.target.value : item1.PoQuantity;
          const poRate = column === "PoRate" ? e.target.value : item1.PoRate;
          const discountRate = column === "DiscountRate" ? e.target.value : item1.DiscountRate;
          const bonusQuantity = column === "BonusQuantity" ? e.target.value : item1.BonusQuantity;
          const taxType1 = column === "TaxType1" ? e.target.value : item1.TaxType1;
          // if (taxType1) {
          let POQty = poQuantity ? poQuantity : 0
          let PORate = poRate
          let BonusQty = bonusQuantity ? bonusQuantity : 0
          let DiscountAmount = record.DiscountAmount
          let POAmount = (POQty * PORate) - DiscountAmount;
          let MRP = record.MrpExpected ? record.MrpExpected : 0
          let temp = 0;
          let Amount = POAmount;
          form1.setFieldsValue({ [record.key]: { TaxType2: taxType1 } });

          let TaxAmount = 0;

          let discountAmount = 0;
          let amount = 0;
          if (poRate != null && poQuantity != null) {
            const discount = discountRate != null ? discountRate : 0;
            discountAmount = (poRate * poQuantity * discount) / 100;
            amount = poRate * poQuantity - discountAmount;
          }

          if (taxType1) {
            customAxios.get(`${urlGetTaxDetails}?AdditionalChargeId=${taxType1}`)
              .then((response) => {
                const apiData = response.data.data;
                if (apiData != null && apiData.length > 0) {
                  const item = apiData[0]
                  if (item.IncludeBonusQuantity == true) {
                    POQty = POQty = form1.getFieldValue([record.key, 'PoQuantity']);
                    POQty = parseInt(POQty) + parseInt(BonusQty);
                    Amount = (POQty * PORate) - DiscountAmount;
                  }

                  if (item.ChargeType == "Percentage" && item.AdditionalChargeType == "Tax(Exclusive)" && item.AdditionalChargeIndicator == "Gross") {
                    TaxAmount = (parseInt(Amount) + parseInt(DiscountAmount)) * item.ChargeValue / 100;
                  }

                  else if (item.ChargeType == "Percentage" && item.AdditionalChargeType == "Tax(Exclusive)" && item.AdditionalChargeIndicator == "Net") {
                    TaxAmount = Amount * item.ChargeValue / 100;
                  }

                  else if (item.ChargeType == "Percentage" && item.AdditionalChargeType == "Tax(Exclusive)" && item.AdditionalChargeIndicator == "MRP") {
                    TaxAmount = (parseInt(MRP) * parseInt(POQty)) * item.ChargeValue / 100;
                  }

                  else if (item.ChargeType == "Amount" && item.AdditionalChargeType == "Tax(Exclusive)" && item.AdditionalChargeIndicator == "Gross") {
                    TaxAmount = (parseInt(Amount) + parseInt(DiscountAmount)) + parseInt(item.ChargeValue);
                  }

                  else if (item.ChargeType == "Amount" && item.AdditionalChargeType == "Tax(Exclusive)" && item.AdditionalChargeIndicator == "Net") {
                    TaxAmount = parseInt(Amount) + parseInt(item.ChargeValue);
                  }

                  else if (item.ChargeType == "Amount" && item.AdditionalChargeType == "Tax(Exclusive)" && item.AdditionalChargeIndicator == "MRP") {
                    TaxAmount = (MRP * POQty) + parseInt(item.ChargeValue);
                  }

                  else if (item.ChargeType == "Percentage" && item.AdditionalChargeType == "Tax(Inclusive)" && item.AdditionalChargeIndicator == "Gross") {
                    TaxAmount = (parseInt(Amount) + parseInt(DiscountAmount)) - ((parseInt(Amount) + parseInt(DiscountAmount)) / (1 + item.ChargeValue / 100));
                    temp = 1;
                  }

                  else if (item.ChargeType == "Percentage" && item.AdditionalChargeType == "Tax(Inclusive)" && item.AdditionalChargeIndicator == "Net") {
                    TaxAmount = Amount - (Amount / (1 + item.ChargeValue / 100));
                    temp = 1;
                  }

                  else if (item.ChargeType == "Percentage" && item.AdditionalChargeType == "Tax(Inclusive)" && item.AdditionalChargeIndicator == "MRP") {
                    TaxAmount = (MRP * POQty) - ((MRP * POQty) / (1 + item.ChargeValue / 100));
                    temp = 1;
                  }

                  else if (item.ChargeType == "Amount" && item.AdditionalChargeType == "Tax(Inclusive)" && item.AdditionalChargeIndicator == "Gross") {
                    TaxAmount = (parseInt(Amount) + parseInt(DiscountAmount)) - item.ChargeValue;
                    temp = 1;
                  }

                  else if (item.ChargeType == "Amount" && item.AdditionalChargeType == "Tax(Inclusive)" && item.AdditionalChargeIndicator == "Net") {
                    TaxAmount = Amount - item.ChargeValue;
                    temp = 1;
                  }

                  else if (item.ChargeType == "Amount" && item.AdditionalChargeType == "Tax(Inclusive)" && item.AdditionalChargeIndicator == "MRP") {
                    TaxAmount = (MRP * POQty) - item.ChargeValue;
                    temp = 1;
                  }
                  TaxAmount = parseFloat(TaxAmount).toFixed(4);

                  // if (Id === 1) {
                  form1.setFieldsValue({ [record.key]: { TaxAmount1: parseFloat(TaxAmount).toFixed(4) } });
                  form1.setFieldsValue({ [record.key]: { TaxAmount2: parseFloat(TaxAmount).toFixed(4) } });
                  //   // var Amount1 = parseFloat(record.TaxAmount2).toFixed(4);
                  // } else {
                  //   form1.setFieldsValue({ [record.key]: { TaxAmount2: parseFloat(TaxAmount).toFixed(4) } });
                  //   // var Amount1 = parseFloat(record.TaxAmount1).toFixed(4);
                  // }

                  if (temp == 1) {
                    form1.setFieldsValue({ [record.key]: { LineAmount: parseFloat(POAmount - TaxAmount * 2).toFixed(4) } });
                    form1.setFieldsValue({ [record.key]: { LineTotalAmount: POAmount } });
                    updatedItem.LineAmount = parseFloat(POAmount - TaxAmount * 2).toFixed(4)
                    updatedItem.LineTotalAmount = POAmount
                  } else {
                    form1.setFieldsValue({ [record.key]: { LineAmount: POAmount } });
                    form1.setFieldsValue({ [record.key]: { LineTotalAmount: parseFloat(parseFloat(POAmount) + parseFloat(TaxAmount * 2)).toFixed(4) } });
                    updatedItem.LineTotalAmount = POAmount
                    updatedItem.LineAmount = parseFloat(parseFloat(POAmount) + parseFloat(TaxAmount * 2).toFixed(4))
                  }
                  updatedItem.TaxAmount1 = TaxAmount
                  // form1.setFieldsValue({ [record.key]: { DiscountAmount: discountAmount } });
                  // form1.setFieldsValue({ [record.key]: { LineAmount: amount } });
                  // form1.setFieldsValue({ [record.key]: { LineTotalAmount: amount } });
                  // form1.setFieldsValue({ [record.key]: { TaxType1: '' } });
                  form1.setFieldsValue({ [record.key]: { TaxAmount1: TaxAmount } });
                  // form1.setFieldsValue({ [record.key]: { TaxType2: '' } });
                  form1.setFieldsValue({ [record.key]: { TaxAmount2: TaxAmount } });
                }
              })
            return updatedItem;
          }
          else {
            updatedItem.DiscountAmount = discountAmount
            updatedItem.LineAmount = amount;
            updatedItem.LineTotalAmount = amount;
            updatedItem.TaxAmount1 = TaxAmount
            item1.TaxAmount1 = TaxAmount;
            item1.TaxAmount2 = TaxAmount;
            item1.TaxType2 = taxType1;

            form1.setFieldsValue({ [record.key]: { DiscountAmount: discountAmount } });
            form1.setFieldsValue({ [record.key]: { LineAmount: amount } });
            form1.setFieldsValue({ [record.key]: { LineTotalAmount: amount } });
            // form1.setFieldsValue({ [record.key]: { TaxType1: '' } });
            form1.setFieldsValue({ [record.key]: { TaxAmount1: TaxAmount } });
            // form1.setFieldsValue({ [record.key]: { TaxType2: '' } });
            form1.setFieldsValue({ [record.key]: { TaxAmount2: TaxAmount } });

            return updatedItem;
          }
        }
        return item1;
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

    if (["PoQuantity", "PoRate", "DiscountRate", 'TaxType1', 'BonusQuantity'].includes(column)) {
      const totalAmount = calculateTotalAmount(newData);
      form1.setFieldsValue({
        TotalAmount: totalAmount.LineAmount,
        PoTaxAmount: totalAmount.TaxAmount,
        TotalPoAmount: totalAmount.LineTotalAmount,
      });
    }
    setData(newData);
  };

  const handleUomChange = (option, column, index, record) => {
    const newData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = {
          ...item,
          [column]: option.value,
          Uom: option.children,
        };
        return updatedItem;
      }
      return item;
    });

    setData(newData);
  };

  const handleDelete = (record) => {
    debugger
    const newData = data.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setData(newData);
    const newSchedule = schedule.map((item) => {
      if (item.ProductId === record.ProductId) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setSchedule(newSchedule);
    const totalAmount = calculateTotalAmount(newData);

    form1.setFieldsValue({
      TotalAmount: totalAmount.LineAmount,
      PoTaxAmount: totalAmount.TaxAmount,
      TotalPoAmount: totalAmount.LineTotalAmount,
    });
  };

  const onFinishModel = async (values) => { };

  const handleOpenModal = async (record) => {
    await form1.validateFields([
      "StoreId",
      "SupplierId",
      "DocumentType",
      [record.key, "UomId"],
      [record.key, "ProductName"],
    ]);
    setLoading(true);
    setDeliveryRecord(record);
    setModalVisible(true);
    setLoading(false);
  };

  const handleCloseModal = () => {
    const newData = schedule.map((item) => {
      if (item.ProductId === "") {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setSchedule(newData);
    setModalVisible(false);
    form2.resetFields();
  };

  const handleSaveModal = async () => {
    await form2.validateFields();
    const values = form2.getFieldsValue();
    const valuesArray = Object.values(values);
    const qty = valuesArray.reduce(
      (total, item) => total + (item.DeliveryQuantity || 0),
      0
    );
    if (qty === deliveryRecord.PoQuantity) {
      const updatedSchedule = schedule.map((item) => {
        const key = item.key;
        if (values[key] != undefined) {
          if (
            values[key].DeliveryQuantity ||
            values[key].DelDate ||
            values[key].DeliveryLocation
          ) {
            return {
              ...item,
              ProductId: deliveryRecord.ProductId,
              DeliveryQuantity: values[key].DeliveryQuantity,
              DelDate: values[key].DelDate ? values[key].DelDate.format("DD-MM-YYYY") : null,
              DeliveryLocation: values[key].DeliveryLocation,
              UomId: deliveryRecord.UomId,
            };
          }
          return item;
        }
        return item;
      });
      setSchedule(updatedSchedule);
      setModalVisible(false);
    } else {
      message.warning(" Delivery Quantity must not be Greater than PO Quantity");
    }
  };

  const ModelDelete = (record) => {
    const newData = schedule.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setSchedule(newData);
  };

  const handleDeliveryDateChange = (date) => {
    setDeliveryDate(date);
  };

  const disabledDeliveryDate = (current) => {
    return current && current.isBefore(dayjs(), "day");
  };

  const columnsModel = [
    {
      title: "Quantity",
      dataIndex: "DeliveryQuantity",
      width: 100,
      key: "DeliveryQuantity",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "DeliveryQuantity"]}
          rules={[{ required: true, message: "Required" }]}
          style={{ width: "100%" }}
          initialValue={record.DeliveryQuantity}
        >
          <InputNumber min={0} defaultValue={text} />
        </Form.Item>
      ),
    },
    {
      title: "UOM",
      dataIndex: "UomId",
      key: "UomId",
      width: 150,
      render: (text, record, index) => (
        <Form.Item name={[record.key, "UomId"]}>
          <Tag color="#7C00FE">{deliveryRecord.Uom === null
            ? deliveryRecord.ShortName
            : deliveryRecord.Uom}</Tag>
        </Form.Item>
      ),
    },
    {
      title: "Date of Delivery",
      dataIndex: "DelDate",
      key: "DelDate",
      render: (text, record, index) => (
        <Form.Item
          style={{ width: 200 }}
          name={[record.key, "DelDate"]}
          initialValue={
            record.DelDate
              ? dayjs(record.DelDate, "DD-MM-YYYY")
              : null
          }
          rules={[{ required: true, message: 'Date of Delivery is required' }]}
        >
          <DatePicker
            disabledDate={disabledDeliveryDate}
            onChange={handleDeliveryDateChange}
            style={{ width: "150%" }}
            format="DD-MM-YYYY"
          />
        </Form.Item>
      ),
    },
    {
      title: "Delivery Location",
      dataIndex: "DeliveryLocation",
      // width: 150,
      key: "DeliveryLocation",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "DeliveryLocation"]}
          initialValue={record.DeliveryLocation}
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
          onClick={handleAddDelivery}
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
    },
  ];

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
            name={[record.key, "PoLineId"]}
            hidden
            initialValue={record.PoLineId}
          >
            <Input></Input>
          </Form.Item>
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
          name={[record.key, "UomId"]}
          rules={[{ required: true, message: "Required" }]}
          initialValue={record.UomId}
        >
          <Select
            disabled={true}
            defaultValue={text}
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
      title: "PO Qty",
      dataIndex: "PoQuantity",
      width: 100,
      key: "PoQuantity",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "PoQuantity"]}
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
          style={{ width: "100%" }}
          initialValue={record.PoQuantity}
        >
          <InputNumber
            min={0}
            defaultValue={text}
            onChange={(value) => {
              handleInputChange(
                { target: { value } },
                "PoQuantity",
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
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "BonusQuantity"]}
          // name={["BonusQuantity", record.key]}
          style={{ width: "100%" }}
          initialValue={record.BonusQuantity}
        >
          <InputNumber
            min={0}
            defaultValue={text}
            onChange={(value) =>
              handleInputChange(
                { target: { value } },
                "BonusQuantity",
                index,
                record
              )
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Po Rate",
      dataIndex: "PoRate",
      width: 100,
      key: "PoRate",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "PoRate"]}
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
          style={{ width: "100%" }}
          initialValue={text}
        >
          <InputNumber
            min={0}
            defaultValue={text}
            onChange={(value) => {
              handleInputChange({ target: { value } }, "PoRate", index, record);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Discount %",
      dataIndex: "DiscountRate",
      width: 100,
      key: "DiscountRate",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "DiscountRate"]}
          // name={["DiscountRate", record.key]}
          style={{ width: "100%" }}
          initialValue={record.DiscountRate}
        >
          <InputNumber
            min={0}
            defaultValue={text}
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
      width: 100,
      key: "DiscountAmount",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "DiscountAmount"]}
          style={{ width: "100%" }}
          initialValue={record.DiscountAmount}
        >
          <InputNumber disabled min={0} defaultValue={text} />
        </Form.Item>
      ),
    },

    {
      title: "Expected MRP",
      dataIndex: "MrpExpected",
      width: 100,
      key: "MrpExpected",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "MrpExpected"]}
          style={{ width: "100%" }}
          initialValue={record.MrpExpected}
        >
          <InputNumber
            min={0}
            defaultValue={text}
            onChange={(value) =>
              handleInputChange(
                { target: { value } },
                "MrpExpected",
                index,
                record
              )
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "CGST",
      dataIndex: "TaxType1",
      key: "TaxType1",
      width: 100,
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "TaxType1"]}
        >
          <Select allowClear
            defaultValue={text}
            onChange={(value) =>
              handleInputChange(
                { target: { value } },
                "TaxType1",
                index,
                record
              )
            }
          // onChange={(value) => showTaxamount(value, record, 1)}
          >
            {DropDown.TaxType.map((option) => (
              <Option key={option.TaxType1} value={option.TaxType1}>
                {option.TaxTypeName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "CGST Amount",
      dataIndex: "TaxAmount1",
      width: 100,
      key: "TaxAmount1",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "TaxAmount1"]}
          style={{ width: "100%" }}
          initialValue={text}
        >
          <InputNumber min={0} disabled />
        </Form.Item>
      ),
    },
    {
      title: "SGST",
      dataIndex: "TaxType2",
      key: "TaxType2",
      width: 100,
      render: (text, record, index) => (
        <Form.Item name={[record.key, "TaxType2"]}>
          <Select defaultValue={text} onChange={(value) => showTaxamount(value, record, 2)}>
            {DropDown.TaxType.map((option) => (
              <Option key={option.TaxType1} value={option.TaxType1}>
                {option.TaxTypeName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "SGST Amount",
      dataIndex: "TaxAmount2",
      width: 100,
      key: "TaxAmount2",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "TaxAmount2"]}
          style={{ width: "100%" }}
          initialValue={text}
        >
          <InputNumber disabled min={0} />
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      dataIndex: "LineAmount",
      width: 100,
      key: "LineAmount",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "LineAmount"]}
          style={{ width: "100%" }}
          initialValue={text}
        >
          <InputNumber disabled min={0} defaultValue={text} />
        </Form.Item>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "LineTotalAmount",
      width: 100,
      key: "LineTotalAmount",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "LineTotalAmount"]}
          style={{ width: "100%" }}
          initialValue={text}
        >
          <InputNumber disabled min={0} defaultValue={text} />
        </Form.Item>
      ),
    },
    {
      title: "Avl Qty",
      dataIndex: "AvailableQuantity",
      width: 100,
      key: "AvailableQuantity",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "AvailableQuantity"]}
          style={{ width: "100%" }}
          initialValue={record.AvailableQuantity}
        >
          <InputNumber disabled min={0} defaultValue={text} />
        </Form.Item>
      ),
    },
    {
      title: "Delivery Schedule",
      dataIndex: "deliverySchedule",
      key: "deliverySchedule",
      width: 100,
      render: (text, record, index) => (
        <Button type="link" onClick={() => handleOpenModal(record)}>
          Delivery
        </Button>
      ),

    },
    // {
    //   title: (
    //     <Button
    //       type="primary"
    //       icon={<PlusOutlined />}
    //       onClick={handleAddRow}
    //     ></Button>
    //   ),
    //   key: "action",
    // render: (text, record, index) => (
    //   <Popconfirm
    //     title="Are you sure you want to delete this record?"
    //     onConfirm={() => handleDelete(record)}
    //   >
    //     <Button
    //       size="small"
    //       danger
    //       icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
    //     ></Button>
    //   </Popconfirm>
    // ),
    // },
  ];

  const SubmitChanged = (event) => {
    setPoStatus(event.target.checked);
  };

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
        {/* <Row
          style={{
            padding: "0.5rem 2rem 0.5rem 2rem",
            backgroundColor: "#40A2E3",
            borderRadius: "10px 10px 0px 0px",
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
        </Row> */}
        <PageHeader
          title={"Create Purchase Order"}
          buttonLabel="Back to PO"
          buttonIcon={<LeftOutlined />}
          onButtonClick={handleToPurchaseOrder}
        />
        <Card>
          <Form
            layout="vertical"
            onFinish={handleOnFinish}
            onFinishFailed={onFinishFailed}
            // variant="outlined"
            // size="default"
            initialValues={{
              PODate: dayjs(),
              SubmitCheck: false,
            }}
            form={form1}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="Bottom">
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
                    <Select
                      loading={dropDownLoad}
                      allowClear
                      placeholder="Select Value"
                    >
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
                  <Form.Item name="PoHeaderId" hidden initialValue={PoHeaderId}>
                    <Input></Input>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item
                    label="Procurement Store"
                    name="StoreId"
                    rules={[
                      {
                        required: true,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      loading={dropDownLoad}
                      allowClear
                      placeholder="Select Value"
                    >
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
                    <Select
                      loading={dropDownLoad}
                      allowClear
                      placeholder="Select Value"
                    >
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
                  <TextArea

                    allowClear
                    autoSize={{
                      minRows: 2,
                      maxRows: 3,
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
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
                    name="PoStatus"
                    rules={[
                      {
                        required: poStatus,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select allowClear placeholder="Select Value">
                      <Option value="Draft">Draft</Option>
                      <Option value="Pending">Finalize</Option>
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col>
                <Form.Item
                  name="SubmitCheck"
                  style={{ marginTop: "30px" }}
                  valuePropName="checked"
                >
                  <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" style={{ padding: "0rem 1rem" }}>
              <Col style={{ marginRight: "10px" }}>
                <Form.Item>
                  <Button
                    type="primary"
                    loading={loading}
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
            <Spin spinning={loading}>
              <CustomTable
                dataSource={data.filter((item) => item.ActiveFlag !== false)}
                columns={columns}
                isFilter={false}
                bordered
                scroll={{
                  x: 2000,
                }}
                onDelete={handleDelete}
                actionColumnName={<Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddRow}
                ></Button>}
              />
              {/* <Table
                bordered
                columns={columns}
                size="small"
                dataSource={data.filter((item) => item.ActiveFlag !== false)}
                locale={{ emptyText: "nodata " }}
                scroll={{
                  x: 2000,
                }}
              /> */}
            </Spin>
            {/* <Row> */}
            <Col style={{ float: 'right' }}>
              <Form.Item
                label="Amount"
                name="TotalAmount"
                style={{ marginRight: "16px", width: 100 }}
              >
                <InputNumber min={0} disabled />
              </Form.Item>
              <Form.Item
                label="GST Tax"
                name="PoTaxAmount"
                style={{ marginRight: "16px", width: 100 }}
              >
                <InputNumber min={0} disabled />
              </Form.Item>
              <Form.Item
                label="Total PO Amount"
                name="TotalPoAmount"
                style={{ width: 150 }}
              >
                <InputNumber min={0} disabled />
              </Form.Item>
            </Col>
            {/* </Row> */}
            {/* <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "16px",
                float: "right",
              }}
            > */}
            {/* <Form.Item
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
                label="Total PO Amount"
                name="TotalPoAmount"
                style={{ width: 150 }}
              >
                <InputNumber min={0} disabled />
              </Form.Item> */}
            {/* </div> */}
          </Form>
        </Card>
      </div>
      <Modal
        width={1000}
        maskClosable={false}
        title="Delivery Schedule"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleSaveModal}
        okText={"Save"}
      >
        {/* Modal content goes here */}
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
        >
          <Col className="gutter-row" span={12}>
            <div>
              <Tag color="#1890ff">Product: {deliveryRecord.LongName}</Tag>
              {/* 
              <span>
                Product :{" "}
                <b style={{ color: "#1677ff" }}>{deliveryRecord.LongName}</b>{" "}
              </span> */}
            </div>
          </Col>
          <Spin spinning={loading}>
            <Table
              columns={columnsModel}
              size="small"
              locale={{ emptyText: "Nodata " }}
              dataSource={
                deliveryRecord.ProductId
                  ? schedule.filter(
                    (item) =>
                      (item.ProductId === deliveryRecord.ProductId &&
                        item.ActiveFlag) ||
                      (item.ProductId === "" && item.ActiveFlag)
                  )
                  : initialDeliveryDataSource
              }
            />
          </Spin>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CreatePurchaseOrder;
