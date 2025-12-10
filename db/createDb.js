import { upload } from 'pg-upload';
import { connect } from './connect.js';

console.log('Recreating database...');

const db = await connect();

console.log('Dropping tables...');
await db.query('DROP TABLE IF EXISTS mood_tracks');
await db.query('DROP TABLE IF EXISTS partyPlaylist');
await db.query('DROP TABLE IF EXISTS happyPlaylist');
await db.query('DROP TABLE IF EXISTS sadPlaylist');
await db.query('DROP TABLE IF EXISTS workoutPlaylist');
await db.query('DROP TABLE IF EXISTS chillPlaylist');
console.log('All tables dropped.');

console.log('Recreating tables...');

await db.query(`
    CREATE TABLE mood_tracks (
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
    CREATE TABLE partyPlaylist (
        id          INTEGER,
        artist      TEXT,
        album       TEXT,
        title       TEXT,
        duration    TEXT,
        albumcover  TEXT
    )
`);

await db.query(`
    CREATE TABLE happyPlaylist (
        id          INTEGER,
        artist      TEXT,
        album       TEXT,
        title       TEXT,
        duration    TEXT,
        albumcover  TEXT
    )
`);

await db.query(`
    CREATE TABLE sadPlaylist (
        id          INTEGER,
        artist      TEXT,
        album       TEXT,
        title       TEXT,
        duration    TEXT,
        albumcover  TEXT
    )
`);

await db.query(`
    CREATE TABLE workoutPlaylist (
        id          INTEGER,
        artist      TEXT,
        album       TEXT,
        title       TEXT,
        duration    TEXT,
        albumcover  TEXT
    )
`);

await db.query(`
    CREATE TABLE chillPlaylist (
        id          INTEGER,
        artist      TEXT,
        album       TEXT,
        title       TEXT,
        duration    TEXT,
        albumcover  TEXT
    )
`);

console.log('Tables recreated.');

await upload(db, 'db/tracks.csv', `
    COPY mood_tracks (
        number, track_id, artists, album_name, track_name, popularity, duration_ms, explicit,
        danceability, energy, key, loudness, mode,
        speechiness, acousticness, instrumentalness, liveness,
        valence, tempo, time_signature, track_genre
    ) FROM STDIN WITH CSV HEADER
`);

await db.query('create index track_id_index on mood_tracks (track_id)')

await db.query('delete from mood_tracks m where number > (select min(number) from mood_tracks where track_id = m.track_id)')

await db.query('drop index track_id_index')

await db.query('create unique index track_id_index on mood_tracks (track_id)')

await upload(db, 'db/partyPlaylist.csv', `
    COPY partyPlaylist (
        id, artist, album, title, duration, albumCover
    ) FROM STDIN WITH CSV HEADER
`);

await upload(db, 'db/happyPlaylist.csv', `
    COPY happyPlaylist (
        id, artist, album, title, duration, albumCover
    ) FROM STDIN WITH CSV HEADER
`);

await upload(db, 'db/sadPlaylist.csv', `
    COPY sadPlaylist (
        id, artist, album, title, duration, albumCover
    ) FROM STDIN WITH CSV HEADER
`);

await upload(db, 'db/workoutPlaylist.csv', `
    COPY workoutPlaylist (
        id, artist, album, title, duration, albumCover
    ) FROM STDIN WITH CSV HEADER
`);

await upload(db, 'db/chillPlaylist.csv', `
    COPY chillPlaylist (
        id, artist, album, title, duration, albumCover
    ) FROM STDIN WITH CSV HEADER
`);

await db.end();
console.log('CSV data uploaded and DB connection closed.');