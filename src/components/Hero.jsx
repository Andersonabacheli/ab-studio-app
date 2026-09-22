import '../styles/hero.css';

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="wrap hero__inner">
        <div>
          <p className="hero__eyebrow">Sites · Apps · Soluções Digitais</p>
          <h1 className="hero__title">Transformamos ideias em experiências digitais.</h1>
          <p className="hero__lead">
            Criamos sites, aplicativos e soluções digitais sob medida para empresas,
            profissionais e novos negócios.
          </p>
          <div className="hero__actions">
            <a href="#contato" className="btn btn-primary">
              Começar um projeto ↗
            </a>
            <a href="#projetos" className="btn btn-ghost">
              Ver projetos ↓
            </a>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__mock hero__mock--site">
            <div className="hero__mock-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="hero__mock-body">
              <div className="hero__mock-line" style={{ width: '60%' }} />
              <div className="hero__mock-line" style={{ width: '85%' }} />
              <div className="hero__mock-line" style={{ width: '40%' }} />
            </div>
            <span className="hero__mock-label">PROJETO AB STUDIO — WEBSITE</span>
          </div>

          <div className="hero__mock hero__mock--app">
            <div className="hero__mock-bar">
              <span />
              <span />
            </div>
            <div className="hero__mock-body">
              <div className="hero__mock-line" style={{ width: '70%' }} />
              <div className="hero__mock-line" style={{ width: '50%' }} />
            </div>
            <span className="hero__mock-label">MOBILE APP</span>
          </div>
        </div>
      </div>
    </section>
  );
}
