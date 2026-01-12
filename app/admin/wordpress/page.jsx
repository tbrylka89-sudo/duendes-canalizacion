'use client';

import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// PANEL DE CONTROL WORDPRESS
// Gestiona snippets WPCode, caché y estado del sitio
// ═══════════════════════════════════════════════════════════════

export default function WordPressControlPage() {
  const [status, setStatus] = useState(null);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [search, setSearch] = useState('');

  // Cargar estado y snippets
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [statusRes, snippetsRes] = await Promise.all([
        fetch('/api/admin/wordpress?action=status'),
        fetch('/api/admin/wordpress?action=snippets')
      ]);

      const statusData = await statusRes.json();
      const snippetsData = await snippetsRes.json();

      if (statusData.success) setStatus(statusData);
      if (snippetsData.success) setSnippets(snippetsData.snippets || []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error cargando datos: ' + error.message });
    }
    setLoading(false);
  }

  // Activar/Desactivar snippet
  async function toggleSnippet(id, activate) {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: activate ? 'activate' : 'deactivate', id })
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message || `Snippet ${activate ? 'activado' : 'desactivado'}` });
        // Actualizar lista local
        setSnippets(prev => prev.map(s =>
          s.id === id ? { ...s, active: activate } : s
        ));
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al cambiar estado' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    setActionLoading(null);
  }

  // Limpiar caché
  async function clearCache() {
    setActionLoading('cache');
    try {
      const res = await fetch('/api/admin/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_cache' })
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Caché limpiado: ' + (data.cleared || []).join(', ') });
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    setActionLoading(null);
  }

  // Desactivar todos
  async function deactivateAll() {
    if (!confirm('¿Desactivar TODOS los snippets?')) return;

    setActionLoading('all');
    const activeSnippets = snippets.filter(s => s.active);

    try {
      const res = await fetch('/api/admin/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deactivate_multiple',
          ids: activeSnippets.map(s => s.id)
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        loadData(); // Recargar
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    setActionLoading(null);
  }

  // Filtrar snippets
  const filteredSnippets = snippets
    .filter(s => {
      if (filter === 'active') return s.active;
      if (filter === 'inactive') return !s.active;
      return true;
    })
    .filter(s =>
      search === '' || s.title.toLowerCase().includes(search.toLowerCase())
    );

  // Contar activos/inactivos
  const activeCount = snippets.filter(s => s.active).length;
  const inactiveCount = snippets.length - activeCount;

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Conectando con WordPress...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Control WordPress</h1>
          <p style={styles.subtitle}>Gestión remota de snippets WPCode</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={loadData} style={styles.btnRefresh}>
            Actualizar
          </button>
          <button onClick={clearCache} disabled={actionLoading === 'cache'} style={styles.btnCache}>
            {actionLoading === 'cache' ? 'Limpiando...' : 'Limpiar Caché'}
          </button>
        </div>
      </div>

      {/* Mensaje */}
      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: message.type === 'success' ? '#1B4D3E' : '#4a1c1c',
          borderColor: message.type === 'success' ? '#2d7a5a' : '#8b3a3a'
        }}>
          {message.text}
          <button onClick={() => setMessage(null)} style={styles.closeMessage}>×</button>
        </div>
      )}

      {/* Estado del sitio */}
      {status && (
        <div style={styles.statusCard}>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Estado</span>
            <span style={{ ...styles.statusValue, color: '#4ade80' }}>Online</span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>WordPress</span>
            <span style={styles.statusValue}>{status.wordpress?.version}</span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>WooCommerce</span>
            <span style={styles.statusValue}>{status.woocommerce?.version}</span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>WPCode</span>
            <span style={styles.statusValue}>{status.wpcode?.version}</span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>PHP</span>
            <span style={styles.statusValue}>{status.php?.version}</span>
          </div>
        </div>
      )}

      {/* Controles de filtro */}
      <div style={styles.controls}>
        <div style={styles.filters}>
          <button
            onClick={() => setFilter('all')}
            style={{ ...styles.filterBtn, ...(filter === 'all' ? styles.filterBtnActive : {}) }}
          >
            Todos ({snippets.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            style={{ ...styles.filterBtn, ...(filter === 'active' ? styles.filterBtnActive : {}) }}
          >
            Activos ({activeCount})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            style={{ ...styles.filterBtn, ...(filter === 'inactive' ? styles.filterBtnActive : {}) }}
          >
            Inactivos ({inactiveCount})
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar snippet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        {activeCount > 0 && (
          <button
            onClick={deactivateAll}
            disabled={actionLoading === 'all'}
            style={styles.btnDanger}
          >
            {actionLoading === 'all' ? 'Desactivando...' : 'Desactivar Todos'}
          </button>
        )}
      </div>

      {/* Lista de snippets */}
      <div style={styles.snippetsList}>
        {filteredSnippets.map(snippet => (
          <div
            key={snippet.id}
            style={{
              ...styles.snippetCard,
              borderLeftColor: snippet.active ? '#4ade80' : '#6b7280'
            }}
          >
            <div style={styles.snippetInfo}>
              <h3 style={styles.snippetTitle}>{snippet.title}</h3>
              <div style={styles.snippetMeta}>
                <span style={styles.snippetId}>ID: {snippet.id}</span>
                <span style={styles.snippetType}>{snippet.type}</span>
                <span style={styles.snippetStatus}>
                  {snippet.status === 'publish' ? 'Publicado' : 'Borrador'}
                </span>
                <span style={styles.snippetDate}>
                  {new Date(snippet.modified).toLocaleDateString('es-UY')}
                </span>
              </div>
            </div>

            <div style={styles.snippetActions}>
              <span style={{
                ...styles.activeIndicator,
                backgroundColor: snippet.active ? '#166534' : '#374151',
                color: snippet.active ? '#4ade80' : '#9ca3af'
              }}>
                {snippet.active ? 'ACTIVO' : 'INACTIVO'}
              </span>

              <button
                onClick={() => toggleSnippet(snippet.id, !snippet.active)}
                disabled={actionLoading === snippet.id}
                style={{
                  ...styles.toggleBtn,
                  backgroundColor: snippet.active ? '#7f1d1d' : '#166534',
                }}
              >
                {actionLoading === snippet.id
                  ? '...'
                  : snippet.active ? 'Desactivar' : 'Activar'
                }
              </button>
            </div>
          </div>
        ))}

        {filteredSnippets.length === 0 && (
          <div style={styles.emptyState}>
            <p>No se encontraron snippets</p>
          </div>
        )}
      </div>

      {/* Footer con link a WordPress */}
      <div style={styles.footer}>
        <a
          href="https://duendesuy.10web.cloud/wp-admin/admin.php?page=wpcode"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.wpLink}
        >
          Abrir WPCode en WordPress
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#e8e4dc',
    padding: '2rem',
    fontFamily: "'Cormorant Garamond', Georgia, serif"
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    gap: '1rem'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #333',
    borderTopColor: '#C6A962',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #333'
  },
  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: '2rem',
    color: '#C6A962',
    margin: 0
  },
  subtitle: {
    color: '#888',
    margin: '0.5rem 0 0',
    fontSize: '0.9rem'
  },
  headerActions: {
    display: 'flex',
    gap: '1rem'
  },
  btnRefresh: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#e8e4dc',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  btnCache: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1B4D3E',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  message: {
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    border: '1px solid',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeMessage: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0 0.5rem'
  },
  statusCard: {
    display: 'flex',
    gap: '2rem',
    padding: '1.5rem',
    backgroundColor: '#111',
    borderRadius: '12px',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  statusLabel: {
    fontSize: '0.75rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  statusValue: {
    fontSize: '1.1rem',
    color: '#C6A962',
    fontWeight: '500'
  },
  controls: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  filters: {
    display: 'flex',
    gap: '0.5rem'
  },
  filterBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#888',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s'
  },
  filterBtnActive: {
    backgroundColor: '#C6A962',
    borderColor: '#C6A962',
    color: '#000'
  },
  searchInput: {
    padding: '0.5rem 1rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#e8e4dc',
    fontSize: '0.9rem',
    minWidth: '200px'
  },
  btnDanger: {
    padding: '0.5rem 1rem',
    backgroundColor: '#7f1d1d',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    marginLeft: 'auto'
  },
  snippetsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  snippetCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    backgroundColor: '#111',
    borderRadius: '8px',
    borderLeft: '4px solid',
    gap: '1rem'
  },
  snippetInfo: {
    flex: 1,
    minWidth: 0
  },
  snippetTitle: {
    margin: 0,
    fontSize: '1rem',
    color: '#e8e4dc',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '500px'
  },
  snippetMeta: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    color: '#666'
  },
  snippetId: {
    color: '#888'
  },
  snippetType: {
    color: '#C6A962'
  },
  snippetStatus: {
    color: '#666'
  },
  snippetDate: {
    color: '#555'
  },
  snippetActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  activeIndicator: {
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '600',
    letterSpacing: '0.05em'
  },
  toggleBtn: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    minWidth: '90px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666'
  },
  footer: {
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #222',
    textAlign: 'center'
  },
  wpLink: {
    color: '#C6A962',
    textDecoration: 'none',
    fontSize: '0.9rem'
  }
};
