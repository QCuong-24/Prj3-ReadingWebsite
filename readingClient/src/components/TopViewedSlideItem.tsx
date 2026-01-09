import { StatisticDTO } from "../types/novel.types";
import coverImage from "../mock/cover_images.png";
import { Link } from "react-router-dom";

interface TopViewedSlideItemProps {
  novel: StatisticDTO;
}

export const TopViewedSlideItem = ({ novel }: TopViewedSlideItemProps) => {
  return (
    <Link to={`/novel/${novel.novelId}`} className="block h-full">
      <div className="flex flex-col h-72 border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white">
        <img
          src={coverImage}
          alt={novel.title}
          className="w-full h-40 object-cover"
        />
        <div className="p-2 text-center font-semibold line-clamp-2 flex-grow">
          {novel.title}
        </div>
        <div className="text-sm text-gray-500 text-center mb-2">
          {novel.count} views
        </div>
      </div>
    </Link>
  );
};