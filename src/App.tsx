import './App.css';
import {Route, Routes} from 'react-router-dom';
import TestPage from './pages/TestPage';

function App() {
	return (
		<>
			<Routes>
				<Route path="/" Component={TestPage} />
				<Route path="/login" element={<h1>Login</h1>} />
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
