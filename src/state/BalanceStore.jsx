import { createContext, useContext, useEffect, useState } from 'react';

const BalanceCtx = createContext(null);
const LS_KEY = 'bank_app_state_v1';

function luhnCheckDigit(number15) {
  // expects 15-digit string, returns check digit to make it Luhn-valid
  const digits = number15.split('').map(d => parseInt(d, 10));
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[digits.length - 1 - i];
    if (i % 2 === 0) { // double every second digit from right (since missing last check digit)
      d = d * 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  const mod10 = sum % 10;
  return (10 - mod10) % 10;
}

function generateMelliCard() {
  // Bank Melli BIN: 603799
  const prefix = '603799';
  let body = '';
  for (let i = 0; i < 9; i++) { body += Math.floor(Math.random() * 10); }
  const first15 = prefix + body; // 6 + 9 = 15
  const check = luhnCheckDigit(first15);
  return first15 + String(check);
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return {
      balance: typeof s.balance === 'number' ? s.balance : 153314000,
      recipientName: s.recipientName ?? '',
      destShaba: s.destShaba ?? '',
      destBankName: s.destBankName ?? '',
      transactions: Array.isArray(s.transactions) ? s.transactions : [],
      sourceCard: typeof s.sourceCard === 'string' && s.sourceCard ? s.sourceCard : generateMelliCard(),
    };
  } catch { return null; }
}

export function BalanceProvider({ children }) {
  const initial = loadState() ?? {
    balance: 153314000,
    recipientName: '',
    destShaba: '',
    destBankName: '',
    transactions: [],
    sourceCard: generateMelliCard(),
  };

  const [balance, setBalance] = useState(initial.balance);
  const [recipientName, setRecipientName] = useState(initial.recipientName);
  const [destShaba, setDestShaba] = useState(initial.destShaba);
  const [destBankName, setDestBankName] = useState(initial.destBankName);
  const [transactions, setTransactions] = useState(initial.transactions);
  const [sourceCard, setSourceCard] = useState(initial.sourceCard);

  const tryDebit = (amount) => {
    const amt = Number(amount || 0);
    if (Number.isNaN(amt) || amt <= 0) return false;
    if (balance < amt) return false;
    setBalance(prev => prev - amt);
    return true;
  };

  // persist on any change
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({
      balance, recipientName, destShaba, destBankName, transactions, sourceCard
    }));
  }, [balance, recipientName, destShaba, destBankName, transactions, sourceCard]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  return (
    <BalanceCtx.Provider value={{
      balance, setBalance,
      recipientName, setRecipientName,
      destShaba, setDestShaba,
      destBankName, setDestBankName,
      transactions, addTransaction,
      sourceCard, setSourceCard,
      tryDebit
    }}>
      {children}
    </BalanceCtx.Provider>
  );
}

export function useBalance() {
  const ctx = useContext(BalanceCtx);
  if (!ctx) throw new Error('useBalance must be used inside BalanceProvider');
  return ctx;
}