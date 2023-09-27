import {useEffect, useState} from 'react';
import ManagerIndividualRole from './ManagerIndividualRole';
import {createClient} from '@supabase/supabase-js';

export default function PostedRoleTable() {
	//TODO: Define the type of roles
	const [managerRoles, setManagerRoles] = useState<any>([]);
	//TODO: Get the manager id from the session
	const manager_id = '1';
	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
	const supabase = createClient(supabaseUrl!, supabaseKey!);

	async function fetchData() {
		const {data} = await supabase
			.from('role_manager')
			.select('role_id')
			.eq('manager_id', manager_id);
		for (let i = 0; i < data!.length; i++) {
			const {data: RoleData} = await supabase
				.from('role')
				.select('role_id, role_name, level, location, appl_close_date')
				.eq('role_id', data![i].role_id);
			const {data: ApplicationData} = await supabase
				.from('application')
				.select('*')
				.eq('role_id', data![i].role_id);
			setManagerRoles((managerRoles: any) => [
				...managerRoles,
				{...RoleData![0], no_of_applicants: ApplicationData?.length},
			]);
		}
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
