import React from 'react';
import ProgressBar from './ProgressBar';
import maps_pointer from '../assets/maps_pointer.svg';
import {Link} from 'react-router-dom';
import formatDate from '../utilities/Utiliities';

interface RoleCardProps {
	listing_id: number;
	role_id: number;
	role_name: string;
	listing_location?: string | null;
	role_deadline?: string | null;
	role_department: string;
	role_percentage_match: number;
}

const RoleCard: React.FC<RoleCardProps> = ({
	listing_id,
	role_name,
	role_deadline,
	listing_location,
	role_department,
	role_percentage_match,
}) => {
	var role_deadline_string = formatDate(
		role_deadline ? new Date(role_deadline) : null
	);
	return (
		<Link to={`/listing-detail/${listing_id}`}>
			<div
				className="flex content-center justify-between p-6 my-6 border rounded-lg shadow-md w-100"
				data-testid="role-card"
			>
				<div className="items-center w-48 my-auto text-left">
					<p className="mb-2 text-sm text-gray-500">
						{role_department}
					</p>
					<h2
						className="mb-2 text-xl font-bold"
						data-testid="role-name"
					>
						{role_name}
					</h2>
					{listing_location && (
						<div className="flex justify-start">
							<img src={maps_pointer} className="mr-2"></img>{' '}
							{listing_location}
						</div>
					)}
				</div>
				<div className="flex-col items-center justify-between w-1/2 my-auto mt-3">
					<p className="mb-2">Skill - Match %</p>
					<ProgressBar
						percentage={parseFloat(
							role_percentage_match.toFixed(0)
						)}
					/>
				</div>
				<div className="flex-col items-center pt-3 my-auto">
					<h4 className="mb-2 font-bold">Application Close Date</h4>
					<h2>{role_deadline ? role_deadline_string : 'N.A.'}</h2>
				</div>
			</div>
		</Link>
	);
};

export default RoleCard;
