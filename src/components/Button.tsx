import React, { FC } from "react";
import Spinner from "./Spinner";

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
  styleType?: "normal" | "red" | "disabled" | "green";
  onClick?: () => void;
}

const Button: FC<ButtonProps> = ({
  className,
  children,
  loading,
  styleType = "normal",
  onClick,
}) => {
  const baseStyles =
    "relative flex items-center justify-center text-transform-none rounded-lg px-4 py-2 text-lg h-10";

  const stylesMap = {
    normal: "bg-olive-green hover:bg-olive-green-dark text-white",
    green: "bg-green hover:bg-green-dark text-white",
    red: "bg-red hover:bg-red-dark text-white",
    disabled: "bg-gray-400 hover:bg-gray-500 cursor-not-allowed",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${stylesMap[styleType]} ${className}`}
      disabled={styleType === "disabled" || loading}
    >
      <span className={loading ? "opacity-0" : "opacity-100"}>{children}</span>
      {loading && <Spinner />}
    </button>
  );
};

export default Button;
