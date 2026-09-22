import { useReveal } from '../hooks/useReveal';
import '../styles/services.css';

const SERVICES = [
  {
    num: '01',
    title: 'Websites',
    description:
      'Sites modernos, rápidos e responsivos para apresentar sua empresa, marca ou serviço.',
    items: ['Landing Pages', 'Sites institucionais', 'Páginas de vendas'],
  },
  {
    num: '02',
    title: 'Aplicativos',
    description: 'Aplicativos desenvolvidos de acordo com as necessidades do seu negócio.',
    items: ['Apps mobile', 'Aplicações web', 'Sistemas internos'],
  },
  {
    num: '03',
    title: 'Sistemas',
    description:
      'Transformamos processos manuais em sistemas mais organizados e eficientes.',
    items: ['Painéis administrativos', 'HelpDesk', 'Gestão de clientes', 'Controle de processos'],
  },
  {
    num: '04',
    title: 'Soluções digitais',
    description: 'Integrações e ferramentas personalizadas para resolver problemas específicos.',
    items: ['APIs', 'Integrações', 'Automação', 'Dashboards'],
  },
];

export default function Services() {
  const headRef = useReveal();
  const gridRef = useReveal();

  return (
    <section id="servicos">
      <div className="wrap">
        <div ref={headRef} className="section-head reveal">
          <h2>O que podemos criar?</h2>
          <p>Quatro frentes de trabalho, sempre pensadas sob medida.</p>
        </div>

        <div ref={gridRef} className="services-grid reveal">
          {SERVICES.map((service) => (
            <div className="service" key={service.num}>
              <span className="service__num">{service.num}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
