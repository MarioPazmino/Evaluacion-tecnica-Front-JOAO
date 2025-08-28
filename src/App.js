import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import ClienteList from './pages/ClienteList';
import ClienteCreate from './pages/ClienteCreate';
import ClienteEdit from './pages/ClienteEdit';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="app">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<ClienteList />} />
                <Route path="/crear" element={<ClienteCreate />} />
                <Route path="/editar/:id" element={<ClienteEdit />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
