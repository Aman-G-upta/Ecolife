import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddActivity from "./pages/AddActivity";
import Leaderboard from "./pages/Leaderboard";
import Challenges from "./pages/Challenges";
import Homee from "./pages/Home";
import { Home } from "lucide-react";
import Profile from "./pages/Profile";
import Scanner from "./pages/Scanner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
      />
      <Routes>


        <Route path="/" element={<Homee />} />
        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* Signup Page */}
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddActivity />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/scanner" element={<Scanner />} />

      </Routes>
    </>
  );
}

export default App;