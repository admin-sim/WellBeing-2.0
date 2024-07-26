import customAxios from "../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState, useCallback } from "react";
import Button from "antd/es/button";
import {
  urlCreatePurchaseOrder,
  urlShowBatchDetails,
  urlEditIndentIssue,
  urlAddNewIndentIssue,
} from "../../../endpoints.js";
import Select from "antd/es/select";
import {
  ConfigProvider,
  message,
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
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import FormItem from "antd/es/form/FormItem/index.js";
//import { useParams } from 'react-router-dom';

const UpdateIndentIssue = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: [],
  });

  let [productCount, setProductcount] = useState(0);
  let [batchCount, setBatchCount] = useState(1);

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataModel, setDataModel] = useState([]);
  const [batchDetails, setBatchDetails] = useState([]);
  const [finalBatchDetails, setFinalBatchDetails] = useState([]);
  const [issuestatus, setIssueStatus] = useState([]);
  const [batchRecord, setBatchRecord] = useState();
  const [productDetails, setProductDetails] = useState([]);
  const [istablevisible, setIstablevisible] = useState(false);
  const [batches, setBatches] = useState([]);
  const fields = form1.getFieldsValue();
  const location = useLocation();
  const indentId = location.state.IndentId;
  const [indentStatus, setIndentStatus] = useState(false);
  const [isPageLoad, setIsPageLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await customAxios.get(urlCreatePurchaseOrder);
        setDropDown(response1.data.data);

        if (indentId > 0) {
          const response2 = await customAxios.get(
            `${urlEditIndentIssue}?IndentId=${indentId}`
          );
          const apiData = response2.data.data;

          setIssueStatus(apiData.newPatientIssueModel);

          const products = apiData.IndentDetails.map((item, index) => ({
            ...item,
            key: index + 1,
            IssueQty:
              apiData.newIndentIssueModel == null
                ? undefined
                : apiData.newIndentIssueModel[index].IssueQty,
            IndentIssueLineId:
              apiData.newIndentIssueModel == null
                ? undefined
                : apiData.newIndentIssueModel[index].IndentIssueLineId,
          }));

          setIstablevisible(true);
          setProductcount(apiData.IndentDetails.length);
          setData(products);

          const formdata = apiData.newIndentModel;
          form1.setFieldsValue({
            RequestingStoreId: formdata.RequestingStoreId,
            IndentNumber: formdata.IndentNumber,
            IndentDate: DateBindtoDatepicker(formdata.IndentDate),
            IssueingStoreId: formdata.IssueingStoreId,
            IndentType: formdata.IndentType,
            IndentCategory: formdata.IndentCategory,
            Remarks: formdata.Remarks,
            IndentStatus:
              formdata.IndentStatus === "Created" ? "" : formdata.IndentStatus,
            IndentId: formdata.IndentId,
            IndentTemplateId: formdata.IndentTemplateId,
            IssueId:
              apiData.newIndentIssueModel == null
                ? undefined
                : apiData.newIndentIssueModel[0].IssueId,
          });

          const batch = apiData.Batch.map((Item, Index) => ({
            ...Item,
            key: Index + 1,
            amount: Item.IssueRate * Item.IssueQty,
          }));

          setDataModel(batch);
          setIsPageLoad(false);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [indentId]);

  const handleToIndent = () => {
    const url = "/IndentIssue";
    navigate(url);
  };

  const onOkModal = () => {
    form2.submit();
  };

  const DateBindtoDatepicker = (value) => {
    const isoDateString = value;
    const dateValue = new Date(isoDateString);
    const formattedDate = dayjs(dateValue).format("DD-MM-YYYY");
    return dayjs(formattedDate, "DD-MM-YYYY");
  };

  const OpenModel = useCallback(
    async (record) => {
      debugger;
      await form1.validateFields();
      const va = form1.getFieldsValue();
      record.IssueQty = va[record.key].IssueQty;
      setProductDetails(record);

      console.log("dataModel", dataModel);

      const product = {
        IssueQty: record.IssueQty,
        ProductId: record.ProductId,
        IssueId: record.IssueingStoreId,
        StoreId: record.IssueingStoreId,
      };

      // Filter dataModel based on ProductId and ActiveFlag
      const filteredDataModel = dataModel.filter(
        (item) =>
          item.ProductId === record.ProductId && item.ActiveFlag === true
      );

      const post1 = {
        newIndentModel: product,
        Batch: filteredDataModel,
      };

      try {
        const response = await customAxios.post(urlShowBatchDetails, post1, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const ApiData = response.data.data;
        setBatchRecord(record);
        setDataModel([]);
        setBatchDetails(ApiData.BatchDetails);
        setBatchCount(ApiData.BatchDetails.length + 1);
        if (ApiData.Batch.length > 0) {
          const batch = ApiData.Batch.map((Item, Index) => ({
            ...Item,
            key: Index + 1,
            amount: Item.IssueRate * Item.IssueQty,
          }));

          setDataModel(batch);
        } else {
          const calculateQuantitiesAndAmounts = (issueQty) => {
            let totalQty = 0;
            const sortedBatchDetails = [...ApiData.BatchDetails].sort(
              (a, b) => new Date(a.EXPDate) - new Date(b.EXPDate)
            );
            const updatedBatchDetails = sortedBatchDetails.map((item) => {
              let qty = 0;
              let amount = 0;

              if (!item.IsProductBatchExpired && totalQty < issueQty) {
                qty = Math.min(item.PendingQty, issueQty - totalQty);
                totalQty += qty;
                amount = qty * item.MRP;
              }
              return { ...item, qty, amount };
            });
            return updatedBatchDetails.filter((item) => item.qty > 0);
          };
          const updatedBatch = calculateQuantitiesAndAmounts(
            record.IssueQty
          ).map((item, index) => ({
            ...item,
            key: index + 1,
            IssueQty: item.qty, // Update IssueQty with qty
            IssueRate: item.MRP,
            LineAmount: item.amount,
            EXPDate: item.EXPDate ? dayjs(item.EXPDate) : undefined,
            RequestQty: item.qty,
          }));

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

          setDataModel(updatedBatch);
        }

        setIsModalOpen(true);
      } catch (error) {
        console.error("Error in OpenModel:", error);
        // Handle error if needed
      }
    },
    [dataModel] // Add dataModel to the dependency array
  );

  const onFinishmodal = async (value) => {
    debugger;
    await form2.validateFields();
    const values = form2.getFieldsValue();

    // Extract the values from the object as an array
    const valueArray = Object.values(values);

    const activeItems = dataModel.filter(item => item.ActiveFlag);
    const stockIdCounts = activeItems.reduce((acc, item) => {
      acc[item.StockId] = (acc[item.StockId] || 0) + 1;
      return acc;
    }, {});

    const duplicateStockIds = Object.keys(stockIdCounts).filter(stockId => stockIdCounts[stockId] > 1);
    
    if (duplicateStockIds.length > 0) {
      message.error('Same Batch Number should not be selected.');
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
      const filteredDataModel = dataModel
        .filter((item) => {
          if (item.IssueBatchId > 0) {
            return true; // include all items with IssueBatchId > 0
          } else {
            return item.ActiveFlag === true; // only include items with IssueBatchId = 0 or null and ActiveFlag = true
          }
        })
        .map((item) => ({ ...item, ProductId: productDetails.ProductId }));

      setFinalBatchDetails(filteredDataModel);

      setIsModalOpen(false);
    } else {
      message.warning("Total Quantity should be equal to Issued Quantity");
    }
  };

  const onCancelmodal = () => {
    // form2.resetFields();
    //setDataModel([]);
    debugger;
    const newData = dataModel.map((item) => {
      if (item.ProductId === "") {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });

    setDataModel(newData);
    //setIsModalOpen(false);
    setIsModalOpen(false);
    form2.resetFields();
  };

  const handleOnFinish = async (values) => {
    debugger;
    const products = [];
    for (let i = 0; i <= productCount; i++) {
      if (values[i] !== undefined) {
        const product = {
          ProductId: values[i].ProductId,
          UomId: values[i].UomId,
          RequestQty: values[i].RequestQty,
          IssueQty: values[i].IssueQty,
          PendingQty: values[i].PendingQty,
          IndentLineId: values[i].IndentLineId,
          IndentIssueLineId:
            values[i].IndentIssueLineId === undefined
              ? 0
              : values[i].IndentIssueLineId,
          StockId: values[i].StockId,
          PendingQty:
            values.IssueStatus == "Finalize"
              ? values[i].IssueQty - values[i].PendingQty
              : values[i].PendingQty,
        };
        products.push(product);
      }
    }
    if (finalBatchDetails.length > 0) {
      const Indent = {
        IssueDateString: values.IssueDateString
          ? values.IssueDateString.format("DD-MM-YYYY")
          : "",
        IndentId: values.IndentId,
        IssueId: values.IssueId,
        Remarks: values.Remarks === undefined ? null : values.Remarks,
        RequestingStoreId: values.RequestingStoreId,
        IssueingStoreId: values.IssueingStoreId,
        IssueStatus: !indentStatus ? "Created" : values.IssueStatus,
        IndentCategory: "Indent Issue",
      };
      const defaultDateTime = new Date().toISOString();
      const finalBatchDetailsWithDefaultExpdate = finalBatchDetails.map(
        (batch) => ({
          ...batch,
          EXPDate: defaultDateTime,
          StockLocator: batch.StockLocator ? batch.StockLocator : 0,
        })
      );



      const postData = {
        newIndentModel: Indent,
        IndentDetails: products,
        Batch: finalBatchDetailsWithDefaultExpdate,
      };
      console.log("postData", postData);
      try {
        if (indentId > 0) {
          const response = await customAxios.post(
            urlAddNewIndentIssue,
            postData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          handleCancel();
        }
        // else {
        //     const response = await customAxios.post(urlAddNewIndent, postData, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        //     handleCancel();
        // }
        // form1.resetFields();
      } catch (error) {
        // Handle error
      }
      //setIsSearchLoading(false);
    } else {
      message.warning("Please add Batch Details");
    }
  };

  const validateIssueQty = (record, value) => {
    if (parseInt(value) <= record.PendingQty) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error("Issue Qty must not Greater Than Pending Qty!")
    );
  };

  const BatchSelect = (selectedStockId, recordKey) => {
    debugger;

    // Check if selectedStockId already exists in dataModel with ActiveFlag true
    const existingBatch = dataModel.find(
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
      const updatedDataModel = dataModel.map((item) =>
        item.key === recordKey
          ? {
              ...item,
              BatchNo: selectedBatch.BatchNo,
              StockId: selectedBatch.StockId,
              IssueBatchId: selectedBatch.IssueBatchId,
              IssueQty: selectedBatch.IssueQty, // Set IssueQty with qty
              BatchNo: selectedBatch.BatchNo,
              IssueRate: selectedBatch.MRP,
              //LineAmount:item.LineAmount,
              // BalanceQty:item.BalanceQty,
              EXPDate: selectedBatch.EXPDate ? dayjs(item.EXPDate) : undefined,
              MRP: selectedBatch.MRP,
              // qty:item.qty,
              amount: selectedBatch.amount,
            }
          : item
      );
      setDataModel(updatedDataModel);

      // Update form2 with the respective values
      form2.setFieldsValue({
        [recordKey]: {
          StockId: selectedBatch.StockId,
          IssueBatchId: selectedBatch.IssueBatchId,
          IssueQty: selectedBatch.IssueQty, // Set IssueQty with qty
          BatchNo: selectedBatch.BatchNo,
          IssueRate: selectedBatch.IssueRate,
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
      // calculateAmount(recordKey, selectedBatch.IssueQty, selectedBatch.MRP)
    }
  };

  const columns = [
    {
      title: "Product",
      width: 350,
      dataIndex: "ProductName",
      key: "ProductName",
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "ProductName"]}
            initialValue={record.ProductName}
          >
            <Input style={{ width: "100%" }} disabled></Input>
          </Form.Item>
          <Form.Item
            name={[record.key, "IndentLineId"]}
            initialValue={record.IndentLineId}
            hidden
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            name={[record.key, "IndentIssueLineId"]}
            initialValue={record.IndentIssueLineId}
            hidden
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            name={[record.key, "ProductId"]}
            initialValue={record.ProductId}
            hidden
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
      title: "Requested Qty",
      dataIndex: "RequestQty",
      key: "RequestQty",
      width: 150,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "RequestQty"]}
          initialValue={record.RequestQty}
        >
          <InputNumber min={0} disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "IssueQty",
      dataIndex: "IssueQty",
      key: "IssueQty",
      width: 150,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "IssueQty"]}
          initialValue={record.IssueQty}
          rules={[
            {
              required: true,
              message: "input!",
            },
            {
              validator: (_, value) => validateIssueQty(record, value),
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Avg qty at Issue",
      dataIndex: "AvlIssueQuantity",
      key: "AvlIssueQuantity",
      width: 150,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "AvlIssueQuantity"]}
          initialValue={
            issuestatus?.IssueStatus !== "Finalize"
              ? record.StockBalanceQty
              : record.AvlIssueQuantity
          }
        >
          <InputNumber min={0} disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Avg qty at Req",
      dataIndex: "AvlReqQuantity",
      key: "AvlReqQuantity",
      width: 150,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "AvlReqQuantity"]}
          initialValue={record.AvlReqQuantity}
        >
          <InputNumber min={0} disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width: 150,
      render: (text, record) => (
        <Form.Item name={[record.key, "remarks"]}>
          <Input style={{ width: "100%" }} allowClear></Input>
        </Form.Item>
      ),
    },
    {
      title: "Batch Details",
      dataIndex: "BatchDetails",
      key: "BatchDetails",
      render: (text, record) => (
        <Button type="link" onClick={() => OpenModel(record)}>
          Batch
        </Button>
      ),
    },
    {
      title: "Pending Qty",
      dataIndex: "PendingQty",
      key: "PendingQty",
      width: 150,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "PendingQty"]}
          initialValue={record.PendingQty}
        >
          <Input style={{ width: "100%" }} disabled></Input>
        </Form.Item>
      ),
    },
  ];

  const handleCancel = () => {
    const url = "/IndentIssue";
    navigate(url);
  };

  const BatchAdd = async () => {
    debugger;
    //await form2.validateFields();
    setDataModel([
      ...dataModel,
      {
        key: batchCount,
        BatchNo: "",
        ProductId: "",
        IssueQty: 0,
        BalanceQty: 0,
        Uom: "",
        EXPDate: "",
        IssueRate: 0,
        amount: 0,
        StockLocator: "",
        IssueBatchId: 0,
        ActiveFlag: true,
      },
    ]);
    setBatchCount(batchCount + 1);
  };

  // const BatchAdd = async () => {
  //   debugger;
  //   // No need to validate form2 here
  //   setDataModel((prevDataModel) => [
  //     ...prevDataModel,
  //     {
  //       key: batchCount,
  //       BatchNo: "",
  //       IssueQty: 0,
  //       BalanceQty: 0,
  //       Uom: "",
  //       EXPDate: "",
  //       IssueRate: 0,
  //       amount: 0,
  //       StockLocator: "",
  //       ActiveFlag: true,
  //     },
  //   ]);
  //   setBatchCount((prevCount) => prevCount + 1);
  // };

  // const BatchSelect = (record) => {
  //   debugger;
  //   const IsExist = dataModel.filter((item) => item.BatchNo == record);
  //   const temp = batchDetails.filter((item) => item.BatchNo === record);
  //   const newdata = temp.map((item) => {
  //     return {
  //       ...item,
  //       BalanceQty: item.BalanceQty,
  //       Uom: item.Uom,
  //       EXPDate: item.EXPDate,
  //       IssueRate: item.IssueRate,
  //       amount: 0,
  //     };
  //   });
  //   setDataModel(newdata);
  //   if (IsExist.length > 0) {
  //     message.warning("Same Batch No should not be selected.");
  //   }
  // };

  // const validateEqualValue = (record, value) => {
  //     if (parseInt(value) == productDetails.IssueQty) {
  //         return Promise.resolve();
  //     }
  //     return Promise.reject(new Error('Must equal to Issue Qty!'));
  // };

  const validateExpiry = (record, value) => {
    const isExpired = dayjs(record.EXPDate).isBefore(dayjs(), "day");
    if (!isExpired) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Batch is Expired!"));
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
    setDataModel((prevDataModel) =>
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

  const Batchmodal = [
    {
      title: "Batch Number",
      dataIndex: "BatchNo",
      width: 100,
      key: "BatchNo",
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "BatchNo"]}
            rules={[
              {
                required: true,
                message: "input!",
              },
            ]}
            initialValue={record.BatchNo}
          >
            <Select
              onChange={(value) => BatchSelect(value, record.key)}
              style={{ width: 100 }}
              disabled={record?.IssueBatchId > 0}
            >
              {batchDetails.map((option) => (
                <Select.Option key={option.StockId} value={option.StockId}>
                  {option.BatchNo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={[record.key, "StockId"]} hidden>
            <Input />
          </Form.Item>
          <Form.Item name={[record.key, "IssueBatchId"]} hidden>
            <Input />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "IssueQty",
      width: 100,
      key: "IssueQty",
      render: (text, record) => {
        return (
          <Form.Item
            name={[record.key, "IssueQty"]}
            initialValue={record.IssueQty}
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
      title: "Avg Quantity",
      dataIndex: "BalanceQty",
      key: "BalanceQty",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <Form.Item
              name={[record.key, "BalanceQty"]}
              initialValue={record.BalanceQty}
            >
              <Input disabled style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name={[record.key, "StockId"]} hidden>
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </>
        );
      },
    },
    {
      title: "Uom",
      dataIndex: "Uom",
      width: 100,
      key: "Uom",
      render: (text, record) => (
        <Form.Item name={[record.key, "Uom"]}>{record.Uom}</Form.Item>
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
            record.EXPDate == "" ? undefined : dayjs(record.EXPDate)
          }
          rules={[
            {
              validator: (_, value) => validateExpiry(record, value),
            },
          ]}
        >
          <DatePicker format="MMMM YYYY" disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Rate",
      dataIndex: "IssueRate",
      key: "IssueRate",
      width: 100,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "IssueRate"]}
          initialValue={record.IssueBatchId ? record.IssueRate : record.MRP}
        >
          <Input style={{ width: "100%" }} disabled></Input>
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, "amount"]} initialValue={record.amount}>
          <Input style={{ width: "100%" }} disabled></Input>
        </Form.Item>
      ),
    },
    {
      title: "Stock Locator",
      dataIndex: "StockLocator",
      key: "StockLocator",
      width: 100,
      render: (text, record) => (
        <Form.Item name={[record.key, "StockLocator"]}>
          <Input style={{ width: "100%" }} disabled></Input>
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
          onConfirm={() => handleDelete(record)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
    },
  ];

  const handleDelete = (record) => {
    debugger;
    const newData = dataModel.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setDataModel(newData);
  };

  const SubmitChanged = (event) => {
    setIndentStatus(event.target.checked);
  };

  return (
    <>
      {isPageLoad && (
        <div>
          <Spin size="large" />
        </div>
      )}
      {!isPageLoad && (
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
                  Indent Issue
                </Title>
              </Col>
              <Col offset={6} span={2}>
                <Button
                  icon={<LeftOutlined />}
                  style={{ marginBottom: 0 }}
                  onClick={handleToIndent}
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
                IssueDateString: dayjs(),
                SubmitCheck: false,
              }}
            >
              <Row
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                style={{ padding: "1rem 0.5rem", marginBottom: "0" }}
              >
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    label="Indent Number"
                    name="IndentNumber"
                    rules={[
                      {
                        required: true,
                        message: "input!",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} disabled></Input>
                  </Form.Item>
                  <Form.Item name="IndentId" hidden>
                    <Input></Input>
                  </Form.Item>
                  <Form.Item name="IssueId" hidden>
                    <Input></Input>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    label="Indent Type"
                    name="IndentType"
                    rules={[
                      {
                        required: true,
                        message: "input!",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} disabled></Input>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    label="Issuing Store"
                    name="IssueingStoreId"
                    rules={[
                      {
                        required: true,
                        message: "input!",
                      },
                    ]}
                  >
                    <Select disabled>
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
                    label="Requesting Location"
                    name="RequestingStoreId"
                    rules={[
                      {
                        required: true,
                        message: "input!",
                      },
                    ]}
                  >
                    <Select disabled>
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
                  <Form.Item label="Issuing Date" name="IssueDateString">
                    <DatePicker
                      style={{ width: "100%" }}
                      format="DD-MM-YYYY"
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item label="Issue Owner" name="IssueOwner">
                    <Input style={{ width: "100%" }} allowClear></Input>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    label="Issue Status"
                    name="IssueStatus"
                    rules={[
                      {
                        required: indentStatus,
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
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    name="SubmitCheck"
                    style={{ paddingTop: 30 }}
                    valuePropName="checked"
                  >
                    <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item label="Remarks" name="remarks">
                    <TextArea></TextArea>
                  </Form.Item>
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
              {istablevisible ? (
                <div>
                  <Table
                    columns={columns}
                    dataSource={data}
                    scroll={{ x: 0 }}
                  />
                </div>
              ) : null}
            </Form>
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
                width={1300}
                open={isModalOpen}
              >
                <Card>
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
                    layout="vertical"
                    onFinish={onFinishmodal}
                    autoComplete="off"
                    form={form2}
                  >
                    <Tag color="#1890ff">Product: {productDetails.ProductName}</Tag> {/* Custom blue color */}
                    <Tag color="#52c41a">Issued Quantity: {productDetails.IssueQty}</Tag> {/* Custom green color */}
                    <Table
                      columns={Batchmodal}
                      dataSource={
                        batchRecord?.ProductId
                          ? dataModel.filter(
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
                </Card>
              </Modal>
            </ConfigProvider>
          </div>
        </Layout>
      )}
    </>
  );
};

export default UpdateIndentIssue;
