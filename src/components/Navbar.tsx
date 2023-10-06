import React, {useCallback} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utilities/Auth';  // Adjust the path if needed
import glasswindow_white from '../assets/glasswindow_white.png'
import  { CurrentUser } from '../components/CurrentUser'
import { Button2 } from './ui/button';

export const Navbar: React.FC = () => {
  const { userRole, signOut } = useAuth() || {};
  const location = useLocation()
  const navigate = useNavigate()
  const handleLogout = useCallback(async () => {
    try {
      if(signOut) {
        await signOut?.();
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout Error', error)
    }
  }, [signOut, navigate])

  const showLogoutButton = location.pathname === '/profile' && userRole;  // Adjust the path as needed

//   console.log(userRole)
// console.log('rendering Navbar')
  return (
    <nav className="bg-green p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex-grow-0 flex-shrink-0">
              <img src={glasswindow_white} alt="Brand Logo" className="h-12" />
            </div>

            <div className="flex-grow flex justify-center space-x-48">
              <Link to="/role-listing" className="text-white hover:text-gray-300 transition duration-300">Role Listing</Link>
              {userRole === 'manager' && 
                <Link to="/manager" className="text-white hover:text-gray-300 transition duration-300">Manager Page</Link>
              }
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
