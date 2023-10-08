import {useState, useEffect} from 'react';
import {FaArrowLeft} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import Button from '../components/Button';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {getAsync} from '../utilities/Services';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '../components/ui/popover';
import {Calendar} from '../components/ui/calendar';
import formatDate from '../utilities/Utiliities';

export type SkillProps = {
	skill_id: string;
	skill_name: string;
	skill_desc: string;
};

const RoleCreation: React.FC = () => {
	const navigate = useNavigate();
	const animatedComponents = makeAnimated();
	const [skillOptions, setSkillOptions] = useState<any>([]);
	const [managerOptions, setManagerOptions] = useState<any>([]);
	const [date, setDate] = useState<Date | undefined>(new Date());
	const countryOptions = [
		{value: 'sg', label: 'Singapore'},
		{value: 'my', label: 'Malaysia'},
		{value: 'id', label: 'Indonesia'},
		{value: 'vn', label: 'Vietnam'},
		{value: 'hk', label: 'Hong Kong'},
	];

	async function fetchSkillOptions() {
		const response = await getAsync('api/skill');
		const data = await response.json();
		const mappedData = data.map((skill: any) => ({
			value: skill.skill_id,
			label: skill.skill_name,
		}));
		setSkillOptions(mappedData);
	}

	async function fetchManagerOptions() {
		const response = await getAsync('api/staff');
		const data = await response.json();
		//put staff in mappedData if is_Manager is true
		const mappedData = data.map(
			(staff: any) =>
				staff.is_manager && {
					value: staff.staff_id,
					label: staff.staff_name,
				}
		);
		const cleanedData = mappedData.filter((data: any) => data !== false);
		setManagerOptions(cleanedData);
	}

	useEffect(() => {
		setSkillOptions([]);
		setManagerOptions([]);
		fetchSkillOptions();
		fetchManagerOptions();
	}, []);

	const isDateDisabled = (date: Date) => {
		// Disable dates before today
		return date < new Date();
	};

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
						New Role Listing
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
										<div className="mt-2">
											<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-600 sm:max-w-md">
												<input
													type="text"
													id="rolename"
													className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 placeholder:pl-2"
													placeholder="Role Name"
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="mt-10">
									<div className="px-3 sm:col-span-4 text-start">
										<label
											htmlFor="level"
											className="font-bold leading-6 text-olive-green-dark"
										>
											Level
										</label>
										<div className="mt-2">
											<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-600 sm:max-w-md">
												<input
													type="text"
													id="level"
													className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 placeholder:pl-2"
													placeholder="Senior"
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="mt-10">
									<div className="px-3 sm:col-span-4 text-start">
										<label
											htmlFor="rolename"
											className="font-bold leading-6 text-olive-green-dark"
										>
											Country
										</label>
										<Select
											options={countryOptions}
											className="mt-2 basic-multi-select"
										/>
									</div>
								</div>
							</div>

							<div className="pb-12 border-b border-gray-900/10 text-start">
								<h2 className="pl-4 text-base font-semibold leading-7 text-olive-green-dark">
									Role Description
								</h2>
								<div className="px-3 mt-2">
									<textarea
										id="role_desc"
										className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-within:ring-emerald-600"
									/>
								</div>
							</div>

							<div className="pb-12 border-b border-gray-900/10 text-start">
								<h2 className="pl-4 text-base font-semibold leading-7 text-olive-green-dark">
									Role Responsibilities
								</h2>
								<div className="px-3 mt-2">
									<textarea
										id="role_resp"
										className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-within:ring-emerald-600"
									/>
								</div>
							</div>

							<div className="pb-12 border-b border-gray-900/10 text-start">
								<h2 className="pl-4 text-base font-semibold leading-7 text-olive-green-dark">
									Skills
								</h2>
								<Select
									isMulti
									options={skillOptions}
									className="mx-3 mt-2 basic-multi-select"
									components={animatedComponents}
									styles={colorStyles}
								/>
								<span className="hidden pl-4 mt-2 text-xs italic text-gray-600 sm:block">
									Type the skill name to search for the skill.
									You can add multiple skills.
								</span>
							</div>
							<div className="grid grid-cols-1 pb-12 border-b border-gray-900/10 sm:grid-cols-2">
								<div className="mt-10">
									<div className="px-3 sm:col-span-4 text-start">
										<label
											htmlFor="rolename"
											className="font-bold leading-6 text-olive-green-dark"
										>
											Application Close Date
										</label>
										<div className="w-full py-1 mt-2 align-middle border rounded-md sm:w-2/3">
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
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-end p-4 mt-6 text-small gap-x-6">
							<Button styleType="green">Save</Button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default RoleCreation;

{
	/* 
    <div className="sm:col-span-3">
        <label
            htmlFor="country"
            className="block text-sm font-medium leading-6 text-gray-900"
        >
            Country
        </label>
        <div className="mt-2">
            <select
                id="country"
                name="country"
                autoComplete="country-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            >
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
            </select>
        </div>
    </div> */
}
