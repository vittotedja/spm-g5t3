// SimpleProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
    let colorClass;
  
    if (percentage > 70) {
      colorClass = '#299B71'; // Hex color for green
    } else if (percentage > 50) {
      colorClass = '#FFCA0F'; // Hex color for yellow
    } else {
      colorClass = '#AD0626'; // Hex color for red
    }

    return (
      <div className="w-full bg-gray-200 rounded-full">
        <div className={`text-s text-blue-100 text-center p-0.5 leading-none rounded-full h-5.5`} style={{ width: `${percentage}%`, background: colorClass }}>
          {percentage}%
        </div>
      </div>
    );
  };
  

export default ProgressBar;
