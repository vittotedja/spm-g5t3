import './App.css';
import {Route, Routes} from 'react-router-dom';
import ApplicantsDetail from './pages/ApplicantsDetail';

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<h1>Home</h1>} />
				<Route path="/login" element={<h1>Login</h1>} />
				<Route path="/applicantsdetail" element={<ApplicantsDetail />} />
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
