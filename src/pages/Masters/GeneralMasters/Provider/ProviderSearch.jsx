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
import {
  urlGetProviderDetails,
  urlSearchProviderRecords,
} from "../../../../../endpoints.js";
import Title from "antd/es/typography/Title";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";




const containsDropdown = [
  { id: "1", name: "Starts With" },
  { id: "2", name: "Ends With" },
  { id: "3", name: "Sounds Like" },
  { id: "4", name: "Anywhere" },
];

function ProviderSearch() {
  const [providerDropdown, setProviderDropdown] = useState({
    Titles: [],
    Genders: [],
    StructuralRoles: [],
    ConsultantType: [],
    ProviderCredentialType: [],
    ProviderIdentificationType: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [providerSearchDetails, setProviderSearchDetails] = useState([]);

  const handleReset = () => {
    form.resetFields();
  };
 

  const handleEditRegistrationsDetails = (record) => {
    debugger;

    const url = `/ProviderRegistration`;

    // Navigate to the new URL
    navigate(url, {
      state: {
        selectedRow: record,
        isEditProviderRegistration: true,
      },
    });
  };

  useEffect(() => {
    debugger;
    setIsLoading(true);
    customAxios.get(urlGetProviderDetails).then((response) => {
      const apiData = response.data.data;
      setProviderDropdown(apiData);
      setIsLoading(false);
    });
  }, []);


  const processProviderData = (providers) => {
    debugger;
    return providers.map(provider => {
      const combinedIdentifiers = provider.ProviderIdentifications.map((identification, index) => {
        return `Identifier ${index + 1}: ${identification.IdentificationTypeName}`;
      }).join(', ');
  
      return {
        ...provider,
        combinedIdentifiers,
      };
    });
  };

  const handleOnSearch = async (values) => {
    debugger;

    console.log("Search by these values", values);

    // ... Repeat for other parameters
    try {
      setIsLoading(true);

      // Assuming postData1 is an object with your input values
      const postData1 = {
        NameFilterType:
          values.NameFilterType === undefined ? 0 : values.NameFilterType,
        ProviderName:
          values.ProviderName === undefined ? '""' : values.ProviderName,
        Dob: values.date === undefined ? '""' : values.date,
        Gender: values.Gender === undefined ? 0 : values.Gender,
        IdentifierType:
          values.identifierTypeId === undefined ? 0 : values.identifierTypeId,
        IdentifierTypeValue:
          values.identifierValue === undefined ? '""' : values.identifierValue,
        MobileNumber:
          values.MobileNumber === undefined ? '""' : values.MobileNumber,
        StructuralRole:
          values.StructuralRole === undefined ? 0 : values.StructuralRole,
        ConsultantType:
          values.ConsultantType === undefined ? 0 : values.ConsultantType,
      };
      const response = await customAxios.get(
        `${urlSearchProviderRecords}?NameFilterType=${postData1.NameFilterType}&ProviderName=${postData1.ProviderName}&Dob=${postData1.Dob}&Gender=${postData1.Gender}&IdentifierType=${postData1.IdentifierType}&IdentifierTypeValue=${postData1.IdentifierTypeValue}&MobileNumber=${postData1.MobileNumber}&StructuralRole=${postData1.StructuralRole}&ConsultantType=${postData1.ConsultantType}`
      );
      if (response.data !== null) {
        console.log("Response:", response.data);
        //resetForm();
        const providerDetails = response.data.data.Providers.map(
          (obj, index) => {
            return {
              ...obj,
              key: index + 1,
              // IdentifierType:
              //   response.data.data.Providers.ProviderIdentifications.map(
              //     (id) => id.IdentifierType
              //   ).join(", "),
            };
          }
        );
        const finalProviderDetails = processProviderData(providerDetails)
        setProviderSearchDetails(finalProviderDetails);
        setIsLoading(false);
        form.resetFields();
      }
    } catch (error) {
      // Handle any errors here
      console.error("Error:", error);
    }
    // Reset the form fields
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
      width: 70,
    },

    {
      title: "Name",
      dataIndex: "ProviderName",
      key: "ProviderName",
      width: 300,
      render: (Text, record) => (
        <>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              handleEditRegistrationsDetails(record);
            }}
          >
            {record?.ProviderName}
          </a>
        </>
      ),
    },

    {
      title: "Gender",
      dataIndex: "GenderType",
      key: "GenderType",
      width: 150,
    },

    {
      title: "DOB",
      dataIndex: "DateOfBirth",
      key: "DateOfBirth",
      width: 150,
    },
    {
      title: "Identifier Type",
      dataIndex: "combinedIdentifiers",
      key: "combinedIdentifiers",
      width: 250,
      // render: (record) => (
      //   <ul>
      //     {providerSearchDetails.ProviderIdentifications.map((id, index) => (
      //       <li key={index}>{id.IdentifierType}</li>
      //     ))}
      //   </ul>
      // ),
    },
    {
      title: "Contact Details",
      dataIndex: "ContactDetails",
      key: "ContactDetails",
      width: 300,
      render: (text, record) => (
        <div>
          <p>
            <strong>Mobile : </strong> {record?.MobileNumber}
            <br />
            <strong>Landline : </strong>
            {record?.LandlineNumber}
            <br />
            <strong>Email : </strong>
            {record?.EmailId}
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
            onFinish={handleOnSearch}
            scrollToFirstError={true}
            style={{ padding: "0rem 2rem", marginTop: "1rem" }}
          >
            <Row gutter={32}>
              <Col span={6}>
                <Form.Item name="NameFilterType" label="Name">
                  <Select placeholder="Select Value" allowClear>
                    {containsDropdown.map((option) => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.name}
                      </Select.Option>
                    ))}
                  </Select>
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
                  <Select placeholder="Select Gender" allowClear>
                    {providerDropdown.Genders.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={6}>
                <Form.Item name="identifierTypeId" label="Identifier Type">
                  <Select placeholder="Select Value" allowClear>
                    {providerDropdown.ProviderIdentificationType.map(
                      (option) => (
                        <Select.Option
                          key={option.LookupID}
                          value={option.LookupID}
                        >
                          {option.LookupDescription}
                        </Select.Option>
                      )
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="identifierValue" label="ID Value">
                  <Input placeholder="Enter Provider Name" allowClear />
                </Form.Item>
              </Col>
              <Col span={3}>
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
                <Form.Item name="StructuralRole" label="Structural&nbsp;Role">
                  <Select placeholder="Select Value" allowClear>
                    {providerDropdown.StructuralRoles.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="ConsultantType" label="Consultant&nbsp;Type">
                  <Select placeholder="Select Value" allowClear>
                    {providerDropdown.ConsultantType.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                        option={option}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
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
              dataSource={providerSearchDetails}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default ProviderSearch;
