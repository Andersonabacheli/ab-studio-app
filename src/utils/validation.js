export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}$/;

export const PROJECT_TYPES = [
  'Website',
  'Landing Page',
  'Aplicativo',
  'Sistema',
  'Dashboard',
  'Outro',
];

export const FIELD_LIMITS = {
  name: 100,
  phone: 20,
  email: 150,
  message: 1000,
};

// Mínimos exigidos (espelham a policy de INSERT no Supabase)
export const FIELD_MIN_LIMITS = {
  name: 2,
  phone: 8,
  email: 5,
  message: 10,
};

export function sanitizeInput(value) {
  return value.replace(/[<>]/g, '').trim();
}

export function validateContactForm(values) {
  const errors = {};

  if (values.company) {
    errors.company = 'Falha na validação do formulário.';
  }

  const name = sanitizeInput(values.name || '');
  if (!name) {
    errors.name = 'Informe seu nome.';
  } else if (name.length < FIELD_MIN_LIMITS.name) {
    errors.name = `Nome muito curto (mín. ${FIELD_MIN_LIMITS.name} caracteres).`;
  } else if (name.length > FIELD_LIMITS.name) {
    errors.name = `Nome muito longo (máx. ${FIELD_LIMITS.name} caracteres).`;
  }

  const phone = sanitizeInput(values.phone || '');
  if (!phone) {
    errors.phone = 'Informe um número de WhatsApp.';
  } else if (!PHONE_REGEX.test(phone)) {
    errors.phone = 'Número inválido. Use o formato (11) 91234-5678.';
  } else if (phone.length < FIELD_MIN_LIMITS.phone) {
    errors.phone = `Número muito curto (mín. ${FIELD_MIN_LIMITS.phone} caracteres).`;
  }

  const email = sanitizeInput(values.email || '');
  if (!email) {
    errors.email = 'Informe seu e-mail.';
  } else if (!EMAIL_REGEX.test(email) || email.length > FIELD_LIMITS.email) {
    errors.email = 'E-mail inválido.';
  } else if (email.length < FIELD_MIN_LIMITS.email) {
    errors.email = 'E-mail inválido.';
  }

  if (!PROJECT_TYPES.includes(values.projectType)) {
    errors.projectType = 'Selecione uma opção válida.';
  }

  const message = sanitizeInput(values.message || '');
  if (!message) {
    errors.message = 'Conte um pouco sobre o seu projeto.';
  } else if (message.length < FIELD_MIN_LIMITS.message) {
    errors.message = `Mensagem muito curta (mín. ${FIELD_MIN_LIMITS.message} caracteres).`;
  } else if (message.length > FIELD_LIMITS.message) {
    errors.message = `Mensagem muito longa (máx. ${FIELD_LIMITS.message} caracteres).`;
  }

  return errors;
}