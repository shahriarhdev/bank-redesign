import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useBalance } from '../state/BalanceStore';

function toPersianDigits(str) { return String(str).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]); }

export default function TransferReview() {
  const { state } = useLocation() || {};
  const navigate = useNavigate();
  const { recipientName, destBankName } = useBalance();
  const [processing, setProcessing] = useState(false);

  const amountFa = state?.amountFa || '';
  const shabaFa = state?.shaba ? toPersianDigits(state.shaba) : '—';
  const sourceFa = state?.sourceCard ? toPersianDigits(state.sourceCard) : '—';
  const bankName = destBankName?.trim() || state?.bankName?.trim() || '—';
      const bankLogo = state?.bankLogo || '';

  function makeInitials(name){
    const s = String(name || '').trim();
    if(!s) return '—';
    const parts = s.split(/\s+/);
    const a = parts[0]?.[0] || '';
    const b = parts[1]?.[0] || '';
    return (a + b) || a || '—';
  }
  function colorFromName(name){
    let h = 0; const str = String(name || 'bank');
    for(let i=0;i<str.length;i++){ h = (h*31 + str.charCodeAt(i)) % 360; }
    return `hsl(${h}, 65%, 45%)`;
  }

  return (
    <div className="app" style={{ padding: 16 }}>
      <div className="topbar" style={{ justifyContent: 'center', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', left: 0, cursor: 'pointer',
          padding:'8px 16px', display:'flex', alignItems:'center',
          minWidth:'44px', minHeight:'44px',
          fontSize:24, fontWeight:700, color:'#fff'
        }} onClick={() => navigate(-1)}>‹</div>
        <div className="title">انتقال پول</div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="muted">حساب مبدأ</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/bank-meli.png" alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} />
            <div>{sourceFa}</div>
          </div>
        </div>
        <div className="divider" />
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="muted">شبا مقصد</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {bankLogo ? (
              <img src={bankLogo} alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} />
            ) : (
              bankName && bankName !== '—' ? (
                <div title={bankName} style={{
                  width:20, height:20, borderRadius:'50%',
                  background: colorFromName(bankName), color:'#fff',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:10, fontWeight:900
                }}>{makeInitials(bankName)}</div>
              ) : null
            )}
            <div>{shabaFa}</div>
          </div>
        </div>
        <div className="divider" />
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="muted">بانک مقصد</div>
          <div>{bankName || '—'}</div>
        </div>
        <div className="divider" />
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="muted">نام گیرنده</div>
          <div>{recipientName || '—'}</div>
        </div>
        <div className="divider" />
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="muted">مبلغ</div>
          <div>{amountFa} ریال</div>
        </div>
      </div>

      <button
        className="btn"
        style={{ marginTop: 16, opacity: processing ? .7 : 1, pointerEvents: processing ? 'none' : 'auto' }}
        onClick={() => {
          if (processing) return;
          setProcessing(true);
          const delayMs = 6500; // ~6.5s processing animation
          window.setTimeout(() => navigate('/transfer/success', { state }), delayMs);
        }}
      >
        {processing ? 'در حال انتقال ...' : 'ادامه'}
      </button>

      {processing && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.45)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999
        }}>
          <div style={{
            background:'#1f2630', border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:16, padding:'18px 22px', display:'flex', flexDirection:'column', alignItems:'center', gap:10
          }}>
            <svg width="56" height="56" viewBox="0 0 44 44" stroke="#ff6a2a">
              <g fill="none" fillRule="evenodd" strokeWidth="4">
                <circle cx="22" cy="22" r="20" strokeOpacity="0.2" />
                <path d="M42 22c0-11.046-8.954-20-20-20" stroke="#ff6a2a">
                  <animateTransform attributeName="transform" type="rotate" from="0 22 22" to="360 22 22" dur="0.9s" repeatCount="indefinite" />
                </path>
              </g>
            </svg>
            <div style={{ fontWeight:800 }}>در حال انتقال وجه...</div>
          </div>
        </div>
      )}
    </div>
  );
}