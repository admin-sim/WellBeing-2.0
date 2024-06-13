import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import React from "react";
const { Text } = Typography;

function BlockBedModal({ bed, open, handleClose }) {
  const [form] = Form.useForm();
  console.log("bed info", bed);
  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  return (
    <div>
      <Modal
        title={
          <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>
            Block Bed
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <Text> Ward / Bed : </Text>
        <Text type="danger">
          {bed.ward} / {bed.name}
        </Text>
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={form}
          onFinish={(values) => {
            console.log(values);
            handleClose();
          }}
        >
          <Form.Item
            style={{ marginBottom: "0.5rem" }}
            name="BlockReason"
            label="Reason For Block"
            rules={[
              {
                required: true,
                message: "Please select Reason",
              },
            ]}
          >
            <Select style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "0.5rem" }}
            name="BlockTill"
            label="Block Till"
            rules={[
              {
                required: true,
                message: "Please Enter Lookup Description",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime={{ format: "hh:mm A" }}
              format="dddd , DD-MM-YYYY , hh:mm A"
            />
          </Form.Item>
          <Form.Item name="Remarks" label="Remarks">
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Row gutter={32} style={{ height: "1.8rem" }}>
            <Col offset={15} span={4}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <Button type="default" onClick={handleClose}>
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default BlockBedModal;
