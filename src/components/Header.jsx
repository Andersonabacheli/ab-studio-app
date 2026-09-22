import { useEffect, useState } from 'react';
import '../styles/header.css';

const NAV_LINKS = [
  { href: '#projetos', label: 'Projetos' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#processo', label: 'Processo' },
  { href: '#contato', label: 'Contato' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
      <div className="wrap site-header__inner">
        <a href="#top" className="site-header__logo">
          AB <span>STUDIO</span>
        </a>

        <nav className="site-header__nav" aria-label="Navegação principal">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__cta">
          <a href="#contato" className="btn btn-primary">
            Solicitar orçamento ↗
          </a>
        </div>

        <button
          type="button"
          className="site-header__toggle"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" className="site-header__mobile-nav" aria-label="Navegação mobile">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contato" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                Solicitar orçamento ↗
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
