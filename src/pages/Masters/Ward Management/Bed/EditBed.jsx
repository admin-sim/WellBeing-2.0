import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import { useLocation, useNavigate } from "react-router-dom";
import { ColWithEightSpan } from "../../../../components/customGridColumns";

function EditBed() {
  const [form] = useForm();
  const [form1] = useForm();
  const [generateBedsModal, setGenerateBedsModal] = useState(false);
  const [tableData, setTableData] = useState([
    {
      SlNo: 1,
      BedNumber: "EWGF1",
      Status: "Active",
    },
  ]);

  const navigate = useNavigate();

  const location = useLocation();

  const BedInfo = location.state;

  const columns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      key: "1",
      width: 80,
    },
    {
      title: "Bed Number",
      dataIndex: "BedNumber",
      key: "2",
      width: 150,
      render: (_, row) => (
        <Input
          defaultValue={_}
          //   onChange={handleChange}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "3",
      width: 300,
      render: (_, row) => (
        <Select
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
                setTableData([
                  ...tableData,
                  { SlNo: tableData.length + 1, BedNumber: null, Status: null },
                ]);
              }}
            />
          }
        />
      ),
      key: "4",
      width: 60,
    },
  ];

  function handleSubmit(values) {
    console.log(values);
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
        <PageHeader title={"Edit Bed"} button={false} />
        <Form
          style={{ margin: "1rem" }}
          layout="vertical"
          form={form}
          //   onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <ColWithEightSpan>
              <Form.Item
                name="ServiceLocation"
                label="Service Location"
                rules={[{ required: true, message: "Please enter Ward Code " }]}
              >
                <Select />
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item
                name="Ward"
                label="Ward"
                rules={[{ required: true, message: "Please enter Ward Name" }]}
              >
                <Select />
              </Form.Item>
            </ColWithEightSpan>
          </Row>
          <Table columns={columns} dataSource={tableData} bordered />
          <Row gutter={16} justify="end" style={{ marginTop: "1.5rem" }}>
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
          // onCancel={handleCancel}
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
                    // onClick={handleCancel}
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

export default EditBed;
