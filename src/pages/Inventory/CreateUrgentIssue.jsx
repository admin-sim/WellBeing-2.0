import customAxios from "../../components/customAxios/customAxios.jsx";
import React, { useCallback, useEffect, useState } from "react";
import Button from "antd/es/button";
import {
  urlCreatePurchaseOrder,
  urlAutocompleteProduct,
  urlAddNewUrgentIssue,
  urlUrgentIssueEdit,
  urlGetProductDetailsById,
  urlUrgentIssueShowBatchDetails,
} from "../../../endpoints.js";
import Select from "antd/es/select";
import {
  ConfigProvider,
  Tooltip,
  Typography,
  Checkbox,
  Tag,
  Modal,
  Skeleton,
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
import { useLocation } from "react-router-dom";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import moment from "moment";
//import { useParams } from 'react-router-dom';

const CreateUrgentIssue = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: [],
  });

  const [counter, setCounter] = useState(0);
  const [modalCounter, setModalCounter] = useState(0);
  const location = useLocation();
  const issueId = location.state.IssueId;

  const initialDataSource =
    issueId === 0
      ? [
          {
            key: counter,
            ProductName: "",
            ProductId: "",
            UomId: "",
            IssueQty: "",
            AvlQtyatIssue: "",
            Remarks: "",
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
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataModal, setDataModal] = useState([]);
  const [dataBatchModal, setdataBatchModal] = useState([]);
  const [istablevisible, setIstablevisible] = useState(false);
  const [autoCompleteProduct, setAutoCompleteProduct] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [batchDetails, setBatchDetails] = useState();
  const [issueStatus, setIssueStatus] = useState();
  const [batchRecord, setBatchRecord] = useState();
  const [finalBatchDetails, setFinalBatchDetails] = useState([]);

  useEffect(() => {
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
    if (issueId > 0) {
      setButtonTitle("Update");
      customAxios
        .get(`${urlUrgentIssueEdit}?IssueId=${issueId}`)
        .then((response) => {
          const apiData = response.data.data;
          if (
            apiData.newIndentIssueModel != null &&
            apiData.newIndentIssueModel.length > 0
          ) {
            const products = apiData.newIndentIssueModel.map((item, index) => ({
              ...item,
              key: index,
              AvlQtyatIssue: item.BalanceQty,
              index: index + 1,
            }));
            setData(products);
            setCounter(products.length);
            setIstablevisible(true);
            const formdata = apiData.newPatientIssueModel;
            form1.setFieldsValue({
              IssueingStoreId: formdata.IssueingStoreId,
              Remarks: formdata.Remarks,
              IssueStatus:
                formdata.IssueStatus == "Created"
                  ? undefined
                  : formdata.IssueStatus,
              RequestingStoreId: formdata.RequestingStoreId,
              IssueId: formdata.IssueId,
            });
          }

          const batch = apiData.BatchDetails.map((Item, Index) => ({
            ...Item,
            key: Index + 1,
            // amount: Item.IssueRate * Item.IssueQty,
            RequestQty: Item.IssueQty,
          }));

          setDataModal(batch);
        });
    }
  }, []);

  useEffect(() => {
    // This useEffect ensures that every time the modal is opened, the form is reset
    if (isModelOpen) {
      form2.resetFields();
    }
  }, [isModelOpen]);

  const getPanelValue1 = (value, key) => {
    if (value === "") {
      form1.setFieldsValue({ [key]: { uom: "" } });
      form1.setFieldsValue({ [key]: { RequestQty: "" } });
      form1.setFieldsValue({ [key]: { Favourite: false } });
      form1.setFieldsValue({ [key]: { IssuingStoreStock: "" } });
    }
    try {
      customAxios
        .get(`${urlAutocompleteProduct}?Product=${value}`)
        .then((response) => {
          const apiData = response.data.data;
          const filteredApiData = apiData.filter(
            (apiItem) =>
              !data.some(
                (option) =>
                  option.ProductId === apiItem.ProductId && option.ActiveFlag
              )
          );
          const newOptions = filteredApiData.map((item) => ({
            value: item.LongName,
            key: item.ProductId,
            UomId: item.UOMPrimaryUOM,
            Expiry: item.Expiry,
          }));
          setAutoCompleteProduct(newOptions);
        });
    } catch (error) {
      // Handle the error as needed
    }
  };

  const handleSelect1 = (value, option, key) => {
    debugger;
    form1.setFieldsValue({ [key]: { UomId: option.UomId } });
    form1.setFieldsValue({ [key]: { ProductId: option.key } });
    customAxios
      .get(`${urlGetProductDetailsById}?ProductId=${option.key}`)
      .then((response) => {
        const apiData = response.data.data;
        let reqstr = form1.getFieldValue("IssueingStoreId");
        let qty = 0;
        apiData.Stock.forEach((value) => {
          if (value.StoreId === reqstr) {
            qty += value.Quantity;
          }
        });
        const newData = data.map((item) => {
          if (item.key === key) {
            const updatedItem = {
              ...item,
              // [column]: option.key,
              ProductName: option.value,
              UomId: option.UomId,
              ProductId: option.key,
              AvlQtyatIssue: qty,
              Expiry: option.Expiry,
            };
            return updatedItem;
          }
          return item;
        });
        setData(newData);
        form1.setFieldsValue({ [key]: { AvlQtyatIssue: qty } });
      });
  };

  const AddProduct = async () => {
    setAutoCompleteProduct([]);
    await form1.validateFields();
    setData([
      ...data,
      {
        key: counter,
        ProductName: "",
        ProductId: "",
        UomId: "",
        IssueQty: 0,
        AvlQtyatIssue: 0,
        Remarks: "",
        ActiveFlag: true,
      },
    ]);
    setCounter(counter + 1);
  };

  
  const OpenBatch = async (record) => {
    debugger;
    setBatchRecord(null);
    setProductDetails(null);
    setDataModal([]);
    try {
      // Validate and get form values
      await form1.validateFields();
      const formValues = form1.getFieldsValue();
  
      // Update the record with the form value
      record.IssueQty = formValues[record.key].IssueQty;
      setProductDetails(record);
  
      // Construct the product object
      const product = {
        IssueQty: record.IssueQty,
        ProductId: record.ProductId,
        IssueId: formValues.IssueingStoreId,
        StoreId: formValues.IssueingStoreId,
      };
  
      // Filter dataModel based on ProductId and ActiveFlag
      const filteredDataModel = dataModal.filter(
        (item) =>
          item.ProductId === record.ProductId &&
          item.ActiveFlag === true &&
          item.IssueBatchId > 0
      );
  
      // Construct the post object
      const post1 = {
        newIndentModel: product,
        Batch: filteredDataModel,
      };
      setBatchDetails([]);
      setDataModal([]);
      // Make an API call
      const response = await customAxios.post(
        urlUrgentIssueShowBatchDetails,
        post1,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const ApiData = response.data.data;
 
      setBatchRecord(record);
      setBatchDetails(ApiData.BatchDetails);
      setModalCounter(ApiData.BatchDetails.length + 1);
  
      // Process batch data
      if (ApiData.Batch.length > 0) {
        const batch = ApiData.Batch.map((item, index) => {
          if (
            item.ProductId ===
              ApiData.ProductDefinitionModel.ProductDefinitionId &&
            item.ActiveFlag !== false
          ) {
            if (item.IssueBatchId !== 0) {
              return {
                ...item,
                key: index + 1,
                amount: item.IssueRate * item.IssueQty,
              };
            }
            return item;
          }
          return item;
        });
        setDataModal(batch);
      } else {
        // Calculate quantities and amounts based on batch details
        const calculateQuantitiesAndAmounts = (issueQty) => {
          let totalQty = 0;
          const sortedBatchDetails = [...ApiData.BatchDetails].sort(
            (a, b) => new Date(a.EXPDate) - new Date(b.EXPDate)
          );
          const updatedBatchDetails = sortedBatchDetails.map((item) => {
            let qty = 0;
            let amount = 0;
  
            if (!item.IsProductBatchExpired && totalQty < issueQty) {
              qty = Math.min(item.BalanceQty, issueQty - totalQty);
              totalQty += qty;
              amount = qty * item.MRP;
            }
            return { ...item, qty, amount };
          });
          return updatedBatchDetails.filter((item) => item.qty > 0);
        };
  
        const updatedBatch = calculateQuantitiesAndAmounts(record.IssueQty).map(
          (item, index) => ({
            ...item,
            key: index + 1,
            IssueQty: item.qty, // Update IssueQty with qty
            IssueRate: item.MRP,
            LineAmount: item.amount,
            EXPDate: item.EXPDate ? dayjs(item.EXPDate) : undefined,
            RequestQty: item.qty,
          })
        );
  
        // Reset the form with the new values
        form2.setFieldsValue(
          updatedBatch.reduce((acc, item) => {
            acc[item.key] = {
              IssueQty: item.IssueQty, // Set IssueQty with qty
              BatchNo: item.BatchNo,
              IssueRate: item.IssueRate,
              LineAmount: item.LineAmount,
              BalanceQty: item.BalanceQty,
              EXPDate: item.EXPDate,
              MRP: item.MRP,
              qty: item.qty,
              amount: item.amount,
              // Add other fields as necessary
            };
            return acc;
          }, {})
        );
  
        setDataModal(updatedBatch);
      }
  
      setIsModelOpen(true);
    } catch (error) {
      console.error("Error in OpenBatch:", error);
      // Optionally, show a user-friendly message or perform other error handling
    }
  };
 

  const handleCloseModal = () => {
    debugger;
    const newData = dataModal.filter((item) => {
      // Keep the item if item.ProductId is not an empty string
      return item.ProductId !== "";
    });

    form2.resetFields();
    setDataModal([]);
    setIsModelOpen(false);
  };

  const ModelDelete = (record) => {
    debugger;
    const newData = dataModal.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setDataModal(newData);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "ProductName",
      width: 450,
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "ProductName"]}
            style={{ width: "100%" }}
            rules={[
              {
                required: true,
                message: "Please input!",
              },
            ]}
            initialValue={record.ProductName}
          >
            <AutoComplete
              style={{ width: "100%" }}
              disabled={!!issueId}
              options={autoCompleteProduct}
              onSearch={(value) => getPanelValue1(value, record.key)}
              onSelect={(value, option) =>
                handleSelect1(value, option, record.key)
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
            <Input></Input>
          </Form.Item>
          <Form.Item
            name={[record.key, "IndentIssueLineId"]}
            hidden
            initialValue={record.IndentIssueLineId}
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
      render: (text, record) => (
        <Form.Item
          name={[record.key, "UomId"]}
          style={{ width: "100%" }}
          initialValue={record.UomId}
        >
          <Select disabled defaultValue={record.UomId}>
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
      title: "Issue Qty",
      dataIndex: "IssueQty",
      key: "IssueQty",
      render: (text, record) => (
        <Form.Item
          style={{ width: "100%" }}
          initialValue={record.IssueQty}
          name={[record.key, "IssueQty"]}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
            {
              validator: (_, value) => {
                if (value > record.AvlQtyatIssue) {
                  return Promise.reject(
                    "Issue Qty cannot be greater than Avl Qty at Issue"
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Avl qty at Issue",
      dataIndex: "AvlQtyatIssue",
      key: "AvlQtyatIssue",
      width: 150,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "AvlQtyatIssue"]}
          initialValue={record.AvlQtyatIssue}
        >
          <InputNumber min={0} disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
      render: (text, record) => (
        <>
          <Form.Item
            name={[record.key, "Remarks"]}
            initialValue={record.Remarks}
          >
            <Input allowClear />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Batch Details",
      dataIndex: "BatchDetails",
      key: "BatchDetails",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => OpenBatch(record)}>
            Batch
          </Button>
        </>
      ),
    },
    {
      title: (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={AddProduct}
        ></Button>
      ),
      // title: <Button type="primary" icon={<PlusOutlined />} onClick={AddProduct}></Button>,
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
    },
  ];

  const handleDelete = (record) => {
    debugger;
    const newData = data.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setData(newData);
    const newDataModel = dataModal.map((item) => {
      if (item.ProductId === record.ProductId) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setDataModal(newDataModel);
  };

  

  const BatchAdd = async () => {
    await form2.validateFields();
    form2.resetFields();

    setDataModal((prevDataModal) => [
      ...prevDataModal,
      {
        key: modalCounter,
        ProductId: "",
        BatchNo: "",
        IssueQty: 0,
        BalanceQty: 0,
        AvlQty: 0,
        // UomId: '',
        EXPDate: "",
        Rate: 0,
        IssueRate: 0,
        Stocklocator: 0,
        IssueBatchId: 0,
        amount:0,
        ActiveFlag: true,
      },
    ]);
    setModalCounter((prevCounter) => prevCounter + 1);
  };



  const calculateAmount = (key, quantity, rate) => {
    const qty = quantity ? parseFloat(quantity) : 0;
    const rateValue = rate ? parseFloat(rate) : 0;
    const amount = qty * rateValue;

    form2.setFieldsValue({
      [key]: {
        amount: amount.toFixed(4),
      },
    });

    // Update dataModel to reflect the new amount
    setDataModal((prevDataModel) =>
      prevDataModel.map((item) =>
        item.key === key
          ? {
              ...item,
              amount: amount.toFixed(4),
              qty: qty,
              IssueQty: qty,
              LineAmount: amount,
            }
          : item
      )
    );
  };

  const columnsmodal = [
    {
      title: "Batch No",
      dataIndex: "BatchNo",
      key: "BatchNo",
      width: 100,
      render: (_, record) => (
        <Form.Item
          name={[record.key, "BatchNo"]}
          rules={[
            {
              required: true,
              message: "Please input! ",
            },
          ]}
          initialValue={record.BatchNo}
        >
          <Select
            style={{ width: 100 }}
            disabled={record?.IssueBatchId > 0}
            onSelect={(value, option) => {
              const selectedBatch = batchDetails.find(
                (batch) => batch.StockId === value
              );

     
              record.StockId = selectedBatch.StockId;
              record.IssueBatchId = selectedBatch.IssueBatchId;
              record.IssueQty = selectedBatch.IssueQty; // Set IssueQty with qty
              record.BatchNo = selectedBatch.BatchNo;
              //record.BalanceQty = selectedBatch.BalanceQty;
              record.EXPDate = selectedBatch.EXPDate
                ? dayjs(selectedBatch.EXPDate)
                : null;
              record.IssueRate = selectedBatch.MRP;
              record.MRP = selectedBatch.MRP;
              record.amount = selectedBatch.amount;

              // Update the form with new values
              form2.setFieldsValue({
                [record.key]: {
                  StockId: selectedBatch.StockId,
                  IssueBatchId: selectedBatch.IssueBatchId,
                  IssueQty: selectedBatch.IssueQty, // Set IssueQty with qty
                  BatchNo: selectedBatch.BatchNo,
                  // LineAmount:item.LineAmount,
                  BalanceQty: selectedBatch.BalanceQty,
                  EXPDate: selectedBatch.EXPDate
                    ? dayjs(selectedBatch.EXPDate)
                    : undefined,
                  IssueRate: selectedBatch.MRP,
                  //qty:selectedBatch.qty,
                  amount: 0.0,
                },
              });

              // Update the data source
              const updatedDataModal = dataModal.map((item) => {
                if (item.key === record.key) {
                  return {
                    ...item,
                    ...record, // update with new record details
                  };
                }
                return item;
              });

              // Update the data source state
              setDataModal(updatedDataModal);
            }}
          >
            {batchDetails.map((option) => (
              <Select.Option key={option.StockId} value={option.StockId}>
                {option.BatchNo}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "IssueQty",
      key: "IssueQty",
      width: 100,
      render: (text, record) => {
        return (
          <Form.Item
            name={[record.key, "IssueQty"]}
            initialValue={record.IssueQty}
            rules={[
              {
                required: true,
                message: "Please input!",
              },
              {
                validator: (_, value) => {
                  if (value <= 0) {
                    return Promise.reject(
                      new Error("Quantity must be greater than 0!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              allowClear
              type="number"
              onChange={(e) =>
                calculateAmount(
                  record.key,
                  e.target.value,
                  record.IssueBatchId ? record.IssueRate : record.MRP
                )
              }
              style={{ width: 100 }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "Avl Quantity",
      dataIndex: "BalanceQty",
      key: "BalanceQty",
      width: 100,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "BalanceQty"]}
          initialValue={record.BalanceQty}
        >
          <InputNumber disabled />
        </Form.Item>
      ),
    },
    {
      title: "UOM",
      dataIndex: "UomId",
      key: "UomId",
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, "UomId"]} initialValue={record.UomId}>
          {record.Uom}
        </Form.Item>
      ),
    },
    {
      title: "EXP Date",
      dataIndex: "EXPDate",
      key: "EXPDate",
      width: 150,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "EXPDate"]}
          initialValue={
            batchRecord.Expiry === "Not applicable"
              ? null
              : dayjs(record.EXPDate)
          }
        >
          <DatePicker
            format={
              batchRecord.Expiry === "Month wise"
                ? "MMMM YYYY"
                : batchRecord.Expiry === "Date wise"
                ? "DD-MM-YYYY"
                : null
            }
            disabled
            style={{ width: "100%" }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Rate",
      dataIndex: "IssueRate",
      key: "IssueRate",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "IssueRate"]}
          initialValue={record.IssueRate}
        >
          <InputNumber disabled />
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => (
        <Form.Item name={[record.key, "amount"]} initialValue={record.amount}>
          <InputNumber disabled />
        </Form.Item>
      ),
    },
    {
      title: "Stock Locator",
      dataIndex: "StockLocator",
      key: "StockLocator",
      render: (text, record) => (
        <Form.Item name={[record.key, "StockLocator"]}>
          <Input style={{ width: 100 }} allowClear disabled />
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
          onConfirm={() => ModelDelete(record)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
    },
  ];

  const handleCancel = () => {
    const url = "/UrgentIssue";
    navigate(url);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const SubmitChanged = (event) => {
    setIssueStatus(event.target.checked);
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
    debugger;
    const isAnyIdNotNull = finalBatchDetails.some(
      (item) => item.ProductId !== "" && item.ActiveFlag
    );
    if (!isAnyIdNotNull) {
      message.warning("Please add Batch details");
      return false;
    }
    const newdata = data.filter((item) => item.ProductId);

    const products = newdata
      .filter((item) => item !== undefined)
      .map((item) => ({
        ProductId: item.ProductId,
        UomId: item.UomId,
        IssueQty: item.IssueQty,
        IndentIssueLineId:
          item.IndentIssueLineId === undefined ? 0 : item.IndentIssueLineId,
        Remarks: item.Remarks ? item.Remarks : "",
        ActiveFlag: item.ActiveFlag,
      }));

    const activeProducts = products.filter((product) => product.ActiveFlag);
    const result = checkActiveBatches(activeProducts, finalBatchDetails);
    if (!result.allActiveProductsHaveActiveBatch) {
      message.warning("Please Add BatchDeatils");
      return false;
    }

    if (finalBatchDetails.length > 0) {
      const defaultDateTime = new Date().toISOString();
      const finalBatchDetailsWithDefaultExpdate = finalBatchDetails.map(
        (batch) => ({
          ...batch,
          EXPDate: defaultDateTime,
          StockLocator: batch.StockLocator ? batch.StockLocator : 0,
        })
      );
      const filteredBatch = finalBatchDetailsWithDefaultExpdate.filter(
        (item) => item.ProductId
      );
      const filteredBatchwithactive =
        finalBatchDetailsWithDefaultExpdate.filter(
          (item) => item.ProductId && item.ActiveFlag
        );
      const UrgentIssue = {
        IssueDateString: values.IssuingDate
          ? values.IssuingDate.format("DD-MM-YYYY")
          : "",
        RequestingStoreId: values.RequestingStoreId,
        IssueingStoreId: values.IssueingStoreId,
        IssueId: values.IssueId ? values.IssueId : 0,
        IssueStatus: !issueStatus ? "Created" : values.IssueStatus,
        Remarks: values.Remarks ? values.Remarks : "",
      };

      const postData = {
        newIndentModel: UrgentIssue,
        IndentDetails:
          issueId === 0
            ? activeProducts
            : products.filter(
                (product) =>
                  product.IndentIssueLineId > 0 ||
                  (product.IndentIssueLineId === 0 &&
                    product.ActiveFlag === true)
              ),

        Batch: issueId === 0 ? filteredBatchwithactive : filteredBatch,
      };
      console.log("postData", postData);
      try {
        const response = await customAxios.post(
          urlAddNewUrgentIssue,
          postData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        handleCancel();
      } catch (error) {
        // Handle error
      }
    } else {
      message.warning("Please add Batch Details");
    }
  };

  const onFinishModel = async () => {
    debugger;
    await form2.validateFields();
    const values = form2.getFieldsValue();
    // Extract the values from the object as an array
    const valueArray = Object.values(values);

    const activeItems = dataModal.filter((item) => item.ActiveFlag);
    const stockIdCounts = activeItems.reduce((acc, item) => {
      acc[item.StockId] = (acc[item.StockId] || 0) + 1;
      return acc;
    }, {});

    const duplicateStockIds = Object.keys(stockIdCounts).filter(
      (stockId) => stockIdCounts[stockId] > 1
    );

    if (duplicateStockIds.length > 0) {
      message.error("Same Batch Number should not be selected.");
      return false;
    }
    // Sum the IssueQty values
    const totalIssueQty = valueArray.reduce((sum, item) => {
      // Ensure IssueQty is a number
      const issueQty = Number(item.IssueQty);
      return sum + (isNaN(issueQty) ? 0 : issueQty);
    }, 0);

    console.log("Total IssueQty: ", totalIssueQty);
    const updatedDataModal = dataModal.map((item) => {
      if (!item.ProductId) {
        return { ...item, ProductId: productDetails.ProductId };
      }
      return item;
    });
    setDataModal(updatedDataModal);

    if (parseInt(totalIssueQty) == productDetails.IssueQty) {
      const filteredDataModel = dataModal
        .filter((item) => {
          if (item.IssueBatchId > 0) {
            return true; // include all items with IssueBatchId > 0
          } else {
            return item.ActiveFlag === true; // only include items with IssueBatchId = 0 or null and ActiveFlag = true
          }
        })
        .map((item) => ({ ...item, ProductId: productDetails.ProductId }));

      setFinalBatchDetails(filteredDataModel);

      setIsModelOpen(false);
    } else {
      message.warning("Total Quantity should be equal to Issued Quantity");
    }
  };

  const handleSaveModal = () => {
    form2.submit();
  };

  const handleStore = (value) => {
    debugger;
    const Va = form1.getFieldsValue();
    if (Va.RequestingStoreId == Va.IssueingStoreId) {
      message.warning("Please Select Different Store");
      form1.resetFields();
      setData([]);
      return false;
    }
    if (value != undefined) {
      setIstablevisible(true);
    }
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
              Create Urgent Issue
            </Title>
          </Col>
          <Col offset={6} span={2}>
            <Button
              icon={<LeftOutlined />}
              style={{ marginBottom: 0 }}
              onClick={handleCancel}
            >
              Back
            </Button>
          </Col>
        </Row>
        <Form
          layout="vertical"
          onFinish={handleOnFinish}
          variant="outlined"
          style={{
            maxWidth: 1500,
          }}
          name="trigger"
          form={form1}
          initialValues={{
            IssuingDate: dayjs(),
            SubmitCheck: false,
          }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="Bottom">
            <Col className="gutter-row" span={4}>
              <Form.Item label="Issuing Date" name="IssuingDate">
                <DatePicker
                  style={{ width: "100%" }}
                  disabled
                  format="DD-MM-YYYY"
                />
              </Form.Item>
              <Form.Item name="IssueId" hidden>
                <Input />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={4}>
              <Form.Item
                label="Issuing Store"
                name="IssueingStoreId"
                rules={[
                  {
                    required: true,
                    message: "Please input!",
                  },
                ]}
              >
                <Select
                  //allowClear
                  placeholder="Select Value"
                  onChange={handleStore}
                  disabled={!!issueId}
                >
                  {DropDown.StoreDetails.map((option) => (
                    <Select.Option key={option.StoreId} value={option.StoreId}>
                      {option.LongName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={4}>
              <Form.Item
                label="Requesting Location"
                name="RequestingStoreId"
                rules={[
                  {
                    required: true,
                    message: "Please input!",
                  },
                ]}
              >
                <Select
                  //allowClear
                  placeholder="Select Value"
                  onChange={handleStore}
                  disabled={!!issueId}
                >
                  {DropDown.StoreDetails.map((option) => (
                    <Select.Option key={option.StoreId} value={option.StoreId}>
                      {option.LongName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item label="Issue Owner" name="IssueOwner">
                <Input style={{ width: "100%" }} allowClear />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={3}>
              <Form.Item
                label="Issue Status"
                name="IssueStatus"
                rules={[
                  {
                    required: issueStatus,
                    message: "Please input!",
                  },
                ]}
              >
                <Select allowClear placeholder="Select Value">
                  <Option value="Draft">Draft</Option>
                  <Option value="Finalize">Finalize</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={3}>
              <Form.Item
                name="SubmitCheck"
                style={{ marginTop: "30px" }}
                valuePropName="checked"
              >
                <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={9}>
              <Form.Item label="Remarks" name="Remarks">
                <TextArea />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" style={{ padding: "0rem 1rem" }}>
            <Col style={{ marginRight: "10px" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
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
          {istablevisible ? (
            <div>
              <Table
                columns={columns}
                dataSource={data?.filter((item) => item?.ActiveFlag !== false)}
                scroll={{ x: 0 }}
              />
            </div>
          ) : null}
        </Form>
        <Modal
          width={1000}
          maskClosable={false}
          title="Product Batch Details"
          open={isModelOpen}
          onOk={handleSaveModal}
          onCancel={handleCloseModal}
          okText={"Save"}
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
          >
            <Row>
              <Col className="gutter-row" span={12}>
                <div>
                  <span>
                    Product :{" "}
                    <b style={{ color: "#1677ff" }}>
                      {productDetails?.ProductName}
                    </b>{" "}
                  </span>
                </div>
              </Col>
              <Col className="gutter-row" span={12}>
                <div>
                  <span>
                    Issued Quantity :{" "}
                    <b style={{ color: "#1677ff" }}>
                      {productDetails?.IssueQty}
                    </b>{" "}
                  </span>
                </div>
              </Col>
            </Row>
            <Table
              columns={columnsmodal}
              //dataSource={dataModal}
              dataSource={
                batchRecord?.ProductId
                  ? dataModal.filter(
                      (item) =>
                        (item.ProductId == batchRecord.ProductId &&
                          item.ActiveFlag) ||
                        (item.ProductId == "" && item.ActiveFlag)
                    )
                  : []
              }
              size="small"
            />
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default CreateUrgentIssue;
