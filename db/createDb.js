import { upload } from 'pg-upload';
import { connect } from './connect.js';

console.log('Recreating database...');

const db = await connect();

console.log('Dropping tables...');
await db.query('drop table if exists tracks');
console.log('All tables dropped.');

console.log('Recreating tables...');

console.log('Tables recreated.');

console.log('Importing data from CSV files...');

console.log('Database recreated.');

await upload(`
	drop table if exists albums;
	create table mood (
	mood_id              integer,
	mood_name            tekst,
	description          tekst    
	
	);
`);

await db.query(`
    drop table if exists user_interaction;
    create table user_interaction (
        interaction_id    integer,
        track_id      	  integer  references track_id
        like			  integer,
        dislike		      integer
);
`);

await db.query(`
    drop table if exists current_play;
    create table current_play (
        track_id    integer	 references track_id
        is_playing  boolean  
    );
`);


await db.end();