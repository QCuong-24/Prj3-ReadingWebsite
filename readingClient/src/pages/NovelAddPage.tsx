import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNovel } from "../services/manager.api";

export const NovelAddPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [publicationDate, setPublicationDate] = useState(new Date().toLocaleDateString("en-CA").slice(0, 10));

  //const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createNovel({
        title,
        author,
        description,
        status,
        publicationDate,
        //postUserId: user?.userIdd
        views: 0,
        followers: 0
      });

      navigate("/");
    } catch {
      alert("Failed to add novel");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow mt-10 border border-ocean-blue-100">
      <h1 className="text-3xl font-bold text-deep-space-blue-800 mb-6">
        Add New Novel
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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

        <div>
          <label className="block mb-1 font-medium">Publication Date</label>
          <input
            type="date"
            className="w-full p-3 border rounded"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
          />
        </div>

        <select
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Finished">Finished</option>
        </select>

        <button className="w-full bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white p-3 rounded">
          Add Novel
        </button>
      </form>
    </div>
  );
};