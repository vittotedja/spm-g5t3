import React, {useEffect, useState} from 'react';
import {FaLocationDot} from 'react-icons/fa6';
import {setInitial} from '../utilities/Services';
import formatDate from '../utilities/Utiliities';
interface RoleDetailsProps {
	listing_id: number | undefined;
}

const RoleDetails: React.FC<RoleDetailsProps> = ({listing_id: listing_id}) => {
	const [roleData, setRoleData] = useState<any>(null);
	const [listingData, setListingData] = useState<any>(null);
	const [loading, setLoading] = useState<any>(null);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			let listingData = await setInitial(
				setListingData,
				`api/listing?listing_id=${listing_id}`,
				false
			);
			setInitial(
				setRoleData,
				`api/role?role_id=${listingData.role_id}`,
				false
			);
		}
		fetchData();
		setLoading(false);
	}, []);

	const vacancy = listingData ? listingData.vacancy : null;
	const location = listingData ? listingData.listing_location : null;

	if (loading) {
		return <div>Loading...</div>;
	}

	if (roleData == null || roleData == undefined) {
		return (
			<div>Error 404 There is no Listing with the ID {listing_id}</div>
		);
	}

	const close_date = formatDate(
		listingData.application_close_date
			? new Date(listingData.application_close_date)
			: null
	);

	return (
		<div className="w-full mb-8 lg:mb-0">
			<section className="rounded-lg mr-2 p-8 min-h-[600px] relative border border-solid border-gray-200">
				<div className="flex flex-col max-w-4xl mx-auto">
					<div className="flex-grow">
						<div className="flex items-start">
							<div className="flex-grow">
								<h2 className="mb-2 text-xl text-left text-gray-600">
									{roleData.role_department}
								</h2>
							</div>
							<div className="ml-4 text-right">
								<h2 className="mb-2 text-gray-600 text-l">
									Application Close Date
								</h2>
								<h2 className="italic font-bold text-l text-emerald-900">
									{close_date}
								</h2>
							</div>
						</div>
						<h2
							className="mb-4 text-3xl font-bold text-left text-gray-800"
							data-testid="role-details-name"
						>
							{roleData.role_name}
						</h2>
						<div className="flex items-center mb-4">
							<FaLocationDot className="mr-2 text-gray-400" />
							<p className="italic text-left text-l text-emerald-900">
								{location}
							</p>
						</div>
						<div className="flex items-center mb-4">
							<p className="mr-6 text-left text-gray-800 text-l">
								Vacancy
							</p>
							<p className="italic text-left text-gray-800 text-l">
								{vacancy}
							</p>
						</div>
						<h3 className="mb-2 text-xl font-bold text-left text-gray-800">
							Description
						</h3>
						<p className="mb-8 text-xl text-left text-gray-600">
							{roleData.role_desc}
						</p>
					</div>
				</div>
			</section>
		</div>
	);
};

export default RoleDetails;
