import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useLocation, useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import CustomTable from "../../../../components/customTable";

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
      render: (_, row) => (
        <Select
          style={{ width: "50%" }}
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
          style={{ padding: "1rem 1rem 0 1rem" }}
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={32}>
            <Col span={16}>
              <Row gutter={32}>
                <Col span={12}>
                  <Form.Item
                    name="ShortName"
                    label="Short Name"
                    rules={[
                      { required: true, message: "Please enter Short Name" },
                    ]}
                  >
                    <Select />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="LongName"
                    label="Long Name"
                    rules={[
                      { required: true, message: "Please enter Long Name" },
                    ]}
                  >
                    <Select />
                  </Form.Item>
                </Col>
                <Col span={6}>
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
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="ClearanceSequence"
                    label="Clearance Sequence"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="Status" label="Status">
                    <Select />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="PatientType" label="Patient Type">
                    <Select />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="SelfAccess">
                    <Checkbox>Is Self Access Only</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={32}>
                <Col span={12}>
                  <CustomTable
                    columns={columns}
                    dataSource={tableData}
                    onDelete={handleDelete}
                    actionColumnName={
                      <Button
                        type="link"
                        icon={
                          <PlusCircleOutlined
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
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Form.Item name="Remarks" label="Remarks">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={32} justify="end" style={{ margin: "1.5rem 0 0 0" }}>
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
