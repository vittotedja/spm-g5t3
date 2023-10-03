import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import ManagerRoleDetails from "./pages/ManagerRoleDetails";
import Profile from "./pages/Profile";
import RoleListing from "./pages/RoleListing";
import ApplicantsListPage from "./pages/ApplicantsListPage";
import RoleDetailsPage from "./pages/RoleDetailsPage";
import { Login } from "./pages/Login";
import { AuthProvider } from "./components/Auth";
import RoleProtection from "./hocs/withRoleProtection";
import RoleDetails from "./pages/RoleDetails";
import Navbar from "./components/Navbar";
import ApplicantsDetail from "./pages/ApplicantsDetail";

function App() {
  const location = useLocation();

  return (
    <>
      <AuthProvider>
        {location.pathname !== "/login" && <Navbar />}
        <Routes>
          <Route path="/" element={<h1>Hello</h1>} />
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
