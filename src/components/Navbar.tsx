import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utilities/Auth';  // Adjust the path if needed
import glasswindow_white from '../assets/glasswindow_white.png'
export const Navbar: React.FC = () => {
  const { userRole } = useAuth() || {};
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
              <Link to="/profile" className="text-white hover:text-gray-300 transition duration-300">Profile</Link>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;
