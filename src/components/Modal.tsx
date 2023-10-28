import React from 'react';
import close from '../assets/close.png';
import Button from './Button';
import {useState} from 'react';
import {FcCheckmark, FcHighPriority, FcQuestions} from 'react-icons/fc';

interface ModalProps {
	children?: any;
	isOpen: boolean;
	onClose: () => void;
	modalType: string;
	message?: string;
	onSubmit?: (reason: string) => void;
}

const Modal: React.FC<ModalProps> = ({
	children,
	isOpen,
	onClose,
	onSubmit,
	modalType,
	message,
}) => {
	let [charLength, setCharLength] = useState(0);
	const [text, setText] = useState('');
	const maxWords = 500; // Change this to your desired word limit

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const inputValue = e.target.value;
		setCharLength(inputValue.length);
		if (charLength + 1 <= maxWords) {
			setText(inputValue);
		}
	};
	return (
		<>
			<div
				className={`fixed inset-0 flex items-center justify-center ${
					isOpen ? '' : 'hidden'
				}`}
				data-testid="modal"
			>
				<div className="fixed inset-0 bg-gray-500 opacity-75"></div>
				<div className="relative w-1/3 bg-white rounded-lg shadow-lg">
					<div className="p-5">
						<div className="p-2 text-right">
							<button
								onClick={onClose}
								data-testid="close-button"
							>
								<img src={close} width={13} />
							</button>
						</div>
						<div className="max-h-screen pb-3">
							{modalType === 'reason' ? (
								<div className="">
									<p className="mb-1 text-2xl font-extrabold text-left ">
										Reason for applying
									</p>
									<p className="mb-2 text-sm text-left text-gray-500">
										{' '}
										Max. 500 characters
									</p>
									<textarea
										className="w-full h-48 p-2 mb-2 border rounded border-emerald-900/50 min-h-24"
										placeholder="I want to apply for the role because..."
										data-testid="reason-input"
										onChange={handleChange}
										value={text}
									></textarea>
									<div className="flex">
										<div className="w-1/2 text-xs text-left text-gray-300">
											<p>
												{' '}
												Character count: {
													charLength
												}{' '}
											</p>
										</div>
										<div className="flex items-end justify-end w-1/2">
											<Button
												id="submit-button"
												styleType={'green'}
												onClick={() =>
													onSubmit && onSubmit(text)
												}
											>
												Submit
											</Button>
										</div>
									</div>
								</div>
							) : modalType === 'success' ? (
								<div>
									<div className="flex items-center justify-center">
										<FcCheckmark size={200} />
									</div>
									<p className="mb-4 text-4xl font-extrabold text-green">
										Successful
									</p>
									<div className="pl-4 pr-4 text-xl font-bold">
										{message}
									</div>
								</div>
							) : modalType === 'fail' ? (
								<div className="text-center">
									<div className="flex items-center justify-center mt-6 mb-8">
										<FcHighPriority size={200} />
									</div>
									<p className="mb-4 text-4xl font-extrabold text-red">
										Failed
									</p>
									<div className="pl-4 pr-4 text-xl font-bold">
										{message}
									</div>
								</div>
							) : modalType === 'confirmation' ? (
								<div>
									<div className="flex items-center justify-center mb-8">
										<FcQuestions size={200} />
									</div>
									<div className="pl-4 pr-4 text-xl font-bold">
										{message}
									</div>
									<div className="flex items-center justify-center mt-6">
										<Button
											className="mr-6"
											styleType={'red'}
											onClick={onClose}
										>
											No
										</Button>
										<Button
											id="confirm-button"
											styleType={'green'}
											onClick={() =>
												onSubmit && onSubmit('')
											}
										>
											Yes
										</Button>
									</div>
								</div>
							) : (
								<div className="pl-4 pr-4 mt-6">{children}</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Modal;
