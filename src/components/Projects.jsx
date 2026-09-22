import { useReveal } from '../hooks/useReveal';
import '../styles/projects.css';

const PROJECTS = [
  {
    id: 'landing-page',
    title: 'Landing Page',
    tag: 'LANDING PAGE — SITE INSTITUCIONAL / CONVERSÃO',
    description: 'Página de alta conversão para apresentação de produto ou serviço.',
  },
  {
    id: 'helpdesk',
    title: 'Sistema HelpDesk',
    tag: 'SISTEMA HELPDESK — PLATAFORMA DE SUPORTE',
    description: 'Plataforma para gerenciamento de clientes, chamados e suporte.',
  },
  {
    id: 'aplicativo',
    title: 'Aplicativo',
    tag: 'APLICATIVO — MOBILE / GESTÃO DE PROCESSOS',
    description: 'Aplicativo personalizado para organizar processos e facilitar operações.',
  },
];

function ProjectCard({ project }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="project-card reveal">
      <div className="project-card__top">
        <h3>{project.title}</h3>
        <span className="project-card__arrow">Ver projeto →</span>
      </div>
      <div className="project-card__media">{project.tag}</div>
      <p className="project-card__description">{project.description}</p>
    </article>
  );
}

export default function Projects() {
  const headRef = useReveal();

  return (
    <section id="projetos">
      <div className="wrap">
        <div ref={headRef} className="section-head reveal">
          <h2>Projetos selecionados</h2>
          <p>Alguns projetos que representam o que podemos construir juntos.</p>
        </div>

        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
