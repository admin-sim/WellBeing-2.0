import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { FaHistory, FaPrescription } from "react-icons/fa";

function Prescription() {
  const [form] = useForm();

  const [dataSource, setDataSource] = useState([{ key: 1, name: "Drug1" }]);

  const handleAddRow = () => {
    const newData = {
      key: dataSource.length + 1,
      name: `Drug${dataSource.length + 1}`, // Example name generation
    };
    setDataSource([...dataSource, newData]);
  };

  const handleDeleteRow = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const columns = [
    {
      title: "Name of the Drug",
      width: 300,
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`Name${record.name}`}>
            <Select
              size="small"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Dose",
      width: 100,
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`Dose${record.name}`}>
            <Select
              size="small"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Route",
      width: 100,
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`Route${record.name}`}>
            <Select
              size="small"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Frequency",
      width: 100,
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`Frequency${record.name}`}>
            <Select
              size="small"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "No. of days",
      width: 100,
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item style={{ width: "100%" }} name={`days${record.name}`}>
            <Input
              size="small"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Instructions",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "end",
            margin: "0rem 0 -1.5rem 0",
          }}
        >
          <Form.Item
            style={{ width: "100%" }}
            name={`Instructions${record.name}`}
          >
            <Input
              size="small"
              options={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </div>
      ),
      width: 250,
    },
    {
      title: (
        <span style={{ display: "flex", justifyContent: "center" }}>
          Action{" "}
          <Tooltip title="Add Drug">
            {" "}
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              style={{ fontSize: "1.5rem" }}
              onClick={handleAddRow}
            />
          </Tooltip>
        </span>
      ),
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Button icon={<EditOutlined />} />
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDeleteRow(record.key)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
      width: 120,
    },
  ];
  return (
    <>
      <Row>
        <Col span={18} style={{ margin: "1rem" }}>
          <span style={{ fontSize: "1rem", fontWeight: 600 }}>
            Prescription
          </span>
        </Col>
        <Col
          span={5}
          style={{
            margin: "1rem 0 0 0.5rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            type="primary"
            style={{ borderRadius: "1rem" }}
            size="middle"
            className="d-flex allignCenter"
            disabled
          >
            Previous Provisional Diagnosis
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
      <p>
        <FaPrescription style={{ color: "green", fontSize: "1.2rem" }} /> Advice
        medication for this visit
      </p>
      <Form
        form={form}
        onFinish={(values) => {
          console.log(values);
        }}
      >
        <Table columns={columns} dataSource={dataSource} />
        <Row gutter={16} justify={"end"} style={{ margin: "1rem" }}>
          <Col>
            {" "}
            <Button type="primary" size="middle" htmlType="submit">
              Save
            </Button>
          </Col>

          <Col>
            <Button danger size="middle">
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default Prescription;
