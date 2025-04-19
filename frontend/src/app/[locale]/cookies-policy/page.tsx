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
      <h1 className="text-3xl font-bold">Cookies Policy</h1>
      <p>
        <strong>Last updated: April 19, 2025</strong>
      </p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small text files that are stored on Your device when You
        visit a website. They help websites remember information about Your
        visit to improve functionality, security, and user experience.
      </p>

      <h2>How We Use Cookies</h2>
      <p>
        MultiCV uses cookies to enhance Your experience, analyze site usage, and
        manage user sessions. The cookies we use may include:
      </p>
      <ol>
        <li>
          <strong>Essential Cookies:</strong> Required for basic site
          functionality.
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Help us understand how users
          interact with the site (e.g., Google Analytics).
        </li>
        <li>
          <strong>Functional Cookies:</strong> Store user preferences, such as
          language selection.
        </li>
      </ol>

      <h2>Managing Cookies</h2>
      <p>
        You can manage or delete cookies at any time through Your browser
        settings. Most browsers allow You to block or delete cookies, but this
        may affect site functionality.
      </p>
      <p>To disable cookies, follow these links for popular browsers:</p>
      <ol>
        <li>
          <a
            href="https://support.google.com/chrome/answer/95647"
            target="_blank"
          >
            Google Chrome
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
            target="_blank"
          >
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a
            href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
            target="_blank"
          >
            Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies"
            target="_blank"
          >
            Internet Explorer
          </a>
        </li>
      </ol>

      <h2>Analytics and Session Tracking</h2>
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

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Cookies Policy from time to time. Any changes will be
        posted with an updated &quot;Last updated&quot; date. If necessary, We
        will request Your consent again.
      </p>

      <h2>Contact Us</h2>
      <p>If You have any questions about our Cookies Policy, contact us at:</p>
      <p>
        <strong>Email:</strong> hello.multicv@gmail.com
      </p>
    </div>
  );
}
