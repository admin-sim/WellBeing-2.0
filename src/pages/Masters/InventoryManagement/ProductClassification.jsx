import React, { useState, useEffect } from "react";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";

import {
  Typography,
  Modal,
  ConfigProvider,
  Select,
  Button,
  Form,
  Input,
  Row,
  Col,
  Popconfirm,
  Table,
  message,
  Layout,
} from "antd";

import {
  urlProductClassificationIndex,
  urlGetList,
  urlSaveNewProductClassification,
  urlUpdateProductClassification,
  urlShowEditClassification,
  urlDeleteProductClassification,
} from "../../../../endpoints";

import { useNavigate } from "react-router";
import FormItem from "antd/es/form/FormItem/index.js";
import PageHeader from "../../../components/PageHeader/index.jsx";
import CustomTable from "../../../components/customTable/index.jsx";
import { ColWithEightSpan } from "../../../components/customGridColumns/index.jsx";

const ProductClassification = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const { Title } = Typography;
  const [dPPData, setDPPData] = useState([]);
  const [productGroup, setProductGroup] = useState();
  const [productGroupId, setProductGroupId] = useState();
  const [classificationAction, setClassificationAction] = useState();
  const [showTable, setShowTable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [dropDown, setDropDown] = useState({ ProductGroup: [] });
  const [activeButton, setActiveButton] = useState(null);
  const { TextArea } = Input;

  useEffect(() => {
    try {
      customAxios.get(urlProductClassificationIndex, {}).then((response) => {
        const apiData = response.data.data;
        setDropDown(apiData);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
  }, []);

  const onclick = (values, index) => {
    try {
      customAxios
        .get(`${urlGetList}?ProductGroupId=${values}`, null, {
          params: values,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setShowTable(true);
          setProductGroup(
            response.data.data.ProductGroupName.LookupDescription
          );
          setProductGroupId(
            response.data.data.NewProductClassificationModel.ProductGroupId
          );
          setDPPData(response.data.data.ProductClassification);
          setActiveButton(index);
        });
    } catch (error) { }
  };

  const ModelAdd = () => {
    setButtonTitle("Save");
    setIsModalOpen(true);
    setClassificationAction("Add Product Classification");
  };

  const ModelUpdate = (ProductClassificationId) => {
    customAxios
      .get(
        `${urlShowEditClassification}?ProductClassificationId=${ProductClassificationId}`
      )
      .then((response) => {
        const apiData = response.data.data;
        setButtonTitle("Update");
        setIsModalOpen(true);
        form1.setFieldsValue({
          ProductClassificationId:
            apiData.NewProductClassificationModel.ProductClassificationId,
        });
        form1.setFieldsValue({
          ShortName: apiData.NewProductClassificationModel.ShortName,
        });
        form1.setFieldsValue({
          LongName: apiData.NewProductClassificationModel.LongName,
        });
        form1.setFieldsValue({
          Status: apiData.NewProductClassificationModel.Status,
        });
        form1.setFieldsValue({
          Remarks:
            apiData.NewProductClassificationModel.Remarks === ""
              ? null
              : apiData.NewProductClassificationModel.Remarks,
        });
      });
  };

  const ModelDelete = (ProductClassificationId) => {
    customAxios
      .post(
        `${urlDeleteProductClassification}?ProductClassificationId=${ProductClassificationId}&ProductGroupId=${productGroupId}`
      )
      .then((response) => {
        const apiData = response.data;
        if (apiData === "Failure") {
          setIsModalOpen(false);
          message.error("Failure");
        } else if (apiData === "Already Exists") {
          setIsModalOpen(false);
          message.warning("Already Exists");
        } else {
          setIsModalOpen(false);
          form1.resetFields();
          setDPPData(response.data.data.ProductClassification);
          message.success("Deleted Successfully");
        }
      });
  };

  const columns = [
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
      width: 120,
    },
    {
      title: "Product Group",
      dataIndex: "ProductGroup",
      key: "ProductGroup",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      width: 100,
      render: (text, record) => {
        if (text === true) {
          return "Active";
        }
      },
    },
    // {
    //   title: (
    //     <Button
    //       type="primary"
    //       icon={<PlusOutlined />}
    //       onClick={ModelAdd}
    //     ></Button>
    //   ),
    //   // dataIndex: 'add',
    //   // key: 'add',
    //   width: 50,
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <EditOutlined onClick={() => ModelUpdate(record.ProductClassificationId)} />
    //         <Popconfirm
    //           title="Sure to delete?"
    //           onConfirm={() => ModelDelete(record.ProductClassificationId)}
    //         >
    //           <DeleteOutlined />
    //         </Popconfirm>
    //       </>
    //     );
    //   },
    // },
  ];

  const onReset = () => {
    form.resetFields();
  };
  const navigate = useNavigate();
  const handleVendor = (VendorId) => {
    navigate("/Vendor", { state: { VendorId } });
  };

  const onOkModal = () => {
    form1.submit();
  };

  const onCancelModel = () => {
    setIsModalOpen(false);
    form1.resetFields();
  };

  const onFinishModel = (values) => {
    if (values.ProductClassificationId === undefined) {
      customAxios
        .post(
          `${urlSaveNewProductClassification}?ShortName=${values.ShortName}&LongName=${values.LongName}&ProductGroupId=${values.ProductGroupId}&Remarks=${values.Remarks}&Status=${values.Status}`
        )
        .then((response) => {
          const apiData = response.data;
          if (apiData === "Failure") {
            setIsModalOpen(false);
            message.error("Failure");
          } else if (apiData === "Already Exists") {
            setIsModalOpen(false);
            message.warning("Already Exists");
          } else {
            setIsModalOpen(false);
            form1.resetFields();
            setDPPData(response.data.data.ProductClassification);
            message.success("Saved Successfully");
          }
        });
    } else {
      customAxios
        .post(
          `${urlUpdateProductClassification}?ProductClassificationId=${values.ProductClassificationId}&LongName=${values.LongName}&ProductGroupId=${values.ProductGroupId}&Remarks=${values.Remarks}&Status=${values.Status}`
        )
        .then((response) => {
          const apiData = response.data;
          if (apiData === "Failure") {
            setIsModalOpen(false);
            message.error("Failure");
          } else if (apiData === "Already Exists") {
            setIsModalOpen(false);
            message.warning("Already Exists");
          } else {
            setIsModalOpen(false);
            form1.resetFields();
            setDPPData(response.data.data.ProductClassification);
            message.success("Updated Successfully");
          }
        });
    }
  };

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title={"Product Classification"} button={false} />

      <Row gutter={32} style={{ margin: "1rem 0 1rem 1rem" }}>
        <Col
          xl={6}
          lg={12}
          md={12}
          xs={24}
          span={24}
          style={{
            width: "100%",
            backgroundColor: "white",
            height: "min-content",
            borderRadius: "10px",
            border: "1px solid grey",
            padding: 0,
          }}
        >
          <Row
            style={{
              padding: "0.3rem 1rem",

              // backgroundColor: "#40A2E3",
              backgroundColor: "lavender",
              borderRadius: "10px 10px 0px 0px ",
            }}
          >
            <Col span={24}>
              <Title
                level={5}
                style={{
                  color: "black",
                  fontWeight: 500,
                  margin: 0,
                  paddingTop: 0,
                }}
              >
                Product Group
              </Title>
            </Col>
          </Row>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "flex-start",
              padding: "1rem 0",
            }}
          >
            <ConfigProvider
              theme={{
                token: {
                  colorLink: "#000",
                  colorLinkActive: "#0958d9",
                  colorLinkHover: "#69b1ff",
                },
              }}
            >
              {dropDown.ProductGroup.map((item, index) => (
                <Button
                  icon={<DoubleRightOutlined />}
                  key={item.LookupID}
                  style={{
                    color:
                      activeButton === index
                        ? "#40A2E3"
                        : "rgba(0, 0, 0, 0.65)",
                    fontWeight: activeButton === index ? "bold" : "normal",
                  }}
                  type="link"
                  onClick={() => onclick(item.LookupID, index)}
                >
                  {item.LookupDescription}
                </Button>
              ))}
            </ConfigProvider>
          </div>
        </Col>
        <Col
          xl={18}
          span={24}
          style={{
            marginTop: "1rem",
            padding: 0,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {showTable && (
            <>
              <h4 style={{ margin: "0 0 0 0.5rem" }}>{productGroup}</h4>
              <CustomTable
                dataSource={dPPData}
                columns={columns}
                actionColumnName={<Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={ModelAdd}
                ></Button>}
                onEdit={(record) => ModelUpdate(record.ProductClassificationId)}
                onDelete={(record) =>
                  ModelDelete(record.ProductClassificationId)
                }
              />
            </>
          )}
        </Col>
      </Row>
      <Modal
        title="Add Product Classification"
        onOk={onOkModal}
        onCancel={onCancelModel}
        open={isModalOpen}
        layout="vertical"
        width={700}
        footer={[
          <Button key="submit" type="primary" onClick={onOkModal}>
            {buttonTitle}
          </Button>,
          <Button key="back" danger onClick={onCancelModel}>
            Close
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          onFinish={onFinishModel}
          form={form1}
          initialValues={{
            Status: true,
            ProductGroupId: productGroupId,
          }}
        >
          Product Group: <strong style={{ margin: "2rem 0 0 0" }}>{productGroup}</strong>
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ margin: "1rem 0 0 0" }}
          >
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Short Name"
                name="ShortName"
                rules={[
                  {
                    required: true,
                    message: "Please input!",
                  },
                ]}
              >
                <Input type="text" disabled={!!form1.getFieldValue('ProductClassificationId')} allowClear></Input>
              </Form.Item>
              <FormItem hidden name="ProductClassificationId">
                <Input></Input>
              </FormItem>
              <FormItem hidden name="ProductGroupId">
                <Input></Input>
              </FormItem>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="Status"
                rules={[
                  {
                    required: true,
                    message: "Please input!",
                  },
                ]}
              >
                <Select>
                  <Option key={true} value={true}>
                    Active
                  </Option>
                  <Option key="false" value="false">
                    Hidden
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Long Name"
                name="LongName"
                rules={[
                  {
                    required: true,
                    message: "Please input!",
                  },
                ]}
              >
                <Input type="text" allowClear></Input>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Remarks"
                name="Remarks"
              >
                <TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ProductClassification;
