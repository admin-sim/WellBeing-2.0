import customAxios from "../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
import {
  urlCreatePurchaseOrder,
  urlShowBatchDetails,
  urlEditItemReceipt,
  urlAddNewItemReceipt,
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

const UpdateItemReceipt = () => {
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
  const [productDetails, setProductDetails] = useState([]);

  const [istablevisible, setIstablevisible] = useState(false);
  const fields = form1.getFieldsValue();
  const location = useLocation();
  const issueId = location.state.IssueId;
  const indentReceiptId = location.state.IndentReceiptId;
  const [indentStatus, setIndentStatus] = useState(false);
  const [indentid, setIndentId] = useState(null);


  useEffect(() => {
    debugger;
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
    if (issueId > 0 || indentReceiptId > 0) {
      customAxios
        .get(
          `${urlEditItemReceipt}?IssueId=${issueId}&IndentReceiptId=${indentReceiptId}`
        )
        .then((response) => {
          const apiData = response.data.data;

          if (apiData.IndentIssueModel.IndentId != null) {
                 setIndentId(apiData.IndentIssueModel.IndentId);
            const dataSource = apiData.IndentDetails.map((item) => {
              let issueqty = 0,
                remarks = "",
                pending = item.PendingQty,
                receiptlineid = 0;
              let avlqty = item.AvlIssueQuantity;

              apiData.newIndentIssueModel.forEach((items) => {
                if (items.ProductId === item.ProductId) {
                  issueqty = items.IssueQty;
                  avlqty = item.StockBalanceQty;
                  remarks = items.Remarks;
                }
              });

              apiData.IndentReceiptList.forEach((list) => {
                if (list.ProductId === item.ProductId) {
                  receiptlineid = list.IndentReceiptLineId;
                }
              });

              return {
                key: item.ProductId,
                ProductName: item.ProductName,
                ProductId: item.ProductId,
                uom: item.Uom,
                UomId: item.UomId,
                RequestQty: item.RequestQty,
                IssueQty: issueqty,
                AvlIssueQuantity: avlqty,
                AvlReqQuantity: item.AvlReqQuantity,
                remarks: remarks,
                IndentReceiptLineId: receiptlineid,
                PendingQty: pending,
              };
            });
            setData(dataSource);

            setIstablevisible(true);
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
                formdata.IndentStatus === "Created"
                  ? ""
                  : formdata.IndentStatus,
              IndentId: formdata.IndentId,
              IndentTemplateId: formdata.IndentTemplateId,
              IssueId:
                apiData.newIndentIssueModel == null
                  ? undefined
                  : apiData.newIndentIssueModel[0].IssueId,
              IndentReceiptId:
                apiData.newIndentReceiptModel != null
                  ? apiData.newIndentReceiptModel.IndentReceiptId
                  : 0,
            });
            const batch = apiData.Batch.map((Item, Index) => ({
              ...Item,
              key: Index + 1,
            }));
            setDataModel(batch);
          } else {
            if (apiData.IndentIssueModel.IndentId == null) {
              const dataSource = apiData.newIndentIssueModel.map((item) => {
                let issueqty = 0,
                  remarks = "",
                  pending = item.PendingQty,
                  receiptlineid = 0;
                let avlqty = item.AvlIssueQuantity;

                apiData.newIndentIssueModel.forEach((items) => {
                  if (items.ProductId === item.ProductId) {
                    issueqty = items.IssueQty;
                    avlqty = item.StockBalanceQty;
                    remarks = items.Remarks;
                  }
                });

                apiData.IndentReceiptList.forEach((list) => {
                  if (list.ProductId === item.ProductId) {
                    receiptlineid = list.IndentReceiptLineId;
                  }
                });

                return {
                  key: item.ProductId,
                  ProductName: item.ProductName,
                  ProductId: item.ProductId,
                  uom: item.Uom,
                  UomId: item.UomId,
                  RequestQty: item.RequestQty,
                  IssueQty: issueqty,
                  AvlIssueQuantity: avlqty,
                  AvlReqQuantity: item.AvlReqQuantity,
                  remarks: remarks,
                  IndentReceiptLineId: receiptlineid,
                  PendingQty: pending,
                };
              });
              setData(dataSource);

              setIstablevisible(true);
              const formdata = apiData.newIndentModel;
              const formdata1 = apiData.IndentIssueModel;
              form1.setFieldsValue({
                RequestingStoreId: formdata1.RequestingStoreId,
                IndentNumber: formdata?.IndentNumber,
                //IndentDate: DateBindtoDatepicker(formdata.IndentDate),
                IssueingStoreId: formdata1.IssueingStoreId,
                IndentType: formdata?.IndentType,
                IndentCategory: formdata?.IndentCategory,
                Remarks: formdata?.Remarks,
                // IndentStatus:
                //   formdata.IndentStatus === "Created"
                //     ? ""
                //     : formdata.IndentStatus,
                IndentId: formdata?.IndentId,
                IndentTemplateId: formdata?.IndentTemplateId,
                IssueId:
                  apiData.newIndentIssueModel == null
                    ? undefined
                    : apiData.newIndentIssueModel[0].IssueId,
                IndentReceiptId:
                  apiData.newIndentReceiptModel != null
                    ? apiData.newIndentReceiptModel.IndentReceiptId
                    : 0,
              });
              const batch = apiData.Batch.map((Item, Index) => ({
                ...Item,
                key: Index + 1,
              }));
              setDataModel(batch);
            }
          }
        });
    }
  }, []);

  const handleToIndent = () => {
    const url = "/ItemReceipt";
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

  const onFinishmodal = async (value) => {
    debugger;
    await form2.validateFields();
    const values = form2.getFieldsValue();
    const valuesArray = Object.values(values);
    const qty = valuesArray.reduce(
      (total, item) => total + (item.IssueQty || 0),
      0
    );
    if (parseInt(qty) == productDetails.IssueQty) {
      const updatedbatch = dataModel.map((item) => {
        const key = item.key;
        if (values[key] != undefined) {
          if (
            values[key].BatchNo ||
            values[key].IssueQty ||
            values[key].EXPDate
          ) {
            return {
              ...item,
              IssueQty: parseInt(values[key].IssueQty),
              EXPDate: values[key].EXPDate,
            };
          }
          return item;
        }
        return item;
      });
      setDataModel(updatedbatch);
      setIsModalOpen(false);
    } else {
      message.warning("Total Quantity should be equal to Issued Quantity");
    }
  };

  //   const columns = [
  //     {
  //       title: "Product",
  //       width: 350,
  //       dataIndex: "ProductName",
  //       key: "ProductName",
  //       render: (_, record) => (
  //         <>
  //           <Form.Item
  //             name={[record.key, "ProductName"]}
  //             initialValue={record.ProductName}
  //           >
  //             <Input style={{ width: "100%" }} disabled></Input>
  //           </Form.Item>
  //           <Form.Item
  //             name={[record.key, "IndentReceiptLineId"]}
  //             initialValue={record.IndentReceiptLineId}
  //             hidden
  //           >
  //             <Input></Input>
  //           </Form.Item>
  //           <Form.Item
  //             name={[record.key, "IndentIssueLineId"]}
  //             initialValue={record.IndentIssueLineId}
  //             hidden
  //           >
  //             <Input></Input>
  //           </Form.Item>
  //           <Form.Item
  //             name={[record.key, "ProductId"]}
  //             initialValue={record.ProductId}
  //             hidden
  //           >
  //             <Input></Input>
  //           </Form.Item>
  //         </>
  //       ),
  //     },
  //     {
  //       title: "UOM",
  //       dataIndex: "UomId",
  //       key: "UomId",
  //       width: 150,
  //       render: (text, record) => (
  //         <Form.Item
  //           name={[record.key, "UomId"]}
  //           style={{ width: "100%" }}
  //           initialValue={record.UomId}
  //         >
  //           <Select disabled defaultValue={record.UomId}>
  //             {DropDown.UOM.map((option) => (
  //               <Select.Option key={option.UomId} value={option.UomId}>
  //                 {option.FullName}
  //               </Select.Option>
  //             ))}
  //           </Select>
  //         </Form.Item>
  //       ),
  //     },
  //     {
  //       title: "Requested Qty",
  //       dataIndex: "RequestQty",
  //       key: "RequestQty",
  //       width: 150,
  //       render: (text, record) => (
  //         <Form.Item
  //           name={[record.key, "RequestQty"]}
  //           initialValue={record.RequestQty}
  //         >
  //           <InputNumber min={0} disabled style={{ width: "100%" }} />
  //         </Form.Item>
  //       ),
  //     },
  //     {
  //       title: "IssueQty",
  //       dataIndex: "IssueQty",
  //       key: "IssueQty",
  //       width: 150,
  //       render: (text, record) => (
  //         <Form.Item
  //           name={[record.key, "IssueQty"]}
  //           initialValue={indentIssueDetails !=null && indentIssueDetails.IndentId>0 ? record.IssueQty :0}
  //         >
  //           <InputNumber min={0} style={{ width: "100%" }} disabled />
  //         </Form.Item>
  //       ),
  //     },
  //     {
  //       title: "Avg qty at Issue",
  //       dataIndex: "AvlIssueQuantity",
  //       key: "AvlIssueQuantity",
  //       width: 150,
  //       render: (text, record) => (
  //         <Form.Item
  //           name={[record.key, "AvlIssueQuantity"]}
  //           initialValue={indentIssueDetails !=null && indentIssueDetails.IndentId>0 ? record.StockBalanceQty :0}
  //         >
  //           <InputNumber min={0} disabled style={{ width: "100%" }} />
  //         </Form.Item>
  //       ),
  //     },
  //     {
  //       title: "Avg qty at Req",
  //       dataIndex: "AvlReqQuantity",
  //       key: "AvlReqQuantity",
  //       width: 150,
  //       render: (text, record) => (
  //         <Form.Item
  //           name={[record.key, "AvlReqQuantity"]}
  //           initialValue={
  //             record.AvlReqQuantity == null ? 0 : record.AvlReqQuantity
  //           }
  //         >
  //           <InputNumber min={0} disabled style={{ width: "100%" }} />
  //         </Form.Item>
  //       ),
  //     },
  //     {
  //       title: "Remarks",
  //       dataIndex: "remarks",
  //       key: "remarks",
  //       width: 150,
  //       render: (text, record) => (
  //         <Form.Item name={[record.key, "remarks"]}>
  //           <Input style={{ width: "100%" }} disabled allowClear></Input>
  //         </Form.Item>
  //       ),
  //     },
  //     {
  //       title: "Batch Details",
  //       dataIndex: "BatchDetails",
  //       key: "BatchDetails",
  //       render: (text, record) => (
  //         <Button type="link" onClick={() => OpenModel(record)}>
  //           Batch
  //         </Button>
  //       ),
  //     },
  //     {
  //       title: "Pending Qty",
  //       dataIndex: "PendingQty",
  //       key: "PendingQty",
  //       width: 150,
  //       render: (text, record) => (
  //         <Form.Item
  //           name={[record.key, "PendingQty"]}
  //           initialValue={record.PendingQty == null ? 0 : record.PendingQty}
  //         >
  //           <Input style={{ width: "100%" }} disabled></Input>
  //         </Form.Item>
  //       ),
  //     },
  //   ];
  const columns = [
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "ProductName",
      render: (text, record) => (
        <div>
          <input type="text" value={text} disabled />
          <input type="hidden" value={record.ProductId} />
          <input type="hidden" value={record.IndentReceiptLineId} />
        </div>
      ),
    },
    {
      title: "UOM",
      dataIndex: "uom",
      key: "uom",
      render: (text, record) => (
        <select disabled>
          <option value={record.UomId} selected>
            {text}
          </option>
        </select>
      ),
    },
    {
      title: "Requested Qty",
      dataIndex: "RequestQty",
      key: "RequestQty",
      render: (text) => <input type="text" value={text} disabled />,
    },
    {
      title: "Issue Qty",
      dataIndex: "IssueQty",
      key: "IssueQty",
      render: (text) => <input type="text" value={text || ""} disabled />,
    },
    {
      title: "Avl Qty at Issue",
      dataIndex: "AvlIssueQuantity",
      key: "AvlIssueQuantity",
      render: (text) => <input type="text" value={text} disabled />,
    },
    {
      title: "Avl Qty at Req",
      dataIndex: "AvlReqQuantity",
      key: "AvlReqQuantity",
      render: (text) => <input type="text" value={text} disabled />,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (text) => <input type="text" value={text} disabled />,
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
      render: (text) => <input type="text" value={text} disabled />,
    },
  ];

  const OpenModel = async (record) => {
    debugger;
    await form1.validateFields();
    const va = form1.getFieldsValue();
    // record.IssueQty = va[record.key].IssueQty;
    setProductDetails(record);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    const url = "/ItemReceipt";
    navigate(url);
  };

  const BatchSelect = (record) => {
    debugger;
    const IsExist = dataModel.filter((item) => item.BatchNo == record);
    const temp = batchDetails.filter((item) => item.BatchNo === record);
    const newdata = temp.map((item) => {
      return {
        ...item,
        BalanceQty: item.BalanceQty,
        Uom: item.Uom,
        EXPDate: item.EXPDate,
        ReceiptRate: 0,
        amount: 0,
      };
    });
    setDataModel(newdata);
    if (IsExist.length > 0) {
      message.warning("Same Batch No should not be selected.");
    }
  };

  const validateEqualValue = (record, value) => {
    if (parseInt(value) == productDetails.IssueQty) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Must equal to Issue Qty!"));
  };

  const validateExpiry = (record, value) => {
    const isExpired = dayjs(record.EXPDate).isBefore(dayjs(), "day");
    if (!isExpired) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Batch is Expired!"));
  };

  const Batchmodal = [
    {
      title: "Batch Number",
      dataIndex: "BatchNo",
      width: 120,
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
              allowClear
              onChange={(record) => BatchSelect(record)}
              style={{ width: 100 }}
              defaultValue={record.BatchNo}
              disabled={true}
            >
              {batchDetails.map((option) => (
                <Select.Option key={option.BatchNo} value={option.BatchNo}>
                  {option.BatchNo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <FormItem name={[record.key, "StockId"]} hidden>
            <Input></Input>
          </FormItem>
          <FormItem name={[record.key, "IssueBatchId"]} hidden>
            <Input></Input>
          </FormItem>
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
                message: "input!",
              },
              {
                validator: (_, value) => validateEqualValue(record, value),
              },
            ]}
          >
            <Input disabled={true} allowClear style={{ width: 100 }} />
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
        <Form.Item name={[record.key, "Uom"]}>
          {/* <Select style={{ width: '100%' }} disabled>
                        {DropDown.UOM.map((option) => (
                            <Select.Option key={option.UomId} value={option.UomId}>{option.FullName}</Select.Option>
                        ))}
                    </Select> */}
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
            record.EXPDate == "" ? undefined : dayjs(record.EXPDate)
          }
          rules={[
            {
              validator: (_, value) => validateExpiry(record, value),
            },
          ]}
        >
          <DatePicker format="MMMM YYYY" disabled style={{ width: "100%" }} />
          {/* <InputNumber min={0} style={{ width: '100%' }} disabled value={DateBindtoDatepicker(batchDetails.EXPDate)} /> */}
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
          initialValue={record.IssueRate}
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
        <Form.Item
          name={[record.key, "amount"]}
          initialValue={record.IssueRate * record.IssueQty}
        >
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
  ];

  const onCancelmodal = () => {
    // setDataModel([]);
    // form2.resetFields();
    setIsModalOpen(false);
    setBatchCount(1);
  };

  const handleOnFinish = async (values) => {
    debugger;

    const product = data;

    // const products = [];
    // for (let i = 0; i <= productCount; i++) {
    //   if (values[i] !== undefined) {
    //     const product = {
    //       ProductId: values[i].ProductId,
    //       UomId: values[i].UomId,
    //       RequestQty: values[i].RequestQty,
    //       IssueQty: values[i].IssueQty,
    //       PendingQty: values[i].PendingQty,
    //       IndentIssueLineId: values[i].IndentIssueLineId,
    //       IndentReceiptLineId: values[i].IndentReceiptLineId
    //         ? values[i].IndentReceiptLineId
    //         : 0,
    //     };
    //     products.push(product);
    //   }
    // }
    if (dataModel.length > 0) {
      const Indent = {
        IssueDateString: values.IssueDate
          ? values.IssueDate.format("DD-MM-YYYY")
          : "",
        IndentId: values.IndentId,
        IssueId: values.IssueId,
        Remarks: values.Remarks ? values.Remarks : "",
        FacilityId: 1,
        RequestingStoreId: values.RequestingStoreId,
        IssueingStoreId: values.IssueingStoreId,
        ReceiptStatus: !indentStatus ? "Created" : values.ReceiptStatus,
        IndentReceiptId: values.IndentReceiptId ? values.IndentReceiptId : 0,
      };
      const formattedDataBatchModal = dataModel.map((item) => ({
        ...item,
        ExpDateString: dayjs(item.EXPDate).format("DD-MM-YYYY"),
      }));

      const postData = {
        newIndentModel: Indent,
        IndentDetails: data,
        Batch: formattedDataBatchModal,
      };
      try {
        if (issueId > 0) {
          const response = await customAxios.post(
            urlAddNewItemReceipt,
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
      // setIsSearchLoading(false);
    } else {
      message.warning("Please add Batch Details");
    }
  };

  const SubmitChanged = (event) => {
    setIndentStatus(event.target.checked);
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
              Item Receipt
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
            IssueDate: dayjs(),
            SubmitCheck: false,
          }}
        >
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ padding: "1rem 0.5rem", marginBottom: "0" }}
            align="Bottom"
          >
            <Col className="gutter-row" span={6}>
              <Form.Item
                label="Indent Number"
                name="IndentNumber"
                rules={[
                  {
                    required: indentid !== null,
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
              <Form.Item name="IndentReceiptId" hidden>
                <Input></Input>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item
                label="Indent Type"
                name="IndentType"
                rules={[
                  {
                    required: indentid !== null,
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
                    <Select.Option key={option.StoreId} value={option.StoreId}>
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
                    <Select.Option key={option.StoreId} value={option.StoreId}>
                      {option.LongName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item label="Receipt Date" name="IssueDate">
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  disabled
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item
                label="Receipt Status"
                name="ReceiptStatus"
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
              <Form.Item label="Remarks" name="Remarks">
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
              <Table columns={columns} dataSource={data} scroll={{ x: 0 }} />
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
                <Tag>Product: {productDetails.ProductName}</Tag>
                <Tag>Issued Quantity: {productDetails.IssueQty}</Tag>
                <Table
                  columns={Batchmodal}
                  dataSource={
                    productDetails?.ProductId
                      ? dataModel.filter(
                          (item) => item.ProductId === productDetails.ProductId
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
  );
};

export default UpdateItemReceipt;
