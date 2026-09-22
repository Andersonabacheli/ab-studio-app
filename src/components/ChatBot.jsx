import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/chatbot.css';

const TIPOS = ['Website', 'Landing Page', 'Aplicativo', 'Sistema', 'Dashboard', 'Outro'];

export default function ChatBot() {
  const [aberto, setAberto] = useState(false);
  const [etapa, setEtapa] = useState('inicio'); // inicio | tipo | nome | telefone | email | confirmar | enviando | sucesso | erro
  const [dados, setDados] = useState({ tipo: '', nome: '', telefone: '', email: '' });
  const [inputAtual, setInputAtual] = useState('');
  const [erroMsg, setErroMsg] = useState('');

  function reiniciar() {
    setEtapa('inicio');
    setDados({ tipo: '', nome: '', telefone: '', email: '' });
    setInputAtual('');
    setErroMsg('');
  }

  function toggleChat() {
    setAberto((v) => !v);
    if (!aberto) reiniciar();
  }

  function escolherTipo(tipo) {
    setDados((prev) => ({ ...prev, tipo }));
    setEtapa('nome');
    setInputAtual('');
  }

  function avancarNome() {
    if (inputAtual.trim().length < 2) {
      setErroMsg('Por favor, digite um nome com pelo menos 2 letras.');
      return;
    }
    setDados((prev) => ({ ...prev, nome: inputAtual.trim() }));
    setEtapa('telefone');
    setInputAtual('');
    setErroMsg('');
  }

  function avancarTelefone() {
    if (inputAtual.trim().length < 8) {
      setErroMsg('Digite um telefone válido, com DDD.');
      return;
    }
    setDados((prev) => ({ ...prev, telefone: inputAtual.trim() }));
    setEtapa('email');
    setInputAtual('');
    setErroMsg('');
  }

  function avancarEmail() {
    const email = inputAtual.trim();
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      setErroMsg('Digite um e-mail válido.');
      return;
    }
    setDados((prev) => ({ ...prev, email }));
    setEtapa('confirmar');
    setInputAtual('');
    setErroMsg('');
  }

  async function enviarOrcamento() {
    setEtapa('enviando');

    const payload = {
      name: dados.nome,
      phone: dados.telefone,
      email: dados.email,
      project_type: dados.tipo,
      message: `Contato via chatbot do site. Interesse em: ${dados.tipo}.`,
    };

    const { error } = await supabase.from('orcamentos').insert([payload]);

    if (error) {
      setErroMsg('Não foi possível enviar agora. Tente novamente em instantes.');
      setEtapa('erro');
      return;
    }

    setEtapa('sucesso');
  }

  return (
    <div className="chatbot-wrapper">
      {aberto && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <span>AB Studio — Atendimento</span>
            <button className="chatbot-close" onClick={toggleChat}>✕</button>
          </div>

          <div className="chatbot-body">
            {etapa === 'inicio' && (
              <>
                <div className="chatbot-message-bot">
                  Olá! 👋 Sou o assistente virtual da AB Studio. Que tipo de projeto você precisa?
                </div>
                <div className="chatbot-options">
                  {TIPOS.map((tipo) => (
                    <button key={tipo} className="chatbot-option-btn" onClick={() => escolherTipo(tipo)}>
                      {tipo}
                    </button>
                  ))}
                </div>
              </>
            )}

            {etapa === 'nome' && (
              <>
                <div className="chatbot-message-bot">
                  Ótimo! Você escolheu <strong>{dados.tipo}</strong>. Qual é o seu nome?
                </div>
                {erroMsg && <div className="chatbot-erro">{erroMsg}</div>}
                <div className="chatbot-input-row">
                  <input
                    autoFocus
                    value={inputAtual}
                    onChange={(e) => setInputAtual(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && avancarNome()}
                    placeholder="Seu nome"
                  />
                  <button onClick={avancarNome}>➤</button>
                </div>
              </>
            )}

            {etapa === 'telefone' && (
              <>
                <div className="chatbot-message-bot">
                  Prazer, {dados.nome}! Qual seu telefone/WhatsApp com DDD?
                </div>
                {erroMsg && <div className="chatbot-erro">{erroMsg}</div>}
                <div className="chatbot-input-row">
                  <input
                    autoFocus
                    value={inputAtual}
                    onChange={(e) => setInputAtual(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && avancarTelefone()}
                    placeholder="(11) 91234-5678"
                  />
                  <button onClick={avancarTelefone}>➤</button>
                </div>
              </>
            )}

            {etapa === 'email' && (
              <>
                <div className="chatbot-message-bot">
                  Perfeito! E qual é o seu melhor e-mail?
                </div>
                {erroMsg && <div className="chatbot-erro">{erroMsg}</div>}
                <div className="chatbot-input-row">
                  <input
                    autoFocus
                    type="email"
                    value={inputAtual}
                    onChange={(e) => setInputAtual(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && avancarEmail()}
                    placeholder="seu@email.com"
                  />
                  <button onClick={avancarEmail}>➤</button>
                </div>
              </>
            )}

            {etapa === 'confirmar' && (
              <>
                <div className="chatbot-message-bot">
                  Confere se está tudo certo:
                  <ul className="chatbot-resumo">
                    <li><strong>Projeto:</strong> {dados.tipo}</li>
                    <li><strong>Nome:</strong> {dados.nome}</li>
                    <li><strong>Telefone:</strong> {dados.telefone}</li>
                    <li><strong>Email:</strong> {dados.email}</li>
                  </ul>
                </div>
                <div className="chatbot-options">
                  <button className="chatbot-option-btn chatbot-option-btn--primary" onClick={enviarOrcamento}>
                    Confirmar e enviar
                  </button>
                  <button className="chatbot-option-btn" onClick={reiniciar}>
                    Recomeçar
                  </button>
                </div>
              </>
            )}

            {etapa === 'enviando' && (
              <div className="chatbot-message-bot">Enviando suas informações...</div>
            )}

            {etapa === 'sucesso' && (
              <>
                <div className="chatbot-message-bot">
                  🎉 Prontinho, {dados.nome}! Recebemos seu pedido e em breve entraremos em contato pelo WhatsApp ou e-mail.
                </div>
                <div className="chatbot-options">
                  <button className="chatbot-option-btn" onClick={reiniciar}>
                    Fazer novo contato
                  </button>
                </div>
              </>
            )}

            {etapa === 'erro' && (
              <>
                <div className="chatbot-erro">{erroMsg}</div>
                <div className="chatbot-options">
                  <button className="chatbot-option-btn" onClick={enviarOrcamento}>
                    Tentar novamente
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <button className="chatbot-fab" onClick={toggleChat} aria-label="Abrir atendimento">
        {aberto ? '✕' : '💬'}
      </button>
    </div>
  );
}