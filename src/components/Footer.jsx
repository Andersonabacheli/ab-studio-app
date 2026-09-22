import '../styles/footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__top">
          <div>
            <div className="site-footer__logo">
              AB <span>STUDIO</span>
            </div>
            <p>Sites · Apps · Soluções Digitais</p>
          </div>

          <div>
            <h4>Navegação</h4>
            <ul>
              <li><a href="#projetos">Projetos</a></li>
              <li><a href="#servicos">Serviços</a></li>
              <li><a href="#processo">Processo</a></li>
              <li><a href="#sobre">Sobre</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4>Redes</h4>
            <ul>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://wa.me" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© {CURRENT_YEAR} AB Studio</span>
          <span>Feito com foco em produtos digitais.</span>
        </div>
      </div>
    </footer>
  );
}
