import customAxios from "../../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
import {
  urlCreatePurchaseOrder,
  urlAutocompleteProduct,
  urlEditGRNDirect,
  urlAddNewGRNDirect,
  urlUpdateGRNDirect,
} from "../../../../endpoints";
import CustomTable from "../../../components/customTable/index.jsx";
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
  Card,
  AutoComplete,
  Spin,
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
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { Table, InputNumber } from "antd";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import moment from "moment";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { FaAnglesLeft } from "react-icons/fa6";
import {
  ColWithEightSpan,
  ColWithSixSpan,
  ColWithSixteenSpan,
} from "../../../components/customGridColumns/index.jsx";
import { isMobile } from "react-device-detect";

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
            GrnLineId: 0,
            ReceivedQty: 0,
            BonusQuantity: 0,
            PoRate: 0,
            DiscountRate: 0,
            DiscountAmount: 0,
            Batch: "",
            LineAmount: 0,
            TaxAmount: 0,
            TotalAmount: 0,
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
            BarCode: "",
            BatchNo: "",
            BatchQty: 0,
            UomId: null,
            BatchBonusQty: 0,
            MFGDateString: "",
            EXPDateString: "",
            rate: 0,
            BatchMrp: 0,
            DiscountRate: 0,
            BatchTaxType1: "",

            BatchTaxType2: "",
            BatchTaxAmount1: 0,
            BatchStockLocator: "",
            ProductId: "",
            GrnBatchId: 0,
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
  const [modalVisible, setModalVisible] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [dataModel, setDataModel] = useState(initialModelDataSource);
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [grnStatus, setGrnStatus] = useState(false);
  const [dropDownLoad, setDropDownLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
    setDropDownLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (grnHeaderId > 0) {
      setLoading(true);
      setButtonTitle("Update");
      try {
        const response = await customAxios.get(
          `${urlEditGRNDirect}?GrnHeaderId=${grnHeaderId}`
        );
        if (response.status == 200 && response.data.data != null) {
          const editeddata = response.data.data;
          const products = editeddata.GRNAgainstPODetails.map(
            (item, index) => ({
              ...item,
              key: index + 1,
              Replaceable: item.Replaceable === "Y" ? true : false,
            })
          );
          setData(products);
          const formdata = editeddata.newGRNAgainstPOModel;

          form1.setFieldsValue({
            SupplierId: formdata.SupplierId,
            StoreId: formdata.StoreId,
            DocumentType: formdata.DocumentType,
            InvoiceNumber: formdata.InvoiceNumber,
            InvoiceDateString: formdata.InvoiceDateString
              ? dayjs(formdata.InvoiceDateString, "DD-MM-YYYY")
              : null,
            DCChallanDateString: formdata.DCChallanDateString
              ? dayjs(formdata.DCChallanDateString, "DD-MM-YYYY")
              : null,
            ReceivingDateString: formdata.ReceivingDateString
              ? dayjs(formdata.ReceivingDateString, "DD-MM-YYYY")
              : null,
            GRNDatestring: formdata.GRNDatestring
              ? dayjs(formdata.GRNDatestring, "DD-MM-YYYY")
              : null,
            DCChallanNumber: formdata.DCChallanNumber,
            InvoiceAmount: formdata.InvoiceAmount,
            TotalAmount: formdata.TotalAmount,
            TotalPoAmount: formdata.TotalPoAmount,
            Remarks: formdata.Remarks,
            GRNStatus:
              formdata.GRNStatus === "Created" ? "" : formdata.GRNStatus,
            GRNHeaderId: formdata.GRNHeaderId,
            PoHeaderId: formdata.PoHeaderId,
          });
          setCounter(products.length + 1);
          const batch = editeddata.BatchDetails.map((item, index) => ({
            ...item,
            key: index + 1,
          }));
          setDataModel(batch);
          setCounterModel(editeddata.BatchDetails.length + 1);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
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
    let newData;
    if (["ReceivedQty", "PoRate", "DiscountRate"].includes(column)) {
      newData = data.map((item) => {
        if (item.key === record.key) {
          const updatedItem = { ...item, [column]: e.target.value };
          const recievingQty =
            column === "ReceivedQty" ? e.target.value : item.ReceivedQty;
          const poRate = column === "PoRate" ? e.target.value : item.PoRate;
          const discountRate =
            column === "DiscountRate" ? e.target.value : item.DiscountRate;

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

          form1.setFieldsValue({
            [record.key]: { DiscountAmount: discountAmount },
          });
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
    await form2.validateFields();
    const values = form2.getFieldsValue();
    const valuesArray = Object.values(values);
    const qty = valuesArray.reduce(
      (total, item) => (item ? total + (item.Quantity || 0) : total),
      0
    );
    const bonusqty = valuesArray.reduce(
      (total, item) => (item ? total + (item.BatchBonusQty || 0) : total),
      0
    );
    if (
      batchRecord.BonusQuantity != null &&
      batchRecord.BonusQuantity != undefined
    ) {
      if (bonusqty !== batchRecord.BonusQuantity) {
        message.warning(
          "Total Batch Bonus Quantity should be equal to Total Bonus Quantity"
        );
        return false;
      }
    }

    if (qty === batchRecord.ReceivedQty) {
      const updatedBatch = dataModel.map((item) => {
        const key = item.key;
        if (values[key] != undefined) {
          if (
            values[key].Quantity ||
            values[key].EXPDateString ||
            values[key].MFGDateString ||
            values[key].MRP
          ) {
            return {
              ...item,
              ProductId: batchRecord.ProductId,
              UomId: batchRecord.UomId,
              BarCode: values[key].BarCode,
              Quantity: values[key].Quantity,
              BatchBonusQty: values[key].BatchBonusQty,
              MFGDateString: values[key].MFGDateString
                ? values[key].MFGDateString.format("DD-MM-YYYY")
                : null,
              BatchNo: values[key].BatchNo,
              EXPDateString: values[key].GrnBatchId
                ? values[key].EXPDateString &&
                  values[key].EXPDateString.format("DD-MM-YYYY")
                : batchRecord.Expiry === "Month wise"
                ? values[key].EXPDateString &&
                  `01-${String(values[key].EXPDateString.$M + 1).padStart(
                    2,
                    "0"
                  )}-${values[key].EXPDateString.$y}`
                : batchRecord.Expiry === "Date wise"
                ? values[key].EXPDateString &&
                  values[key].EXPDateString.format("DD-MM-YYYY")
                : null,
              rate: values[key].rate,
              MRP: values[key].MRP,
              DiscountRate:
                values[key].DiscountRate == "" ? 0 : values[key].DiscountRate,
              DiscountAmount: values[key].DiscountAmount,
              StockLocator: 0,
              PoLineId:
                values[key].PoLineId === undefined ? 0 : values[key].PoLineId,
            };
          }
          return item;
        }
        return item;
      });
      setDataModel(updatedBatch);
      setModalVisible(false);
    } else {
      message.warning(
        "Total Quantity should  be equal to Total Received Quantity"
      );
    }
  };

  const onCancelModel = () => {
    const newData = dataModel.map((item) => {
      if (item.ProductId === "") {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setDataModel(newData);
    setModalVisible(false);
    form2.resetFields({
      // Add a callback function to resetFields to handle invalid dates
      callback: (name, value) => {
        if (name === "MFGDateString" || name === "EXPDateString") {
          if (!value || !dayjs(value).isValid()) {
            return null; // Return null to reset the field to its initial value
          }
        }
        return value;
      },
    });
  };

  const handleCancel = () => {
    const url = "/DirectGRN";
    navigate(url);
  };

  const handleOpenModal = async (value, record) => {
    record.BonusQuantity = form1.getFieldValue([record.key, "BonusQuantity"]);
    await form1.validateFields([
      "StoreId",
      // [record.key, "UomId"],
      [record.key, "ProductName"],
      [record.key, "ReceivedQty"],
      [record.key, "PoRate"],
    ]);
    setLoading(true);
    setBatchRecord(record);
    setModalVisible(true);
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleToDirectGRN = () => {
    const url = "/DirectGRN";
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
    const newDataModel = dataModel.map((item) => {
      if (item.ProductId === record.ProductId) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setDataModel(newDataModel);
    const totalAmount = calculateTotalAmount(newData);

    form1.setFieldsValue({
      Amount: totalAmount,
      totalpoAmount: totalAmount,
    });
  };

  const ModelDelete = (record) => {
    const newData = dataModel.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setDataModel(newData);
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
    const isAnyIdNotNull = dataModel.some(
      (item) => item.ProductId !== "" && item.ActiveFlag
    );

    if (!isAnyIdNotNull) {
      message.warning("Please add Batch details");
      return false;
    }
    setLoading(true);
    const newdata = data.filter((item) => item.ProductId);

    const products = newdata
      .filter((item) => item !== undefined)
      .map((item) => ({
        ProductId: item.ProductId,
        UomId: item.UomId,
        ReceivedQty: item.ReceivedQty,
        BonusQuantity: item.BonusQuantity ?? 0,
        PoRate: item.PoRate,
        DiscountRate: item.DiscountRate || 0,
        DiscountAmount: item.DiscountAmount ?? 0,
        TaxAmount1: item.TaxAmount || 0,
        TotalAmount: item.LineAmount,
        Replaceable:
          item.Replaceable === true || item.Replaceable == "Y" ? "Y" : "N",
        LineAmount: item.LineAmount,
        PoLineId: item.PoLineId || 0,
        GrnLineId: item.GrnLineId || 0,
        ActiveFlag: item.ActiveFlag,
      }));

    const activeProducts = products.filter((product) => product.ActiveFlag);

    const result = checkActiveBatches(activeProducts, dataModel);
    if (!result.allActiveProductsHaveActiveBatch) {
      message.warning("Please Add BatchDeatils");
      return false;
    }

    const DirectGRN = {
      SupplierId: values.SupplierId,
      StoreId: values.StoreId,
      DocumentType: values.DocumentType,
      DCChallanDateString:
        values.DCChallanDateString?.format("DD-MM-YYYY") || "",
      GRNDatestring: values.GRNDatestring.format("DD-MM-YYYY"),
      InvoiceDateString: values.InvoiceDateString.format("DD-MM-YYYY"),
      ReceivingDateString: values.ReceivingDateString.format("DD-MM-YYYY"),
      RoundOff: values.RoundOff,
      InvoiceNumber: values.InvoiceNumber,
      DCChallanNumber: values.DCChallanNumber,
      Remarks: values.Remarks,
      GRNStatus: grnStatus ? values.GRNStatus : "Created",
      InvoiceAmount: values.InvoiceAmount,
      TotalAmount: values.TotalAmount,
      TotalPoAmount: values.TotalPoAmount,
      TaxAmount1: values.TaxAmount1 ?? 0,
      GRNHeaderId: values.GRNHeaderId,
      PoHeaderId: values.PoHeaderId,
    };

    const filteredBatch = dataModel.filter((item) => item.ProductId);
    const filteredBatchwithactive = dataModel.filter(
      (item) => item.ProductId && item.ActiveFlag
    );

    const sumItems = (items, key) =>
      items.reduce((sum, item) => sum + parseInt(item[key] || 0, 10), 0);

    const totalReceivedQty = sumItems(activeProducts, "ReceivedQty");
    const totalBonusQuantity = sumItems(activeProducts, "BonusQuantity");
    const totalBatchQuantity = sumItems(filteredBatchwithactive, "Quantity");
    const totalBatchBonusQty = sumItems(
      filteredBatchwithactive,
      "BatchBonusQty"
    );

    if (totalReceivedQty !== totalBatchQuantity) {
      message.warning("Total ReceivedQty does not match total Batch Quantity.");
      return false;
    }

    if (totalBonusQuantity !== totalBatchBonusQty) {
      message.warning(
        "Total BonusQuantity does not match total Batch BonusQty."
      );
      return false;
    }

    const postData = {
      newGRNAgainstPOModel: DirectGRN,
      GRNAgainstPODetails:
        grnHeaderId === 0
          ? activeProducts
          : products.filter(
              (product) =>
                product.GrnLineId > 0 ||
                (product.GrnLineId === 0 && product.ActiveFlag === true)
            ),
      BatchDetails: grnHeaderId === 0 ? filteredBatchwithactive : filteredBatch,
    };

    const url = grnHeaderId == 0 ? urlAddNewGRNDirect : urlUpdateGRNDirect;
    const response = await customAxios.post(url, postData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status == 200) {
      message.success(
        `GRN ${grnHeaderId == 0 ? "Created" : "Updated"} Successfully`
      );
      setLoading(false);
      handleCancel();
    } else {
      message.error("Something went wrong");
    }

    onCancelModel();
  };

  const handleSelect = (value, option, column, record) => {
    form1.setFieldsValue({ [record.key]: { ProductId: option.key } });
    const newData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = {
          ...item,
          [column]: option.key,
          ProductName: option.value,
          UomId: option.UomId,
          ProductId: option.key,
          Expiry: option.Expiry,
          Uom: option.Uom,
        };
        return updatedItem;
      }
      return item;
    });
    setData(newData);
    form1.setFieldsValue({ [record.key]: { UomId: option.UomId } });
  };

  const handleAdd = async () => {
    setProductOptions([]);
    //await form1.validateFields();
    const allFields = form1.getFieldsValue();
    // Fields to exclude from validation
    const excludeFields = ["InvoiceAmount", "InvoiceNumber"];
    // Fields to validate
    const fieldsToValidate = Object.keys(allFields).filter(
      (field) => !excludeFields.includes(field)
    );

    // Validate only the fields that are not excluded
    await form1.validateFields(fieldsToValidate);
    setData([
      ...data,
      {
        key: idCounter,
        ProductName: "",
        UomId: "",
        GrnLineId: 0,
        ReceivedQty: 0,
        BonusQuantity: 0,
        PoRate: 0,
        DiscountRate: 0,
        DiscountAmount: 0,
        Batch: "",
        LineAmount: 0,
        TaxAmount: 0,
        TotalAmount: 0,
        Replaceable: true,
        ActiveFlag: true,
      },
    ]);
    setCounter(idCounter + 1);
  };

  const handleSearch = async (searchText) => {
    if (searchText) {
      const response = await customAxios.get(
        `${urlAutocompleteProduct}?Product=${searchText}`
      );
      const apiData = response.data.data;

      const filteredApiData = apiData.filter(
        (apiItem) =>
          !data.some((option) => option.ProductId === apiItem.ProductId)
      );
      const newOptions = filteredApiData.map((item) => ({
        value: item.LongName,
        key: item.ProductId,
        UomId: item.UOMPrimaryUOM,
        Expiry: item.Expiry,
        Uom: item.UOMPrimaryUOMname,
      }));
      setProductOptions(newOptions);
    }
  };

  const handleUomChange = (option, column, index, record) => {
    const newData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = {
          ...item,
          [column]: option.value,
          ShortName: option.children,
        };
        return updatedItem;
      }
      return item;
    });
    setData(newData);
  };

  const ReplaceableChanged = (record, checked) => {
    const newData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = { ...item, Replaceable: checked };
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
      width: isMobile ? 200 : 300,
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
              disabled={!!grnHeaderId && record.GrnLineId}
            />
          </Form.Item>
          <Form.Item
            hidden
            name={[record.key, "ProductId"]}
            initialValue={record.ProductId}
          >
            <Input defaultValue={record.ProductId}></Input>
          </Form.Item>
          <Form.Item
            hidden
            name={[record.key, "PoLineId"]}
            initialValue={record.PoLineId}
          >
            <Input defaultValue={record.PoLineId}></Input>
          </Form.Item>
          <Form.Item
            hidden
            name={[record.key, "GrnLineId"]}
            initialValue={record.GrnLineId}
          >
            <Input defaultValue={record.GrnLineId}></Input>
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
          initialValue={
            record.ShortName == undefined ? record.UomId : record.ShortName
          }
        >
          <Select
            disabled={true}
            defaultValue={record.UomId}
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
          name={[record.key, "ReceivedQty"]}
          initialValue={text == 0 ? undefined : text}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
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
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "BonusQuantity"]}
          initialValue={record.BonusQuantity}
          style={{ width: "100%" }}
          rules={[
            {
              required: true,
              message: "required",
            },
          ]}
        >
          <InputNumber
            min={0}
            defaultValue={record.BonusQuantity}
            onChange={(value) => {
              handleInputChange(
                { target: { value } },
                "BonusQuantity",
                index,
                record
              );
            }}
          />
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
          name={[record.key, "PoRate"]}
          initialValue={text == 0 ? undefined : text}
          rules={[
            {
              required: true,
              message: "require",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            onChange={(value) => {
              handleInputChange({ target: { value } }, "PoRate", index, record);
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
        <Form.Item name={[record.key, "DiscountRate"]} initialValue={text}>
          <InputNumber
            min={0}
            style={{ width: "100%" }}
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
      width: 120,
      key: "DiscountAmount",
      render: (text, record) => (
        <Form.Item name={[record.key, "DiscountAmount"]} initialValue={text}>
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
        <Button
          style={{ marginBottom: "24px" }}
          type="link"
          onClick={() => handleOpenModal(value, record)}
        >
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
        <Form.Item
          name={[record.key, "LineAmount"]}
          initialValue={record.LineAmount}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            disabled
            defaultValue={record.LineAmount}
          />
        </Form.Item>
      ),
    },
    {
      title: "Tax Amount",
      dataIndex: "TaxAmount1",
      width: 100,
      key: "TaxAmount1",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxAmount1"]} initialValue={text}>
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            disabled
            defaultValue={text}
          />
        </Form.Item>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "TotalAmount",
      width: 100,
      key: "TotalAmount",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "TotalAmount"]}
          initialValue={record.LineAmount}
        >
          <InputNumber
            disabled
            style={{ width: "100%" }}
            defaultValue={record.LineAmount}
          />
        </Form.Item>
      ),
    },
    {
      title: "Replaceable",
      dataIndex: "Replaceable",
      width: 100,
      key: "Replaceable",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "Replaceable"]}
          initialValue={text}
          valuePropName="checked"
        >
          <Checkbox
            onChange={(e) => ReplaceableChanged(record, e.target.checked)}
          ></Checkbox>
        </Form.Item>
      ),
    },
  ];

  const ModelAdd = async () => {
    await form2.validateFields();
    setDataModel([
      ...dataModel,
      {
        key: idCounterModel,
        BarCode: "",
        BatchNo: "",
        BatchQty: 0,
        UomId: null,
        BatchBonusQty: 0,
        MFGDateString: "",
        EXPDateString: "",
        rate: 0,
        BatchMrp: 0,
        DiscountRate: 0,
        BatchTaxType1: "",

        BatchTaxType2: "",
        BatchTaxAmount1: 0,
        BatchStockLocator: "",
        ProductId: "",
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
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "BarCode"]}
            initialValue={record.BarCode}
          >
            <Input
              min={0}
              defaultValue={record.BarCode}
              disabled={!!grnHeaderId && record.GrnBatchId}
            />
          </Form.Item>
          <Form.Item
            name={[record.key, "GrnBatchId"]}
            hidden
            initialValue={record.GrnBatchId}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            name={[record.key, "GrnLineId"]}
            hidden
            initialValue={record.GrnLineId}
          >
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
            initialValue={record.BatchNo}
            name={[record.key, "BatchNo"]}
            rules={[
              {
                required: true,
                message: "input!",
              },
            ]}
          >
            <Input
              allowClear
              defaultValue={record.BatchNo}
              disabled={!!grnHeaderId && record.GrnBatchId}
            />
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
          initialValue={record.Quantity}
          name={[record.key, "Quantity"]}
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
      dataIndex: "BatchBonusQty",
      key: "BatchBonusQty",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "BatchBonusQty"]}
          initialValue={record.BatchBonusQty}
        >
          <InputNumber
            min={0}
            //  defaultValue={batchRecord.BonusQty}
            // disabled
          />
        </Form.Item>
      ),
    },

    {
      title: "UOM",
      dataIndex: "UomId",
      key: "UomId",
      render: (text, record) => (
        <Form.Item name={[record.key, "UomId"]}>
          <Tag color="#7C00FE">{batchRecord.Uom}</Tag>
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
          <DatePicker
            format="DD-MM-YYYY"
            disabled={!!grnHeaderId && record.GrnBatchId}
            disabledDate={(current) => {
              // Disable future dates
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
          initialValue={
            record.EXPDateString
              ? moment(record.EXPDateString, "DD-MM-YYYY")
              : null
          }
          name={[record.key, "EXPDateString"]}
          rules={[
            {
              required:
                batchRecord.Expiry === "Month wise" ||
                batchRecord.Expiry === "Date wise",
              message: "input!",
            },
          ]}
        >
          <DatePicker
            format={
              batchRecord.Expiry === "Month wise"
                ? "MMMM YYYY"
                : batchRecord.Expiry === "Date wise"
                ? "DD-MM-YYYY"
                : null
            }
            disabled={
              (!!grnHeaderId && record.GrnBatchId) ||
              (batchRecord.Expiry !== "Month wise" &&
                batchRecord.Expiry !== "Date wise")
            }
            // disabled={record.Expiry!== "Month wise" && record.Expiry!== "Date wise"}
            disabledDate={(current) => {
              // Disable past dates
              return current && current < moment().startOf("day");
            }}
          />
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
          initialValue={batchRecord.PoRate}
        >
          <InputNumber min={0} disabled defaultValue={batchRecord.PoRate} />
        </Form.Item>
      ),
    },
    {
      title: "MRP",
      dataIndex: "MRP",
      key: "MRP",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "MRP"]}
          initialValue={record.MRP}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
            {
              validator: (_, value) => {
                if (value <= 0) {
                  return Promise.reject(
                    new Error("MRP should be greater than zero.")
                  );
                }
                if (value < batchRecord.PoRate) {
                  return Promise.reject(
                    new Error("MRP should be greater than Rate.")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={0}
            allowClear
            defaultValue={record.MRP}
            disabled={!!grnHeaderId && record.GrnBatchId}
          />
        </Form.Item>
      ),
    },
    {
      title: "Discount",
      dataIndex: "DiscountRate",
      key: "DiscountRate",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "DiscountRate"]}
          initialValue={batchRecord.DiscountRate}
        >
          <InputNumber
            min={0}
            disabled
            defaultValue={batchRecord.DiscountRate}
          />
        </Form.Item>
      ),
    },
    {
      title: "Discount Amt",
      dataIndex: "DiscountAmount",
      key: "DiscountAmount",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "DiscountAmount"]}
          initialValue={batchRecord.DiscountAmount}
        >
          <InputNumber
            min={0}
            disabled
            defaultValue={batchRecord.DiscountAmount}
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
          <Select disabled></Select>
        </Form.Item>
      ),
    },
    {
      title: "CGST Amount",
      dataIndex: "TaxAmount1",
      key: "TaxAmount1",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxAmount1"]}>
          <InputNumber min={0} disabled />
        </Form.Item>
      ),
    },
    {
      title: "SGST",
      dataIndex: "TaxType2",
      key: "TaxType2",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxType2"]}>
          <Select disabled></Select>
        </Form.Item>
      ),
    },
    {
      title: "SGST Amount",
      dataIndex: "TaxAmount2",
      key: "TaxAmount2",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxAmount2"]}>
          <InputNumber min={0} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Stock Locator",
      dataIndex: "StockLocator",
      key: "StockLocator",
      render: (text, record) => (
        <Form.Item name={[record.key, "StockLocator"]} initialValue="Manual">
          <Input disabled={!!grnHeaderId && record.GrnBatchId} />
        </Form.Item>
      ),
    },
  ];

  const validateEqualValue = (_, value) => {
    const va = form1.getFieldsValue();
    if (value === va.TotalPoAmount) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Value must be equal to TotalPoAmount"));
  };

  const SubmitChanged = (event) => {
    setGrnStatus(event.target.checked);
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
        title={"Create Direct GRN"}
        buttonIcon={<FaAnglesLeft style={{ fontSize: "1rem" }} />}
        buttonLabel={"Back"}
        onButtonClick={handleToDirectGRN}
      />

      <Form
        style={{ margin: "1rem" }}
        layout="vertical"
        onFinish={handleOnFinish}
        form={form1}
        initialValues={{
          GRNDatestring: dayjs(),
          DCChallanDateString: dayjs(),
          ReceivingDateString: dayjs(),
          InvoiceDateString: dayjs(),
          Replaceable: true,
          RoundOff: 0,
          gstTax: 0,
          TotalPoAmount: 0,
          Amount: 0,
        }}
      >
        <Row gutter={16}>
          <ColWithSixteenSpan>
            <Row gutter={16}>
              <ColWithEightSpan>
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
                    disabled={!!grnHeaderId}
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
                <Form.Item name="GRNHeaderId" hidden>
                  <Input></Input>
                </Form.Item>
                <Form.Item name="PoHeaderId" hidden>
                  <Input></Input>
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  label="Recieving Store"
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
                    disabled={!!grnHeaderId}
                  >
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
              </ColWithEightSpan>
              <ColWithEightSpan>
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
                    disabled={!!grnHeaderId}
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
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  label="Invoice Number"
                  name="InvoiceNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} type="text"></Input>
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  label="Invoice Date"
                  name="InvoiceDateString"
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
                    allowClear
                  />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  label="Invoice Amount"
                  name="InvoiceAmount"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                    {
                      validator: validateEqualValue,
                    },
                  ]}
                >
                  <InputNumber min={0} allowClear style={{ width: "100%" }} />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item label="DC Challan Number" name="DCChallanNumber">
                  <Input type="text"></Input>
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item label="DC Challan Date" name="DCChallanDateString">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    allowClear
                  />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  label="Recieving Date"
                  name="ReceivingDateString"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                </Form.Item>
              </ColWithEightSpan>
            </Row>
          </ColWithSixteenSpan>

          <ColWithEightSpan>
            <Row gutter={16}>
              <ColWithEightSpan>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                  label="GRN Date"
                  name="GRNDatestring"
                >
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  label="GRN Status"
                  name="GRNStatus"
                  rules={[
                    {
                      required: grnStatus,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear placeholder="Select Value">
                    <Select.Option key="Draft" value="Draft"></Select.Option>
                    <Select.Option
                      key="Finalize"
                      value="Finalize"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  name="Submit"
                  label={isMobile ? "" : " "}
                  valuePropName="checked"
                >
                  <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                </Form.Item>
              </ColWithEightSpan>
              <Col span={24}>
                <Form.Item label="Remarks" name="Remarks">
                  <TextArea
                    allowClear
                    autoSize={{
                      minRows: 5,
                      maxRows: 5,
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </ColWithEightSpan>
        </Row>
        <Row justify="end" gutter={16}>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
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
        <Divider style={{ margin: "0" }}></Divider>
        <Spin spinning={loading}>
          <CustomTable
            dataSource={data.filter((item) => item.ActiveFlag !== false)}
            columns={columns}
            isFilter={false}
            actionColumnName={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              />
            }
            scroll={{
              x: 1000,
            }}
            onDelete={() => handleDelete(record)}
          />
        </Spin>

        <Row justify={"end"}>
          <ColWithEightSpan>
            <Form.Item
              label=""
              name="TotalAmount"
              style={{ marginRight: "16px" }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <span>Amount : </span>
                </Col>
                <Col span={12}>
                  <InputNumber style={{ width: "100%" }} min={0} disabled />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              label=""
              name="TaxAmount1"
              style={{ marginRight: "16px" }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <span>GST Tax : </span>
                </Col>
                <Col span={12}>
                  <InputNumber style={{ width: "100%" }} min={0} disabled />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="" name="RoundOff" style={{ marginRight: "16px" }}>
              <Row gutter={16}>
                <Col span={12}>
                  <span>Round Off : </span>
                </Col>
                <Col span={12}>
                  <InputNumber style={{ width: "100%" }} min={0} disabled />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="" name="TotalPoAmount">
              <Row>
                <Col span={12}>
                  <span>Total PO Amount :</span>
                </Col>
                <Col span={12}>
                  <InputNumber style={{ width: "93%" }} min={0} disabled />
                </Col>
              </Row>
            </Form.Item>
          </ColWithEightSpan>
        </Row>
      </Form>

      <Modal
        title="Product Batch Details"
        onOk={onOkModal}
        onCancel={onCancelModel}
        width={"100rem"}
        open={modalVisible}
        maskClosable={false}
        cancelButtonProps={{ danger: "true" }}
      >
        <Form
          //onFinish={onFinishModel}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form2}
        >
          <Row gutter={32}>
            <ColWithSixSpan>
              <Tag color="#1890ff">
                Product : {"  "}
                <strong style={{ fontSize: "0.9rem" }}>
                  {batchRecord.LongName == undefined
                    ? batchRecord.ProductName
                    : batchRecord.LongName}
                </strong>
              </Tag>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Tag color="#52c41a">
                Recieved Qty :{" "}
                <strong style={{ fontSize: "0.9rem" }}>
                  {batchRecord.ReceivedQty}
                </strong>
              </Tag>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Tag color="#7FA1C3">
                Bonus Quantity :{" "}
                <strong style={{ fontSize: "0.9rem" }}>
                  {batchRecord.BonusQuantity ? batchRecord.BonusQuantity : 0}
                </strong>
              </Tag>
            </ColWithSixSpan>
          </Row>
          <Spin spinning={loading}>
            <CustomTable
              columns={columnsModel}
              dataSource={
                batchRecord.ProductId
                  ? dataModel.filter(
                      (item) =>
                        (item.ProductId == batchRecord.ProductId &&
                          item.ActiveFlag) ||
                        (item.ProductId == "" && item.ActiveFlag)
                    )
                  : initialModelDataSource
              }
              actionColumnName={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={ModelAdd}
                />
              }
              onDelete={() => ModelDelete(record)}
              scroll={{ x: 1700 }}
            />
          </Spin>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CreateDirectGRN;
