import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Mechanism from "./components/Mechanism";
import Proof from "./components/Proof";
import Deliverables from "./components/Deliverables";
import Guarantee from "./components/Guarantee";
import Faq from "./components/Faq";
import BookCta from "./components/BookCta";
import Footer from "./components/Footer";

// Solar marketing funnel — standalone conversion page (/solar).
// Single goal: book a strategy call. Content config + placeholders live in ./config.ts.
export default function SolarFunnel() {
  return (
    <main>
      <Hero />
      <Problem />
      <Mechanism />
      <Proof />
      <Deliverables />
      <Guarantee />
      <Faq />
      <BookCta />
      <Footer />
    </main>
  );
}
