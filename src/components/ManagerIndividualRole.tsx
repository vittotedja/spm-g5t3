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
	isDisabled?: boolean;
	vacancy?: number;
}

function ManagerIndividualRole({
	roleName,
	roleID,
	applicationEndDate,
	noOfApplicants,
	listing_id,
	isDisabled,
	vacancy,
}: ManagerIndividualRoleProps) {
	const {userRole} = useAuth() || {};
	const isHR = userRole === 4;

	const navigate = useNavigate();
	return (
		<tr
			className={`border border-teal-900 border-opacity-20 text-neutral-950 cursor-pointer ${
				isDisabled
					? 'text-slate-500 bg-slate-200'
					: ' hover:bg-slate-100'
			}`}
			data-testid="manager-individual-role"
			onClick={() => navigate(`/manager/applicants-list/${listing_id}`)}
		>
			<td className="py-2" data-testid="rolename-manager">
				{roleName ? roleName : 'role name'}
			</td>
			<td>{roleID ? roleID : 'role id'}</td>
			<td>{noOfApplicants ? noOfApplicants : '0'}</td>
			<td>{vacancy ? vacancy : '0'}</td>
			<td>
				{formatDate(
					applicationEndDate ? new Date(applicationEndDate) : null
				)}
			</td>
			{isHR ? (
				<>
					<td className="justify-center align-middle">
						<div
							className={
								'mx-auto cursor-pointer hover:text-green hover:underline z-10'
							}
							onClick={(e) => {
								e.stopPropagation();
								navigate(`/listing-detail/${listing_id}/edit`, {
									state: {
										isEdit: true,
										listing_id: listing_id,
									},
								});
							}}
						>
							<HiPencilSquare className="z-20" />
						</div>
					</td>

					<td className="justify-center align-middle">
						<div
							className={
								'mx-auto cursor-pointer hover:text-red hover:underline d-flex justify-center align-middle'
							}
						>
							<HiTrash className="h-full" />
						</div>
					</td>
				</>
			) : (
				<>
					<td> </td>
					<td> </td>
				</>
			)}
		</tr>
	);
}

export default ManagerIndividualRole;
