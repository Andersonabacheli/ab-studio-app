import { useReveal } from '../hooks/useReveal';
import '../styles/cta.css';

export default function CTA() {
  const ref = useReveal();

  return (
    <section>
      <div className="wrap">
        <div ref={ref} className="cta-main reveal">
          <h2>
            Tem uma ideia?
            <br />
            Vamos transformar em realidade.
          </h2>
          <p>Conte-nos o que você precisa. A primeira conversa começa sem compromisso.</p>
          <a href="#contato" className="btn btn-primary">
            Começar meu projeto ↗
          </a>
        </div>
      </div>
    </section>
  );
}
