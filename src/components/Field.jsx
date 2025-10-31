export default function Field({ label, placeholder, value, onChange, type='text' }){
	return (
		<div className="field">
			<label>{label}</label>
			<input className="input" type={type} placeholder={placeholder} value={value} onChange={e=>onChange?.(e.target.value)} />
		</div>
	)
}


