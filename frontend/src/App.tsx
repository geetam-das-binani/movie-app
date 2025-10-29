import { BrowserRouter, Route, Routes } from "react-router-dom";
import Movies from "./components/Movies";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./Protected/ProtectedRoute";
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | {
    name: string;
    email: string;
    id: number;
    createdAt: string;
    updatedAt: string;
  }>(null);
  const fetchLoggedUser = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
      if (!response.ok) {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching logged user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoggedUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-indigo-600 text-lg font-medium animate-pulse">
          Checking authentication...
        </div>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Movies user={user} />
            </ProtectedRoute>
          }
        />
       <Route path="/login" element={<Login setUser={setUser} />} />

        <Route path="/register" element={<Register setUser={setUser} />} />
      </Routes>
       <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
