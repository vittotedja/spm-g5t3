import PostedRoleTable from '../components/PostedRoleTable';
import withRoleProtection from '../hocs/withRoleProtection';


function ManagerRoleDetails() {
	return (
		<>
			<div className="container mx-auto items-center justify-center h-screen w-4/5">
				<div className="flex flex-row justify-between items-center pt-5 px-3">
					<h1 className="font-bold text-3xl text-start">
						All Posted Role Listings
					</h1>
					<button className="rounded-md bg-emerald-600 text-white font-bold p-3 hover:bg-emerald-800">
						+ Add New Role
					</button>
				</div>

				<div className="flex flex-col items-center justify-center w-full">
					<PostedRoleTable />
				</div>
			</div>
		</>
	);
}

export default withRoleProtection(ManagerRoleDetails, 'manager');
