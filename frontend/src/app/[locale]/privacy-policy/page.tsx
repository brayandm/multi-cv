"use client";

import { useEffect, useRef } from "react";

export default function PrivacyPolicyPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sectionCount = 1;
    let subSectionCount = 0;

    const headers = contentRef.current?.querySelectorAll("h2, h3") || [];

    headers.forEach((el) => {
      if ((el as HTMLElement).dataset.processed === "true") return;

      if (el.tagName === "H2") {
        subSectionCount = 0;
        el.textContent = `${sectionCount}. ${el.textContent}`;
        sectionCount++;
      } else if (el.tagName === "H3") {
        subSectionCount++;
        el.textContent = `${sectionCount - 1}.${subSectionCount} ${
          el.textContent
        }`;
      }

      (el as HTMLElement).dataset.processed = "true";
    });
  }, []);

  return (
    <div
      className="documents-typography max-w-3xl mx-auto p-6 text-gray-800 dark:text-white space-y-6"
      ref={contentRef}
    >
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>
        <strong>Last updated: April 19, 2025</strong>
      </p>
      <p>
        This Privacy Policy describes Our policies and procedures on the
        collection, use, and disclosure of Your information when You use the
        Service and informs You about Your privacy rights and how the law
        protects You.
      </p>
      <p>
        We use Your Personal Data to provide and improve the Service. By using
        the Service, You agree to the collection and use of information in
        accordance with this Privacy Policy.
      </p>

      <h2>Who We Are</h2>
      <p>
        MultiCV is an independent project developed by a group of individuals.
        It is not registered as a formal business entity. By using this service,
        You acknowledge that it is provided &quot;as is&quot; without any
        warranties or legal guarantees.
      </p>

      <h2>Interpretation and Definitions</h2>
      <h3>Interpretation</h3>
      <p>
        The words with capitalized initial letters have meanings defined under
        the following conditions. The following definitions shall have the same
        meaning regardless of whether they appear in singular or in plural.
      </p>

      <h3>Definitions</h3>
      <ol>
        <li>
          <strong>Project</strong>: MultiCV (&quot;We&quot;, &quot;Us&quot;,
          &quot;Our&quot;).
        </li>
        <li>
          <strong>Personal Data</strong>: Any information that relates to an
          identified or identifiable individual.
        </li>
        <li>
          <strong>Service</strong>: The Website available at{" "}
          <a href="https://multicv.space/" target="_blank">
            https://multicv.space/
          </a>
          .
        </li>
        <li>
          <strong>You</strong>: The individual accessing or using the Service.
        </li>
      </ol>

      <h2>Collecting and Using Your Personal Data</h2>
      <h3>Types of Data Collected</h3>
      <h4>Personal Data</h4>
      <p>We collect and process the following Personal Data:</p>
      <ol>
        <li>Name and surname</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Profile photo</li>
        <li>Address, State, Province, ZIP/Postal code, City</li>
        <li>
          Employment history and CV details (e.g., job titles, responsibilities,
          duration, employers)
        </li>
        <li>
          Educational history (e.g., schools attended, degrees, graduation
          dates)
        </li>
        <li>Certificates and professional qualifications</li>
        <li>
          Usage Data (e.g., IP address, browser type, visited pages, etc.)
        </li>
      </ol>

      <h3>Sharing Your Profile with Hiring Teams</h3>
      <p>
        If You choose to join the talent pool, You consent to make Your profile
        visible to trusted companies, recruiters, and hiring teams that use Our
        Service to find potential candidates. Only the information necessary for
        recruitment purposes will be shared, and this sharing will occur
        strictly under Your explicit consent. You can update or withdraw this
        consent at any time in Your settings.
      </p>

      <h3>Legal Basis for Processing Personal Data (GDPR)</h3>
      <p>
        If You are in the European Economic Area (EEA), We process Your Personal
        Data under the following legal bases:
      </p>
      <ol>
        <li>
          <strong>Performance of a contract</strong>: To provide the CV
          generation service You request.
        </li>
        <li>
          <strong>Consent</strong>: When You voluntarily submit information or
          choose to make Your profile visible to recruiters.
        </li>
        <li>
          <strong>Legitimate interest</strong>: To improve and analyze our
          services, enhance security, and prevent fraud.
        </li>
      </ol>

      <h2>Cookies and Analytics</h2>
      <p>
        We use cookies and similar tracking technologies to enhance user
        experience and analyze website traffic. By using the Service, You
        consent to the use of cookies as described in our{" "}
        <a href="cookies-policy">Cookies Policy</a>.
      </p>

      <h3>Analytics and Session Tracking</h3>
      <p>
        We use analytics tools to understand how our users interact with the
        Service. These tools may track user activity both before and after
        authentication. This includes the use of{" "}
        <strong>anonymous identifiers</strong> that help us understand usage
        patterns from the first interaction, even when You are not logged in.
      </p>
      <p>
        When You later sign in or create an account, these previously anonymous
        usage patterns may be{" "}
        <strong>associated with Your authenticated profile</strong> in order to
        provide continuity, improve personalization, and analyze behavior more
        effectively. This process helps us offer better recommendations,
        identify potential issues, and enhance Your overall experience with the
        Service.
      </p>
      <p>
        In addition, analytics tools may include{" "}
        <strong>session recordings</strong> or replays (such as mouse movements,
        page transitions, and clicks), which help us understand how users
        interact with specific parts of the site. These recordings may begin
        before login and continue after login, and may later be linked to Your
        profile for support, analytics, or product improvement purposes.
      </p>
      <p>
        All tracking and analysis is performed in accordance with applicable
        data protection laws. You may control or opt out of some tracking
        through your browser settings or by contacting us directly.
      </p>

      <h2>Your Rights Under GDPR</h2>
      <p>If You are in the EU, You have the following rights:</p>
      <ol>
        <li>
          <strong>Right to access</strong>: Request copies of Your Personal
          Data.
        </li>
        <li>
          <strong>Right to rectification</strong>: Request corrections to
          inaccurate data.
        </li>
        <li>
          <strong>Right to erasure</strong>: Request deletion of Your data.
        </li>
        <li>
          <strong>Right to restrict processing</strong>: Request limitations on
          data processing.
        </li>
        <li>
          <strong>Right to data portability</strong>: Request a copy of Your
          data.
        </li>
        <li>
          <strong>Right to object</strong>: Object to Our processing of Your
          data.
        </li>
      </ol>
      <p>
        To exercise these rights, contact Us at{" "}
        <strong>hello.multicv@gmail.com</strong>.
      </p>

      <h2>Your Rights Under CCPA/CPRA (California Residents)</h2>
      <p>
        Under the{" "}
        <strong>
          California Consumer Privacy Act (CCPA) and California Privacy Rights
          Act (CPRA)
        </strong>
        , California residents have the following rights:
      </p>
      <ol>
        <li>
          <strong>Right to Know</strong>: Request details about collected data.
        </li>
        <li>
          <strong>Right to Delete</strong>: Request data deletion.
        </li>
        <li>
          <strong>Right to Opt-Out</strong>: Choose not to have data sold or
          shared.
        </li>
        <li>
          <strong>Right to Correct</strong>: Request data corrections.
        </li>
        <li>
          <strong>Right to Non-Discrimination</strong>: We will not discriminate
          against You.
        </li>
      </ol>
      <p>
        To exercise these rights, email Us at{" "}
        <strong>hello.multicv@gmail.com</strong>.
      </p>

      <h2>Age Restriction and Children&apos;s Privacy</h2>
      <p>
        Our Service is{" "}
        <strong>strictly intended for users aged 18 years and older</strong>. If
        You are under the age of 18, You are not permitted to use this Service.
      </p>
      <p>
        We do not knowingly collect personally identifiable information from
        anyone under the age of 18. If You are a parent or guardian and believe
        that Your child has provided us with personal data, please contact us
        immediately at <strong> hello.multicv@gmail.com</strong>.
      </p>
      <p>
        If we discover that we have collected Personal Data from anyone under
        the required age without parental consent, we will take immediate steps
        to delete that data and terminate their account.
      </p>
      <p>
        By using this Service, You represent and warrant that You meet the age
        requirement. If You falsify Your age to access the Service, we are not
        responsible for any resulting consequences.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain Your Personal Data only as long as necessary to fulfill the
        purposes outlined in this Privacy Policy. This includes fulfilling
        contractual and legal obligations, improving the Service, and ensuring
        fair use.
      </p>
      <p>
        Specifically, we may retain email addresses for up to{" "}
        <strong>12 months</strong> after an account is deleted in order to
        prevent abuse of our free-tier offering (e.g., by repeatedly creating
        new accounts to bypass limitations). This data is stored securely and
        used exclusively for this purpose.
      </p>
      <p>
        This processing is based on our legitimate interest in protecting the
        integrity of the platform and ensuring fair usage. After this period,
        the email addresses are permanently deleted or anonymized.
      </p>

      <h2>Data Security</h2>
      <p>
        We implement appropriate security measures to protect Your Personal
        Data. However, no method of transmission over the Internet or electronic
        storage is 100% secure.
      </p>

      <h2>Data Transfers</h2>
      <p>
        Your data may be stored outside Your country. We ensure proper
        safeguards for such transfers.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        We do not sell Your Personal Data to third parties. However, we use
        third-party services, including OpenAI&apos;s API, to provide certain
        functionalities. This means that some data may be sent to OpenAI for
        processing. We ensure that any data shared is handled in accordance with
        our privacy policy and industry standards for security and
        confidentiality.
      </p>
      <p>
        By using our services, You also agree to OpenAI&apos;s policies and
        terms of service. We are not responsible for any errors, data handling
        practices, or policies implemented by OpenAI.
      </p>

      <h2>Account and Data Deletion</h2>
      <p>
        You may request deletion of Your account and associated data at any time
        by contacting us at hello.multicv@gmail.com.
      </p>

      <h2>Changes to This Privacy Policy</h2>
      <p>
        We may update this policy. Changes will be posted with an updated
        &quot;Last updated&quot; date.
      </p>

      <h2>Contact Us</h2>
      <p>If You have any questions, contact us at:</p>
      <p>
        <strong>Email</strong>: hello.multicv@gmail.com
      </p>
    </div>
  );
}
