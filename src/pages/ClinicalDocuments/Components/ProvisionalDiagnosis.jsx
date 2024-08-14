import { Button, Col, Form, Input, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";
import { FaHistory } from "react-icons/fa";

function ProvisionalDiagnosis() {
  const [form] = useForm();
  return (
    <>
      <span style={{ fontSize: "1rem", fontWeight: 600 }}>
        Provisional Diagnosis
      </span>
      <Row>
        <Col span={18} style={{ margin: "1rem" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              onSubmit(values);
            }}
          >
            <Form.Item
              name="provisional"
              label={
                <div>
                  <span style={{ fontSize: "0.9rem" }}>
                    Type at least 3 Characters
                  </span>
                  &nbsp;
                  <span style={{ fontSize: "0.7rem" }}>Eg. aleu</span>
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter valid input for height",
                },
              ]}
            >
              <Select
                allowClear
                loading={true}
                size="middle"
                style={{ width: "60%" }}
                placeholder="Search and Add"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" size="middle" htmlType="submit">
                Save Provisional Diagnosis
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col
          span={5}
          style={{
            margin: "0 0 0 0.5rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            style={{ borderRadius: "1rem" }}
            size="middle"
            className="d-flex allignCenter"
            disabled
          >
            Previous Provisional Diagnosis
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default ProvisionalDiagnosis;
