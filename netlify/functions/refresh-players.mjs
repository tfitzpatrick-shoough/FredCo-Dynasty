import {store} from '../../lib/store.mjs';
import {get,compactPlayers} from '../../lib/engine.mjs';
export default async ()=>{const raw=await get('/players/nfl'),players=compactPlayers(raw);if(Object.keys(players).length<10000)throw Error('Incomplete NFL player database');await store().setJSON('players',{players,updatedAt:new Date().toISOString()});return new Response('Updated '+Object.keys(players).length+' players');};
