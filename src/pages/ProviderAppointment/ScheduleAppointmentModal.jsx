import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import {
  urlAddNewScheduleProviderExisitingAppointment,
  urlPatientAppointmentExist,
  urlSearchPatientRecord,
  urlSearchUHID,
} from "../../../endpoints";
import customAxios from "../../components/customAxios/customAxios";
import CustomTable from "../../components/customTable/index";
import moment from "moment";

const { Text } = Typography;

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
  const handleCancel = () => {
    form1.resetFields();
    form2.resetFields();
    setPatients([]);
    onCancel();
  };
  const [value, setValue] = useState(null);
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selecetedPatient, setSelecetedPatient] = useState({});

  useEffect(() => {
    setPatients([]);
    form1.resetFields();
    form2.resetFields();
  }, [value]);

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

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
      extendedProps: {
        UHID: values.PatientUHID,
        PatientName: values.PatientName,
      },
      content: `Appointment Booked for UHID ${values.PatientUHID} & Patient Name ${values.PatientName}`,
    };

    // Call the onSubmit function with the combined eventData
    onSubmit(eventData);

    // Clear the title input after submission
    // setTitle("");
    console.log("handleSubmitBootstrapModalData", values);
  };

  const handleAutoCompleteChange = async (value) => {
    try {
      if (!value.trim()) {
        setOptions([]); // Set options to an empty array
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
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setOptions([]); // Set options to an empty array in case of an error
    }
  };

  const handleSelect = (value, option) => {
    console.log("UhId", value);
    setSelectedUhId(option.value);
  };

  const handleOnSearch = (values) => {
    console.log("Form Values:", values);

    try {
      // setLoading(true);
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
      customAxios
        .get(
          `${urlSearchPatientRecord}?Uhid=${postData1.Uhid}&NameFilter=${postData1.NameFilter}&PatientName=${postData1.PatientName}&DateOfBirth=${postData1.DateOfBirth}&RegistrationFrom=${postData1.RegistrationFrom}&RegistrationTo=${postData1.RegistrationTo}&Age=${postData1.Age}&Gender=${postData1.Gender}&MobileNumber=${postData1.MobileNumber}&City=${postData1.City}&IdentifierType=${postData1.identifierType}&IdentifierTypeValue=${postData1.IdentifierTypeValue}`,
          null,
          {
            params: postData1,
          }
        )
        .then((response) => {
          setPatients(response.data.data.Patients);
        });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // setLoading(false);
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

  return (
    <div>
      <Modal
        width={"60%"}
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
            <Form
              style={{ margin: "1rem 0 0 0", width: "100%" }}
              layout="vertical"
              form={form1}
              onFinish={(values) => {
                // handleSubmit();
                // form1.resetFields();
                // handleClose();
                handleOnSearch(values);
              }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="UHID" name="Uhid">
                    <AutoComplete
                      id="uhid-autocomplete"
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
                    <Input
                      allowClear
                      style={{ width: "100%" }}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="&nbsp;">
                    <Button
                      style={{ width: "100%" }}
                      type="primary"
                      htmlType="submit"
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
            </Form>

            <Form
              style={{ margin: "1rem 0 0 0", width: "100%" }}
              layout="vertical"
              form={form2}
              onFinish={(values) => {
                try {
                  const postData = {
                    FacilityId: 1,
                    PatientId: selecetedPatient?.PatientId,
                    ProviderId: providerDetails?.ProviderId,
                    sStartTime: moment(selectedSlot?.start).format("HH:mm:ss"),
                    sEndTime: moment(selectedSlot?.end).format("HH:mm:ss"),
                    Remarks: values.remarks ? values.remarks : "",
                    Reason: values.reason,
                    sScheduleEventDate: formatDate(selectedSlot?.start),
                    AppointmentSlotNumber: 1,
                    DepartmentId: departmentDetails,
                  };
                  customAxios
                    .post(
                      `${urlPatientAppointmentExist}?Patientid=${postData.PatientId}&ProviderId=${postData.ProviderId}&sStartTime=${postData.sStartTime}&sEndTime=${postData.sEndTime}&sScheduleEventDate=${postData.sScheduleEventDate}&DepartmentId=${postData.DepartmentId}`,
                      null,
                      { params: postData }
                    )
                    .then((response) => {
                      console.log(response.data);
                      if (response.data == "Success") {
                        alert("Patient Already Exists");
                        return;
                      } else {
                        customAxios
                          .post(
                            `${urlAddNewScheduleProviderExisitingAppointment}?FacilityId=${postData.FacilityId}&PatientId=${postData.PatientId}&ProviderId=${postData.ProviderId}&sStartTime=${postData.sStartTime}&sEndTime=${postData.sEndTime}&Remarks=${postData.Remarks}&Reason=${postData.Reason}&sScheduleEventDate=${postData.sScheduleEventDate}&AppointmentSlotNumber=${postData.AppointmentSlotNumber}&DepartmentId=${postData.DepartmentId}`,
                            null,
                            {
                              params: postData,
                            }
                          )
                          .then((response) => {
                            if (response.data == "PastTime") {
                              message.warning("Slot is not available");
                            } else {
                              handleSubmit(response.data);
                            }
                            console.log(response);
                          });
                      }
                    });
                } catch (error) {
                  console.error("Error:", error);
                }
              }}
            >
              {patients.length > 0 && (
                <>
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
                </>
              )}
            </Form>
          </>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
}

export default ScheduleAppointmentModal;
