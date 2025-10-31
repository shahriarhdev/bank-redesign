export function toPersianDigits(input){
	const str = String(input)
	const map = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']
	return str.replace(/[0-9]/g, d => map[Number(d)])
}

export function formatCurrencyRial(value){
	if(value == null || value === '') return ''
	const int = Number(value).toLocaleString('fa-IR')
	return `${int} ریال`
}

export function maskIban(iban){
	if(!iban) return ''
	return iban.replace(/(.{4})/g,'$1 ').trim()
}

export function relativeBadge(type){
	return type === 'credit' ? 'positive' : 'negative'
}


