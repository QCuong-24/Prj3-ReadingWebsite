import { useState, useEffect } from "react";
import { StatisticDTO } from "../types/novel.types";
import { getTopViewedByMonth, getTopViewedByYear, getTopViewedByDay } from "../services/statistic.api";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export const TopViewedTable = () => {
  const [topNovels, setTopNovels] = useState<StatisticDTO[]>([]);
  const [viewMode, setViewMode] = useState<"day" | "month" | "year">("month");

  const fetchTopNovels = async () => {
    try {
      const now = new Date();
      if (viewMode === "day") {
        const today = format(new Date(), "yyyy-MM-dd");
        const res = await getTopViewedByDay(today, 10);

        setTopNovels(res.data);
      } else if (viewMode === "month") {
        const res = await getTopViewedByMonth(
          now.getMonth() + 1,
          now.getFullYear(),
          10
        );
        setTopNovels(res.data);
      } else {
        const res = await getTopViewedByYear(now.getFullYear(), 10);
        setTopNovels(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch top novels", err);
    }
  };

  useEffect(() => {
    fetchTopNovels();
  }, [viewMode]);

  return (
    <div className="lg:col-span-1">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setViewMode("day")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            viewMode === "day"
              ? "bg-ocean-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setViewMode("month")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            viewMode === "month"
              ? "bg-ocean-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setViewMode("year")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            viewMode === "year"
              ? "bg-ocean-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          This Year
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-ocean-blue-500">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-white">Title</th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-white">Views</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {topNovels.map((novel) => (
                <tr
                key={novel.novelId}
                className="hover:bg-gray-50 cursor-pointer"
                >
                <td className="px-4 py-2 text-sm text-gray-700">
                    <Link
                    to={`/novel/${novel.novelId}`}
                    className="text-ocean-blue-600 hover:underline"
                    >
                    {novel.title}
                    </Link>
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 text-right">
                    {novel.count}
                </td>
                </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};