import React, { useEffect, useState, useCallback } from "react";
import Button from "antd/es/button";
import {
  urlCreatePurchaseOrder,
  urlSearchUHID,
  urlShowPatientIssueBatchDetails,
  urlAutocompleteProduct,
  urlUpdatePatientIndent,
  urlCreatePatientIssue,
  urlGetProductDetailsById,
  urlAddNewIndentPatientIssue,
} from "../../../../endpoints.js";
import Select from "antd/es/select";
import {
  ConfigProvider,
  Card,
  Typography,
  Checkbox,
  message,
  Tooltip,
  Modal,
  Tag,
  Popconfirm,
  Spin,
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
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import PageHeader from "../../../components/PageHeader/index.jsx";

const UpdatePatientIssue = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: [],
  });

  let [counter, setCounter] = useState(0);
  let [modelCounter, setModelCounter] = useState(0);
  const [finalBatchDetails, setFinalBatchDetails] = useState([]);
  const [encounter, setEncounter] = useState([]);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const navigate = useNavigate();
  //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');
  const [data, setData] = useState([]);
  const [dataModal, setDataModal] = useState([]);
  const location = useLocation();
  const indentId = location.state.IndentId;
  const [batchOpen, setBatchOpen] = useState(false);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [issueStatus, setIssueStatus] = useState(false);
  const [batchDetails, setBatchDetails] = useState();
  const [batchRecord, setBatchRecord] = useState();

  useEffect(() => {
    debugger;
    customAxios
      .get(urlCreatePurchaseOrder, { params: { type: "Purchase Order" } })
      .then((response) => {
        const apiData = response.data.data;
        setDropDown(apiData);
      });
    if (indentId > 0) {
      customAxios
        .get(`${urlCreatePatientIssue}?IndentId=${indentId}`)
        .then((response) => {
          const apiData = response.data.data;
          if (
            apiData.IndentDetails != null &&
            apiData.IndentDetails.length > 0
          ) {
            const products = apiData.IndentDetails.map((item, index) => {
              let matchedProduct = null;

              if (apiData.newIndentIssueModel.length > 0) {
                matchedProduct = apiData.newIndentIssueModel.find(
                  (item1, index1) => {
                    if (
                      item1.ProductId === item.ProductId &&
                      apiData.newPatientIssueModel.IndentId === item.IndentId
                    ) {
                      return true;
                    }
                    return false;
                  }
                );

                if (matchedProduct) {
                  return {
                    ...matchedProduct,
                    key: index,
                    IssueQty: matchedProduct.IssueQty,
                    PatientIssueLineId: matchedProduct.PatientIssueLineId,
                    AvlQtyatIssue: item.StockBalanceQty,
                    Remarks: matchedProduct.Remarks,
                    RequestQty: item.RequestQty,
                    PendingQty: item.PendingQty,
                    index: index + 1,
                  };
                }
              }

              return {
                ...item,
                key: index,
                AvlQtyatIssue: item.AvlIssueQuantity,
                IssueQty: 0,
                PatientIssueLineId: 0,
                // RequestingStoreStock: item.RequestQty,
                PendingQty: item.PendingQty,
                index: index + 1,
              };
            });
            setData(products);
            setCounter(products.length);
            const batch = apiData.BatchDetails.map((item, index) => {
              return {
                ...item,
                // key: index,
                amount: item.IssueRate * item.IssueQty,
              };
            });
            setDataModal(batch);
            setIsTableVisible(true);
          }

          const formdata = apiData.newIndentModel;
          form1.setFieldsValue({
            IssuingStore: formdata.IssueingStoreId,
            IndentType: formdata.IndentType,
            Remarks: formdata.Remarks,
            IndentNumber: formdata.IndentNumber,
            IssueStatus:
              formdata.IssueStatus == "Created" ||
              formdata.IssueStatus == "Pending"
                ? undefined
                : formdata.IssueStatus,
            UHID: formdata.UhId,
            Name: formdata.PatientName,
            Encounter: formdata.Encounter,
            EncounterId: formdata.EncounterId,
            PatientId: formdata.PatientId,
            IndentId: formdata.IndentId,
            IssueId:
              apiData.newPatientIssueModel != null
                ? apiData.newPatientIssueModel.IssueId
                : 0,
          });
        });
    }
  }, []);

  const onOkModal = () => {
    form2.submit();
  };

  const OpenBatch = async (record) => {
    debugger;
    try {
      // Validate and get form values
      await form1.validateFields();
      form2.resetFields();
      const formValues = form1.getFieldsValue();

      // Update the record with the form value
      record.IssueQty = formValues[record.key].IssueQty;
      setProductDetails(record);
      setBatchRecord(record);

      // Construct the product object
      const product = {
        IssueQty: record.IssueQty,
        ProductId: record.ProductId,
        IssueId: record.IssueingStoreId,
        StoreId: record.IssueingStoreId,
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
        urlShowPatientIssueBatchDetails,
        post1,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const ApiData = response.data.data;
      // setDataModal([]);

      setBatchDetails(ApiData.BatchDetails);
      // setModelCounter(ApiData.BatchDetails.length + 1);

      // Process batch data
      if (ApiData.Batch.length > 0) {
        const batch = ApiData.Batch.map((Item, Index) => ({
          ...Item,
          key: uuidv4(),
          amount: Item.IssueRate * Item.IssueQty,
        }));

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
            key: uuidv4(), //index + 1,
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
      setBatchOpen(true);
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
      //return false;
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
              BalanceQty: selectedBatch.BalanceQty,
              EXPDate: selectedBatch.EXPDate
                ? dayjs(selectedBatch.EXPDate)
                : null,
              MRP: selectedBatch.MRP,
              // qty:item.qty,
              amount: selectedBatch.amount,
            }
          : item
      );
      // setDataModal(updatedDataModel);

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

  const onFinishmodal = async () => {
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
      setBatchOpen(false);
    } else {
      message.warning("Total Quantity should be equal to Issued Quantity");
      setBatchOpen(true);
    }
  };

  const handleOnFinish = async (values) => {
    debugger;
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
    const filteredProducts = products.filter(
      (product) => !(product.IssueQty === 0 && product.PendingQty === 0)
    );
    const result = checkActiveBatches(filteredProducts, dataModal);
    if (!result.allActiveProductsHaveActiveBatch) {
      message.warning("Please Add BatchDeatils");
      return false;
    }
    const sumItems = (items, key) =>
      items.reduce((sum, item) => sum + parseInt(item[key] || 0, 10), 0);

    const activeItems = dataModal.filter((item) => item.ActiveFlag);

    const totalReceivedQty = sumItems(filteredProducts, "IssueQty");
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
      IssueingStoreId: values.IssuingStore,
      IssueStatus: !issueStatus ? "Created" : values.IssueStatus,
      IndentCategory: "PatientIssue",
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
      if (indentId > 0) {
        const response = await customAxios.post(
          urlAddNewIndentPatientIssue,
          postData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        handleCancel();
      }
    } catch (error) {
      // Handle error
    }
    //setIsSearchLoading(false);
  };

  const validateNotGreaterValue = (record, value) => {
    if (value > record.PendingQty || value > record.AvlQtyatIssue) {
      if (value > record.PendingQty) {
        return Promise.reject(new Error("Must not Greater than Pending Qty!"));
      } else if (value > record.AvlQtyatIssue) {
        return Promise.reject(
          new Error("Must not Greater than Available at Issue!")
        );
      }
    } else {
      return Promise.resolve();
    }
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
            <Input disabled />
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
      dataIndex: "UomId",
      key: "UomId",
      render: (text, record) => (
        <Form.Item name={[record.key, "UomId"]} initialValue={record.UomId}>
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
      title: "Requested Qty",
      dataIndex: "RequestQty",
      key: "RequestQty",
      render: (text, record) => (
        <Form.Item
          initialValue={record.RequestQty}
          name={[record.key, "RequestQty"]}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Issue Qty",
      dataIndex: "IssueQty",
      key: "IssueQty",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "IssueQty"]}
          initialValue={record.IssueQty != null ? record.IssueQty : 0}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
            {
              validator: (_, value) => validateNotGreaterValue(record, value),
            },
          ]}
        >
          <InputNumber allowClear min={0} />
        </Form.Item>
      ),
    },
    {
      title: "Avl Qty at Issue",
      dataIndex: "AvlQtyatIssue",
      key: "AvlQtyatIssue",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "AvlQtyatIssue"]}
          initialValue={record.AvlQtyatIssue}
        >
          <InputNumber disabled />
        </Form.Item>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
      render: (text, record) => (
        <Form.Item name={[record.key, "Remarks"]} initialValue={record.Remarks}>
          <Input />
        </Form.Item>
      ),
    },
    {
      title: "Batch",
      dataIndex: "Batch",
      key: "Batch",
      render: (text, record) => (
        <Button type="link" onClick={() => OpenBatch(record)}>
          Batch
        </Button>
      ),
    },
    {
      title: "Pending Qty",
      dataIndex: "PendingQty",
      key: "PendingQty",
      render: (text, record) => (
        <>
          <Form.Item
            name={[record.key, "PendingQty"]}
            initialValue={record.PendingQty}
          >
            <InputNumber disabled />
          </Form.Item>
        </>
      ),
    },
  ];

  const handleAddBatch = async () => {
    debugger;
    //await form2.validateFields();
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
        ActiveFlag: true,
      },
    ]);
    setModelCounter((prevCounter) => prevCounter + 1);
  };

  const columnsModel = [
    {
      title: "BatchNo",
      dataIndex: "BatchNo",
      // width: 100,
      key: "BatchNo",
      render: (text, record, index) => (
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
            initialValue={record.IssueBatchId}
            hidden
          >
            <Input />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "IssueQty",
      key: "IssueQty",
      // width: 100,
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "IssueQty"]}
          initialValue={record.IssueQty}
          rules={[
            { required: true, message: "Required" },
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
          style={{ width: 100 }}
        >
          <InputNumber
            min={0}
            onChange={(value) =>
              calculateAmount(
                record.key,
                value,
                record.IssueBatchId ? record.IssueRate : record.MRP
              )
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "AvlQty",
      dataIndex: "BalanceQty",
      key: "BalanceQty",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "BalanceQty"]}
          initialValue={record.BalanceQty}
        >
          <Input style={{ width: 70 }} disabled />
        </Form.Item>
      ),
    },
    {
      title: "Uom",
      dataIndex: "UomId",
      // width: 100,
      key: "UomId",
      // render: (text, record, index) => (
      //   <Form.Item name={[record.key, "UomId"]}>
      //     <Input style={{ width: 100 }} defaultValue={record.Uom} disabled />
      //   </Form.Item>
      // ),
      render: (text, record) => (
        <Form.Item name={[record.key, "UomId"]}>
          <Tag color="#7C00FE">{batchRecord.Uom}</Tag>
        </Form.Item>
      ),
    },
    {
      title: "EXP Date",
      dataIndex: "EXPDate",
      key: "EXPDate",
      // width: 150,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "EXPDate"]}
          rules={[
            {
              validator: (_, value) => {
                // if (!record.EXPDate || !record.EXPDate.$isDayjsObject) {
                //   record
                //   return Promise.reject(new Error("Invalid date format!"));
                // }
                const today = dayjs();
                const expDate = dayjs(record.EXPDate);

                if (expDate.isBefore(today, "day")) {
                  return Promise.reject(new Error("Date is expired!"));
                }

                return Promise.resolve();
                // const today = dayjs();
                // if (record.EXPDate.isBefore(today, "day")) {
                //   return Promise.reject(new Error("Date is expired!"));
                // }
                // return Promise.resolve();
              },
            },
          ]}
        >
          {batchRecord.Expiry === "Not applicable" ? (
            <span>Is Not Applicable</span>
          ) : (
            <DatePicker
              format={
                batchRecord.Expiry === "Month wise"
                  ? "MMM YYYY"
                  : batchRecord.Expiry === "Date wise"
                  ? "DD-MM-YYYY"
                  : null
              }
              defaultValue={dayjs(record.EXPDate)}
              disabled
              style={{ width: 100 }}
            />
          )}
        </Form.Item>
      ),
    },
    {
      title: "Rate",
      dataIndex: "IssueRate",
      // width: 100,
      key: "IssueRate",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "IssueRate"]}
          initialValue={record.IssueRate}
        >
          <Input style={{ width: 100 }} allowClear disabled />
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      // width: 100,
      key: "amount",
      render: (text, record, index) => (
        <Form.Item name={[record.key, "amount"]} initialValue={record.amount}>
          <Input style={{ width: 100 }} allowClear disabled />
        </Form.Item>
      ),
    },
    {
      title: "Stock Locator",
      dataIndex: "StockLocator",
      // width: 100,
      key: "StockLocator",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, "StockLocator"]}
          initialValue={record.StockLocatorName}
        >
          <Input style={{ width: 100 }} allowClear disabled />
        </Form.Item>
      ),
    },
    {
      title: (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddBatch}
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

  const onCancelmodal = () => {
    debugger;
    // const newData = dataModal.map((item) => {
    //   if (item.ProductId === "") {
    //     return { ...item, ActiveFlag: false };
    //   }
    //   return item;
    // });

    // setDataModal(newData);
    // setBatchOpen(false);
    // form2.resetFields();

    const newData = dataModal.filter((item) => {
      // Keep the item if item.ProductId is not an empty string
      return item.ProductId !== "";
    });

    form2.resetFields();
    setDataModal(newData);
    setBatchOpen(false);
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

  const calculateAmount = (key, quantity, rate) => {
    debugger;
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
  const handleCancel = () => {
    const url = "/PatientIssue";
    navigate(url);
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
        {/* <Row
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
              Patient Issue
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
        </Row> */}
        <PageHeader
          title={"Patient Issue"}
          buttonLabel="Back"
          buttonIcon={<LeftOutlined />}
          onButtonClick={handleCancel}
        />
        <Card>
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
              IssueDate: dayjs(),
              SubmitCheck: false,
            }}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="Bottom">
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Indent Number"
                  name="IndentNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input disabled={!!indentId} />
                </Form.Item>
                <Form.Item name="IndentId" hidden>
                  <InputNumber></InputNumber>
                </Form.Item>
                <Form.Item name="IssueId" hidden>
                  <InputNumber></InputNumber>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Indent Type"
                  name="IndentType"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Value"
                    allowClear
                    disabled={!!indentId}
                  >
                    <Select.Option
                      key="Effective"
                      value="Effective"
                    ></Select.Option>
                    <Select.Option
                      key="Consumption Based"
                      value="Consumption Based"
                    ></Select.Option>
                    <Select.Option key="Urgent" value="Urgent"></Select.Option>
                    <Select.Option
                      key="Reorder level Based"
                      value="Reorder level Based"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label="Issuing Store"
                  name="IssuingStore"
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
                    disabled={!!indentId}
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
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Issue Date"
                  name="IssueDate"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    disabled={!!indentId}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Issue Owner"
                  name="IssueOwner"
                  // rules={[
                  //     {
                  //         required: true,
                  //         message: 'Please input!'
                  //     }
                  // ]}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
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
                <Form.Item name="EncounterId" hidden>
                  <Input></Input>
                </Form.Item>
                <Form.Item name="PatientId" hidden>
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="SubmitCheck"
                  style={{ marginTop: "30px" }}
                  valuePropName="checked"
                >
                  <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <div>
                  <Form.Item label="Remarks" name="Remarks">
                    <TextArea autoSize allowClear />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row justify="end" style={{ padding: "0rem 1rem" }}>
              <Col style={{ marginRight: "10px" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
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
            {isTableVisible ? (
              <div>
                <Table
                  columns={columns}
                  dataSource={data.filter((item) => item.ActiveFlag !== false)}
                  scroll={{ x: 0 }}
                />
              </div>
            ) : null}
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
            onCancel={onCancelmodal}
            width={1000}
            open={batchOpen}
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
              autoComplete="off"
              onFinish={onFinishmodal}
              form={form2}
            >
              <Tag color="#1890ff">Product: {productDetails.ProductName}</Tag>{" "}
              {/* Custom blue color */}
              <Tag color="#52c41a">
                Issued Quantity: {productDetails.IssueQty}
              </Tag>{" "}
              {/* Custom green color */}
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

export default UpdatePatientIssue;
