import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import clienteService from '../services/clienteService';
import { ToastContext } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/ClienteList.css';

const ClienteList = () => {
  const { addToast } = useContext(ToastContext);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const searchInputRef = useRef(null);

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
    // Prevent submitting an empty search
    if (!search || !search.trim()) {
      addToast('Introduce un término de búsqueda', 'error');
      if (searchInputRef.current) searchInputRef.current.focus();
      return;
    }

    setCurrentPage(1);
    loadClientes(search, 1);
  };

  const handleDelete = (id, nombre) => {
    setSelectedCliente({ id, nombre });
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCliente) return;
    try {
      setDeleting(true);
      await clienteService.deleteCliente(selectedCliente.id);
      setConfirmOpen(false);
      setSelectedCliente(null);
      addToast('Cliente eliminado correctamente', 'success');
      await loadClientes(search, currentPage);
    } catch (err) {
      addToast('Error al eliminar cliente', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setSelectedCliente(null);
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
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-secondary" disabled={!search || !search.trim()}>
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
                        onClick={() => handleDelete(cliente.id, cliente.nombre)}
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
      <ConfirmModal
        open={confirmOpen}
        title="Confirmar eliminación"
        message={selectedCliente ? `¿Está seguro de eliminar al cliente "${selectedCliente.nombre}"? Esta acción no se puede deshacer.` : '¿Está seguro de eliminar este cliente?'}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
};

export default ClienteList;
