import customAxios from '../../components/customAxios/customAxios.jsx';
import React, { useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { urlGetPurshaseOrderDetails, urlAutocompleteProduct, urlVendorReturnSearchGrn, urlVenderReturnEdit, urlShowGrnList, urlAddNewVendorReturn } from '../../../endpoints';
import Select from 'antd/es/select';
import { ConfigProvider, Typography, Checkbox, Tag, Modal, Popconfirm, Card, Col, Divider, Row, AutoComplete, Radio, message } from 'antd';
import Input from 'antd/es/input';
import Form from 'antd/es/form';
import { DatePicker } from 'antd';
import Layout from 'antd/es/layout/layout';
import { LeftOutlined } from '@ant-design/icons';
//import Typography from 'antd/es/typography';
import { useNavigate } from 'react-router';
import { Table, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { render } from 'react-dom';
import { useLocation } from "react-router-dom";
import CustomTable from "../../components/customTable/index.jsx";

const CreateVendorReturn = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: []
  });

  const location = useLocation();
  const ReturnHeaderId = location.state.ReturnHeaderId;
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const { Title } = Typography;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  //const dateFormat = DropDown.DateFormat.toString().toUpperCase().replace(/D/g, 'D').replace(/Y/g, 'Y');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [data, setData] = useState([])
  const [dataModal, setDataModal] = useState([]);
  const fields = form1.getFieldsValue();
  const [productOptions, setProductOptions] = useState()
  const [issueStatus, setIssueStatus] = useState()
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState('option1');
  const [buttonTitle, setButtonTitle] = useState('Save')

  // const tableRef = useRef(null);

  useEffect(() => {
    customAxios.get(urlGetPurshaseOrderDetails).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
  }, []);

  useEffect(() => {
    debugger;
    const fetchData = async () => {
      if (ReturnHeaderId > 0) {
        setButtonTitle("Update");
        try {
          const response = await customAxios.get(
            `${urlVenderReturnEdit}?ReturnHeaderId=${ReturnHeaderId}`
          );
          if (response.status == 200 && response.data.data != null) {
            const editeddata = response.data.data;
            const products = editeddata.ReturnDetails.map(
              (item, index) => ({
                ...item,
                key: index,
                ProductName: item.Product,
                BatchBonusQty: item.BonusQuantity ? item.BonusQuantity : 0,
                PoBalanceQty: item.AvlQuantity,
                BonusQuantity: item.ReturnedQuantity ? item.ReturnedQuantity : 0,
                index: index + 1
              })
            );
            setData(products);

            const formdata = editeddata.newReturnModel;
            form1.setFieldsValue({
              ReceivingStore: formdata.ReturnStatus == 'Created' ? undefined : formdata.ReturnStatus,
              StoreId: formdata.StoreId,
              SupplierId: formdata.SupplierId,
              ReturnHeaderId: formdata.ReturnHeaderId
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
    debugger
    if (searchText) {
      const response = await customAxios.get(`${urlAutocompleteProduct}?Product=${searchText}`);
      const apiData = response.data.data;

      const filteredApiData = apiData.filter(apiItem =>
        !data.some(option => option.ProductId === apiItem.ProductId)
      );

      const newOptions = filteredApiData.map((item) => ({
        value: item.LongName,
        key: item.ProductId,
        UomId: item.UOMPrimaryUOM,
      }));
      setProductOptions(newOptions);
    }
    else {
      form2.setFieldsValue({ ProductId: 0 })
    }
  }

  const onOkModal = async () => {
    debugger;
    if (selectedRowKeys.length == 0) {
      message.warning('Please Select Alteast one Batch!')
      return false
    }
    else {
      const newdata = selectedRowKeys.map((item) => {
        return {
          GRNHeaderId: item.GRNHeaderId,
          GrnLineId: item.GrnLineId,
          GrnBatchId: item.GrnBatchId,
          StoreId: item.StoreId,
          GRNNumber: item.GRNNumber
        }
      })
      selectedRowKeys
      // const url = PoHeaderId === 0 ? urlAddNewPurchaseOrder : urlUpdatePurchaseOrder;
      const response = await customAxios.post(urlShowGrnList, newdata, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newData = response.data.data.GRNDetails.map((item, index) => {
        return {
          ...item,
          key: index,
          index: index + 1
        }
      })
      setData(newData)
      form2.resetFields();
      setDataModal([])
      setSelectedRowKeys([])
      setIsModalOpen(false)
    }
  }

  const onFinishModel = async (values) => {
    debugger;
    setDataModal([])
    const VendorReturn = {
      GRNDateFrom: values.GRNDateFrom && selectedRadio == 'option1' ? values.GRNDateFrom.format("DD-MM-YYYY") : null,
      GRNDateTo: values.ExpiryDateTo && selectedRadio == 'option1' ? values.ExpiryDateTo.format("DD-MM-YYYY") : null,
      ExpiryDateTo: values.ExpiryDateTo && selectedRadio == 'option2' ? values.ExpiryDateTo.format("DD-MM-YYYY") : null,
      ExpiryDateFrom: values.ExpiryDateFrom && selectedRadio == 'option2' ? values.ExpiryDateFrom.format("DD-MM-YYYY") : null,
      Store: form1.getFieldValue('StoreId'),
      SupplierId: values.SupplierId && selectedRadio == 'option2' ? values.SupplierId : 0,
      ProductId: values.ProductId && selectedRadio == 'option1' ? values.ProductId : 0,
    }
    const response = await customAxios.get(`${urlVendorReturnSearchGrn}?Store=${VendorReturn.Store}&Product=${VendorReturn.ProductId}&Supplier=${VendorReturn.SupplierId}&ExpToString=${VendorReturn.ExpiryDateTo}&ExpFromString=${VendorReturn.ExpiryDateFrom}&FromDateString=${VendorReturn.GRNDateFrom}&ToDateString=${VendorReturn.GRNDateTo}`);
    debugger
    const newColumnData = response.data.data.GRNDetails.map((item, index) => {
      return { ...item, key: item.GRNHeaderId };
    });
    setDataModal(newColumnData)
  }

  const onCancelModel = () => {
    debugger;
    form2.resetFields();
    setDataModal([])
    setSelectedRowKeys([])
    setIsModalOpen(false);
  }

  const handleSelect = (value, option, column) => {
    debugger;
    form2.setFieldsValue({ ProductId: option.key });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleToBack = () => {
    const url = '/VendorReturn';
    navigate(url);
  };

  const OpenModel = async () => {
    await form1.validateFields(['StoreId'])
    setIsModalOpen(true)
  }
  const handleOnFinish = async (values) => {
    debugger;
    const newdata = data.filter((item) => item.ActiveFlag == true)
    if (newdata.length == 0) {
      message.warning('Please Add Product/Batch')
      return false
    }

    const products = [];
    for (let i = 0; i < newdata.length; i++) {
      if (newdata[i] !== undefined) {
        const product = {
          ReturnQty: values[i].ReturnQty,
          GRNHeaderId: newdata[i].GRNHeaderId,
          ProductId: newdata[i].ProductId,
          UomId: newdata[i].UomId,
          BatchNo: newdata[i].BatchNo,
          EXPDateString: newdata[i].EXPDateString,
          ReturnLineId: newdata[i].ReturnLineId,
          GRNHeaderId: newdata[i].GRNHeaderId,
          ActiveFlag: newdata[i].ActiveFlag
        }
        products.push(product);
      }
    }
    const VendorReturn = {
      StoreId: values.StoreId,
      SupplierId: values.SupplierId,
      ReturnDatestring: values.ReturnDate ? values.ReturnDate.format("DD-MM-YYYY") : null,
      ReturnStatus: !issueStatus ? 'Created' : values.ReturnStatus,
      ReturnHeaderId: values.ReturnHeaderId ? values.ReturnHeaderId : 0
    }
    const postData = {
      newReturnModel: VendorReturn,
      ReturnDetails: products,
    }
    try {
      const response = await customAxios.post(urlAddNewVendorReturn, postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      handleToBack();
    } catch (error) {
      // Handle error      
    }
  };

  const handleCheckboxChange = (checked, record) => {
    debugger
    const newSelectedRowKeys = checked
      ? [...selectedRowKeys, { GRNHeaderId: record.GRNHeaderId, GrnBatchId: record.GrnBatchId, GrnLineId: record.GrnLineId, GrnBatchId: record.GrnBatchId, StoreId: record.StoreId, GRNNumber: record.GRNNumber }]
      : selectedRowKeys.filter(key => key.GRNHeaderId !== record.GRNHeaderId && key.GrnBatchId !== record.GrnBatchId);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const isRowSelected = (record) => {
    return selectedRowKeys.some(row => row.GRNHeaderId === record.GRNHeaderId && row.GrnBatchId === record.GrnBatchId);
  };

  const columns = [
    {
      title: "GRN Number",
      dataIndex: "GRNNumber",
      key: "GRNNumber",
      sorter: (a, b) => a.GRNNumber - b.GRNNumber,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "ProductName",
      width: 300,
      sorter: (a, b) => a.ProductName.localeCompare(b.ProductName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "UOM",
      dataIndex: "Uom",
      key: "Uom",
      sorter: (a, b) => new Date(a.Uom) - new Date(b.Uom),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Batch No",
      dataIndex: "BatchNo",
      key: "BatchNo",
      sorter: (a, b) => a.BatchNo.localeCompare(b.BatchNo),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Expiry Date",
      dataIndex: "EXPDateString",
      width: 150,
      key: "EXPDateString",
      sorter: (a, b) => a.EXPDateString.localeCompare(b.EXPDateString),
      sortDirections: ["descend", "ascend"],
      // render: (text) => {
      //   const dateParts = text.split('T')[0].split('-');
      //   const year = dateParts[0];
      //   const month = dateParts[1];
      //   const day = dateParts[2];

      //   return `${day}-${month}-${year}`;
      // },
    },
    {
      title: ReturnHeaderId > 0 ? 'Received Qty' : 'Grn Received Qty',
      dataIndex: "Quantity",
      key: "Quantity",
      sorter: (a, b) => a.Quantity.localeCompare(b.Quantity),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return text
      },
    },
    {
      title: ReturnHeaderId > 0 ? 'Bonus Quantity' : 'GRN Bonus Qty',
      dataIndex: "BatchBonusQty",
      key: "BatchBonusQty",
      sorter: (a, b) => a.BatchBonusQty.localeCompare(b.BatchBonusQty),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return text
      },
    },
    {
      title: "Returned Quantity",
      dataIndex: "BonusQuantity",
      key: "BonusQuantity",
      sorter: (a, b) => a.BonusQuantity.localeCompare(b.BonusQuantity),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Returnable Quantity",
      dataIndex: "PoBalanceQty",
      key: "PoBalanceQty",
      sorter: (a, b) => a.PoBalanceQty.localeCompare(b.PoBalanceQty),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Return Quantity",
      dataIndex: "ReturnQty",
      key: "ReturnQty",
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
                  if (value > record.PoBalanceQty) {
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
          <Form.Item hidden name={[record.key, "GRNHeaderId"]} initialValue={record.GRNHeaderId}>
            <Input />
          </Form.Item>
          <Form.Item hidden name={[record.key, "ReturnLineId"]} initialValue={record.ReturnLineId}>
            <Input />
          </Form.Item>
        </>
      ),
    },
    {
      // title: "GRN Bonus Qty",
      // dataIndex: "GRNBonusQty",
      // key: "GRNBonusQty",
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
    debugger
    const newData = data.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setData(newData);
  }

  const Modalcolumns = [
    {
      // title: "Sl. No.",
      dataIndex: "key",
      key: "key",
      render: (text, record) => (
        <Checkbox
          checked={isRowSelected(record)}
          onChange={(e) => handleCheckboxChange(e.target.checked, record)}
        />
      ),
    },
    {
      title: "GRN Number",
      dataIndex: "GRNNumber",
      key: "GRNNumber",
      sorter: (a, b) => a.GRNNumber - b.GRNNumber,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "ProductName",
      sorter: (a, b) => a.ProductName.localeCompare(b.ProductName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Grn Qty",
      dataIndex: "Quantity",
      key: "Quantity",
      sorter: (a, b) => new Date(a.Quantity) - new Date(b.Quantity),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Returnable Quantity",
      dataIndex: "PoBalanceQty",
      key: "PoBalanceQty",
      sorter: (a, b) => a.PoBalanceQty.localeCompare(b.PoBalanceQty),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Grn Bonus Qty",
      dataIndex: "BonusQuantity",
      key: "BonusQuantity",
      sorter: (a, b) => a.BonusQuantity.localeCompare(b.BonusQuantity),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Batch No",
      dataIndex: "BatchNo",
      key: "BatchNo",
      sorter: (a, b) => a.BatchNo.localeCompare(b.BatchNo),
      sortDirections: ["descend", "ascend"],
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

  const SubmitChanged = (event) => {
    setIssueStatus(event.target.checked)
  }

  const handleReset = () => {
    form2.resetFields()
  }

  const onFinishModel3 = (values) => {
    debugger
  }

  const onFinishFailed3 = () => {

  }

  const handleRadioChange = (group, value) => {
    debugger
    setSelectedRadio(value);
  };

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
              Create Vendor Return
            </Title>
          </Col>
          <Col offset={6} span={2}>
            <Button icon={<LeftOutlined />} style={{ marginBottom: 0 }} onClick={handleToBack}>
              Back
            </Button>
          </Col>
        </Row>
        <Card>
          <Form
            form={form1}
            name="control-hooks"
            layout="vertical"
            variant="outlined"
            style={{
              maxWidth: 1500,
            }}
            initialValues={{
              ReturnDate: dayjs(),
            }}
            onFinish={handleOnFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ padding: '1rem 2rem', marginBottom: '0' }} align="Bottom">
              <Col className="gutter-row" span={8}>
                <div>
                  <Form.Item label="Returning Store" name="StoreId"
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
                          {option.LongName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item hidden name="ReturnHeaderId">
                    <Input />
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={8}>
                <div>
                  <Form.Item label="Returning To Vendor" name="SupplierId"
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
                  <Form.Item label="Returning Date" name="ReturnDate"
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
                  <Form.Item label="Status" name="ReturnStatus"
                    rules={[
                      {
                        required: issueStatus,
                        message: 'Please input!'
                      }
                    ]}
                  >
                    <Select allowClear placeholder='Select Value'>
                      <Select.Option key='Draft' value='Draft'></Select.Option>
                      <Select.Option key='Finalize' value='Finalize'></Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item name="SubmitCheck" style={{ marginTop: '30px' }} valuePropName='checked'>
                    <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item style={{ marginTop: '30px' }}>
                    <Button type='link' onClick={OpenModel}>Search Product/Batch No</Button>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row justify="end" style={{ padding: '0rem 1rem' }}>
              <Col style={{ marginRight: '10px' }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {buttonTitle}
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" onClick={handleToBack}>
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <CustomTable
              dataSource={data.filter((item) => item.ActiveFlag !== false)}
              columns={columns}
              isFilter={false}
              actionColumn={false}
              bordered
            />
            {/* <Table
              bordered
              columns={columns}
              size="small"
              dataSource={data.filter((item) => item.ActiveFlag !== false)}
              locale={{ emptyText: "nodata " }}
            // scroll={{
            //   x: 2000,
            // }}
            /> */}
          </Form>
        </Card>
        <Modal
          width={1200}
          maskClosable={false}
          title="Search for Product"
          open={isModalOpen}
          onCancel={onCancelModel}
          onOk={onOkModal}
          okText={"AddToList"}
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
              GRNDateTo: dayjs(),
              GRNDateFrom: dayjs().subtract(1, "day"),
              ExpiryDateFrom: dayjs().subtract(1, "day"),
              ExpiryDateTo: dayjs(),
              Radio1: true,
            }}
            onFinish={onFinishModel}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form2}
          >
            <Row>
              <Col className="gutter-row" span={10}>
                <>
                  <Form.Item
                    label="Product"
                    name="Product"
                    style={{ marginLeft: '10px' }}
                  >
                    <AutoComplete
                      options={productOptions}
                      onSearch={handleSearch}
                      onSelect={(value, option) =>
                        handleSelect(value, option, "Product")
                      }
                      placeholder="Search for a product"
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item hidden name='ProductId'><Input></Input></Form.Item>
                </>
              </Col>
              <Col className="gutter-row" span={2}>
                <Form.Item
                  name="Radio1"
                  style={{ marginLeft: '10px' }}
                >
                  <Radio
                    checked={selectedRadio === 'option1'}
                    onClick={() => handleRadioChange('group1', 'option1')}
                  >
                  </Radio>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  title='GRN Date From'
                  name="GRNDateFrom"
                  style={{ marginLeft: '10px' }}
                >
                  <DatePicker format='DD-MM-YYYY' />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  title='GRN Date To'
                  name="GRNDateTo"
                  style={{ marginLeft: '10px' }}
                >
                  <DatePicker format='DD-MM-YYYY' />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col className="gutter-row" span={10}>
                <Form.Item
                  label="Vendor"
                  name="SupplierId"
                  style={{ marginLeft: '10px' }}
                >
                  <Select allowClear placeholder='Select Value'>
                    {DropDown.SupplierList.map((option) => (
                      <Select.Option key={option.VendorId} value={option.VendorId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={2}>
                <Form.Item
                  name="Radio2"
                  style={{ marginLeft: '10px' }}
                >
                  <Radio
                    checked={selectedRadio === 'option2'}
                    onClick={() => handleRadioChange('group2', 'option2')}
                  >
                  </Radio>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  title='Expiry Date From'
                  name="ExpiryDateFrom"
                  style={{ marginLeft: '10px' }}
                >
                  <DatePicker format='DD-MM-YYYY' />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  title='Expiry Date To'
                  name="ExpiryDateTo"
                  style={{ marginLeft: '10px' }}
                >
                  <DatePicker format='DD-MM-YYYY' />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" style={{ padding: '0rem 1rem' }}>
              <Col style={{ marginRight: '10px' }}>
                <Form.Item>
                  <Button type="primary" htmlType="SearchList">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" onClick={handleReset}>
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
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
            onFinish={onFinishModel3}
            onFinishFailed={onFinishFailed3}
            form={form3}>
            <Table columns={Modalcolumns} dataSource={dataModal} />
          </Form>
        </Modal>
      </div>
    </Layout >
  );
}


export default CreateVendorReturn;
