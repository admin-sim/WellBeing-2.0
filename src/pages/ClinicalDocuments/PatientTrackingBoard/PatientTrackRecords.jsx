import React, { useEffect, useState } from "react";
import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
} from "antd";
import { useForm } from "antd/es/form/Form";
import PatientHeader from "../../../components/PatientHeader";
import CustomTable from "../../../components/customTable";
import customAxios from "../../../components/customAxios/customAxios";
import {
  urlGetPatientDetail,
  urlSearchPatientRecord,
  urlSearchUHID,
} from "../../../../endpoints";
import { debounce } from "lodash";
import dayjs from "dayjs";

function PatientTrackRecords() {
  const [currentTab, setCurrentTab] = useState("1");
  const [patientTrackRecordTable, setPatientTrackRecordTable] = useState(true);
  const [AutoCompleteLoader, setAutoCompleteLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientsearchDetails, setPatientSearchDetails] = useState([]);
  const [patientDropdown, setPatientDropdown] = useState({
    Genders: [],
    Title: [],
    CardType: [],
  });
  const [options, setOptions] = useState([]);
  const [selectedUhId, setSelectedUhId] = useState(null);
  const containsDropdown = [
    { id: "1", name: "Starts With" },
    { id: "2", name: "Ends With" },
    { id: "3", name: "Sounds Like" },
    { id: "4", name: "Anywhere" },
  ];

  const [form1] = useForm();
  const [form2] = useForm();

  const columns = [
    {
      title: "EncounterId",
      dataIndex: "EncounterId",
      key: "1",
    },
    {
      title: "Patient Name",
      dataIndex: "PatientName",
      key: "2",
    },
    {
      title: "EncounterStatus",
      dataIndex: "EncounterStatus",
      key: "3",
    },
    {
      title: "ServiceLocation",
      dataIndex: "ServiceLocation",
      key: "4",
    },
    {
      title: "Provider",
      dataIndex: "Provider",
      key: "5",
    },
    {
      title: "Room",
      dataIndex: "Room",
      key: "6",
    },
    {
      title: "Bed",
      dataIndex: "Bed",
      key: "7",
    },
    {
      title: "From Date",
      dataIndex: "FromDate",
      key: "8",
    },
    {
      title: "To Date",
      dataIndex: "ToDate",
      key: "9",
    },
  ];

  const tableData = [
    {
      EncounterId: "COH / IP90",
      PatientName: " ",
      EncounterStatus: "Discharged",
      ServiceLocation: " ",
      Provider: "CLEMENT IYAMU",
      Room: "Emergency Ward Ground Floor",
      Bed: "EWGF4",
      FromDate: "23-05-2023 12:37:16",
      ToDate: "01-01-0001 12:00:00",
    },
  ];

  const handlePatientTrackingSearch = (values) => {
    setPatientTrackRecordTable(true);
    console.log(values);
  };

  const handlePatientTrackingReset = () => {
    form1.resetFields();
    setPatientTrackRecordTable(false);
  };

  const handleOnSearch = (values) => {
    try {
      setLoading(true);
      // values.dob = dayjs(values.dob).format("DD-MM-YYYY");
      //   values.RegFrom = dayjs(values.RegFrom).format("DD-MM-YYYY");
      //   values.RegTo = dayjs(values.RegTo).format("DD-MM-YYYY");
      // Assuming postData1 is an object with your input values
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
          console.log("Response:", response.data);
          //resetForm();
          setPatientSearchDetails(response.data.data.Patients);
          setOptions([]);
        });
    } catch (error) {
      setLoading(false);
      // Handle any errors here
      console.error("Error:", error);
    }
    // Reset the form fields
  };

  useEffect(() => {
    customAxios.get(urlGetPatientDetail).then((response) => {
      const apiData = response.data.data;
      setPatientDropdown(apiData);
      console.log(apiData);
    });
  }, []);

  const disabledDate = (current) => {
    // Disable dates that are in the future
    return current && current > new Date();
  };

  const handleReset = () => {
    form2.resetFields();
    setPatientSearchDetails(null);
  };

  const handleAutoCompleteChange = debounce(async (value) => {
    try {
      setAutoCompleteLoader(true); // Set loading state to true

      if (!value.trim()) {
        setOptions([]); // Set options to an empty array
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
        const newOptions = responseData.map((option) => ({
          value: option.UhId,
          label: option.UhId,
          key: option.PatientId,
        }));
        setOptions(newOptions);
      } else {
        setOptions([]); // Set options to an empty array if the structure is not as expected
      }
    } catch (error) {
      setAutoCompleteLoader(false);
      console.error("Error fetching suggestions:", error);
      setOptions([]); // Set options to an empty array in case of an error
    }
  }, 300); // Debounce time in milliseconds (adjust as needed)

  const handleSelect = (value, option) => {
    setSelectedUhId(option.value);
  };

  const handleUhidClick = (record) => {
    // setSelectedPatient(record);
    form1.setFieldsValue({
      UHID: record.UhId,
      name: record.PatientName,
      "Contact/Email": record.EmailId,
    });
    setCurrentTab("1");
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

  return (
    <div style={{ margin: "1.5rem 2rem" }}>
      <Tabs
        type="card"
        defaultActiveKey="1"
        activeKey={currentTab}
        onChange={setCurrentTab}
        items={[
          {
            label: `Search Patient`,
            key: "1",
            children: (
              <>
                <div
                  style={{
                    borderRadius: "0.5rem",
                    height: "6rem",
                    width: "100%",
                    margin: "1rem auto",
                    padding: "0.2rem 0.5rem",
                  }}
                >
                  <Form
                    form={form1}
                    onFinish={handlePatientTrackingSearch}
                    layout="vertical"
                  >
                    <Row gutter={32}>
                      <Col span={6}>
                        <Form.Item name="UHID" label="UHID">
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="name" label="Name">
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="Contact/Email"
                          label="Contact/Email ID"
                        >
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Row gutter={32}>
                          <Col>
                            <Form.Item label=" ">
                              <Button htmlType="submit" type="primary">
                                Search
                              </Button>
                            </Form.Item>
                          </Col>
                          <Col>
                            <Form.Item label=" ">
                              <Button
                                danger
                                onClick={handlePatientTrackingReset}
                              >
                                Reset
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Form>
                </div>
                {patientTrackRecordTable && (
                  <div style={{ margin: "2rem" }}>
                    <PatientHeader />
                    <div style={{ marginTop: "1rem" }}>
                      <CustomTable
                        columns={columns}
                        dataSource={tableData}
                        isFilter={true}
                        actionColumn={false}
                      />
                    </div>
                  </div>
                )}
              </>
            ),
          },
          {
            label: `Advanced Patient Search`,
            key: "2",
            children: (
              <>
                <Form
                  layout="vertical"
                  onFinish={handleOnSearch}
                  variant="outlined"
                  size="small"
                  style={{
                    padding: "1rem 1rem 0rem 1rem",
                    margin: "0.5rem 2rem 0rem 2rem",
                    //   border: "1px solid lavender",
                  }}
                  form={form2}
                >
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={6}>
                      <div>
                        <Form.Item label="UHID" name="Uhid">
                          <AutoComplete
                            options={options}
                            //loading={AutoCompleteLoader}
                            onSearch={handleAutoCompleteChange}
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
                      </div>
                    </Col>
                    <Col span={6}>
                      <div>
                        <Form.Item label="Name Filter" name="NameFilter">
                          <Select allowClear>
                            {containsDropdown.map((option) => (
                              <Select.Option key={option.id} value={option.id}>
                                {option.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div>
                        <Form.Item label=" Patient Name" name="PatientName">
                          <Input allowClear />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div>
                        <Form.Item label="Date of Birth" name="dob">
                          <DatePicker
                            style={{ width: "100%" }}
                            format={"DD-MM-YYYY"}
                            disabledDate={disabledDate}
                            placeholder="DD-MM-YYYY"
                            allowClear
                          />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={6}>
                      <div>
                        <Form.Item
                          label="Identifier Type"
                          name="IdentifierType"
                        >
                          <Select allowClear>
                            {patientDropdown.CardType.map((option) => (
                              <Select.Option
                                key={option.LookupID}
                                value={option.LookupID}
                              >
                                {option.LookupDescription}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div>
                        <Form.Item
                          label="Identifier Value"
                          name="IdentifierValue"
                        >
                          <Input allowClear />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div>
                        <Form.Item label="Registration From" name="RegFrom">
                          <DatePicker
                            style={{ width: "100%" }}
                            format={"DD-MM-YYYY"}
                            disabledDate={disabledDate}
                            placeholder="DD-MM-YYYY"
                            allowClear
                          />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div>
                        <Form.Item label="Registration To" name="RegTo">
                          <DatePicker
                            style={{ width: "100%" }}
                            format={"DD-MM-YYYY"}
                            disabledDate={disabledDate}
                            placeholder="DD-MM-YYYY"
                            allowClear
                          />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={6}>
                      <div>
                        <Form.Item
                          label="Mobile Number :"
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
                      </div>
                    </Col>
                    <Col span={6}>
                      <div>
                        <Form.Item label="City" name="City">
                          <Input allowClear />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div>
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
                      </div>
                    </Col>
                    <Col span={6}>
                      <div>
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
                      </div>
                    </Col>
                  </Row>
                  <Row justify="end">
                    <Col style={{ marginRight: "10px" }}>
                      <Form.Item disabled={loading}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          disabled={loading}
                        >
                          {/* Search */}
                          {loading ? "Searching..." : "Search"}
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item>
                        <Button danger onClick={handleReset}>
                          Clear
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                <Spin spinning={loading}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={24}>
                      <CustomTable
                        dataSource={patientsearchDetails}
                        columns={AdvancedPatientSearchColumns}
                        // rowKey={(row) => row.PatientId}
                        size="small"
                        actionColumn={false}
                        // onChange={(pagination) => {
                        //   setCurrentPage(pagination.current);
                        //   setItemsPerPage(pagination.pageSize);
                        // }}
                        isFilter={true}
                        bordered
                      />
                    </Col>
                  </Row>
                </Spin>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

export default PatientTrackRecords;
