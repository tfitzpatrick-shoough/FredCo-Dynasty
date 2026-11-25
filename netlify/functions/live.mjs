import {snapshot,json} from '../../lib/store.mjs';
import {getLive} from '../../lib/engine.mjs';
export default async req=>{if(req.method!=='GET')return new Response('Method not allowed',{status:405});try{return json(await getLive(await snapshot()),200,{'Cache-Control':'public, max-age=30, s-maxage=45'});}catch(e){console.error(e);return json({error:'Live scoreboard unavailable'},503);}};
