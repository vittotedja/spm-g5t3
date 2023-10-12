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

function App() {
	const location = useLocation();

	return (
		<>
			<AuthProvider>
				{location.pathname !== '/login' && <Navbar />}
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="/manager"
						element={
							<RoleProtection requiredRoles={[1, 2, 3, 4]}>
								{(_role) => <ManagerRoleDetails />}
							</RoleProtection>
						}
					/>
					<Route
						path="/manager/role-listing"
						element={
							<RoleProtection requiredRoles={[1, 2, 3, 4]}>
								{(_role) => <RoleCreation />}
							</RoleProtection>
						}
					/>
					<Route
						path="/manager/staff-list"
						element={
							<RoleProtection requiredRoles={[1, 2, 3, 4]}>
								{(_role) => <ManagerStaffList />}
							</RoleProtection>
						}
					/>
					<Route path="/profile" element={<Profile />} />
					<Route
						path="/applicant-detail/:application_id"
						element={<ApplicantDetail />}
					/>
					<Route path="/" element={<RoleListing />} />
					<Route
						path="/listing-detail/:listing_id"
						element={<RoleDetailsPage/>}
					/>
					<Route
						path="/applicants-list/:listing_id"
						element={<ApplicantsListPage/>}
					/>

					<Route
						path="*"
						element={
							<h1 className="text-3xl text-center text-red-500">
								404 Not Found
							</h1>
						}
					/>
				</Routes>
			</AuthProvider>
		</>
	);
}

export default App;
