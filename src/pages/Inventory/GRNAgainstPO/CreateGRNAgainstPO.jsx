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

  let [counter, setCounter] = useState(2);
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
  console.log("headerid", GrnHeaderId);
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
            key: 1,
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
            TaxType1: "",
            TaxAmount1: 0,
            TaxType2: "",
            TaxAmount2: 0,
            Stocklocator: "",
            ActiveFlag: true,
            PoLineId: 0,
            DiscountRate: 0,
            DiscountAmount: 0,
            GrnBatchId: 0,
          },
        ]
      : [];

  const [dataBatchModal, setdataBatchModal] = useState(initialModelDataSource);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
            (item, index) => ({
              ...item,
              key: index + 1,
            })
          );
          setData(products);
          const formdata = editeddata.newGRNAgainstPOModel;
          form1.setFieldsValue({
            SupplierId: formdata.SupplierId,
            StoreId: formdata.StoreId,
            DocumentType: formdata.DocumentType,
            TotalAmount: formdata.TotalPoAmount,
            TotalPoAmount: formdata.TotalPoAmount,
            PoHeaderId: formdata.PoHeaderId,
            GRNHeaderId: formdata.GRNHeaderId,
            InvoiceNumber: formdata.InvoiceNumber,
            InvoiceAmount: formdata.InvoiceAmount,

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
            key: index + 1,
          }));
          setdataBatchModal(batch);
          setCounter(editeddata.BatchDetails.length + 1);
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

  const onFinishmodal = (values) => {
    const va = form1.getFieldsValue();
    setPoloading(true);
    setIsPoSearchTable(true);
    const postData = {
      Supplier: va.SupplierId,
      ReceivingStore: va.StoreId,
      POStatus: values.POStatus ? values.POStatus : "",
      FromDate: values.PODateFrom ? values.PODateFrom.format("DD-MM-YYYY") : "",
      ToDate: values.PODateTo ? values.PODateTo.format("DD-MM-YYYY") : "",
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
    setLoading(true);

    form1.resetFields();
    form3.resetFields();
    setBatchRecord([]);
    setdataBatchModal([]);
    setData([]);

    console.log("olddataproduct", data);
    const postData = {
      PoHeaderId: record.PoHeaderId,
      Supplier: record.SupplierId,
      Store: record.ProcurementStoreId,
    };
    try {
      customAxios
        .get(
          `${urlCreateGRNAgainstPO}?PoHeaderId=${postData.PoHeaderId}&Supplier=${postData.Supplier}&Store=${postData.Store}`
        )
        .then((response) => {
          const apiData = response.data.data;
          const products = apiData.ProductDetails.map((item, index) => ({
            ...item,
            key: index + 1,
          }));
          setData(products);
          const formdata = apiData.POProducts;
          form1.setFieldsValue({
            SupplierId: record.SupplierId,
            StoreId: formdata.ProcurementStoreId,
            DocumentType: formdata.DocumentType,
            // GRNDate: DateBindtoDatepicker(formdata.PoDate),
            // GRNStatus: formdata.PoStatus,
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
          initialValue={record.PoBalanceQty + record.PoBalanceBonusQty}
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
          <InputNumber min={0} disabled />
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
          <InputNumber min={0} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Discount Amount",
      dataIndex: "DiscountAmont",
      key: "DiscountAmont",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "DiscountAmont"]}
          initialValue={record.DiscountAmont}
        >
          <InputNumber disabled />
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
          <InputNumber disabled />
        </Form.Item>
      ),
    },
    {
      title: "Tax Amount",
      dataIndex: "TaxAmount1",
      key: "TaxAmount1",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxAmount1"]}>
          <InputNumber disabled />
        </Form.Item>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "LineAmount",
      key: "LineAmount",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "LineAmount"]}
          initialValue={record.LineAmount}
        >
          <InputNumber disabled />
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
      sorter: (a, b) => a.DocumentType.localeCompare(b.DocumentType),
    },
    {
      title: "PO Date",
      dataIndex: "PoDate",
      key: "PoDate",
      sorter: (a, b) => a.PoDate.localeCompare(b.PoDate),
      render: (text) => {
        if (text !== undefined) {
          const dateParts = text.split("T")[0].split("-");
          const year = dateParts[0];
          const month = dateParts[1];
          const day = dateParts[2];

          return `${day}-${month}-${year}`;
        }
      },
    },
    {
      title: "PO Raised By",
      dataIndex: "PORaisedBy",
      key: "PORaisedBy",
      sorter: (a, b) => a.PORaisedBy.localeCompare(b.PORaisedBy),
    },
    {
      title: "Status",
      dataIndex: "PoStatus",
      key: "PoStatus",
      sorter: (a, b) => a.PoStatus.localeCompare(b.PoStatus),
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
    setdataBatchModal([]);
    //setdataBatchModal(initialModelDataSource);
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
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.log("Validation error:", error);
      });
    form2.submit();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onOkBatchModal = async () => {
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
            values[key].mrp
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
            };
          }
          return item;
        }
        return item;
      });
      setdataBatchModal(updatedBatch);
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

  const onFinishBatchmodal = () => {};

  const onFinishBatchFailed = () => {};
  // const handleOnFinish = async (values) => {
  //
  //   const products = [];
  //   for (let i = 0; i <= data.length; i++) {
  //     if (values.TotalPoAmount == values.InvoiceAmount) {
  //       if (values[i] !== undefined) {
  //         if (
  //           values[i].ReceivedQty + values[i].BonusQuantity <=
  //           values[i].PoBalanceQty
  //         ) {
  //           const product = {
  //             ProductId: values[i].ProductId,
  //             UomId: values[i].UomId,
  //             ReceivedQty: values[i].ReceivedQty,
  //             PoQuantity: values[i].PoBalanceQty,
  //            // PoBalanceQty: values[i].PoBalanceQty,
  //             BonusQuantity: values[i].BonusQuantity,
  //             PoLineId: values[i].PoLineId,
  //             GrnLineId: values[i].GrnLineId,
  //             // QuantityTobeIssued: values[i].discount === "" ? 0 : values[i].discount,
  //             PoRate: values[i].PoRate,
  //             DiscountRate: values[i].DiscountRate,
  //             DiscountAmount:
  //               values[i].DiscountAmount == undefined
  //                 ? 0
  //                 : values[i].DiscountAmount,
  //             LineAmount: values[i].LineAmount,
  //             TaxAmount1:
  //               values[i].TaxAmount1 == undefined ? 0 : values[i].TaxAmount1,
  //             TotalAmount: values[i].LineAmount,
  //             Replaceable: values[i].Replaceable === true ? "Y" : "N",
  //             PoStatus:
  //               values[i].ReceivedQty + values[i].BonusQuantity ==
  //               values[i].PoBalanceQty
  //                 ? "Completed"
  //                 : "Pending",
  //             ActiveFlag: true,
  //           };
  //           products.push(product);
  //         } else {
  //           message.warning("Recieved Qty must not Greater than PoPending Qty");
  //           return false;
  //         }
  //       }
  //     } else {
  //       message.warning("Invoice Amount Must be equals to Total Po Amount");
  //       return false;
  //     }
  //   }

  //   const GRNAgainstPO = {
  //     GRNHeaderId: values.GRNHeaderId,
  //     PoHeaderId: values.PoHeaderId,
  //     SupplierId: values.SupplierId,
  //     StoreId: values.StoreId,
  //     DocumentType:
  //       values.DocumentType === undefined ? "" : values.DocumentType,
  //     // GrnNumber: values.PODate === undefined ? dayjs(`${currentDate}`).format(dateFormat) : values.PODate,
  //     // GRNDatestring: values.GRNDate === undefined ? null : (values.GRNDate.$D.toString().padStart(2, '0') + '-' + (values.GRNDate.$M + 1).toString().padStart(2, '0') + '-' + values.GRNDate.$y).toString(),
  //     DCChallanDateString: values.DCChallanDateString
  //       ? values.DCChallanDateString.format("DD-MM-YYYY")
  //       : "",
  //     GRNDatestring: values.GRNDatestring.format("DD-MM-YYYY"),
  //     InvoiceDateString: values.InvoiceDateString.format("DD-MM-YYYY"),
  //     ReceivingDateString: values.ReceivingDateString.format("DD-MM-YYYY"),
  //     Remarks: values.Remarks === undefined ? null : values.Remarks,
  //     GrnStatus: values.GRNStatus === undefined ? "Created" : values.GRNStatus,
  //     InvoiceNumber:
  //       values.InvoiceNumber === undefined ? null : values.InvoiceNumber,
  //     InvoiceAmount:
  //       values.InvoiceAmount === undefined ? 0 : values.InvoiceAmount,
  //     DCChallanNumber: values.DCChallanNumber,
  //     TotalAmount: values.TotalAmount,
  //     TaxAmount1: values.TaxAmount == undefined ? 0 : values.TaxAmount,
  //     RoundOff: values.RoundOff == undefined ? 0 : values.RoundOff,
  //     TotalPoAmount: values.TotalPoAmount,
  //     // GrnType: values.PoTaxAmount === undefined ? 0 : values.PoTaxAmount,
  //   };
  //   batches.forEach((item, index) => {
  //     form1.getFieldValue([index, "POReceivedQty"]);
  //   });
  //   // const activeData = dataBatchModal.filter(
  //   //   (item) => item.ActiveFlag === true && item.ProductId
  //   // );

  //   const result = checkActiveBatches(products, dataBatchModal);
  //   if (!result.allActiveProductsHaveActiveBatch) {
  //     message.warning("Please Add BatchDeatils");
  //     return false;
  //   }

  //   const filteredbatch = dataBatchModal.filter((item) => item.ProductId);

  //   const postData = {
  //     newGRNAgainstPOModel: GRNAgainstPO,
  //     GRNAgainstPODetails: products,
  //     BatchDetails: filteredbatch === undefined ? [] : filteredbatch,
  //   };
  //   console.log('input',postData);
  //   if (GrnHeaderId > 0) {
  //     const response = await customAxios.post(urlUpdateGRNAgainstPO, postData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (response != false && response.status == 200) {
  //       message.success("Updated Successfully");
  //     } else {
  //       message.error("Updated Failure");
  //     }
  //   } else {
  //     const response = await customAxios.post(urlAddNewGRNAgainstPO, postData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (response != false && response.status == 200) {
  //       message.success("Created Successfully");
  //     } else {
  //       message.error("Create Failure");
  //     }
  //   }
  //   handleCancel();
  // };

  // const onFinishBatchFailed = () => {};

  const handleOnFinish = async (values) => {
    const isAnyIdNotNull = dataBatchModal.some(
      (item) => item.ProductId !== "" && item.ActiveFlag
    );

    if (!isAnyIdNotNull) {
      message.warning("Please add Batch details");
      return false;
    }

    if (values.TotalPoAmount !== values.InvoiceAmount) {
      message.warning("Invoice Amount Must be equal to Total Po Amount");
      return false;
    }
    const products = [];
    for (let i = 0; i <= data.length; i++) {
      if (values.TotalPoAmount == values.InvoiceAmount) {
        if (values[i] !== undefined) {
          if (
            values[i].ReceivedQty + values[i].BonusQuantity <=
            values[i].PoBalanceQty
          ) {
            const product = {
              ProductId: values[i].ProductId,
              UomId: values[i].UomId,
              ReceivedQty: values[i].ReceivedQty,
              PoQuantity: values[i].PoBalanceQty,
              BonusQuantity: values[i].BonusQuantity || 0,
              PoLineId: values[i].PoLineId || 0,
              GrnLineId: values[i].GrnLineId || 0,
              PoRate: values[i].PoRate,
              DiscountRate: values[i].DiscountRate || 0,
              DiscountAmount: values[i].DiscountAmount ?? 0,
              LineAmount: values[i].LineAmount,
              TaxAmount1: values[i].TaxAmount1 ?? 0,
              TotalAmount: values[i].LineAmount,
              Replaceable: values[i].Replaceable === true ? "Y" : "N",
              PoStatus:
                values[i].ReceivedQty + values[i].BonusQuantity ==
                values[i].PoBalanceQty
                  ? "Completed"
                  : "Pending",
              ActiveFlag: true,
            };
            products.push(product);
          } else {
            message.warning("Recieved Qty must not Greater than PoPending Qty");
            return false;
          }
        }
      } else {
        message.warning("Invoice Amount Must be equals to Total Po Amount");
        return false;
      }
    }

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

    console.log("input", postData);
    //alert("successss call goes to api");

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
        key: counter,
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
        Stocklocator: 0,
        StockLocatorName: "",
        ActiveFlag: true,
        DiscountRate: 0,
        DiscountAmount: 0,
        GrnBatchId: 0,
      },
    ]);
    setCounter(counter + 1);
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
            // disabled={!!GrnHeaderId && record.GrnBatchId}
          />
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
          rules={[
            {
              required: true,
              message: "input!",
            },
          ]}
        >
          <InputNumber min={0} style={{ width: 70 }} />
        </Form.Item>
      ),
    },
    {
      title: "Uom",
      dataIndex: "UomId",
      key: "UomId",
      render: (text, record) => (
        <Form.Item name={[record.key, "UomId"]}>
          <Tag color="#7C00FE">{batchRecord.ShortName}</Tag>
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
      key: "EXPDateString",
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
      key: "Rate",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "Rate"]}
          initialValue={batchRecord.PoRate}
        >
          <InputNumber
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
            style={{ width: 70 }}
            allowClear
            disabled={!!GrnHeaderId && record.GrnBatchId}
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
          <InputNumber min={0} style={{ width: 70 }} disabled />
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
          <InputNumber min={0} style={{ width: 70 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "CGST",
      dataIndex: "TaxType1",
      key: "TaxType1",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxType1"]}>
          <Select disabled={!!GrnHeaderId} style={{ width: 70 }}></Select>
        </Form.Item>
      ),
    },
    {
      title: "CGST Amount",
      dataIndex: "TaxAmount1",
      key: "TaxAmount1",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxAmount1"]}>
          <InputNumber min={0} style={{ width: 70 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "SGST",
      dataIndex: "TaxType2",
      key: "TaxType2",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxType2"]}>
          <Select disabled={!!GrnHeaderId} style={{ width: 70 }}></Select>
        </Form.Item>
      ),
    },
    {
      title: "SGST Amount",
      dataIndex: "TaxAmount2",
      key: "TaxAmount2",
      render: (text, record) => (
        <Form.Item name={[record.key, "TaxAmount2"]}>
          <InputNumber min={0} style={{ width: 70 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Stock Locator",
      dataIndex: "StockLocator",
      key: "StockLocator",
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
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
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
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
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
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                </Form.Item>
              </ColWithEightSpan>
            </Row>
          </ColWithSixteenSpan>
          <ColWithEightSpan>
            <Row gutter={16}>
              <ColWithEightSpan>
                <Form.Item label="GRN Date" name="GRNDatestring">
                  <DatePicker format="DD-MM-YYYY" />
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
        <Divider style={{ margin: "0" }} />
        <div>
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
          {/* <Spin spinning={loading}>
                <Table
                  //loading={loading}
                  columns={columns}
                  dataSource={data}
                  scroll={{ x: 0 }}
                />
              </Spin> */}
          <Col style={{ float: "right" }}>
            <Form.Item
              label="Amount"
              name="TotalAmount"
              style={{ marginRight: "16px", width: 100 }}
            >
              <InputNumber min={0} disabled />
            </Form.Item>
            <Form.Item
              label="Tax"
              name="TaxAmount"
              style={{ marginRight: "16px", width: 100 }}
            >
              <InputNumber min={0} disabled />
            </Form.Item>
            <Form.Item
              label="Round Off"
              name="RoundOff"
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
          {/* <div
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
                  label="Tax"
                  name="TaxAmount"
                  style={{ marginRight: "16px", width: 100 }}
                >
                  <InputNumber min={0} disabled />
                </Form.Item>
                <Form.Item
                  label="Round Off"
                  name="RoundOff"
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
              </div> */}
        </div>
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
            PODateFrom: dayjs().subtract(1, "day"),
            PODateTo: dayjs(),
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
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
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
                <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
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

          {/* {isPoSearchTable && poloading ? (
                                <Skeleton active />
                            ) : (
                                <Table columns={columnsmodal} dataSource={dataModal} />
                            )} */}
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
            <Table
              columns={Batchmodal}
              dataSource={
                batchRecord.ProductId
                  ? dataBatchModal.filter(
                      (item) =>
                        (item.ProductId === batchRecord.ProductId &&
                          item.ActiveFlag) ||
                        (item.ProductId === "" && item.ActiveFlag)
                    )
                  : initialModelDataSource
              }
            />
          </Spin>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CreateGRNAgainstPO;
