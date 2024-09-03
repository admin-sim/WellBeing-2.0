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
  message,
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
import PageHeader from "../../../components/PageHeader";

function UOM() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [UOMData, setUOMData] = useState();
  const [isEditing, setIsEditing] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [IsSubmitClicked, setIsSubmitClicked] = useState(false);

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
    form.validateFields();
    setIsSubmitClicked(true);
    const values = form.getFieldsValue();
    console.log("Look up  Edit Modal Submit", values);

    if (values.ShortName !== undefined && values.LongName !== undefined) {
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

        if (response.data !== null) {
          if (response.data === "Already Exists") {
            // setIsModalOpen(false);
            setIsSubmitClicked(false);
            messageApi.warning({
              // type: "warning",
              content: `UOM already exists`,
            });
          } else if (response.data.data !== null) {
            setIsSubmitClicked(false);
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
          } else {
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
        }
      } catch (error) {
        console.error("Failed to send data to server: ", error);
      }
    } else {
      setIsSubmitClicked(false);
    }
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
      width: 80,
    },
    {
      title: "Short Name",
      dataIndex: "ShortName",
      key: "ShortName",
      width: 120,
    },
    {
      title: "Long Name",
      dataIndex: "LongName",
      key: "LongName",
      width: 180,
    },
  ];

  return (
    <>
      <Layout
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader
          title={"Unit Of Measurement (UOM) Manager"}
          buttonLabel={"Add New UOM"}
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={handleAddUOMShowModal}
        />
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
        {contextHolder}
        <Modal
          title={isEditing ? "Edit UOM" : "Add New UOM"}
          open={isModalOpen}
          maskClosable={false}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={IsSubmitClicked}
              onClick={handleSubmit}
            >
              {isEditing ? "Update" : "Submit"}
            </Button>,
            <Button key="back" danger onClick={handleUOMModalCancel}>
              Cancel
            </Button>,
          ]}
          onCancel={handleUOMModalCancel}
        >
          <Form
            style={{ margin: "1rem 0" }}
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            //disabled={IsSubmitClicked}
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
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </>
  );
}

export default UOM;
