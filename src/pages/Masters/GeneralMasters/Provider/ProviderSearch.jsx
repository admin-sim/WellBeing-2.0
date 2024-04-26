import {
  PlusCircleFilled,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import { useNavigate } from "react-router-dom";
import React from "react";

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

function ProviderSearch() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const handleOnFinish = async (values) => {
    console.log("Received values from form: ", values);
  };
  const handleReset = () => {
    form.resetFields();
  };
  const handleNameClick = (record) => {
    navigate("/Provider/Edit", { state: { record } });
  };

  const data = [
    {
      key: 1,
      SlNo: 1,
      DOB: "27/09/1980",
      Name: { Name: "Admin" },
      Gender: "Male",
      ContactDetails: {
        Mobile: "9834567890",
        Landline: "080123456",
        Email: "example@email.com",
      },
      IdentifierType: "Pan Card",
    },
    {
      key: 2,
      SlNo: 2,
      DOB: "28/09/2023",
      Gender: "Female",
      Name: { Name: "Kiran" },
      ContactDetails: {
        Mobile: "9834567890",
        Landline: "080123456",
        Email: "example@email.com",
      },
      IdentifierType: "Aadhar Card",
    },
  ];

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "SlNo",
      key: "SlNo",
      width: 70,
    },

    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      width: 300,
      render: (Name, record) => (
        <>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              handleNameClick(record);
            }}
          >
            {Name?.Name}
          </a>
        </>
      ),
    },

    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
      width: 150,
    },

    {
      title: "DOB",
      dataIndex: "DOB",
      key: "DOB",
      width: 150,
    },
    {
      title: "Identifier Type",
      dataIndex: "IdentifierType",
      key: "IdType",
      width: 250,
    },
    {
      title: "Contact Details",
      dataIndex: "ContactDetails",
      key: "ContactDetails",
      width: 300,
      render: (contact) => (
        <div>
          <p>
            <strong>Mobile : </strong> {contact?.Mobile}
            <br />
            <strong>Landline : </strong>
            {contact?.Landline}
            <br />
            <strong>Email : </strong>
            {contact?.Email}
          </p>
        </div>
      ),
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
                Provider Search
              </Title>
            </Col>
            <Col offset={4} span={4}>
              <Button
                className="dfja"
                icon={<PlusCircleOutlined style={{ fontSize: "1.1rem" }} />}
                onClick={() => navigate("/ProviderRegistration")}
              >
                Register New Provider
              </Button>
            </Col>
          </Row>
          <Form
            layout="vertical"
            form={form}
            name="register"
            onFinish={handleOnFinish}
            scrollToFirstError={true}
            style={{ padding: "0rem 2rem", marginTop: "1rem" }}
          >
            <Row gutter={32}>
              <Col span={6}>
                <Form.Item name="Name" label="Name">
                  <Select
                    placeholder="Select Value"
                    options={options}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="ProviderName" label="Provider Name">
                  <Input placeholder="Enter Provider Name" allowClear />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="date" label="Date Of Birth">
                  <DatePicker
                    style={{ width: "100%" }}
                    format={"DD-MM-YYYY"}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="Gender" label="Gender">
                  <Select
                    placeholder="Select Gender"
                    options={options}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={6}>
                <Form.Item name="id" label="Identifier Type">
                  <Select
                    placeholder="Select Value"
                    options={options}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="idValue" label="ID Value">
                  <Input placeholder="Enter Provider Name" allowClear />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="MobileNumber"
                  label="Mobile Number"
                  rules={[
                    {
                      pattern: new RegExp(/^(\+\d{1,3})?\d{10,12}$/),
                      message: "Invalid mobile number!",
                    },
                  ]}
                >
                  <Input maxLength={10} />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="StructuralRole" label="Structural&nbsp;Role">
                  <Select
                    placeholder="Select Value"
                    options={options}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="ConsultantType" label="Consultant&nbsp;Type">
                  <Select
                    placeholder="Select Value"
                    options={options}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col style={{ marginRight: "10px" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Search
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="default" danger onClick={handleReset}>
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div style={{ margin: "0 2rem" }}>
            <Table size="small" columns={columns} dataSource={data} />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default ProviderSearch;
