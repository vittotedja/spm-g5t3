// import {useState} from 'react';
import Button from '../components/Button';
import PostedRoleTable from '../components/PostedRoleTable';
import {useNavigate} from 'react-router-dom';

function ManagerRoleDetails() {
	//TODO: check whether user is HR or not
	const isHR = true;
	// const [isHR, setIsHR] = useState(true);
	const navigate = useNavigate();

	return (
		<>
			<div className="container items-center justify-center w-4/5 h-screen mx-auto">
				<div className="flex flex-row items-center justify-between px-3 pt-5">
					<h1 className="text-3xl font-bold text-start">
						All Posted Role Listings
					</h1>
					{isHR && (
						<Button
							styleType="green"
							onClick={() => navigate('/manager/rolelisting')}
							className="text-black bg-green"
						>
							+ Add New Role
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
