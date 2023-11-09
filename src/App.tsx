import './App.css';

import {Route, Routes, useLocation} from 'react-router-dom';
import ManagerRoleDetails from './pages/ManagerRoleDetails';
import Profile from './pages/Profile';
import RoleListing from './pages/RoleListing';
import ApplicantDetail from './pages/ApplicantDetail';
import ApplicantsListPage from './pages/ApplicantsListPage';
import RoleDetailsPage from './pages/RoleDetailsPage';
import {Login} from './pages/Login';
import {AuthProvider} from './utilities/Auth';
import RoleProtection from './hocs/withRoleProtection';
import Navbar from './components/Navbar';
import RoleCreation from './pages/RoleCreation';
import ManagerStaffList from './pages/ManagerStaffLlist';
import Error404Page from './pages/Error404';
import {Toaster} from 'react-hot-toast';

function App() {
	const location = useLocation();

	return (
		<>
			<AuthProvider>
				{location.pathname !== '/login' && <Navbar />}
				<div>
					<Toaster position="bottom-right" />
				</div>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="/manager"
						element={
							<RoleProtection requiredRoles={[1, 3, 4]}>
								{(_role) => <ManagerRoleDetails />}
							</RoleProtection>
						}
					/>
					<Route
						path="/manager/role-listing"
						element={
							<RoleProtection requiredRoles={[1, 3, 4]}>
								{(_role) => <RoleCreation />}
							</RoleProtection>
						}
					/>
					<Route
						path="/listing-detail/:listing_id/edit"
						element={
							<RoleProtection requiredRoles={[1, 3, 4]}>
								{(_role) => <RoleCreation />}
							</RoleProtection>
						}
					/>
					<Route
						path="/listing-detail/:listing_id/edit"
						element={
							<RoleProtection requiredRoles={[1, 3, 4]}>
								{(_role) => <RoleCreation />}
							</RoleProtection>
						}
					/>
					<Route
						path="/manager/staff-list"
						element={
							<RoleProtection requiredRoles={[1, 3, 4]}>
								{(_role) => <ManagerStaffList />}
							</RoleProtection>
						}
					/>
					<Route
						path="manager/applicants-list/:listing_id"
						element={
							<RoleProtection requiredRoles={[1, 3, 4]}>
								{(_role) => <ApplicantsListPage />}
							</RoleProtection>
						}
					/>
					<Route
						path="manager/applicants-list/:listing_id/applicant-detail/:application_id"
						element={
							<RoleProtection requiredRoles={[1, 3, 4]}>
								{(_role) => <ApplicantDetail />}
							</RoleProtection>
						}
					/>
					<Route
						path="/profile"
						element={
							<RoleProtection requiredRoles={[1, 2, 3, 4]}>
								{(_role) => <Profile />}
							</RoleProtection>
						}
					/>

					<Route
						path="/"
						element={
							<RoleProtection requiredRoles={[1, 2, 3, 4]}>
								{(_role) => <RoleListing />}
							</RoleProtection>
						}
					/>
					<Route
						path="/listing-detail/:listing_id"
						element={
							<RoleProtection requiredRoles={[1, 2, 3, 4]}>
								{(_role) => <RoleDetailsPage />}
							</RoleProtection>
						}
					/>
					<Route path="*" element={<Error404Page />} />
				</Routes>
			</AuthProvider>
		</>
	);
}

export default App;
