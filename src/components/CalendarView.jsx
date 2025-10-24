import React, { useState } from 'react';
import './CalendarView.css';

const CalendarView = ({ currentDate, setCurrentDate, tasks, progressData, onDayClick }) => {
  // Obtener el primer día del mes y el último día del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Obtener los días de la semana para los encabezados
  const getWeekDays = () => {
    return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  };

  // Navegar entre meses
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Verificar si un día tiene tareas completadas
  const getDayStatus = (day) => {
    const dateKey = day.toISOString().split('T')[0];
    const dayProgress = progressData[dateKey] || {};
    
    let completedCount = 0;
    let totalCount = tasks.length;
    
    tasks.forEach(task => {
      if (dayProgress[task.id] === 'checked') {
        completedCount++;
      }
    });
    
    if (totalCount === 0) return 'no-tasks';
    if (completedCount === 0) return 'no-tasks'; // Cambiado de 'pending' a 'no-tasks'
    if (completedCount === totalCount) return 'completed';
    return 'partial'; // Cambiado de 'pending' a 'partial' para tareas parcialmente completadas
  };

  // Verificar si un día es el día de hoy
  const isToday = (day) => {
    const today = new Date();
    return day.getDate() === today.getDate() &&
           day.getMonth() === today.getMonth() &&
           day.getFullYear() === today.getFullYear();
  };

  // Verificar si un día es anterior al día de hoy
  const isPastDay = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    const compareDay = new Date(day);
    compareDay.setHours(0, 0, 0, 0);
    return compareDay < today;
  };

  // Renderizar días del mes
  const renderCalendarDays = () => {
    const days = getDaysInMonth(currentDate);
    const firstDayOfMonth = days[0].getDay();
    
    // Agregar días vacíos al principio del mes
    const emptyDays = Array(firstDayOfMonth).fill(null);
    
    return (
      <>
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="calendar-day empty"></div>
        ))}
        {days.map(day => {
          const status = getDayStatus(day);
          const today = isToday(day);
          const pastDay = isPastDay(day);
          
          return (
            <div 
              key={day.toISOString()} 
              className={`calendar-day ${status} ${today ? 'today' : ''} ${pastDay ? 'past' : ''}`}
              onClick={() => onDayClick(day)}
            >
              <div className="day-header">
                <span className="day-number">{day.getDate()}</span>
              </div>
              <div className="day-status">
                {status === 'completed' && <span className="status-icon">✓</span>}
                {status === 'partial' && <span className="status-icon">~</span>}
                {status === 'no-tasks' && <span className="status-icon"></span>}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div className="calendar-navigation-left">
          <button onClick={goToPreviousMonth} className="nav-button">←</button>
          <button onClick={goToToday} className="nav-button">Hoy</button>
        </div>
        <h2>{currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h2>
        <div className="calendar-navigation-right">
          <button onClick={goToNextMonth} className="nav-button">→</button>
        </div>
      </div>
      
      <div className="calendar-grid">
        <div className="weekdays">
          {getWeekDays().map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="days-grid">
          {renderCalendarDays()}
        </div>
      </div>
      
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color completed"></div>
          <span>Completado</span>
        </div>
        <div className="legend-item">
          <div className="legend-color partial"></div>
          <span>Parcial</span>
        </div>
        <div className="legend-item">
          <div className="legend-color today"></div>
          <span>Día actual</span>
        </div>
        <div className="legend-item">
          <div className="legend-color past"></div>
          <span>Días pasados</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;