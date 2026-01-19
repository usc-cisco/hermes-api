import { db } from ".."
import { CoordinatorStatusEnum } from "../../types/enums/CoordinatorStatusEnum"
import { coordinators } from "../models/coordinator.model"
import { courses } from "../models/courses.model"
import { students } from "../models/students.model"
import { readFile } from "fs/promises"
import { join } from "path"

async function seedDatabase() {
  try {
    // Read student data from txt file
    const studentDataText = await readFile(join(__dirname, "..", "data", "student-ids.txt"), "utf-8")

    // Parse student data into objects with id and name
    const studentData = studentDataText
      .split("\n")
      .map((line) => {
        const [name, id] = line.split(",")
        return id
          ? {
              id: id.trim(),
              name: name.trim(),
            }
          : null
      })
      .filter((entry): entry is { id: string; name: string } => entry !== null)

    // Begin seeding all tables
    console.log("Starting database seeding...")

    // Seed students table
    await db.insert(students).values(studentData).onConflictDoNothing()
    console.log(`Seeded students table with ${studentData.length} records`)

    // Seed courses
    await db.insert(courses).values([{ courseName: "BSCS" }, { courseName: "BSIT" }, { courseName: "BSIS" }]).onConflictDoNothing()
    console.log(`Seeded courses table with 3 records`)

    // Seed coordinators
    await db.insert(coordinators).values([
      {
        name: "Archival Sebial",
        courseName: "BSCS",
        status: CoordinatorStatusEnum.AVAILABLE,
        email: "ajsebial@usc.edu.ph",
      },
      {
        name: "Glenn Pepito",
        courseName: "BSIT",
        status: CoordinatorStatusEnum.AVAILABLE,
        email: "gbpepito@usc.edu.ph",
      },
      {
        name: "Christian Maderazo",
        courseName: "BSIS",
        status: CoordinatorStatusEnum.AVAILABLE,
        email: "cvmaderazo@usc.edu.ph",
      },
    ])
    .onConflictDoNothing()
    console.log("Seeded coordinators")

    console.log("Database seeding completed successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

seedDatabase().catch(console.error)
