import { db } from ".."
import { CoordinatorStatusEnum } from "../../types/enums/CoordinatorStatusEnum"
import { coordinators } from "../models/coordinator.model"
import { courses } from "../models/courses.model"
import { queueNumbers } from "../models/queue-number.model"
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

    // Seed queue numbers for each course
    const queueData = ["BSCS", "BSIT", "BSIS"].flatMap((courseName) => {
      return Array.from({ length: 5 }, (_, index) => ({
        studentId: `s${index + 1}`,
        courseName,
        queueNumber: index + 1,
      }))
    })

    await db.insert(queueNumbers).values(queueData)
    console.log("Seeded queue numbers")

    // Seed coordinators
    await db.insert(coordinators).values([
      {
        name: "Doriz Roa",
        courseName: "BSCS",
        status: CoordinatorStatusEnum.AVAILABLE,
      },
      {
        name: "Gran Sabandal",
        courseName: "BSIT",
        status: CoordinatorStatusEnum.AVAILABLE,
      },
      {
        name: "Glenn Pepito",
        courseName: "BSIS",
        status: CoordinatorStatusEnum.AVAILABLE,
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
