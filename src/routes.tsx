import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "@/pages/App";
import WaitRoom from "@/pages/WaitRoom";

export default function Router() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/waitRoom" element={<WaitRoom />} />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </MemoryRouter>
  );
}
