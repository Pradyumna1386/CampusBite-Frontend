import {Routes,Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

function App(){
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>

            <Route path="/menu" element={
                <ProtectedRoute role="STUDENT"><Menu/></ProtectedRoute>
            }/>

            <Route path="/cart" element={
                <ProtectedRoute role="STUDENT"><Cart/></ProtectedRoute>
            }/>

            <Route path="/orders" element={
                <ProtectedRoute role="STUDENT"><MyOrders/></ProtectedRoute>
            }/>

            <Route path="/admin" element={
                <ProtectedRoute role="ADMIN"><Admin/></ProtectedRoute>
            }/>
        </Routes>
    );
}

export default App;