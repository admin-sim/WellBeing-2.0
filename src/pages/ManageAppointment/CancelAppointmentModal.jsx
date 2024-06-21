import { Button, Col, Form, Modal, Row, Select, Spin, message } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  urlCancelSelectedAppointment,
  urlGetSlotCancelDetails,
} from "../../../endpoints";
import customAxios from "../../components/customAxios/customAxios";

function CancelAppointmentModal({
  open,
  onCancel,
  appointmentDetails,
  setAppointmentsData,
}) {
  const [form] = Form.useForm();
  const [cancelReasons, setCancelReasons] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(null);

  useEffect(() => {
    fetchCancelReasons();
  }, []);

  console.log("appointment ID", appointmentDetails?.AppointmentId);

  const fetchCancelReasons = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetSlotCancelDetails}?AppointmentId=${appointmentDetails?.AppointmentId}`
      );
      if (response.data != null) {
        setCancelReasons(response.data.data?.AppointmentCancelReason);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      width={"40%"}
      title={
        <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>
          Cancel Appointment
        </span>
      }
      open={open}
      maskClosable={false}
      onCancel={onCancel}
      footer={[
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Save
        </Button>,
        <Button danger key="back" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Spin spinning={cancelLoading}>
        <Row>
          <Col span={8}>
            <Col span={24}>
              <b>Provider Name:</b>
            </Col>
            <Col span={24}>{appointmentDetails?.ProviderName}</Col>
          </Col>
          <Col span={8}>
            <Col span={24}>
              <b>Date:</b>
            </Col>
            <Col
              span={24}
            >{`${appointmentDetails?.FromTime}-${appointmentDetails?.ToTime}`}</Col>
          </Col>
          <Col span={8}>
            <Col span={24}>
              <b>Time:</b>
            </Col>
            <Col span={24}>
              {moment(appointmentDetails?.AppointmentDate).format("DD-MM-YYYY")}
            </Col>
          </Col>
        </Row>
        <Row style={{ marginTop: "1rem" }}>
          <Col span={8}>
            <Col span={24}>
              <b>Patient Name:</b>
            </Col>
            <Col span={24}>{appointmentDetails?.PatientName}</Col>
          </Col>
          <Col span={8}>
            <Col span={24}>
              <b>UHID:</b>
            </Col>
            <Col span={24}>{appointmentDetails?.PatientUHID}</Col>
          </Col>
          <Col span={8}>
            <Col span={24}>
              <b>Age:</b>
            </Col>
            <Col span={24}>{appointmentDetails?.Age}</Col>
          </Col>
        </Row>

        <Form
          style={{ margin: "1rem 0 0 0", width: "100%" }}
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            setCancelLoading(true);
            try {
              const response = await customAxios.delete(
                `${urlCancelSelectedAppointment}?Id=${appointmentDetails?.AppointmentId}&AppCancel=${values?.reason}&ProviderId=${appointmentDetails?.ProviderId}`
              );
              if (response.data != null) {
                console.log("si", response.data.data);
                setAppointmentsData(
                  response.data.data.ScheduleProviderAppointments.map(
                    (appointment, index) => ({
                      ...appointment,
                      SlNo: index + 1,
                      key: index,
                    })
                  )
                );
                message.success("Appointment Cancelled Successfully");
                onCancel();
              } else {
                message.error("Failed to cancel Appointment");
              }
            } catch (error) {
              console.error(error);
            }
            setCancelLoading(false);
          }}
        >
          <Row style={{ marginTop: "1rem" }} gutter={32}>
            <Col span={12}>
              <Form.Item
                name="reason"
                label="Reason For Cancel"
                rules={[
                  {
                    required: true,
                    message: "Cancel Reason Required.",
                  },
                ]}
              >
                <Select style={{ width: "100%" }}>
                  {cancelReasons?.map((response) => (
                    <Select.Option
                      key={response.LookupID}
                      value={response.LookupID}
                    >
                      {response.LookupDescription}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
}

export default CancelAppointmentModal;
