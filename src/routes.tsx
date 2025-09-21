import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "@/pages/App";
import WaitRoom from "@/pages/WaitRoom";
import Game from "./pages/Game";
import PromptSelect from "./pages/promptSelect";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/waitRoom/:roomId" element={<WaitRoom />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="/promptSelect/:gameId" element={<PromptSelect />} />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
