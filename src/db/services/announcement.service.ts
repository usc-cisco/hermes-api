import { db } from ".."
import { IAnnouncementService } from "../../types/abstracts/announcement-service.abstract"
import { Announcement } from "../../types/entities/Announcement"
import { InsertAnnouncement, SelectAnnouncement, announcements } from "../models/announcement.model"
import { desc } from "drizzle-orm"

export const announcementService: IAnnouncementService = {
  async addAnnouncement(text: string): Promise<Announcement> {
    const data: InsertAnnouncement = {
      text,
    }

    const [newAnnouncement] = await db.insert(announcements).values(data).returning()

    // Map createdAt to date
    const announcement: Announcement = {
      id: newAnnouncement.id,
      text: newAnnouncement.text,
      date: newAnnouncement.createdAt,
    }

    return announcement
  },

  async getAllAnnouncements(): Promise<Announcement[]> {
    const records: SelectAnnouncement[] = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt))

    // Map createdAt to date
    return records.map((record) => ({
      id: record.id,
      text: record.text,
      date: record.createdAt,
    }))
  },
}
