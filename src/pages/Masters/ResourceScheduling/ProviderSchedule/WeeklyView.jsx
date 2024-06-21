import React, { useEffect, useState } from "react";
import { Form, Select, Col, Row } from "antd";
import PropTypes from "prop-types";
const { Option } = Select;

const WeeklyView = ({
  days,
  providerSchedule,
  sessionsData,
  handleSelectChange,
}) => {
  return (
    <div>
      {days.map((day) => {
        // Find the corresponding provider schedule for the current day
        const correspondingProviderSchedule = providerSchedule.find(
          (schedule) => schedule.WeekdayId === day.LookupID
        );

        // Find the corresponding session for the current provider schedule
        const correspondingSession = sessionsData.find(
          (session) =>
            session.TemplateId === correspondingProviderSchedule?.TemplateId
        );

        // Check if a corresponding session exists
        const defaultValue = correspondingSession
          ? correspondingSession.TemplateId
          : undefined;

        return (
          <Row
            align="middle"
            key={day.LookupID}
            style={{ marginBottom: "10px" }}
          >
            <Col span={6}>
              <label>{day.LookupDescription}</label>
            </Col>
            <Col span={12} style={{ margin: "20px 0px 0px 0px" }}>
              <Form.Item name={`schedule-${day.LookupID}`} >
                <Select
                  placeholder="Select a session"
                  onChange={(value) => handleSelectChange(day.LookupID, value)}
                  size="default"
                  // Set the default value to the TemplateId of the corresponding session
                  defaultValue={defaultValue}
                  allowClear
                >
                  {sessionsData.map((session) => (
                    <Option key={session.TemplateId} value={session.TemplateId}>
                      {session.TemplateName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

WeeklyView.propTypes = {
  days: PropTypes.array.isRequired,
  providerSchedule: PropTypes.array,
  sessionsData: PropTypes.array.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
};
export default WeeklyView;
