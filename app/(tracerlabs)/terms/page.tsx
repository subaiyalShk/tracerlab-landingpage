import type { Metadata } from "next";
import LegalPage from "../_components/LegalPage";

// Terms for the public site and the free audit call. Client engagements are
// governed by their own signed agreement, not by this page.
export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms covering use of tracerlabs.io and the free Growth Audit call.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="22 September 2026">
      <p>
        These terms cover your use of tracerlabs.io and the free consultation we offer through it. Paid work is
        governed by the separate agreement we sign with you, which takes precedence over anything here.
      </p>

      <h2>The free audit call</h2>
      <p>
        The Growth Audit is a free, no-obligation conversation. Booking one does not create a client relationship, and
        neither of us owes the other anything afterwards. We may reschedule or decline a booking — for example if the
        request is clearly not a fit — and you can cancel at any time by replying to the calendar invite.
      </p>

      <h2>What you tell us</h2>
      <p>
        Please give accurate contact details, and only share information you are entitled to share. Anything you tell
        us about your business on the call we treat as confidential and use only to advise you.
      </p>

      <h2>Results and examples</h2>
      <p>
        Figures shown on this site come from campaigns and systems we have run for specific clients, over specific
        periods. They describe what happened in those accounts. They are not a promise, projection or guarantee of what
        will happen in yours — results depend on your market, offer, budget and execution.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not use this site to break the law, to submit someone else&rsquo;s details without their permission, to send
        automated or bulk submissions, or to attempt to disrupt or gain unauthorised access to it.
      </p>

      <h2>Our content</h2>
      <p>
        The text, design, code and media on this site belong to Tracerlabs LLC. You may read and share it; you may not
        republish it as your own.
      </p>

      <h2>No warranty, and the limit of our liability</h2>
      <p>
        The site and the free call are provided as they are, without warranties of any kind. Nothing said on a free
        consultation is professional, legal, financial or tax advice. To the fullest extent the law allows, Tracerlabs
        LLC is not liable for indirect or consequential losses arising from your use of the site or reliance on a free
        consultation.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of Texas, United States.</p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:jarvis@tracerlabs.io" className="underline">jarvis@tracerlabs.io</a>
      </p>
    </LegalPage>
  );
}
