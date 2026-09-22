import Header from '../components/Header';
import Hero from '../components/Hero';
import Statement from '../components/Statement';
import Projects from '../components/Projects';
import Services from '../components/Services';
import Differentiators from '../components/Differentiators';
import Process from '../components/Process';
import About from '../components/About';
import CTA from '../components/CTA';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Statement />
        <Projects />
        <Services />
        <Differentiators />
        <Process />
        <About />
        <CTA />
        <Contact />
        <ChatBot />
      </main>
      <Footer />
    </>
  );
}
