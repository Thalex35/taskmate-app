import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Devoirs from "./pages/Devoirs.jsx";
import Login from "./pages/Login.jsx";
import Matieres from "./pages/Matieres.jsx";
import Profile from "./pages/Profile.jsx";
import SignUp from "./pages/SignUp.jsx";
import NewDevoir from "./pages/NewDevoir.jsx";
import NewMatieres from "./pages/NewMatieres.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/devoirs"
          element={
            <Layout>
              <Devoirs />
            </Layout>
          }
        />
        <Route
          path="/matieres"
          element={
            <Layout>
              <Matieres />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout ShowAddBtn={false} showLogout={true}>
              <Profile />
            </Layout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/new-devoir" element={<NewDevoir />} />
        <Route path="/new-matieres" element={<NewMatieres />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
