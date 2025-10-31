import { useNavigate } from 'react-router-dom'
import { MdReceipt, MdBolt, MdSyncAlt, MdCreditCard, MdWifi, MdMoreHoriz, MdAssignmentTurnedIn } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { RiBankCardLine } from "react-icons/ri";

const actions = [
	{ id: 'receipt', label: 'قبض', Icon: MdReceipt },
	{ id: 'charge', label: 'شارژ', Icon: MdBolt },
	{ id: 'transfer', label: 'انتقال پول', Icon: MdSyncAlt, to: '/transfer' },
	{ id: 'card2card', label: 'کارت به کارت', Icon: RiBankCardLine, to: '/card-to-card' },
	{ id: 'loan', label: 'تسهیلات', Icon: FaHandshake },
	{ id: 'check', label: 'چک صیادی', Icon: MdAssignmentTurnedIn },
	{ id: 'internet', label: 'بسته اینترنتی', Icon: MdWifi },
	{ id: 'more', label: 'سایر خدمات', Icon: MdMoreHoriz },
]

export default function ActionGrid(){
	const nav = useNavigate()
	return (
		<div className="grid" style={{marginTop:16}}>
			{actions.map(a=> (
				<div key={a.id} onClick={()=> a.to && nav(a.to)} style={{textAlign:'center', cursor:'pointer'}}>
					<div className="iconbtn">
						<a.Icon color="#ff6a2a" size={32} />
					</div>
					<div style={{marginTop:8, fontSize:'15px', color:'#e8edf2', fontWeight:500}}>
						{a.label}
					</div>
				</div>
			))}
		</div>
	)
}