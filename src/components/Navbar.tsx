import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Auth';  // Adjust the path if needed

export const Navbar: React.FC = () => {
  const { userRole } = useAuth() || {};
//   console.log(userRole)
// console.log('rendering Navbar')
  return (
    <nav className="bg-green p-4">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link to="/role-listing" >Role Listing</Link>
        </div>
        {userRole === 'manager' && <Link to="/manager">Manager Page</Link>}
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link to="/profile">Profile</Link>
        </div>
      {/* Add other links as required */}
    </nav>
  );
}

export default Navbar;
