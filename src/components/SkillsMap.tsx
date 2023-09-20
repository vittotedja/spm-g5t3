import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import React, { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar';
import { createClient } from '@supabase/supabase-js'


const supabase = createClient(
'https://wbsagjngbxrrzfktkvtt.supabase.co', 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2Fnam5nYnhycnpma3RrdnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ2NjU0MjcsImV4cCI6MjAxMDI0MTQyN30.X_EkPcpKarJkJk3FYExVrPE3Y73CvOzkP6Yhp0oyC0A')

interface SkillsMapProps {
    staffID: number;
    roleID: number;
}

const SkillsMapComponent: React.FC<SkillsMapProps> = ({ staffID, roleID }) => {
    const [inBothSkills, setInBothSkills] = useState<string[]>([]);
    const [onlyInStaffSkills, setOnlyInStaffSkills] = useState<string[]>([]);
    const [onlyInRoleSkills, setOnlyInRoleSkills] = useState<string[]>([]);
    const [skillsPercentage, setSkillsPercentage] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: staffSkillsIDData, error: error1 } = await supabase
                    .from('staff_skill')
                    .select('skill_id')
                    .eq('staff_id', staffID);
                if (error1) {
                    setError('Error fetching staff skills');
                    setLoading(false);
                    return;
                }

                const staffSkillIDs = staffSkillsIDData.map(row => row.skill_id);

                const { data: StaffSkillsData, error: error2 } = await supabase
                    .from('skill')
                    .select('skill_name')
                    .in('skill_id', staffSkillIDs);

                if (error2) {
                    setError('Error fetching staff skill names');
                    setLoading(false);
                    return;
                }

                console.log(staffSkillIDs)


                const staffSkillsNames = StaffSkillsData.map(row => row.skill_name);

                console.log(staffSkillsNames)

                const { data: roleSkillsIDData, error: error3 } = await supabase
                    .from('role_skill')
                    .select('skill_id')
                    .eq('role_id', roleID);

                if (error3) {
                    setError('Error fetching role skills');
                    setLoading(false);
                    return;
                }

                const roleSkillIDs = roleSkillsIDData.map(row => row.skill_id);

                const { data: RoleSkillsData, error: error4 } = await supabase
                    .from('skill')
                    .select('skill_name')
                    .in('skill_id', roleSkillIDs);

                if (error4) {
                    setError('Error fetching role skill names');
                    setLoading(false);
                    return;
                }

                const roleSkillsNames = RoleSkillsData.map(row => row.skill_name);
                console.log(roleSkillsNames)


                const inBothSkills: string[] = [];
                const onlyInStaffSkills: string[] = [];
                const onlyInRoleSkills: string[] = [];

                const roleSkills = roleSkillsNames;
                const staffSkills = staffSkillsNames;

                for (const skill of staffSkills) {
                    if (roleSkills.includes(skill)) {
                        inBothSkills.push(skill);
                    } else {
                        onlyInStaffSkills.push(skill);
                    }
                }

                for (const skill of roleSkills) {
                    if (!staffSkills.includes(skill)) {
                        onlyInRoleSkills.push(skill);
                    }
                }

                setInBothSkills(inBothSkills);
                setOnlyInStaffSkills(onlyInStaffSkills);
                setOnlyInRoleSkills(onlyInRoleSkills);

                const percentage = parseInt((inBothSkills.length / roleSkills.length * 100).toFixed(0));

                setSkillsPercentage(percentage);
                setLoading(false);
                console.log(inBothSkills)
                console.log(onlyInStaffSkills)
                console.log(onlyInRoleSkills)

            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        }

        fetchData();

    }, [staffID, roleID]);

    if (loading) {
        return <div>Loading</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="w-full lg:w-1/4">
            <section className="py-6 px-8 m-2 rounded-lg border border-solid border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 text-left">Skills Match</h2>
                    <ProgressBar percentage={skillsPercentage} />
                    <div>
                        <h4 className="text-xl font-bold mb-2 text-left pt-4">Required Skills</h4>
                        <ul>
                            {inBothSkills.map((skill, index) => (
                                <li className="flex items-center p-1" style={{ color: '#299B71' }} key={index}>
                                    <AiOutlineCheck className="mr-1" /> {skill}
                                </li>
                            ))}
                            {onlyInRoleSkills.map((skill, index) => (
                                <li className="flex items-center p-1" style={{ color: '#AD0626' }} key={index}>
                                    <AiOutlineClose className="mr-1" /> {skill}
                                </li>
                            ))}
                        </ul>

                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-left pt-4">Your Other Skills</h3>
                        <ul>
                            {onlyInStaffSkills.map((skill, index) => (
                                <li className="text-left p-1" key={index}>
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
            <button className="bg-green-600 text-white py-2 px-6 rounded-md text-lg font-semibold hover:bg-green-800 w-11/12">
  Apply
</button>
        </div>
        
    );
};

export default SkillsMapComponent;
