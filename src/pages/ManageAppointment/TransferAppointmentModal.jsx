import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  message,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  urlCancelSelectedAppointment,
  urlGetFutureAppointmentDateSessions,
  urlGetSlotTransferDetails,
  urlTransferSelectedAppointment,
} from "../../../endpoints";
import customAxios from "../../components/customAxios/customAxios";
import dayjs from "dayjs";

function TransferAppointmentModal({
  open,
  onCancel,
  appointmentDetails,
  setAppointmentsData,
}) {
  const [form] = Form.useForm();
  const [transferDetails, setTransferDetails] = useState(null);
  const [timeSlots, setTimeSlots] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [timeSlotLoading, setTimeSlotLoading] = useState(null);

  useEffect(() => {
    fetchTransferDetails();
    handleDateChange(form.getFieldValue("AvailableSlotDate"));
  }, []);

  const fetchTransferDetails = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetSlotTransferDetails}?AppointmentId=${appointmentDetails?.AppointmentId}`
      );
      if (response.data != null) {
        setTransferDetails(response.data.data);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = async (value) => {
    form.resetFields(["slotTime"]);
    value = dayjs(value).format("DD-MM-YYYY");
    try {
      setTimeSlotLoading(true);
      const response = await customAxios.get(
        `${urlGetFutureAppointmentDateSessions}?ProviderId=${appointmentDetails?.ProviderId}&FutureDate=${value}`
      );
      if (response.data != null) {
        const slots = generateTimeSlots(
          response.data.data.Sessions[0]?.StartTime,
          response.data.data.Sessions[0]?.EndTime,
          response.data.data.Sessions[0]?.SlotDuration
        );
        const availableSlots = excludeBookedSlots(
          slots,
          response.data.data.ScheduleProviderAppointments
        );
        setTimeSlots(availableSlots);
      } else {
        message.error("Failed to cancel Appointment");
      }
    } catch (error) {
      console.error(error);
    }
    setTimeSlotLoading(false);
  };

  function generateTimeSlots(startTime, endTime, slotDuration) {
    const slots = [];
    let current = moment(startTime, "HH:mm:ss");
    const end = moment(endTime, "HH:mm:ss");

    while (current < end) {
      const next = current.clone().add(slotDuration, "minutes");
      slots.push(`${current.format("HH:mm:ss")}-${next.format("HH:mm:ss")}`);
      current = next;
    }

    return slots;
  }

  function excludeBookedSlots(allSlots, bookedAppointments) {
    return allSlots.filter((slot) => {
      const [slotStart, slotEnd] = slot.split("-");
      return !bookedAppointments.some((appointment) => {
        const appointmentStart = moment(
          appointment.FromTime,
          "HH:mm:ss"
        ).format("HH:mm:ss");
        const appointmentEnd = moment(appointment.ToTime, "HH:mm:ss").format(
          "HH:mm:ss"
        );
        return slotStart === appointmentStart && slotEnd === appointmentEnd;
      });
    });
  }

  return (
    <Modal
      width={"50%"}
      title={
        <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>
          Transfer Appointment
        </span>
      }
      open={open}
      maskClosable={false}
      onCancel={onCancel}
      footer={[
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Transfer
        </Button>,
        <Button danger key="back" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Spin spinning={cancelLoading}>
        <Form
          style={{ margin: "1rem 0 0 0", width: "100%" }}
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            setCancelLoading(true);
            values = {
              ...values,
              AvailableSlotDate: values?.AvailableSlotDate.format("DD-MM-YYYY"),
            };
            console.log("form Values", values);
            try {
              const response = await customAxios.post(
                `${urlTransferSelectedAppointment}?Id=${appointmentDetails?.AppointmentId}&AppTransfer=${values?.ReasonForTransfer}&AvailableDate=${values?.AvailableSlotDate}&StartTime=${values?.slotTime}&PatientId=${appointmentDetails?.PatientId}&ProviderId=${appointmentDetails?.ProviderId}`
              );
              if (response.data != null) {
                console.log("Transfer Api", response.data);
                if (!response.data === "Failure") {
                  setAppointmentsData(
                    response.data.data.ScheduleProviderAppointments?.map(
                      (appointment, index) => ({
                        ...appointment,
                        SlNo: index + 1,
                        key: index,
                      })
                    )
                  );
                  message.success("Appointment Transfered Successfully");
                  onCancel();
                }
                if (response.data.data) {
                  setAppointmentsData(
                    response.data.data.ScheduleProviderAppointments?.map(
                      (appointment, index) => ({
                        ...appointment,
                        SlNo: index + 1,
                        key: index,
                      })
                    )
                  );
                  message.success("Appointment Transfered Successfully");
                  onCancel();
                } else {
                  message.error("Appointment Transfered Failed");
                }
              } else {
                message.error("Failed to cancel Appointment");
              }
            } catch (error) {
              console.error(error);
            }
            setCancelLoading(false);
          }}
        >
          <Row>
            <Col span={16} style={{ borderRight: "1px solid grey" }}>
              <Row>
                <Col span={12}>
                  <Col span={24}>
                    <b>Provider Name:</b>
                  </Col>
                  <Col span={24}>{appointmentDetails?.ProviderName}</Col>
                </Col>
                <Col span={12}>
                  <Col span={24}>
                    <b>Date:</b>
                  </Col>
                  <Col span={24}>
                    {moment(appointmentDetails?.AppointmentDate).format(
                      "DD-MM-YYYY"
                    )}
                  </Col>
                </Col>
              </Row>
              <Row style={{ marginTop: "1rem" }}>
                <Col span={12}>
                  <Col span={24}>
                    <b>Time:</b>
                  </Col>
                  <Col
                    span={24}
                  >{`${appointmentDetails?.FromTime}-${appointmentDetails?.ToTime}`}</Col>
                </Col>
                <Col span={12}>
                  <Col span={24}>
                    <b>Patient Name:</b>
                  </Col>
                  <Col span={24}>{appointmentDetails?.PatientName}</Col>
                </Col>
              </Row>
              <Row style={{ marginTop: "1rem" }}>
                <Col span={12}>
                  <Col span={24}>
                    <b>UHID:</b>
                  </Col>
                  <Col span={24}>{appointmentDetails?.PatientUHID}</Col>
                </Col>
                <Col span={12}>
                  <Col span={24}>
                    <b>Age:</b>
                  </Col>
                  <Col span={24}>{appointmentDetails?.Age}</Col>
                </Col>
              </Row>
              <Row style={{ marginTop: "1rem" }} gutter={32}>
                <Col span={12}>
                  <Form.Item
                    name="ReasonForTransfer"
                    label="Reason For Transfer"
                    rules={[
                      {
                        required: true,
                        message: "Transfer Reason Required.",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }}>
                      {transferDetails?.AppointmentTransferReason?.map(
                        (response) => (
                          <Select.Option
                            key={response.LookupID}
                            value={response.LookupID}
                          >
                            {response.LookupDescription}
                          </Select.Option>
                        )
                      )}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Divider type="vertical" style={{ height: "100%" }} />
            <Col span={7}>
              <Col span={24}>
                <Form.Item
                  name="AvailableSlotDate"
                  label="Available Slot"
                  initialValue={dayjs(appointmentDetails?.AppointmentDate)}
                >
                  <DatePicker
                    format={"DD-MM-YYYY"}
                    style={{ width: "100%" }}
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="slotTime"
                  label="Slot Time"
                  rules={[
                    {
                      required: true,
                      message: "Select Slot",
                    },
                  ]}
                >
                  <Select style={{ width: "100%" }} loading={timeSlotLoading}>
                    {timeSlots?.map((slot, index) => (
                      <Select.Option key={index} value={slot}>
                        {slot}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
}

export default TransferAppointmentModal;
