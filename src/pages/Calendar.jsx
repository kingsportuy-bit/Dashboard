import React, { useState, useEffect, useContext } from 'react';
import { SupabaseContext } from '../contexts/SupabaseContext';
import CalendarView from '../components/CalendarView';
import TaskConfig from '../components/TaskConfig';
import DayDetail from '../components/DayDetail';
import Footer from '../components/Footer';
import './Calendar.css';

const Calendar = () => {
  const { supabase, user } = useContext(SupabaseContext);
  const [view, setView] = useState('calendar'); // 'calendar', 'config', 'day'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar tareas y progreso al iniciar
  useEffect(() => {
    loadTasksAndProgress();
  }, []);

  const loadTasksAndProgress = async () => {
    try {
      setLoading(true);
      
      // Obtener todas las tareas
      const { data: tasksData, error: tasksError } = await supabase
        .from('dashboard_items')
        .select('*')
        .eq('calendar_id', 1) // Usamos un ID fijo para simplificar
        .order('position', { ascending: true });

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);

      // Obtener progreso para el mes actual
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${new Date(year, currentDate.getMonth() + 1, 0).getDate()}`;

      const { data: progressData, error: progressError } = await supabase
        .from('dashboard_user_progress')
        .select('*')
        .eq('user_id', user.id)
        .gte('progress_date', startDate)
        .lte('progress_date', endDate);

      if (progressError) throw progressError;

      // Organizar los datos de progreso por fecha e ítem
      const progressMap = {};
      progressData.forEach(progress => {
        const dateKey = progress.progress_date;
        if (!progressMap[dateKey]) {
          progressMap[dateKey] = {};
        }
        progressMap[dateKey][progress.item_id] = progress.progress_value;
      });

      setProgressData(progressMap);
    } catch (error) {
      console.error('Error loading tasks and progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setView('day');
  };

  const handleBackToCalendar = () => {
    setView('calendar');
    loadTasksAndProgress(); // Refrescar datos
  };

  const handleSaveTaskConfig = () => {
    setView('calendar');
    loadTasksAndProgress(); // Refrescar datos
  };

  if (loading && view !== 'day') {
    return (
      <div className="calendar">
        <div className="card">
          <h2>Calendario de Tareas</h2>
          <div className="loading">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar">
      <h1>Calendario de Tareas</h1>
      
      <div className="card">
        <div className="view-controls">
          <button 
            className={view === 'calendar' ? 'active' : ''}
            onClick={() => setView('calendar')}
          >
            Calendario
          </button>
          <button 
            className={view === 'config' ? 'active' : ''}
            onClick={() => setView('config')}
          >
            Configuración
          </button>
        </div>
        
        <div className="calendar-content">
          {view === 'calendar' && (
            <CalendarView 
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              tasks={tasks}
              progressData={progressData}
              onDayClick={handleDayClick}
            />
          )}
          
          {view === 'config' && (
            <TaskConfig 
              tasks={tasks}
              onSave={handleSaveTaskConfig}
            />
          )}
          
          {view === 'day' && selectedDate && (
            <DayDetail 
              date={selectedDate}
              tasks={tasks}
              progressData={progressData[selectedDate.toISOString().split('T')[0]] || {}}
              onBack={handleBackToCalendar}
              onProgressUpdate={loadTasksAndProgress}
            />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Calendar;