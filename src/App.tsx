import './App.css';
import {Route, Routes, useLocation} from 'react-router-dom';
import ManagerRoleDetails from './pages/ManagerRoleDetails';
import Profile from './pages/Profile';
import RoleDetails from './pages/RoleDetails';
import RoleListing from './pages/RoleListing';
import {Login} from './pages/Login';
import {AuthProvider} from './utilities/Auth';
import RoleProtection from './hocs/withRoleProtection';
import Navbar from './components/Navbar';
import ApplicantDetail from './pages/ApplicantDetail';
import { useState } from 'react';
import ModalButton from './components/ModalButton';

function App() {
	const location = useLocation();

	return (
		<>
			<AuthProvider>
				{location.pathname !== '/login' && <Navbar />}
				<Routes>
					<Route path="/" element={
						<div>
							Hello
							<ModalButton btnTitle="Apply" type="reason" message="Thank you for choosing airasia" />
						</div>
					} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/manager"
						element={
							<RoleProtection requiredRole="manager">
								{(_role) => <ManagerRoleDetails />}
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
						path="/role-listing/:role_ID"
						Component={RoleDetails}
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
