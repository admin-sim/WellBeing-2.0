import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import { Button, Checkbox, Col, Form, Input, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useLocation, useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import CustomTable from "../../../../components/customTable";
import {
  ColWithEightSpan,
  ColWithSixSpan,
} from "../../../../components/customGridColumns";
import { BsFillPlusSquareFill } from "react-icons/bs";

function CreateEditDischargeClearanceSetup() {
  const [form] = useForm();
  const [tableData, setTableData] = useState([
    {
      ApplicableRoles: "Admin",
    },
  ]);

  const location = useLocation();

  const record = location.state;
  const navigate = useNavigate();
  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const columns = [
    {
      title: "Applicable Roles",
      dataIndex: "ApplicableRoles",
      key: "1",
      width: 150,
      render: (_, row) => (
        <Select
          style={{ width: "100%" }}
          defaultValue={_}
          //   onChange={handleChange}
          options={[
            {
              value: "Active",
              label: "Active",
            },
            {
              value: "Hidden",
              label: "Hidden",
            },
          ]}
        />
      ),
    },
  ];

  function handleSubmit(values) {
    console.log(values);
  }

  function handleDelete() {
    // const newArray = tableData.pop();
    // setTableData(newArray);
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader
          title={
            record
              ? "Edit Discharge Clearance Setup"
              : "Create Discharge Clearance Setup"
          }
          button={false}
        />
        <Form
          style={{ margin: "1rem" }}
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <ColWithEightSpan>
              <Form.Item
                name="ShortName"
                label="Short Name"
                rules={[{ required: true, message: "Please enter Short Name" }]}
              >
                <Select />
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item
                name="LongName"
                label="Long Name"
                rules={[{ required: true, message: "Please enter Long Name" }]}
              >
                <Select />
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item name="Remarks" label="Remarks">
                <TextArea rows={2} />
              </Form.Item>
            </ColWithEightSpan>
            <ColWithSixSpan>
              <Form.Item
                name="ClearanceType"
                label="Clearance Type"
                rules={[
                  {
                    required: true,
                    message: "Please select Clearance Type",
                  },
                ]}
              >
                <Select />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="ClearanceSequence" label="Clearance Sequence">
                <Input />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Status" label="Status">
                <Select />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="PatientType" label="Patient Type">
                <Select />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="SelfAccess">
                <Checkbox>Is Self Access Only</Checkbox>
              </Form.Item>
            </ColWithSixSpan>
          </Row>
          <Row gutter={16}>
            <ColWithEightSpan>
              <CustomTable
                columns={columns}
                dataSource={tableData}
                onDelete={handleDelete}
                actionColumnName={
                  <Button
                    type="link"
                    icon={
                      <BsFillPlusSquareFill
                        style={{ fontSize: "1.5rem" }}
                        onClick={() => {
                          setTableData([
                            ...tableData,
                            { ApplicableRoles: "Admin" },
                          ]);
                        }}
                      />
                    }
                  />
                }
              />
            </ColWithEightSpan>
          </Row>

          <Row gutter={16} justify="end">
            <Col>
              <Form.Item>
                <Button
                  size="middle"
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "1rem" }}
                >
                  {record ? "Update" : "Save"}
                </Button>
                <Button
                  size="middle"
                  type="default"
                  danger
                  onClick={() => navigate("/DischargeClearanceSetup")}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}

export default CreateEditDischargeClearanceSetup;
