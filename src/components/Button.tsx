import React, {FC} from 'react';
import Spinner from './Spinner';

interface ButtonProps {
	className?: string;
	children?: React.ReactNode;
	loading?: boolean;
	styleType?: 'normal' | 'red' | 'disabled' | 'green' | 'underline' | 'white';
	onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
	id?: string;
}

const Button: FC<ButtonProps> = ({
	className,
	children,
	loading,
	styleType = 'normal',
	onClick,
	id,
}) => {
	const baseStyles =
		'relative flex items-center justify-center text-transform-none rounded-lg px-4 py-2 text-lg h-10';

	const stylesMap = {
		normal: loading
			? 'bg-olive-green text-white'
			: 'bg-olive-green hover:bg-olive-green-dark text-white',
		green: loading
			? 'bg-green text-white'
			: 'bg-green hover:bg-green-dark text-white',
		red: loading
			? 'bg-red text-white'
			: 'bg-red hover:bg-red-dark text-white',
		disabled: 'bg-gray-400 cursor-not-allowed hover: none',
		underline:
			'bg-transparent hover:bg-transparent text-emerald-900 text-underlined',
		white: 'bg-white hover:bg-gray-100 text-emerald-900 rounded-3xl',
	};

	return (
		<button
			id={id}
			onClick={onClick}
			className={`${baseStyles} ${stylesMap[styleType]} ${className} ${
				loading ? 'pointer-events-none' : ''
			}`}
			disabled={styleType === 'disabled' || loading}
		>
			<span className={loading ? 'opacity-0' : 'opacity-100'}>
				{children}
			</span>
			{loading && <Spinner />}
		</button>
	);
};

export default Button;
