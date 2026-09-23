"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

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
  verified: boolean;
  social_links: SocialLink[];
};

export default function AdminDashboard() {
  useEffect(() => {
    document.title = "Somya Innovations | Admin Dashboard";
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [qrEmployee, setQrEmployee] = useState<Employee | null>(null);

  const [form, setForm] = useState<Employee>({
    employee_id: "",
    name: "",
    slug: "",
    photo_url: "",
    designation: "",
    department: "",
    location: "",
    joined_date: "",
    bio: "",
    email: "",
    phone: "",
    phone_country_code: "+91",
    show_email: true,
    show_phone: true,
    status: "active",
    verified: true,
    social_links: [],
  });

  const [socialLinks, setSocialLinks] =
    useState<SocialLink[]>([]);

  /* ================= LOAD EMPLOYEES ================= */

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await fetch(
          "/api/employees",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load employees"
          );
        }

        const data = await response.json();

        const normalizedEmployees = data.map(
          (employee: Employee) => ({
            ...employee,
            verified: employee.verified !== false,
          })
        );

        setEmployees(normalizedEmployees);
      } catch (error) {
        console.error(
          "Failed to load employees:",
          error
        );
      }
    };

    loadEmployees();
  }, []);

  /* ================= FORM CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ================= PHOTO ================= */

  const handlePhoto = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        photo_url: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  };

  /* ================= SOCIAL LINKS ================= */

  const addSocialLink = () => {
    setSocialLinks((previous) => [
      ...previous,
      {
        platform: "linkedin",
        label: "LinkedIn",
        url: "",
        display_order:
          previous.length + 1,
      },
    ]);
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    setSocialLinks((previous) =>
      previous.map((link, i) =>
        i === index
          ? {
              ...link,
              [field]:
                field === "display_order"
                  ? Number(value)
                  : value,
            }
          : link
      )
    );
  };

  const removeSocialLink = (
    index: number
  ) => {
    setSocialLinks((previous) =>
      previous.filter(
        (_, i) => i !== index
      )
    );
  };

  /* ================= RESET FORM ================= */

  const resetForm = () => {
    setForm({
      employee_id: "",
      name: "",
      slug: "",
      photo_url: "",
      designation: "",
      department: "",
      location: "",
      joined_date: "",
      bio: "",
      email: "",
      phone: "",
      phone_country_code: "+91",
      show_email: true,
      show_phone: true,
      status: "active",
      verified: true,
      social_links: [],
    });

    setSocialLinks([]);
    setEditingSlug(null);
  };

  /* ================= EDIT EMPLOYEE ================= */

  const editEmployee = (employee: Employee) => {
    setForm({
      ...employee,
      verified: employee.verified !== false,
    });
    setSocialLinks(employee.social_links || []);
    setEditingSlug(employee.slug);
    setShowForm(true);
  };

  /* ================= SAVE EMPLOYEE ================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const cleanSlug = form.slug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (!form.name.trim()) {
      alert("Please enter employee name.");
      return;
    }

    if (!cleanSlug) {
      alert(
        "Please enter a slug, example: ragini-sharma"
      );
      return;
    }

    const employeeData: Employee = {
      ...form,
      name: form.name.trim(),
      slug: cleanSlug,
      social_links: socialLinks,
    };

    try {
      /* ================= EDIT ================= */

      if (editingSlug) {
        const response = await fetch(
          "/api/employees",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...employeeData,
              original_slug: editingSlug,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          alert(
            result.error ||
              "Could not update employee."
          );
          return;
        }

        setEmployees((previous) =>
          previous.map((employee) =>
            employee.slug === editingSlug
              ? result
              : employee
          )
        );

        resetForm();
        setShowForm(false);

        alert("Employee updated successfully.");
        return;
      }

      /* ================= ADD ================= */

      const response = await fetch(
        "/api/employees",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Could not save employee."
        );
        return;
      }

      const updatedEmployees = [
        ...employees,
        result,
      ];

      setEmployees(updatedEmployees);
      resetForm();
      setShowForm(false);
      setQrEmployee(result);

    } catch (error) {
      console.error(error);

      alert(
        "Could not connect to employee server."
      );
    }
  };

  /* ================= DELETE ================= */

  const deleteEmployee = async (
    slug: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this employee?"
      );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `/api/employees?slug=${encodeURIComponent(
          slug
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Could not delete employee"
        );
      }

      const updatedEmployees =
        employees.filter(
          (employee) =>
            employee.slug !== slug
        );

      setEmployees(
        updatedEmployees
      );

      if (
        qrEmployee?.slug === slug
      ) {
        setQrEmployee(null);
      }

    } catch (error) {
      console.error(error);

      alert(
        "Could not delete employee."
      );
    }
  };

  /* ================= PRINT QR ================= */

  const printQR = () => {
    window.print();
  };

  /* ================= DOWNLOAD QR ================= */

  const downloadQR = () => {
    const svg = document.getElementById("employee-qr");

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${qrEmployee?.name || "employee"}-QR.svg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <main className="admin-page" style={styles.page}>

      {/* ================= HEADER ================= */}

      <header className="admin-header" style={styles.header}>

        <div>
          <p style={styles.company}>
            SOMYA INNOVATIONS
          </p>

          <h1 style={styles.title}>
            Admin Dashboard
          </h1>
        </div>

        <button
          className="admin-add-button"
          style={styles.addButton}
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + ADD EMPLOYEE
        </button>

      </header>


      {/* ================= STATS ================= */}

      <section className="admin-stats" style={styles.stats}>

        <div style={styles.statCard}>
          <span>
            Total Employees
          </span>

          <strong>
            {employees.length}
          </strong>
        </div>

        <div style={styles.statCard}>
          <span>
            Active Employees
          </span>

          <strong>
            {
              employees.filter(
                (employee) =>
                  employee.status ===
                  "active"
              ).length
            }
          </strong>
        </div>

        <div style={styles.statCard}>
          <span>
            Inactive Employees
          </span>

          <strong>
            {
              employees.filter(
                (employee) =>
                  employee.status ===
                  "inactive"
              ).length
            }
          </strong>
        </div>

      </section>


      {/* ================= EMPLOYEES ================= */}

      <section style={styles.card}>

        <h2>Employees</h2>

        <p style={styles.subtitle}>
          Manage your company employee profiles
        </p>

        {employees.length === 0 ? (

          <div style={styles.empty}>

            <h3>
              No employees added yet
            </h3>

            <p>
              Add your first employee profile.
            </p>

            <button
              style={styles.addButton}
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              + ADD FIRST EMPLOYEE
            </button>

          </div>

        ) : (

          <div style={styles.employeeList}>

            {employees.map(
              (employee) => (

                <div
                  className="admin-employee-card"
                  key={employee.slug}
                  style={
                    styles.employeeCard
                  }
                >

                  {employee.photo_url && (
                    <img
                      src={
                        employee.photo_url
                      }
                      alt={
                        employee.name
                      }
                      style={
                        styles.employeePhoto
                      }
                    />
                  )}

                  <div
                    style={{
                      flex: 1,
                    }}
                  >

                    <strong>
                      {employee.name}
                    </strong>

                    <p>
                      {
                        employee.designation
                      }
                    </p>

                    <small>
                      {
                        employee.employee_id
                      }
                    </small>

                  </div>


                  <span
                    style={{
                      ...styles.status,
                      background:
                        employee.status ===
                        "active"
                          ? "#DFF5E5"
                          : "#F5E0E0",
                    }}
                  >
                    {
                      employee.status
                    }
                  </span>


                  <div className="admin-employee-actions">

                    {/* VIEW */}
                    <a
                      href={`/team/${employee.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.viewButton}
                    >
                      VIEW
                    </a>

                    {/* EDIT */}
                    <button
                      style={styles.editButton}
                      onClick={() => editEmployee(employee)}
                    >
                      EDIT
                    </button>

                    {/* QR */}
                    <button
                      style={styles.qrButton}
                      onClick={() => setQrEmployee(employee)}
                    >
                      QR
                    </button>

                    {/* DELETE */}
                    <button
                      style={styles.deleteButton}
                      onClick={() => deleteEmployee(employee.slug)}
                    >
                      DELETE
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* ================= ADD EMPLOYEE MODAL ================= */}

      {showForm && (

        <div style={styles.overlay}>

          <div className="admin-modal" style={styles.modal}>

            <div
              style={
                styles.modalHeader
              }
            >

              <div>

                <h2>
                  {editingSlug
                    ? "Edit Employee"
                    : "Add New Employee"}
                </h2>

                <p>
                  {editingSlug
                    ? "Update employee information"
                    : "Enter employee information"}
                </p>

              </div>

              <button
                style={styles.close}
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* BASIC INFORMATION */}

              <h3
                style={
                  styles.formSection
                }
              >
                Basic Information
              </h3>


              <div
                style={
                  styles.formGrid
                }
              >

                <input
                  name="employee_id"
                  placeholder="Employee ID"
                  value={
                    form.employee_id
                  }
                  onChange={
                    handleChange
                  }
                  required
                  style={
                    styles.input
                  }
                />


                <input
                  name="name"
                  placeholder="Employee Name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                  style={
                    styles.input
                  }
                />


                <input
                  name="slug"
                  placeholder="Slug (example: ragini-sharma)"
                  value={
                    form.slug
                  }
                  onChange={
                    handleChange
                  }
                  required
                  style={
                    styles.input
                  }
                />


                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handlePhoto
                  }
                  style={
                    styles.input
                  }
                />


                <input
                  name="designation"
                  placeholder="Designation"
                  value={
                    form.designation
                  }
                  onChange={
                    handleChange
                  }
                  required
                  style={
                    styles.input
                  }
                />


                <input
                  name="department"
                  placeholder="Department"
                  value={
                    form.department
                  }
                  onChange={
                    handleChange
                  }
                  
                  style={
                    styles.input
                  }
                />


                <input
                  name="location"
                  placeholder="Location"
                  value={
                    form.location
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    styles.input
                  }
                />


                <input
                  name="joined_date"
                  type="date"
                  value={
                    form.joined_date
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    styles.input
                  }
                />

              </div>


              {/* PHOTO PREVIEW */}

              {form.photo_url && (
                <img
                  src={
                    form.photo_url
                  }
                  alt="Preview"
                  style={
                    styles.preview
                  }
                />
              )}


              {/* BIO */}

              <h3
                style={
                  styles.formSection
                }
              >
                Professional Bio
              </h3>


              <textarea
                name="bio"
                placeholder="Write a short professional bio..."
                value={
                  form.bio
                }
                onChange={
                  handleChange
                }
                rows={5}
                style={
                  styles.textarea
                }
              />


              {/* CONTACT */}

              <h3
                style={
                  styles.formSection
                }
              >
                Contact Information
              </h3>


              <div
                style={
                  styles.contactFields
                }
              >

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    styles.input
                  }
                />


                {/* CHANGEABLE COUNTRY CODE */}

                <div
                  style={
                    styles.phoneField
                  }
                >

                  <select
                    name="phone_country_code"
                    value={
                      form.phone_country_code
                    }
                    onChange={
                      handleChange
                    }
                    style={
                      styles.countryCode
                    }
                  >

                    <option value="+91">
                      🇮🇳 +91 India
                    </option>

                    <option value="+1">
                      🇺🇸 +1 USA / Canada
                    </option>

                    <option value="+44">
                      🇬🇧 +44 UK
                    </option>

                    <option value="+971">
                      🇦🇪 +971 UAE
                    </option>

                    <option value="+81">
                      🇯🇵 +81 Japan
                    </option>

                    <option value="+82">
                      🇰🇷 +82 South Korea
                    </option>

                    <option value="+49">
                      🇩🇪 +49 Germany
                    </option>

                    <option value="+33">
                      🇫🇷 +33 France
                    </option>

                    <option value="+61">
                      🇦🇺 +61 Australia
                    </option>

                    <option value="+65">
                      🇸🇬 +65 Singapore
                    </option>

                    <option value="+86">
                      🇨🇳 +86 China
                    </option>

                    <option value="+7">
                      🇷🇺 +7 Russia
                    </option>

                    <option value="+39">
                      🇮🇹 +39 Italy
                    </option>

                    <option value="+34">
                      🇪🇸 +34 Spain
                    </option>

                    <option value="+31">
                      🇳🇱 +31 Netherlands
                    </option>

                    <option value="+41">
                      🇨🇭 +41 Switzerland
                    </option>

                  </select>


                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    style={
                      styles.phoneInput
                    }
                  />

                </div>

              </div>


              {/* VISIBILITY */}

              <h3
                style={
                  styles.formSection
                }
              >
                Contact Visibility
              </h3>


              <label
                style={
                  styles.checkbox
                }
              >

                <input
                  type="checkbox"
                  checked={
                    form.show_email
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      show_email:
                        e.target
                          .checked,
                    })
                  }
                />

                Show Email

              </label>


              <label
                style={
                  styles.checkbox
                }
              >

                <input
                  type="checkbox"
                  checked={
                    form.show_phone
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      show_phone:
                        e.target
                          .checked,
                    })
                  }
                />

                Show Phone

              </label>


              {/* SOCIAL LINKS */}

              <div
                style={
                  styles.socialHeader
                }
              >

                <h3
                  style={
                    styles.formSection
                  }
                >
                  Social Links
                </h3>

                <button
                  type="button"
                  style={
                    styles.smallButton
                  }
                  onClick={
                    addSocialLink
                  }
                >
                  + ADD LINK
                </button>

              </div>


              {socialLinks.map(
                (link, index) => (

                  <div
                    className="admin-social-row"
                    key={index}
                    style={
                      styles.socialRow
                    }
                  >

                    <select
                      value={
                        link.platform
                      }
                      onChange={(e) =>
                        updateSocialLink(
                          index,
                          "platform",
                          e.target.value
                        )
                      }
                      style={
                        styles.input
                      }
                    >

                      <option value="linkedin">
                        LinkedIn
                      </option>

                      <option value="instagram">
                        Instagram
                      </option>

                      <option value="github">
                        GitHub
                      </option>

                      <option value="twitter">
                        X / Twitter
                      </option>

                      <option value="portfolio">
                        Portfolio
                      </option>

                      <option value="website">
                        Website
                      </option>

                      <option value="youtube">
                        YouTube
                      </option>

                      <option value="dribbble">
                        Dribbble
                      </option>

                      <option value="behance">
                        Behance
                      </option>

                      <option value="custom">
                        Custom Link
                      </option>

                    </select>


                    <input
                      placeholder="URL"
                      value={
                        link.url
                      }
                      onChange={(e) =>
                        updateSocialLink(
                          index,
                          "url",
                          e.target.value
                        )
                      }
                      style={
                        styles.input
                      }
                    />


                    <button
                      type="button"
                      onClick={() =>
                        removeSocialLink(
                          index
                        )
                      }
                      style={
                        styles.removeButton
                      }
                    >
                      ×
                    </button>

                  </div>

                )
              )}


              {/* VERIFIED EMPLOYEE */}

              <h3
                style={
                  styles.formSection
                }
              >
                Employee Verification
              </h3>

              <label
                style={styles.checkboxRow}
              >
                <input
                  type="checkbox"
                  checked={form.verified !== false}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      verified: e.target.checked,
                    }))
                  }
                />

                <span>
                  Verified Employee
                </span>
              </label>

              <p
                style={styles.helperText}
              >
                If enabled, the Verified Employee section will appear on the employee profile.
              </p>


              {/* STATUS */}

              <h3
                style={
                  styles.formSection
                }
              >
                Employee Status
              </h3>


              <select
                name="status"
                value={
                  form.status
                }
                onChange={
                  handleChange
                }
                style={
                  styles.input
                }
              >

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

              </select>


              {/* SAVE */}

              <button
                type="submit"
                style={
                  styles.saveButton
                }
              >
                {editingSlug
                  ? "UPDATE EMPLOYEE"
                  : "SAVE EMPLOYEE"}
              </button>

              {editingSlug && (
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  CANCEL
                </button>
              )}

            </form>

          </div>

        </div>

      )}


      {/* ================= QR MODAL ================= */}

      {qrEmployee && (

        <div
          style={
            styles.overlay
          }
        >

          <div
            style={
              styles.qrModal
            }
          >

            <button
              style={
                styles.close
              }
              onClick={() =>
                setQrEmployee(
                  null
                )
              }
            >
              ×
            </button>


            <h2>
              {qrEmployee.name}
            </h2>


            <p
              style={
                styles.qrSubtitle
              }
            >
              Scan this QR code to view
              employee profile
            </p>


            <div
              style={
                styles.qrBox
              }
            >

              <QRCodeSVG
                id="employee-qr"
                value={`${window.location.origin}/team/${qrEmployee.slug}`}
                size={220}
                level="H"
                includeMargin={true}
              />

            </div>


            <p
              style={
                styles.qrUrl
              }
            >
              {window.location.origin}/team/
              {qrEmployee.slug}
            </p>


            <button
              style={
                styles.saveButton
              }
              onClick={
                downloadQR
              }
            >
              DOWNLOAD QR
            </button>

            <button
              style={
                styles.cancelButton
              }
              onClick={
                printQR
              }
            >
              PRINT QR
            </button>

          </div>

        </div>

      )}


        <style>{`
          .admin-page {
            width: 100%;
            min-height: 100vh;
            overflow-x: hidden;
          }

          .admin-header,
          .admin-stats,
          .admin-card {
            width: 100%;
          }

          .admin-employee-card {
            min-width: 0;
          }

          .admin-employee-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
          }

          .admin-modal {
            box-sizing: border-box;
          }

          .admin-form-grid {
            min-width: 0;
          }

          .admin-contact-fields {
            min-width: 0;
          }

          .admin-phone-field {
            min-width: 0;
          }

          .admin-social-row {
            min-width: 0;
          }

          .admin-social-row > * {
            min-width: 0;
          }

          .admin-qr-modal {
            box-sizing: border-box;
          }

          @media (max-width: 800px) {
            .admin-page {
              padding: 24px !important;
            }

            .admin-header {
              align-items: flex-start !important;
              gap: 20px !important;
            }

            .admin-header h1 {
              font-size: 32px !important;
              line-height: 1.1 !important;
            }

            .admin-stats {
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            }

            .admin-card {
              padding: 22px !important;
            }

            .admin-employee-card {
              flex-wrap: wrap !important;
            }

            .admin-employee-actions {
              width: 100%;
              display: grid;
              grid-template-columns: repeat(4, minmax(0, 1fr));
              margin-top: 4px;
            }

            .admin-employee-actions a,
            .admin-employee-actions button {
              width: 100% !important;
              min-width: 0 !important;
              text-align: center !important;
            }

            .admin-modal {
              max-width: 100% !important;
              padding: 25px !important;
            }

            .admin-form-grid {
              grid-template-columns: 1fr !important;
            }

            .admin-social-row {
              grid-template-columns: 150px minmax(0, 1fr) 40px !important;
            }
          }

          @media (max-width: 560px) {
            .admin-page {
              padding: 16px !important;
            }

            .admin-header {
              flex-direction: column !important;
              align-items: stretch !important;
              margin-bottom: 24px !important;
            }

            .admin-header h1 {
              font-size: 28px !important;
            }

            .admin-header .admin-add-button {
              width: 100%;
            }

            .admin-stats {
              grid-template-columns: 1fr !important;
              gap: 10px !important;
            }

            .admin-stats > div {
              padding: 17px !important;
            }

            .admin-card {
              padding: 16px !important;
            }

            .admin-card h2 {
              font-size: 22px;
            }

            .admin-employee-card {
              display: grid !important;
              grid-template-columns: 58px minmax(0, 1fr) auto;
              align-items: center !important;
              gap: 10px !important;
            }

            .admin-employee-card > img {
              grid-column: 1;
              grid-row: 1;
            }

            .admin-employee-card > div:not(.admin-employee-actions) {
              grid-column: 2;
              grid-row: 1;
              min-width: 0;
            }

            .admin-employee-card > span {
              grid-column: 3;
              grid-row: 1;
              align-self: start;
            }

            .admin-employee-actions {
              grid-column: 1 / -1;
              grid-row: 2;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              width: 100%;
            }

            .admin-employee-actions a,
            .admin-employee-actions button {
              padding: 10px 8px !important;
              font-size: 11px !important;
            }

            .admin-modal {
              width: 100% !important;
              max-height: 94vh !important;
              padding: 18px !important;
            }

            .admin-modal h2 {
              font-size: 23px;
            }

            .admin-social-header {
              gap: 10px;
              align-items: flex-start !important;
            }

            .admin-social-row {
              grid-template-columns: 1fr !important;
              gap: 8px !important;
            }

            .admin-social-row button {
              min-height: 42px;
            }

            .admin-phone-field {
              display: flex !important;
              flex-direction: column !important;
              align-items: stretch !important;
            }

            .admin-phone-field select {
              width: 100% !important;
              min-width: 0 !important;
              border-right: none !important;
              border-bottom: 1px solid #C8B9AA !important;
              height: 46px !important;
            }

            .admin-phone-field input {
              width: 100% !important;
              min-width: 0 !important;
            }

            .admin-qr-modal {
              width: 100% !important;
              max-width: 360px !important;
              padding: 22px !important;
            }

            .admin-qr-modal svg {
              width: min(220px, 70vw) !important;
              height: auto !important;
            }
          }

          @media (max-width: 380px) {
            .admin-page {
              padding: 12px !important;
            }

            .admin-header h1 {
              font-size: 25px !important;
            }

            .admin-card {
              padding: 13px !important;
            }

            .admin-employee-card {
              padding: 12px !important;
            }

            .admin-employee-actions {
              grid-template-columns: 1fr 1fr !important;
            }

            .admin-modal {
              padding: 14px !important;
            }
          }
        `}</style>

    </main>
  );
}


/* ================= STYLES ================= */

const styles: Record<
  string,
  React.CSSProperties
> = {

  page: {
    minHeight: "100vh",
    background: "#E9E4DE",
    padding: "40px",
    color: "#1A1A1A",
  },

  header: {
    maxWidth: "1200px",
    margin: "0 auto 35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  company: {
    fontSize: "11px",
    letterSpacing: "3px",
    fontWeight: 700,
    color: "#8B7355",
    marginBottom: "8px",
  },

  title: {
    fontSize: "38px",
    margin: 0,
    fontFamily: "Georgia, serif",
  },

  addButton: {
    background: "#1A1A1A",
    color: "#FFFFFF",
    border: "none",
    padding: "14px 22px",
    fontWeight: 700,
    letterSpacing: "1px",
    cursor: "pointer",
  },

  stats: {
    maxWidth: "1200px",
    margin: "0 auto 30px",
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "18px",
  },

  statCard: {
    background: "#FFFFFF",
    padding: "25px",
    border: "1px solid #D8CEC3",
    display: "flex",
    justifyContent: "space-between",
  },

  card: {
    maxWidth: "1200px",
    margin: "0 auto",
    background: "#FFFFFF",
    padding: "30px",
  },

  subtitle: {
    marginTop: "5px",
    marginBottom: "25px",
    color: "#777",
  },

  empty: {
    textAlign: "center",
    padding: "60px 20px",
    border:
      "1px dashed #C8B9AA",
  },

  employeeList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  employeeCard: {
    padding: "15px",
    border:
      "1px solid #D8CEC3",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  employeePhoto: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  status: {
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
  },

  viewButton: {
    padding: "8px 12px",
    background: "#E9E4DE",
    color: "#1A1A1A",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
  },

  editButton: {
    padding: "8px 12px",
    background: "#E8DDD1",
    color: "#1A1A1A",
    border: "1px solid #B89F7A",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },

  qrButton: {
    padding: "8px 12px",
    background: "#B89F7A",
    color: "#FFFFFF",
    border: "none",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },

  deleteButton: {
    padding: "8px 12px",
    background: "#1A1A1A",
    color: "#FFFFFF",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 100,
  },

  modal: {
    background: "#FFFFFF",
    width: "100%",
    maxWidth: "850px",
    padding: "35px",
    maxHeight: "90vh",
    overflowY: "auto",
  },

  modalHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: "25px",
  },

  close: {
    border: "none",
    background: "none",
    fontSize: "30px",
    cursor: "pointer",
  },

  formSection: {
    marginTop: "25px",
    marginBottom: "12px",
    fontSize: "15px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "15px",
  },

  input: {
    width: "100%",
    padding: "13px",
    border:
      "1px solid #C8B9AA",
    fontSize: "14px",
    background: "#FFFFFF",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    padding: "13px",
    border:
      "1px solid #C8B9AA",
    fontSize: "14px",
    resize: "vertical",
    boxSizing: "border-box",
  },

  preview: {
    width: "100px",
    height: "120px",
    objectFit: "cover",
    marginTop: "15px",
    borderRadius: "8px",
  },

  contactFields: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  phoneField: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    border:
      "1px solid #C8B9AA",
    boxSizing: "border-box",
  },

  countryCode: {
    height: "48px",
    padding: "0 10px",
    border: "none",
    borderRight:
      "1px solid #C8B9AA",
    outline: "none",
    background: "#FFFFFF",
    fontSize: "14px",
    minWidth: "155px",
  },

  phoneInput: {
    flex: 1,
    padding:
      "13px 10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    minWidth: 0,
  },

  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
    fontSize: "14px",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
    fontSize: "14px",
    cursor: "pointer",
  },

  helperText: {
    marginTop: "8px",
    marginBottom: "0",
    fontSize: "12px",
    color: "#76695F",
    lineHeight: 1.5,
  },

  socialHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginTop: "25px",
  },

  smallButton: {
    background: "#E9E4DE",
    border:
      "1px solid #B89F7A",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },

  socialRow: {
    display: "grid",
    gridTemplateColumns:
      "180px 1fr 40px",
    gap: "10px",
    marginBottom: "10px",
  },

  removeButton: {
    background: "#1A1A1A",
    color: "#FFFFFF",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },

  qrModal: {
    background: "#FFFFFF",
    width: "100%",
    maxWidth: "420px",
    padding: "35px",
    textAlign: "center",
    position: "relative",
  },

  qrSubtitle: {
    color: "#777",
    fontSize: "14px",
    marginBottom: "25px",
  },

  qrBox: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    background: "#FFFFFF",
  },

  qrUrl: {
    fontSize: "11px",
    color: "#777",
    wordBreak: "break-all",
    marginTop: "15px",
  },

  cancelButton: {
    width: "100%",
    marginTop: "10px",
    padding: "16px",
    background: "#E9E4DE",
    color: "#1A1A1A",
    border: "1px solid #C8B9AA",
    fontWeight: 700,
    letterSpacing: "1px",
    cursor: "pointer",
  },

  saveButton: {
    width: "100%",
    marginTop: "30px",
    padding: "16px",
    background: "#1A1A1A",
    color: "#FFFFFF",
    border: "none",
    fontWeight: 700,
    letterSpacing: "1px",
    cursor: "pointer",
  },
};