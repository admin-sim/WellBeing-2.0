import React from "react";
import { Select } from "antd";

const CustomSelectComponent = ({
  options = [],
  valueField = "value",
  labelField = "label",
  placeholder = "Select an option",
  allowClear = true,
  disabled = false,
  onChange,
}) => {
  return (
    <Select
      showSearch
      allowClear={allowClear}
      disabled={disabled}
      placeholder={placeholder}
      onChange={onChange}
      optionFilterProp="children"
      filterOption={(input, option) =>
        (option?.children ?? "")
          .toString()
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      filterSort={(a, b) =>
        (a?.children ?? "")
          .toString()
          .toLowerCase()
          .localeCompare((b?.children ?? "").toString().toLowerCase())
      }
    >
      {options.map((option) => (
        <Select.Option key={option[valueField]} value={option[valueField]}>
          {option[labelField]}
        </Select.Option>
      ))}
    </Select>
  );
};

export default CustomSelectComponent;
