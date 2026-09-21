"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type SocialLink = {
  platform: string;
  label: string;
  url: string;
  display_order: number;
};

type Employee = {
  employee_id: string;
  name: string;
  slug: string;
  photo_url: string;
  designation: string;
  department: string;
  location: string;
  joined_date: string;
  bio: string;
  email: string;
  phone: string;
  phone_country_code: string;
  show_email: boolean;
  show_phone: boolean;
  status: "active" | "inactive";
  verified?: boolean;
  social_links: SocialLink[];
};

export default function Home() {
  const params = useParams();

  const slug = params.slug as string;

  const [employee, setEmployee] =
    useState<Employee | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [copied, setCopied] =
    useState("");

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const response = await fetch(
          `/api/employees?slug=${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          setEmployee(null);
          return;
        }

        const data = await response.json();

        setEmployee(data);
      } catch (error) {
        console.error(
          "Failed to load employee:",
          error
        );

        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadEmployee();
    }
  }, [slug]);

  const copyText = async (
    text: string,
    type: string
  ) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(type);

      setTimeout(() => {
        setCopied("");
      }, 1800);
    } catch {
      window.prompt(
        `Copy ${type}:`,
        text
      );
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            letterSpacing: "2px",
          }}
        >
          LOADING PROFILE...
        </div>
      </main>
    );
  }

  if (!employee) {
    return (
      <main className="profile-page">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "30px",
          }}
        >
          <h1>Employee Not Found</h1>

          <p>
            This employee profile does not exist
            or has been removed.
          </p>
        </div>
      </main>
    );
  }

  const linkedin =
    employee.social_links?.find(
      (link) =>
        link.platform === "linkedin"
    );

  const instagram =
    employee.social_links?.find(
      (link) =>
        link.platform === "instagram"
    );

  const otherSocialLinks =
    employee.social_links?.filter(
      (link) =>
        link.url &&
        link.platform !== "linkedin" &&
        link.platform !== "instagram"
    ) || [];

  const fullPhone =
    `${employee.phone_country_code || "+91"}${employee.phone}`;

  return (
    <main className="profile-page">

      {/* ================= HEADER ================= */}

      <header className="header">
        <div className="header-brand">

          <div className="header-logo">
            <img
              src="/somyain.jpeg"
              alt="Somya Innovations"
            />
          </div>

          <div className="header-brand-name">
            <span className="brand-somya">
              SOMYA
            </span>

            <span className="brand-innovations">
              INNOVATIONS
            </span>
          </div>

        </div>
      </header>


      {/* ================= HERO ================= */}

      <section className="hero">

        <h1>
          {employee.name
            .trim()
            .split(/\s+/)
            .map((word, index) => (
              <span key={index}>
                {index > 0 && <br />}
                {word.toUpperCase()}
              </span>
            ))}
        </h1>

        <div className="hero-line"></div>

        <div className="profile-photo">

          {employee.photo_url ? (
            <img
              src={employee.photo_url}
              alt={employee.name}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#E9E4DE",
                fontSize: "30px",
                fontWeight: 700,
              }}
            >
              {employee.name
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

        </div>

        <p className="designation">
          {employee.designation.toUpperCase()}
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

            {linkedin?.url && (
              <a
                href={linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <div>
                  <small>
                    PROFESSIONAL
                  </small>

                  <span>
                    LINKEDIN
                  </span>
                </div>

                <b>↗</b>
              </a>
            )}

            {instagram?.url && (
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <div>
                  <small>
                    SOCIAL
                  </small>

                  <span>
                    INSTAGRAM
                  </span>
                </div>

                <b>↗</b>
              </a>
            )}

            {otherSocialLinks.map(
              (link) => (
                <a
                  key={`${link.platform}-${link.display_order}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <div>
                    <small>
                      SOCIAL
                    </small>

                    <span>
                      {link.label ||
                        link.platform.toUpperCase()}
                    </span>
                  </div>

                  <b>↗</b>
                </a>
              )
            )}

            {employee.show_email &&
              employee.email && (
                <button
                  type="button"
                  className="social-link contact-button"
                  onClick={() =>
                    copyText(
                      employee.email,
                      "EMAIL"
                    )
                  }
                >
                  <div>
                    <small>
                      {copied === "EMAIL"
                        ? "COPIED"
                        : "EMAIL"}
                    </small>

                    <span>
                      {employee.email}
                    </span>
                  </div>

                  <b>
                    {copied === "EMAIL"
                      ? "✓"
                      : "↗"}
                  </b>
                </button>
              )}

            {employee.show_phone &&
              employee.phone && (
                <button
                  type="button"
                  className="social-link contact-button"
                  onClick={() => {
                    copyText(
                      fullPhone,
                      "PHONE"
                    );

                    window.location.href =
                      `tel:${fullPhone}`;
                  }}
                >
                  <div>
                    <small>
                      {copied === "PHONE"
                        ? "COPIED"
                        : "PHONE NUMBER"}
                    </small>

                    <span>
                      {employee.phone_country_code ||
                        "+91"}{" "}
                      {employee.phone}
                    </span>
                  </div>

                  <b>
                    {copied === "PHONE"
                      ? "✓"
                      : "↗"}
                  </b>
                </button>
              )}

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
              <span>
                EMPLOYEE ID
              </span>

              <strong>
                {employee.employee_id}
              </strong>
            </div>

            <div className="info-row">
              <span>
                ROLE
              </span>

              <strong>
                {employee.designation}
              </strong>
            </div>

            <div className="info-row">
              <span>
                DEPARTMENT
              </span>

              <strong>
                {employee.department || "—"}
              </strong>
            </div>

            <div className="info-row">
              <span>
                LOCATION
              </span>

              <strong>
                {employee.location || "—"}
              </strong>
            </div>

            {employee.joined_date && (
              <div className="info-row">
                <span>
                  JOINED
                </span>

                <strong>
                  {employee.joined_date}
                </strong>
              </div>
            )}

          </div>

          {employee.bio && (
            <div
              style={{
                marginTop: "25px",
                lineHeight: 1.7,
              }}
            >
              <p
                className="section-label light-label"
                style={{
                  marginBottom: "10px",
                }}
              >
                ABOUT
              </p>

              <p
                style={{
                  margin: 0,
                  color: "#D8CEC3",
                  fontSize: "14px",
                }}
              >
                {employee.bio}
              </p>
            </div>
          )}

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

      {employee.verified !== false && (
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
                This profile represents a verified
                member of Somya Innovations.
              </p>

            </div>

          </div>

        </section>
      )}


      {/* ================= FOOTER ================= */}

      <footer>

        <div className="footer-logo">
          <img
            src="/somyain.jpeg"
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