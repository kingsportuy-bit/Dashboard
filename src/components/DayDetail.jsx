import React, { useState, useContext } from 'react';
import { SupabaseContext } from '../contexts/SupabaseContext';
import './DayDetail.css';

const DayDetail = ({ date, tasks, progressData, onBack, onProgressUpdate }) => {
  const { supabase, user } = useContext(SupabaseContext);
  const [localProgress, setLocalProgress] = useState({ ...progressData });
  const [saving, setSaving] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleTaskToggle = async (taskId) => {
    const newStatus = localProgress[taskId] === 'checked' ? null : 'checked';
    const updatedProgress = { ...localProgress };
    
    if (newStatus) {
      updatedProgress[taskId] = newStatus;
    } else {
      delete updatedProgress[taskId];
    }
    
    setLocalProgress(updatedProgress);
    
    // Guardar en la base de datos
    try {
      const dateStr = date.toISOString().split('T')[0];
      
      if (newStatus) {
        // Insertar o actualizar progreso
        await supabase
          .from('dashboard_user_progress')
          .upsert({
            item_id: taskId,
            user_id: user.id, // Usamos el ID del usuario autenticado
            progress_date: dateStr,
            progress_value: newStatus,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'item_id,user_id,progress_date'
          });
      } else {
        // Eliminar progreso
        await supabase
          .from('dashboard_user_progress')
          .delete()
          .eq('item_id', taskId)
          .eq('progress_date', dateStr);
      }
      
      // Actualizar datos principales
      onProgressUpdate();
    } catch (error) {
      console.error('Error updating progress:', error);
      // Revertir cambios locales si hay error
      setLocalProgress({ ...progressData });
    }
  };

  return (
    <div className="day-detail">
      <div className="day-header">
        <button onClick={onBack} className="back-button secondary">
          ← Volver al Calendario
        </button>
        <h2>{formatDate(date)}</h2>
      </div>
      
      <div className="card">
        <h3>Tareas del Día</h3>
        {tasks.length === 0 ? (
          <div className="no-tasks-message">
            <p>No hay tareas configuradas aún.</p>
            <p>Ve a la sección de configuración para agregar tareas.</p>
          </div>
        ) : (
          <ul>
            {tasks.map((task) => {
              const isCompleted = localProgress[task.id] === 'checked';
              
              return (
                <li 
                  key={task.id} 
                  className={`task-item ${isCompleted ? 'completed' : ''}`}
                  onClick={() => handleTaskToggle(task.id)}
                >
                  <div className="task-checkbox">
                    {isCompleted ? '✓' : '○'}
                  </div>
                  <div className="task-content">
                    <strong>{task.title}</strong>
                    {task.description && <p>{task.description}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      <div className="day-actions">
        <button onClick={onBack} className="secondary">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DayDetail;