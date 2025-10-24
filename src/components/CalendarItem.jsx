import React, { useState } from 'react';
import './CalendarItem.css';

const CalendarItem = ({ item, onProgressUpdate }) => {
  const [progressValue, setProgressValue] = useState(item.progress || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onProgressUpdate(item.id, progressValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProgressValue(item.progress || '');
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const toggleChecked = () => {
    const newValue = progressValue === 'checked' ? '' : 'checked';
    setProgressValue(newValue);
    onProgressUpdate(item.id, newValue);
  };

  return (
    <div className="calendar-item">
      <div className="item-header">
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </div>
      <div className="item-progress">
        {isEditing ? (
          <div className="progress-edit">
            <input
              type="text"
              value={progressValue}
              onChange={(e) => setProgressValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ingrese valor"
            />
            <div className="progress-actions">
              <button onClick={handleSave} className="save-btn">Guardar</button>
              <button onClick={handleCancel} className="cancel-btn">Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="progress-display">
            {item.progress === 'checked' ? (
              <span className="checked-status">✓ Completado</span>
            ) : item.progress ? (
              <span className="value-status">{item.progress}</span>
            ) : (
              <span className="empty-status">Sin completar</span>
            )}
            <div className="progress-actions">
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Editar
              </button>
              <button onClick={toggleChecked} className="check-btn">
                {item.progress === 'checked' ? 'Desmarcar' : 'Marcar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarItem;