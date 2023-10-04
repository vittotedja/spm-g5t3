import {useState} from 'react';
import Button from './Button';
import {HiUpload} from 'react-icons/hi';

export interface AddRoleListingModalProps {
	setHidden: boolean;
	handleShowModal: () => void;
}

function AddRoleListingModal({
	setHidden,
	handleShowModal,
}: AddRoleListingModalProps) {
	const [isHidden, setIsHidden] = useState(!setHidden);
	return (
		<>
			<div
				id="staticModal"
				data-modal-backdrop="static"
				aria-hidden="true"
				className={`fixed top-0 z-50 p-4 overflow-x-hiddenoverflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full ${
					isHidden ? 'hidden' : ''
				}`}
			>
				<div className="relative justify-center w-full max-w-2xl max-h-full mx-auto align-middle">
					<div className="relative rounded-lg bg-slate-50 first-letter:shadow-md">
						<div className="flex items-start justify-between p-4 border-b border-gray-600 rounded-t">
							<h3 className="text-xl font-semibold text-gray-900">
								{/* MODAL TITLE HERE */}
								Add New Role
							</h3>
							<button
								type="button"
								className="inline-flex items-center justify-center w-8 h-8 ml-auto text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
								onClick={() => {
									setIsHidden(true);
									handleShowModal();
								}}
							>
								<svg
									className="w-3 h-3"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						{/* MODAL CONTENT HERE */}
						<div className="p-6 space-y-6">
							<div className="flex items-center justify-between w-full mb-4">
								<label
									className="mr-2 text-sm font-bold text-gray-700 "
									htmlFor="rolename"
								>
									Role Name
								</label>
								<input
									className="w-4/5 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="rolename"
									type="text"
									placeholder="Role Name"
								/>
							</div>
							<div className="flex items-center justify-between w-full mb-4">
								<label
									className="mr-2 text-sm font-bold text-gray-700 "
									htmlFor="level"
								>
									Level
								</label>
								<input
									className="w-4/5 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="level"
									type="text"
									placeholder="Level"
								/>
							</div>
							<div className="flex items-center justify-between w-full mb-4">
								<label
									className="mr-2 text-sm font-bold text-gray-700 "
									htmlFor="dept"
								>
									Department
								</label>
								<input
									className="w-4/5 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="dept"
									type="text"
									placeholder="Department"
								/>
							</div>
							<div className="flex items-center justify-between w-full mb-4">
								<label
									className="mr-2 text-sm font-bold text-gray-700 "
									htmlFor="loc"
								>
									Location
								</label>
								<input
									className="w-4/5 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="loc"
									type="text"
									placeholder="Location"
								/>
							</div>
							<div className="flex items-center justify-between w-full mb-4">
								<label
									className="mr-2 text-sm font-bold text-gray-700 "
									htmlFor="loc"
								>
									Role Description
								</label>
								<textarea
									className="w-4/5 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="loc"
									placeholder="Role Description"
								/>
							</div>
							<div className="flex items-center justify-between w-full mb-4">
								<label
									className="mr-2 text-sm font-bold text-gray-700 "
									htmlFor="applclosedate"
								>
									Close Date
								</label>
								<input
									className="w-4/5 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="applclosedate"
									type="date"
									placeholder="Application Close Date"
									max={new Date().toString()}
								/>
							</div>
						</div>
						<div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
							<Button
								styleType="green"
								className="font-medium rounded-lg text-sm px-5 py-2.5 text-center"
							>
								<HiUpload className="inline-block mr-2" />
								Upload
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default AddRoleListingModal;
