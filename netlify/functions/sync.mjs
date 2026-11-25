import {snapshot,store,reportKey} from '../../lib/store.mjs';
import {syncLeague,eastern,reportDue} from '../../lib/engine.mjs';
import {buildReport} from '../../lib/report.mjs';
export default async ()=>{
 const now=new Date(),local=eastern(now),s=store();
 try{
  // Avoid unnecessary off-season API polling, but always check Tuesdays at 8 ET.
  const off=+local.month>=2&&+local.month<=8;if(off&&+local.minute>=15&&!reportDue(now))return new Response('Offseason skip');
  const prev=await snapshot(s),p=await s.get('players',{type:'json'});if(p?.players)prev.players=p.players;
  const next=await syncLeague(prev,undefined,now);
  const active=next.active,season=next.seasons[active],final=season.finalWeek??season.completed;
  await s.setJSON('current',next);await s.setJSON('status',{ok:true,checkedAt:now.toISOString(),finalWeek:final,year:active});
  if(reportDue(now)){
   for(const [year,v] of Object.entries(next.seasons)){
    const end=v.finalWeek??v.completed,start=year==='2026'?12:1;
    for(let w=start;w<=end;w++){
     if(!v.weeks[w])continue;const key=reportKey(year,w);if(await s.getMetadata(key))continue;
     // Publish an immutable snapshot before the report. A retry won't overwrite either.
     const backup={active:year,season:v,players:next.players,verifiedAt:next.verifiedAt,reportWeek:w};
     await s.setJSON('backups/'+year+'-week-'+String(w).padStart(2,'0')+'.json',backup,{onlyIfNew:true});
     await s.set(key,buildReport(next,year,w,now),{onlyIfNew:true});console.log(`Published ${year} Week ${w}`);
    }
   }
  }
  return new Response('Synced '+active+' Week '+final);
 }catch(err){console.error('FDL sync/report failed',err);await s.setJSON('status',{ok:false,checkedAt:now.toISOString(),error:String(err.message).slice(0,400)}).catch(()=>{});throw err;}
};
