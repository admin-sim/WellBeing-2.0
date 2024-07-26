import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import {
  urlAddNewPatientAppointment,
  urlAddNewScheduleProviderExisitingAppointment,
  urlPatientAppointmentExist,
  urlSearchPatientRecord,
  urlSearchUHID,
} from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios.jsx";
import CustomTable from "../../components/customTable/index.jsx";
import moment from "moment";
import dayjs from "dayjs";

function ScheduleAppointmentModal({
  open,
  onSubmit,
  onCancel,
  selectedSlot,
  calendarData,
  providerDetails,
  departmentDetails,
}) {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();

  const handleCancel = () => {
    setValue(null);
    form1.resetFields();
    form2.resetFields();
    form3.resetFields();
    setPatients([]);
    onCancel();
  };
  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selecetedPatient, setSelecetedPatient] = useState({});
  const [CountryId, setCountryId] = useState(0);
  const [StateId, setStateId] = useState(0);
  const [PlaceId, setPlaceId] = useState(0);

  //Loaders
  const [patientSearchLoading, setPatientSearchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uhidLoading, setUhidLoading] = useState(false);

  const handleCountryChange = (value) => {
    setCountryId(value);
  };

  const handleStateChange = (value) => {
    setStateId(value);
  };

  const handlePlaceChange = (value) => {
    setPlaceId(value);
  };

  const filteredStates = calendarData?.States?.filter(
    (state) => state.CountryId === CountryId
  );

  const filteredPlaces = calendarData?.Places?.filter(
    (place) => place.StateId === StateId
  );

  const filteredAreas = calendarData?.Areas?.filter(
    (area) => area.PlaceId === PlaceId
  );

  useEffect(() => {
    setPatients([]);
    form1.resetFields();
    form2.resetFields();
  }, [value]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function formatTimeSlot(startTimeString, endTimeString) {
    const startTime = new Date(startTimeString);
    const endTime = new Date(endTimeString);
    const formatTime = (date) => {
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      hours = String(hours).padStart(2, "0");
      return `${hours}:${minutes}:${seconds} ${ampm}`;
    };

    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    return `${formattedStartTime} to ${formattedEndTime}`;
  }

  const handleSubmit = (values) => {
    // Combine the input title with the selected slot data
    const eventData = {
      title: `${values.PatientName}`,
      start: selectedSlot?.start,
      end: selectedSlot?.end,
      type: "Booked",
      backgroundColor: "#fea010",
      extendedProps: {
        UHID: values.PatientUHID,
        PatientName: values.PatientName,
        ProviderName: providerDetails?.ProviderName,
        Age: selecetedPatient?.Age,
        AppointmentReasonName: calendarData?.AppointmentReason?.find(
          (reason) => reason.LookupID === form2.getFieldValue("reason")
        )?.LookupDescription,
        Remarks: form3.getFieldValue("Remarks")
          ? form3.getFieldValue("Remarks")
          : form2.getFieldValue("remarks"),
      },
      content: `Appointment Booked for UHID ${values.PatientUHID} & Patient Name ${values.PatientName}`,
    };

    // Call the onSubmit function with the combined eventData
    onSubmit(eventData);
    setValue(null);
    setPatients([]);
    form1.resetFields();
    form2.resetFields();

    // Clear the title input after submission
    // setTitle("");
  };

  const handleAutoCompleteChange = async (value) => {
    try {
      setUhidLoading(true);
      if (!value.trim()) {
        setOptions([]); // Set options to an empty array
        setUhidLoading(false);
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
        const newOptions = responseData.map((option) => ({
          value: option.UhId,
          label: option.UhId,
          key: option.PatientId,
        }));
        setOptions(newOptions);
        // setOptions(responseData);
      } else {
        setOptions([]); // Set options to an empty array if the structure is not as expected
      }
      setUhidLoading(false);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setOptions([]); // Set options to an empty array in case of an error
      setUhidLoading(false);
    }
  };

  const handleSelect = (value, option) => {
    console.log("UhId", value);
    setOptions([]);
    setSelectedUhId(option.value);
  };

  const handleOnSearch = async (values) => {
    try {
      setPatientSearchLoading(true);
      const postData1 = {
        Uhid: values?.Uhid ? values.Uhid : '""',
        NameFilter: "",
        PatientName: values?.PatientName ? values.PatientName : '""',
        DateOfBirth: '""',
        RegistrationFrom: '""',
        RegistrationTo: '""',
        Age: "",
        Gender: "",
        MobileNumber: '""',
        City: '""',
        identifierType: "",
        IdentifierTypeValue: '""',
      };
      const response = await customAxios.get(
        `${urlSearchPatientRecord}?Uhid=${postData1.Uhid}&NameFilter=${postData1.NameFilter}&PatientName=${postData1.PatientName}&DateOfBirth=${postData1.DateOfBirth}&RegistrationFrom=${postData1.RegistrationFrom}&RegistrationTo=${postData1.RegistrationTo}&Age=${postData1.Age}&Gender=${postData1.Gender}&MobileNumber=${postData1.MobileNumber}&City=${postData1.City}&IdentifierType=${postData1.identifierType}&IdentifierTypeValue=${postData1.IdentifierTypeValue}`,
        null,
        {
          params: postData1,
        }
      );
      setPatients(response.data.data.Patients);
      setPatientSearchLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setPatientSearchLoading(false);
    }
  };

  const columns = [
    {
      title: "UHID",
      dataIndex: "UhId",
      key: "PatientId",
    },
    {
      title: "Name",
      dataIndex: "PatientName",
      key: "PatientName",
    },
    {
      title: "Gender",
      dataIndex: "PatientGender",
      key: "PatientId",
    },
    {
      title: "Date of Birth",
      dataIndex: "DateOfBirth",
      key: "PatientId",
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "Age",
      dataIndex: "Age",
      key: "PatientId",
    },
    {
      title: "Contact Details",
      dataIndex: "MobileNumber",
      key: "PatientId",
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log("selectedRows: ", selectedRows[0]);
      setSelecetedPatient(selectedRows[0]);
    },
  };

  const isLoading = patientSearchLoading || saveLoading || uhidLoading;

  return (
    <div>
      <Modal
        centered
        width={"50%"}
        title={
          <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>
            Schedule Appointment
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <Row>
          <Col span={8}>
            <Col span={24}>
              <b>Provider Name:</b>
            </Col>
            <Col span={24}>{providerDetails?.ProviderName}</Col>
          </Col>
          <Col span={8}>
            <Col span={24}>
              <b>Date:</b>
            </Col>
            <Col span={24}>{formatDate(selectedSlot?.start)}</Col>
          </Col>
          <Col span={8}>
            <Col span={24}>
              <b>Time:</b>
            </Col>
            <Col span={24}>
              {formatTimeSlot(selectedSlot?.start, selectedSlot?.end)}
            </Col>
          </Col>
        </Row>
        <Row style={{ margin: "1rem" }}>
          <Col>
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={"ExistingPatient"}>Existing Patient</Radio>
              <Radio value={"NewPatient"}>New Patient</Radio>
            </Radio.Group>
          </Col>
        </Row>
        {value === "ExistingPatient" ? (
          <>
            <Spin spinning={isLoading}>
              <Form
                style={{ margin: "1rem 0 0 0", width: "100%" }}
                layout="vertical"
                form={form1}
                onFinish={(values) => {
                  // handleSubmit();
                  // handleClose();

                  handleOnSearch(values);
                }}
              >
                {/* <Spin spinning={patientSearchLoading}> */}
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="UHID" name="Uhid">
                      <Select
                        loading={uhidLoading}
                        showSearch
                        placeholder="Search Patients"
                        notFoundContent="Enter Uhid To Search"
                        options={options}
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
                  </Col>
                  <Col span={8}>
                    <Form.Item name="PatientName" label="Patient Name">
                      <Input allowClear style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="&nbsp;">
                      <Button
                        style={{ width: "100%" }}
                        type="primary"
                        htmlType="submit"
                        loading={patientSearchLoading}
                      >
                        Search
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="&nbsp;">
                      <Button
                        style={{ width: "100%" }}
                        danger
                        type="default"
                        onClick={() => {
                          form1.resetFields();
                          form2.resetFields();
                          setPatients([]);
                        }}
                      >
                        Reset
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
                {/* </Spin> */}
              </Form>

              <Form
                style={{ margin: "1rem 0 0 0", width: "100%" }}
                layout="vertical"
                form={form2}
                initialValues={{
                  reason: calendarData?.AppointmentReason.find(
                    (reason) => reason.LookupID === 7067
                  ).LookupID,
                  remarks: "",
                }}
                onFinish={(values) => {
                  setSaveLoading(true);
                  try {
                    const postData = {
                      FacilityId: 1,
                      PatientId: selecetedPatient?.PatientId,
                      ProviderId: providerDetails?.ProviderId,
                      sStartTime: moment(selectedSlot?.start).format(
                        "HH:mm:ss"
                      ),
                      sEndTime: moment(selectedSlot?.end).format("HH:mm:ss"),
                      Remarks: values.remarks ? values.remarks : "",
                      Reason: values.reason,
                      sScheduleEventDate: formatDate(selectedSlot?.start),
                      AppointmentSlotNumber: 1,
                      DepartmentId: departmentDetails,
                    };
                    console.log("postData Submit", postData);

                    customAxios
                      .post(urlPatientAppointmentExist, null, {
                        params: postData,
                      })
                      .then((response) => {
                        if (response.data === "Success") {
                          alert("Patient Already Exists");
                          setSaveLoading(false);
                        } else {
                          return customAxios.post(
                            urlAddNewScheduleProviderExisitingAppointment,
                            null,
                            { params: postData }
                          );
                        }
                      })
                      .then((response) => {
                        if (response && response.data === "PastTime") {
                          message.warning("Slot is not available");
                        } else if (response) {
                          handleSubmit(response.data);
                        }
                      })
                      .catch((error) => {
                        console.error("Error:", error);
                      })
                      .finally(() => {
                        setSaveLoading(false);
                      });
                  } catch (error) {
                    console.error("Error:", error);
                    setSaveLoading(false);
                  }
                }}
              >
                <Divider style={{ margin: 0 }} />

                <Row gutter={32}>
                  <Col span={24}>
                    <CustomTable
                      columns={columns}
                      dataSource={patients}
                      actionColumn={false}
                      isFilter={true}
                      rowkey={"PatientId"}
                      rowSelection={{
                        type: "radio",
                        ...rowSelection,
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <Form.Item name="reason" label="Reason">
                      <Select
                        style={{ width: "100%" }}
                        options={calendarData?.AppointmentReason.map(
                          (reason) => ({
                            value: reason.LookupID,
                            label: reason.LookupDescription,
                            key: reason.LookupID,
                          })
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="remarks" label="Remarks">
                      <TextArea rows={2} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  {/* <Divider style={{ marginTop: "0" }} /> */}
                  <Col offset={16} span={4}>
                    <Form.Item>
                      <Button
                        style={{ width: "100%" }}
                        type="primary"
                        htmlType="submit"
                        loading={saveLoading}
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item>
                      <Button
                        style={{ width: "100%" }}
                        danger
                        type="default"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Spin>
          </>
        ) : (
          value === "NewPatient" && (
            <>
              <Spin spinning={saveLoading}>
                <Form
                  style={{ margin: "1rem 0 0 0", width: "100%" }}
                  layout="vertical"
                  form={form3}
                  onFinish={(values) => {
                    setSaveLoading(true);
                    values = {
                      ...values,
                      Dob: moment(values.Dob).format("DD-MM-YYYY"),
                      ProviderId: providerDetails?.ProviderId,
                      StartTime: moment(selectedSlot?.start).format("HH:mm:ss"),
                      EndTime: moment(selectedSlot?.end).format("HH:mm:ss"),
                      ScheduleEventDate: moment(selectedSlot?.start).format(
                        "DD-MM-YYYY"
                      ),
                      FacilityId: 1,
                      DepartmentId: departmentDetails,
                      AppointmentSlotNumber: 1,
                      PresentAreaId: values.PresentAreaId
                        ? values.PresentAreaId
                        : "",
                    };
                    form3.resetFields();
                    console.log("Submit Values", values);
                    // if (
                    //   moment(values.Dob, "DD-MM-YYYY").isAfter(
                    //     moment().endOf("day")
                    //   )
                    // ) {
                    //   message.error("Date of Birth cannot be a future date.");
                    //   return;
                    // }
                    try {
                      customAxios
                        .post(urlAddNewPatientAppointment, null, {
                          params: values,
                        })
                        .then((response) => {
                          console.log(response.data);
                          handleSubmit(response.data);
                          form3.resetFields();
                        })
                        .catch((error) => {
                          console.log(error);
                        })
                        .finally(() => {
                          setSaveLoading(false);
                        });
                    } catch (error) {
                      console.log(error);
                      setSaveLoading(false);
                    }
                  }}
                  initialValues={{
                    Reason: calendarData?.AppointmentReason?.find(
                      (reason) => reason.LookupID === 7067
                    )?.LookupID,
                    Remarks: "",
                  }}
                >
                  <Row gutter={32}>
                    <Col span={4}>
                      <Form.Item
                        name="PatientTitle"
                        label="Title"
                        rules={[
                          {
                            required: true,
                            message: "Title is Required.",
                          },
                        ]}
                      >
                        <Select
                          style={{ width: "100%" }}
                          options={calendarData?.Title?.map((title) => ({
                            label: title.LookupDescription,
                            value: title.LookupID,
                          }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        name="PatientFirstName"
                        label="First Name"
                        rules={[
                          {
                            required: true,
                            message: "First Name is Required.",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        name="PatientLastName"
                        label="Last Name"
                        rules={[
                          {
                            required: true,
                            message: "Last Name is Required.",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="MobileNumber"
                        label="Mobile Number"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your mobile number.",
                          },
                          {
                            pattern: /^\d{10}$/,
                            message: "Please enter a valid 10 digit number!",
                          },
                        ]}
                      >
                        <Input maxLength={10} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="Dob"
                        label="Date of Birth"
                        rules={[
                          {
                            required: true,
                            message: "Date of Birth is Required.",
                          },
                        ]}
                      >
                        <DatePicker
                          maxDate={dayjs().endOf("day")}
                          placeholder="DD-MM-YYYY"
                          format={"DD-MM-YYYY"}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={18}>
                      <Form.Item name="PresentAddress" label="Address">
                        <TextArea style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="CountryName" label="Country">
                        <Select
                          placeholder="Select State"
                          onChange={handleCountryChange}
                        >
                          {calendarData?.Countries?.map((country) => (
                            <Select.Option
                              key={country.LookupID}
                              value={country.LookupID}
                            >
                              {country.LookupDescription}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="StateName" label="State">
                        <Select
                          placeholder="Select State"
                          onChange={handleStateChange}
                        >
                          {filteredStates?.map((state) => (
                            <Select.Option
                              key={state.StateID}
                              value={state.StateID}
                            >
                              {state.StateName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="PlaceName" label="City">
                        <Select
                          placeholder="Select Place"
                          onChange={handlePlaceChange}
                        >
                          {filteredPlaces?.map((place) => (
                            <Select.Option
                              key={place.PlaceId}
                              value={place.PlaceId}
                            >
                              {place.PlaceName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="PresentAreaId" label="Area">
                        <Select placeholder="Select Area">
                          {filteredAreas?.map((area) => (
                            <Select.Option
                              key={area.AreaId}
                              value={area.AreaId}
                            >
                              {area.AreaName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="Reason" label="Reason">
                        <Select
                          style={{ width: "100%" }}
                          options={calendarData?.AppointmentReason.map(
                            (reason) => ({
                              value: reason.LookupID,
                              label: reason.LookupDescription,
                              key: reason.LookupID,
                            })
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="Remarks" label="Remarks">
                        <TextArea rows={2} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={32}>
                    <Col offset={16} span={4}>
                      <Form.Item>
                        <Button
                          style={{ width: "100%" }}
                          type="primary"
                          htmlType="submit"
                          loading={saveLoading}
                        >
                          Save
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item>
                        <Button
                          style={{ width: "100%" }}
                          danger
                          type="default"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Spin>
            </>
          )
        )}
      </Modal>
    </div>
  );
}

export default ScheduleAppointmentModal;
