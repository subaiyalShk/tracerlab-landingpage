import Nav from "../components/Nav";
import Hero from "../components/Hero";
import ProofWall from "../components/ProofWall";
import Services from "../components/Services";
import Projects from "../components/Projects";
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
        <ProofWall />
        <Services />
        <Projects />
        <Cta />
        <StickyCtaBar
          heroId="tl-hero"
          ctaId="tl-cta"
          message="Let's build your AI"
          buttonLabel="Start your project"
          buttonHref="#contact"
        />
        <Footer />
      </main>
    </>
  );
}
