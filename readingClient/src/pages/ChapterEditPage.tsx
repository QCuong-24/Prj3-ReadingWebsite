import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateChapter } from "../services/manager.api";
import { getChapterById } from "../services/api";

export const ChapterEditPage = () => {
  const { novelId } = useParams();
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState(1);
  const [content, setContent] = useState("");

  useEffect(() => {
    // Fetch existing chapter data to pre-fill the form
    const fetchChapter = async () => {
        try {
            const response = await getChapterById(Number(chapterId));

            setTitle(response.data.title);
            setChapterNumber(response.data.chapterNumber);
            setContent(response.data.content);
        } catch (err) {
            console.error("Failed to fetch chapter:", err);
        }
    };

    fetchChapter();
  }, [chapterId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", {chapterId, novelId, title, chapterNumber, content });
    try {
      await updateChapter(Number(chapterId), {
        id: Number(chapterId),
        novelId: Number(novelId),
        title,
        chapterNumber,
        content
      });

      navigate(`/novel/${novelId}`);
    } catch {
      alert("Failed to edit chapter");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow mt-10 border border-ocean-blue-100">
      <h1 className="text-3xl font-bold text-deep-space-blue-800 mb-6">
        Edit Chapter
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          placeholder="Chapter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          placeholder="Chapter Number"
          value={chapterNumber}
          onChange={(e) => setChapterNumber(Number(e.target.value))}
        />

        <textarea
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          placeholder="Content"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="w-full bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white p-3 rounded">
          Edit Chapter
        </button>
      </form>
    </div>
  );
};