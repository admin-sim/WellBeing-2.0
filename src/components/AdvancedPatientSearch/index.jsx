import {
  urlSearchUHID,
  urlGetAllVisitsForPatientId,
  urlSearchPatientRecord,
} from "../../../endpoints";
import customAxios from "../../components/customAxios/customAxios";
import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Row,
  Col,
  AutoComplete,
  Input,
  Select,
  Button,
  Layout,
  DatePicker,
  Spin,
} from "antd";
import { ColWithSixSpan } from "../../components/customGridColumns";
import { SearchOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import CustomTable from "../../components/customTable";
import dayjs from "dayjs";

function AdvancedPatientSearch({ handleOnSubmit }) {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  let [selectedOption, setSelectedOption] = useState(null);
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedSearchUhId, setSelectedSearchUhId] = useState(null);
  const [visits, setVisits] = useState([]);
  const [initialFormState, setInitialFormState] = useState({
    PatientName: "",
    visit: "",
  });
  const [searchContainer, setSearchContainer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientsearchDetails, setPatientSearchDetails] = useState([]);
  const [patientDropdown, setPatientDropdown] = useState({
    Genders: [],
    Title: [],
    CardType: [],
  });
  const containsDropdown = [
    { id: "1", name: "Starts With" },
    { id: "2", name: "Ends With" },
    { id: "3", name: "Sounds Like" },
    { id: "4", name: "Anywhere" },
  ];
  const [AutoCompleteLoader, setAutoCompleteLoader] = useState(false);
  const [isEncounterDisabled, setIsEncounterDisabled] = useState(false);

  // Define your functions
  const handleAutocompleteChange = async (newValue) => {
    // let selectedOption = null;

    if (newValue !== null) {
      selectedOption = options.find((option) => option.UhId === newValue);
    }
    setSelectedUhId(newValue);

    if (selectedOption && selectedOption.PatientId) {
      getencounters(selectedOption.PatientId);

      // const firstEncounter = visits.length > 0 ? visits[0] : null;

      form1.setFieldsValue({
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
    // Update the selectedUhId state

    setSelectedUhId(value);
    form1.setFieldsValue({ patientId: option.key });

    // Fetch encounter ID
    // getencounters(option.key);

    // const firstEncounter = visits.length > 0 ? visits[0] : null;
    // form1.setFieldsValue({
    //   EncounterID: firstEncounter ? firstEncounter.EncounterId : ''
    // });
  };

  const getencounters = async (patientid) => {
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
            : [];
        if (visitsResponse.data.data.EncounterModellist.length <= 1) {
          setIsEncounterDisabled(true);
        }
        form1.setFieldsValue({
          Encounter: firstEncounter ? firstEncounter.EncounterId : "",
        });
      } else {
        setVisits([]);
      }
    } catch (error) {
      console.error("Error fetching visits data:", error);
      setVisits([]);
    }
  };

  const handleReset = () => {
    form1.resetFields();
  };

  const fetchOptionsCallback = async (inputValue) => {
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

  const myInput = useRef();

  useEffect(() => {
    myInput.current.focus();
  }, []);

  const handleSearchClick = () => {
    setSearchContainer(!searchContainer);
    form2.resetFields();
    setPatientSearchDetails([]);
    setAutoCompleteLoader(false);
  };

  const handleOnSearch = (values) => {
    try {
      setLoading(true);
      const postData1 = {
        Uhid:
          values.Uhid === undefined || values.Uhid === "" ? '""' : values.Uhid, // Set to empty string when left blank
        NameFilter: values.NameFilter === undefined ? "" : values.NameFilter,
        PatientName:
          values.PatientName === undefined || values.PatientName === ""
            ? '""'
            : values.PatientName,
        DateOfBirth: values.dob ? values.dob.format("DD-MM-YYYY") : '""',
        RegistrationFrom: values.RegFrom
          ? values.RegFrom.format("DD-MM-YYYY")
          : '""',
        RegistrationTo: values.RegTo ? values.RegTo.format("DD-MM-YYYY") : '""',
        Age: values.Age === undefined || values.Age === "" ? "" : values.Age,
        Gender: values.PatientGender === undefined ? "" : values.PatientGender,
        MobileNumber:
          values.MobileNumber === undefined || values.MobileNumber === ""
            ? '""'
            : values.MobileNumber,
        City:
          values.City === undefined || values.City === "" ? '""' : values.City,
        identifierType:
          values.IdentifierType === undefined ? "" : values.IdentifierType,
        IdentifierTypeValue:
          values.IdentifierValue === undefined || values.IdentifierValue === ""
            ? '""'
            : values.IdentifierValue,
      };

      customAxios
        .get(
          `${urlSearchPatientRecord}?Uhid=${postData1.Uhid}&NameFilter=${postData1.NameFilter}&PatientName=${postData1.PatientName}&DateOfBirth=${postData1.DateOfBirth}&RegistrationFrom=${postData1.RegistrationFrom}&RegistrationTo=${postData1.RegistrationTo}&Age=${postData1.Age}&Gender=${postData1.Gender}&MobileNumber=${postData1.MobileNumber}&City=${postData1.City}&IdentifierType=${postData1.identifierType}&IdentifierTypeValue=${postData1.IdentifierTypeValue}`,
          null,
          {
            params: postData1,
          }
        )
        .then((response) => {
          setLoading(false);
          //resetForm();
          setPatientSearchDetails(response.data.data.Patients);
        });
    } catch (error) {
      setLoading(false);
      // Handle any errors here
      console.error("Error:", error);
    }
    // Reset the form fields
  };

  const handleSearchAutoCompleteChange = debounce(async (value) => {
    try {
      setAutoCompleteLoader(true); // Set loading state to true

      if (!value.trim()) {
        setAutoCompleteLoader(false); // Set loading state to false
        return;
      }

      const response = await customAxios.get(`${urlSearchUHID}?Uhid=${value}`);
      const responseData = response.data.data || [];

      // Ensure responseData is an array and has the expected structure
      if (
        Array.isArray(responseData) &&
        responseData.length > 0 &&
        responseData[0].UhId !== undefined
      ) {
        setAutoCompleteLoader(false);
      }
    } catch (error) {
      setAutoCompleteLoader(false);
      console.error("Error fetching suggestions:", error);
      // Set options to an empty array in case of an error
    }
  }, 300);

  const handleSearchSelect = (value, option) => {
    setSelectedSearchUhId(option.value);
  };

  const disabledDate = (current) => {
    // Disable dates that are in the future
    return current && current > new Date();
  };

  const AdvancedPatientSearchColumns = [
    {
      title: "UHID",
      dataIndex: "UhId",
      key: "UhId",
      sorter: (a, b) => {
        const numA = parseInt(a.UhId.split("/")[1], 10);
        const numB = parseInt(b.UhId.split("/")[1], 10);
        return numA - numB;
      },
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <a
          // style={{ fontWeight: "bold" }}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleUhidClick(record);
          }}
        >
          {record.UhId}
        </a>
      ),
    },
    {
      title: "Name",
      dataIndex: "PatientName",
      key: "PatientName",
      // sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
      // sortDirections: ["descend", "ascend"],
      render: (text, record) => <p>{record.PatientName}</p>,
    },
    {
      title: "Gender",
      dataIndex: "PatientName",
      key: "Gender",
      // sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
      // sortDirections: ["descend", "ascend"],
      render: (text, record) => <p>{record.PatientGender}</p>,
    },
    {
      title: "Date of Birth",
      dataIndex: "PatientName",
      key: "DOB",
      // sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
      // sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <p>{dayjs(record.DateOfBirth).format("DD-MM-YYYY")}</p>
      ),
    },
    {
      title: "Age",
      dataIndex: "PatientName",
      key: "Age",
      // sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
      // sortDirections: ["descend", "ascend"],
      render: (text, record) => <p>{record.Age}</p>,
    },
    {
      title: "Contact Details",
      key: "contact",
      dataIndex: "PatientName",
      render: (text, record) => (
        <>
          <span>Mobile : {record?.MobileNumber}</span>
          <br />
          <span>Landline : {record?.LandlineNumber}</span>
          <br />
          <span>Email : {record?.EmailId}</span>
        </>
      ),
    },
    {
      title: "City",
      dataIndex: "PatientName",
      key: "City",
      // sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
      // sortDirections: ["descend", "ascend"],
      render: (text, record) => <p>{record.PlaceName}</p>,
    },
    {
      title: "State",
      dataIndex: "PatientName",
      key: "Gender",
      // sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
      // sortDirections: ["descend", "ascend"],
      render: (text, record) => <p>{record.StateName}</p>,
    },
  ];

  const handleUhidClick = async (record) => {
    form1.setFieldsValue({
      Uhid: record?.UhId,
      PatientName: record?.PatientName,
      patientId: record?.PatientId,
    });

    setIsEncounterDisabled(false);
    getencounters(record?.PatientId);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setSearchContainer(false);
  };

  const handleSearchReset = () => {
    form2.resetFields();
  };

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <Form
        layout="vertical"
        onFinish={handleOnSubmit}
        variant="outlined"
        form={form1}
        style={{ margin: "1rem" }}
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
                ref={myInput}
                options={options.map((option) => ({
                  value: option.UhId,
                  key: option.PatientId,
                }))}
                onSearch={fetchOptionsCallback} // Call fetchOptionsCallback when the user searches
                onChange={handleAutocompleteChange} // Call handleAutocompleteChange when the input field changes
                onSelect={handleSelect}
                value={selectedUhId}
                filterOption={(inputValue, option) =>
                  option.value.toUpperCase().includes(inputValue.toUpperCase())
                }
                allowClear
              />
            </Form.Item>
          </ColWithSixSpan>
          <Form.Item label="Patient Name" name="patientId" hidden>
            <Input />
          </Form.Item>

          <ColWithSixSpan>
            <Form.Item
              label="Patient Name"
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
              label="Encounter ID"
              name="Encounter"
              rules={[
                {
                  required: true,
                  message: "Please add Last Name",
                },
              ]}
            >
              <Select
                value={initialFormState.visit}
                disabled={isEncounterDisabled}
              >
                {visits?.map((option) => (
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
          <ColWithSixSpan>
            <Row gutter={16}>
              <Col>
                <Form.Item label=" ">
                  <Button type="primary" htmlType="submit">
                    Select
                  </Button>
                </Form.Item>
              </Col>

              <Col>
                <Form.Item label=" ">
                  <Button type="default" danger onClick={handleReset}>
                    Clear
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label=" ">
                  <Button
                    type="dashed"
                    icon={<SearchOutlined />}
                    onClick={handleSearchClick}
                  >
                    Search
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </ColWithSixSpan>
        </Row>
      </Form>

      {searchContainer && (
        <div
          style={{
            margin: "0.5rem",
            padding: "1rem",
            border: "1px solid #D7C3F1",
            borderRadius: "1rem",
          }}
        >
          <Form
            layout="vertical"
            onFinish={handleOnSearch}
            variant="outlined"
            size="small"
            form={form2}
          >
            <Row gutter={16}>
              <ColWithSixSpan>
                <Form.Item label="UHID" name="Uhid">
                  <AutoComplete
                    options={options}
                    onSearch={handleSearchAutoCompleteChange}
                    onSelect={handleSearchSelect}
                    value={selectedSearchUhId}
                    filterOption={(inputValue, option) =>
                      option.value
                        .toUpperCase()
                        .includes(inputValue.toUpperCase())
                    }
                    allowClear
                  />
                </Form.Item>
                {AutoCompleteLoader && (
                  <Spin
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item label="Name Filter" name="NameFilter">
                  <Select allowClear>
                    {containsDropdown?.map((option) => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item label=" Patient Name" name="PatientName">
                  <Input allowClear />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item label="Date of Birth" name="dob">
                  <DatePicker
                    style={{ width: "100%" }}
                    format={"DD-MM-YYYY"}
                    disabledDate={disabledDate}
                    placeholder="DD-MM-YYYY"
                    allowClear
                  />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item label="Identifier Type" name="IdentifierType">
                  <Select allowClear>
                    {patientDropdown?.CardType.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item label="Identifier Value" name="IdentifierValue">
                  <Input allowClear />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item label="Registration&nbsp;From" name="RegFrom">
                  <DatePicker
                    style={{ width: "100%" }}
                    format={"DD-MM-YYYY"}
                    disabledDate={disabledDate}
                    placeholder="DD-MM-YYYY"
                    allowClear
                  />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item label="Registration To" name="RegTo">
                  <DatePicker
                    style={{ width: "100%" }}
                    format={"DD-MM-YYYY"}
                    disabledDate={disabledDate}
                    placeholder="DD-MM-YYYY"
                    allowClear
                  />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  label="Mobile Number"
                  name="MobileNumber"
                  rules={[
                    {
                      pattern: new RegExp(/^\d{10}$/),
                      message: "Invalid mobile number!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item label="City" name="City">
                  <Input allowClear />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  label="Age"
                  name="Age"
                  rules={[
                    {
                      pattern: new RegExp(/^\d{1,3}$/),
                      message: "Invalid Age",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  style={{ width: "100%" }}
                  label="Gender"
                  name="PatientGender"
                >
                  <Select allowClear>
                    {patientDropdown.Genders.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithSixSpan>
            </Row>
            <Row justify="end">
              <Col style={{ marginRight: "10px" }}>
                <Form.Item disabled={loading}>
                  <Button type="primary" htmlType="submit" disabled={loading}>
                    {/* Search */}
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button danger onClick={handleSearchReset}>
                    Clear
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Spin spinning={loading}>
            <Row gutter={16}>
              <Col span={24} style={{ padding: "0" }}>
                <CustomTable
                  dataSource={patientsearchDetails}
                  columns={AdvancedPatientSearchColumns}
                  actionColumn={false}
                  isFilter={true}
                />
              </Col>
            </Row>
          </Spin>
        </div>
      )}
    </Layout>
  );
}

export default AdvancedPatientSearch;
