import React from "react";

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  let colorClass;
  const validPercentage = Math.min(Math.max(percentage, 0), 100);

  if (validPercentage > 66) {
    colorClass = "#299B71"; // Hex color for green
  } else if (validPercentage > 33) {
    colorClass = "#FFCA0F"; // Hex color for yellow
  } else if (validPercentage == 0) {
    colorClass = "bg-gray-200";
  } else {
    colorClass = "#AD0626"; // Hex color for red
  }

  return (
    <div className="w-full bg-gray-200 rounded-full relative font-bold overflow-hidden font-gotham">
      <div
        className={`text-s text-white text-center p-0.5 leading-none rounded-full h-5.5 font-gotham`}
        style={{ width: `${validPercentage}%`, background: colorClass }}
      >
        <span style={{ visibility: "hidden" }}>0</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center font-gotham">
        {validPercentage}%
      </div>
    </div>
  );
};

export default ProgressBar;
