import React from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../utilities/Auth'; // Adjust the path if needed
import glasswindow_white from '../assets/glasswindow_white.png';
import {CurrentUser} from '../components/CurrentUser';
export const Navbar: React.FC = () => {
	const {userRole} = useAuth() || {};
	return (
		<nav className="p-4 shadow-lg bg-green">
			<div className="container flex items-center justify-between mx-auto">
				<div className="flex-grow-0 flex-shrink-0">
					<img
						src={glasswindow_white}
						alt="Brand Logo"
						className="h-12"
					/>
				</div>

				<div className="flex justify-center flex-grow space-x-48">
					<Link
						to="/role-listing"
						className="text-white transition duration-300 hover:text-gray-300"
					>
						Role Listing
					</Link>
					{userRole === 1 || userRole === 2 && (
						<Link
							to="/manager"
							className="text-white transition duration-300 hover:text-gray-300"
						>
							Manager Page
						</Link>
					)}
				</div>

				<div className="flex-grow-0 flex-shrink-0">
					<CurrentUser />
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
