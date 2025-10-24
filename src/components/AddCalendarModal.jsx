import React, { useState, useContext } from 'react';
import { SupabaseContext } from '../contexts/SupabaseContext';
import './AddCalendarModal.css';

const AddCalendarModal = ({ onClose, onCalendarAdded }) => {
  const { supabase } = useContext(SupabaseContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('El nombre del calendario es requerido');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Verificar que la conexión a Supabase esté disponible
      if (!supabase) {
        throw new Error('No se pudo establecer conexión con Supabase');
      }
      
      console.log('Intentando crear calendario:', { 
        name: name.trim(), 
        description: description.trim() 
      });
      
      const { data, error: insertError } = await supabase
        .from('dashboard_calendars')
        .insert([
          {
            name: name.trim(),
            description: description.trim()
          }
        ])
        .select()
        .single();
      
      if (insertError) {
        console.error('Error de Supabase:', insertError);
        throw new Error(`Error de Supabase: ${insertError.message || insertError.details || insertError.hint || 'Error desconocido'}`);
      }
      
      if (!data) {
        throw new Error('No se recibió datos del calendario creado');
      }
      
      console.log('Calendario creado exitosamente:', data);
      onCalendarAdded(data);
    } catch (err) {
      console.error('Error al agregar calendario:', err);
      setError(`Error al crear el calendario: ${err.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Agregar Nuevo Calendario</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre del Calendario *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Rutina Diaria, Proyecto X"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción opcional del calendario"
              rows="3"
              disabled={loading}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Calendario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCalendarModal;