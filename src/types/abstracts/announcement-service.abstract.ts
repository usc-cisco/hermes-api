import { Announcement } from "../entities/Announcement"

export type IAnnouncementService = {
  addAnnouncement(text: string): Promise<Announcement>
  getAllAnnouncements(): Promise<Announcement[]>
  deleteAnnouncement(id: number): Promise<void>
}
