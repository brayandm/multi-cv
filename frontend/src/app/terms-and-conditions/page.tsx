"use client";

import { useEffect, useRef } from "react";

export default function TermsAndConditionsPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sectionCount = 1;
    let subSectionCount = 0;

    const headers = contentRef.current?.querySelectorAll("h2, h3") || [];

    headers.forEach((el) => {
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
    });
  }, []);

  return (
    <div
      className="documents-typography max-w-3xl mx-auto p-6 text-gray-800 dark:text-white space-y-6"
      ref={contentRef}
    >
      <h1 className="text-3xl font-bold">Terms and Conditions</h1>
      <p>
        <strong>Last updated: March 28, 2025</strong>
      </p>

      <h2>Who We Are</h2>
      <p>
        MultiCV is an independent project developed by a group of individuals.
        It is not registered as a formal business entity. By using this service,
        You acknowledge that it is provided &quot;as is&quot; without any
        warranties or legal guarantees.
      </p>

      <h2>Beta Phase and Purpose of Payments</h2>
      <p>
        MultiCV is currently in a testing phase (&quot;beta&quot;), and as such,
        the Service may experience bugs, errors, or limited functionality. The
        purpose of charging users is not for profit but to cover operational
        costs such as server expenses and third-party API costs (e.g., OpenAI
        API usage). By making a payment, You acknowledge that the service is
        experimental, and You are supporting its development.
      </p>
      <p>
        If You are dissatisfied with the Service, You may request a refund as
        outlined below.
      </p>

      <h2>Acceptance of Terms</h2>
      <p>
        By using MultiCV (&quot;Service&quot;), You agree to these Terms and
        Conditions. If You do not agree to these Terms, You must discontinue use
        of the Service immediately.
      </p>

      <h2>Use of AI-Generated Content</h2>
      <p>
        Our Service leverages OpenAI’s API to generate CVs. We do not guarantee
        the accuracy or appropriateness of AI-generated content and are not
        responsible for any incorrect, misleading, or offensive output. By using
        the Service, You acknowledge that:
      </p>
      <ol>
        <li>
          AI-generated content may contain errors, biases, or misleading
          information.
        </li>
        <li>You must review and verify the generated CVs before using them.</li>
        <li>
          We strive to provide accurate AI-generated CVs; however, You
          acknowledge that the output may contain errors. You are responsible
          for reviewing and verifying all content before using it.
        </li>
        <li>
          By using our Service, You also agree to{" "}
          <a href="https://openai.com/policies">OpenAI’s Terms and Policies</a>.
        </li>
      </ol>

      <h2>Talent Pool and Recruiter Access</h2>
      <p>
        If You choose to opt into the talent pool, You agree to make Your
        profile visible to third-party recruiters and hiring teams who use the
        Service to search for potential candidates. Your participation in the
        talent pool is entirely optional and based on Your explicit consent. You
        may withdraw this consent at any time through Your account settings.
      </p>
      <h2>Data Storage and Privacy</h2>
      <p>
        When using MultiCV, the data You provide is stored on our servers and is
        also sent to OpenAI’s API for processing. We do not control how OpenAI
        handles this data beyond their publicly stated policies. However, we
        store the generated CVs on our servers to enhance user experience and
        allow access to previously generated CVs. For more details on data
        privacy, please review our <a href="privacy-policy">Privacy Policy</a>.
      </p>
      <p>
        Our Service is strictly intended for users aged 18 years and older. If
        we discover that a user under 18 has registered or provided personal
        data, we will immediately delete their account and any associated data.
      </p>

      <h2>Right of Withdrawal</h2>
      <p>
        In accordance with Spanish consumer protection laws, You have the right
        to withdraw from Your purchase within 14 days, provided You have not
        already accessed or used the digital services. Once You make use of the
        Service, You expressly waive this right of withdrawal.
      </p>

      <h2>Refund Policy</h2>
      <p>
        Refunds are available in cases where You have not accessed or used the
        digital services. Additionally, if an error occurs in the purchase
        process or an incorrect charge is made, You may request a refund by
        contacting us at hello.multicv@gmail.com.
      </p>
      <p>
        Refunds are not provided once the service has been used, except in cases
        where the service has failed to deliver the promised functionality. If
        the service is not working as expected due to technical failures on our
        end, You may request a refund for the unused portion of Your purchase.
      </p>

      <h2>Service Availability and Subscriptions</h2>
      <p>
        We reserve the right to modify, suspend, or terminate the Service at any
        time. We will make reasonable efforts to notify users in advance of any
        significant changes; however, in some cases, prior notice may not be
        possible. Additionally, prices for our services and subscriptions may
        change at any time.
      </p>
      <ol>
        <li>
          If we decide to terminate the Service, we will make reasonable efforts
          to notify all users in advance. Whenever possible, we will allow users
          some time to use their remaining credits or CV generations before the
          Service is fully discontinued. In cases where this is not feasible, we
          will issue proportional refunds for any unused portion of active
          subscriptions and one-time purchases.
        </li>
        <li>
          Price changes do not require prior notification for one-time
          purchases, as users will see the updated pricing at checkout. However,
          for active subscriptions, price adjustments can have a greater impact.
          To ensure transparency, ongoing subscriptions will be automatically
          canceled at the end of the current billing cycle. In some cases, we
          may allow certain customers to keep their previous price.
        </li>
      </ol>

      <h2>Free Tier</h2>
      <p>
        We offer a free tier with limited functionality that allows users to try
        basic features of the Service. Users can later extend these features by
        purchasing a plan or additional services. Since the free tier provides
        an opportunity to evaluate the Service before making a purchase, refunds
        will not be issued for dissatisfaction with premium plans.
      </p>
      <p>
        However, if the purchased plan or additional services fail to function
        as expected due to a technical issue on our end, You may request a
        refund for the unused portion of Your purchase.
      </p>

      <h2>Prohibited Conduct</h2>
      <p>
        You agree not to misuse the Service. Prohibited actions include but are
        not limited to:
      </p>
      <ol>
        <li>
          Using the Service to generate misleading, false, or fraudulent CVs.
        </li>
        <li>
          Attempting cyber-attacks, including but not limited to DDoS attacks,
          hacking, or unauthorized access to our systems.
        </li>
        <li>Using the Service if You are under 18 years old.</li>
        <li>
          Engaging in any activity that violates applicable laws or regulations.
        </li>
        <li>
          Any behavior that disrupts, harms, or otherwise interferes with
          MultiCV, its users, or its operations.
        </li>
      </ol>
      <p>
        We verify the user’s age through a checkbox at the time of registration.
        If we discover that a user under 18 has used the Service, their account
        will be suspended immediately.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, MULTICV SHALL NOT BE LIABLE FOR
        ANY DAMAGES, INCLUDING BUT NOT LIMITED TO DIRECT, INDIRECT, INCIDENTAL,
        CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
      </p>
      <p>
        UNDER NO CIRCUMSTANCES SHALL MULTICV&#39;S TOTAL LIABILITY EXCEED THE
        AMOUNT YOU PAID FOR THE SERVICE IN THE THREE (3) MONTHS PRIOR TO THE
        INCIDENT GIVING RISE TO THE LIABILITY.
      </p>

      <h2>Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless MultiCV, its developers,
        contributors, and affiliates from any claims, damages, liabilities, or
        expenses (including reasonable attorneys&#39; fees) arising from:
      </p>
      <ul>
        <li>Your violation of these Terms.</li>
        <li>Your misuse of the Service.</li>
        <li>
          Any content generated by the Service that results in legal claims.
        </li>
      </ul>

      <h2>Arbitration and Dispute Resolution</h2>
      <p>
        Any dispute, claim, or controversy arising out of or relating to these
        Terms shall be resolved exclusively by binding arbitration. The
        arbitration shall be conducted in accordance with the rules of the
        Spanish Arbitration Court. By agreeing to arbitration, You waive Your
        right to a trial by jury or participation in a class action lawsuit.
      </p>

      <h2>Class Action Waiver</h2>
      <p>
        You agree that any dispute resolution will be conducted solely on an
        individual basis and not as part of a class, consolidated, or
        representative action. You waive any right to bring or participate in a
        class action lawsuit against MultiCV.
      </p>

      <h2>Force Majeure</h2>
      <p>
        MultiCV shall not be held liable for any failure or delay in performance
        caused by circumstances beyond our reasonable control, including but not
        limited to natural disasters, government restrictions, cyberattacks, or
        third-party service failures.
      </p>

      <h2>Changes to Terms and Conditions or Privacy Policy</h2>
      <p>
        We may update these Terms and Conditions or our Privacy Policy. Users
        will be notified at least 30 days before changes take effect. The
        updated Terms will be posted with an updated &quot;Last updated&quot;
        date. If You continue to use the Service after this period, You agree to
        the revised Terms.
      </p>

      <h2>Governing Law and Jurisdiction</h2>
      <p>
        These Terms and Conditions shall be governed and construed in accordance
        with the laws of Spain, without regard to its conflict of law
        provisions. Any dispute or claim arising out of or in connection with
        these Terms shall be subject to the exclusive jurisdiction of the courts
        of Barcelona, Spain.
      </p>

      <h2>Cookies and Tracking Technologies</h2>
      <p>
        By using MultiCV, You agree to the use of cookies and similar tracking
        technologies as described in our{" "}
        <a href="cookies-policy">Cookies Policy</a>.
      </p>
      <p>
        Cookies help us enhance user experience, analyze website traffic, and
        enable essential functionalities. We use different types of cookies,
        including:
      </p>
      <ul>
        <li>
          <strong>Essential Cookies:</strong> Required for the proper
          functioning of the Service.
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Help us understand user behavior
          and improve our platform.
        </li>
        <li>
          <strong>Functional Cookies:</strong> Store user preferences to enhance
          navigation.
        </li>
      </ul>
      <p>
        You can manage or disable cookies at any time through Your browser
        settings. For more information on how we use cookies and how You can
        manage them, please refer to our{" "}
        <a href="cookies-policy">Cookies Policy</a>.
      </p>

      <h2>Contact Us</h2>
      <p>If You have any questions about these Terms, contact us at:</p>
      <p>
        <strong>Email</strong>: hello.multicv@gmail.com
      </p>
    </div>
  );
}
