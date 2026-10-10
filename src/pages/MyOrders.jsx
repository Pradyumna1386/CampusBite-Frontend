import {useEffect,useState} from 'react';
import Navbar from '../components/Navbar';
import StatusTracker from '../components/StatusTracker';
import {orderApi,apiError} from '../api/client';
import {currentUser} from '../utils/auth';

export default function MyOrders(){
    const me=currentUser();
    const [orders,setOrders]=useState([]);
    const [error,setError]=useState('');

    async function load(){
        try{
            const r=await orderApi.list();
            setOrders(r.data.filter(o=>o.studentName===me?.name));
        }catch(e){setError(apiError(e))}
    }

    useEffect(()=>{
        load();
        const id=setInterval(load,5000);
        return()=>clearInterval(id);
    },[]);

    return (
        <>
            <Navbar/>
            <main className="container narrow">
                <h1>My Orders</h1>
                {error&&<div className="error">{error}</div>}
                {!orders.length?(
                    <div className="empty">
                        <div>🧾</div>
                        <h2>No orders yet</h2>
                        <p>Your pre-orders will appear here with a live status tracker.</p>
                    </div>
                ):(
                    <div className="orders-list">
                        {orders.map(o=>(
                            <article className="order-card" key={o.id}>
                                <div className="order-top">
                                    <b className="token">{o.orderNumber}</b>
                                    <span className={`status ${o.status.toLowerCase()}`}>{o.status}</span>
                                </div>
                                <p className="order-meta">Pickup {o.pickupTime} · ₹{Number(o.total).toFixed(2)}</p>
                                <small>{o.items.map(i=>`${i.name} × ${i.quantity}`).join(', ')}</small>
                                <StatusTracker status={o.status}/>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}