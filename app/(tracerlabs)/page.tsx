import Nav from "../components/Nav";
import Hero from "../components/Hero";
import TechBar from "../components/TechBar";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Cta from "../components/Cta";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import StickyCtaBar from "../components/StickyCtaBar";

// The whole page is now React — no more injected legacy markup. <Nav> sits AFTER the hero so
// it rests at the bottom of the first screen, then (position: sticky; top: 0) rises to stick
// at the top as you scroll — the original nav design. <main id="content"> keeps the id the
// legacy ScreenAnimation/canvas code references (it self-manages from there).
export default function Home() {
  return (
    <>
      <JsonLd />
      <Hero />
      <Nav />
      <main id="content">
        <TechBar />
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
