import { Link } from "react-router-dom";
import { NovelDTO } from "../types/novel.types";

export const NovelCard = ({ novel }: { novel: NovelDTO }) => {
  return (
    <Link
      to={`/novel/${novel.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition border border-ocean-blue-100 hover:border-ocean-blue-500"
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold text-deep-space-blue-800 mb-2">
          {novel.title}
        </h2>

        {novel.author && (
          <p className="text-sm text-gray-600 mb-2">By {novel.author}</p>
        )}

        <span
          className={`px-2 py-1 text-xs rounded bg-turquoise-surf-100 text-turquoise-surf-800`}
        >
          {novel.status}
        </span>
      </div>
    </Link>
  );
};