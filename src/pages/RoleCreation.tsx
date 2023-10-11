import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {FaArrowLeft} from 'react-icons/fa';
import Button from '../components/Button';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {getAsync, postAsync} from '../utilities/Services';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '../components/ui/popover';
import {Calendar} from '../components/ui/calendar';
import formatDate from '../utilities/Utiliities';
import Badge from '../components/Badge';
import {setInitial} from '../utilities/Services';

export type SkillProps = {
	skill_id: string;
	skill_name: string;
	skill_desc: string;
};

const RoleCreation: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	//react-select to make badges animated
	const animatedComponents = makeAnimated();

	//get data from api
	const [roles, setRoles] = useState<any>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [skillOptions, setSkillOptions] = useState<any>([]);
	const [managerOptions, setManagerOptions] = useState<any>([]);

	//state for selected options
	const [selectedRole, setSelectedRole] = useState<any>({});
	const [hrManager, setHrManager] = useState<any>({});
	const [skillsMap, setSkillsMap] = useState<Array<SkillProps>>([]);
	const [roleOptions, setRoleOptions] = useState<any>([]);
	const [date, setDate] = useState<Date | undefined>(new Date());

	//fetch data needed from DB
	async function fetchRoleOptions() {
		const response = await getAsync('api/role');
		const data = await response.json();
		setRoles(data);
		const mappedData = data.map((role: any) => ({
			value: role.role_id,
			label: role.role_name,
		}));
		setRoleOptions(mappedData);
	}
	async function fetchManagerOptions() {
		const response = await getAsync('api/staff');
		const data = await response.json();
		const mappedData = data.map(
			(staff: any) =>
				staff.control_access == 3 && {
					value: staff.staff_id,
					label: `${staff.staff_fname} ${staff.staff_lname}`,
				}
		);
		const cleanedData = mappedData.filter((data: any) => data !== false);
		setManagerOptions(cleanedData);
	}

	//handle change for react-select
	function handleChange(selectedOption: any) {
		setSelectedRole(
			roles.find((role: any) => role.role_id === selectedOption?.value)
		);
		const cleanedData = skillOptions.filter(
			(data: any) => data.role_id == selectedOption?.value
		);
		setSkillsMap(cleanedData);
	}

	//POST data when submit button is clicked
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setIsLoading(true);
		const response = await postAsync('api/listing', {
			role_id: selectedRole.role_id,
			application_close_date: date,
		});
		const data = await response.json();
		if (data.success) {
			for (let i = 0; i < hrManager.length; i++) {
				const response = await postAsync('api/listing_manager', {
					manager_id: hrManager[i].value,
					listing_id: data.data.listing_id,
				});
				const listingManagerData = await response.json();
				if (!listingManagerData.success) {
					alert('Error: ' + listingManagerData.error);
				}
			}
			navigate('/manager');
		} else {
			setIsLoading(false);
			alert('Error: ' + data.error);
		}
	};

	useEffect(() => {
		setSkillOptions([]);
		setManagerOptions([]);
		setRoleOptions([]);
		setInitial(setSkillOptions, 'api/staff_role_skill');
		fetchRoleOptions();
		fetchManagerOptions();
	}, []);

	//disable dates before today
	const isDateDisabled = (date: Date) => {
		// Disable dates before today
		return date <= new Date();
	};

	//react-select styles
	const colorStyles = {
		control: (styles: any) => ({
			...styles,
			backgroundColor: 'white',
		}),
		multiValue: (styles: any) => ({
			...styles,
			border: '2px solid #299B71',
			backgroundColor: 'transparent',
			borderRadius: '5px',
			color: '#299B71',
		}),
		multiValueLabel: (styles: any) => ({
			...styles,
			color: '#299B71',
			fontStyle: 'italic',
		}),
	};

	return (
		<>
			<div className="w-full mt-12 mb-10">
				<div className="flex flex-col justify-start w-full ml-16 cursor-pointer sm:w-1/2 text-start">
					<div
						className="flex pb-2"
						onClick={() => navigate('/manager')}
					>
						<FaArrowLeft className="mr-4" />
						<p>Back to Posted Role Listings</p>
					</div>
					<div className="text-3xl font-bold">
						{/* TODO: change title based on edit or create */}
						{location.state.isEdit ? 'Edit' : 'New'} Role Listing
					</div>
				</div>
				<div className="justify-center w-4/5 mx-auto mt-4 align-middle border rounded">
					<form>
						<div className="space-y-10">
							<div className="grid grid-cols-1 pb-12 border-b border-gray-900/10 sm:grid-cols-3">
								<div className="mt-10">
									<div className="px-3 sm:col-span-4 text-start">
										<label
											htmlFor="rolename"
											className="font-bold leading-6 text-olive-green-dark"
										>
											Role Name
										</label>
										<Select
											options={roleOptions}
											className="mt-2 rounded-md shadow-sm basic-multi-select ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-600 sm:max-w-md"
											onChange={(selectedOption) => {
												handleChange(selectedOption);
											}}
										/>
									</div>
								</div>
								<div className="mt-10">
									<div className="px-3 sm:col-span-4 text-start">
										<label
											htmlFor="rolename"
											className="font-bold leading-6 text-olive-green-dark"
										>
											Application Close Date
										</label>
										<div className="w-full py-1 mt-2 align-middle border rounded-md">
											<Popover>
												<PopoverTrigger className="justify-center w-full align-middle">
													{date
														? formatDate(date)
														: 'Select Date'}
												</PopoverTrigger>
												<PopoverContent>
													<Calendar
														mode="single"
														selected={date}
														onSelect={setDate}
														className="mx-auto"
														disabled={
															isDateDisabled
														}
													/>
												</PopoverContent>
											</Popover>
										</div>
									</div>
								</div>
								<div className="mt-10">
									<div className="px-3 sm:col-span-4 text-start">
										<label
											htmlFor="level"
											className="font-bold leading-6 text-olive-green-dark"
										>
											Hiring Managers
										</label>
										<Select
											isMulti
											options={managerOptions}
											className="mt-2 basic-multi-select"
											styles={colorStyles}
											components={animatedComponents}
											onChange={(selectedOption) => {
												setHrManager(selectedOption);
											}}
										/>
									</div>
								</div>
							</div>

							<div className="pb-12 border-b border-gray-900/10 text-start">
								<h2 className="pl-4 text-base font-semibold leading-7 text-olive-green-dark">
									Role Description
								</h2>
								<div className="px-3 mx-2 mt-2 text-justify">
									{selectedRole?.role_desc}
								</div>
							</div>

							<div className="pb-12 border-b border-gray-900/10 text-start">
								<h2 className="pl-4 text-base font-semibold leading-7 text-olive-green-dark">
									Skills
								</h2>
								<div className="justify-center mx-3 align-middle">
									{skillsMap.map((skill: any) => {
										return (
											<Badge
												styleType="green"
												className="text-xs"
												key={skill.skill_id}
											>
												{skill.skill_name}
											</Badge>
										);
									})}
								</div>
							</div>
						</div>

						<div className="flex items-center justify-end p-4 mt-4 text-small gap-x-6">
							<Button
								styleType="green"
								loading={isLoading}
								onClick={(e) => {
									handleSubmit(e);
								}}
							>
								Save
							</Button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default RoleCreation;
