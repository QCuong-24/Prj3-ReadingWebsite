import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-deep-space-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold hover:text-ocean-blue-200 transition">
          Reading Page
        </Link>

        <nav className="flex gap-6">
          <Link
            to="/"
            className="hover:text-ocean-blue-200 transition font-medium"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
};