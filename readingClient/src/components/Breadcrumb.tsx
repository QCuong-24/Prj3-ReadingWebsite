import { Link } from "react-router-dom";

interface BreadcrumbProps {
  items: { label: string; to?: string }[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="text-sm mb-4 text-gray-600">
      <ol className="flex gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.to ? (
              <Link
                to={item.to}
                className="text-ocean-blue-600 hover:text-ocean-blue-700"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-800">{item.label}</span>
            )}

            {index < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};