import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import './CalendarPicker.css';

const TIME_SLOTS = ["08:30", "10:30", "13:30", "15:30", "17:30"];

export default function CalendarPicker({ selectedDate, onSelectDate, selectedTime, onSelectTime, turnsList }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const now = new Date();

  // Cambiar de mes
  const changeMonth = (direction) => {
    let nextMonth = currentMonth + direction;
    let nextYear = currentYear;

    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear--;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }

    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
  };

  const getMonthName = () => {
    return new Date(currentYear, currentMonth).toLocaleString("es-AR", { month: "long" }).toUpperCase();
  };

  // Generar días del mes
  const generateDays = () => {
    const days = [];
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Relleno inicial
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ type: 'empty', key: `empty-${i}` });
    }

    // Días reales
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const cellDate = new Date(currentYear, currentMonth, day);
      
      const isPast = new Date(now.getFullYear(), now.getMonth(), now.getDate()) > cellDate;
      const isSunday = cellDate.getDay() === 0;

      days.push({
        type: 'day',
        dayNum: day,
        dateStr,
        isDisabled: isPast || isSunday,
        key: `day-${day}`
      });
    }

    return days;
  };

  // Obtener turnos ya agendados en la fecha elegida
  const getOccupiedSlots = () => {
    if (!selectedDate) return [];
    return turnsList
      .filter(t => t.date === selectedDate && t.status !== "completed")
      .map(t => t.time);
  };

  const occupiedSlots = getOccupiedSlots();

  return (
    <div className="datetime-picker-grid">
      {/* Tarjeta del Calendario */}
      <div className="picker-card calendar-card-pro">
        <div className="picker-header">
          <div className="picker-title-area">
            <Calendar className="picker-icon" size={20} />
            <h3>Fecha de Ingreso</h3>
          </div>
          <div className="calendar-controls">
            <button type="button" onClick={() => changeMonth(-1)} className="cal-nav-btn">
              <ChevronLeft size={16} />
            </button>
            <span className="month-display">{getMonthName()} {currentYear}</span>
            <button type="button" onClick={() => changeMonth(1)} className="cal-nav-btn">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="calendar-body">
          <div className="weekdays-grid">
            <span>Dom</span><span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span>
          </div>
          <div className="days-grid-pro">
            {generateDays().map((item) => {
              if (item.type === 'empty') {
                return <div key={item.key} className="day-cell-pro empty"></div>;
              }

              const isSelected = selectedDate === item.dateStr;

              return (
                <button
                  type="button"
                  key={item.key}
                  disabled={item.isDisabled}
                  onClick={() => onSelectDate(item.dateStr)}
                  className={`day-cell-pro ${item.isDisabled ? 'disabled' : 'available'} ${isSelected ? 'selected' : ''}`}
                >
                  {item.dayNum}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tarjeta de Horarios */}
      <div className="picker-card time-slots-card-pro">
        <div className="picker-header">
          <div className="picker-title-area">
            <Clock className="picker-icon" size={20} />
            <h3>Horario del Turno</h3>
          </div>
        </div>

        <div className="time-slots-body">
          {selectedDate ? (
            <>
              <p className="selected-date-label">
                Disponibilidad para el: <span>{new Date(selectedDate.split("-")[0], selectedDate.split("-")[1] - 1, selectedDate.split("-")[2]).toLocaleDateString("es-AR", { weekday: 'long', day: 'numeric', month: 'short' })}</span>
              </p>
              <div className="slots-grid-pro">
                {TIME_SLOTS.map((time) => {
                  const isOccupied = occupiedSlots.includes(time);
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      type="button"
                      key={time}
                      disabled={isOccupied}
                      onClick={() => onSelectTime(time)}
                      className={`slot-btn-pro ${isOccupied ? 'occupied' : 'available'} ${isSelected ? 'selected' : ''}`}
                    >
                      {time} hs
                      {isOccupied && <span className="slot-badge">Ocupado</span>}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="empty-slots-state">
              <Calendar size={36} className="empty-icon" />
              <p>Por favor, seleccioná una fecha en el calendario de la izquierda para ver los horarios disponibles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
