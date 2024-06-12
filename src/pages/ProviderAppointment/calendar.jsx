import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import "./style.css";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Layout,
  Row,
  Select,
  Tooltip,
  Form,
} from "antd";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import ScheduleAppointmentModal from "./ScheduleAppointmentModal";
import Title from "antd/es/typography/Title";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  urlGetScheduledProviderAppointments,
  urlGetProviderCalenderBasedOnProviderId,
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

customEvents.map((event) => {
  if (event.type === "Booked") {
    event.backgroundColor = "#fea010";
  } else if (event.type === "Holiday") {
    event.backgroundColor = "#abaaa7";
  } else if (event.type === "OverBookingSlot") {
    event.backgroundColor = "violet";
  }
});

const MyCalendar = ({
  businessHours,
  slotDuration,
  patientPerSlot,
  overBookingSlotsBegin,
  overBookingSlotsEnd,
  Holidays,
}) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState(customEvents);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverContent, setPopoverContent] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [providersData, setProvidersData] = useState([]);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [form] = Form.useForm();
  const handleSelect = (arg) => {
    // Handle slot selection if needed
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;
    setLoading(true);
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
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleProviderChange = async (value) => {
    debugger;
    try {
      const response = await customAxios.get(
        `${urlGetProviderCalenderBasedOnProviderId}?ProviderId=${value}`
      );
      if (response.data != null) {
        console.log("check the value for response",response.data);
      } else {
        console.log("check the value for response",response.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
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

  const generateHolidayEvents = (Holidays) => {
    const { HolidayFrom, HolidayTo } = Holidays;
    const holidays = [];

    const startDate = moment(HolidayFrom, "DD-MM-YYYY");
    const endDate = moment(HolidayTo, "DD-MM-YYYY");

    for (let date = startDate; date <= endDate; date.add(1, "days")) {
      holidays.push({
        title: "Holiday",
        start: date.format(`YYYY-MM-DDT10:00:00`),
        end: date.format("YYYY-MM-DDT18:00:00"),
        type: "Holiday",
        backgroundColor: "#abaaa7",
      });
    }

    return holidays;
  };

  const isHoliday = (date, holidays) => {
    return holidays.some((holiday) => {
      const holidayStart = new Date(holiday.start);
      const holidayEnd = new Date(holiday.end);
      return date >= holidayStart && date <= holidayEnd;
    });
  };

  const generateAvailableSlots = (holidays) => {
    const availableSlots = [];
    const currentDate = new Date();

    const [startHour, startMinute, startSecond] = businessHours.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinute, endSecond] = businessHours.endTime
      .split(":")
      .map(Number);
    const [SlotHours, SlotMinutes, SlotSeconds] = slotDuration
      .split(":")
      .map(Number);

    // Convert slot duration to milliseconds
    const slotDurationMillis =
      (SlotHours * 60 * 60 + SlotMinutes * 60 + SlotSeconds) * 1000;

    for (let i = 0; i < 30; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      const start = new Date(date);
      start.setHours(startHour, startMinute, 0);
      const end = new Date(date);
      end.setHours(endHour, endMinute, 0);

      // Skip holidays
      if (isHoliday(date, holidays)) {
        continue;
      }

      // Generate overbooking slots before business hours
      for (let j = 1; j <= overBookingSlotsBegin; j++) {
        const overBookingStart = new Date(
          start.getTime() - j * slotDurationMillis
        );
        const overBookingEnd = new Date(
          overBookingStart.getTime() + slotDurationMillis
        );

        // Check if an event already exists in this overbooking slot
        const existingEvent = customEvents?.some(
          (event) =>
            new Date(event.start) <= overBookingStart &&
            new Date(event.end) > overBookingStart
        );

        if (
          !existingEvent &&
          overBookingStart >= currentDate &&
          overBookingStart.getDay() !== 0 &&
          overBookingStart.getDay() !== 6
        ) {
          availableSlots.push({
            start: overBookingStart,
            end: overBookingEnd,
            title: "Over Booking Slot",
            type: "OverBookingSlot",
            backgroundColor: "violet",
          });
        }
      }

      // Generate available slots within business hours
      for (
        let time = start.getTime();
        time < end.getTime();
        time += slotDurationMillis
      ) {
        const slotStart = new Date(time);
        const slotEnd = new Date(time + slotDurationMillis);

        if (
          slotStart >= currentDate &&
          slotStart.getHours() >= startHour &&
          slotStart.getHours() < endHour &&
          slotStart.getDay() !== 0 &&
          slotStart.getDay() !== 6
        ) {
          const isBookedSlot = customEvents.some(
            (event) =>
              new Date(event.start) <= slotStart &&
              new Date(event.end) > slotStart
          );
          if (!isBookedSlot) {
            for (
              let i = 0;
              i < Number(patientPerSlot > 0 ? patientPerSlot : 1);
              i++
            ) {
              const slot = {
                start: slotStart,
                end: slotEnd,
                title: "Book Appointment",
                type: "Available",
                backgroundColor: "#4caf50",
              };
              availableSlots.push(slot);
            }
          }
        }
      }

      // Generate overbooking slots after business hours
      for (let j = 1; j <= overBookingSlotsEnd; j++) {
        const overBookingStart = new Date(
          end.getTime() + (j - 1) * slotDurationMillis
        );
        const overBookingEnd = new Date(
          overBookingStart.getTime() + slotDurationMillis
        );

        // Check if an event already exists in this overbooking slot
        const existingEvent = customEvents?.some(
          (event) =>
            new Date(event.start) <= overBookingStart &&
            new Date(event.end) > overBookingStart
        );

        if (
          !existingEvent &&
          overBookingStart >= currentDate &&
          overBookingStart.getDay() !== 0 &&
          overBookingStart.getDay() !== 6
        ) {
          availableSlots.push({
            start: overBookingStart,
            end: overBookingEnd,
            title: "OverBookingSlot",
            type: "OverBookingSlot",
            backgroundColor: "violet",
          });
        }
      }
    }
    return availableSlots;
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
    const holidayEvents = generateHolidayEvents(Holidays);
    setEvents([...customEvents, ...holidayEvents]);

    const availableSlots = generateAvailableSlots(holidayEvents);
    setAvailableSlots(availableSlots);
  }, [Holidays]);

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
  const tableRef = useRef(null);

  const enterFullscreen = () => {
    const elem = tableRef.current;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      // Chrome, Safari, and Opera
      elem.webkitRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari, and Opera
      document.webkitExitFullscreen();
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      setIsFullScreen(true);
      enterFullscreen();
    } else {
      setIsFullScreen(false);
      exitFullscreen();
    }
  };

  return (
    <Layout>
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
              Provider Schedule Appointment
            </Title>
          </Col>
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
                    showSearch
                    placeholder="Select the provider"
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {departmentsData.map((response) => (
                      <Select.Option
                        key={response.FacilityDepartmentId}
                        value={response.FacilityDepartmentId}
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
                    showSearch
                    placeholder="Select the provider"
                    style={{ width: "100%" }}
                    onChange={handleProviderChange}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {providersData.map((response) => (
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
                justifyContent: "center",
              }}
            >
              <Row gutter={32}>
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
                  offset={1}
                  span={7}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#4caf50",
                    // margin: "1.5rem 0",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <span>Available Slot</span>
                </Col>
                <Col
                  offset={1}
                  span={7}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#4caf50",
                    // margin: "1.5rem 0",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <span>Available Slot</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
      <div
        style={{ backgroundColor: "white", padding: "0 0.5rem" }}
        ref={tableRef}
      >
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
              format={"DD/MM/YYYY"}
              onChange={(date, dateString) => jumpToSpecificDate(dateString)}
            />
          </Col>
          <Col style={{ margin: "0 0 0 1rem" }}>
            {/* <Tooltip
            title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          > */}
            <Button onClick={handleFullscreen}>
              {isFullScreen ? (
                <AiOutlineFullscreenExit style={{ fontSize: "1.5rem" }} />
              ) : (
                <AiOutlineFullscreen style={{ fontSize: "1.5rem" }} />
              )}
            </Button>
            {/* </Tooltip> */}
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
          selectConstraint={businessHours}
          dayMaxEventRows={false}
          height="auto"
          slotEventOverlap={false}
          eventDidMount={(info) => {
            if (info.event.extendedProps.type === "Available") {
              return;
            } else if (info.event.title === "OverBookingSlot") {
              return;
            } else {
              return new bootstrap.Popover(info.el, {
                title: info.event.title,
                placement: "auto",
                trigger: "hover",
                customClass: "popoverStyle",
                content: `<strong>Content</strong>`,
                html: true,
              });
            }
          }}
          titleFormat={{ year: "numeric", month: "long", day: "numeric" }}
          allDayText=""
          slotMinTime="07:00:00"
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
        />
      </div>
    </Layout>
  );
};

export default MyCalendar;
