import { Routes, Route, Navigate } from "react-router";
import Layout from "./components/Layout";
import DocPage from "./pages/DocPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/es" replace />} />
      <Route path="/:lang" element={<Layout />}>
        <Route index element={<DocPage pageId="index" />} />
        <Route path=":pageId" element={<DocPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/es" replace />} />
    </Routes>
  );
}

export default App;
