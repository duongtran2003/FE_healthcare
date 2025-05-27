import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Dashboard from "./dashboard/Dashboard";
import NotFound from "./notfound/NotFound";
import { ToastContainer } from "react-toastify";
import SpinnerOverlay from "./shared/components/SpinnerOverlay";
import Login from "./login/Login";
import Register from "./register/Register";
import Profile from "./profile/Profile";
import { AnimatePresence } from "framer-motion";
import CreateSchedule from "./schedule/CreateSchedule";
import DoctorSchedule from "./schedule/DoctorSchedule";

function App() {
  return (
    <>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/doctor/create-schedule"
                element={<CreateSchedule />}
              />
              <Route
                path="/doctor/schedules"
                element={<DoctorSchedule />}
              />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="colored"
      />
      <SpinnerOverlay />
    </>
  );
}

export default App;
