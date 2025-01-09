import { db } from ".."
import { courses } from "../models/courses.model"

await db.insert(courses).values([
  {
    title: "The Matrix",
    releaseYear: 1999,
  },
  {
    title: "The Matrix Reloaded",
    releaseYear: 2003,
  },
  {
    title: "The Matrix Revolutions",
    releaseYear: 2003,
  },
])

console.log(`Seeding complete.`)
