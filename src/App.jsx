import { Routes, Route } from "react-router-dom";
import {useState, useEffect} from "react";
import {supabase} from "./utils/supabase";
import AdminRoute from "./components/AdminRoute";
import HomePage from "./pages/HomePage";
import PerfumePage from "./pages/PerfumePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";

// Define las rutas publicas y privadas principales de la aplicacion.
export default function App() {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    async function getTodos(){
      const {data : todos} = await supabase.from('todos').select();
      if(todos) setTodos(todos);
      
    }
    getTodos();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/perfumes/:slug" element={<PerfumePage />} />
      <Route path="/acceso" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
