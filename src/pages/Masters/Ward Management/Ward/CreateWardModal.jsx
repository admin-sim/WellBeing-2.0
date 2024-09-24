import { FlagFilled } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";

function CreateWardModal({ open, handleClose, Dropdown, handleSubmit, record }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record)
      // form.setFieldsValue({
      //   WardID: record.WardID,
      //   WardCode: record.WardCode,
      //   WardName: record.WardName,
      //   ServiceLocation: record.ServiceLocationID,
      //   Gender: record.GenderID,
      //   WardCategory: record.WardCategoryID,
      //   Status: record.ActiveFlag
      // });
    } else {
      form.resetFields();
    }
  }, [record]);

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  return (
    <div>
      <Modal
        title={record ? "Edit Ward" : "Create Ward"}
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
        width="40%"
      >
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                name="WardCode"
                label="Ward Code"
                rules={[{ required: true, message: "Please enter Ward Code " }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="WardID" hidden
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="WardName"
                label="Ward Name"
                rules={[{ required: true, message: "Please enter Ward Name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="WardCategory"
                label="Ward Category"
                rules={[
                  { required: true, message: "Please Select WardCategory" },
                ]}
              >
                <Select>
                  {Dropdown.WardCategory.map((option) => (
                    <Select.Option key={option.LookupID} value={option.LookupID}>
                      {option.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ServiceLocation"
                label="Service Location"
                rules={[
                  { required: true, message: "Please select Service Location" },
                ]}
              >
                <Select>
                  {Dropdown.FacilityDeptServiceLocation.map((option) => (
                    <Select.Option key={option.FacilityDepartmentServiceLocationId} value={option.FacilityDepartmentServiceLocationId}>
                      {option.ServiceLocationName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Gender"
                label="Gender"
                rules={[{ required: true, message: "Please select Gender" }]}
              >
                <Select>
                  {(Dropdown.Gender || []).map((item) => (
                    <Select.Option key={item.LookupID} value={item.LookupID}>
                      {item.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Status"
                label="Status"
                rules={[{ required: true, message: "Please select Status" }]}
              >
                <Select>
                  <Select.Option key={true} value={true}>Active</Select.Option>
                  <Select.Option key={false} value={false}>Hidden</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32} justify="end" style={{ marginBottom: "-2rem" }}>
            <Col>
              <Form.Item>
                <Button
                  size="middle"
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "1rem" }}
                >
                  Submit
                </Button>
                <Button
                  size="middle"
                  type="default"
                  danger
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div >
  );
}

export default CreateWardModal;
