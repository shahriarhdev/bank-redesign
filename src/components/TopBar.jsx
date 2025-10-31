import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, right, left, back=false, onBack }){
	const navigate = useNavigate()
	const handleBack = () => {
		if(onBack){ onBack(); return }
		navigate(-1)
	}

	return (
		<div className="topbar">
			<div className="slot">{left}</div>
			<div className="center"><div className="title">{title}</div></div>
			<div className="slot">
				{back ? (
					<button onClick={handleBack} style={{background:'transparent', color:'var(--text)', border:'none', cursor:'pointer', fontSize:18}} aria-label="بازگشت">➤</button>
				) : right}
			</div>
		</div>
	)
}


