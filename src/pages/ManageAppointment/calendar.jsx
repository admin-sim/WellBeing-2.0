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
  Input,
  Layout,
  Row,
  Select,
  Tooltip,
  Form,
  Spin,
} from "antd";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import ScheduleAppointmentModal from "../ProviderAppointment/ScheduleAppointmentModal";
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

const MyCalendar = ({}) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState(customEvents);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverContent, setPopoverContent] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [providersData, setProvidersData] = useState([]);
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
    try {
      const response = await customAxios.get(
        `${urlGetProviderCalenderBasedOnProviderId}?ProviderId=${value}`
      );
      setCalendarData(response.data.data);
      console.log("Sche", response?.data.data.ScheduleProviderAvailability);
      if (response.data != null) {
        console.log("check the value for response", response.data);
      } else {
        console.log("check the value for response", response.data);
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

  const generateAvailableSlots = (calendarData) => {
    setLoading(true);
    const availableSlots = [];
    let minSlotDuration = 30;

    const now = moment(); // Current date and time

    calendarData?.ScheduleProviderAvailability.forEach((item) => {
      const date = moment(item.CalendarDate).format("YYYY-MM-DD");

      item.Sessions.forEach((session) => {
        const slotDuration = session.SlotDuration * 60 * 1000; // Convert minutes to milliseconds
        minSlotDuration = Math.min(minSlotDuration, session.SlotDuration);

        const startTime = moment(`${date}T${session.StartTime}`);
        const endTime = moment(`${date}T${session.EndTime}`);

        if (endTime.isBefore(now)) {
          return; // Skip past sessions
        }

        const overbookingSlots = session.OverbookingSlots;
        const overbookingEndSlots = session.OverbookingEndSlots;

        for (let i = 0; i < overbookingSlots; i++) {
          const overbookedTime = startTime
            .clone()
            .subtract((i + 1) * slotDuration, "milliseconds");
          if (
            overbookedTime.isBefore(startTime, "day") ||
            overbookedTime.isBefore(now)
          )
            break; // Prevent overbooking to previous day or past time
          availableSlots.push({
            title: "Overbooking",
            start: overbookedTime.toISOString(),
            end: overbookedTime.add(slotDuration, "milliseconds").toISOString(),
            type: "Overbooking",
            backgroundColor: "#ff9800",
          });
          overbookedTime.subtract(slotDuration, "milliseconds"); // Revert time back to correct starting point
        }

        for (
          let time = startTime.clone();
          time.isBefore(endTime);
          time.add(slotDuration, "milliseconds")
        ) {
          if (time.isBefore(now)) continue; // Skip past slots

          availableSlots.push({
            title: "Available",
            start: time.toISOString(),
            end: time.add(slotDuration, "milliseconds").toISOString(),
            type: "Available",
            backgroundColor: "#4caf50",
          });
          time.subtract(slotDuration, "milliseconds"); // Revert time back to correct starting point
        }

        for (let i = 0; i < overbookingEndSlots; i++) {
          const overbookedTime = endTime
            .clone()
            .add(i * slotDuration, "milliseconds");
          if (overbookedTime.isBefore(now)) continue; // Skip past overbooking slots

          availableSlots.push({
            title: "Overbooking",
            start: overbookedTime.toISOString(),
            end: overbookedTime.add(slotDuration, "milliseconds").toISOString(),
            type: "Overbooking",
            backgroundColor: "#ff9800",
          });
          overbookedTime.subtract(slotDuration, "milliseconds"); // Revert time back to correct starting point
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
    console.log(minSlotDuration);
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
              Manage Appointment
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
                    option.children.toLowerCase().includes(input.toLowerCase())
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
                    option.children.toLowerCase().includes(input.toLowerCase())
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
      {calendarData && (
        <Spin spinning={loading}>
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
                  onChange={(date, dateString) =>
                    jumpToSpecificDate(dateString)
                  }
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
              //   selectConstraint={businessHours}
              dayMaxEventRows={true}
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
            />
          </div>
        </Spin>
      )}
    </Layout>
  );
};

export default MyCalendar;
