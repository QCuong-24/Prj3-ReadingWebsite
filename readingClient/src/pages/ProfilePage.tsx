import { useAuth } from "../context/AuthContext";
import { Breadcrumb } from "../components/Breadcrumb";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="text-center text-gray-700 mt-10">
        You must be logged in to view this page.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Profile" },
        ]}
      />

      <div className="bg-white p-6 rounded-lg shadow border border-ocean-blue-100 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-deep-space-blue-800 mb-6">
          Your Profile
        </h1>

        <span
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
        >
          ← Back
        </span>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-ocean-blue-300 object-cover shadow"
          />
        </div>

        {/* Info */}
        <div className="space-y-3 text-lg text-gray-700">
          <p>
            <span className="font-semibold">User ID:</span> {user.userId}
          </p>

          <p>
            <span className="font-semibold">Username:</span> {user.username}
          </p>

          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>

          <p>
            <span className="font-semibold">Roles:</span>{" "}
            {user.roles.join(", ")}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={logoutUser}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Logout
          </button>

          <button
            className="flex-1 bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white py-2 rounded"
            onClick={() => alert("Edit Profile coming soon!")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};