import Hero from "../components/Hero";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Cta from "../components/Cta";
import { MARKUP_TOP, MARKUP_BOTTOM } from "../_landing/markup";

// Hero, Services, Projects, and the CTA (in-browser voice agent) are React components.
// Only the nav/tech-bar (top) and footer (bottom) remain as injected legacy markup. The
// <main id="content"> wrapper lives here so the React sections sit between those chunks.
// The legacy contact section + "dealflow" modal were replaced by <Cta />.
export default function Home() {
  return (
    <>
      <Hero />
      <main id="content">
        <div
          style={{ display: "contents" }}
          dangerouslySetInnerHTML={{ __html: MARKUP_TOP }}
        />
        <Services />
        <Projects />
        <Cta />
        <div
          style={{ display: "contents" }}
          dangerouslySetInnerHTML={{ __html: MARKUP_BOTTOM }}
        />
      </main>
    </>
  );
}
