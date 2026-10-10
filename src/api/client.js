import axios from 'axios';
const api=axios.create({baseURL:'http://localhost:8081'});
export const apiError=(error)=>error?.response?.data?.message||error?.message||'Something went wrong.';
export const foodApi={list:()=>api.get('/api/food'),create:(data)=>api.post('/api/food',data),update:(id,data)=>api.put(`/api/food/${id}`,data),remove:(id)=>api.delete(`/api/food/${id}`)};
export const orderApi={list:()=>api.get('/api/orders'),create:(data)=>api.post('/api/orders',data),status:(id,status)=>api.put(`/api/orders/${id}/status`,{status})};
export default api;
