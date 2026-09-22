import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { validateContactForm, sanitizeInput, PROJECT_TYPES, FIELD_LIMITS } from '../utils/validation';
import { supabase } from '../lib/supabaseClient'; // Importação do Supabase
import '../styles/contact.css';

const INITIAL_VALUES = {
  name: '',
  phone: '',
  email: '',
  projectType: PROJECT_TYPES[0],
  message: '',
  company: '', // honeypot — deve ficar sempre vazio
};

export default function Contact() {
  const ref = useReveal();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Evita duplo envio (double-submit) caso o usuário clique mais de uma vez.
    if (status === 'submitting') return;

    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus('submitting');

    try {
      const payload = {
        name: sanitizeInput(values.name),
        phone: sanitizeInput(values.phone),
        email: sanitizeInput(values.email),
        project_type: values.projectType, // Convertido para o nome da coluna no banco
        message: sanitizeInput(values.message),
      };

      // ===== LOG TEMPORÁRIO PARA DEBUG =====
      console.log('PAYLOAD ENVIADO:', payload);
      console.log('TAMANHOS:', {
        name: payload.name.length,
        phone: payload.phone.length,
        email: payload.email.length,
        project_type: payload.project_type.length,
        message: payload.message.length,
      });
      // ======================================

      // Dispara o INSERT para a tabela orcamentos no Supabase
      const { error } = await supabase
        .from('orcamentos')
        .insert([payload]);

      if (error) {
        throw new Error(error.message);
      }

      setStatus('success');
      setValues(INITIAL_VALUES);
    } catch (error) {
      // Não expor detalhes técnicos do erro ao usuário final.
      console.error('Erro ao enviar formulário para o Supabase:', error);
      setStatus('error');
    }
  }

  return (
    <section id="contato">
      <div className="wrap">
        <div className="section-head section-head--center">
          <h2>Vamos conversar.</h2>
        </div>

        <form ref={ref} className="contact-box reveal" onSubmit={handleSubmit} noValidate>
          {/* Honeypot: campo escondido de humanos via CSS, mas visível para bots simples. */}
          <div className="contact-box__honeypot" aria-hidden="true">
            <label htmlFor="company">Não preencha este campo</label>
            <input
              type="text"
              id="company"
              name="company"
              autoComplete="off"
              tabIndex={-1}
              value={values.company}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              maxLength={FIELD_LIMITS.name}
              placeholder="Seu nome completo"
              value={values.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <span id="name-error" className="field__error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="phone">WhatsApp</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              maxLength={FIELD_LIMITS.phone}
              placeholder="(00) 00000-0000"
              value={values.phone}
              onChange={handleChange}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <span id="phone-error" className="field__error" role="alert">
                {errors.phone}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              maxLength={FIELD_LIMITS.email}
              placeholder="seu@email.com"
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span id="email-error" className="field__error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="projectType">O que você precisa?</label>
            <select
              id="projectType"
              name="projectType"
              value={values.projectType}
              onChange={handleChange}
            >
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="message">Conte um pouco sobre seu projeto</label>
            <textarea
              id="message"
              name="message"
              maxLength={FIELD_LIMITS.message}
              placeholder="Descreva sua ideia..."
              value={values.message}
              onChange={handleChange}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <span id="message-error" className="field__error" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary contact-box__submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Enviando...' : 'Enviar projeto ↗'}
          </button>

          <div aria-live="polite" className="contact-box__status">
            {status === 'success' && 'Mensagem enviada! Vamos te responder em breve.'}
            {status === 'error' && 'Não foi possível enviar agora. Tente novamente em instantes.'}
          </div>
        </form>
      </div>
    </section>
  );
}