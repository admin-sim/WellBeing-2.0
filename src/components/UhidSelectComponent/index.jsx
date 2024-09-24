import { Form, Select, Spin } from "antd";
import React, { useEffect, useState, useRef } from "react";
import customAxios from "../customAxios/customAxios";
import { urlSearchUHID } from "../../../endpoints";
import { debounce } from "lodash";

function UhidSelectComponent({ selectedUhId, handleSelectUHID }) {
  // const [selectedUhId, setSelectedUhId] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const myInput = useRef();

  const fetchOptionsCallback = debounce(async (inputValue) => {
    try {
      setLoading(true);
      const response = await customAxios.get(
        `${urlSearchUHID}?Uhid=${inputValue}`
      );
      if (response.data && Array.isArray(response.data.data)) {
        setOptions(response.data.data);
        console.log(response.data.data);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  //   const handleSelectUHID = (value, option) => {
  //     setSelectedUhId(value);

  //     if (option) {
  //       const selectedPatientData = option.data;
  //       console.log("Selected Patient Data:", selectedPatientData);
  //     }

  //     if (value) {
  //       myInput.current.blur();
  //     }
  //   };

  useEffect(() => {
    myInput.current.focus();
  }, []);

  return (
    <Select
      style={{ width: "100%" }}
      ref={myInput}
      showSearch
      value={selectedUhId}
      placeholder="Search UHID"
      notFoundContent={
        loading ? <span>Loading...</span> : "Please enter valid UHID"
      }
      onSearch={fetchOptionsCallback}
      onChange={handleSelectUHID}
      filterOption={false}
      allowClear
      loading={loading}
      options={options.map((option) => ({
        value: option.UhId,
        label: option.UhId,
        key: option.PatientId,
        data: option,
      }))}
    />
  );
}

export default UhidSelectComponent;
