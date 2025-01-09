import { CoordinatorStatusEnum } from "../../enums/CoordinatorStatusEnum"
import { t } from "elysia"

export const StatusUnion = t.Union([
  t.Literal(CoordinatorStatusEnum.AVAILABLE),
  t.Literal(CoordinatorStatusEnum.UNAVAILABLE),
  t.Literal(CoordinatorStatusEnum.AWAY),
])
