import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import FurnitureDesigner from "./pages/FurnitureDesigner";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {/* For the tempo routes */}
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<FurnitureDesigner />} />

        {/* Add this before the catchall route */}
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}

        {/* Catchall route */}
        <Route path="*" element={<FurnitureDesigner />} />
      </Routes>
    </Suspense>
  );
}

export default App;
