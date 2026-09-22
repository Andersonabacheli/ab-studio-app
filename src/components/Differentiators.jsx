import { useReveal } from '../hooks/useReveal';
import '../styles/differentiators.css';

const PILLARS = [
  {
    title: 'Personalizado',
    description: 'Não entregamos uma solução genérica. Cada projeto começa entendendo o problema.',
  },
  {
    title: 'Simples',
    description:
      'Tecnologia precisa facilitar, não complicar. Criamos experiências intuitivas e fáceis de usar.',
  },
  {
    title: 'Preparado para crescer',
    description:
      'O projeto evolui junto com seu negócio. Começamos com o necessário e adicionamos funcionalidades quando fizer sentido.',
  },
];

export default function Differentiators() {
  const headRef = useReveal();
  const gridRef = useReveal();

  return (
    <section>
      <div className="wrap">
        <div ref={headRef} className="section-head reveal">
          <h2>Pensado para o seu negócio.</h2>
        </div>

        <div ref={gridRef} className="pillars reveal">
          {PILLARS.map((pillar) => (
            <div className="pillar" key={pillar.title}>
              <div className="pillar__mark" aria-hidden="true" />
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
