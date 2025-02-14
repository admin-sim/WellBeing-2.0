import customAxios from "../../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
import {
  urlCreatePurchaseOrder,
  urlAddNewGRNAgainstPO,
  urlCreateGRNAgainstPO,
  urlSearchPendingPO,
  urlEditGRNAgainstPO,
  urlUpdateGRNAgainstPO,
  urlGetTaxDetails,
} from "../../../../endpoints.js";
import Select from "antd/es/select";
import {
  ConfigProvider,
  Tooltip,
  Typography,
  Checkbox,
  Tag,
  Modal,
  Card,
  Popconfirm,
  Spin,
  Col,
  Divider,
  Row,
  message,
} from "antd";
import Input from "antd/es/input";
import Form from "antd/es/form";
import { DatePicker } from "antd";
import Layout from "antd/es/layout/layout";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { Table, InputNumber } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import CustomTable from "../../../components/customTable/index.jsx";
import moment from "moment";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { v4 as uuidv4 } from "uuid";
import { FaAnglesLeft } from "react-icons/fa6";
import {
  ColWithEightSpan,
  ColWithSixSpan,
  ColWithSixteenSpan,
  ColWithTwelveSpan,
} from "../../../components/customGridColumns/index.jsx";
const CreateGRNAgainstPO = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: [],
  });

  const [alternateUoms, setAlternateUoms] = useState([]);
  let [productCount, setProductcount] = useState(1);
  const [grnStatus, setGrnStatus] = useState(false);

  const location = useLocation();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const GrnHeaderId = location.state.GrnHeaderId;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataModal, setDataModal] = useState();

  const [selectedStore, setSelectedStore] = useState();
  const [selectedSupplier, setSelectedSupplier] = useState();

  const [loading, setLoading] = useState(false);
  const [isPoSearchTable, setIsPoSearchTable] = useState(false);
  const [mrp, setMrp] = useState();
  const [poloading, setPoloading] = useState(false);
  const [productLineId, setProductLineId] = useState(0);

  const [buttonTitle, setButtonTitle] = useState("Save");
  const [batches, setBatches] = useState([]);
  const [batchRecord, setBatchRecord] = useState([]);

  const [dropDownLoad, setDropDownLoading] = useState(true);
  const [poAmount, setPoAmount] = useState()
  const [Amount, setAmount] = useState()
  const [tax, setTax] = useState()
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
  const [toDate, setToDate] = useState(dayjs());

  useEffect(() => {
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
    setDropDownLoading(false);
  }, []);

  const initialModelDataSource =
    GrnHeaderId === 0
      ? [
        {
          key: uuidv4(),
          BarCode: "",
          BatchNo: "",
          Quantity: 0,
          ProductId: "",
          UomId: null,
          BatchBonusQty: 0,
          MFGDateString: "",
          EXPDateString: "",
          Rate: 0,
          MRP: 0,
          TaxType1: 0,
          TaxAmount1: 0,
          TaxType2: 0,
          TaxAmount2: 0,
          StockLocator: "",
          ActiveFlag: true,
          PoLineId: 0,
          DiscountRate: 0,
          DiscountAmount: 0,
          GrnBatchId: 0
        },
      ]
      : [];

  const [dataBatchModal, setdataBatchModal] = useState(initialModelDataSource);

  useEffect(() => {
    fetchData();
  }, []);

  const disableFromDate = (current) => {
    // Disable dates that are after today
    return current && current.isAfter(dayjs().endOf("day"));
  };

  const disableToDate = (current) => {
    return (
      current &&
      (current.isBefore(fromDate, "day") ||
        current.isAfter(dayjs().endOf("day")))
    );
  };

  const fetchData = async () => {
    debugger
    if (GrnHeaderId > 0) {
      setButtonTitle("Update");
      setLoading(true);
      try {
        const response = await customAxios.get(
          `${urlEditGRNAgainstPO}?GrnHeaderId=${GrnHeaderId}`
        );
        if (response.status == 200 && response.data.data != null) {
          const editeddata = response.data.data;
          const products = editeddata.GRNAgainstPODetails.map(
            (item) => ({
              ...item,
              key: uuidv4(),
            })
          );
          setData(products);
          const formdata = editeddata.newGRNAgainstPOModel;
          setPoAmount(formdata.TotalPoAmount)
          setTax(formdata.TaxAmount1)
          setAmount(formdata.TotalAmount)
          setPoAmount(formdata.TotalPoAmount)
          form1.setFieldsValue({
            SupplierId: formdata.SupplierId,
            StoreId: formdata.StoreId,
            DocumentType: formdata.DocumentType,
            TotalAmount: formdata.TotalAmount,
            TotalPoAmount: formdata.TotalPoAmount,
            PoHeaderId: formdata.PoHeaderId,
            GRNHeaderId: formdata.GRNHeaderId,
            InvoiceNumber: formdata.InvoiceNumber,
            InvoiceAmount: formdata.InvoiceAmount,
            TaxAmount1: formdata.TaxAmount,
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
            GRNStatus:
              formdata.GRNStatus == "Created" ? undefined : formdata.GRNStatus,
            Remarks: formdata.Remarks,
          });
          setProductcount(products.length + 1);

          const batch = editeddata.BatchDetails.map((item, index) => ({
            ...item,
            key: uuidv4(),
          }));
          setdataBatchModal(batch);
          // setCounter(editeddata.BatchDetails.length + 1);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const onOkModal = () => {
    form2
      .validateFields()
      .then(() => {
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.log("Validation error:", error);
      });
  };

  function calculateTotalAmount(data) {
    let totalAmount = 0;
    let amount = 0;
    let taxAmount = 0;
    data.forEach((item) => {
      if (
        item.ActiveFlag &&
        !isNaN(item.LineAmount) &&
        item.LineAmount !== null &&
        item.LineAmount !== undefined
      ) {
        totalAmount += item.TotalAmount;
        amount += item.LineAmount;
        taxAmount += item.TaxAmount1;
      }
    });
    return totalAmount = {
      totalAmount,
      amount,
      taxAmount
    };
  }

  const handleInputChange = (e, column, index, record) => {
    let newData;
    if (["ReceivedQty", "PoRate", "DiscountRate"].includes(column)) {
      newData = data.map((item) => {
        if (item.key === record.key) {
          // const altUom = alternateUoms.find(i => i.AlternateUom == record.UomId)
          // let poQuantity = record.PoQuantity * (altUom ? altUom.EquivalentUOMUnits : 1)
          const updatedItem = { ...item, [column]: e.target.value };

          const altUomData = alternateUoms.find(i => i.key == record.key)
          const altUom = altUomData ? altUomData.data.find((i1) => i1.AlternateUom == updatedItem.UomId) : undefined

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
            amount = poRate * recievingQty * (altUom ? altUom.EquivalentUOMUnits : 1) - discountAmount;
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
        TotalAmount: totalAmount.amount,
        TotalPoAmount: totalAmount.totalAmount,
        TaxAmount: totalAmount.taxAmount
      });
      setAmount(totalAmount.amount)
      setTax(totalAmount.taxAmount)
      setPoAmount(totalAmount.totalAmount)
    }
    setData(newData);
  };

  const onFinishmodal = (values) => {
    const va = form1.getFieldsValue();
    setPoloading(true);
    setIsPoSearchTable(true);
    const postData = {
      Supplier: va.SupplierId,
      ReceivingStore: va.StoreId,
      POStatus: values.POStatus ? values.POStatus : "ALL",
      FromDate: fromDate.format("DD-MM-YYYY"),
      ToDate: toDate.format("DD-MM-YYYY")
    };
    try {
      customAxios
        .get(
          `${urlSearchPendingPO}?Supplier=${postData.Supplier}&Store=${postData.ReceivingStore}&POStatus=${postData.POStatus}&FromDate=${postData.FromDate}&ToDate=${postData.ToDate}`
        )
        .then((response) => {
          const apiData = response.data.data;
          setDataModal(apiData.PurchaseOrderDetails);
        });
    } catch (error) {
      // Handle the error as needed
    }
    setPoloading(false);
  };

  const BatchmodalOpen = async (record) => {
    const fieldsToValidate = [[record.key, "ReceivedQty"]];
    const va = form1.getFieldsValue();
    await form1.validateFields(fieldsToValidate);
    setLoading(true);
    if (va[record.key].ReceivedQty <= va[record.key].PoBalanceQty) {
      record.ReceivedQty = va[record.key].ReceivedQty;
      setBatchRecord(record);
      setBatches([]);
      setProductLineId(parseInt(record.key));
      setIsBatchModalOpen(true);
      setLoading(false);
    } else {
      setLoading(false);
      message.warning("Recieved Qty should not greater than Pending Qty.");
    }
  };

  const handlePoNumber = (record) => {
    debugger
    setLoading(true);
    form1.resetFields();
    form3.resetFields();
    setBatchRecord([]);
    setData([]);

    const postData = {
      PoHeaderId: record.PoHeaderId,
      Supplier: record.SupplierId,
      Store: record.ProcurementStoreId
    };
    try {
      customAxios
        .get(
          `${urlCreateGRNAgainstPO}?PoHeaderId=${postData.PoHeaderId}&Supplier=${postData.Supplier}&Store=${postData.Store}`
        )
        .then((response) => {
          const apiData = response.data.data;
          const products = apiData.ProductDetails.map((item) => {
            const key = uuidv4();
            setAlternateUoms((prev) => [
              ...prev,
              { key, data: item.AlternateUoms }
            ]);
            return {
              ...item,
              key,
              LineAmount: 0,
              TaxAmount1: 0,
              TotalAmount: 0,
              Uom: item.ShortName,
              temp: item.TaxTypeName == 'Tax(Inclusive)' ? 1 : 0
            };
          });
          // const products = apiData.ProductDetails.map((item, index) => ({
          //   ...item,
          //   key: uuidv4(),
          //   LineAmount: 0,
          //   TaxAmount1: 0,
          //   TotalAmount: 0,
          //   Uom: item.ShortName
          // }));
          // setAlternateUoms(apiData.ProductDetails[0].AlternateUoms)
          setData(products);
          const formdata = apiData.POProducts;
          form1.setFieldsValue({
            SupplierId: record.SupplierId,
            StoreId: formdata.ProcurementStoreId,
            DocumentType: formdata.DocumentType,
            PoHeaderId: formdata.PoHeaderId,
          });

          setIsModalOpen(false);
        });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "ProductName",
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "ProductName"]}
            initialValue={record.LongName}
          >
            <Input style={{ width: 200 }} disabled />
          </Form.Item>
          <Form.Item
            name={[record.key, "ProductId"]}
            hidden
            initialValue={record.ProductId}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={[record.key, "PoLineId"]}
            hidden
            initialValue={record.PoLineId}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={[record.key, "GrnLineId"]}
            hidden
            initialValue={record.GrnLineId}
          >
            <Input />
          </Form.Item>
        </>
      ),
    },
    {
      title: "UOM",
      dataIndex: "UomId",
      key: "UomId",
      render: (text, record) => (
        <Form.Item name={[record.key, "UomId"]} initialValue={record.UomId}>
          <Select disabled>
            {DropDown.UOM.map((option) => (
              <Select.Option key={option.UomId} value={option.UomId}>
                {option.FullName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "PO Pending Qty",
      dataIndex: "PoBalanceQty",
      key: "PoBalanceQty",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "PoBalanceQty"]}
          initialValue={record.PoBalanceQty}
        // initialValue={record.PoBalanceQty + record.PoBalanceBonusQty}
        >
          <InputNumber min={0} disabled />
        </Form.Item>
      ),
    },
    {
      title: "PO Received Qty",
      dataIndex: "ReceivedQty",
      key: "ReceivedQty",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "ReceivedQty"]}
          initialValue={
            record.ReceivedQty == 0 ? undefined : record.ReceivedQty
          }
          rules={[
            {
              required: true,
              message: "Please input!",
            },
            {
              validator: (_, value) => {
                if (value > record.PoBalanceQty) {
                  return Promise.reject(
                    new Error("Received Qty must be less than PO Qty.")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={0}
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
      key: "BonusQuantity",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "BonusQuantity"]}
          initialValue={record.BonusQuantity}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
            {
              validator: (_, value) => {
                if (value > record.PoBalanceBonusQty) {
                  return Promise.reject(
                    new Error(
                      "BonusQuantity  must be less than PoBalanceBonusQty."
                    )
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={0}
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
      key: "PoRate",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "PoRate"]}
          initialValue={record.PoRate}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <InputNumber min={0} disabled precision={4} />
        </Form.Item>
      ),
    },
    {
      title: "Discount%",
      dataIndex: "DiscountRate",
      key: "DiscountRate",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "DiscountRate"]}
          initialValue={record.DiscountRate}
        >
          <InputNumber min={0} disabled precision={4} />
        </Form.Item>
      ),
    },
    {
      title: "Discount Amount",
      dataIndex: "DiscountAmount",
      key: "DiscountAmount",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "DiscountAmount"]}
          initialValue={record.DiscountAmount}
        >
          <InputNumber disabled precision={4} />
        </Form.Item>
      ),
    },
    // {
    //   title: "Batch",
    //   dataIndex: "Batch",
    //   key: "Batch",
    //   render: (text, record, index) => (
    //     <Button type="link" onClick={() => BatchmodalOpen(record)}>
    //       Batch
    //     </Button>
    //   ),
    // },

    {
      title: "Batch",
      dataIndex: "Batch",
      key: "Batch",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "Batch"]}
        //initialValue={record.PoBalanceQty}
        >
          <Button type="link" onClick={() => BatchmodalOpen(record)}>
            Batch
          </Button>
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      dataIndex: "LineAmount",
      key: "LineAmount",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "LineAmount"]}
          initialValue={record.LineAmount}
        >
          <InputNumber disabled precision={4} />
        </Form.Item>
      ),
    },
    {
      title: "Tax Amount",
      dataIndex: "TaxAmount1",
      key: "TaxAmount1",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxAmount1"]} initialValue={record.TaxAmount1}>
          <InputNumber disabled precision={4} />
        </Form.Item>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "TotalAmount",
      key: "TotalAmount",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "TotalAmount"]}
          initialValue={record.TotalAmount}
        >
          <InputNumber disabled precision={4} />
        </Form.Item>
      ),
    },
    {
      title: "Replaceable",
      dataIndex: "Replaceable",
      key: "Replaceable",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "Replaceable"]}
          initialValue={true}
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>
      ),
    },
  ];

  const columnsmodal = [
    {
      title: "PO Number",
      dataIndex: "PONumber",
      key: "PONumber",
      render: (text, record, index) => (
        <Button type="link" onClick={() => handlePoNumber(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Document Type",
      dataIndex: "DocumentTypeName",
      key: "DocumentTypeName",
      sorter: (a, b) => a.DocumentType.localeCompare(b.DocumentType)
    },
    {
      title: "PO Date",
      dataIndex: "PoDateString",
      key: "PoDateString",
      sorter: (a, b) => a.PoDateString.localeCompare(b.PoDateString)
    },
    {
      title: "PO Owner",
      dataIndex: "CreatedBy",
      key: "CreatedBy",
      sorter: (a, b) => a.CreatedBy.localeCompare(b.CreatedBy)
    },
    {
      title: "Status",
      dataIndex: "PoStatus",
      key: "PoStatus",
      sorter: (a, b) => a.PoStatus.localeCompare(b.PoStatus)
    },
  ];

  const onCancelmodal = () => {
    form2.resetFields();
    setIsModalOpen(false);
    setDataModal([]);
  };

  const handleCancel = () => {
    const url = "/GRNAgainstPO";
    navigate(url);
  };
  const handleReset = () => {
    form1.resetFields();
    form2.resetFields();
  };

  const Searchmodal = (value, record) => {
    setData([]);
    // setdataBatchModal([]);
    // setdataBatchModal(initialModelDataSource);
    const fieldsToValidate = ["SupplierId", "StoreId"];
    form1
      .validateFields(fieldsToValidate)
      .then(() => {
        const selectedSupplier = form1.getFieldValue("SupplierId");
        const selcctedStore = form1.getFieldValue("StoreId");

        const selectedOptionSupplier = DropDown.SupplierList.find(
          (option) => option.VendorId === selectedSupplier
        );
        const selectedOptionStore = DropDown.StoreDetails.find(
          (option) => option.StoreId === selcctedStore
        );

        if (selectedOptionStore && selectedOptionSupplier) {
          setSelectedSupplier(selectedOptionStore.LongName);
          setSelectedStore(selectedOptionSupplier.LongName);
        }
        form2.submit();
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.log("Validation error:", error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onOkBatchModal = async () => {
    debugger
    await form3.validateFields();
    const values = form3.getFieldsValue();
    const valuesArray = Object.values(values);
    const qty = valuesArray.reduce(
      (total, item) => (item ? total + (item.Quantity || 0) : total),
      0
    );

    const bonusqty = valuesArray.reduce(
      (total, item) => (item ? total + (item.BatchBonusQty || 0) : total),
      0
    );
    if (bonusqty != batchRecord.BonusQuantity) {
      message.warning(
        "Total Batch Bonus Quantity should be equal to Total Bonus Quantity"
      );
      return false;
    }

    if (qty === batchRecord.ReceivedQty) {
      const updatedBatch = dataBatchModal.map((item) => {
        const key = item.key;
        if (values[key] != undefined) {
          if (
            values[key].Quantity ||
            values[key].EXPDateString ||
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
              // EXPDateString: batchRecord.Expiry === "Month wise"
              // ? values[key].EXPDateString
              //   ? `01-${moment(values[key].EXPDateString).format("MM-YYYY")}`
              //   : null
              // : values[key].EXPDateString
              // ? values[key].EXPDateString.format("DD-MM-YYYY")
              // : null,
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
              Rate: values[key].Rate,
              MRP: values[key].MRP,
              StockLocator: 0,
              PoLineId: batchRecord.PoLineId,
              TaxType1: values[key].TaxType1,
              TaxType2: values[key].TaxType2,
              TaxAmount1: values[key].TaxAmount1,
              TaxAmount2: values[key].TaxAmount2
            };
          }
          return item;
        }
        return item;
      });
      setdataBatchModal(updatedBatch);
      batchRecord.LineAmount = (batchRecord.LineAmount || 0)
      batchRecord.TotalAmount = (batchRecord.TotalAmount || 0)
      batchRecord.DiscountAmount = (batchRecord.DiscountAmount || 0)
      const altUomData = alternateUoms.find(i => i.key == batchRecord.key)
      const altUom = altUomData ? altUomData.data.find((i1) => i1.AlternateUom == batchRecord.UomId) : undefined
      batchRecord.LineAmount = updatedBatch.reduce((total, item) => {
        if (item.ProductId == batchRecord.ProductId && item.ActiveFlag) {
          const taxAdjustment = batchRecord.temp === 0 ? 0 : (item.TaxAmount1 || 0) + (item.TaxAmount2 || 0);
          return total + (item.Quantity * (altUom ? altUom.EquivalentUOMUnits : 1)) * item.Rate - taxAdjustment;
        }

        return total - batchRecord.DiscountAmount;
      }, 0);

      batchRecord.TotalAmount = updatedBatch.reduce((total, item) => {
        if (item.ProductId == batchRecord.ProductId && item.ActiveFlag) {
          if (batchRecord.temp === 0) {
            return total + (item.Quantity * (altUom ? altUom.EquivalentUOMUnits : 1)) * item.Rate + ((item.TaxAmount1 || 0) + (item.TaxAmount2 || 0));
          } else {
            return total + (item.Quantity * (altUom ? altUom.EquivalentUOMUnits : 1)) * item.Rate;
          }
        }

        return total - batchRecord.DiscountAmount;
      }, 0);

      // Update Product Line
      const form3d = form3.getFieldsValue()
      const form3do = Object.values(form3d)
      const totalTaxAmount1 = form3do.reduce((sum, item) => sum + (item.TaxAmount1 + item.TaxAmount2 || 0), 0);

      const newdata = (data || []).map(item =>
        item.ProductId === batchRecord?.ProductId
          ? { ...item, TaxAmount1: totalTaxAmount1, LineAmount: batchRecord.LineAmount - batchRecord.DiscountAmount, TotalAmount: batchRecord.TotalAmount - batchRecord.DiscountAmount }
          : item
      );
      setData(newdata)

      form1.setFieldsValue({ [batchRecord.key]: { LineAmount: batchRecord.LineAmount - batchRecord.DiscountAmount } })
      form1.setFieldsValue({ [batchRecord.key]: { TotalAmount: batchRecord.TotalAmount - batchRecord.DiscountAmount } })
      form1.setFieldsValue({ [batchRecord.key]: { TaxAmount1: totalTaxAmount1 } })

      const totalAmount = calculateTotalAmount(newdata);
      form1.setFieldsValue({
        TotalAmount: totalAmount.amount,
        TotalPoAmount: totalAmount.totalAmount,
        TaxAmount: totalAmount.taxAmount
      });
      setAmount(totalAmount.amount)
      setTax(totalAmount.taxAmount)
      setPoAmount(totalAmount.totalAmount)

      setIsBatchModalOpen(false);
    } else {
      message.warning("Quantity shold be equal to Recieved Quantity");
    }
  };

  const onCancelBatchmodal = () => {
    const newData = dataBatchModal.map((item) => {
      if (item.ProductId === "") {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });

    setdataBatchModal(newData);
    //setIsModalOpen(false);
    setIsBatchModalOpen(false);
    //form3.resetFields();
    form3.resetFields({
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

  const onFinishBatchmodal = () => { };

  const onFinishBatchFailed = () => { };

  const handleOnFinish = async (values) => {
    setLoading(true)
    const isAnyIdNotNull = dataBatchModal.some(
      (item) => item.ProductId !== "" && item.ActiveFlag
    );

    if (!isAnyIdNotNull) {
      message.warning("Please add Batch details");
      setLoading(false)
      return false;
    }

    if (values.TotalPoAmount !== values.InvoiceAmount) {
      message.warning("Invoice Amount Must be equal to Total Po Amount");
      setLoading(false)
      return false;
    }
    const products = [];
    data.forEach((i) => {
      if (values.TotalPoAmount == values.InvoiceAmount) {
        if (values[i.key] !== undefined) {
          if (
            // values[i.key].ReceivedQty + values[i.key].BonusQuantity <=
            // values[i.key].PoBalanceQty
            values[i.key].ReceivedQty <=
            values[i.key].PoBalanceQty
          ) {
            const product = {
              ProductId: values[i.key].ProductId,
              UomId: values[i.key].UomId,
              ReceivedQty: values[i.key].ReceivedQty,
              PoQuantity: values[i.key].PoBalanceQty,
              BonusQuantity: values[i.key].BonusQuantity || 0,
              PoLineId: values[i.key].PoLineId || 0,
              GrnLineId: values[i.key].GrnLineId || 0,
              PoRate: values[i.key].PoRate,
              DiscountRate: values[i.key].DiscountRate || 0,
              DiscountAmount: values[i.key].DiscountAmount ?? 0,
              LineAmount: values[i.key].LineAmount,
              TaxAmount1: values[i.key].TaxAmount1 ?? 0,
              TotalAmount: values[i.key].TotalAmount,
              Replaceable: values[i.key].Replaceable === true ? "Y" : "N",
              // PoStatus:
              //   values[i.key].ReceivedQty + values[i.key].BonusQuantity ==
              //     values[i.key].PoBalanceQty
              //     ? "Completed"
              //     : "Pending",
              PoStatus:
                values[i.key].ReceivedQty ==
                  values[i.key].PoBalanceQty
                  ? "Completed"
                  : "Pending",
              ActiveFlag: true,
            };
            products.push(product);
          } else {
            message.warning("Recieved Qty must not Greater than PoPending Qty");
            setLoading(false)
            return false;
          }
        }
      } else {
        message.warning("Invoice Amount Must be equals to Total Po Amount");
        setLoading(false)
        return false;
      }
    })

    const activeProducts = products.filter((product) => product.ActiveFlag);

    const GRNAgainstPO = {
      GRNHeaderId: values.GRNHeaderId,
      PoHeaderId: values.PoHeaderId,
      SupplierId: values.SupplierId,
      StoreId: values.StoreId,
      DocumentType: values.DocumentType || "",
      DCChallanDateString: values.DCChallanDateString
        ? values.DCChallanDateString.format("DD-MM-YYYY")
        : "",
      GRNDatestring: values.GRNDatestring.format("DD-MM-YYYY"),
      InvoiceDateString: values.InvoiceDateString.format("DD-MM-YYYY"),
      ReceivingDateString: values.ReceivingDateString.format("DD-MM-YYYY"),
      Remarks: values.Remarks || null,
      GrnStatus: grnStatus ? values.GRNStatus : "Created",
      InvoiceNumber: values.InvoiceNumber || null,
      InvoiceAmount: values.InvoiceAmount || 0,
      DCChallanNumber: values.DCChallanNumber,
      TotalAmount: values.TotalAmount,
      TaxAmount1: values.TaxAmount || 0,
      RoundOff: values.RoundOff || 0,
      TotalPoAmount: values.TotalPoAmount,
    };

    const result = checkActiveBatches(products, dataBatchModal);
    if (!result.allActiveProductsHaveActiveBatch) {
      message.warning("Please Add Batch Details");
      return false;
    }

    const filteredBatch = dataBatchModal.filter((item) => item.ProductId);

    const filteredBatchwithactive = dataBatchModal.filter(
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
      newGRNAgainstPOModel: GRNAgainstPO,
      GRNAgainstPODetails: products,
      BatchDetails: GrnHeaderId === 0 ? filteredBatchwithactive : filteredBatch,
    };

    const url = GrnHeaderId > 0 ? urlUpdateGRNAgainstPO : urlAddNewGRNAgainstPO;
    const response = await customAxios.post(url, postData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response && response.status === 200) {
      message.success(
        GrnHeaderId > 0 ? "Updated Successfully" : "Created Successfully"
      );
    } else {
      message.error(GrnHeaderId > 0 ? "Update Failed" : "Creation Failed");
    }

    handleCancel();
  };

  const BatchAdd = async () => {
    await form3.validateFields();
    setdataBatchModal([
      ...dataBatchModal,
      {
        key: uuidv4(),
        BarCode: "",
        BatchNo: "",
        Quantity: 0,
        ProductId: "",
        UomId: null,
        BatchBonusQty: 0,
        MFGDateString: "",
        EXPDateString: "",
        Rate: 0,
        MRP: 0,
        TaxType1: 0,
        TaxAmount1: 0,
        TaxType2: 0,
        TaxAmount2: 0,
        StockLocator: 0,
        StockLocatorName: "",
        ActiveFlag: true,
        DiscountRate: 0,
        DiscountAmount: 0,
        GrnBatchId: 0,
      },
    ]);
    // setCounter(counter + 1);
  };

  const Batchmodal = [
    {
      title: "Bar Code",
      dataIndex: "BarCode",
      key: 'BarCode',
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "BarCode"]}
            initialValue={record.BarCode}
          >
            <Input
              style={{ width: 100 }}
              min={0}
              disabled={!!GrnHeaderId && record.GrnBatchId}
            />
          </Form.Item>
          <Form.Item
            name={[record.key, "GrnLineId"]}
            hidden
            initialValue={record.GrnLineId}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            name={[record.key, "GrnBatchId"]}
            hidden
            initialValue={record.GrnBatchId}
          >
            <Input></Input>
          </Form.Item>
        </>
      ),
    },
    {
      title: "Batch Number",
      dataIndex: "BatchNo",
      key: 'BatchNo',
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
            <Input
              style={{ width: 100 }}
              disabled={!!GrnHeaderId && record.GrnBatchId}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: 'Quantity',
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "Quantity"]}
          initialValue={record.Quantity}
          rules={[
            {
              required: true,
              message: "input!",
            },
            {
              validator: (_, value) => {
                if (value <= 0) {
                  return Promise.reject(
                    new Error("Quantity should be greater than zero.")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={0}
            style={{ width: 70 }}
            onChange={(value) => {
              handleInputChangeModal({ target: { value } }, "Quantity", index, record);
            }}
          // disabled={!!GrnHeaderId && record.GrnBatchId}
          />
        </Form.Item>
      ),
    },
    {
      title: "Bonus Qty",
      dataIndex: "BatchBonusQty",
      key: 'BatchBonusQty',
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "BatchBonusQty"]}
          initialValue={record.BatchBonusQty}
          rules={[
            {
              required: true,
              message: "input!",
            },
          ]}
        >
          <InputNumber min={0} style={{ width: 70 }} onChange={(value) => {
            handleInputChangeModal({ target: { value } }, "BatchBonusQty", index, record);
          }} />
        </Form.Item>
      ),
    },
    {
      title: "Uom",
      dataIndex: "UomId",
      key: 'UomId',
      render: (text, record) => (
        <Form.Item name={[record.key, "UomId"]}>
          <Tag color="#7C00FE">{batchRecord.Uom}</Tag>
        </Form.Item>
      ),
    },
    {
      title: "MFG Date",
      dataIndex: "MFGDateString",
      key: 'MFGDateString',
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
            style={{ width: 120 }}
            format="DD-MM-YYYY"
            disabled={!!GrnHeaderId && record.GrnBatchId}
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
      key: 'EXPDateString',
      width: 150,
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
          width={150}
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
              (!!GrnHeaderId && record.GrnBatchId) ||
              (batchRecord.Expiry !== "Month wise" &&
                batchRecord.Expiry !== "Date wise")
            }
            // disabled={record.Expiry!== "Month wise" && record.Expiry!== "Date wise"}
            style={{ width: 120 }}
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
      dataIndex: "Rate",
      key: 'Rate',
      render: (text, record) => (
        <Form.Item
          name={[record.key, "Rate"]}
          initialValue={batchRecord.PoRate}
        >
          <InputNumber precision={4}
            min={0}
            style={{ width: 70 }}
            defaultValue={batchRecord.PoRate}
            disabled
          />
        </Form.Item>
      ),
    },
    {
      title: "MRP",
      dataIndex: "MRP",
      key: 'MRP',
      render: (text, record, index) => (
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
            style={{ width: 70 }}
            allowClear
            disabled={!!GrnHeaderId && record.GrnBatchId}
            onChange={(value) => {
              handleInputChangeModal({ target: { value } }, "MRP", index, record);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Discount",
      dataIndex: "DiscountRate",
      key: 'DiscountRate',
      render: (text, record) => (
        <Form.Item
          name={[record.key, "DiscountRate"]}
          initialValue={batchRecord.DiscountRate}
        >
          <InputNumber min={0} style={{ width: 70 }} precision={2} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Discount Amt",
      dataIndex: "DiscountAmount",
      key: 'DiscountAmount',
      render: (text, record) => (
        <Form.Item
          name={[record.key, "DiscountAmount"]}
          initialValue={batchRecord.DiscountAmount}
        >
          <InputNumber min={0} style={{ width: 70 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "CGST",
      dataIndex: "TaxType1",
      key: 'TaxType1',
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxType1"]} initialValue={batchRecord.TaxType1 ? batchRecord.TaxType1 : text}>
          <Select style={{ width: 70 }} disabled>
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
      key: 'TaxAmount1',
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxAmount1"]} initialValue={text}>
          <InputNumber min={0} style={{ width: 90 }} precision={4} disabled />
        </Form.Item>
      ),
    },
    {
      title: "SGST",
      dataIndex: "TaxType2",
      key: 'TaxType2',
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxType2"]} initialValue={batchRecord.TaxType2 ? batchRecord.TaxType2 : text}>
          <Select style={{ width: 70 }} disabled>
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
      key: 'TaxAmount2',
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxAmount2"]} initialValue={text}>
          <InputNumber min={0} style={{ width: 90 }} precision={4} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Stock Locator",
      dataIndex: "StockLocator",
      key: 'StockLocator',
      render: (text, record) => (
        <Form.Item name={[record.key, "StockLocator"]} initialValue={"Manual"}>
          <Input style={{ width: 70 }} disabled={!!GrnHeaderId} />
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
      width: 50,
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

  const handleInputChangeModal = async (e, column, index, record) => {
    let newData;
    const form3data = form3.getFieldsValue()
    let newRecord = await CalculateTax(form3data, record)

    if (["Quantity", "BatchBonusQty", "MRP"].includes(column)) {
      newData = newRecord.map((item) => {
        if (item.key === record.key) {
          const updatedItem = { ...item, [column]: e.target.value };

          const Quantity = column === "Quantity" ? e.target.value : item.Quantity;
          const bonusQty = column === "BatchBonusQty" ? e.target.value : item.BatchBonusQty;
          const mrp = column === "MRP" ? e.target.value : item.MRP;
          const taxAmount1 = column ? item.TaxAmount1 : record.TaxAmount1;
          const taxAmount2 = column ? item.TaxAmount2 : record.TaxAmount2;

          let discountAmount = 0;
          let amount = 0;
          if (bonusQty != null && Quantity != null) {
            const discount = mrp != null ? mrp : 0;
            discountAmount = (bonusQty * Quantity * discount) / 100;
            amount = bonusQty * Quantity - discountAmount;
          }

          updatedItem.TaxAmount1 = taxAmount1;
          updatedItem.TaxAmount2 = taxAmount2

          form1.setFieldsValue({ [record.key]: { DiscountAmount: taxAmount1 } });
          form1.setFieldsValue({ [record.key]: { LineAmount: taxAmount2 } });

          return updatedItem;
        }
        return item;
      });
      setdataBatchModal(newData)
    }

    // if (["PoQuantity", "PoRate", "DiscountRate", 'TaxType1', 'TaxType2'].includes(column)) {
    //   const totalAmount = calculateTotalAmount(newData);
    //   form1.setFieldsValue({
    //     TotalAmount: totalAmount.TotalAmount,
    //     TotalPoAmount: totalAmount.LineAmount,
    //     TaxAmount1: totalAmount.GstTax,
    //   });
    //   setPoAmount(totalAmount.LineAmount)
    //   setAmount(totalAmount.TotalAmount)
    //   setGSTTax(totalAmount.GstTax)
    // }
    // setData(newData);
  };

  async function CalculateTax(data, record) {
    const response = await customAxios.get(`${urlGetTaxDetails}?AdditionalChargeId=${data[record.key].TaxType1}`);
    const taxDetails = response.data.data[0];
    const altUomData = alternateUoms.find(i => i.key == batchRecord.key)
    const altUom = altUomData ? altUomData.data.find((i1) => i1.AlternateUom == batchRecord.UomId) : undefined
    // const altUom = alternateUoms.find(i => i.AlternateUom == batchRecord.UomId)
    // let poQuantity = record.PoQuantity * (altUom ? altUom.EquivalentUOMUnits : 1)
    let Quantity = (data[record.key].Quantity || 0) * (altUom ? altUom.EquivalentUOMUnits : 1);
    let amount = Quantity * (data[record.key].Rate || 0) - (data[record.key].DiscountAmount || 0);
    let discountAmount = data[record.key].DiscountAmount
    let mrp = data[record.key].MRP
    let taxAmount = 0;
    let temp = 0;
    if (taxDetails.IncludeBonusQuantity) {
      Quantity = (Quantity || 0) + parseInt(record.BonusQuantity || 0);
      amount = Quantity * (data[record.key].Rate || 0) - (data[record.key].DiscountAmount || 0);
    }
    if (true) {
      switch (taxDetails.ChargeType) {
        case "Percentage":
          if (taxDetails.AdditionalChargeType == 'Tax(Exclusive)') {
            if (taxDetails.AdditionalChargeIndicator == "Gross") {
              taxAmount = (parseInt(amount) + parseInt(discountAmount)) * taxDetails.ChargeValue / 100;
            } else if (taxDetails.AdditionalChargeIndicator == "Net") {
              taxAmount = amount * taxDetails.ChargeValue / 100;
            } else {
              taxAmount = (parseInt(mrp) * parseInt(Quantity)) * taxDetails.ChargeValue / 100;
            }
          } else {
            if (taxDetails.AdditionalChargeIndicator == "Gross") {
              taxAmount = (parseInt(amount) + parseInt(discountAmount)) - ((parseInt(amount) + parseInt(discountAmount)) / (1 + taxDetails.ChargeValue / 100));
              temp = 1;
            } else if (taxDetails.AdditionalChargeIndicator == "Net") {
              taxAmount = amount - (amount / (1 + taxDetails.ChargeValue / 100));
              temp = 1;
            } else {
              taxAmount = (mrp * Quantity) - ((mrp * Quantity) / (1 + taxDetails.ChargeValue / 100));
              temp = 1;
            }
          }
          break;

        case "Amount":
          if (taxDetails.AdditionalChargeType == 'Tax(Exclusive)') {
            if (taxDetails.AdditionalChargeIndicator == "Gross") {
              taxAmount = (parseInt(amount) + parseInt(record.DiscountAmount)) + parseInt(taxDetails.ChargeValue);
            } else if (taxDetails.AdditionalChargeIndicator == "Net") {
              taxAmount = parseInt(amount) + parseInt(taxDetails.ChargeValue);
            } else {
              taxAmount = (mrp * Quantity) + parseInt(taxDetails.ChargeValue);
            }
          } else {
            if (taxDetails.AdditionalChargeIndicator == "Gross") {
              taxAmount = (parseInt(amount) + parseInt(discountAmount)) - taxDetails.ChargeValue;
              temp = 1;
            } else if (taxDetails.AdditionalChargeIndicator == "Net") {
              taxAmount = amount - taxDetails.ChargeValue;
              temp = 1;
            } else {
              taxAmount = parseInt(mrp * Quantity) - taxDetails.ChargeValue;
              temp = 1;
            }
          }
          break;

        default:
          break;
      }

      // if (temp == 1) {
      form3.setFieldsValue({ [record.key]: { TaxAmount1: parseFloat(taxAmount) } })
      form3.setFieldsValue({ [record.key]: { TaxAmount2: parseFloat(taxAmount) } })
      // }
      // else {
      //   form3.setFieldsValue({ [record.key]: { TaxAmount1: parseFloat(taxAmount) } })
      //   form3.setFieldsValue({ [record.key]: { TaxAmount2: parseFloat(taxAmount) } })
      // }
    }

    const newData = dataBatchModal.map((item) => {
      if (record.key == item.key) {
        return {
          ...item,
          TaxType1: data[record.key].TaxType1,
          TaxType2: data[record.key].TaxType2,
          TaxAmount1: taxAmount,
          TaxAmount2: taxAmount,
        }
      }
      return item
    })
    setdataBatchModal(newData)
    return newData
  }

  const BatchDelete = (record) => {
    const newData = dataBatchModal.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setdataBatchModal(newData);
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
        title={"Create GRN Against PO"}
        buttonIcon={<FaAnglesLeft style={{ fontSize: "1rem" }} />}
        buttonLabel={"Back"}
        onButtonClick={handleCancel}
      />
      <Form
        layout="vertical"
        onFinish={handleOnFinish}
        style={{
          margin: "1rem",
        }}
        form={form1}
        initialValues={{
          GRNDatestring: dayjs(),
          ReceivingDateString: dayjs(),
          InvoiceDateString: dayjs(),
          DCChallanDateString: dayjs(),
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
                    disabled={!!GrnHeaderId}
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
                <Form.Item name="PoHeaderId" hidden>
                  <Input></Input>
                </Form.Item>
                <Form.Item name="GRNHeaderId" hidden>
                  <Input></Input>
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  label="Receiving Store"
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
                    disabled={!!GrnHeaderId}
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
                <Form.Item label=" ">
                  {GrnHeaderId <= 0 && (
                    <Tooltip title="Search Pending PO">
                      <Typography.Link
                        onClick={Searchmodal}
                        style={{ fontWeight: "bold" }}
                      >
                        Pending Po
                      </Typography.Link>
                    </Tooltip>
                  )}
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
                  hasFeedback
                  validateDebounce={2000}
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} allowClear />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item label="Invoice Date" name="InvoiceDateString">
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY"
                    disabledDate={(current) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return current && current < today;
                    }}
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
                  ]}
                >
                  <InputNumber min={0} allowClear style={{ width: "100%" }} />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item label="DC Challan Number" name="DCChallanNumber">
                  <Input style={{ width: "100%" }} allowClear />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item label="DC Challan Date" name="DCChallanDateString">
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY"
                    disabledDate={(current) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return current && current < today;
                    }}
                  />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  label="Receiving Date"
                  name="ReceivingDateString"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY"
                    disabledDate={(current) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return current && current < today;
                    }}
                  />
                </Form.Item>
              </ColWithEightSpan>
            </Row>
          </ColWithSixteenSpan>
          <ColWithEightSpan>
            <Row gutter={16}>
              <ColWithEightSpan>
                <Form.Item label="GRN Date" name="GRNDatestring">
                  <DatePicker format="DD-MM-YYYY"
                    disabledDate={(current) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return current && current < today;
                    }}
                  />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  label="GRNStatus"
                  name="GRNStatus"
                  rules={[
                    {
                      required: grnStatus,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear placeholder="Select Value">
                    <Option value="Draft">Draft</Option>
                    <Option value="Finalize">Finalize</Option>
                  </Select>
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item label=" " name="SubmitCheck">
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
              <Button type="primary" htmlType="submit" disabled={loading}>
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
            dataSource={data}
            columns={columns}
            isFilter={false}
            actionColumn={false}
            // scroll={{ x: 2000 }}
            bordered
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
                  <InputNumber style={{ width: "100%" }} min={0} value={Amount} precision={4} disabled />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              name="TaxAmount"
              style={{ marginRight: "16px" }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <span>Tax : </span>
                </Col>
                <Col span={12}>
                  <InputNumber style={{ width: "100%" }} min={0} disabled value={tax} precision={4} />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              name="RoundOff"
              style={{ marginRight: "16px" }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <span>Round Off : </span>
                </Col>
                <Col span={12}>
                  <InputNumber style={{ width: "100%" }} min={0} disabled />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item name="TotalPoAmount">
              <Row>
                <Col span={12}>
                  <span>Total PO Amount :</span>
                </Col>
                <Col span={12}>
                  <InputNumber style={{ width: "93%" }} min={0} disabled precision={4} value={poAmount} />
                </Col>
              </Row>
            </Form.Item>
          </ColWithEightSpan>
        </Row>
      </Form>
      <Modal
        title="Search for PO"
        onOk={onOkModal}
        okButtonProps={{ hidden: true }}
        onCancel={onCancelmodal}
        cancelText="Close"
        width={"60rem"}
        open={isModalOpen}
        maskClosable={false}
        cancelButtonProps={{ danger: "true" }}
      >
        <Form
          style={{ width: "100%" }}
          onFinish={onFinishmodal}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          form={form2}
          initialValues={{
            POStatus: "ALL",
            PODateFrom: fromDate,
            PODateTo: toDate
          }}
        >
          <Row gutter={16}>
            <ColWithTwelveSpan style={{ marginBottom: "0.5rem" }}>
              <Tag color="#1890ff">
                Supplier :{" "}
                <strong style={{ fontSize: "0.9rem" }}>{selectedStore}</strong>
              </Tag>
            </ColWithTwelveSpan>
            <ColWithTwelveSpan>
              <Tag color="#52c41a">
                Receiving Store :{" "}
                <strong style={{ fontSize: "0.9rem" }}>
                  {selectedSupplier}
                </strong>
              </Tag>
            </ColWithTwelveSpan>
          </Row>
          <Row gutter={16} style={{ marginTop: "1rem" }}>
            <ColWithEightSpan>
              <Form.Item label="PO Status" name="POStatus">
                <Select>
                  <Option key="ALL" value="ALL">
                    ALL
                  </Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="PartiallyPending">Partially Pending</Option>
                </Select>
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <>
                <Form.Item
                  label="PO Date From"
                  name="PODateFrom"
                  rules={[
                    {
                      required: true,
                      message: "Input!",
                    },
                  ]}
                >
                  <DatePicker
                    value={fromDate}
                    onChange={(date) => setFromDate(date)}
                    disabledDate={disableFromDate}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item
                label="PO Date To"
                name="PODateTo"
                rules={[
                  {
                    required: true,
                    message: "Input!",
                  },
                ]}
              >
                <DatePicker
                  value={toDate}
                  onChange={(date) => setToDate(date)}
                  disabledDate={disableToDate}
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </ColWithEightSpan>
          </Row>
          <Row justify="end" gutter={16}>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button danger onClick={handleReset}>
                  Reset
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <CustomTable
            loading={poloading}
            isFilter={true}
            columns={columnsmodal}
            dataSource={dataModal}
            scroll={{ x: 800 }}
            actionColumn={false}
          />
        </Form>
      </Modal>
      <Modal
        title="Product Batch Details"
        onOk={onOkBatchModal}
        onCancel={onCancelBatchmodal}
        width={"100rem"}
        open={isBatchModalOpen}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: "100%" }}
          onFinish={onFinishBatchmodal}
          onFinishFailed={onFinishBatchFailed}
          autoComplete="off"
          form={form3}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={8}>
              {/* <Form.Item label="Product" name="Product"> */}
              <Tag color="#1890ff">Product: {batchRecord.LongName}</Tag>
              {/* </Form.Item> */}
            </Col>
            <Col span={8}>
              {/* <Form.Item
                    label="Received Qty"
                    name="ReceivedQty"
                    handleCancel
                  > */}
              <Tag color="#52c41a">Received Qty: {batchRecord.ReceivedQty}</Tag>
              {/* </Form.Item> */}
            </Col>
            <Col className="gutter-row" span={8}>
              {/* <Form.Item label="Bonus qty" name="Bonusqty"> */}
              <Tag color="#7FA1C3">Bonus qty: {batchRecord.BonusQuantity}</Tag>
              {/* </Form.Item> */}
            </Col>
          </Row>
          <Spin spinning={loading}>
            <Table scroll={{ x: 900 }}
              columns={Batchmodal}
              dataSource={
                batchRecord.ProductId
                  ? dataBatchModal.filter(
                    (item) =>
                      (item.ProductId === batchRecord.ProductId &&
                        item.ActiveFlag) ||
                      (item.ProductId === "" && item.ActiveFlag)
                  )
                  : []
              }
            />
          </Spin>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CreateGRNAgainstPO;
