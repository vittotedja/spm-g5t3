import RoleDetails from '../components/RoleDetails';
import SkillsMapComponent from '../components/SkillsMap';
import {useNavigate, useParams} from 'react-router-dom';
import {AiOutlineArrowLeft} from 'react-icons/ai';
import {useState, useEffect} from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import {postAsync, putAsync, setInitial} from '../utilities/Services';
import {useAuth} from '../utilities/Auth';
import LoadingState from '../components/loadingState';

interface Application {
	application_id: number;
	applied_at: string;
	updated_at: string;
	withdrawn_at: string;
	listing_id: number;
	application_reason: string;
	application_status: string;
	staff_id: number;
	listing: {
		listing_id: number;
		role_id: number;
		creation_date: string;
		updated_at: string;
		deleted_at: string;
		updated_from: string;
		listing_location: string;
		application_close_date: string;
		vacancy: number;
	};
}

const RoleDetailsPage = () => {
	//const user.staffId = typeof session?.user === 'string' ? session?.user : undefined;
	//TODO: change staffID to be dynamic
	const auth = useAuth();
	const param = useParams<{listing_id: string}>();
	const [applyLoading, setApplyLoading] = useState<any>(null);
	const [haveAppliedModal, setHaveAppliedModal] = useState(false);
	const [maxLimitModal, setMaxLimitModal] = useState(false);
	const [confirmModal, setConfirmModal] = useState(false);
	const [reasonModal, setReasonModal] = useState(false);
	const [successModal, setSuccessModal] = useState(false);
	const [reason, setReason] = useState<string>('');
	const [listingData, setListingData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [listingApplications, setListingApplications] = useState<
		Application[]
	>([]);
	const [latestApplication, setLatestApplication] =
		useState<Application>(Object);
	const [allApplications, setAllApplications] = useState<Application[]>([]);
	const [appliedCount, setAppliedCount] = useState<number>(0);
	const [withdrawModal, setWithdrawModal] = useState(false);
	const [withdrawSuccessModal, setWithdrawSuccessModal] = useState(false);
	const [rejectionCount, setRejectionCount] = useState<number>(0);
	const staff_id = auth?.staffId;
	const listing_id = parseInt(param?.listing_id ?? '');
	const navigate = useNavigate();
	//error handling the id
	if (isNaN(listing_id)) {
		return <div>Error 404: Invalid Listing Id</div>;
	}

	useEffect(() => {
		async function fetchSecond() {
			await setInitial(
				setListingData,
				`api/listing?listing_id=${listing_id}`,
				false
			);
			await setInitial(
				setListingApplications,
				`api/application?staff_id=${staff_id}&role_id=${listing_id}`,
				true
			);
			await setInitial(
				setAllApplications,
				`api/application?staff_id=${staff_id}`,
				true
			);
			setLoading(false);
		}
		fetchSecond();
	}, []);

	useEffect(() => {
		listingApplications?.length > 0 &&
			setLatestApplication(listingApplications[0]);
		allApplications?.length > 0 &&
			setAppliedCount(
				allApplications?.filter(
					(application) =>
						application.application_status === 'Applied' ||
						application.application_status === 'Shortlisted'
				).length
			);
		allApplications?.length > 0 &&
			setRejectionCount(
				listingApplications?.filter(
					(applicaton) => applicaton.application_status === 'Rejected'
				).length
			);
	}, [allApplications]);

	const handleApply = async () => {
		try {
			setApplyLoading(true);
			if (latestApplication?.application_status === 'Applied') {
				// show have applied modal
				setWithdrawModal(true);
				//check if user applied has reached max limit
			} else if (appliedCount >= 5) {
				// show max limit modal
				setMaxLimitModal(true);
			} else {
				// show reason modal
				setReasonModal(true);
			}
		} catch (error) {
			// Handle any potential errors here
			console.error(error);
		} finally {
			setApplyLoading(false);
		}
	};

	//handle reason submit, before confirm
	const handleReasonSubmit = async (text: string) => {
		setReason(text);
		setConfirmModal(true);
		setReasonModal(false);
	};
	//handle confirm, and insert to db
	const handleConfirm = async () => {
		if (latestApplication.application_status === 'Applied') {
			//withdraw application
			const withdrawResponse = await putAsync('api/application', {
				application_id: latestApplication.application_id,
				application_status: 'Withdrawn',
			});
			const withdrawData = await withdrawResponse.json();
			if (withdrawData) {
				setWithdrawModal(false);
				setWithdrawSuccessModal(true);
			}
		} else {
			const applyResponse = await postAsync('api/application', {
				staff_id: staff_id,
				listing_id: listing_id,
				application_status: 'Applied',
				application_reason: reason,
			});
			const applyData = await applyResponse.json();
			if (applyData) {
				setConfirmModal(false);
				setSuccessModal(true);
			}
		}
	};

	if (!staff_id) {
		return null; // or a loading indicator
	}

	let buttonText;
	let disabled;

	switch (latestApplication?.application_status) {
		case 'Applied':
			if (new Date(listingData?.application_close_date) < new Date()) {
				buttonText = 'Listing Closed';
				disabled = true;
			} else {
				buttonText = 'Withdraw Application';
				disabled = false;
			}
			break;
		case 'Shortlisted':
			buttonText = 'Shortlisted';
			disabled = true;
			break;
		case 'Rejected':
			if (rejectionCount < 3) {
				buttonText = 'Reapply';
				disabled = false;
			} else {
				buttonText = 'Rejected';
				disabled = true;
			}
			break;
		case 'Withdrawn':
			buttonText = 'Previously Withdrawn';
			disabled = true;
			break;
		default:
			if (appliedCount >= 5 && listingApplications?.length === 0) {
				buttonText = 'Maximum Active Applications Reached';
				disabled = true;
			} else if (
				new Date(listingData?.application_close_date) < new Date()
			) {
				buttonText = 'Listing Closed';
				disabled = true;
			} else {
				buttonText = 'Apply';
				disabled = false;
			}
	}

	if (listingData?.listing_id === undefined) {
		return <div>Error 404: Invalid Listing Id</div>;
	} else if (loading) {
		return <LoadingState />;
	} else {
		return (
			<div className="container">
				<div className="flex items-start mb-4 mt-8">
					<button
						className="flex items-center text-emerald-900 hover:underline"
						onClick={() => window.history.back()}
					>
						<AiOutlineArrowLeft />
						{'Back to Previous Page'}
					</button>
				</div>
				{loading ? <LoadingState /> : null}
				{!listingData ? (
					<div>Error 404: Invalid Listing Id</div>
				) : (
					<div className="flex flex-col lg:flex-row">
						<div className="lg:w-5/8">
							<RoleDetails listing_id={listing_id} />
						</div>
						<div className="lg:w-3/8 relative">
							<div className="lg:fixed">
								{listingApplications?.length > 0 &&
								rejectionCount > 0 ? (
									<div className="text-left text-red">
										Rejected Count: {rejectionCount}
									</div>
								) : (
									''
								)}
								<SkillsMapComponent
									staff_id={staff_id}
									listing_id={listing_id}
								/>
								<Button
									styleType={disabled ? 'disabled' : 'green'}
									className="bg-emerald-600 text-white py-2 px-6 mt-4 rounded-md text-lg font-semibold hover:bg-emerald-900 w-full"
									onClick={handleApply}
									loading={applyLoading}
								>
									{buttonText}
								</Button>
							</div>
						</div>
					</div>
				)}
				<Modal
					modalType="fail"
					message="You Have Applied to this Role"
					isOpen={haveAppliedModal}
					onClose={() => setHaveAppliedModal(false)}
				/>
				<Modal
					modalType="fail"
					message="You Have Reached the Maximum Applications Limit "
					isOpen={maxLimitModal}
					onClose={() => setMaxLimitModal(false)}
				/>
				<Modal
					modalType="reason"
					message="Enter your Reason for Applying to this role "
					isOpen={reasonModal}
					onClose={() => setReasonModal(false)}
					onSubmit={handleReasonSubmit}
				></Modal>
				<Modal
					modalType="confirmation"
					message="Are you sure you want to apply to this role?"
					isOpen={confirmModal}
					onClose={() => setConfirmModal(false)}
					onSubmit={handleConfirm}
				></Modal>
				<Modal
					modalType="success"
					message="You have successfully Applied to the Role"
					isOpen={successModal}
					onClose={() => navigate(`/profile`)}
				></Modal>
				<Modal
					modalType="confirmation"
					message="Are you sure you want to withdraw your application? Upon withdrawal, you will not be able to apply to this role again."
					isOpen={withdrawModal}
					onClose={() => setWithdrawModal(false)}
					onSubmit={handleConfirm}
				></Modal>
				<Modal
					modalType="success"
					message="You have successfully withdrawn your application"
					isOpen={withdrawSuccessModal}
					onClose={() => navigate(`/profile`)}
				></Modal>
			</div>
		);
	}
};

export default RoleDetailsPage;
