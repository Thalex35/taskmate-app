import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import PretectedRoute from "./components/Layout/PretectedRoute.jsx";
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
            <PretectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PretectedRoute>
          }
        />
        <Route
          path="/devoirs"
          element={
            <PretectedRoute>
              <Layout>
                <Devoirs />
              </Layout>
            </PretectedRoute>
          }
        />
        <Route
          path="/matieres"
          element={
            <PretectedRoute>
              <Layout>
                <Matieres />
              </Layout>
            </PretectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PretectedRoute>
              <Layout ShowAddBtn={false} showLogout={true} showMode={false}>
                <Profile />
              </Layout>
            </PretectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/new-devoir"
          element={
            <PretectedRoute>
              <Layout ShowAddBtn={false} showMode={false}>
                <NewDevoir />
              </Layout>
            </PretectedRoute>
          }
        />
        <Route
          path="/new-matieres"
          element={
            <PretectedRoute>
              <Layout ShowAddBtn={false} showMode={false}>
                <NewMatieres />
              </Layout>
            </PretectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
