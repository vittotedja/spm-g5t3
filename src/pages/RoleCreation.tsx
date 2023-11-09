import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {FaArrowLeft} from 'react-icons/fa';
import Button from '../components/Button';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {getAsync, postAsync, putAsync} from '../utilities/Services';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '../components/ui/popover';
import {Calendar} from '../components/ui/calendar';
import formatDate from '../utilities/Utiliities';
import Badge from '../components/Badge';
import {setInitial} from '../utilities/Services';
import {toast} from 'react-hot-toast';
import LoadingState from "../components/loadingState";


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
	const countryOptions = [
		{value: 'Singapore', label: 'Singapore'},
		{value: 'Indonesia', label: 'Indonesia'},
		{value: 'Malaysia', label: 'Malaysia'},
		{value: 'Vietnam', label: 'Vietnam'},
		{value: 'Hong Kong', label: 'Hong Kong'},
	];

	//state for selected options
	const [selectedRole, setSelectedRole] = useState<any>({});
	const [selectedCountry, setSelectedCountry] = useState<any>(null);
	const [hrManager, setHrManager] = useState<any>([]);
	const [vacancy, setVacancy] = useState<any>(null);
	const [skillsMap, setSkillsMap] = useState<Array<SkillProps>>([]);
	const [roleOptions, setRoleOptions] = useState<any>([]);
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [listing, setListing] = useState<any>({});
	let [loading, setLoading] = useState(true);

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

	async function fetchListing() {
		if (location.state?.isEdit){
			let listing = await setInitial(setListing, `api/listing?listing_id=${location.state.listing_id}`, false)
			await setInitial(setSkillsMap, `api/staff_role_skill?role_id=${listing.role.role_id}`)
			setDate(new Date(listing.application_close_date))
			setSelectedCountry({value: listing.listing_location, label: listing.listing_location})
			setVacancy(listing.vacancy)
			setHrManager(listing.listing_manager.map((manager: any) => ({value: manager.staff.staff_id, label: `${manager.staff.staff_fname} ${manager.staff.staff_lname}`})))
			setSelectedRole(listing.role)
		}
		else{
			setInitial(setSkillOptions, 'api/staff_role_skill')
		}
		
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
		if (vacancy > 127) {
			toast.error('Vacancy should be less than 128');
			setIsLoading(false);
			setVacancy(0);
			return;
		}
		if (hrManager.length > 0 && vacancy > 0) {
			let response
			if (location.state.isEdit){
				response = await putAsync('api/listing', {
					application_close_date: date,
					vacancy: vacancy,
					manager: hrManager,
					listing_id: listing.listing_id
				});
				if (response.ok) {
					navigate(`/manager/applicants-list/${listing?.listing_id}`);
					
				} else {
					setIsLoading(false);
					toast.error(
						'Something went wrong, please check whether you have keyed in the right details'
					);
				}
			}
			else{
				response = await postAsync('api/listing', {
					role_id: selectedRole.role_id,
					application_close_date: date,
					listing_location: selectedCountry.value,
					vacancy: vacancy,
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
					toast.success('Role Listing posted successfully');
					navigate('/manager');
				} else {
					setIsLoading(false);
					toast.error(
						'Something went wrong, please check whether you have keyed in the right details'
					);
				}
			}
			
		} else {
			toast.error(
				'Something went wrong, please check whether you have keyed in the right details'
			);
			setIsLoading(false);
		}
	};

	async function promiseExecution() {
		await Promise.all(
			[fetchRoleOptions(),
			fetchManagerOptions(),
			fetchListing()]
		);
		setLoading(false)
	}

	useEffect(() => {
		setSkillOptions([]);
		setManagerOptions([]);
		setRoleOptions([]);
		promiseExecution();
		
	}, []);

	//disable dates before today
	const isDateDisabled = (date: Date) => {
		// Disable dates before today
		return date < new Date();
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
	console.log(hrManager)
	return (
		<>
			<div className="container mt-12 mb-10">
				<div className="flex flex-col justify-start w-full cursor-pointer sm:w-1/2 text-start">
					<div
						className="flex pb-2"
						onClick={() => navigate('/manager')}
					>
						<FaArrowLeft className="mr-4" />
						<p>Back to Posted Role Listings</p>
					</div>
					<div className="text-3xl font-bold">
						{location.state?.isEdit ? 'Edit' : 'New'} Role Listing
					</div>
				</div>
				{loading ? (
					<LoadingState />
				) : (
				<div className="justify-center mx-auto mt-4 align-middle border rounded">
					<form>
						<div className="space-y-10">
							<div className="grid grid-cols-1 pb-12 border-b border-gray-900/10 sm:grid-cols-2">
								<div className="mt-10">
									<div className="px-3 sm:col-span-3 text-start">
										<label
											htmlFor="rolename"
											className="font-bold leading-6 text-olive-green-dark"
										>
											Role Name
										</label>
										{location.state?.isEdit 
										? 
										<p className="block flex-1 border-0 bg-transparent py-1.5 pr-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 placeholder:pl-2"> {listing.role?.role_name}</p>
										
										: <Select
											options={roleOptions}
											className="mt-2 rounded-md shadow-sm basic-multi-select ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-600 sm:max-w-md"
											onChange={(selectedOption) => {
												handleChange(selectedOption);
											}}
										/>}
										
									</div>
								</div>
								<div className="mt-10">
									<div className="px-3 sm:col-span-3 text-start">
										<label
											htmlFor="rolename"
											className="font-bold leading-6 text-olive-green-dark"
										>
											Application Close Date
										</label>
										<div className="w-5/6 py-1 mt-2 align-middle border rounded-md">
											<Popover>
												<PopoverTrigger
													className="w-full text-left px-2 justify-center align-middle"
													data-testid="datepicker"
												>
													{date
														? formatDate(date)
														: 'Select Date'
													}
												</PopoverTrigger>
												<PopoverContent>

													<Calendar
														mode="single"
														defaultMonth={date}
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
									<div className="px-3 sm:col-span-3 text-start">
										<label
											htmlFor="rolename"
											className="font-bold leading-6 text-olive-green-dark"
										>
											Location
										</label>
										{location.state?.isEdit 
										? 
										<p className="block flex-1 border-0 bg-transparent py-1.5 pr-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 placeholder:pl-2"> {listing?.listing_location}</p>
										:
										<Select
											required
											options={countryOptions}
											className="mt-2 rounded-md shadow-sm basic-multi-select ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-600 sm:max-w-md"
											value={selectedCountry}
											onChange={(selectedOption) => {
												setSelectedCountry(
													selectedOption
												);
											}}
										/>
										}
									</div>
								</div>
								<div className="mt-10">
									<div className="px-3 sm:col-span-3 text-start w-5/6">
										<label
											htmlFor="vacancy"
											className="font-bold leading-6 text-olive-green-dark"
										>
											Vacancy
										</label>
										<div className="flex mt-2 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-600 ">
											<input
												data-testid="vacancy"
												type="number"
												min={1}
												max={127}
												className="block flex-1 border-0 bg-transparent py-1.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 placeholder:pl-2"
												value={vacancy}
												placeholder={`How many people do you need?`}
												onChange={(e) => {
													setVacancy(
														parseInt(e.target.value)
													);
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="pb-12 border-b border-gray-900/10 text-start">
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
										value={hrManager}
										onChange={(selectedOption) => {
											setHrManager(selectedOption);
										}}
									/>
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
								id="save-listing"
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
				)}
			</div>
		</>
	);
};

export default RoleCreation;
