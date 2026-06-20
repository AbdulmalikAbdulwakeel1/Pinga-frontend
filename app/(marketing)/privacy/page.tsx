import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/*  Privacy Policy page (static -- no "use client" needed)             */
/* ------------------------------------------------------------------ */

export const metadata = {
  title: "Privacy Policy | Pinga",
  description: "Learn how Pinga collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "May 1, 2026";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1A2B3E] sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        <Separator className="mt-6" />
      </header>

      {/* Intro */}
      <div className="prose-pinga space-y-12">
        <section>
          <p className="text-base leading-relaxed text-muted-foreground">
            At Pinga (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are committed to
            protecting the privacy and security of your personal information. This Privacy Policy
            describes how we collect, use, share, and safeguard your data when you use our platform,
            website, and related services (collectively, the &quot;Service&quot;). By using the
            Service, you agree to the practices described in this policy.
          </p>
        </section>

        {/* 1 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">1. Information We Collect</h2>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            We collect information to provide and improve our Service. The types of information we
            collect include:
          </p>
          <h3 className="mb-2 text-lg font-semibold text-[#1A2B3E]">
            Personal Information You Provide
          </h3>
          <ul className="mb-4 list-disc space-y-1.5 pl-6 text-base text-muted-foreground">
            <li>Account details such as your name, email address, phone number, and business name</li>
            <li>Billing and payment information processed through our third-party payment providers</li>
            <li>Business information including product catalogs, pricing, and store details</li>
            <li>Communications you send to us, including support requests and feedback</li>
          </ul>
          <h3 className="mb-2 text-lg font-semibold text-[#1A2B3E]">
            Information Collected Automatically
          </h3>
          <ul className="mb-4 list-disc space-y-1.5 pl-6 text-base text-muted-foreground">
            <li>Device and browser information, including IP address, browser type, and operating system</li>
            <li>Usage data such as pages visited, features used, and time spent on the Service</li>
            <li>Cookies and similar tracking technologies to maintain sessions and analyze usage</li>
          </ul>
          <h3 className="mb-2 text-lg font-semibold text-[#1A2B3E]">
            Information From Third-Party Platforms
          </h3>
          <ul className="list-disc space-y-1.5 pl-6 text-base text-muted-foreground">
            <li>
              When you connect your Instagram, Facebook, or WhatsApp accounts, we receive
              conversation data, profile information, and messaging content necessary to
              operate the AI agent on your behalf
            </li>
            <li>We do not sell or share this data with unrelated third parties</li>
          </ul>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">2. How We Use Your Information</h2>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc space-y-1.5 pl-6 text-base text-muted-foreground">
            <li>To provide, maintain, and improve the Service, including AI-powered messaging features</li>
            <li>To process transactions, manage your account, and send service-related communications</li>
            <li>To personalize your experience and train AI models to better serve your customers</li>
            <li>To analyze usage patterns and improve platform performance and reliability</li>
            <li>To detect, prevent, and address fraud, abuse, and security issues</li>
            <li>To comply with legal obligations and enforce our terms of service</li>
            <li>To communicate with you about updates, promotions, and new features (with your consent)</li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">3. Data Sharing</h2>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            We do not sell your personal data. We may share your information in the following
            limited circumstances:
          </p>
          <ul className="list-disc space-y-1.5 pl-6 text-base text-muted-foreground">
            <li>
              <strong>Service providers:</strong> We share data with trusted third-party providers
              who help us operate the Service (e.g., cloud hosting, payment processing, analytics).
              These providers are contractually obligated to protect your data.
            </li>
            <li>
              <strong>Platform integrations:</strong> When you connect social media accounts, data
              flows between Pinga and those platforms as necessary to provide messaging services.
            </li>
            <li>
              <strong>Legal requirements:</strong> We may disclose information when required by law,
              court order, or governmental regulation, or to protect the rights, safety, or property
              of Pinga, our users, or the public.
            </li>
            <li>
              <strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of
              assets, your data may be transferred as part of the transaction. We will notify you of
              any such change.
            </li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">4. Data Security</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            We implement industry-standard security measures to protect your data, including
            encryption in transit and at rest, secure authentication protocols, and regular
            security audits. We restrict access to personal information to authorized personnel
            who need it to operate and improve the Service. While we strive to protect your
            information, no method of electronic transmission or storage is 100% secure. We
            encourage you to use strong, unique passwords and to report any suspicious activity
            on your account immediately.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">5. Your Rights</h2>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            In accordance with the Nigeria Data Protection Regulation (NDPR) and applicable data
            protection laws, you have the following rights regarding your personal data:
          </p>
          <ul className="list-disc space-y-1.5 pl-6 text-base text-muted-foreground">
            <li>
              <strong>Access:</strong> You can request a copy of the personal data we hold about you.
            </li>
            <li>
              <strong>Correction:</strong> You can request that we correct any inaccurate or
              incomplete data.
            </li>
            <li>
              <strong>Deletion:</strong> You can request that we delete your personal data, subject
              to certain legal exceptions.
            </li>
            <li>
              <strong>Portability:</strong> You can request your data in a machine-readable format
              for transfer to another service.
            </li>
            <li>
              <strong>Objection:</strong> You can object to certain types of processing, including
              direct marketing.
            </li>
            <li>
              <strong>Withdrawal of consent:</strong> Where processing is based on your consent, you
              may withdraw it at any time without affecting the lawfulness of prior processing.
            </li>
          </ul>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            To exercise any of these rights, please contact us at{" "}
            <a
              href="mailto:privacy@pinga.ng"
              className="font-medium text-[#FF6B2C] hover:underline"
            >
              privacy@pinga.ng
            </a>
            . We will respond to your request within 30 days.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">6. Cookies</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            We use cookies and similar technologies to enhance your experience, remember your
            preferences, and analyze how the Service is used. You can manage cookie preferences
            through your browser settings. Disabling certain cookies may affect the functionality
            of the Service.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">7. Children&apos;s Privacy</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            The Service is not intended for individuals under the age of 18. We do not knowingly
            collect personal data from children. If we become aware that we have collected personal
            information from a child, we will take steps to delete that information promptly.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">8. Changes to This Policy</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            We may update this Privacy Policy from time to time to reflect changes in our practices
            or applicable laws. We will notify you of material changes by posting the updated policy
            on our website and, where appropriate, by sending you an email notification. Your
            continued use of the Service after changes are posted constitutes acceptance of the
            revised policy.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">9. Contact Us</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our
            data practices, please contact us at:
          </p>
          <div className="mt-4 rounded-xl border border-border bg-muted/30 p-6">
            <p className="font-semibold text-[#1A2B3E]">Pinga Technologies Ltd.</p>
            <p className="mt-1 text-sm text-muted-foreground">Email: privacy@pinga.ng</p>
            <p className="text-sm text-muted-foreground">Phone: +234 801 234 5678</p>
            <p className="text-sm text-muted-foreground">Address: Yaba, Lagos, Nigeria</p>
          </div>
        </section>
      </div>
    </article>
  );
}
