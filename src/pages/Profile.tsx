// import{ useEffect, useState } from "react";

export default function Profile() {
    return (
        <>
        {/* <Navbar /> */}
        <div className="container mx-auto px-4 mt-10">
            <div className="container flex">
                <div className="w-1/3">
                    <img src="../assets/glasswindow_green.png" width="100px" className="rounded-full"/>
                    <p className="p-1">Image</p>
                </div>
                <div className="w-2/3 pl-3 text-left">
                    <p className="font-extrabold text-2xl">Name</p>
                    <p className="font-bold italic text-base">Position</p>
                    <p className="font-medium italic text-base">Department Division</p>
                    <p className="font-light italic text-base">Year of entrance</p>
                </div>
            </div>

            <div className="container mt-8">
                <p className='font-extrabold text-left text-2xl mb-3'>Skills</p>
                <div className="text-left">
                    <span className="inline-flex items-center rounded-md  px-3 py-1 text-base font-medium text-green-600 ring-2 ring-inset ring-emerald-600 mr-2">
                    Leadership
                    </span>
                    <span className="inline-flex items-center rounded-md  px-3 py-1 text-base font-medium text-green-600 ring-2 ring-inset ring-emerald-600 mr-2">
                    Communication
                    </span>
                    <span className="inline-flex items-center rounded-md  px-3 py-1 text-base font-medium text-green-600 ring-2 ring-inset ring-emerald-600 mr-2">
                    Organizational
                    </span>
                </div>
            </div>
            <div className="container mt-8">
                <p className='font-extrabold text-left text-2xl mb-3'>Applied Roles</p>

                {/* NO APPLICATION */}
                <div className="mb-8">
                    <p className="text-emerald-900 font-medium text-xl mb-2">You have not applied for any roles.</p>
                    <button className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1 text-base font-medium text-slate-50">Go to Role Listing</button>
                </div>

            </div>
            <div className="container mt-8 flex">
                {/* CARD */}
                <div className="rounded-lg shadow-md ring-2 ring-outset ring-emerald-900 p-5 w-1/3 text-left">
                <div className="text-left w-48">
                <p className="text-sm text-gray-500 mb-1">Department</p>
                <h2 className="text-xl font-bold mb-1">Role Name</h2>
                <div className="flex justify-start">
                {/* <img src={maps_pointer} className="mr-2"></img>*/}
                Singapore
                </div>

                <div className="w-64 flex-col justify-between items-center mt-3">
                <p className="mb-2 text-sm">Skill - Match %</p>
                {/* <ProgressBar
                    percentage={parseFloat(role_percentage_match.toFixed(0))}
                /> */}
                </div>
                <div className="flex-col items-center pt-3">
                <h4 className="mb-2 text-sm">Level</h4>
                <h2 className="font-bold text-base">Senior</h2>
                </div>
                <div className="flex-col items-center pt-3">
                <h4 className="mb-2 text-sm">Application Close Date</h4>
                <h2 className="font-bold">30th September 2023</h2>
                </div>
                </div>
                </div>

                {/* CARD */}
                <div className="rounded-lg shadow-md ring-2 ring-outset ring-emerald-900 p-5 w-1/3 text-left">
                <div className="text-left w-48">
                <p className="text-sm text-gray-500 mb-1">Department</p>
                <h2 className="text-xl font-bold mb-1">Role Name</h2>
                <div className="flex justify-start">
                {/* <img src={maps_pointer} className="mr-2"></img>*/}
                Singapore
                </div>

                <div className="w-64 flex-col justify-between items-center mt-3">
                <p className="mb-2 text-sm">Skill - Match %</p>
                {/* <ProgressBar
                    percentage={parseFloat(role_percentage_match.toFixed(0))}
                /> */}
                </div>
                <div className="flex-col items-center pt-3">
                <h4 className="mb-2 text-sm">Level</h4>
                <h2 className="font-bold text-base">Senior</h2>
                </div>
                <div className="flex-col items-center pt-3">
                <h4 className="mb-2 text-sm">Application Close Date</h4>
                <h2 className="font-bold">30th September 2023</h2>
                </div>
                </div>
                </div>
            </div>
        </div>
        </>
    )
}

