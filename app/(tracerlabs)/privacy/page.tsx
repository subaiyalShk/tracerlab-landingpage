import type { Metadata } from "next";
import LegalPage from "../_components/LegalPage";

// Describes what the site actually does: the /growth-audit form, the voice
// agent, the booking step, and the processors behind them. Keep it in step with
// the code — if a form starts collecting a new field, say so here.
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Tracerlabs collects, why, who processes it, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="22 September 2026">
      <p>
        This policy covers tracerlabs.io and the forms, booking pages and voice agent on it. Tracerlabs LLC
        (&ldquo;we&rdquo;) is the controller of the information described below. Questions, or a request to delete your
        data: <a href="mailto:jarvis@tracerlabs.io" className="underline">jarvis@tracerlabs.io</a>.
      </p>

      <h2>What we collect</h2>
      <p>
        <strong>When you submit a form.</strong> Your name, email address, phone number, and the business details you
        select — business type and monthly ad spend. We also record the advertising parameters present in the page URL
        (such as <code>utm_source</code>, <code>utm_campaign</code>, and Meta or Google click identifiers) so we know
        which ad brought you here.
      </p>
      <p>
        <strong>When you book a call.</strong> The time you choose, and the email address the calendar invite is sent
        to. The invite and the meeting are created in Google Calendar.
      </p>
      <p>
        <strong>When you speak to the voice agent.</strong> The call is processed by our voice provider to answer you
        and, if you ask, to book a meeting. A recording and transcript of the call are retained so we can follow up
        accurately and improve the agent.
      </p>
      <p>
        <strong>Automatically.</strong> Standard server logs, and — where the relevant tags are enabled — analytics and
        advertising cookies described under Cookies below. We do not run session-replay or screen-recording tools.
      </p>

      <h2>Why we use it</h2>
      <p>
        To contact you about the audit or call you asked for, to schedule and run that meeting, to keep a record of the
        enquiry in our CRM, and to measure which advertising works. We do not sell your personal information, and we do
        not share it for anyone else&rsquo;s independent marketing.
      </p>

      <h2>Text messages and calls</h2>
      <p>
        If you give us your phone number, you agree that we may contact you at it about your enquiry, including by
        automated text message and by AI voice agent. Consent is not a condition of purchase. Message frequency varies
        and message and data rates may apply. Reply <strong>STOP</strong> to any message to opt out, or{" "}
        <strong>HELP</strong> for help.
      </p>

      <h2>Who processes it for us</h2>
      <p>
        We use a small set of providers, each handling data only to deliver our service: Google Workspace (calendar and
        email), Supabase (our CRM database), Resend (transactional email), Twilio (text messages), Retell (the voice
        agent), and Vercel (hosting). Where advertising tags are enabled, Meta and Google receive the events described
        below.
      </p>

      <h2>Cookies and advertising tags</h2>
      <p>
        We use cookies that are necessary for the site to function. Where enabled, the Meta pixel and Google tag record
        that a form was submitted or a meeting was booked, so advertising can be measured and optimised. You can block
        these through your browser settings, and through Meta&rsquo;s and Google&rsquo;s own ad preference controls.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Enquiry records are kept for as long as we may reasonably do business with you, and then deleted. Call
        recordings and transcripts are kept for up to twelve months. You can ask us to delete your information sooner.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us what we hold about you, ask us to correct it, or ask us to delete it, by emailing{" "}
        <a href="mailto:jarvis@tracerlabs.io" className="underline">jarvis@tracerlabs.io</a>. Depending on where you
        live you may have additional rights, including under the California Consumer Privacy Act — we honour the same
        requests from everyone regardless.
      </p>

      <h2>Children</h2>
      <p>This is a business service and is not directed to anyone under 18. We do not knowingly collect their data.</p>

      <h2>Changes</h2>
      <p>
        If this policy changes we will update the date at the top of this page. Material changes will be highlighted on
        the page.
      </p>
    </LegalPage>
  );
}
