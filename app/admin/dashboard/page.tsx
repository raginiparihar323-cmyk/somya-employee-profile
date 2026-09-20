"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [form, setForm] = useState({
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
    status: "active",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Employee Data:", form);
    alert("Employee data saved successfully!");
  };

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h1>Admin Dashboard</h1>
      <p>Add New Employee</p>

      <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
        <input
          name="employee_id"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={handleChange}
        />

        <input
          name="name"
          placeholder="Employee Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="slug"
          placeholder="Slug (example: nistha-jain)"
          value={form.slug}
          onChange={handleChange}
        />

        <input
          name="photo_url"
          placeholder="Photo URL"
          value={form.photo_url}
          onChange={handleChange}
        />

        <input
          name="designation"
          placeholder="Designation"
          value={form.designation}
          onChange={handleChange}
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <input
          name="joined_date"
          type="date"
          value={form.joined_date}
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Employee Bio"
          value={form.bio}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button type="submit">
          ADD EMPLOYEE
        </button>
      </form>
    </main>
  );
}