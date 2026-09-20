"use client";

import { useEffect, useState } from "react";

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
  show_email: boolean;
  show_phone: boolean;
  status: "active" | "inactive";
  social_links: SocialLink[];
};

const STORAGE_KEY = "somya_employees";

export default function AdminDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

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
    show_email: true,
    show_phone: true,
    status: "active",
    social_links: [],
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Load employees from browser storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setEmployees(JSON.parse(saved));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Photo upload
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

  const addSocialLink = () => {
    setSocialLinks((previous) => [
      ...previous,
      {
        platform: "linkedin",
        label: "LinkedIn",
        url: "",
        display_order: previous.length + 1,
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

  const removeSocialLink = (index: number) => {
    setSocialLinks((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

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
      show_email: true,
      show_phone: true,
      status: "active",
      social_links: [],
    });

    setSocialLinks([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEmployee: Employee = {
      ...form,
      social_links: socialLinks,
    };

    const updatedEmployees = [
      ...employees,
      newEmployee,
    ];

    setEmployees(updatedEmployees);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedEmployees)
    );

    resetForm();
    setShowForm(false);

    alert("Employee added successfully!");
  };

  const deleteEmployee = (slug: string) => {
    const updatedEmployees = employees.filter(
      (employee) => employee.slug !== slug
    );

    setEmployees(updatedEmployees);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedEmployees)
    );
  };

  return (
    <main style={styles.page}>

      <header style={styles.header}>
        <div>
          <p style={styles.company}>
            SOMYA INNOVATIONS
          </p>

          <h1 style={styles.title}>
            Admin Dashboard
          </h1>
        </div>

        <button
          style={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          + ADD EMPLOYEE
        </button>
      </header>

      <section style={styles.stats}>

        <div style={styles.statCard}>
          <span>Total Employees</span>
          <strong>{employees.length}</strong>
        </div>

        <div style={styles.statCard}>
          <span>Active Employees</span>
          <strong>
            {
              employees.filter(
                (employee) =>
                  employee.status === "active"
              ).length
            }
          </strong>
        </div>

        <div style={styles.statCard}>
          <span>Inactive Employees</span>
          <strong>
            {
              employees.filter(
                (employee) =>
                  employee.status === "inactive"
              ).length
            }
          </strong>
        </div>

      </section>

      <section style={styles.card}>

        <h2>Employees</h2>

        <p style={styles.subtitle}>
          Manage your company employee profiles
        </p>

        {employees.length === 0 ? (

          <div style={styles.empty}>
            <h3>No employees added yet</h3>

            <p>
              Add your first employee profile.
            </p>

            <button
              style={styles.addButton}
              onClick={() => setShowForm(true)}
            >
              + ADD FIRST EMPLOYEE
            </button>
          </div>

        ) : (

          <div style={styles.employeeList}>

            {employees.map((employee) => (

              <div
                key={employee.slug}
                style={styles.employeeCard}
              >

                {employee.photo_url && (
                  <img
                    src={employee.photo_url}
                    alt={employee.name}
                    style={styles.employeePhoto}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <strong>
                    {employee.name}
                  </strong>

                  <p>
                    {employee.designation}
                  </p>

                  <small>
                    {employee.employee_id}
                  </small>
                </div>

                <span
                  style={{
                    ...styles.status,
                    background:
                      employee.status === "active"
                        ? "#DFF5E5"
                        : "#F5E0E0",
                  }}
                >
                  {employee.status}
                </span>

                <a
                  href={`/team/${employee.slug}`}
                  target="_blank"
                  style={styles.viewButton}
                >
                  VIEW
                </a>

                <button
                  style={styles.deleteButton}
                  onClick={() =>
                    deleteEmployee(employee.slug)
                  }
                >
                  DELETE
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

      {showForm && (

        <div style={styles.overlay}>

          <div style={styles.modal}>

            <div style={styles.modalHeader}>

              <div>
                <h2>Add New Employee</h2>
                <p>Enter employee information</p>
              </div>

              <button
                style={styles.close}
                onClick={() => setShowForm(false)}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <h3 style={styles.formSection}>
                Basic Information
              </h3>

              <div style={styles.formGrid}>

                <input
                  name="employee_id"
                  placeholder="Employee ID"
                  value={form.employee_id}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />

                <input
                  name="name"
                  placeholder="Employee Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />

                <input
                  name="slug"
                  placeholder="Slug (example: rahul-sharma)"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  style={styles.input}
                />

                <input
                  name="designation"
                  placeholder="Designation"
                  value={form.designation}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />

                <input
                  name="department"
                  placeholder="Department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />

                <input
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleChange}
                  style={styles.input}
                />

                <input
                  name="joined_date"
                  type="date"
                  value={form.joined_date}
                  onChange={handleChange}
                  style={styles.input}
                />

              </div>

              {form.photo_url && (
                <img
                  src={form.photo_url}
                  alt="Preview"
                  style={styles.preview}
                />
              )}

              <h3 style={styles.formSection}>
                Professional Bio
              </h3>

              <textarea
                name="bio"
                placeholder="Write a short professional bio..."
                value={form.bio}
                onChange={handleChange}
                rows={5}
                style={styles.textarea}
              />

              <h3 style={styles.formSection}>
                Contact Information
              </h3>

              <div style={styles.contactFields}>

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  style={styles.input}
                />

                <div style={styles.phoneField}>
                  <span style={styles.phonePrefix}>
                    +91
                  </span>

                  <input
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    style={styles.phoneInput}
                  />
                </div>

              </div>

              <h3 style={styles.formSection}>
                Contact Visibility
              </h3>

              <label style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={form.show_email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      show_email: e.target.checked,
                    })
                  }
                />
                Show Email
              </label>

              <label style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={form.show_phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      show_phone: e.target.checked,
                    })
                  }
                />
                Show Phone
              </label>

              <div style={styles.socialHeader}>

                <h3 style={styles.formSection}>
                  Social Links
                </h3>

                <button
                  type="button"
                  style={styles.smallButton}
                  onClick={addSocialLink}
                >
                  + ADD LINK
                </button>

              </div>

              {socialLinks.map(
                (link, index) => (

                  <div
                    key={index}
                    style={styles.socialRow}
                  >

                    <select
                      value={link.platform}
                      onChange={(e) =>
                        updateSocialLink(
                          index,
                          "platform",
                          e.target.value
                        )
                      }
                      style={styles.input}
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
                      value={link.url}
                      onChange={(e) =>
                        updateSocialLink(
                          index,
                          "url",
                          e.target.value
                        )
                      }
                      style={styles.input}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeSocialLink(index)
                      }
                      style={styles.removeButton}
                    >
                      ×
                    </button>

                  </div>
                )
              )}

              <h3 style={styles.formSection}>
                Employee Status
              </h3>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>

              <button
                type="submit"
                style={styles.saveButton}
              >
                SAVE EMPLOYEE
              </button>

            </form>

          </div>

        </div>
      )}

    </main>
  );
}


/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {

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
    gridTemplateColumns: "repeat(3, 1fr)",
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
    border: "1px dashed #C8B9AA",
  },

  employeeList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  employeeCard: {
    padding: "15px",
    border: "1px solid #D8CEC3",
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
    background: "rgba(0,0,0,0.55)",
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
    justifyContent: "space-between",
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
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },

  input: {
    width: "100%",
    padding: "13px",
    border: "1px solid #C8B9AA",
    fontSize: "14px",
    background: "#FFFFFF",
  },

  textarea: {
    width: "100%",
    padding: "13px",
    border: "1px solid #C8B9AA",
    fontSize: "14px",
    resize: "vertical",
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
    border: "1px solid #C8B9AA",
  },

  phonePrefix: {
    paddingLeft: "13px",
    fontSize: "14px",
    color: "#555",
  },

  phoneInput: {
    flex: 1,
    padding: "13px 10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },

  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
    fontSize: "14px",
  },

  socialHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "25px",
  },

  smallButton: {
    background: "#E9E4DE",
    border: "1px solid #B89F7A",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },

  socialRow: {
    display: "grid",
    gridTemplateColumns: "180px 1fr 40px",
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