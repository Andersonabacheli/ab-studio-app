import { useReveal } from '../hooks/useReveal';
import '../styles/statement.css';

export default function Statement() {
  const ref = useReveal();

  return (
    <section className="statement">
      <div ref={ref} className="wrap statement__inner reveal">
        <h2>
          Não criamos apenas páginas.
          <br />
          Criamos experiências que ajudam negócios a <span className="statement__accent">crescer</span>.
        </h2>
      </div>
    </section>
  );
}
