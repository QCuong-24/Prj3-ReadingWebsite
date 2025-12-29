import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, updateUser } from "../services/admin.api";
import { User } from "../types/user.types";

export const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.userId !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleEdit = async (user: User) => {
    try {
      const res = await updateUser(user.userId, user);
      setUsers((prev) =>
        prev.map((u) => (u.userId === user.userId ? res.data : u))
      );
      setSelectedUser(null);
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to update user");
    }
  };

  const toggleRole = (role: string) => {
    if (!selectedUser) return;
    const hasRole = selectedUser.roles.includes(role);
    const updatedRoles = hasRole
      ? selectedUser.roles.filter((r) => r !== role)
      : [...selectedUser.roles, role];
    setSelectedUser({ ...selectedUser, roles: updatedRoles });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold text-deep-space-blue-800">Admin Panel</h1>

      {/* User List */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Roles</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId}>
              <td className="border p-2">{u.userId}</td>
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.roles.join(", ")}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setIsModalOpen(true);
                  }}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.userId)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedUser && (
        <div
            className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ease-out"
            onClick={() => setIsModalOpen(false)}
        >
            <div
            className="bg-white p-6 rounded shadow-lg w-96 space-y-4"
            onClick={(e) => e.stopPropagation()}
            >
            <h2 className="text-xl font-semibold">Edit User</h2>
            <input
                type="text"
                value={selectedUser.username}
                onChange={(e) =>
                setSelectedUser({ ...selectedUser, username: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Username"
            />
            <input
                type="text"
                value={selectedUser.email}
                onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Email"
            />

            {/* Roles Toggle */}
            <div className="flex gap-2 flex-wrap">
                {["USER", "ADMIN", "MANAGER"].map((role) => (
                <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-3 py-1 rounded ${
                    selectedUser.roles.includes(role)
                        ? "bg-ocean-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                >
                    {role}
                </button>
                ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                Cancel
                </button>
                <button
                onClick={() => handleEdit(selectedUser)}
                className="px-4 py-2 bg-ocean-blue-500 text-white rounded"
                >
                Save
                </button>
            </div>
            </div>
        </div>
        )}

    </div>
  );
};