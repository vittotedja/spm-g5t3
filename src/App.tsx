import './App.css';
import {Route, Routes} from 'react-router-dom';
import ManagerRoleDetails from './pages/ManagerRoleDetails';
import Profile from './pages/Profile';
import RoleDetails from './pages/RoleDetails';
import RoleListing from './pages/RoleListing';


function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<h1>Hello</h1>} />
				<Route path="/login" element={<h1>Login</h1>} />
				<Route path="/manager" element={<ManagerRoleDetails />} />
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
		</>
	);
}

export default App;
