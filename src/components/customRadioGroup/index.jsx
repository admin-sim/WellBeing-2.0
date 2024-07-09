import React from "react";
import { Radio, ConfigProvider, Form } from "antd";
import "./style.css";

const CustomRadioGroup = ({ name, label, options }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Radio: {
            colorPrimary: "#06D001",
            radioSize: 20,
          },
        },
      }}
    >
      <Form.Item
        name={name}
        label={label}
        style={{ textAlign: "start !important" }}
      >
        <Radio.Group
          style={{
            display: "flex",
            justifyContent: "start",
          }}
          size="middle"
        >
          {options?.map((option, index) => (
            <Radio key={index} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    </ConfigProvider>
  );
};

export default CustomRadioGroup;
