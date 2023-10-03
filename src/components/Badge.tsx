interface BadgeProps {
    className?: string;
    children?: React.ReactNode;
    styleType?: "normal" | "red" | "green" | "disabled";
}

export default function Badge({ children, className, styleType = "normal" }: BadgeProps) {
    const baseStyles = "inline-flex items-center rounded-md px-3 py-1 text-base font-semibold ring-2 ring-inset mr-2 mb-2 h-10";
    const stylesMap = {
      normal: "text-black ring-black",
      green: "text-green ring-green",
      red: "text-red ring-red",
      disabled: "text-white ring-gray-300 bg-gray-300",
    }
  
    return (
      <span className={`${baseStyles} ${stylesMap[styleType]} ${className}`}>
        {children}
      </span>
    );
  }