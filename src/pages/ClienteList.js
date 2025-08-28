import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clienteService from '../services/clienteService';
import { ToastContext } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';
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
  const [deletingId, setDeletingId] = useState(null);
  const searchInputRef = useRef(null);
  const [perPage, setPerPage] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [searchParams, setSearchParams] = useSearchParams();

  // perPageOverride allows immediate requests with a newly selected per-page value
  const loadClientes = async (searchTerm = '', page = 1, perPageOverride = null) => {
    try {
      setLoading(true);
      const pageSize = perPageOverride || perPage;
      const response = await clienteService.getClientes(searchTerm, true, pageSize, page);
      
      if (response.data.success) {
        setClientes(response.data.data);
        const pag = response.data.pagination;
        setPagination(pag);

        // If server returns a different current_page (e.g., requested page > last_page), reconcile state + URL
        if (pag && pag.current_page && pag.current_page !== page) {
          setCurrentPage(pag.current_page);
          updateUrlParams(searchTerm, pag.current_page, pageSize);
        }
      } else {
        setError('Error al cargar clientes');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input to avoid too many requests while typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Trigger search when debounced value changes (but avoid firing for empty search)
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.trim()) {
      setCurrentPage(1);
  loadClientes(debouncedSearch, 1);
  updateUrlParams(debouncedSearch, 1, perPage);
    }
    // Note: do not auto-load when debouncedSearch is empty to preserve explicit 'Limpiar' behavior
  }, [debouncedSearch]);

  // On mount: read query params and load accordingly
  useEffect(() => {
    const q = searchParams.get('search') || '';
    const pageParam = parseInt(searchParams.get('page'), 10) || 1;
    const perPageParam = parseInt(searchParams.get('per_page'), 10) || perPage;

    // populate local state from params
    setSearch(q);
    setPerPage(perPageParam);
    setCurrentPage(pageParam);

    // If there is a search term, load with it; otherwise load page normally
    loadClientes(q, pageParam, perPageParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to keep URL in sync with state
  const updateUrlParams = (searchTerm, page, perPageVal) => {
    const params = {};
    if (searchTerm && searchTerm.trim()) params.search = searchTerm;
    if (page && page > 1) params.page = String(page);
    if (perPageVal && perPageVal !== 10) params.per_page = String(perPageVal);
    setSearchParams(params, { replace: true });
  };

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
    updateUrlParams(search, 1, perPage);
  };

  const goToPage = (page) => {
    if (!pagination) return;
    const p = Math.max(1, Math.min(page, pagination.last_page));
    setCurrentPage(p);
    loadClientes(search, p);
  updateUrlParams(search, p, perPage);
  };

  // Build a list of page numbers with simple truncation for long ranges
  const getPageNumbers = () => {
    if (!pagination) return [];
    const total = pagination.last_page;
    const current = pagination.current_page;
    const delta = 2; // show current +/- delta
    const range = [];

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }

    return range;
  };

  const handlePerPageChange = (e) => {
    const val = parseInt(e.target.value, 10) || 10;
    setPerPage(val);
    setCurrentPage(1);
  // pass val directly to avoid race with setPerPage
  loadClientes(search, 1, val);
  updateUrlParams(search, 1, val);
  };

  const handleDelete = (id, nombre) => {
    setSelectedCliente({ id, nombre });
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCliente) return;
    try {
  setDeletingId(selectedCliente.id);
  await clienteService.deleteCliente(selectedCliente.id);
      setConfirmOpen(false);
      setSelectedCliente(null);
      addToast('Cliente eliminado correctamente', 'success');
      await loadClientes(search, currentPage);
    } catch (err) {
      addToast('Error al eliminar cliente', 'error');
    } finally {
  setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setSelectedCliente(null);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading"><Spinner size="lg" ariaLabel="Cargando clientes" /> Cargando clientes...</div>
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
                        disabled={Boolean(deletingId)}
                      >
                        {deletingId === cliente.id ? <Spinner size="sm" /> : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            {pagination && pagination.last_page > 1 ? (
              <div className="pagination-info">
                <button className="btn btn-outline" onClick={() => goToPage(1)} disabled={pagination.current_page === 1}>Primera</button>
                <button className="btn btn-outline" onClick={() => goToPage(pagination.current_page - 1)} disabled={loading || pagination.current_page === 1}>{loading ? <Spinner size="sm" /> : 'Anterior'}</button>

                <div className="page-numbers">
                  {getPageNumbers().map((p, idx) => (
                    p === '...' ? (
                      <span key={`dots-${idx}`} className="page-dots">…</span>
                    ) : (
                      <button
                        key={p}
                        className={`btn ${p === pagination.current_page ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => goToPage(p)}
                        disabled={loading || p === pagination.current_page}
                      >{loading && p === pagination.current_page ? <Spinner size="sm" /> : p}</button>
                    )
                  ))}
                </div>

                <button className="btn btn-outline" onClick={() => goToPage(pagination.current_page + 1)} disabled={loading || pagination.current_page === pagination.last_page}>{loading ? <Spinner size="sm" /> : 'Siguiente'}</button>
                <button className="btn btn-outline" onClick={() => goToPage(pagination.last_page)} disabled={loading || pagination.current_page === pagination.last_page}>{loading ? <Spinner size="sm" /> : 'Última'}</button>
              </div>
            ) : (
              <div className="pagination-info">
                <span className="page-label">Página 1 de 1</span>
              </div>
            )}

            <div className="pagination-stats">
              <label className="per-page-label">Por página:
                <select value={perPage} onChange={handlePerPageChange} className="per-page-select">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                {loading && <Spinner size="sm" />}
              </label>
              <div className="total-label">Total: {pagination ? pagination.total : clientes.length} clientes</div>
            </div>
          </div>
        </>
      )}
      </div>
      <ConfirmModal
        open={confirmOpen}
        title="Confirmar eliminación"
        message={selectedCliente ? `¿Está seguro de eliminar al cliente "${selectedCliente.nombre}"? Esta acción no se puede deshacer.` : '¿Está seguro de eliminar este cliente?'}
        onCancel={cancelDelete}
  onConfirm={confirmDelete}
  loading={Boolean(deletingId)}
      />
    </div>
  );
};

export default ClienteList;
