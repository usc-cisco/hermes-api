import { db } from ".."
import { courses } from "../models/courses.model"
import { queueNumbers } from "../models/queue-number.model"

// seed courses
const coursesResult = await db
  .insert(courses)
  .values([
    {
      courseName: "BSCS",
    },
    {
      courseName: "BSIT",
    },
    {
      courseName: "BSIS",
    },
  ])
  .returning({ id: courses.id })

// Seed queue numbers for each course
const queueData = coursesResult.flatMap((course) => {
  return Array.from({ length: 5 }, (_, index) => ({
    studentId: parseInt(`${course.id}${index + 1}`), // Creates unique placeholder student ID (11, 12, 13, etc)
    courseId: course.id,
    queueNumber: index + 1,
  }))
})

await db.insert(queueNumbers).values(queueData)

console.log(`Seeding successful.`)
