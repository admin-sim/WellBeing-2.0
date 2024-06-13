import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
const { Text } = Typography;

function ScheduleAppointmentModal({ open, onSubmit, onCancel, selectedSlot }) {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const handleCancel = () => {
    form1.resetFields();
    form2.resetFields();
    onCancel();
  };
  const [value, setValue] = useState(null);
  const [title, setTitle] = React.useState("");

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  function formatTimeSlot(startTimeString, endTimeString) {
    const startTime = new Date(startTimeString);
    const endTime = new Date(endTimeString);

    const formatTime = (date) => {
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      hours = String(hours).padStart(2, "0");
      return `${hours}:${minutes}:${seconds} ${ampm}`;
    };

    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    return `${formattedStartTime} to ${formattedEndTime}`;
  }

  const handleSubmit = () => {
    // Combine the input title with the selected slot data
    const eventData = {
      title: title, // Use the input title
      start: selectedSlot?.start,
      end: selectedSlot?.end,
      type: "Booked",
    };

    // Call the onSubmit function with the combined eventData
    onSubmit(eventData);

    // Clear the title input after submission
    setTitle("");
  };

  return (
    <div>
      <Modal
        width={"40%"}
        title={
          <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>
            Schedule Appointment
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <Row>
          <Col span={8}>
            <Col span={24}>
              <b>Provider Name:</b>
            </Col>
            <Col span={24}>Nitish Arali</Col>
          </Col>
          <Col span={8}>
            <Col span={24}>
              <b>Date:</b>
            </Col>
            <Col span={24}>{formatDate(selectedSlot?.start)}</Col>
          </Col>
          <Col span={8}>
            <Col span={24}>
              <b>Time:</b>
            </Col>
            <Col span={24}>
              {formatTimeSlot(selectedSlot?.start, selectedSlot?.end)}
            </Col>
          </Col>
        </Row>
        <Row style={{ margin: "1rem" }}>
          <Col>
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={"ExistingPatient"}>Existing Patient</Radio>
              <Radio value={"NewPatient"}>New Patient</Radio>
            </Radio.Group>
          </Col>
        </Row>

        {value === "ExistingPatient" ? (
          <Form
            style={{ margin: "1rem 0" }}
            layout="vertical"
            form={form1}
            onFinish={(values) => {
              handleSubmit();
              form1.resetFields();
              handleClose();
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="UHID" label="UHID">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="Name" label="Name">
                  <Input
                    style={{ width: "100%" }}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="&nbsp;">
                  <Button style={{ width: "100%" }} type="primary">
                    Search
                  </Button>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="&nbsp;">
                  <Button
                    style={{ width: "100%" }}
                    danger
                    type="default"
                    onClick={() => {
                      form1.resetFields();
                    }}
                  >
                    Reset
                  </Button>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="reason" label="Reason">
                  <Select style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="remarks" label="Remarks">
                  <TextArea rows={2} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Divider style={{ marginTop: "0" }} />
              <Col offset={16} span={4}>
                <Form.Item>
                  <Button
                    style={{ width: "100%" }}
                    type="primary"
                    htmlType="submit"
                  >
                    Save
                  </Button>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item>
                  <Button
                    style={{ width: "100%" }}
                    danger
                    type="default"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
}

export default ScheduleAppointmentModal;
