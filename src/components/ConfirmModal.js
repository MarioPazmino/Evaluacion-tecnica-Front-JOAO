import React from 'react';
import '../styles/ConfirmModal.css';

const ConfirmModal = ({ open, title, message, onCancel, onConfirm, loading }) => {
  if (!open) return null;

  return (
    <div className="confirm-modal-backdrop" role="dialog" aria-modal="true">
      <div className="confirm-modal">
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button className="btn btn-outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
