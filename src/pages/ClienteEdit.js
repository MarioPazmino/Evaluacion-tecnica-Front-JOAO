import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import clienteService from '../services/clienteService';
import { ToastContext } from '../components/Toast';
import '../styles/ClienteForm.css';

const ClienteEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useContext(ToastContext);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [emailChecking, setEmailChecking] = useState(false);

  // Cargar datos del cliente
  useEffect(() => {
    const loadCliente = async () => {
      try {
        // Simularemos cargar los datos del cliente
        // En una implementación real, tendrías un endpoint para obtener un cliente por ID
        const response = await clienteService.getClientes();
        const cliente = response.data.data.find(c => c.id === parseInt(id));
        
        if (cliente) {
          setFormData({
            nombre: cliente.nombre,
            email: cliente.email,
            telefono: cliente.telefono || ''
          });
        } else {
          addToast('Cliente no encontrado', 'error');
          navigate('/');
        }
      } catch (err) {
        addToast('Error al cargar cliente', 'error');
        navigate('/');
      } finally {
        setLoadingData(false);
      }
    };

    loadCliente();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Validación de email en vivo (excluyendo el ID actual)
    if (name === 'email' && value) {
      checkEmailExists(value);
    }
  };

  const checkEmailExists = async (email) => {
    if (!email || !email.includes('@')) return;
    
    try {
      setEmailChecking(true);
      const response = await clienteService.checkEmail(email, id);
      if (response.data.exists) {
        setErrors(prev => ({
          ...prev,
          email: 'Este email ya está registrado'
        }));
      }
    } catch (err) {
      // Error al verificar email, pero no bloqueamos el formulario
    } finally {
      setEmailChecking(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Permitir letras (con acentos), espacios, guiones y apóstrofes
    const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\-]+$/;
    // Teléfono: dígitos y los caracteres comunes + - ( ) y espacios
    const phonePattern = /^[0-9\s()+\-]+$/;

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length > 255) {
      newErrors.nombre = 'El nombre no puede exceder 255 caracteres';
    } else if (!namePattern.test(formData.nombre)) {
      newErrors.nombre = 'El nombre sólo puede contener letras, espacios, guiones y apóstrofes';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (formData.telefono) {
      if (formData.telefono.length > 20) {
        newErrors.telefono = 'El teléfono no puede exceder 20 caracteres';
      } else if (!phonePattern.test(formData.telefono)) {
        newErrors.telefono = 'El teléfono sólo puede contener dígitos y los caracteres + - ( ) y espacios';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await clienteService.updateCliente(id, formData);
      addToast('Cliente actualizado correctamente', 'success');
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        addToast('Error al actualizar cliente: ' + (err.response?.data?.message || err.message), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container">
        <div className="loading">Cargando datos del cliente...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Editar Cliente</h1>
        <p className="page-subtitle">Modifica la información del cliente seleccionado</p>
      </div>

      <div className="page-content">
        <div className="form-actions">
          <Link to="/" className="btn btn-outline">
            ← Volver al listado
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="cliente-form">
        <div className="form-group">
          <label htmlFor="nombre">
            Nombre *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'error' : ''}
            maxLength={255}
            required
            aria-invalid={errors.nombre ? 'true' : 'false'}
          />
          <small className="field-hint">Sólo letras, espacios, guiones y apóstrofes</small>
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email *
            {emailChecking && <span className="checking"> (verificando...)</span>}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            maxLength={255}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="telefono">
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className={errors.telefono ? 'error' : ''}
            maxLength={20}
            inputMode="tel"
            aria-invalid={errors.telefono ? 'true' : 'false'}
            placeholder="Ej: +51 987654321"
          />
          <small className="field-hint">Dígitos y caracteres + - ( ) y espacios</small>
          {errors.telefono && <span className="error-message">{errors.telefono}</span>}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading || emailChecking}
            className="btn btn-primary"
          >
            {loading ? 'Guardando...' : 'Actualizar Cliente'}
          </button>
          <Link to="/" className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
      </div>
    </div>
  );
};

export default ClienteEdit;
