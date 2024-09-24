import { Button, Col, Divider, Form, Input, Layout, Row, Select } from "antd";
import React, { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import { FaAnglesLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import PatientHeader from "../../../components/PatientHeader";
import { ColWithSixSpan } from "../../../components/customGridColumns";
import CustomTable from "../../../components/customTable";
import { v4 as uuidv4 } from "uuid";
import { EditOutlined } from "@ant-design/icons";

function PatientRefund() {
  const [refundToField, setRefundToField] = useState(true);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const columns = [
    {
      title: "Payment Type",
      dataIndex: "PaymentType",
      key: uuidv4(),
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: uuidv4(),
    },
    {
      title: "Bank",
      dataIndex: "Bank",
      key: uuidv4(),
    },
    {
      title: "Branch",
      dataIndex: "Branch",
      key: uuidv4(),
    },
    {
      title: "IFSC Code",
      dataIndex: "IfscCode",
      key: uuidv4(),
    },
    {
      title: "Authorization Ref No.",
      dataIndex: "AuthorizationRefNo",
      key: uuidv4(),
    },
    {
      title: "Card/Cheque Number",
      dataIndex: "Card/ChequeNumber",
      key: uuidv4(),
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: uuidv4(),
    },
    {
      title: "Expiry Date",
      dataIndex: "ExpiryDate",
      key: uuidv4(),
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: uuidv4(),
    },
  ];

  const dataSource = [{}];
  return (
    <div>
      <Layout
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader
          title={"Patient Refund"}
          buttonIcon={<FaAnglesLeft style={{ fontSize: "1rem" }} />}
          buttonLabel={"Back"}
          onButtonClick={() => navigate("/Refund")}
        />
        <div style={{ margin: "0 1rem 1rem 1rem" }}>
          <PatientHeader />
          <Divider orientation="left">Patient Banner</Divider>
          <Form
            layout="vertical"
            form={form}
            onFinish={(values) => console.log(values)}
          >
            <Row gutter={16}>
              <ColWithSixSpan>
                <Form.Item
                  name="refundTo"
                  label={
                    <div>
                      <span>Refund To</span>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        style={{ marginLeft: "1rem" }}
                        onClick={() => setRefundToField(!refundToField)}
                      />
                    </div>
                  }
                >
                  <Input disabled={refundToField} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="RefundDate" label="Refund Date">
                  <Input />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="RefundAmount" label="Refund Amount">
                  <Input />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="BalanceAmount" label="Balance Amount">
                  <Input disabled />
                </Form.Item>
              </ColWithSixSpan>
            </Row>
            <Divider orientation="left" style={{ margin: "0" }}>
              Refund Mode
            </Divider>
            <CustomTable
              columns={columns}
              dataSource={dataSource}
              actionColumn={false}
              isFilter={true}
            />
            <Row gutter={16} justify={"end"} style={{ marginRight: "1rem" }}>
              <Col>
                <Form.Item>
                  <Button type="primary">Save</Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button danger>Cancel</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Layout>
    </div>
  );
}

export default PatientRefund;
