import ProgressBar from '../components/ProgressBar';
import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {AiOutlineArrowLeft} from 'react-icons/ai';
import {FaLocationDot} from 'react-icons/fa6';
import LoadingState from '../components/loadingState';
import {setInitial} from '../utilities/Services';
import formatDate from '../utilities/Utiliities';
import {useNavigate} from 'react-router-dom';

const ApplicantsListPage = () => {
	const navigate = useNavigate();
	const param = useParams<{listing_id: string}>();
	const [listingData, setListingData] = useState<any>(Object);
	const [applicantsData, setApplicantsData] = useState<any>(Object);
	const [view, setView] = useState<string>('Applied');
	let [loading, setLoading] = useState(true);

	let listing_id: number;

	if (param.listing_id) {
		if (/^\d+$/.test(param.listing_id)) {
			listing_id = parseInt(param.listing_id);
		} else {
			return (
				<div>
					Error 404 There is no Listing with id {param.listing_id}
				</div>
			);
		}
	} else {
		return <div>Error 404</div>;
	}

	useEffect(() => {
		async function fetchData() {
			await setInitial(
				setListingData,
				`api/listing?listing_id=${listing_id}`,
				false
			);
			await setInitial(
				setApplicantsData,
				`api/application?listing_id=${listing_id}`
			);
			setLoading(false);
		}
		fetchData();
	}, []);

	if (!listingData) {
		return (
			<div>Error 404 There is no Listing with the Id {listing_id}</div>
		);
	}

	const role = listingData?.role;

	const roleName = role ? role.role_name : null;
	const roleDept = role ? role.role_department : null;

	let totalRows = 0;

	for (const key in applicantsData) {
		if (applicantsData.hasOwnProperty(key)) {
			totalRows++;
		}
	}

	var close_date = formatDate(
		listingData.application_close_date
			? new Date(listingData.application_close_date)
			: null
	);
	var creation_date = formatDate(
		listingData.creation_date ? new Date(listingData.creation_date) : null
	);

	const selectShortlist = async () => {
		setView('Shortlisted');
	};
	const selectApplicants = async () => {
		setView('Applied');
	};

	return (
		<div className="container mx-auto mt-6">
			<div className="flex items-center justify-between mb-4">
				<button
					className="flex items-center text-emerald-900 hover:underline"
					onClick={() => navigate(`/manager`)}
				>
					<AiOutlineArrowLeft />
					Back to Posted Role Listings
				</button>
			</div>
			{loading ? (
				<LoadingState />
			) : (
				<div className="flex flex-col lg:flex-row">
					<div className="w-full lg lg:mb-0">
						<section className="m-2 mb-10 border border-gray-200 border-solid rounded-lg overflow">
							<div className="flex flex-col max-w-4xl p-8 pb-0 pl-10 lg:flex-row">
								<div className="flex flex-col lg:flex-row">
									<div className="w-full lg:pr-96 lg:mr-60">
										<h2
											className="mb-3 text-3xl font-bold text-left text-gray-800 whitespace-normal max-h-16"
											data-testid="applicantslist-rolename"
										>
											{roleName}
										</h2>
										<p className="mb-1 text-left text-gray-600 text-l whitespace-nowrap">
											{creation_date}
										</p>
										<div className="flex items-center">
											<FaLocationDot className="text-gray-400" />
											<p className="ml-2 italic text-left text-l text-emerald-900">
												{listingData.listing_location}
											</p>
										</div>
									</div>
								</div>
								<div className="w-full p-4 mb-3 lg:mb-0">
									<h3 className="mb-4 text-xl font-bold text-left text-gray-800">
										No of Applicants
									</h3>
									<p className="text-left text-gray-600 text-l">
										{totalRows}
									</p>
								</div>
								<div className="w-full p-4">
									<h3 className="mb-3 text-xl font-bold text-left text-gray-800">
										Department
									</h3>
									<p className="text-left text-gray-600 text-l">
										{roleDept}
									</p>
								</div>
								<div className="w-full p-4">
									<h3 className="mb-3 text-xl font-bold text-left text-gray-800">
										Application Close Date
									</h3>
									<p className="mb-4 italic font-bold text-l text-emerald-900">
										{close_date}
									</p>
								</div>
							</div>
						</section>

						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-start',
								marginBottom: '-1px',
							}}
						>
							<button
								className={`hover:bg-gray-500 ${
									view === 'Applied'
										? 'bg-emerald-900'
										: 'bg-gray-300'
								} text-white py-2 px-6 rounded-md text-lg font-semibold`}
								style={{
									borderBottomRightRadius: '0',
									borderBottomLeftRadius: '0',
									marginLeft: '1px',
								}}
								onClick={selectApplicants}
							>
								Applicants
							</button>
							<button
								className={`hover:bg-gray-500 ${
									view === 'Shortlisted'
										? 'bg-emerald-900'
										: 'bg-gray-300'
								} text-white py-2 px-6 rounded-md text-lg font-semibold`}
								style={{
									borderBottomRightRadius: '0',
									borderBottomLeftRadius: '0',
								}}
								onClick={selectShortlist}
								data-testid="shortlisted-button"
							>
								Shortlisted
							</button>
						</div>
						<div className="overflow-x-auto">
							<div
								className="overflow-hidden border rounded"
								style={{
									borderRadius: '10px',
									border: '1px solid #ccc',
									borderTopLeftRadius: '0',
								}}
							>
								<table
									className="min-w-full border border-collapse"
									style={{
										borderRadius: '10px',
										borderTopLeftRadius: '0',
										overflow: 'hidden',
										border: 'green',
										borderTop: 'none',
									}}
								>
									<thead className="border-b">
										<tr className="text-white bg-emerald-900">
											<th className="p-3">Staff Name</th>
											<th className="p-3">Staff ID</th>
											<th className="p-3">Email</th>
											<th className="p-3">
												Current Department
											</th>
											<th className="p-3">Location</th>
											<th className="p-4">
												Skill Match (%)
											</th>
										</tr>
									</thead>
									{
										<tbody>
											{(() => {
												if (totalRows == 0) {
													return (
														<tr className="border-b">
															<td
																colSpan={7}
																className="p-4 text-center"
															>
																No Applicants
																Yet
															</td>
														</tr>
													);
												} else {
													const rows = [];
													for (
														let i = 0;
														i < totalRows;
														i++
													) {
														const applicant =
															applicantsData[i];
														const staff =
															applicant.staff;
														const applicationId =
															applicant.application_id;
														if (
															applicant.application_status ===
															view
														) {
															rows.push(
																<tr
																	key={i}
																	className="border-b hover:bg-gray-100"
																	data-testid="applicant-row"
																	onClick={() =>
																		navigate(
																			`applicant-detail/${applicationId}`
																		)
																	}
																>
																	<td
																		className="p-2"
																		data-testid="applicants-name"
																	>
																		{
																			staff.staff_fname
																		}{' '}
																		{
																			staff.staff_lname
																		}
																	</td>
																	<td className="p-4">
																		{
																			staff.staff_id
																		}
																	</td>
																	<td className="p-4">
																		{
																			staff.email
																		}
																	</td>
																	<td className="p-4">
																		{
																			staff.dept
																		}
																	</td>
																	<td className="p-4">
																		{
																			staff.country
																		}
																	</td>
																	<td className="p-4">
																		<ProgressBar
																			percentage={
																				applicant.match_percentage
																			}
																		/>
																	</td>
																</tr>
															);
														}
													}
													if (
														!listingData &&
														!applicantsData
													) {
														return (
															<div>
																Loading...
															</div>
														);
													}
													if (rows.length == 0) {
														return (
															<tr
																className="border-b"
																data-testid="applicant-row"
															>
																<td
																	colSpan={7}
																	className="p-4 text-center"
																>
																	No {view}{' '}
																	Applicants
																	Yet
																</td>
															</tr>
														);
													}
													return rows;
												}
											})()}
										</tbody>
									}
								</table>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ApplicantsListPage;
