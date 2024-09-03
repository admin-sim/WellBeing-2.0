import customAxios from "../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
import {
  urlCreateStoreReturn,
  urlSearchReceipt,
  urlGetStoreProductDetails,
  urlAddNewStoreReturn,
  urlStoreReturnEdit,
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
import { LeftOutlined } from "@ant-design/icons";
//import Typography from 'antd/es/typography';
import { useNavigate } from "react-router";
import { Table, InputNumber } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
//import { Calculate } from '@mui/icons-material';

const CreateStoreReturn = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    ReturnStoreDetails: [],
    UOM: [],
    TaxType: [],
    DateFormat: [],
  });

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const { Title } = Typography;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataModal, setDataModal] = useState([]);
  const [data, setData] = useState([]);
  const [issueStatus, setIssueStatus] = useState();
  const [productOptions, setProductOptions] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
  const location = useLocation();
  const ReturnHeaderId = location.state.ReturnHeaderId;
  const navigate = useNavigate();
  const [buttonTitle, setButtonTitle] = useState('Save')
  useEffect(() => {
    customAxios.get(urlCreateStoreReturn).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
      //setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    debugger;
    const fetchData = async () => {
      if (ReturnHeaderId > 0) {
        setButtonTitle("Update");
        try {
          const response = await customAxios.get(
            `${urlStoreReturnEdit}?ReturnHeaderId=${ReturnHeaderId}`
          );
          if (response.status == 200 && response.data.data != null) {
            const editeddata = response.data.data;
            const products = editeddata.ReturnDetails.map(
              (item, index) => ({
                ...item,
                key: index,
                ProductName: item.Product,
                index: index + 1
              })
            );
            setData(products);

            const formdata = editeddata.newReturnModel;
            form1.setFieldsValue({
            
              ReturningStore: formdata.StoreId,
              ReturnedLocation: formdata.SupplierId,
             // ReturnHeaderId: formdata.ReturnHeaderId
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (searchText) => {
    debugger;
    if (searchText) {
      const form1va = form1.getFieldValue();
      const response = await customAxios.get(
        `${urlGetStoreProductDetails}?product=${searchText}&storeId=${form1va.ReturningStore}`
      );
      const apiData = response.data.data;
      const newOptions = apiData.map((item) => ({
        value: item.LongName,
        key: item.ProductDefinitionId,
      }));
      setProductOptions(newOptions);
    } else {
      form2.setFieldsValue({ ProductId: 0 });
      setProductOptions([]);
    }
  };
  const handleSelect = (value, option, column) => {
    debugger;
    form2.setFieldsValue({ ProductId: option.key });
  };

  const onFinishModel = async(values) => {
    debugger;
    const newData = data.filter((item) => item.key !== (record.key === undefined ? record.toString() : record.key));
    Object.keys(fields).forEach(fieldName => {
      if (fieldName.startsWith(`${record.key}.`)) {
        form1.resetFields([fieldName]);
      }
    });
    setData(newData);
    // if (tableRef.current) {
    //   tableRef.current.scrollLeft = 0;
    // }    
  };

  const ModelDelete = (record) => {
    debugger;
    const newData = dataModel.filter((item) => item.key !== (record.key === undefined ? record.toString() : record.key));
    setDataModel(newData);
  };

  const handleInputChange = (value, option, key) => {
    setInputValues((prevState) => ({ ...prevState, [key]: value }));
  };


  const handleOnFinish = async (values) => {
    debugger;
   
    if (data.length == 0) {
      message.warning('Please Add Product/Batch')
      return false;
    }

    const products = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined) {
        const product = {
          ProductId: data[i].ProductId,
          UomId: data[i].UomId,
          BatchNo: data[i].BatchNo,
          ReturnQty: values[i].ReturnQty,
          EXPDateString:dayjs(data[i].EXPDate).format('DD-MM-YYYY'),
      
        }
        products.push(product);
      }
    }
    const storeReturn = {
      FacilityId : 1,
      StoreId: values.ReturningStore,
      SupplierId: values.ReturnedLocation,
      ReturnDatestring: values.ReturnDate ? values.ReturnDate.format("DD-MM-YYYY") : null,
      ReturnStatus: !issueStatus ? 'Created' : values.ReturnStatus,
      ReturnHeaderId:ReturnHeaderId
    }
    const postData = {
      newReturnModel: storeReturn,
      ReturnDetails: products,
    }
    try {
      const response = await customAxios.post(urlAddNewStoreReturn, postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      handleToBack();
    } catch (error) {
      // Handle error      
    }
  };
  const addtolist  = () => {
    // Filter selected items
    const selectedItems = dataModal.filter(item => selectedRowKeys.includes(item.key));
  
    if (selectedItems.length > 0) {
      // Map selected items to a new array with updated keys and indices
      const newItems = selectedItems.map((item, index) => ({
        ...item,
        key: index,      // Ensure a unique key for each item
        index: index + 1 // Adjust index if needed
      }));
  
      // Update the state with the new items
      setData(newItems);
      setIsModalOpen(false);
    } else {
      message.warning("Please select at least one product");
      return false;
    }
  };
  const OpenModel = async () => {
    await form1.validateFields(["ReturningStore"]);
    form2.resetFields();
    setDataModal([]);
    setSelectedRowKeys([]);
    setIsModalOpen(true);
  };
  const handleToBack = () => {
    const url = "/StoreReturn";
    navigate(url);
  };
  const handleReset = () => {
    form2.resetFields();
  };
  const SubmitChanged = (event) => {
    setIssueStatus(event.target.checked);
  };

  const handleclose = () => {
    setIsModalOpen(false);
    form2.resetFields();
    setDataModal([]);
  };

  const handleSelectChange = (e, key) => {
    const newSelectedRowKeys = e.target.checked
      ? [...selectedRowKeys, key]
      : selectedRowKeys.filter(k => k !== key);

    setSelectedRowKeys(newSelectedRowKeys);
  };


  const columns = [
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "ProductName",
    },
    {
      title: "Uom",
      dataIndex: "Uom",
      key: "Uom",
    },
    {
      title: "BatchNo",
      dataIndex: "BatchNo",
      key: "BatchNo",
    },
    {
      title: "Expiry Date",
      dataIndex: "EXPDate",
      key: "EXPDate",
      sorter: (a, b) => a.EXPDate.localeCompare(b.EXPDate),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        const dateParts = text.split("T")[0].split("-");
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        return `${day}-${month}-${year}`;
      },
    },
    {
      title: "Returned Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
      render: (text) => {
        // Display 0 if Quantity is null
        return text === null ? 0 : text;
      },
    },
    {
      title: "Returnable Qty",
      dataIndex: "BalanceQty",
      key: "ReturnableQty",
      render: (text, record) => {
        // Use ReturnHeaderId from location to determine which value to show
        return ReturnHeaderId && ReturnHeaderId > 0 ? record.AvlQuantity : record.BalanceQty;
      },
    },
    {
      title: "Return Quantity",
      dataIndex: "ReturnQty",
      key: "ReturnQty",
      width:300,
      render: (text, record) => (
        <>
          <Form.Item
            name={[record.key, "ReturnQty"]} initialValue={record.ReturnQty}
            rules={[
              {
                required: true,
                message: "Please input!",
              },
              {
                validator: (_, value) => {
                  if (value > record.BalanceQty) {
                    return Promise.reject(
                      new Error("Return Qty should not be Greater than Returnable.")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber min={0} style={{ marginTop: 10 }} allowClear />
          </Form.Item>
        </>
      ),
    },

  ];


  const Modalcolumns = [
    {
      title: '',
      dataIndex: 'checkbox',
      key: 'checkbox',
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => handleSelectChange(e, record.key)}
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "ProductName",
    },
    {
      title: "Quantity",
      dataIndex: "BalanceQty",
      key: "BalanceQty",
    },
    {
      title: "BatchNo",
      dataIndex: "BatchNo",
      key: "BatchNo",
    },
    {
      title: "Expiry Date",
      dataIndex: "EXPDate",
      key: "EXPDate",
      sorter: (a, b) => a.EXPDate.localeCompare(b.EXPDate),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        const dateParts = text.split("T")[0].split("-");
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        return `${day}-${month}-${year}`;
      },
    },
  ];

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
              Create Store Return
            </Title>
          </Col>
          <Col offset={6} span={2}>
            <Button
              icon={<LeftOutlined />}
              style={{ marginBottom: 0 }}
              onClick={handleToBack}
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
            size="default"
            style={{
              maxWidth: 1500
            }}
            form={form1}
            initialValues={{
              ReturningDate: dayjs(),
            }}
          // onValuesChange={(changedValues, allValues) => {
          //   debugger;
          //   for (let i = 0; i < 9; i++) {
          //     if (changedValues[i] !== undefined) {
          //       if (changedValues[i].product !== undefined) {
          //         getPanelValue(form1.getFieldValue([i, 'product']));
          //       }
          //       const poQty = allValues[i]['poQty'];
          //       const poRate = allValues[i]['poRate'];

          //       if (poQty !== "" && poRate !== "") {
          //         const total = poQty * poRate;
          //         // Update the total value in the form fields
          //         if (allValues[i]['discount'] !== "") {
          //           form1.setFieldsValue({ [i]: { discountAmt: (total * (allValues[i]['discount'] / 100)).toFixed(2) } });
          //           form1.setFieldsValue({ [i]: { amount: (total - (total * (allValues[i]['discount'] / 100))) } });
          //           form1.setFieldsValue({ [i]: { totalAmount: (total - (total * (allValues[i]['discount'] / 100))) } });
          //           // form1.setFieldsValue({ Amount: form1.getFieldValue('Amount') + (total - (total * (allValues[i]['discount'] / 100))) })
          //         } else {
          //           form1.setFieldsValue({ [i]: { amount: total } });
          //           form1.setFieldsValue({ [i]: { totalAmount: total } });
          //         }
          //       }
          //       break;
          //     }
          //   }
          //   let totalAmount = 0;
          //   for (let j = 0; j < 10; j++) {
          //     if (allValues[j] !== undefined) {
          //       const Amount = form1.getFieldValue([j, 'amount']);
          //       totalAmount += Amount;
          //     }
          //   }
          //   form1.setFieldsValue({ Amount: totalAmount });
          //   form1.setFieldsValue({ totalpoAmount: totalAmount });
          //   // Assuming 'poQty' and 'poRate' are the names of the fields

          //   // Check if both values are valid numbers              
          // }}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
              <Col className="gutter-row" span={8}>
                <div>
                  <Form.Item
                    label="Returning Store"
                    name="ReturningStore"
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
              <Col className="gutter-row" span={8}>
                <div>
                  <Form.Item label="Returning To Vendor" name="ReturningToVendor"
                    rules={[
                      {
                        required: true,
                        message: 'Please input!'
                      }
                    ]}
                  >
                    <Select allowClear placeholder='Select Value'>
                      {DropDown.StoreDetails.map((option) => (
                        <Select.Option key={option.StoreId} value={option.StoreId}>
                          {option.StoreType}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={8}>
                <div>
                  <Form.Item label="Returning Date" name="ReturningDate"
                    rules={[
                      {
                        required: true,
                        message: 'Please input!'
                      }
                    ]}
                  >
                    <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' disabled />
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={4}>
                <div>
                  <Form.Item label="Status" name="Status">
                    <Select allowClear placeholder='Select Value'>
                      {DropDown.StoreDetails.map((option) => (
                        <Select.Option key={option.StoreId} value={option.StoreId}>
                          {option.StoreType}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item name="Remarks" style={{ marginTop: '30px' }}>
                    <Checkbox>Submit</Checkbox>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item name="Remarks" style={{ marginTop: '30px' }}>
                    <Button type='link' onClick={OpenModel}>Search Product/Batch No</Button>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row justify="end" style={{ padding: '0rem 1rem' }}>
              <Col style={{ marginRight: '10px' }}>
                <Form.Item>
                  <Button type="primary" loading={isSearchLoading} htmlType="submit">
                    Submit
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
        </Card>
    
          <Modal
            title="Basic Modal"
            onOk={onOkModal}
            onCancel={onCancelModel}
            width={1000}
            open={isModalOpen}
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
                width: '100%',
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
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item
                    label="Product"
                    name="Product"
                    initialValue={selectedProductId[recordKeys]}
                    style={{ marginLeft: '10px' }}
                    rules={[
                      {
                        required: false,
                      }
                    ]}
                  >
                    <Tag color="blue">{form1.getFieldValue([recordKeys, 'product'])}</Tag>
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </Form>
          <Form
            name="basic"
            style={{
              width: "100%",
            }}
            onFinish={addtolist}
            form={form3}
          >
            <Table columns={Modalcolumns} dataSource={dataModal} />
          </Form>
          <Row justify={"end"} style={{ margin: "1rem 1.5rem 0" }}>
          <Form.Item>
            <Button onClick={addtolist}   type="primary">Add To List</Button>
            </Form.Item>
          </Row>
        </Modal>
      </div>
    </Layout>
  );
};

export default CreateStoreReturn;
