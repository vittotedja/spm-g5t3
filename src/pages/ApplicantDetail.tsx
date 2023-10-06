import { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import { putAsync, setInitial } from "../utilities/Services";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

interface Application {
    application_id: number,
    staff_id: number,
    role_id: number,
    status: string,
    statement: string,
    created_at: string,
    updated_at: string,
}

interface Applicant {
    staff_id: number,
    staff_name: string,
    curr_role: string,
    curr_dept: string,
    location: string
}

interface Skill {
    skill_id: number,
    skill_name: string,
    qualified: boolean,
}[]


export default function ApplicantDetail() {
    const navigate = useNavigate()
    // TODO: get application_id from applicants list page
    const application_id = 1

    let [application, setApplication] = useState<Application>(Object);
    let [applicant, setApplicant] = useState<Applicant>(Object);
    let [skill, setSkill] = useState<Skill[]>([]);
    useEffect(() => {
        async function fetchData() {
            let application = await setInitial(setApplication, `api/get_application?application_id=${application_id}`, false)
            setInitial(setApplicant, `api/get_staff?staff_id=${application.staff_id}`, false)
            setInitial(setSkill, `api/get_staff_role_skill?staff_id=${application.staff_id}&role_id=${application.role_id}`)
        }
        fetchData()
    }, [])


    async function update_application(status: string) {
        let res = await putAsync('api/get_application', {application_id: application_id, status: status})
        res.ok ? setApplication({...application, status: status}) : alert('Error updating application status')
    }

    // TODO: show which role this application is for
    return (
        <>
        {/* <Navbar /> */}
        <div className="container mx-auto px-4 mt-10 text-left w-4/5 flex h-6 space-x-2 cursor-pointer" onClick={() => navigate('/applicants')}>
            <img src="https://wbsagjngbxrrzfktkvtt.supabase.co/storage/v1/object/public/assets/back.png" alt="back"/>
            <p className="font-medium text-md">Back to Applicants List</p>
        </div>

        <div className="container mx-auto px-4 mt-10 w-4/5">
            <div className="container flex">
                <div className="w-2/12">
                    <img src='https://images.crunchbase.com/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco,dpr_1/n8xvrnw7kozyb84yjtpu' alt={applicant.staff_name} width="100px" className="rounded-full"/>
                </div>
                <div className="w-6/12 pl-3 text-left">
                    <p className="font-extrabold text-2xl">{applicant.staff_name}</p>
                    <p className="font-bold italic text-base">{applicant.curr_role}</p>
                    <p className="font-medium italic text-base">{applicant.curr_dept}</p>
                    <p className="font-light italic text-base">{applicant.location}</p>
                </div>
                <div className="w-4/12 text-right flex justify-end space-x-2">
                    {application.status === 'Applied'
                        ? <>
                            <Button styleType="green" onClick={() => update_application('Shortlisted')}>Shortlist</Button>
                            <Button styleType="red" onClick={() => update_application('Rejected')}>Reject</Button>
                          </>
                        : <Badge styleType={application.status === 'Shortlisted' ? "green" : "red"}>{application.status}</Badge>
                    }
                </div>
            </div>

            <div className="container mt-8">
                <p className='font-extrabold text-left text-2xl mb-3'>Skills-Match %</p>
                <ProgressBar percentage={skill.filter((s: any) => s.qualified).length/skill.length*100}/>
            </div>

            <div className="container mt-8">
                <p className='font-extrabold text-left text-2xl mb-3'>Skills</p>
                {skill[0]
                    ? <div className="text-left">
                        {skill.map((sk) => 
                            <Badge key={sk.skill_name} styleType={sk.qualified ? "green" : "red"}>
                                {sk.skill_name}
                            </Badge>
                        )}
                        </div>
                    : <div className="mb-8">
                        <p className="text-emerald-900 font-medium text-xl mb-2">Your skills have not been recorded in the system.</p>
                        <p className="text-emerald-900 font-medium text-md mb-2">Please contact the HR staff at hr@all-in-one.com.</p>
                    </div>
                }
            </div>

            <div className="container mt-8">
                <p className='font-extrabold text-left text-2xl mb-3'>Reason for Applying</p>
                <p className="font-medium text-md text-left">{application.statement}</p>
            </div>        
        </div>
        </>
    );
}