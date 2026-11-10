# AB Studio — Home

Site institucional da AB Studio, construído com **React + Vite**, preparado
para se conectar ao **Supabase** nas próximas etapas do projeto.

## Estrutura

```
src/
├── components/     Componentes de UI (Header, Hero, Projects, Contact, etc.)
├── pages/          Home.jsx compõe todas as seções da página
├── hooks/          useReveal.js — animação de entrada ao rolar
├── utils/          validation.js — validação e sanitização do formulário
├── styles/         um arquivo CSS por componente + global.css/variables.css
└── App.jsx / main.jsx
```

## Como rodar localmente

```bash
npm install
cp .env.example .env   # depois preencha com suas chaves do Supabase
npm run dev
```

Antes de publicar, rode `npm run lint` e `npm run build`.

Na Vercel, configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em
*Project Settings > Environment Variables* — sem elas o site não inicia.

## Notas de segurança importantes

1. **Nunca commite o arquivo `.env`** — ele já está no `.gitignore`. Apenas
   `.env.example` (sem valores reais) deve ir para o Git.
2. **`VITE_SUPABASE_ANON_KEY` é pública por design** — pode aparecer no
   bundle do frontend, desde que o **Row Level Security (RLS)** esteja
   ativo em todas as tabelas do Supabase (como fizemos com `orcamentos`).
   Nunca coloque a `service_role key` no frontend.
3. **Validação em duas camadas**: o formulário de contato valida no
   navegador (`utils/validation.js`) só para dar feedback rápido — a
   validação que realmente protege os dados é a do banco (`check` constraints
   e RLS no Supabase). Nunca confie apenas na validação do cliente.
4. **Honeypot** no formulário de contato: o campo oculto `company` ajuda a
   filtrar bots simples sem precisar de captcha visível.
5. **Links externos** (`target="_blank"`) sempre usam
   `rel="noopener noreferrer"` para evitar o ataque de "reverse tabnabbing".
6. **Nenhum uso de `dangerouslySetInnerHTML`** em todo o projeto — o React já
   escapa texto dinâmico por padrão, então nenhum dado do usuário é inserido
   como HTML bruto.
7. Antes de publicar (Etapa 8), configure headers de segurança no servidor/CDN:
   `Content-Security-Policy`, `X-Content-Type-Options: nosniff`,
   `Referrer-Policy: strict-origin-when-cross-origin`.

## Próximas etapas do projeto

3. Conectar React ↔ Supabase (`@supabase/supabase-js`, já incluído no
   `package.json`)
4. Criar o envio real do formulário de orçamento
5. Painel administrativo
6. Autenticação
7. Projetos dinâmicos (vindos do banco, não mais hardcoded em `Projects.jsx`)
8. Publicar o site
