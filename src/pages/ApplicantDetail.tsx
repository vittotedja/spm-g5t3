import { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import { putAsync, setInitial } from "../utilities/Services";
import Badge from "../components/Badge";
import Button from "../components/Button";



export default function ApplicantDetail() {
    const staff_id = 4
    const application_id = 5
    const role_id = 2

    let [applicant, setApplicant] = useState(Object);
    let [skill, setSkill] = useState([]);
    
    useEffect(() => {
        setInitial(setApplicant, `api/get_staff?staff_id=${staff_id}`, false)
        setInitial(setSkill, `api/get_staff_role_skill?staff_id=${staff_id}&role_id=${role_id}`)
    }, []);

    return (
        <div>
            Back to Applicants List
            <img 
                src='https://images.crunchbase.com/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco,dpr_1/n8xvrnw7kozyb84yjtpu' 
                alt={applicant.staff_name} 
            />
            <p>{applicant.staff_name}</p>
            <p>{applicant.curr_role}</p>
            <p>{applicant.curr_dept}</p>

            <h1>Skills-Match %</h1>
            <ProgressBar percentage={skill.filter((s: any) => s.qualified).length/skill.length*100}/>
            
            <h1>Skills</h1>
            {Object.entries(skill).map((item: any) => (
                <Badge key={item[1].skill_id} styleType={item[1].qualified ? "green" : "red"}>
                    {item[1].skill_name}
                </Badge>
            ))}

            <Button styleType="green" onClick={() => putAsync('api/update_application', {application_id: application_id, status: 'Shortlisted'})}>Shortlist</Button>
            <Button styleType="red" onClick={() => putAsync('api/update_application', {application_id: application_id, status: 'Rejected'})}>Reject</Button>
        </div>
    );
}