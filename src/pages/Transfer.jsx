import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCreditCard, MdAdd, MdRemoveRedEye, MdOutlineQrCodeScanner } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa";
import { useBalance } from '../state/BalanceStore';
import { bankCodes, detectBankFromIban } from '../data/bankCodes';


// تبدیل به اعداد فارسی
function toPersianDigits(str) {
  return String(str).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

// فرمت مبلغ: سه رقم سه رقم + ارقام فارسی
function formatAmountFa(v){
  const onlyDigitsEn = String(v ?? '').replace(/[^0-9]/g,'');
  if(!onlyDigitsEn) return '';
  const withSep = onlyDigitsEn.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return toPersianDigits(withSep);
}

// نمایش شبا با اعداد فارسی (کاربر فقط عدد وارد می‌کند، IR ثابت است)
function displayShabaInput(val) {
  const numOnly = val.replace(/[^۰-۹0-9]/g, "");
  return toPersianDigits(numOnly);
}

// تشخیص بانک از شبا با دیتای کامل
function detectBankFromShaba(shaba) {
  return detectBankFromIban(shaba);
}

// ساخت نمایه بصری جایگزین وقتی لوگو نداریم
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

export default function Transfer() {
  const navigate = useNavigate();
  const { balance, sourceCard } = useBalance(); // از استور خوانده می‌شود
  const sourceBalanceFa = toPersianDigits(balance.toLocaleString('fa-IR')); // از استور خوانده می‌شود

  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [showRef, setShowRef] = useState(false);
  const [shabaRest, setShabaRest] = useState(""); // کاربر فقط اعداد بعد از IR را وارد می‌کند
  const [showLimits, setShowLimits] = useState(false);
  const [limitsTab, setLimitsTab] = useState('others'); // others | self

  // شبا کامل برای ناوبری
  const shabaFull = "IR" + shabaRest;

  // تشخیص بانک مقصد
  const bankInfo = shabaRest.length >= 9 ? detectBankFromShaba(shabaFull) : null;

// مبلغ با جداکننده هزار و فارسی
const amountFa = formatAmountFa(amount);

  const handleContinue = () => {
    // اعتبارهای ساده
    if (!shabaRest || shabaRest.length < 9) return alert("شماره شبا را کامل وارد کنید.");
    if (!amount) return alert("مبلغ را وارد کنید.");

    navigate("/transfer/review", {
      state: {
        amount,                      // خام (انگلیسی) برای پردازش بعدی
        amountFa,                    // نمایش فارسی
        shaba: shabaFull,            // IR + digits
        sourceCard,                  // مبدأ
        sourceBalanceFa,             // مانده فارسی
        bankName: bankInfo?.name || "",
        bankLogo: bankInfo?.logo || "",
        desc
      }
    });
  };

  return (
    <div className="app" style={{ minHeight: "100vh", paddingBottom: 24 }}>
      {/* Header */}
      <div className="topbar" style={{ justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute", right: 16 }}>
          <button className="btn" style={{
            background: "#ff6a2a", color: "#fff", borderRadius: 14,
            padding: "7px 18px", fontWeight: 700, border: "none", display: "flex", alignItems: "center"
          }}>
            آنی <span style={{ marginLeft: 2, fontWeight: 900 }}>بام</span>
          </button>
        </div>
        <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-.5px" }}>انتقال پول</div>
        <div style={{ 
          position: "absolute", left: 0, display: "flex", alignItems: "center", 
          height: "100%", cursor: 'pointer',
          padding:'8px 16px', minWidth:'44px', minHeight:'44px',
          color:'#fff'
        }} onClick={() => navigate(-1)}>
          <FaChevronLeft size={22} />
        </div>
      </div>

      <div className="screen">
      {/* کارت حساب مبدا */}
      <div style={{
        margin: "22px 0 14px", padding: "12px 14px", borderRadius: 12,
        background: "#273c57", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div>
          <div style={{ fontSize: 18, letterSpacing: 1, fontWeight: 700 }}>{toPersianDigits(sourceCard)}</div>
          <div style={{ fontSize: 13, marginTop: 7, color: "#e2e6ee" }}>مانده: {sourceBalanceFa} ریال</div>
        </div>
        <img src="/bank-meli.png" alt="بانک" style={{ width: 36, height: 36, borderRadius: "50%" }} />
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "16px 0" }} />

      {/* اسکن و اطلاعات مقصد */}
      <div style={{
        margin: "18px 0 8px", color: "#fc6a1c", fontWeight: 700, fontSize: 15,
        display: "flex", alignItems: "center", gap: 7
      }}>
        <MdOutlineQrCodeScanner size={22} />
        اسکن شبا / کارت
      </div>
      <div style={{ color: "#c5c9d1", fontWeight: 600, fontSize: 14, margin: "10px 3px 8px" }}>
        اطلاعات مقصد
      </div>

      {/* شبا با IR ثابت */}
      <div className="field" style={{ marginBottom: 16, width: "100%" }}>
        <label style={{ color: "#a0a4af", fontSize: 13, marginBottom: 4 }}>شماره شبا (IR) مقصد</label>
        <div style={{ position: "relative", width: "100%" }}>
          <span style={{
            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            fontWeight: 800, fontSize: 17, letterSpacing: 2, color: "#ff6a2a", zIndex: 2
          }}>IR</span>

          <input
            className="input"
            dir="ltr"
            style={{
              width: "100%",
              paddingRight: 44,                // جا برای IR
              paddingLeft: bankInfo ? 46 : 14, // جا برای لوگوی بانک
              fontSize: 15,
              boxSizing: "border-box",
              letterSpacing: 2
            }}
            placeholder="مثلا 40031790001000833565"
            value={displayShabaInput(shabaRest)}
            onChange={(e) => {
              let v = e.target.value.replace(/[^۰-۹0-9]/g, "");
              v = v.replace(/[۰-۹]/g, d => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]); // انگلیسی شود، نمایش فارسی
              setShabaRest(v);
            }}
            maxLength={24}
            autoFocus
          />

          {/* آیکون کارت */}
          <MdCreditCard style={{
            position: "absolute", right: 36, top: "50%",
            transform: "translateY(-50%)", fontSize: 22, color: "#ff6a2a"
          }} />

          {/* لوگوی بانک مقصد یا نشان جایگزین */}
          {bankInfo && (
            bankInfo.logo ? (
              <img
                src={bankInfo.logo}
                alt={bankInfo.name}
                title={bankInfo.name}
                style={{
                  position: "absolute", left: 10, top: "50%",
                  transform: "translateY(-50%)", width: 28, height: 28,
                  borderRadius: "50%", background: "transparent"
                }}
              />
            ) : (
              <div
                title={bankInfo.name}
                style={{
                  position: "absolute", left: 10, top: "50%",
                  transform: "translateY(-50%)",
                  width: 28, height: 28, borderRadius: '50%',
                  background: colorFromName(bankInfo.name),
                  color: '#fff', fontWeight: 900, fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >{makeInitials(bankInfo.name)}</div>
            )
          )}
        </div>
      </div>

      {/* مبلغ */}
      <div className="field" style={{ marginBottom: 10, width: "100%" }}>
        <label style={{ color: "#a0a4af", fontSize: 13 }}>مبلغ</label>
        <input
          className="input"
          type="text"
          style={{
            width: "100%",
            direction: "rtl",
            fontSize: 15,
            boxSizing: "border-box",
            borderRadius: 10,
            padding: "13px 16px",
            background: "transparent"
          }}
          inputMode="numeric"
          placeholder="ریال"
          value={amountFa}
          onChange={(e) => {
            let raw = e.target.value.replace(/[^۰-۹0-9]/g, "");
            raw = raw.replace(/[۰-۹]/g, d => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
            raw = raw.replace(/,/g,'');
            setAmount(raw);
          }}
          maxLength={15}
        />
      </div>

      {/* توضیحات */}
      <div className="field" style={{ marginBottom: 6, width: "100%" }}>
        <label style={{ color: "#a0a4af", fontSize: 13 }}>توضیحات (اختیاری)</label>
        <textarea
          className="input"
          style={{
            width: "100%",
            direction: "rtl",
            fontSize: 15,
            borderRadius: 10,
            padding: "13px 16px",
            minHeight: 55,
            boxSizing: "border-box"
          }}
          maxLength={140}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="توضیحات (اختیاری)"
        />
        <div style={{ fontSize: 12, color: "#a0a4af", textAlign: "left" }}>
          تعداد کاراکتر مجاز: ۱۴۰
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "16px 0" }} />

      {/* درج شناسه اختیاری */}
      <div
        style={{
          margin: "12px 0 18px",
          fontSize: 14,
          color: "#ff6a2a",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 4
        }}
        onClick={() => setShowRef((x) => !x)}
      >
        <MdAdd />
        درج شناسه‌ی واریز/برداشت (اختیاری)
      </div>

      {showRef && (
        <div className="field" style={{ marginBottom: 14 }}>
          <input
            className="input"
            style={{ fontSize: 15, width: "100%", direction: "rtl", boxSizing: "border-box" }}
            placeholder="شناسه واریز یا برداشت"
          />
        </div>
      )}

      {/* سقف انتقال پول */}
      <div
        style={{
          background: "#253040",
          padding: "12px 14px",
          borderRadius: 10,
          color: "#fcae60",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "18px 0"
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15 }}>سقف انتقال پول شما</div>
        <span
          style={{
            color: "#fc391c",
            fontWeight: 500,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}
          onClick={() => setShowLimits(true)}
        >
          مشاهده
          <MdRemoveRedEye style={{ marginRight: 2 }} />
        </span>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "16px 0" }} />

      {/* دکمه ادامه */}
      <button
        className="btn"
        style={{
          background: "#ff6a2a",
          color: "#fff",
          borderRadius: 12,
          marginTop: 18,
          fontSize: 18,
          fontWeight: 800,
          width: "100%"
        }}
        onClick={handleContinue}
      >
        ادامه
      </button>
      </div>

      {/* Modal: سقف انتقال پول */}
      {showLimits && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
          <div className="card" style={{ width:'92%', maxWidth:460, borderRadius:14, padding:0, overflow:'hidden' }}>
            {/* Tabs */}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px 0', gap:18 }}>
              <div
                onClick={() => setLimitsTab('self')}
                style={{ flex:1, textAlign:'center', color: limitsTab==='self' ? '#ff6a2a' : '#c1c8d2', fontWeight:800, cursor:'pointer', paddingBottom:8, borderBottom: limitsTab==='self' ? '3px solid #ff6a2a' : '3px solid transparent' }}
              >بین حساب‌های خود</div>
              <div
                onClick={() => setLimitsTab('others')}
                style={{ flex:1, textAlign:'center', color: limitsTab==='others' ? '#ff6a2a' : '#c1c8d2', fontWeight:800, cursor:'pointer', paddingBottom:8, borderBottom: limitsTab==='others' ? '3px solid #ff6a2a' : '3px solid transparent' }}
              >به حساب دیگران</div>
            </div>
            <div style={{ height:1, background:'rgba(255,255,255,0.08)' }} />

            {/* Content */}
            <div style={{ padding:'14px 16px' }}>
              {limitsTab === 'others' ? (
                <>
                  <LimitCard title="سقف انتقال روزانه" limit={2000000000} remain={1000000000} />
                  <LimitCard title="سقف انتقال ماهانه" limit={10000000000} remain={9000000000} />
                </>
              ) : (
                <>
                  <LimitCard title="سقف انتقال روزانه" limit={0} remain={0} />
                  <LimitCard title="سقف انتقال ماهانه" limit={0} remain={0} />
                </>
              )}

              <button
                className="btn"
                onClick={()=> setShowLimits(false)}
                style={{ background:'transparent', color:'#ff6a2a', border:'1px solid rgba(255,106,42,0.35)', marginTop:12 }}
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LimitCard({ title, limit, remain }){
  const toFaLocal = (n) => {
    const s = String(n ?? 0);
    const withSep = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return toPersianDigits(withSep);
  };
  return (
    <div style={{ background:'#1f2630', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'16px 14px', margin:'12px 0' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div style={{ color:'#cbd3dc' }}>{title}</div>
        <div style={{ fontWeight:800 }}>{toFaLocal(limit)} ریال</div>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ color:'#cbd3dc' }}>باقی‌مانده</div>
        <div style={{ fontWeight:800 }}>{toFaLocal(remain)} ریال</div>
      </div>
    </div>
  );
}