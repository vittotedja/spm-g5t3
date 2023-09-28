import React from 'react';

interface ProgressBarProps {
	percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({percentage}) => {
	let colorClass;

	if (percentage > 66) {
		colorClass = '#299B71'; // Hex color for green
	} else if (percentage > 33) {
		colorClass = '#FFCA0F'; // Hex color for yellow
	} else {
		colorClass = '#AD0626'; // Hex color for red
	}

	var percentageString;
	if (percentage == 0) {
		percentageString = (
			<div
				className={`text-s text-black text-center p-0.5 leading-none rounded-full h-5.5 flex items-center justify-center w-full`}
			>
				{percentage}%
			</div>
		);
	} else {
		percentageString = (
			<>
				<div
					className={`text-s text-white text-center p-0.5 leading-none rounded-full h-5.5`}
					style={{width: `${percentage}%`, background: colorClass}}
				>
					<span style={{visibility: 'hidden'}}>0</span>
				</div>
				<div className="absolute inset-0 flex items-center justify-center">
					{percentage}%
				</div>
			</>
		);
	}

	return (
		<div className="relative w-full font-bold bg-gray-200 rounded-full">
			{percentageString}
		</div>
	);
};

export default ProgressBar;
