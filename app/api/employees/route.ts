import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "data",
  "employees.json"
);

async function readEmployees() {
  try {
    const file = await fs.readFile(filePath, "utf8");

    if (!file.trim()) {
      return [];
    }

    return JSON.parse(file);
  } catch {
    return [];
  }
}

async function writeEmployees(employees: unknown[]) {
  await fs.writeFile(
    filePath,
    JSON.stringify(employees, null, 2),
    "utf8"
  );
}

// GET employees
export async function GET(request: NextRequest) {
  const employees = await readEmployees();

  const slug =
    request.nextUrl.searchParams.get("slug");

  // Get one employee
  if (slug) {
    const employee = employees.find(
      (item: { slug: string }) =>
        item.slug === slug
    );

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  }

  // Get all employees
  return NextResponse.json(employees);
}

// ADD employee
export async function POST(
  request: NextRequest
) {
  try {
    const employee = await request.json();

    if (!employee.name || !employee.slug) {
      return NextResponse.json(
        {
          error:
            "Employee name and slug are required.",
        },
        { status: 400 }
      );
    }

    const employees = await readEmployees();

    const alreadyExists = employees.some(
      (item: { slug: string }) =>
        item.slug === employee.slug
    );

    if (alreadyExists) {
      return NextResponse.json(
        {
          error:
            "An employee with this slug already exists.",
        },
        { status: 409 }
      );
    }

    employees.push(employee);

    await writeEmployees(employees);

    return NextResponse.json(
      employee,
      { status: 201 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Could not save employee.",
      },
      { status: 500 }
    );
  }
}

// DELETE employee
export async function DELETE(
  request: NextRequest
) {
  try {
    const slug =
      request.nextUrl.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        {
          error: "Slug is required.",
        },
        { status: 400 }
      );
    }

    const employees = await readEmployees();

    const updatedEmployees =
      employees.filter(
        (item: { slug: string }) =>
          item.slug !== slug
      );

    await writeEmployees(
      updatedEmployees
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Could not delete employee.",
      },
      { status: 500 }
    );
  }
}