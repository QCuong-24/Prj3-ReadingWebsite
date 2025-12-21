import { Link } from "react-router-dom";
import { NovelDTO } from "../types/novel.types";
import coverImage from "../mock/cover_images.png";

export const NovelCard = ({ novel }: { novel: NovelDTO }) => {
  return (
    <Link
      to={`/novel/${novel.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition border border-ocean-blue-100 hover:border-ocean-blue-500 overflow-hidden"
    >
      <img
        src={novel.coverImageUrl || coverImage}
        alt={novel.title}
        className="w-full h-70 object-cover"
        onError={(e) => {
          e.currentTarget.src = coverImage;
        }}
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-deep-space-blue-800 mb-2">
          {novel.title}
        </h2>

        {novel.author && (
          <p className="text-sm text-gray-600 mb-2">By {novel.author}</p>
        )}

        <div className="flex justify-between items-center">
          <span
            className={`px-2 py-1 text-xs rounded bg-turquoise-surf-100 text-turquoise-surf-800`}
          >
            {novel.status}
          </span>
          <div className="text-sm text-gray-500 flex items-center space-x-4">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ocean-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{novel.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="red" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>{novel.followers}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};