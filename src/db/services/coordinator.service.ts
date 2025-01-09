import { db } from ".."
import { ICoordinatorService } from "../../types/abstracts/coordinator-service.abstract"
import { Coordinator } from "../../types/entities/Coordinator"
import type { CoordinatorStatusEnum } from "../../types/enums/CoordinatorStatusEnum"
import type { CourseNameEnum } from "../../types/enums/CourseNameEnum"
import { SelectCoordinator, coordinators } from "../models/coordinator.model"
import { eq } from "drizzle-orm"

export const coordinatorService: ICoordinatorService = {
  async findAllCoordinators(): Promise<Coordinator[]> {
    const records = await db.select().from(coordinators)

    return records
  },

  async findCoordinatorByCourse(courseName: CourseNameEnum): Promise<Partial<Coordinator>> {
    const records = await db.select().from(coordinators).where(eq(coordinators.courseName, courseName))

    const record: SelectCoordinator = records[0]

    return record
  },

  async findCoordinatorStatus(courseName: CourseNameEnum): Promise<Partial<Coordinator>> {
    const records = await db
      .select({ status: coordinators.status })
      .from(coordinators)
      .where(eq(coordinators.courseName, courseName))

    const record: Partial<SelectCoordinator> = records[0]

    return record
  },

  async updateCoordinatorStatus(courseName: CourseNameEnum, status: CoordinatorStatusEnum): Promise<Coordinator> {
    const records = await db
      .update(coordinators)
      .set({ status: status })
      .where(eq(coordinators.courseName, courseName))
      .returning()

    const record: SelectCoordinator = records[0]

    return record
  },
}
