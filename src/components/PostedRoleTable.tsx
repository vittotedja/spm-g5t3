import ManagerIndividualRole from './ManagerIndividualRole';

const PostedRoleTable = () => {
	return (
		<table className="table-auto w-full border border-teal-900 border-opacity-20 mt-5">
			<thead className="bg-teal-900 text-white">
				<tr className="">
					<th className="py-2">Role Name</th>
					<th>Role Id</th>
					<th>Level</th>
					<th>Country</th>
					<th>No. of Applicants</th>
					<th>Application Start Date</th>
				</tr>
			</thead>
			<tbody>
				<ManagerIndividualRole />
				<ManagerIndividualRole />
				<ManagerIndividualRole />
				<ManagerIndividualRole />
			</tbody>
		</table>
	);
};

export default PostedRoleTable;
