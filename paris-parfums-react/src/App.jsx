import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PerfumePage from "./pages/PerfumePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/perfumes/:slug" element={<PerfumePage />} />
    </Routes>
  );
}
