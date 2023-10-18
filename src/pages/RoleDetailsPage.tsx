import RoleDetails from '../components/RoleDetails';
import SkillsMapComponent from '../components/SkillsMap';
import {useParams} from 'react-router-dom';
import {AiOutlineArrowLeft} from 'react-icons/ai';

const RoleDetailsPage = () => {
	//const user.staffId = typeof session?.user === 'string' ? session?.user : undefined;
	//TODO: change staffID to be dynamic
	const staffID = '1';
	const role_ID = useParams<{role_ID: string | undefined}>();

	return (
		<div className="container max-w-screen-xl p-4 mx-auto">
			<div className="flex items-start mb-4">
				<button
					className="flex items-center text-emerald-900 hover:underline"
					onClick={() => window.history.back()}
				>
					<AiOutlineArrowLeft />
					Back to Role Listings
				</button>
			</div>
			<div className="flex flex-col lg:flex-row">
				<RoleDetails roleid={role_ID.role_ID} />
				<SkillsMapComponent
					staffID={staffID}
					roleID={role_ID.role_ID}
				/>
			</div>
		</div>
	);
};

export default RoleDetailsPage;
