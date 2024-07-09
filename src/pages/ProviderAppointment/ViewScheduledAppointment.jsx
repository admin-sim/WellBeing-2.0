import { Button, Col, Divider, Form, Input, Modal, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import React, { useEffect } from "react";

function ViewScheduledAppointment({
  open,
  onCancel,
  selectedSlot,
  calendarData,
}) {
  const [form3] = Form.useForm();
  console.log("viewModalCalendarData", calendarData);
  console.log("selectedSlot", selectedSlot);

  function handleCancel() {
    onCancel();
    // form3.resetFields();
  }

  useEffect(() => {
    form3.setFieldsValue({
      reason: calendarData[0]?.extendedProps?.AppointmentReasonName,
      // ? calendarData[0]?.extendedProps?.AppointmentReasonName
      // : " - ",
      remarks: calendarData[0]?.extendedProps?.Remarks,
      // ? calendarData[0]?.extendedProps?.Remarks
      // : " - ",
    });
  }, [calendarData]);

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
      onCancel={handleCancel}
    >
      <Row>
        <Col span={8}>
          <Col span={24}>
            <b>Provider Name:</b>
          </Col>
          <Col span={24}>{calendarData[0]?.extendedProps?.ProviderName}</Col>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <b>Date:</b>
          </Col>
          <Col span={24}>
            {moment(calendarData[0]?.start).format("DD/MM/YYYY")}
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
          <Col span={24}>{calendarData[0]?.extendedProps?.PatientName}</Col>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <b>UHID:</b>
          </Col>
          <Col span={24}>{calendarData[0]?.extendedProps?.UHID}</Col>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <b>Age:</b>
          </Col>
          <Col span={24}>{calendarData[0]?.extendedProps?.Age || "-"}</Col>
        </Col>
      </Row>

      <Form
        style={{ margin: "1rem 0 0 0", width: "100%" }}
        layout="vertical"
        form={form3}
      >
        <Row style={{ marginTop: "1rem" }} gutter={32}>
          <Col span={12}>
            <Form.Item name="reason" label="Reason">
              <Input style={{ width: "100%" }} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="remarks" label="Remarks">
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
                onClick={handleCancel}
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
