import {useEffect, useState} from 'react';
import ProgressBar from '../components/ProgressBar';
import {getAsync} from '../utilities/Services';
import Badge from '../components/Badge';

export default function ApplicantsDetail() {
	let [applicants, setApplicants] = useState(Object);
	let [skill, setSkill] = useState([]);

	// TODO: Replace with actual applicant ID and role ID

	useEffect(() => {
		getAsync('api/get_staff?staff_id=1')
			.then((res) => res.json())
			.then((data) => {
				setApplicants(data[0]);
			});

		getAsync('api/get_staff_role_skill?staff_id=1&role_id=1')
			.then((res) => res.json())
			.then((data) => {
				setSkill(data);
			});
	}, []);

	return (
		<div>
			Back to Applicants List
			<img
				src="https://images.crunchbase.com/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco,dpr_1/n8xvrnw7kozyb84yjtpu"
				alt={applicants.staff_name}
			/>
			<p>{applicants.staff_name}</p>
			<p>{applicants.curr_role}</p>
			<p>{applicants.curr_dept}</p>
			<h1>Skills-Match %</h1>
			<ProgressBar
				percentage={
					(skill.filter((s: any) => s.qualified).length /
						skill.length) *
					100
				}
			/>
			<h1>Skills</h1>
			{Object.entries(skill).map((item: any) => (
				<Badge
					key={item[1].skill_id}
					styleType={item[1].qualified ? 'green' : 'red'}
				>
					{item[1].skill_name}
				</Badge>
			))}
		</div>
	);
}
