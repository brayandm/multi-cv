"use client";

import { useEffect, useRef } from "react";

export default function PrivacyPolicyPage() {
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
      <h1 className="text-3xl font-bold">Cookies Policy</h1>
      <p>
        <strong>Last updated: March 28, 2025</strong>
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
      <ul>
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
      </ul>

      <h2>Managing Cookies</h2>
      <p>
        You can manage or delete cookies at any time through Your browser
        settings. Most browsers allow You to block or delete cookies, but this
        may affect site functionality.
      </p>
      <p>To disable cookies, follow these links for popular browsers:</p>
      <ul>
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
      </ul>

      <h2>Third-Party Cookies</h2>
      <p>
        We may use third-party services such as Google Analytics to track user
        activity. These services may set their own cookies, which are subject to
        their respective privacy policies.
      </p>
      <p>
        For more information about Google Analytics cookies, visit{" "}
        <a
          href="https://policies.google.com/technologies/cookies"
          target="_blank"
        >
          Google&apos;s Cookie Policy
        </a>
        .
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
