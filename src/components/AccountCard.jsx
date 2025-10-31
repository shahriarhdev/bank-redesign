import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toPersianDigits, maskIban } from '../utils/format';
import { MdAccountBalance, MdCreditCard, MdContentCopy, MdOutlineReceiptLong } from "react-icons/md";
import { useBalance } from '../state/BalanceStore';

export default function AccountCard({
  title = 'قرض الحسنه',
  number = '78494486608',
  iban = 'IR980170000000078494486608'
}) {
  const navigate = useNavigate();
  const { balance } = useBalance(); // ← منبع موجودی زنده

  const [copyCard, setCopyCard] = useState(false);
  const [copyIban, setCopyIban] = useState(false);

  const handleCopy = (value, type) => {
    navigator.clipboard.writeText(value);
    if (type === 'card') {
      setCopyCard(true);
      setTimeout(() => setCopyCard(false), 2000);
    } else {
      setCopyIban(true);
      setTimeout(() => setCopyIban(false), 2000);
    }
  };

  return (
    <div className="card" style={{
      background: "linear-gradient(160deg,#1e7bd6,#163a86)",
      borderRadius: 18,
      boxShadow: "0 6px 24px rgba(34,62,110,.15)"
    }}>
      <div className="row" style={{ marginBottom: 10, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <MdAccountBalance size={19} color="#fff" />
          <span className="kicker">{title}</span>
        </div>
        <span className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MdOutlineReceiptLong size={17} style={{ opacity: 0.88 }} />
          ریال
        </span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        color: "#fff", fontWeight: 700, fontSize: 20
      }}>
        <MdCreditCard size={20} />
        {toPersianDigits(number)}
        <span
          style={{ marginRight: 6, cursor: 'pointer', opacity: 0.90, position: 'relative' }}
          title="کپی شماره کارت"
          onClick={() => handleCopy(number, "card")}
        >
          <MdContentCopy size={17} />
          {copyCard && (
            <span style={{
              position: 'absolute',
              top: -28, right: -16,
              background: '#222e47',
              color: '#fff',
              fontSize: 12,
              padding: '2px 10px',
              borderRadius: 8
            }}>کپی شد!</span>
          )}
        </span>
      </div>

      <div style={{
        marginTop: 6, fontSize: 13, color: '#d7deed',
        display: 'flex', alignItems: 'center', gap: 4
      }}>
        <span>{maskIban(iban)}</span>
        <span
          style={{ cursor: "pointer", opacity: 0.83, position: 'relative' }}
          title="کپی شماره شبا"
          onClick={() => handleCopy(iban, "iban")}
        >
          <MdContentCopy size={14} />
          {copyIban && (
            <span style={{
              position: 'absolute',
              top: -24, right: -12,
              background: '#222e47',
              color: '#fff',
              fontSize: 12,
              padding: '2px 10px',
              borderRadius: 8
            }}>کپی شد!</span>
          )}
        </span>
      </div>

      <div style={{
        marginTop: 16,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}>
        <button 
          className="input" 
          style={{
            background: 'rgba(255,255,255,0.09)',
            color: "#fff",
            border: '1px solid #fff',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            alignSelf: 'flex-end',
            marginBottom: 8,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/transactions')}
        >
          <MdOutlineReceiptLong size={18} />
          صورت‌حساب
        </button>
        <div style={{
          width: "auto",
          marginRight: 0,
          marginLeft: "auto",
          display: "block",
          textAlign: "right"
        }}>
          <span
            style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: 'clamp(16px,4vw,22px)',
              letterSpacing: 0.1,
              direction: "rtl"
            }}
          >
            مانده حساب : {toPersianDigits(balance.toLocaleString('fa-IR'))}
          </span>
        </div>
      </div>
    </div>
  );
}