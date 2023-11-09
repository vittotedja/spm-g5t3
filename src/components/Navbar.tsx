import React, {useCallback, useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../utilities/Auth';
import {CurrentUser} from '../components/CurrentUser';
import {Button2} from './ui/button';
import supabase from '../utilities/supabase';

export const Navbar: React.FC = () => {
	const {userRole, signOut} = useAuth() || {};
	const location = useLocation();
	const navigate = useNavigate();

	const handleLogout = useCallback(async () => {
		try {
			if (signOut) {
				await signOut();
				// Navigation is now handled in the authListener
			}
		} catch (error) {
			console.error('Logout Error', error);
		}
	}, [signOut]);

	const showLogoutButton = location.pathname === '/profile' && userRole; // Adjust the path as needed

	useEffect(() => {
		const {data: authListener} = supabase.auth.onAuthStateChange(
			(event) => {
				// console.log('Auth event:', event);

				// if (event === 'SIGNED_IN') {
				// 	console.log('User signed in!', session?.user);
				// }

				if (event === 'SIGNED_OUT') {
					// console.log('User signed out!');
					navigate('/login');
				}
			}
		);

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, [navigate]);

	return (
		<nav className="p-4 shadow-lg bg-green">
			<div className="container flex items-center justify-between mx-auto">
				<div className="flex-grow-0 flex-shrink-0">
          <Link to="/" data-testid="home-link">
					  <img
              src='https://ujjnudccckrqqtttlkoo.supabase.co/storage/v1/object/public/spm-assets/glasswindow_white.png'
              alt="Brand Logo"
              className="h-12"
					  />
          </Link>
				</div>


        <div className="flex justify-center flex-grow space-x-48">
        {(userRole === 2) && (
						<div
							className="text-white transition duration-300 hover:text-gray-300"
							// data-testid="manager-link"
						>
							GlassWindow
						</div>
					)}
				{/* <div className="flex justify-center flex-grow space-x-48">
					<Link
						to="/"
						className="text-white transition duration-300 hover:text-gray-300"
						data-testid="home-link"
					>
						Role Listing
					</Link> */}
					{(userRole === 1 || userRole === 3 || userRole === 4) && (
						<Link
							to="/manager"
              className={`text-white transition duration-300 hover:text-gray-300 ${location.pathname === '/manager' ? 'underline' : ''}`}
							data-testid="manager-link"
						>
							Manager Page
						</Link>
					)}

          {(userRole === 1 || userRole === 3 || userRole === 4) && (
						<Link
							to="/manager/staff-list"
              className={`text-white transition duration-300 hover:text-gray-300 ${location.pathname === '/manager/staff-list/' ? 'underline' : ''}`}
							// data-testid="manager-link"
						>
							Head Hunt Page
						</Link>
					)}
				</div>

				<div className="flex-grow-0 flex-shrink-0">
					{showLogoutButton ? (
						<Button2
							onClick={handleLogout}
							variant="destructive"
							className="p-2 text-white bg-red-500 rounded"
							data-testid="logout-button"
						>
							Logout
						</Button2>
					) : (
						<CurrentUser />
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
