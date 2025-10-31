import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../state/BalanceStore';

function toFa(s){ return String(s).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]); }
function toEnFaDigits(s){
  // تبدیل ارقام فارسی به انگلیسی برای ذخیره عددی
  return String(s || '').replace(/[۰-۹]/g, d => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
}

function formatAmountFa(v){
  const only = String(v ?? '').replace(/[^0-9]/g,'');
  if(!only) return '';
  const withSep = only.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return toFa(withSep);
}

export default function Profile(){
  const navigate = useNavigate();
  const {
    balance, setBalance,
    recipientName, setRecipientName,
    destShaba, setDestShaba,
    destBankName, setDestBankName
  } = useBalance();

  const [formBalance, setFormBalance] = useState(formatAmountFa(balance));
  const [formName, setFormName] = useState(recipientName);
  const [formShabaRest, setFormShabaRest] = useState(destShaba.startsWith('IR') ? destShaba.slice(2) : destShaba);
  const [formBank, setFormBank] = useState(destBankName);

  const formShabaDisplay = useMemo(()=>{
    // نمایش فقط اعداد فارسی، IR ثابت
    const onlyDigits = String(formShabaRest).replace(/[^۰-۹0-9]/g,'').replace(/[0-9]/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
    return `IR${onlyDigits}`;
  },[formShabaRest]);

  const onSave = () => {
    const bEn = Number(toEnFaDigits(formBalance).replace(/[^0-9]/g,'') || 0);
    setBalance(bEn);
    setRecipientName(formName.trim());
    setDestShaba(`IR${toEnFaDigits(formShabaRest).replace(/[^0-9]/g,'')}`);
    setDestBankName(formBank.trim());
    navigate(-1);
  };

  return (
    <div className="app" style={{ minHeight:'100vh' }}>
      <div className="topbar" style={{ justifyContent:'center', position:'relative' }}>
        <div style={{ 
          position:'absolute', left:0, cursor:'pointer',
          padding:'8px 16px', display:'flex', alignItems:'center',
          minWidth:'44px', minHeight:'44px',
          fontSize:24, fontWeight:700, color:'#fff'
        }} onClick={()=>navigate(-1)}>‹</div>
        <div className="title">پروفایل</div>
      </div>

      <div className="screen">
        {/* موجودی قابل ویرایش */}
        <div className="field" style={{ marginBottom:12 }}>
          <label>موجودی (ریال)</label>
          <input
            className="input"
            style={{ direction:'rtl' }}
            inputMode="numeric"
            placeholder="مثلاً ۱۰۰۰۰۰۰"
            value={formBalance}
            onChange={e => {
              let v = e.target.value.replace(/[^۰-۹0-9]/g,'');
              v = toEnFaDigits(v); // به انگلیسی
              v = v.replace(/,/g,'');
              setFormBalance(formatAmountFa(v));
            }}
          />
        </div>

        {/* نام گیرنده / صاحب حساب */}
        <div className="field" style={{ marginBottom:12 }}>
          <label>نام گیرنده / صاحب حساب</label>
          <input
            className="input"
            placeholder="نام و نام خانوادگی"
            value={formName}
            onChange={e => setFormName(e.target.value)}
          />
        </div>

        {/* شبا مقصد - IR ثابت */}
        <div className="field" style={{ marginBottom:12 }}>
          <label>شبا مقصد</label>
          <div style={{ position:'relative' }}>
            <span style={{
              position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
              fontWeight:800, color:'#ff6a2a'
            }}>IR</span>
            <input
              className="input"
              dir="ltr"
              style={{ paddingRight:36, letterSpacing:2 }}
              placeholder="شماره شبا (بدون IR)"
              value={formShabaRest}
              onChange={e=>{
                // فقط ارقام فارسی/انگلیسی
                let v = e.target.value.replace(/[^۰-۹0-9]/g,'');
                setFormShabaRest(v);
              }}
              maxLength={24}
            />
          </div>
          <div className="muted" style={{ marginTop:6 }}>نمایش: {formShabaDisplay}</div>
        </div>

        {/* نام بانک مقصد */}
        <div className="field" style={{ marginBottom:16 }}>
          <label>نام بانک مقصد</label>
          <input
            className="input"
            placeholder="مثلاً بانک ملی"
            value={formBank}
            onChange={e => setFormBank(e.target.value)}
          />
        </div>

        <button className="btn" onClick={onSave}>ذخیره</button>
      </div>
    </div>
  );
}