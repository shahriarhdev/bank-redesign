import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCreditCard, MdOutlineQrCodeScanner, MdAdd, MdBusiness } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa";
import { useBalance } from '../state/BalanceStore';
import { toPersianDigits } from '../utils/format';

// فرمت کردن شماره کارت (4 رقم 4 رقم)
function formatCardNumber(card) {
  const cleaned = card.replace(/\D/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ');
}

// تبدیل کارت فارسی به انگلیسی برای ذخیره
function cardToEnglish(val) {
  return val.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
}

// نمایش کارت با اعداد فارسی
function displayCardInput(val) {
  const numOnly = val.replace(/[^۰-۹0-9]/g, "");
  const english = numOnly.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
  const formatted = formatCardNumber(english);
  return toPersianDigits(formatted);
}

// فرمت مبلغ: سه‌رقم‌سه‌رقم + ارقام فارسی
function formatAmountFa(val){
  const onlyDigitsEn = String(val ?? '').replace(/[^0-9]/g,'');
  if(!onlyDigitsEn) return '';
  const withSep = onlyDigitsEn.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return toPersianDigits(withSep);
}

export default function CardToCard() {
  const navigate = useNavigate();
  const { balance } = useBalance();

  // کارت مبدأ ثابت با الگوی 6037 9973 + 8 رقم دلخواه ثابت
  const sourceCardLocal = '6037997345101179';
  const sourceCardFormatted = toPersianDigits(formatCardNumber(sourceCardLocal));
  const sourceBalanceFa = toPersianDigits(balance.toLocaleString('fa-IR'));

  const [destCard, setDestCard] = useState("");
  const [amount, setAmount] = useState("");
  const [showDesc, setShowDesc] = useState(false);
  const [desc, setDesc] = useState("");
  const [depositId, setDepositId] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToastMsg(""), 2500);
  };

  // نمایش مبلغ با جداکننده هزار و ارقام فارسی
  const amountFa = formatAmountFa(amount);

  const handleContinue = () => {
    if (!destCard || destCard.replace(/\D/g, '').length !== 16) {
      return alert("شماره کارت مقصد را کامل وارد کنید (16 رقم).");
    }
    if (!amount) return alert("مبلغ را وارد کنید.");

    const amt = Number(amount || 0);
    if (Number.isNaN(amt) || amt <= 0) return alert("مبلغ نامعتبر است.");
    if (balance < amt) {
      return alert(`عدم موجودی کافی. موجودی: ${toPersianDigits(balance.toLocaleString('fa-IR'))} ریال`);
    }

    // نمایش Toast سقف تراکنش
    showToast("سقف تراکنش روزانه شما به پایان رسیده است");
    return;
  };

  return (
    <div className="app" style={{ minHeight: "100vh", paddingBottom: 24 }}>
      {/* Header with Tabs */}
      <div className="topbar" style={{ justifyContent: "center", position: "relative", paddingTop: 8 }}>
        <div style={{ 
          position: "absolute", left: 0, display: "flex", alignItems: "center", 
          height: "100%", cursor: 'pointer',
          padding:'8px 16px', minWidth:'44px', minHeight:'44px',
          color:'#fff'
        }} onClick={() => navigate(-1)}>
          <FaChevronLeft size={22} />
        </div>
        
        <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-.5px" }}>کارت به کارت</div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: 16, 
        padding: '12px 16px', 
        borderBottom: '1px solid rgba(255,255,255,0.06)' 
      }}>
        <div style={{ 
          color: '#a0a4af', 
          fontSize: 15, 
          fontWeight: 600,
          cursor: 'pointer'
        }} onClick={() => navigate('/')}>
          آنی بام
        </div>
        <div style={{ 
          color: '#fff', 
          fontSize: 15, 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          کارت به کارت
          <span style={{ color: '#a0a4af', fontSize: 18 }}>›</span>
        </div>
      </div>

      <div className="screen" style={{ padding: '0 16px' }}>
        {/* کارت مبدأ */}
        <div style={{ marginTop: 22 }}>
          <label style={{ color: "#a0a4af", fontSize: 13, marginBottom: 8, display: 'block' }}>
            کارت مبدأ
          </label>
          <div style={{
            border: '2px solid #ff3d3d',
            borderRadius: 12,
            padding: "14px 16px",
            background: "#1f2630",
            color: "#fff",
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute', 
              left: 12, 
              top: '50%', 
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontSize: 18,
              color: '#a0a4af'
            }}>
              ▼
            </div>
            <div style={{ fontSize: 18, letterSpacing: 1, fontWeight: 700, marginBottom: 8, paddingRight: 32, textAlign:'left' }} dir="ltr">
              {sourceCardFormatted}
            </div>
            <div style={{ fontSize: 13, color: "#e2e6ee", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ marginRight: 32 }}>مانده : {sourceBalanceFa} ریال</span>
              <div style={{ 
                width: 28, 
                height: 28, 
                borderRadius: '50%', 
                background: '#2a3340',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16
              }}>
                🏦
              </div>
            </div>
          </div>
        </div>

        {/* دکمه اسکن کارت */}
        <div style={{
          marginTop: 16,
          color: "#fc6a1c",
          fontWeight: 700,
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          gap: 7,
          cursor: 'pointer'
        }}>
          <MdOutlineQrCodeScanner size={22} />
          اسکن کارت
        </div>

        {/* اطلاعات مقصد */}
        <div style={{ marginTop: 24 }}>
          <label style={{ color: "#a0a4af", fontSize: 13, marginBottom: 8, display: 'block' }}>
            اطلاعات مقصد
          </label>

          {/* شماره کارت مقصد */}
          <div className="field" style={{ marginBottom: 16, width: "100%" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <MdBusiness style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#a0a4af",
                fontSize: 22,
                zIndex: 2
              }} />
              <input
                className="input"
                dir="ltr"
                style={{
                  width: "100%",
                  paddingRight: 48,
                  fontSize: 15,
                  boxSizing: "border-box",
                  letterSpacing: 2,
                  textAlign: 'right'
                }}
                placeholder="شماره کارت مقصد"
                value={displayCardInput(destCard)}
                onChange={(e) => {
                  let v = e.target.value.replace(/[^۰-۹0-9]/g, "");
                  v = v.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
                  if (v.length <= 16) {
                    setDestCard(v);
                  }
                }}
                maxLength={19} // 16 digit + 3 spaces
              />
            </div>
          </div>

          {/* مبلغ */}
          <div className="field" style={{ marginBottom: 10, width: "100%", position: "relative" }}>
            <input
              className="input"
              type="text"
              style={{
                width: "100%",
                paddingRight: 60,
                paddingLeft: 16,
                paddingTop: 14,
                paddingBottom: 14,
                fontSize: 17,
                fontWeight: 700,
                textAlign: "right",
                boxSizing: "border-box"
              }}
              inputMode="numeric"
              placeholder="مبلغ"
              value={amountFa}
              onChange={(e) => {
                let v = e.target.value.replace(/[^۰-۹0-9]/g, "");
                // تبدیل به انگلیسی
                v = v.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
                // حذف جداکننده‌ها اگر وجود داشت
                v = v.replace(/,/g,'');
                setAmount(v);
              }}
              maxLength={15}
            />
            <span style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a0a4af',
              fontSize: 14,
              pointerEvents: 'none'
            }}>ریال</span>
          </div>
        </div>

        {/* بخش اختیاری */}
        {!showDesc ? (
          <div
            style={{
              marginTop: 16,
              color: "#a0a4af",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer"
            }}
            onClick={() => setShowDesc(true)}
          >
            <MdAdd size={20} />
            <span>درج توضیحات و شناسه واریز (اختیاری)</span>
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <input
              className="input"
              type="text"
              placeholder="توضیحات (اختیاری)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={{ marginBottom: 12, width: "100%" }}
            />
            <input
              className="input"
              type="text"
              placeholder="شناسه واریز (اختیاری)"
              value={depositId}
              onChange={(e) => setDepositId(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
        )}
      </div>

      {/* دکمه ادامه */}
      <div style={{ padding: '0 16px', marginTop: 24 }}>
        <button
          className="btn"
          onClick={handleContinue}
          style={{
            width: "100%",
            background: "#ff6a2a",
            color: "#fff",
            borderRadius: 12,
            padding: "16px",
            fontWeight: 800,
            fontSize: 16,
            border: "none",
            cursor: "pointer"
          }}
        >
          ادامه
        </button>
      </div>
      {toastMsg && (
      <div style={{
          position:'fixed',
          left:'50%',
          top:'50%',
          transform:'translate(-50%, -50%)',
          background:'#2a3340',
          color:'#fff',
          padding:'14px 18px',
          borderRadius:14,
          border:'1px solid rgba(255,255,255,0.12)',
          boxShadow:'0 12px 32px rgba(0,0,0,0.45)',
          fontWeight:800,
          fontSize:16,
          zIndex: 9999,
          pointerEvents:'none'
      }}>
        {toastMsg}
      </div>
      )}
    </div>
  );
}
