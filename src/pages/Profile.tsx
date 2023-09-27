import{ useEffect, useState } from "react";
import SkillsPill from "../components/SkillsPill";
import ApplicationCard from "../components/ApplicationCard";
import glasswindow_green from "../assets/glasswindow_green.png"
import Modal from "../components/Modal";
import PostButton from "../components/PostButton";

export default function Profile() {
    const staffId = 2
    let [result, setResult] = useState([])
    let [staff, setStaff] = useState({})
    let [skills, setSkills] = useState([])
    let [application, setApplication] = useState([])
//     const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };


    useEffect(() => {
        fetch(`http://localhost:8000/api/profile?staff_id=${staffId}`)
        .then((response) => response.json())
        .then((data) => {
            setResult(data)
            setStaff(data[0])
            setSkills(data[1])
            setApplication(data[2])
            console.log(result)
        })

        // fetch(`http://localhost:8000/api/skills?staff_id=${staffId}`)
        // .then((response) => response.json())
        // .then((data) => {
        //     setSkills(data)
        //     console.log(skills)
        // })
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
                    <p className="font-extrabold text-2xl">{staff.staff_name}</p>
                    <p className="font-bold italic text-base">{staff.curr_role}</p>
                    <p className="font-medium italic text-base">{staff.curr_dept}</p>
                    <p className="font-light italic text-base">{staff.location}</p>
                </div>
            </div>

            <div className="container mt-8">
                <p className='font-extrabold text-left text-2xl mb-3'>Skills</p>
                

                    {skills[0]
                    ?<div className="text-left">{skills.map((sk: object)=> <SkillsPill skill={sk.skill_name}/>)}</div>
                    :<div className="mb-8">
                    <p className="text-emerald-900 font-medium text-xl mb-2">Your skills have not been recorded in the system.</p>
                    <button className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1 text-base font-medium text-slate-50">Contact HR staff</button>
                    </div>}
                </div>
            
            <div className="container mt-8">
                <p className='font-extrabold text-left text-2xl mb-3'>Applied Roles</p>

                {/* NO APPLICATION */}
                {application[0]
                    ? 
                    application.map((appl:object) => (
                        <ApplicationCard application={appl}/>
                    ))
                    
                    : 
                    <div className="mb-8">
                        <p className="text-emerald-900 font-medium text-xl mb-2">You have not applied for any roles.</p>
                        <button className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1 text-base font-medium text-slate-50">Go to Role Listing</button>
                    </div>
                }
                

            </div>

            {/* <div>
                <button onClick={openModal} className="bg-blue-500 text-white py-2 px-4 rounded">
                    Apply
                </button>
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className="text-left">
                        <h2 className="text-2xl mb-4 font-bold">Reason for applying</h2>
                        <form>
                            <textarea className="w-96 ring-2 ring-emerald-900/20 p-2 rounded-lg">Hello</textarea>
                        </form>
                    </div>
                    
                </Modal>
            </div> */}
            
        </div>
        </>
    )
}

