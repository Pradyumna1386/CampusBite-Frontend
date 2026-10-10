import {useEffect,useRef,useState} from 'react';
import Navbar from '../components/Navbar';
import {foodApi,apiError} from '../api/client';
import {useCart} from '../context/CartContext';
import {useToast} from '../components/ToastContext';

const cats=['All','Breakfast','Lunch','Snacks','Drinks'];

export default function Menu(){
  const [foods,setFoods]=useState([]);
  const [cat,setCat]=useState('All');
  const [error,setError]=useState('');
  const {add}=useCart();
  const showToast=useToast();

  /* Count how many items were added in the last ~1.5s so quick clicks show a
     single aggregated message ("3 items added...") instead of stacking toasts. */
  const addedCount=useRef(0);
  const addedTimer=useRef(null);

  useEffect(()=>{
    foodApi.list().then(r=>setFoods(r.data)).catch(e=>setError(apiError(e)));
  },[]);

  function handleAdd(food){
    add(food);
    addedCount.current+=1;
    clearTimeout(addedTimer.current);
    addedTimer.current=setTimeout(()=>{addedCount.current=0;},1500);
    const message=addedCount.current>1
      ? `${addedCount.current} items added to your cart`
      : `${food.name} added to your cart`;
    showToast(message);
  }

  const shown=foods.filter(f=>cat==='All'||f.category===cat);

  return (
    <>
      <Navbar/>
      <main className="container">
        <div className="hero">
          <div>
            <p className="eyebrow">CAMPUS CANTEEN</p>
            <h1>Good food. <span>Less waiting.</span></h1>
            <p>Choose your meal, pre-order, and track your pickup token.</p>
          </div>
          <div className="hero-icon">🍱</div>
        </div>

        <div className="categories">
          {cats.map(c=>(
            <button className={cat===c?'selected':''} onClick={()=>setCat(c)} key={c}>{c}</button>
          ))}
        </div>

        {error&&<div className="error">{error}</div>}

        <div className="food-grid">
          {shown.map(f=>(
            <article className={`food-card ${!f.available?'disabled':''}`} key={f.id}>
              <div className="food-pic">
                {f.category==='Drinks'?'🥤':f.category==='Breakfast'?'🥞':f.category==='Lunch'?'🍛':'🥪'}
              </div>
              <div className="food-info">
                <span className="tag">{f.category}</span>
                <h3>{f.name}</h3>
                <div className="food-bottom">
                  <b>₹{Number(f.price).toFixed(2)}</b>
                  <button className="primary small" disabled={!f.available} onClick={()=>handleAdd(f)}>
                    {f.available?'Add +':'Unavailable'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}