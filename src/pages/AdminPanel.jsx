import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/admin.css';

const ITENS_POR_PAGINA = 10;

export default function AdminPanel() {
  const navigate = useNavigate();
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState({});
  const [pagina, setPagina] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);

  // Filtros
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');

  // Adicionar orçamento manual
  const [mostrarFormNovo, setMostrarFormNovo] = useState(false);
  const [novoOrcamento, setNovoOrcamento] = useState({
    name: '',
    phone: '',
    email: '',
    project_type: 'Website',
    message: '',
    status: 'em_contato',
  });
  const [salvandoNovo, setSalvandoNovo] = useState(false);
  const [erroNovo, setErroNovo] = useState(null);

  async function fetchOrcamentos() {
    setLoading(true);
    const inicio = pagina * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA - 1;

    let query = supabase
      .from('orcamentos')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (filtroStatus !== 'todos') {
      query = query.eq('status', filtroStatus);
    }

    if (filtroDataInicio) {
      query = query.gte('created_at', `${filtroDataInicio}T00:00:00`);
    }

    if (filtroDataFim) {
      query = query.lte('created_at', `${filtroDataFim}T23:59:59`);
    }

    query = query.range(inicio, fim);

    const { data, error, count } = await query;

    if (error) {
      setErro(error.message);
    } else {
      setOrcamentos(data);
      setTotalRegistros(count || 0);
      setErro(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchOrcamentos();

    const channel = supabase
      .channel('orcamentos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orcamentos' },
        () => {
          fetchOrcamentos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pagina, filtroStatus, filtroDataInicio, filtroDataFim]);

  function handleFiltroStatusChange(valor) {
    setFiltroStatus(valor);
    setPagina(0);
  }

  function handleFiltroDataInicioChange(valor) {
    setFiltroDataInicio(valor);
    setPagina(0);
  }

  function handleFiltroDataFimChange(valor) {
    setFiltroDataFim(valor);
    setPagina(0);
  }

  function limparFiltros() {
    setFiltroStatus('todos');
    setFiltroDataInicio('');
    setFiltroDataFim('');
    setPagina(0);
  }

  function iniciarEdicao(item) {
    setEditandoId(item.id);
    setFormEdicao(item);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormEdicao({});
  }

  function handleChange(campo, valor) {
    setFormEdicao((prev) => ({ ...prev, [campo]: valor }));
  }

  async function salvarEdicao(id) {
    const { error } = await supabase
      .from('orcamentos')
      .update({
        name: formEdicao.name,
        email: formEdicao.email,
        phone: formEdicao.phone,
        project_type: formEdicao.project_type,
        message: formEdicao.message,
        status: formEdicao.status,
      })
      .eq('id', id);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
      return;
    }

    setEditandoId(null);
  }

  async function apagarOrcamento(id) {
    const confirmar = window.confirm('Tem certeza que quer apagar este orçamento?');
    if (!confirmar) return;

    const { error } = await supabase.from('orcamentos').delete().eq('id', id);

    if (error) {
      alert('Erro ao apagar: ' + error.message);
      return;
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  function irParaPaginaAnterior() {
    setPagina((p) => Math.max(0, p - 1));
  }

  function irParaProximaPagina() {
    if ((pagina + 1) * ITENS_POR_PAGINA < totalRegistros) {
      setPagina((p) => p + 1);
    }
  }

  function handleNovoChange(campo, valor) {
    setNovoOrcamento((prev) => ({ ...prev, [campo]: valor }));
  }

  function limparFormNovo() {
    setNovoOrcamento({
      name: '',
      phone: '',
      email: '',
      project_type: 'Website',
      message: '',
      status: 'em_contato',
    });
    setErroNovo(null);
  }

  async function salvarNovoOrcamento(e) {
    e.preventDefault();
    setErroNovo(null);

    const { name, phone, email, project_type, message } = novoOrcamento;

    if (name.trim().length < 2) return setErroNovo('Nome muito curto (mín. 2 caracteres).');
    if (email.trim().length < 5) return setErroNovo('Email muito curto.');
    if (phone.trim().length < 8) return setErroNovo('Telefone muito curto.');
    if (project_type.trim().length < 2) return setErroNovo('Tipo de projeto inválido.');
    if (message.trim().length < 10) return setErroNovo('Observação muito curta (mín. 10 caracteres).');

    setSalvandoNovo(true);

    const { error } = await supabase.from('orcamentos').insert([novoOrcamento]);

    setSalvandoNovo(false);

    if (error) {
      setErroNovo('Erro ao salvar: ' + error.message);
      return;
    }

    limparFormNovo();
    setMostrarFormNovo(false);
  }

  if (erro) return <div className="admin-container" style={{ color: '#ff8080' }}>Erro: {erro}</div>;

  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / ITENS_POR_PAGINA));

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Painel <span className="accent">Administrativo</span></h1>
        <button className="action-btn btn-delete" onClick={handleLogout}>Sair</button>
      </div>

      <div className="admin-filters">
        <div className="filter-field">
          <label>Status</label>
          <select value={filtroStatus} onChange={(e) => handleFiltroStatusChange(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="novo">novo</option>
            <option value="em_contato">em_contato</option>
            <option value="fechado">fechado</option>
            <option value="descartado">descartado</option>
          </select>
        </div>

        <div className="filter-field">
          <label>De</label>
          <input
            type="date"
            value={filtroDataInicio}
            onChange={(e) => handleFiltroDataInicioChange(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label>Até</label>
          <input
            type="date"
            value={filtroDataFim}
            onChange={(e) => handleFiltroDataFimChange(e.target.value)}
          />
        </div>

        <button className="action-btn btn-cancel" onClick={limparFiltros}>
          Limpar filtros
        </button>
      </div>

      <div className="admin-add-section">
        <button
          className="action-btn btn-save"
          onClick={() => setMostrarFormNovo((v) => !v)}
        >
          {mostrarFormNovo ? '✕ Cancelar' : '+ Adicionar orçamento manual'}
        </button>

        {mostrarFormNovo && (
          <form className="admin-add-form" onSubmit={salvarNovoOrcamento}>
            {erroNovo && <div className="login-error">{erroNovo}</div>}

            <div className="add-form-grid">
              <div className="filter-field">
                <label>Nome</label>
                <input
                  value={novoOrcamento.name}
                  onChange={(e) => handleNovoChange('name', e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="filter-field">
                <label>Telefone</label>
                <input
                  value={novoOrcamento.phone}
                  onChange={(e) => handleNovoChange('phone', e.target.value)}
                  placeholder="(11) 91234-5678"
                />
              </div>

              <div className="filter-field">
                <label>Email</label>
                <input
                  value={novoOrcamento.email}
                  onChange={(e) => handleNovoChange('email', e.target.value)}
                  placeholder="cliente@email.com"
                />
              </div>

              <div className="filter-field">
                <label>Tipo de projeto</label>
                <select
                  value={novoOrcamento.project_type}
                  onChange={(e) => handleNovoChange('project_type', e.target.value)}
                >
                  <option value="Website">Website</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="Aplicativo">Aplicativo</option>
                  <option value="Sistema">Sistema</option>
                  <option value="Dashboard">Dashboard</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="filter-field">
                <label>Status</label>
                <select
                  value={novoOrcamento.status}
                  onChange={(e) => handleNovoChange('status', e.target.value)}
                >
                  <option value="novo">novo</option>
                  <option value="em_contato">em_contato</option>
                  <option value="fechado">fechado</option>
                  <option value="descartado">descartado</option>
                </select>
              </div>
            </div>

            <div className="filter-field" style={{ width: '100%' }}>
              <label>Observações / mensagem</label>
              <textarea
                value={novoOrcamento.message}
                onChange={(e) => handleNovoChange('message', e.target.value)}
                placeholder="Ex: Cliente ligou pedindo orçamento para um site institucional..."
                rows={3}
                style={{
                  background: '#0d0d0d', border: '1px solid #333', borderRadius: '8px',
                  padding: '0.6rem', color: '#fff', fontSize: '0.85rem', resize: 'vertical',
                  width: '100%',
                }}
              />
            </div>

            <button type="submit" className="action-btn btn-save" disabled={salvandoNovo}>
              {salvandoNovo ? 'Salvando...' : 'Salvar contato'}
            </button>
          </form>
        )}
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{totalRegistros}</div>
          <div className="stat-label">Resultados encontrados</div>
        </div>
      </div>

      {loading ? (
        <div className="admin-table-wrapper" style={{ padding: '2rem' }}>Carregando...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Tipo de projeto</th>
                <th>Mensagem</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orcamentos.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                    Nenhum orçamento encontrado com esses filtros.
                  </td>
                </tr>
              ) : (
                orcamentos.map((item) => {
                  const emEdicao = editandoId === item.id;

                  return (
                    <tr key={item.id}>
                      {emEdicao ? (
                        <>
                          <td><input value={formEdicao.name || ''} onChange={(e) => handleChange('name', e.target.value)} /></td>
                          <td>
                            <input value={formEdicao.email || ''} onChange={(e) => handleChange('email', e.target.value)} style={{ marginBottom: '0.3rem' }} />
                            <input value={formEdicao.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
                          </td>
                          <td><input value={formEdicao.project_type || ''} onChange={(e) => handleChange('project_type', e.target.value)} /></td>
                          <td><input value={formEdicao.message || ''} onChange={(e) => handleChange('message', e.target.value)} /></td>
                          <td>
                            <select value={formEdicao.status || ''} onChange={(e) => handleChange('status', e.target.value)}>
                              <option value="novo">novo</option>
                              <option value="em_contato">em_contato</option>
                              <option value="fechado">fechado</option>
                              <option value="descartado">descartado</option>
                            </select>
                          </td>
                          <td>{new Date(item.created_at).toLocaleDateString('pt-BR')}</td>
                          <td>
                            <button className="action-btn btn-save" onClick={() => salvarEdicao(item.id)}>Salvar</button>
                            <button className="action-btn btn-cancel" onClick={cancelarEdicao}>Cancelar</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{item.name}</td>
                          <td>{item.email}<br /><span style={{ color: '#999' }}>{item.phone}</span></td>
                          <td>{item.project_type}</td>
                          <td>{item.message}</td>
                          <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
                          <td>{new Date(item.created_at).toLocaleDateString('pt-BR')}</td>
                          <td>
                            <button className="action-btn btn-edit" onClick={() => iniciarEdicao(item)}>Editar</button>
                            <button className="action-btn btn-delete" onClick={() => apagarOrcamento(item.id)}>Apagar</button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button className="action-btn btn-cancel" onClick={irParaPaginaAnterior} disabled={pagina === 0}>
              ← Anterior
            </button>
            <span className="pagination-info">
              Página {pagina + 1} de {totalPaginas}
            </span>
            <button
              className="action-btn btn-cancel"
              onClick={irParaProximaPagina}
              disabled={(pagina + 1) * ITENS_POR_PAGINA >= totalRegistros}
            >
              Próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}