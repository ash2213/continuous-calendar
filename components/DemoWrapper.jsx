'use client';
import React from "react";
import { useSnack } from "@/app/SnackProvider";
import { ContinuousCalendar } from "@/components/ContinuousCalendar";
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function DemoWrapper() {
  const { createSnack } = useSnack();
  const onClickHandler = (day, month, year) => createSnack(`Clicked on ${monthNames[month]} ${day}, ${year}`, 'success');
  return (
    <div className="position-relative d-flex fullscreen w-100 flex-column gap-3 px-3 pt-3 align-items-center justify-content-center">
      <div className="position-relative h-100 overflow-auto mt-5 w-100" style={{ maxWidth: 1100 }}>
        <ContinuousCalendar onClick={onClickHandler} />
      </div>
    </div>
  );
}
