// Server component: emits Organization (ProfessionalService) + WebSite + Service JSON-LD
// for the home page. Pure static data, no interactivity. The `<` escape blocks XSS in the
// JSON string. (sameAs social URLs intentionally omitted — add real profile URLs when known.)
const GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://tracerlabs.io/#org",
      name: "Tracerlabs",
      url: "https://tracerlabs.io",
      logo: "https://tracerlabs.io/assets/logo-light.png",
      image: "https://tracerlabs.io/assets/Tracer.png",
      description:
        "AI development studio building voice agents, web & mobile apps, and AI-driven growth systems for businesses.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "jarvis@tracerlabs.io",
        url: "https://tracerlabs.io/#contact",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://tracerlabs.io/#website",
      url: "https://tracerlabs.io",
      name: "Tracerlabs",
      publisher: { "@id": "https://tracerlabs.io/#org" },
    },
    {
      "@type": "Service",
      serviceType: "AI software development",
      provider: { "@id": "https://tracerlabs.io/#org" },
      areaServed: "US",
      description:
        "Voice agents, custom web & mobile applications, and AI sales automation.",
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(GRAPH).replace(/</g, "\\u003c"),
      }}
    />
  );
}
