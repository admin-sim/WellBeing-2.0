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
import React, { useEffect, useState } from "react";
import customAxios from "../../../../components/customAxios/customAxios";
import {
  urlSearchPayerRecord,
  urlGetPayerViewModel,
} from "../../../../../endpoints";

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

function PayerSearch() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isloading, setLoading] = useState(true);
  const [payerDropdown, setPayerDropdown] = useState({
    PayerIdentificationType: [],
    PayerTypes: [],
  });
  const [payerSearchDetails, setPayerSearchDetails] = useState([]);

  const processPayerData = (payers) => {
    debugger;
    return payers.map((payer) => {
      const combinedIdentifiers = payer.PayerIdentifications.map(
        (identification, index) => {
          return `Identifier ${index + 1}: ${
            identification.IdentificationTypeName
          }`;
        }
      ).join(", ");

      return {
        ...payer,
        combinedIdentifiers,
      };
    });
  };

  useEffect(() => {
    debugger;
    setLoading(true);
    customAxios.get(urlGetPayerViewModel).then((response) => {
      const apiData = response.data.data;
      setPayerDropdown(apiData);
      setLoading(false);
    });
  }, []);

  const handleOnFinish = async (values) => {
    debugger;
    console.log("Received values from form: ", values);

    // ... Repeat for other parameters
    try {
      setLoading(true);

      // Assuming postData1 is an object with your input values
      const postData1 = {
        PayerType: values.PayerType === undefined ? 0 : values.PayerType,
        PayerName: values.PayerName === undefined ? '""' : values.PayerName,
        EffectiveFrom:
          values.EffectiveFrom === undefined ? '""' : values.EffectiveFrom,
        EffectiveTo:
          values.EffectiveTo === undefined ? '""' : values.EffectiveTo,
        IdentifierType:
          values.IdentifierType === undefined ? 0 : values.IdentifierType,
        IdentifierValue:
          values.identifierValue === undefined ? '""' : values.identifierValue,
        MobileNumber:
          values.MobileNumber === undefined ? '""' : values.MobileNumber,
        City: values.City === undefined ? '""' : values.City,
      };
      const response = await customAxios.get(
        `${urlSearchPayerRecord}?PayerTypeId=${postData1.PayerType}&PayerName=${postData1.PayerName}&EffectiveFrom=${postData1.EffectiveFrom}&EffectiveTo=${postData1.EffectiveTo}&IdentifierType=${postData1.IdentifierType}&IdentifierValue=${postData1.IdentifierValue}&MobileNo=${postData1.MobileNumber}&city=${postData1.City}`
      );
      if (response.data !== null) {
        console.log("Response:", response.data);
        //resetForm();
        const payerDetails = response.data.data.Payers.map((obj, index) => {
          return {
            ...obj,
            key: index + 1,
          };
        });
        const finalPayerDetails = processPayerData(payerDetails);
        setPayerSearchDetails(finalPayerDetails);
        setLoading(false);
        form.resetFields();
      }
    } catch (error) {
      // Handle any errors here
      console.error("Error:", error);
    }
    // Reset the form fields
  };

  const handleReset = () => {
    form.resetFields();
  };
 

  const handleEditPayerDetails = (record) => {
    debugger;

    const url = `/PayerRegistration`;

    // Navigate to the new URL
    navigate(url, {
      state: {
        selectedRow: record,
        isEditPayerRegistration: true,
      },
    });
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
      width: 70,
    },

    {
      title: "Payer Type",
      dataIndex: "PayerTypeName",
      key: "PayerTypeName",
      width: 200,
      render: (text, record) => (
        <>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              handleEditPayerDetails(record);
            }}
          >
            {record?.PayerTypeName}
          </a>
        </>
      ),
    },
    {
      title: "Payer Name",
      dataIndex: "PayerName",
      key: "PayerName",
      width: 300,
    },
    {
      title: "Effective From",
      dataIndex: "EffectiveFromDate",
      key: "EffectiveFromDate",
      width: 170,
    },

    {
      title: "Effective To",
      dataIndex: "EffectiveToDate",
      key: "EffectiveToDate",
      width: 150,
    },

    {
      title: "Identifier Type",
      dataIndex: "combinedIdentifiers",
      key: "combinedIdentifiers",
      width: 250,
    },

    {
      title: "Contact Details",
      dataIndex: "ContactDetails",
      key: "ContactDetails",
      width: 300,
      render: (text, record) => (
        <div>
          <p>
            <strong>Mobile : </strong> {record?.MobileNo}
            <br />
            <strong>Landline : </strong>
            {record?.LandlineNo}
            <br />
            <strong>Email : </strong>
            {record?.EmailId}
          </p>
        </div>
      ),
    },
    {
      title: "City",
      dataIndex: "City",
      key: "City",
      width: 150,
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
                Payer Search
              </Title>
            </Col>
            <Col offset={4} span={4}>
              <Button
                className="dfja"
                icon={<PlusCircleOutlined style={{ fontSize: "1.1rem" }} />}
                onClick={() => navigate("/PayerRegistration")}
              >
                Register New Payer
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
                <Form.Item name="PayerType" label="Payer Type">
                  <Select placeholder="Select Value" allowClear>
                    {payerDropdown.PayerTypes.map((response) => (
                      <Select.Option
                        key={response.LookupID}
                        value={response.LookupID}
                      >
                        {response.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="PayerName" label="Payer Name">
                  <Input placeholder="Enter Provider Name" allowClear />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="EffectiveFrom" label="Effective From">
                  <DatePicker
                    style={{ width: "100%" }}
                    format={"DD-MM-YYYY"}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="EffectiveTo" label="Effective To">
                  <DatePicker
                    style={{ width: "100%" }}
                    format={"DD-MM-YYYY"}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={6}>
                <Form.Item name="IdentifierType" label="Identifier Type">
                  <Select placeholder="Select Value" allowClear>
                    {payerDropdown.PayerIdentificationType.map((response) => (
                      <Select.Option
                        key={response.LookupID}
                        value={response.LookupID}
                      >
                        {response.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="identifierValue" label="Identifier Value">
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
              <Col span={6}>
                <Form.Item name="City" label="City">
                  <Input placeholder="Enter City Name" allowClear />
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
            <Table
              size="small"
              columns={columns}
              dataSource={payerSearchDetails}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default PayerSearch;
