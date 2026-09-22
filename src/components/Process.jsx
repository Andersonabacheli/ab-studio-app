import { useReveal } from '../hooks/useReveal';
import '../styles/process.css';

const STEPS = [
  {
    num: '01',
    title: 'Você conta a ideia.',
    description: 'Pode ser algo simples ou algo maior — o ponto de partida é sempre a sua necessidade.',
    quote: '"Preciso de um site para minha empresa." / "Preciso de um sistema para controlar meus clientes."',
  },
  {
    num: '02',
    title: 'Entendemos o problema.',
    description: 'Conversamos sobre objetivo, público, funcionalidades, prazo e orçamento.',
  },
  {
    num: '03',
    title: 'Criamos a solução.',
    description: 'Design, programação, testes e ajustes — tudo conduzido de perto com você.',
  },
  {
    num: '04',
    title: 'Você recebe o projeto.',
    description: 'Publicamos e entregamos tudo funcionando.',
  },
];

export default function Process() {
  const headRef = useReveal();
  const listRef = useReveal();

  return (
    <section id="processo">
      <div className="wrap">
        <div ref={headRef} className="section-head reveal">
          <h2>Da ideia ao produto.</h2>
        </div>

        <ol ref={listRef} className="timeline reveal">
          {STEPS.map((step) => (
            <li className="timeline__item" key={step.num}>
              <span className="timeline__num" aria-hidden="true">
                {step.num}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {step.quote && <span className="timeline__quote">{step.quote}</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
