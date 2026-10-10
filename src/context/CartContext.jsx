import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {currentUser,onSessionChange} from '../utils/auth';

const CartContext=createContext();

/*
 * One cart per logged-in user. Carts are keyed by the email of the current
 * session, so an admin and a student never share items (even if they log in
 * back to back in the same tab). Before login the key is "guest", but the
 * cart pages are only reachable after login anyway.
 */
function owner(){const u=currentUser();return u&&u.email?u.email:'guest';}

export function CartProvider({children}){
  const [carts,setCarts]=useState({});
  const [,bump]=useState(0);

  /* Re-render this provider whenever the session changes (login/logout) so
     the cart re-keys to the right user immediately. */
  useEffect(()=>onSessionChange(()=>bump((n)=>n+1)),[]);

  const items=carts[owner()]||[];

  const add=(food)=>setCarts(prev=>{
    const key=owner();const list=prev[key]||[];const found=list.find(x=>x.id===food.id);
    const next=found?list.map(x=>x.id===food.id?{...x,quantity:x.quantity+1}:x):[...list,{...food,quantity:1}];
    return {...prev,[key]:next};
  });

  const change=(id,quantity)=>setCarts(prev=>{
    const key=owner();
    return {...prev,[key]:(prev[key]||[]).map(x=>x.id===id?{...x,quantity}:x).filter(x=>x.quantity>0)};
  });

  const remove=(id)=>setCarts(prev=>{
    const key=owner();
    return {...prev,[key]:(prev[key]||[]).filter(x=>x.id!==id)};
  });

  const clear=()=>setCarts(prev=>({...prev,[owner()]:[]}));

  const total=useMemo(()=>items.reduce((sum,x)=>sum+Number(x.price)*x.quantity,0),[items]);

  return <CartContext.Provider value={{items,add,change,remove,clear,total}}>{children}</CartContext.Provider>;
}
export const useCart=()=>useContext(CartContext);