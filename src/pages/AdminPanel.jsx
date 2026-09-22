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
  const [pagina, setPagina] = useState(0); // 0 = primeira página
  const [totalRegistros, setTotalRegistros] = useState(0);

  async function fetchOrcamentos() {
    const inicio = pagina * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA - 1;

    const { data, error, count } = await supabase
      .from('orcamentos')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(inicio, fim);

    if (error) {
      setErro(error.message);
    } else {
      setOrcamentos(data);
      setTotalRegistros(count || 0);
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
  }, [pagina]); // refaz a busca sempre que a página mudar

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

  if (loading) return <div className="admin-container">Carregando orçamentos...</div>;
  if (erro) return <div className="admin-container" style={{ color: '#ff8080' }}>Erro: {erro}</div>;

  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / ITENS_POR_PAGINA));
  const novos = orcamentos.filter((o) => o.status === 'novo').length;
  const emContato = orcamentos.filter((o) => o.status === 'em_contato').length;
  const fechados = orcamentos.filter((o) => o.status === 'fechado').length;
  const descartados = orcamentos.filter((o) => o.status === 'descartado').length;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Painel <span className="accent">Administrativo</span></h1>
        <button className="action-btn btn-delete" onClick={handleLogout}>Sair</button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{totalRegistros}</div>
          <div className="stat-label">Total de pedidos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{novos}</div>
          <div className="stat-label">Novos (nesta página)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{emContato}</div>
          <div className="stat-label">Em contato (nesta página)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{fechados}</div>
          <div className="stat-label">Fechados (nesta página)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{descartados}</div>
          <div className="stat-label">Descartados (nesta página)</div>
        </div>
      </div>

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
            {orcamentos.map((item) => {
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
            })}
          </tbody>
        </table>

        <div className="pagination">
          <button
            className="action-btn btn-cancel"
            onClick={irParaPaginaAnterior}
            disabled={pagina === 0}
          >
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
    </div>
  );
}