import React from 'react';
import Footer from '../components/Footer';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard Principal</h1>
      <div className="dashboard-content">
        <div className="card">
          <h2>Bienvenido al Dashboard</h2>
          <p>Este es el panel principal de la aplicación de gestión de tareas y calendario.</p>
        </div>
        
        <div className="dashboard-grid">
          <div className="card stat-card">
            <h3>Calendarios</h3>
            <p className="stat-number">1</p>
            <p className="stat-description">Calendario configurado</p>
          </div>
          
          <div className="card stat-card">
            <h3>Tareas</h3>
            <p className="stat-number">0</p>
            <p className="stat-description">Tareas configuradas</p>
          </div>
          
          <div className="card stat-card">
            <h3>Días Completados</h3>
            <p className="stat-number">0</p>
            <p className="stat-description">Días con tareas completadas</p>
          </div>
        </div>
        
        <div className="card">
          <h3>Instrucciones</h3>
          <ul>
            <li>Ve a la sección <strong>Calendario</strong> para ver y gestionar tus tareas</li>
            <li>Usa la pestaña <strong>Configuración</strong> para agregar tareas diarias</li>
            <li>Haz clic en cualquier día del calendario para registrar tu progreso</li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;