export default function Badge({ children, className, type = "normal" }: BadgeProps) {
    const baseStyles = "inline-flex items-center rounded-md px-3 py-1 text-base font-semibold ring-2 ring-inset mr-2 mb-2";
    const stylesMap = {
      normal: "text-black ring-black",
      green: "text-green ring-green",
      red: "text-red ring-red",
      disabled: "bg-gray-400 cursor-not-allowed",
    }
  
    return (
      <span className={`${baseStyles} ${stylesMap[type]} ${className}`}>
        {children}
      </span>
    );
  }