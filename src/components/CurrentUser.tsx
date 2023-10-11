import React, {useEffect, useState} from 'react';
import Avatar from 'react-avatar';
import {Link} from 'react-router-dom';
import {useAuth} from '../utilities/Auth';
import {setInitial} from '../utilities/Services';

export const CurrentUser: React.FC = () => {
	const {user} = useAuth() || {};
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	// const [currentRole, setCurrentRole] = useState<any>(null);

	useEffect(() => {
		const fetchStaff = async () => {
			if (user?.email) {
				setLoading(true);
				try {
					setInitial(
						setCurrentUser,
						`api/staff?email=${user.email}`,
						false
					);
				} catch (e) {
					setError('Failed to fetch data');
				} finally {
					setLoading(false);
				}
			}
		};

		fetchStaff();
	}, [user?.email]); // Dependency array

	const userName =
		currentUser?.staff_fname + ' ' + currentUser?.staff_lname ||
		user?.email ||
		'User Name';
	const currentRole = currentUser?.curr_role;
	return loading ? (
		<div className="text-white">Loading...</div>
	) : error ? (
		<div className="text-red-500">{error}</div>
	) : (
		<Link
			to="/profile"
			className="flex items-center space-x-2 cursor-pointer hover:underline"
		>
			<Avatar name={userName} size="40" round={true} />
			<div className="text-white">
				<div className="font-bold">{userName}</div>
				<div className="text-sm">{currentRole}</div>
			</div>
		</Link>
	);
};

export default CurrentUser;
