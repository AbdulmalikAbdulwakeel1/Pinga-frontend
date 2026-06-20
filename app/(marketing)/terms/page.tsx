import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/*  Terms of Service page (static -- no "use client" needed)           */
/* ------------------------------------------------------------------ */

export const metadata = {
  title: "Terms of Service | Pinga",
  description: "Read the terms and conditions for using the Pinga platform.",
};

const LAST_UPDATED = "May 1, 2026";

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1A2B3E] sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        <Separator className="mt-6" />
      </header>

      {/* Content */}
      <div className="space-y-12">
        {/* 1 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">1. Acceptance of Terms</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            By accessing or using the Pinga platform, website, and related services (collectively,
            the &quot;Service&quot;), you agree to be bound by these Terms of Service
            (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Service.
            These Terms constitute a legally binding agreement between you and Pinga Technologies
            Ltd. (&quot;Pinga&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We reserve
            the right to modify these Terms at any time. Continued use of the Service after changes
            are posted constitutes acceptance of the revised Terms.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">2. Service Description</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Pinga is an AI-powered social sales agent designed for Nigerian small and medium-sized
            businesses. The Service enables you to connect your Instagram, Facebook, and WhatsApp
            business accounts and use artificial intelligence to automatically respond to customer
            messages, manage product catalogs, capture leads, negotiate prices, track orders, and
            analyze sales performance. The Service is provided on an &quot;as is&quot; and
            &quot;as available&quot; basis. We continuously improve our AI models and may update
            features, interfaces, and functionality without prior notice.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">3. User Accounts</h2>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            To access most features of the Service, you must create an account. When creating an
            account, you agree to:
          </p>
          <ul className="list-disc space-y-1.5 pl-6 text-base text-muted-foreground">
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and update your information to keep it accurate and current</li>
            <li>Keep your password secure and confidential; you are responsible for all activity under your account</li>
            <li>Notify us immediately of any unauthorized access or use of your account</li>
            <li>Not create accounts for fraudulent or deceptive purposes</li>
          </ul>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            We reserve the right to suspend or terminate accounts that violate these Terms or that
            we reasonably believe are being used for fraudulent or harmful purposes.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">4. Acceptable Use</h2>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            You agree to use the Service only for lawful purposes and in accordance with these
            Terms. You shall not:
          </p>
          <ul className="list-disc space-y-1.5 pl-6 text-base text-muted-foreground">
            <li>Use the Service to send spam, unsolicited messages, or harass others</li>
            <li>Upload or share content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable</li>
            <li>Use the Service to sell prohibited, counterfeit, or illegally obtained goods or services</li>
            <li>Attempt to reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>Use automated systems or bots (other than Pinga&apos;s own AI) to access the Service</li>
            <li>Interfere with or disrupt the integrity or performance of the Service</li>
            <li>Impersonate any person or entity, or falsely claim an affiliation with any person or entity</li>
            <li>Violate the terms of service of any third-party platform connected through Pinga (Instagram, Facebook, WhatsApp)</li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">5. Payment Terms</h2>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            Certain features of the Service require a paid subscription. By subscribing to a paid
            plan, you agree to the following:
          </p>
          <ul className="list-disc space-y-1.5 pl-6 text-base text-muted-foreground">
            <li>All prices are listed in Nigerian Naira (NGN) and are exclusive of applicable taxes unless stated otherwise</li>
            <li>Subscription fees are billed monthly or annually in advance, depending on your chosen billing cycle</li>
            <li>You authorize us to charge your selected payment method for recurring subscription fees</li>
            <li>Subscriptions auto-renew unless cancelled before the end of the current billing period</li>
            <li>Refunds are provided at our discretion; unused portions of a subscription are generally non-refundable</li>
            <li>We reserve the right to change pricing with at least 30 days notice; changes apply at the start of your next billing cycle</li>
          </ul>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Payment processing is handled by third-party providers (such as Paystack and
            Flutterwave). Your use of these services is subject to their respective terms and
            privacy policies.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">6. Intellectual Property</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            The Service, including all software, designs, text, graphics, logos, and other content,
            is the property of Pinga Technologies Ltd. and is protected by Nigerian and
            international intellectual property laws. You are granted a limited, non-exclusive,
            non-transferable license to use the Service for its intended purpose. You retain
            ownership of any content you upload to the Service (such as product images, catalog
            data, and business information). By uploading content, you grant us a non-exclusive
            license to use it as necessary to provide and improve the Service.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">7. Termination</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            You may terminate your account at any time by contacting us or through your account
            settings. We may suspend or terminate your access to the Service at any time, with or
            without cause, including but not limited to violation of these Terms. Upon termination,
            your right to use the Service ceases immediately. We will retain your data for a
            reasonable period to comply with legal obligations, resolve disputes, and enforce our
            agreements. You may request deletion of your data by contacting us at{" "}
            <a
              href="mailto:support@pinga.ng"
              className="font-medium text-[#FF6B2C] hover:underline"
            >
              support@pinga.ng
            </a>
            .
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">8. Limitation of Liability</h2>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            To the maximum extent permitted by applicable law:
          </p>
          <ul className="list-disc space-y-1.5 pl-6 text-base text-muted-foreground">
            <li>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without
              warranties of any kind, whether express or implied, including but not limited to
              warranties of merchantability, fitness for a particular purpose, or non-infringement
            </li>
            <li>
              We do not guarantee that the AI agent will respond accurately or appropriately in
              every situation; you are ultimately responsible for reviewing and managing your
              customer interactions
            </li>
            <li>
              Pinga shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages, including loss of profits, data, sales, or business opportunities,
              arising from your use of the Service
            </li>
            <li>
              Our total liability for any claims arising from or related to the Service shall not
              exceed the amount you paid to Pinga in the twelve (12) months preceding the claim
            </li>
          </ul>
        </section>

        {/* 9 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">9. Indemnification</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            You agree to indemnify, defend, and hold harmless Pinga Technologies Ltd., its
            officers, directors, employees, and agents from and against any claims, liabilities,
            damages, losses, and expenses (including reasonable legal fees) arising from or related
            to your use of the Service, violation of these Terms, or infringement of any
            third-party rights.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">10. Governing Law</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            These Terms shall be governed by and construed in accordance with the laws of the
            Federal Republic of Nigeria. Any disputes arising from or related to these Terms or the
            Service shall be subject to the exclusive jurisdiction of the courts of Lagos State,
            Nigeria.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A2B3E]">11. Contact</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            If you have any questions or concerns about these Terms of Service, please contact us:
          </p>
          <div className="mt-4 rounded-xl border border-border bg-muted/30 p-6">
            <p className="font-semibold text-[#1A2B3E]">Pinga Technologies Ltd.</p>
            <p className="mt-1 text-sm text-muted-foreground">Email: legal@pinga.ng</p>
            <p className="text-sm text-muted-foreground">Phone: +234 801 234 5678</p>
            <p className="text-sm text-muted-foreground">Address: Yaba, Lagos, Nigeria</p>
          </div>
        </section>
      </div>
    </article>
  );
}
