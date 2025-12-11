import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { user, logoutUser } = useAuth();

  const isManager =
    user?.roles.includes("ROLE_MANAGER") || user?.roles.includes("ROLE_ADMIN");

  return (
    <header className="bg-deep-space-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        <Link to="/" className="text-2xl font-bold hover:text-ocean-blue-200">
          Reading Page
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-ocean-blue-200">
            Home
          </Link>

          {isManager && (
            <Link to="/novel/add" className="hover:text-ocean-blue-200">
              Add Novel
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 relative group">
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-ocean-blue-300 object-cover cursor-pointer"
                />

                <div
                  className="
                    absolute left-1/2 -translate-x-1/2 top-12
                    px-3 py-1 rounded-lg text-white text-xs font-medium
                    opacity-0 group-hover:opacity-100
                    translate-y-2 group-hover:translate-y-0
                    transition-all duration-300 ease-out
                    bg-ocean-blue-600/80 backdrop-blur-md shadow-lg
                    border border-ocean-blue-300/40
                    whitespace-nowrap pointer-events-none
                  "
                >
                  View Profile
                </div>

                {/* Glow effect behind tooltip */}
                <div
                  className="
                    absolute left-1/2 -translate-x-1/2 top-12
                    w-20 h-6 rounded-full
                    bg-ocean-blue-400/40 blur-xl
                    opacity-0 group-hover:opacity-70
                    transition-all duration-500 ease-out
                    pointer-events-none
                  "
                ></div>

                <span className="font-medium">{user.username}</span>
              </Link>

              <button
                onClick={logoutUser}
                className="bg-ocean-blue-500 hover:bg-ocean-blue-600 px-3 py-1 rounded text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-ocean-blue-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-ocean-blue-200">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};