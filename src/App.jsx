import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import ProtectedRoute from "./components/Layout/ProtectedRoute.jsx";
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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/devoirs"
          element={
            <ProtectedRoute>
              <Layout>
                <Devoirs />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/matieres"
          element={
            <ProtectedRoute>
              <Layout>
                <Matieres />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout ShowAddBtn={false} showLogout={true} showMode={false}>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/new-devoir"
          element={
            <ProtectedRoute>
              <Layout ShowAddBtn={false} showMode={false}>
                <NewDevoir />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-matieres"
          element={
            <ProtectedRoute>
              <Layout ShowAddBtn={false} showMode={false}>
                <NewMatieres />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
