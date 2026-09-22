import { useEffect, useRef } from 'react';

/**
 * Observa um elemento e adiciona a classe "in" quando ele entra na viewport.
 * Usado para a animação sutil de entrada das seções (ver frontend-design skill:
 * "um único momento orquestrado" é preferível a efeitos espalhados).
 *
 * Respeita prefers-reduced-motion automaticamente via CSS (ver global.css),
 * então aqui não precisamos duplicar essa lógica em JS.
 *
 * @returns {import('react').RefObject<HTMLElement>} ref para anexar ao elemento observado
 */
export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // IntersectionObserver pode não existir em ambientes muito antigos;
    // nesse caso, mostramos o conteúdo direto em vez de escondê-lo para sempre.
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('in');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}
