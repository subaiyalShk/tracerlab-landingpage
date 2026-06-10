import Nav from "../components/Nav";
import Hero from "../components/Hero";
import TechBar from "../components/TechBar";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Cta from "../components/Cta";
import Footer from "../components/Footer";

// The whole page is now React — no more injected legacy markup. <Nav> is the sticky top bar,
// then <Hero>, then the content sections. <main id="content"> keeps the id the legacy
// ScreenAnimation/canvas code references (it self-manages from there).
export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <main id="content">
        <TechBar />
        <Services />
        <Projects />
        <Cta />
        <Footer />
      </main>
    </>
  );
}
