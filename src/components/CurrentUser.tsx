import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import { useAuth } from '../utilities/Auth';
import { supabase } from '../pages/Login';

export const CurrentUser: React.FC = () => {
    let { user, userRole } = useAuth() || {};
    let [currentUser, setCurrentUser] = useState<any>(null); // Changed Object to null and added a generic type any

    useEffect(() => {
        const fetchStaff = async () => {
            const staff_email = (await supabase.auth.getUser())?.data.user?.email;
            if (staff_email) {
                fetch(`api/get_staff_id?email=${staff_email}`) // Changed to use template literals
                    .then(res => {
                        if (!res.ok) throw new Error("Network response was not ok " + res.statusText);
                        return res.json();
                    })
                    .then(data => {
                        setCurrentUser(data);
                    })
                    .catch(error => console.error('There has been a problem with your fetch operation:', error.message));
            }
        };
        fetchStaff();
    }, []);

    const userName = user?.email || 'User Name';

    return (
        <Link to="/profile" className="flex items-center space-x-2 cursor-pointer hover:underline">
            <Avatar name={userName} size="40" round={true} />
            <div className="text-white">
                <div className="font-bold">{userName}</div>
                <div className="text-sm">{userRole}</div>
            </div>
        </Link>
    );
};

export default CurrentUser;
