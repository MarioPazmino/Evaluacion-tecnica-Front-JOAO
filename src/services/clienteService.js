import axios from 'axios';
import API_CONFIG from '../config/api';

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENTES}`;

// Configurar axios con headers por defecto
axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  ...API_CONFIG.DEFAULT_HEADERS
};

const clienteService = {
  // Obtener todos los clientes
  getClientes: async (search = '', paginate = false, perPage = 10) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (paginate) {
      params.append('paginate', 'true');
      params.append('per_page', perPage);
    }
    
    const url = params.toString() ? `${API_URL}?${params}` : API_URL;
    return await axios.get(url);
  },

  // Crear cliente
  createCliente: async (cliente) => {
    return await axios.post(API_URL, cliente);
  },

  // Actualizar cliente
  updateCliente: async (id, cliente) => {
    return await axios.put(`${API_URL}/${id}`, cliente);
  },

  // Eliminar cliente
  deleteCliente: async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
  },

  // Verificar si email existe
  checkEmail: async (email, excludeId = null) => {
    const baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHECK_EMAIL}/${email}`;
    const url = excludeId 
      ? `${baseUrl}?exclude_id=${excludeId}`
      : baseUrl;
    return await axios.get(url);
  }
};

export default clienteService;
