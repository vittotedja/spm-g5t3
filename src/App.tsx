import './App.css';
import {Route, Routes} from 'react-router-dom';
import ManagerRoleDetails from './pages/ManagerRoleDetails';
import Profile from './pages/Profile';
import RoleDetails from './pages/RoleDetails';
import RoleListing from './pages/RoleListing';

import {Login} from './pages/Login';
import { AuthProvider } from './components/Auth';
import RoleProtection from './hocs/withRoleProtection';

function App() {
	return (
		<>
		<AuthProvider>
			<Routes>
				<Route path="/" element={<h1>Hello</h1>} />
				<Route path="/login" element={<Login />} />
				<Route path="/manager" element={
				<RoleProtection requiredRole='manager'> 
					{(_role) => <ManagerRoleDetails />}
				</RoleProtection>} />
				<Route path="/profile" element={<Profile />} />
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
