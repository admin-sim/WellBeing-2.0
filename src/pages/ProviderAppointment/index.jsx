import React from "react";
import MyCalendar from "./calendar";

function ProviderAppointment() {
  return (
    <>
      <div>
        <MyCalendar
          businessHours={{
            startTime: "10:00",
            endTime: "18:00",
            daysOfWeek: [1, 2, 3, 4, 5], // Monday-Friday, 0 for Sunday, 6 for Saturday
          }}
          // businessHours={{
          //   initialView: "timelineWeek",
          //   resources: [
          //     {
          //       id: "a",
          //       title: "Resource A",
          //       businessHours: {
          //         startTime: "10:00",
          //         endTime: "18:00",
          //       },
          //     },
          //     {
          //       id: "b",
          //       title: "Resource B",
          //       businessHours: {
          //         startTime: "11:00",
          //         endTime: "17:00",
          //         daysOfWeek: [1, 3, 5], // Mon,Wed,Fri
          //       },
          //     },
          //   ],
          // }}
          slotDuration={"00:30:00"}
          patientPerSlot="1"
          overBookingSlotsBegin="3"
          overBookingSlotsEnd="2"
          Holidays={{ HolidayFrom: "03-06-2024", HolidayTo: "04-06-2024" }}
        />
      </div>
    </>
  );
}

export default ProviderAppointment;
