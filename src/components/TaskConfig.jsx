import React, { useState, useContext } from 'react';
import { SupabaseContext } from '../contexts/SupabaseContext';
import './TaskConfig.css';

const TaskConfig = ({ tasks, onSave }) => {
  const { supabase } = useContext(SupabaseContext);
  const [taskList, setTaskList] = useState(tasks.map((task, index) => ({
    ...task,
    tempId: index // Usamos un ID temporal para nuevos items
  })));
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '',
    recurrenceType: 'once',
    recurrenceDays: [],
    startDate: '',
    endDate: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      setTaskList([
        ...taskList,
        {
          id: null, // Será asignado por la base de datos
          tempId: Date.now(), // ID temporal
          title: newTask.title.trim(),
          description: newTask.description.trim(),
          position: taskList.length,
          recurrence_type: newTask.recurrenceType,
          recurrence_days: newTask.recurrenceType === 'custom' ? newTask.recurrenceDays.join(',') : null,
          start_date: newTask.startDate || null,
          end_date: newTask.endDate || null,
          is_active: true
        }
      ]);
      setNewTask({ 
        title: '', 
        description: '',
        recurrenceType: 'once',
        recurrenceDays: [],
        startDate: '',
        endDate: ''
      });
    }
  };

  const handleRemoveTask = (tempId) => {
    setTaskList(taskList.filter(task => task.tempId !== tempId));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    
    try {
      // Primero, eliminar todas las tareas existentes
      if (tasks.length > 0) {
        const taskIds = tasks.map(t => t.id).filter(id => id !== null);
        if (taskIds.length > 0) {
          await supabase
            .from('dashboard_items')
            .delete()
            .in('id', taskIds);
        }
      }
      
      // Luego, insertar las nuevas tareas
      const tasksToInsert = taskList.map((task, index) => ({
        calendar_id: 1, // ID fijo para nuestro calendario
        title: task.title,
        description: task.description,
        position: index,
        recurrence_type: task.recurrence_type,
        recurrence_days: task.recurrence_days,
        start_date: task.start_date,
        end_date: task.end_date,
        is_active: task.is_active
      }));
      
      if (tasksToInsert.length > 0) {
        const { error } = await supabase
          .from('dashboard_items')
          .insert(tasksToInsert);
          
        if (error) throw error;
      }
      
      setSaveMessage('Tareas guardadas correctamente');
      setTimeout(() => {
        setSaveMessage('');
        onSave();
      }, 2000);
    } catch (error) {
      console.error('Error saving tasks:', error);
      setSaveMessage('Error al guardar las tareas: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="task-config">
      <h2>Configuración de Tareas</h2>
      
      <div className="card">
        <h3>Agregar Nueva Tarea</h3>
        <div className="form-group">
          <label htmlFor="taskTitle">Título *</label>
          <input
            type="text"
            id="taskTitle"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Nombre de la tarea"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="taskDescription">Descripción</label>
          <textarea
            id="taskDescription"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Descripción opcional"
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="recurrenceType">Tipo de Tarea</label>
          <select
            id="recurrenceType"
            value={newTask.recurrenceType}
            onChange={(e) => setNewTask({ ...newTask, recurrenceType: e.target.value })}
          >
            <option value="once">Una vez</option>
            <option value="daily">Diaria</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
            <option value="yearly">Anual</option>
            <option value="custom">Personalizada</option>
          </select>
        </div>
        
        {newTask.recurrenceType === 'custom' && (
          <div className="form-group">
            <label>Días de la semana</label>
            <div className="checkbox-group">
              {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map((day, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newTask.recurrenceDays.includes(index.toString())}
                    onChange={(e) => {
                      const days = [...newTask.recurrenceDays];
                      if (e.target.checked) {
                        days.push(index.toString());
                      } else {
                        const idx = days.indexOf(index.toString());
                        if (idx > -1) days.splice(idx, 1);
                      }
                      setNewTask({ ...newTask, recurrenceDays: days });
                    }}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
        )}
        
        {(newTask.recurrenceType === 'daily' || 
          newTask.recurrenceType === 'weekly' || 
          newTask.recurrenceType === 'monthly' || 
          newTask.recurrenceType === 'yearly' || 
          newTask.recurrenceType === 'custom') && (
          <>
            <div className="form-group">
              <label htmlFor="startDate">Fecha de Inicio</label>
              <input
                type="date"
                id="startDate"
                value={newTask.startDate}
                onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">Fecha de Fin (Opcional)</label>
              <input
                type="date"
                id="endDate"
                value={newTask.endDate}
                onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
              />
            </div>
          </>
        )}
        
        <button onClick={handleAddTask} className="add-button">
          + Agregar Tarea
        </button>
      </div>
      
      <div className="card">
        <h3>Tareas Configuradas</h3>
        {taskList.length === 0 ? (
          <p className="no-tasks">No hay tareas configuradas aún.</p>
        ) : (
          <ul>
            {taskList.map((task) => (
              <li key={task.tempId} className="task-item">
                <div className="task-info">
                  <strong>{task.title}</strong>
                  {task.description && <p>{task.description}</p>}
                  <div className="task-recurrence">
                    <span className="recurrence-badge">
                      {task.recurrence_type === 'once' ? 'Una vez' : 
                       task.recurrence_type === 'daily' ? 'Diaria' : 
                       task.recurrence_type === 'weekly' ? 'Semanal' : 
                       task.recurrence_type === 'monthly' ? 'Mensual' : 
                       task.recurrence_type === 'yearly' ? 'Anual' : 
                       'Personalizada'}
                    </span>
                    {task.recurrence_type !== 'once' && task.start_date && (
                      <span className="date-range">
                        {new Date(task.start_date).toLocaleDateString('es-ES')} 
                        {task.end_date && ` - ${new Date(task.end_date).toLocaleDateString('es-ES')}`}
                      </span>
                    )}
                    {task.recurrence_type === 'custom' && task.recurrence_days && (
                      <div className="custom-days">
                        Días: {task.recurrence_days.split(',').map(day => 
                          ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][parseInt(day)]
                        ).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveTask(task.tempId)}
                  className="remove-button"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {saveMessage && (
        <div className={`save-message ${saveMessage.includes('Error') ? 'error' : 'success'}`}>
          {saveMessage}
        </div>
      )}
      
      <div className="config-actions">
        <button onClick={onSave} className="secondary" disabled={saving}>
          Cancelar
        </button>
        <button onClick={handleSave} className="save-button" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
};

export default TaskConfig;