import { Routes, Route, Navigate } from 'react-router';
import Layout from './components/Layout';
import DocPage from './pages/DocPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DocPage pageId="index" />} />
        <Route path=":pageId" element={<DocPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
