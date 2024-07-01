import React, { useEffect, useState } from "react";
import { Row, Col, Form, Input, TimePicker } from "antd";
import PropTypes from "prop-types";
import moment from "moment";

const SessionsForms = ({ numForms, form, formData }) => {
  debugger;

  const numberPattern = /^\d*$/;

  // Use useEffect to set initial form values when formData changes
  useEffect(() => {
    debugger;
    if (form && formData) {
      form.setFieldsValue(formData);
    }
  }, [form, formData]);

  const onChange = (time, timeString, sessionIndex, isStartTime) => {
    if (formData !== undefined) {
      const updatedSessions = [...formData.sessions];

      // Validate sessionIndex
      if (sessionIndex >= 0 && sessionIndex < updatedSessions.length) {
        if (isStartTime) {
          updatedSessions[sessionIndex].StartTime = time; // Update the StartTime field
        } else {
          updatedSessions[sessionIndex].EndTime = time; // Update the EndTime field
        }
        // Similarly, update other fields (SlotDuration, PatientsInSlot) as needed
        const updatedFormData = { ...formData, sessions: updatedSessions };

        form.setFieldsValue(updatedFormData);
      } else {
        console.error("Invalid session index:", sessionIndex);
      }
    }
  };

  let forms = [];
  for (let i = 0; i < numForms; i++) {
    forms.push(
      <div key={i}>
        <strong> Session: {i + 1} </strong>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ margin: "20px 0px" }}
        >
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "StartTime"]}
              label="Start Time"
              rules={[
                { required: true, message: "Select the Start Time" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (i === 0) return Promise.resolve();
                    const prevEndTime = getFieldValue([
                      "sessions",
                      i - 1,
                      "EndTime",
                    ]);
                    if (!value || (prevEndTime && value.isAfter(prevEndTime))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Start Time must be after the previous session's End Time"
                      )
                    );
                  },
                }),
              ]}
            >
              <TimePicker
                style={{ width: "100%" }}
                onChange={(time, timeString) =>
                  onChange(time, timeString, i, true)
                }
                changeOnScroll
                needConfirm={false}
                format="HH:mm:ss"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "EndTime"]}
              label="End Time"
              rules={[
                { required: true, message: "Select the End Time" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startTime = getFieldValue([
                      "sessions",
                      i,
                      "StartTime",
                    ]);
                    if (!value || (startTime && value.isAfter(startTime))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("End Time must be after Start Time")
                    );
                  },
                }),
              ]}
            >
              <TimePicker
                style={{ width: "100%" }}
                onChange={(time, timeString) =>
                  onChange(time, timeString, i, false)
                }
                changeOnScroll
                needConfirm={false}
                format="HH:mm:ss"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "SlotDuration"]}
              label="Slot Duration"
              rules={[
                { required: true, message: "Enter Slot Duration" },
                { pattern: numberPattern, message: "Enter a valid number" },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "PatientsInSlot"]}
              label="No. of patient/slot"
              rules={[
                { required: true, message: "Enter No. of patient" },
                { pattern: numberPattern, message: "Enter a valid number" },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ margin: "20px 0px" }}
        >
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "OverbookingSlots"]}
              label="Overbooking slots(begin)"
              rules={[
                { required: true, message: "Enter No. of patient" },
                { pattern: numberPattern, message: "Enter a valid number" },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "OverbookingEndSlots"]}
              label="Overbooking slots(end)"
              rules={[
                { required: true, message: "Enter Overbooking slots" },
                { pattern: numberPattern, message: "Enter a valid number" },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={["sessions", i, "PatientsMaxSlot"]}
              label="Maximum No. of slot"
              rules={[
                { required: true, message: "Enter the value" },
                { pattern: numberPattern, message: "Enter a valid number" },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
  return <>{forms}</>;
};

SessionsForms.propTypes = {
  numForms: PropTypes.number,
  form: PropTypes.object.isRequired,
  formData: PropTypes.object,
};

export default SessionsForms;
