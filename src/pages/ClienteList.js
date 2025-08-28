import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import clienteService from '../services/clienteService';
import { ToastContext } from '../components/Toast';
import '../styles/ClienteList.css';

const ClienteList = () => {
  const { addToast } = useContext(ToastContext);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadClientes = async (searchTerm = '', page = 1) => {
    try {
      setLoading(true);
      const response = await clienteService.getClientes(searchTerm, true, 10);
      
      if (response.data.success) {
        setClientes(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Error al cargar clientes');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadClientes(search, 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este cliente?')) {
      return;
    }

    try {
      await clienteService.deleteCliente(id);
      loadClientes(search, currentPage);
      addToast('Cliente eliminado correctamente', 'success');
    } catch (err) {
      addToast('Error al eliminar cliente', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando clientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <button onClick={() => loadClientes()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Gestión de Clientes</h1>
        <p className="page-subtitle">Administra y consulta la información de tus clientes</p>
      </div>
      
      <div className="page-content">
        <div className="cliente-list-actions">
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Buscar clientes por nombre o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-secondary">
                Buscar
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    loadClientes();
                  }}
                  className="btn btn-outline"
                >
                  Limpiar
                </button>
              )}
            </form>
          </div>
          
          <Link to="/crear" className="btn btn-primary">
            📝 Nuevo Cliente
          </Link>
        </div>

      {clientes.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron clientes.</p>
          <Link to="/crear" className="btn btn-primary">
            Crear primer cliente
          </Link>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefono || '-'}</td>
                    <td className="actions">
                      <Link
                        to={`/editar/${cliente.id}`}
                        className="btn btn-small btn-secondary"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(cliente.id)}
                        className="btn btn-small btn-danger"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="pagination">
              <span>
                Página {pagination.current_page} de {pagination.last_page}
              </span>
              <span>
                Total: {pagination.total} clientes
              </span>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default ClienteList;
