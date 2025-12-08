import { Link } from "react-router-dom";
import { ChapterDTO } from "../types/novel.types";

interface Props {
  novelId: number;
  chapters: ChapterDTO[];
  currentChapterId: number;
}

export const ChapterSidebar = ({
  novelId,
  chapters,
  currentChapterId,
}: Props) => {
  return (
    <aside className="w-64 bg-white border border-ocean-blue-100 rounded-lg shadow p-4 h-fit sticky top-20">
      <h3 className="text-lg font-semibold text-deep-space-blue-800 mb-3">
        Chapters
      </h3>

      <ul className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
        {chapters.map((c) => (
          <li key={c.id}>
            <Link
              to={`/novel/${novelId}/chapter/${c.id}`}
              className={`block p-2 rounded text-sm ${
                c.id === currentChapterId
                  ? "bg-ocean-blue-100 text-ocean-blue-800 font-medium"
                  : "hover:bg-ocean-blue-50"
              }`}
            >
              Chapter {c.chapterNumber}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};