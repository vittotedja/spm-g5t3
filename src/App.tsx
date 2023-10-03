import './App.css';
import {Route, Routes} from 'react-router-dom';
import ManagerRoleDetails from './pages/ManagerRoleDetails';
import Profile from './pages/Profile';
import RoleDetails from './pages/RoleDetails';
import RoleListing from './pages/RoleListing';
import ApplicantsDetail from './pages/ApplicantsDetail';

import {Login} from './pages/Login';
import { AuthProvider } from './components/Auth';
import RoleProtection from './hocs/withRoleProtection';
import ModalButton from './components/ModalButton';
import { useState } from 'react';

function App() {
	let [modalType, setModalType] = useState("reason")

	return (
		<>
		<AuthProvider>
			<Routes>
				<Route path="/" element={<div>Hello
					{/* Dropdown list to change modal type */}
					<select onChange={(e) => setModalType(e.target.value)}>
						<option value="reason">Reason</option>
						<option value="success">Success</option>
						<option value="fail">Fail</option>
						<option value="confirmation">Confirmation</option>
					</select>
					<ModalButton btnTitle="Apply" type={modalType} message="Thank you for applying to be the next top model">
					</ModalButton>
				</div>} />
				<Route path="/login" element={<Login />} />
				<Route path="/manager" element={
				<RoleProtection requiredRole='manager'> 
					{(_role) => <ManagerRoleDetails />}
				</RoleProtection>} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/applicantsdetail" element={<ApplicantsDetail />} />
				<Route path="/role-listing" Component={RoleListing} />
				<Route path="/role-listing/:role_ID" Component={RoleDetails} />
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
