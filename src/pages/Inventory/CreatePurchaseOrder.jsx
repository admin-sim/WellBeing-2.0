import customAxios from "../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
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
//import Typography from 'antd/es/typography';
import { useNavigate } from "react-router";
import { Table, InputNumber } from "antd";
import dayjs from "dayjs";
//import { Calculate } from '@mui/icons-material';
import { useLocation } from "react-router-dom";
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

  const [counter, setCounter] = useState(2); // initialize counter to 1
  const [counterDelivery, setCounterDelivery] = useState(2); // initialize counter to 1
  //const [savedData, setSavedData] = useState([]);
  const [productOptions, setProductOptions] = useState([]); // initialize product options to empty
  const [modalVisible, setModalVisible] = useState(false); // state for modal visibility

  const [deliveryRecord, setDeliveryRecord] = useState([]);

  const [poDate, setPoDate] = useState(null);

  const initialDataSource =
    PoHeaderId === 0
      ? [
          {
            key: 1,
            ProductId: "",
            UomId: "",
            PoQuantity: "",
            BonusQuantity: 0,
            PoRate: "",
            DiscountRate: 0,
            DiscountAmount: 0,
            MrpExpected: 0,
            TaxType1: 0,
            TaxAmount1: 0,
            TaxType2: 0,
            TaxAmount2: 0,
            LineAmount: 0,
            totalAmount: 0,
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
            UomId:"",
            PoDeliveryId: "",
            DeliveryQuantity: "",
            DelDate: "",
            DeliveryLocation: "",
            ActiveFlag: true,
          },
        ]
      : [];

  const [schedule, setSchedule] = useState(initialDeliveryDataSource);

  //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');

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
        try {
          const response = await customAxios.get(
            `${urlEditPurchaseOrder}?Id=${PoHeaderId}`
          );
          // Handle response data here
          if (response.status == 200 && response.data.data != null) {
            const editeddata = response.data.data;
            const products = editeddata.PurchaseOrderDetails.map(
              (item, index) => ({
                ...item,
                key: index + 1, // Increase the index by 1
              })
            );
            setData(products);
            const formdata = editeddata.newPurchaseOrderModel;

            form1.setFieldsValue({
              SupplierList: formdata.VendorId,
              StoreDetails: formdata.ProcurementStoreId,
              DocumentType: formdata.DocumentType,
              TotalAmount: formdata.PoTotalAmount,
              totalpoAmount: formdata.PoTotalAmount,
            });
            setCounter(products.length + 1);
          }
        } catch (error) {
          // Handle error if the request fails
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData(); // Call the async function immediately
  }, []); // Add PoHeaderId to the dependency array if it's needed for fetching data

  const handleCancel = () => {
    const url = '/purchaseOrder';
    navigate(url);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleOnFinish = async (values) => {
    debugger;
    console.log("values:", values);
    console.log("tabledata:", data);

    const purchaseOrder = {
      SupplierId: values.SupplierList === undefined ? "" : values.SupplierList,
      ProcurementStoreId:
        values.StoreDetails === undefined ? "" : values.StoreDetails,
      DocumentType:
        values.DocumentType === undefined ? "" : values.DocumentType,
      PurchaseDate: poDate ? poDate : dayjs().format("DD-MM-YYYY"),
      PoStatus: values.POStatus === undefined ? "Created" : values.POStatus,
      Remarks: values.Remarks === undefined ? null : values.Remarks,
      PoPurchaseValue:
        values.TotalAmount === undefined ? null : values.TotalAmount,
      PoTotalAmount:
        values.totalpoAmount === undefined ? null : values.totalpoAmount,
      PoTaxAmount: values.PoTaxAmount === undefined ? 0 : values.PoTaxAmount,
      PoHeaderId: PoHeaderId,
    };

    // data.forEach((item) => {
    //   for (let key in item) {
    //     if (key !== "LongName" && key !== "ShortName" && item[key] === "") {
    //       item[key] = 0;
    //     }
    //   }
    // });

    if (PoHeaderId == 0) {
      const activeData = data.filter((item) => item.ActiveFlag === true);

      const postData = {
        newPurchaseOrderModel: purchaseOrder,
        PurchaseOrderDetails: activeData,
        Delivery:[], //schedule === undefined ? [] : schedule,
      };

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
        const url = "/purchaseOrder";
        navigate(url);
      } else {
        message.error("Something went wrong");
      }
    } else {
      const postData = {
        newPurchaseOrderModel: purchaseOrder,
        PurchaseOrderDetails: data,
        DeliveryDetails: schedule === undefined ? [] : schedule,
        Delivery: schedule === undefined ? [] : schedule,
      };

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
        const url = "/purchaseOrder";
        navigate(url);
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
        key: counter, // use counter as key
        ProductId: "",
        UomId: "",
        PoQuantity: "",
        BonusQuantity: 0,
        PoRate: "",
        DiscountRate: 0,
        DiscountAmount: 0,
        MrpExpected: 0,
        TaxType1: 0,
        TaxAmount1: 0,
        TaxType2: 0,
        TaxAmount2: 0,
        LineAmount: 0,
        totalAmount: 0,
        AvailableQuantity: 0,
        deliverySchedule: "",
        ActiveFlag: true,
      },
    ]);
    setCounter(counter + 1); // increment counter
  };

  const handleAddDelivery = async () => {
    //setProductOptions([]);
    await form1.validateFields();
    setSchedule([
      ...schedule,
      {
        key: counterDelivery, // use counter as key
        ProductId: "",
        UomId:"",
        PoDeliveryId: "",
        DeliveryQuantity: "",
        DelDate: "",
        DeliveryLocation: "",
        ActiveFlag: true,
      },
    ]);
    setCounterDelivery(counterDelivery + 1); // increment counter
  };

  const handlePoDate = (date, dateString) => {
    setPoDate(dateString);
  };

  // const handleDeliveryInputChange = (e, column, index, record) => {
  //   debugger;
  //   const newData = schedule.map((item) => {
  //     if (item.key === record.key) {
  //       const updatedItem = { ...item, [column]: e.target.value };
  //       return updatedItem;
  //     }
  //     return item;
  //   });
  //   // Update the state with the new data
  //   setSchedule(newData);
  // };

  const handleSearch = async (searchText) => {
    // Call your API here. This is just a placeholder.
    if (searchText) {
      const response = await customAxios.get(
        `${urlAutocompleteProduct}?Product=${searchText}`
      );
      const apiData = response.data.data;
      const newOptions = apiData.map((item) => ({
        value: item.LongName,
        key: item.ProductId,
        UomId: item.UOMPrimaryUOM,
      }));
      setProductOptions(newOptions);
    }
  };

  // Define the function to calculate the sum of all amounts
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

  const handleSelect = (value, option, column, record) => {
    debugger;

    const newData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = { ...item, [column]: option.key, LongName: option.value };
        return updatedItem;
      }
      return item;
    });

    // Update the state with the new data
    setData(newData);
  };
  const handleInputChange = (e, column, index, record) => {
    debugger;
    let newData;
    if (["PoQuantity", "PoRate", "DiscountRate"].includes(column)) {
      newData = data.map((item) => {
        if (item.key === record.key) {
          const updatedItem = { ...item, [column]: e.target.value };

          // Get current values
          const poQuantity =
            column === "PoQuantity" ? e.target.value : item.PoQuantity;
          const poRate = column === "PoRate" ? e.target.value : item.PoRate;
          const discountRate =
            column === "DiscountRate" ? e.target.value : item.DiscountRate;

          // Calculate amounts if the column is PoQuantity, PoRate, or DiscountRate
          let discountAmount = 0;
          let amount = 0;
          if (poRate != null && poQuantity != null) {
            const discount = discountRate != null ? discountRate : 0;
            discountAmount = (poRate * poQuantity * discount) / 100;
            amount = poRate * poQuantity - discountAmount;
          }

          // Update the record with the new amounts
          updatedItem.DiscountAmount = discountAmount;
          updatedItem.LineAmount = amount;
          updatedItem.totalAmount = amount;

          // Update the form fields
          form1.setFieldsValue({
            [`DiscountAmount`]: { [record.key]: discountAmount },
            [`LineAmount`]: { [record.key]: amount },
            [`totalAmount`]: { [record.key]: amount },
          });

          return updatedItem;
        }
        return item;
      });
    } else {
      newData = data.map((item) => {
        if (item.key === record.key) {
          // Update the record with the new value for the current column
          const updatedItem = { ...item, [column]: e.target.value };
          return updatedItem;
        }
        return item;
      });
    }

    // Calculate the total amount and update the TotalAmount field
    if (["PoQuantity", "PoRate", "DiscountRate"].includes(column)) {
      const totalAmount = calculateTotalAmount(newData);
      form1.setFieldsValue({
        TotalAmount: totalAmount,
        totalpoAmount: totalAmount,
      });
    }

    // Update the state with the new data
    setData(newData);
  };

  // Function to handle UOM change and update both UomId and ShortName
const handleUomChange = (option, column, index, record) => {
  debugger;
  
  const newData = data.map((item) => {
    if (item.key === record.key) {
      // Update UomId and ShortName
      const updatedItem = { ...item, [column]: option.value, ShortName: option.children };
      return updatedItem;
    }
    return item;
  });

  // Update the state with the new data
  setData(newData);
};

  const handleDelete = (key) => {
    debugger;
    const newData = data.map((item) => {
      if (item.key === key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setData(newData);

    // Recalculate the total amount
    const totalAmount = calculateTotalAmount(newData);

    // Update the TotalAmount field
    form1.setFieldsValue({
      TotalAmount: totalAmount,
      totalpoAmount: totalAmount,
    });
  };
  const ModelAdd = () => {
    
  };
  const onFinishModel =async (values) => {
  
  };

  // const handleOpenModal = async (record) => {
  //   // handle opening of modal here
  //   console.log("deliveryrecord", record);
   
  //   setModalVisible(true);
  // };

  const handleOpenModal = async (record) => {
    debugger;
    console.log("deliveryrecord", record);
    await form1.validateFields();
    setDeliveryRecord(record);
    setModalVisible(true);
  };

 

  const handleCloseModal = () => {
    setModalVisible(false);
    form2.resetFields();
  };

  const handleSaveModal = async () => {
    debugger;
    await form2.validateFields();
    const values = form2.getFieldsValue();
    
    const updatedSchedule = schedule.map(item => {
      const key = item.key;

      if (values.DeliveryQuantity[key] || values.DelDate[key] || values.DeliveryLocation[key]) {
        return {
          ...item,
          ProductId: deliveryRecord.ProductId, // Ensure ProductId is set correctly
          DeliveryQuantity: values.DeliveryQuantity[key],
          DelDate: values.DelDate[key],
          DeliveryLocation: values.DeliveryLocation[key],
        };
      }
      return item;
    });

    setSchedule(updatedSchedule);
    console.log('modalsavedvalues', updatedSchedule);
    setModalVisible(false);
  };

  const columnsModel = [
    {
      title: "Quantity",
      dataIndex: "DeliveryQuantity",
      width: 100,
      key: "DeliveryQuantity",
      render: (text, record, index) => (
        <Form.Item
          name={["DeliveryQuantity", record.key]}
          style={{ width: "100%" }}
          initialValue={record.DeliveryQuantity}
        >
          <InputNumber
            min={0}
            defaultValue={text}
            // onChange={(value) =>
            //   handleDeliveryInputChange(
            //     { target: { value } },
            //     "DeliveryQuantity",
            //     index,
            //     record
            //   )
            // }
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
          name={["UomId", record.key]} // subtract 1 from key
         // rules={[{ required: true, message: "Required" }]}
        >
          {deliveryRecord.ShortName} {/* Display ShortName as plain text */}
        </Form.Item>
      ),
    },
    {
      title: "Date of Delivery",
      dataIndex: "DelDate",
      key: "DelDate",
      render: (text, record, index) => (
        <Form.Item
          style={{ width: 200 }}
          name={["DelDate", record.key]}
          // rules={[
          //   {
          //     required: true,
          //   },
          // ]}
        >
          <DatePicker
            value={record.DelDate && dayjs(record.DelDate, "DD-MM-YYYY")}
            // onChange={(date, dateString) => {
            //   // Handle the change here
            //   console.log("Selected date: ", dateString);
            //   handleDeliveryInputChange(dateString, "DelDate", index, record);
            // }}
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
          name={["DeliveryLocation", record.key]}
          initialValue={record.DeliveryLocation}
          style={{ width: 200 }}
        >
          <Input
            // onChange={(value) =>
            //   handleDeliveryInputChange(
            //     { target: { value } },
            //     "DeliveryLocation",
            //     index,
            //     record
            //   )
            // }
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
      //<Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>
    },
  ];

  const columns = [
    {
      title: "Product",
      dataIndex: "ProductId",
      fixed: "left",
      key: "ProductId",
      width: 350,
      render: (text, record, index) => (
        <Form.Item
          name={["ProductId", record.key]} // subtract 1 from key
          rules={[{ required: true, message: "Required" }]}
          initialValue={record.LongName} // Set initial value of the field
        >
          <AutoComplete
            options={productOptions}
            onSearch={handleSearch}
            onSelect={(value, option) =>
              handleSelect(value, option, "ProductId", record)
            }
            onChange={(value) => {
              if (!value) {
                setProductOptions([]);
              }
            }}
            allowClear={{
              clearIcon: <CloseSquareFilled />,
            }}
            disabled={!!record.PoLineId} // Disable if record has PoLineId
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

          name={["UomId", record.key]} // subtract 1 from key
          rules={[{ required: true, message: "Required" }]}
          initialValue={record.ShortName} // Set initial value of the field to UomId
        >
          <Select
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
          name={["PoQuantity", record.key]}
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
              // calculateAmounts(
              //   record,
              //   value,
              //   record.PoRate,
              //   record.DiscountRate
              // );
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
          name={["BonusQuantity", record.key]}
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
          name={["PoRate", record.key]}
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
              // calculateAmounts(
              //   record,
              //   record.PoQuantity,
              //   value,
              //   record.DiscountRate
              // );
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
          name={["DiscountRate", record.key]}
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
              //calculateAmounts(record, record.PoQuantity, record.PoRate, value);
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
          name={[`DiscountAmount`, record.key]}
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
          name={["MrpExpected", record.key]}
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
          name={["TaxType1", record.key]} // subtract 1 from key
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
                {option.LookupDescription}
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
        <Form.Item name={["TaxAmount1", record.key]} style={{ width: "100%" }}>
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
          name={["TaxType2", record.key]} // subtract 1 from key
        >
          <Select
            defaultValue={text}
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
              <Option key={option.LookupID} value={option.LookupID}>
                {option.LookupDescription}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )
    },
    {
      title: "sGSTAmount",
      dataIndex: "TaxAmount2",
      width: 100,
      key: "TaxAmount2",
      render: (text, record, index) => (
        <Form.Item name={["TaxAmount2", record.key]} style={{ width: "100%" }}>
          <InputNumber disabled min={0} defaultValue={text} />
        </Form.Item>
      )
    },
    {
      title: "amount",
      dataIndex: "LineAmount",
      width: 100,
      key: "LineAmount",
      render: (text, record, index) => (
        <Form.Item
          name={[`LineAmount`, record.key]}
          style={{ width: "100%" }}
          initialValue={record.LineAmount}
        >
          <InputNumber
            disabled
            min={0}
            defaultValue={text}
            onChange={(value) =>
              handleInputChange(
                { target: { value } },
                "LineAmount",
                index,
                record
              )
            }
          />
        </Form.Item>
      )
    },
    {
      title: "totalAmount",
      dataIndex: "totalAmount",
      width: 100,
      key: "totalAmount",
      render: (text, record, index) => (
        <Form.Item
          name={[`totalAmount`, record.key]}
          style={{ width: "100%" }}
          initialValue={record.LineAmount}
        >
          <InputNumber disabled min={0} defaultValue={text} />
        </Form.Item>
      )
    },
    {
      title: "avlQty",
      dataIndex: "AvailableQuantity",
      width: 100,
      key: "AvailableQuantity",
      render: (text, record, index) => (
        <Form.Item
          name={["AvailableQuantity", record.key]}
          style={{ width: "100%" }}
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
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => (
        <Popconfirm
          title="Are you sure you want to delete this record?"
          onConfirm={() => handleDelete(record.key)}
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
            // SupplierList: headerData.VendorId
          }}
          form={form1}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Supplier" name="SupplierList"
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
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="Procurement Store" name="StoreDetails"
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
                  <DatePicker
                    style={{ width: "100%" }}
                    disabled
                    format="DD-MM-YYYY"
                    onChange={handlePoDate}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item label="PO Status" name="POStatus"
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please input!'
                //   }
                // ]}
                >
                  <Select allowClear placeholder='Select Value'>
                    <Option value="Draft">Draft</Option>
                    <Option value="Finalize">Finalize</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col>
              <Form.Item name="SubmitCheck" style={{ marginTop: '30px' }}>
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
        </Form>
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
                  ? schedule.filter(item => item.ProductId === deliveryRecord.ProductId || item.ProductId === "")
                  : initialDeliveryDataSource
              }
            />
          </Form>
        </Modal>
      </div>
    </Layout >
  );
}

export default CreatePurchaseOrder;
