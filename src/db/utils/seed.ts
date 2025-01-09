import { db } from ".."
import { courses } from "../models/courses.model"

await db.insert(courses).values([
  {
    course_name: "BSCS",
    coordinator_availability: true,
  },
  {
    course_name: "BSIT",
    coordinator_availability: true,
  },
  {
    course_name: "BSIS",
    coordinator_availability: true,
  },
])

console.log(`Courses seeded successfully.`)
