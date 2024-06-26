import {
  urlCreatePurchaseOrder,
  urlAutocompleteProduct,
  urlGetProductDetailsById,
  urlAddNewPurchaseOrder,
  urlEditPurchaseOrder,
  urlUpdatePurchaseOrder,
} from "../../../endpoints";
import Select from "antd/es/select";
import {
  ConfigProvider,
  Typography,
  Checkbox,
  Tag,
  Modal,
  Popconfirm,
  Spin,
  Col,
  Divider,
  Row,
  AutoComplete,
  message,
  Button
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
import dayjs from "dayjs";
import { Table, InputNumber } from "antd";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import customAxios from "../../components/customAxios/customAxios";

const CreatePurchaseOrder = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: []
  });
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
  const [buttonTitle, setButtonTitle] = useState('Save');
  const [productOptions, setProductOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [deliveryRecord, setDeliveryRecord] = useState([]);

  const [poDate, setPoDate] = useState(null);

  const initialDataSource =
    PoHeaderId === 0
      ? [
        {
          key: 1,
          ProductName: '',
          // ProductId: 0,
          PoLineId: 0,
          UomId: "",
          PoQuantity: "",
          BonusQuantity: 0,
          PoRate: "",
          DiscountRate: 0,
          DiscountAmount: 0,
          MrpExpected: 0,
          TaxType1: '',
          TaxAmount1: 0,
          TaxType2: '',
          TaxAmount2: 0,
          LineAmount: 0,
          LineAmount: 0,
          AvailableQuantity: 0,
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
          UomId: '',
          PoDeliveryId: 0,
          DeliveryQuantity: "",
          DeliveryDate: "",
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
  }, []);

  useEffect(() => {
    debugger;
    const fetchData = async () => {
      if (PoHeaderId > 0) {
        setButtonTitle('Update')
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
              })
            );
            setData(products);
            const formdata = editeddata.newPurchaseOrderModel;

            form1.setFieldsValue({
              SupplierId: formdata.SupplierId,
              StoreId: formdata.ProcurementStoreId,
              DocumentType: formdata.DocumentType,
              TotalAmount: formdata.PoTotalAmount,
              totalpoAmount: formdata.PoTotalAmount,
            });
            setCounter(products.length + 1);
            const delivery = editeddata.DeliveryDetails.map(
              (item, index) => ({
                ...item,
                key: index + 1,
              })
            );
            setCounterDelivery(editeddata.DeliveryDetails.length + 1)
            const updatedSchedule = delivery.map(item => {
              const key = item.key;
              const prod = editeddata.PurchaseOrderDetails.filter(item1 => item1.PoLineId === item.PoLineId)
              if (delivery[key - 1] != undefined) {
                if (delivery[key - 1].DeliveryQuantity || delivery[key - 1].DeliveryDate || delivery[key - 1].DeliveryLocation) {
                  return {
                    ...item,
                    ProductId: prod[0].ProductId,
                    DeliveryQuantity: delivery[key - 1].DeliveryQuantity,
                    DeliveryDate: DateBindtoDatepicker(delivery[key - 1].DeliveryDate),
                    DeliveryLocation: delivery[key - 1].DeliveryLocation,
                    UomId: prod[0].UomId,
                    Uom: prod[0].Uom
                  };
                }
                return item;
              }
              return item;
            });
            setSchedule(updatedSchedule);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, []);

  const handleCancel = () => {
    const url = '/purchaseOrder';
    navigate(url);
  };

  const DateBindtoDatepicker = (value) => {
    const isoDateString = value;
    const dateValue = new Date(isoDateString);
    const formattedDate = dayjs(dateValue).format('DD-MM-YYYY');
    return dayjs(formattedDate, 'DD-MM-YYYY');
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleOnFinish = async (values) => {
    debugger;
    const products = [];
    for (let i = 1; i <= data.length; i++) {
      if (values[i] !== undefined) {
        const product = {
          ProductId: values[i].ProductId,
          UomId: values[i].UomId,
          PoQuantity: values[i].PoQuantity,
          BonusQuantity: values[i].BonusQuantity,
          PoRate: values[i].PoRate,
          DiscountRate: values[i].DiscountRate,
          DiscountAmount: values[i].DiscountAmount,
          MrpExpected: values[i].MrpExpected,
          TaxType1: values[i].TaxType1 === undefined ? 0 : values[i].TaxType1,
          TaxAmount1: values[i].TaxAmount1 === undefined ? 0 : values[i].TaxAmount1,
          TaxType2: values[i].TaxType2 === undefined ? 0 : values[i].TaxType2,
          TaxAmount2: values[i].TaxAmount2 === undefined ? 0 : values[i].TaxAmount2,
          LineAmount: values[i].LineAmount,
          PoTotalAmount: values[i].LineAmount,
          AvailableQuantity: values[i].AvailableQuantity === undefined ? 0 : values[i].AvailableQuantity,
          PoLineId: values[i].PoLineId === undefined ? 0 : values[i].PoLineId
        }
        products.push(product);
      }
    }

    const purchaseOrder = {
      PoHeaderId: values.PoHeaderId,
      SupplierId: values.SupplierId === undefined ? '' : values.SupplierId,
      ProcurementStoreId: values.StoreId === undefined ? '' : values.StoreId,
      DocumentType: values.DocumentType === undefined ? '' : values.DocumentType,
      PoDate: values.PODate,
      PoStatus: values.POStatus === undefined ? 'Created' : values.POStatus,
      Remarks: values.Remarks === undefined ? null : values.Remarks,
      PoPurchaseValue: values.TotalAmount === undefined ? 0 : values.TotalAmount,
      PoTotalAmount: values.totalpoAmount === undefined ? 0 : values.totalpoAmount,
      PoTaxAmount: values.gstTax === undefined ? 0 : values.gstTax,
    };

    const activeData = schedule.filter((item) => item.ActiveFlag === true && item.ProductId);
    const postData = {
      newPurchaseOrderModel: purchaseOrder,
      PurchaseOrderDetails: products,
      Delivery: activeData.length > 0 && activeData[0].ProductId === '' ? [] : activeData,
    };
    if (PoHeaderId == 0) {
      const response = await customAxios.post(
        urlAddNewPurchaseOrder,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200) {
        message.success("Purchase Order Created Successfully");
        handleCancel();
      } else {
        message.error("Something went wrong");
      }
    } else {
      const response = await customAxios.post(
        urlUpdatePurchaseOrder,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200) {
        message.success("Purchase Order Updated Successfully");
        handleCancel();
      } else {
        message.error("Something went wrong");
      }
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
        ProductName: '',
        // ProductId: 0,
        PoLineId: 0,
        UomId: "",
        PoQuantity: "",
        BonusQuantity: 0,
        PoRate: "",
        DiscountRate: 0,
        DiscountAmount: 0,
        MrpExpected: 0,
        TaxType1: '',
        TaxAmount1: 0,
        TaxType2: '',
        TaxAmount2: 0,
        LineAmount: 0,
        LineAmount: 0,
        AvailableQuantity: 0,
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
        UomId: '',
        PoDeliveryId: 0,
        DeliveryQuantity: "",
        DeliveryDate: "",
        DeliveryLocation: "",
        ActiveFlag: true,
      },
    ]);
    setCounterDelivery(counterDelivery + 1);
  };

  const handleSearch = async (searchText) => {
    debugger
    if (searchText) {
      const response = await customAxios.get(
        `${urlAutocompleteProduct}?Product=${searchText}`
      );
      const apiData = response.data.data;
      const newOptions = apiData.map((item) => ({
        value: item.LongName,
        key: item.ProductDefinitionId,
        UomId: item.UOMPrimaryUOM
      }));
      setProductOptions(newOptions);
    }
  };

  function calculateTotalAmount(data) {
    debugger
    let LineAmount = 0;
    data.forEach((item) => {
      if (
        item.ActiveFlag &&
        !isNaN(item.LineAmount) &&
        item.LineAmount !== null &&
        item.LineAmount !== undefined
      ) {
        LineAmount += parseFloat(item.LineAmount);
      }
    });
    return LineAmount;
  }

  const handleSelect = (value, option, column, record) => {
    debugger;
    form1.setFieldsValue({ [record.key]: { ProductId: option.key } })
    const newData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = { ...item, [column]: option.key, LongName: option.value, UomId: option.UomId, ProductId: option.key };
        return updatedItem;
      }
      return item;
    });
    setData(newData);
  };

  const handleInputChange = (e, column, index, record) => {
    debugger;
    let newData;
    if (["PoQuantity", "PoRate", "DiscountRate"].includes(column)) {
      newData = data.map((item) => {
        if (item.key === record.key) {
          const updatedItem = { ...item, [column]: e.target.value };

          const poQuantity =
            column === "PoQuantity" ? e.target.value : item.PoQuantity;
          const poRate = column === "PoRate" ? e.target.value : item.PoRate;
          const discountRate =
            column === "DiscountRate" ? e.target.value : item.DiscountRate;

          let discountAmount = 0;
          let amount = 0;
          if (poRate != null && poQuantity != null) {
            const discount = discountRate != null ? discountRate : 0;
            discountAmount = (poRate * poQuantity * discount) / 100;
            amount = poRate * poQuantity - discountAmount;
          }

          updatedItem.DiscountAmount = discountAmount;
          updatedItem.LineAmount = amount;
          updatedItem.LineAmount = amount;

          form1.setFieldsValue({ [record.key]: { DiscountAmount: discountAmount } });
          form1.setFieldsValue({ [record.key]: { LineAmount: amount } });
          form1.setFieldsValue({ [record.key]: { LineAmount: amount } });

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

    if (["PoQuantity", "PoRate", "DiscountRate"].includes(column)) {
      const totalAmount = calculateTotalAmount(newData);
      form1.setFieldsValue({
        TotalAmount: totalAmount,
        totalpoAmount: totalAmount,
      });
    }
    setData(newData);
  };

  const handleUomChange = (option, column, index, record) => {
    debugger;

    const newData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = { ...item, [column]: option.value, Uom: option.children };
        return updatedItem;
      }
      return item;
    });

    setData(newData);
  };

  const handleDelete = (record) => {
    debugger;
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
    setSchedule(newSchedule)
    const totalAmount = calculateTotalAmount(newData);

    form1.setFieldsValue({
      TotalAmount: totalAmount,
      totalpoAmount: totalAmount,
    });
  };

  const onFinishModel = async (values) => {

  };

  const handleOpenModal = async (record) => {
    debugger;
    await form1.validateFields();
    setDeliveryRecord(record);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    debugger
    const newData = schedule.map((item) => {
      if (item.ProductId === '') {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setSchedule(newData)
    setModalVisible(false);
    form2.resetFields();
  };

  const handleSaveModal = async () => {
    debugger;
    await form2.validateFields();
    const values = form2.getFieldsValue();
    const valuesArray = Object.values(values);
    const qty = valuesArray.reduce((total, item) => total + (item.DeliveryQuantity || 0), 0);
    if (qty <= deliveryRecord.PoQuantity) {
      const updatedSchedule = schedule.map(item => {
        const key = item.key;
        if (values[key] != undefined) {
          if (values[key].DeliveryQuantity || values[key].DeliveryDate || values[key].DeliveryLocation) {
            return {
              ...item,
              ProductId: deliveryRecord.ProductId,
              DeliveryQuantity: values[key].DeliveryQuantity,
              DeliveryDate: values[key].DeliveryDate,
              DeliveryLocation: values[key].DeliveryLocation,
              UomId: deliveryRecord.UomId
            };
          }
          return item;
        }
        return item;
      });
      setSchedule(updatedSchedule);
      setModalVisible(false);
    } else {
      message.warning('Quantity must not be Greater than PO Quantity')
    }
  };

  const ModelDelete = (record) => {
    debugger
    const newData = schedule.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setSchedule(newData);
  }

  const columnsModel = [
    {
      title: "Quantity",
      dataIndex: "DeliveryQuantity",
      width: 100,
      key: "DeliveryQuantity",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, 'DeliveryQuantity']}
          rules={[{ required: true, message: "Required" }]}
          style={{ width: "100%" }}
          initialValue={record.DeliveryQuantity}
        >
          <InputNumber
            min={0}
            defaultValue={text}
          />
        </Form.Item>
      ),
    },
    {
      title: "UOM",
      dataIndex: "UomId",
      key: "UomId",
      width: 150,
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, 'UomId']}
        // rules={[{ required: true, message: "Required" }]}
        >
          {deliveryRecord.Uom === undefined ? record.Uom : deliveryRecord.Uom}
        </Form.Item>
      ),
    },
    {
      title: "Date of Delivery",
      dataIndex: "DeliveryDate",
      key: "DeliveryDate",
      render: (text, record, index) => (
        <Form.Item
          style={{ width: 200 }}
          name={[record.key, 'DeliveryDate']}
          initialValue={record.DeliveryDate}
        >
          <DatePicker value={text == '' ? dayjs() : text}
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
          name={[record.key, 'DeliveryLocation']}
          initialValue={record.DeliveryLocation}
          style={{ width: 200 }}
        >
          <Input
            style={{ width: "150%" }}
            allowClear
          />
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
            name={[record.key, 'ProductName']}
            rules={[{ required: true, message: "Required" }]}
            initialValue={record.LongName == undefined ? record.ProductName : record.LongName}
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
          <Form.Item name={[record.key, 'ProductId']} hidden initialValue={record.ProductId}><Input defaultValue={record.ProductId}></Input></Form.Item>
          <Form.Item name={[record.key, 'PoLineId']} hidden initialValue={record.PoLineId}><Input></Input></Form.Item>
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
          name={[record.key, 'UomId']}
          rules={[{ required: true, message: "Required" }]}
          initialValue={record.UomId}
        >
          <Select defaultValue={text}
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
      )
    },

    {
      title: "PO Qty",
      dataIndex: "PoQuantity",
      width: 100,
      key: "PoQuantity",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, 'PoQuantity']}
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
      )
    },
    {
      title: "BonusQty",
      dataIndex: "BonusQuantity",
      width: 100,
      key: "BonusQuantity",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, 'BonusQuantity']}
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
      )
    },
    {
      title: "PoRate",
      dataIndex: "PoRate",
      width: 100,
      key: "PoRate",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, 'PoRate']}
          // name={["PoRate", record.key]}
          rules={[
            {
              required: true,
              message: "Required",
            },

          ]}
          style={{ width: "100%" }}
          initialValue={record.PoRate}
        >
          <InputNumber
            min={0}
            defaultValue={text}
            onChange={(value) => {
              handleInputChange({ target: { value } }, "PoRate", index, record);
            }}
          />
        </Form.Item>
      )
    },
    {
      title: "Discount %",
      dataIndex: "DiscountRate",
      width: 100,
      key: "DiscountRate",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, 'DiscountRate']}
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
      )
    },
    {
      title: "DiscountAmount",
      dataIndex: "DiscountAmount",
      width: 100,
      key: "DiscountAmount",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, 'DiscountAmount']}
          // name={[`DiscountAmount`, record.key]}
          style={{ width: "100%" }}
          initialValue={record.DiscountAmount}
        >
          <InputNumber disabled min={0} defaultValue={text} />
        </Form.Item>
      )
    },


    {
      title: "ExpectedMRP",
      dataIndex: "MrpExpected",
      width: 100,
      key: "MrpExpected",
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, 'MrpExpected']}
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
      )
    },
    {
      title: "CGST",
      dataIndex: "TaxType1",
      key: "TaxType1",
      width: 100,
      render: (text, record, index) => (
        <Form.Item
          name={[record.key, 'TaxType1']}
        // name={["TaxType1", record.key]} 
        >
          <Select
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
              <Option key={option.LookupID} value={option.LookupID}>
                <Option key={option.LookupID} value={option.LookupID}>
                  {option.LookupDescription}
                </Option>
              </Option>
            ))}
          </Select>
        </Form.Item>
      )
    },
    {
      title: "CGSTAmount",
      dataIndex: "TaxAmount1",
      width: 100,
      key: "TaxAmount1",
      render: (text, record, index) => (
        <Form.Item name={[record.key, 'TaxAmount1']} style={{ width: "100%" }}>
          <InputNumber min={0} disabled defaultValue={text} />
        </Form.Item>
      )
    },
    {
      title: "SGST",
      dataIndex: "TaxType2",
      key: "TaxType2",
      width: 100,
      render: (text, record, index) => (
        <Form.Item
          // name={["TaxType2", record.key]} 

          name={[record.key, 'TaxType2']}
        >
          <Select
            defaultValue={text}
          // onChange={(value) =>
          //   handleInputChange(
          //     { target: { value } },
          //     "TaxType2",
          //     index,
          //     record
          //   )
          // }
          >
            {DropDown.TaxType.map((option) => (
              <Option key={option.LookupID} value={option.LookupID}>
                <Option key={option.LookupID} value={option.LookupID}>
                  {option.LookupDescription}
                </Option>
              </Option>
            ))}
          </Select>
        </Form.Item>
      )
    },
    {
      title: "SGSTAmount",
      dataIndex: "TaxAmount2",
      width: 100,
      key: "TaxAmount2",
      render: (text, record, index) => (
        <Form.Item name={[record.key, 'TaxAmount2']} style={{ width: "100%" }}>
          <InputNumber disabled min={0} defaultValue={text} />
        </Form.Item>
      )
    },
    {
      title: "Amount",
      dataIndex: "LineAmount",
      width: 100,
      key: "LineAmount",
      render: (text, record, index) => (
        <Form.Item
          // name={[`LineAmount`, record.key]}
          name={[record.key, 'LineAmount']}
          style={{ width: "100%" }}
          initialValue={record.LineAmount}
        >
          <InputNumber disabled min={0} defaultValue={text}
          />
        </Form.Item>
      )
    },
    {
      title: "TotalAmount",
      dataIndex: "LineAmount",
      width: 100,
      key: "LineAmount",
      render: (text, record, index) => (
        <Form.Item
          // name={[`totalAmount`, record.key]}
          name={[record.key, 'LineAmount']}
          style={{ width: "100%" }}
          initialValue={record.LineAmount}
        >
          <InputNumber disabled min={0} defaultValue={text} />
        </Form.Item>
      )
    },
    {
      title: "AvlQty",
      dataIndex: "AvailableQuantity",
      width: 100,
      key: "AvailableQuantity",
      render: (text, record, index) => (
        <Form.Item
          // name={["AvailableQuantity", record.key]}
          name={[record.key, 'AvailableQuantity']}
          style={{ width: "100%" }}
          initialValue={record.AvailableQuantity}
        >
          <InputNumber disabled min={0} defaultValue={text} />
        </Form.Item>
      )
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
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => (
        <Popconfirm
          title="Are you sure you want to delete this record?"
          onConfirm={() => handleDelete(record)}
        >
          <Button
            size="small"
            danger
            icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
          ></Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
              Create Purchase Order
            </Title>
          </Col>
          <Col offset={6} span={2}>
            <Button icon={<LeftOutlined />} style={{ marginBottom: 0 }} onClick={handleToPurchaseOrder}>
              Back
            </Button>
          </Col>
        </Row>
        <Form
          layout="vertical"
          onFinish={handleOnFinish}
          onFinishFailed={onFinishFailed}
          variant="outlined"
          size="default"
          initialValues={{
            PODate: dayjs(),
          }}
          form={form1}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Supplier" name="SupplierId"
                  rules={[
                    {
                      required: true,
                      message: 'Please input!'
                    }
                  ]}
                >
                  <Select allowClear placeholder='Select Value'>
                    {DropDown.SupplierList.map((option) => (
                      <Select.Option key={option.VendorId} value={option.VendorId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name='PoHeaderId' hidden initialValue={PoHeaderId}><Input></Input></Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Procurement Store" name="StoreId"
                  rules={[
                    {
                      required: true,
                      message: 'Please input!'
                    }
                  ]}
                >
                  <Select allowClear placeholder='Select Value'>
                    {/* <Option value="">Select Value</Option> */}
                    {DropDown.StoreDetails.map((option) => (
                      <Select.Option key={option.StoreId} value={option.StoreId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Document Type" name="DocumentType"
                  rules={[
                    {
                      required: true,
                      message: 'Please input!'
                    }
                  ]}
                >
                  <Select allowClear placeholder='Select Value'>
                    {DropDown.DocumentType.map((option) => (
                      <Select.Option key={option.LookupID} value={option.LookupID}>
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item label="Remarks" name="Remarks">
                <TextArea autoSize allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '0rem 2rem', marginTop: '0' }}>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="PO Date" name="PODate">
                  <DatePicker style={{ width: '100%' }} disabled format='DD-MM-YYYY' />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="PO Status" name="POStatus">
                  <Select allowClear placeholder='Select Value'>
                    <Option value="Draft">Draft</Option>
                    <Option value="Pending">Finalize</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col>
              <Form.Item name="SubmitCheck" style={{ marginTop: '30px' }} valuePropName='cheched'>
                <Checkbox>Submit</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" style={{ padding: '0rem 1rem' }}>
            <Col style={{ marginRight: '10px' }}>
              <Form.Item>
                <Button
                  type="primary"
                  //loading={isSearchLoading}
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
        </Form>
        <Divider style={{ marginTop: "0" }}></Divider>
        <Button
          type="primary"
          onClick={handleAddRow}
          style={{ marginBottom: 16 }}
        >
          Add a row
        </Button>
        <Table
          columns={columns}
          size="small"
          dataSource={data.filter((item) => item.ActiveFlag !== false)}
          locale={{ emptyText: "nodata " }}
          scroll={{
            x: 2000,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "16px",
            float: "right",
          }}
        >
          {/* <Form.Item
            label="Amount"
            name="TotalAmount"
            style={{ marginRight: "16px", width: 100 }}
          >
          </Form.Item> */}
          {/* <Divider style={{ marginTop: "0" }}></Divider>
          <Button
            type="primary"
            onClick={handleAddRow}
            style={{ marginBottom: 16 }}
          >
            Add a row
          </Button>
          <Table
            columns={columns}
            size="small"
            dataSource={data.filter((item) => item.ActiveFlag !== false)}
            locale={{ emptyText: "nodata " }}
            scroll={{
              x: 2000,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "16px",
              float: "right",
            }}
          >*/}
            <Form.Item
              label="Amount"
              name="TotalAmount"
              style={{ marginRight: "16px", width: 100 }}
            >
              <InputNumber min={0} disabled />
            </Form.Item> 
          <Form.Item label="GST Tax" name='gstTax' style={{ marginRight: '16px', width: 100 }}>
            <InputNumber min={0} disabled />
          </Form.Item>
          <Form.Item label="Total PO Amount" name='totalpoAmount' style={{ width: 150 }}>
            <InputNumber min={0} disabled />
          </Form.Item>
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
          // initialValues={{
          //   [counterDelivery - 1]: { DeliveryDate: dayjs() }
          // }}
          >
            <Col className="gutter-row" span={6}>
              <div>
                <span>
                  Product :{" "}
                  <b style={{ color: "#1677ff" }}>{deliveryRecord.LongName}</b>{" "}
                </span>
              </div>
            </Col>

            <Table
              columns={columnsModel}
              size="small"
              locale={{ emptyText: "Nodata " }}
              dataSource={
                deliveryRecord.ProductId
                  ? schedule.filter(item => item.ProductId === deliveryRecord.ProductId && item.ActiveFlag || item.ProductId === "" && item.ActiveFlag)
                  : initialDeliveryDataSource
              }
            />
          </Form>
        </Modal>
      </div>
      {/* </div> */}
    </Layout >
  );
}

export default CreatePurchaseOrder;
