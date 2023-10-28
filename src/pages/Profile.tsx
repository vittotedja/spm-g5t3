import {useEffect, useState} from 'react';
import ApplicationCard from '../components/ApplicationCard';
import Badge from '../components/Badge';
import {useNavigate} from 'react-router-dom';
import Button from '../components/Button';
import {setInitial} from '../utilities/Services';
import {useAuth} from '../utilities/Auth';
import Avatar from 'react-avatar';

interface Staff {
	staff_id: number;
	staff_fname: string;
	staff_lname: string;
	email: string;
	dept: string;
	country: string;
	control_access: number;
	curr_role: {
		role_id: number;
		role_name: string;
		role_department: string;
		role_location: string;
	};
}

interface Skill {
	skill_id: number;
	skill_name: string;
	skill_desc: string;
}
[];

interface Application {
	application_id: number;
	applied_at: string;
	withdrawn_at: string;
	staff_id: number;
	application_reason: string;
	application_status: 'Applied' | 'Shortlisted' | 'Rejected';
	updated_at: string;
	listing_id: number;
	listing: {
		listing_id: number;
		role_id: number;
		creation_date: string;
		updated_at: string;
		deleted_at: string;
		updated_from: string;
		listing_location: string;
		application_close_date: string;
	};
}
[];

export default function Profile() {
	const auth = useAuth();
	const staffId = auth?.staffId;

	let [staff, setStaff] = useState<Staff>(Object);
	let [skills, setSkills] = useState<Skill[]>([]);
	let [application, setApplication] = useState<Application[]>([]);
	const navigate = useNavigate();
	const roleListingButton = () => {
		navigate('/');
	};

	useEffect(() => {
		setInitial(setStaff, `api/staff?staff_id=${staffId}`, false);
		setInitial(setApplication, `api/application?staff_id=${staffId}`);
		setInitial(setSkills, `api/staff_skill?staff_id=${staffId}`);
	}, []);
	const userName = staff?.staff_fname + ' ' + staff?.staff_lname;
	return (
		<>
			{/* <Navbar /> */}
			<div className="container px-4 mx-auto mt-10">
				<div className="container sm:flex sm:space-x-6">
					<div className="pb-2 sm:text-left">
						<Avatar name={userName} round={true} />
					</div>
					<div className="sm:text-left">
						<p className="text-2xl font-extrabold">{userName}</p>
						<p className="text-base italic font-bold">
							{staff.curr_role?.role_name}
						</p>
						<p className="text-base italic font-medium">
							{staff.dept}
						</p>
						<p className="text-base italic font-light">
							{staff.country}
						</p>
					</div>
				</div>

				<div className="container mt-8">
					<p className="mb-3 text-2xl font-extrabold text-left">
						Skills
					</p>

					{skills[0] ? (
						<div className="text-left">
							{skills.map((sk) => (
								<Badge key={sk.skill_name} styleType="green">
									{sk.skill_name}
								</Badge>
							))}
						</div>
					) : (
						<div className="mb-8">
							<p className="mb-2 text-xl font-medium text-emerald-900">
								Your skills have not been recorded in the
								system.
							</p>
							<p className="mb-2 font-medium text-emerald-900 text-md">
								Please contact the HR staff at
								hr@all-in-one.com.
							</p>
						</div>
					)}
				</div>

				<div className="container mt-8">
					<p className="mb-3 text-2xl font-extrabold text-left">
						Applied Roles
					</p>

					{/* NO APPLICATION */}
					{application[0] ? (
						<div
							className="flex flex-col columns-3"
							data-testid="application-list"
						>
							{application.map((appl) => (
								<ApplicationCard
									key={appl.application_id}
									application={appl}
								/>
							))}
						</div>
					) : (
						<div className="mb-8">
							<p className="mb-2 text-xl font-medium text-emerald-900">
								You have not applied for any roles.
							</p>
							<div className="flex items-center justify-center">
								<Button
									styleType={'green'}
									onClick={roleListingButton}
								>
									Go to Role Listing
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
