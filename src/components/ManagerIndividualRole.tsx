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
			<td>EDIT</td>
			<td>DELETE</td>
		</tr>
	);
}

export default ManagerIndividualRole;
