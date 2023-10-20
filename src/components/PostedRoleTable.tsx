import {useEffect, useState} from 'react';
import ManagerIndividualRole from './ManagerIndividualRole';
import {getAsync} from '../utilities/Services';
import {useAuth} from '../utilities/Auth';
import formatDate from '../utilities/Utiliities';

export default function PostedRoleTable() {
	const [managerListing, setManagerListing] = useState<any>([]);

	const {staffId, userRole} = useAuth() || {};
	const manager_id = staffId;

	async function fetchData() {
		if (userRole === 4) {
			var response = await getAsync('api/listing');
		} else {
			var response = await getAsync(
				'api/listing_manager?manager_id=' + manager_id
			);
		}
		const data = await response.json();
		const tempManagerListing: any = [];
		for (let i = 0; i < data.length; i++) {
			const listingId = data[i].listing_id;
			const listingResponse = await getAsync(
				'api/listing?listing_id=' + listingId
			);
			const listingData = await listingResponse.json();
			tempManagerListing.push(listingData[0]);
		}
		setManagerListing(tempManagerListing);
	}

	useEffect(() => {
		setManagerListing([]);
		fetchData();
	}, []);

	if (managerListing != null && managerListing.length > 0) {
		return (
			<table className="w-full mt-5 border border-teal-900 table-auto border-opacity-20">
				<thead className="text-white bg-teal-900">
					<tr className="">
						<th className="py-2">Role Name</th>
						<th>Role Id</th>
						<th>No. of Applicants</th>
						<th>Vacancy</th>
						<th>Application Close Date</th>
						<th> </th>
						<th> </th>
					</tr>
				</thead>
				<tbody>
					{managerListing.map((listing: any) => {
						return (
							<ManagerIndividualRole
								isDisabled={
									new Date(listing.application_close_date) <
									new Date()
								}
								key={listing.listing_id}
								listing_id={listing.listing_id}
								roleName={listing.role.role_name}
								roleID={listing.role_id}
								applicationEndDate={
									listing.application_close_date
								}
								vacancy={listing.vacancy}
								noOfApplicants={listing.application.length}
							/>
						);
					})}
				</tbody>
			</table>
		);
	}
	return (
		<div>
			<p className="text-xl font-bold">You have no open Role Listing</p>
		</div>
	);
}
