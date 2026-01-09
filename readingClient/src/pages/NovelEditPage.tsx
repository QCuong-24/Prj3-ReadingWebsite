import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNovelById} from "../services/api";
import { updateNovel } from "../services/manager.api";
import { NovelDTO } from "../types/novel.types";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { handleApiError, ErrorState } from "../utils/handleApiError";

export const NovelEditPage = () => {
  const { novelId } = useParams();
  const navigate = useNavigate();

  const [novel, setNovel] = useState<NovelDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [publicationDate, setPublicationDate] = useState("");

  const fetchNovel = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching novel data for ID:", novelId);
      const res = await getNovelById(Number(novelId));
      console.log("Fetched novel data:", res.data);
      const data = res.data as NovelDTO;

      setNovel(data);

      // Fill form with existing data
      setTitle(data.title);
      setAuthor(data.author || "");
      setDescription(data.description || "");
      setStatus(data.status);
      setPublicationDate(
        data.publicationDate
          ? new Date(data.publicationDate).toISOString().slice(0, 10)
          : ""
      );
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNovel();
  }, [novelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateNovel(Number(novelId), {
        title,
        author,
        description,
        status,
        publicationDate,
        views: novel?.views || 0,
        followers: novel?.followers || 0
      });

      navigate(`/novel/${novelId}`);
    } catch (err) {
      alert("Failed to update novel");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!novel) return <p className="text-gray-700">Novel not found.</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow mt-10 border border-ocean-blue-100">
      <h1 className="text-3xl font-bold text-deep-space-blue-800 mb-6">
        Edit Novel
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <textarea
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          placeholder="Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Finished">Finished</option>
        </select>

        {/* ✅ Publication Date */}
        <div>
          <label className="block mb-1 font-medium">Publication Date</label>
          <input
            type="date"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
          />
        </div>

        <button className="w-full bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white p-3 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};