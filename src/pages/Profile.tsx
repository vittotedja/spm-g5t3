import{ useEffect, useState } from "react";
import ApplicationCard from "../components/ApplicationCard";
import Badge from "../components/Badge";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { setInitial } from "../utilities/Services";
import { useAuth } from "../utilities/Auth";
import Avatar from 'react-avatar';

interface Staff{
    staff_id: number
    staff_fname: string
    staff_lname: string
    email: string
    dept: string
    country: string
    control_access: number
}

interface Skill{
    skill_id: number
    skill_name: string
    skill_desc: string
}[]

interface Application{
    application_id: number
    applied_at: string
    withdrawn_at: string
    staff_id: number
    application_reason: string
    application_status: 'Applied' | 'Shortlisted' | 'Rejected'
    updated_at: string
    listing_id: number
    listing: {
        listing_id: number;
        role_id: number;
        creation_date: string
        updated_at: string
        deleted_at: string
        updated_from: string
        listing_location: string;
        application_close_date: string;
    }
}[]

export default function Profile() {
    const auth = useAuth();
    const staffId = auth?.staffId;

    let [staff, setStaff] = useState<Staff>(Object);
    let [skills, setSkills] = useState<Skill[]>([])
    let [application, setApplication] = useState<Application[]>([])
    const navigate = useNavigate();
    const roleListingButton = () => {
        navigate('/');
      };

    useEffect(() => {
        setInitial(setStaff, `api/staff?staff_id=${staffId}`, false)
        setInitial(setApplication, `api/application?staff_id=${staffId}`)
        setInitial(setSkills, `api/staff_skill?staff_id=${staffId}`)
    }, [])
    const userName = staff?.staff_fname + ' ' + staff?.staff_lname;
    return (
        <>
        {/* <Navbar /> */}
        <div className="container mx-auto px-4 mt-10">
            <div className="container sm:flex sm:space-x-6">
                <div className="sm:text-left pb-2">
                    <Avatar name={userName} round={true} />
                </div>
                <div className="sm:text-left">
                    <p className="font-extrabold text-2xl">{userName}</p>
                    <p className="font-bold italic text-base">{staff.email}</p>
                    <p className="font-medium italic text-base">{staff.dept}</p>
                    <p className="font-light italic text-base">{staff.country}</p>
                </div>
            </div>

            <div className="container mt-8">
                <p className='font-extrabold text-left text-2xl mb-3'>Skills</p>
                

                    {skills[0]
                    ?<div className="text-left">{skills.map((sk)=> 
                        <Badge key={sk.skill_name} styleType="green">
                        {sk.skill_name}
                    </Badge>
                    )}</div>
                    :<div className="mb-8">
                    <p className="text-emerald-900 font-medium text-xl mb-2">Your skills have not been recorded in the system.</p>
                    <p className="text-emerald-900 font-medium text-md mb-2">Please contact the HR staff at hr@all-in-one.com.</p>
                    
                    </div>}
                </div>
            
            <div className="container mt-8">
                <p className='font-extrabold text-left text-2xl mb-3'>Applied Roles</p>
                
                {/* NO APPLICATION */}
                {application[0]
                    ? <div className="flex flex-col sm:flex-row">
                    {application.map((appl) => (
                        <ApplicationCard key={appl.application_id} application={appl} />
                    ))}
                    </div>
                    : 
                    <div className="mb-8">
                        <p className="text-emerald-900 font-medium text-xl mb-2">You have not applied for any roles.</p>
                        <div className="flex items-center justify-center">
                        <Button styleType={"green"} onClick={roleListingButton}>Go to Role Listing</Button>
                        </div>
                    </div>
                }
                </div>

            
            
        </div>
        </>
    )
}

