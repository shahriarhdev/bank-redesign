import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Transfer from './pages/Transfer';
import TransferReview from './pages/TransferReview';
import TransferSuccess from './pages/TransferSuccess';
import Transactions from './pages/Transactions';
import { BalanceProvider } from './state/BalanceStore';

import Profile from './pages/Profile';
import CardToCard from './pages/CardToCard';

export default function App(){
  return (
    <BalanceProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/transfer/review" element={<TransferReview />} />
        <Route path="/transfer/success" element={<TransferSuccess />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/card-to-card" element={<CardToCard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BalanceProvider>
  );
}