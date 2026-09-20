"use client";

import { useState } from "react";

export default function Home() {
  const [copied, setCopied] = useState("");

  const email = "nisthajain609@gmail.com";
  const phoneNumber = "8279413939";

  const copyText = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(type);

      setTimeout(() => {
        setCopied("");
      }, 1800);
    } catch {
      window.prompt(`Copy ${type}:`, text);
    }
  };

  return (
    <main className="profile-page">

      {/* ================= HEADER ================= */}

      <header className="header">

        <div className="header-brand">

          {/* LEFT LOGO */}
          <div className="header-logo">
            <img
              src="/somyain.jpeg"
              alt="Somya Innovations Logo"
            />
          </div>

          {/* RIGHT BRAND NAME */}
          <div className="header-brand-name">
            <div className="brand-somya">
              SOMYA
            </div>

            <div className="brand-innovations">
              INNOVATIONS
            </div>
          </div>

        </div>

      </header>


      {/* ================= HERO ================= */}

      <section className="hero">

        <h1>
          NISTHA
          <br />
          JAIN
        </h1>

        <div className="hero-line"></div>

        <div className="profile-photo">
          <img
            src="/nistha.jpeg"
            alt="Nistha Jain"
          />
        </div>

        <p className="designation">
          INNOVATION EXECUTIVE
        </p>

       

        <div className="hero-buttons">

          <a
            href="#connect"
            className="primary-button"
          >
            CONNECT
          </a>

          <a
            href="#professional"
            className="secondary-button"
          >
            VIEW PROFILE
          </a>

        </div>

      </section>


      {/* ================= CONNECT ================= */}

      <section
        className="connect-section"
        id="connect"
      >

        <div className="section">

          <p className="section-label">
            01 — CONNECT
          </p>

          <div className="links">

            <a
              href="https://www.linkedin.com/in/nistha-jain-577ab0340/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <div>
                <small>PROFESSIONAL</small>
                <span>LINKEDIN</span>
              </div>

              <b>↗</b>
            </a>


            <a
              href="https://www.instagram.com/niissssh/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <div>
                <small>SOCIAL</small>
                <span>INSTAGRAM</span>
              </div>

              <b>↗</b>
            </a>


            <button
              type="button"
              className="social-link contact-button"
              onClick={() => copyText(email, "EMAIL")}
            >
              <div>
                <small>
                  {copied === "EMAIL"
                    ? "COPIED"
                    : "EMAIL"}
                </small>

                <span>
                  {email}
                </span>
              </div>

              <b>
                {copied === "EMAIL"
                  ? "✓"
                  : "↗"}
              </b>
            </button>


            <button
              type="button"
              className="social-link contact-button"
              onClick={() => {
                copyText(phoneNumber, "PHONE");

                window.location.href =
                  `tel:+91${phoneNumber}`;
              }}
            >
              <div>
                <small>
                  {copied === "PHONE"
                    ? "COPIED"
                    : "PHONE NUMBER"}
                </small>

                <span>
                  +91 {phoneNumber}
                </span>
              </div>

              <b>
                {copied === "PHONE"
                  ? "✓"
                  : "↗"}
              </b>
            </button>

          </div>

        </div>

      </section>


      {/* ================= PROFESSIONAL INFORMATION ================= */}

      <section
        className="dark-section"
        id="professional"
      >

        <div className="section">

          <p className="section-label light-label">
            02 — PROFESSIONAL INFORMATION
          </p>

          <div className="info-card">

            <div className="info-row">
              <span>EMPLOYEE ID</span>
              <strong>SI-IE-1023</strong>
            </div>

            <div className="info-row">
              <span>ROLE</span>
              <strong>Innovation Executive</strong>
            </div>

            <div className="info-row">
              <span>DEPARTMENT</span>
              <strong>Innovation &amp; Strategy</strong>
            </div>

            <div className="info-row">
              <span>LOCATION</span>
              <strong>Gwalior, India</strong>
            </div>

          </div>

        </div>

      </section>


      {/* ================= VISIT WEBSITE ================= */}

      <section className="visit-website-section">

        <a
          href="https://www.somyainnovations.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="visit-website-button"
        >

          <div className="visit-website-content">

            <small>
              COMPANY
            </small>

            <span>
              VISIT WEBSITE
            </span>

          </div>

          <div className="visit-arrow">
            ↗
          </div>

        </a>

      </section>


      {/* ================= VERIFIED ================= */}

      <section className="verification-section">

        <div className="verification-inner">

          <div className="check">
            ✓
          </div>

          <div className="verification-text">

            <strong>
              VERIFIED EMPLOYEE
            </strong>

            <p>
  This profile represents a verified member of Somya Innovations.
</p>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer>

        <div className="footer-logo">

          <img
            src="/somya-logo.jpeg"
            alt="Somya Innovations"
          />

        </div>

        <h3>
          SOMYA INNOVATIONS
        </h3>

        <p>
          IDEAS • PEOPLE • TECHNOLOGY • IMPACT
        </p>

        <small>
          Digital Employee Profile
        </small>

      </footer>

    </main>
  );
}