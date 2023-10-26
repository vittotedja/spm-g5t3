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
	const [staff, setStaff] = useState<any>(Object);
	const staff_email = user?.email;
	// console.log(staffId)
	useEffect(() => {
		if (staff_email) {
			setInitial(setStaff, `api/staff?email=${staff_email}`, false);
		}
		const fetchStaff = async () => {
			if (staff_email) {
				setLoading(true);
				try {
					setInitial(
						setCurrentUser,
						`api/staff?email=${staff_email}`,
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
		console.log(currentUser)
	}, [user?.email]); // Dependency array

	const userName = staff?.staff_fname + ' ' + staff?.staff_lname;
	const currentDept = currentUser?.dept;
	return loading ? (
		<div className="text-white">Loading...</div>
	) : error ? (
		<div className="text-red-500">{error}</div>
	) : (
		<Link
			to="/profile"
			className="flex items-center space-x-2 cursor-pointer hover:underline"
			data-testid="current-user"
		>
			<Avatar name={userName} size="40" round={true} />
			<div className="text-white">
				<div className="font-bold">{userName}</div>
				<div className="text-sm">{currentDept}</div>
			</div>
		</Link>
	);
};

export default CurrentUser;
