import {useEffect, useState} from 'react';
import ManagerIndividualRole from './ManagerIndividualRole';
import {getAsync} from '../utilities/Services';
// import {useAuth} from '../components/Auth';

export default function PostedRoleTable() {
	//TODO: Define the type of roles
	const [managerRoles, setManagerRoles] = useState<any>([]);
	//TODO: Get the manager id from the session
	const manager_id = '1';
	// const session = useAuth();
	// const user = session?.user;

	async function fetchData() {
		const response = await getAsync(
			'api/get_manager_role?manager_id=' + manager_id
		);
		const data = await response.json();
		setManagerRoles(data);
	}

	useEffect(() => {
		setManagerRoles([]);
		fetchData();
	}, []);

	return (
		<table className="w-full mt-5 border border-teal-900 table-auto border-opacity-20">
			<thead className="text-white bg-teal-900">
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
				{managerRoles.map((role: any) => {
					return (
						<ManagerIndividualRole
							key={role.role_id}
							roleName={role.role_name}
							roleID={role.role_id}
							level={role.level}
							country={role.location}
							applicationEndDate={role.appl_close_date}
							noOfApplicants={role.no_of_applicants}
						/>
					);
				})}
			</tbody>
		</table>
	);
}

// export default PostedRoleTable;
