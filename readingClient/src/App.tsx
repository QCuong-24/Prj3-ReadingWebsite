import { AppRouter } from "./router/AppRouter";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function App() {
  return (
    <div className="min-h-screen bg-deep-space-blue-50 text-gray-900">
      <AppRouter />
    </div>
  );
}