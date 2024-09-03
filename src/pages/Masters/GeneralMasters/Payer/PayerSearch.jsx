import { PlusCircleOutlined } from "@ant-design/icons";
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
import CustomTable from "../../../../components/customTable/index";
import PageHeader from "../../../../components/PageHeader";
import { ColWithSixSpan } from "../../../../components/customGridColumns";

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
    setLoading(true);
    customAxios.get(urlGetPayerViewModel).then((response) => {
      const apiData = response.data.data;
      setPayerDropdown(apiData);
      setLoading(false);
    });
  }, []);

  const handleOnFinish = async (values) => {
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
      width: 80,
    },

    {
      title: "Payer Type",
      dataIndex: "PayerTypeName",
      key: "PayerTypeName",
      width: 120,
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
      width: 250,
    },
    {
      title: "Effective From",
      dataIndex: "EffectiveFromDate",
      key: "EffectiveFromDate",
      width: 130,
    },

    {
      title: "Effective To",
      dataIndex: "EffectiveToDate",
      key: "EffectiveToDate",
      width: 130,
    },

    {
      title: "Identifier Type",
      dataIndex: "combinedIdentifiers",
      key: "combinedIdentifiers",
      width: 150,
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
      width: 130,
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
          <PageHeader
            title={"Payer Search"}
            buttonLabel={"Register New Payer"}
            buttonIcon={<PlusCircleOutlined style={{ fontSize: "1.1rem" }} />}
            onButtonClick={() => navigate("/PayerRegistration")}
          />
          <Form
            layout="vertical"
            form={form}
            onFinish={handleOnFinish}
            scrollToFirstError={true}
            style={{ margin: "1rem" }}
          >
            <Row gutter={16}>
              <ColWithSixSpan>
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
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="PayerName" label="Payer Name">
                  <Input placeholder="Enter Provider Name" allowClear />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="EffectiveFrom" label="Effective From">
                  <DatePicker
                    style={{ width: "100%" }}
                    format={"DD-MM-YYYY"}
                    allowClear
                  />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="EffectiveTo" label="Effective To">
                  <DatePicker
                    style={{ width: "100%" }}
                    format={"DD-MM-YYYY"}
                    allowClear
                  />
                </Form.Item>
              </ColWithSixSpan>

              <ColWithSixSpan>
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
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="identifierValue" label="Identifier Value">
                  <Input placeholder="Enter Provider Name" allowClear />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
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
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="City" label="City">
                  <Input placeholder="Enter City Name" allowClear />
                </Form.Item>
              </ColWithSixSpan>
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

          <CustomTable
            size="small"
            columns={columns}
            dataSource={payerSearchDetails}
            actionColumn={false}
          />
        </div>
      </Layout>
    </>
  );
}

export default PayerSearch;
