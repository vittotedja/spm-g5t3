import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Auth';  // Adjust the path if needed

export const Navbar: React.FC = () => {
  const { userRole } = useAuth() || {};
//   console.log(userRole)
// console.log('rendering Navbar')
  return (
    <nav className="bg-green p-4 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2 text-white">
            <Link to="/role-listing" >Role Listing</Link>
            {userRole === 'manager' && <Link to="/manager">Manager Page</Link>}
            <Link to="/profile">Profile</Link>
        {/* Add other links as required */}
        </div>
    </nav>
  );
}

export default Navbar;
