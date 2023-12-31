// import {useState} from 'react';
import Button from '../components/Button';
import PostedRoleTable from '../components/PostedRoleTable';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../utilities/Auth';

function ManagerRoleDetails() {
	const {userRole} = useAuth() || {};
	const isHR = userRole === 4;
	// const [isHR, setIsHR] = useState(true);
	const navigate = useNavigate();

	return (
		<>
			<div className="container items-center justify-center w-4/5 h-screen mx-auto">
				<div className="flex flex-row items-center justify-between px-3 pt-5">
					<h1 className="text-3xl font-bold text-start">
						{isHR ? 'All' : 'Your'} Posted Role Listings
					</h1>
					{isHR && (
						<Button
							styleType="green"
							id="add-new-listing"
							onClick={() =>
								navigate('/manager/role-listing', {
									state: {isEdit: false},
								})
							}
							className="text-black bg-green"
						>
							+ Add New Listing
						</Button>
					)}
				</div>

				<div className="flex flex-col items-center justify-center w-full">
					<PostedRoleTable />
				</div>
			</div>
		</>
	);
}

export default ManagerRoleDetails;
