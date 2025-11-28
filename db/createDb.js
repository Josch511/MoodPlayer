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

await db.query(`
	drop table if exists mood;
	create table mood (
        mood_id        integer,
	    mood_name      text,
	    description    text    
	
);
`);

await db.query(`
    drop table if exists user_interaction;
    create table user_interaction (
        interaction_id    integer,
        tracks_id      	  integer  references tracks_id,
        like			  integer,
        dislike		      integer
);
`);

await db.query(`
    drop table if exists current_play;
    create table current_play (
        tracks_id    integer	 references tracks_id,
        is_playing  boolean  
    );
`);

await db.query(`
    drop table if exists tracks;
    create table tracks (
        tracks_id        integer primary key,
        title            text,
        artist           text,
        genre            text,
        bpm              integer,
        duration         integer,
        album_cover      text,
        release_year     integer       
);
`);
await db.end();