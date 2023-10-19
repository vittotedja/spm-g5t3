import {useNavigate} from 'react-router-dom';
import {HiPencilSquare, HiTrash} from 'react-icons/hi2';
import formatDate from '../utilities/Utiliities';
import {useAuth} from '../utilities/Auth';

interface ManagerIndividualRoleProps {
	roleName?: string;
	roleID?: number;
	level?: string;
	country?: string;
	applicationEndDate?: Date | null;
	noOfApplicants?: number;
	listing_id?: number;
}

function ManagerIndividualRole({
	roleName,
	roleID,
	applicationEndDate,
	noOfApplicants,
	listing_id,
}: ManagerIndividualRoleProps) {
	const {userRole} = useAuth() || {};
	const isHR = userRole === 4;

	const navigate = useNavigate();
	return (
		<tr
			className="border border-teal-900 cursor-pointer border-opacity-20 text-neutral-950 hover:bg-slate-100"
			data-testid="manager-individual-role"
			onClick={() => navigate(`/manager/applicants-list/${listing_id}`)}
		>
			<td className="py-2" data-testid="rolename-manager">
				{roleName ? roleName : 'role name'}
			</td>
			<td>{roleID ? roleID : 'role id'}</td>
			<td>{noOfApplicants ? noOfApplicants : '0'}</td>
			<td>
				{formatDate(
					applicationEndDate ? new Date(applicationEndDate) : null
				)}
			</td>
			<td>
				{isHR && (
					<div
						className="flex justify-center cursor-pointer hover:text-green hover:underline"
						onClick={() => {
							navigate('/manager/role-listing', {
								state: {isEdit: true},
							});
						}}
					>
						<HiPencilSquare />
					</div>
				)}
			</td>
			<td>
				{isHR && (
					<p className="cursor-pointer hover:text-red hover:underline">
						<HiTrash />
					</p>
				)}
			</td>
		</tr>
	);
}

export default ManagerIndividualRole;
