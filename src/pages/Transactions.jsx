import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineReceipt, MdSearch, MdTune, MdFileDownload } from 'react-icons/md';
import { useBalance } from '../state/BalanceStore';

function toFa(s){ return String(s).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]); }
function formatAmount3(v){
  const r = String(v ?? '').replace(/[^0-9]/g, '');
  return r ? toFa(r.replace(/\B(?=(\d{3})+(?!\d))/g, ',')) : '۰';
}

// تراکنش‌های نمونه اولیه (فقط برای نمایش در اولین بار)
const defaultItems = [
  { id:1, title:'حواله پل', type:'debit', amount:10005000, time:'۱۸:۳۶', date:'۱۴۰۴/۰۷/۲۳', refNumber:'BCG15899' },
  { id:2, title:'اصلاحیه', type:'credit', amount:10005100, time:'۱۸:۳۳', date:'۱۴۰۴/۰۷/۲۳', refNumber:'BCG19300' },
  { id:3, title:'حواله پل', type:'debit', amount:10005100, time:'۱۸:۳۳', date:'۱۴۰۴/۰۷/۲۳', refNumber:'BCG14344' },
  { id:4, title:'اصلاحیه', type:'credit', amount:10005000, time:'۱۸:۳۲', date:'۱۴۰۴/۰۷/۲۳', refNumber:'BCG18268' }
];

export default function Transactions(){
  const navigate = useNavigate();
  const { balance, transactions, sourceCard } = useBalance();
  const [receipt, setReceipt] = useState(null); // آیتم فعال رسید
  const [activeTab, setActiveTab] = useState('rial');
  // شماره کارت مبدأ از استور (بانک ملی به صورت رندوم تولید و ذخیره می‌شود)
  
  // ترکیب تراکنش‌های واقعی با تراکنش‌های پیش‌فرض
  // تراکنش‌های واقعی اول نمایش داده می‌شوند
  const items = [...transactions, ...defaultItems];

  return (
    <div className="app">
      <div className="topbar" style={{ justifyContent:'center', position:'relative' }}>
        <div style={{ 
          position:'absolute', left:0, cursor:'pointer', 
          padding:'8px 16px', display:'flex', alignItems:'center',
          minWidth:'44px', minHeight:'44px',
          fontSize:24, fontWeight:700, color:'#fff'
        }} onClick={()=>navigate(-1)}>‹</div>
        <div className="title">صورتحساب</div>
      </div>

      {/* تب‌ها */}
      <div style={{ display:'flex', gap:24, padding:'0 16px 8px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div
          className={`tab ${activeTab === 'currency' ? 'active' : ''}`}
          onClick={() => setActiveTab('currency')}
          style={{ cursor:'pointer' }}
        >
          صورتحساب ارزی
        </div>
        <div
          className={`tab ${activeTab === 'rial' ? 'active' : ''}`}
          onClick={() => setActiveTab('rial')}
          style={{ cursor:'pointer' }}
        >
          صورتحساب ریالی
        </div>
      </div>

      <div className="screen">
        {/* انتخاب حساب */}
        <div className="card" style={{ marginBottom:12 }}>
          <div className="kicker">حساب</div>
          <div style={{ marginTop:6, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ fontWeight:700 }}>{toFa(sourceCard)}</div>
            <span style={{ color:'#aeb7c2', fontSize:12 }}>▼</span>
          </div>
        </div>

        {/* جستجوی پیشرفته */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <button style={{
            display:'flex', alignItems:'center', gap:6,
            background:'transparent', border:'none', color:'#ff6a2a',
            fontWeight:700, fontSize:14, cursor:'pointer', padding:0
          }}>
            <MdSearch size={18} />
            جستجوی پیشرفته
          </button>
          <div style={{ flex:1 }} />
          <button style={{
            background:'transparent', border:'none', color:'#aeb7c2',
            cursor:'pointer', padding:4
          }}><MdFileDownload size={20} /></button>
          <button style={{
            background:'transparent', border:'none', color:'#aeb7c2',
            cursor:'pointer', padding:4
          }}><MdTune size={20} /></button>
        </div>

        {/* لیست تراکنش‌ها */}
        <div className="list">
          {items.map(it => (
            <TransactionItem key={it.id} {...it} onShowReceipt={()=> setReceipt(it)} />
          ))}
        </div>
      </div>

      {receipt && (
        <ReceiptModal tx={receipt} onClose={()=>setReceipt(null)} />
      )}
    </div>
  );
}

function TransactionItem({ title, type='debit', amount, time, date, refNumber, onShowReceipt }){
  const color = type === 'credit' ? '#2ecc71' : '#ff6a2a';
  const badgeBg = type === 'credit' ? 'rgba(46, 204, 113, 0.12)' : 'rgba(255, 106, 42, 0.12)';
  const channel = title?.includes('پل') ? 'پل' : title?.includes('پایا') ? 'پایا' : 'کارت/سایر';

  return (
    <div className="card" style={{
      background:'transparent', padding:'14px 0',
      borderBottom:'1px solid rgba(255,255,255,0.06)'
    }}>
      {/* سطر اول: عنوان + مبلغ + وضعیت */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ fontWeight:700, fontSize:15 }}>{title}</div>
          <span style={{ background:badgeBg, color, padding:'2px 8px', borderRadius:999, fontSize:12, fontWeight:800 }}>موفق</span>
        </div>
        <div style={{ color, fontWeight:800, fontSize:16 }}>
          {formatAmount3(amount)} ریال
        </div>
      </div>

      {/* سطر دوم: تاریخ/ساعت + کانال */}
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
        <div className="muted">{date}، ساعت {time}</div>
        <div className="muted" style={{ fontSize:12 }}>کانال: {channel}</div>
      </div>

      {/* سطر سوم: کد پیگیری */}
      <div className="muted" style={{ fontSize:13, marginTop:4 }}>
        کد پیگیری: {refNumber}
      </div>

      {/* دکمه رسید */}
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
        <button onClick={onShowReceipt} style={{
          display:'flex', alignItems:'center', gap:6,
          background:'transparent', color:'#ff6a2a', border:'1px solid rgba(255,106,42,0.35)',
          borderRadius:10, padding:'6px 10px', cursor:'pointer'
        }}>
          <MdOutlineReceipt size={18} />
          رسید
        </button>
      </div>
    </div>
  );
}

function ReceiptModal({ tx, onClose }){
  const before = tx.beforeBalance;
  const after = tx.afterBalance;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
      <div className="card" style={{ width:'88%', maxWidth:400, background:'#1f2630', borderRadius:16, padding:'16px 14px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ fontWeight:800 }}>رسید تراکنش</div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color:'#ff6a2a', fontWeight:800, cursor:'pointer' }}>بستن</button>
        </div>

        <Row label="عنوان" value={tx.title} />
        <Divider />
        <Row label="مبلغ" value={`${formatAmount3(tx.amount)} ریال`} highlight />
        <Divider />
        <Row label="تاریخ/ساعت" value={`${tx.date}، ${tx.time}`} />
        <Divider />
        <Row label="کد پیگیری" value={tx.refNumber} mono />
        {before != null && after != null ? (
          <>
            <Divider />
            <Row label="موجودی قبل" value={`${formatAmount3(before)} ریال`} />
            <Divider />
            <Row label="موجودی بعد" value={`${formatAmount3(after)} ریال`} />
          </>
        ) : null}
      </div>
    </div>
  );
}

function Divider(){ return <div className="divider" /> }
function Row({ label, value, highlight, mono }){
  return (
    <div className="row" style={{ justifyContent:'space-between', padding:'10px 4px' }}>
      <div className="muted">{label}</div>
      <div style={{ fontWeight: highlight ? 900 : 700, fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</div>
    </div>
  );
}
