import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import React from "react";

function AddAllocationModal({ open, handleClose, onSubmit }) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  return (
    <div>
      <Modal
        title="Add Allocation Details"
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
        width="40rem"
      >
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={form}
          onFinish={onSubmit}
          onCancel={handleCancel}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Indicator"
                label="Indicator"
                rules={[{ required: true }]}
              >
                <Select />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="Description" label="Description">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="PatientType"
                label="Patient Type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="EncounterId" label="Encounter Id">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Percentage"
                label="Percentage"
                rules={[{ required: true }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="Amount" label="Amount">
                <Input disabled />
                <span style={{ color: "green" }}>
                  (*Note: Amount should be less than or equal to Receipt Amount)
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="Utilized" label="Utilized">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="Balance" label="Balance">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} justify="end" style={{ margin: "0 0 -2rem 0" }}>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button danger onClick={handleCancel}>
                  Close
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default AddAllocationModal;
