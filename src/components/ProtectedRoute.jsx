import {Navigate} from 'react-router-dom';
import {currentUser} from '../utils/auth';

export default function ProtectedRoute({children,role}){
    let user=null;
    try{user=currentUser();}catch(err){user=null;}

    if(!user){
        return <Navigate to="/" replace/>;
    }

    if(role && user.role!==role){
        return <Navigate to={user.role==='ADMIN'?'/admin':'/menu'} replace/>;
    }

    return children;
}