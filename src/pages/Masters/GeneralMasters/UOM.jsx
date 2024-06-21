import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Spin,
  Layout,
  notification,
} from "antd";

import Input from "antd/es/input/Input";
import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import customAxios from "../../../components/customAxios/customAxios";

import {
  urlGetAllUOMs,
  urlGetSelectedUOMDetails,
  urlAddAndUpdateUOM,
  urlDeleteSelectedUOM,
} from "../../../../endpoints";
import CustomTable from "../../../components/customTable";

function UOM() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [UOMData, setUOMData] = useState();
  const [isEditing, setIsEditing] = useState();

 
 

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
      const response = await customAxios.get(`${urlGetAllUOMs}`);
      const newColumnData = response.data.data.UOMModel.map((obj, index) => {
        return { ...obj, key: index + 1 };
      });
      setColumnData(newColumnData);
      console.log("data", newColumnData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDelete = (record) => {
    debugger;
    //Deleting an State from the Table
    setUOMData(record);
    try {
      customAxios
        .post(`${urlDeleteSelectedUOM}?UomId=${record.UomId}`)
        .then((response) => {
          if (response.data.data !== null) {
            const uom = response.data.data.UOMModel.map((obj, index) => {
              return { ...obj, key: index + 1 };
            });
            setColumnData(uom);
            notification.success({
              message: "Deleted Successfully",
            });
          }
        });
    } catch (error) {
      notification.error({
        message: "Deleting UnSuccessful",
      });
    }
  };

  const handleAddUOMShowModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    form.resetFields();
  };

  const handleUOMEditModal = (record) => {
    // edit the item in your data here
    debugger;
    setUOMData(record);
    setLoading(true);
    setIsEditing(true);
    customAxios
      .get(`${urlGetSelectedUOMDetails}?UOMId=${record.UomId}`)
      .then((response) => {
        if (response.data !== null) {
          const uomData = response.data.data;
          setUOMData(uomData);
          setIsModalOpen(true);
          form.setFieldsValue({
            ShortName: uomData.ShortName,
            LongName: uomData.LongName,
          });
          setLoading(false);
        }
      });
  };

  const handleUOMModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    debugger;
    form.validateFields();
    const values = form.getFieldsValue();
    console.log("Look up  Edit Modal Submit", values);

    const uom = isEditing
      ? {
          UOMID: UOMData.UomId,
          ShortName: values.ShortName,
          LongName: values.LongName,
        }
      : {
          UOMID: 0,
          ShortName: values.ShortName,
          LongName: values.LongName,
        };

    try {
      // Send a POST request to the server
      const response = await customAxios.post(urlAddAndUpdateUOM, uom, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.data !== null) {
        setIsModalOpen(false);
        const uomDetails = response.data.data.UOMModel.map((obj, index) => {
          return { ...obj, key: index + 1 };
        });
        setColumnData(uomDetails);
        {
          isEditing
            ? notification.success({
                message: "UOM details updated Successfully",
              })
            : notification.success({
                message: "UOM details added Successfully",
              });
        }
      }
    } catch (error) {
      console.error("Failed to send data to server: ", error);

      {
        isEditing
          ? notification.error({
              message: "Editing UOM details UnSuccessful",
            })
          : notification.error({
              message: "Adding UOM details UnSuccessful",
            });
      }
    }
  };


  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Short Name",
      dataIndex: "ShortName",
      key: "ShortName",
    },
    {
      title: "Long Name",
      dataIndex: "LongName",
      key: "LongName",
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
                Unit Of Measurement (UOM) Manager
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button icon={<PlusCircleOutlined />} onClick={handleAddUOMShowModal}>
                Add New UOM
              </Button>
            </Col>
          </Row>

          <Spin spinning={loading}>
            <CustomTable
              columns={columns}
              dataSource={columnData}
              actionColumn={true}
              isFilter={true}
              onEdit={handleUOMEditModal}
              onDelete={handleDelete}
            />
          </Spin>
          <Modal
            title="Add New UOM"
            open={isModalOpen}
            maskClosable={false}
            footer={null}
            onCancel={handleUOMModalCancel}
          >
            <Form
              style={{ margin: "1rem 0" }}
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
            >
              <Form.Item
                name="ShortName"
                label="Short Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter Short Name",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="LongName"
                label="Long Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter Long Name",
                  },
                ]}
              >
                <Input style={{ width: "100%" }}  />
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
                    <Button type="default" onClick={handleUOMModalCancel}>
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

export default UOM;
