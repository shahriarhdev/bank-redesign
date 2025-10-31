import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBalance } from '../state/BalanceStore';
import { MdCheckCircle } from 'react-icons/md';

function toFa(s) { return String(s).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]); }
function fmt3(v) { const r = String(v ?? '').replace(/[^0-9]/g, ''); return r ? toFa(r.replace(/\B(?=(\d{3})+(?!\d))/g, ',')) : '۰'; }

// زمان به منطقه زمانی تهران با تقویم فارسی
function formatTehran(dt) {
	const time = new Intl.DateTimeFormat('fa-IR', {
		timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
	}).format(dt);
	const date = new Intl.DateTimeFormat('fa-IR', {
		timeZone: 'Asia/Tehran', year: 'numeric', month: '2-digit', day: '2-digit', calendar: 'persian'
	}).format(dt);
	return `${time} ساعت، ${date}`;
}

// استخراج زمان و تاریخ از formatTehran
function extractTimeAndDate(dt) {
	const timeStr = new Intl.DateTimeFormat('fa-IR', {
		timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', hour12: false
	}).format(dt);
	const dateStr = new Intl.DateTimeFormat('fa-IR', {
		timeZone: 'Asia/Tehran', year: 'numeric', month: '2-digit', day: '2-digit', calendar: 'persian'
	}).format(dt);
	// تبدیل به فرمت مورد نیاز: "۱۸:۳۶" و "۱۴۰۴/۰۷/۲۳"
	const time = timeStr.includes(' ') ? timeStr.split(' ')[0] : timeStr;
	const date = dateStr.replace(/[\/\-]/g, '/');
	return { time, date };
}

export default function TransferSuccess() {
	const { state } = useLocation() || {};
	const navigate = useNavigate();
	const { setBalance, addTransaction } = useBalance();

	const amount = Number(state?.amount || 0);
	const shaba = state?.shaba || '';
	const source = state?.sourceCard || '';

useEffect(() => {
    if (amount > 0) {
        const now = new Date();
        const { time, date } = extractTimeAndDate(now);
        const refNumber = 'BCG' + Date.now().toString().slice(-8);

        setBalance(prev => {
            const after = Math.max(0, prev - amount);
            addTransaction({
                title: 'حواله پل',
                type: 'debit',
                amount,
                time,
                date,
                refNumber,
                beforeBalance: prev,
                afterBalance: after,
            });
            return after;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

	const now = new Date();
	const registerAt = formatTehran(now);
	const etaAt = formatTehran(new Date(now.getTime() + 2 * 3600 * 1000));

	return (
		<div className="app" style={{ padding: 16, minHeight: '100vh' }}>
			<div className="topbar" style={{ justifyContent: 'center', position: 'relative' }}>
				<div style={{ 
					position: 'absolute', left: 0, cursor: 'pointer', 
					color: '#ff6a2a', fontWeight: 800,
					padding:'8px 16px', display:'flex', alignItems:'center',
					minWidth:'44px', minHeight:'44px', fontSize:15
				}} onClick={() => navigate('/')}>بستن</div>
				<div style={{ fontWeight: 700 }}>انتقال پول</div>
			</div>

			<div className="card" style={{ background: '#2a3340', borderRadius: 16, padding: '24px 16px', textAlign: 'center', marginTop: 12 }}>
				<div style={{ width: 74, height: 74, borderRadius: '50%', background: '#1f2630', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2ecc71' }}>
					<MdCheckCircle size={44} />
				</div>
				<div style={{ fontWeight: 800, marginBottom: 6 }}>پرداخت موفق</div>
				<div style={{ fontSize: 18, fontWeight: 800, margin: '6px 0' }}>{fmt3(amount)} ریال</div>
			</div>

			<div className="card" style={{ marginTop: 12, borderRadius: 12, padding: 0, overflow: 'hidden' }}>
				<Row label="حساب مبدأ" value={toFa(source)} leftIcon="/bank-meli.png" />
				<Divider />
				<Row label="شبا مقصد" value={toFa(shaba)} />
				<Divider />
				<Row label="زمان ثبت انتقال" value={registerAt} />
				<Divider />
				<Row label="زمان تقریبی واریز از" value="طبق اولین سیکل کاری پایا بعد از واریز" />
				<Divider />
				<Row label="نوع انتقال" value="شبا" />
				<Divider />
				<Row label="کد پیگیری" value={toFa('140408081270947879')} />
			</div>

			<button className="btn" style={{ marginTop: 16 }}>اشتراک گذاری رسید</button>
		</div>
	);
}

function Divider() { return <div className="divider" /> }
function Row({ label, value, leftIcon }) {
	return (
		<div className="row" style={{ justifyContent: 'space-between', padding: '14px 12px' }}>
			<div className="muted">{label}</div>
			<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
				{leftIcon ? <img src={leftIcon} alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} /> : null}
				<div style={{ fontWeight: 700 }}>{value}</div>
			</div>
		</div>
	);
}