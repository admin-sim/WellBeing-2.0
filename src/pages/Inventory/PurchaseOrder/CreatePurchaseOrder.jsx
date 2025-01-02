import {
  urlCreatePurchaseOrder,
  urlAutocompleteProduct,
  urlGetProductDetailsById,
  urlAddNewPurchaseOrder,
  urlEditPurchaseOrder,
  urlUpdatePurchaseOrder,
  urlGetTaxDetails,
} from "../../../../endpoints";
import Select from "antd/es/select";
import {
  Checkbox,
  Modal,
  Spin,
  Col,
  Divider,
  Row,
  AutoComplete,
  message,
  Button,
  Tag,
  Dropdown,
} from "antd";
import Input from "antd/es/input";
import Form from "antd/es/form";
import { DatePicker } from "antd";
import Layout from "antd/es/layout/layout";
import { CloseSquareFilled, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { InputNumber } from "antd";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import customAxios from "../../../components/customAxios/customAxios";
import CustomTable from "../../../components/customTable/index.jsx";
import PageHeader from "../../../components/PageHeader/index.jsx";
import {
  ColWithEightSpan,
  ColWithSixSpan,
} from "../../../components/customGridColumns/index.jsx";
import { isMobile } from "react-device-detect";
import { v4 as uuidv4 } from "uuid";
import { FaAnglesLeft } from "react-icons/fa6";
import { LegacyTodoListEditing } from "ckeditor5";

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
  const { TextArea } = Input;
  const { Option } = Select;
  const navigate = useNavigate();

  const [counter, setCounter] = useState(2);
  const [isProdhasAlternateUom, setIsProdhasAlternateUom] = useState(true);
  const [counterDelivery, setCounterDelivery] = useState(2);
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [productOptions, setProductOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(dayjs());
  const [deliveryRecord, setDeliveryRecord] = useState([]);
  const [poStatus, setPoStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState()
  const [poAmount, setPoAmount] = useState()
  const [GSTTax, setGSTTax] = useState()
  const [alternateUoms, setAlternateUoms] = useState([])

  const initialDataSource =
    PoHeaderId === 0
      ? [
        {
          key: uuidv4(),
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
          TotalAmount: 0,
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
          key: uuidv4(),
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
    });
    setDropDownLoad(false);
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
              key: uuidv4(),
              TotalAmount: item.LineAmount + item.TaxAmount1 + item.TaxAmount2,
              UOM: response.data.data.UOM
            })
          );
          setData(products);
          const formdata = editeddata.newPurchaseOrderModel;
          setPoAmount(formdata.PoPurchaseValue)
          setAmount(formdata.PoPurchaseValue - formdata.PoTaxAmount)
          setGSTTax(formdata.PoTaxAmount)
          form1.setFieldsValue({
            SupplierId: formdata.VendorId,
            StoreId: formdata.ProcurementStoreId,
            DocumentType: formdata.DocumentType,
            TotalAmount: formdata.PoPurchaseValue,
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
    debugger
    const products = data
      .filter((item) => item !== undefined)
      .map((item) => ({
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
        // TotalAmount: item.TotalAmount,
        PoTotalAmount: item.LineAmount,
        AvailableQuantity:
          item.AvailableQuantity === "" ? 0 : item.AvailableQuantity,
        PoLineId: item.PoLineId,
        ActiveFlag: item.ActiveFlag,
      }));

    const purchaseOrder = {
      PoHeaderId: values.PoHeaderId,
      SupplierId: values.SupplierId,
      ProcurementStoreId: values.StoreId,
      DocumentType: values.DocumentType,
      PurchaseDate: values.PODate.format('DD-MM-YYYY'),
      PoStatus: poStatus ? values.PoStatus : "Created",
      Remarks: values.Remarks,
      PoPurchaseValue: values.TotalAmount,
      PoTotalAmount: values.TotalPoAmount,
      PoTaxAmount: values.TaxAmount1 === undefined ? 0 : values.TaxAmount1,
    };

    const activeData = schedule.filter((item) => item.ProductId);

    const activeProducts = products.filter(
      (item) => item.ActiveFlag === true && item.ProductId
    );
    if (activeProducts.length === 0) {
      message.warning("Please Add Product");
      return false;
    }

    const postData = {
      newPurchaseOrderModel: purchaseOrder,
      PurchaseOrderDetails:
        PoHeaderId === 0
          ? activeProducts
          : products.filter((item) => item.ProductId),
      Delivery:
        PoHeaderId === 0
          ? activeData.filter((item) => item.ActiveFlag === true)
          : activeData,
    };

    const url =
      PoHeaderId === 0 ? urlAddNewPurchaseOrder : urlUpdatePurchaseOrder;
    const response = await customAxios.post(url, postData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const successMessage =
        PoHeaderId === 0
          ? "Purchase Order Created Successfully"
          : "Purchase Order Updated Successfully";
      message.success(successMessage);
      setLoading(false);
      handleCancel();
    } else {
      message.error("Something went wrong");
    }
  };

  const handleToPurchaseOrder = () => {
    const url = "/PurchaseOrder";
    navigate(url);
  };

  const handleAddRow = async () => {
    setProductOptions([]);
    await form1.validateFields();
    setData([
      ...data,
      {
        key: uuidv4(),
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
        // TotalAmount: 0,
        AvailableQuantity: "",
        deliverySchedule: "",
        ActiveFlag: true,
      },
    ]);
    // setCounter(counter + 1);
  };

  const handleAddDelivery = async () => {
    await form2.validateFields();
    setSchedule([
      ...schedule,
      {
        key: uuidv4(),
        ProductId: "",
        UomId: "",
        PoDeliveryId: 0,
        DeliveryQuantity: "",
        DelDate: "",
        DeliveryLocation: "",
        ActiveFlag: true,
      },
    ]);
    // setCounterDelivery(counterDelivery + 1);
  };

  const handleSearch = async (searchText) => {
    if (searchText) {
      const response = await customAxios.get(
        `${urlAutocompleteProduct}?Product=${searchText}`
      );
      const apiData = response.data.data;

      // Filter apiData with productOptions
      const filteredApiData = apiData.filter(
        (apiItem) =>
          !data.some((option) => option.ProductId === apiItem.ProductId)
      );

      const newOptions = filteredApiData.map((item) => ({
        value: item.LongName,
        key: item.ProductId,
        UomId: item.UOMPrimaryUOM,
      }));

      setProductOptions(newOptions);
    }
  };

  function calculateTotalAmount(data) {
    let sum = {
      LineAmount: 0,
      TotalAmount: 0,
      GstTax: 0
    }
    data.forEach((item) => {
      if (
        item.ActiveFlag &&
        !isNaN(item.LineAmount) &&
        item.LineAmount !== null &&
        item.LineAmount !== undefined
      ) {
        sum.LineAmount += item.LineAmount;
        sum.TotalAmount += item.TotalAmount;
        sum.GstTax += parseFloat(item.TaxAmount1) + parseFloat(item.TaxAmount2);
      }
    });
    return sum;
  }

  function UomChange(params) {
    setInitialData(prevState => ({
      ...prevState,
      ClinicalAdvices: params
    }));
  }

  const handleSelect = (value, option, column, record) => {
    debugger
    customAxios
      .get(`${urlGetProductDetailsById}?ProductId=${option.key}`)
      .then((response) => {
        const apiData = response.data.data;
        let uoms = []
        if (apiData.AlternateUoms.length > 0) {
          setAlternateUoms(apiData.AlternateUoms)
          uoms = DropDown.UOM.filter(
            i =>
              apiData.AlternateUoms.find(i1 => i1.AlternateUom === i.UomId || i.UomId === option.UomId)
          )
        } else {
          uoms = DropDown.UOM.filter(i => i.UomId === option.UomId)
        }
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
              Uom: apiData.UOMPrimaryUOMname,
              UOM: uoms
            };
            return updatedItem;
          }
          return item;
        });
        setData(newData);
        form1.setFieldsValue({ [record.key]: { UomId: option.UomId } });
        form1.setFieldsValue({ [record.key]: { PoRate: newData[0].PoRate } });
      });
  };

  const handleInputChange = async (e, column, index, record) => {
    debugger
    const value = e.target.value;
    let updatedData = [...data];

    updatedData = updatedData.map((item) => {
      if (item.key === record.key) {
        return { ...item, [column]: value };
      }
      return item;
    });

    if (["PoQuantity", "PoRate", 'BonusQuantity', "DiscountRate", 'MrpExpected', "TaxType1", "TaxType2", 'UomId'].includes(column)) {
      const currentRecord = updatedData.find((item) => item.key === record.key);

      const altUom = alternateUoms.find(i => i.AlternateUom == currentRecord.UomId)
      // let poQuantity = record.PoQuantity * (altUom ? altUom.EquivalentUOMUnits : 1)

      const poQuantity = parseFloat(currentRecord.PoQuantity || 0) * (altUom ? altUom.EquivalentUOMUnits : 1);
      const poRate = parseFloat(currentRecord.PoRate || 0);
      const discountRate = parseFloat(currentRecord.DiscountRate || 0);
      const discountAmount = (poQuantity * poRate * discountRate) / 100;
      const amount = poQuantity * poRate - discountAmount;
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

          currentRecord.TaxAmount1 = taxAmount;
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

          // Assign tax to the correct field
          currentRecord.TaxAmount2 = taxAmount;
        } catch (error) {
          console.error("Error fetching tax details:", error);
        }
      } else {
        currentRecord.TaxAmount2 = 0;
      }

      currentRecord.DiscountAmount = discountAmount;
      if (temp == 1) {
        currentRecord.LineAmount = amount - parseFloat(currentRecord.TaxAmount1 || 0) - parseFloat(currentRecord.TaxAmount2 || 0);
        currentRecord.TotalAmount = amount;
      } else {
        currentRecord.LineAmount = amount;
        currentRecord.TotalAmount = amount + parseFloat(currentRecord.TaxAmount1 || 0) + parseFloat(currentRecord.TaxAmount2 || 0);
      }

      form1.setFieldsValue({
        [record.key]: {
          DiscountAmount: discountAmount,
          LineAmount: currentRecord.LineAmount,
          TotalAmount: currentRecord.TotalAmount,
          TaxAmount1: currentRecord.TaxAmount1 || 0,
          TaxAmount2: currentRecord.TaxAmount2 || 0,
        },
      });
    }

    setData(updatedData);

    const totalSummary = calculateTotalAmount(updatedData);
    form1.setFieldsValue({
      TotalAmount: totalSummary.TotalAmount,
      TotalPoAmount: totalSummary.LineAmount,
      TaxAmount1: totalSummary.GstTax,
    });

    setPoAmount(totalSummary.TotalAmount);
    setAmount(totalSummary.LineAmount);
    setGSTTax(totalSummary.GstTax);
  };

  const calculateTax = (amount, taxDetails, record) => {
    debugger
    let taxAmount = 0;
    let temp = 0
    const altUom = alternateUoms.find(i => i.AlternateUom == record.UomId)
    let poQuantity = record.PoQuantity * (altUom ? altUom.EquivalentUOMUnits : 1)
    const mrp = (record.MrpExpected || 0)
    if (taxDetails.IncludeBonusQuantity) {
      poQuantity = (poQuantity || 0) + (record.BonusQuantity || 0);
      amount = poQuantity * (record.PoRate || 0) - (record.DiscountAmount || 0);
    }
    if (true) {
      switch (taxDetails.ChargeType) {
        case "Percentage":
          if (taxDetails.AdditionalChargeType == 'Tax(Exclusive)') {
            if (taxDetails.AdditionalChargeIndicator == "Gross") {
              taxAmount = (amount + record.DiscountAmount) * taxDetails.ChargeValue / 100;
            } else if (taxDetails.AdditionalChargeIndicator == "Net") {
              taxAmount = amount * taxDetails.ChargeValue / 100;
            } else {
              taxAmount = (mrp * poQuantity) * taxDetails.ChargeValue / 100;
            }
          } else {
            if (taxDetails.AdditionalChargeIndicator == "Gross") {
              // taxAmount = (parseInt(amount) + parseInt(record.DiscountAmount)) - ((parseInt(amount) + parseInt(record.DiscountAmount)) / (1 + taxDetails.ChargeValue / 100));
              taxAmount = (amount + record.DiscountAmount) - ((amount + record.DiscountAmount) / (1 + taxDetails.ChargeValue / 100));
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
              taxAmount = (amount + record.DiscountAmount) + taxDetails.ChargeValue;
            } else if (taxDetails.AdditionalChargeIndicator == "Net") {
              taxAmount = amount + taxDetails.ChargeValue;
            } else {
              taxAmount = (mrp * poQuantity) + taxDetails.ChargeValue;
            }
          } else {
            if (taxDetails.AdditionalChargeIndicator == "Gross") {
              taxAmount = (amount + record.DiscountAmount) - taxDetails.ChargeValue;
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

    return taxAmount;
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
      TotalAmount: totalAmount.TotalAmount,
      TotalPoAmount: totalAmount.LineAmount,
      TaxAmount1: totalAmount.GstTax,
    });
    setAmount(totalAmount.LineAmount)
    setPoAmount(totalAmount.TotalAmount)
    setGSTTax(totalAmount.GstTax)
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
    debugger
    await form2.validateFields();
    const values = form2.getFieldsValue();
    const valuesArray = Object.values(values);
    const qty = valuesArray.reduce(
      (total, item) => total + (item.DeliveryQuantity || 0),
      0
    );
    if (qty <= deliveryRecord.PoQuantity) {
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
              DelDate: values[key].DelDate
                ? values[key].DelDate.format("DD-MM-YYYY")
                : null,
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
      message.warning(
        " Delivery Quantity must not be Greater than PO Quantity"
      );
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
      key: 'DeliveryQuantity',
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
      key: 'UomId',
      width: 100,
      render: (text, record, index) => (
        <Form.Item name={[record.key, "UomId"]}>
          <Tag color="#7C00FE">
            {deliveryRecord.Uom === null
              ? deliveryRecord.ShortName
              : deliveryRecord.Uom}
          </Tag>
        </Form.Item>
      ),
    },
    {
      title: "Date of Delivery",
      dataIndex: "DelDate",
      key: 'DelDate',
      width: 250,
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "DelDate"]}
          initialValue={
            record.DelDate ? dayjs(record.DelDate, "DD-MM-YYYY") : null
          }
          rules={[{ required: true, message: "Date of Delivery is required" }]}
        >
          <DatePicker
            disabledDate={disabledDeliveryDate}
            onChange={handleDeliveryDateChange}
            style={{ width: "100%" }}
            format="DD-MM-YYYY"
          />
        </Form.Item>
      ),
    },
    {
      title: "Delivery Location",
      dataIndex: "DeliveryLocation",
      key: 'DeliveryLocation',
      width: 250,
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "DeliveryLocation"]}
          initialValue={record.DeliveryLocation}
        >
          <Input style={{ width: "100%" }} allowClear />
        </Form.Item>
      ),
    },
  ];

  const columns = [
    {
      title: "Product",
      dataIndex: "ProductName",
      fixed: "left",
      key: 'ProductName',
      width: isMobile ? 200 : 300,
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
      key: 'UomId',
      width: 150,
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "UomId"]}
          rules={[{ required: true, message: "Required" }]}
          initialValue={record.UomId}
        >
          <Select
            // disabled={isProdhasAlternateUom}
            defaultValue={text}
            onChange={(value, option) => {
              handleUomChange(option, "UomId", index, record);
              handleInputChange({ target: { value } }, "UomId", index, record);
            }}
          // onChange={(value, option) =>
          //   handleUomChange(option, "UomId", index, record);
          //   handleInputChange(
          //     { target: { value } },
          //     "UomId",
          //     index,
          //     record
          //   );
          // }
          >
            {(record.UOM || []).map((option) => (
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
      key: 'PoQuantity',
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
      key: 'BonusQuantity',
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
      key: 'PoRate',
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
      key: 'DiscountRate',
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
      key: 'DiscountAmount',
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "DiscountAmount"]}
          // name={[`DiscountAmount`, record.key]}
          style={{ width: "100%" }}
          initialValue={record.DiscountAmount}
        >
          <InputNumber disabled min={0} defaultValue={text} precision={2} />
        </Form.Item>
      ),
    },

    {
      title: "Expected MRP",
      dataIndex: "MrpExpected",
      width: 100,
      key: 'MrpExpected',
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "MrpExpected"]}
          // name={["MrpExpected", record.key]}
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
      key: 'TaxType1',
      width: 100,
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "TaxType1"]}
        // name={["TaxType1", record.key]}
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
      key: 'TaxAmount1',
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "TaxAmount1"]}
          style={{ width: "100%" }}
          initialValue={text}
        >
          <InputNumber min={0} disabled precision={4} />
        </Form.Item>
      ),
    },
    {
      title: "SGST",
      dataIndex: "TaxType2",
      key: 'TaxType2',
      width: 100,
      render: (text, record, index) => (
        <Form.Item name={[record.key, "TaxType2"]}>
          <Select defaultValue={text} allowClear
            onChange={(value) =>
              handleInputChange(
                { target: { value } },
                "TaxType2",
                index,
                record
              )
            }
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
      title: "SGST Amount",
      dataIndex: "TaxAmount2",
      width: 100,
      key: 'TaxAmount2',
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "TaxAmount2"]}
          style={{ width: "100%" }}
          initialValue={text}
        >
          <InputNumber disabled min={0} precision={4} />
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      dataIndex: "LineAmount",
      width: 100,
      key: 'LineAmount',
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "LineAmount"]}
          style={{ width: "100%" }}
          initialValue={record.LineAmount}
        >
          <InputNumber disabled min={0} precision={4} />
        </Form.Item>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "Total Amount",
      width: 100,
      key: 'TotalAmount',
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "TotalAmount"]}
          style={{ width: "100%" }}
          initialValue={record.TotalAmount}
        >
          <InputNumber disabled min={0} precision={4} />
        </Form.Item>
      ),
    },
    {
      title: "Avl Qty",
      dataIndex: "AvailableQuantity",
      width: 100,
      key: 'AvailableQuantity',
      render: (text, record, index) => (
        <Form.Item
          // name={["AvailableQuantity", record.key]}
          name={[record.key, "AvailableQuantity"]}
          style={{ width: "100%" }}
          initialValue={record.AvailableQuantity}
        >
          <InputNumber disabled min={0} />
        </Form.Item>
      ),
    },
    {
      title: "Delivery Schedule",
      dataIndex: "deliverySchedule",
      key: 'deliverySchedule',
      width: 100,
      render: (text, record, index) => (
        <Button
          style={{ marginBottom: "24px" }}
          type="link"
          onClick={() => handleOpenModal(record)}
        >
          Delivery
        </Button>
      ),
    },
  ];

  const SubmitChanged = (event) => {
    setPoStatus(event.target.checked);
  };

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader
        title={"Create Purchase Order"}
        buttonIcon={<FaAnglesLeft style={{ fontSize: "1rem" }} />}
        buttonLabel={"Back"}
        onButtonClick={handleToPurchaseOrder}
      />
      <Form
        layout="vertical"
        onFinish={handleOnFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          PODate: dayjs(),
          SubmitCheck: false,
        }}
        form={form1}
        style={{ margin: "1rem" }}
      >
        <Row gutter={16}>
          <ColWithSixSpan>
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
                  <Select.Option key={option.VendorId} value={option.VendorId}>
                    {option.LongName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="PoHeaderId" hidden initialValue={PoHeaderId}>
              <Input></Input>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
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
                  <Select.Option key={option.StoreId} value={option.StoreId}>
                    {option.LongName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
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
                  <Select.Option key={option.LookupID} value={option.LookupID}>
                    {option.LookupDescription}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item label="Remarks" name="Remarks">
              <TextArea
                allowClear
                autoSize={{
                  minRows: 2,
                  maxRows: 3,
                }}
              />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item label="PO Date" name="PODate">
              <DatePicker
                style={{ width: "100%" }}
                disabled
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
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
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              name="SubmitCheck"
              style={{ marginTop: "30px" }}
              valuePropName="checked"
            >
              <Checkbox onChange={SubmitChanged} style={{ marginTop: "33px" }}>Submit</Checkbox>
            </Form.Item>
          </ColWithSixSpan>
        </Row>
        <Row justify="end" gutter={16}>
          <Col>
            <Form.Item>
              <Button type="primary" loading={loading} htmlType="submit">
                {buttonTitle}
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button danger onClick={handleCancel}>
                Cancel
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: "0" }} />
        <Spin spinning={loading}>
          <CustomTable
            dataSource={data.filter((item) => item.ActiveFlag !== false)}
            columns={columns}
            isFilter={false}
            actionColumnName={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddRow}
              />
            }
            onDelete={handleDelete}
            scroll={{
              x: 1000,
            }}
          />
        </Spin>
        <Row justify={"end"}>
          <ColWithEightSpan>
            <Form.Item
              name="TotalAmount"
              style={{ marginRight: "16px" }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <span>Amount : </span>
                </Col>
                <Col span={12}>
                  <InputNumber style={{ width: "100%" }} min={0} precision={4} value={amount} disabled />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              name="TaxAmount1"
              style={{ marginRight: "16px" }}
            >
              <Row gutter={16} style={{ marginTop: "5px" }}>
                <Col span={12}>
                  <span>GST Tax : </span>
                </Col>
                <Col span={12}>
                  <InputNumber style={{ width: "100%" }} min={0} precision={4} disabled value={GSTTax} />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item name="TotalPoAmount"
              style={{ marginRight: "16px" }}
            >
              <Row gutter={16} style={{ marginTop: "5px" }}>
                <Col span={12}>
                  <span>Total PO Amount :</span>
                </Col>
                <Col span={12}>
                  <InputNumber style={{ width: "100%" }} min={0} disabled precision={4} value={poAmount} />
                </Col>
              </Row>
            </Form.Item>
          </ColWithEightSpan>
        </Row>
      </Form>
      <Modal
        width={"60rem"}
        maskClosable={false}
        title="Delivery Schedule"
        open={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleSaveModal}
        okText={"Save"}
        cancelButtonProps={{ danger: "true" }}
      >
        {/* Modal content goes here */}
        <Form
          initialValues={{
            remember: true,
          }}
          onFinish={onFinishModel}
          onFinishFailed={onFinishFailed}
          form={form2}
        >
          <Row>
            <Col span={24}>
              <Tag color="#1890ff">Product: {deliveryRecord.LongName}</Tag>
            </Col>
          </Row>
          <Spin spinning={loading}>
            <CustomTable
              columns={columnsModel}
              size="small"
              locale={{ emptyText: "Nodata " }}
              actionColumnName={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddDelivery}
                />
              }
              onDelete={ModelDelete}
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
