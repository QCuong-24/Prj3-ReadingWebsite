export const Footer = () => {
  return (
    <footer className="bg-deep-space-blue-800 text-white mt-10">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-ocean-blue-200">Reading Page</h2>
          <p className="text-sm text-gray-300 mt-2">
            A clean and modern platform for reading and managing novels.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-ocean-blue-200 mb-2">Quick Links</h3>
          <ul className="space-y-1 text-gray-300">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/search" className="hover:text-white">Search</a></li>
            <li><a href="/statistic" className="hover:text-white">Statistics</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-ocean-blue-200 mb-2">Contact</h3>
          <p className="text-gray-300 text-sm">Email: support@readingpage.com</p>
          <p className="text-gray-300 text-sm">Hanoi, Vietnam</p>
        </div>
      </div>

      <div className="border-t border-ocean-blue-600 text-center py-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} Reading Page. All rights reserved.
      </div>
    </footer>
  );
};