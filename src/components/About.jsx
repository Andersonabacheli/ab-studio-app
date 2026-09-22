import { useReveal } from '../hooks/useReveal';
import '../styles/about.css';

export default function About() {
  const ref = useReveal();

  return (
    <section id="sobre">
      <div ref={ref} className="wrap about reveal">
        <div>
          <h2>Tecnologia com propósito.</h2>
        </div>
        <div>
          <p>
            A AB Studio nasceu com uma ideia simples: transformar problemas e ideias em soluções
            digitais úteis, bonitas e fáceis de usar.
          </p>
          <p>
            Desenvolvemos projetos personalizados para pessoas e empresas que querem melhorar sua
            presença digital, automatizar processos ou transformar uma ideia em produto.
          </p>
          <div className="about__tag">
            <span>Web</span>
            <span aria-hidden="true">·</span>
            <span>Mobile</span>
            <span aria-hidden="true">·</span>
            <span>Software</span>
          </div>
        </div>
      </div>
    </section>
  );
}
