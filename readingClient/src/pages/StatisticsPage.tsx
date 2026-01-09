import { useEffect, useState } from "react";
import {
  getTotalViewsByDay,
  getTotalViewsByMonth,
  getTotalViewsByYear,
  getTotalFollowsByDay,
  getTotalFollowsByMonth,
  getTotalFollowsByYear,
  getTopViewedByDay,
  getTopViewedByMonth,
  getTopViewedByYear,
  getTopFollowedByDay,
  getTopFollowedByMonth,
  getTopFollowedByYear,

} from "../services/statistic.api";
import { StatisticDTO } from "../types/novel.types";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  Bar,
  BarChart
} from "recharts";

export const StatisticsPage = () => {
  const [date, setDate] = useState<string>("2026-01-09");
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(2026);

  const [chartMode, setChartMode] = useState<"day" | "month" | "year">("month");
  const [chartData, setChartData] = useState<{ label: string; views: number; follows: number }[]>([]);

  const [activeTabViews, setActiveTabViews] = useState<"day" | "month" | "year">("day");
  const [activeTabFollows, setActiveTabFollows] = useState<"day" | "month" | "year">("day");

  const [topViews, setTopViews] = useState<StatisticDTO[]>([]);
  const [topFollows, setTopFollows] = useState<StatisticDTO[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch top views
  const fetchTopViews = async () => {
    try {
      let res;
      if (activeTabViews === "day") res = await getTopViewedByDay(date, 10);
      else if (activeTabViews === "month") res = await getTopViewedByMonth(month, year, 10);
      else res = await getTopViewedByYear(year, 10);
      setTopViews(res.data);
    } catch {
      setError("Failed to fetch top views");
    }
  };

  // Fetch top follows
  const fetchTopFollows = async () => {
    try {
      let res;
      if (activeTabFollows === "day") res = await getTopFollowedByDay(date, 10);
      else if (activeTabFollows === "month") res = await getTopFollowedByMonth(month, year, 10);
      else res = await getTopFollowedByYear(year, 10);
      setTopFollows(res.data);
    } catch {
      setError("Failed to fetch top follows");
    }
  };

  // Fetch chart data
  const fetchChartData = async () => {
    setLoading(true);
    try {
      const results: { label: string; views: number; follows: number }[] = [];
      if (chartMode === "month") {
        for (let m = 1; m <= 12; m++) {
          const viewsRes = await getTotalViewsByMonth(m, year);
          const followsRes = await getTotalFollowsByMonth(m, year);
          results.push({ label: `Tháng ${m}`, views: viewsRes.data, follows: followsRes.data });
        }
      } else if (chartMode === "year") {
        for (let y = year - 5; y <= year; y++) {
          const viewsRes = await getTotalViewsByYear(y);
          const followsRes = await getTotalFollowsByYear(y);
          results.push({ label: `${y}`, views: viewsRes.data, follows: followsRes.data });
        }
      } else {
        // giả sử hiển thị 7 ngày gần nhất
        for (let i = 0; i < 7; i++) {
          const d = new Date(date);
          d.setDate(d.getDate() - i);
          const iso = d.toISOString().split("T")[0];
          const viewsRes = await getTotalViewsByDay(iso);
          const followsRes = await getTotalFollowsByDay(iso);
          results.push({ label: iso, views: viewsRes.data, follows: followsRes.data });
        }
      }
      setChartData(results);
    } catch {
      setError("Failed to fetch chart data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopViews();
  }, [activeTabViews, date, month, year]);

  useEffect(() => {
    fetchTopFollows();
  }, [activeTabFollows, date, month, year]);

  useEffect(() => {
    fetchChartData();
  }, [year]);

  useEffect(() => {
    fetchChartData();
  }, [chartMode, date, year]);

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold text-deep-space-blue-800">Statistics Dashboard</h1>

      {/* Filter */}
      <div className="flex gap-4 items-center">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          value={month}
          min={1}
          max={12}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="p-2 border rounded w-20"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="p-2 border rounded w-24"
        />
      </div>

      {/* Selector cho chart mode */}
      <div className="flex gap-2 mb-4">
        {["day", "month", "year"].map((mode) => (
          <button
            key={mode}
            onClick={() => setChartMode(mode as "day" | "month" | "year")}
            className={`px-3 py-1 rounded ${
              chartMode === mode ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={{ message: error }} />}

      {!loading && !error && (
        <>
          <div className="bg-gray-50 p-4 rounded border">
            <h2 className="text-lg font-semibold mb-2">
                Tổng Views & Follows ({chartMode.toUpperCase()})
            </h2>

            {chartMode === "year" ? (
                <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#3182CE" name="Views" />
                    <Bar dataKey="follows" fill="#38A169" name="Follows" />
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#3182CE" name="Views" />
                    <Line type="monotone" dataKey="follows" stroke="#38A169" name="Follows" />
                </LineChart>
                </ResponsiveContainer>
            )}
            </div>

          {/* Bảng Top Viewed + Top Followed */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Top Views */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Top Viewed Novels</h2>
              <div className="flex gap-2 mb-2">
                {["day", "month", "year"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTabViews(tab as "day" | "month" | "year")}
                    className={`px-3 py-1 rounded ${
                      activeTabViews === tab ? "bg-ocean-blue-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Title</th>
                    <th className="border p-2">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {topViews.map((novel) => (
                    <tr key={novel.novelId}>
                      <td className="border p-2">{novel.title}</td>
                      <td className="border p-2">{novel.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Follows */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Top Followed Novels</h2>
              <div className="flex gap-2 mb-2">
                {["day", "month", "year"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTabFollows(tab as "day" | "month" | "year")}
                    className={`px-3 py-1 rounded ${
                      activeTabFollows === tab ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Title</th>
                    <th className="border p-2">Follows</th>
                  </tr>
                </thead>
                <tbody>
                  {topFollows.map((novel) => (
                    <tr key={novel.novelId}>
                      <td className="border p-2">{novel.title}</td>
                      <td className="border p-2">{novel.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};