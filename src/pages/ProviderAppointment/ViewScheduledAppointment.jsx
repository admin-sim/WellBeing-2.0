import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import React from "react";

function ViewScheduledAppointment({
  open,
  onCancel,
  selectedSlot,
  calendarData,
}) {
  const [form3] = Form.useForm();

  return (
    <Modal
      width={"40%"}
      title={
        <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>
          View Schedule Appointment
        </span>
      }
      open={open}
      maskClosable={false}
      footer={null}
      onCancel={onCancel}
    >
      <Row>
        <Col span={8}>
          <Col span={24}>
            <b>Provider Name:</b>
          </Col>
          <Col span={24}>{calendarData[0]?.ProviderName}</Col>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <b>Date:</b>
          </Col>
          <Col span={24}>
            {moment(calendarData[0]?.AppointmentDate).format("DD/MM/YYYY")}
          </Col>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <b>Time:</b>
          </Col>
          <Col span={24}>{`${moment(selectedSlot?.start).format(
            "HH:mm"
          )}-${moment(selectedSlot?.end).format("HH:mm")}`}</Col>
        </Col>
      </Row>
      <Row style={{ marginTop: "1rem" }}>
        <Col span={8}>
          <Col span={24}>
            <b>Patient Name:</b>
          </Col>
          <Col span={24}>{calendarData[0]?.PatientName}</Col>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <b>UHID:</b>
          </Col>
          <Col span={24}>{calendarData[0]?.PatientUHID}</Col>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <b>Age:</b>
          </Col>
          <Col span={24}>
            {calendarData[0]?.Age == 0 ? "-" : calendarData[0]?.Age}
          </Col>
        </Col>
      </Row>

      <Form
        style={{ margin: "1rem 0 0 0", width: "100%" }}
        layout="vertical"
        form={form3}
      >
        <Row style={{ marginTop: "1rem" }} gutter={32}>
          <Col span={12}>
            <Form.Item
              name="reason"
              label="Reason"
              initialValue={calendarData[0]?.AppointmentReasonName}
            >
              <Input style={{ width: "100%" }} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="remarks"
              label="Remarks"
              initialValue={calendarData[0]?.Remarks}
            >
              <TextArea rows={1} style={{ width: "100%" }} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col offset={20} span={4} style={{ marginBottom: "-1.5rem" }}>
            <Form.Item>
              <Button
                style={{ width: "100%" }}
                danger
                type="default"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default ViewScheduledAppointment;
