import { db } from ".."
import { CoordinatorStatusEnum } from "../../types/enums/CoordinatorStatusEnum"
import { coordinators } from "../models/coordinator.model"
import { courses } from "../models/courses.model"
import { students } from "../models/students.model"
import { readFile } from "fs/promises"
import { join } from "path"

async function seedDatabase() {
  try {
    // Read student IDs from txt file
    const studentIdsText = await readFile(join(__dirname, "..", "data", "student-ids.txt"), "utf-8")

    // Split the text file into an array of student IDs
    const studentIds = studentIdsText
      .split("\n")
      .map((id) => id.trim().replace("s", ""))
      .filter((id) => id.length > 0)

    // Validate that we have enough student IDs
    if (studentIds.length < 1500) {
      throw new Error(`Not enough student IDs in file. Found ${studentIds.length}, need 1522`)
    }

    // Begin seeding all tables
    console.log("Starting database seeding...")

    // Seed students table
    const studentData = studentIds.map((id) => ({
      id: id,
    }))

    await db.insert(students).values(studentData)
    console.log("Seeded students table with 1522 records")

    // Seed courses
    await db.insert(courses).values([{ courseName: "BSCS" }, { courseName: "BSIT" }, { courseName: "BSIS" }])
    console.log("Seeded courses table")

    // Seed coordinators
    await db.insert(coordinators).values([
      {
        name: "Doriz Roa",
        courseName: "BSCS",
        status: CoordinatorStatusEnum.AVAILABLE,
        email: "drroa@usc.edu.ph",
      },
      {
        name: "Gran Sabandal",
        courseName: "BSIT",
        status: CoordinatorStatusEnum.AVAILABLE,
        email: "ggsabandal@usc.edu.ph",
      },
      {
        name: "Glenn Pepito",
        courseName: "BSIS",
        status: CoordinatorStatusEnum.AVAILABLE,
        email: "gbpepito@usc.edu.ph",
      },
    ])
    console.log("Seeded coordinators")

    console.log("Database seeding completed successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

seedDatabase().catch(console.error)
