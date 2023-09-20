import './App.css';
import {Route, Routes} from 'react-router-dom';
import Profile from './pages/Profile';

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<h1>Home</h1>} />
				<Route path="/login" element={<h1>Login</h1>} />
				<Route path="/profile" element={<Profile />} />
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
