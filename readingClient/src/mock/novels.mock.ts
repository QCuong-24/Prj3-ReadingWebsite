import { NovelDTO, ChapterDetailDTO } from "../types/novel.types";
import coverImage from "./cover_images.png";

export const mockNovels: NovelDTO[] = [
  {
    id: 1,
    title: "The Ocean’s Whisper",
    author: "Luna Mare",
    description: "A mysterious tale about a girl who can hear the ocean speak.",
    status: "Ongoing",
    coverImageUrl: coverImage,
    views: 1250,
    followers: 89
  },
  {
    id: 2,
    title: "Stars Beyond Time",
    author: "Astra Nova",
    description: "A sci‑fi journey across galaxies and alternate timelines.",
    status: "Finished",
    coverImageUrl: coverImage,
    views: 2100,
    followers: 156
  },
  {
    id: 3,
    title: "Shadow of the Forgotten",
    author: "Evan Nightfall",
    description: "A dark fantasy about a cursed kingdom and a forgotten prince.",
    status: "Ongoing",
    coverImageUrl: coverImage,
    views: 890,
    followers: 67
  }
];

export const mockChapters: ChapterDetailDTO[] = [
  {
    id: 101,
    novelId: 1,
    chapterNumber: 1,
    title: "The Call of the Waves",
    content:
      "The waves whispered softly as the sun dipped below the horizon. Aria stood alone on the shore, feeling the pull of something ancient beneath the tide...",
    updatedAt: "2025-01-01T10:00:00Z"
  },
  {
    id: 102,
    novelId: 1,
    chapterNumber: 2,
    title: "Secrets Beneath the Tide",
    content:
      "That night, the ocean spoke again. Louder. Clearer. Aria followed the voice into the dark waters, unaware of the truth waiting beneath the surface...",
    updatedAt: "2025-01-02T10:00:00Z"
  },
  {
    id: 201,
    novelId: 2,
    chapterNumber: 1,
    title: "A Light in the Void",
    content:
      "Captain Lyra stared into the endless void of space. A faint glimmer appeared—impossible, yet undeniably real. Something was calling her across the stars...",
    updatedAt: "2025-01-05T10:00:00Z"
  },
  {
    id: 301,
    novelId: 3,
    chapterNumber: 1,
    title: "The Forgotten Throne",
    content:
      "Dust covered the ancient throne room. Prince Kael stepped forward, memories flickering like dying embers. The kingdom had forgotten him—but he had returned...",
    updatedAt: "2025-01-10T10:00:00Z"
  }
];