import {Link,useNavigate} from 'react-router-dom';
import {currentUser,logout} from '../utils/auth';
import {useCart} from '../context/CartContext';
export default function Navbar(){const nav=useNavigate();const user=currentUser();const {items}=useCart();return <nav className="navbar"><Link className="brand" to={user?.role==='ADMIN'?'/admin':'/menu'}>Campus<span>Bite</span></Link><div className="navlinks">{user?.role==='ADMIN'?<Link to="/admin">Admin</Link>:<><Link to="/menu">Menu</Link><Link to="/orders">My Orders</Link><Link to="/cart">Cart ({items.reduce((a,x)=>a+x.quantity,0)})</Link></>}<button className="linkbtn" onClick={()=>{logout();nav('/')}}>Logout</button></div></nav>}
