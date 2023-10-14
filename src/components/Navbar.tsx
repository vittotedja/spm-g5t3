import React, { useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utilities/Auth';
import glasswindow_white from '../assets/glasswindow_white.png'
import { CurrentUser } from '../components/CurrentUser'
import { Button2 } from './ui/button';
import { supabase } from '../pages/Login'

export const Navbar: React.FC = () => {
  const { userRole, signOut } = useAuth() || {};

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

  const showLogoutButton = location.pathname === '/profile' && userRole;  // Adjust the path as needed

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);

        if (event === 'SIGNED_IN') {
          console.log('User signed in!', session?.user);
        }

        if (event === 'SIGNED_OUT') {
          console.log('User signed out!');
          navigate('/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <nav className="bg-green p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-grow-0 flex-shrink-0">
          <img src={glasswindow_white} alt="Brand Logo" className="h-12" />
        </div>

				<div className="flex justify-center flex-grow space-x-48">
					<Link
						to="/"
						className="text-white transition duration-300 hover:text-gray-300"
					>
						Role Listing
					</Link>
					{(userRole === 1 || userRole === 3 || userRole === 4) && (
						<Link
							to="/manager"
							className="text-white transition duration-300 hover:text-gray-300"
						>
							Manager Page
						</Link>
					)}
				</div>

        <div className="flex-grow-0 flex-shrink-0">
          {showLogoutButton ? (
            <Button2
              onClick={handleLogout}
              variant='destructive'
              className="bg-red-500 text-white p-2 rounded"
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
}

export default Navbar;
