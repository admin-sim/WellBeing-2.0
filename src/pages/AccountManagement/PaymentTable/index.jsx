import React, { useState } from "react";
import { Table, Button, Form, Select, Input, DatePicker } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const PaymentTable = ({ paymentTypes, banks,form2 })  => {
//  const [form] = Form.useForm();
  const [count, setCount] = useState(1); // Start the counter from 1 for unique keys
  const [data, setData] = useState([
    {
      key: 0, // Initial row key
      paymentType: "", // Default values for the first row
      amount: "",
      bank: "",
      branch: "",
      ifscCode: "",
      authorizationRefNo: "",
      cardNumber: "",
      dateExpiry: "",
      date: "",
      remarks: "",
    },
  ]);

  // Add a new row to the table
  const addRow = () => {
    const newData = {
      key: count, // Use the current count for a unique key
      paymentType: "",
      amount: "",
      bank: "",
      branch: "",
      ifscCode: "",
      authorizationRefNo: "",
      cardNumber: "",
      dateExpiry: "",
      date: "",
      remarks: "",
    };
    setData([...data, newData]);
    setCount(count + 1); // Increment the counter
  };

  // Remove a row from the table
  const removeRow = (key) => {
    setData(data.filter((item) => item.key !== key));
  };

  // Handle field changes dynamically
  const handleFieldChange = (value, key, field) => {
    const updatedData = data.map((item) =>
      item.key === key ? { ...item, [field]: value } : item
    );
    setData(updatedData);
  };

  const columns = [
    {
        title: "Payment Type",
        dataIndex: "paymentType",
        editable: true,
        render: (_, record, index) => (
          <Form.Item
            name={`paymentType-${index}`}
            initialValue={record.paymentType}
            rules={[{ required: true, message: "Payment Type is required!" }]}
            //style={{ margin: 0 }}
          >
            <Select
              placeholder="Select Payment Type"
              allowClear
              style={{ width: 150 }}
              onChange={(value) =>
                handleFieldChange(value, record.key, "paymentType")
              }
            >
               {paymentTypes?.map((option) => (
              <Option key={option.LookupID} value={option.LookupID}>
                {option.LookupDescription}
              </Option>
            ))}
            </Select>
          </Form.Item>
        ),
      },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (_, record) => (
        <Form.Item
          name={`amount-${record.key}`}
          initialValue={record.amount}
          rules={[{ required: true, message: "Amount is required!" }]}
          //style={{ margin: 0 }}
        >
          <Input
            type="number"
            placeholder="Enter Amount"
            onChange={(e) => handleFieldChange(e.target.value, record.key, "amount")}
          />
        </Form.Item>
      ),
    },
    {
        title: "Bank",
        dataIndex: "bank",
        editable: true,
        render: (_, record, index) => (
          <Form.Item
            name={`bank-${index}`}
            initialValue={record.bank}
            //style={{ margin: 0 }}
          >
            <Select
              placeholder="Select Bank"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => handleFieldChange(value, record.key, "bank")}
            >
              {banks?.map((option) => (
              <Option key={option.LookupID} value={option.LookupID}>
                {option.LookupDescription}
              </Option>
            ))}
            </Select>
          </Form.Item>
        ),
      },
    {
      title: "Branch",
      dataIndex: "branch",
      render: (_, record) => (
        <Form.Item name={`branch-${record.key}`} 
        //style={{ margin: 0 }}
        >
          <Input
            placeholder="Enter Branch"
            onChange={(e) => handleFieldChange(e.target.value, record.key, "branch")}
          />
        </Form.Item>
      ),
    },
    {
        title: "IFSC Code",
        dataIndex: "ifscCode",
        render: (_, record) => (
          <Form.Item name={`ifscCode-${record.key}`}>
            <Input
              placeholder="Enter IFSC Code"
              onChange={(e) =>
                handleFieldChange(e.target.value, record.key, "ifscCode")
              }
            />
          </Form.Item>
        ),
      },
      {
        title: "Authorization Ref No",
        dataIndex: "authorizationRefNo",
        render: (_, record) => (
          <Form.Item name={`authorizationRefNo-${record.key}`}>
            <Input
              placeholder="Enter Authorization Ref No"
              onChange={(e) =>
                handleFieldChange(e.target.value, record.key, "authorizationRefNo")
              }
            />
          </Form.Item>
        ),
      },
      {
        title: "Card Number",
        dataIndex: "cardNumber",
        render: (_, record) => (
          <Form.Item name={`cardNumber-${record.key}`}>
            <Input
              placeholder="Enter Card Number"
              onChange={(e) =>
                handleFieldChange(e.target.value, record.key, "cardNumber")
              }
            />
          </Form.Item>
        ),
      },
      {
        title: "Date",
        dataIndex: "date",
        render: (_, record) => (
          <Form.Item
            name={`date-${record.key}`}
            initialValue={record.date ? moment(record.date, "DD-MM-YYYY") : null}
          >
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Select Date"
              onChange={(date, dateString) =>
                handleFieldChange(dateString, record.key, "date")
              }
            />
          </Form.Item>
        ),
      },
      {
        title: "Expiry Date",
        dataIndex: "dateExpiry",
        render: (_, record) => (
          <Form.Item
            name={`dateExpiry-${record.key}`}
            initialValue={
              record.dateExpiry ? moment(record.dateExpiry, "DD-MM-YYYY") : null
            }
          >
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Select Expiry Date"
              onChange={(date, dateString) =>
                handleFieldChange(dateString, record.key, "dateExpiry")
              }
            />
          </Form.Item>
        ),
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        render: (_, record) => (
          <Form.Item name={`remarks-${record.key}`}>
            <Input
              placeholder="Enter Remarks"
              onChange={(e) =>
                handleFieldChange(e.target.value, record.key, "remarks")
              }
            />
          </Form.Item>
        ),
      },
    {
      title: (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={addRow}
          style={{ marginBottom: 16 }}
        >
          Add Row
        </Button>
      ),
      dataIndex: "action",
      render: (_, record) =>
        data.length > 1 ? (
          <Button
            icon={<MinusCircleOutlined />}
            onClick={() => removeRow(record.key)}
          />
        ) : null,
    },
  ];

  return (
    <Form form={form2} name="dynamic-table-form">
      <Table
        bordered
        dataSource={data}
        columns={columns}
        rowKey="key"
        pagination={false}
      />
    </Form>
  );
};

export default PaymentTable;
