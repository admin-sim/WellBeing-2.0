import customAxios from "../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
import Select from "antd/es/select";
import CustomTable from "../../components/customTable/index.jsx";
import {
  ConfigProvider,
  Typography,
  Checkbox,
  Tag,
  Modal,
  Popconfirm,
  Card,
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
import { useNavigate } from "react-router";
import { Table, InputNumber } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import {
  urlCreatePurchaseOrder,
  urlSearchUHID,
  urlGetLastEncounter,
  urlAutocompleteProduct,
  urlAddNewPatientConsumption,
  urlPatientConsumptionEdit,
  urlGetProductDetailsById,
  urlPatientConsuptionShowBatchDetails,
} from "../../../endpoints.js";
import { find } from "lodash";
import { v4 as uuidv4 } from "uuid";

const PatientConsumption = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: [],
  });

  const location = useLocation();
  let [counter, setCounter] = useState(1);
  let [counterModal, setCounterModal] = useState(0);
  const issueId = location.state.IssueId;

  const initialDataSource =
    issueId === 0
      ? [
        {
          key: 0,
          ProductName: "",
          ProductId: "",
          UomId: "",
          IssueQty: "",
          AvlatIssueQty: "",
          ReasonforConsumption: "",
          Batch: "",
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
  const [data, setData] = useState([]);
  const [dataModal, setDataModal] = useState(initialDataSource);
  //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');
  const [productDetails, setProductDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [autoCompleteProduct, setAutoCompleteProduct] = useState([]);
  const [encounter, setEncounter] = useState([]);
  const [isDisabled, setIsDisable] = useState(true);
  const [batchDetails, setBatchDetails] = useState([]);
  const fields = form1.getFieldsValue();
  const [uhId, setUhId] = useState();
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [issueStatus, setIssueStatus] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [finalBatchDetails, setFinalBatchDetails] = useState([]);
  const [batchRecord, setBatchRecord] = useState();
  // const tableRef = useRef(null);

  useEffect(() => {
    debugger;
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
    if (issueId > 0) {
      setButtonTitle("Update");
      customAxios
        .get(`${urlPatientConsumptionEdit}?IssueId=${issueId}`)
        .then((response) => {
          const apiData = response.data.data;
          if (
            apiData.newIndentIssueModel != null &&
            apiData.newIndentIssueModel.length > 0
          ) {
            const products = apiData.newIndentIssueModel.map((item, index) => ({
              ...item,
              key: index,
              AvlQtyAtIssue: item.StockBalanceQty,
              index: index + 1,
            }));
            setData(products);
            setCounter(products.length);
            const formdata = apiData.newPatientIssueModel;
            form1.setFieldsValue({
              IssueingStoreId: formdata.IssueingStoreId,
              // IndentType: formdata.IndentType,
              Remarks: formdata.Remarks,
              IndentNumber: formdata.IndentNumber,
              Status:
                formdata.IssueStatus == "Created" ||
                  formdata.IssueStatus == "Pending"
                  ? undefined
                  : formdata.IssueStatus,
              UHID: formdata.UhId,
              Name: formdata.PatientName,
              Encounter: formdata.Encounter,
              EncounterId: formdata.EncounterId,
              PatientId: formdata.PatientId,
              IssueId: formdata.IssueId,
            });
          }
          const newData = apiData.BatchDetails.map((item) => {
            return {
              ...item,
              //key: Index + 1,
              RequestQty: item.IssueQty,
            };
          });
          setDataModal(newData);
        });
    }
  }, []);

  const handleSelect = (value, option) => {
    debugger;
    form1.setFieldsValue({ Name: option.PatientName });
    form1.setFieldsValue({ UHID: option.value });
    customAxios
      .get(`${urlGetLastEncounter}?Uhid=${option.key}`)
      .then((response) => {
        const apiData = response.data.data;
        if (apiData.length > 0) {
          setEncounter(apiData);
          form1.setFieldsValue({ Encounter: apiData[0].GeneratedEncounterId });
          form1.setFieldsValue({ EncounterId: apiData[0].EncounterId });
          form1.setFieldsValue({ PatientId: option.PatientId });
        } else {
          setEncounter([]);
          form1.setFieldsValue({ Encounter: "" });
          form1.setFieldsValue({ EncounterId: "" });
          form1.setFieldsValue({ PatientId: "" });
        }
      });
  };

  const onOkModal = () => {
    debugger;
    form2.submit();
  };

  const onCancelModel = () => {
    debugger;
    const newData = dataModal.filter((item) => {
      // Keep the item if item.ProductId is not an empty string
      return item.ProductId !== "";
    });

    form2.resetFields();
    setDataModal(newData);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    const url = "/PatientConsumption";
    navigate(url);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleToPurchaseOrder = () => {
    const url = "/PatientConsumption";
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
    if (!values.EncounterId) {
      message.warning("Selected Patient Encounter Is Not Created");
      return false;
    }
    const products = [];
    for (let i = 0; i <= counter; i++) {
      if (values[i] !== undefined) {
        const product = {
          ProductId: values[i].ProductId,
          UomId: values[i].UomId,
          RequestQty: values[i].RequestQty,
          IssueQty: values[i].IssueQty,
          IndentLineId: values[i].IndentLineId,
          PatientIssueLineId: values[i].PatientIssueLineId
            ? values[i].PatientIssueLineId
            : 0,
          StockId: values[i].StockId,
          PendingQty:
            values.IssueStatus == "Finalize"
              ? values[i].IssueQty - values[i].PendingQty
              : values[i].PendingQty,
        };
        products.push(product);
      }
    }
    if (products.length === 0) {
      message.warning("Please Add Products")
      return false;
    }
    const result = checkActiveBatches(products, dataModal);
    if (!result.allActiveProductsHaveActiveBatch) {
      message.warning("Please Add BatchDeatils");
      return false;
    }
    const sumItems = (items, key) =>
      items.reduce((sum, item) => sum + parseInt(item[key] || 0, 10), 0);

    const activeItems = dataModal.filter((item) => item.ActiveFlag);

    const totalReceivedQty = sumItems(products, "IssueQty");
    const totalBatchQuantity = sumItems(activeItems, "IssueQty");

    if (totalReceivedQty !== totalBatchQuantity) {
      message.warning("Please enter valid batch details..");
      return false;
    }

    const Indent = {
      IssueDateString: values.IssueDate
        ? values.IssueDate.format("DD-MM-YYYY")
        : "",
      IndentId: values.IndentId,
      IssueId: values.IssueId ? values.IssueId : 0,
      Remarks: values.Remarks === undefined ? null : values.Remarks,
      RequestingStoreId: values.RequestingStoreId,
      IssueingStoreId: values.IssueingStoreId,
      IssueStatus: !issueStatus ? "Created" : values.Status,
      IndentCategory: "PatientConsumption",
      PatientId: values.PatientId,
      EncounterId: values.EncounterId,
      IndentType: values.IndentType,
    };
    const defaultDateTime = new Date().toISOString();
    const finalBatchDetailsWithDefaultExpdate = dataModal.map((batch) => ({
      ...batch,
      EXPDate: defaultDateTime,
      StockLocator: batch.StockLocator ? batch.StockLocator : 0,
    }));
    const postData = {
      newIndentModel: Indent,
      IndentDetails: products,
      Batch: finalBatchDetailsWithDefaultExpdate,
    };
    console.log("postData", postData);
    try {
      const response = await customAxios.post(
        urlAddNewPatientConsumption,
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
    //setIsSearchLoading(false);
  };
  const handleAdd = async () => {
    setAutoCompleteProduct([]);
    // const fieldsToValidate = data.map(record => [record.key, 'ProductName']);
    await form1.validateFields();
    await form2.validateFields();
    setData([
      ...data,
      {
        key: counter,
        ProductName: "",
        ProductId: "",
        UomId: "",
        IssueQty: "",
        AvlatIssueQty: "",
        ReasonforConsumption: "",
        Batch: "",
        ActiveFlag: true,
      },
    ]);
    setCounter(counter + 1);
  };

  const OpenBatch = async (record) => {
    debugger;
    try {
      // Validate and get form values
      await form1.validateFields();
      const formValues = form1.getFieldsValue();

      // Update the record with the form value
      record.IssueQty = formValues[record.key].IssueQty;
      setProductDetails(record);
      setBatchRecord(record);

      // Construct the product object
      const product = {
        IssueQty: record.IssueQty,
        ProductId: record.ProductId,
        IssueId: formValues.IssueingStoreId,
        StoreId: formValues.IssueingStoreId,
      };

      // Filter dataModel based on ProductId and ActiveFlag
      const filteredDataModel = dataModal.filter(
        (item) => item.ProductId === record.ProductId
        // &&
        //   item.ActiveFlag === true &&
        //   item.IssueBatchId > 0
      );

      // Construct the post object
      const post1 = {
        newIndentModel: product,
        Batch: filteredDataModel,
      };

      // Make an API call
      const response = await customAxios.post(
        urlPatientConsuptionShowBatchDetails,
        post1,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const ApiData = response.data.data;

      setBatchDetails(ApiData.BatchDetails);
      // setCounterModal(ApiData.BatchDetails.length + 1);

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
                key: uuidv4(),
                amount: item.IssueRate * item.IssueQty,
              };
            }
            return item;
          }
          return item;
        });
        const filteredBstchProductId = batch.map((item) => item.ProductId);

        const updatedbatch = dataModal.filter(
          (item) => !filteredBstchProductId.includes(item.ProductId)
        );

        // Append the new filteredDataModel to the updated final batch details
        setDataModal([...updatedbatch, ...batch]);
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
            key: uuidv4(),
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

        setDataModal((prevDataModel) => {
          return [...prevDataModel, ...updatedBatch];
        });
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error in OpenBatch:", error);
      // Optionally, show a user-friendly message or perform other error handling
    }
  };

  const BatchSelect = (selectedStockId, recordKey) => {
    debugger;

    // Check if selectedStockId already exists in dataModel with ActiveFlag true
    const existingBatch = dataModal.find(
      (item) => item.StockId === selectedStockId && item.ActiveFlag === true
    );

    if (existingBatch) {
      message.warning("Same Batch Number should not be selected.");
      //  return;
    }
    const selectedBatch = batchDetails.find(
      (batch) => batch.StockId === selectedStockId
    );

    if (selectedBatch) {
      const updatedDataModel = dataModal.map((item) =>
        item.key === recordKey
          ? {
            ...item,
            BatchNo: selectedBatch.BatchNo,
            StockId: selectedBatch.StockId,
            IssueBatchId: selectedBatch.IssueBatchId,
            IssueQty: selectedBatch.IssueQty, // Set IssueQty with qty
            IssueRate: selectedBatch.MRP,
            //LineAmount:item.LineAmount,
            BalanceQty: item.BalanceQty,
            EXPDate: selectedBatch.EXPDate
              ? dayjs(selectedBatch.EXPDate)
              : null,
            MRP: selectedBatch.MRP,
            // qty:item.qty,
            amount: selectedBatch.amount,
          }
          : item
      );

      // Update form2 with the respective values
      form2.setFieldsValue({
        [recordKey]: {
          StockId: selectedBatch.StockId,
          IssueBatchId: selectedBatch.IssueBatchId,
          IssueQty: selectedBatch.IssueQty, // Set IssueQty with qty
          BatchNo: selectedBatch.BatchNo,
          // LineAmount:item.LineAmount,
          BalanceQty: selectedBatch.BalanceQty,
          EXPDate: selectedBatch.EXPDate ? dayjs(selectedBatch.EXPDate) : null,
          IssueRate: selectedBatch.MRP,
          //qty:selectedBatch.qty,
          amount: 0.0,
        },
      });
      setDataModal(updatedDataModel);

      // calculateAmount(recordKey, selectedBatch.IssueQty, selectedBatch.MRP)
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

    if (parseInt(totalIssueQty) == productDetails.IssueQty) {
      const filteredDataModel = dataModal
        .filter((item) => {
          if (item.IssueBatchId > 0) {
            return true; // include all items with IssueBatchId > 0
          } else {
            return item.ActiveFlag === true; // only include items with IssueBatchId = 0 or null and ActiveFlag = true
          }
        })
        .map((item) => {
          // Append ProductId only if it's an empty string
          if (item.ProductId === "") {
            return { ...item, ProductId: batchRecord.ProductId };
          }
          return item;
        });
      setDataModal(filteredDataModel);
      setIsModalOpen(false);
    } else {
      message.warning("Total Quantity should be equal to Issued Quantity");
    }
  };

  const getPanelValue1 = (value, key) => {
    debugger;
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
              ProductName: option.value,
              UomId: option.UomId,
              ProductId: option.key,
              AvlQtyAtIssue: qty,
              Uom: apiData.UOMPrimaryUOMname
            };
            return updatedItem;
          }
          return item;
        });
        setData(newData);
        form1.setFieldsValue({ [key]: { AvlQtyAtIssue: qty } });
      });
  };

  const validateEqualValue = (record, value) => {
    const va = form1.getFieldsValue();
    if (value <= record.AvlQtyAtIssue) {
      const newdata = data.map((item) => {
        if (item.ProductId === record.ProductId) {
          const updated = { ...item, IssueQty: value };
          return updated;
        }
        return item;
      });
      setData(newdata);
      return Promise.resolve();
    }
    return Promise.reject(new Error("Not Greater than Avl Issue Qty"));
  };

  const columns = [
    {
      title: "Product",
      width: 450,
      dataIndex: "ProductName",
      key: "ProductName",
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "ProductName"]}
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
              disabled={!!record.IssueId}
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
            name={[record.key, "PatientIssueLineId"]}
            hidden
            initialValue={record.PatientIssueLineId}
          >
            <Input></Input>
          </Form.Item>
        </>
      ),
    },
    {
      title: "UOM",
      width: 150,
      dataIndex: "UomId",
      key: "UomId",
      render: (text, record) => (
        <Form.Item name={[record.key, "UomId"]} initialValue={record.UomId}>
          <Select disabled>
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
      title: "Issue Qty",
      dataIndex: "IssueQty",
      // width: 100,
      key: "IssueQty",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "IssueQty"]}
          initialValue={record.IssueQty}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
            {
              validator: (_, value) => validateEqualValue(record, value),
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Avl Qty At Issue",
      dataIndex: "AvlQtyAtIssue",
      // width: 100,
      key: "AvlQtyAtIssue",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "AvlQtyAtIssue"]}
          initialValue={record.AvlQtyAtIssue}
        >
          <InputNumber min={0} style={{ width: "100%" }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Reason for Consumption",
      dataIndex: "ReasonforConsumption",
      // width: 100,
      key: "ReasonforConsumption",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "ReasonforConsumption"]}
          initialValue={text}
        >
          <Input allowClear style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Batch Details",
      dataIndex: "Batch",
      // width: 100,
      key: "Batch",
      render: (text, record) => (
        <Form.Item>
          <Button type="link" onClick={() => OpenBatch(record)}>
            Batch
          </Button>
        </Form.Item>
      ),
    },
    {
      title: (
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} />
      ),
      dataIndex: "add",
      key: "add",
      width: 50,
      render: (text, record) => {
        if (record.PatientIssueLineId > 0) {
          return null; // Hide the delete button if the condition is true
        }
        return (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record)}
          >
            <DeleteOutlined />
          </Popconfirm>
        );
      },
    },
  ];

  const ModelAdd = async () => {
    debugger;
    await form2.validateFields();
    form2.resetFields();
    setDataModal((prevDataModal) => [
      ...prevDataModal,
      {
        key: uuidv4(),
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
        amount: 0,
        ActiveFlag: true,
      },
    ]);
    setCounterModal((prevCounter) => prevCounter + 1);
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

  const columnsModel = [
    {
      title: "Batch No",
      dataIndex: "BatchNo",
      key: "BatchNo",
      width: 100,
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "BatchNo"]}
            rules={[{ required: true, message: "Required" }]}
            initialValue={record.BatchNo}
          >
            <Select
              onChange={(value) => BatchSelect(value, record.key)}
              style={{ width: 100 }}
              disabled={!!record.IssueBatchId}
            >
              {batchDetails.map((option) => (
                <Select.Option key={option.StockId} value={option.StockId}>
                  {option.BatchNo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={[record.key, "BatchId"]}
            initialValue={record.StockId}
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={[record.key, "IssueBatchId"]}
            initialValue={record.StockId}
            hidden
          >
            <Input />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Quantity",
      // width: 150,
      dataIndex: "IssueQty",
      key: "IssueQty",
      render: (text, record) => {
        return (
          <Form.Item
            name={[record.key, "IssueQty"]}
            rules={[
              {
                required: true,
                message: "Please input quantity!",
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
            initialValue={record.IssueQty}
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
      title: "Avl Qty",
      // width: 150,
      dataIndex: "BalanceQty",
      key: "BalanceQty",
      render: (text, record) => {
        return (
          <Form.Item
            name={[record.key, "BalanceQty"]}
            initialValue={record.BalanceQty}
          >
            <InputNumber style={{ width: 100 }} allowClear disabled />
          </Form.Item>
        );
      },
    },
    {
      title: "UOM",
      // width: 150,
      dataIndex: "Uom",
      key: "Uom",
      render: (text, record) => {
        return (
          <Form.Item name={[record.key, "Uom"]} style={{ width: 110 }}>
            {/* {record.Uom} */}
            <Tag color="#7C00FE">{record.Uom}</Tag>
          </Form.Item>
        );
      },
    },
    {
      title: "EXP Date",
      dataIndex: "EXPDate",
      key: "EXPDate",
      width: 150,
      render: (text, record) => (
        <Form.Item name={[record.key, "EXPDate"]}>
          {batchRecord.Expiry === "Not applicable" ? (
            <span>Is Not Applicable</span>
          ) : (
            <DatePicker
              format={
                batchRecord.Expiry === "Month wise"
                  ? "MMMM YYYY"
                  : batchRecord.Expiry === "Date wise"
                    ? "DD-MM-YYYY"
                    : null
              }
              defaultValue={dayjs(record.EXPDate)}
              disabled
              style={{ width: "100%" }}
            />
          )}
        </Form.Item>
      ),
    },
    {
      title: "Rate",
      dataIndex: "IssueRate",
      // width: 150,
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
      // width: 150,
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
      // width: 150,
      key: "StockLocator",
      render: (text, record) => (
        <Form.Item name={[record.key, "StockLocator"]}>
          <Input style={{ width: 100 }} disabled />
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
    },
  ];

  const handleStoreChange = (value) => {
    debugger;
    form2.resetFields();
    setData([]);
    //setData(initialDataSource);
  };

  const GetUHID = (value) => {
    if (value !== "") {
      customAxios.get(`${urlSearchUHID}?Uhid=${value}`).then((response) => {
        const apiData = response.data.data;
        const newOptions = apiData.map((item) => ({
          value: item.UhId,
          key: item.UhId,
          PatientId: item.PatientId,
          PatientName: item.PatientFirstName + "" + item.PatientLastName,
        }));
        setAutoCompleteOptions(newOptions);
      });
    } else {
      setEncounter([]);
      form1.setFieldsValue({ Encounter: "" });
      form1.setFieldsValue({ Name: "" });
    }
  };

  const SubmitChanged = (event) => {
    setIssueStatus(event.target.checked);
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
              Create Patient Consumption
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
        <Card>
          <Form
            layout="vertical"
            onFinish={handleOnFinish}
            variant="outlined"
            style={{
              maxWidth: 1500,
            }}
            form={form1}
            initialValues={{
              IssueDate: dayjs(),
            }}
          >
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ padding: "0.5rem 0.5rem", marginBottom: "0" }}
              align="Bottom"
            >
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Issue Store"
                  name="IssueingStoreId"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    placeholder="Select Value"
                    onChange={handleStoreChange}
                    disabled={!!issueId}
                  >
                    {DropDown.StoreDetails.map((option) => (
                      <Select.Option key={option.StoreId} value={option.StoreId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item hidden name="IssueId">
                  <Input />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Consumption Date" name="IssueDate">
                  <DatePicker
                    disabled
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item label="Issue Owner" name="IssueOwner">
                    <Input style={{ width: "100%" }} allowClear />
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={3}>
                <div>
                  <Form.Item
                    label="Status"
                    name="Status"
                    rules={[
                      {
                        required: issueStatus,
                        message: "please input",
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
                </div>
              </Col>
              <Col className="gutter-row" span={3}>
                <div>
                  <Form.Item
                    name="SubmitCheck"
                    style={{ marginTop: "30px" }}
                    valuePropName="checked"
                  >
                    <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item
                    label="UHID"
                    name="UHID"
                    rules={[
                      {
                        required: true,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <AutoComplete
                      style={{ width: "100%" }}
                      disabled={!!issueId}
                      options={autoCompleteOptions}
                      onSearch={(value) => GetUHID(value)}
                      onSelect={(value, option) => handleSelect(value, option)}
                      value={uhId}
                      allowClear
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item label="Name" name="Name">
                    <Input style={{ width: "100%" }} disabled />
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item label="Encounter" name="Encounter">
                    {/* <Select disabled={isDisabled}>
                    {encounter.map((option) => (
                      <Select.Option key={option.EncounterId} value={option.EncounterId}>{option.GeneratedEncounterId}</Select.Option>
                    ))}
                  </Select> */}
                    <Input style={{ width: "100%" }} disabled />
                  </Form.Item>
                  <Form.Item name="EncounterId" hidden>
                    <Input></Input>
                  </Form.Item>
                  <Form.Item name="PatientId" hidden>
                    <Input></Input>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={12}>
                <div>
                  <Form.Item label="Remarks" name="Remarks">
                    <TextArea allowClear />
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
            {/* <Table
              columns={columns}
              dataSource={data?.filter((item) => item?.ActiveFlag != false)}
              scroll={{ x: 0 }}
            /> */}
            <CustomTable
              dataSource={data?.filter((item) => item.ActiveFlag != false)}
              columns={columns}
              isFilter={false}
              actionColumn={false}
              bordered
            />
          </Form>
        </Card>
        <ConfigProvider
          theme={{
            token: {
              zIndexPopupBase: 3000,
            },
          }}
        >
          <Modal
            title="Product Batch Details"
            onOk={onOkModal}
            onCancel={onCancelModel}
            width={1000}
            open={isModalOpen}
            okText="Save"
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
              <Tag color="#1890ff">Product: {productDetails.ProductName}</Tag>{" "}
              {/* Custom blue color */}
              <Tag color="#52c41a">
                Issued Quantity: {productDetails.IssueQty}
              </Tag>{" "}
              <Table
                columns={columnsModel}
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
        </ConfigProvider>
      </div>
    </Layout>
  );
};

export default PatientConsumption;
