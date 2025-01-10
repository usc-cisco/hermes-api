import { db } from ".."
import { CoordinatorStatusEnum } from "../../types/enums/CoordinatorStatusEnum"
import { coordinators } from "../models/coordinator.model"
import { courses } from "../models/courses.model"
import { queueNumbers } from "../models/queue-number.model"

// seed courses
await db.insert(courses).values([{ courseName: "BSCS" }, { courseName: "BSIT" }, { courseName: "BSIS" }])

// Seed queue numbers for each course
const queueData = ["BSCS", "BSIT", "BSIS"].flatMap((courseName) => {
  return Array.from({ length: 5 }, (_, index) => ({
    courseName,
    queueNumber: index + 1,
  }))
})

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

await db.insert(queueNumbers).values(queueData)

console.log(`Seeding successful.`)
