import { Coordinator } from "../entities/coordinator"
import { CoordinatorStatusEnum } from "../enums/CoordinatorStatusEnum"
import { CourseNameEnum } from "../enums/CourseNameEnum"

export type ICoordinatorService = {
  findAllCoordinators(): Promise<Partial<Coordinator>[]>
  findCoordinatorByCourse(courseName: CourseNameEnum): Promise<Partial<Coordinator>>
  findCoordinatorStatus(courseName: CourseNameEnum): Promise<Partial<Coordinator>>
  updateCoordinatorStatus(courseName: CourseNameEnum, status: CoordinatorStatusEnum): Promise<Coordinator>
}
