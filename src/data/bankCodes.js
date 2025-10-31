// فهرست نسبتاً کامل کد بانک‌ها در شبا (IRXX[BBB]...)
// مسیر لوگوها را می‌توانید در پوشه public مطابق فیلد logo قرار دهید
// مثال: public/banks/melli.png

export const bankCodes = [
  { code: '010', name: 'بانک مرکزی', logo: '/banks/cbi.png' },
  { code: '011', name: 'صنعت و معدن', logo: '/banks/sanatmadan.png' },
  { code: '012', name: 'ملت', logo: '/banks/mellat.png' },
  { code: '013', name: 'رفاه کارگران', logo: '/banks/refah.png' },
  { code: '014', name: 'مسکن', logo: '/banks/maskan.png' },
  { code: '015', name: 'سپه', logo: '/banks/sepeh.png' },
  { code: '016', name: 'کشاورزی', logo: '/banks/keshavarzi.png' },
  { code: '017', name: 'ملی', logo: '/banks/melli.png' },
  { code: '018', name: 'تجارت', logo: '/banks/tejarat.png' },
  { code: '019', name: 'صادرات', logo: '/banks/saderat.png' },
  { code: '020', name: 'توسعه صادرات', logo: '/banks/edbi.png' },
  { code: '021', name: 'پست بانک', logo: '/banks/postbank.png' },
  { code: '022', name: 'توسعه تعاون', logo: '/banks/toseetavon.png' },
  { code: '051', name: 'اقتصاد نوین', logo: '/banks/enbank.png' },
  { code: '052', name: 'کارآفرین', logo: '/banks/karafarin.png' },
  { code: '053', name: 'پارسیان', logo: '/banks/parsian.png' },
  { code: '054', name: 'پاسارگاد', logo: '/banks/pasargad.png' },
  { code: '055', name: 'سامان', logo: '/banks/saman.png' },
  { code: '056', name: 'سینا', logo: '/banks/sina.png' },
  { code: '057', name: 'سرمایه', logo: '/banks/sarmaye.png' },
  { code: '058', name: 'شهر', logo: '/banks/shahr.png' },
  { code: '059', name: 'آینده', logo: '/banks/ayandeh.png' },
  { code: '060', name: 'گردشگری', logo: '/banks/gardeshgari.png' },
  { code: '061', name: 'حکمت ایرانیان (ادغام در سپه)', logo: '/banks/hekmat.png' },
  { code: '062', name: 'دی', logo: '/banks/day.png' },
  { code: '063', name: 'خاورمیانه', logo: '/banks/middleeast.png' },
  { code: '064', name: 'ملت؟/مؤسسه — رزرو', logo: '/banks/unknown.png' },
  { code: '065', name: 'قوامین (ادغام در سپه)', logo: '/banks/ghavamin.png' },
  { code: '066', name: 'کوثر (ادغام در سپه)', logo: '/banks/kosar.png' },
  { code: '067', name: 'ملی؟/مؤسسه — رزرو', logo: '/banks/unknown.png' },
  { code: '068', name: 'مهر اقتصاد (ادغام در سپه)', logo: '/banks/mehrEqtesad.png' },
  { code: '069', name: 'انصار (ادغام در سپه)', logo: '/banks/ansar.png' },
  { code: '070', name: 'ایران زمین', logo: '/banks/iranzamin.png' },
  { code: '072', name: 'رسالت', logo: '/banks/Resalat.png' },
  { code: '073', name: 'مهر ایران (قرض‌الحسنه)', logo: '/banks/mehr.png' },
  { code: '078', name: 'نور', logo: '/banks/noor.png' },
  { code: '079', name: 'ملل', logo: '/banks/mellal.png' },
  { code: '080', name: 'پارسیان؟/مؤسسه — رزرو', logo: '/banks/unknown.png' },
  { code: '089', name: 'توسعه (منحل)', logo: '/banks/tosee.png' },
  { code: '090', name: 'قرض‌الحسنه ادغام/سایر', logo: '/banks/unknown.png' },
];

export function detectBankFromIban(iban) {
  if (!iban || typeof iban !== 'string') return null;
  const clean = iban.toUpperCase();
  if (!clean.startsWith('IR') || clean.length < 9) return null;
  const code = clean.substring(4, 7);
  return bankCodes.find(b => b.code === code) || null;
}


