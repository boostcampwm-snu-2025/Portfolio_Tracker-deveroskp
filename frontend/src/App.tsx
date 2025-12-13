// React import removed
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Rebalancing from './pages/Rebalancing';

import { PortfolioProvider } from './context/PortfolioContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="rebalancing" element={<Rebalancing />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </QueryClientProvider>
  );
}

export default App;
