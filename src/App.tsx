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
					<Route path="/" element={<h1>Hello</h1>} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/manager"
						element={
							<RoleProtection requiredRoles={[2]}>
								{(_role) => <ManagerRoleDetails />}
							</RoleProtection>
						}
					/>
					<Route
						path="/manager/rolelisting"
						element={
							<RoleProtection requiredRoles={[2]}>
								{(_role) => <RoleCreation />}
							</RoleProtection>
						}
					/>
					<Route
						path="/manager/stafflist"
						element={
							<RoleProtection requiredRoles={[1, 2]}>
								{(_role) => <ManagerStaffList />}
							</RoleProtection>
						}
					/>
					<Route path="/profile" element={<Profile />} />
					<Route
						path="/applicantdetail"
						element={<ApplicantDetail />}
					/>
					<Route path="/role-listing" Component={RoleListing} />
					<Route
						path="/role-details/:role_ID"
						Component={RoleDetailsPage}
					/>
					<Route
						path="/applicants-list/:role_ID"
						Component={ApplicantsListPage}
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
