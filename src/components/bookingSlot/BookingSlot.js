import React, { useState } from "react";
import styles from "./BookingSlot.module.scss";

const BookingSlot = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeSlots = [
    "9am",
    "10am",
    "11am",
    "12pm",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
  ];
  const [selectedSlot, setSelectedSlot] = useState({ day: null, time: null });

  const handleSelectSlot = (day, time) => {
    setSelectedSlot({ day, time });
  };

  return (
    <div className={styles.bookingContainer}>
      <h4>Delivery details</h4>
      <div className={styles.gridContainer}>
        {days.map((day) => (
          <div key={day} className={styles.dayColumn}>
            <div className={styles.dayHeader}>{day}</div>
            {timeSlots.map((time) => (
              <button
                key={time}
                className={`${styles.slot} ${
                  selectedSlot.day === day && selectedSlot.time === time
                    ? styles.selected
                    : ""
                }`}
                onClick={() => handleSelectSlot(day, time)}
              >
                {time}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingSlot;
