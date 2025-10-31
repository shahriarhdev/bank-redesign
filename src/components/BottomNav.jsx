import { FaUserCircle } from 'react-icons/fa';
import { MdGridView, MdCreditCard, MdAccountBalance } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate(); // اضافه شد

  return (
    <nav className="bottom-nav">
      <div className="nav-center">
        {/* لوگوی بام را اینجا قرار بده: فایل باید در public/logo-b.png باشد */}
        <img className="logo-img" src="/logo-b.png" alt="bam logo" />
      </div>
      <div className="items">
        <div onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <Item label="پروفایل" Icon={FaUserCircle} />
        </div>
        <Item label="خدمات" Icon={MdGridView} active />
        <Item label="کارت ها" Icon={MdCreditCard} />
        <Item label="حساب ها" Icon={MdAccountBalance} />
      </div>
    </nav>
  );
}

function Item({ label, Icon, active }) {
  return (
    <div className={`nav-item${active ? ' active' : ''}`}>
      <div className="icon"><Icon size={24} /></div>
      <div>{label}</div>
    </div>
  );
}