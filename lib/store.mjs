import {getStore} from '@netlify/blobs';
import {initial} from './engine.mjs';
export const store=()=>getStore({name:'fdl-hq-v2',consistency:'strong'});
export async function snapshot(s=store()){return await s.get('current',{type:'json'})||initial();}
export function json(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}});}
export const reportKey=(y,w)=>`reports/${y}-week-${String(w).padStart(2,'0')}.html`;
