import { useState } from 'react';
import arrowDown from "../assets/down-arrow 1.svg";
import arrowUp from "../assets/down-arrow 2.svg";

const FilterBox = () => {
    const [isSkillsOpen, setSkillsOpen] = useState(false);
    const [isRegionsOpen, setRegionsOpen] = useState(false);
    const [isRoleNameOpen, setRoleNameOpen] = useState(false);
    const [isDepartmentOpen, setDepartmentOpen] = useState(false);

    return (
        <div className="mt-14 border w-64 shadow-md h-min pb-8 rounded-xl">
            <div className="bg-olive-green text-white p-2 mb-4 font-bold rounded-t-xl">
                Filter
            </div>

            <div className="cursor-pointer py-2 flex justify-between px-4" onClick={() => setSkillsOpen(!isSkillsOpen)}>
                Skills
                <img src={isSkillsOpen ? arrowUp : arrowDown}></img>
            </div>
            {isSkillsOpen && (
                <div className="pl-4 py-2">
                    {/* Add your skill checkboxes or items here */}
                </div>
            )}

            <div className="cursor-pointer py-2 flex justify-between px-4" onClick={() => setRegionsOpen(!isRegionsOpen)}>
                Regions
                <img src={isRegionsOpen ? arrowUp : arrowDown}></img>
            </div>
            {isRegionsOpen && (
                <div className="pl-4 py-2">
                    {/* Add your region checkboxes or items here */}
                </div>
            )}

            <div className="cursor-pointer py-2 flex justify-between px-4" onClick={() => setRoleNameOpen(!isRoleNameOpen)}>
                Role Name
                <img src={isRoleNameOpen ? arrowUp : arrowDown}></img>
            </div>
            {isRoleNameOpen && (
                <div className="pl-4 py-2">
                    {/* Add your role name checkboxes or items here */}
                </div>
            )}

            <div className="cursor-pointer py-2 flex justify-between px-4" onClick={() => setDepartmentOpen(!isDepartmentOpen)}>
                Department
                <img src={isDepartmentOpen ? arrowUp : arrowDown}></img>
            </div>
            {isDepartmentOpen && (
                <div className="pl-4 py-2">
                    {/* Add your department checkboxes or items here */}
                </div>
            )}
        </div>
    );
};

export default FilterBox;
