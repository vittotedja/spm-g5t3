import{ useEffect, useState } from "react";
import ApplicationCard from "../components/ApplicationCard";
import glasswindow_green from "../assets/glasswindow_green.png"
import Badge from "../components/Badge";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

interface Staff{
    staff_id: number;
    staff_name: string;
    curr_role: string;
    curr_dept: string;
    location: string;
}

interface Skill{
    skill_id: number;
    skill_name: string;
    qualified: boolean;
}

interface Application{
    role: {
        role_id: number;
        role_name: string;
        dept: string;
        location: string;
        appl_close_date: string;
      }
      status: string
}

export default function Profile() {
    // TODO: set actual staff ID
    const staffId = 1
    let [staff, setStaff] = useState<Staff>({
        staff_id: 0,
        staff_name: '',
        curr_role: '',
        curr_dept: '',
        location: '',
      });
    let [skills, setSkills] = useState<Skill[]>([])
    let [application, setApplication] = useState<Application[]>([])
    const navigate = useNavigate();
    const roleListingButton = () => {
        navigate('/role-listing');
      };

    useEffect(() => {
        fetch(`http://localhost:8000/api/get_staff?staff_id=${staffId}`)
        .then((response) => response.json())
        .then((data) => {
            setStaff(data[0])
            console.log(staff)
        })

        fetch(`http://localhost:8000/api/get_staff_skill?staff_id=${staffId}`)
        .then((response) => response.json())
        .then((data) => {
            setSkills(data)
            console.log(skills)
        })

        fetch(`http://localhost:8000/api/get_staff_application?staff_id=${staffId}`)
        .then((response) => response.json())
        .then((data) => {
            setApplication(data)
            console.log(application)
        })
    }
    , [])
    return (
        <>
        {/* <Navbar /> */}
        <div className="container mx-auto px-4 mt-10">
            <div className="container flex">
                <div className="w-2/12">
                    <img src={glasswindow_green} width="100px" className="rounded-full"/>
                </div>
                <div className="w-2/3 pl-3 text-left">
                    <p className="font-extrabold text-2xl">{staff.staff_name}</p><br/>
                    <p className="font-bold italic text-base">{staff.curr_role}</p>
                    <p className="font-medium italic text-base">{staff.curr_dept}</p>
                    <p className="font-light italic text-base">{staff.location}</p>
                </div>
            </div>

            <div className="container mt-8">
                <p className='font-extrabold text-left text-2xl mb-3'>Skills</p>
                

                    {skills[0]
                    ?<div className="text-left">{skills.map((sk: {skill_name: string})=> 
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
                    ? <div className="flex">
                    {application.map((appl: {role: {role_id: number, role_name: string, dept: string, location: string, appl_close_date: string}, status: string}) => (
                        <ApplicationCard application={appl} staff_id={staffId} />
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

