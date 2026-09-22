import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/orcamento-detalhado.css';

export default function OrcamentoDetalhado({ orcamento, onFechar }) {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Campos do novo item
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [salvando, setSalvando] = useState(false);

  const fetchItens = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orcamento_itens')
      .select('*')
      .eq('orcamento_id', orcamento.id)
      .order('created_at', { ascending: true });

    if (error) {
      setErro(error.message);
    } else {
      setItens(data);
      setErro(null);
    }
    setLoading(false);
  }, [orcamento.id]);

  useEffect(() => {
    fetchItens();
  }, [fetchItens]);

  async function adicionarItem(e) {
    e.preventDefault();
    setErro(null);

    const qtd = parseFloat(quantidade);
    const preco = parseFloat(precoUnitario);

    if (descricao.trim().length < 2) {
      setErro('Descrição muito curta (mín. 2 caracteres).');
      return;
    }
    if (!qtd || qtd <= 0) {
      setErro('Quantidade inválida.');
      return;
    }
    if (isNaN(preco) || preco < 0) {
      setErro('Preço unitário inválido.');
      return;
    }

    setSalvando(true);

    const { error } = await supabase.from('orcamento_itens').insert([
      {
        orcamento_id: orcamento.id,
        descricao: descricao.trim(),
        quantidade: qtd,
        preco_unitario: preco,
      },
    ]);

    setSalvando(false);

    if (error) {
      setErro('Erro ao adicionar item: ' + error.message);
      return;
    }

    setDescricao('');
    setQuantidade('1');
    setPrecoUnitario('');
    fetchItens();
  }

  async function removerItem(id) {
    const confirmar = window.confirm('Remover este item?');
    if (!confirmar) return;

    const { error } = await supabase.from('orcamento_itens').delete().eq('id', id);

    if (error) {
      window.alert('Erro ao remover: ' + error.message);
      return;
    }

    fetchItens();
  }

  const total = itens.reduce((acc, item) => acc + item.quantidade * item.preco_unitario, 0);

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Orçamento detalhado — {orcamento.name}</h2>
          <button className="modal-close" onClick={onFechar}>✕</button>
        </div>

        <div className="modal-body">
          {erro && <div className="login-error">{erro}</div>}

          {loading ? (
            <p>Carregando itens...</p>
          ) : (
            <>
              <table className="itens-table">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Qtd</th>
                    <th>Preço unit.</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {itens.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#999', padding: '1rem' }}>
                        Nenhum item adicionado ainda.
                      </td>
                    </tr>
                  ) : (
                    itens.map((item) => (
                      <tr key={item.id}>
                        <td>{item.descricao}</td>
                        <td>{item.quantidade}</td>
                        <td>{formatarMoeda(item.preco_unitario)}</td>
                        <td>{formatarMoeda(item.quantidade * item.preco_unitario)}</td>
                        <td>
                          <button className="action-btn btn-delete" onClick={() => removerItem(item.id)}>
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>Total</td>
                    <td style={{ fontWeight: 700, color: '#e8a33d' }}>{formatarMoeda(total)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>

              <form className="add-item-form" onSubmit={adicionarItem}>
                <input
                  placeholder="Descrição do item (ex: Desenvolvimento da Home)"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="item-descricao"
                />
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Qtd"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="item-qtd"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Preço unit. (R$)"
                  value={precoUnitario}
                  onChange={(e) => setPrecoUnitario(e.target.value)}
                  className="item-preco"
                />
                <button type="submit" className="action-btn btn-save" disabled={salvando}>
                  {salvando ? 'Adicionando...' : '+ Adicionar'}
                </button>
              </form>

              <div className="modal-actions">
                <button className="action-btn btn-cancel" disabled>
                  Gerar PDF (em breve)
                </button>
                <button className="action-btn btn-cancel" disabled>
                  Enviar por email (em breve)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}