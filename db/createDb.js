import { upload } from 'pg-upload';
import { connect } from './connect.js';

console.log('Recreating database...');

const db = await connect();

console.log('Dropping tables...');
await db.query('drop table if exists user_interaction');
await db.query('drop table if exists current_play');
await db.query('drop table if exists tracks');
await db.query('drop table if exists playlists');
console.log('All tables dropped.');

console.log('Recreating tables...');

// Erst tracks erstellen (wird von anderen referenziert)
await db.query(`
    create table tracks (
        track_id         integer primary key,
        title            text,
        artist           text,
        genre            text,
        bpm              integer,
        duration         integer,
        album_cover      text,
        release_year     integer       
    );
`);

await db.query(`
    create table playlists (
        playlist_id        integer primary key,
        playlist_name      text    
    );
`);

await db.query(`
    create table user_interaction (
        interaction_id    integer primary key,
        track_id          integer references tracks(track_id),
        like_count        integer,
        dislike_count     integer
    );
`);

await db.query(`
    create table current_play (
        track_id       integer references tracks(track_id),
        is_playing     boolean  
    );
`);

console.log('Tables recreated.');

await upload(db, 'db/tracks.csv',
  'copy tracks (track_id, artists, track_name, popularity, duration_ms, explicit, danceability, energy, key, loudness, mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo, time_signature, track_genre) from stdin with csv header');

await upload(db, 'db/userinteraction.csv',
    'copy userinteraction (interaction_id, track_id, like, dislike) from stdin with csv header');
await db.end();