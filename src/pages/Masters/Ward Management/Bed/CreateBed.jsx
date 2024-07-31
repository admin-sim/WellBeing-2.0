import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";

function CreateBed() {
  const [form] = useForm();
  const [form1] = useForm();
  const [generateBedsModal, setGenerateBedsModal] = useState(false);
  const [tableData, setTableData] = useState([]);

  const navigate = useNavigate();

  const columns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      key: "1",
    },
    {
      title: "Bed Number",
      dataIndex: "BedNumber",
      key: "2",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "3",
      width: 300,
      render: (_, row) => (
        <Select
          style={{ width: "50%" }}
          defaultValue="Active"
          //   onChange={handleChange}
          options={[
            {
              value: "Active",
              label: "Active",
            },
            {
              value: "Hidden",
              label: "Hidden",
            },
          ]}
        />
      ),
    },
    {
      title: (
        <Button
          type="link"
          icon={
            <PlusCircleOutlined
              style={{ fontSize: "1.5rem" }}
              onClick={() => {
                setGenerateBedsModal(true);
              }}
            />
          }
        />
      ),
      key: "4",
      width: 60,
    },
  ];

  function handleCancel() {
    form1.resetFields();
    setGenerateBedsModal(false);
  }

  function handleSubmit(values) {
    console.log(values);
    const tableData = [];
    for (let i = 1; i <= values.NumberOfBeds; i++) {
      tableData.push({
        SlNo: i,
        BedNumber: `${values.PrefixWith}${values.StartingBedNo++}`,
        Status: "active",
      });
      console.log(tableData);
    }
    setTableData(tableData);
    form1.resetFields();
    setGenerateBedsModal(false);
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader title={"Create Bed"} button={false} />
        <Form
          style={{ padding: "1rem 1rem 0 1rem" }}
          layout="vertical"
          form={form}
          //   onFinish={handleSubmit}
        >
          <Row gutter={32}>
            <Col span={8}>
              <Form.Item
                name="ServiceLocation"
                label="Service Location"
                rules={[{ required: true, message: "Please enter Ward Code " }]}
              >
                <Select />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="Ward"
                label="Ward"
                rules={[{ required: true, message: "Please enter Ward Name" }]}
              >
                <Select />
              </Form.Item>
            </Col>
          </Row>
          <Table columns={columns} dataSource={tableData} bordered />
          <Row gutter={32} justify="end" style={{ margin: "1.5rem 0 0 0" }}>
            <Col>
              <Form.Item>
                <Button
                  size="middle"
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "1rem" }}
                >
                  Save
                </Button>
                <Button
                  size="middle"
                  type="default"
                  danger
                  onClick={() => navigate("/Bed")}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Modal
          title="Generate Beds"
          open={generateBedsModal}
          maskClosable={false}
          footer={null}
          onCancel={handleCancel}
          width={500}
        >
          <Form
            style={{ margin: "1rem 0" }}
            layout="vertical"
            form={form1}
            onFinish={handleSubmit}
          >
            <Row gutter={32}>
              <Col span={24}>
                <Form.Item
                  name="NumberOfBeds"
                  label="Number of Beds"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Number Of Beds",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="PrefixWith"
                  label="Prefix With"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Prefix With",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="StartingBedNo"
                  label="Starting Bed No"
                  rules={[
                    { required: true, message: "Please enter Starting Bed No" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32} justify="end" style={{ marginBottom: "-2rem" }}>
              <Col>
                <Form.Item>
                  <Button
                    size="middle"
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: "1rem" }}
                  >
                    Generate
                  </Button>
                  <Button
                    size="middle"
                    type="default"
                    danger
                    onClick={handleCancel}
                  >
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

export default CreateBed;
