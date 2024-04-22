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
  Spin,
  Layout,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Input from "antd/es/input/Input";
import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import customAxios from "../../../components/customAxios/customAxios";

import { urlGetAllGeneralLookUp } from "../../../../endpoints";
import CustomTable from "../../../components/customTable";

function States() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  const handleEdit = (record) => {
    // edit the item in your data here
    alert(`Editing item with key ${record.key}`);
  };
  const handleDelete = (record) => {
    // edit the item in your data here
    alert(`Deleting item with key ${record.key}`);
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllGeneralLookUp}`);
      const newColumnData = response.data.data.masters.map((obj, index) => {
        return { ...obj, key: index + 1 };
      });
      setColumnData(newColumnData);
      console.log("data", newColumnData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Type",
      dataIndex: "LookupType",
      key: "key",
    },
    {
      title: "Description",
      dataIndex: "LookupDescription",
      key: "key",
    },
  ];

  return (
    <>
      <Layout>
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
                State Manager
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button icon={<PlusCircleOutlined />} onClick={showModal}>
                Add New State
              </Button>
            </Col>
          </Row>

          <Spin spinning={loading}>
            <CustomTable
              columns={columns}
              dataSource={columnData}
              actionColumn={true}
              isFilter={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Spin>
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
      </Layout>
    </>
  );
}

export default States;