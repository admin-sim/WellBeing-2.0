import React, { useState } from "react";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { PlusCircleOutlined } from "@ant-design/icons";
import Layout from "antd/es/layout/layout";
import {
  Typography,
  Select,
  Button,
  Form,
  Input,
  Row,
  Col,
  Card,
  Table,
} from "antd";
import { urlSearchVendor } from "../../../../../endpoints.js";
import { useNavigate } from "react-router";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import { ColWithEightSpan } from "../../../../components/customGridColumns/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";

const VendorSearch = () => {
  const [form] = Form.useForm();
  const [filteredData, setFilteredData] = useState([]);

  const onFinish = (values) => {
    try {
      const postData1 = {
        City: values.City === undefined ? null : values.City,
        ContactName:
          values.ContactPerson === undefined ? null : values.ContactPerson,
        MobileNumber: values.Mobile === undefined ? null : values.Mobile,
        VendorGroup: values.VendorGroup,
        LongName: values.VendorName === undefined ? null : values.VendorName,
      };
      customAxios
        .get(
          `${urlSearchVendor}?LongName=${postData1.LongName}&ContactName=${postData1.ContactName}&VendorGroup=${postData1.VendorGroup}&MobileNumber=${postData1.MobileNumber}&City=${postData1.City}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setFilteredData(
            response.data.data.VendorDetails.map((item, index) => ({
              ...item,
              SlNo: index + 1,
            }))
          );
        });
    } catch (error) {}
  };

  const onReset = () => {
    form.resetFields();
  };
  const navigate = useNavigate();
  const handleVendor = (VendorId) => {
    navigate("/Vendor", { state: { VendorId } });
  };

  const columns = [
    {
      title: "Sl No",
      key: "SlNo",
      dataIndex: "SlNo",
      width: 80,
    },
    {
      title: "Vendor Name",
      dataIndex: "LongName",
      key: "LongName",
      width: 150,
      render: (text, record, index) => {
        return (
          <Button type="link" onClick={() => handleVendor(record.VendorId)}>
            {text}
          </Button>
        );
      },
    },
    {
      title: "Contact Person",
      dataIndex: "ContactPerson",
      width: 150,
      key: "ContactPerson",
    },
    {
      title: "Vendor Group",
      dataIndex: "VendorGroup",
      key: "VendorGroup",
      width: 150,
    },
    {
      title: "Mobile Number",
      dataIndex: "MobileNumber",
      key: "MobileNumber",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "ActiveFlag",
      key: "ActiveFlag",
      width: 80,
      render: (text) => {
        if (text === true) {
          return "Active";
        } else {
          return "Hidden";
        }
      },
    },
  ];

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader
        title={"Vendor Search"}
        buttonLabel={"Add"}
        buttonIcon={<PlusCircleOutlined />}
        onButtonClick={() => handleVendor(0)}
      />

      <Form
        form={form}
        layout="vertical"
        style={{
          margin: "1rem",
        }}
        onFinish={onFinish}
        initialValues={{
          VendorGroup: "Local Suppliers",
        }}
      >
        <Row gutter={16}>
          <ColWithEightSpan>
            <Form.Item label="Vendor Name" name="VendorName">
              <Input type="text" allowClear />
            </Form.Item>
          </ColWithEightSpan>
          <ColWithEightSpan>
            <Form.Item label="Contact Person" name="ContactPerson">
              <Input type="text" allowClear></Input>
            </Form.Item>
          </ColWithEightSpan>
          <ColWithEightSpan>
            <Form.Item name="VendorGroup" label="Vendor Group">
              <Select>
                <Select.Option
                  key="Local Suppliers"
                  value="Local Suppliers"
                ></Select.Option>
                <Select.Option
                  key="Overseas Suppliers"
                  value="Overseas Suppliers"
                ></Select.Option>
              </Select>
            </Form.Item>
          </ColWithEightSpan>
          <ColWithEightSpan>
            <Form.Item name="Mobile" label="Mobile">
              <Input type="text" allowClear></Input>
            </Form.Item>
          </ColWithEightSpan>
          <ColWithEightSpan>
            <Form.Item name="City" label="City">
              <Input type="text" allowClear></Input>
            </Form.Item>
          </ColWithEightSpan>
        </Row>
        <Row justify="end">
          <Col style={{ marginRight: "1rem" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button danger onClick={onReset}>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <CustomTable
        dataSource={filteredData}
        columns={columns}
        actionColumn={false}
        scroll={{
          x: "max-content",
        }}
      />
    </Layout>
  );
};

export default VendorSearch;
