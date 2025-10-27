
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const ContinuousCalendar = ({ onClick }) => {
  const today = new Date();
  const dayRefs = useRef([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(0);
  const monthOptions = monthNames.map((month, index) => ({ name: month, value: `${index}` }));

  const scrollToDay = (monthIndex, dayIndex) => {
    const targetDayIndex = dayRefs.current.findIndex(
      (ref) => ref && ref.getAttribute('data-month') === `${monthIndex}` && ref.getAttribute('data-day') === `${dayIndex}`,
    );
    const targetElement = dayRefs.current[targetDayIndex];

    if (targetDayIndex !== -1 && targetElement) {
      const container = document.querySelector('.calendar-container');
      const elementRect = targetElement.getBoundingClientRect();
      const is2xl = window.matchMedia('(min-width: 1536px)').matches;
      const offsetFactor = is2xl ? 3 : 2.5;

      if (container) {
        const containerRect = container.getBoundingClientRect();
        const offset = elementRect.top - containerRect.top - (containerRect.height / offsetFactor) + (elementRect.height / 2);
        container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' });
      } else {
        const offset = window.scrollY + elementRect.top - (window.innerHeight / offsetFactor) + (elementRect.height / 2);
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }
  };

  const handlePrevYear = () => setYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setYear((prevYear) => prevYear + 1);

  const handleMonthChange = (event) => {
    const monthIndex = parseInt(event.target.value, 10);
    setSelectedMonth(monthIndex);
    scrollToDay(monthIndex, 1);
  };

  const handleTodayClick = () => {
    setYear(today.getFullYear());
    scrollToDay(today.getMonth(), today.getDate());
  };

  const handleDayClick = (day, month, year) => {
    if (!onClick) return;
    if (month < 0) onClick(day, 11, year - 1);
    else onClick(day, month, year);
  };

  const generateCalendar = useMemo(() => {
    const today = new Date();

    const daysInYear = () => {
      const out = [];
      const startDayOfWeek = new Date(year, 0, 1).getDay();

      if (startDayOfWeek < 6) {
        for (let i = 0; i < startDayOfWeek; i++) {
          out.push({ month: -1, day: 32 - startDayOfWeek + i });
        }
      }

      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          out.push({ month, day });
        }
      }

      const lastWeekDayCount = out.length % 7;
      if (lastWeekDayCount > 0) {
        const extraDaysNeeded = 7 - lastWeekDayCount;
        for (let day = 1; day <= extraDaysNeeded; day++) {
          out.push({ month: 0, day });
        }
      }
      return out;
    };

    const calendarDays = daysInYear();
    const calendarWeeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarWeeks.push(calendarDays.slice(i, i + 7));
    }

    const calendar = calendarWeeks.map((week, weekIndex) => (
      <div className="grid-7 w-100" key={`week-${weekIndex}`}>
        {week.map(({ month, day }, dayIndex) => {
          const index = weekIndex * 7 + dayIndex;
          const isNewMonth = index === 0 || calendarDays[index - 1].month !== month;
          const isToday = today.getMonth() === month && today.getDate() === day && today.getFullYear() === year;

          return (
            <div
              key={`${month}-${day}`}
              ref={(el) => { dayRefs.current[index] = el; }}
              data-month={month}
              data-day={day}
              onClick={() => handleDayClick(day, month, year)}
              className="calendar-day"
            >
              <div className="calendar-square position-relative">
                <div className="position-absolute top-0 start-0 end-0 bottom-0 p-1 p-lg-2">
                  <span className={`day-number ${isToday ? 'bg-primary text-white' : ''} ${month < 0 ? 'text-secondary' : 'text-dark'}`}>{day}</span>
                  {isNewMonth && (<span className="month-label text-truncate">{monthNames[month]}</span>)}
                  <button type="button" className="btn btn-sm btn-light rounded-circle add-btn" aria-label="Add event">
                    <svg width="20" height="20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ));

    return calendar;
  }, [year]);

  useEffect(() => {
    const calendarContainer = document.querySelector('.calendar-container');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const month = parseInt(entry.target.getAttribute('data-month'), 10);
            setSelectedMonth(month);
          }
        });
      },
      { root: calendarContainer, rootMargin: '-75% 0px -25% 0px', threshold: 0 },
    );

    dayRefs.current.forEach((ref) => {
      if (ref && ref.getAttribute('data-day') === '15') {
        observer.observe(ref);
      }
    });

    return () => { observer.disconnect(); };
  }, []);

  return (
    <div className="no-scrollbar calendar-container bg-white text-dark shadow rounded-top-4 pb-4">
      <div
        className="position-sticky top-0 z-3 w-100 bg-white rounded-top-4 px-3 px-sm-4 pt-3 pt-sm-4 border-bottom"
        style={{ zIndex: 1030 }}
      >
        <div className="mb-3 d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
          <div className="d-flex flex-wrap gap-2">
            <Select name="month" value={`${selectedMonth}`} options={monthOptions} onChange={handleMonthChange} />
            <button onClick={handleTodayClick} type="button" className="btn btn-outline-secondary">Today</button>
            <button type="button" className="btn btn-primary">+ Add Event</button>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button onClick={handlePrevYear} className="btn btn-outline-secondary rounded-circle p-2" aria-label="Previous year">
              <svg width="20" height="20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/>
              </svg>
            </button>
            <h1 className="fs-5 text-center mb-0" style={{ minWidth: '5rem' }}>{year}</h1>
            <button onClick={handleNextYear} className="btn btn-outline-secondary rounded-circle p-2" aria-label="Next year">
              <svg width="20" height="20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="grid-7 text-secondary fw-semibold">
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className="w-100 text-center py-2 border-bottom">{day}</div>
          ))}
        </div>
      </div>

      <div className="w-100 px-3 px-sm-4 pt-3">
        {generateCalendar}
      </div>
    </div>
  );
};

export const Select = ({ name, value, label, options = [], onChange, className }) => (
  <div className={className || ''}>
    {label && (<label htmlFor={name} className="form-label fw-medium text-dark">{label}</label>)}
    <div className="position-relative" style={{ minWidth: 180 }}>
      <select id={name} name={name} value={value} onChange={onChange} className="form-select" required>
        {options.map((option) => (<option key={option.value} value={option.value}>{option.name}</option>))}
      </select>
    </div>
  </div>
);
