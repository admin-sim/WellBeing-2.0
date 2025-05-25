import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";

function EditParameterSetupModal({ open, handleClose, handleSubmit, record }) {
  const [form] = Form.useForm();
  const [parameterOptions, setParameterOptions] = useState([]);

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ParameterId: record.ParameterId,
        ParameterName: record.ParameterName,
        ParameterValueId: record.ParameterValueId,
        ParameterValue: record.ParameterValueName,
        FacilityId: record.FacilityId,
      });

      // Determine the options based on the current ParameterValueName
      let options = [];
      if (
        ["Maximum Occupied Bed", "Highest Bed Category", "Actual Prorated"].includes(
          record.ParameterValueName
        )
      ) {
        options = [
          { value: "Maximum Occupied Bed", label: "Maximum Occupied Bed" },
          { value: "Highest Bed Category", label: "Highest Bed Category" },
          { value: "Actual Prorated", label: "Actual Prorated" },
        ];
      } else if (["60", "30", "90"].includes(record.ParameterValueName)) {
        options = [
          { value: "60", label: "60" },
          { value: "30", label: "30" },
          { value: "90", label: "90" },
        ];
      } else if (["24hr", "48hr", "36hr"].includes(record.ParameterValueName)) {
        options = [
          { value: "24hr", label: "24hr" },
          { value: "36hr", label: "36hr" },
          { value: "48hr", label: "48hr" },
        ];
      } else if (["Yes", "No"].includes(record.ParameterValueName)) {
        options = [
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ];
      }
      setParameterOptions(options);
    } else {
      form.resetFields();
      setParameterOptions([]);
    }
  }, [record, form]);

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  const onFinish = (values) => {
    // Ensure all required fields are passed to handleSubmit
    const updatedRecord = {
      ...record, // Retain all original values
      ...values, // Merge with updated form values
    };

    handleSubmit(updatedRecord);
  };

  return (
    <Modal
      title={<PageHeader title="Edit Parameter Setup" button={false} />}
      open={open}
      maskClosable={false}
      footer={null}
      onCancel={handleCancel}
    >
      <Form
        style={{ margin: "1rem 0" }}
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        {/* Hidden field for ParameterId */}
        <Form.Item name="ParameterId" hidden>
          <Input />
        </Form.Item>

        {/* Hidden field for FacilityId */}
        <Form.Item name="FacilityId" hidden>
          <Input />
        </Form.Item>

        <Row gutter={32}>
          <Col span={24}>
            <Form.Item
              name="ParameterName"
              label="Parameter Name"
              rules={[{ required: true, message: "Please enter Parameter Name" }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>

          {/* Hidden field for ParameterValueId */}
          <Form.Item name="ParameterValueId" hidden>
            <Input />
          </Form.Item>

          <Col span={24}>
            <Form.Item
              name="ParameterValue"
              label="Parameter Value"
              rules={[{ required: true, message: "Please select a Parameter Value" }]}
            >
              <Select options={parameterOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={32} justify="end">
          <Col>
            <Form.Item>
              <Button size="middle" type="primary" htmlType="submit" style={{ marginRight: "1rem" }}>
                Update
              </Button>
              <Button size="middle" type="default" danger onClick={handleCancel}>
                Cancel
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default EditParameterSetupModal;
