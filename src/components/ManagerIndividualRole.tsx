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
	level,
	country,
	applicationEndDate,
	noOfApplicants,
}: ManagerIndividualRoleProps) {
	return (
		<tr className="border border-teal-900 border-opacity-20 text-neutral-950">
			<td className="py-2">{roleName}</td>
			<td>{roleID}</td>
			<td>{level ? level : '-'}</td>
			<td>{country ? country : '-'}</td>
			<td>{noOfApplicants}</td>
			<td>
				{formatDate(
					applicationEndDate ? new Date(applicationEndDate) : null
				)}
			</td>
		</tr>
	);
}

export default ManagerIndividualRole;
