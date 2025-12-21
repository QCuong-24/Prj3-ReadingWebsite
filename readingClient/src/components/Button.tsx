import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  variant?: "primary" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
  variant = "primary",
  size = "md",
}: ButtonProps) => {
  const baseClasses = "rounded-lg font-medium shadow transition";

  const variantClasses = {
    primary: "bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};