import React from "react";
import { Select } from "antd";

const { Option } = Select;

function SearchableSelect({
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  allowClear = true,
  style = { width: "100%" },
  children, // if children are passed directly
  options = [], // dynamic array of options
  valueKey = "value", // key to extract value from each option object
  labelKey = "label", // key to extract label/text
  idKey = "id", // key to use as React key
}) {
  const renderOptions = () => {
    if (children) return children;

    return options.map((option) => (
      <Option key={option[idKey] || option[valueKey]} value={option[valueKey]}>
        {option[labelKey]}
      </Option>
    ));
  };

  return (
    <Select
      showSearch
      style={style}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      allowClear={allowClear}
      optionFilterProp="children"
      filterOption={(input, option) => {
        const description = option.children || "";
        return description.toLowerCase().includes(input.toLowerCase());
      }}
      filterSort={(optionA, optionB) => {
        const descriptionA = optionA.children || "";
        const descriptionB = optionB.children || "";
        return descriptionA
          .toLowerCase()
          .localeCompare(descriptionB.toLowerCase());
      }}
    >
      {renderOptions()}
    </Select>
  );
}

// Still allow manual Option use if needed
SearchableSelect.Option = Option;

export default SearchableSelect;
