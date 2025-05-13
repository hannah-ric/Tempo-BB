import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import FurnitureDesigner from "./pages/FurnitureDesigner";
import routes from "tempo-routes";
import AdminPanel from "./pages/AdminPanel";
import Home from "./components/home";

function App() {
  // Separate the tempo routes from the main routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {/* For the tempo routes */}
      {tempoRoutes}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/design" element={<FurnitureDesigner />} />
        <Route path="/admin" element={<AdminPanel />} />

        {/* Add this before the catchall route */}
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={<div />} />
        )}

        {/* Catchall route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}

export default App;
