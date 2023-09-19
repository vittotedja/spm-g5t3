import './App.css';
import {Route, Routes} from 'react-router-dom';
import {Login} from './pages/Login';
import { AuthProvider } from './components/Auth';

function App() {
	return (
		<>
		<AuthProvider>
			<Routes>
				<Route path="/" element={<h1>Home</h1>} />
				<Route path="/login" element={<Login />} />
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
