import TopBar from '../components/TopBar'
import AccountCard from '../components/AccountCard'
import ActionGrid from '../components/ActionGrid'
import BottomNav from '../components/BottomNav'
import { MdFlashOn } from 'react-icons/md';

export default function Home(){
	return (
		<div className="app">
			<TopBar title="بام" right={<span>☰</span>} left={<span>🔔</span>} />
			<div className="screen">
				<AccountCard />
				<h3 style={{margin:'16px 0 8px'}}>خدمات پرکاربرد</h3>
				<ActionGrid />
				{/* بنر تبلیغاتی کوچک زیر خدمات پرکاربرد */}
				<div style={{ marginTop: 12 }}>
					<img
						src="/promo-banner.png.jpg"
						alt="promo"
						style={{ width:'100%', borderRadius:12, display:'block' }}
					/>
				</div>
			</div>
			<div className="fab">
  <MdFlashOn size={22} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
  آنی بام
</div>
			<BottomNav />
		</div>
	)
}