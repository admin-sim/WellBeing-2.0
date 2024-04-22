import {
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Input from "antd/es/input/Input";

import React, { useState } from "react";
const columns = [
  {
    title: "Sl. No.",
    dataIndex: "SlNo",
  },
  {
    title: "Type",
    dataIndex: "LookupType",
  },
  {
    title: "Description",
    dataIndex: "LookupDescription",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: () => (
      <Button>
        <EditOutlined />
      </Button>
    ),
  },
];
const data = [
  {
    key: "1",
    SlNo: "1",
    LookupType: "Action Status",
    LookupDescription: "Acknowledged",
  },
  {
    key: "2",
    SlNo: "2",
    LookupType: "Action Status",
    LookupDescription: "Acknowledged",
  },
  {
    key: "3",
    SlNo: "3",
    LookupType: "Action Status",
    LookupDescription: "Acknowledged",
  },
  {
    key: "4",
    SlNo: "4",
    LookupType: "Action Status",
    LookupDescription: "Acknowledged",
  },
];

function States() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const options = [
    {
      value: "jack",
      label: "Jack",
    },
    {
      value: "lucy",
      label: "Lucy",
    },
    {
      value: "Yiminghe",
      label: "yiminghe",
    },
  ];

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          minHeight: "80vh",
          borderRadius: "10px",
          overflow: "hidden",
          padding: "1rem",
        }}
      >
        <Row
          style={{
            backgroundColor: "#1a9bf0",
            borderRadius: "10px",
            height: "minContent",
            padding: "0.5rem",
            margin: "0 0.1rem",
            alignItems: "center",
          }}
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        >
          <Col span={12}>
            <span
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: "1.2rem",
                letterSpacing: "0.7px",
              }}
            >
              State Manager
            </span>
          </Col>

          <Col span={1} offset={8}>
            <Button type="default" size="large" onClick={showModal}>
              <PlusCircleOutlined style={{ fontSize: "1.1rem" }} />
              Add New State
            </Button>
          </Col>
        </Row>
        <Row
          style={{
            display: "flex",
            justifyContent: "end",
            margin: "1rem 2rem 0rem 0.5rem",
          }}
        >
          <Col>
            <Input
              suffix={<SearchOutlined />}
              placeholder="Search"
              onSearch={onSearch}
              style={{
                width: 300,
              }}
            />
          </Col>
        </Row>
        <Table
          style={{ margin: "1rem 0" }}
          columns={columns}
          dataSource={data}
          onChange={onChange}
          showSorterTooltip={{
            target: "sorter-icon",
          }}
        />
        <Modal
          title="Add New State"
          open={isModalOpen}
          maskClosable={false}
          footer={null}
          onCancel={handleClose}
        >
          <Form
            style={{ margin: "1rem 0" }}
            layout="vertical"
            form={form}
            onFinish={(values) => {
              console.log(values);
              handleClose(); // Log the form values
            }}
          >
            <Form.Item
              name="Country"
              label="Country"
              rules={[
                {
                  required: true,
                  message: "Please select Country",
                },
              ]}
            >
              <Select style={{ width: "100%" }} options={options} />
            </Form.Item>
            <Form.Item
              name="StateCode"
              label="State Code"
              rules={[
                {
                  required: true,
                  message: "Please enter state code",
                },
              ]}
            >
              <Input style={{ width: "100%" }} options={options} />
            </Form.Item>
            <Form.Item
              name="StateName"
              label="State Name"
              rules={[
                {
                  required: true,
                  message: "Please enter state name",
                },
              ]}
            >
              <Input style={{ width: "100%" }} options={options} />
            </Form.Item>
            <Row gutter={32} style={{ height: "1.8rem" }}>
              <Col offset={12} span={6}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <Button type="default" onClick={handleClose}>
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default States;
