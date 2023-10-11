import {useNavigate} from 'react-router-dom';
import {HiPencilSquare, HiTrash} from 'react-icons/hi2';
import formatDate from '../utilities/Utiliities';
interface ManagerIndividualRoleProps {
	roleName?: string;
	roleID?: number;
	level?: string;
	country?: string;
	applicationEndDate?: Date | null;
	noOfApplicants?: number;
}

function ManagerIndividualRole({
	roleName,
	roleID,
	applicationEndDate,
	noOfApplicants,
}: ManagerIndividualRoleProps) {
	const navigate = useNavigate();
	return (
		<tr className="border border-teal-900 border-opacity-20 text-neutral-950">
			<td className="py-2">{roleName ? roleName : 'role name'}</td>
			<td>{roleID ? roleID : 'role id'}</td>
			<td>{noOfApplicants ? noOfApplicants : '0'}</td>
			<td>
				{formatDate(
					applicationEndDate ? new Date(applicationEndDate) : null
				)}
			</td>
			<td>
				<p
					onClick={() =>
						navigate('/manager/rolelisting', {
							state: {isEdit: true},
						})
					}
					className="cursor-pointer hover:text-green hover:underline"
				>
					<HiPencilSquare />
				</p>
			</td>
			<td>
				<p className="cursor-pointer hover:text-red hover:underline">
					<HiTrash />
				</p>
			</td>
		</tr>
	);
}

export default ManagerIndividualRole;
