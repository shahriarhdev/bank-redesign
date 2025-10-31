import { formatCurrencyRial, relativeBadge } from '../utils/format'

export default function TransactionItem({ title, type='debit', amount=1000000, time='۱۸:۳۶', date='۱۴۰۴/۰۷/۲۳', ref='BCG15899' }){
	return (
		<div className="card" style={{background:'transparent'}}>
			<div className="row">
				<div style={{fontWeight:700}}>{title}</div>
				<div className={`amount ${relativeBadge(type)}`}>{formatCurrencyRial(amount)}</div>
			</div>
			<div className="muted" style={{marginTop:6}}>{time} ساعت • {date}</div>
			<div className="muted" style={{marginTop:6}}>به شماره پیگیری {ref}</div>
		</div>
	)
}


