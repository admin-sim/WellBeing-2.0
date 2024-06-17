import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import "../ProviderAppointment/style.css";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Col,
  DatePicker,
  Layout,
  Row,
  Select,
  Form,
  Spin,
  Popover,
} from "antd";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import ScheduleAppointmentModal from "./ScheduleAppointmentModal";
import Title from "antd/es/typography/Title";
import {
  urlGetScheduledProviderAppointments,
  urlGetProviderCalenderBasedOnProviderId,
  urlGetProviderBasedOnDept,
} from "../../../endpoints";
import customAxios from "../../components/customAxios/customAxios";

const customEvents = [
  {
    title: "Custom Event 1",
    start: "2024-06-06T10:30:00",
    end: "2024-06-06T11:00:00",
    type: "Booked",
  },
  {
    title: "Custom Event 2",
    start: "2024-06-10T12:00:00",
    end: "2024-06-10T12:30:00",
    type: "Booked",
  },
  {
    title: "Custom Event 3",
    start: "2024-05-29T14:00:00",
    end: "2024-05-29T14:30:00",
    type: "Booked",
  },
  {
    title: "Custom Event 4",
    start: "2024-05-30T14:00:00",
    end: "2024-05-30T14:30:00",
    type: "Booked",
  },
  {
    title: "Over Booking Event1",
    start: "2024-05-30T09:00:00",
    end: "2024-05-30T09:30:00",
    type: "Booked",
  },
  {
    title: "Over Booking Event2",
    start: "2024-05-30T18:00:00",
    end: "2024-05-30T18:30:00",
    type: "Booked",
  },
];

const MyCalendar = ({}) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverContent, setPopoverContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [departmentLoading, setDepartmentLoading] = useState(true);
  const [providerLoading, setProviderLoading] = useState(false);
  const [providersData, setProvidersData] = useState([]);
  const [providerDetails, setproviderDetails] = useState([]);
  const [departmentDetails, setDepartmentDetails] = useState(0);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [calendarData, setCalendarData] = useState(null);
  const [slotDuration, setSlotDuration] = useState("00:30:00");

  const [form] = Form.useForm();
  const handleSelect = (arg) => {
    // Handle slot selection if needed
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetScheduledProviderAppointments}`
      );

      if (response.data != null) {
        setProvidersData(response.data.data.Provider);
        setDepartmentsData(response.data.data.Department);
      } else {
        setProvidersData(null);
      }
      setDepartmentLoading(false);
    } catch (error) {
      setDepartmentLoading(false);
      console.error(error);
    }
  };

  const handleProviderChange = async (value) => {
    try {
      const response = await customAxios.get(
        `${urlGetProviderCalenderBasedOnProviderId}?ProviderId=${value}`
      );
      if (response.data != null) {
        const bookedEvents =
          response.data.data?.ScheduleProviderAppointments.map(
            (appointment) => ({
              title: appointment.PatientName,
              start: `${appointment.AppointmentDate.split("T")[0]}T${
                appointment.FromTime
              }`,
              end: `${appointment.AppointmentDate.split("T")[0]}T${
                appointment.ToTime
              }`,
              type: "Booked",
              backgroundColor: "#fea010",
              extendedProps: {
                UHID: appointment.PatientUHID,
                PatientName: appointment.PatientName,
              },
            })
          );
        console.log("bookedEvents", bookedEvents);
        setEvents(bookedEvents);
        // setEvents(response.data.data?.ScheduleProviderAppointments);
        setCalendarData(response.data.data);
        setproviderDetails(
          providersData?.filter((provider) => {
            return provider.ProviderId === value;
          })
        );
      } else {
        console.log("check the value for response", response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDepartmentChange = async (value) => {
    setProviderLoading(true);
    form.resetFields(["Provider"]);
    setDepartmentDetails(value);

    try {
      const response = await customAxios.get(
        `${urlGetProviderBasedOnDept}?Id=${value}`
      );

      setProvidersData(response.data.data);

      console.log("Deaprtment", response?.data.data);
      if (response.data != null) {
        console.log("check the value for response", response.data);
      } else {
        console.log("check the value for response", response.data);
      }
      setProviderLoading(false);
    } catch (error) {
      console.error(error);
      setProviderLoading(false);
    }
  };

  const handleEventClick = (arg) => {
    const { start, end } = arg.event;

    if (arg.event.extendedProps.type === "Booked") {
      alert("Already Booked");
    } else if (arg.event.extendedProps.type === "Available") {
      setSelectedSlot({
        start,
        end,
        title: `Booked`,
        type: "Booked",
      });
      setModalVisible(true);
    }
  };

  const generateAvailableSlots = (calendarData) => {
    setLoading(true);
    const availableSlots = [];
    let minSlotDuration = 30;
    const now = moment(); // Current date and time

    const isSlotBooked = (start, end) => {
      return events.some(
        (event) =>
          moment(event.start).isBefore(end) && moment(event.end).isAfter(start)
      );
    };

    calendarData?.ScheduleProviderAvailability?.forEach((item) => {
      const date = moment(item.CalendarDate).format("YYYY-MM-DD");

      item?.Sessions?.forEach((session) => {
        const slotDuration = session.SlotDuration * 60 * 1000; // Convert minutes to milliseconds
        minSlotDuration = Math.min(minSlotDuration, session.SlotDuration);

        const startTime = moment(`${date}T${session.StartTime}`);
        const endTime = moment(`${date}T${session.EndTime}`);

        if (endTime.isBefore(now)) {
          return; // Skip past sessions
        }

        // Overbooking slots before the session
        for (let i = 0; i < session.OverbookingSlots; i++) {
          const overbookedTimeStart = startTime
            .clone()
            .subtract((i + 1) * slotDuration, "milliseconds");
          const overbookedTimeEnd = overbookedTimeStart
            .clone()
            .add(slotDuration, "milliseconds");
          if (
            overbookedTimeStart.isBefore(startTime, "day") ||
            overbookedTimeStart.isBefore(now)
          ) {
            break; // Prevent overbooking to previous day or past time
          }
          if (!isSlotBooked(overbookedTimeStart, overbookedTimeEnd)) {
            availableSlots.push({
              title: "Overbooking",
              start: overbookedTimeStart.toISOString(),
              end: overbookedTimeEnd.toISOString(),
              type: "Available",
              backgroundColor: "#EE82EE",
            });
          }
        }

        // Available slots within the session
        for (
          let time = startTime.clone();
          time.isBefore(endTime);
          time.add(slotDuration, "milliseconds")
        ) {
          if (time.isBefore(now)) continue; // Skip past slots
          const slotEnd = time.clone().add(slotDuration, "milliseconds");
          if (!isSlotBooked(time, slotEnd)) {
            availableSlots.push({
              title: "Available",
              start: time.toISOString(),
              end: slotEnd.toISOString(),
              type: "Available",
              backgroundColor: "#4caf50",
            });
          }
        }

        // Overbooking slots after the session
        for (let i = 0; i < session.OverbookingEndSlots; i++) {
          const overbookedTimeStart = endTime
            .clone()
            .add(i * slotDuration, "milliseconds");
          const overbookedTimeEnd = overbookedTimeStart
            .clone()
            .add(slotDuration, "milliseconds");
          if (
            !isSlotBooked(overbookedTimeStart, overbookedTimeEnd) &&
            !overbookedTimeStart.isBefore(now)
          ) {
            availableSlots.push({
              title: "Overbooking",
              start: overbookedTimeStart.toISOString(),
              end: overbookedTimeEnd.toISOString(),
              type: "Overbooking",
              backgroundColor: "#EE82EE",
            });
          }
        }
      });
    });
    setLoading(false);

    return { availableSlots, minSlotDuration };
  };

  const handleModalSubmit = (eventData) => {
    const eventDataStart = moment(eventData.start).toLocaleString();
    const eventDataEnd = moment(eventData.end).toLocaleString();

    const slotIndex = availableSlots.findIndex(
      (slot) =>
        moment(moment(slot.start).toLocaleString()).isSame(eventDataStart) &&
        moment(moment(slot.end).toLocaleString()).isSame(eventDataEnd)
    );

    if (slotIndex !== -1) {
      availableSlots.splice(slotIndex, 1);
    }

    setAvailableSlots([...availableSlots]);
    eventData.backgroundColor = "#fea010";
    const newEvent = [eventData];
    setEvents([...events, ...newEvent]);
    setModalVisible(false);
  };

  useEffect(() => {
    const { availableSlots, minSlotDuration } =
      generateAvailableSlots(calendarData);
    setAvailableSlots(availableSlots);
    setSlotDuration(`00:${String(minSlotDuration).padStart(2, "0")}:00`);
  }, [calendarData]);

  const calendarRef = useRef(null);
  const jumpToSpecificDate = (dateString) => {
    // Parse the input date string into a Date object
    const [day, month, year] = dateString.split("/"); // Split by '/'
    const targetDate = new Date(`${month}/${day}/${year}`);

    if (!isNaN(targetDate)) {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(targetDate); // Navigate to the selected date
        calendarApi.changeView("timeGridDay"); // Change the view to dayGrid
      }
    }
  };
  // const tableRef = useRef(null);

  // const enterFullscreen = () => {
  //   const elem = tableRef.current;

  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen();
  //   } else if (elem.mozRequestFullScreen) {
  //     // Firefox
  //     elem.mozRequestFullScreen();
  //   } else if (elem.webkitRequestFullscreen) {
  //     // Chrome, Safari, and Opera
  //     elem.webkitRequestFullscreen();
  //   }
  // };

  // const exitFullscreen = () => {
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen();
  //   } else if (document.mozCancelFullScreen) {
  //     // Firefox
  //     document.mozCancelFullScreen();
  //   } else if (document.webkitExitFullscreen) {
  //     // Chrome, Safari, and Opera
  //     document.webkitExitFullscreen();
  //   }
  // };

  // const handleFullscreen = () => {
  //   if (!document.fullscreenElement) {
  //     setIsFullScreen(true);
  //     enterFullscreen();
  //   } else {
  //     setIsFullScreen(false);
  //     exitFullscreen();
  //   }
  // };

  return (
    <Layout>
      <div
        // ref={tableRef}
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
          <Col span={23}>
            <Title
              level={4}
              style={{
                color: "white",
                fontWeight: 500,
                margin: 0,
                paddingTop: 0,
              }}
            >
              Manage Appointment
            </Title>
          </Col>
          {/* <Col span={1}> */}
          {/* <Tooltip
            title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          > */}
          {/* <Button onClick={handleFullscreen}>
              {isFullScreen ? (
                <AiOutlineFullscreenExit style={{ fontSize: "1.5rem" }} />
              ) : (
                <AiOutlineFullscreen style={{ fontSize: "1.5rem" }} />
              )}
            </Button> */}
          {/* </Tooltip> */}
          {/* </Col> */}
        </Row>

        <Form
          style={{ margin: "0.5rem 0 0 0" }}
          form={form}
          layout="vertical"
          size="small"
          onFinish={(values) => {
            console.log(values);
          }}
        >
          <Row style={{ margin: "0 0rem" }} gutter={32}>
            <Col span={6}>
              <Form.Item name="department" label="Department">
                <Select
                  loading={departmentLoading}
                  onChange={handleDepartmentChange}
                  showSearch
                  placeholder="Select the provider"
                  style={{ width: "100%" }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {departmentsData?.map((response) => (
                    <Select.Option
                      key={response.DepartmentId}
                      value={response.DepartmentId}
                    >
                      {response.DepartmentName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="Provider" label="Provider">
                <Select
                  loading={providerLoading}
                  showSearch
                  placeholder="Select the provider"
                  style={{ width: "100%" }}
                  onChange={handleProviderChange}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {providersData?.map((response) => (
                    <Select.Option
                      key={response.ProviderId}
                      value={response.ProviderId}
                    >
                      {response.ProviderName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col
              span={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Col
                span={7}
                style={{
                  backgroundColor: "#4caf50",
                  // margin: "1.5rem 1rem",
                  color: "#fff",
                }}
              >
                <span>Available Slot</span>
              </Col>
              <Col
                span={7}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fea010",
                  // margin: "1.5rem 0",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <span>Booked Slot</span>
              </Col>
              <Col
                span={7}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#EE82EE",
                  // margin: "1.5rem 0",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <span>OverBooking Slot</span>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
      {calendarData && (
        <Spin spinning={loading}>
          <div style={{ backgroundColor: "white", padding: "0 0.5rem" }}>
            <Row
              style={{
                display: "flex",
                justifyContent: "end",
                padding: "0rem 0rem 0.5rem 1rem",
              }}
            >
              <Col>
                <span>Book by Date : </span>
                <DatePicker
                  placeholder="DD/MM/YYYY"
                  format={"DD/MM/YYYY"}
                  onChange={(date, dateString) =>
                    jumpToSpecificDate(dateString)
                  }
                />
              </Col>
            </Row>
            <FullCalendar
              ref={calendarRef}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              buttonText={{
                today: "Today",
                month: "Month",
                week: "Week",
                day: "Day",
                list: "Appointment List",
              }}
              events={[...events, ...availableSlots]}
              slotDuration={slotDuration}
              selectable={false}
              select={handleSelect}
              eventClick={handleEventClick}
              //   selectConstraint={businessHours}
              dayMaxEventRows={true}
              height="auto"
              slotEventOverlap={false}
              eventDidMount={(info) => {
                if (info.event.extendedProps.type === "Available") {
                  return;
                } else {
                  return new bootstrap.Popover(info.el, {
                    title: "Appointment Booked",
                    placement: "auto",
                    trigger: "hover",
                    customClass: "popoverStyle",
                    html: true,
                    content: `Appointment Booked for UHID = ${info.event.extendedProps.UHID} & Patient Name = ${info.event.extendedProps.PatientName}`,
                  });
                }
              }}
              titleFormat={{ year: "numeric", month: "long", day: "numeric" }}
              allDayText=""
              slotMinTime="04:00:00"
              navLinks={true}
              nowIndicator={true}
              themeSystem="bootstrap"
            />

            {popoverVisible && popoverContent}

            <ScheduleAppointmentModal
              open={modalVisible}
              onSubmit={handleModalSubmit}
              onCancel={() => setModalVisible(false)}
              selectedSlot={selectedSlot}
              calendarData={calendarData}
              providerDetails={providerDetails[0]}
              departmentDetails={departmentDetails}
            />
          </div>
        </Spin>
      )}
    </Layout>
  );
};

export default MyCalendar;
