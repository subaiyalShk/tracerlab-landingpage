import Nav from "../components/Nav";
import Hero from "../components/Hero";
import TechBar from "../components/TechBar";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Team from "../components/Team";
import Cta from "../components/Cta";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import StickyCtaBar from "../components/StickyCtaBar";

// Telemetry redesign: the nav sits at the top (the old rests-at-bottom-of-hero
// behavior is retired). <main id="content"> keeps its id for legacy references.
export default function Home() {
  return (
    <>
      <JsonLd />
      <Nav />
      <Hero />
      <main id="content">
        <TechBar />
        <Services />
        <Projects />
        <Team />
        <Cta />
        <StickyCtaBar
          heroId="tl-hero"
          ctaId="tl-cta"
          message="Let's find what's holding your business back"
          buttonLabel="Book a discovery call"
          buttonHref="#contact"
        />
        <Footer />
      </main>
    </>
  );
}
