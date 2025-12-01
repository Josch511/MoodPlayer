import { upload } from 'pg-upload';
import { connect } from './connect.js';

console.log('Recreating database...');

const db = await connect();

console.log('Dropping tables...');
await db.query('DROP TABLE IF EXISTS playlists');
await db.query('DROP TABLE IF EXISTS tracks');
console.log('All tables dropped.');

console.log('Recreating tables...');

await db.query(`
    CREATE TABLE tracks (
        number           INTEGER,
        track_id         TEXT,
        artists          TEXT,
        album_name       TEXT,
        track_name       TEXT,
        popularity       INTEGER,
        duration_ms      INTEGER,
        explicit         BOOL,
        danceability     DOUBLE PRECISION,
        energy           DOUBLE PRECISION,
        key              INTEGER,
        loudness         DOUBLE PRECISION,
        mode             INTEGER,
        speechiness      DOUBLE PRECISION,
        acousticness     DOUBLE PRECISION,
        instrumentalness DOUBLE PRECISION,
        liveness         DOUBLE PRECISION,
        valence          DOUBLE PRECISION,
        tempo            DOUBLE PRECISION,
        time_signature   INTEGER,
        track_genre      TEXT
    )
`);

await db.query(`
    CREATE TABLE playlists (
        playlist_id   SERIAL,
        playlist_name TEXT
    )
`);

console.log('Tables recreated.');

await upload(db, 'db/tracks.csv', `
    COPY tracks (
        number, track_id, artists, album_name, track_name, popularity, duration_ms, explicit,
        danceability, energy, key, loudness, mode,
        speechiness, acousticness, instrumentalness, liveness,
        valence, tempo, time_signature, track_genre
    ) FROM STDIN WITH CSV HEADER
`);

await upload(db, 'db/playlists.csv', `
    COPY playlists (
        playlist_id, playlist_name
    ) FROM STDIN WITH CSV HEADER
`);

await db.end();
console.log('CSV data uploaded and DB connection closed.');