import React, { useState, useEffect, useContext } from 'react';
import { SupabaseContext } from '../contexts/SupabaseContext';
import CalendarItem from './CalendarItem';
import './CalendarTab.css';

const CalendarTab = ({ calendarId, onCalendarsUpdate }) => {
  const { supabase } = useContext(SupabaseContext);
  const [calendar, setCalendar] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

  useEffect(() => {
    fetchCalendarData();
  }, [calendarId, date]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      
      // Fetch calendar info
      const { data: calendarData, error: calendarError } = await supabase
        .from('dashboard_calendars')
        .select('*')
        .eq('id', calendarId)
        .single();

      if (calendarError) throw calendarError;
      setCalendar(calendarData);

      // Fetch items for this calendar
      const { data: itemsData, error: itemsError } = await supabase
        .from('dashboard_items')
        .select('*')
        .eq('calendar_id', calendarId)
        .order('position', { ascending: true });

      if (itemsError) throw itemsError;

      // Fetch progress for each item
      const itemsWithProgress = await Promise.all(
        itemsData.map(async (item) => {
          const { data: progressData, error: progressError } = await supabase
            .from('dashboard_user_progress')
            .select('progress_value')
            .eq('item_id', item.id)
            .eq('progress_date', date)
            .maybeSingle();

          if (progressError) throw progressError;

          return {
            ...item,
            progress: progressData ? progressData.progress_value : null
          };
        })
      );

      setItems(itemsWithProgress);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (itemId, progressValue) => {
    try {
      const { data, error } = await supabase
        .from('dashboard_user_progress')
        .upsert({
          item_id: itemId,
          user_id: 'user-id-placeholder', // En una implementación real, usaríamos el ID del usuario autenticado
          progress_date: date,
          progress_value: progressValue,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'item_id,user_id,progress_date'
        });

      if (error) throw error;

      // Actualizar el estado local
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, progress: progressValue } : item
        )
      );
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return <div>Cargando datos del calendario...</div>;
  }

  return (
    <div className="calendar-tab">
      <div className="calendar-header">
        <h3>{calendar?.name}</h3>
        <p>{calendar?.description}</p>
        <div className="date-selector">
          <label htmlFor="date">Fecha: </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <div className="calendar-items">
        {items.length === 0 ? (
          <p>No hay ítems configurados para este calendario.</p>
        ) : (
          items.map((item) => (
            <CalendarItem
              key={item.id}
              item={item}
              onProgressUpdate={handleProgressUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarTab;