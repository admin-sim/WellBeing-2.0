import { urlSearchUHID, urlGetAllVisitsForPatientId } from "../../../endpoints";
import customAxios from "../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router";
import {
  Form,
  Row,
  Col,
  AutoComplete,
  Input,
  Select,
  Button,
  Layout,
} from "antd";
import Title from "antd/es/typography/Title";
import { Table, Tabs } from "antd";
import {
  ColWithSixSpan,
  ColWithThreeSpan,
} from "../../components/customGridColumns";

function Billing() {
  const [form] = Form.useForm();

  let [selectedOption, setSelectedOption] = useState(null);

  const navigate = useNavigate();
  const { TabPane } = Tabs;

  // Define your state variables
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [generatedEncounter, setGeneratedEncounter] = useState(null);
  const [options, setOptions] = useState([]);
  const [visits, setVisits] = useState([]);
  const [initialFormState, setInitialFormState] = useState({
    PatientName: "",
    visit: "",
  });
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Define your functions
  const handleAutocompleteChange = async (newValue) => {
    debugger;
    // let selectedOption = null;

    if (newValue !== null) {
      selectedOption = options.find((option) => option.UhId === newValue);
      setSelectedPatient(selectedOption);
    }
    setSelectedUhId(newValue);

    if (selectedOption && selectedOption.PatientId) {
      getencounters(selectedOption.PatientId);

      // const firstEncounter = visits.length > 0 ? visits[0] : null;

      form.setFieldsValue({
        PatientName: selectedOption.PatientFirstName,
        // EncounterID: firstEncounter ? firstEncounter.EncounterId : ''
      });
    } else {
      setVisits([]);
      setInitialFormState({
        PatientName: "",
        visit: "",
      });
    }
  };

  const handleSelect = (value, option) => {
    debugger;
    // Update the selectedUhId state
    setSelectedUhId(value);

    // Fetch encounter ID
    // getencounters(option.key);

    // const firstEncounter = visits.length > 0 ? visits[0] : null;
    // form.setFieldsValue({
    //   EncounterID: firstEncounter ? firstEncounter.EncounterId : ''
    // });
  };

  const getencounters = async (patientid) => {
    debugger;
    try {
      const visitsResponse = await customAxios.get(
        `${urlGetAllVisitsForPatientId}?PatientId=${patientid}`
      );
      if (
        visitsResponse.data &&
        Array.isArray(visitsResponse.data.data.EncounterModellist)
      ) {
        setVisits(visitsResponse.data.data.EncounterModellist);
        const firstEncounter =
          visitsResponse.data.data.EncounterModellist.length > 0
            ? visitsResponse.data.data.EncounterModellist[0]
            : null;
        form.setFieldsValue({
          Encounter: firstEncounter ? firstEncounter.EncounterId : "",
        });
        setGeneratedEncounter(firstEncounter?.GeneratedEncounterId);
      } else {
        setVisits([]);
      }
    } catch (error) {
      console.error("Error fetching visits data:", error);
      setVisits([]);
    }
  };

  const handleOnSubmit = (values) => {
    debugger;
    console.log("Form submitted with values:", values);
    const uhid = selectedPatient ? selectedPatient.UhId : "";
    const patientId = selectedPatient ? selectedPatient.PatientId : "";
    const PatientName = selectedPatient ? selectedPatient.PatientFirstName : "";
    const encounterId = values.Encounter;

    const url = `/CreateBilling`;
    console.log(url);
    // navigate(url);
    navigate(url, {
      state: {
        patientId: patientId,
        encounterId: encounterId,
        encounter: generatedEncounter,
      },
    });
  };

  const handleReset = () => {
    form.resetFields();
  };

  const fetchOptionsCallback = async (inputValue) => {
    debugger;
    try {
      const response = await customAxios.get(
        `${urlSearchUHID}?Uhid=${inputValue}`
      );
      if (response.data && Array.isArray(response.data.data)) {
        setOptions(response.data.data);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setOptions([]);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <Row
        style={{
          padding: "0.5rem 2rem 0.5rem 2rem",
          backgroundColor: "#40A2E3",
          borderRadius: "10px 10px 0px 0px ",
        }}
      >
        <Col span={16}>
          <Title
            level={4}
            style={{
              color: "white",
              fontWeight: 500,
              margin: 0,
              paddingTop: 0,
            }}
          >
            Billing Management System
          </Title>
        </Col>
      </Row>
      <div style={{ padding: "0 1rem" }}>
        <Form
          layout="vertical"
          onFinish={handleOnSubmit}
          variant="outlined"
          form={form}
        >
          <Row gutter={32}>
            <ColWithSixSpan>
              <Form.Item
                label="UHID"
                name="Uhid"
                rules={[
                  {
                    required: true,
                    message: "Please enter UHID",
                  },
                ]}
              >
                <AutoComplete
                  options={options.map((option) => ({
                    value: option.UhId,
                    key: option.PatientId,
                  }))}
                  onSearch={fetchOptionsCallback} // Call fetchOptionsCallback when the user searches
                  onChange={handleAutocompleteChange} // Call handleAutocompleteChange when the input field changes
                  onSelect={handleSelect}
                  value={selectedUhId}
                  filterOption={(inputValue, option) =>
                    option.value
                      .toUpperCase()
                      .includes(inputValue.toUpperCase())
                  }
                  allowClear
                />
              </Form.Item>
            </ColWithSixSpan>

            <ColWithSixSpan>
              <Form.Item
                label="PatientName"
                name="PatientName"
                rules={[
                  {
                    required: true,
                    message: "Please add Last Name",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </ColWithSixSpan>

            <ColWithSixSpan>
              <Form.Item
                label="EncounterID"
                name="Encounter"
                rules={[
                  {
                    required: true,
                    message: "Please add Last Name",
                  },
                ]}
              >
                <Select value={initialFormState.visit} disabled>
                  {visits.map((option) => (
                    <Select.Option
                      key={option.EncounterId}
                      value={option.EncounterId}
                    >
                      {option.GeneratedEncounterId}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </ColWithSixSpan>
          </Row>

          <Row justify="end">
            <Col>
              <Form.Item style={{ marginRight: "10px" }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button type="default" danger onClick={handleReset}>
                  Clear
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default Billing;
