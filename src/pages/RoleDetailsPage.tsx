import RoleDetails from '../components/RoleDetails';
import SkillsMapComponent from '../components/SkillsMap';
import {useParams} from 'react-router-dom';
import {AiOutlineArrowLeft} from 'react-icons/ai';
import {useState, useEffect} from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import {getAsync, postAsync, setInitial} from '../utilities/Services';
// import {useLocation} from 'react-router-dom';
import {useAuth} from '../utilities/Auth';
import LoadingState from '../components/loadingState';

interface Staff {
	staff_id: number;
	staff_name: string;
	curr_role: string;
	curr_dept: string;
	location: string;
}

const RoleDetailsPage = () => {
	const auth = useAuth();
	const param = useParams<{listing_id: string}>();
	const [applyLoading, setApplyLoading] = useState<any>(null);
	const [haveAppliedModal, setHaveAppliedModal] = useState(false);
	const [maxLimitModal, setMaxLimitModal] = useState(false);
	const [confirmModal, setConfirmModal] = useState(false);
	const [reasonModal, setReasonModal] = useState(false);
	const [successModal, setSuccessModal] = useState(false);
	const [reason, setReason] = useState<string>('');
	const [staff, setStaff] = useState<Staff>(Object);
	const [listingData, setListingData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const staff_email = auth?.user?.email;
	let listing_id;

	//error handling the id
	if (param.listing_id) {
		if (/^\d+$/.test(param.listing_id)) {
			listing_id = parseInt(param.listing_id);
		} else {
			return <div>Error 404: Invalid Listing Id</div>;
		}
	}

	//fetch staff_id
	useEffect(() => {
		async function fetchFirst() {
			setInitial(setStaff, `api/staff?email=${staff_email}`, false);
		}
		fetchFirst();
	}, []);

	const staff_id = staff.staff_id;
	const listing_ID = listing_id;

	useEffect(() => {
		async function fetchSecond() {
			setInitial(
				setListingData,
				`api/listing?listing_id=${listing_ID}`,
				false
			);
			setLoading(false);
		}
		fetchSecond();
	}, []);

	const handleApply = async () => {
		try {
			setApplyLoading(true);
			console.log(listing_ID);
			console.log(staff_id);
			const response = await getAsync(
				`api/application?staff_id=${staff_id}&role_id=${listing_ID}`
			);
			const data = await response.json();
			const response2 = await getAsync(
				`api/application?staff_id=${staff_id}`
			);
			const data2 = await response2.json();
			let appliedCount = 0;
			console.log(data2);
			console.log;
			for (const application of data2) {
				// Use 'of' instead of 'in'
				if (
					application.application_status === 'Applied' ||
					application.application_status === 'Shortlisted'
				) {
					// Use '===' for comparison, and change 'Application' to 'application'
					appliedCount += 1; // Increment applicationCount
				}
			}
			//check if user has applied to this role
			if (data.length > 0) {
				// show have applied modal
				setHaveAppliedModal(true);
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
		const applyResponse = await postAsync('api/application', {
			staff_id: staff_id,
			listing_id: listing_ID,
			application_status: 'Applied',
			application_reason: reason,
		});
		const applyData = await applyResponse.json();
		if (applyData) {
			setConfirmModal(false);
			setSuccessModal(true);
		}
	};

	if (!staff_id) {
		return null; // or a loading indicator
	}

	if (loading) {
		return <LoadingState />;
	}

	return (
		<div className="container">
			<div className="flex items-start mt-8 mb-4">
				<button
					className="flex items-center text-emerald-900 hover:underline"
					onClick={() => window.history.back()}
				>
					<AiOutlineArrowLeft />
					{'Back to Previous Page'}
				</button>
			</div>
			{!listingData ? (
				<div>Error 404: Invalid Listing Id</div>
			) : (
				<div className="flex flex-col lg:flex-row">
					<div className="lg:w-5/8">
						<RoleDetails listing_id={listing_id} />
					</div>
					<div className="relative lg:w-3/8">
						<div className="lg:fixed">
							<SkillsMapComponent
								staff_id={staff_id}
								listing_id={listing_id}
							/>
							<Button
								styleType="green"
								className="w-full px-6 py-2 mt-4 text-lg font-semibold text-white rounded-md bg-emerald-600 hover:bg-emerald-900"
								onClick={handleApply}
								loading={applyLoading}
								id="apply-button"
							>
								Apply
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
				onClose={() => setSuccessModal(false)}
			></Modal>
		</div>
	);
};

export default RoleDetailsPage;
